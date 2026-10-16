import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { setImmediate } from 'node:timers/promises';
import type { Signal } from '@uca/core/types';
import { VisualInspection } from '../index.js';
import { SignalType, type InspectedResult } from '../types.js';
import { restoreFocus } from '../measurement.js';
const emit = (bus: EventTarget, property: string, value: unknown) => bus.dispatchEvent(new CustomEvent(property, { detail: { source: 'review', property, value } }));
function fixture() {
    const { window } = new JSDOM('<main id="root"><input id="question" placeholder="Ask about UCA"><button id="action">Explain UCA</button></main>');
    Object.assign(globalThis, { window, document: window.document, getComputedStyle: window.getComputedStyle, Node: window.Node, HTMLInputElement: window.HTMLInputElement });
    const bus = new EventTarget(), results: InspectedResult[] = [], inspection = new VisualInspection().innervate(bus);
    bus.addEventListener(SignalType.INSPECTED, (event) => results.push((event as CustomEvent<Signal<InspectedResult>>).detail.value));
    emit(bus, inspection.updateEvent, VisualInspection.disposition);
    return { bus, inspection, results };
}
test('Inspection records actual measurements without transmitting live field values', async () => {
    const { bus, inspection, results } = fixture(), element = document.getElementById('question') as HTMLInputElement;
    element.value = 'Private draft'; element.focus(); element.setSelectionRange(2, 5);
    Object.defineProperties(element, { clientWidth: { value: 100 }, scrollWidth: { value: 150 }, getBoundingClientRect: { value: () => ({ x: 0, y: 0, width: 100, height: 40 }) } });
    emit(bus, SignalType.INSPECT, { rootId: 'root', correlationId: 'revision', descriptors: [{ elementId: 'question', areaId: 'root', owner: 'render', field: 'question' }] });
    await setImmediate(); const { snapshot } = results[0]; assert.equal(snapshot.elements[0].rectangle.width, 100);
    assert.equal(snapshot.findings[0].code, 'horizontal-overflow'); assert.equal(snapshot.focus?.start, 2);
    assert.doesNotMatch(JSON.stringify(snapshot), /Private draft/); inspection.denervate();
});
test('Restoration resolves a replaced input by field binding and preserves selection', () => {
    const { inspection } = fixture(), element = document.getElementById('question') as HTMLInputElement;
    element.remove(); const replacement = document.createElement('input'); replacement.id = 'replacement'; replacement.value = 'Keep this question'; document.getElementById('root')!.append(replacement);
    restoreFocus({ elementId: 'question', field: 'question', start: 2, end: 5 }, [{ elementId: 'replacement', areaId: 'root', owner: 'render', field: 'question' }]);
    assert.equal(document.activeElement, replacement); assert.equal(replacement.selectionStart, 2); assert.equal(replacement.value, 'Keep this question'); inspection.denervate();
});
test('An unavailable root emits an inspection error without producing a snapshot', async () => {
    const { bus, inspection, results } = fixture(), errors: Signal[] = [];
    bus.addEventListener(SignalType.ERROR, (event) => errors.push((event as CustomEvent<Signal>).detail));
    emit(bus, SignalType.INSPECT, { rootId: 'missing', correlationId: 'missing', descriptors: [] }); await setImmediate();
    assert.equal(results.length, 0); assert.equal(errors.length, 1); inspection.denervate();
});

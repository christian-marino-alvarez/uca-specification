import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Input } from '../index.js';
import { SignalType } from '../types.js';

function emitSignal(input: Input, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    input.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testInput_Existence(): void {
    const input = new Input('search-input');
    assert.ok(input instanceof Uca);
    assert.strictEqual(document.querySelector('ext-input'), null);
    input.denervate();
}

function testInput_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const body = {
        value: 'Hello',
        placeholder: 'Search...',
        disabled: true,
        readOnly: true,
        fontSize: 16,
        fontFamily: 'sans-serif',
        color: '#333333',
        backgroundColor: '#ffffff',
    };
    const disposition = Capability.createDisposition('Search text input', body);
    const input = new Input().innervate(undefined, disposition);
    emitSignal(input, 'element.rendered', { container });
    const element = container.querySelector('ext-input');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('value'), 'Hello');
    assert.strictEqual(element?.getAttribute('placeholder'), 'Search...');
    assert.strictEqual(element?.getAttribute('disabled'), '');
    assert.strictEqual(element?.getAttribute('readonly'), '');
    assert.strictEqual(element?.getAttribute('data-font-size'), '16');
    assert.strictEqual(element?.getAttribute('data-font-family'), 'sans-serif');
    assert.strictEqual(element?.getAttribute('data-color'), '#333333');
    assert.strictEqual(element?.getAttribute('data-background-color'), '#ffffff');
    input.denervate();
    container.remove();
}

function testInput_UpdateAttributesViaSignal(): void {
    const container = DomHarness.createContainer();
    const input = new Input().innervate();
    emitSignal(input, 'element.rendered', { container, attributes: { value: 'Draft' } });
    const element = container.querySelector('ext-input');
    assert.strictEqual(element?.getAttribute('value'), 'Draft');
    emitSignal(input, 'element.updated', { attributes: { value: 'Committed' } });
    assert.strictEqual(element?.getAttribute('value'), 'Committed');
    input.denervate();
    container.remove();
}

function testInput_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const input = new Input().innervate();
    emitSignal(input, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-input'), null);
    emitSignal(input, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-input'), null);
    input.denervate();
    container.remove();
}

function testInput_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Input with domain properties', {
        value: 'Search text',
        placeholder: 'Find...',
        disabled: true,
        fontSize: 14,
    });
    const input = new Input().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    input.target?.addEventListener('input.created', (event: Event) => {
        captured.push({ property: 'input.created', value: (event as CustomEvent).detail?.value });
    });
    input.target?.addEventListener('input.updated', (event: Event) => {
        captured.push({ property: 'input.updated', value: (event as CustomEvent).detail?.value });
    });
    input.target?.addEventListener('input.removed', (event: Event) => {
        captured.push({ property: 'input.removed', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(input, 'element.rendered', { container });
    emitSignal(input, 'element.updated', {});
    emitSignal(input, 'element.removed', {});
    assert.strictEqual(captured.length, 3);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, disposition.aim.body);
    input.denervate();
    container.remove();
}

function testInput_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Input with domain properties', {
        value: 'Submitted query',
    });
    const input = new Input().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    input.target?.addEventListener('input.created', (event: Event) => {
        captured.push({ property: 'input.created', value: (event as CustomEvent).detail?.value });
    });
    emitSignal(input, 'input.create', { container });
    const element = container.querySelector('ext-input');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('value'), 'Submitted query');
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, { value: 'Submitted query' });
    emitSignal(input, 'input.remove', {});
    assert.strictEqual(container.querySelector('ext-input'), null);
    input.denervate();
    container.remove();
}

function testInput_ReactsToComponentEvent(): void {
    const disposition = Capability.createDisposition('Input event reaction', {
        value: 'initial',
        placeholder: 'Type here',
    });
    const input = new Input('input-event-test').innervate(undefined, disposition);
    let capturedChange: unknown = undefined;
    input.target?.addEventListener(SignalType.CHANGED, (event: Event) => {
        capturedChange = (event as CustomEvent).detail?.value;
    });
    emitSignal(input, 'component.event', { id: 'input-event-test', event: 'input', value: 'hello world' });
    assert.deepStrictEqual(capturedChange, {
        value: 'hello world',
        placeholder: 'Type here',
    });
    input.denervate();
}

function runAllInputTests(): void {
    testInput_Existence();
    testInput_RenderMaterializesCustomElementWithOptions();
    testInput_UpdateAttributesViaSignal();
    testInput_RemoveDestroysFromDom();
    testInput_PulsesDomainSignalsPassingProperties();
    testInput_ReactsToDomainRequestSignals();
    testInput_ReactsToComponentEvent();
    console.log('✔ All Input UCA minimal architecture tests passed successfully.');
}

runAllInputTests();

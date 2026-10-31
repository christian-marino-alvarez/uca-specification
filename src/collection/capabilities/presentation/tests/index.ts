import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Choice } from '@uca/choice';
import { SignalType as ChoiceSignalType } from '@uca/choice/types';
import { Toggle } from '@uca/toggle';
import { SignalType as ToggleSignalType } from '@uca/toggle/types';
import { Range } from '@uca/range';
import { SignalType as RangeSignalType } from '@uca/range/types';
import { Progress } from '@uca/progress';
import { SignalType as ProgressSignalType } from '@uca/progress/types';
import { Paragraph } from '@uca/paragraph';
import { SignalType as ParagraphSignalType } from '@uca/paragraph/types';
import { Capability } from '@uca/core/capability';
import { preparePrimitiveDom, emit, dispose } from '../../../../../tests/shared/primitive.js';

function change(element: Element): void {
    element.dispatchEvent(new window.Event('change', {
        bubbles: true,
    }));
}

test('choice emits the selected domain value with its original area context', () => {
    preparePrimitiveDom();
    const bus = new EventTarget();
    const choice = new Choice().innervate(bus);
    const changed: unknown[] = [];
    bus.addEventListener(ChoiceSignalType.CHANGED, (event) => changed.push(Capability.readPayload(event)));
    emit(bus, choice.updateEvent, Choice.disposition);
    emit(bus, ChoiceSignalType.RENDER, {
        parentId: 'app',
        value: 'a',
        items: [
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
        ],
        context: { areaId: 'area-a' },
    });
    const element = document.getElementById(choice.id) as HTMLSelectElement;
    element.value = 'b';
    change(element);
    assert.equal(changed.length, 1);
    assert.equal((changed[0] as { value: string }).value, 'b');
    assert.deepEqual((changed[0] as { context: unknown }).context, { areaId: 'area-a' });
    assert.equal(choice.disposition.aim.body?.value, undefined);
    dispose(choice);
});

test('toggle emits a boolean and updates can clear checked and disabled', () => {
    preparePrimitiveDom();
    const bus = new EventTarget();
    const toggle = new Toggle().innervate(bus);
    const changed: unknown[] = [];
    bus.addEventListener(ToggleSignalType.CHANGED, (event) => changed.push(Capability.readPayload(event)));
    emit(bus, toggle.updateEvent, Toggle.disposition);
    emit(bus, ToggleSignalType.RENDER, { parentId: 'app', value: true, disabled: true });
    emit(bus, ToggleSignalType.UPDATE, { value: false, disabled: false });
    const element = document.getElementById(toggle.id) as HTMLInputElement;
    assert.equal(element.checked, false);
    assert.equal(element.disabled, false);
    element.checked = true;
    change(element);
    assert.equal((changed[0] as { value: boolean }).value, true);
    dispose(toggle);
});

test('bounds are evaluated in the domain without replacing the last valid representation', () => {
    preparePrimitiveDom();
    const bus = new EventTarget();
    const range = new Range().innervate(bus);
    const progress = new Progress().innervate(bus);
    const errors: unknown[] = [];
    bus.addEventListener(RangeSignalType.ERROR, (event) => errors.push(Capability.readPayload(event)));
    bus.addEventListener(ProgressSignalType.ERROR, (event) => errors.push(Capability.readPayload(event)));
    emit(bus, range.updateEvent, Range.disposition);
    emit(bus, progress.updateEvent, Progress.disposition);
    emit(bus, RangeSignalType.RENDER, { parentId: 'app', minimum: 0, maximum: 10, value: 5 });
    emit(bus, RangeSignalType.UPDATE, { minimum: 12, maximum: 10, value: 5 });
    emit(bus, ProgressSignalType.RENDER, { parentId: 'app', total: 10, value: 11 });
    assert.equal(errors.length, 2);
    assert.equal((document.getElementById(range.id) as HTMLInputElement).value, '5');
    assert.equal(document.getElementById(progress.id), null);
    dispose(range);
    dispose(progress);
});

test('paragraph treats text as text, not executable HTML', () => {
    preparePrimitiveDom();
    const bus = new EventTarget();
    const paragraph = new Paragraph().innervate(bus);
    emit(bus, paragraph.updateEvent, Paragraph.disposition);
    emit(bus, ParagraphSignalType.RENDER, { parentId: 'app', text: '<strong>Literal</strong>' });
    const element = document.getElementById(paragraph.id);
    assert.equal(element?.textContent, '<strong>Literal</strong>');
    assert.equal(element?.querySelector('strong'), null);
    dispose(paragraph);
});

test('one primitive can render multiple identities without retaining the previous body', async () => {
    const { Heading } = await import('@uca/heading');
    const { SignalType } = await import('@uca/heading/types');
    preparePrimitiveDom();
    const bus = new EventTarget();
    const heading = new Heading().innervate(bus);
    emit(bus, heading.updateEvent, Heading.disposition);
    emit(bus, SignalType.RENDER, { elementId: 'first', parentId: 'app', text: 'First', importance: 3 });
    emit(bus, SignalType.RENDER, { elementId: 'second', parentId: 'app', text: 'Second' });
    assert.equal(document.getElementById('first')?.localName, 'h3');
    assert.equal(document.getElementById('second')?.localName, 'h1');
    assert.equal(heading.disposition.aim.body?.text, undefined);
    dispose(heading);
});

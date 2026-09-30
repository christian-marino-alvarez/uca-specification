import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Choice } from '../index.js';
import { SignalType } from '../types.js';

function emitSignal(choice: Choice, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    choice.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testChoice_Existence(): void {
    const choice = new Choice('tag-selector');
    assert.ok(choice instanceof Uca);
    assert.strictEqual(document.querySelector('ext-choice'), null);
    assert.strictEqual(choice.purpose, 'Select one or more options from a defined set of alternatives');
    choice.denervate();
}

function testChoice_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Category selection', {
        options: ['tech', 'design', 'business'],
        selected: ['tech', 'design'],
        multiple: true,
        title: 'Select categories',
        disabled: false,
    });
    const choice = new Choice().innervate(undefined, disposition);
    emitSignal(choice, 'element.rendered', { container });
    const element = container.querySelector('ext-choice');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.hasAttribute('multiple'), true);
    assert.strictEqual(element?.getAttribute('data-selected'), JSON.stringify(['tech', 'design']));
    assert.strictEqual(element?.getAttribute('title'), 'Select categories');
    assert.strictEqual(element?.hasAttribute('disabled'), false);
    choice.denervate();
    container.remove();
}

function testChoice_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const choice = new Choice().innervate();
    emitSignal(choice, 'element.rendered', { container, attributes: { title: 'v1' } });
    const element = container.querySelector('ext-choice');
    assert.strictEqual(element?.getAttribute('title'), 'v1');
    emitSignal(choice, 'element.updated', { attributes: { title: 'v2' } });
    assert.strictEqual(element?.getAttribute('title'), 'v2');
    choice.denervate();
    container.remove();
}

function testChoice_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const choice = new Choice().innervate();
    emitSignal(choice, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-choice'), null);
    emitSignal(choice, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-choice'), null);
    choice.denervate();
    container.remove();
}

function testChoice_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Domain choice test', {
        options: ['red', 'green', 'blue'],
        selected: ['red'],
        multiple: true,
        title: 'Color picker',
        disabled: false,
    });
    const choice = new Choice().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    choice.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    choice.target?.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent).detail?.value });
    });
    choice.target?.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent).detail?.value });
    });
    choice.target?.addEventListener(SignalType.SELECTED, (event: Event) => {
        captured.push({ property: SignalType.SELECTED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(choice, 'element.rendered', { container });
    emitSignal(choice, 'element.updated', {});
    emitSignal(choice, SignalType.SELECT, { selected: ['red', 'green'] });
    emitSignal(choice, 'element.removed', {});
    assert.strictEqual(captured.length, 4);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, { ...disposition.aim.body, selected: ['red', 'green'] });
    assert.deepStrictEqual(captured[3].value, disposition.aim.body);
    choice.denervate();
    container.remove();
}

function testChoice_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Size selector', {
        options: ['S', 'M', 'L'],
        selected: ['M'],
        multiple: false,
    });
    const choice = new Choice().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    choice.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(choice, SignalType.CREATE, { container });
    const element = container.querySelector('ext-choice');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.getAttribute('data-selected'), JSON.stringify(['M']));
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    emitSignal(choice, SignalType.REMOVE, {});
    assert.strictEqual(container.querySelector('ext-choice'), null);
    choice.denervate();
    container.remove();
}

function runAllChoiceTests(): void {
    testChoice_Existence();
    testChoice_RenderMaterializesCustomElementWithOptions();
    testChoice_UpdateViaSignal();
    testChoice_RemoveDestroysFromDom();
    testChoice_PulsesDomainSignalsPassingProperties();
    testChoice_ReactsToDomainRequestSignals();
    console.log('✔ All Choice UCA minimal architecture tests passed successfully.');
}

runAllChoiceTests();

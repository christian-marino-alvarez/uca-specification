import { DomHarness } from '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { Action } from '../index.js';
import { SignalType } from '../types.js';

function emitSignal(action: Action, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    action.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testAction_Existence(): void {
    const action = new Action('submit-action');
    assert.ok(action instanceof Uca);
    assert.strictEqual(document.querySelector('ext-action'), null);
    assert.strictEqual(action.purpose, 'Represent an invokable action triggered by a user interaction');
    action.denervate();
}

function testAction_RenderMaterializesCustomElementWithOptions(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Action triggering', {
        label: 'Submit Order',
        title: 'Complete and submit checkout',
        disabled: true,
    });
    const action = new Action().innervate(undefined, disposition);
    emitSignal(action, 'element.rendered', { container });
    const element = container.querySelector('ext-action');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.textContent, 'Submit Order');
    assert.strictEqual(element?.getAttribute('title'), 'Complete and submit checkout');
    assert.strictEqual(element?.getAttribute('disabled'), '');
    action.denervate();
    container.remove();
}

function testAction_UpdateViaSignal(): void {
    const container = DomHarness.createContainer();
    const action = new Action().innervate();
    emitSignal(action, 'element.rendered', { container, text: 'Initial' });
    const element = container.querySelector('ext-action');
    assert.strictEqual(element?.textContent, 'Initial');
    emitSignal(action, 'element.updated', { text: 'Updated Action' });
    assert.strictEqual(element?.textContent, 'Updated Action');
    action.denervate();
    container.remove();
}

function testAction_RemoveDestroysFromDom(): void {
    const container = DomHarness.createContainer();
    const action = new Action().innervate();
    emitSignal(action, 'element.rendered', { container });
    assert.notStrictEqual(container.querySelector('ext-action'), null);
    emitSignal(action, 'element.removed', {});
    assert.strictEqual(container.querySelector('ext-action'), null);
    action.denervate();
    container.remove();
}

function testAction_PulsesDomainSignalsPassingProperties(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Domain action test', {
        label: 'Open Modal',
        title: 'Open preview modal',
        disabled: false,
    });
    const action = new Action().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    action.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    action.target?.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent).detail?.value });
    });
    action.target?.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent).detail?.value });
    });
    action.target?.addEventListener(SignalType.TRIGGERED, (event: Event) => {
        captured.push({ property: SignalType.TRIGGERED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(action, 'element.rendered', { container });
    emitSignal(action, 'element.updated', {});
    emitSignal(action, SignalType.TRIGGER, {});
    emitSignal(action, 'element.removed', {});
    assert.strictEqual(captured.length, 4);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    assert.deepStrictEqual(captured[1].value, disposition.aim.body);
    assert.deepStrictEqual(captured[2].value, disposition.aim.body);
    assert.deepStrictEqual(captured[3].value, disposition.aim.body);
    action.denervate();
    container.remove();
}

function testAction_ReactsToDomainRequestSignals(): void {
    const container = DomHarness.createContainer();
    const disposition = Capability.createDisposition('Save draft action', {
        label: 'Save Draft',
        title: 'Save current state',
    });
    const action = new Action().innervate(undefined, disposition);
    const captured: { property: string; value: unknown }[] = [];
    action.target?.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent).detail?.value });
    });
    emitSignal(action, SignalType.CREATE, { container });
    const element = container.querySelector('ext-action');
    assert.notStrictEqual(element, null);
    assert.strictEqual(element?.textContent, 'Save Draft');
    assert.strictEqual(captured.length, 1);
    assert.deepStrictEqual(captured[0].value, disposition.aim.body);
    emitSignal(action, SignalType.REMOVE, {});
    assert.strictEqual(container.querySelector('ext-action'), null);
    action.denervate();
    container.remove();
}

function testAction_ReactsToComponentEventClick(): void {
    const disposition = Capability.createDisposition('Action click test', {
        label: 'Click Me',
    });
    const action = new Action('action-click-test').innervate(undefined, disposition);
    let capturedPayload: unknown = undefined;
    action.target?.addEventListener(SignalType.TRIGGERED, (event: Event) => {
        capturedPayload = (event as CustomEvent).detail?.value;
    });
    emitSignal(action, 'component.event', { id: 'action-click-test', event: 'click', detail: { key: 'value' } });
    assert.deepStrictEqual(capturedPayload, { label: 'Click Me', detail: { key: 'value' } });
    action.denervate();
}

function runAllActionTests(): void {
    testAction_Existence();
    testAction_RenderMaterializesCustomElementWithOptions();
    testAction_UpdateViaSignal();
    testAction_RemoveDestroysFromDom();
    testAction_PulsesDomainSignalsPassingProperties();
    testAction_ReactsToDomainRequestSignals();
    testAction_ReactsToComponentEventClick();
    console.log('✔ All Action UCA minimal architecture tests passed successfully.');
}

runAllActionTests();

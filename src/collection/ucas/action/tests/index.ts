import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Action } from '../index.js';
import { type EventContext, SignalType } from '../types.js';
import { __ID__ } from '../constants.js';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="container"></div></body></html>');
globalThis.document = dom.window.document as unknown as Document;
globalThis.customElements = dom.window.customElements;
globalThis.HTMLElement = dom.window.HTMLElement as unknown as typeof HTMLElement;
globalThis.HTMLStyleElement = dom.window.HTMLStyleElement as unknown as typeof HTMLStyleElement;
globalThis.AbortController = dom.window.AbortController;
globalThis.AbortSignal = dom.window.AbortSignal;

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testAction_IdentityAndDefaults(): void {
    const action = new Action();
    assert.strictEqual(action.id, __ID__);
    assert.strictEqual(action.purpose, Action.purpose);
    assert.ok(action instanceof Uca);
    assert.strictEqual(Action.disposition.inputs?.length, 3);
    assert.strictEqual(Action.disposition.outputs?.length, 5);
}

function testAction_CapabilitiesCompositionInCooky(): void {
    class TestableAction extends Action {
        public exposeCapabilities(): ReturnType<Action['catalog']> {
            return this.catalog();
        }
    }
    const action = new TestableAction('test-action');
    const capabilities = action.exposeCapabilities();
    assert.strictEqual(capabilities.length, 2);
}

function testAction_RenderAndTriggerClick(): void {
    const bus = new EventTarget();
    let createdReceived = false;
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.CREATED, () => { createdReceived = true; });
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const action = new Action('btn-save').innervate(bus);
    emitSignal(bus, Capability.updateEvent('btn-save'), Action.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        label: 'Save Changes',
        action: 'save-form',
        type: 'submit',
        qualities: { surface: 'brand', radius: 'medium', spacing: 'small' },
    });

    assert.ok(createdReceived);
    const element = document.getElementById('btn-save') as HTMLButtonElement | null;
    assert.ok(element !== null);
    assert.strictEqual(element.tagName.toLowerCase(), 'button');
    assert.strictEqual(element.textContent, 'Save Changes');
    assert.strictEqual(element.getAttribute('type'), 'submit');
    assert.strictEqual(element.getAttribute('data-action'), 'save-form');

    element.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent.elementId, 'btn-save');
    assert.strictEqual(capturedEvent.action, 'save-form');
    assert.strictEqual(capturedEvent.event, 'click');

    action.denervate();
    element.remove();
    document.getElementById('uca-style-btn-save')?.remove();
}

function testAction_UpdateAndRemove(): void {
    const bus = new EventTarget();
    let updatedReceived = false;
    let removedReceived = false;

    bus.addEventListener(SignalType.UPDATED, () => { updatedReceived = true; });
    bus.addEventListener(SignalType.REMOVED, () => { removedReceived = true; });

    const action = new Action('btn-dyn').innervate(bus);
    emitSignal(bus, Capability.updateEvent('btn-dyn'), Action.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        label: 'Initial',
    });

    emitSignal(bus, SignalType.UPDATE, {
        label: 'Updated Label',
        action: 'updated-action',
        disabled: true,
        qualities: { surface: 'accent' },
    });

    assert.ok(updatedReceived);
    const element = document.getElementById('btn-dyn');
    assert.strictEqual(element?.textContent, 'Updated Label');
    assert.strictEqual(element?.getAttribute('data-action'), 'updated-action');
    assert.strictEqual(element?.getAttribute('disabled'), 'disabled');

    emitSignal(bus, SignalType.REMOVE, {});
    assert.ok(removedReceived);
    assert.strictEqual(document.getElementById('btn-dyn'), null);
    assert.strictEqual(document.getElementById('uca-style-btn-dyn'), null);

    action.denervate();
}

function runTests(): void {
    console.log('🧪 Testing autonomous Action UCA...');
    testAction_IdentityAndDefaults();
    testAction_CapabilitiesCompositionInCooky();
    testAction_RenderAndTriggerClick();
    testAction_UpdateAndRemove();
    console.log('✅ All Action UCA tests passed successfully!');
}

runTests();

import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Input } from '../index.js';
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

function testInput_IdentityAndDefaults(): void {
    const input = new Input();
    assert.strictEqual(input.id, __ID__);
    assert.strictEqual(input.purpose, Input.purpose);
    assert.ok(input instanceof Uca);
    assert.strictEqual(Input.disposition.inputs?.length, 3);
    assert.strictEqual(Input.disposition.outputs?.length, 5);
}

function testInput_CapabilitiesCompositionInCooky(): void {
    class TestableInput extends Input {
        public exposeCapabilities(): ReturnType<Input['catalog']> {
            return this.catalog();
        }
    }
    const input = new TestableInput('test-input');
    const capabilities = input.exposeCapabilities();
    assert.strictEqual(capabilities.length, 2);
}

function testInput_RenderAndTypeText(): void {
    const bus = new EventTarget();
    let createdReceived = false;
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.CREATED, () => { createdReceived = true; });
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const input = new Input('username-input').innervate(bus);
    emitSignal(bus, Capability.updateEvent('username-input'), Input.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        name: 'username',
        placeholder: 'Enter username',
        value: 'initial',
        action: 'type-username',
        required: true,
        qualities: { width: 'full', shape: 'small', spacing: 'small' },
    });

    assert.ok(createdReceived);
    const element = document.getElementById('username-input') as HTMLInputElement | null;
    assert.ok(element !== null);
    assert.strictEqual(element.tagName.toLowerCase(), 'input');
    assert.strictEqual(element.getAttribute('type'), 'text');
    assert.strictEqual(element.getAttribute('name'), 'username');
    assert.strictEqual(element.getAttribute('placeholder'), 'Enter username');
    assert.strictEqual(element.getAttribute('data-action'), 'type-username');
    assert.strictEqual(element.value, 'initial');

    element.value = 'milos';
    element.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent.elementId, 'username-input');
    assert.strictEqual(capturedEvent.action, 'type-username');
    assert.strictEqual(capturedEvent.value, 'milos');
    assert.strictEqual(capturedEvent.event, 'input');

    input.denervate();
    element.remove();
    document.getElementById('uca-style-username-input')?.remove();
}

function testInput_UpdateAndRemove(): void {
    const bus = new EventTarget();
    let updatedReceived = false;
    let removedReceived = false;

    bus.addEventListener(SignalType.UPDATED, () => { updatedReceived = true; });
    bus.addEventListener(SignalType.REMOVED, () => { removedReceived = true; });

    const input = new Input('inp-dyn').innervate(bus);
    emitSignal(bus, Capability.updateEvent('inp-dyn'), Input.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        placeholder: 'Initial',
    });

    emitSignal(bus, SignalType.UPDATE, {
        value: 'updated-val',
        placeholder: 'Updated Placeholder',
        disabled: true,
        readonly: true,
    });

    assert.ok(updatedReceived);
    const element = document.getElementById('inp-dyn') as HTMLInputElement | null;
    assert.ok(element !== null);
    assert.strictEqual(element.getAttribute('value'), 'updated-val');
    assert.strictEqual(element.getAttribute('placeholder'), 'Updated Placeholder');
    assert.strictEqual(element.getAttribute('disabled'), 'disabled');
    assert.strictEqual(element.getAttribute('readonly'), 'readonly');

    emitSignal(bus, SignalType.REMOVE, {});
    assert.ok(removedReceived);
    assert.strictEqual(document.getElementById('inp-dyn'), null);

    input.denervate();
}

function runTests(): void {
    console.log('🧪 Testing autonomous Input UCA...');
    testInput_IdentityAndDefaults();
    testInput_CapabilitiesCompositionInCooky();
    testInput_RenderAndTypeText();
    testInput_UpdateAndRemove();
    console.log('✅ All Input UCA tests passed successfully!');
}

runTests();

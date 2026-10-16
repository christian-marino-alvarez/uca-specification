import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Collection } from '../index.js';
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

function testCollection_IdentityAndDefaults(): void {
    const collection = new Collection();
    assert.strictEqual(collection.id, __ID__);
    assert.strictEqual(collection.purpose, Collection.purpose);
    assert.ok(collection instanceof Uca);
    assert.strictEqual(Collection.disposition.inputs?.length, 3);
    assert.strictEqual(Collection.disposition.outputs?.length, 5);
}

function testCollection_CapabilitiesCompositionInCooky(): void {
    class TestableCollection extends Collection {
        public exposeCapabilities(): ReturnType<Collection['catalog']> {
            return this.catalog();
        }
    }
    const collection = new TestableCollection('test-collection');
    const capabilities = collection.exposeCapabilities();
    assert.strictEqual(capabilities.length, 2);
}

function testCollection_RenderAndSubmit(): void {
    const bus = new EventTarget();
    let createdReceived = false;
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.CREATED, () => { createdReceived = true; });
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const collection = new Collection('checkout-form').innervate(bus);
    emitSignal(bus, Capability.updateEvent('checkout-form'), Collection.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        name: 'checkout',
        action: 'submit-checkout',
        method: 'post',
        novalidate: true,
        content: '<input id="field-email" name="email" value="user@example.com" />',
        qualities: { direction: 'column', gap: 'medium', surface: 'card' },
    });

    assert.ok(createdReceived);
    const element = document.getElementById('checkout-form') as HTMLFormElement | null;
    assert.ok(element !== null);
    assert.strictEqual(element.tagName.toLowerCase(), 'form');
    assert.strictEqual(element.getAttribute('name'), 'checkout');
    assert.strictEqual(element.getAttribute('data-action'), 'submit-checkout');
    assert.strictEqual(element.getAttribute('method'), 'post');
    assert.strictEqual(element.getAttribute('novalidate'), 'novalidate');

    element.dispatchEvent(new dom.window.Event('submit', { bubbles: true }));
    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent.elementId, 'checkout-form');
    assert.strictEqual(capturedEvent.action, 'submit-checkout');
    assert.strictEqual(capturedEvent.event, 'submit');

    collection.denervate();
    element.remove();
    document.getElementById('uca-style-checkout-form')?.remove();
}

function testCollection_UpdateAndRemove(): void {
    const bus = new EventTarget();
    let updatedReceived = false;
    let removedReceived = false;

    bus.addEventListener(SignalType.UPDATED, () => { updatedReceived = true; });
    bus.addEventListener(SignalType.REMOVED, () => { removedReceived = true; });

    const collection = new Collection('form-dyn').innervate(bus);
    emitSignal(bus, Capability.updateEvent('form-dyn'), Collection.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        name: 'initial-form',
    });

    emitSignal(bus, SignalType.UPDATE, {
        name: 'updated-form',
        autocomplete: 'off',
        content: '<p>Updated fields</p>',
        qualities: { spacing: 'large' },
    });

    assert.ok(updatedReceived);
    const element = document.getElementById('form-dyn');
    assert.strictEqual(element?.getAttribute('name'), 'updated-form');
    assert.strictEqual(element?.getAttribute('autocomplete'), 'off');
    assert.strictEqual(element?.innerHTML, '<p>Updated fields</p>');

    emitSignal(bus, SignalType.REMOVE, {});
    assert.ok(removedReceived);
    assert.strictEqual(document.getElementById('form-dyn'), null);
    assert.strictEqual(document.getElementById('uca-style-form-dyn'), null);

    collection.denervate();
}

function runTests(): void {
    console.log('🧪 Testing autonomous Collection UCA...');
    testCollection_IdentityAndDefaults();
    testCollection_CapabilitiesCompositionInCooky();
    testCollection_RenderAndSubmit();
    testCollection_UpdateAndRemove();
    console.log('✅ All Collection UCA tests passed successfully!');
}

runTests();

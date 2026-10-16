import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Options } from '../index.js';
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

function testOptions_IdentityAndDefaults(): void {
    const options = new Options();
    assert.strictEqual(options.id, __ID__);
    assert.strictEqual(options.purpose, Options.purpose);
    assert.ok(options instanceof Uca);
    assert.strictEqual(Options.disposition.inputs?.length, 3);
    assert.strictEqual(Options.disposition.outputs?.length, 5);
}

function testOptions_CapabilitiesCompositionInCooky(): void {
    class TestableOptions extends Options {
        public exposeCapabilities(): ReturnType<Options['catalog']> {
            return this.catalog();
        }
    }
    const options = new TestableOptions('test-options');
    const capabilities = options.exposeCapabilities();
    assert.strictEqual(capabilities.length, 2);
}

function testOptions_RenderAndSelectRadio(): void {
    const bus = new EventTarget();
    let createdReceived = false;
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.CREATED, () => { createdReceived = true; });
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const options = new Options('plan-options').innervate(bus);
    emitSignal(bus, Capability.updateEvent('plan-options'), Options.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        name: 'plan',
        legend: 'Choose Plan',
        value: 'basic',
        action: 'select-plan',
        items: [
            { value: 'basic', label: 'Basic Plan' },
            { value: 'pro', label: 'Pro Plan' },
        ],
        qualities: { direction: 'column', gap: 'small' },
    });

    assert.ok(createdReceived);
    const fieldset = document.getElementById('plan-options') as HTMLFieldSetElement | null;
    assert.ok(fieldset !== null);
    assert.strictEqual(fieldset.tagName.toLowerCase(), 'fieldset');
    assert.strictEqual(fieldset.querySelector('legend')?.textContent, 'Choose Plan');

    const basicRadio = document.getElementById('plan-options-basic') as HTMLInputElement | null;
    const proRadio = document.getElementById('plan-options-pro') as HTMLInputElement | null;
    assert.ok(basicRadio !== null);
    assert.ok(proRadio !== null);
    assert.strictEqual(basicRadio.checked, true);
    assert.strictEqual(proRadio.checked, false);

    proRadio.checked = true;
    proRadio.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent.elementId, 'plan-options-pro');
    assert.strictEqual(capturedEvent.action, 'select-plan');
    assert.strictEqual(capturedEvent.value, 'pro');
    assert.strictEqual(capturedEvent.checked, true);

    options.denervate();
    fieldset.remove();
    document.getElementById('uca-style-plan-options')?.remove();
}

function testOptions_UpdateAndRemove(): void {
    const bus = new EventTarget();
    let updatedReceived = false;
    let removedReceived = false;

    bus.addEventListener(SignalType.UPDATED, () => { updatedReceived = true; });
    bus.addEventListener(SignalType.REMOVED, () => { removedReceived = true; });

    const options = new Options('opt-dyn').innervate(bus);
    emitSignal(bus, Capability.updateEvent('opt-dyn'), Options.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        items: [{ value: 'a', label: 'Option A' }],
    });

    emitSignal(bus, SignalType.UPDATE, {
        value: 'b',
        items: [
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
        ],
        disabled: true,
    });

    assert.ok(updatedReceived);
    const radioB = document.getElementById('opt-dyn-b') as HTMLInputElement | null;
    assert.ok(radioB !== null);
    assert.strictEqual(radioB.checked, true);
    assert.strictEqual(document.getElementById('opt-dyn')?.getAttribute('disabled'), 'disabled');

    emitSignal(bus, SignalType.REMOVE, {});
    assert.ok(removedReceived);
    assert.strictEqual(document.getElementById('opt-dyn'), null);

    options.denervate();
}

function runTests(): void {
    console.log('🧪 Testing autonomous Options UCA...');
    testOptions_IdentityAndDefaults();
    testOptions_CapabilitiesCompositionInCooky();
    testOptions_RenderAndSelectRadio();
    testOptions_UpdateAndRemove();
    console.log('✅ All Options UCA tests passed successfully!');
}

runTests();

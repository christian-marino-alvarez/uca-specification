import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Dropdown } from '../index.js';
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

function testDropdown_IdentityAndDefaults(): void {
    const dropdown = new Dropdown();
    assert.strictEqual(dropdown.id, __ID__);
    assert.strictEqual(dropdown.purpose, Dropdown.purpose);
    assert.ok(dropdown instanceof Uca);
    assert.strictEqual(Dropdown.disposition.inputs?.length, 3);
    assert.strictEqual(Dropdown.disposition.outputs?.length, 5);
}

function testDropdown_CapabilitiesCompositionInCooky(): void {
    class TestableDropdown extends Dropdown {
        public exposeCapabilities(): ReturnType<Dropdown['catalog']> {
            return this.catalog();
        }
    }
    const dropdown = new TestableDropdown('test-dropdown');
    const capabilities = dropdown.exposeCapabilities();
    assert.strictEqual(capabilities.length, 2);
}

function testDropdown_RenderAndChangeSelection(): void {
    const bus = new EventTarget();
    let createdReceived = false;
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.CREATED, () => { createdReceived = true; });
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const dropdown = new Dropdown('country-select').innervate(bus);
    emitSignal(bus, Capability.updateEvent('country-select'), Dropdown.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        name: 'country',
        placeholder: 'Select Country',
        value: 'es',
        action: 'change-country',
        required: true,
        items: [
            { value: 'es', label: 'Spain' },
            { value: 'us', label: 'United States' },
        ],
        qualities: { width: 'full', radius: 'medium' },
    });

    assert.ok(createdReceived);
    const select = document.getElementById('country-select') as HTMLSelectElement | null;
    assert.ok(select !== null);
    assert.strictEqual(select.tagName.toLowerCase(), 'select');
    assert.strictEqual(select.getAttribute('name'), 'country');
    assert.strictEqual(select.getAttribute('data-action'), 'change-country');
    assert.strictEqual(select.options.length, 3);
    assert.strictEqual(select.value, 'es');

    select.value = 'us';
    select.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent.elementId, 'country-select');
    assert.strictEqual(capturedEvent.action, 'change-country');
    assert.strictEqual(capturedEvent.value, 'us');

    dropdown.denervate();
    select.remove();
    document.getElementById('uca-style-country-select')?.remove();
}

function testDropdown_UpdateAndRemove(): void {
    const bus = new EventTarget();
    let updatedReceived = false;
    let removedReceived = false;

    bus.addEventListener(SignalType.UPDATED, () => { updatedReceived = true; });
    bus.addEventListener(SignalType.REMOVED, () => { removedReceived = true; });

    const dropdown = new Dropdown('dd-dyn').innervate(bus);
    emitSignal(bus, Capability.updateEvent('dd-dyn'), Dropdown.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        items: [{ value: '1', label: 'One' }],
    });

    emitSignal(bus, SignalType.UPDATE, {
        value: '2',
        items: [
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
        ],
        disabled: true,
    });

    assert.ok(updatedReceived);
    const select = document.getElementById('dd-dyn') as HTMLSelectElement | null;
    assert.ok(select !== null);
    assert.strictEqual(select.value, '2');
    assert.strictEqual(select.getAttribute('disabled'), 'disabled');

    emitSignal(bus, SignalType.REMOVE, {});
    assert.ok(removedReceived);
    assert.strictEqual(document.getElementById('dd-dyn'), null);

    dropdown.denervate();
}

function runTests(): void {
    console.log('🧪 Testing autonomous Dropdown UCA...');
    testDropdown_IdentityAndDefaults();
    testDropdown_CapabilitiesCompositionInCooky();
    testDropdown_RenderAndChangeSelection();
    testDropdown_UpdateAndRemove();
    console.log('✅ All Dropdown UCA tests passed successfully!');
}

runTests();

import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Capability } from '@uca/core/capability';
import { Box } from '../index.js';
import { type EventContext, SignalType } from '../types.js';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { __ID__ } from '../constants.js';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="container"></div></body></html>');
globalThis.document = dom.window.document as unknown as Document;
globalThis.customElements = dom.window.customElements;
globalThis.HTMLElement = dom.window.HTMLElement as unknown as typeof HTMLElement;
globalThis.HTMLStyleElement = dom.window.HTMLStyleElement as unknown as typeof HTMLStyleElement;
globalThis.AbortController = dom.window.AbortController;
globalThis.AbortSignal = dom.window.AbortSignal;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testBox_IdentityAndDefaults(): void {
    const box = new Box();
    assert.strictEqual(box.id, __ID__);
    assert.strictEqual(box.purpose, Box.purpose);
    assert.ok(box instanceof Uca);
    assert.strictEqual(Box.disposition.inputs?.length, 3);
    assert.strictEqual(Box.disposition.outputs?.length, 5);
}

function testBox_CapabilitiesCompositionInCooky(): void {
    class TestableBox extends Box {
        public exposeCapabilities(): ReturnType<Box['catalog']> {
            return this.catalog();
        }
    }
    const box = new TestableBox('test-box');
    const capabilities = box.exposeCapabilities();
    assert.strictEqual(capabilities.length, 2);
}

function testBox_RenderAndMountWithStyles(): void {
    const bus = new EventTarget();
    let createdReceived = false;

    bus.addEventListener(SignalType.CREATED, () => {
        createdReceived = true;
    });

    const box = new Box('my-card').innervate(bus);
    emitSignal(bus, Capability.updateEvent('my-card'), Box.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        content: '<p>Card Content</p>',
        qualities: { width: 'third', spacing: 'medium', surface: 'card' },
    });

    assert.ok(createdReceived);
    const element = document.getElementById('my-card');
    assert.ok(element !== null);
    assert.strictEqual(element?.innerHTML, '<p>Card Content</p>');

    const styleElement = document.getElementById('uca-style-my-card');
    assert.ok(styleElement !== null);
    assert.ok(styleElement?.textContent?.includes('width: 33.333%;'));
    assert.ok(styleElement?.textContent?.includes('padding: 1rem;'));

    box.denervate();
    element?.remove();
    styleElement?.remove();
}

function testBox_UpdateAndRemove(): void {
    const bus = new EventTarget();
    let updatedReceived = false;
    let removedReceived = false;
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.UPDATED, () => { updatedReceived = true; });
    bus.addEventListener(SignalType.REMOVED, () => { removedReceived = true; });
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const box = new Box('box-dynamic').innervate(bus);
    emitSignal(bus, Capability.updateEvent('box-dynamic'), Box.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        content: 'Initial',
        qualities: { spacing: 'small' },
    });

    emitSignal(bus, SignalType.UPDATE, {
        content: '<button id="btn-dyn" data-action="action-dyn">Dynamic</button>',
        qualities: { spacing: 'large' },
        events: ['click'],
    });

    assert.ok(updatedReceived);
    assert.strictEqual(document.getElementById('box-dynamic')?.innerHTML, '<button id="btn-dyn" data-action="action-dyn">Dynamic</button>');
    assert.ok(document.getElementById('uca-style-box-dynamic')?.textContent?.includes('padding: 2rem;'));

    const button = document.getElementById('btn-dyn');
    button?.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent?.action, 'action-dyn');

    emitSignal(bus, SignalType.REMOVE, {});
    assert.ok(removedReceived);
    assert.strictEqual(document.getElementById('box-dynamic'), null);
    assert.strictEqual(document.getElementById('uca-style-box-dynamic'), null);

    box.denervate();
}

function testBox_EventBridgeAndDelegation(): void {
    const bus = new EventTarget();
    let capturedEvent: EventContext | undefined;

    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const box = new Box('box-events').innervate(bus);
    emitSignal(bus, Capability.updateEvent('box-events'), Box.disposition);
    emitSignal(bus, SignalType.RENDER, {
        containerElement: '#container',
        content: '<button id="card-btn" data-action="submit-order">Buy</button>',
        events: ['click'],
    });

    const button = document.getElementById('card-btn');
    button?.dispatchEvent(new dom.window.Event('click', { bubbles: true }));

    assert.ok(capturedEvent !== undefined);
    assert.strictEqual(capturedEvent?.elementId, 'card-btn');
    assert.strictEqual(capturedEvent?.action, 'submit-order');
    assert.strictEqual(capturedEvent?.event, 'click');

    box.denervate();
    document.getElementById('box-events')?.remove();
    document.getElementById('uca-style-box-events')?.remove();
}

function testBox_SingleUcaManagingNBoxes(): void {
    const bus = new EventTarget();
    let capturedEvent: EventContext | undefined;
    bus.addEventListener(SignalType.EVENT, (event: Event) => {
        capturedEvent = (event as CustomEvent<Signal>).detail?.value as EventContext;
    });

    const box = new Box('box-orchestrator').innervate(bus);
    emitSignal(bus, Capability.updateEvent('box-orchestrator'), Box.disposition);
    emitSignal(bus, SignalType.RENDER, {
        elementId: 'box-header',
        containerElement: '#container',
        content: '<h1>Header</h1>',
        qualities: { surface: 'card' },
    });
    emitSignal(bus, SignalType.RENDER, {
        elementId: 'box-sidebar',
        containerElement: '#container',
        content: '<button id="btn-side" data-action="toggle">Toggle</button>',
        events: ['click'],
        qualities: { width: 'third' },
    });
    emitSignal(bus, SignalType.RENDER, {
        elementId: 'box-footer',
        containerElement: '#container',
        content: '<p>Footer</p>',
        qualities: { spacing: 'small' },
    });

    assert.ok(document.getElementById('box-header') !== null);
    assert.ok(document.getElementById('box-sidebar') !== null);
    assert.ok(document.getElementById('box-footer') !== null);
    assert.ok(document.getElementById('uca-style-box-header') !== null);
    assert.ok(document.getElementById('uca-style-box-sidebar') !== null);
    assert.ok(document.getElementById('uca-style-box-footer') !== null);

    const button = document.getElementById('btn-side');
    button?.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
    assert.strictEqual(capturedEvent?.elementId, 'btn-side');
    assert.strictEqual(capturedEvent?.action, 'toggle');

    emitSignal(bus, SignalType.UPDATE, {
        elementId: 'box-footer',
        content: '<p>Updated Footer</p>',
    });
    assert.strictEqual(document.getElementById('box-footer')?.innerHTML, '<p>Updated Footer</p>');

    emitSignal(bus, SignalType.REMOVE, { elementId: 'box-header' });
    assert.strictEqual(document.getElementById('box-header'), null);
    assert.strictEqual(document.getElementById('uca-style-box-header'), null);
    assert.ok(document.getElementById('box-sidebar') !== null);
    assert.ok(document.getElementById('box-footer') !== null);

    box.denervate();
    document.getElementById('box-sidebar')?.remove();
    document.getElementById('box-footer')?.remove();
    document.getElementById('uca-style-box-sidebar')?.remove();
    document.getElementById('uca-style-box-footer')?.remove();
}

function testBox_ParentToNesting(): void {
    const bus = new EventTarget();
    const box = new Box('box-nesting').innervate(bus);
    emitSignal(bus, Capability.updateEvent('box-nesting'), Box.disposition);

    emitSignal(bus, SignalType.RENDER, {
        elementId: 'parent-box',
        containerElement: '#container',
        qualities: { surface: 'card' },
    });

    emitSignal(bus, SignalType.RENDER, {
        elementId: 'child-box',
        parentTo: 'parent-box',
        content: '<span>Nested Child</span>',
    });

    const parent = document.getElementById('parent-box');
    const child = document.getElementById('child-box');
    assert.ok(parent !== null);
    assert.ok(child !== null);
    assert.strictEqual(parent?.contains(child), true);

    box.denervate();
    parent?.remove();
    document.getElementById('uca-style-parent-box')?.remove();
    document.getElementById('uca-style-child-box')?.remove();
}

function testBox_IgnoresForeignComponentSignals(): void {
    const bus = new EventTarget();
    const created: unknown[] = [];
    bus.addEventListener(SignalType.CREATED, (event: Event) => { created.push(event); });
    const box = new Box('box-owner').innervate(bus);
    emitSignal(bus, Capability.updateEvent('box-owner'), Box.disposition);
    const foreignSignal: Signal = { source: 'input:web-component', property: WebComponentSignalType.RENDERED, value: { elementId: 'prompt-input' }, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(WebComponentSignalType.RENDERED, { detail: foreignSignal }));
    assert.strictEqual(created.length, 0);
    box.denervate();
}

function runTests(): void {
    console.log('🧪 Testing autonomous Box UCA...');
    testBox_IdentityAndDefaults();
    testBox_CapabilitiesCompositionInCooky();
    testBox_RenderAndMountWithStyles();
    testBox_UpdateAndRemove();
    testBox_EventBridgeAndDelegation();
    testBox_SingleUcaManagingNBoxes();
    testBox_ParentToNesting();
    testBox_IgnoresForeignComponentSignals();
    console.log('✅ All Box UCA tests passed successfully!');
}

runTests();

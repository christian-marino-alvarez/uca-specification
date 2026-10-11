import * as assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Builder } from '../index.js';
import { SignalType } from '../types.js';
import { __ID__ } from '../constants.js';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>');
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

function testBuilder_IdentityAndDefaults(): void {
    const builder = new Builder();
    assert.strictEqual(builder.id, __ID__);
    assert.strictEqual(builder.purpose, Builder.purpose);
    assert.ok(builder instanceof Uca);
    assert.strictEqual(Builder.disposition.inputs?.length, 5);
    assert.strictEqual(Builder.disposition.outputs?.length, 5);
}

function testBuilder_CapabilitiesInCooky(): void {
    class TestableBuilder extends Builder {
        public exposeCapabilities(): ReturnType<Builder['capabilities']> {
            return this.capabilities();
        }
    }
    const builder = new TestableBuilder('test-builder');
    const capabilities = builder.exposeCapabilities();
    assert.strictEqual(capabilities.length, 1);
}

function testBuilder_BuildAndRenderBox(): void {
    const bus = new EventTarget();
    let builtReceived = false;
    let createdReceived = false;

    bus.addEventListener(SignalType.BUILT, () => { builtReceived = true; });
    bus.addEventListener(SignalType.CREATED, () => { createdReceived = true; });

    const builder = new Builder('my-builder').innervate(bus);
    emitSignal(bus, SignalType.BUILD, {
        elementId: 'nav-boundary',
        parentTo: 'app',
        dimensions: { width: 'third', height: 'full' },
        qualities: { spacing: 'medium', surface: 'card' },
        content: '<nav>Links</nav>',
    });

    assert.ok(builtReceived);
    assert.ok(createdReceived);
    const element = document.getElementById('nav-boundary');
    assert.ok(element !== null);
    assert.strictEqual(element?.innerHTML, '<nav>Links</nav>');

    const styleElement = document.getElementById('uca-style-nav-boundary');
    assert.ok(styleElement !== null);
    assert.ok(styleElement?.textContent?.includes('width: 33.333%;'));

    builder.denervate();
    element?.remove();
    styleElement?.remove();
}

async function testBuilder_EvolutionaryStreamReconciliation(): Promise<void> {
    const bus = new EventTarget();
    const builder = new Builder('evo-builder').innervate(bus);

    const stream1 = new ReadableStream({
        start(controller) {
            controller.enqueue({
                'search-panel': {
                    elementId: 'search-panel',
                    parentTo: 'app',
                    dimensions: { width: 'full', height: 'auto' },
                    content: '<input id="search-input" value="persisted-value" />',
                },
            });
            controller.close();
        },
    });
    emitSignal(bus, SignalType.STREAM, { stream: stream1 });
    await new Promise((resolve) => setTimeout(resolve, 20));

    const inputBefore = document.getElementById('search-input') as HTMLInputElement;
    assert.ok(inputBefore !== null);
    assert.strictEqual(inputBefore.value, 'persisted-value');

    const stream2 = new ReadableStream({
        start(controller) {
            controller.enqueue({
                'search-panel': {
                    elementId: 'search-panel',
                    parentTo: 'app',
                    dimensions: { width: 'half', height: 'auto' },
                },
            });
            controller.enqueue({
                'results-panel': {
                    elementId: 'results-panel',
                    parentTo: 'app',
                    dimensions: { width: 'half', height: 'auto' },
                    content: '<div>Results</div>',
                },
            });
            controller.close();
        },
    });
    emitSignal(bus, SignalType.STREAM, { stream: stream2 });
    await new Promise((resolve) => setTimeout(resolve, 20));

    const inputAfter = document.getElementById('search-input') as HTMLInputElement;
    assert.ok(inputAfter !== null, 'Existing interactive element must persist without reconstruction');
    assert.strictEqual(inputAfter.value, 'persisted-value');

    const results = document.getElementById('results-panel');
    assert.ok(results !== null, 'New element must be incorporated');

    emitSignal(bus, SignalType.RESET, { parentTo: 'app' });
    const host = document.getElementById('app');
    assert.strictEqual(host?.innerHTML, '', 'Deliberate reset must clear host');

    builder.denervate();
}

function testBuilder_UpdateAndRemove(): void {
    const bus = new EventTarget();
    let updatedReceived = false;
    let removedReceived = false;

    bus.addEventListener(SignalType.UPDATED, () => { updatedReceived = true; });
    bus.addEventListener(SignalType.REMOVED, () => { removedReceived = true; });

    const builder = new Builder('layout-builder').innervate(bus);
    emitSignal(bus, SignalType.BUILD, { elementId: 'content-area', parentTo: 'app', content: 'Initial' });
    emitSignal(bus, SignalType.UPDATE, { elementId: 'content-area', content: 'Updated' });
    assert.ok(updatedReceived);

    const element = document.getElementById('content-area');
    assert.strictEqual(element?.innerHTML, 'Updated');

    emitSignal(bus, SignalType.REMOVE, { elementId: 'content-area' });
    assert.ok(removedReceived);

    builder.denervate();
    element?.remove();
}

function testBuilder_ContentSanitization(): void {
    const bus = new EventTarget();
    const builder = new Builder('safe-builder').innervate(bus);
    emitSignal(bus, SignalType.BUILD, {
        elementId: 'safe-panel',
        parentTo: 'app',
        content: '<script>alert("xss")</script><p>Safe content</p>',
    });
    const element = document.getElementById('safe-panel');
    assert.ok(element !== null);
    assert.ok(!element?.innerHTML.includes('<script>'));
    assert.ok(element?.innerHTML.includes('Safe content'));
    builder.denervate();
    element?.remove();
}

async function testBuilder_StreamErrorHandling(): Promise<void> {
    const bus = new EventTarget();
    let errorReceived: string | undefined;
    bus.addEventListener(SignalType.ERROR, (event) => {
        const { detail: { value } } = event as CustomEvent<Signal<{ error: string }>>;
        errorReceived = value?.error;
    });
    const builder = new Builder('err-builder').innervate(bus);
    const brokenStream = new ReadableStream({
        start(controller) {
            controller.error(new Error('Network pipe broke'));
        },
    });
    emitSignal(bus, SignalType.STREAM, { stream: brokenStream, correlationId: 'req-err' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.ok(errorReceived?.includes('Network pipe broke'));
    builder.denervate();
}

async function run(): Promise<void> {
    testBuilder_IdentityAndDefaults();
    testBuilder_CapabilitiesInCooky();
    testBuilder_BuildAndRenderBox();
    await testBuilder_EvolutionaryStreamReconciliation();
    testBuilder_ContentSanitization();
    await testBuilder_StreamErrorHandling();
    testBuilder_UpdateAndRemove();
    console.log('✅ All Builder UCA tests passed successfully!');
}

run();

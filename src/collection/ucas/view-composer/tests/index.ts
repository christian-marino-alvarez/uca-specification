import * as assert from 'node:assert';
import { setMaxListeners } from 'node:events';
import { z } from 'zod';
import { Uca } from '@uca/core/uca';
import { DispositionSignal, type Disposition, type Signal } from '@uca/core/types';
import { SignalType as LlmWebSignalType, type StreamPayload } from '@uca/llm-web';
import { SignalType as GraphSignalType, type UcaItem } from '@uca/capability-graph';
import {
    ViewComposer,
    DataType,
    SignalType,
    type ComposedResult,
    type UcaDetectedPayload,
    __ID__,
    PURPOSE,
} from '../index.js';

function createTestBus(): EventTarget {
    const bus = new EventTarget();
    try { setMaxListeners(100, bus); } catch {}
    return bus;
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testViewComposer_IdentityAndDefaults(): void {
    const composer = new ViewComposer();
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, PURPOSE);
    composer.innervate();
    const { inputs, outputs } = composer.disposition;
    assert.strictEqual(inputs?.length, 2);
    assert.strictEqual(inputs?.[0]?.type, DataType.COMPOSE_PAYLOAD);
    assert.strictEqual(inputs?.[1]?.type, DataType.UCA_SCHEMA_DEFINITION);
    assert.strictEqual(outputs?.length, 3);
    assert.strictEqual(outputs?.[0]?.type, DataType.COMPOSED_RESULT);
    assert.strictEqual(outputs?.[1]?.type, DataType.UCA_ITEM);
    assert.strictEqual(outputs?.[2]?.type, DataType.UNKNOWN);
    composer.denervate();
}

function testViewComposer_ComposePulsesLlmStream(): void {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);
    class BoxUca extends Uca {
        public static override purpose = 'Visual container';
        public static override disposition = { aim: { description: 'Visual container' } };
    }
    const box = new BoxUca('box:header').innervate(bus);
    let capturedStreamPayload: StreamPayload | undefined;

    bus.addEventListener(LlmWebSignalType.STREAM, (event: Event) => {
        capturedStreamPayload = (event as CustomEvent<Signal<StreamPayload>>).detail.value;
    });

    emitSignal(bus, SignalType.COMPOSE, { request: 'Generate dashboard with header and list' });
    assert.ok(capturedStreamPayload);
    assert.ok(capturedStreamPayload?.prompt.includes('Generate dashboard with header and list'));
    assert.ok(capturedStreamPayload?.prompt.includes('Available UCAs Catalog'));
    assert.ok(capturedStreamPayload?.prompt.includes('OUTPUT JSON SCHEMA'));
    assert.ok(!capturedStreamPayload?.prompt.includes('box.update'));
    box.denervate();
    composer.denervate();
}

function testViewComposer_DynamicUcaRegistration(): void {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);
    const sliderSchema = z.object({ title: z.string(), min: z.number().optional() });
    composer.registerUca({ name: 'Slider', prefix: 'slider', description: 'Range slider', bodySchema: sliderSchema, emittedSignals: ['change'] });
    let capturedPrompt = '';
    bus.addEventListener(LlmWebSignalType.STREAM, (event: Event) => {
        capturedPrompt = (event as CustomEvent<Signal<StreamPayload>>).detail.value.prompt;
    });
    emitSignal(bus, SignalType.COMPOSE, { request: 'Add slider control' });
    assert.ok(capturedPrompt.includes('Slider (prefix "slider:<id>"): Range slider'));
    assert.ok(capturedPrompt.includes('title?: string'));
    assert.ok(capturedPrompt.includes('Emits outcomes: "slider:<id>.change"'));
    composer.denervate();
}

function testViewComposer_DynamicRegistrationViaSignal(): void {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);
    const gaugeSchema = z.object({ value: z.number() });
    emitSignal(bus, SignalType.REGISTER, { name: 'Gauge', prefix: 'gauge', description: 'Radial meter', bodySchema: gaugeSchema, emittedSignals: ['read'] });
    let capturedPrompt = '';
    bus.addEventListener(LlmWebSignalType.STREAM, (event: Event) => {
        capturedPrompt = (event as CustomEvent<Signal<StreamPayload>>).detail.value.prompt;
    });
    emitSignal(bus, SignalType.COMPOSE, { request: 'Add radial gauge' });
    assert.ok(capturedPrompt.includes('Gauge (prefix "gauge:<id>"): Radial meter'));
    assert.ok(capturedPrompt.includes('Emits outcomes: "gauge:<id>.read"'));
    composer.denervate();
}

async function testViewComposer_DirectUcas_PropagatesDispositionsAndComposesView(): Promise<void> {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);
    const updates: Array<{ id: string; disposition: Disposition }> = [];
    let capturedComposed: ComposedResult | undefined;

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        updates.push((event as CustomEvent<Signal<{ id: string; disposition: Disposition }>>).detail.value);
    });

    bus.addEventListener(SignalType.COMPOSED, (event: Event) => {
        capturedComposed = (event as CustomEvent<Signal<ComposedResult>>).detail.value;
    });

    const mockUcas: Record<string, Disposition> = {
        'search-input': {
            aim: { description: 'Search bar' },
            reactTo: [],
            outputs: [{ signal: 'search-input.query', type: 'string' }],
        },
        'result-list': {
            aim: { description: 'Results list' },
            reactTo: ['search-input.query'],
            inputs: [{ signal: 'search-input.query', type: 'string' }],
        },
    };

    emitSignal(bus, SignalType.COMPOSE, { ucas: mockUcas });
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.strictEqual(updates.length, 2);
    assert.strictEqual(updates[0]?.id, 'search-input');
    assert.strictEqual(updates[1]?.id, 'result-list');

    assert.ok(capturedComposed);
    const { ucas } = capturedComposed!;
    assert.ok(ucas['search-input']);
    assert.ok(ucas['result-list']);

    composer.denervate();
}

function testViewComposer_LlmErrorPulsesError(): void {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);
    let capturedError: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        capturedError = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, LlmWebSignalType.ERROR, { message: 'Provider timeout' });
    assert.deepStrictEqual(capturedError, { message: 'Provider timeout' });
    composer.denervate();
}

async function testViewComposer_ConsumesUcaStreamAndEmitsNervousPulses(): Promise<void> {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);
    const capturedUcas: string[] = [];
    const nervousUpdates: string[] = [];

    bus.addEventListener(SignalType.UCA_DETECTED, (event: Event) => {
        const payload = (event as CustomEvent<Signal<UcaDetectedPayload>>).detail.value;
        capturedUcas.push(payload.id);
    });

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        const payload = (event as CustomEvent<Signal<{ id: string }>>).detail.value;
        nervousUpdates.push(payload.id);
    });

    const stream = new ReadableStream<UcaItem>({
        start(controller) {
            controller.enqueue({
                id: 'box:stream-hero',
                disposition: { aim: { description: 'Hero', body: { text: 'Hello' } }, reactTo: [] },
            });
            controller.enqueue({
                id: 'action:stream-btn',
                disposition: { aim: { description: 'Button', body: { label: 'Click' } }, reactTo: [] },
            });
            controller.close();
        },
    });

    emitSignal(bus, GraphSignalType.UCA_STREAM, { stream, streamId: 'test-session' });
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.strictEqual(capturedUcas.length, 2);
    assert.strictEqual(capturedUcas[0], 'box:stream-hero');
    assert.strictEqual(capturedUcas[1], 'action:stream-btn');
    assert.ok(nervousUpdates.includes('box:stream-hero'));
    assert.ok(nervousUpdates.includes('action:stream-btn'));

    composer.denervate();
}

function testViewComposer_PulsesDispositionGetAndCompilesCatalogFromProvidedUcas(): void {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);

    class CardUca extends Uca {
        public static override purpose = 'Card UI component';
        public static override disposition = {
            aim: { description: 'Card UI component', body: { title: 'Default Title' } },
            outputs: [{ signal: 'clicked', type: 'void' }],
        };
    }
    const card = new CardUca('card:profile').innervate(bus);

    let capturedStreamPayload: StreamPayload | undefined;
    bus.addEventListener(LlmWebSignalType.STREAM, (event: Event) => {
        capturedStreamPayload = (event as CustomEvent<Signal<StreamPayload>>).detail.value;
    });

    emitSignal(bus, SignalType.COMPOSE, { request: 'Render user card' });

    assert.ok(capturedStreamPayload);
    assert.ok(capturedStreamPayload?.prompt.includes('Available UCAs Catalog (Dynamic Schemas)'));
    assert.ok(capturedStreamPayload?.prompt.includes('Card UI component'));
    assert.ok(capturedStreamPayload?.prompt.includes('card:<id>.clicked'));

    card.denervate();
    composer.denervate();
}

async function testViewComposer_HierarchicalParentTo_ComposesHierarchyAndMounts(): Promise<void> {
    const bus = createTestBus();
    const composer = new ViewComposer('test-composer').innervate(bus);
    let capturedComposed: ComposedResult | undefined;

    bus.addEventListener(SignalType.COMPOSED, (event: Event) => {
        capturedComposed = (event as CustomEvent<Signal<ComposedResult>>).detail.value;
    });

    const mockUcas: Record<string, Disposition> = {
        'box:hero': {
            aim: { description: 'Hero section' },
            reactTo: [],
        },
        'picture:logo': {
            aim: { description: 'Brand logo' },
            reactTo: [],
            parentTo: { uca: 'box:hero', relation: 'brand visual' },
        },
    };

    emitSignal(bus, SignalType.COMPOSE, { ucas: mockUcas });
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.ok(capturedComposed);
    const { ucas } = capturedComposed!;
    assert.strictEqual(Object.keys(ucas).length, 2);
    assert.strictEqual(ucas['picture:logo']?.parentTo?.uca, 'box:hero');
    assert.strictEqual(ucas['picture:logo']?.parentTo?.relation, 'brand visual');

    composer.denervate();
}

async function runAllViewComposerTests(): Promise<void> {
    testViewComposer_IdentityAndDefaults();
    testViewComposer_ComposePulsesLlmStream();
    testViewComposer_DynamicUcaRegistration();
    testViewComposer_DynamicRegistrationViaSignal();
    testViewComposer_PulsesDispositionGetAndCompilesCatalogFromProvidedUcas();
    await testViewComposer_DirectUcas_PropagatesDispositionsAndComposesView();
    await testViewComposer_HierarchicalParentTo_ComposesHierarchyAndMounts();
    testViewComposer_LlmErrorPulsesError();
    await testViewComposer_ConsumesUcaStreamAndEmitsNervousPulses();
    console.log('✔ All ViewComposer UCA minimal architecture tests passed successfully.');
}

runAllViewComposerTests();

import assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType, type InferPayload, type Body as LlmBody } from '@uca/llm/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    SignalType as TransformerSignalType,
    type TransformPayload,
} from '@uca/capability-stream-transformer/types';
import { Memory } from '@uca/memory';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { Decision } from '@uca/capability-decision';
import { SignalType as DecisionSignalType, type DecidePayload } from '@uca/capability-decision/types';
import type { Signal } from '@uca/core/types';
import { Composer } from '../index.js';
import { __ID__, DEFAULT_CATALOG, DEFAULT_CONTEXT, DEFAULT_MODEL, DEFAULT_PROVIDER, DEFAULT_REQUEST, adaptLayoutMeasures } from '../constants.js';
import { bodySchema } from '../schema.js';
import { type ComposerMemoryState, SignalType } from '../types.js';

class TestableComposer extends Composer {
    public exposeCatalog(): ReturnType<Composer['catalog']> {
        return this.catalog();
    }
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const detail = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail }));
}

function testComposer_Identity(): void {
    const composer = new Composer();
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, Composer.purpose);
    assert.ok(composer instanceof Uca);
}

function testComposer_Disposition(): void {
    const { aim, inputs, outputs } = Composer.disposition;
    const { body } = aim;
    assert.strictEqual(body?.request, DEFAULT_REQUEST);
    assert.strictEqual(body?.context, DEFAULT_CONTEXT);
    assert.deepStrictEqual(body?.catalog, [...DEFAULT_CATALOG]);
    assert.strictEqual(inputs?.[0].signal, SignalType.COMPOSE);
    assert.strictEqual(outputs?.[0].signal, SignalType.COMPOSED);
}

function testComposer_SchemaValidation(): void {
    const valid = {
        request: 'Build navbar',
        context: 'Web',
        catalog: ['Box'],
        layout: {
            'main-header': {
                purpose: 'Header navigation',
                context: 'Top bar',
                parentTo: 'app',
                dimensions: { width: 'full', height: 'auto' },
                style: { surface: 'card', spacing: 'medium' },
            },
        },
    };
    const parsed = bodySchema.parse(valid);
    assert.strictEqual(parsed.request, 'Build navbar');
    assert.ok(parsed.layout?.['main-header']);
    assert.strictEqual(parsed.layout?.['main-header']?.parentTo, 'app');
}

function testComposer_CapabilitiesInCooky(): void {
    const composer = new TestableComposer('custom-composer');
    const catalog = composer.exposeCatalog();
    assert.strictEqual(catalog.length, 4);
    const [LlmClass, llmDisposition] = catalog[0];
    const { aim: llmAim } = llmDisposition;
    const { model, provider } = (llmAim.body ?? {}) as LlmBody;
    assert.strictEqual(LlmClass, Llm);
    assert.strictEqual(model, DEFAULT_MODEL);
    assert.strictEqual(provider, DEFAULT_PROVIDER);
    assert.strictEqual(catalog[1][0], StreamTransformer);
    assert.strictEqual(catalog[2][0], Memory);
    assert.strictEqual(catalog[3][0], Decision);
}

function testComposer_TriggersLlmStreamOnCompose(): void {
    const bus = new EventTarget();
    let streamReceived: InferPayload | undefined;
    bus.addEventListener(LlmSignalType.STREAM, (event) => {
        const { detail } = event as CustomEvent<Signal<InferPayload>>;
        streamReceived = detail?.value;
    });
    const composer = new Composer('my-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    emitSignal(bus, SignalType.COMPOSE, { request: 'Center button and text' });
    assert.ok(streamReceived);
    assert.strictEqual(streamReceived.model, DEFAULT_MODEL);
    assert.ok(streamReceived.expectations);
    assert.ok(streamReceived.request.includes('Center button and text'));
    composer.denervate();
}

function testComposer_StreamsThroughTransformer(): void {
    const bus = new EventTarget();
    let transformPayload: TransformPayload | undefined;
    bus.addEventListener(TransformerSignalType.TRANSFORM, (event) => {
        const { detail } = event as CustomEvent<Signal<TransformPayload>>;
        transformPayload = detail?.value;
    });
    const composer = new Composer('stream-test-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    emitSignal(bus, SignalType.COMPOSE, { request: 'Hero section' });
    assert.ok(transformPayload);
    assert.ok(transformPayload.stream instanceof ReadableStream);
    assert.strictEqual(transformPayload.correlationId, 'stream-test-composer::app');
    composer.denervate();
}

function testComposer_EmitsComposedOnLlmResult(): void {
    const bus = new EventTarget();
    let composedPayload: unknown;
    bus.addEventListener(SignalType.COMPOSED, (event) => {
        const { detail } = event as CustomEvent<Signal<{ layout: unknown }>>;
        composedPayload = detail?.value?.layout;
    });
    const composer = new Composer('layout-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    emitSignal(bus, LlmSignalType.INFERRED, { data: { root: 'Box', children: [] } });
    assert.deepStrictEqual(composedPayload, { root: 'Box', children: [] });
    composer.denervate();
}

function testComposer_StreamChunksDoNotPolluteBus(): void {
    const bus = new EventTarget();
    const chunks: string[] = [];
    let streamEndEmitted = false;
    bus.addEventListener(SignalType.CHUNK, (event) => {
        const { detail } = event as CustomEvent<Signal<{ text: string }>>;
        if (detail?.value?.text) { chunks.push(detail.value.text); }
    });
    bus.addEventListener(SignalType.STREAM_END, () => {
        streamEndEmitted = true;
    });
    const composer = new Composer('stream-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    emitSignal(bus, LlmSignalType.CHUNK, { text: '{"box":' });
    emitSignal(bus, LlmSignalType.STREAM_END, {});
    assert.strictEqual(chunks.length, 0);
    assert.strictEqual(streamEndEmitted, false);
    composer.denervate();
}

function testComposer_SingleLlmRelaysEachProviderChunk(): void {
    const bus = new EventTarget();
    const composer = new Composer('dedup-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    let relayedChunks = 0;
    bus.addEventListener(LlmSignalType.CHUNK, () => { relayedChunks += 1; });
    emitSignal(bus, GeminiSignalType.CHUNK, { text: '{', correlationId: 'dedup-composer' });
    assert.strictEqual(relayedChunks, 1);
    composer.denervate();
}

async function testComposer_ConcurrentStreamsAreIsolated(): Promise<void> {
    const bus = new EventTarget();
    const streams = new Map<string, ReadableStream<string>>();
    bus.addEventListener(TransformerSignalType.TRANSFORM, (event) => {
        const { correlationId = '', stream } = (event as CustomEvent<Signal<TransformPayload>>).detail.value;
        streams.set(correlationId, stream as ReadableStream<string>);
        event.stopImmediatePropagation();
    });
    bus.addEventListener(LlmSignalType.STREAM, (event) => { event.stopImmediatePropagation(); });
    const composer = new Composer('iso-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    emitSignal(bus, SignalType.COMPOSE, { request: 'root' });
    emitSignal(bus, SignalType.COMPOSE, { request: 'child', parentTo: 'card', depth: 1 });
    emitSignal(bus, LlmSignalType.CHUNK, { text: 'ROOT', correlationId: 'iso-composer::app' });
    emitSignal(bus, LlmSignalType.CHUNK, { text: 'CARD', correlationId: 'iso-composer::card' });
    emitSignal(bus, LlmSignalType.STREAM_END, { correlationId: 'iso-composer::app' });
    emitSignal(bus, LlmSignalType.CHUNK, { text: '-MORE', correlationId: 'iso-composer::card' });
    emitSignal(bus, LlmSignalType.STREAM_END, { correlationId: 'iso-composer::card' });
    const read = async (key: string): Promise<string> => {
        const reader = (streams.get(key) ?? new ReadableStream<string>()).getReader();
        const parts: string[] = [];
        for (let result = await reader.read(); !result.done; result = await reader.read()) { parts.push(result.value); }
        return parts.join('');
    };
    assert.strictEqual(await read('iso-composer::app'), 'ROOT');
    assert.strictEqual(await read('iso-composer::card'), 'CARD-MORE');
    composer.denervate();
}

function seedComposerMemory(bus: EventTarget, composerId: string): void {
    const media = { minWidth: 1024, maxWidth: 4096, orientation: 'landscape-primary' };
    const mediaKey = 'app:1024-4096:landscape-primary';
    const layout = { mainArea: { purpose: 'Main', context: 'Web', parentTo: 'app', kind: 'container' as const, dimensions: { width: 'half' as const, height: 'full' as const }, style: { direction: 'row' as const }, media } };
    const state: ComposerMemoryState = { request: 'Build hero', context: DEFAULT_CONTEXT, activeMediaKey: mediaKey, activeLayout: layout, medias: { [mediaKey]: { media, layout } } };
    emitSignal(bus, MemorySignalType.SAVE, { id: `${composerId}:memory`, key: 'app', value: state });
}

function testComposer_MemoryKeepWithinMediaRange(): void {
    const bus = new EventTarget();
    let llmCalls = 0;
    let decisionCalls = 0;
    bus.addEventListener(LlmSignalType.STREAM, (event) => { llmCalls += 1; event.stopImmediatePropagation(); });
    bus.addEventListener(DecisionSignalType.DECIDE, (event) => { decisionCalls += 1; event.stopImmediatePropagation(); });
    const composer = new Composer('keep-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    seedComposerMemory(bus, 'keep-composer');
    emitSignal(bus, SignalType.COMPOSE, { request: 'Build hero', limits: { width: 1280, height: 800, orientation: 'landscape-primary' } });
    assert.strictEqual(llmCalls, 0);
    assert.strictEqual(decisionCalls, 0);
    composer.denervate();
}

function testComposer_JevAdaptsWhenOutOfRangeAndDecisionFalse(): void {
    const bus = new EventTarget();
    let llmCalls = 0;
    let decideCorrelationId = '';
    let builtWidth = '';
    bus.addEventListener(LlmSignalType.STREAM, (event) => { llmCalls += 1; event.stopImmediatePropagation(); });
    bus.addEventListener(DecisionSignalType.DECIDE, (event) => {
        decideCorrelationId = (event as CustomEvent<Signal<DecidePayload>>).detail.value?.correlationId ?? '';
        event.stopImmediatePropagation();
    });
    bus.addEventListener(SignalType.CHUNK, (event) => {
        const { dimensions } = (event as CustomEvent<Signal<{ dimensions?: { width?: string } }>>).detail.value ?? {};
        builtWidth = dimensions?.width ?? '';
    });
    const composer = new Composer('jev-adapt-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    seedComposerMemory(bus, 'jev-adapt-composer');
    emitSignal(bus, SignalType.COMPOSE, { request: 'Build hero', limits: { width: 390, height: 844, orientation: 'portrait-primary' } });
    assert.ok(decideCorrelationId.startsWith('jev-adapt-composer::jev::'));
    emitSignal(bus, DecisionSignalType.DECIDED, { decision: false, raw: { recompose: 'no', 'width:mainArea': 'full', 'direction:mainArea': 'column' }, correlationId: decideCorrelationId });
    assert.strictEqual(llmCalls, 0);
    assert.strictEqual(builtWidth, 'full');
    composer.denervate();
}

function testComposer_GeminiInvokedWhenJevDecisionTrue(): void {
    const bus = new EventTarget();
    let llmCalls = 0;
    let decideCorrelationId = '';
    bus.addEventListener(LlmSignalType.STREAM, (event) => { llmCalls += 1; event.stopImmediatePropagation(); });
    bus.addEventListener(DecisionSignalType.DECIDE, (event) => {
        decideCorrelationId = (event as CustomEvent<Signal<DecidePayload>>).detail.value?.correlationId ?? '';
        event.stopImmediatePropagation();
    });
    const composer = new Composer('jev-recompose-composer').innervate(bus);
    emitSignal(bus, composer.updateEvent, Composer.disposition);
    seedComposerMemory(bus, 'jev-recompose-composer');
    emitSignal(bus, SignalType.COMPOSE, { request: 'Build hero', limits: { width: 390, height: 844, orientation: 'portrait-primary' } });
    emitSignal(bus, DecisionSignalType.DECIDED, { decision: true, raw: { recompose: 'yes' }, correlationId: decideCorrelationId });
    assert.strictEqual(llmCalls, 1);
    composer.denervate();
}

function testComposer_ResponsiveAdaptationAcrossBreakpoints(): void {
    const cardLayout = { card: { purpose: 'Card', context: 'Web', parentTo: 'canvasRoot', kind: 'container' as const, dimensions: { width: 'full' as const, height: 'auto' as const }, style: { direction: 'column' as const } } };
    const childrenLayout = {
        inputArea: { purpose: 'Input', context: 'Card', parentTo: 'card', kind: 'input' as const, dimensions: { width: 'full' as const, height: 'auto' as const }, style: {} },
        actionArea: { purpose: 'Action', context: 'Card', parentTo: 'card', kind: 'action' as const, dimensions: { width: 'full' as const, height: 'auto' as const }, style: {} },
    };
    const [desktopCard, tabletCard, mobileCard] = [
        adaptLayoutMeasures(cardLayout, { minWidth: 1024, maxWidth: 4096 }).card,
        adaptLayoutMeasures(cardLayout, { minWidth: 640, maxWidth: 1023 }).card,
        adaptLayoutMeasures(cardLayout, { minWidth: 0, maxWidth: 639 }).card,
    ];
    assert.deepStrictEqual([desktopCard.dimensions.width, desktopCard.style?.direction], ['two-thirds', 'row']);
    assert.deepStrictEqual([tabletCard.dimensions.width, tabletCard.style?.direction], ['wide', 'column']);
    assert.deepStrictEqual([mobileCard.dimensions.width, mobileCard.style?.direction], ['full', 'column']);
    const [desktopChildren, tabletChildren, mobileChildren] = [
        adaptLayoutMeasures(childrenLayout, { minWidth: 1024, maxWidth: 4096 }),
        adaptLayoutMeasures(childrenLayout, { minWidth: 640, maxWidth: 1023 }),
        adaptLayoutMeasures(childrenLayout, { minWidth: 0, maxWidth: 639 }),
    ];
    assert.deepStrictEqual([desktopChildren.inputArea.dimensions.width, desktopChildren.actionArea.dimensions.width], ['two-thirds', 'third']);
    assert.deepStrictEqual([tabletChildren.inputArea.dimensions.width, tabletChildren.actionArea.dimensions.width], ['full', 'half']);
    assert.deepStrictEqual([mobileChildren.inputArea.dimensions.width, mobileChildren.actionArea.dimensions.width], ['full', 'full']);
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing Composer UCA (autonomous layout composer)...');
    testComposer_Identity();
    testComposer_Disposition();
    testComposer_SchemaValidation();
    testComposer_CapabilitiesInCooky();
    testComposer_TriggersLlmStreamOnCompose();
    testComposer_StreamsThroughTransformer();
    testComposer_EmitsComposedOnLlmResult();
    testComposer_StreamChunksDoNotPolluteBus();
    testComposer_SingleLlmRelaysEachProviderChunk();
    await testComposer_ConcurrentStreamsAreIsolated();
    testComposer_MemoryKeepWithinMediaRange();
    testComposer_JevAdaptsWhenOutOfRangeAndDecisionFalse();
    testComposer_GeminiInvokedWhenJevDecisionTrue();
    testComposer_ResponsiveAdaptationAcrossBreakpoints();
    console.log('✅ All Composer UCA tests passed successfully!');
}

void runTests();

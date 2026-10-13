import assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType, type InferPayload, type Body as LlmBody } from '@uca/llm/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    SignalType as TransformerSignalType,
    type TransformPayload,
} from '@uca/capability-stream-transformer/types';
import type { Signal } from '@uca/core/types';
import { Composer } from '../index.js';
import { __ID__, DEFAULT_CATALOG, DEFAULT_CONTEXT, DEFAULT_MODEL, DEFAULT_PROVIDER, DEFAULT_REQUEST } from '../constants.js';
import { bodySchema } from '../schema.js';
import { DataType, SignalType } from '../types.js';

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
    assert.strictEqual(catalog.length, 2);
    const [LlmClass, llmDisposition] = catalog[0];
    const { aim: llmAim } = llmDisposition;
    const { model, provider } = (llmAim.body ?? {}) as LlmBody;
    assert.strictEqual(LlmClass, Llm);
    assert.strictEqual(model, DEFAULT_MODEL);
    assert.strictEqual(provider, DEFAULT_PROVIDER);
    const [TransformerClass] = catalog[1];
    assert.strictEqual(TransformerClass, StreamTransformer);
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
    assert.strictEqual(transformPayload.correlationId, 'stream-test-composer');
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

function runTests(): void {
    console.log('🧪 Testing Composer UCA (autonomous layout composer)...');
    testComposer_Identity();
    testComposer_Disposition();
    testComposer_SchemaValidation();
    testComposer_CapabilitiesInCooky();
    testComposer_TriggersLlmStreamOnCompose();
    testComposer_StreamsThroughTransformer();
    testComposer_EmitsComposedOnLlmResult();
    testComposer_StreamChunksDoNotPolluteBus();
    console.log('✅ All Composer UCA tests passed successfully!');
}

runTests();

import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import { type Signal } from '@uca/core/types';
import { z } from 'zod';
import { StreamTransformer } from '../index.js';
import { __ID__, AIM } from '../constants.js';
import {
    type TransformResult,
    DataType,
    SignalType,
} from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function createTextStream(chunks: string[]): ReadableStream<string> {
    return new ReadableStream<string>({
        start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(chunk);
            }
            controller.close();
        },
    });
}

function testStreamTransformer_IdentityAndDefaults(): void {
    const transformer = new StreamTransformer();
    assert.ok(transformer instanceof Capability);
    assert.strictEqual(transformer.id, __ID__);
    assert.strictEqual(StreamTransformer.AIM, AIM);
    const { inputs, outputs, aim } = StreamTransformer.disposition;
    assert.strictEqual(inputs?.length, 1);
    assert.strictEqual(outputs?.length, 2);
    assert.strictEqual(inputs?.[0]?.type, DataType.TRANSFORM_PAYLOAD);
    assert.strictEqual(aim.description, AIM);
}

function testStreamTransformer_Innervation(): void {
    const bus = new EventTarget();
    const transformer = new StreamTransformer('custom-transformer').innervate(bus);
    assert.strictEqual(transformer.id, 'custom-transformer');
    assert.strictEqual(transformer.target, bus);
    transformer.denervate();
}

async function testStreamTransformer_TransformToObjects(): Promise<void> {
    const bus = new EventTarget();
    let result: TransformResult | undefined;

    bus.addEventListener(SignalType.TRANSFORMED, (event: Event) => {
        result = (event as CustomEvent<Signal>).detail?.value as TransformResult;
    });

    const transformer = new StreamTransformer().innervate(bus);
    const textStream = createTextStream([
        '{"box": {"aim": {"description": "card"}}}',
        '\n{"action": {"aim": {"description": "button"}}}',
    ]);

    emitSignal(bus, SignalType.TRANSFORM, {
        correlationId: 'c-1',
        streamId: 's-1',
        stream: textStream,
    });

    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(result !== undefined);
    assert.strictEqual(result?.correlationId, 'c-1');
    assert.ok(result?.stream instanceof ReadableStream);

    const reader = result.stream.getReader();
    const { value: obj1 } = await reader.read();
    assert.deepStrictEqual(obj1, { box: { aim: { description: 'card' } } });

    const { value: obj2 } = await reader.read();
    assert.deepStrictEqual(obj2, { action: { aim: { description: 'button' } } });

    const { done } = await reader.read();
    assert.strictEqual(done, true);

    transformer.denervate();
}

async function testStreamTransformer_TransformWithSchemaValidation(): Promise<void> {
    const bus = new EventTarget();
    let result: TransformResult | undefined;

    bus.addEventListener(SignalType.TRANSFORMED, (event: Event) => {
        result = (event as CustomEvent<Signal>).detail?.value as TransformResult;
    });

    const ucaSchema = z.object({
        ucaName: z.record(z.string(), z.unknown()),
    });

    const transformer = new StreamTransformer().innervate(bus);
    const textStream = createTextStream([
        '{"ucaName": {"label": "valid"}}',
        '\n{"ignoredName": {"label": "invalid"}}',
        '\n{"ucaName": {"label": "also-valid"}}',
    ]);

    emitSignal(bus, SignalType.TRANSFORM, {
        correlationId: 'c-schema',
        stream: textStream,
        schema: ucaSchema,
    });

    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(result !== undefined);
    const reader = result.stream.getReader();
    const { value: first } = await reader.read();
    assert.deepStrictEqual(first, { ucaName: { label: 'valid' } });

    const { value: second } = await reader.read();
    assert.deepStrictEqual(second, { ucaName: { label: 'also-valid' } });

    const { done } = await reader.read();
    assert.strictEqual(done, true);

    transformer.denervate();
}

async function testStreamTransformer_TransformWrappedOuterObject(): Promise<void> {
    const bus = new EventTarget();
    let result: TransformResult | undefined;

    bus.addEventListener(SignalType.TRANSFORMED, (event: Event) => {
        result = (event as CustomEvent<Signal>).detail?.value as TransformResult;
    });

    const transformer = new StreamTransformer().innervate(bus);
    const textStream = createTextStream([
        '{\n  "HeaderNav": { "purpose": "Nav", "parentTo": null },\n',
        '  "HeroBanner": { "purpose": "Hero", "parentTo": null }\n}',
    ]);

    emitSignal(bus, SignalType.TRANSFORM, { correlationId: 'c-wrap', stream: textStream });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(result !== undefined);
    const reader = result.stream.getReader();
    const { value: first } = await reader.read();
    assert.deepStrictEqual(first, { HeaderNav: { purpose: 'Nav', parentTo: null } });

    const { value: second } = await reader.read();
    assert.deepStrictEqual(second, { HeroBanner: { purpose: 'Hero', parentTo: null } });

    const { done } = await reader.read();
    assert.strictEqual(done, true);

    transformer.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing StreamTransformer Capability (text stream -> object stream)...');
    testStreamTransformer_IdentityAndDefaults();
    testStreamTransformer_Innervation();
    await testStreamTransformer_TransformToObjects();
    await testStreamTransformer_TransformWithSchemaValidation();
    await testStreamTransformer_TransformWrappedOuterObject();
    console.log('✅ All StreamTransformer Capability tests passed successfully!');
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});


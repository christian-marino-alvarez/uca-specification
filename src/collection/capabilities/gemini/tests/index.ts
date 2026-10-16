import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { Gemini } from '../index.js';
import { SignalType, type Body, type GenerateResult } from '../types.js';
import { __ID__ } from '../constants.js';
import type { GoogleGenAI } from '@google/genai';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testGemini_IdentityAndDefaults(): void {
    const gemini = new Gemini();
    assert.strictEqual(gemini.id, __ID__);
    assert.ok(gemini instanceof Capability);
    gemini.innervate();
    assert.strictEqual(gemini.disposition.inputs?.length, 4);
    assert.strictEqual(gemini.disposition.outputs?.length, 4);
    gemini.denervate();
}

function testGemini_ConnectSignal(): void {
    const bus = new EventTarget();
    const gemini = new Gemini('gemini-conn').innervate(bus);
    emitSignal(bus, gemini.updateEvent, Gemini.disposition);
    let connected = false;

    bus.addEventListener(SignalType.CONNECTED, () => {
        connected = true;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'test-key' });
    assert.strictEqual(connected, true);
    gemini.denervate();
}

async function testGemini_GenerateWithMockClient(): Promise<void> {
    const bus = new EventTarget();
    const mockClient = {
        models: {
            generateContent: async () => ({
                text: JSON.stringify({ ucas: { 'center-box': { aim: { description: 'box' } } } }),
                usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20 },
            }),
        },
    } as unknown as GoogleGenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Gemini.AIM, body: { client: mockClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const gemini = new Gemini('gemini-gen').innervate(bus);
    emitSignal(bus, gemini.updateEvent, disposition);
    let capturedResult: GenerateResult | undefined;

    bus.addEventListener(SignalType.GENERATED, (event: Event) => {
        capturedResult = (event as CustomEvent<Signal<GenerateResult>>).detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, {
        prompt: 'Crear vista',
        schema: { type: 'object' },
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedResult !== undefined);
    assert.strictEqual(capturedResult.prompt, 'Crear vista');
    assert.ok(capturedResult.data !== undefined);
    const data = capturedResult.data as { ucas: Record<string, unknown> };
    assert.ok(data.ucas['center-box']);

    gemini.denervate();
}

async function testGemini_GenerateHandlesError(): Promise<void> {
    const bus = new EventTarget();
    const failingClient = {
        models: {
            generateContent: async () => {
                throw new Error('Gemini API rate limit exceeded');
            },
        },
    } as unknown as GoogleGenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Gemini.AIM, body: { client: failingClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const gemini = new Gemini('gemini-err').innervate(bus);
    emitSignal(bus, gemini.updateEvent, disposition);
    let errorCaptured: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorCaptured = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, { prompt: 'bad', correlationId: 'failed-area' });
    await new Promise((resolve) => setTimeout(resolve, 30));

    const { error, correlationId } = errorCaptured as { error: string; correlationId: string };
    assert.strictEqual(error, 'Error: Gemini API rate limit exceeded');
    assert.strictEqual(correlationId, 'failed-area');

    gemini.denervate();
}

async function runAllGeminiTests(): Promise<void> {
    testGemini_IdentityAndDefaults();
    testGemini_ConnectSignal();
    await testGemini_GenerateWithMockClient();
    await testGemini_GenerateHandlesError();
    console.log('✔ All Gemini capability minimal architecture tests passed successfully.');
}

await runAllGeminiTests();

import { once } from 'node:events';
const streamingBus = new EventTarget();
let pulled = 0, returned = 0, chunkEvents = 0;
let upstreamSignal: AbortSignal | undefined;
const iterator = {
    async next() { pulled += 1; return { done: false as const, value: { text: 'part' } }; },
    async return() { returned += 1; return { done: true as const, value: undefined }; },
    [Symbol.asyncIterator]() { return this; },
};
const streamingClient = { models: { generateContentStream: async ({ config }: { config: { abortSignal: AbortSignal } }) => { upstreamSignal = config.abortSignal; return iterator; } } } as unknown as GoogleGenAI;
const streamingProvider = new Gemini('streaming').innervate(streamingBus);
emitSignal(streamingBus, streamingProvider.updateEvent, { ...Gemini.disposition, aim: { description: Gemini.AIM, body: { client: streamingClient } } });
streamingBus.addEventListener(SignalType.CHUNK, () => { chunkEvents += 1; });
const connectedStream = once(streamingBus, SignalType.STREAMED, { signal: AbortSignal.timeout(2000) });
emitSignal(streamingBus, SignalType.STREAM, { prompt: 'Generate', correlationId: 'pull-test' });
const [connectedEvent] = await connectedStream;
const { detail: { value: { stream } } } = connectedEvent as CustomEvent<Signal<import('../types.js').StreamResult>>;
assert.equal(pulled, 0, 'Publishing a stream must not drain the provider');
const reader = stream.getReader();
assert.deepEqual(await reader.read(), { done: false, value: 'part' });
assert.equal(pulled, 1, 'One read advances the upstream iterator once');
assert.equal(chunkEvents, 0, 'Streaming must not duplicate data onto the event bus');
await reader.cancel();
assert.equal(upstreamSignal?.aborted, true, 'Cancellation reaches the provider request');
assert.equal(returned, 1, 'Cancellation releases the provider iterator');
streamingProvider.denervate();
console.log('✔ Gemini pull-based streaming and provider cancellation verified');

const failureBus = new EventTarget();
let failedReads = 0;
const damagedIterator = {
    async next() {
        failedReads += 1;
        if (failedReads > 1) { throw new Error('upstream generation interrupted'); }
        return { done: false as const, value: { text: 'prefix' } };
    },
    [Symbol.asyncIterator]() { return this; },
};
const failureClient = { models: { generateContentStream: async () => damagedIterator } } as unknown as GoogleGenAI;
const failureProvider = new Gemini('failure-stream').innervate(failureBus);
emitSignal(failureBus, failureProvider.updateEvent, { ...Gemini.disposition, aim: { description: Gemini.AIM, body: { client: failureClient } } });
const failureStream = once(failureBus, SignalType.STREAMED, { signal: AbortSignal.timeout(2000) });
emitSignal(failureBus, SignalType.STREAM, { prompt: 'Generate', correlationId: 'failure-test' });
const [failureStreamEvent] = await failureStream;
const { detail: { value: { stream: damagedStream } } } = failureStreamEvent as CustomEvent<Signal<import('../types.js').StreamResult>>;
const damagedReader = damagedStream.getReader();
assert.deepEqual(await damagedReader.read(), { done: false, value: 'prefix' });
await assert.rejects(damagedReader.read(), /upstream generation interrupted/);
failureProvider.denervate();
console.log('✔ Gemini surfaces interrupted generation as stream failure without synthetic fallback content');

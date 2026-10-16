import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import type OpenAI from 'openai';
import { Openai } from '../index.js';
import { SignalType, type Body, type GenerateResult } from '../types.js';
import { __ID__ } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testOpenai_IdentityAndDefaults(): void {
    const openai = new Openai();
    assert.strictEqual(openai.id, __ID__);
    assert.ok(openai instanceof Capability);
    openai.innervate();
    assert.strictEqual(openai.disposition.inputs?.length, 4);
    assert.strictEqual(openai.disposition.outputs?.length, 4);
    openai.denervate();
}

function testOpenai_ConnectSignal(): void {
    const bus = new EventTarget();
    const openai = new Openai('openai-conn').innervate(bus);
    emitSignal(bus, openai.updateEvent, Openai.disposition);
    let connected = false;

    bus.addEventListener(SignalType.CONNECTED, () => {
        connected = true;
    });

    emitSignal(bus, SignalType.CONNECT, { apiKey: 'test-key' });
    assert.strictEqual(connected, true);
    openai.denervate();
}

async function testOpenai_GenerateWithMockClient(): Promise<void> {
    const bus = new EventTarget();
    const mockClient = {
        chat: {
            completions: {
                create: async () => ({
                    choices: [{ message: { content: JSON.stringify({ ucas: { 'center-box': { aim: { description: 'box' } } } }) } }],
                    usage: { prompt_tokens: 10, completion_tokens: 20 },
                }),
            },
        },
    } as unknown as OpenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Openai.AIM, body: { client: mockClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const openai = new Openai('openai-gen').innervate(bus);
    emitSignal(bus, openai.updateEvent, disposition);
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

    openai.denervate();
}

async function testOpenai_GenerateHandlesError(): Promise<void> {
    const bus = new EventTarget();
    const failingClient = {
        chat: {
            completions: {
                create: async () => {
                    throw new Error('OpenAI API rate limit exceeded');
                },
            },
        },
    } as unknown as OpenAI;

    const disposition: Disposition<Body> = {
        aim: { description: Openai.AIM, body: { client: failingClient } },
        reactTo: [SignalType.CONNECT, SignalType.GENERATE],
    };
    const openai = new Openai('openai-err').innervate(bus);
    emitSignal(bus, openai.updateEvent, disposition);
    let errorCaptured: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorCaptured = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, SignalType.GENERATE, { prompt: 'bad', correlationId: 'failed-area' });
    await new Promise((resolve) => setTimeout(resolve, 30));

    const { error, correlationId } = errorCaptured as { error: string; correlationId: string };
    assert.strictEqual(error, 'Error: OpenAI API rate limit exceeded');
    assert.strictEqual(correlationId, 'failed-area');

    openai.denervate();
}

async function runAllOpenaiTests(): Promise<void> {
    testOpenai_IdentityAndDefaults();
    testOpenai_ConnectSignal();
    await testOpenai_GenerateWithMockClient();
    await testOpenai_GenerateHandlesError();
    console.log('✔ All OpenAI capability minimal architecture tests passed successfully.');
}

await runAllOpenaiTests();

import { once } from 'node:events';
const streamingBus = new EventTarget();
let pulled = 0, returned = 0, chunkEvents = 0;
let upstreamSignal: AbortSignal | undefined;
const iterator = {
    async next() { pulled += 1; return { done: false as const, value: { choices: [{ delta: { content: 'part' } }] } }; },
    async return() { returned += 1; return { done: true as const, value: undefined }; },
    [Symbol.asyncIterator]() { return this; },
};
const streamingClient = { chat: { completions: { create: async (_request: unknown, options: { signal: AbortSignal }) => { upstreamSignal = options.signal; return iterator; } } } } as unknown as OpenAI;
const streamingProvider = new Openai('streaming').innervate(streamingBus);
emitSignal(streamingBus, streamingProvider.updateEvent, { ...Openai.disposition, aim: { description: Openai.AIM, body: { client: streamingClient } } });
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
console.log('✔ Openai pull-based streaming and provider cancellation verified');

const failureBus = new EventTarget();
let failedReads = 0;
const damagedIterator = {
    async next() {
        failedReads += 1;
        if (failedReads > 1) { throw new Error('upstream generation interrupted'); }
        return { done: false as const, value: { choices: [{ delta: { content: 'prefix' } }] } };
    },
    [Symbol.asyncIterator]() { return this; },
};
const failureClient = { chat: { completions: { create: async () => damagedIterator } } } as unknown as OpenAI;
const failureProvider = new Openai('failure-stream').innervate(failureBus);
emitSignal(failureBus, failureProvider.updateEvent, { ...Openai.disposition, aim: { description: Openai.AIM, body: { client: failureClient } } });
const failureStream = once(failureBus, SignalType.STREAMED, { signal: AbortSignal.timeout(2000) });
emitSignal(failureBus, SignalType.STREAM, { prompt: 'Generate', correlationId: 'failure-test' });
const [failureStreamEvent] = await failureStream;
const { detail: { value: { stream: damagedStream } } } = failureStreamEvent as CustomEvent<Signal<import('../types.js').StreamResult>>;
const damagedReader = damagedStream.getReader();
assert.deepEqual(await damagedReader.read(), { done: false, value: 'prefix' });
await assert.rejects(damagedReader.read(), /upstream generation interrupted/);
failureProvider.denervate();
console.log('✔ Openai surfaces interrupted generation as stream failure without synthetic fallback content');

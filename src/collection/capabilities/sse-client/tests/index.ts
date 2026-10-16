import { strict as assert } from 'node:assert';
import { SseClient } from '../index.js';
import { SignalType } from '../types.js';
import { __ID__, AIM, DEFAULT_ENDPOINT } from '../constants.js';

function testSseClientInitialization(): void {
    const client = new SseClient();
    assert.equal(client.id, __ID__);
    assert.equal(SseClient.AIM, AIM);
    const { aim } = SseClient.disposition;
    assert.equal(aim.description, AIM);
    assert.equal(aim.body?.endpoint, DEFAULT_ENDPOINT);
}

function testSseClientAbort(): void {
    const bus = new EventTarget();
    const client = new SseClient();
    client.innervate(bus);
    bus.dispatchEvent(new CustomEvent(client.updateEvent, {
        detail: { source: 'test', property: client.updateEvent, value: SseClient.disposition, timestamp: Date.now() },
    }));
    let aborted = false;
    bus.addEventListener(SignalType.ABORTED, () => {
        aborted = true;
    });
    bus.dispatchEvent(new CustomEvent(SignalType.ABORT, {
        detail: { source: 'test', property: SignalType.ABORT, value: { correlationId: 'test-123' }, timestamp: Date.now() },
    }));
    assert.equal(aborted, true);
}

async function runTests(): Promise<void> {
    testSseClientInitialization();
    testSseClientAbort();
    console.log('✅ SseClient capability tests passed successfully');
}

runTests();

const originalFetch = globalThis.fetch;
const streams = new Map<string, ReadableStreamDefaultController<Uint8Array>>();
const signals = new Map<string, AbortSignal>();
const bus = new EventTarget();
const client = new SseClient('concurrent').innervate(bus);
function emit(property: string, value: unknown): void {
    bus.dispatchEvent(new CustomEvent(property, { detail: { source: 'test', property, value, timestamp: Date.now() } }));
}
emit(client.updateEvent, SseClient.disposition);
try {
    globalThis.fetch = async (_url, options) => {
        const { correlationId } = JSON.parse(String(options?.body));
        const signal = options?.signal as AbortSignal;
        signals.set(correlationId, signal);
        const stream = new ReadableStream<Uint8Array>({ start(controller) { streams.set(correlationId, controller); signal.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')), { once: true }); } });
        return new Response(stream);
    };
    emit(SignalType.STREAM, { correlationId: 'first' });
    emit(SignalType.STREAM, { correlationId: 'second' });
    emit(SignalType.ABORT, { correlationId: 'first' });
    assert.equal(signals.get('first')?.aborted, true);
    assert.equal(signals.get('second')?.aborted, false);
    client.denervate();
    assert.equal(signals.get('second')?.aborted, true);
} finally { globalThis.fetch = originalFetch; client.denervate(); }
console.log('✔ Concurrent SSE requests abort independently and close on denervation');

import { once } from 'node:events';
import type { Signal } from '@uca/core/types';
import type { StreamResult } from '../types.js';
const readingBus = new EventTarget();
const readingClient = new SseClient('reading').innervate(readingBus);
function send(property: string, value: unknown): void {
    readingBus.dispatchEvent(new CustomEvent(property, { detail: { source: 'test', property, value } }));
}
send(readingClient.updateEvent, SseClient.disposition);
let networkReads = 0, networkCancelled = false, chunkEvents = 0;
let requestSignal: AbortSignal | undefined;
readingBus.addEventListener(SignalType.CHUNK, () => { chunkEvents += 1; });
try {
    globalThis.fetch = async (_url, options) => {
        requestSignal = options?.signal as AbortSignal;
        return new Response(new ReadableStream<Uint8Array>({
            pull(controller) { networkReads += 1; controller.enqueue(new TextEncoder().encode(`data: {"text":"part-${networkReads}"}\n\n`)); },
            cancel() { networkCancelled = true; },
        }, { highWaterMark: 0 }));
    };
    const delivered = once(readingBus, SignalType.STREAMED, { signal: AbortSignal.timeout(2000) });
    send(SignalType.STREAM, { correlationId: 'reading' });
    const [deliveredEvent] = await delivered;
    const { detail: { value: { stream } } } = deliveredEvent as CustomEvent<Signal<StreamResult>>;
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.ok(networkReads <= 3, `Bounded decoder stages may prefetch, but must stop without consumption: ${networkReads}`);
    const reader = stream.getReader();
    assert.deepEqual(await reader.read(), { done: false, value: 'part-1' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.ok(networkReads <= 4); assert.equal(chunkEvents, 0);
    await reader.cancel();
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(requestSignal?.aborted, true); assert.equal(networkCancelled, true);

    globalThis.fetch = async () => new Response('data: {"text":"accepted"}\n\ndata: {"error":"source failed"}\n\n');
    const damaged = once(readingBus, SignalType.STREAMED, { signal: AbortSignal.timeout(2000) });
    const failed = once(readingBus, SignalType.ERROR, { signal: AbortSignal.timeout(2000) });
    send(SignalType.STREAM, { correlationId: 'damaged' });
    const [damagedEvent] = await damaged;
    const { detail: { value: { stream: damagedStream } } } = damagedEvent as CustomEvent<Signal<StreamResult>>;
    await assert.rejects(new Response(damagedStream.pipeThrough(new TextEncoderStream())).text(), /source failed/);
    const [errorEvent] = await failed;
    assert.equal((errorEvent as CustomEvent<Signal<{ correlationId: string }>>).detail.value.correlationId, 'damaged');
} finally { globalThis.fetch = originalFetch; readingClient.denervate(); }
console.log('✔ SSE transport has one bounded consumer, no chunk events and propagated source errors');

import { MAX_FRAME_LENGTH } from '../constants.js';
const segmentationBus = new EventTarget();
const segmentationClient = new SseClient('segmentation').innervate(segmentationBus);
segmentationBus.dispatchEvent(new CustomEvent(segmentationClient.updateEvent, { detail: { source: 'test', property: segmentationClient.updateEvent, value: SseClient.disposition } }));
async function readFrames(chunks: readonly string[]): Promise<string> {
    globalThis.fetch = async () => new Response(new ReadableStream<Uint8Array>({ start(controller) { chunks.forEach((chunk) => controller.enqueue(new TextEncoder().encode(chunk))); controller.close(); } }));
    const delivered = once(segmentationBus, SignalType.STREAMED, { signal: AbortSignal.timeout(2000) });
    segmentationBus.dispatchEvent(new CustomEvent(SignalType.STREAM, { detail: { source: 'test', property: SignalType.STREAM, value: {} } }));
    const [event] = await delivered;
    const { detail: { value: { stream } } } = event as CustomEvent<Signal<StreamResult>>;
    let result = '';
    await stream.pipeTo(new WritableStream<string>({ write(chunk) { result += chunk; } }));
    return result;
}
try {
    const frames = 'data: {"text":"part"}\n\n'.repeat(60000);
    assert.ok(frames.length > MAX_FRAME_LENGTH);
    const split = Array.from({ length: 12 }, (_, index) => frames.slice(index * frames.length / 12, (index + 1) * frames.length / 12));
    const coalescedResult = await readFrames([frames]);
    assert.equal(coalescedResult, 'part'.repeat(60000));
    assert.equal(await readFrames(split), coalescedResult, 'Frame decoding must not depend on network packet boundaries');
    const oversized = `data: {"text":"${'x'.repeat(MAX_FRAME_LENGTH)}"}\n\n`;
    await assert.rejects(readFrames([oversized]), /transport buffer limit/);
    await assert.rejects(readFrames([oversized.slice(0, MAX_FRAME_LENGTH), oversized.slice(MAX_FRAME_LENGTH)]), /transport buffer limit/);
    await assert.rejects(readFrames([oversized.slice(0, -2)]), /transport buffer limit/);
} finally { globalThis.fetch = originalFetch; segmentationClient.denervate(); }
console.log('✔ SSE frame limit is independent of network segmentation and bounds complete or unfinished frames');

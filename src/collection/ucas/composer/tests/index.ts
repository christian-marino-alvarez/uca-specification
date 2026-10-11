import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Signal } from '@uca/core/types';
import { SignalType as SseSignalType } from '@uca/capability-sse-client/types';
import { Composer } from '../index.js';
import { SignalType, type StreamResult } from '../types.js';
import { CHILDREN, DISPOSITION } from './constants.js';

function emit(bus: EventTarget, property: string, value: unknown, source = 'client'): void {
    const detail: Signal = { source, property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail }));
}

function receive<Value>(bus: EventTarget, property: string): Promise<Value> {
    return new Promise((resolve) => bus.addEventListener(property, (event) => {
        const { detail: { value } } = event as CustomEvent<Signal<Value>>;
        resolve(value);
    }, { once: true }));
}

function response(value: unknown): Response {
    return new Response(`data: ${JSON.stringify({ text: JSON.stringify(value) })}\n\ndata: [DONE]\n\n`);
}

async function readAll(stream: ReadableStream<Record<string, unknown>>): Promise<Record<string, unknown>> {
    const reader = stream.getReader();
    let accumulated: Record<string, unknown> = {};
    for (let { done, value } = await reader.read(); !done; { done, value } = await reader.read()) {
        accumulated = { ...accumulated, ...value };
    }
    return accumulated;
}

await test('Composer streams validated immediate children with domain context and dimensions', async (context) => {
    context.mock.method(globalThis, 'fetch', async () => response(CHILDREN));
    const bus = new EventTarget();
    const streamed = receive<StreamResult>(bus, SignalType.STREAMED);
    const composer = new Composer().innervate(bus);
    emit(bus, composer.updateEvent, { ...Composer.disposition, aim: { description: 'Explain UCA', body: { ...DISPOSITION.aim.body, correlationId: 'first' } } });
    context.after(() => composer.denervate());
    const { stream, correlationId } = await streamed;
    const children = await readAll(stream);
    assert.deepEqual(children, CHILDREN);
    assert.equal(correlationId, 'first');
});

await test('Disposition changes request a fresh composition with the new operating context', async (context) => {
    context.mock.method(globalThis, 'fetch', async () => response({ navigation: CHILDREN.navigation }));
    const bus = new EventTarget();
    const composer = new Composer().innervate(bus);
    emit(bus, composer.updateEvent, { ...Composer.disposition, ...DISPOSITION });
    context.after(() => composer.denervate());
    const requested = receive<{ request: string }>(bus, SseSignalType.STREAM);
    const streamed = receive<StreamResult>(bus, SignalType.STREAMED);
    emit(bus, composer.updateEvent, { ...Composer.disposition, aim: { body: { context: 'Mobile reader' } } });
    const { request } = await requested;
    assert.match(request, /Mobile reader/);
    const { stream } = await streamed;
    const children = await readAll(stream);
    assert.deepEqual(children, { navigation: CHILDREN.navigation });
});

await test('handleTransformed ignores transformed streams lacking a correlationId', async (context) => {
    const bus = new EventTarget();
    let streamedEmitted = false;
    bus.addEventListener(SignalType.STREAMED, () => { streamedEmitted = true; });
    const composer = new Composer().innervate(bus);
    emit(bus, composer.updateEvent, Composer.disposition);
    context.after(() => composer.denervate());
    emit(bus, 'stream-transformer.transformed', { stream: new ReadableStream() });
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(streamedEmitted, false);
});


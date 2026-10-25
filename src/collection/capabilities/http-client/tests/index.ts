import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { Signal } from '@uca/core/types';
function emit(bus: EventTarget, property: string, value: unknown): void {
    bus.dispatchEvent(new CustomEvent(property, { detail: { source: 'test', property, value, timestamp: Date.now() } }));
}
async function receive(bus: EventTarget, property: string): Promise<unknown> {
    const [event] = await once(bus, property, { signal: AbortSignal.timeout(4000) });
    const { detail: { value } } = event as CustomEvent<Signal>;
    return value;
}
import { HttpClient } from '../index.js';
import { SignalType } from '../types.js';
const originalFetch = globalThis.fetch;
const bus = new EventTarget();
const client = new HttpClient('client').innervate(bus);
emit(bus, client.updateEvent, HttpClient.disposition);
try {
    globalThis.fetch = async (url, options) => {
        assert.equal(url, '/api/llm');
        assert.equal(new Headers(options?.headers).get('Authorization'), null);
        assert.deepEqual(JSON.parse(String(options?.body)), { request: 'Build' });
        return Response.json({ response: 'Ready' });
    };
    const result = receive(bus, SignalType.RESPONSE);
    emit(bus, SignalType.REQUEST, { endpoint: '/api/llm', payload: { request: 'Build' }, sessionId: 'first', context: { provider: 'jev' } });
    assert.deepEqual(await result, { data: { response: 'Ready' }, sessionId: 'first', context: { provider: 'jev' } });
    globalThis.fetch = async () => new Response('upstream unavailable', { status: 502 });
    const failure = receive(bus, SignalType.ERROR);
    emit(bus, SignalType.REQUEST, { endpoint: '/api/llm', payload: {}, sessionId: 'second' });
    const { error, sessionId } = await failure as { error: string; sessionId: string };
    assert.match(error, /502.*upstream unavailable/); assert.equal(sessionId, 'second');
} finally { globalThis.fetch = originalFetch; client.denervate(); }
console.log('✔ HttpClient response, context and failure verified');

const cancellationBus = new EventTarget();
const cancellationClient = new HttpClient('cancellation').innervate(cancellationBus);
emit(cancellationBus, cancellationClient.updateEvent, HttpClient.disposition);
const pending = new Map<string, (response: Response) => void>();
const requests = new Map<string, AbortSignal>();
const responses: unknown[] = [], failures: unknown[] = [];
cancellationBus.addEventListener(SignalType.RESPONSE, (event) => responses.push((event as CustomEvent<Signal>).detail.value));
cancellationBus.addEventListener(SignalType.ERROR, (event) => failures.push((event as CustomEvent<Signal>).detail.value));
try {
    globalThis.fetch = async (_url, options) => {
        const { sessionId } = JSON.parse(String(options?.body));
        requests.set(sessionId, options?.signal as AbortSignal);
        return new Promise<Response>((resolve) => pending.set(sessionId, resolve));
    };
    emit(cancellationBus, SignalType.REQUEST, { endpoint: '/infer', payload: { sessionId: 'first' }, sessionId: 'first' });
    emit(cancellationBus, SignalType.REQUEST, { endpoint: '/infer', payload: { sessionId: 'second' }, sessionId: 'second' });
    emit(cancellationBus, SignalType.ABORT, { sessionId: 'first' });
    assert.equal(requests.get('first')?.aborted, true); assert.equal(requests.get('second')?.aborted, false);
    const secondResponse = receive(cancellationBus, SignalType.RESPONSE);
    pending.get('first')?.(Response.json({ stale: true })); pending.get('second')?.(Response.json({ fresh: true }));
    await secondResponse;
    assert.equal(responses.length, 1); assert.equal(failures.length, 0);
    emit(cancellationBus, SignalType.REQUEST, { endpoint: '/infer', payload: { sessionId: 'third' }, sessionId: 'third' });
    cancellationClient.denervate();
    assert.equal(requests.get('third')?.aborted, true);
    pending.get('third')?.(Response.json({ stale: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(responses.length, 1); assert.equal(failures.length, 0);
} finally { globalThis.fetch = originalFetch; cancellationClient.denervate(); }
console.log('✔ HTTP cancellation is correlated and suppresses late responses after abort or denervation');

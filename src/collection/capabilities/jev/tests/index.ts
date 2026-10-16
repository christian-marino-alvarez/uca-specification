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
import { Jev } from '../index.js';
import { SignalType, type InferResult } from '../types.js';
const originalFetch = globalThis.fetch;
const bus = new EventTarget();
const jev = new Jev('jev-test').innervate(bus);
emit(bus, jev.updateEvent, { ...Jev.disposition, aim: { description: Jev.AIM, body: { connection: { apiKey: 'backend-test-key' } } } });
try {
    globalThis.fetch = async (url, options) => {
        assert.equal(url, 'https://api.typesafe.ai/v1/systemone');
        assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer backend-test-key');
        const { questions, limit, max_tokens } = JSON.parse(String(options?.body));
        assert.deepEqual(questions, { ready: { type: 'noul', instructions: 'Ready?' }, strategy: { type: 'choice', instructions: 'Choose', criteria: { KEEP: 'Keep' } } });
        assert.equal(limit, 20); assert.equal(max_tokens, 20);
        return Response.json({ answers: { ready: true } });
    };
    const result = receive(bus, SignalType.INFERRED);
    emit(bus, SignalType.INFER, { state: { areaId: 'root' }, questions: { ready: 'Ready?', strategy: { instructions: 'Choose', options: { KEEP: 'Keep' } } }, limit: 20, correlationId: 'area:root' });
    const { state, answers, correlationId } = await result as InferResult;
    assert.deepEqual(state, { areaId: 'root' }); assert.deepEqual(answers, { ready: true }); assert.equal(correlationId, 'area:root');
    globalThis.fetch = async () => new Response('Unavailable', { status: 503 });
    const failure = receive(bus, SignalType.ERROR);
    emit(bus, SignalType.INFER, { state: {}, questions: {}, correlationId: 'area:failed' });
    const { error, correlationId: failureId } = await failure as { error: Error; correlationId: string };
    assert.match(error.message, /Jev HTTP 503/); assert.equal(failureId, 'area:failed');
} finally { globalThis.fetch = originalFetch; jev.denervate(); }
console.log('✔ Jev backend HTTP protocol and correlated errors verified');

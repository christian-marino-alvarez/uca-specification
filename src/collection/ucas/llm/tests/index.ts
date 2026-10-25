import * as assert from 'node:assert';
import type { Signal } from '@uca/core/types';
import { Llm } from '../index.js';
import { SignalType } from '../types.js';
import { createContextSchema } from '../schema.js';
const contract = { outputSchema: { type: 'object' }, contextSchema: createContextSchema({ areaId: 'root' }), purpose: 'Present an interactive area', goal: 'Build', limits: { direction: 'column' } };

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

// All frontend providers share our backend transport; no provider capability is activated.
import { once } from 'node:events';
const originalFetch = globalThis.fetch;
const clientBus = new EventTarget();
const client = new Llm('area:llm').innervate(clientBus);
emitSignal(clientBus, client.updateEvent, Llm.disposition);
assert.deepEqual([...client.registry.keys()], ['area:llm:http-client', 'area:llm:sse-client', 'area:llm:schema']);
try {
    globalThis.fetch = async (url, options) => {
        assert.equal(url, '/api/llm');
        assert.equal(new Headers(options?.headers).get('Authorization'), null);
        const { outputSchema, contextSchema, purpose, goal, limits, sessionId, connection, apiKey, request, expectations, role } = JSON.parse(String(options?.body));
        assert.deepEqual({ outputSchema, contextSchema, purpose, goal, limits }, contract);
        assert.equal(request, undefined); assert.equal(expectations, undefined); assert.equal(role, undefined);
        const { const: context } = contextSchema;
        assert.equal(connection, undefined); assert.equal(apiKey, undefined);
        return Response.json({ data: { ready: true }, context, sessionId });
    };
    for (const provider of ['jev', 'gemini', 'openai', 'gemini']) {
        const response = once(clientBus, SignalType.INFERRED, { signal: AbortSignal.timeout(3000) });
        emitSignal(clientBus, SignalType.INFER, { ...contract, id: client.id, provider, sessionId: provider });
        const [event] = await response;
        const { detail: { value, targetId } } = event as CustomEvent<Signal>;
        assert.equal(targetId, 'test');
        const result = value;
        assert.deepEqual(result, { data: { ready: true }, context: { areaId: 'root' }, sessionId: provider });
    }
    globalThis.fetch = async (url, options) => {
        assert.equal(url, '/api/llm/sse');
        const { outputSchema, contextSchema, purpose, goal, limits, imagination, limit, schema } = JSON.parse(String(options?.body));
        assert.deepEqual({ outputSchema, contextSchema, purpose, goal, limits }, contract);
        assert.equal(imagination, 0); assert.equal(limit, 10); assert.equal(schema, undefined);
        return new Response('data: {"text":"hello"}\n\ndata: {"done":true}\n\n');
    };
    const streamed = once(clientBus, SignalType.STREAMED, { signal: AbortSignal.timeout(3000) });
    const end = once(clientBus, SignalType.STREAM_END, { signal: AbortSignal.timeout(3000) });
    emitSignal(clientBus, SignalType.STREAM, { ...contract, id: client.id, imagination: 0, limit: 10, sessionId: 'stream' });
    const [streamEvent] = await streamed;
    const { detail: { value: streamResult, targetId: streamTarget } } = streamEvent as CustomEvent<Signal<import('../types.js').StreamResult>>;
    assert.equal(streamResult.sessionId, 'stream'); assert.equal(streamTarget, 'area');
    assert.equal(await new Response(streamResult.stream.pipeThrough(new TextEncoderStream())).text(), 'hello');
    await end;
    let invalidRequests = 0;
    globalThis.fetch = async () => { invalidRequests += 1; return Response.json({}); };
    for (const operation of [SignalType.INFER, SignalType.STREAM]) {
        const rejected = once(clientBus, SignalType.ERROR, { signal: AbortSignal.timeout(3000) });
        emitSignal(clientBus, operation, { ...contract, id: client.id, goal: '', sessionId: operation });
        const [rejectedEvent] = await rejected;
        const { detail: { value: rejectedValue, targetId } } = rejectedEvent as CustomEvent<Signal<{ sessionId: string }>>;
        assert.equal(rejectedValue.sessionId, operation); assert.equal(targetId, operation === SignalType.INFER ? 'test' : 'area');
    }
    assert.equal(invalidRequests, 0, 'Invalid contracts must fail before transport');
    globalThis.fetch = async () => new Response('data: {"error":"upstream failed"}\n\n');
    const failure = once(clientBus, SignalType.ERROR, { signal: AbortSignal.timeout(3000) });
    const failedStream = once(clientBus, SignalType.STREAMED, { signal: AbortSignal.timeout(3000) });
    emitSignal(clientBus, SignalType.STREAM, { ...contract, id: client.id, sessionId: 'failure' });
    const [failedStreamEvent] = await failedStream;
    const { detail: { value: { stream: errorStream } } } = failedStreamEvent as CustomEvent<Signal<import('../types.js').StreamResult>>;
    await assert.rejects(new Response(errorStream.pipeThrough(new TextEncoderStream())).text(), /upstream failed/);
    const [failureEvent] = await failure;
    const failed = (failureEvent as CustomEvent<Signal<Record<string, unknown>>>).detail.value;
    assert.equal((failureEvent as CustomEvent<Signal>).detail.targetId, 'area');
    assert.deepEqual(failed, { sessionId: 'failure', error: 'upstream failed' });
} finally { globalThis.fetch = originalFetch; client.denervate(); }
console.log('✔ Llm backend routing for all providers and SSE verified');


// Regression: all three Builder LLMs share one bus; only the targeted transport may fetch.
const sharedBus = new EventTarget(), sharedRequests: unknown[] = [];
const clients = ['builder:decision:llm', 'builder:composer:llm', 'builder:render:llm'].map((id) => new Llm(id).innervate(sharedBus));
clients.forEach((instance) => emitSignal(sharedBus, instance.updateEvent, Llm.disposition));
try {
    globalThis.fetch = async (_url, options) => { sharedRequests.push(JSON.parse(String(options?.body))); return Response.json({ data: 'ready' }); };
    for (const instance of clients) {
        const completion = once(sharedBus, SignalType.INFERRED, { signal: AbortSignal.timeout(3000) });
        const previous = sharedRequests.length;
        emitSignal(sharedBus, SignalType.INFER, { ...contract, id: instance.id });
        await completion;
        assert.equal(sharedRequests.length - previous, 1, 'One addressed LLM inference must perform exactly one fetch on the shared bus');
    }
} finally { globalThis.fetch = originalFetch; clients.forEach((instance) => instance.denervate()); }

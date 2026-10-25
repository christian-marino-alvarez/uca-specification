import { SignalType as LoggerSignalType, type LogEntry } from '@uca/logger/types';
import assert from 'node:assert/strict';
import type { Signal } from '@uca/core/types';
import { Server } from '../index.js';
import { SignalType, type RequestContext, type StartedStatus } from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test-client', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

async function testServerUca(): Promise<void> {
    const bus = new EventTarget();
    const server = new Server('api-server');
    assert.equal(server.id, 'api-server');
    assert.equal(server.purpose, Server.purpose);

    let startedReceived = false;
    let stoppedReceived = false;
    let requestCount = 0;
    let activeUrl = '';

    bus.addEventListener(SignalType.STARTED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        const { value } = customEvent.detail;
        startedReceived = true;
        const status = value as StartedStatus;
        const { url } = status;
        activeUrl = url;
    });

    bus.addEventListener(SignalType.STOPPED, () => {
        stoppedReceived = true;
    });

    bus.addEventListener(SignalType.REQUEST, (event: Event) => {
        const customEvent = event as CustomEvent<Signal>;
        const { value } = customEvent.detail;
        const requestContext = value as RequestContext;
        const { path } = requestContext;
        if (path === '/api/ping' || path === '/api/users') {
            requestCount += 1;
        }
    });

    server.innervate(bus);
    emitSignal(bus, server.updateEvent, {
        aim: {
            description: Server.purpose,
            body: {
                port: 39124,
                hostname: '127.0.0.1',
                routes: [
                    {
                        method: 'GET',
                        path: '/api/ping',
                        response: { status: 200, body: { message: 'pong' } },
                    },
                    {
                        method: 'POST',
                        path: '/api/users',
                        handler: (context: RequestContext) => ({
                            status: 201,
                            body: { user: context.body },
                        }),
                    },
                ],
            },
        },
        reactTo: [...Server.disposition.reactTo ?? []],
    });

    // Start server via domain signal
    emitSignal(bus, SignalType.START, { port: 39124, hostname: '127.0.0.1' });

    await new Promise((resolve) => setTimeout(resolve, 150));
    assert.equal(startedReceived, true, 'Server should emit STARTED signal');

    // Test GET /api/ping
    const pingResponse = await fetch(`${activeUrl}/api/ping`);
    assert.equal(pingResponse.status, 200);
    const pingData = await pingResponse.json() as { message: string };
    const { message } = pingData;
    assert.equal(message, 'pong');

    // Test POST /api/users
    const userResponse = await fetch(`${activeUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada Lovelace' }),
    });
    assert.equal(userResponse.status, 201);
    const userData = await userResponse.json() as { user: { name: string } };
    const { user } = userData;
    const { name } = user;
    assert.equal(name, 'Ada Lovelace');

    // Test dynamic route addition via ROUTE signal
    emitSignal(bus, SignalType.ROUTE, {
        method: 'GET',
        path: '/api/dynamic',
        response: { status: 200, body: { dynamic: true } },
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    const dynamicResponse = await fetch(`${activeUrl}/api/dynamic`);
    assert.equal(dynamicResponse.status, 200);
    const dynamicData = await dynamicResponse.json() as { dynamic: boolean };
    const { dynamic } = dynamicData;
    assert.equal(dynamic, true);

    // Stop server via STOP signal
    emitSignal(bus, SignalType.STOP, undefined);

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.equal(stoppedReceived, true, 'Server should emit STOPPED signal');

    // Clean up
    server.denervate();
    console.log('✔ All Server UCA tests passed successfully.');
}

await testServerUca();

import { once } from 'node:events';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType } from '@uca/llm/types';
import { createContextSchema } from '@uca/llm/schema';
import { SYSTEM_INSTRUCTION } from '@uca/llm/constants';
const contract = { outputSchema: { type: 'object' }, contextSchema: createContextSchema({ areaId: 'root' }), purpose: 'Present the requested area', goal: 'Build', limits: { width: 640 } };
function evaluation(areaId: string) {
    return { ...contract, provider: 'jev', goal: 'Evaluate', contextSchema: createContextSchema({ state: { areaId }, questions: { ready: 'Is it ready?' } }), sessionId: areaId };
}

import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
const originalFetch = globalThis.fetch;
const originalKey = process.env.JEV_API_KEY;
const originalMode = process.env.NODE_ENV;
process.env.JEV_API_KEY = 'server-only-key'; process.env.NODE_ENV = 'test';
const backendBus = new EventTarget(), observed: LogEntry[] = [];
backendBus.addEventListener(LoggerSignalType.LOG, (event) => { const { detail: { value } } = event as CustomEvent<Signal<LogEntry>>; observed.push(value); });
const backend = new Server('backend').innervate(backendBus);
const clientBus = new EventTarget();
const client = new Llm('client:llm').innervate(clientBus);
const endpoint = 'http://127.0.0.1:39125';
let upstreamCalls = 0;
let confirmCancellation: (() => void) | undefined;
const upstreamCancellation = new Promise<void>((resolve) => { confirmCancellation = resolve; });
function providerEvent(property: string, value: unknown): void {
    backendBus.dispatchEvent(new CustomEvent(property, { detail: { source: 'backend:gemini', property, value, timestamp: Date.now() } }));
}
backendBus.addEventListener(GeminiSignalType.STREAM, (event: Event) => {
    event.stopImmediatePropagation();
    const { detail: { value } } = event as CustomEvent<Signal>;
    const { prompt, sessionId, systemInstruction, temperature, maxOutputTokens, schema } = value as Record<string, unknown>;
    assert.equal(systemInstruction, SYSTEM_INSTRUCTION); assert.equal(temperature, 0); assert.equal(maxOutputTokens, 12); assert.deepEqual(schema, { type: 'object' });
    assert.deepEqual(JSON.parse(String(prompt)), contract);
    const stream = new ReadableStream<string>({
        start(controller) {
            controller.enqueue('layout');
            if (sessionId !== 'cancel-stream') {
                controller.close();
            }
        },
        cancel() { confirmCancellation?.(); },
    });
    providerEvent(GeminiSignalType.STREAMED, { stream, sessionId });
});
async function inferArea(areaId: string): Promise<unknown> {
    const response = await originalFetch(`${endpoint}/api/llm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(evaluation(areaId)) });
    return response.json();
}
try {
    globalThis.fetch = async (url, options) => {
        if (!String(url).startsWith('https://api.typesafe.ai/')) { assert.equal(new Headers(options?.headers).get('Authorization'), null); return originalFetch(url, options); }
        upstreamCalls += 1;
        assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer server-only-key');
        const { state, questions } = JSON.parse(String(options?.body));
        assert.equal(questions.ready.type, 'noul');
        assert.match(questions.ready.instructions, /"goal":"Evaluate"/);
        assert.match(questions.ready.instructions, /"limits":\{"width":640\}/);
        await new Promise((resolve) => setTimeout(resolve, state.areaId === 'first' ? 30 : 5));
        if (state.areaId === 'failed') { return new Response('Unavailable', { status: 503 }); }
        return Response.json({ answers: { areaId: state.areaId } });
    };
    emitSignal(backendBus, backend.updateEvent, { ...Server.disposition, aim: { description: Server.purpose, body: { port: 39125, hostname: '127.0.0.1', autoStart: false } } });
    assert.equal(backend.registry.has('backend:llm'), false);
    assert.ok(backend.registry.has('backend:jev')); assert.ok(backend.registry.has('backend:gemini'));
    emitSignal(backendBus, SignalType.START, { port: 39125, hostname: '127.0.0.1' });
    emitSignal(clientBus, client.updateEvent, { ...Llm.disposition, aim: { description: Llm.purpose, body: { endpoint: `${endpoint}/api/llm`, streamEndpoint: `${endpoint}/api/llm/sse` } } });
    const completion = once(clientBus, LlmSignalType.INFERRED, { signal: AbortSignal.timeout(4000) });
    emitSignal(clientBus, LlmSignalType.INFER, { ...evaluation('root'), id: client.id });
    const [completed] = await completion;
    const { detail: { value: result, targetId } } = completed as CustomEvent<Signal<Record<string, unknown>>>;
    assert.deepEqual(result.data, { areaId: 'root' }); assert.deepEqual(result.context, { areaId: 'root' }); assert.equal(targetId, 'test-client');
    const concurrent = await Promise.all([inferArea('first'), inferArea('second')]);
    assert.deepEqual(concurrent.map((value) => (value as { sessionId: string }).sessionId), ['first', 'second']);
    assert.deepEqual(concurrent.map((value) => (value as { data: unknown }).data), [{ areaId: 'first' }, { areaId: 'second' }]);
    const failed = await inferArea('failed') as { error: string; sessionId: string };
    assert.match(failed.error, /Jev HTTP 503/); assert.equal(failed.sessionId, 'failed');
    assert.equal(upstreamCalls, 4);
    const streamed = once(clientBus, LlmSignalType.STREAMED, { signal: AbortSignal.timeout(4000) });
    const ended = once(clientBus, LlmSignalType.STREAM_END, { signal: AbortSignal.timeout(4000) });
    emitSignal(clientBus, LlmSignalType.STREAM, { ...contract, id: client.id, provider: 'gemini', imagination: 0, limit: 12, sessionId: 'layout' });
    const [received] = await streamed;
    const { detail: { value: { stream, sessionId } } } = received as CustomEvent<Signal<import('@uca/llm/types').StreamResult>>;
    assert.equal(sessionId, 'layout');
    assert.equal(await new Response(stream.pipeThrough(new TextEncoderStream())).text(), 'layout');
    assert.equal((received as CustomEvent<Signal>).detail.targetId, 'client');
    await ended;
    assert.equal(observed.filter(({ source, property }) => source === 'backend' && property === LlmSignalType.INFERRED).length, 3);
    assert.equal(observed.filter(({ source, property }) => source === 'backend' && property === LlmSignalType.ERROR).length, 1);
    assert.equal(observed.filter(({ source, property }) => source === 'backend' && property === LlmSignalType.STREAM_END).length, 1);
    const cancellable = once(clientBus, LlmSignalType.STREAMED, { signal: AbortSignal.timeout(4000) });
    emitSignal(clientBus, LlmSignalType.STREAM, { ...contract, id: client.id, provider: 'gemini', imagination: 0, limit: 12, sessionId: 'cancel-stream' });
    const [cancellableEvent] = await cancellable;
    const { detail: { value: { stream: cancellableStream } } } = cancellableEvent as CustomEvent<Signal<import('@uca/llm/types').StreamResult>>;
    const cancellableReader = cancellableStream.getReader();
    assert.deepEqual(await cancellableReader.read(), { done: false, value: 'layout' });
    await cancellableReader.cancel();
    await Promise.race([upstreamCancellation, new Promise((_, reject) => { setTimeout(() => reject(new Error('HTTP disconnect did not cancel the provider stream')), 2000).unref(); })]);
    const rejected = await originalFetch(`${endpoint}/api/llm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request: 'Legacy input', sessionId: 'invalid' }) });
    const invalid = await rejected.json() as { error: string; sessionId: string };
    assert.equal(rejected.ok, false); assert.equal(invalid.sessionId, 'invalid'); assert.match(invalid.error, /outputSchema/);
    assert.equal(upstreamCalls, 4, 'Invalid HTTP contracts cannot reach a provider');
    const invalidStream = await originalFetch(`${endpoint}/api/llm/sse`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...contract, goal: '', sessionId: 'invalid-stream' }) });
    const invalidFrames = await invalidStream.text();
    assert.match(invalidFrames, /error/); assert.match(invalidFrames, /invalid-stream/);

} finally {
    emitSignal(backendBus, SignalType.STOP, undefined); backend.denervate(); client.denervate(); globalThis.fetch = originalFetch;
    if (originalKey === undefined) { delete process.env.JEV_API_KEY; } else { process.env.JEV_API_KEY = originalKey; }
    if (originalMode === undefined) { delete process.env.NODE_ENV; } else { process.env.NODE_ENV = originalMode; }
}
console.log('✔ Client Llm → local backend → Jev, concurrent responses and SSE verified');

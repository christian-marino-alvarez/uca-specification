import assert from 'node:assert/strict';
import { createSseStream, requestStreamSource } from '../sse.js';
import { SignalType } from '@uca/llm/types';
import type { StreamSource } from '../types.js';

let reads = 0, cancelled = 0, completed = 0, cleaned = 0;
const upstream = new ReadableStream<string>({
    pull(controller) { reads += 1; controller.enqueue(`piece-${reads}`); },
    cancel() { cancelled += 1; },
}, { highWaterMark: 0 });
const abort = new AbortController();
const encoded = createSseStream(Promise.resolve({ stream: upstream }), 'bounded', abort, () => { cleaned += 1; }, () => { completed += 1; });
await Promise.resolve();
assert.equal(reads, 0, 'The HTTP bridge must not read without downstream demand');
const reader = encoded.getReader();
const first = await reader.read();
assert.equal(reads, 1);
assert.match(new TextDecoder().decode(first.value), /"text":"piece-1"/);
await Promise.resolve();
assert.equal(reads, 1, 'A paused HTTP consumer must leave the provider iterator paused');
await reader.cancel();
assert.equal(cancelled, 1); assert.equal(abort.signal.aborted, true);
assert.equal(completed, 0, 'Cancellation must not emit successful completion');
assert.equal(cleaned, 1);

let coldCancelled = false;
const cold = new ReadableStream<string>({ cancel() { coldCancelled = true; } }, { highWaterMark: 0 });
await createSseStream(Promise.resolve({ stream: cold }), 'cold', new AbortController(), () => {}, () => {}).cancel();
assert.equal(coldCancelled, true, 'Cancellation before the first read releases the delivered provider stream');

const failure = new ReadableStream<string>({ pull(controller) { controller.error(new Error('provider disconnected')); } }, { highWaterMark: 0 });
const failedResponse = createSseStream(Promise.resolve({ stream: failure }), 'failure', new AbortController(), () => {}, () => { completed += 1; });
const failedFrames = await new Response(failedResponse).text();
assert.match(failedFrames, /provider disconnected/);
assert.match(failedFrames, /"sessionId":"failure"/);
assert.doesNotMatch(failedFrames, /"done":true/);
assert.equal(completed, 0);

const bus = new EventTarget(), waitingAbort = new AbortController();
let requested = false, aborted = false;
const source = requestStreamSource({ target: bus, source: 'backend', sessionId: 'waiting', abort: waitingAbort.signal, request() { requested = true; }, cancel() { aborted = true; } });
assert.equal(requested, true);
waitingAbort.abort(new Error('cancel before provider is ready'));
assert.equal(aborted, true);
const abandoned = await source;
assert.match(String(abandoned.error), /cancel before provider is ready/);

let settlePending: ((source: StreamSource) => void) | undefined;
const deferred = new Promise<StreamSource>((resolve) => { settlePending = resolve; });
const pendingAbort = new AbortController();
pendingAbort.signal.addEventListener('abort', () => { settlePending?.({ error: pendingAbort.signal.reason }); });
const pending = createSseStream(deferred, 'pending', pendingAbort, () => {}, () => {});
const pendingReader = pending.getReader();
const outstandingRead = pendingReader.read();
await pendingReader.cancel();
assert.deepEqual(await outstandingRead, { done: true, value: undefined });

const successful = new ReadableStream<string>({ start(controller) { controller.enqueue('valid'); controller.close(); } });
const ready = requestStreamSource({
    target: bus, source: 'backend', sessionId: 'ready', abort: new AbortController().signal, cancel() {},
    request() { bus.dispatchEvent(new CustomEvent(SignalType.STREAMED, { detail: { source: 'backend', property: SignalType.STREAMED, value: { sessionId: 'ready', stream: successful } } })); },
});
const response = createSseStream(ready, 'ready', new AbortController(), () => {}, () => { completed += 1; });
assert.match(await new Response(response).text(), /"done":true/);
assert.equal(completed, 1);
console.log('✔ SSE bridge backpressure, cancellation races, source errors and final completion verified');

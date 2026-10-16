import { DEFAULT_HIGH_WATER_MARK, DEFAULT_MAX_ATTEMPTS, DEFAULT_MAX_BUFFER_SIZE, DEFAULT_TIMEOUT_MS } from './constants.js';
import { createParser } from './parser.js';
import { resolveObject } from './recovery.js';
import { Mode, type ReaderCleanup, type RequestCallback, type Resolution, type Session, type TransformPayload } from './types.js';

export function createPipeline(payload: TransformPayload, session: Session, request: RequestCallback, cleanup: ReaderCleanup): ReadableStream<Record<string, unknown>> {
    const { stream, mode = Mode.ENTRIES, schema, maxAttempts = DEFAULT_MAX_ATTEMPTS, timeoutMs = DEFAULT_TIMEOUT_MS, maxBufferSize = DEFAULT_MAX_BUFFER_SIZE } = payload;
    const { sessionId, controller: abortController, correlationId, streamId, context } = session;
    const { signal } = abortController;
    const resolution: Resolution = { sessionId, signal, correlationId, streamId, context, mode, schema, maxAttempts, timeoutMs, maxBufferSize, acceptedKeys: [], acceptedKeySize: 0 };
    const open = () => stream.pipeThrough(createParser(mode, maxBufferSize), { signal }).pipeThrough(createValidation(resolution, request), { signal });
    return createOutput(open, abortController, cleanup);
}

function createValidation(resolution: Resolution, request: RequestCallback): TransformStream<Record<string, unknown>, Record<string, unknown>> {
    return new TransformStream({
        async transform(value, controller) {
            const accepted = await resolveObject(value, resolution, request);
            retainAcceptedKeys(accepted, resolution);
            controller.enqueue(accepted);
        },
    });
}

function retainAcceptedKeys(value: Record<string, unknown>, resolution: Resolution): void {
    const { acceptedKeys, acceptedKeySize, maxBufferSize } = resolution;
    const keys = Object.keys(value);
    const size = keys.reduce((length, key) => length + key.length, acceptedKeySize);
    if (size > maxBufferSize) {
        throw new RangeError(`Accepted identifiers exceed ${maxBufferSize} characters`);
    }
    acceptedKeys.push(...keys);
    resolution.acceptedKeySize = size;
}

function createOutput(open: () => ReadableStream<Record<string, unknown>>, abortController: AbortController, cleanup: ReaderCleanup): ReadableStream<Record<string, unknown>> {
    const reader = openReader(open, cleanup);
    return new ReadableStream({
        async pull(controller) { await readOutput(reader, controller, cleanup); },
        async cancel(reason) {
            abortController.abort(reason);
            await reader.cancel(reason);
            cleanup();
        },
    }, { highWaterMark: DEFAULT_HIGH_WATER_MARK });
}

function openReader(open: () => ReadableStream<Record<string, unknown>>, cleanup: ReaderCleanup): ReadableStreamDefaultReader<Record<string, unknown>> {
    try {
        return open().getReader();
    }
    catch (error) {
        cleanup(error);
        return new ReadableStream<Record<string, unknown>>({ start(controller) { controller.error(error); } }).getReader();
    }
}

async function readOutput(reader: ReadableStreamDefaultReader<Record<string, unknown>>, controller: ReadableStreamDefaultController<Record<string, unknown>>, cleanup: ReaderCleanup): Promise<void> {
    try {
        const result = await reader.read();
        deliverOutput(result, controller, cleanup);
    }
    catch (error) {
        cleanup(error);
        controller.error(error);
    }
}

function deliverOutput(result: ReadableStreamReadResult<Record<string, unknown>>, controller: ReadableStreamDefaultController<Record<string, unknown>>, cleanup: ReaderCleanup): void {
    const { done, value } = result;
    if (done) {
        cleanup();
        controller.close();
        return;
    }
    controller.enqueue(value);
}

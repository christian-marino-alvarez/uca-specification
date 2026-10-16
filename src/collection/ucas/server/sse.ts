import type { Signal } from '@uca/core/types';
import type { Failure, StreamResult } from '@uca/llm/types';
import { STREAM_SOURCE_SIGNALS } from './constants.js';
import type { StreamBinding, StreamFrame, StreamSource, StreamSourceRequest } from './types.js';

export function requestStreamSource(binding: StreamSourceRequest): Promise<StreamSource> {
    const { target, abort, request, cancel } = binding;
    return new Promise((resolve) => {
        const finish = (value: StreamSource) => { STREAM_SOURCE_SIGNALS.forEach((property) => target?.removeEventListener(property, listener)); abort.removeEventListener('abort', cancelled); resolve(value); };
        const listener = (event: Event) => receiveSource(event, binding, finish);
        const cancelled = () => { cancel(); finish({ error: abort.reason }); };
        STREAM_SOURCE_SIGNALS.forEach((property) => target?.addEventListener(property, listener));
        abort.addEventListener('abort', cancelled, { once: true }); request();
    });
}

function receiveSource(event: Event, binding: StreamSourceRequest, finish: (value: StreamSource) => void): void {
    const { source: expectedSource, correlationId } = binding;
    const { detail: { source, value } } = event as CustomEvent<Signal<StreamResult & Failure>>;
    const { correlationId: receivedId, stream, error } = value;
    if (source !== expectedSource || receivedId !== correlationId) {
        return;
    }
    finish({ stream, error });
}

export function createSseStream(source: Promise<StreamSource>, correlationId: string, abort: AbortController, cleanup: () => void, completed: () => void): ReadableStream<Uint8Array> {
    const binding: StreamBinding = { source, correlationId, abort, cleanup, completed, cancelled: false };
    return new ReadableStream<Uint8Array>({
        pull: (controller) => pullFrame(binding, controller),
        cancel: (reason) => cancelStream(binding, reason),
    }, { highWaterMark: 0 });
}

async function pullFrame(binding: StreamBinding, controller: ReadableStreamDefaultController<Uint8Array>): Promise<void> {
    try {
        const frame = await readFrame(binding);
        writeFrame(binding, controller, frame);
    } catch (error) {
        writeFrame(binding, controller, { error: String(error) });
    }
}

async function readFrame(binding: StreamBinding): Promise<StreamFrame> {
    const { source } = binding;
    const { stream, error } = await source;
    binding.reader ??= stream?.getReader();
    const { reader } = binding;
    if (!reader) {
        throw error;
    }
    const { done, value: text } = await reader.read();
    return { text, ...(done && { done }) };
}

function writeFrame(binding: StreamBinding, controller: ReadableStreamDefaultController<Uint8Array>, frame: StreamFrame): void {
    const { cancelled, correlationId } = binding;
    if (cancelled) {
        return;
    }
    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ ...frame, correlationId })}\n\n`));
    completeFrame(binding, controller, frame);
}

function completeFrame(binding: StreamBinding, controller: ReadableStreamDefaultController<Uint8Array>, frame: StreamFrame): void {
    const { cleanup, completed } = binding;
    const { done, error } = frame;
    if (done || error) {
        cleanup(); controller.close();
    }
    if (done) {
        completed();
    }
}

async function cancelStream(binding: StreamBinding, reason: unknown): Promise<void> {
    const { source, abort, cleanup } = binding;
    binding.cancelled = true; abort.abort(reason); cleanup();
    const { stream } = await source;
    const { reader } = binding;
    await (reader ? reader.cancel(reason) : stream?.cancel(reason));
}

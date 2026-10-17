import assert from 'node:assert/strict';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { StreamTransformer } from '../index.js';
import { SignalType, type TransformPayload, type TransformResult } from '../types.js';

export function emit(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

export function observe<T>(bus: EventTarget, property: string, callback: (value: T) => void): void {
    bus.addEventListener(property, (event) => callback(Capability.readPayload<T>(event) as T));
}

export function createHarness() {
    const bus = new EventTarget();
    const transformer = new StreamTransformer().innervate(bus);
    emit(bus, transformer.updateEvent, StreamTransformer.disposition);
    const start = (payload: TransformPayload) => transform(bus, payload);
    const dispose = () => { transformer.denervate(); };
    return { bus, transformer, start, dispose };
}

function transform(bus: EventTarget, payload: TransformPayload): ReadableStream<Record<string, unknown>> {
    let result: TransformResult | undefined;
    observe<TransformResult>(bus, SignalType.TRANSFORMED, (value) => { result = value; });
    emit(bus, SignalType.TRANSFORM, payload);
    assert.ok(result);
    const { stream } = result;
    return stream;
}

export function textStream(chunks: string[], cancel?: () => void): ReadableStream<string> {
    return new ReadableStream({
        start(controller) {
            chunks.forEach((chunk) => controller.enqueue(chunk));
            controller.close();
        },
        cancel,
    });
}

export function repair(bus: EventTarget, requestId: string, value: unknown): void {
    emit(bus, SignalType.REPAIR, {
        requestId,
        stream: textStream([
            JSON.stringify(value),
        ]),
    });
}

export async function collect(stream: ReadableStream<Record<string, unknown>>): Promise<Record<string, unknown>[]> {
    const values: Record<string, unknown>[] = [];
    await stream.pipeTo(new WritableStream({ write(value) { values.push(value); } }));
    return values;
}

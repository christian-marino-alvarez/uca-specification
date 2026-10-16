import assert from 'node:assert/strict';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { Schema } from '@uca/capability-schema';
import { SignalType as SchemaSignalType, type ValidatedResult, type ErrorResult } from '@uca/capability-schema/types';
import { StreamTransformer } from '../index.js';
import { SignalType, type TransformPayload, type TransformResult, type ValidationRequest } from '../types.js';

export function emit(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

export function observe<T>(bus: EventTarget, property: string, callback: (value: T) => void): void {
    bus.addEventListener(property, (event) => callback(Capability.readPayload<T>(event) as T));
}

export function activateSchema(bus: EventTarget): Schema {
    const schema = new Schema('schema').innervate(bus);
    emit(bus, schema.updateEvent, Schema.disposition);
    observe<ValidationRequest>(bus, SignalType.VALIDATE, ({ requestId, value, schema }) => emit(bus, SchemaSignalType.VALIDATE, { value, schema, context: requestId }));
    observe<ValidatedResult>(bus, SchemaSignalType.VALIDATED, ({ value, context }) => emit(bus, SignalType.ACCEPT, { requestId: context, value }));
    observe<ErrorResult>(bus, SchemaSignalType.ERROR, ({ error, context }) => emit(bus, SignalType.REJECT, { requestId: context, error }));
    return schema;
}

export function createHarness(validate = true) {
    const bus = new EventTarget();
    const transformer = new StreamTransformer().innervate(bus);
    emit(bus, transformer.updateEvent, StreamTransformer.disposition);
    const schema = validate ? activateSchema(bus) : undefined;
    const start = (payload: TransformPayload) => transform(bus, payload);
    const dispose = () => { transformer.denervate(); schema?.denervate(); };
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

export async function collect(stream: ReadableStream<Record<string, unknown>>): Promise<Record<string, unknown>[]> {
    const values: Record<string, unknown>[] = [];
    await stream.pipeTo(new WritableStream({ write(value) { values.push(value); } }));
    return values;
}

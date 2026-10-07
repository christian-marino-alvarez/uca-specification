import type { z } from 'zod';

export enum SignalType {
    TRANSFORM = 'stream-transformer.transform',
    TRANSFORMED = 'stream-transformer.transformed',
    ERROR = 'stream-transformer.error',
}

export enum DataType {
    TRANSFORM_PAYLOAD = 'TransformPayload',
    TRANSFORM_RESULT = 'TransformResult',
    RECORD = 'record',
    UNKNOWN = 'unknown',
}

export interface Body {
    readonly schema?: z.ZodTypeAny;
    readonly silent?: boolean;
}

export interface TransformPayload {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<string>;
    readonly schema?: z.ZodTypeAny;
}

export interface TransformResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<Record<string, unknown>>;
}

export interface ErrorResult {
    readonly action: string;
    readonly error: string;
}

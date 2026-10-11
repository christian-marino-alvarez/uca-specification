import type { Body, BuildPayload, Dimensions } from './schema.js';
export type { Body, BuildPayload, Dimensions };
export { bodySchema, buildPayloadSchema, dimensionsSchema } from './schema.js';

export enum SignalType {
    BUILD = 'builder.build',
    STREAM = 'builder.stream',
    UPDATE = 'builder.update',
    REMOVE = 'builder.remove',
    RESET = 'builder.reset',
    BUILT = 'builder.built',
    CREATED = 'builder.created',
    UPDATED = 'builder.updated',
    REMOVED = 'builder.removed',
    ERROR = 'builder.error',
}

export enum DataType {
    BODY = 'Body',
    BUILD_PAYLOAD = 'BuildPayload',
    STREAM_PAYLOAD = 'StreamPayload',
    BUILT_RESULT = 'BuiltResult',
    CREATED_RESULT = 'CreatedResult',
    UPDATED_RESULT = 'UpdatedResult',
    REMOVED_RESULT = 'RemovedResult',
    ERROR_RESULT = 'ErrorResult',
    UNKNOWN = 'unknown',
}

export interface StreamPayload {
    readonly stream: ReadableStream<BuildPayload | Record<string, BuildPayload>>;
    readonly correlationId?: string;
    readonly reset?: boolean;
}

export interface BuiltResult {
    readonly elementId: string;
    readonly parentTo?: string;
    readonly detail?: unknown;
}

export interface ErrorResult {
    readonly error: string;
    readonly correlationId?: string;
}

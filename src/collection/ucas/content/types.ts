import type { Scaffold } from '@uca/scaffold/schema';
import type { Body, CreatePayload, StreamPayload } from './schema.js';

export enum SignalType {
    CREATE = 'content.create',
    STREAM = 'content.stream',
    DESTROY = 'content.destroy',
    CREATED = 'content.created',
    STREAMED = 'content.streamed',
    CHUNK = 'content.chunk',
    ERROR = 'content.error',
}

export enum DataType {
    PAYLOAD = 'content.payload',
    RESULT = 'content.result',
    STREAM = 'content.stream',
    UNKNOWN = 'content.unknown',
    VOID = 'content.void',
}

export type { Body, CreatePayload, StreamPayload };

export interface ChunkResult {
    correlationId?: string;
    streamId?: string;
    chunk: Record<string, unknown>;
}

export interface StreamResult {
    correlationId?: string;
    streamId?: string;
    stream: ReadableStream<Record<string, unknown>>;
}

export interface CreatedResult {
    correlationId?: string;
    scaffold: Scaffold;
}

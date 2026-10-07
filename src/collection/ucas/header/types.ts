import type { Scaffold } from '@uca/scaffold/schema';
import type { Body, CreatePayload, StreamPayload } from './schema.js';

export enum SignalType {
    CREATE = 'header.create',
    STREAM = 'header.stream',
    DESTROY = 'header.destroy',
    CREATED = 'header.created',
    STREAMED = 'header.streamed',
    CHUNK = 'header.chunk',
    ERROR = 'header.error',
}

export enum DataType {
    PAYLOAD = 'header.payload',
    RESULT = 'header.result',
    STREAM = 'header.stream',
    UNKNOWN = 'header.unknown',
    VOID = 'header.void',
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

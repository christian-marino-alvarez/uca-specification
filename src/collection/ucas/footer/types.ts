import type { Scaffold } from '@uca/scaffold/schema';
import type { Body, CreatePayload, StreamPayload } from './schema.js';

export enum SignalType {
    CREATE = 'footer.create',
    STREAM = 'footer.stream',
    DESTROY = 'footer.destroy',
    CREATED = 'footer.created',
    STREAMED = 'footer.streamed',
    CHUNK = 'footer.chunk',
    ERROR = 'footer.error',
}

export enum DataType {
    PAYLOAD = 'footer.payload',
    RESULT = 'footer.result',
    STREAM = 'footer.stream',
    UNKNOWN = 'footer.unknown',
    VOID = 'footer.void',
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

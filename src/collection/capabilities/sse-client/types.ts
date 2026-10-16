export enum SignalType {
    STREAM = 'sse-client.stream',
    ABORT = 'sse-client.abort',
    STREAMED = 'sse-client.streamed',
    CHUNK = 'sse-client.chunk',
    END = 'sse-client.end',
    ABORTED = 'sse-client.aborted',
    ERROR = 'sse-client.error',
}

export enum DataType {
    STREAM_PAYLOAD = 'StreamPayload',
    STREAM_RESULT = 'StreamResult',
    CHUNK_PAYLOAD = 'ChunkPayload',
    ERROR_PAYLOAD = 'ErrorPayload',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export interface Body {
    readonly id?: string;
    readonly endpoint?: string;
}

export interface StreamPayload {
    readonly endpoint?: string;
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly request?: unknown;
    readonly model?: string;
    readonly provider?: string;
    readonly imagination?: number;
    readonly schema?: unknown;
    readonly maxTokens?: number;
    readonly context?: unknown;
}

export interface StreamResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<string>;
    readonly context?: unknown;
}

export interface ChunkPayload {
    readonly correlationId?: string;
    readonly chunk: string;
}

export interface ErrorPayload {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly error: string;
    readonly context?: unknown;
}

export interface ActiveStream {
    readonly controller: AbortController;
    readonly correlationId: string;
}

export interface Frame { readonly text?: string; readonly error?: string; }
export type ReadResult = ReadableStreamReadResult<string>;

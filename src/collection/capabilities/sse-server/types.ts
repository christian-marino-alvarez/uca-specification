import type { Body } from './schema.js';

export enum SignalType {
    OPEN = 'sse-server.open',
    OPENED = 'sse-server.opened',
    COMPLETED = 'sse-server.completed',
    CANCELLED = 'sse-server.cancelled',
    ERROR = 'sse-server.error',
}

export enum DataType {
    OPEN_PAYLOAD = 'OpenPayload',
    OPENED_PAYLOAD = 'OpenedPayload',
    COMPLETED_PAYLOAD = 'CompletedPayload',
    CANCELLED_PAYLOAD = 'CancelledPayload',
    ERROR_PAYLOAD = 'ErrorPayload',
}

export interface OpenPayload {
    readonly sessionId: string;
    readonly request: (abort: AbortSignal) => void;
    readonly cancel: () => void;
}

export interface OpenedPayload {
    readonly sessionId: string;
    readonly stream: ReadableStream<Uint8Array>;
}

export interface CompletedPayload {
    readonly sessionId: string;
}

export interface CancelledPayload {
    readonly sessionId: string;
    readonly reason?: unknown;
}

export interface ErrorPayload {
    readonly sessionId: string;
    readonly error: unknown;
}

export interface Source {
    readonly stream?: ReadableStream<string>;
    readonly error?: unknown;
}

export interface Binding {
    readonly sessionId: string;
    readonly controller: AbortController;
    readonly request: (abort: AbortSignal) => void;
    readonly cancel: () => void;
    readonly source: Promise<Source>;
    readonly resolveSource: (source: Source) => void;
    reader?: ReadableStreamDefaultReader<string>;
    completed: boolean;
}

export type { Body } from './schema.js';

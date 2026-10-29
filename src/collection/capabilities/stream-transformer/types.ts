import type { z } from 'zod';

export enum SignalType {
    TRANSFORM = 'stream-transformer.transform',
    REPAIR = 'stream-transformer.repair',
    CANCEL = 'stream-transformer.cancel',
    TRANSFORMED = 'stream-transformer.transformed',
    CHUNK = 'stream-transformer.chunk',
    COMPLETE = 'stream-transformer.complete',
    RECOVER = 'stream-transformer.recover',
    ERROR = 'stream-transformer.error',
}

export enum DataType {
    TRANSFORM_PAYLOAD = 'TransformPayload',
    TRANSFORM_RESULT = 'TransformResult',
    CHUNK_RESULT = 'ChunkResult',
    COMPLETE_RESULT = 'CompleteResult',
    RECOVERY_REQUEST = 'RecoveryRequest',
    RESPONSE = 'Response',
    CANCELLATION = 'Cancellation',
    RECORD = 'record',
    UNKNOWN = 'unknown',
}

export enum Mode {
    ENTRIES = 'entries',
    DOCUMENT = 'document',
    ITEMS = 'items',
}
export enum EventType { ABORT = 'abort' }

export interface ChunkResult extends Identity {
    readonly item: Record<string, unknown>;
    readonly index: number;
}

export interface CompleteResult extends Identity {
    readonly total: number;
    readonly items: readonly Record<string, unknown>[];
}

export interface Body { readonly schema?: z.ZodType; readonly silent?: boolean; }
export interface Identity { readonly sessionId?: string; readonly correlationId?: string; readonly streamId?: string; readonly context?: unknown; }
export interface TransformPayload extends Identity {
    readonly stream: ReadableStream<string>;
    readonly schema?: z.ZodType;
    readonly mode?: Mode;
    readonly maxAttempts?: number;
    readonly timeoutMs?: number;
    readonly maxBufferSize?: number;
    readonly signal?: AbortSignal;
}
export interface TransformResult<TItem = Record<string, unknown>> extends Identity { readonly stream: ReadableStream<TItem>; }
export interface RecoveryRequest extends Identity {
    readonly message: string;
    readonly requestId: string;
    readonly value: unknown;
    readonly attempt: number;
    readonly error: unknown;
    readonly issues?: unknown;
    readonly acceptedKeys?: readonly string[];
}
export interface RepairPayload {
    readonly requestId: string;
    readonly stream?: ReadableStream<string>;
    readonly error?: unknown;
}
export interface CancelPayload { readonly correlationId?: string; readonly streamId?: string; }
export interface ErrorResult extends Identity { readonly error: unknown; }
export interface Response { readonly accepted: boolean; readonly value?: unknown; readonly error?: unknown; }
export interface Pending {
    readonly sessionId: string;
    readonly resolve: (response: Response) => void;
    readonly reject: (error: unknown) => void;
    readonly timer: ReturnType<typeof setTimeout>;
    readonly mode: Mode;
    readonly maxBufferSize: number;
}
export interface Session extends Identity {
    readonly sessionId: string;
    readonly controller: AbortController;
    readonly release: () => void;
}
export interface Resolution extends Identity {
    readonly sessionId: string;
    readonly schema?: z.ZodType;
    readonly mode: Mode;
    readonly maxAttempts: number;
    readonly timeoutMs: number;
    readonly signal: AbortSignal;
    readonly acceptedKeys: string[];
    readonly maxBufferSize: number;
    acceptedKeySize: number;
}
export interface Candidate { readonly value: unknown; readonly attempt: number; }
export interface ParserState {
    document: Record<string, unknown>;
    length: number;
    keyLength: number;
    buffer: string;
    prefix: string;
    suffix: string;
    started: boolean;
    completed: boolean;
    quoted: boolean;
    escaped: boolean;
    depth: number;
    readonly keys: Set<string | undefined>;
}
export type ReaderCleanup = (error?: unknown) => void;
export interface RequestFields { readonly value: unknown; readonly attempt: number; readonly error?: unknown; }
export type RequestCallback = (fields: RequestFields, resolution: Resolution) => Promise<Response>;

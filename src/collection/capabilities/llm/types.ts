import type {
    Contract,
    InferPayload,
    ProviderType,
    ThinkingLevel,
} from './schema.js';

export type {
    Contract,
    InferPayload,
    ProviderType,
    ThinkingLevel,
};

export enum SignalType {
    INFER = 'llm.infer',
    STREAM = 'llm.stream',
    STREAMING = 'llm.streaming',
    ABORT = 'llm.abort',
    STREAMED = 'llm.streamed',
    INFERRED = 'llm.inferred',
    CHUNK = 'llm.chunk',
    STREAM_END = 'llm.stream-end',
    CONNECT = 'llm.connect',
    CONNECTED = 'llm.connected',
    ERROR = 'llm.error',
}

export enum DataType {
    INFER_PAYLOAD = 'InferPayload',
    INFER_RESULT = 'InferResult',
    STREAM_RESULT = 'StreamResult',
    ABORT_PAYLOAD = 'AbortPayload',
    CHUNK_RESULT = 'ChunkResult',
    STREAM_END_RESULT = 'StreamEndResult',
    VOID = 'void',
    STRING = 'string',
    UNKNOWN = 'unknown',
}

export interface ValidationContext {
    readonly request?: InferPayload;
    readonly replyTo?: string;
    readonly operation: SignalType.INFER | SignalType.STREAM;
    readonly correlationId?: string;
    readonly provider?: import('./schema.js').ProviderType;
}

export interface InferResult {
    readonly correlationId?: string;
    readonly response?: string;
    readonly data?: unknown;
    readonly context?: unknown;
    readonly model?: string;
    readonly usage?: unknown;
}

export interface StreamResult {
    readonly request?: InferPayload;
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<string>;
    readonly context?: unknown;
    readonly model?: string;
}

export interface AbortPayload { readonly correlationId?: string; }

export interface ChunkResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly text: string;
    readonly prompt?: string;
    readonly model?: string;
}

export interface StreamEndResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly prompt?: string;
    readonly model?: string;
}

export type GeneratePayload = InferPayload;
export type GenerationResult = InferResult;

export type { Body } from './schema.js';

export interface Failure {
    readonly error?: unknown;
    readonly correlationId?: string;
    readonly context?: unknown;
}

export interface RepairContext {
    readonly requestId: string;
    readonly value: unknown;
    readonly error: unknown;
    readonly attempt: number;
    readonly accepted?: unknown;
    readonly acceptedKeys?: readonly string[];
}

export interface RepairFailure {
    readonly message: string;
    readonly issues?: unknown;
}

export interface TransportContext extends InferPayload { readonly replyTo?: string; }

export interface ChosenModelConfig {
    readonly provider: ProviderType;
    readonly model: string;
    readonly transport: 'batch' | 'stream';
    readonly imagination?: number;
    readonly limit?: number;
    readonly thinkingBudget?: number;
    readonly thinkingLevel?: ThinkingLevel;
}

export interface PendingInference {
    readonly payload: InferPayload;
    readonly replyTo: string;
    readonly cacheKey?: string;
    readonly operation?: SignalType;
}

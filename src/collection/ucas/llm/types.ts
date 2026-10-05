import type { ConnectionConfig as GeminiConnectionConfig, ThinkingLevel } from '@uca/capability-gemini/types';
import type { ConnectionConfig as OpenaiConnectionConfig } from '@uca/capability-openai/types';

export type ProviderType = 'openai' | 'gemini';
export type ConnectionConfig = GeminiConnectionConfig | OpenaiConnectionConfig;

export enum SignalType {
    INFER = 'llm.infer',
    STREAM = 'llm.stream',
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
    CHUNK_RESULT = 'ChunkResult',
    STREAM_END_RESULT = 'StreamEndResult',
    CONNECTION_CONFIG = 'ConnectionConfig',
    STRING = 'string',
    UNKNOWN = 'unknown',
}

export interface InferPayload {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly request: string;
    readonly provider?: ProviderType;
    readonly model?: string;
    readonly imagination?: number;
    readonly context?: unknown;
    readonly role?: string;
    readonly format?: string;
    readonly depth?: number;
    readonly limit?: number;
    readonly thinkingBudget?: number;
    readonly thinkingLevel?: ThinkingLevel;
    readonly expectations?: Record<string, unknown>;
}

export interface InferResult {
    readonly correlationId?: string;
    readonly response?: string;
    readonly data?: unknown;
    readonly context?: unknown;
    readonly model?: string;
    readonly usage?: unknown;
}

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

export interface Body {
    readonly provider?: ProviderType;
    readonly model?: string;
    readonly imagination?: number;
    readonly role?: string;
    readonly limit?: number;
    readonly thinkingBudget?: number;
    readonly thinkingLevel?: ThinkingLevel;
    readonly connection?: ConnectionConfig;
}


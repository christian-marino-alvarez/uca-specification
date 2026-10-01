import type { ConnectionConfig } from '@uca/capability-jev';

export enum SignalType {
    INFER = 'llm.infer',
    INFERRED = 'llm.inferred',
    CONNECT = 'llm.connect',
    CONNECTED = 'llm.connected',
    ERROR = 'llm.error',
}

export enum DataType {
    INFER_PAYLOAD = 'InferPayload',
    INFER_RESULT = 'InferResult',
    CONNECTION_CONFIG = 'ConnectionConfig',
    STRING = 'string',
    UNKNOWN = 'unknown',
}

export interface InferPayload {
    readonly request: string;
    readonly model?: string;
    readonly imagination?: number;
    readonly context?: unknown;
    readonly role?: string;
    readonly format?: string;
    readonly depth?: number;
    readonly limit?: number;
    readonly expectations?: Record<string, unknown>;
}

export interface InferResult {
    readonly response?: string;
    readonly data?: unknown;
    readonly context?: unknown;
    readonly model?: string;
}

export type GeneratePayload = InferPayload;
export type GenerationResult = InferResult;

export interface Body {
    readonly model?: string;
    readonly imagination?: number;
    readonly role?: string;
    readonly limit?: number;
    readonly connection?: ConnectionConfig;
}


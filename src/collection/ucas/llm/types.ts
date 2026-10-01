import type { ConnectionConfig } from '@uca/capability-jev';

export enum SignalType {
    GENERATE = 'llm.generate',
    GENERATED = 'llm.generated',
    CONNECT = 'llm.connect',
    CONNECTED = 'llm.connected',
    ERROR = 'llm.error',
}

export enum DataType {
    GENERATE_PAYLOAD = 'GeneratePayload',
    GENERATION_RESULT = 'GenerationResult',
    CONNECTION_CONFIG = 'ConnectionConfig',
    STRING = 'string',
    UNKNOWN = 'unknown',
}

export interface GeneratePayload {
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

export interface GenerationResult {
    readonly response?: string;
    readonly data?: unknown;
    readonly context?: unknown;
    readonly model?: string;
}

export interface Body {
    readonly model?: string;
    readonly imagination?: number;
    readonly role?: string;
    readonly limit?: number;
    readonly connection?: ConnectionConfig;
}


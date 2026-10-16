
export enum SignalType {
    CONNECT = 'jev.connect',
    INFER = 'jev.infer',
    CONNECTED = 'jev.connected',
    INFERRED = 'jev.inferred',
    ERROR = 'jev.error',
}

export enum DataType {
    CONNECTION_CONFIG = 'ConnectionConfig',
    INFER_PAYLOAD = 'InferPayload',
    CONNECTION_STATUS = 'ConnectionStatus',
    INFER_RESULT = 'InferResult',
    UNKNOWN = 'unknown',
}

export interface ConnectionConfig {
    readonly apiKey?: string;
    readonly baseURL?: string;
    readonly defaultModel?: string;
    readonly limit?: number;
    readonly maxTokens?: number;
}

export interface ConnectionStatus {
    readonly status: string;
    readonly connection?: ConnectionConfig;
}

export interface InferPayload {
    readonly id?: string;
    readonly state: unknown;
    readonly questions: Record<string, unknown>;
    readonly model?: string;
    readonly limit?: number;
    readonly maxTokens?: number;
    readonly correlationId?: string;
}

export interface InferResult {
    readonly state: unknown;
    readonly answers: Record<string, unknown>;
    readonly model?: string;
    readonly correlationId?: string;
}

export interface Body {
    readonly id?: string;
    readonly connection?: ConnectionConfig;
    readonly limit?: number;
    readonly maxTokens?: number;
}


export interface Question { readonly type?: string; readonly instructions?: unknown; readonly options?: Record<string, string>; readonly criteria?: unknown; }
export interface RequestBody { readonly state: unknown; readonly questions: Record<string, unknown>; readonly model: string; readonly limit?: number; readonly max_tokens?: number; }

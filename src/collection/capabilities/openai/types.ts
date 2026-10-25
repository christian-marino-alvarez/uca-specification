import type OpenAI from 'openai';

export enum SignalType {
    CONNECT = 'openai.connect',
    GENERATE = 'openai.generate',
    STREAM = 'openai.stream',
    ABORT = 'openai.abort',
    STREAMED = 'openai.streamed',
    CONNECTED = 'openai.connected',
    GENERATED = 'openai.generated',
    CHUNK = 'openai.chunk',
    STREAM_END = 'openai.stream-end',
    ERROR = 'openai.error',
}

export enum DataType {
    CONNECTION_CONFIG = 'ConnectionConfig',
    GENERATE_PAYLOAD = 'GeneratePayload',
    CONNECTION_STATUS = 'ConnectionStatus',
    GENERATE_RESULT = 'GenerateResult',
    STREAM_RESULT = 'StreamResult',
    ABORT_PAYLOAD = 'AbortPayload',
    CHUNK_RESULT = 'ChunkResult',
    STREAM_END_RESULT = 'StreamEndResult',
    UNKNOWN = 'unknown',
}

export interface ConnectionConfig {
    readonly apiKey?: string;
    readonly baseURL?: string;
    readonly defaultModel?: string;
}

export interface ConnectionStatus {
    readonly status: string;
    readonly connection?: ConnectionConfig;
}

export interface GeneratePayload {
    readonly id?: string;
    readonly sessionId?: string;
    readonly streamId?: string;
    readonly prompt: string;
    readonly systemInstruction?: string;
    readonly schema?: Record<string, unknown>;
    readonly model?: string;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
}

export interface GenerateResult {
    readonly sessionId?: string;
    readonly prompt: string;
    readonly text?: string;
    readonly data?: unknown;
    readonly model?: string;
    readonly usage?: unknown;
}

export interface ChunkResult {
    readonly sessionId?: string;
    readonly streamId?: string;
    readonly text: string;
    readonly prompt?: string;
    readonly model?: string;
}

export interface StreamEndResult {
    readonly sessionId?: string;
    readonly streamId?: string;
    readonly prompt?: string;
    readonly model?: string;
}

export interface Body {
    readonly id?: string;
    readonly client?: OpenAI;
    readonly connection?: ConnectionConfig;
    readonly model?: string;
}

export interface StreamResult { readonly sessionId?: string; readonly streamId?: string; readonly stream: ReadableStream<string>; }

export type StreamIterator = AsyncIterator<import('openai').default.Chat.Completions.ChatCompletionChunk>;

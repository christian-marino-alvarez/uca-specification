import type { GoogleGenAI } from '@google/genai';

export enum SignalType {
    CONNECT = 'gemini.connect',
    GENERATE = 'gemini.generate',
    STREAM = 'gemini.stream',
    ABORT = 'gemini.abort',
    STREAMED = 'gemini.streamed',
    CONNECTED = 'gemini.connected',
    GENERATED = 'gemini.generated',
    CHUNK = 'gemini.chunk',
    STREAM_END = 'gemini.stream-end',
    ERROR = 'gemini.error',
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

export enum ThinkingLevel {
    MINIMAL = 'minimal',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
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
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly prompt: string;
    readonly systemInstruction?: string;
    readonly schema?: Record<string, unknown>;
    readonly model?: string;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
    readonly thinkingBudget?: number;
    readonly thinkingLevel?: ThinkingLevel;
    readonly responseMimeType?: string;
}

export interface GenerateResult {
    readonly correlationId?: string;
    readonly prompt: string;
    readonly text?: string;
    readonly data?: unknown;
    readonly model?: string;
    readonly usage?: Record<string, unknown>;
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

export interface Body {
    readonly id?: string;
    readonly client?: GoogleGenAI;
    readonly connection?: ConnectionConfig;
    readonly model?: string;
    readonly thinkingBudget?: number;
    readonly thinkingLevel?: ThinkingLevel;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
    readonly systemInstruction?: string;
    readonly responseMimeType?: string;
}

export interface StreamResult { readonly correlationId?: string; readonly streamId?: string; readonly stream: ReadableStream<string>; }

export interface ActiveStream {
    readonly controller: AbortController;
    readonly correlationId: string;
}

export interface AbortPayload {
    readonly correlationId?: string;
    readonly streamId?: string;
}

export type StreamIterator = AsyncIterator<{ text?: string }>;

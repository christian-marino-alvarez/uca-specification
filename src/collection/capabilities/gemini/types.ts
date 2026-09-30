import type { GoogleGenAI } from '@google/genai';

export enum SignalType {
    CONNECT = 'gemini.connect',
    GENERATE = 'gemini.generate',
    DISCONNECT = 'gemini.disconnect',
    ABORT = 'gemini.abort',
    STREAM = 'gemini.stream',
    CONNECTED = 'gemini.connected',
    CLOSED = 'gemini.closed',
    ERROR = 'gemini.error',
}

export interface ConnectionConfig {
    readonly apiKey?: string;
    readonly endpoint?: string;
    readonly model?: string;
}

export interface PromptConfig {
    readonly text: string;
    readonly context?: unknown;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
    readonly model?: string;
    readonly signal?: AbortSignal;
}

export type StreamOutput = ReadableStream<string>;

export interface StreamProvider {
    (config: PromptConfig): StreamOutput | Promise<StreamOutput>;
}

export interface Body extends Partial<PromptConfig> {
    readonly client?: GoogleGenAI;
    readonly connection?: ConnectionConfig;
    readonly streamProvider?: StreamProvider;
}


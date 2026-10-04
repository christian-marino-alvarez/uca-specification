import type { AILanguageModelFactory } from '@uca/capability-prompt-api';

export enum SignalType {
    PROMPT = 'llm-web.prompt',
    STREAM = 'llm-web.stream',
    RESPONSE = 'llm-web.response',
    STREAM_DECODED = 'llm-web.stream_decoded',
    ERROR = 'llm-web.error',
}

export enum DataType {
    PROMPT_PAYLOAD = 'PromptPayload',
    STREAM_PAYLOAD = 'StreamPayload',
    RESPONSE_PAYLOAD = 'ResponsePayload',
    STREAM_DECODED_PAYLOAD = 'StreamDecodedPayload',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export interface StreamDecodedPayload {
    readonly id?: string;
    readonly correlationId?: string;
    readonly streamId: string;
    readonly stream: ReadableStream<string>;
    readonly model?: string;
}

export interface PromptPayload {
    readonly id?: string;
    readonly correlationId?: string;
    readonly requestId?: string;
    readonly prompt: string;
    readonly provider?: string;
    readonly model?: string;
    readonly systemPrompt?: string;
    readonly schema?: Record<string, unknown>;
    readonly factory?: AILanguageModelFactory;
    readonly useRemote?: boolean;
    readonly thinkingBudget?: number;
}

export interface StreamPayload {
    readonly id?: string;
    readonly correlationId?: string;
    readonly prompt: string;
    readonly streamId?: string;
    readonly provider?: string;
    readonly model?: string;
    readonly systemPrompt?: string;
    readonly schema?: Record<string, unknown>;
    readonly factory?: AILanguageModelFactory;
    readonly useRemote?: boolean;
    readonly thinkingBudget?: number;
}

export interface ResponsePayload {
    readonly id?: string;
    readonly correlationId?: string;
    readonly response: string;
    readonly model?: string;
    readonly data?: unknown;
}

export interface Body {
    readonly endpoint?: string;
    readonly sseEndpoint?: string;
    readonly provider?: string;
    readonly model?: string;
    readonly factory?: AILanguageModelFactory;
    readonly useRemote?: boolean;
    readonly thinkingBudget?: number;
}

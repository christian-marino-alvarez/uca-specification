import type { AILanguageModelFactory } from '@uca/capability-prompt-api/types';

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

export interface CognitiveOptions {
    readonly determinism?: number;
    readonly imagination?: number;
    readonly deliberation?: number;
    readonly conciseness?: number;
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
    readonly purpose?: string;
    readonly aim?: { description: string; body?: unknown };
    readonly prompt?: string;
    readonly determinism?: number;
    readonly imagination?: number;
    readonly deliberation?: number;
    readonly conciseness?: number;
    readonly provider?: string;
    readonly model?: string;
    readonly systemPrompt?: string;
    readonly schema?: Record<string, unknown>;
    readonly factory?: AILanguageModelFactory;
    readonly useRemote?: boolean;
    readonly thinkingBudget?: number;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
}

export interface StreamPayload {
    readonly id?: string;
    readonly correlationId?: string;
    readonly purpose?: string;
    readonly aim?: { description: string; body?: unknown };
    readonly prompt?: string;
    readonly streamId?: string;
    readonly determinism?: number;
    readonly imagination?: number;
    readonly deliberation?: number;
    readonly conciseness?: number;
    readonly provider?: string;
    readonly model?: string;
    readonly systemPrompt?: string;
    readonly schema?: Record<string, unknown>;
    readonly factory?: AILanguageModelFactory;
    readonly useRemote?: boolean;
    readonly thinkingBudget?: number;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
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
    readonly determinism?: number;
    readonly imagination?: number;
    readonly deliberation?: number;
    readonly conciseness?: number;
    readonly provider?: string;
    readonly model?: string;
    readonly factory?: AILanguageModelFactory;
    readonly useRemote?: boolean;
    readonly thinkingBudget?: number;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
}

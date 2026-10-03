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
    readonly streamId: string;
    readonly stream: ReadableStream<string>;
    readonly model?: string;
}

export interface PromptPayload {
    readonly prompt: string;
    readonly model?: string;
    readonly systemPrompt?: string;
    readonly factory?: AILanguageModelFactory;
}

export interface StreamPayload {
    readonly prompt: string;
    readonly streamId?: string;
    readonly model?: string;
    readonly systemPrompt?: string;
    readonly factory?: AILanguageModelFactory;
}

export interface ResponsePayload {
    readonly response: string;
    readonly model?: string;
    readonly data?: unknown;
}

export interface Body {
    readonly endpoint?: string;
    readonly sseEndpoint?: string;
    readonly model?: string;
    readonly factory?: AILanguageModelFactory;
}

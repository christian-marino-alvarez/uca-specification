import type { PromptInput } from '@uca/capability-api-prompt/types';
export {
    type Body,
    type InferPayload,
    type Model,
    type Provider,
} from './schema.js';

export enum SignalType {
    CREATE = 'web-llm.create',
    STREAM = 'web-llm.stream',
    DESTROY = 'web-llm.destroy',
    CREATED = 'web-llm.created',
    READY = 'web-llm.ready',
    STREAMED = 'web-llm.streamed',
    DESTROYED = 'web-llm.destroyed',
    ERROR = 'web-llm.error',
}

export enum DataType {
    CREATE_PAYLOAD = 'CreatePayload',
    STREAM_PAYLOAD = 'StreamPayload',
    DESTROY_PAYLOAD = 'DestroyPayload',
    STREAM_RESULT = 'StreamResult',
    READY_RESULT = 'ReadyResult',
    DESTROY_RESULT = 'DestroyResult',
    UNKNOWN = 'unknown',
}

export interface CreatePayload {
    readonly model?: 'local' | 'nube' | 'cloud';
    readonly provider?: 'gemini-nano' | 'gemini' | 'openai';
    readonly imagination?: number;
    readonly schema?: Record<string, unknown>;
    readonly maxTokens?: number;
    readonly endpoint?: string;
    readonly systemPrompt?: string;
}

export interface StreamPayload {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly request: PromptInput | unknown;
    readonly model?: 'local' | 'nube' | 'cloud';
    readonly provider?: 'gemini-nano' | 'gemini' | 'openai';
    readonly imagination?: number;
    readonly schema?: Record<string, unknown>;
    readonly maxTokens?: number;
    readonly endpoint?: string;
}

export interface StreamResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<string>;
    readonly model: string;
    readonly provider: string;
}

export interface ReadyResult {
    readonly ready: boolean;
    readonly model: string;
    readonly provider: string;
}

export interface DestroyResult {
    readonly destroyed: boolean;
}

export interface ErrorResult {
    readonly action: string;
    readonly error: string;
}

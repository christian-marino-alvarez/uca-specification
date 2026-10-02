export enum SignalType {
    PROMPT = 'llm-web.prompt',
    STREAM = 'llm-web.stream',
    RESPONSE = 'llm-web.response',
    CHUNK = 'llm-web.chunk',
    COMPLETED = 'llm-web.completed',
    ERROR = 'llm-web.error',
}

export enum DataType {
    PROMPT_PAYLOAD = 'PromptPayload',
    STREAM_PAYLOAD = 'StreamPayload',
    RESPONSE_PAYLOAD = 'ResponsePayload',
    CHUNK_PAYLOAD = 'ChunkPayload',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export interface PromptPayload {
    readonly prompt: string;
    readonly model?: string;
}

export interface StreamPayload {
    readonly prompt: string;
    readonly model?: string;
}

export interface ResponsePayload {
    readonly response: string;
    readonly model?: string;
    readonly data?: unknown;
}

export interface ChunkPayload {
    readonly text: string;
    readonly model?: string;
}

export interface Body {
    readonly endpoint?: string;
    readonly sseEndpoint?: string;
    readonly model?: string;
}

export enum SignalType {
    CHECK = 'prompt-api.check',
    PROMPT = 'prompt-api.prompt',
    STREAM = 'prompt-api.stream',
    DESTROY = 'prompt-api.destroy',
    CHECKED = 'prompt-api.checked',
    RESPONDED = 'prompt-api.responded',
    CHUNK = 'prompt-api.chunk',
    STREAM_END = 'prompt-api.stream-end',
    ERROR = 'prompt-api.error',
}

export enum DataType {
    VOID = 'void',
    PROMPT_PAYLOAD = 'PromptPayload',
    PROMPT_RESULT = 'PromptResult',
    CHUNK_RESULT = 'ChunkResult',
    STREAM_END_RESULT = 'StreamEndResult',
    CAPABILITIES_RESULT = 'CapabilitiesResult',
    UNKNOWN = 'unknown',
}

export type AvailabilityStatus =
    | 'available'
    | 'downloadable'
    | 'downloading'
    | 'unavailable'
    | 'readily'
    | 'after-download'
    | 'no';

export interface CapabilitiesResult {
    readonly available: AvailabilityStatus;
    readonly defaultTemperature?: number;
    readonly maxTemperature?: number;
    readonly defaultTopK?: number;
    readonly maxTopK?: number;
}

export interface PromptPayload {
    readonly prompt: string;
    readonly systemPrompt?: string;
    readonly temperature?: number;
    readonly topK?: number;
    readonly factory?: AILanguageModelFactory;
}

export interface PromptResult {
    readonly prompt: string;
    readonly response: string;
}

export interface ChunkResult {
    readonly prompt: string;
    readonly chunk: string;
    readonly delta?: string;
    readonly text: string;
    readonly fullText?: string;
}

export interface StreamEndResult {
    readonly prompt: string;
    readonly text: string;
}

export interface AILanguageModelSession {
    prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>;
    promptStreaming(input: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
    append?(input: string): Promise<void>;
    destroy(): void;
}

export interface AILanguageModelCreateOptions {
    readonly systemPrompt?: string;
    readonly temperature?: number;
    readonly topK?: number;
    readonly signal?: AbortSignal;
}

export interface AILanguageModelFactory {
    availability?: () => Promise<AvailabilityStatus>;
    capabilities?: () => Promise<CapabilitiesResult>;
    create(options?: AILanguageModelCreateOptions): Promise<AILanguageModelSession>;
}

export interface Body {
    readonly factory?: AILanguageModelFactory;
    readonly systemPrompt?: string;
    readonly temperature?: number;
    readonly topK?: number;
}

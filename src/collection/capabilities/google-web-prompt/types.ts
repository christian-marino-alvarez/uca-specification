export enum SignalType {
    CHECK = 'google-web-prompt.check',
    CREATE = 'google-web-prompt.create',
    GENERATE = 'google-web-prompt.generate',
    DESTROY = 'google-web-prompt.destroy',
    ABORT = 'google-web-prompt.abort',
    STATUS = 'google-web-prompt.status',
    CREATED = 'google-web-prompt.created',
    STREAM = 'google-web-prompt.stream',
    DESTROYED = 'google-web-prompt.destroyed',
    ERROR = 'google-web-prompt.error',
}

export type AvailabilityStatus = 'available' | 'downloadable' | 'downloading' | 'unavailable';

export interface AvailabilityResult {
    readonly available: boolean;
    readonly status: AvailabilityStatus;
}

export interface SessionOptions {
    readonly temperature?: number;
    readonly topK?: number;
    readonly systemPrompt?: string;
    readonly outputLanguage?: string;
    readonly signal?: AbortSignal;
}

export interface PromptPayload {
    readonly text: string;
    readonly signal?: AbortSignal;
}

export type StreamOutput = ReadableStream<string>;

export interface PromptSession {
    prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>;
    promptStreaming(input: string, options?: { signal?: AbortSignal }): StreamOutput;
    destroy(): void;
}

export interface PromptAdapter {
    availability(): Promise<AvailabilityStatus>;
    create(options?: SessionOptions): Promise<PromptSession>;
}

export interface Body extends SessionOptions {
    readonly adapter?: PromptAdapter;
}

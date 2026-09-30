export enum SignalType {
    PROMPT = 'llm.prompt',
    STREAM = 'llm.stream',
    ABORT = 'llm.abort',
    RESPONSE = 'llm.response',
    ERROR = 'llm.error',
}

export type LlmProviderType = 'gemini' | 'google-web-prompt';

export interface PromptPayload {
    readonly text: string;
    readonly systemPrompt?: string;
    readonly context?: unknown;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
    readonly model?: string;
    readonly signal?: AbortSignal;
}

export interface Body {
    readonly provider?: LlmProviderType;
    readonly model?: string;
    readonly systemPrompt?: string;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
    readonly apiKey?: string;
}


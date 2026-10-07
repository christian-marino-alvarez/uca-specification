export enum SignalType {
    CHECK = 'api-prompt.check',
    CREATE = 'api-prompt.create',
    PROMPT = 'api-prompt.prompt',
    STREAM = 'api-prompt.stream',
    DESTROY = 'api-prompt.destroy',
    CHECKED = 'api-prompt.checked',
    DOWNLOADING = 'api-prompt.downloading',
    READY = 'api-prompt.ready',
    RESPONDED = 'api-prompt.responded',
    STREAMED = 'api-prompt.streamed',
    DESTROYED = 'api-prompt.destroyed',
    ERROR = 'api-prompt.error',
}

export enum DataType {
    VOID = 'void',
    RECORD = 'record',
    STRING = 'string',
    UNKNOWN = 'unknown',
}

export enum AvailabilityStatus {
    AVAILABLE = 'available',
    READILY = 'readily',
    AFTER_DOWNLOAD = 'after-download',
    DOWNLOADABLE = 'downloadable',
    DOWNLOADING = 'downloading',
    UNAVAILABLE = 'unavailable',
    NO = 'no',
}

export interface ExpectedInput {
    readonly type: 'text' | 'image' | 'audio' | string;
    readonly languages?: readonly string[];
}

export interface ExpectedOutput {
    readonly type: 'text' | string;
    readonly languages?: readonly string[];
}

export interface AvailabilityOptions {
    readonly expectedInputs?: readonly ExpectedInput[];
    readonly expectedOutputs?: readonly ExpectedOutput[];
    readonly temperature?: number;
    readonly topK?: number;
}

export interface CreateOptions extends AvailabilityOptions {
    readonly systemPrompt?: string;
    readonly signal?: AbortSignal;
    readonly monitor?: (monitor: DownloadMonitor) => void;
    readonly persistentSession?: boolean;
}

export interface Body {
    readonly id?: string;
    readonly model?: string;
    readonly temperature?: number;
    readonly topK?: number;
    readonly systemPrompt?: string;
    readonly expectedInputs?: readonly ExpectedInput[];
    readonly expectedOutputs?: readonly ExpectedOutput[];
    readonly silent?: boolean;
    readonly persistentSession?: boolean;
    readonly autoLoad?: boolean;
}

export interface AvailabilityResult {
    readonly available: boolean;
    readonly status: AvailabilityStatus | string;
    readonly expectedInputs?: readonly ExpectedInput[];
    readonly expectedOutputs?: readonly ExpectedOutput[];
}

export interface DownloadProgressPayload {
    readonly loaded: number;
    readonly total: number;
    readonly percentage: number;
}

export interface ReadyResult {
    readonly ready: boolean;
}

export interface TextPart {
    readonly type: 'text';
    readonly value: string;
}

export interface ImagePart {
    readonly type: 'image';
    readonly value: unknown;
}

export interface AudioPart {
    readonly type: 'audio';
    readonly value: unknown;
}

export type PromptPart = TextPart | ImagePart | AudioPart;

export interface PromptMessage {
    readonly role: 'system' | 'user' | 'assistant' | string;
    readonly content: string | readonly PromptPart[];
}

export type PromptInput = string | readonly PromptMessage[] | readonly PromptPart[];

export interface PromptPayload {
    readonly correlationId?: string;
    readonly prompt: PromptInput;
    readonly systemPrompt?: string;
}

export interface StreamPayload {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly prompt: PromptInput;
    readonly systemPrompt?: string;
}

export interface PromptResult {
    readonly correlationId?: string;
    readonly response: string;
}

export interface StreamResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<string>;
}

export interface ErrorResult {
    readonly action: string;
    readonly error: string;
}

export interface DestroyResult {
    readonly destroyed: boolean;
}

export interface DownloadProgressEvent extends Event {
    readonly loaded: number;
    readonly total: number;
}

export interface DownloadMonitor extends EventTarget {
}

export interface LanguageModelSession {
    prompt(input: PromptInput, options?: unknown): Promise<string>;
    promptStreaming(input: PromptInput, options?: unknown): ReadableStream<string>;
    destroy?(): void;
}

export interface LanguageModelApi {
    availability?: (options?: AvailabilityOptions) => Promise<string>;
    create?: (options?: CreateOptions) => Promise<LanguageModelSession>;
}

declare global {
    const LanguageModel: LanguageModelApi | undefined;
}

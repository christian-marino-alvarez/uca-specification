import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import {
    PromptApi,
    SignalType as PromptApiSignalType,
    type AILanguageModelFactory,
    type ChunkResult,
    type PromptPayload as PromptApiPayload,
    type PromptResult,
} from '@uca/capability-prompt-api';
import {
    __ID__,
    DEFAULT_ENDPOINT,
    DEFAULT_MODEL,
    DEFAULT_PROVIDER,
    DEFAULT_SIGNALS,
    DEFAULT_SSE_ENDPOINT,
    DEFAULT_USE_REMOTE,
} from './constants.js';
import {
    type Body,
    type PromptPayload,
    type ResponsePayload,
    type StreamPayload,
    DataType,
    SignalType,
} from './types.js';

export class LlmWeb extends Uca<Body> {
    public static override purpose: string = 'Orchestrate client-side LLM interactions and streaming cognitive sessions';

    public static override disposition: Disposition<Body> = {
        aim: { description: LlmWeb.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.PROMPT, type: DataType.PROMPT_PAYLOAD, description: 'Send prompt for standard LLM response' },
            { signal: SignalType.STREAM, type: DataType.STREAM_PAYLOAD, description: 'Open SSE stream for real-time tokens' },
        ],
        outputs: [
            { signal: SignalType.RESPONSE, type: DataType.RESPONSE_PAYLOAD, description: 'Standard LLM response received' },
            { signal: SignalType.STREAM_DECODED, type: DataType.STREAM_DECODED_PAYLOAD, description: 'Readable stream of decoded token texts' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'LLM connection error' },
        ],
    };

    private readonly activeControllers: Map<string, ReadableStreamDefaultController<string>> = new Map();
    private abortController?: AbortController;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? LlmWeb.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [
            PromptApiSignalType.RESPONDED,
            PromptApiSignalType.CHUNK,
            PromptApiSignalType.STREAM_END,
            PromptApiSignalType.ERROR,
        ];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    public override denervate(): void {
        this.abortController?.abort();
        this.abortController = undefined;
        this.activeControllers.clear();
        super.denervate();
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { factory } = (aim.body ?? {}) as Body;
        const promptDisp: Disposition = {
            aim: { description: PromptApi.AIM, body: { factory } },
            reactTo: [...PromptApi.disposition.reactTo ?? []],
        };
        return [[PromptApi, promptDisp]];
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.PROMPT:
                await this.handlePrompt(value);
                break;
            case SignalType.STREAM:
                await this.handleStream(value);
                break;
            case PromptApiSignalType.RESPONDED:
                this.handlePromptApiResponded(value);
                break;
            case PromptApiSignalType.CHUNK:
                this.handlePromptApiChunk(value);
                break;
            case PromptApiSignalType.STREAM_END:
                this.handlePromptApiStreamEnd();
                break;
            case PromptApiSignalType.ERROR:
                this.handlePromptApiError(value);
                break;
            default:
                break;
        }
    }

    private async handlePrompt(value: unknown): Promise<void> {
        const payload = (value ?? {}) as PromptPayload;
        if (!this.shouldUseRemote(payload) && this.isPromptApiAvailable(payload)) {
            const { id, ...promptApiPayload } = payload;
            this.pulse(PromptApiSignalType.PROMPT, promptApiPayload as PromptApiPayload);
            return;
        }
        await this.dispatchFetchPrompt(payload);
    }

    private async handleStream(value: unknown): Promise<void> {
        const payload = (value ?? {}) as StreamPayload;
        const { streamId } = payload;
        const activeStreamId = streamId ?? this.generateSessionId();
        if (!this.shouldUseRemote(payload) && this.isPromptApiAvailable(payload)) {
            this.delegatePromptApiStream(activeStreamId, payload);
            return;
        }
        await this.dispatchSseStream(payload, activeStreamId);
    }

    private shouldUseRemote(payload: { useRemote?: boolean; factory?: AILanguageModelFactory }): boolean {
        const { useRemote, factory: pFactory } = payload;
        const { aim } = this.disposition;
        const { useRemote: bRemote, factory: bFactory } = (aim.body ?? {}) as Body;
        const explicitRemote = useRemote ?? bRemote;
        if (explicitRemote !== undefined) { return explicitRemote; }
        if (pFactory || bFactory) { return false; }
        return DEFAULT_USE_REMOTE;
    }

    private delegatePromptApiStream(streamId: string, payload: StreamPayload): void {
        console.log(`🤖 [CLIENT][LlmWeb] Delegando en capability PromptApi [${streamId}]`);
        const stream = new ReadableStream<string>({
            start: (controller) => { this.activeControllers.set(streamId, controller); },
            cancel: () => { this.activeControllers.delete(streamId); },
        });
        this.pulse(SignalType.STREAM_DECODED, { sourceId: this.id, streamId, correlationId: streamId, stream, model: 'prompt-api' });
        const { id, ...promptApiPayload } = payload;
        this.pulse(PromptApiSignalType.STREAM, promptApiPayload);
    }

    private handlePromptApiChunk(value: unknown): void {
        const { delta, text } = (value ?? {}) as ChunkResult;
        const content = delta ?? text;
        if (!content) { return; }
        for (const controller of this.activeControllers.values()) {
            controller.enqueue(content);
        }
    }

    private handlePromptApiStreamEnd(): void {
        for (const controller of this.activeControllers.values()) {
            try { controller.close(); } catch { }
        }
        this.activeControllers.clear();
    }

    private handlePromptApiError(value: unknown): void {
        for (const controller of this.activeControllers.values()) {
            try { controller.error(value); } catch { }
        }
        this.activeControllers.clear();
        this.pulse(SignalType.ERROR, value);
    }

    private handlePromptApiResponded(value: unknown): void {
        const { response } = (value ?? {}) as PromptResult;
        this.pulse(SignalType.RESPONSE, { response, model: 'prompt-api' });
    }

    private isPromptApiAvailable(payload?: StreamPayload | PromptPayload): boolean {
        const { factory: payloadFactory } = payload ?? {};
        const { aim } = this.disposition;
        const { factory: bodyFactory } = (aim.body ?? {}) as Body;
        const globalAny = globalThis as unknown as { LanguageModel?: unknown; ai?: { languageModel?: unknown } };
        return Boolean(payloadFactory ?? bodyFactory ?? globalAny.LanguageModel ?? globalAny.ai?.languageModel);
    }

    private generateSessionId(): string {
        const webCrypto = globalThis.crypto;
        if (typeof webCrypto?.randomUUID === 'function') {
            return webCrypto.randomUUID();
        }
        return `stream-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }

    private async dispatchFetchPrompt(payload: PromptPayload): Promise<void> {
        const { prompt, schema, correlationId, requestId, thinkingBudget, temperature, maxOutputTokens } = payload;
        const { endpoint = DEFAULT_ENDPOINT, thinkingBudget: bB, temperature: bT, maxOutputTokens: bM } = (this.disposition.aim.body ?? {}) as Body;
        const activeId = correlationId ?? requestId ?? this.generateSessionId();
        const { model, provider } = this.resolvePromptTarget(payload);
        try {
            const data = await this.sendPromptRequest({ endpoint, prompt, model, provider, schema, correlationId: activeId, thinkingBudget: thinkingBudget ?? bB, temperature: temperature ?? bT, maxOutputTokens: maxOutputTokens ?? bM });
            this.pulse(SignalType.RESPONSE, { ...data, sourceId: this.id, correlationId: activeId });
        } catch (error) {
            this.pulse(SignalType.ERROR, { error, sourceId: this.id, correlationId: activeId });
        }
    }

    private resolvePromptTarget(payload: PromptPayload | StreamPayload): { model: string; provider: string } {
        const { model: payloadModel, provider: payloadProvider } = payload;
        const { model: bodyModel, provider: bodyProvider } = (this.disposition.aim.body ?? {}) as Body;
        return {
            model: payloadModel ?? bodyModel ?? DEFAULT_MODEL,
            provider: payloadProvider ?? bodyProvider ?? DEFAULT_PROVIDER,
        };
    }

    private async sendPromptRequest(options: { endpoint: string; prompt: string; model: string; provider: string; schema?: Record<string, unknown>; correlationId?: string; thinkingBudget?: number; temperature?: number; maxOutputTokens?: number }): Promise<ResponsePayload> {
        const { endpoint, prompt, model, provider, schema, correlationId, thinkingBudget, temperature, maxOutputTokens } = options;
        this.abortController = new AbortController();
        const url = this.resolveUrl(endpoint);
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({ prompt, model, provider, schema, correlationId, thinkingBudget, temperature, maxOutputTokens });
        const response = await fetch(url, { method: 'POST', headers, body, signal: this.abortController.signal });
        return (await response.json()) as ResponsePayload;
    }

    private async dispatchSseStream(payload: StreamPayload, streamId: string): Promise<void> {
        const { prompt, correlationId, thinkingBudget, schema } = payload;
        const activeCorrelationId = correlationId ?? streamId;
        const { sseEndpoint = DEFAULT_SSE_ENDPOINT, thinkingBudget: bBudget } = (this.disposition.aim.body ?? {}) as Body;
        const { model, provider } = this.resolvePromptTarget(payload);
        await this.executeStreamSession(sseEndpoint, prompt, streamId, model, provider, activeCorrelationId, thinkingBudget ?? bBudget, schema);
    }

    private async executeStreamSession(sseEndpoint: string, prompt: string, streamId: string, model: string, provider: string, correlationId: string, thinkingBudget?: number, schema?: Record<string, unknown>): Promise<void> {
        console.log(`📡 [CLIENT][LlmWeb] Abriendo stream SSE [${streamId}] (${provider}/${model}):`, sseEndpoint);
        try {
            await this.connectSseStream(sseEndpoint, prompt, streamId, model, provider, correlationId, thinkingBudget, schema);
        } catch (error) {
            if ((error as Error)?.name === 'AbortError') { return; }
            console.error(`❌ [CLIENT][LlmWeb] Error en stream SSE [${streamId}]:`, error);
            this.pulse(SignalType.ERROR, { error, streamId, correlationId, sourceId: this.id });
        }
    }

    private async connectSseStream(sseEndpoint: string, prompt: string, streamId: string, model: string, provider: string, correlationId: string, thinkingBudget?: number, schema?: Record<string, unknown>): Promise<void> {
        this.abortController = new AbortController();
        const fullEndpoint = this.resolveUrl(sseEndpoint);
        const headers = { 'Content-Type': 'application/json', Accept: 'text/event-stream' };
        const body = JSON.stringify({ prompt, model, provider, streamId, correlationId, thinkingBudget, ...(schema && { schema }) });
        const response = await fetch(fullEndpoint, { method: 'POST', headers, body, signal: this.abortController.signal });
        const { body: streamBody } = response;
        if (!streamBody) { return; }
        this.pulse(SignalType.STREAM_DECODED, { sourceId: this.id, streamId, correlationId, stream: streamBody.pipeThrough(this.createSseTransform()), model });
    }

    private resolveUrl(endpoint: string): string {
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) { return endpoint; }
        const origin = typeof window !== 'undefined' ? window.location?.origin : 'http://localhost:3000';
        const prefix = endpoint.startsWith('/') ? '' : '/';
        return `${origin ?? 'http://localhost:3000'}${prefix}${endpoint}`;
    }

    private createSseTransform(): TransformStream<Uint8Array, string> {
        const decoder = new TextDecoder();
        const state = { buffer: '', chunkCount: 0, startTime: Date.now() };
        return new TransformStream({
            transform: (chunk, controller) => this.transformSseChunk(chunk, controller, decoder, state),
            flush: () => {
                console.log(`🏁 [CLIENT][LlmWeb] Stream SSE completado (${state.chunkCount} chunks en ${Date.now() - state.startTime}ms).`);
            },
        });
    }

    private transformSseChunk(
        chunk: Uint8Array,
        controller: TransformStreamDefaultController<string>,
        decoder: TextDecoder,
        state: { buffer: string; chunkCount: number; startTime: number },
    ): void {
        state.buffer += decoder.decode(chunk, { stream: true });
        const lines = state.buffer.split('\n');
        state.buffer = lines.pop() ?? '';
        for (const line of lines) {
            this.processSseLine(line, controller, state);
        }
    }

    private processSseLine(
        line: string,
        controller: TransformStreamDefaultController<string>,
        state: { chunkCount: number; startTime: number },
    ): void {
        if (!line.startsWith('data: ')) { return; }
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) { return; }
        try {
            const { text } = JSON.parse(jsonStr) as { text?: string };
            if (!text) { return; }
            state.chunkCount += 1;
            const elapsed = Date.now() - state.startTime;
            console.log(`📥 [CLIENT][LlmWeb] [t=+${elapsed}ms] Chunk #${state.chunkCount} (${text.length} ch)`);
            controller.enqueue(text);
        } catch { }
    }
}

export * from './types.js';
export * from './constants.js';

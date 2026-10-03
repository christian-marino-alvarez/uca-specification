import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { PromptApi, type AILanguageModelFactory, type AILanguageModelSession } from '@uca/capability-prompt-api';
import {
    __ID__,
    DEFAULT_ENDPOINT,
    DEFAULT_SIGNALS,
    DEFAULT_SSE_ENDPOINT,
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

    public constructor(id: string = __ID__) {
        super(id);
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
            default:
                break;
        }
    }

    private async handlePrompt(value: unknown): Promise<void> {
        const payload = (value ?? {}) as PromptPayload;
        const { prompt } = payload;
        if (this.isPromptApiAvailable(payload)) {
            await this.executePromptApiPrompt(prompt, payload);
            return;
        }
        await this.dispatchFetchPrompt(payload);
    }

    private async dispatchFetchPrompt(payload: PromptPayload): Promise<void> {
        const { prompt, model: payloadModel } = payload;
        const { aim } = this.disposition;
        const { endpoint = DEFAULT_ENDPOINT, model: bodyModel } = (aim.body ?? {}) as Body;
        const targetModel = payloadModel ?? bodyModel;
        try {
            const data = await this.sendPromptRequest(endpoint, prompt, targetModel);
            this.pulse(SignalType.RESPONSE, data);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async executePromptApiPrompt(prompt: string, payload: PromptPayload): Promise<void> {
        try {
            const session = await this.resolvePromptSession(payload);
            const response = await session.prompt(prompt);
            this.pulse(SignalType.RESPONSE, { response, model: 'web-prompt-api' });
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async sendPromptRequest(endpoint: string, prompt: string, model?: string): Promise<ResponsePayload> {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, model }),
        });
        const data = (await response.json()) as ResponsePayload;
        return data;
    }

    private async handleStream(value: unknown): Promise<void> {
        const payload = (value ?? {}) as StreamPayload;
        const { prompt, streamId } = payload;
        const activeStreamId = streamId ?? crypto.randomUUID();
        if (this.isPromptApiAvailable(payload)) {
            await this.executePromptApiStream(prompt, activeStreamId, payload);
            return;
        }
        await this.dispatchSseStream(payload, activeStreamId);
    }

    private async dispatchSseStream(payload: StreamPayload, streamId: string): Promise<void> {
        const { prompt, model: payloadModel } = payload;
        const { aim } = this.disposition;
        const { sseEndpoint = DEFAULT_SSE_ENDPOINT, model: bodyModel } = (aim.body ?? {}) as Body;
        const targetModel = payloadModel ?? bodyModel;
        await this.executeStreamSession(sseEndpoint, prompt, streamId, targetModel);
    }

    private async executePromptApiStream(prompt: string, streamId: string, payload: StreamPayload): Promise<void> {
        console.log(`🤖 [CLIENT][LlmWeb] Abriendo Web Prompt API stream [${streamId}]`);
        try {
            const session = await this.resolvePromptSession(payload);
            const stream = session.promptStreaming(prompt).pipeThrough(this.createDeltaTransform());
            this.pulse(SignalType.STREAM_DECODED, { streamId, stream, model: 'web-prompt-api' });
        } catch (error) {
            console.error(`❌ [CLIENT][LlmWeb] Error en Web Prompt API [${streamId}]:`, error);
            this.pulse(SignalType.ERROR, { error, streamId });
        }
    }

    private isPromptApiAvailable(payload?: StreamPayload | PromptPayload): boolean {
        const { factory: payloadFactory } = payload ?? {};
        const { aim } = this.disposition;
        const { factory: bodyFactory } = (aim.body ?? {}) as Body;
        const globalAi = (globalThis as unknown as { ai?: { languageModel?: unknown } }).ai;
        return Boolean(payloadFactory ?? bodyFactory ?? globalAi?.languageModel);
    }

    private resolvePromptApiFactory(payload?: StreamPayload | PromptPayload): AILanguageModelFactory {
        const { factory: payloadFactory } = payload ?? {};
        const { aim } = this.disposition;
        const { factory: bodyFactory } = (aim.body ?? {}) as Body;
        const globalAi = (globalThis as unknown as { ai?: { languageModel?: AILanguageModelFactory } }).ai;
        const resolved = payloadFactory ?? bodyFactory ?? globalAi?.languageModel;
        if (!resolved) { throw new Error('Web Prompt API no disponible en este entorno.'); }
        return resolved;
    }

    private async resolvePromptSession(payload: StreamPayload | PromptPayload): Promise<AILanguageModelSession> {
        const { systemPrompt } = payload;
        const factory = this.resolvePromptApiFactory(payload);
        const options = systemPrompt ? { systemPrompt } : undefined;
        return factory.create(options);
    }

    private createDeltaTransform(): TransformStream<string, string> {
        let previousText = '';
        return new TransformStream({
            transform: (chunk, controller) => {
                const isCumulative = typeof chunk === 'string' && chunk.startsWith(previousText);
                const delta = isCumulative ? chunk.slice(previousText.length) : chunk;
                previousText = isCumulative ? chunk : `${previousText}${delta}`;
                if (delta) { controller.enqueue(delta); }
            },
        });
    }

    private async executeStreamSession(
        sseEndpoint: string,
        prompt: string,
        streamId: string,
        model?: string,
    ): Promise<void> {
        console.log(`📡 [CLIENT][LlmWeb] Abriendo stream SSE [${streamId}]:`, sseEndpoint);
        try {
            await this.connectSseStream(sseEndpoint, prompt, streamId, model);
            console.log(`🏁 [CLIENT][LlmWeb] Stream SSE [${streamId}] completado.`);
        } catch (error) {
            console.error(`❌ [CLIENT][LlmWeb] Error en stream SSE [${streamId}]:`, error);
            this.pulse(SignalType.ERROR, { error, streamId });
        }
    }

    private async connectSseStream(
        sseEndpoint: string,
        prompt: string,
        streamId: string,
        model?: string,
    ): Promise<void> {
        const url = `${sseEndpoint}?prompt=${encodeURIComponent(prompt)}`;
        const response = await fetch(url, { headers: { Accept: 'text/event-stream' } });
        const { body } = response;
        if (!body) { return; }
        const decodedStream = body.pipeThrough(this.createSseTransform());
        this.pulse(SignalType.STREAM_DECODED, { streamId, stream: decodedStream, model });
    }

    private createSseTransform(): TransformStream<Uint8Array, string> {
        const decoder = new TextDecoder();
        return new TransformStream({
            transform: (chunk, controller) => this.transformSseChunk(chunk, controller, decoder),
        });
    }

    private transformSseChunk(
        chunk: Uint8Array,
        controller: TransformStreamDefaultController<string>,
        decoder: TextDecoder,
    ): void {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split('\n');
        for (const line of lines) {
            this.processSseLine(line, controller);
        }
    }

    private processSseLine(line: string, controller: TransformStreamDefaultController<string>): void {
        if (!line.startsWith('data: ')) { return; }
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) { return; }
        try {
            const parsed = JSON.parse(jsonStr) as { text?: string };
            const { text } = parsed;
            if (text) { controller.enqueue(text); }
        } catch { }
    }
}

export * from './types.js';
export * from './constants.js';

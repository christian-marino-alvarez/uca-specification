import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
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
            { signal: SignalType.CHUNK, type: DataType.CHUNK_PAYLOAD, description: 'Real-time token chunk received' },
            { signal: SignalType.COMPLETED, type: DataType.VOID, description: 'Streaming session completed' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'LLM connection error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override capabilities(): Cooky {
        return [];
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
        const { prompt, model: payloadModel } = payload;
        const { aim } = this.disposition;
        const { sseEndpoint = DEFAULT_SSE_ENDPOINT, model: bodyModel } = (aim.body ?? {}) as Body;
        const targetModel = payloadModel ?? bodyModel;
        await this.executeStreamSession(sseEndpoint, prompt, targetModel);
    }

    private async executeStreamSession(sseEndpoint: string, prompt: string, model?: string): Promise<void> {
        console.log('📡 [CLIENT][LlmWeb] Abriendo stream SSE:', sseEndpoint);
        try {
            await this.connectSseStream(sseEndpoint, prompt, model);
            console.log('🏁 [CLIENT][LlmWeb] Stream SSE completado.');
            this.pulse(SignalType.COMPLETED, undefined);
        } catch (error) {
            console.error('❌ [CLIENT][LlmWeb] Error en stream SSE:', error);
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async connectSseStream(sseEndpoint: string, prompt: string, model?: string): Promise<void> {
        const url = `${sseEndpoint}?prompt=${encodeURIComponent(prompt)}`;
        const response = await fetch(url, { headers: { Accept: 'text/event-stream' } });
        const reader = response.body?.getReader();
        if (!reader) { return; }
        const decoder = new TextDecoder();
        await this.consumeStream(reader, decoder, model);
    }

    private async consumeStream(
        reader: ReadableStreamDefaultReader<Uint8Array>,
        decoder: TextDecoder,
        model?: string,
    ): Promise<void> {
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            const chunkText = decoder.decode(value, { stream: true });
            this.parseSseChunk(chunkText, model);
        }
    }

    private parseSseChunk(rawText: string, model?: string): void {
        const lines = rawText.split('\n');
        for (const line of lines) {
            if (!line.startsWith('data: ')) { continue; }
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) { continue; }
            this.dispatchParsedData(jsonStr, model);
        }
    }

    private dispatchParsedData(jsonStr: string, model?: string): void {
        try {
            const parsed = JSON.parse(jsonStr) as { text?: string; done?: boolean };
            const { text } = parsed;
            if (text) {
                console.log('⚡ [CLIENT][LlmWeb] Recibido alpha chunk:', text.slice(0, 30) + '...');
                this.pulse(SignalType.CHUNK, { text, model });
            }
        } catch {
            // Ignore non-json heartbeat lines
        }
    }
}

export * from './types.js';
export * from './constants.js';

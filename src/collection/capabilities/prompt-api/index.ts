import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, AIM, DEFAULT_SIGNALS } from './constants.js';
import {
    type AILanguageModelFactory,
    type AILanguageModelSession,
    type Body,
    type CapabilitiesResult,
    type PromptPayload,
    DataType,
    SignalType,
} from './types.js';

export class PromptApi extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: PromptApi.AIM, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CHECK, type: DataType.VOID, description: 'Check Prompt API availability and capabilities' },
            { signal: SignalType.PROMPT, type: DataType.PROMPT_PAYLOAD, description: 'Send prompt request for response' },
            { signal: SignalType.STREAM, type: DataType.PROMPT_PAYLOAD, description: 'Send prompt request for streaming chunks' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Destroy active language model session' },
        ],
        outputs: [
            { signal: SignalType.CHECKED, type: DataType.CAPABILITIES_RESULT, description: 'Emits capabilities and availability' },
            { signal: SignalType.RESPONDED, type: DataType.PROMPT_RESULT, description: 'Emits prompt response' },
            { signal: SignalType.CHUNK, type: DataType.CHUNK_RESULT, description: 'Emits streamed token chunk' },
            { signal: SignalType.STREAM_END, type: DataType.STREAM_END_RESULT, description: 'Emits completion of stream' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits Prompt API error' },
        ],
    };

    private activeSession?: AILanguageModelSession;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        super.innervate(target, disposition);
        return this;
    }

    public override denervate(): void {
        this.handleDestroy();
        super.denervate();
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CHECK:
                await this.handleCheck();
                break;
            case SignalType.PROMPT:
                await this.handlePrompt(value);
                break;
            case SignalType.STREAM:
                await this.handleStream(value);
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            default:
                break;
        }
    }

    private async handleCheck(): Promise<void> {
        try {
            const factory = this.resolveFactory();
            const capabilities = await this.queryCapabilities(factory);
            this.pulse(SignalType.CHECKED, capabilities);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async queryCapabilities(factory: AILanguageModelFactory): Promise<CapabilitiesResult> {
        if (typeof factory.availability === 'function') {
            const available = await factory.availability();
            return { available };
        }
        return factory.capabilities ? await factory.capabilities() : { available: 'readily' };
    }

    private async handlePrompt(value: unknown): Promise<void> {
        const payload = (value ?? {}) as PromptPayload;
        const { prompt } = payload;
        try {
            const session = await this.resolveSession(payload);
            const response = await session.prompt(prompt);
            this.pulse(SignalType.RESPONDED, { prompt, response });
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async handleStream(value: unknown): Promise<void> {
        const payload = (value ?? {}) as PromptPayload;
        const { prompt } = payload;
        try {
            const session = await this.resolveSession(payload);
            const stream = session.promptStreaming(prompt);
            await this.consumeStream(stream, prompt);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async consumeStream(stream: ReadableStream<string>, prompt: string): Promise<void> {
        const reader = stream.getReader();
        let fullText = '';
        while (true) {
            const { done, value: chunk } = await reader.read();
            if (done) { break; }
            fullText = this.emitStreamChunk(prompt, chunk ?? '', fullText);
        }
        this.pulse(SignalType.STREAM_END, { prompt, text: fullText });
    }

    private emitStreamChunk(prompt: string, chunk: string, previousText: string): string {
        const delta = this.computeStreamDelta(chunk, previousText);
        const fullText = chunk.startsWith(previousText) ? chunk : `${previousText}${delta}`;
        this.pulse(SignalType.CHUNK, { prompt, chunk, delta, text: delta, fullText });
        return fullText;
    }

    private computeStreamDelta(chunk: string, previousText: string): string {
        const isCumulative = typeof chunk === 'string' && chunk.startsWith(previousText);
        if (isCumulative) {
            return chunk.slice(previousText.length);
        }
        return chunk ?? '';
    }

    private handleDestroy(): void {
        if (this.activeSession) {
            this.activeSession.destroy();
            this.activeSession = undefined;
        }
    }

    private async resolveSession(payload: PromptPayload): Promise<AILanguageModelSession> {
        const { systemPrompt, temperature, topK } = payload;
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const effectiveSystem = systemPrompt ?? body.systemPrompt;
        const effectiveTemp = temperature ?? body.temperature;
        const effectiveTopK = topK ?? body.topK;
        const factory = this.resolveFactory(payload);
        const options = { systemPrompt: effectiveSystem, temperature: effectiveTemp, topK: effectiveTopK };
        return factory.create(options);
    }

    private resolveFactory(payload?: PromptPayload): AILanguageModelFactory {
        const { factory: payloadFactory } = payload ?? {};
        const { aim } = this.disposition;
        const { factory: bodyFactory } = (aim.body ?? {}) as Body;
        const globalAny = globalThis as unknown as { LanguageModel?: AILanguageModelFactory; ai?: { languageModel?: AILanguageModelFactory } };
        const resolved = payloadFactory ?? bodyFactory ?? globalAny.LanguageModel ?? globalAny.ai?.languageModel;
        if (!resolved) {
            throw new Error('Web Prompt API (LanguageModel / ai.languageModel) no disponible en este entorno.');
        }
        return resolved;
    }
}


import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Gemini } from '@uca/capability-gemini';
import { SignalType as GeminiSignalType, type Body as GeminiBody } from '@uca/capability-gemini/types';
import { Openai } from '@uca/capability-openai';
import { SignalType as OpenaiSignalType, type Body as OpenaiBody } from '@uca/capability-openai/types';
import {
    __ID__,
    DEFAULT_GEMINI_MODEL,
    DEFAULT_OPENAI_MODEL,
    DEFAULT_PROVIDER,
} from './constants.js';
import {
    type Body,
    type ConnectionConfig,
    type InferPayload,
    type InferResult,
    type ProviderType,
    DataType,
    SignalType,
} from './types.js';

export class Llm extends Uca<Body> {
    public static override purpose: string = 'Enable open connections with AI models';

    public static override disposition: Disposition<Body> = {
        aim: { description: Llm.purpose, body: {} },
        reactTo: [
            SignalType.INFER,
            SignalType.STREAM,
            SignalType.CONNECT,
            GeminiSignalType.CONNECTED,
            GeminiSignalType.GENERATED,
            GeminiSignalType.CHUNK,
            GeminiSignalType.STREAM_END,
            GeminiSignalType.ERROR,
            OpenaiSignalType.CONNECTED,
            OpenaiSignalType.GENERATED,
            OpenaiSignalType.CHUNK,
            OpenaiSignalType.STREAM_END,
            OpenaiSignalType.ERROR,
            ...Gemini.disposition.reactTo ?? [],
            ...Openai.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.INFER, type: DataType.INFER_PAYLOAD, description: 'Request reasoning inference or text generation' },
            { signal: SignalType.STREAM, type: DataType.INFER_PAYLOAD, description: 'Request streaming reasoning tokens' },
            { signal: SignalType.CONNECT, type: DataType.CONNECTION_CONFIG, description: 'Connect AI provider' },
        ],
        outputs: [
            { signal: SignalType.INFERRED, type: DataType.INFER_RESULT, description: 'Emits structured inference answers and results' },
            { signal: SignalType.CHUNK, type: DataType.CHUNK_RESULT, description: 'Emits streamed token chunk' },
            { signal: SignalType.STREAM_END, type: DataType.STREAM_END_RESULT, description: 'Emits stream completed notification' },
            { signal: SignalType.CONNECTED, type: DataType.STRING, description: 'Emits confirmation of AI provider connection' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits cognitive inference or provider error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { aim } = this.disposition;
        const { connection, model } = (aim.body ?? {}) as Body;
        return [
            ...this.buildGeminiCooky(connection, model),
            ...this.buildOpenaiCooky(connection, model),
        ];
    }

    private resolveActiveProvider(requested?: ProviderType): ProviderType {
        const { aim } = this.disposition;
        const { provider: bodyProvider } = (aim.body ?? {}) as Body;
        return requested ?? bodyProvider ?? DEFAULT_PROVIDER;
    }

    private buildOpenaiCooky(connection?: ConnectionConfig, model?: string): Cooky {
        const targetModel = model ?? DEFAULT_OPENAI_MODEL;
        const disposition: Disposition<OpenaiBody> = {
            aim: { description: Openai.AIM, body: { connection, model: targetModel } },
            reactTo: [...Openai.disposition.reactTo ?? []],
        };
        return [[Openai, disposition]];
    }

    private buildGeminiCooky(connection?: ConnectionConfig, model?: string): Cooky {
        const { aim } = this.disposition;
        const { thinkingBudget, thinkingLevel, imagination, limit, role } = (aim.body ?? {}) as Body;
        const targetModel = model ?? DEFAULT_GEMINI_MODEL;
        const disposition: Disposition<GeminiBody> = {
            aim: { description: Gemini.AIM, body: { connection, model: targetModel, thinkingBudget, thinkingLevel, temperature: imagination, maxOutputTokens: limit, systemInstruction: role } },
            reactTo: [...Gemini.disposition.reactTo ?? []],
        };
        return [[Gemini, disposition]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.INFER:
                this.handleInfer(value);
                break;
            case SignalType.STREAM:
                this.handleStream(value);
                break;
            case SignalType.CONNECT:
                this.handleConnect(value);
                break;
            default:
                this.handleCapabilitySignal(property, value);
                break;
        }
    }

    private handleInfer(value: unknown): void {
        const payload = (value ?? {}) as InferPayload;
        const { request, context, role, provider, correlationId } = payload;
        if (correlationId && !this.id.includes(correlationId) && !correlationId.includes(this.id)) { return; }
        const prompt = context ? `${request}\nContext: ${JSON.stringify(context)}` : request;
        const activeProvider = this.resolveActiveProvider(provider);
        const signal = activeProvider === 'gemini' ? GeminiSignalType.GENERATE : OpenaiSignalType.GENERATE;
        const generatePayload = this.buildGeneratePayload(payload, prompt, role);
        if (activeProvider === 'gemini') {
            console.log(`[${this.id}] 🧠 Llamando a Gemini (${generatePayload.model})...`);
        }
        this.pulse(signal, generatePayload);
    }

    private buildGeneratePayload(payload: InferPayload, prompt: string, role?: string): Record<string, unknown> {
        const { provider, model, expectations, imagination, limit, correlationId, streamId, thinkingBudget, thinkingLevel } = payload;
        const { aim } = this.disposition;
        const { role: bodyRole, thinkingBudget: bodyBudget, thinkingLevel: bodyLevel, imagination: bTemp, limit: bLimit } = (aim.body ?? {}) as Body;
        const activeProvider = this.resolveActiveProvider(provider);
        const fallbackModel = activeProvider === 'gemini' ? DEFAULT_GEMINI_MODEL : DEFAULT_OPENAI_MODEL;
        const targetModel = model ?? fallbackModel;
        return { prompt, schema: expectations, systemInstruction: role ?? bodyRole, model: targetModel, temperature: imagination ?? bTemp, maxOutputTokens: limit ?? bLimit, correlationId, streamId, thinkingBudget: thinkingBudget ?? bodyBudget, thinkingLevel: thinkingLevel ?? bodyLevel };
    }

    private handleConnect(value: unknown): void {
        this.pulse(GeminiSignalType.CONNECT, value);
        this.pulse(OpenaiSignalType.CONNECT, value);
    }

    private handleStream(value: unknown): void {
        const payload = (value ?? {}) as InferPayload;
        const { correlationId } = payload;
        if (correlationId && !this.id.includes(correlationId) && !correlationId.includes(this.id)) { return; }
        const activeProvider = this.resolveActiveProvider(payload.provider);
        const signal = activeProvider === 'gemini' ? GeminiSignalType.STREAM : OpenaiSignalType.STREAM;
        const streamPayload = this.buildStreamPayload(payload, activeProvider);
        if (activeProvider === 'gemini') {
            console.log(`[${this.id}] 🧠 Llamando a Gemini (${streamPayload.model} stream)...`);
        }
        this.pulse(signal, streamPayload);
    }

    private buildStreamPayload(payload: InferPayload, provider: ProviderType): Record<string, unknown> {
        const { request, model, expectations, role, correlationId, streamId, thinkingBudget, thinkingLevel, imagination, limit } = payload;
        const { aim } = this.disposition;
        const { thinkingBudget: bBudget, thinkingLevel: bLevel, role: bRole, imagination: bTemp, limit: bTokens } = (aim.body ?? {}) as Body;
        const fallbackModel = provider === 'gemini' ? DEFAULT_GEMINI_MODEL : DEFAULT_OPENAI_MODEL;
        const targetModel = model ?? fallbackModel;
        return { prompt: request, model: targetModel, schema: expectations, systemInstruction: role ?? bRole, correlationId, streamId, thinkingBudget: thinkingBudget ?? bBudget, thinkingLevel: thinkingLevel ?? bLevel, temperature: imagination ?? bTemp, maxOutputTokens: limit ?? bTokens };
    }

    private handleCapabilitySignal(property: string, value: unknown): void {
        switch (property) {
            case GeminiSignalType.GENERATED:
            case OpenaiSignalType.GENERATED:
                this.handleGenerated(value);
                break;
            case GeminiSignalType.CHUNK:
            case OpenaiSignalType.CHUNK:
                this.pulse(SignalType.CHUNK, value);
                break;
            case GeminiSignalType.STREAM_END:
            case OpenaiSignalType.STREAM_END:
                this.pulse(SignalType.STREAM_END, value);
                break;
            case GeminiSignalType.CONNECTED:
            case OpenaiSignalType.CONNECTED:
                this.pulse(SignalType.CONNECTED, 'connected');
                break;
            case GeminiSignalType.ERROR:
            case OpenaiSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private handleGenerated(value: unknown): void {
        const { text, data, model, usage, correlationId } = (value ?? {}) as { text?: string; data?: unknown; model?: string; usage?: unknown; correlationId?: string };
        const result: InferResult = { response: text, data, model, usage, correlationId };
        this.pulse(SignalType.INFERRED, result);
    }
}


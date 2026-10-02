import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Gemini, SignalType as GeminiSignalType, type Body as GeminiBody, type GenerateResult } from '@uca/capability-gemini';
import { __ID__, DEFAULT_INSTRUCTION, DEFAULT_SIGNALS } from './constants.js';
import { type Body, type InferPayload, type InferResult, DataType, SignalType } from './types.js';

export class Llm extends Uca<Body> {
    public static override purpose: string = 'Enable open connections with AI models';

    public static override disposition: Disposition<Body> = {
        aim: { description: Llm.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
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

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? Llm.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [
            GeminiSignalType.GENERATED,
            GeminiSignalType.CHUNK,
            GeminiSignalType.STREAM_END,
            GeminiSignalType.CONNECTED,
            GeminiSignalType.ERROR,
        ];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { connection, model } = (aim.body ?? {}) as Body;
        const disposition: Disposition<GeminiBody> = {
            aim: { description: Gemini.AIM, body: { connection, model } },
            reactTo: [...Gemini.disposition.reactTo ?? []],
        };
        const cooky: Cooky = [[Gemini, disposition]];
        return cooky;
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
        const { request, context, role } = payload;
        const prompt = context ? `${request}\nContext: ${JSON.stringify(context)}` : request;
        const systemInstruction = role ?? DEFAULT_INSTRUCTION;
        const generatePayload = this.buildGeneratePayload(payload, prompt, systemInstruction);
        this.pulse(GeminiSignalType.GENERATE, generatePayload);
    }

    private buildGeneratePayload(payload: InferPayload, prompt: string, systemInstruction: string): Record<string, unknown> {
        const { aim } = this.disposition;
        const { model: fallbackModel } = aim.body ?? {};
        const { model, expectations, imagination, limit } = payload;
        const targetModel = model ?? fallbackModel;
        return { prompt, schema: expectations, systemInstruction, model: targetModel, temperature: imagination, maxOutputTokens: limit };
    }

    private handleConnect(value: unknown): void {
        this.pulse(GeminiSignalType.CONNECT, value);
    }

    private handleStream(value: unknown): void {
        const { aim } = this.disposition;
        const { model: fallbackModel } = aim.body ?? {};
        const payload = (value ?? {}) as InferPayload;
        const { request, model } = payload;
        const targetModel = model ?? fallbackModel;
        this.pulse(GeminiSignalType.STREAM, { prompt: request, model: targetModel });
    }

    private handleCapabilitySignal(property: string, value: unknown): void {
        switch (property) {
            case GeminiSignalType.GENERATED:
                this.handleGenerated(value);
                break;
            case GeminiSignalType.CHUNK:
                this.pulse(SignalType.CHUNK, value);
                break;
            case GeminiSignalType.STREAM_END:
                this.pulse(SignalType.STREAM_END, value);
                break;
            case GeminiSignalType.CONNECTED:
                this.pulse(SignalType.CONNECTED, 'connected');
                break;
            case GeminiSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private handleGenerated(value: unknown): void {
        const { text, data, model, usage } = (value ?? {}) as GenerateResult;
        const result: InferResult = { response: text, data, model, usage };
        this.pulse(SignalType.INFERRED, result);
    }
}

export * from './types.js';
export * from './constants.js';

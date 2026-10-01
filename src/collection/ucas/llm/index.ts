import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Jev, SignalType as JevSignalType, type Body as JevBody } from '@uca/capability-jev';
import { __ID__, DEFAULT_SIGNALS } from './constants.js';
import { type Body, type InferPayload, type InferResult, DataType, SignalType } from './types.js';

export class Llm extends Uca<Body> {
    public static override purpose: string = 'Orchestrate cognitive reasoning and language model inferences over system state';

    public static override disposition: Disposition<Body> = {
        aim: { description: Llm.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.INFER, type: DataType.INFER_PAYLOAD, description: 'Request reasoning inference or text generation' },
            { signal: SignalType.CONNECT, type: DataType.CONNECTION_CONFIG, description: 'Connect AI provider' },
        ],
        outputs: [
            { signal: SignalType.INFERRED, type: DataType.INFER_RESULT, description: 'Emits structured inference answers and results' },
            { signal: SignalType.CONNECTED, type: DataType.STRING, description: 'Emits confirmation of AI provider connection' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits cognitive inference or provider error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.INFER:
                this.handleInfer(value);
                break;
            case SignalType.CONNECT:
                this.handleConnect(value);
                break;
            default:
                this.handleCapabilitySignal(property, value);
                break;
        }
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { connection } = (aim.body ?? {}) as Body;
        const purpose = 'Execute probabilistic reasoning and inference via Jev AI engine';
        const disposition: Disposition<JevBody> = {
            aim: { description: purpose, body: { connection } },
            reactTo: [JevSignalType.CONNECT, JevSignalType.INFER],
        };
        const cooky: Cooky = [[Jev, disposition]];
        return cooky;
    }

    private handleInfer(value: unknown): void {
        const { aim } = this.disposition;
        const { model: fallbackModel, limit: fallbackLimit } = aim.body ?? {};
        const payload = (value ?? {}) as InferPayload;
        const { request, model, limit, context, expectations, format = 'string' } = payload;
        const targetModel = model ?? fallbackModel;
        const effectiveLimit = limit ?? fallbackLimit;
        const state = { request, ...(context ? { context } : {}), ...this.extractMeta(payload) };
        const questions = expectations ?? { response: { type: format } };
        this.pulse(JevSignalType.INFER, { state, questions, model: targetModel, limit: effectiveLimit });
    }

    private extractMeta(payload: InferPayload): Record<string, unknown> {
        const { role, imagination, depth } = payload;
        return { ...(role && { role }), ...(imagination !== undefined && { imagination }), ...(depth !== undefined && { depth }) };
    }

    private handleConnect(value: unknown): void {
        this.pulse(JevSignalType.CONNECT, value);
    }

    private handleCapabilitySignal(property: string, value: unknown): void {
        switch (property) {
            case JevSignalType.INFERRED:
                this.handleInferred(value);
                break;
            case JevSignalType.CONNECTED:
                this.pulse(SignalType.CONNECTED, 'connected');
                break;
            case JevSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private handleInferred(value: unknown): void {
        const { answers = {}, state, model } = (value ?? {}) as { answers?: Record<string, unknown>; state?: unknown; model?: string };
        const { response } = answers as { response?: string };
        const result: InferResult = { response, data: answers, context: state, model };
        this.pulse(SignalType.INFERRED, result);
    }
}

export * from './types.js';
export * from './constants.js';

import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, DEFAULT_MODEL, DEFAULT_ENDPOINT, DEFAULT_QUESTIONS } from './constants.js';
import {
    type Body,
    type Question,
    type RequestBody,
    type ConnectionConfig,
    type InferPayload,
    type InferResult,
    DataType,
    SignalType,
} from './types.js';

export class Jev extends Capability<Body> {
    public static readonly AIM: string = 'Perform system-one probabilistic reasoning and state evaluation through server-to-server HTTP';

    public static override disposition: Disposition<Body> = {
        aim: { description: Jev.AIM, body: {} },
        reactTo: [
            SignalType.CONNECT,
            SignalType.INFER,
        ],
        inputs: [
                { signal: SignalType.CONNECT, type: DataType.CONNECTION_CONFIG, description: 'Configure Jev engine parameters' },
                { signal: SignalType.INFER, type: DataType.INFER_PAYLOAD, description: 'Run system-one inference over state and questions' },
            ],
            outputs: [
                { signal: SignalType.CONNECTED, type: DataType.CONNECTION_STATUS, description: 'Jev engine connection confirmed' },
                { signal: SignalType.INFERRED, type: DataType.INFER_RESULT, description: 'Inference results and answers' },
                { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Error notification' },
            ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CONNECT:
                this.handleConnect(value);
                break;
            case SignalType.INFER:
                await this.handleInfer(value);
                break;
            default:
                break;
        }
    }

    private handleConnect(value: unknown): void {
        const payload = this.extractPayload<ConnectionConfig>(value);
        const { aim } = this.disposition;
        const current = aim.body ?? {};
        const connection = payload ?? current.connection;
        const updatedDisposition = { ...this.disposition, aim: { ...aim, body: { ...current, connection } } };
        this.pulse(Capability.updateEvent(this.id), updatedDisposition);
        this.pulse(SignalType.CONNECTED, { status: 'ready', connection });
    }

    private async handleInfer(value: unknown): Promise<void> {
        const payload = this.extractPayload<InferPayload>(value);
        if (!payload) { return; }
        const { correlationId } = payload;
        try {
            const result = await this.executeInference(payload);
            this.pulse(SignalType.INFERRED, result);
        } catch (error) {
            this.pulse(SignalType.ERROR, { error, correlationId });
        }
    }

    private async executeInference(payload: InferPayload): Promise<InferResult> {
        const { state, model = DEFAULT_MODEL, correlationId } = payload;
        const { aim } = this.disposition;
        const { connection } = aim.body ?? {};
        const { apiKey = process.env.JEV_API_KEY ?? process.env.TYPESAFE_API_KEY, baseURL } = connection ?? {};
        const endpoint = baseURL ? `${baseURL.replace(/\/$/, '')}/v1/systemone` : DEFAULT_ENDPOINT;
        if (!apiKey) { throw new Error('Jev API key is not configured on the backend'); }
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(this.buildRequest(payload)) });
        if (!response.ok) { throw new Error(`Jev HTTP ${response.status}: ${await response.text()}`); }
        const { answers } = await response.json() as { answers: Record<string, unknown> };
        return { state, answers, model, correlationId };
    }
    private buildRequest(payload: InferPayload): RequestBody {
        const { state, questions = DEFAULT_QUESTIONS, model = DEFAULT_MODEL, limit, maxTokens } = payload;
        const { aim } = this.disposition;
        const { limit: bodyLimit, maxTokens: bodyMaxTokens } = aim.body ?? {};
        const effectiveLimit = limit ?? maxTokens ?? bodyLimit ?? bodyMaxTokens;
        const formatted = Object.fromEntries(Object.entries(questions).map(([key, value]) => [key, this.formatQuestion(key, value)]));
        return { state, questions: formatted, model, ...(effectiveLimit !== undefined && { limit: effectiveLimit, max_tokens: effectiveLimit }) };
    }
    private formatQuestion(key: string, value: unknown): unknown {
        if (typeof value === 'string') { return { type: 'noul', instructions: value }; }
        const { type, instructions = key, options, criteria } = value as Question;
        if (type) { return value; }
        return options ? { type: 'choice', instructions, criteria: options } : { type: 'noul', instructions, criteria };
    }
}

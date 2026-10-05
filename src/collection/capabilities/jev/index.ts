import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { TypeSafeClient, noul } from '@typesafe-ai/sdk';
import { __ID__, __DEFAULT_SIGNALS__, DEFAULT_MODEL } from './constants.js';
import {
    type Body,
    type ConnectionConfig,
    type InferPayload,
    type InferResult,
    DataType,
    SignalType,
} from './types.js';

export class Jev extends Capability<Body> {
    public static readonly AIM: string = 'Perform system-one probabilistic reasoning and state evaluation using Jev SDK';

    public static override disposition: Disposition<Body> = {
        aim: { description: Jev.AIM, body: {} },
        reactTo: [...__DEFAULT_SIGNALS__],
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
        this.disposition = { ...this.disposition, aim: { ...aim, body: { ...current, connection } } };
        this.pulse(SignalType.CONNECTED, { status: 'ready', connection });
    }

    private async handleInfer(value: unknown): Promise<void> {
        const payload = this.extractPayload<InferPayload>(value);
        if (!payload) { return; }
        try {
            const client = this.resolveClient();
            const result = await this.executeInference(client, payload);
            this.pulse(SignalType.INFERRED, result);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async executeInference(client: TypeSafeClient, payload: InferPayload): Promise<InferResult> {
        const { state, questions, model = DEFAULT_MODEL, limit, maxTokens } = payload;
        const { aim } = this.disposition;
        const bodyLimit = aim.body?.limit ?? aim.body?.maxTokens;
        const effectiveLimit = limit ?? maxTokens ?? bodyLimit;
        const options = effectiveLimit !== undefined ? { limit: effectiveLimit, max_tokens: effectiveLimit } : {};
        const formattedQuestions = this.formatQuestions(questions ?? {});
        const response = await client.systemOne({ state: state as any, questions: formattedQuestions as any, model, ...options });
        const answers = response as unknown as Record<string, unknown>;
        return { state, answers, model };
    }

    private formatQuestions(questions: Record<string, unknown>): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(questions)) {
            const isNoul = typeof value === 'object' && value !== null && 'type' in value && (value as { type: string }).type === 'noul';
            result[key] = isNoul ? value : noul(typeof value === 'string' ? value : key);
        }
        return Object.keys(result).length ? result : { answer: noul('Procesar consulta') };
    }

    private resolveClient(): TypeSafeClient {
        const { aim } = this.disposition;
        const { client, connection } = aim.body ?? {};
        if (client) { return client; }
        return this.createClient(connection);
    }

    private createClient(config?: ConnectionConfig): TypeSafeClient {
        const { apiKey, baseURL } = config ?? {};
        const envKey = typeof process !== 'undefined' ? process.env?.JEV_API_KEY ?? process.env?.TYPESAFE_API_KEY : undefined;
        const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('JEV_API_KEY') ?? undefined : undefined;
        const resolvedApiKey = apiKey ?? envKey ?? localKey;
        const browserOrigin = typeof window !== 'undefined' ? window.location.origin : undefined;
        const resolvedBase = baseURL ?? browserOrigin;
        return new TypeSafeClient({ apiKey: resolvedApiKey, baseURL: resolvedBase, dangerouslyAllowBrowser: true });
    }
}


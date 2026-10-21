import { createStream } from './stream.js';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { GoogleGenAI } from '@google/genai';
import { __ID__, DEFAULT_MODEL, DEFAULT_THINKING_BUDGET, DEFAULT_THINKING_LEVEL, THINKING_LEVEL_MODEL_PREFIX } from './constants.js';
import {
    type Body,
    type AbortPayload,
    type ActiveStream,
    type ApiFailure,
    type ConnectionConfig,
    type Failure,
    type GeneratePayload,
    type GenerateResult,
    type ThinkingLevel,
    DataType,
    SignalType,
} from './types.js';

export class Gemini extends Capability<Body> {
    public static readonly AIM: string = 'Generate cognitive inferences and structured view graphs using Google GenAI SDK';

    public static override disposition: Disposition<Body> = {
        aim: { description: Gemini.AIM, body: {} },
        reactTo: [
            SignalType.CONNECT,
            SignalType.GENERATE,
            SignalType.STREAM,
            SignalType.ABORT,
        ],
        inputs: [
            { signal: SignalType.ABORT, type: DataType.ABORT_PAYLOAD, description: 'Abort a pending generation' },
            { signal: SignalType.CONNECT, type: DataType.CONNECTION_CONFIG, description: 'Configure Gemini API connection' },
            { signal: SignalType.GENERATE, type: DataType.GENERATE_PAYLOAD, description: 'Generate cognitive text or structured JSON' },
            { signal: SignalType.STREAM, type: DataType.GENERATE_PAYLOAD, description: 'Stream cognitive tokens in real-time' },
        ],
        outputs: [
            { signal: SignalType.CONNECTED, type: DataType.CONNECTION_STATUS, description: 'Gemini connection confirmed' },
            { signal: SignalType.GENERATED, type: DataType.GENERATE_RESULT, description: 'Generated inference and structured data' },
            { signal: SignalType.STREAMED, type: DataType.STREAM_RESULT, description: 'Owned stream of generated text' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Error notification' },
        ],
    };

    private readonly controllers = new Map<string, ActiveStream>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.controllers.forEach(({ controller }) => controller.abort());
        this.controllers.clear();
        super.denervate();
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.ABORT:
                this.handleAbort(value);
                break;
            case SignalType.CONNECT:
                this.handleConnect(value);
                break;
            case SignalType.GENERATE:
                await this.handleGenerate(value);
                break;
            case SignalType.STREAM:
                await this.handleStream(value);
                break;
            default:
                break;
        }
    }

    private async handleStream(value: unknown): Promise<void> {
        const payload = this.extractPayload<GeneratePayload>(value)!;
        const { correlationId = crypto.randomUUID(), streamId } = payload;
        const controller = new AbortController(); const { signal } = controller;
        const requestId = streamId ?? correlationId;
        this.replaceController(requestId, correlationId, controller);
        try {
            const stream = await this.openStream(payload, requestId, controller);
            this.pulse(SignalType.STREAMED, { correlationId, streamId, stream });
        } catch (error) {
            this.releaseController(requestId, controller); !signal.aborted && this.pulse(SignalType.ERROR, this.describeFailure(error, payload));
        }
    }

    private async openStream(payload: GeneratePayload, requestId: string, controller: AbortController): Promise<ReadableStream<string>> {
        const { prompt } = payload;
        const { signal } = controller;
        const { model, config } = this.resolveGenerationConfig(payload);
        const { models } = this.resolveClient();
        const iterator = await models.generateContentStream({ model, contents: prompt, config: { ...config, abortSignal: signal } });
        signal.throwIfAborted();
        return createStream(iterator, controller, () => this.releaseController(requestId, controller));
    }

    private handleAbort(value: unknown): void {
        const { correlationId, streamId } = value as AbortPayload;
        this.controllers.forEach(({ controller, correlationId: activeCorrelation }, requestId) => {
            const matches = streamId ? requestId === streamId : !correlationId || activeCorrelation === correlationId;
            if (matches) {
                controller.abort();
                this.controllers.delete(requestId);
            }
        });
    }

    private replaceController(requestId: string, correlationId: string, controller: AbortController): void {
        const active = this.controllers.get(requestId);
        const {
            controller: activeController,
        } = active ?? {};
        activeController?.abort();
        this.controllers.set(requestId, { controller, correlationId });
    }

    private releaseController(requestId: string, controller: AbortController): void {
        const active = this.controllers.get(requestId);
        const {
            controller: activeController,
        } = active ?? {};
        if (activeController === controller) {
            this.controllers.delete(requestId);
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

    private async handleGenerate(value: unknown): Promise<void> {
        const payload = this.extractPayload<GeneratePayload>(value);
        if (!payload) { return; }
        const { correlationId } = payload;
        try {
            const client = this.resolveClient();
            const result = await this.executeGeneration(client, payload);
            this.pulse(SignalType.GENERATED, result);
        } catch (error) {
            this.pulse(SignalType.ERROR, this.describeFailure(error, payload));
        }
    }

    private describeFailure(error: unknown, payload: GeneratePayload): Failure {
        const {
            correlationId,
        } = payload;
        const {
            model,
            config,
        } = this.resolveGenerationConfig(payload);
        const {
            message = String(error),
            status,
        } = error as ApiFailure;
        const configuration = Object.keys(config).join(', ');
        const schemaSize = JSON.stringify(config.responseJsonSchema ?? {}).length;
        const description = `[${status ?? 'unknown'}] ${message} | model: ${model} | config: ${configuration} | schemaSize: ${schemaSize}`;
        return {
            error: description,
            status,
            model,
            configuration,
            schemaSize,
            correlationId,
        };
    }

    private async executeGeneration(client: GoogleGenAI, payload: GeneratePayload): Promise<GenerateResult> {
        const { prompt, correlationId } = payload;
        const { model, config } = this.resolveGenerationConfig(payload);
        const response = await client.models.generateContent({ model, contents: prompt, config });
        return this.formatResult(response, prompt, model, correlationId);
    }

    private resolveGenerationConfig(payload: GeneratePayload): { model: string; config: Record<string, unknown> } {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const model = payload.model ?? body.model ?? DEFAULT_MODEL;
        const thinkingLevel = payload.thinkingLevel ?? body.thinkingLevel;
        const thinkingBudget = payload.thinkingBudget ?? body.thinkingBudget;
        const thinkingConfig = this.resolveThinkingConfig(model, thinkingLevel, thinkingBudget);
        const config = this.buildConfig(payload, body, model, thinkingConfig);
        return { model, config };
    }

    private buildConfig(payload: GeneratePayload, body: Body, model: string, thinkingConfig?: Record<string, unknown>): Record<string, unknown> {
        const systemInstruction = payload.systemInstruction ?? body.systemInstruction;
        const schema = typeof payload.schema === 'string' ? JSON.parse(payload.schema) : payload.schema;
        const responseMimeType = payload.responseMimeType ?? body.responseMimeType ?? (schema ? 'application/json' : undefined);
        const allowSampling = !thinkingConfig && !model.startsWith(THINKING_LEVEL_MODEL_PREFIX);
        const temperature = allowSampling ? (payload.temperature ?? body.temperature) : undefined;
        const maxOutputTokens = payload.maxOutputTokens ?? body.maxOutputTokens;
        return { ...(systemInstruction && { systemInstruction }), ...(responseMimeType && { responseMimeType }), ...(schema && { responseJsonSchema: schema }), ...(thinkingConfig && { thinkingConfig }), ...(temperature !== undefined && { temperature }), ...(maxOutputTokens !== undefined && { maxOutputTokens }) };
    }

    private resolveThinkingConfig(model: string, thinkingLevel?: ThinkingLevel, thinkingBudget?: number): Record<string, unknown> | undefined {
        if (model.includes('lite')) {
            return undefined;
        }
        if (model.startsWith(THINKING_LEVEL_MODEL_PREFIX)) {
            return { thinkingLevel: thinkingLevel ?? DEFAULT_THINKING_LEVEL };
        }
        if (thinkingBudget !== undefined) {
            return { thinkingBudget };
        }
        return { thinkingBudget: 0 };
    }

    private formatResult(response: { text?: string; usageMetadata?: unknown }, prompt: string, model: string, correlationId?: string): GenerateResult {
        const { text = '', usageMetadata } = response;
        const usage = usageMetadata as Record<string, unknown> | undefined;
        let data: unknown;
        try {
            data = text ? JSON.parse(text) : undefined;
        } catch {
            data = undefined;
        }
        return { prompt, text, data, model, usage, correlationId };
    }

    private resolveClient(): GoogleGenAI {
        const { aim } = this.disposition;
        const { client, connection } = aim.body ?? {};
        if (client) { return client; }
        const apiKey = this.resolveApiKey(connection);
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY no configurada. Define GEMINI_API_KEY en .env');
        }
        return this.createClient(connection, apiKey);
    }

    private createClient(config?: ConnectionConfig, apiKey?: string): GoogleGenAI {
        this.sanitizeEnvironment();
        const { baseURL } = config ?? {};
        const httpOptions = baseURL ? { baseUrl: baseURL } : undefined;
        const clientOptions = { apiKey, ...(httpOptions && { httpOptions }) };
        return new GoogleGenAI(clientOptions);
    }

    private sanitizeEnvironment(): void {
        if (typeof process === 'undefined') { return; }
        const creds = process.env?.GOOGLE_APPLICATION_CREDENTIALS;
        if (creds?.includes('firebase-tools.json') || creds?.startsWith('~')) {
            delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
        }
    }

    private resolveApiKey(config?: ConnectionConfig): string | undefined {
        const { apiKey } = config ?? {};
        const env = typeof process !== 'undefined' ? process.env : undefined;
        const envKey = env?.GEMINI_API_KEY ?? env?.GOOGLE_GENAI_API_KEY ?? env?.GOOGLE_API_KEY;
        const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('GEMINI_API_KEY') ?? undefined : undefined;
        return apiKey ?? envKey ?? localKey;
    }
}

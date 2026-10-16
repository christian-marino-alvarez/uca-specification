import { createStream } from './stream.js';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import OpenAI from 'openai';
import {
    __ID__,
    DEFAULT_MAX_OUTPUT_TOKENS,
    DEFAULT_MODEL,
    DEFAULT_TEMPERATURE,
} from './constants.js';
import {
    type Body,
    type ConnectionConfig,
    type GeneratePayload,
    type GenerateResult,
    DataType,
    SignalType,
} from './types.js';

export class Openai extends Capability<Body> {
    public static readonly AIM: string = 'Generate cognitive inferences and structured view graphs using OpenAI API';

    public static override disposition: Disposition<Body> = {
        aim: { description: Openai.AIM, body: {} },
        reactTo: [
            SignalType.CONNECT,
            SignalType.GENERATE,
            SignalType.STREAM,
            SignalType.ABORT,
        ],
        inputs: [
            { signal: SignalType.ABORT, type: DataType.ABORT_PAYLOAD, description: 'Abort a pending generation' },
            { signal: SignalType.CONNECT, type: DataType.CONNECTION_CONFIG, description: 'Configure OpenAI API connection' },
            { signal: SignalType.GENERATE, type: DataType.GENERATE_PAYLOAD, description: 'Generate cognitive text or structured JSON' },
            { signal: SignalType.STREAM, type: DataType.GENERATE_PAYLOAD, description: 'Stream cognitive tokens in real-time' },
        ],
        outputs: [
            { signal: SignalType.CONNECTED, type: DataType.CONNECTION_STATUS, description: 'OpenAI connection confirmed' },
            { signal: SignalType.GENERATED, type: DataType.GENERATE_RESULT, description: 'Generated inference and structured data' },
            { signal: SignalType.STREAMED, type: DataType.STREAM_RESULT, description: 'Owned stream of generated text' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Error notification' },
        ],
    };

    private readonly controllers = new Map<string, AbortController>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.controllers.forEach((controller) => controller.abort());
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
        try {
            const client = this.resolveClient();
            const result = await this.executeGeneration(client, payload);
            this.pulse(SignalType.GENERATED, result);
        } catch (error) {
            this.pulse(SignalType.ERROR, { error: String(error), correlationId: payload.correlationId });
        }
    }

    private async executeGeneration(client: OpenAI, payload: GeneratePayload): Promise<GenerateResult> {
        const { prompt, schema, systemInstruction, temperature = DEFAULT_TEMPERATURE, maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS, model = DEFAULT_MODEL, correlationId } = payload;
        const messages = this.buildMessages(prompt, systemInstruction);
        const responseFormat = schema ? { type: 'json_object' as const } : undefined;
        const response = await client.chat.completions.create({ model, messages, temperature, max_tokens: maxOutputTokens, response_format: responseFormat });
        return this.formatResult(response, prompt, model, correlationId);
    }

    private buildMessages(prompt: string, systemInstruction?: string): Array<{ role: 'system' | 'user'; content: string }> {
        const systemMessage = systemInstruction ? [{ role: 'system' as const, content: systemInstruction }] : [];
        return [...systemMessage, { role: 'user' as const, content: prompt }];
    }

    private formatResult(response: OpenAI.Chat.Completions.ChatCompletion, prompt: string, model: string, correlationId?: string): GenerateResult {
        const { choices, usage } = response;
        const text = choices[0]?.message?.content ?? '';
        let data: unknown;
        try {
            data = text ? JSON.parse(text) : undefined;
        } catch {
            data = undefined;
        }
        return { prompt, text, data, model, usage, correlationId };
    }

    private async handleStream(value: unknown): Promise<void> {
        const payload = this.extractPayload<GeneratePayload>(value)!;
        const { correlationId = crypto.randomUUID(), streamId } = payload;
        const controller = new AbortController(); const { signal } = controller;
        this.controllers.get(correlationId)?.abort(); this.controllers.set(correlationId, controller);
        try {
            const stream = await this.openStream(payload, correlationId, controller);
            this.pulse(SignalType.STREAMED, { correlationId, streamId, stream });
        } catch (error) {
            this.controllers.get(correlationId) === controller && this.controllers.delete(correlationId); !signal.aborted && this.pulse(SignalType.ERROR, { error: String(error), correlationId });
        }
    }

    private async openStream(payload: GeneratePayload, correlationId: string, controller: AbortController): Promise<ReadableStream<string>> {
        const { prompt } = payload;
        const { signal } = controller;
        const { model = DEFAULT_MODEL, schema, systemInstruction, temperature = DEFAULT_TEMPERATURE, maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS } = payload;
        const { chat: { completions } } = this.resolveClient();
        const messages = this.buildMessages(prompt, systemInstruction);
        const response_format = schema ? { type: 'json_object' as const } : undefined;
        const iterator = await completions.create({ model, messages, stream: true, response_format, temperature, max_tokens: maxOutputTokens }, { signal });
        signal.throwIfAborted();
        return createStream(iterator[Symbol.asyncIterator](), controller, () => { this.controllers.get(correlationId) === controller && this.controllers.delete(correlationId); });
    }

    private handleAbort(value: unknown): void {
        const { correlationId } = value as { correlationId?: string };
        if (correlationId) {
            this.controllers.get(correlationId)?.abort(); this.controllers.delete(correlationId);
        }
        else {
            this.controllers.forEach((controller) => controller.abort()); this.controllers.clear();
        }
    }

    private resolveClient(): OpenAI {
        const { aim } = this.disposition;
        const { client, connection } = aim.body ?? {};
        if (client) { return client; }
        const apiKey = this.resolveApiKey(connection);
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY no configurada. Define OPENAI_API_KEY en .env');
        }
        return this.createClient(connection, apiKey);
    }

    private createClient(config?: ConnectionConfig, apiKey?: string): OpenAI {
        const { baseURL } = config ?? {};
        return new OpenAI({ apiKey, ...(baseURL && { baseURL }) });
    }

    private resolveApiKey(config?: ConnectionConfig): string | undefined {
        const { apiKey } = config ?? {};
        const env = typeof process !== 'undefined' ? process.env : undefined;
        const envKey = env?.OPENAI_API_KEY;
        const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('OPENAI_API_KEY') ?? undefined : undefined;
        return apiKey ?? envKey ?? localKey;
    }
}



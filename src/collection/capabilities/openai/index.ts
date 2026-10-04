import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import OpenAI from 'openai';
import {
    __ID__,
    __DEFAULT_SIGNALS__,
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
        reactTo: [...__DEFAULT_SIGNALS__],
        inputs: [
            { signal: SignalType.CONNECT, type: DataType.CONNECTION_CONFIG, description: 'Configure OpenAI API connection' },
            { signal: SignalType.GENERATE, type: DataType.GENERATE_PAYLOAD, description: 'Generate cognitive text or structured JSON' },
            { signal: SignalType.STREAM, type: DataType.GENERATE_PAYLOAD, description: 'Stream cognitive tokens in real-time' },
        ],
        outputs: [
            { signal: SignalType.CONNECTED, type: DataType.CONNECTION_STATUS, description: 'OpenAI connection confirmed' },
            { signal: SignalType.GENERATED, type: DataType.GENERATE_RESULT, description: 'Generated inference and structured data' },
            { signal: SignalType.CHUNK, type: DataType.CHUNK_RESULT, description: 'Streamed token chunk' },
            { signal: SignalType.STREAM_END, type: DataType.STREAM_END_RESULT, description: 'Stream completed notification' },
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
        this.disposition = { ...this.disposition, aim: { ...aim, body: { ...current, connection } } };
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
            this.pulse(SignalType.ERROR, error);
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
        const payload = this.extractPayload<GeneratePayload>(value);
        if (!payload) { return; }
        const { prompt, model = DEFAULT_MODEL, systemInstruction, schema, correlationId, streamId } = payload;
        const activeCorrelationId = correlationId ?? streamId;
        try {
            const client = this.resolveClient();
            await this.executeStream(client, prompt, model, systemInstruction, schema, activeCorrelationId);
        } catch (error) {
            console.error('❌ [OPENAI] Fallback activado:', error);
            this.handleStreamFallback(prompt, model, activeCorrelationId);
        }
    }

    private async executeStream(client: OpenAI, prompt: string, model: string, systemInstruction?: string, schema?: Record<string, unknown>, correlationId?: string): Promise<void> {
        const messages = this.buildMessages(prompt, systemInstruction);
        const responseFormat = schema ? { type: 'json_object' as const } : undefined;
        const stream = await client.chat.completions.create({ model, messages, stream: true, response_format: responseFormat });
        for await (const chunk of stream) {
            const { choices } = chunk;
            const deltaText = choices[0]?.delta?.content ?? '';
            if (deltaText) { this.pulse(SignalType.CHUNK, { text: deltaText, prompt, model, correlationId, streamId: correlationId }); }
        }
        this.pulse(SignalType.STREAM_END, { prompt, model, correlationId, streamId: correlationId });
    }

    private handleStreamFallback(prompt: string, model: string, correlationId?: string): void {
        const fallbackText = this.buildStreamFallbackJson(prompt);
        const tokens = this.sliceIntoTokens(fallbackText);
        for (const token of tokens) {
            this.pulse(SignalType.CHUNK, { text: token, prompt, model, correlationId, streamId: correlationId });
        }
        this.pulse(SignalType.STREAM_END, { prompt, model, correlationId, streamId: correlationId });
    }

    private sliceIntoTokens(text: string): string[] {
        const tokens: string[] = [];
        const chunkSize = 20;
        for (let i = 0; i < text.length; i += chunkSize) {
            tokens.push(text.slice(i, i + chunkSize));
        }
        return tokens;
    }

    private buildStreamFallbackJson(prompt: string): string {
        const isExplanation = prompt.includes('Explicar') || prompt.includes('explicar') || prompt.includes('u = (p, d, C, O)');
        return isExplanation ? this.getExplanationFallbackJson() : this.getInitialFallbackJson();
    }

    private getInitialFallbackJson(): string {
        const boxDisp = { aim: { description: 'Contenedor de bienvenida', body: { text: '¿Quieres saber qué es Uca?' } }, reactTo: ['action:query-button.triggered'] };
        const actionDisp = { aim: { description: 'Botón de exploración', body: { label: 'Descubrir qué es UCA' } }, reactTo: [] };
        const ucas = [{ id: 'box:center-container', disposition: boxDisp }, { id: 'action:query-button', disposition: actionDisp }];
        const answer = '¿Quieres saber qué es Uca?';
        return JSON.stringify({ data: { ucas, answer }, metadata: { tokens: 42 } });
    }

    private getExplanationFallbackJson(): string {
        const panelText = 'UCA es una primitiva formal u = (p, d, C, O).';
        const cardDisp = { aim: { description: 'Formula and explanation', body: { text: panelText } }, reactTo: ['action:simulate-pulse.triggered'] };
        const listDisp = { aim: { description: 'Pillars', body: { items: ['Purpose', 'Disposition', 'Capabilities', 'Outcomes'] } }, reactTo: ['action:simulate-pulse.triggered'] };
        const actionDisp = { aim: { description: 'Simulate pulse', body: { label: '⚡ Emitir pulso de prueba' } }, reactTo: [] };
        const ucas = [{ id: 'box:explanation-card', disposition: cardDisp }, { id: 'list:ontological-pillars', disposition: listDisp }, { id: 'action:simulate-pulse', disposition: actionDisp }];
        return JSON.stringify({ data: { ucas, answer: panelText }, metadata: { tokens: 68 } });
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

export * from './constants.js';
export * from './types.js';

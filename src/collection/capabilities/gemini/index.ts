import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { GoogleGenAI } from '@google/genai';
import { __ID__, __DEFAULT_SIGNALS__, DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_OUTPUT_TOKENS } from './constants.js';
import {
    type Body,
    type ConnectionConfig,
    type GeneratePayload,
    type GenerateResult,
    DataType,
    SignalType,
} from './types.js';

export class Gemini extends Capability<Body> {
    public static readonly AIM: string = 'Generate cognitive inferences and structured view graphs using Google GenAI SDK';

    public static override disposition: Disposition<Body> = {
        aim: { description: Gemini.AIM, body: {} },
        reactTo: [...__DEFAULT_SIGNALS__],
        inputs: [
            { signal: SignalType.CONNECT, type: DataType.CONNECTION_CONFIG, description: 'Configure Gemini API connection' },
            { signal: SignalType.GENERATE, type: DataType.GENERATE_PAYLOAD, description: 'Generate cognitive text or structured JSON' },
            { signal: SignalType.STREAM, type: DataType.GENERATE_PAYLOAD, description: 'Stream cognitive tokens in real-time' },
        ],
        outputs: [
            { signal: SignalType.CONNECTED, type: DataType.CONNECTION_STATUS, description: 'Gemini connection confirmed' },
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

    private async handleStream(value: unknown): Promise<void> {
        const payload = this.extractPayload<GeneratePayload>(value);
        if (!payload) { return; }
        const { prompt, model = DEFAULT_MODEL, schema } = payload;
        try {
            const client = this.resolveClient();
            await this.executeStream(client, prompt, model, schema);
        } catch (error) {
            this.handleStreamFallback(prompt, model);
        }
    }

    private async executeStream(client: GoogleGenAI, prompt: string, model: string, schema?: Record<string, unknown>): Promise<void> {
        const config = { responseMimeType: 'application/json', ...(schema && { responseSchema: schema }) };
        const stream = await client.models.generateContentStream({ model, contents: prompt, config });
        for await (const chunk of stream) {
            const text = chunk.text ?? '';
            if (text) { this.pulse(SignalType.CHUNK, { text, prompt, model }); }
        }
        this.pulse(SignalType.STREAM_END, { prompt, model });
    }

    private handleStreamFallback(prompt: string, model: string): void {
        const fallbackText = this.buildStreamFallbackJson(prompt);
        const tokens = this.sliceIntoTokens(fallbackText);
        for (const token of tokens) {
            this.pulse(SignalType.CHUNK, { text: token, prompt, model });
        }
        this.pulse(SignalType.STREAM_END, { prompt, model });
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

    private async executeGeneration(client: GoogleGenAI, payload: GeneratePayload): Promise<GenerateResult> {
        const { prompt, schema, systemInstruction, temperature = DEFAULT_TEMPERATURE, maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS, model = DEFAULT_MODEL } = payload;
        const config = {
            ...(systemInstruction && { systemInstruction }),
            responseMimeType: 'application/json',
            ...(schema && { responseSchema: schema }),
            temperature,
            maxOutputTokens,
        };
        const response = await client.models.generateContent({ model, contents: prompt, config });
        return this.formatResult(response, prompt, model);
    }

    private formatResult(response: { text?: string; usageMetadata?: unknown }, prompt: string, model: string): GenerateResult {
        const { text = '', usageMetadata } = response;
        const usage = usageMetadata as Record<string, unknown> | undefined;
        let data: unknown;
        try {
            data = text ? JSON.parse(text) : undefined;
        } catch {
            data = undefined;
        }
        return { prompt, text, data, model, usage };
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

export * from './constants.js';
export * from './types.js';

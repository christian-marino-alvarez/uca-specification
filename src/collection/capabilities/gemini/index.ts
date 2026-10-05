import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { GoogleGenAI } from '@google/genai';
import { __ID__, __DEFAULT_SIGNALS__, DEFAULT_MODEL, DEFAULT_THINKING_LEVEL, THINKING_LEVEL_MODEL_PREFIX } from './constants.js';
import {
    type Body,
    type ConnectionConfig,
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
        const { prompt, correlationId, streamId } = payload;
        const activeCorrelationId = correlationId ?? streamId;
        try {
            await this.executeStream(this.resolveClient(), payload, activeCorrelationId);
        } catch (error) {
            console.error('❌ [GEMINI] Fallback activado:', error);
            this.pulse(SignalType.ERROR, { error: String(error), correlationId: activeCorrelationId });
            this.handleStreamFallback(prompt, activeCorrelationId);
        }
    }

    private async executeStream(client: GoogleGenAI, payload: GeneratePayload, correlationId?: string): Promise<void> {
        const { prompt } = payload;
        const { model, config } = this.resolveGenerationConfig(payload);
        const state = { start: Date.now(), first: true };
        console.log(`⏳ [GEMINI API] [${correlationId ?? 'stream'}] [t=0ms] Iniciando petición generateContentStream con prompt de ${prompt.length} caracteres y config:`, JSON.stringify(config, null, 2));
        const stream = await client.models.generateContentStream({ model, contents: prompt, config });
        console.log(`✅ [GEMINI API] [${correlationId ?? 'stream'}] [t=+${Date.now() - state.start}ms] Promesa de stream resuelta. Esperando primer chunk...`);
        for await (const chunk of stream) { this.handleStreamChunk(chunk, state, prompt, model, correlationId); }
        console.log(`🏁 [GEMINI API] [${correlationId ?? 'stream'}] [t=+${Date.now() - state.start}ms] Stream completado.`);
        this.pulse(SignalType.STREAM_END, { prompt, model, correlationId, streamId: correlationId });
    }

    private handleStreamChunk(chunk: { text?: string }, state: { start: number; first: boolean }, prompt: string, model: string, correlationId?: string): void {
        const text = chunk.text ?? '';
        if (!text) { return; }
        if (state.first) {
            state.first = false;
            console.log(`⚡ [GEMINI API] [${correlationId ?? 'stream'}] [t=+${Date.now() - state.start}ms] ¡Primer token recibido!`);
        }
        this.pulse(SignalType.CHUNK, { text, prompt, model, correlationId, streamId: correlationId });
    }

    private handleStreamFallback(prompt: string, correlationId?: string): void {
        const fallbackText = this.buildStreamFallbackJson(prompt);
        const tokens = this.sliceIntoTokens(fallbackText);
        for (const token of tokens) {
            this.pulse(SignalType.CHUNK, { text: token, prompt, correlationId, streamId: correlationId });
        }
        this.pulse(SignalType.STREAM_END, { prompt, correlationId, streamId: correlationId });
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
        const { prompt, correlationId } = payload;
        const { model, config } = this.resolveGenerationConfig(payload);
        const response = await client.models.generateContent({ model, contents: prompt, config });
        return this.formatResult(response, prompt, model, correlationId);
    }

    private resolveGenerationConfig(payload: GeneratePayload): { model: string; config: Record<string, unknown> } {
        const { aim } = this.disposition;
        const { model: bM, temperature: bT, maxOutputTokens: bL, thinkingBudget: bB, thinkingLevel: bLevel, systemInstruction: bI, responseMimeType: bR } = (aim.body ?? {}) as Body;
        const { schema: s, systemInstruction = bI, temperature = bT, maxOutputTokens = bL, model = bM ?? DEFAULT_MODEL, thinkingBudget = bB, thinkingLevel = bLevel, responseMimeType = bR } = payload;
        const schema = typeof s === 'string' ? JSON.parse(s) : s;
        const mimeType = responseMimeType ?? (schema ? 'application/json' : undefined);
        const thinkingConfig = this.resolveThinkingConfig(model, thinkingBudget, thinkingLevel);
        const config = { ...(systemInstruction && { systemInstruction }), ...(mimeType && { responseMimeType: mimeType }), ...(schema && { responseJsonSchema: schema }), ...(thinkingConfig && { thinkingConfig }), ...(temperature !== undefined && { temperature }), ...(maxOutputTokens !== undefined && { maxOutputTokens }) };
        return { model, config };
    }

    private resolveThinkingConfig(model: string, thinkingBudget?: number, thinkingLevel?: ThinkingLevel): Record<string, unknown> | undefined {
        if (thinkingLevel) {
            return { thinkingLevel };
        }
        if (thinkingBudget !== undefined && thinkingBudget >= 0) {
            return { thinkingBudget };
        }
        return model.startsWith(THINKING_LEVEL_MODEL_PREFIX) ? { thinkingLevel: DEFAULT_THINKING_LEVEL } : undefined;
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


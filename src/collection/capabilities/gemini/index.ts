import { Capability } from '../../../core/capability.js';
import type { Disposition, Signal } from '../../../core/types.js';
import {
    type Body,
    type PromptConfig,
    type StreamOutput,
    type StreamProvider,
    SignalType,
} from './types.js';
import { GoogleGenAI } from '@google/genai';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';


export class Gemini extends Capability<Body> {
    public static readonly AIM: string = 'Manage connection lifecycle and produce ReadableStream inference from Gemini model';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(Gemini.AIM, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.CONNECT, type: 'ConnectionConfig', description: 'Establish or configure connection parameters' },
                { signal: SignalType.GENERATE, type: 'PromptConfig', description: 'PromptConfig { text, context, temperature, maxOutputTokens }' },
                { signal: SignalType.DISCONNECT, type: 'void', description: 'Close active connection and clean up resources' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort ongoing generative stream' },
            ],
            outputs: [
                { signal: SignalType.CONNECTED, type: '{ status: string }', description: 'Connection established notification' },
                { signal: SignalType.STREAM, type: 'ReadableStream<string>', description: 'ReadableStream<string>' },
                { signal: SignalType.CLOSED, type: '{ closedAt: number }', description: 'Connection closed notification' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'Connection or generation error payload' },
            ],
        });
    }


    private activeController?: AbortController;
    private isConnected: boolean = false;

    public constructor(id: string = __ID__) {
        super(id, Gemini.createDefaultDisposition());
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? this.disposition;
        const { reactTo = [] } = baseDisposition;
        const signals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        super.innervate(target, activeDisposition);
        return this;
    }

    public override denervate(): void {
        this.closeConnection();
        super.denervate();
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
            case SignalType.DISCONNECT:
            case SignalType.ABORT:
                this.closeConnection();
                break;
            default:
                break;
        }
    }

    private handleConnect(value: unknown): void {
        const payload = this.extractPayload<unknown>(value);
        this.isConnected = true;
        this.pulse(SignalType.CONNECTED, payload ?? { status: 'ready' });
    }

    private async handleGenerate(value: unknown): Promise<void> {
        const config = this.resolveConfig(value);
        if (config?.text) {
            await this.produceStream(config);
        }
    }

    private async produceStream(config: PromptConfig): Promise<void> {
        this.abortActiveStream();
        const controller = new AbortController();
        this.activeController = controller;
        try {
            const stream = await this.resolveProvider()({ ...config, signal: controller.signal });
            this.pulse(SignalType.STREAM, stream);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private abortActiveStream(): void {
        if (this.activeController) {
            this.activeController.abort();
            this.activeController = undefined;
        }
    }

    private closeConnection(): void {
        this.abortActiveStream();
        if (this.isConnected) {
            this.isConnected = false;
            this.pulse(SignalType.CLOSED, { closedAt: Date.now() });
        }
    }

    private resolveConfig(value: unknown): PromptConfig | undefined {
        const payload = this.extractPayload<PromptConfig | { text: string }>(value);
        const { aim } = this.disposition;
        const fallback = aim.body ?? {};
        if (typeof payload === 'string') {
            return { text: payload, ...fallback };
        }
        if (payload && typeof payload === 'object' && 'text' in payload) {
            return { ...fallback, ...payload } as PromptConfig;
        }
        return undefined;
    }

    private resolveProvider(): StreamProvider {
        const { aim } = this.disposition;
        const { streamProvider, client, connection } = aim.body ?? {};
        if (streamProvider) {
            return streamProvider;
        }
        if (client || connection?.apiKey) {
            return (config) => this.streamWithGenAiSdk(config);
        }
        return this.createDefaultReadableStream;
    }

    private streamWithGenAiSdk(config: PromptConfig): StreamOutput {
        const { aim } = this.disposition;
        const { client, connection } = aim.body ?? {};
        const genai = client ?? new GoogleGenAI({ apiKey: connection?.apiKey });
        const modelName = config.model ?? connection?.model ?? 'gemini-1.5-flash';
        return new ReadableStream<string>({
            async start(controller) {
                const response = await genai.models.generateContentStream({ model: modelName, contents: config.text });
                for await (const chunk of response) {
                    if (chunk.text) { controller.enqueue(chunk.text); }
                }
                controller.close();
            },
        });
    }

    private createDefaultReadableStream(config: PromptConfig): StreamOutput {
        const stream = new ReadableStream<string>({
            start(controller) {
                controller.enqueue(config.text);
                controller.close();
            },
        });
        return stream;
    }
}


export * from './constants.js';
export * from './types.js';

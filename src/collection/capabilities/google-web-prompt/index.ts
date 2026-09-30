import { Capability } from '../../../core/capability.js';
import type { Disposition, Signal } from '../../../core/types.js';
import {
    type Body,
    type PromptAdapter,
    type PromptPayload,
    type PromptSession,
    type SessionOptions,
    SignalType,
} from './types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';

export class GoogleWebPrompt extends Capability<Body> {
    public static readonly AIM: string = 'Manage native browser Web Prompt API session and stream local AI inferences';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(GoogleWebPrompt.AIM, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.CHECK, type: 'void', description: 'Check Web Prompt API availability in browser' },
                { signal: SignalType.CREATE, type: 'SessionOptions', description: 'Create local language model session' },
                { signal: SignalType.GENERATE, type: 'PromptPayload', description: 'Prompt local model and stream response' },
                { signal: SignalType.DESTROY, type: 'void', description: 'Destroy active session and release resources' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort active stream generation' },
            ],
            outputs: [
                { signal: SignalType.STATUS, type: 'AvailabilityResult', description: 'Availability check result' },
                { signal: SignalType.CREATED, type: 'void', description: 'Session created notification' },
                { signal: SignalType.STREAM, type: 'ReadableStream<string>', description: 'Streaming tokens from local AI' },
                { signal: SignalType.DESTROYED, type: 'void', description: 'Session destroyed notification' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'Error notification' },
            ],
        });
    }

    private activeSession?: PromptSession;
    private activeController?: AbortController;

    public constructor(id: string = __ID__) {
        super(id, GoogleWebPrompt.createDefaultDisposition());
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
        this.destroySession();
        super.denervate();
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CHECK:
                await this.handleCheck();
                break;
            case SignalType.CREATE:
                await this.handleCreate(value);
                break;
            case SignalType.GENERATE:
                await this.handleGenerate(value);
                break;
            case SignalType.DESTROY:
                this.destroySession();
                break;
            case SignalType.ABORT:
                this.abortActiveStream();
                break;
            default:
                break;
        }
    }

    private async handleCheck(): Promise<void> {
        try {
            const adapter = this.resolveAdapter();
            const status = await adapter.availability();
            this.pulse(SignalType.STATUS, { available: status === 'available', status });
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async handleCreate(value: unknown): Promise<void> {
        const options = this.extractPayload<SessionOptions>(value);
        const { aim } = this.disposition;
        const fallback = aim.body ?? {};
        const config: SessionOptions = { ...fallback, ...options };
        try {
            const adapter = this.resolveAdapter();
            this.activeSession = await adapter.create(config);
            this.pulse(SignalType.CREATED, undefined);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async handleGenerate(value: unknown): Promise<void> {
        const payload = this.resolvePromptPayload(value);
        if (!payload?.text) {
            return;
        }
        await this.streamPrompt(payload.text, payload.signal);
    }

    private async streamPrompt(text: string, customSignal?: AbortSignal): Promise<void> {
        const effectiveSignal = this.prepareStreamController(customSignal);
        console.debug('[GoogleWebPrompt] ► PROMPT INPUT:', text);
        try {
            const session = await this.ensureSession();
            const rawStream = session.promptStreaming(text, { signal: effectiveSignal });
            this.dispatchStream(rawStream);
        } catch (error) {
            console.error('[GoogleWebPrompt] ✗ STREAM ERROR:', error);
            this.pulse(SignalType.ERROR, error);
        }
    }

    private prepareStreamController(customSignal?: AbortSignal): AbortSignal {
        this.abortActiveStream();
        const controller = new AbortController();
        this.activeController = controller;
        const effectiveSignal = customSignal ?? controller.signal;
        return effectiveSignal;
    }

    private dispatchStream(rawStream: ReadableStream<string>): void {
        const [streamForPulse, streamForLogging] = rawStream.tee();
        void this.traceStreamChunks(streamForLogging);
        this.pulse(SignalType.STREAM, streamForPulse);
    }

    private async traceStreamChunks(stream: ReadableStream<string>): Promise<void> {
        try {
            const reader = stream.getReader();
            await this.logChunks(reader);
            console.debug('[GoogleWebPrompt] ◄ STREAM COMPLETED');
        } catch (error) {
            console.debug('[GoogleWebPrompt] ◄ STREAM TRACE FINISHED/ERROR:', error);
        }
    }

    private async logChunks(reader: ReadableStreamDefaultReader<string>): Promise<void> {
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            console.debug('[GoogleWebPrompt] ◄ OUTPUT CHUNK:', value);
        }
    }

    private async ensureSession(): Promise<PromptSession> {
        if (!this.activeSession) {
            const adapter = this.resolveAdapter();
            this.activeSession = await adapter.create({ outputLanguage: 'en' });
        }
        return this.activeSession;
    }

    private abortActiveStream(): void {
        if (this.activeController) {
            this.activeController.abort();
            this.activeController = undefined;
        }
    }

    private destroySession(): void {
        this.abortActiveStream();
        if (this.activeSession) {
            this.activeSession.destroy();
            this.activeSession = undefined;
            this.pulse(SignalType.DESTROYED, undefined);
        }
    }

    private resolvePromptPayload(value: unknown): PromptPayload | undefined {
        const payload = this.extractPayload<PromptPayload | string>(value);
        if (typeof payload === 'string') {
            return { text: payload };
        }
        if (payload && typeof payload === 'object' && 'text' in payload) {
            return payload as PromptPayload;
        }
        return undefined;
    }

    private resolveAdapter(): PromptAdapter {
        const { aim } = this.disposition;
        const { adapter } = aim.body ?? {};
        return adapter ?? this.createDefaultBrowserAdapter();
    }

    private createDefaultBrowserAdapter(): PromptAdapter {
        const globalTarget = globalThis as unknown as { LanguageModel?: PromptAdapter };
        const languageModel = globalTarget.LanguageModel;
        if (!languageModel) {
            return {
                availability: async () => 'unavailable',
                create: async () => { throw new Error('LanguageModel is not supported in current environment'); },
            };
        }
        return languageModel;
    }
}

export * from './constants.js';
export * from './types.js';

import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    DEFAULT_AUTO_LOAD,
    DEFAULT_EXPECTED_INPUTS,
    DEFAULT_EXPECTED_OUTPUTS,
    DEFAULT_PERSISTENT_SESSION,
    DEFAULT_TEMPERATURE,
    DEFAULT_TOP_K,
    DEFAULT_WARMUP_PROMPT,
} from './constants.js';
import {
    type AvailabilityOptions,
    type Body,
    type CreateOptions,
    type DownloadMonitor,
    type DownloadProgressEvent,
    type LanguageModelApi,
    type LanguageModelSession,
    type PromptInput,
    type PromptPayload,
    type StreamPayload,
    AvailabilityStatus,
    DataType,
    SignalType,
} from './types.js';

export class ApiPrompt extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: ApiPrompt.AIM, body: {} },
        reactTo: [
            SignalType.CHECK,
            SignalType.CREATE,
            SignalType.PROMPT,
            SignalType.STREAM,
            SignalType.DESTROY,
        ],
        inputs: [
            { signal: SignalType.CHECK, type: DataType.RECORD, description: 'Check browser prompt capability availability' },
            { signal: SignalType.CREATE, type: DataType.RECORD, description: 'Initialize or download browser language model session' },
            { signal: SignalType.PROMPT, type: DataType.RECORD, description: 'Execute a browser prompt' },
            { signal: SignalType.STREAM, type: DataType.RECORD, description: 'Execute a streaming prompt and return ReadableStream' },
            { signal: SignalType.DESTROY, type: DataType.RECORD, description: 'Destroy active language model session' },
        ],
        outputs: [
            { signal: SignalType.CHECKED, type: DataType.RECORD, description: 'Availability check result' },
            { signal: SignalType.DOWNLOADING, type: DataType.RECORD, description: 'Model download progress' },
            { signal: SignalType.READY, type: DataType.RECORD, description: 'Language model session ready' },
            { signal: SignalType.RESPONDED, type: DataType.RECORD, description: 'Prompt response result' },
            { signal: SignalType.STREAMED, type: DataType.RECORD, description: 'ReadableStream result for client consumption' },
            { signal: SignalType.DESTROYED, type: DataType.RECORD, description: 'Language model session destroyed confirmation' },
            { signal: SignalType.ERROR, type: DataType.RECORD, description: 'Inference, download or availability error' },
        ],
    };

    private static sharedSession?: LanguageModelSession;
    private static sharedSessionPromise?: Promise<LanguageModelSession>;

    public static prewarm(options?: CreateOptions): void {
        const api = typeof LanguageModel !== 'undefined' ? LanguageModel : undefined;
        if (!api?.create || ApiPrompt.sharedSession || ApiPrompt.sharedSessionPromise) { return; }
        ApiPrompt.sharedSessionPromise = ApiPrompt.executePrewarm(api, options);
    }

    public static resetSharedSession(): void {
        ApiPrompt.sharedSession?.destroy?.();
        ApiPrompt.sharedSession = undefined;
        ApiPrompt.sharedSessionPromise = undefined;
    }

    public static isSessionReady(): boolean {
        return Boolean(ApiPrompt.sharedSession);
    }

    public static async whenReady(): Promise<boolean> {
        if (ApiPrompt.sharedSession) { return true; }
        if (!ApiPrompt.sharedSessionPromise) { return false; }
        await ApiPrompt.sharedSessionPromise;
        return Boolean(ApiPrompt.sharedSession);
    }

    private static resolvePrewarmOptions(): CreateOptions {
        const expectedInputs = [...DEFAULT_EXPECTED_INPUTS];
        const expectedOutputs = [...DEFAULT_EXPECTED_OUTPUTS];
        return { expectedInputs, expectedOutputs, temperature: DEFAULT_TEMPERATURE, topK: DEFAULT_TOP_K };
    }

    private static async executePrewarm(api: LanguageModelApi, options?: CreateOptions): Promise<LanguageModelSession> {
        try {
            const target = options ?? ApiPrompt.resolvePrewarmOptions();
            const session = (await api.create?.(target)) as LanguageModelSession;
            return await ApiPrompt.warmupSession(session);
        } catch {
            return undefined as unknown as LanguageModelSession;
        } finally {
            ApiPrompt.sharedSessionPromise = undefined;
        }
    }

    private static async warmupSession(session?: LanguageModelSession): Promise<LanguageModelSession> {
        await session?.prompt?.(DEFAULT_WARMUP_PROMPT);
        return (ApiPrompt.sharedSession = session as LanguageModelSession);
    }

    private session?: LanguageModelSession;
    private sessionPromise?: Promise<LanguageModelSession>;

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.preloadSession();
    }

    public override denervate(): void {
        super.denervate();
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CHECK:
                await this.handleCheck(value);
                break;
            case SignalType.CREATE:
                await this.handleCreate(value);
                break;
            case SignalType.PROMPT:
                await this.handlePrompt(value);
                break;
            case SignalType.STREAM:
                await this.handleStream(value);
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            default:
                break;
        }
    }

    private log(action: string, detail?: unknown): void {
        const { aim } = this.disposition;
        const { silent } = (aim.body ?? {}) as Body;
        if (silent) { return; }
        const timestamp = new Date().toISOString();
        const detailSuffix = detail !== undefined ? ` | ${JSON.stringify(detail)}` : '';
        console.log(`🤖 [${this.id}] [${timestamp}] ${action}${detailSuffix}`);
    }

    private logError(action: string, error: unknown): void {
        const timestamp = new Date().toISOString();
        console.error(`🚨 [${this.id}] [${timestamp}] ${action}:`, error);
    }

    private handleError(action: string, error: unknown): void {
        this.logError(action, error);
        this.pulse(SignalType.ERROR, { action, error: String(error) });
    }

    private resolveAvailabilityOptions(payload?: unknown): AvailabilityOptions {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const custom = (payload ?? {}) as AvailabilityOptions;
        const expectedInputs = custom.expectedInputs ?? body.expectedInputs ?? DEFAULT_EXPECTED_INPUTS;
        const expectedOutputs = custom.expectedOutputs ?? body.expectedOutputs ?? DEFAULT_EXPECTED_OUTPUTS;
        const { temperature = body.temperature ?? DEFAULT_TEMPERATURE, topK = body.topK ?? DEFAULT_TOP_K } = custom;
        return { expectedInputs, expectedOutputs, temperature, topK };
    }

    private resolveCreateOptions(payload?: unknown): CreateOptions {
        const availabilityOptions = this.resolveAvailabilityOptions(payload);
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const custom = (payload ?? {}) as CreateOptions;
        const { systemPrompt = body.systemPrompt, signal } = custom;
        const persistentSession = custom.persistentSession ?? body.persistentSession;
        return { ...availabilityOptions, ...(systemPrompt && { systemPrompt }), ...(signal && { signal }), ...(persistentSession !== undefined && { persistentSession }) };
    }

    private async handleCheck(value?: unknown): Promise<void> {
        this.log('Checking model availability');
        const options = this.resolveAvailabilityOptions(value);
        try {
            const status = await this.queryAvailability(options);
            this.pulseAvailability(options, status);
        } catch (error) {
            this.handleError('Availability check failed', error);
        }
    }

    private pulseAvailability(options: AvailabilityOptions, status: string): void {
        const { expectedInputs, expectedOutputs } = options;
        const available = status === AvailabilityStatus.AVAILABLE || status === AvailabilityStatus.READILY;
        this.log(`Availability status: ${status}`, { available });
        this.pulse(SignalType.CHECKED, { available, status, expectedInputs, expectedOutputs });
    }

    private async queryAvailability(options: AvailabilityOptions): Promise<string> {
        const api = typeof LanguageModel !== 'undefined' ? LanguageModel : undefined;
        const status = await api?.availability?.(options);
        return status ?? AvailabilityStatus.UNAVAILABLE;
    }

    private setupMonitor(options: CreateOptions): CreateOptions {
        const monitor = (downloadMonitor: DownloadMonitor) => {
            downloadMonitor.addEventListener('downloadprogress', (event: Event) => {
                this.handleDownloadProgress(event as DownloadProgressEvent);
            });
        };
        return { ...options, monitor };
    }

    private handleDownloadProgress(event: DownloadProgressEvent): void {
        const { loaded, total } = event;
        const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
        this.log(`Download progress: ${percentage}% (${loaded}/${total} bytes)`);
        this.pulse(SignalType.DOWNLOADING, { loaded, total, percentage });
    }

    private preloadSession(): void {
        const { aim } = this.disposition;
        const { autoLoad = DEFAULT_AUTO_LOAD } = (aim.body ?? {}) as Body;
        if (autoLoad && typeof LanguageModel !== 'undefined') {
            void this.handleCreate();
        }
    }

    private isSessionActive(): boolean {
        if (typeof LanguageModel === 'undefined') { return false; }
        const { aim } = this.disposition;
        const { persistentSession = DEFAULT_PERSISTENT_SESSION } = (aim.body ?? {}) as Body;
        const activeSession = persistentSession ? (ApiPrompt.sharedSession ?? this.session) : this.session;
        const active = Boolean(activeSession && persistentSession);
        if (active) { this.pulse(SignalType.READY, { ready: true }); }
        return active;
    }

    private async handleCreate(value?: unknown): Promise<void> {
        if (this.isSessionActive()) { return; }
        this.log('Creating language model session');
        try {
            const options = this.setupMonitor(this.resolveCreateOptions(value));
            await this.ensureSession(options);
            this.pulse(SignalType.READY, { ready: true });
        } catch (error) {
            this.handleError('Session creation failed', error);
        }
    }

    private async createSession(options: CreateOptions): Promise<LanguageModelSession> {
        const api = typeof LanguageModel !== 'undefined' ? LanguageModel : undefined;
        if (!api?.create) {
            throw new Error('ApiPrompt capability is only supported in browser environments with window.LanguageModel');
        }
        return api.create(options);
    }

    private async ensureSession(options?: CreateOptions): Promise<LanguageModelSession> {
        this.assertBrowserEnvironment();
        const { aim } = this.disposition;
        const { persistentSession = DEFAULT_PERSISTENT_SESSION } = (aim.body ?? {}) as Body;
        const activeSession = persistentSession ? (ApiPrompt.sharedSession ?? this.session) : this.session;
        if (activeSession) { return activeSession; }
        const pendingSession = persistentSession ? (ApiPrompt.sharedSessionPromise ?? this.sessionPromise) : this.sessionPromise;
        return pendingSession ?? this.initSession(options, persistentSession);
    }

    private assertBrowserEnvironment(): void {
        if (typeof LanguageModel === 'undefined') {
            throw new Error('ApiPrompt capability is only supported in browser environments with window.LanguageModel');
        }
    }

    private async initSession(options?: CreateOptions, persistent?: boolean): Promise<LanguageModelSession> {
        this.log('No active session found, auto-initializing session');
        const resolved = this.setupMonitor(options ?? this.resolveCreateOptions());
        const promise = this.executeSessionCreation(resolved, persistent);
        if (persistent) { ApiPrompt.sharedSessionPromise = promise; } else { this.sessionPromise = promise; }
        return promise;
    }

    private async executeSessionCreation(resolved: CreateOptions, persistent?: boolean): Promise<LanguageModelSession> {
        try {
            const session = await this.createSession(resolved);
            return this.assignSession(session, persistent);
        } catch (error) {
            return this.clearSessionPromise(error, persistent);
        }
    }

    private assignSession(session: LanguageModelSession, persistent?: boolean): LanguageModelSession {
        this.session = session;
        if (persistent) { ApiPrompt.sharedSession = session; ApiPrompt.sharedSessionPromise = undefined; }
        this.sessionPromise = undefined;
        return session;
    }

    private clearSessionPromise(error: unknown, persistent?: boolean): never {
        if (persistent) { ApiPrompt.sharedSessionPromise = undefined; }
        this.sessionPromise = undefined;
        throw error;
    }

    private async handlePrompt(value: unknown): Promise<void> {
        const { correlationId, prompt = '' } = (value ?? {}) as PromptPayload;
        try {
            const session = await this.ensureSession();
            const response = await session.prompt(prompt);
            this.pulse(SignalType.RESPONDED, { correlationId, response });
        } catch (error) {
            this.handleError('Prompt execution failed', error);
        }
    }

    private async handleStream(value: unknown): Promise<void> {
        const { correlationId, streamId, prompt = '' } = (value ?? {}) as StreamPayload;
        try {
            const session = await this.ensureSession();
            const stream = session.promptStreaming(prompt);
            this.pulse(SignalType.STREAMED, { correlationId, streamId, stream });
        } catch (error) {
            this.handleError('Stream execution failed', error);
        }
    }

    private handleDestroy(): void {
        const { aim } = this.disposition;
        const { persistentSession = DEFAULT_PERSISTENT_SESSION } = (aim.body ?? {}) as Body;
        if (persistentSession) {
            this.pulse(SignalType.DESTROYED, { destroyed: false });
            return;
        }
        this.log('Destroying language model session');
        this.session?.destroy?.();
        this.session = undefined;
        this.sessionPromise = undefined;
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }
}

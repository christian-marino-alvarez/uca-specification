import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { ApiPrompt } from '@uca/capability-api-prompt';
import {
    SignalType as ApiPromptSignalType,
    type Body as ApiPromptBody,
    type PromptInput,
} from '@uca/capability-api-prompt/types';
import {
    __ID__,
    DEFAULT_ENDPOINT,
    DEFAULT_IMAGINATION,
    DEFAULT_LOCAL_PROVIDER,
    DEFAULT_MODEL,
    DEFAULT_NUBE_PROVIDER,
    DEFAULT_SIGNALS,
} from './constants.js';
import {
    type Body,
    type CreatePayload,
    type StreamPayload,
    type StreamResult,
    DataType,
    SignalType,
} from './types.js';

export class WebLlm extends Uca<Body> {
    public static override purpose: string = 'Orchestrate cognitive language model connections across local and nube providers';

    public static override disposition: Disposition<Body> = {
        aim: { description: WebLlm.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.CREATE_PAYLOAD, description: 'Initialize local model session or remote connection' },
            { signal: SignalType.STREAM, type: DataType.STREAM_PAYLOAD, description: 'Request reasoning inference with streaming response' },
            { signal: SignalType.DESTROY, type: DataType.DESTROY_PAYLOAD, description: 'Destroy active session or abort streaming requests' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.READY_RESULT, description: 'Model session created confirmation' },
            { signal: SignalType.READY, type: DataType.READY_RESULT, description: 'Model connection ready for inference' },
            { signal: SignalType.STREAMED, type: DataType.STREAM_RESULT, description: 'ReadableStream result for client consumption' },
            { signal: SignalType.DESTROYED, type: DataType.DESTROY_RESULT, description: 'Model session destroyed confirmation' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Language model connection or streaming error' },
        ],
    };

    private abortController?: AbortController;

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override capabilities(): Cooky {
        const disposition: Disposition<ApiPromptBody> = {
            aim: { description: 'Browser on-device prompt capability', body: { id: `${this.id}:api-prompt`, silent: true, persistentSession: true } },
            reactTo: [...ApiPrompt.disposition.reactTo ?? []],
        };
        return [[ApiPrompt, disposition]];
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, source, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                await this.handleCreate(value);
                break;
            case SignalType.STREAM:
                await this.handleStream(value);
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            default:
                this.handleCapabilitySignal(property, source, value);
                break;
        }
    }

    private resolveModel(requested?: string): string {
        const { aim } = this.disposition;
        const { model = DEFAULT_MODEL } = (aim.body ?? {}) as Body;
        return requested ?? model;
    }

    private resolveProvider(model: string, requested?: string): string {
        if (requested) { return requested; }
        const { aim } = this.disposition;
        const { provider } = (aim.body ?? {}) as Body;
        const fallback = model === 'local' ? DEFAULT_LOCAL_PROVIDER : DEFAULT_NUBE_PROVIDER;
        return provider ?? fallback;
    }

    private async handleCreate(value?: unknown): Promise<void> {
        const payload = (value ?? {}) as CreatePayload;
        const model = this.resolveModel(payload.model);
        const provider = this.resolveProvider(model, payload.provider);
        if (model === 'local') {
            this.pulse(ApiPromptSignalType.CREATE, { ...(payload ?? {}), id: `${this.id}:api-prompt` });
            return;
        }
        this.pulse(SignalType.READY, { ready: true, model, provider });
        this.pulse(SignalType.CREATED, { ready: true, model, provider });
    }

    private async handleStream(value?: unknown): Promise<void> {
        const payload = (value ?? {}) as StreamPayload;
        const { model } = payload;
        const targetModel = this.resolveModel(model);
        if (targetModel === 'local') {
            this.handleLocalStream(payload);
            return;
        }
        await this.executeExternalStream(payload);
    }

    private handleLocalStream(payload: StreamPayload): void {
        const { request, correlationId, streamId, imagination = DEFAULT_IMAGINATION } = payload;
        const temperature = imagination / 10;
        const promptPayload = { id: `${this.id}:api-prompt`, correlationId, streamId, prompt: request as PromptInput, temperature };
        this.pulse(ApiPromptSignalType.STREAM, promptPayload);
    }

    private async executeExternalStream(payload: StreamPayload): Promise<void> {
        const { correlationId, streamId } = payload;
        const provider = this.resolveProvider('nube', payload.provider);
        try {
            const stream = await this.fetchExternalStream(payload);
            this.pulse(SignalType.STREAMED, { correlationId, streamId, stream, model: 'nube', provider });
        } catch (error) {
            this.pulse(SignalType.ERROR, { action: 'stream', error: String(error) });
        }
    }

    private buildFetchInit(payload: StreamPayload, signal: AbortSignal): RequestInit {
        const { request, model = 'nube', provider = DEFAULT_NUBE_PROVIDER, imagination, schema, maxTokens } = payload;
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({ request, model, provider, imagination, schema, maxTokens });
        return { method: 'POST', headers, body, signal };
    }

    private async fetchExternalStream(payload: StreamPayload): Promise<ReadableStream<string>> {
        const { endpoint = DEFAULT_ENDPOINT } = payload;
        const controller = new AbortController();
        this.abortController = controller;
        const init = this.buildFetchInit(payload, controller.signal);
        const response = await fetch(endpoint, init);
        return this.createResponseStream(response);
    }

    private createResponseStream(response: Response): ReadableStream<string> {
        const { body } = response;
        if (!body) {
            return new ReadableStream<string>({ start(ctrl) { ctrl.close(); } });
        }
        return body.pipeThrough(new TextDecoderStream());
    }

    private handleDestroy(): void {
        this.abortController?.abort();
        this.abortController = undefined;
        this.pulse(ApiPromptSignalType.DESTROY, { id: `${this.id}:api-prompt` });
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private handleCapabilitySignal(property: string, source: string, value: unknown): void {
        if (source !== `${this.id}:api-prompt` && source !== 'api-prompt') { return; }
        switch (property) {
            case ApiPromptSignalType.READY:
                this.pulse(SignalType.READY, { ready: true, model: 'local', provider: DEFAULT_LOCAL_PROVIDER });
                this.pulse(SignalType.CREATED, { ready: true, model: 'local', provider: DEFAULT_LOCAL_PROVIDER });
                break;
            case ApiPromptSignalType.STREAMED:
                this.handleLocalStreamed(value);
                break;
            case ApiPromptSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private handleLocalStreamed(value: unknown): void {
        const streamResult = (value ?? {}) as StreamResult;
        const { correlationId, streamId, stream } = streamResult;
        this.pulse(SignalType.STREAMED, { correlationId, streamId, stream, model: 'local', provider: DEFAULT_LOCAL_PROVIDER });
    }
}

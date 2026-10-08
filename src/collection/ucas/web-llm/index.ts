import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { ApiPrompt } from '@uca/capability-api-prompt';
import {
    SignalType as ApiPromptSignalType,
    type Body as ApiPromptBody,
    type PromptInput,
} from '@uca/capability-api-prompt/types';
import { SseClient } from '@uca/capability-sse-client';
import {
    SignalType as SseClientSignalType,
    type Body as SseClientBody,
    type StreamResult as SseStreamResult,
} from '@uca/capability-sse-client/types';
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

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override capabilities(): Cooky {
        const promptDisposition: Disposition<ApiPromptBody> = {
            aim: { description: 'Browser on-device prompt capability', body: { id: `${this.id}:api-prompt`, silent: true, persistentSession: true } },
            reactTo: [...ApiPrompt.disposition.reactTo ?? []],
        };
        const sseDisposition: Disposition<SseClientBody> = {
            aim: { description: SseClient.AIM, body: { id: `${this.id}:sse-client`, endpoint: DEFAULT_ENDPOINT } },
            reactTo: [...SseClient.disposition.reactTo ?? []],
        };
        return [
            [ApiPrompt, promptDisposition],
            [SseClient, sseDisposition],
        ];
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, source, value } = signal;
        switch (property) {
            case SignalType.CREATE: await this.handleCreate(value); break;
            case SignalType.STREAM: await this.handleStream(value); break;
            case SignalType.DESTROY: this.handleDestroy(); break;
            case SseClientSignalType.STREAMED: this.handleSseStreamed(value, source); break;
            case SseClientSignalType.ERROR: this.handleSseError(value, source); break;
            default: this.handleCapabilitySignal(property, source, value); break;
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
        this.dispatchSseStream(payload, targetModel);
    }

    private handleLocalStream(payload: StreamPayload): void {
        const { request, correlationId, streamId, imagination = DEFAULT_IMAGINATION } = payload;
        const temperature = imagination / 10;
        const promptPayload = { id: `${this.id}:api-prompt`, correlationId, streamId, prompt: request as PromptInput, temperature };
        this.pulse(ApiPromptSignalType.STREAM, promptPayload);
    }

    private dispatchSseStream(payload: StreamPayload, targetModel: string): void {
        const provider = this.resolveProvider(targetModel, payload.provider);
        const ssePayload = { ...payload, id: `${this.id}:sse-client`, model: targetModel, provider };
        this.pulse(SseClientSignalType.STREAM, ssePayload);
    }

    private handleSseStreamed(value: unknown, source: string): void {
        if (source !== `${this.id}:sse-client` && source !== 'sse-client') { return; }
        const { correlationId, streamId, stream, model = 'nube', provider = DEFAULT_NUBE_PROVIDER } = (value ?? {}) as SseStreamResult & { model?: string; provider?: string };
        this.pulse(SignalType.STREAMED, { correlationId, streamId, stream, model, provider });
    }

    private handleSseError(value: unknown, source: string): void {
        if (source !== `${this.id}:sse-client` && source !== 'sse-client') { return; }
        this.pulse(SignalType.ERROR, value);
    }

    private handleDestroy(): void {
        this.pulse(ApiPromptSignalType.DESTROY, { id: `${this.id}:api-prompt` });
        this.pulse(SseClientSignalType.ABORT, { id: `${this.id}:sse-client` });
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private handleCapabilitySignal(property: string, source: string, value: unknown): void {
        if (source !== `${this.id}:api-prompt` && source !== 'api-prompt') { return; }
        switch (property) {
            case ApiPromptSignalType.READY:
                this.pulse(SignalType.READY, { ready: true, model: 'local', provider: DEFAULT_LOCAL_PROVIDER });
                this.pulse(SignalType.CREATED, { ready: true, model: 'local', provider: DEFAULT_LOCAL_PROVIDER });
                break;
            case ApiPromptSignalType.STREAMED: this.handleLocalStreamed(value); break;
            case ApiPromptSignalType.ERROR: this.pulse(SignalType.ERROR, value); break;
            default: break;
        }
    }

    private handleLocalStreamed(value: unknown): void {
        const streamResult = (value ?? {}) as StreamResult;
        const { correlationId, streamId, stream } = streamResult;
        this.pulse(SignalType.STREAMED, { correlationId, streamId, stream, model: 'local', provider: DEFAULT_LOCAL_PROVIDER });
    }
}

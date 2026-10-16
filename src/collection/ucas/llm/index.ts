import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { HttpClient } from '@uca/capability-http-client';
import { SignalType as HttpSignalType, type ResponsePayload, type ErrorPayload } from '@uca/capability-http-client/types';
import { SseClient } from '@uca/capability-sse-client';
import { Schema } from '@uca/capability-schema';
import { SignalType as SchemaSignalType, type ValidatedResult, type ErrorResult } from '@uca/capability-schema/types';
import { inferenceSchema } from './schema.js';
import { SignalType as SseSignalType } from '@uca/capability-sse-client/types';
import { __ID__, DEFAULT_ENDPOINT, DEFAULT_STREAM_ENDPOINT, DEFAULT_PROVIDER } from './constants.js';
import { type Body, type InferPayload, type InferResult, type ProviderType, type Failure, type ValidationContext, type TransportContext, type AbortPayload, type StreamResult, DataType, SignalType } from './types.js';

export class Llm extends Uca<Body> {
    public static override purpose = 'Request cognitive inference and streaming through the application backend';
    public static override disposition: Disposition<Body> = {
        aim: { description: Llm.purpose, body: {} },
        reactTo: [SignalType.INFER, SignalType.STREAM, SignalType.ABORT, SignalType.CONNECT,
            HttpSignalType.RESPONSE, HttpSignalType.ERROR, SseSignalType.STREAMED, SseSignalType.END, SseSignalType.ERROR,
            SchemaSignalType.VALIDATE, SchemaSignalType.VALIDATED, SchemaSignalType.ERROR,
            ...HttpClient.disposition.reactTo ?? [], ...SseClient.disposition.reactTo ?? []],
        inputs: [
            { signal: SignalType.INFER, type: DataType.INFER_PAYLOAD, schema: inferenceSchema },
            { signal: SignalType.STREAM, type: DataType.INFER_PAYLOAD, schema: inferenceSchema },
            { signal: SignalType.ABORT, type: DataType.ABORT_PAYLOAD },
            { signal: SignalType.CONNECT, type: DataType.VOID },
        ],
        outputs: [
            { signal: SignalType.INFERRED, type: DataType.INFER_RESULT },
            { signal: SignalType.STREAMED, type: DataType.STREAM_RESULT },
            { signal: SignalType.STREAM_END, type: DataType.STREAM_END_RESULT },
            { signal: SignalType.CONNECTED, type: DataType.STRING },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN },
        ],
    };
    public constructor(id: string = __ID__) { super(id); }
    public override denervate(): void {
        this.registry.forEach((capability) => capability.denervate());
        super.denervate();
    }
    protected override react(signal: Signal): void {
        const { property, value, source } = signal;
        switch (property) {
            case SignalType.INFER: this.handleInfer(value as InferPayload, source); break;
            case SignalType.STREAM: this.handleStream(value as InferPayload); break;
            case SignalType.ABORT: this.handleAbort(value as AbortPayload); break;
            case SignalType.CONNECT: this.handleConnect(); break;
            case SchemaSignalType.VALIDATED: this.handleValidated(value as ValidatedResult); break;
            case SchemaSignalType.ERROR: this.handleValidationError(value as ErrorResult); break;
            case HttpSignalType.RESPONSE: this.handleBackendResponse(signal); break;
            case HttpSignalType.ERROR: this.handleBackendError(signal); break;
            case SseSignalType.STREAMED: this.handleBackendStreamed(value as StreamResult); break;
            case SseSignalType.END: this.handleBackendEnd(signal); break;
            case SseSignalType.ERROR: this.handleBackendStreamError(signal); break;
        }
    }
    protected override catalog(): Cooky {
        const { id } = this;
        return [
            [HttpClient, { ...HttpClient.disposition, aim: { description: HttpClient.AIM, body: { id: `${id}:http-client` } } }],
            [SseClient, { ...SseClient.disposition, aim: { description: SseClient.AIM, body: { id: `${id}:sse-client` } } }],
            [Schema, { ...Schema.disposition, aim: { description: Schema.AIM, body: { id: `${id}:schema` } } }],
        ];
    }
    private handleConnect(): void { this.pulse(SignalType.CONNECTED, 'connected'); }
    private handleInfer(payload: InferPayload, replyTo: string): void {
        const value = this.backendPayload(payload);
        const { correlationId, provider } = value;
        this.pulse(SchemaSignalType.VALIDATE, { schema: inferenceSchema, value, context: { operation: SignalType.INFER, correlationId, provider, replyTo, request: value } });
    }
    private handleStream(payload: InferPayload): void {
        const value = this.backendPayload(payload);
        const { correlationId, provider } = value;
        this.pulse(SchemaSignalType.VALIDATE, { schema: inferenceSchema, value, context: { operation: SignalType.STREAM, correlationId, provider } });
    }
    private handleValidated(result: ValidatedResult): void {
        const { value, context } = result;
        const { operation, replyTo } = context as ValidationContext;
        const { aim } = this.disposition;
        const { endpoint = DEFAULT_ENDPOINT, streamEndpoint = DEFAULT_STREAM_ENDPOINT } = aim.body ?? {};
        const body = value as InferPayload;
        const { correlationId } = body;
        switch (operation) {
            case SignalType.INFER: this.pulse(HttpSignalType.REQUEST, { endpoint, payload: body, correlationId, context: { ...body, replyTo } }); break;
            case SignalType.STREAM: this.pulse(SseSignalType.STREAM, { ...body, endpoint: streamEndpoint }); break;
        }
    }
    private handleValidationError(result: ErrorResult): void {
        const { error, context } = result;
        const { correlationId, provider, replyTo, request } = context as ValidationContext;
        this.pulse(SignalType.ERROR, { error, correlationId, request }, replyTo ?? this.resultTarget(provider));
    }
    private backendPayload(payload: InferPayload): InferPayload {
        const { aim } = this.disposition;
        const { provider = DEFAULT_PROVIDER, model, imagination, limit, thinkingBudget, thinkingLevel } = aim.body ?? {};
        const { id: _target, correlationId = crypto.randomUUID(), ...request } = payload;
        return { provider, model, imagination, limit, thinkingBudget, thinkingLevel, ...request, correlationId };
    }
    private handleBackendResponse(signal: Signal): void {
        const { value } = signal;
        const { data, context, correlationId } = value as ResponsePayload;
        const {
            replyTo,
            ...request
        } = context as TransportContext;
        const {
            provider,
        } = request;
        const id = replyTo ?? this.resultTarget(provider);
        this.pulse(SignalType.INFERRED, {
            ...(data as InferResult),
            correlationId,
            request,
        }, id);
    }
    private handleBackendError(signal: Signal): void {
        const { value } = signal;
        const { context, ...failure } = value as ErrorPayload;
        const {
            replyTo,
            ...request
        } = context as TransportContext;
        const {
            provider,
        } = request;
        this.pulse(SignalType.ERROR, {
            ...failure,
            request,
        }, replyTo ?? this.resultTarget(provider));
    }
    private handleBackendStreamed(value: StreamResult): void {
        this.pulse(SignalType.STREAMED, value, this.resultTarget());
    }
    private handleAbort(value: AbortPayload): void {
        this.pulse(SseSignalType.ABORT, value);
        this.pulse(HttpSignalType.ABORT, value);
    }
    private handleBackendEnd(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.STREAM_END, { ...(value as object) }, this.resultTarget());
    }
    private handleBackendStreamError(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.ERROR, { ...(value as Failure) }, this.resultTarget());
    }
    private resultTarget(provider?: ProviderType): string | undefined {
        const { id } = this;
        const parent = id.includes(':') ? id.slice(0, id.lastIndexOf(':')) : undefined;
        return parent && provider === 'jev' ? `${parent}:decision` : parent;
    }

}


import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { HttpClient } from '@uca/capability-http-client';
import { SignalType as HttpSignalType, type ResponsePayload, type ErrorPayload } from '@uca/capability-http-client/types';
import { Schema } from '@uca/capability-schema';
import { SignalType as SchemaSignalType, type ValidatedResult, type ErrorResult } from '@uca/capability-schema/types';
import { inferenceSchema } from './schema.js';
import { __ID__, DEFAULT_ENDPOINT, DEFAULT_PROVIDER } from './constants.js';
import { type Body, type InferPayload, type InferResult, type ProviderType, type ValidationContext, type TransportContext, type AbortPayload, DataType, SignalType } from './types.js';

export class Llm extends Uca<Body> {
    public static override purpose = 'Request complete cognitive inferences through the application backend';
    public static override disposition: Disposition<Body> = {
        aim: { description: Llm.purpose, body: {} },
        reactTo: [SignalType.INFER, SignalType.ABORT, SignalType.CONNECT,
            HttpSignalType.RESPONSE, HttpSignalType.ERROR,
            SchemaSignalType.VALIDATE, SchemaSignalType.VALIDATED, SchemaSignalType.ERROR,
            ...HttpClient.disposition.reactTo ?? []],
        inputs: [
            { signal: SignalType.INFER, type: DataType.INFER_PAYLOAD, schema: inferenceSchema },
            { signal: SignalType.ABORT, type: DataType.ABORT_PAYLOAD },
            { signal: SignalType.CONNECT, type: DataType.VOID },
        ],
        outputs: [
            { signal: SignalType.INFERRED, type: DataType.INFER_RESULT },
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
            case SignalType.ABORT: this.handleAbort(value as AbortPayload); break;
            case SignalType.CONNECT: this.handleConnect(); break;
            case SchemaSignalType.VALIDATED: this.handleValidated(value as ValidatedResult); break;
            case SchemaSignalType.ERROR: this.handleValidationError(value as ErrorResult); break;
            case HttpSignalType.RESPONSE: this.handleBackendResponse(signal); break;
            case HttpSignalType.ERROR: this.handleBackendError(signal); break;
        }
    }
    protected override catalog(): Cooky {
        const { id } = this;
        return [
            [HttpClient, { ...HttpClient.disposition, aim: { description: HttpClient.AIM, body: { id: `${id}:http-client` } } }],
            [Schema, { ...Schema.disposition, aim: { description: Schema.AIM, body: { id: `${id}:schema` } } }],
        ];
    }
    private handleConnect(): void { this.pulse(SignalType.CONNECTED, 'connected'); }
    private handleInfer(payload: InferPayload, replyTo: string): void {
        const value = this.backendPayload(payload);
        const { correlationId, provider } = value;
        this.pulse(SchemaSignalType.VALIDATE, { schema: inferenceSchema, value, context: { operation: SignalType.INFER, correlationId, provider, replyTo, request: value } });
    }
    private handleValidated(result: ValidatedResult): void {
        const { value, context } = result;
        const { operation, replyTo } = context as ValidationContext;
        const { aim } = this.disposition;
        const { endpoint = DEFAULT_ENDPOINT } = aim.body ?? {};
        const body = value as InferPayload;
        const { correlationId } = body;
        if (operation === SignalType.INFER) {
            this.pulse(HttpSignalType.REQUEST, { endpoint, payload: body, correlationId, context: { ...body, replyTo } });
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
    private handleAbort(value: AbortPayload): void {
        this.pulse(HttpSignalType.ABORT, value);
    }
    private resultTarget(provider?: ProviderType): string | undefined {
        const { id } = this;
        const parent = id.includes(':') ? id.slice(0, id.lastIndexOf(':')) : undefined;
        return parent && provider === 'jev' ? `${parent}:decision` : parent;
    }

}


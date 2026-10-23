import { HttpClient } from '@uca/capability-http-client';
import type {
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    SignalType as HttpSignalType,
    type ResponsePayload,
    type ErrorPayload,
    type AbortPayload,
} from '@uca/capability-http-client/types';
import {
    __ID__,
    DEFAULT_ENDPOINT,
} from './constants.js';
import { inferenceSchema } from './schema.js';
import {
    SignalType,
    DataType,
    type Body,
    type InferPayload,
    type InferResult,
    type TransportContext,
} from './types.js';

export class Llm extends HttpClient {
    public static override readonly AIM = 'Exchange inference contracts with the application backend';
    public static override disposition: Disposition<Body> = {
        aim: {
            description: Llm.AIM,
        },
        reactTo: [
            SignalType.INFER,
            SignalType.ABORT,
        ],
        inputs: [
            {
                signal: SignalType.INFER,
                type: DataType.INFER_PAYLOAD,
                schema: inferenceSchema,
            },
            {
                signal: SignalType.ABORT,
                type: DataType.ABORT_PAYLOAD,
            },
        ],
        outputs: [
            {
                signal: SignalType.INFERRED,
                type: DataType.INFER_RESULT,
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override async react(signal: Signal): Promise<void> {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.INFER:
                await this.handleInfer(signal);
                break;
            case SignalType.ABORT:
                this.handleAbortInference(signal);
                break;
            case HttpSignalType.RESPONSE:
                this.handleResponse(signal);
                break;
            case HttpSignalType.ERROR:
                this.handleError(signal);
                break;
        }
    }

    protected override receptors(): string[] {
        return [
            ...super.receptors(),
            HttpSignalType.RESPONSE,
            HttpSignalType.ERROR,
        ];
    }

    protected override acceptsSource(signal: Signal): boolean {
        const {
            property,
            source,
        } = signal;
        switch (property) {
            case HttpSignalType.RESPONSE:
                return source === this.id;
            case HttpSignalType.ERROR:
                return source === this.id;
            default:
                return true;
        }
    }

    private async handleInfer(signal: Signal): Promise<void> {
        const { value, source: replyTo } = signal;
        const request = value as InferPayload;
        try {
            const payload = inferenceSchema.parse(request);
            await this.dispatchInferenceRequest(payload, replyTo);
        } catch (error) {
            this.emitInferError(String(error), request.correlationId, replyTo);
        }
    }

    private async dispatchInferenceRequest(payload: InferPayload, replyTo?: string): Promise<void> {
        const { correlationId } = payload;
        const { aim } = this.disposition;
        const { endpoint = DEFAULT_ENDPOINT } = aim.body ?? {};
        const url = this.resolveEndpoint(endpoint);
        await this.handleRequest({ endpoint: url, payload, correlationId, context: { ...payload, replyTo } });
    }

    private emitInferError(error: string, correlationId?: string, replyTo?: string): void {
        this.pulse(SignalType.ERROR, { error, correlationId }, replyTo);
    }

    private handleAbortInference(signal: Signal): void {
        const {
            value,
        } = signal;
        this.handleAbort(value as AbortPayload);
    }

    private resolveResponseContext(requestContext?: unknown, responseContext?: unknown): unknown {
        const req = (requestContext ?? {}) as Record<string, unknown>;
        const res = (responseContext ?? {}) as Record<string, unknown>;
        return Object.keys(res).length > 0 ? { ...req, ...res } : requestContext;
    }

    private handleResponse(signal: Signal): void {
        const { value } = signal;
        const { context: transportCtx, data, correlationId } = value as ResponsePayload;
        const { replyTo, context: requestContext } = (transportCtx ?? {}) as TransportContext;
        const { correlationId: receivedId = correlationId, context: responseContext, ...result } = (data ?? {}) as InferResult;
        const finalContext = this.resolveResponseContext(requestContext, responseContext);
        this.pulse(SignalType.INFERRED, { ...result, context: finalContext, correlationId: receivedId }, replyTo);
    }

    private handleError(signal: Signal): void {
        const { value } = signal;
        const { context, ...failure } = (value ?? {}) as ErrorPayload;
        const { replyTo, correlationId, context: requestContext } = (context ?? {}) as TransportContext;
        this.pulse(SignalType.ERROR, { ...failure, context: requestContext, correlationId }, replyTo);
    }

    private resolveEndpoint(endpoint: string): string {
        if (typeof window === 'undefined' && endpoint.startsWith('/')) {
            return `http://localhost:3000${endpoint}`;
        }
        return endpoint;
    }
}

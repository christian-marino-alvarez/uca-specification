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
        const {
            value,
            source: replyTo,
        } = signal;
        const request = value as InferPayload;
        try {
            const {
                metadata,
                ...payload
            } = inferenceSchema.parse(request);
            const {
                correlationId,
            } = payload;
            const {
                aim: {
                    body,
                },
            } = this.disposition;
            const {
                endpoint = DEFAULT_ENDPOINT,
            } = body ?? {};
            await this.handleRequest({
                endpoint,
                payload,
                correlationId,
                context: {
                    ...payload,
                    metadata,
                    replyTo,
                },
            });
        }
        catch (error) {
            const {
                correlationId,
                metadata,
            } = request;
            this.pulse(SignalType.ERROR, {
                error: String(error),
                correlationId,
                metadata,
                request,
            }, replyTo);
        }
    }

    private handleAbortInference(signal: Signal): void {
        const {
            value,
        } = signal;
        this.handleAbort(value as AbortPayload);
    }

    private handleResponse(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            data,
            context,
            correlationId,
        } = value as ResponsePayload;
        const {
            replyTo,
            ...request
        } = context as TransportContext;
        const {
            metadata,
        } = request;
        const {
            correlationId: receivedCorrelationId = correlationId,
            ...result
        } = data as InferResult;
        this.pulse(SignalType.INFERRED, {
            ...result,
            correlationId: receivedCorrelationId,
            metadata,
            request,
        }, replyTo);
    }

    private handleError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            context,
            ...failure
        } = value as ErrorPayload;
        const {
            replyTo,
            ...request
        } = context as TransportContext;
        const {
            metadata,
        } = request;
        this.pulse(SignalType.ERROR, {
            ...failure,
            metadata,
            request,
        }, replyTo);
    }
}

import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { SseClient } from '@uca/capability-sse-client';
import { SignalType as SseSignalType, type StreamResult as TextStreamResult } from '@uca/capability-sse-client/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import { SignalType as TransformerSignalType } from '@uca/capability-stream-transformer/types';
import { __ID__, DEFAULT_PARENT, DEFAULT_GOAL, DEFAULT_IMAGINATION, OUTPUT_FORMAT, RESTRICTIONS, INPUTS, OUTPUTS } from './constants.js';
import { createPayloadSchema, itemSchema, schemaForParent } from './schema.js';
import { type Body, type CreatePayload, type StreamResult, type ErrorResult, SignalType } from './types.js';

export class Composer extends Uca<Body> {
    public static override purpose: string = 'Determine and revise the immediate child UCAs of a web UCA, delegating a purpose, operating context and spatial dimensions to each child so the host purpose is satisfied in its current context';
    public static override disposition: Disposition<Body> = {
        aim: { description: Composer.purpose, body: {} },
        reactTo: [
            SignalType.CREATE,
            SignalType.UPDATE,
            SignalType.STREAM,
            SignalType.DESTROY,
            SseSignalType.STREAMED,
            SseSignalType.ERROR,
            TransformerSignalType.TRANSFORMED,
            TransformerSignalType.ERROR,
            ...SseClient.disposition.reactTo ?? [],
            ...StreamTransformer.disposition.reactTo ?? [],
        ],
        inputs: INPUTS,
        outputs: OUTPUTS,
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, source, value } = signal;
        try {
            switch (property) {
                case SignalType.CREATE: this.handleCreate(value); break;
                case SignalType.UPDATE: this.handleUpdate(value); break;
                case SignalType.STREAM: this.handleStream(value); break;
                case SignalType.DESTROY: this.handleDestroy(); break;
                case SseSignalType.STREAMED: this.handleSseStreamed(value, source); break;
                case TransformerSignalType.TRANSFORMED: this.handleTransformed(value); break;
                case SseSignalType.ERROR: this.handleSseError(value, source); break;
                case TransformerSignalType.ERROR: this.handleTransformerError(value, source); break;
                default: break;
            }
        } catch (error) {
            this.pulse(SignalType.ERROR, { error: String(error) });
        }
    }

    protected override catalog(): Cooky {
        const { reactTo: sseSignals } = SseClient.disposition;
        const { reactTo: transformerSignals } = StreamTransformer.disposition;
        const { AIM: transportAim } = SseClient;
        const { AIM: transformationAim } = StreamTransformer;
        return [
            [SseClient, { aim: { description: transportAim, body: { id: `${this.id}:sse-client` } }, reactTo: sseSignals }],
            [StreamTransformer, { aim: { description: transformationAim, body: { id: `${this.id}:stream-transformer`, schema: itemSchema } }, reactTo: transformerSignals }],
        ];
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.logLimits();
        this.pulse(SignalType.UPDATE, { id: this.id });
    }

    private logLimits(): void {
        const { limits } = this.disposition;
        if (!limits) { return; }
        console.log('%c🎯 [Composer] Composición sujeta a límites de pantalla:', 'color: #a855f7; font-weight: bold;', limits);
    }

    private handleCreate(value: unknown): void {
        const { aim: { body } } = this.disposition;
        this.pulse(SseSignalType.STREAM, this.reasoningPayload({ ...body, ...(value as CreatePayload) }));
    }

    private handleUpdate(value: unknown): void {
        const { aim: { body } } = this.disposition;
        this.pulse(SseSignalType.ABORT, { id: `${this.id}:sse-client` });
        this.pulse(SseSignalType.STREAM, this.reasoningPayload({ ...body, ...(value as CreatePayload) }));
    }

    private handleStream(value: unknown): void {
        const { aim: { body } } = this.disposition;
        this.pulse(SseSignalType.STREAM, this.reasoningPayload({ ...body, ...(value as CreatePayload) }));
    }

    private reasoningPayload(payload: CreatePayload): CreatePayload {
        const { request = DEFAULT_GOAL, context, parentTo = DEFAULT_PARENT, composition, model, provider, imagination = DEFAULT_IMAGINATION, correlationId = `${this.id}:${Date.now()}`, streamId } = createPayloadSchema.parse(payload);
        const { purpose, disposition } = this;
        const { aim: { body: { parentTo: host = DEFAULT_PARENT } = {} }, limits } = disposition;
        if (parentTo !== host) { throw new Error('Configure the host through the composition disposition'); }
        const requestText = JSON.stringify({ purpose, disposition, host: { purpose: request, context, id: parentTo }, limits, composition, output: OUTPUT_FORMAT, constraints: RESTRICTIONS });
        return { id: `${this.id}:sse-client`, request: requestText, model, provider, imagination, correlationId, streamId };
    }

    private handleSseStreamed(value: unknown, source: string): void {
        if (source !== `${this.id}:sse-client`) { return; }
        const { correlationId, streamId, stream } = value as TextStreamResult;
        const { aim: { body: { parentTo = DEFAULT_PARENT } = {} } } = this.disposition;
        this.pulse(TransformerSignalType.TRANSFORM, { id: `${this.id}:stream-transformer`, correlationId, streamId, stream, schema: schemaForParent(parentTo) });
    }

    private handleTransformed(value: unknown): void {
        const { correlationId, streamId, stream } = (value ?? {}) as StreamResult;
        if (!correlationId) { return; }
        this.pulse(SignalType.STREAMED, { correlationId, streamId, stream });
    }

    private handleDestroy(): void {
        this.pulse(SseSignalType.ABORT, { id: `${this.id}:sse-client` });
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private handleSseError(value: unknown, source: string): void {
        if (source !== `${this.id}:sse-client`) { return; }
        const { error, correlationId } = value as ErrorResult;
        if (typeof error === 'string' && error.toLowerCase().includes('aborted')) { return; }
        this.pulse(SignalType.ERROR, { error, correlationId });
    }

    private handleTransformerError(value: unknown, source: string): void {
        if (source !== `${this.id}:stream-transformer`) { return; }
        const { error, correlationId } = value as ErrorResult;
        this.pulse(SignalType.ERROR, { error, correlationId });
    }
}

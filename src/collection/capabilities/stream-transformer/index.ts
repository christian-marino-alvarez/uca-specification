import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    VALIDATION_ERROR_MESSAGE,
} from './constants.js';
import { createParser } from './parser.js';
import { closeSession, createSession, expirePending, rejectPending, settlePending } from './resource.js';
import { createPipeline } from './stream.js';
import {
    DataType, Mode, SignalType, type Body, type TransformPayload,
    type RepairPayload, type CancelPayload, type Session, type Pending,
    type Resolution, type RequestFields, type Response,
} from './types.js';

export class StreamTransformer extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;
    public static override disposition: Disposition<Body> = {
        aim: {
            description: StreamTransformer.AIM,
            body: {},
        },
        reactTo: [
            SignalType.TRANSFORM,
            SignalType.REPAIR,
            SignalType.CANCEL,
        ],
        inputs: [
            {
                signal: SignalType.TRANSFORM,
                type: DataType.TRANSFORM_PAYLOAD,
            },
            {
                signal: SignalType.REPAIR,
                type: DataType.RESPONSE,
            },
            {
                signal: SignalType.CANCEL,
                type: DataType.CANCELLATION,
            },
        ],
        outputs: [
            {
                signal: SignalType.TRANSFORMED,
                type: DataType.TRANSFORM_RESULT,
            },
            {
                signal: SignalType.CHUNK,
                type: DataType.CHUNK_RESULT,
            },
            {
                signal: SignalType.COMPLETE,
                type: DataType.COMPLETE_RESULT,
            },
            {
                signal: SignalType.RECOVER,
                type: DataType.RECOVERY_REQUEST,
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
            },
        ],
    };

    private readonly sessions = new Map<string, Session>();
    private readonly pending = new Map<string, Pending>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.sessions.forEach(({ controller, release }) => { controller.abort(); release(); });
        this.sessions.clear();
        super.denervate();
    }

    protected override react(signal: Signal): void | Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.TRANSFORM:
                this.handleTransform(value as TransformPayload);
                break;
            case SignalType.REPAIR:
                return this.handleRepair(value as RepairPayload);
            case SignalType.CANCEL:
                this.handleCancel(value as CancelPayload);
                break;
        }
    }

    protected override resolveTargetId(_property: string): string | undefined {
        const { id } = this;
        const boundary = id.lastIndexOf(':');
        return boundary < 0 ? undefined : id.slice(0, boundary);
    }

    private handleTransform(payload: TransformPayload): void {
        const {
            streamId,
            stream: repairStream,
        } = payload;
        if (streamId && this.pending.has(streamId)) {
            void this.handleRepair({
                requestId: streamId,
                stream: repairStream,
            });
            return;
        }
        this.processTransformPipeline(payload);
    }

    private processTransformPipeline(payload: TransformPayload): void {
        const { aim } = this.disposition;
        const { schema: defaultSchema } = aim.body ?? {};
        const { correlationId, context, schema = defaultSchema, streamId } = payload;
        const session = createSession(payload, (sessionId, error) => this.cancelSession(sessionId, error));
        const { sessionId } = session;
        this.sessions.set(sessionId, session);
        const stream = createPipeline({ ...payload, schema }, session, (fields, resolution) => this.request(fields, resolution), (error) => this.finishSession(sessionId, error));
        const [streamForPulse, streamForPump] = stream.tee();
        this.pulse(SignalType.TRANSFORMED, { correlationId, streamId, context, stream: streamForPulse });
        void this.pumpPipelineEvents(streamForPump, correlationId, streamId, context);
    }

    private async pumpPipelineEvents(
        stream: ReadableStream<Record<string, unknown>>,
        correlationId?: string,
        streamId?: string,
        context?: unknown,
    ): Promise<void> {
        const reader = stream.getReader();
        const items: Record<string, unknown>[] = [];
        try {
            await this.readAndPulseChunks(reader, items, correlationId, streamId, context);
            this.pulse(SignalType.COMPLETE, { correlationId, streamId, context, total: items.length, items });
        } catch (error) {
            this.pulse(SignalType.ERROR, { correlationId, streamId, context, error });
        }
    }

    private async readAndPulseChunks(
        reader: ReadableStreamDefaultReader<Record<string, unknown>>,
        items: Record<string, unknown>[],
        correlationId?: string,
        streamId?: string,
        context?: unknown,
    ): Promise<void> {
        let index = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            items.push(value);
            this.pulse(SignalType.CHUNK, { correlationId, streamId, context, item: value, index: index++ });
        }
    }

    private async handleRepair(payload: RepairPayload): Promise<void> {
        const { requestId, stream, error } = payload;
        const pending = this.pending.get(requestId);
        if (!pending) {
            return;
        }
        if (error !== undefined || !stream) {
            settlePending(this.pending, requestId, {
                accepted: false,
                error: error ?? new Error('The repair response did not include a stream'),
            });
            return;
        }
        try {
            const value = await this.readRepairStream(stream, pending);
            settlePending(this.pending, requestId, { accepted: false, value });
        }
        catch (repairError) {
            settlePending(this.pending, requestId, { accepted: false, error: repairError });
        }
    }

    private handleCancel(payload: CancelPayload): void {
        const { correlationId, streamId } = payload;
        this.sessions.forEach(({ correlationId: activeCorrelation, streamId: activeStream, controller }) => {
            if ((!correlationId || correlationId === activeCorrelation) && (!streamId || streamId === activeStream)) {
                controller.abort();
            }
        });
    }

    private request(fields: RequestFields, resolution: Resolution): Promise<Response> {
        const {
            sessionId,
            correlationId,
            streamId,
            context,
            timeoutMs,
            signal,
            acceptedKeys,
            mode,
            maxBufferSize,
        } = resolution;
        const { error } = fields;
        const { issues } = error as { issues?: unknown };
        signal.throwIfAborted();
        const requestId = crypto.randomUUID();
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => expirePending(this.pending, requestId), timeoutMs);
            this.pending.set(requestId, { sessionId, resolve, reject, timer, mode, maxBufferSize });
            this.pulse(SignalType.RECOVER, {
                message: VALIDATION_ERROR_MESSAGE,
                requestId,
                correlationId,
                streamId,
                context,
                acceptedKeys: [...acceptedKeys],
                issues,
                ...fields,
            });
        });
    }

    private async readRepairStream(stream: ReadableStream<string>, pending: Pending): Promise<Record<string, unknown>> {
        const { mode = Mode.ENTRIES, maxBufferSize } = pending;
        const reader = stream.pipeThrough(createParser(mode, maxBufferSize)).getReader();
        const first = await reader.read();
        if (first.done || !first.value) {
            throw new Error('The repair stream did not return a corrected value');
        }
        const second = await reader.read();
        if (!second.done) {
            throw new Error('The repair stream returned more than one corrected value');
        }
        reader.releaseLock();
        return first.value;
    }

    private finishSession(sessionId: string, error?: unknown): void {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return;
        }
        this.sessions.delete(sessionId);
        closeSession(session, error, (result) => this.pulse(SignalType.ERROR, result));
    }

    private cancelSession(sessionId: string, error: unknown): void {
        rejectPending(this.pending, sessionId, error);
        const { release } = this.sessions.get(sessionId) ?? {};
        release?.();
        this.sessions.delete(sessionId);
    }
}

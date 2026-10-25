import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { SignalType as LlmSignalType, type Failure, type StreamResult } from '@uca/llm/types';
import {
    __ID__,
    AIM,
    SSE_PREFIX,
    SSE_SUFFIX,
} from './constants.js';
import {
    type Binding,
    type Body,
    type OpenPayload,
    type Source,
    DataType,
    SignalType,
} from './types.js';

export class SseServer extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: SseServer.AIM,
        },
        reactTo: [
            SignalType.OPEN,
            LlmSignalType.STREAMED,
            LlmSignalType.ERROR,
        ],
        inputs: [
            {
                signal: SignalType.OPEN,
                type: DataType.OPEN_PAYLOAD,
                schema: undefined,
                description: 'Open an SSE response bound to one inference correlation',
            },
        ],
        outputs: [
            {
                signal: SignalType.OPENED,
                type: DataType.OPENED_PAYLOAD,
                schema: undefined,
                description: 'SSE byte stream ready for the HTTP response',
            },
            {
                signal: SignalType.COMPLETED,
                type: DataType.COMPLETED_PAYLOAD,
                schema: undefined,
                description: 'SSE stream completed normally',
            },
            {
                signal: SignalType.CANCELLED,
                type: DataType.CANCELLED_PAYLOAD,
                schema: undefined,
                description: 'SSE stream cancelled by its consumer',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR_PAYLOAD,
                schema: undefined,
                description: 'SSE stream failed before or during serialization',
            },
        ],
    };

    private readonly bindings = new Map<string, Binding>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.bindings.forEach(({ controller }) => controller.abort());
        this.bindings.clear();
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        switch (property) {
            case SignalType.OPEN:
                this.handleOpen(value as OpenPayload);
                break;
            case LlmSignalType.STREAMED:
                this.handleSource(value as StreamResult);
                break;
            case LlmSignalType.ERROR:
                this.handleFailure(value as Failure);
                break;
            default:
                break;
        }
    }

    private handleOpen(payload: OpenPayload): void {
        const binding = this.createBinding(payload);
        const { sessionId, request } = binding;
        this.bindings.set(sessionId, binding);
        this.pulse(SignalType.OPENED, {
            sessionId,
            stream: this.createStream(binding),
        });
        request(binding.controller.signal);
    }

    private createBinding(payload: OpenPayload): Binding {
        const {
            sessionId,
            request,
            cancel,
        } = payload;
        let resolveSource: (source: Source) => void = () => undefined;
        const source = new Promise<Source>((resolve) => { resolveSource = resolve; });
        return {
            sessionId,
            request,
            cancel,
            source,
            resolveSource,
            controller: new AbortController(),
            completed: false,
        };
    }

    private createStream(binding: Binding): ReadableStream<Uint8Array> {
        return new ReadableStream<Uint8Array>({
            pull: async (controller) => this.pullFrame(binding, controller),
            cancel: async (reason) => this.cancelBinding(binding, reason),
        }, {
            highWaterMark: 0,
        });
    }

    private async pullFrame(binding: Binding, controller: ReadableStreamDefaultController<Uint8Array>): Promise<void> {
        try {
            const frame = await this.readFrame(binding);
            this.writeFrame(binding, controller, frame);
        }
        catch (error) {
            this.writeFrame(binding, controller, { error });
        }
    }

    private async readFrame(binding: Binding): Promise<{ text?: string; done?: boolean }> {
        const { source } = binding;
        const { stream, error } = await source;
        binding.reader ??= stream?.getReader();
        const { reader } = binding;
        if (!reader) {
            throw error;
        }
        const { done, value: text } = await reader.read();
        return {
            text,
            ...(done && { done }),
        };
    }

    private writeFrame(binding: Binding, controller: ReadableStreamDefaultController<Uint8Array>, frame: { text?: string; done?: boolean; error?: unknown }): void {
        const { sessionId } = binding;
        const { done, error } = frame;
        const payload = {
            ...frame,
            sessionId,
            ...(error !== undefined ? { error: String(error) } : {}),
        };
        controller.enqueue(new TextEncoder().encode(`${SSE_PREFIX}${JSON.stringify(payload)}${SSE_SUFFIX}`));
        if (done) {
            this.completeBinding(binding, controller);
        }
        if (error) {
            this.failBinding(binding, controller, error);
        }
    }

    private completeBinding(binding: Binding, controller: ReadableStreamDefaultController<Uint8Array>): void {
        controller.close();
        this.releaseBinding(binding);
        this.pulse(SignalType.COMPLETED, {
            sessionId: binding.sessionId,
        });
    }

    private failBinding(binding: Binding, controller: ReadableStreamDefaultController<Uint8Array>, error: unknown): void {
        controller.close();
        this.releaseBinding(binding);
        this.pulse(SignalType.ERROR, {
            sessionId: binding.sessionId,
            error,
        });
    }

    private handleSource(value: StreamResult): void {
        const {
            sessionId,
            stream,
        } = value;
        if (sessionId) {
            this.bindings.get(sessionId)?.resolveSource({ stream });
        }
    }

    private handleFailure(value: Failure): void {
        const {
            sessionId,
            error,
        } = value;
        if (sessionId) {
            this.bindings.get(sessionId)?.resolveSource({ error });
        }
    }

    private async cancelBinding(binding: Binding, reason: unknown): Promise<void> {
        const {
            cancel,
            controller,
            reader,
            sessionId,
        } = binding;
        controller.abort(reason);
        cancel();
        binding.resolveSource({ error: reason });
        this.releaseBinding(binding);
        await reader?.cancel(reason);
        this.pulse(SignalType.CANCELLED, {
            sessionId,
            reason,
        });
    }

    private releaseBinding(binding: Binding): void {
        const {
            sessionId,
        } = binding;
        this.bindings.delete(sessionId);
    }
}

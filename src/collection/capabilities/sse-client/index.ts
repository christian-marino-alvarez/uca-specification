import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    DEFAULT_ENDPOINT,
    JSON_HEADERS,
    MAX_FRAME_LENGTH,
    PROMPT_LOG_MESSAGE,
    RESPONSE_LOG_MESSAGE,
} from './constants.js';
import {
    type Body,
    type StreamPayload,
    type ActiveStream,
    type Frame,
    type ReadResult,
    DataType,
    SignalType,
} from './types.js';

export class SseClient extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: AIM, body: { endpoint: DEFAULT_ENDPOINT } },
        reactTo: [
            SignalType.STREAM,
            SignalType.ABORT,
        ],
        inputs: [
            { signal: SignalType.STREAM, type: DataType.STREAM_PAYLOAD, description: 'Open SSE stream' },
            { signal: SignalType.ABORT, type: DataType.VOID, description: 'Abort active SSE streams' },
        ],
        outputs: [
            { signal: SignalType.REQUESTED, type: DataType.REQUEST_LOG, description: 'LLM request contract sent to the SSE endpoint' },
            { signal: SignalType.STREAMED, type: DataType.STREAM_RESULT, description: 'SSE stream connected' },
            { signal: SignalType.RESPONDED, type: DataType.RESPONSE_LOG, description: 'Complete textual LLM response received from the SSE endpoint' },
            { signal: SignalType.END, type: DataType.VOID, description: 'SSE stream finished' },
            { signal: SignalType.ERROR, type: DataType.ERROR_PAYLOAD, description: 'SSE stream failed' },
            { signal: SignalType.ABORTED, type: DataType.VOID, description: 'SSE stream aborted' },
        ],
    };

    private readonly controllers = new Map<string, ActiveStream>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.controllers.forEach(({ controller }) => controller.abort());
        this.controllers.clear();
        super.denervate();
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.STREAM: await this.handleStream(value); break;
            case SignalType.ABORT: this.handleAbort(value); break;
            default: break;
        }
    }

    private async handleStream(value?: unknown): Promise<void> {
        const payload = value as StreamPayload;
        const {
            correlationId = crypto.randomUUID(),
            streamId,
            context,
        } = payload;
        const controller = new AbortController();
        const requestId = streamId ?? correlationId;
        this.replaceController(requestId, correlationId, controller);
        try { await this.initiateStream({ ...payload, correlationId }, controller); }
        catch (error) { this.releaseController(requestId, controller); !controller.signal.aborted && this.handleStreamError(error, correlationId, streamId, context); }
    }

    private async initiateStream(payload: StreamPayload, controller: AbortController): Promise<void> {
        const {
            correlationId,
            streamId,
            context,
        } = payload;
        const requestId = streamId ?? correlationId!;
        const rawStream = await this.executeFetch(payload, controller);
        const { signal } = controller; signal.throwIfAborted();
        const reader = rawStream.getReader();
        const response: string[] = [];
        const stream = new ReadableStream<string>({
            pull: (consumer) => this.readChunk(reader, consumer, response, controller, requestId, correlationId, streamId, context),
            cancel: async (reason) => { controller.abort(reason); this.releaseController(requestId, controller); await reader.cancel(reason); },
        }, { highWaterMark: 0 });
        this.pulse(SignalType.STREAMED, {
            correlationId,
            streamId,
            stream,
            context,
        });
    }

    private async executeFetch(payload: StreamPayload, controller: AbortController): Promise<ReadableStream<string>> {
        const {
            endpoint = DEFAULT_ENDPOINT,
        } = payload;
        const body = this.resolveRequestBody(payload);
        const { signal } = controller;
        const {
            correlationId,
            streamId,
            provider,
            model,
        } = body as StreamPayload;
        this.pulse(SignalType.REQUESTED, {
            message: PROMPT_LOG_MESSAGE,
            correlationId,
            streamId,
            provider,
            model,
            request: body,
        });
        const response = await fetch(endpoint, {
            method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(body), signal,
        });
        return this.parseStreamResponse(response);
    }

    private resolveRequestBody(payload: StreamPayload): Record<string, unknown> {
        const {
            context: transportContext,
            endpoint: _endpoint,
            ...rest
        } = payload;
        const {
            context,
            replyTo,
        } = (transportContext ?? {}) as { context?: unknown; replyTo?: unknown };
        const resolvedContext = context ?? (replyTo === undefined ? transportContext : undefined);
        return {
            ...rest,
            ...(resolvedContext !== undefined && {
                context: resolvedContext,
            }),
        };
    }

    private parseStreamResponse(response: Response): ReadableStream<string> {
        const { body, ok, statusText } = response;
        if (!ok || !body) {
            throw new Error(`SSE request failed: ${statusText}`);
        }
        return this.createDecodedStream(body);
    }

    private createDecodedStream(body: ReadableStream<Uint8Array>): ReadableStream<string> {
        const textDecoder = new TextDecoderStream();
        const sseDecoder = this.createSseDecoderStream();
        return body
            .pipeThrough(textDecoder as unknown as TransformStream<Uint8Array, string>)
            .pipeThrough(sseDecoder);
    }

    private createSseDecoderStream(): TransformStream<string, string> {
        let buffer = '';
        const self = this;
        return new TransformStream<string, string>({
            transform(chunk, controller) {
                buffer = self.processSseLines(buffer + chunk, controller);
            },
            flush(controller) {
                self.flushSseBuffer(buffer, controller);
            },
        });
    }

    private processSseLines(text: string, controller: TransformStreamDefaultController<string>): string {
        const lines = text.split('\n');
        const remainder = lines.pop() ?? '';
        if (remainder.length > MAX_FRAME_LENGTH) {
            throw new Error('SSE frame exceeds the transport buffer limit');
        }
        lines.forEach((line) => this.flushSseBuffer(line, controller));
        return remainder;
    }

    private flushSseBuffer(buffer: string, controller: TransformStreamDefaultController<string>): void {
        if (buffer.length > MAX_FRAME_LENGTH) {
            throw new Error('SSE frame exceeds the transport buffer limit');
        }
        const chunk = this.extractSseData(buffer);
        if (chunk) {
            controller.enqueue(chunk);
        }
    }

    private extractSseData(line: string): string | undefined {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) { return undefined; }
        const content = trimmed.slice(5).trim();
        if (!content || content === '[DONE]') { return undefined; }
        let frame: Frame;
        try { frame = JSON.parse(content) as Frame; } catch { return content; }
        const { text, error } = frame;
        if (error) { throw new Error(error); }
        return text;
    }

    private async readChunk(reader: ReadableStreamDefaultReader<string>, controller: ReadableStreamDefaultController<string>, response: string[], abort: AbortController, requestId?: string, correlationId?: string, streamId?: string, context?: unknown): Promise<void> {
        const { signal } = abort;
        try {
            signal.throwIfAborted();
            const result = await reader.read();
            signal.throwIfAborted();
            this.deliverRead(result, controller, response, abort, requestId, correlationId, streamId, context);
        } catch (error) {
            this.releaseController(requestId, abort); controller.error(error); !signal.aborted && this.handleStreamError(error, correlationId, streamId, context);
        }
    }

    private deliverRead(result: ReadResult, controller: ReadableStreamDefaultController<string>, response: string[], abort: AbortController, requestId?: string, correlationId?: string, streamId?: string, context?: unknown): void {
        const { done, value } = result;
        if (done) {
            this.pulse(SignalType.RESPONDED, {
                message: RESPONSE_LOG_MESSAGE,
                correlationId,
                streamId,
                response: response.join(''),
                context,
            });
            this.releaseController(requestId, abort); controller.close(); this.pulse(SignalType.END, { correlationId, streamId, context });
        }
        else {
            response.push(value);
            controller.enqueue(value);
        }
    }

    private handleStreamError(error: unknown, correlationId?: string, streamId?: string, context?: unknown): void {
        const { message = '', name = '' } = (error ?? {}) as { message?: string; name?: string };
        if (name === 'AbortError' || message.includes('aborted')) {
            return;
        }
        this.pulse(SignalType.ERROR, {
            correlationId,
            streamId,
            error: message || String(error),
            context,
        });
    }

    private handleAbort(value?: unknown): void {
        const { correlationId } = (value ?? {}) as { correlationId?: string };
        if (correlationId) {
            this.controllers.forEach((active, requestId) => {
                if (active.correlationId === correlationId) {
                    active.controller.abort(); this.controllers.delete(requestId);
                }
            });
        }
        else {
            this.controllers.forEach(({ controller }) => controller.abort()); this.controllers.clear();
        }
        this.pulse(SignalType.ABORTED, { correlationId });
    }

    private replaceController(requestId: string, correlationId: string, controller: AbortController): void {
        this.controllers.get(requestId)?.controller.abort();
        this.controllers.set(requestId, {
            controller,
            correlationId,
        });
    }

    private releaseController(requestId: string | undefined, controller: AbortController): void {
        if (requestId && this.controllers.get(requestId)?.controller === controller) {
            this.controllers.delete(requestId);
        }
    }
}

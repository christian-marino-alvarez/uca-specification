import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    DEFAULT_ENDPOINT,
    DEFAULT_SIGNALS,
} from './constants.js';
import {
    type Body,
    type StreamPayload,
    type StreamResult,
    DataType,
    SignalType,
} from './types.js';

export class SseClient extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: AIM, body: { endpoint: DEFAULT_ENDPOINT } },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.STREAM, type: DataType.STREAM_PAYLOAD, description: 'Open SSE stream' },
            { signal: SignalType.ABORT, type: DataType.VOID, description: 'Abort active SSE streams' },
        ],
        outputs: [
            { signal: SignalType.STREAMED, type: DataType.STREAM_RESULT, description: 'SSE stream connected' },
            { signal: SignalType.CHUNK, type: DataType.CHUNK_PAYLOAD, description: 'SSE text chunk received' },
            { signal: SignalType.END, type: DataType.VOID, description: 'SSE stream finished' },
            { signal: SignalType.ERROR, type: DataType.ERROR_PAYLOAD, description: 'SSE stream failed' },
            { signal: SignalType.ABORTED, type: DataType.VOID, description: 'SSE stream aborted' },
        ],
    };

    private controller?: AbortController;

    public constructor(id: string = __ID__) {
        super(id);
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
        const payload = (value ?? {}) as StreamPayload;
        const { correlationId, streamId } = payload;
        try {
            const rawStream = await this.executeFetch(payload);
            const [streamForListener, streamForChunks] = rawStream.tee();
            this.pulse(SignalType.STREAMED, { correlationId, streamId, stream: streamForListener });
            void this.consumeStream(streamForChunks, correlationId);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.pulse(SignalType.ERROR, { correlationId, error: message });
        }
    }

    private async executeFetch(payload: StreamPayload): Promise<ReadableStream<string>> {
        const { endpoint = DEFAULT_ENDPOINT } = payload;
        this.controller = new AbortController();
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: this.controller.signal,
        });
        return this.parseStreamResponse(response);
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
        for (const line of lines) {
            const chunk = this.extractSseData(line);
            if (chunk) { controller.enqueue(chunk); }
        }
        return remainder;
    }

    private flushSseBuffer(buffer: string, controller: TransformStreamDefaultController<string>): void {
        const chunk = this.extractSseData(buffer);
        if (chunk) { controller.enqueue(chunk); }
    }

    private extractSseData(line: string): string | undefined {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) { return undefined; }
        const content = trimmed.slice(5).trim();
        if (!content || content === '[DONE]') { return undefined; }
        try {
            const parsed = JSON.parse(content) as { text?: unknown };
            return typeof parsed.text === 'string' ? parsed.text : undefined;
        } catch {
            return content;
        }
    }

    private async consumeStream(stream: ReadableStream<string>, correlationId?: string): Promise<void> {
        const reader = stream.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            this.pulse(SignalType.CHUNK, { correlationId, chunk: value });
        }
        this.pulse(SignalType.END, { correlationId });
    }

    private handleAbort(value?: unknown): void {
        const { correlationId } = (value ?? {}) as { correlationId?: string };
        this.controller?.abort();
        this.controller = undefined;
        this.pulse(SignalType.ABORTED, { correlationId });
    }
}

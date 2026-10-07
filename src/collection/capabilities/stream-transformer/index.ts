import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import type { z } from 'zod';
import { __ID__, AIM, DEFAULT_SIGNALS } from './constants.js';
import {
    type Body,
    type TransformPayload,
    DataType,
    SignalType,
} from './types.js';

export class StreamTransformer extends Capability<Body> {
    public static readonly __ID__: string = __ID__;
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: StreamTransformer.AIM, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.TRANSFORM, type: DataType.TRANSFORM_PAYLOAD, description: 'Transform text stream to object stream' },
        ],
        outputs: [
            { signal: SignalType.TRANSFORMED, type: DataType.TRANSFORM_RESULT, description: 'ReadableStream of transformed objects' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Stream transformation or validation error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.TRANSFORM:
                this.handleTransform(value);
                break;
            default:
                break;
        }
    }

    private handleTransform(value?: unknown): void {
        const payload = (value ?? {}) as TransformPayload;
        const { correlationId, streamId, stream } = payload;
        if (!stream) {
            this.pulse(SignalType.ERROR, { action: 'transform', error: 'Missing input stream' });
            return;
        }
        const transformedStream = this.transformStream(stream, this.resolveSchema(payload));
        this.pulse(SignalType.TRANSFORMED, { correlationId, streamId, stream: transformedStream });
    }

    private transformStream(stream: ReadableStream<string>, schema?: z.ZodTypeAny): ReadableStream<Record<string, unknown>> {
        const transformStream = this.createTransformStream(schema);
        return stream.pipeThrough(transformStream);
    }

    private createTransformStream(schema?: z.ZodTypeAny): TransformStream<string, Record<string, unknown>> {
        let buffer = '';
        const transform = (chunk: string, controller: TransformStreamDefaultController<Record<string, unknown>>) => {
            buffer = this.processChunk(buffer + chunk, controller, schema);
        };
        const flush = (controller: TransformStreamDefaultController<Record<string, unknown>>) => {
            this.flushBuffer(buffer, controller, schema);
        };
        return new TransformStream<string, Record<string, unknown>>({ transform, flush });
    }

    private processChunk(text: string, controller: TransformStreamDefaultController<Record<string, unknown>>, schema?: z.ZodTypeAny): string {
        let current = text;
        for (let item = this.parseNext(current); item; item = this.parseNext(current)) {
            if (item.parsed) { this.enqueueValidated(item.parsed, controller, schema); }
            current = current.slice(item.nextIndex);
        }
        return current;
    }

    private parseNext(text: string): { parsed?: Record<string, unknown>; nextIndex: number } | undefined {
        const trimmed = text.trimStart();
        if (trimmed.startsWith('{')) {
            const start = text.indexOf('{');
            const end = this.findBraceEnd(text, start);
            if (end !== -1) {
                return this.tryParseObject(text.slice(start, end), end);
            }
        }
        return this.parseInnerEntry(text);
    }

    private tryParseObject(raw: string, nextIndex: number): { parsed?: Record<string, unknown>; nextIndex: number } {
        try {
            return { parsed: JSON.parse(raw), nextIndex };
        } catch {
            return { nextIndex: 1 };
        }
    }

    private parseInnerEntry(text: string): { parsed?: Record<string, unknown>; nextIndex: number } | undefined {
        const match = /"([^"]+)"\s*:\s*\{/.exec(text);
        if (!match) { return undefined; }
        const key = match[1];
        const braceStart = match.index + match[0].lastIndexOf('{');
        const braceEnd = this.findBraceEnd(text, braceStart);
        if (braceEnd === -1) { return undefined; }
        const jsonContent = `{"${key}":${text.slice(braceStart, braceEnd)}}`;
        const nextIndex = text[braceEnd] === ',' ? braceEnd + 1 : braceEnd;
        return this.tryParseObject(jsonContent, nextIndex);
    }

    private findBraceEnd(text: string, start: number): number {
        let depth = 0;
        for (let index = start; index < text.length; index++) {
            if (text[index] === '{') { depth++; }
            if (text[index] === '}') { depth--; }
            if (depth === 0) { return index + 1; }
        }
        return -1;
    }

    private sanitizeItem(item: Record<string, unknown>): Record<string, unknown> {
        const entries = Object.entries(item).filter(([, value]) => {
            return typeof value === 'object' && value !== null;
        });
        return Object.fromEntries(entries);
    }

    private enqueueValidated(item: Record<string, unknown>, controller: TransformStreamDefaultController<Record<string, unknown>>, schema?: z.ZodTypeAny): void {
        const candidate = 'purpose' in item ? item : this.sanitizeItem(item);
        if (Object.keys(candidate).length === 0) { return; }
        const validation = schema ? schema.safeParse(candidate) : { success: true, data: candidate };
        if (!validation.success) {
            console.warn('⚠️ [stream-transformer] Chunk rejected by schema:', candidate);
            return;
        }
        this.dispatchValidated(validation.data as Record<string, unknown>, controller);
    }

    private dispatchValidated(data: Record<string, unknown>, controller: TransformStreamDefaultController<Record<string, unknown>>): void {
        const keys = Object.keys(data);
        if (keys.length === 0) { return; }
        if (keys.length > 1 && !('purpose' in data)) {
            keys.forEach((key) => controller.enqueue({ [key]: data[key] }));
            return;
        }
        controller.enqueue(data);
    }

    private flushBuffer(buffer: string, controller: TransformStreamDefaultController<Record<string, unknown>>, schema?: z.ZodTypeAny): void {
        this.processChunk(buffer, controller, schema);
    }

    private resolveSchema(payload: TransformPayload): z.ZodTypeAny | undefined {
        if (payload.schema) { return payload.schema; }
        const { aim } = this.disposition;
        const { schema } = (aim.body ?? {}) as Body;
        return schema;
    }
}

import { z } from 'zod';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType, type ChunkResult, type InferResult } from '@uca/llm/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    SignalType as TransformerSignalType,
    type TransformResult,
} from '@uca/capability-stream-transformer/types';
import {
    __ID__,
    CSS_TOKENS_SUMMARY,
    DEFAULT_CATALOG,
    DEFAULT_CONTEXT,
    DEFAULT_MODEL,
    DEFAULT_PARENT,
    DEFAULT_PROVIDER,
    DEFAULT_PURPOSE,
    DEFAULT_REQUEST,
    REPRESENTATION_AREAS_DIRECTIVE,
} from './constants.js';
import { layoutSchema } from './schema.js';
import { type Body, type Limits, DataType, SignalType } from './types.js';

export class Composer extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Composer.purpose,
            body: {
                request: DEFAULT_REQUEST,
                context: DEFAULT_CONTEXT,
                catalog: [...DEFAULT_CATALOG],
                parentTo: DEFAULT_PARENT,
            },
        },
        reactTo: [
            SignalType.COMPOSE,
            LlmSignalType.INFER,
            LlmSignalType.STREAM,
            LlmSignalType.INFERRED,
            LlmSignalType.CHUNK,
            LlmSignalType.STREAM_END,
            LlmSignalType.ERROR,
            TransformerSignalType.TRANSFORMED,
            TransformerSignalType.ERROR,
            ...Llm.disposition.reactTo ?? [],
            ...StreamTransformer.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.COMPOSE, type: DataType.BODY, description: 'Request layout composition' },
        ],
        outputs: [
            { signal: SignalType.COMPOSED, type: DataType.LAYOUT_RESULT, description: 'Emits structured layout composition' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits composition error' },
        ],
    };

    private streamController?: ReadableStreamDefaultController<string>;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.streamController?.close();
        this.streamController = undefined;
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const { property } = signal;
        switch (property) {
            case SignalType.COMPOSE:
                this.handleCompose(signal);
                break;
            case LlmSignalType.INFERRED:
                this.handleLlmInferred(signal);
                break;
            case LlmSignalType.CHUNK:
                this.handleLlmChunk(signal);
                break;
            case LlmSignalType.STREAM_END:
                this.handleLlmStreamEnd();
                break;
            case LlmSignalType.ERROR:
                this.handleLlmError(signal);
                break;
            case TransformerSignalType.TRANSFORMED:
                this.handleTransformerTransformed(signal);
                break;
            case TransformerSignalType.ERROR:
                this.handleTransformerError(signal);
                break;
            default:
                break;
        }
    }

    protected override catalog(): Cooky {
        return [
            ...this.buildLlmCooky(),
            ...this.buildStreamTransformerCooky(),
        ];
    }

    private buildLlmCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:llm`, provider: DEFAULT_PROVIDER, model: DEFAULT_MODEL };
        const aim = { description: 'Reasoning model for layout composition', body };
        const reactTo = [...Llm.disposition.reactTo ?? []];
        return [[Llm, { aim, reactTo }]];
    }

    private buildStreamTransformerCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:stream-transformer`, schema: layoutSchema };
        const aim = { description: StreamTransformer.AIM, body };
        const reactTo = [...StreamTransformer.disposition.reactTo ?? []];
        return [[StreamTransformer, { aim, reactTo }]];
    }

    private handleCompose(signal: Signal): void {
        const { value } = signal;
        const payload = this.extractPayload<Partial<Body>>(value) ?? {};
        const { aim, limits } = this.disposition;
        const { request: initialRequest = DEFAULT_REQUEST, context: initialContext = DEFAULT_CONTEXT, catalog: availableUcas = DEFAULT_CATALOG, parentTo = DEFAULT_PARENT } = aim.body ?? {};
        const prompt = this.buildPrompt(payload.request ?? initialRequest, payload.context ?? initialContext, [...availableUcas], limits, payload.parentTo ?? parentTo);
        const expectations = z.toJSONSchema(layoutSchema) as Record<string, unknown>;
        this.startStreamTransformation();
        console.log(`[${this.id}] 💬 Comunicando con LLM (${DEFAULT_PROVIDER}:${DEFAULT_MODEL})...`);
        this.pulse(LlmSignalType.STREAM, { provider: DEFAULT_PROVIDER, model: DEFAULT_MODEL, request: prompt, expectations, correlationId: this.id });
    }

    private startStreamTransformation(): void {
        const stream = new ReadableStream<string>({
            start: (controller) => { this.streamController = controller; },
        });
        const payload = { correlationId: this.id, stream, schema: layoutSchema };
        this.pulse(TransformerSignalType.TRANSFORM, payload);
    }

    private handleLlmInferred(signal: Signal): void {
        const { value } = signal;
        const result = this.extractPayload<InferResult>(value);
        const { response, data, correlationId } = result ?? {};
        if (correlationId && !this.matchesId(correlationId)) { return; }
        this.pulse(SignalType.COMPOSED, { layout: data ?? response });
    }

    private handleLlmChunk(signal: Signal): void {
        const { value } = signal;
        const chunk = this.extractPayload<ChunkResult>(value);
        const { text } = chunk ?? {};
        if (text) {
            this.streamController?.enqueue(text);
        }
    }

    private handleLlmStreamEnd(): void {
        this.streamController?.close();
        this.streamController = undefined;
    }

    private handleLlmError(signal: Signal): void {
        const { value } = signal;
        const payload = (value ?? {}) as { correlationId?: string };
        const correlationId = payload?.correlationId;
        if (!correlationId || (!this.matchesId(correlationId) && !correlationId.includes(this.id))) { return; }
        console.error(`[${this.id}] 🚨 Composition error:`, value);
        this.pulse(SignalType.ERROR, value);
    }

    private handleTransformerTransformed(signal: Signal): void {
        const { value } = signal;
        const { stream } = (value ?? {}) as TransformResult;
        if (!stream) { return; }
        const writable = this.createLoggingWritableStream();
        void stream.pipeTo(writable);
    }

    private createLoggingWritableStream(): WritableStream<Record<string, unknown>> {
        const { id } = this;
        return new WritableStream<Record<string, unknown>>({
            write: (chunk) => {
                const unpacked = this.unpackChunk(chunk);
                console.log(`[${id}] 🧩 Chunk final:`, unpacked);
                this.pulse(SignalType.CHUNK, unpacked);
            },
        });
    }

    private unpackChunk(chunk: Record<string, unknown>): Record<string, unknown> {
        const [entry] = Object.entries(chunk);
        if (!entry) { return chunk; }
        const [elementId, value] = entry;
        if (typeof value === 'object' && value !== null) {
            return { elementId, ...(value as Record<string, unknown>) };
        }
        return chunk;
    }

    private handleTransformerError(signal: Signal): void {
        const { value } = signal;
        console.error(`[${this.id}] 🚨 Stream transformer error:`, value);
        this.pulse(SignalType.ERROR, value);
    }

    private buildPrompt(request: string, context: string, catalog: string[], limits?: Limits, parentTo: string = DEFAULT_PARENT): string {
        const { width = 1440, height = 900, orientation = 'landscape-primary' } = limits ?? {};
        const availableUcas = catalog.join(', ');
        const hostMeta = `Host parentTo: ${parentTo}. Context: ${context}. Limits: ${width}x${height} (${orientation}). Available UCAs: ${availableUcas}.`;
        const prompt = `${hostMeta} ${REPRESENTATION_AREAS_DIRECTIVE} ${CSS_TOKENS_SUMMARY} Request: ${request}.`;
        return prompt;
    }
}

import { z } from 'zod';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType, type ChunkResult, type InferResult, type StreamEndResult } from '@uca/llm/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    SignalType as TransformerSignalType,
    type TransformResult,
} from '@uca/capability-stream-transformer/types';
import { Builder } from '@uca/builder';
import { SignalType as BuilderSignalType } from '@uca/builder/types';
import {
    __ID__,
    AXIS_DIRECTIVE,
    CORRELATION_SEPARATOR,
    CSS_TOKENS_SUMMARY,
    DEFAULT_CATALOG,
    DEFAULT_CONTEXT,
    DEFAULT_MODEL,
    DEFAULT_PARENT,
    DEFAULT_PROVIDER,
    DEFAULT_PURPOSE,
    DEFAULT_REQUEST,
    KIND_DIRECTIVE,
    MACRO_SCAFFOLD_DIRECTIVE,
} from './constants.js';
import { layoutSchema } from './schema.js';
import { type Body, type ComposePayload, type Limits, type StreamEntry, DataType, SignalType } from './types.js';

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
            BuilderSignalType.BUILT,
            BuilderSignalType.SUBDIVIDE,
            ...Llm.disposition.reactTo ?? [],
            ...StreamTransformer.disposition.reactTo ?? [],
            ...Builder.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.COMPOSE, type: DataType.BODY, description: 'Request layout composition' },
            { signal: BuilderSignalType.BUILT, type: DataType.UNKNOWN, description: 'Template materialized by Builder' },
            { signal: BuilderSignalType.SUBDIVIDE, type: DataType.UNKNOWN, description: 'Subdivision requested by Builder' },
        ],
        outputs: [
            { signal: SignalType.COMPOSED, type: DataType.LAYOUT_RESULT, description: 'Emits structured layout composition' },
            { signal: SignalType.CHUNK, type: DataType.UNKNOWN, description: 'Emits parsed layout chunk' },
            { signal: BuilderSignalType.BUILD, type: DataType.UNKNOWN, description: 'Request area build to Builder' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits composition error' },
        ],
    };

    private readonly streams = new Map<string, StreamEntry>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.streams.forEach(({ controller }) => controller.close());
        this.streams.clear();
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
                this.handleLlmStreamEnd(signal);
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
            case BuilderSignalType.BUILT:
                this.handleBuilderBuilt(signal);
                break;
            case BuilderSignalType.SUBDIVIDE:
                this.handleBuilderSubdivide(signal);
                break;
            default:
                break;
        }
    }

    protected override catalog(): Cooky {
        return [
            ...this.buildLlmCooky(),
            ...this.buildStreamTransformerCooky(),
            ...this.buildBuilderCooky(),
        ];
    }

    private buildBuilderCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:builder` };
        const aim = { description: Builder.purpose, body };
        const reactTo = [...Builder.disposition.reactTo ?? []];
        return [[Builder, { aim, reactTo }]];
    }

    private buildLlmCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:llm`, provider: DEFAULT_PROVIDER, model: DEFAULT_MODEL };
        const aim = { description: 'Reasoning model for layout composition', body };
        const reactTo = [LlmSignalType.INFER, LlmSignalType.STREAM, LlmSignalType.CONNECT, ...Object.values(GeminiSignalType)];
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
        const { aim, limits } = this.disposition;
        const { request: initialRequest = DEFAULT_REQUEST, context: initialContext = DEFAULT_CONTEXT, catalog: availableUcas = DEFAULT_CATALOG, parentTo: initialParent = DEFAULT_PARENT } = aim.body ?? {};
        const { request = initialRequest, context = initialContext, parentTo = initialParent, limits: requestedLimits = limits, depth = 0 } = this.extractPayload<ComposePayload>(value) ?? {};
        const prompt = this.buildPrompt(request, context, [...availableUcas], requestedLimits, parentTo);
        const correlationId = `${this.id}${CORRELATION_SEPARATOR}${parentTo}`;
        this.startStreamTransformation(correlationId, depth);
        console.log(`[${this.id}] 💬 Comunicando con LLM (${DEFAULT_PROVIDER}:${DEFAULT_MODEL}) para ${parentTo} (profundidad ${depth})...`);
        this.pulse(LlmSignalType.STREAM, { id: `${this.id}:llm`, provider: DEFAULT_PROVIDER, model: DEFAULT_MODEL, request: prompt, expectations: z.toJSONSchema(layoutSchema) as Record<string, unknown>, correlationId });
    }

    private startStreamTransformation(correlationId: string, depth: number): void {
        const { controller: previousController } = this.streams.get(correlationId) ?? {};
        previousController?.close();
        const stream = new ReadableStream<string>({
            start: (controller) => { this.streams.set(correlationId, { controller, depth }); },
        });
        this.pulse(TransformerSignalType.TRANSFORM, { correlationId, stream, schema: layoutSchema });
    }

    private handleLlmInferred(signal: Signal): void {
        const { value } = signal;
        const { response, data, correlationId = '' } = this.extractPayload<InferResult>(value) ?? {};
        const [ownerId] = correlationId.split(CORRELATION_SEPARATOR);
        if (correlationId && ownerId !== this.id) { return; }
        this.pulse(SignalType.COMPOSED, { layout: data ?? response });
    }

    private handleLlmChunk(signal: Signal): void {
        const { value } = signal;
        const { text, correlationId = '' } = this.extractPayload<ChunkResult>(value) ?? {};
        const { controller } = this.streams.get(correlationId) ?? {};
        if (text) {
            controller?.enqueue(text);
        }
    }

    private handleLlmStreamEnd(signal: Signal): void {
        const { value } = signal;
        const { correlationId = '' } = (value ?? {}) as StreamEndResult;
        const { controller } = this.streams.get(correlationId) ?? {};
        controller?.close();
        this.streams.delete(correlationId);
    }

    private handleLlmError(signal: Signal): void {
        const { value } = signal;
        const { correlationId = '' } = (value ?? {}) as { correlationId?: string };
        const [ownerId] = correlationId.split(CORRELATION_SEPARATOR);
        if (ownerId !== this.id) { return; }
        console.error(`[${this.id}] 🚨 Composition error:`, value);
        this.pulse(SignalType.ERROR, value);
    }

    private handleTransformerTransformed(signal: Signal): void {
        const { value } = signal;
        const { stream, correlationId = '' } = (value ?? {}) as TransformResult;
        const { depth } = this.streams.get(correlationId) ?? {};
        if (!stream || depth === undefined) { return; }
        void stream.pipeTo(this.createLoggingWritableStream(depth));
    }

    private handleBuilderBuilt(signal: Signal): void {
        const { value } = signal;
        console.log(`[${this.id}] 🏗️ Builder materializado:`, value);
    }

    private handleBuilderSubdivide(signal: Signal): void {
        const { value } = signal;
        console.log(`[${this.id}] 🔀 Builder subdivisión requerida:`, value);
    }

    private createLoggingWritableStream(depth: number): WritableStream<Record<string, unknown>> {
        return new WritableStream<Record<string, unknown>>({
            write: (chunk) => {
                this.forwardChunk({ ...this.unpackChunk(chunk), depth });
            },
        });
    }

    private forwardChunk(unpacked: Record<string, unknown>): void {
        const { aim } = this.disposition;
        const currentParent = (aim.body ?? {})?.parentTo;
        if (unpacked.elementId === currentParent) {
            return;
        }
        console.log(`[${this.id}] 🧩 Chunk final:`, unpacked);
        this.pulse(SignalType.CHUNK, unpacked);
        this.pulse(BuilderSignalType.BUILD, unpacked);
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
        const { width = 1440, height = 900, ratio = 1.6, orientation = 'landscape-primary' } = limits ?? {};
        const isSub = parentTo !== DEFAULT_PARENT;
        const task = isSub ? `subdivide:${parentTo}` : 'macro-scaffold';
        const contract = JSON.stringify({ task, parentTo, request, context, metrics: { width, height, ratio, orientation } });
        const directive = isSub ? this.buildSubdivisionDirective(parentTo) : `${MACRO_SCAFFOLD_DIRECTIVE} ${KIND_DIRECTIVE}`;
        return `CONTRACT: ${contract}\nDIRECTIVE: ${directive}\nTOKENS: ${CSS_TOKENS_SUMMARY}`;
    }

    private buildSubdivisionDirective(parentTo: string): string {
        return `Subdivide "${parentTo}" into 2-3 child layout areas with "parentTo": "${parentTo}". Do NOT recreate "${parentTo}". ${KIND_DIRECTIVE} ${AXIS_DIRECTIVE}`;
    }
}

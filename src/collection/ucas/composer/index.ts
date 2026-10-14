import { z } from 'zod';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType, type ChunkResult, type InferResult, type StreamEndResult } from '@uca/llm/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
import { SignalType as JevSignalType } from '@uca/capability-jev/types';
import { Decision } from '@uca/capability-decision';
import { SignalType as DecisionSignalType, type DecidedResult } from '@uca/capability-decision/types';
import { DEFAULT_MODEL as DECISION_MODEL, DEFAULT_PROVIDER as DECISION_PROVIDER } from '@uca/capability-decision/constants';
import { Memory } from '@uca/memory';
import { SignalType as MemorySignalType, type RetrievedResult } from '@uca/memory/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    SignalType as TransformerSignalType,
    type TransformResult,
} from '@uca/capability-stream-transformer/types';
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
    RECOMPOSE_QUESTION,
    adaptLayoutMeasures,
    adaptSectionMeasures,
    buildJevAdaptationCriteria,
    findMatchingMediaKey,
    formatMediaKey,
    resolveMediaRange,
} from './constants.js';
import { layoutSchema } from './schema.js';
import {
    type Body,
    type ComposePayload,
    type ComposerMemoryState,
    type Layout,
    type Limits,
    type Section,
    type StreamEntry,
    DataType,
    SignalType,
} from './types.js';

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
            MemorySignalType.RETRIEVED,
            MemorySignalType.SAVED,
            DecisionSignalType.DECIDED,
            DecisionSignalType.ERROR,
            ...Llm.disposition.reactTo ?? [],
            ...StreamTransformer.disposition.reactTo ?? [],
            ...Memory.disposition.reactTo ?? [],
            ...Decision.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.COMPOSE, type: DataType.BODY, description: 'Request layout composition' },
        ],
        outputs: [
            { signal: SignalType.COMPOSED, type: DataType.LAYOUT_RESULT, description: 'Emits structured layout composition' },
            { signal: SignalType.CHUNK, type: DataType.UNKNOWN, description: 'Emits parsed layout chunk' },
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
            case MemorySignalType.RETRIEVED:
                this.handleMemoryRetrieved(signal);
                break;
            case DecisionSignalType.DECIDED:
                this.handleDecisionDecided(signal);
                break;
            case DecisionSignalType.ERROR:
                this.handleDecisionError(signal);
                break;
            default:
                break;
        }
    }

    protected override catalog(): Cooky {
        return [
            ...this.buildLlmCooky(),
            ...this.buildStreamTransformerCooky(),
            ...this.buildMemoryCooky(),
            ...this.buildDecisionCooky(),
        ];
    }

    private buildLlmCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:llm`, provider: DEFAULT_PROVIDER, model: DEFAULT_MODEL };
        const aim = { description: 'Reasoning model for layout composition', body };
        const reactTo = [LlmSignalType.INFER, LlmSignalType.STREAM, LlmSignalType.CONNECT, ...Object.values(GeminiSignalType), ...Object.values(JevSignalType)];
        return [[Llm, { aim, reactTo }]];
    }

    private buildStreamTransformerCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:stream-transformer`, schema: layoutSchema };
        const aim = { description: StreamTransformer.AIM, body };
        const reactTo = [...StreamTransformer.disposition.reactTo ?? []];
        return [[StreamTransformer, { aim, reactTo }]];
    }

    private buildMemoryCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:memory`, namespace: `${id}:layouts` };
        const aim = { description: Memory.purpose, body };
        const reactTo = [...Memory.disposition.reactTo ?? []];
        return [[Memory, { aim, reactTo }]];
    }

    private buildDecisionCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:decision`, llm: `${id}:llm`, provider: DECISION_PROVIDER, model: DECISION_MODEL };
        const aim = { description: Decision.AIM, body };
        const reactTo = [...Decision.disposition.reactTo ?? []];
        return [[Decision, { aim, reactTo }]];
    }

    private handleCompose(signal: Signal): void {
        const { value } = signal;
        const { aim, limits } = this.disposition;
        const { request: initialRequest = DEFAULT_REQUEST, context: initialContext = DEFAULT_CONTEXT, parentTo: initialParent = DEFAULT_PARENT } = aim.body ?? {};
        const { request = initialRequest, context = initialContext, parentTo = initialParent, limits: requestedLimits = limits, depth = 0 } = this.extractPayload<ComposePayload>(value) ?? {};
        const encoded = JSON.stringify({ request, context, parentTo, limits: requestedLimits, depth });
        const correlationId = `${this.id}${CORRELATION_SEPARATOR}compose${CORRELATION_SEPARATOR}${encoded}`;
        this.pulse(MemorySignalType.GET, { id: `${this.id}:memory`, key: parentTo, correlationId });
    }

    private handleMemoryRetrieved(signal: Signal): void {
        const { value } = signal;
        const { value: memorized, correlationId = '' } = (value ?? {}) as RetrievedResult<ComposerMemoryState>;
        const [ownerId, operation, encoded = ''] = correlationId.split(CORRELATION_SEPARATOR);
        if (ownerId !== this.id || !encoded) { return; }
        this.routeMemoryOperation(operation, memorized, encoded);
    }

    private routeMemoryOperation(operation: string, memorized: ComposerMemoryState | null, encoded: string): void {
        switch (operation) {
            case 'compose':
                this.resolveComposeFromMemory(memorized, encoded);
                break;
            case 'chunk':
                this.saveChunkToMemory(memorized, encoded);
                break;
            case 'jev-adapt':
                this.applyJevToMemory(memorized, encoded);
                break;
            default:
                break;
        }
    }

    private resolveComposeFromMemory(memorized: ComposerMemoryState | null, encoded: string): void {
        const { request, context, parentTo, limits, depth } = JSON.parse(encoded) as { request: string; context: string; parentTo: string; limits?: Limits; depth: number };
        const hasValidLayout = Boolean(memorized && memorized.request === request && memorized.activeLayout && Object.keys(memorized.activeLayout).length > 0);
        if (!hasValidLayout || !memorized) {
            this.startGeminiComposition(request, context, parentTo, limits, depth);
            return;
        }
        this.reconcileWithMemory(memorized, request, context, parentTo, limits, depth);
    }

    private reconcileWithMemory(memorized: ComposerMemoryState, request: string, context: string, parentTo: string, limits: Limits | undefined, depth: number): void {
        const matchedKey = findMatchingMediaKey(memorized.medias, limits);
        if (matchedKey && matchedKey === memorized.activeMediaKey) {
            console.log(`[${this.id}] ⚡ Media en rango (${matchedKey}): KEEP (0 llamadas a IA)`);
            this.emitLayoutChunks(adaptLayoutMeasures(memorized.medias[matchedKey]?.layout ?? memorized.activeLayout ?? {}, limits), depth);
            return;
        }
        if (matchedKey && memorized.medias[matchedKey]) {
            this.restoreMediaLayout(parentTo, memorized, matchedKey, limits, depth);
            return;
        }
        this.evaluateOutOfRangeWithJev(memorized, request, context, parentTo, limits, depth);
    }

    private restoreMediaLayout(parentTo: string, memorized: ComposerMemoryState, matchedKey: string, limits: Limits | undefined, depth: number): void {
        const { media, layout: rawLayout } = memorized.medias[matchedKey];
        const layout = adaptLayoutMeasures(rawLayout, limits);
        const updated: ComposerMemoryState = { ...memorized, activeMediaKey: matchedKey, activeLayout: layout, medias: { ...memorized.medias, [matchedKey]: { media, layout } } };
        console.log(`[${this.id}] 🧠 Restaurando layout desde Memory para ${parentTo} (${matchedKey})`);
        this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: parentTo, value: updated });
        this.emitLayoutChunks(layout, depth);
        this.pulse(SignalType.COMPOSED, { layout });
    }

    private evaluateOutOfRangeWithJev(memorized: ComposerMemoryState, request: string, context: string, parentTo: string, limits: Limits | undefined, depth: number): void {
        const { activeLayout = {} } = memorized;
        const encoded = JSON.stringify({ request, context, parentTo, limits, depth });
        this.lockProvisionalMedia(parentTo, memorized, limits);
        const state = { currentDisposition: activeLayout, browserConditions: limits, request, parentTo };
        const criteria = buildJevAdaptationCriteria(activeLayout);
        const correlationId = `${this.id}${CORRELATION_SEPARATOR}jev${CORRELATION_SEPARATOR}${encoded}`;
        console.log(`[${this.id}] ⚖️ Fuera de rango de media para ${parentTo}: consultando a Jev (Decision)...`);
        this.pulse(DecisionSignalType.DECIDE, { id: `${this.id}:decision`, state, question: RECOMPOSE_QUESTION, criteria, correlationId, provider: DECISION_PROVIDER, model: DECISION_MODEL });
    }

    private lockProvisionalMedia(parentTo: string, memorized: ComposerMemoryState, limits?: Limits): void {
        const { activeLayout = {} } = memorized;
        const media = resolveMediaRange(limits);
        const mediaKey = formatMediaKey(parentTo, media);
        const layout = adaptLayoutMeasures(activeLayout, limits);
        const provisional: ComposerMemoryState = { ...memorized, activeMediaKey: mediaKey, activeLayout: layout, medias: { ...memorized.medias, [mediaKey]: { media, layout } } };
        this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: parentTo, value: provisional });
    }

    private handleDecisionDecided(signal: Signal): void {
        const { value } = signal;
        const { decision, probability, raw, correlationId = '' } = (value ?? {}) as DecidedResult;
        const [ownerId, operation, encoded = ''] = correlationId.split(CORRELATION_SEPARATOR);
        if (ownerId !== this.id || operation !== 'jev' || !encoded) { return; }
        const { request, context, parentTo, limits, depth } = JSON.parse(encoded) as { request: string; context: string; parentTo: string; limits?: Limits; depth: number };
        console.log(`[${this.id}] ⚖️ Decisión Jev para ${parentTo}: ${decision ? 'recomponer (Gemini)' : 'adaptar medidas (Jev)'} (confianza ${probability?.toFixed(2) ?? 'n/d'})`);
        if (decision === true) { this.startGeminiComposition(request, context, parentTo, limits, depth); return; }
        this.requestJevAdaptation(parentTo, limits, depth, raw);
    }

    private handleDecisionError(signal: Signal): void {
        const { value } = signal;
        const { correlationId = '' } = (value ?? {}) as { correlationId?: string };
        const [ownerId, operation, encoded = ''] = correlationId.split(CORRELATION_SEPARATOR);
        if (ownerId !== this.id || operation !== 'jev' || !encoded) { return; }
        const { parentTo, limits, depth } = JSON.parse(encoded) as { parentTo: string; limits?: Limits; depth: number };
        this.requestJevAdaptation(parentTo, limits, depth, undefined);
    }

    private requestJevAdaptation(parentTo: string, limits: Limits | undefined, depth: number, raw: unknown): void {
        const encoded = JSON.stringify({ parentTo, limits, depth, raw });
        const correlationId = `${this.id}${CORRELATION_SEPARATOR}jev-adapt${CORRELATION_SEPARATOR}${encoded}`;
        this.pulse(MemorySignalType.GET, { id: `${this.id}:memory`, key: parentTo, correlationId });
    }

    private applyJevToMemory(memorized: ComposerMemoryState | null, encoded: string): void {
        if (!memorized?.activeLayout) { return; }
        const { parentTo, limits, depth, raw } = JSON.parse(encoded) as { parentTo: string; limits?: Limits; depth: number; raw?: unknown };
        const adapted = adaptLayoutMeasures(memorized.activeLayout, limits, raw);
        const media = resolveMediaRange(limits);
        const mediaKey = formatMediaKey(parentTo, media);
        const updated: ComposerMemoryState = { ...memorized, activeMediaKey: mediaKey, activeLayout: adapted, medias: { ...memorized.medias, [mediaKey]: { media, layout: adapted } } };
        this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: parentTo, value: updated });
        this.emitLayoutChunks(adapted, depth);
        this.pulse(SignalType.COMPOSED, { layout: adapted });
    }

    private emitLayoutChunks(layout: Layout, depth: number): void {
        for (const [elementId, section] of Object.entries(layout)) {
            this.pulse(SignalType.CHUNK, { elementId, ...section, depth });
        }
    }

    private startGeminiComposition(request: string, context: string, parentTo: string, limits: Limits | undefined, depth: number): void {
        const { aim } = this.disposition;
        const { catalog: availableUcas = DEFAULT_CATALOG } = aim.body ?? {};
        const prompt = this.buildPrompt(request, context, [...availableUcas], limits, parentTo);
        const correlationId = `${this.id}${CORRELATION_SEPARATOR}${parentTo}`;
        this.startStreamTransformation(correlationId, depth, parentTo, request, context, limits);
        console.log(`[${this.id}] 💬 Comunicando con LLM (${DEFAULT_PROVIDER}:${DEFAULT_MODEL}) para ${parentTo} (profundidad ${depth})...`);
        this.pulse(LlmSignalType.STREAM, { id: `${this.id}:llm`, provider: DEFAULT_PROVIDER, model: DEFAULT_MODEL, request: prompt, expectations: z.toJSONSchema(layoutSchema) as Record<string, unknown>, correlationId });
    }

    private startStreamTransformation(correlationId: string, depth: number, parentTo: string, request: string, context: string, limits?: Limits): void {
        const { controller: previousController } = this.streams.get(correlationId) ?? {};
        previousController?.close();
        const stream = new ReadableStream<string>({
            start: (controller) => { this.streams.set(correlationId, { controller, depth, parentTo, request, context, limits }); },
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
        const entry = this.streams.get(correlationId);
        if (!stream || !entry) { return; }
        void stream.pipeTo(this.createLoggingWritableStream(entry));
    }

    private createLoggingWritableStream(entry: StreamEntry): WritableStream<Record<string, unknown>> {
        const { depth, parentTo, request, context, limits } = entry;
        return new WritableStream<Record<string, unknown>>({
            write: (chunk) => {
                this.forwardChunk({ ...this.unpackChunk(chunk), depth }, parentTo, request, context, limits);
            },
        });
    }

    private forwardChunk(unpacked: Record<string, unknown>, parentTo: string, request: string, context: string, limits?: Limits): void {
        if (unpacked.elementId === parentTo) { return; }
        const enriched = adaptSectionMeasures(unpacked as Section & { elementId: string }, limits);
        this.memorizeChunk(parentTo, request, context, enriched, limits);
        this.pulse(SignalType.CHUNK, enriched);
    }

    private memorizeChunk(parentTo: string, request: string, context: string, unpacked: Record<string, unknown>, limits?: Limits): void {
        const encoded = JSON.stringify({ parentTo, request, context, unpacked, limits });
        const correlationId = `${this.id}${CORRELATION_SEPARATOR}chunk${CORRELATION_SEPARATOR}${encoded}`;
        this.pulse(MemorySignalType.GET, { id: `${this.id}:memory`, key: parentTo, correlationId });
    }

    private saveChunkToMemory(memorized: ComposerMemoryState | null, encoded: string): void {
        const { parentTo, request, context, unpacked, limits } = JSON.parse(encoded) as { parentTo: string; request: string; context: string; unpacked: Section & { elementId: string }; limits?: Limits };
        const { elementId, ...section } = unpacked;
        const media = resolveMediaRange(limits);
        const mediaKey = formatMediaKey(parentTo, media);
        const previousLayout = memorized?.request === request ? (memorized.medias?.[mediaKey]?.layout ?? {}) : {};
        const nextLayout: Layout = { ...previousLayout, [elementId]: { ...section, media } };
        const nextMedias = { ...(memorized?.request === request ? memorized.medias : {}), [mediaKey]: { media, layout: nextLayout } };
        const state: ComposerMemoryState = { request, context, activeMediaKey: mediaKey, activeLayout: nextLayout, medias: nextMedias };
        this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: parentTo, value: state });
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

    private buildPrompt(request: string, context: string, _catalog: string[], limits?: Limits, parentTo: string = DEFAULT_PARENT): string {
        const { width = 1440, height = 900, ratio = 1.6, orientation = 'landscape-primary', minWidth, maxWidth } = limits ?? {};
        const isSub = parentTo !== DEFAULT_PARENT;
        const task = isSub ? `subdivide:${parentTo}` : 'macro-scaffold';
        const contract = JSON.stringify({ task, parentTo, request, context, metrics: { width, height, ratio, orientation, ...(minWidth !== undefined && { minWidth }), ...(maxWidth !== undefined && { maxWidth }) } });
        const directive = isSub ? this.buildSubdivisionDirective(parentTo) : `${MACRO_SCAFFOLD_DIRECTIVE} ${KIND_DIRECTIVE}`;
        return `CONTRACT: ${contract}\nDIRECTIVE: ${directive}\nTOKENS: ${CSS_TOKENS_SUMMARY}`;
    }

    private buildSubdivisionDirective(parentTo: string): string {
        return `Subdivide "${parentTo}" into 2-3 child layout areas with "parentTo": "${parentTo}". Do NOT recreate "${parentTo}". ${KIND_DIRECTIVE} ${AXIS_DIRECTIVE}`;
    }
}

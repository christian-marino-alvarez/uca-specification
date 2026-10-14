import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Picture } from '@uca/picture';
import { SignalType as PictureSignalType } from '@uca/picture/types';
import { Memory } from '@uca/memory';
import { SignalType as MemorySignalType, type RetrievedResult } from '@uca/memory/types';
import { Decision } from '@uca/capability-decision';
import { SignalType as DecisionSignalType, type DecidedResult } from '@uca/capability-decision/types';
import { DEFAULT_MODEL as DECISION_MODEL, DEFAULT_PROVIDER as DECISION_PROVIDER } from '@uca/capability-decision/constants';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType } from '@uca/llm/types';
import { SignalType as JevSignalType } from '@uca/capability-jev/types';
import { Composer } from '@uca/composer';
import { SignalType as ComposerSignalType } from '@uca/composer/types';
import { __ID__, CORRELATION_SEPARATOR, DEFAULT_STATUS, ROOT_PARENT, STRUCTURAL_DEPTH, SUBDIVISION_QUESTION, areAreaMediasEqual, areAreaQualitiesEqual, buildChildComposePayload, createDynamicSkeletonSvg, formatDimension, isAreaMounted, isLeafKind, resolveBoxQualities, resolveNestedHeight } from './constants.js';
import { type AreaPayload, type Body, type Dimensions, DataType, SignalType } from './types.js';

export class Builder extends Uca<Body> {
    public static override purpose: string = 'Materialize template representation areas, render loading skeletons, evaluate area sufficiency via Decision capability, or request sub-area decomposition';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Builder.purpose,
            body: { status: DEFAULT_STATUS },
        },
        reactTo: [
            SignalType.BUILD,
            SignalType.SKELETON,
            SignalType.EVALUATE,
            BoxSignalType.CREATED,
            PictureSignalType.CREATED,
            DecisionSignalType.DECIDED,
            DecisionSignalType.ERROR,
            MemorySignalType.RETRIEVED,
            MemorySignalType.SAVED,
            ComposerSignalType.CHUNK,
            ...Box.disposition.reactTo ?? [],
            ...Picture.disposition.reactTo ?? [],
            ...Decision.disposition.reactTo ?? [],
            ...Memory.disposition.reactTo ?? [],
            ...Composer.disposition.reactTo ?? [],
            LlmSignalType.INFER,
        ],
        inputs: [
            { signal: SignalType.BUILD, type: DataType.BUILD_PAYLOAD, description: 'Command to construct the area template' },
            { signal: SignalType.SKELETON, type: DataType.SKELETON_PAYLOAD, description: 'Command to render loading skeleton for the area' },
            { signal: SignalType.EVALUATE, type: DataType.EVALUATE_PAYLOAD, description: 'Command to evaluate area sufficiency via Decision' },
            { signal: DecisionSignalType.DECIDED, type: DataType.UNKNOWN, description: 'Decision results from Decision capability' },
            { signal: ComposerSignalType.CHUNK, type: DataType.UNKNOWN, description: 'Composed area chunk from Composer capability' },
        ],
        outputs: [
            { signal: SignalType.BUILT, type: DataType.BUILT_RESULT, description: 'Emitted when area template has been materialized' },
            { signal: SignalType.SUBDIVIDE, type: DataType.SUBDIVIDE_RESULT, description: 'Emitted when area requires further subdivision' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emitted upon builder failure' },
            { signal: DecisionSignalType.DECIDE, type: DataType.UNKNOWN, description: 'Query Decision capability for area subdivision evaluation' },
            { signal: ComposerSignalType.COMPOSE, type: DataType.UNKNOWN, description: 'Delegate sub-area layout generation to Composer' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        return [
            ...this.buildBoxCooky(),
            ...this.buildPictureCooky(),
            ...this.buildDecisionCooky(),
            ...this.buildLlmCooky(),
            ...this.buildMemoryCooky(),
            ...this.buildComposerCooky(),
        ];
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        console.log(`[${this.id}] 🏗️ Builder innervado`);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.BUILD:
                this.handleBuild(value);
                break;
            case SignalType.SKELETON:
                this.handleSkeleton(value);
                break;
            case SignalType.EVALUATE:
                this.handleEvaluate(value);
                break;
            case BoxSignalType.CREATED:
                this.handleBoxCreated(signal);
                break;
            case PictureSignalType.CREATED:
                this.handlePictureCreated(signal);
                break;
            case DecisionSignalType.DECIDED:
                this.handleDecisionDecided(signal);
                break;
            case DecisionSignalType.ERROR:
                this.handleDecisionError(signal);
                break;
            case MemorySignalType.RETRIEVED:
                this.handleMemoryRetrieved(signal);
                break;
            case ComposerSignalType.CHUNK:
                this.handleComposerChunk(value);
                break;
            default:
                break;
        }
    }

    private buildBoxCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:box` };
        const aim = { description: Box.purpose, body };
        const reactTo = [...Box.disposition.reactTo ?? []];
        return [[Box, { aim, reactTo }]];
    }

    private buildPictureCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:picture` };
        const aim = { description: Picture.purpose, body };
        const reactTo = [...Picture.disposition.reactTo ?? []];
        return [[Picture, { aim, reactTo }]];
    }

    private buildDecisionCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:decision`, llm: `${id}:llm` };
        const aim = { description: Decision.AIM, body };
        const reactTo = [...Decision.disposition.reactTo ?? []];
        return [[Decision, { aim, reactTo }]];
    }

    private buildLlmCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:llm`, provider: DECISION_PROVIDER, model: DECISION_MODEL };
        const aim = { description: 'Reasoning model for Jev decision evaluation', body };
        const reactTo = [LlmSignalType.INFER, LlmSignalType.CONNECT, ...Object.values(JevSignalType)];
        return [[Llm, { aim, reactTo }]];
    }

    private buildMemoryCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:memory`, namespace: `${id}:areas` };
        const aim = { description: Memory.purpose, body };
        const reactTo = [...Memory.disposition.reactTo ?? []];
        return [[Memory, { aim, reactTo }]];
    }

    private buildComposerCooky(): Cooky {
        const { id } = this;
        const body = { id: `${id}:composer`, request: '', context: Builder.purpose, catalog: ['Box'], parentTo: ROOT_PARENT };
        const aim = { description: Composer.purpose, body };
        const reactTo = [...Composer.disposition.reactTo ?? []];
        return [[Composer, { aim, reactTo }]];
    }

    private handleComposerChunk(value?: unknown): void {
        this.handleBuild(value);
    }

    private handleBuild(value?: unknown): void {
        const payload = (value ?? {}) as AreaPayload;
        const { elementId, areaId = elementId ?? this.id } = payload;
        const correlationId = `${this.id}${CORRELATION_SEPARATOR}${JSON.stringify({ areaId, payload })}`;
        this.pulse(MemorySignalType.GET, { id: `${this.id}:memory`, key: areaId, correlationId });
    }

    private handleMemoryRetrieved(signal: Signal): void {
        const { value } = signal;
        const { value: memorized, correlationId = '' } = (value ?? {}) as RetrievedResult<AreaPayload>;
        const [ownerId, encoded = ''] = correlationId.split(CORRELATION_SEPARATOR);
        if (ownerId !== this.id || !encoded) { return; }
        const { areaId, payload } = JSON.parse(encoded) as { areaId: string; payload: AreaPayload };
        if (!memorized || !isAreaMounted(areaId)) { this.materializeNewArea(areaId, { ...memorized, ...payload, subdivided: memorized?.subdivided }); return; }
        this.reconcileExistingArea(areaId, memorized, payload);
    }

    private materializeNewArea(areaId: string, payload: AreaPayload): void {
        const { kind, depth = 0, subdivided } = payload;
        console.log(`[${this.id}] 🏗️ Construyendo template para área:`, areaId, `(profundidad ${depth})`);
        this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: areaId, value: payload });
        this.handleSkeleton(payload);
        if (isLeafKind(kind) || subdivided === false) { this.logFinalRender(areaId); return; }
        this.routeSubdivision({ ...payload, areaId });
    }

    private reconcileExistingArea(areaId: string, memorized: AreaPayload, incoming: AreaPayload): void {
        const [qualitiesChanged, mediaChanged] = [!areAreaQualitiesEqual(memorized, incoming), !areAreaMediasEqual(memorized, incoming)];
        if (!qualitiesChanged && !mediaChanged) { return; }
        const merged: AreaPayload = { ...memorized, ...incoming, subdivided: memorized.subdivided };
        this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: areaId, value: merged });
        if (qualitiesChanged) { this.updateAreaBox(areaId, merged); }
        if (merged.subdivided) { this.pulse(ComposerSignalType.COMPOSE, buildChildComposePayload({ ...merged, areaId }, this.id)); }
    }

    private updateAreaBox(areaId: string, payload: AreaPayload): void {
        const qualities = resolveBoxQualities(payload);
        console.log(`[${this.id}] 🎨 Actualizando área ${areaId} (${qualities.width}, ${qualities.direction ?? 'auto'})`);
        this.pulse(BoxSignalType.UPDATE, { elementId: areaId, qualities });
        this.pulse(SignalType.BUILT, { areaId, success: true });
    }

    private routeSubdivision(payload: AreaPayload): void {
        const { depth = 0, subdivided } = payload;
        if (depth === STRUCTURAL_DEPTH || subdivided) {
            this.delegateSubdivisionToComposer(payload);
            return;
        }
        this.evaluateAreaWithDecision(payload);
    }

    private handleSkeleton(value?: unknown): void {
        const payload = (value ?? {}) as AreaPayload;
        const { elementId, areaId = elementId ?? this.id, parentTo, kind, dimensions } = payload;
        console.log(`[${this.id}] 💀 Renderizando skeleton para área: ${areaId} (kind: ${kind ?? 'sin kind'})`);
        if (parentTo && parentTo !== ROOT_PARENT) { this.pulse(PictureSignalType.REMOVE, { elementId: `${parentTo}:skeleton-pic` }); }
        this.renderSkeletonBox(areaId, payload);
        this.renderSkeletonPicture(areaId, kind, dimensions);
    }

    private renderSkeletonBox(areaId: string, payload: AreaPayload): void {
        const { parentTo } = payload;
        const qualities = resolveBoxQualities(payload);
        this.pulse(BoxSignalType.RENDER, { elementId: areaId, parentTo, qualities });
    }

    private renderSkeletonPicture(areaId: string, kind?: string, dimensions?: Dimensions): void {
        const skeletonPictureId = `${areaId}:skeleton-pic`;
        const { width, height } = dimensions ?? {};
        const src = createDynamicSkeletonSvg(kind, height, width);
        const qualities = { width: 'full', height: 'auto', radius: 'small' };
        this.pulse(PictureSignalType.RENDER, { elementId: skeletonPictureId, parentTo: areaId, src, qualities });
    }

    private handleEvaluate(value?: unknown): void {
        this.evaluateAreaWithDecision((value ?? {}) as AreaPayload);
    }

    private evaluateAreaWithDecision(payload: AreaPayload): void {
        const { elementId, areaId = elementId ?? this.id, purpose = '', context = '', dimensions, style, media, depth = 0 } = payload;
        const { width, height } = dimensions ?? {};
        const [formattedWidth, formattedHeight] = [formatDimension(width), formatDimension(resolveNestedHeight(String(height ?? 'auto'), depth))];
        console.log(`[${this.id}] ⚖️ Evaluando decisión de subdivisión con Decision (Jev) para área:`, areaId, `[${formattedWidth} x ${formattedHeight}]`);
        const state = { areaId, purpose, context, depth, dimensions, style, media, dimensionsDescription: { width: formattedWidth, height: formattedHeight } };
        this.pulse(DecisionSignalType.DECIDE, { id: `${this.id}:decision`, state, question: SUBDIVISION_QUESTION, correlationId: `${this.id}${CORRELATION_SEPARATOR}${areaId}` });
    }

    private handleDecisionDecided(signal: Signal): void {
        const { value } = signal;
        const { decision, probability, correlationId = '', state } = (value ?? {}) as DecidedResult;
        const [ownerId, areaId = this.id] = correlationId.split(CORRELATION_SEPARATOR);
        if (correlationId && ownerId !== this.id) { return; }
        console.log(`[${this.id}] ⚖️ Decisión para ${areaId}: ${decision ? 'subdividir' : 'terminal'} (probabilidad ${probability?.toFixed(2) ?? 'n/d'})`);
        if (decision === true) { this.delegateSubdivisionToComposer({ ...(state as AreaPayload), areaId }); return; }
        if (state) { this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: areaId, value: { ...(state as AreaPayload), areaId, subdivided: false } }); }
        this.logFinalRender(areaId);
    }

    private delegateSubdivisionToComposer(payload: AreaPayload): void {
        const { areaId = this.id, purpose, context, depth = 0 } = payload;
        console.log(`[${this.id}] 🔀 Subdividiendo área ${areaId} mediante Composer (profundidad ${depth + 1})...`);
        this.pulse(MemorySignalType.SAVE, { id: `${this.id}:memory`, key: areaId, value: { ...payload, areaId, subdivided: true } });
        this.pulse(PictureSignalType.REMOVE, { elementId: `${areaId}:skeleton-pic` });
        this.pulse(ComposerSignalType.COMPOSE, buildChildComposePayload({ ...payload, areaId }, this.id));
        this.pulse(SignalType.SUBDIVIDE, { areaId, purpose, context });
    }

    private logFinalRender(areaId: string): void {
        console.log(`[${this.id}] ✅ Render final de template para área: ${areaId} (skeleton temporal preservado)`);
        this.pulse(SignalType.BUILT, { areaId, success: true });
    }

    private handleDecisionError(signal: Signal): void {
        const { value } = signal;
        const { correlationId = '' } = (value ?? {}) as { correlationId?: string };
        const [ownerId, areaId = this.id] = correlationId.split(CORRELATION_SEPARATOR);
        if (correlationId && ownerId !== this.id) { return; }
        console.warn(`[${this.id}] ⚠️ Fallback de decisión (error Jev): considerando área lista:`, value);
        this.logFinalRender(areaId);
    }

    private handleBoxCreated(signal: Signal): void {
        const { value } = signal;
        console.log(`[${this.id}] 📦 Skeleton Box montado:`, value);
    }

    private handlePictureCreated(signal: Signal): void {
        const { value } = signal;
        console.log(`[${this.id}] 🖼️ Skeleton Picture montado:`, value);
    }
}

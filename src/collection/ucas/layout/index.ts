import { Llm } from '@uca/llm';
import {
    SignalType as LlmSignalType,
    type StreamResult,
} from '@uca/llm/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    Mode as StreamTransformerMode,
    SignalType as StreamTransformerSignalType,
    type RecoveryRequest as StreamTransformerRecoveryRequest,
    type TransformResult as StreamTransformerResult,
} from '@uca/capability-stream-transformer/types';
import { Box } from '@uca/box';
import {
    SignalType as BoxSignalType,
    type CreatedResult as BoxCreatedResult,
} from '@uca/box/types';
import { Skeleton } from '@uca/capability-skeleton';
import { SignalType as SkeletonSignalType } from '@uca/capability-skeleton/types';
import { SignalType as ViewSignalType } from '@uca/view/types';
import { CSS_TOKENS_SUMMARY } from '@uca/capability-css/constants';
import { Material } from '@uca/capability-material';
import { SignalType as MaterialSignalType } from '@uca/capability-material/types';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { Zod } from '@uca/capability-zod';
import { SignalType as ZodSignalType } from '@uca/capability-zod/types';
import { signalBodySchema } from '../schema.js';
import { z } from 'zod';
import {
    __ID__,
    LAYOUT_BOX_ROLE_PROPERTIES,
    LAYOUT_GOAL,
    LAYOUT_INTENTION,
    LAYOUT_PURPOSE,
    LAYOUT_VISUAL_DISPOSITION,
    ROOT_AREA,
    ROOT_AREA_ID,
    SPATIAL_PIECES,
} from './constants.js';
import {
    areaConceptSchema,
    areaDefinedSchema,
    buildPayloadSchema,
    builtResultSchema,
    layoutCompositionSchema,
    layoutContextSchema,
    type Area,
    type AreaConcept,
    type AreaDefined,
    type Body,
    type BuildPayload,
    type ContextArea,
    type ContextBrowser,
    type ContextVisual,
    type LayoutBody,
    type LayoutContext,
    type Qualities,
    type ContainerQualities,
} from './schema.js';
import {
    DataType,
    SignalType,
    type SpatialPiece,
} from './types.js';

export class Layout extends Uca<Body> {
    public static override purpose: string = LAYOUT_PURPOSE;
    public static readonly visualDisposition = LAYOUT_VISUAL_DISPOSITION;

    public static getSpatialPieces(): readonly SpatialPiece[] {
        return SPATIAL_PIECES;
    }

    public static override disposition: Disposition<Body> = {
        aim: {
            description: LAYOUT_INTENTION,
            body: {},
        },
        reactTo: [
            ...Layout.reactToSelf(),
            ...Layout.reactToLlm(),
            ...Layout.reactToStreamTransformer(),
            ...Layout.reactToBox(),
            ...Layout.reactToView(),
            ...Layout.reactToSkeleton(),
            ...Layout.reactToZod(),
            ...Layout.reactToMaterial(),
        ],
        inputs: [
            {
                signal: SignalType.BUILD,
                type: DataType.BUILD_PAYLOAD,
                schema: buildPayloadSchema,
                description:
                    'Construct spatial layout area partitions for given context',
            },
        ],
        outputs: [
            {
                signal: SignalType.AREA_DEFINED,
                type: DataType.AREA_DEFINED,
                schema: areaDefinedSchema,
                description: 'Child area container defined and ready for cognitive evaluation',
            },
            {
                signal: SignalType.AREA_CREATED,
                type: DataType.AREA_CREATED,
                schema: areaDefinedSchema,
                description: 'Child area container mounted and ready for cognitive evaluation',
            },
            {
                signal: SignalType.BUILT,
                type: DataType.BUILT_RESULT,
                schema: builtResultSchema,
                description: 'Emitted when layout area partition structure is completed',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Emitted when layout building fails',
            },
        ],
    };

    private static reactToSelf(): string[] {
        return [
            SignalType.BUILD,
        ];
    }

    private static reactToLlm(): string[] {
        return [
            LlmSignalType.STREAMING,
            LlmSignalType.STREAMED,
            LlmSignalType.STREAM_END,
            LlmSignalType.ERROR,
            ...Llm.disposition.reactTo ?? [],
        ];
    }

    private static reactToStreamTransformer(): string[] {
        return [
            StreamTransformerSignalType.TRANSFORMED,
            StreamTransformerSignalType.RECOVER,
            StreamTransformerSignalType.ERROR,
            ...StreamTransformer.disposition.reactTo ?? [],
        ];
    }

    private static reactToBox(): string[] {
        return [
            BoxSignalType.CREATED,
            BoxSignalType.ERROR,
            ...Box.disposition.reactTo ?? [],
        ];
    }

    private static reactToView(): string[] {
        return [
            ViewSignalType.CREATED,
        ];
    }

    private static reactToSkeleton(): string[] {
        return [
            SkeletonSignalType.SHOWN,
            SkeletonSignalType.REMOVED,
            SkeletonSignalType.ERROR,
            ...Skeleton.disposition.reactTo ?? [],
        ];
    }

    private static reactToZod(): string[] {
        return [
            ZodSignalType.VALIDATE,
            ZodSignalType.VALIDATED,
            ZodSignalType.DESCRIBE,
            ZodSignalType.DESCRIBED,
            ZodSignalType.ERROR,
            ...Zod.disposition.reactTo ?? [],
        ];
    }

    private static reactToMaterial(): string[] {
        return [
            MaterialSignalType.APPLIED,
            ...Material.disposition.reactTo ?? [],
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [
                Llm,
                {
                    aim: {
                        description: Llm.purpose,
                        body: {
                            id: `${id}:llm`,
                        },
                    },
                    reactTo: [
                        ...Llm.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                StreamTransformer,
                {
                    aim: {
                        description: StreamTransformer.AIM,
                        body: {
                            id: `${id}:stream-transformer`,
                        },
                    },
                    reactTo: [
                        ...StreamTransformer.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                Box,
                {
                    aim: {
                        description: Box.purpose,
                        body: {
                            id: `${id}:box`,
                        },
                    },
                    reactTo: [
                        ...Box.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                Skeleton,
                {
                    aim: {
                        description: Skeleton.AIM,
                        body: {
                            id: `${id}:skeleton`,
                        },
                    },
                    reactTo: [
                        ...Skeleton.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                Zod,
                {
                    aim: {
                        description: Zod.AIM,
                        body: {
                            id: `${id}:zod`,
                        },
                    },
                    reactTo: [
                        ...Zod.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                Material,
                {
                    aim: {
                        description: Material.AIM,
                        body: {
                            id: `${id}:material`,
                        },
                    },
                    reactTo: [
                        ...Material.disposition.reactTo ?? [],
                    ],
                },
            ],
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.BUILD:
                this.handleBuild(signal);
                break;
            case LlmSignalType.STREAMING:
                this.handleLlmStreaming(signal);
                break;
            case LlmSignalType.STREAMED:
                this.handleLlmStreamed(signal);
                break;
            case LlmSignalType.STREAM_END:
                this.handleLlmStreamEnd(signal);
                break;
            case LlmSignalType.ERROR:
                this.handleLlmError(signal);
                break;
            case StreamTransformerSignalType.TRANSFORMED:
                void this.handleStreamTransformerTransformed(signal);
                break;
            case StreamTransformerSignalType.RECOVER:
                this.handleStreamTransformerRecover(signal);
                break;
            case StreamTransformerSignalType.ERROR:
                this.handleStreamTransformerError(signal);
                break;
            case BoxSignalType.CREATED:
                this.handleBoxCreated(signal);
                break;
            case ViewSignalType.CREATED:
                this.handleViewCreated(signal);
                break;
            case MaterialSignalType.APPLIED:
                this.handleMaterialApplied(signal);
                break;
        }
    }

    private resolveGoal(areaId?: string, parentId?: string): string {
        const target = areaId ?? ROOT_AREA_ID;
        if (target !== 'root' && target !== 'app' && target !== 'body') {
            return `Partition container '${target}' into immediate child areas. Infer purpose, intention, dimensions (width, height, flex) and visual ({ intention, disposicion }) from context. Declare direction/division, spacing, outline, marginBlock, surface and gap within visual.disposicion. Keep purpose, intention and visual.intention strictly under 8 words each.`;
        }
        return LAYOUT_GOAL;
    }

    private extractDesignContext(): Record<string, unknown> {
        const {
            aim,
        } = this.disposition;
        const body = (aim.body ?? {}) as LayoutBody;
        return (body.design ?? {}) as Record<string, unknown>;
    }

    private resolveAreaDimensions(area?: Area, body?: LayoutBody): Record<string, unknown> {
        const {
            areaContainerDimensions,
        } = (body ?? {}) as { areaContainerDimensions?: Record<string, unknown> };
        const dimensions = area?.dimensions ?? areaContainerDimensions ?? ROOT_AREA.dimensions;
        return dimensions as Record<string, unknown>;
    }

    private buildContextArea(body?: LayoutBody): ContextArea {
        const {
            area,
        } = body ?? {};
        const design = (body?.design ?? this.extractDesignContext()) as Record<string, unknown>;
        return {
            containerId: area?.id ?? ROOT_AREA_ID,
            description: 'Contenedor anfitrión a particionar en áreas hijas directas',
            design,
            dimensions: this.resolveAreaDimensions(area, body),
        };
    }

    private resolveContextLimits(body?: LayoutBody, limits: Record<string, unknown> = {}): Record<string, unknown> {
        const rawLimits = (body?.limits ?? {}) as Record<string, unknown>;
        return {
            description: 'Restricciones dimensionales: contención estricta al 100% del viewport sin scroll global',
            ...rawLimits,
            ...limits,
        };
    }

    private static createMaterialGridPiece(): SpatialPiece {
        return {
            category: 'grid-archetypes',
            description: 'M3 adaptive: balance gravitatorio (primary flex: fill), contención 100dvh',
            name: 'MaterialGrid',
        };
    }

    private static getVisualPieces(): readonly SpatialPiece[] {
        return [
            ...Layout.getSpatialPieces(),
            Layout.createMaterialGridPiece(),
        ];
    }

    private static buildVisualLanguage(): Record<string, unknown> {
        return {
            summary: CSS_TOKENS_SUMMARY,
        };
    }

    private static buildVisualContext(): ContextVisual {
        return {
            description: 'Capacidades visuales, tokens ontológicos y roles de Box para instanciar áreas',
            disposicion: Layout.visualDisposition,
            role: LAYOUT_BOX_ROLE_PROPERTIES,
            language: Layout.buildVisualLanguage(),
            pieces: Layout.getVisualPieces() as SpatialPiece[],
        };
    }

    private resolveContextBrowser(body?: LayoutBody): ContextBrowser {
        const rawBrowser = (body?.browser ?? {}) as Record<string, unknown>;
        const viewport = (rawBrowser.viewport ?? { width: 1024, height: 768 }) as { width: number; height: number };
        const device = (rawBrowser.device ?? (viewport.width < 768 ? 'mobile' : 'desktop')) as string;
        return {
            description: `Viewport de ${viewport.width}x${viewport.height}px (${device}). Contener áreas dentro de 100dvh`,
            device,
            viewport,
        };
    }

    private buildInferContext(body?: LayoutBody, limits: Record<string, unknown> = {}, goal = ''): LayoutContext {
        return {
            area: this.buildContextArea(body),
            browser: this.resolveContextBrowser(body),
            limits: this.resolveContextLimits(body, limits),
            visual: Layout.buildVisualContext(),
            goal,
            id: this.id,
        };
    }

    private buildInferMeta(goal: string, sessionId?: string): Record<string, unknown> {
        return {
            goal,
            sessionId,
            streamId: `${sessionId}:layout`,
        };
    }

    private resolveTargetGoal(body?: LayoutBody): string {
        const {
            area,
        } = body ?? {};
        const {
            id,
            parentId,
        } = area ?? {};
        return this.resolveGoal(id, parentId);
    }

    private formatInferRequest(intention: string, context: LayoutContext, meta: Record<string, unknown>): Record<string, unknown> {
        return {
            id: 'layout',
            intention,
            purpose: this.purpose,
            outputSchema: Zod.toJsonSchema(layoutCompositionSchema),
            context,
            ...meta,
        };
    }

    private createInferRequest(payload: BuildPayload, sessionId: string): Record<string, unknown> {
        const {
            aim,
        } = payload;
        const limits = (payload as { limits?: Record<string, unknown> }).limits ?? {};
        const goal = this.resolveTargetGoal(aim.body);
        const contextData = this.buildInferContext(aim.body, limits, goal);
        const meta = this.buildInferMeta(goal, sessionId);
        return this.formatInferRequest(aim.description, contextData, meta);
    }

    private logInferRequest(request: Record<string, unknown>, sessionId: string): void {
        const {
            context,
        } = request;
        const target = (context as LayoutContext)?.area?.containerId ?? ROOT_AREA_ID;
        console.log(`🧠 [LAYOUT::INFER_REQUEST] #${target} [${sessionId}]:`, request);
    }

    private dispatchLlmInfer(payload: BuildPayload, sessionId: string): void {
        const inferRequest = this.createInferRequest(payload, sessionId);
        signalBodySchema.parse(inferRequest);
        this.logInferRequest(inferRequest, sessionId);
        this.pulse(LlmSignalType.INFER, inferRequest, undefined, sessionId);
    }

    private extractTargetAreaId(payload: BuildPayload): string {
        const body = payload?.aim?.body;
        return (body?.area as Area)?.id ?? 'body';
    }

    private handleBuild(signal: Signal): void {
        const {
            sessionId = crypto.randomUUID(),
            value,
        } = signal;
        const payload = value as BuildPayload;
        this.showAreaSkeleton(this.extractTargetAreaId(payload));
        this.dispatchLlmInfer(payload, sessionId);
    }

    private normalizeParentId(parentId?: string): string | undefined {
        if (!parentId || parentId === 'none' || parentId === 'app' || parentId === 'body' || parentId === 'root') {
            return undefined;
        }
        return parentId;
    }

    private resolveAreaId(id: string, currentAreaId?: string): string {
        if (!currentAreaId || currentAreaId === 'root' || currentAreaId === 'app' || currentAreaId === 'body' || id.startsWith(`${currentAreaId}-`)) {
            return id;
        }
        return `${currentAreaId}-${id}`;
    }

    private resolveParentId(_parentId?: string, currentAreaId?: string): string {
        return currentAreaId ?? ROOT_AREA_ID;
    }

    private resolveAreaIdentity(id: string, parentId?: string, currentAreaId?: string): { id: string; parentId?: string } {
        return {
            id: this.resolveAreaId(id, currentAreaId),
            parentId: this.resolveParentId(parentId, currentAreaId),
        };
    }

    private resolveAreaQualities(concept: AreaConcept): Qualities {
        const {
            visual,
        } = concept;
        return visual?.disposicion as Qualities;
    }

    private resolveContainerQualities(currentAreaId?: string, context?: Record<string, unknown>): ContainerQualities {
        const parentArea = (context?.area ?? {}) as Area;
        return {
            id: currentAreaId ?? ROOT_AREA_ID,
            qualities: parentArea.qualities ?? { direction: 'column' },
        };
    }

    private formatAssembledArea(base: { id: string; parentId?: string; container: ContainerQualities }, concept: AreaConcept): Area {
        const {
            purpose,
            intention,
            dimensions = {},
            visual,
        } = concept;
        const qualities = this.resolveAreaQualities(concept);
        return {
            ...base,
            purpose,
            intention,
            dimensions,
            visual,
            qualities,
        } as Area;
    }

    private assembleArea(base: { id: string; parentId?: string; container: ContainerQualities }, concept: AreaConcept): Area {
        return this.formatAssembledArea(base, concept);
    }

    private buildAreaFromConcept(concept: AreaConcept, currentAreaId?: string, context?: Record<string, unknown>): Area {
        const identity = this.resolveAreaIdentity(concept.id, concept.parentId, currentAreaId);
        const container = this.resolveContainerQualities(currentAreaId, context);
        return this.assembleArea({
            ...identity,
            container,
        }, concept);
    }

    private isContainerSelf(id: string, currentAreaId?: string): boolean {
        const root = currentAreaId ?? ROOT_AREA_ID;
        return id === root || id === 'root' || id === 'app' || id === 'body';
    }

    private handleContainerSelfConcept(qualities?: Qualities, currentAreaId?: string): void {
        if (qualities) {
            const targetId = this.resolveTargetContainerId(currentAreaId ?? ROOT_AREA_ID);
            this.dispatchContainerQualities(targetId, qualities);
        }
    }

    private isDirectChild(parentId: string | undefined, currentAreaId?: string): boolean {
        const target = currentAreaId ?? ROOT_AREA_ID;
        if (!parentId || parentId === 'none' || parentId === target) {
            return true;
        }
        if (target === ROOT_AREA_ID) {
            return parentId === 'root' || parentId === 'app' || parentId === 'body';
        }
        return parentId === target;
    }

    private shouldSkipConcept(concept: AreaConcept, currentAreaId?: string): boolean {
        if (this.isContainerSelf(concept.id, currentAreaId)) {
            const qualities = this.resolveAreaQualities(concept);
            this.handleContainerSelfConcept(qualities, currentAreaId);
            return true;
        }
        return !this.isDirectChild(concept.parentId, currentAreaId);
    }

    private resolveTargetContainerId(currentAreaId: string): string {
        if (currentAreaId === ROOT_AREA_ID || currentAreaId === 'app' || currentAreaId === 'body' || currentAreaId === 'root') {
            const {
                containerElement = 'body',
            } = this.disposition.aim.body ?? {};
            return containerElement.replace('#', '');
        }
        return currentAreaId;
    }

    private dispatchContainerQualities(
        elementId: string,
        qualities: Qualities,
    ): void {
        this.pulse(BoxSignalType.UPDATE, {
            elementId,
            qualities,
        });
    }

    private ensureRootContainerLayout(areaId?: string): void {
        if (!areaId || areaId === ROOT_AREA_ID || areaId === 'app' || areaId === 'body' || areaId === 'root') {
            this.dispatchContainerQualities('body', {
                direction: 'column',
                height: '100%',
                width: '100%',
            });
        }
    }

    private handleLlmStreaming(_signal: Signal): void { }

    private extractRequestContextAreaId(request?: { context?: unknown }): string {
        const {
            context,
        } = request ?? {};
        const {
            area,
        } = (context as LayoutContext) ?? {};
        return area?.containerId ?? ROOT_AREA_ID;
    }

    private createTransformContext(areaId: string): Record<string, unknown> {
        return {
            areaId,
        };
    }

    private formatTransformPayload(sessionId: string | undefined, stream: ReadableStream<string>, areaId: string): Record<string, unknown> {
        return {
            sessionId,
            stream,
            schema: areaConceptSchema,
            mode: StreamTransformerMode.ITEMS,
            context: this.createTransformContext(areaId),
        };
    }

    private buildTransformPayload(result: StreamResult): Record<string, unknown> {
        const {
            sessionId,
            stream,
            request,
        } = result;
        const areaId = this.extractRequestContextAreaId(request);
        return this.formatTransformPayload(sessionId, stream, areaId);
    }

    private handleLlmStreamed(signal: Signal): void {
        const result = signal.value as StreamResult;
        this.pulse(StreamTransformerSignalType.TRANSFORM, this.buildTransformPayload(result));
    }

    private handleLlmStreamEnd(_signal: Signal): void { }

    private extractTransformedPayload(signal: Signal): StreamTransformerResult {
        const {
            value,
        } = signal;
        return (value ?? {}) as StreamTransformerResult;
    }

    private async handleStreamTransformerTransformed(signal: Signal): Promise<void> {
        const {
            context,
            sessionId,
            stream,
        } = this.extractTransformedPayload(signal);
        if (stream) {
            await this.pipeTransformedStream(stream, context as Record<string, unknown> | undefined, sessionId);
        }
    }

    private async pipeTransformedStream(stream: ReadableStream<Record<string, unknown>>, context?: Record<string, unknown>, sessionId?: string): Promise<void> {
        try {
            const transform = this.createAreaTransformStream(context, sessionId);
            await this.consumeTransformedStream(stream.pipeThrough(transform));
        } catch (error) {
            this.pulse(SignalType.ERROR, error, undefined, sessionId);
        }
    }

    private async consumeTransformedStream(stream: ReadableStream<Area>): Promise<void> {
        const reader = stream.getReader();
        while (!(await reader.read()).done) { }
    }

    private createAreaTransformStream(context?: Record<string, unknown>, sessionId?: string): TransformStream<Record<string, unknown>, Area> {
        const areas: Area[] = [];
        const currentAreaId = this.resolveCurrentAreaId(context);
        this.ensureRootContainerLayout(currentAreaId);
        return new TransformStream({
            transform: (item, controller) => this.enqueueTransformedArea(item, areas, controller, currentAreaId, context, sessionId),
            flush: () => this.handleStreamClose(areas, context, sessionId),
        });
    }

    private enqueueTransformedArea(
        item: Record<string, unknown>,
        areas: Area[],
        controller: TransformStreamDefaultController<Area>,
        currentAreaId: string,
        context?: Record<string, unknown>,
        sessionId?: string,
    ): void {
        const area = this.transformAreaChunk(item, currentAreaId, context);
        if (area) {
            areas.push(area);
            controller.enqueue(area);
            this.dispatchAreaBox(area, context, sessionId);
        }
    }

    private transformAreaChunk(item: Record<string, unknown>, currentAreaId: string, context?: Record<string, unknown>): Area | undefined {
        this.logStreamChunk(item, currentAreaId);
        const concept = item as unknown as AreaConcept;
        return this.shouldSkipConcept(concept, currentAreaId)
            ? undefined
            : this.buildAreaFromConcept(concept, currentAreaId, context);
    }

    private resolveCurrentAreaId(context?: Record<string, unknown>): string {
        const body = (context?.body ?? {}) as LayoutBody;
        return (context?.areaId as string) ?? body?.area?.id ?? ROOT_AREA_ID;
    }

    private logStreamChunk(item: Record<string, unknown>, currentAreaId?: string): void {
        const {
            id = 'desconocida',
        } = item as { id?: string };
        const parent = currentAreaId ?? ROOT_AREA_ID;
        console.log(`🏛️ [LAYOUT::STREAM] Área leída: #${id} (en #${parent})`, item);
    }

    private createBuiltComposition(areas: Area[]): Record<string, unknown> {
        return {
            areas,
        };
    }

    private handleStreamClose(areas: Area[], context?: Record<string, unknown>, sessionId?: string): void {
        const areaId = this.resolveCurrentAreaId(context);
        this.removeAreaSkeleton(areaId);
        this.pulse(SignalType.BUILT, {
            composition: this.createBuiltComposition(areas),
            areaId,
            sessionId,
        }, undefined, sessionId);
    }

    private handleStreamTransformerRecover(signal: Signal): void {
        const {
            requestId,
            error,
        } = (signal.value ?? {}) as StreamTransformerRecoveryRequest;
        this.pulse(StreamTransformerSignalType.REPAIR, {
            requestId,
            error,
        });
    }

    private handleStreamTransformerError(signal: Signal): void {
        this.pulse(SignalType.ERROR, signal.value);
    }

    private handleLlmError(signal: Signal): void {
        this.pulse(SignalType.ERROR, signal.value);
    }

    private showAreaSkeleton(elementId: string): void {
        this.pulse(SkeletonSignalType.SHOW, {
            elementId,
        });
    }

    private removeAreaSkeleton(elementId: string): void {
        this.pulse(SkeletonSignalType.REMOVE, {
            elementId,
        });
    }

    private resolveAreaContainer(parentId?: string): string {
        const clean = parentId?.replace('#', '');
        if (!clean || clean === 'root' || clean === 'app' || clean === 'body') {
            return 'body';
        }
        return `#${clean}`;
    }

    private resolveBoxQualities(area: Area): Qualities {
        const {
            visual,
            dimensions,
            parentId,
        } = area;
        return this.mergeAreaQualities(dimensions, visual?.disposicion, parentId);
    }

    private mergeAreaQualities(dimensions?: Qualities, disposicion?: Qualities, parentId?: string): Qualities {
        const gap = disposicion?.gap ?? (disposicion?.division ? 'medium' : undefined);
        return {
            ...dimensions,
            ...disposicion,
            ...(!dimensions?.height && dimensions?.flex === 'fill' && { height: 'full' }),
            ...(gap && { gap }),
            ...((!parentId || parentId === ROOT_AREA_ID || parentId === 'body') && { marginBlock: 'none' }),
        };
    }

    private createBoxPayload(area: Area, target: string, context?: unknown): Record<string, unknown> {
        return {
            elementId: area.id,
            parentTo: target.replace('#', ''),
            containerElement: target,
            qualities: this.resolveBoxQualities(area),
            context,
        };
    }

    private dispatchAreaBox(area: Area, context?: Record<string, unknown>, sessionId?: string): void {
        const target = this.resolveAreaContainer(area.parentId);
        const boxContext = {
            area,
            context,
            sessionId,
        };
        this.pulse(BoxSignalType.RENDER, this.createBoxPayload(area, target, boxContext), undefined, sessionId);
    }

    private clearParentSkeleton(area?: Area): void {
        const rawParent = area?.parentId?.replace('#', '');
        const parentId = !rawParent || rawParent === 'root' || rawParent === 'app' || rawParent === 'body'
            ? 'body'
            : rawParent;
        this.removeAreaSkeleton(parentId);
    }

    private handleBoxCreated(signal: Signal): void {
        const {
            elementId = '',
            context: rawContext,
        } = (signal.value ?? {}) as BoxCreatedResult;
        const payload = (rawContext ?? {}) as AreaDefined;
        this.clearParentSkeleton(payload.area);
        this.showAreaSkeleton(elementId);
        this.pulse(SignalType.AREA_CREATED, payload);
    }

    private handleViewCreated(signal: Signal): void {
        const {
            areaId = 'body',
        } = (signal.value ?? {}) as { areaId?: string; sessionId?: string };
        this.removeAreaSkeleton(areaId);
    }

    private handleMaterialApplied(_signal: Signal): void {
    }
}

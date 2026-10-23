import { Llm } from '@uca/llm';
import {
    SignalType as LlmSignalType,
    type InferPayload,
    type InferResult,
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
import { Css } from '@uca/capability-css';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { z } from 'zod';
import {
    __ID__,
    DEFAULT_IMAGINATION,
    DEFAULT_LIMIT,
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
    type Area,
    type AreaConcept,
    type AreaDefined,
    type Body,
    type BuildPayload,
    type BuiltResult,
    type LayoutBody,
    type Qualities,
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
            LlmSignalType.INFERRED,
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
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        switch (property) {
            case SignalType.BUILD:
                this.handleBuild(value as BuildPayload);
                break;
            case LlmSignalType.INFERRED:
                this.handleLlmInferred(signal);
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
        }
    }

    private resolveGoal(areaId?: string, parentId?: string): string {
        const target = areaId ?? ROOT_AREA_ID;
        if (target !== 'root' && target !== 'app' && target !== 'body') {
            return `Partition container '${target}' into immediate child areas. Infer every spatial quality from purpose and context: each structural area must declare direction or division for its own children; grant each child area its own delimited breathing space via perimeter padding (spacing), boundaries (outline), perimeter margin (marginBlock), and surface; declare gap to separate multiple sibling areas. Flex sizes an area within its parent and never replaces its child-flow declaration.`;
        }
        return LAYOUT_GOAL;
    }

    private extractAreaContext(body?: LayoutBody): Record<string, unknown> {
        const {
            area = ROOT_AREA as unknown as Area,
            browser,
        } = body ?? {};
        return {
            area,
            browser,
        };
    }

    private extractDispositionContext(): Record<string, unknown> {
        const { aim } = this.disposition;
        const { structural, spatial, design } = (aim.body ?? {}) as Record<string, unknown>;
        return { structural, spatial, design };
    }

    private mergeContextDispositions(body?: LayoutBody): Record<string, unknown> {
        const { structural, spatial, design } = this.extractDispositionContext();
        return {
            structural: body?.structural ?? structural,
            spatial: body?.spatial ?? spatial,
            design: body?.design ?? design,
        };
    }

    private buildInferContext(body?: LayoutBody): Record<string, unknown> {
        const { specification } = body ?? {};
        return {
            ...this.extractAreaContext(body),
            ...this.mergeContextDispositions(body),
            specification,
            boxCustomizableProperties: Box.visualDisposition,
            boxRoleProperties: LAYOUT_BOX_ROLE_PROPERTIES,
            spatialPieces: Layout.getSpatialPieces(),
            visualDisposition: Layout.visualDisposition,
            visualLanguage: Css.visualLanguage(),
        };
    }

    private buildStreamMetadata(body?: LayoutBody): Record<string, unknown> {
        return {
            areaId: body?.area?.id,
            parentId: body?.area?.parentId,
            body,
        };
    }

    private buildInferMeta(
        goal: string,
        correlationId?: string,
        metadata: Record<string, unknown> = {},
        limits: Record<string, unknown> = {},
    ): Record<string, unknown> {
        return {
            metadata,
            goal,
            limits: {
                limit: DEFAULT_LIMIT,
                imagination: DEFAULT_IMAGINATION,
                ...limits,
            },
            correlationId,
            streamId: `${correlationId}:layout`,
        };
    }

    private createInferRequest(payload: BuildPayload, correlationId: string): Record<string, unknown> {
        const { aim, limits = {} } = payload;
        const { description, body } = aim;
        const contextData = this.buildInferContext(body);
        const metadata = this.buildStreamMetadata(body);
        const goal = this.resolveGoal(body?.area?.id, body?.area?.parentId);
        const meta = this.buildInferMeta(goal, correlationId, metadata, limits);
        return {
            id: 'layout',
            intention: description,
            purpose: this.purpose,
            outputSchema: z.toJSONSchema(layoutCompositionSchema) as Record<string, unknown>,
            contextSchema: { const: contextData },
            context: contextData,
            ...meta,
        };
    }

    private dispatchLlmInfer(payload: BuildPayload, correlationId: string): void {
        const inferRequest = this.createInferRequest(payload, correlationId);
        this.pulse(LlmSignalType.INFER, inferRequest);
    }

    private handleBuild(payload: BuildPayload): void {
        const {
            correlationId = crypto.randomUUID(),
        } = payload;
        this.dispatchLlmInfer(payload, correlationId);
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

    private buildAreaFromConcept(concept: AreaConcept, currentAreaId?: string, context?: Record<string, unknown>): Area {
        const {
            id,
            parentId,
            proposito,
            intencion,
            ...dispositions
        } = concept;
        const identity = this.resolveAreaIdentity(id, parentId, currentAreaId);
        const parentArea = (context?.area ?? {}) as Area;
        const container = {
            id: currentAreaId ?? ROOT_AREA_ID,
            qualities: parentArea.qualities ?? { direction: 'column' },
        };
        return {
            ...identity,
            purpose: proposito,
            intention: intencion,
            container,
            ...dispositions,
        };
    }



    private pulseAreaDefined(area: Area, context: Record<string, unknown>, correlationId: string): void {
        this.pulse(SignalType.AREA_DEFINED, {
            area,
            context,
            correlationId,
        });
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
            this.handleContainerSelfConcept(concept.qualities, currentAreaId);
            return true;
        }
        return !this.isDirectChild(concept.parentId, currentAreaId);
    }

    private emitArea(concept: AreaConcept, context: Record<string, unknown>, correlationId: string, currentAreaId?: string): void {
        this.ensureRootContainerLayout(currentAreaId);
        if (this.shouldSkipConcept(concept, currentAreaId)) {
            return;
        }
        this.dispatchNewArea(concept, context, correlationId, currentAreaId);
    }

    private dispatchNewArea(concept: AreaConcept, context: Record<string, unknown>, correlationId: string, currentAreaId?: string): void {
        const area = this.buildAreaFromConcept(concept, currentAreaId, context);
        this.pulseAreaDefined(area, context, correlationId);
        this.dispatchAreaBox(area, context, correlationId);
    }

    private resolveAreaContainer(parentId?: string): string {
        const {
            containerElement = 'body',
        } = this.disposition.aim.body ?? {};
        const fallback = containerElement.startsWith('#') ? containerElement : containerElement === 'body' ? 'body' : `#${containerElement}`;
        if (!parentId || parentId === 'app' || parentId === 'body' || parentId === 'root') {
            return fallback;
        }
        const hasParent = typeof document !== 'undefined' && parentId && document.getElementById(parentId);
        return hasParent ? `#${parentId}` : fallback;
    }

    private createBoxPayload(area: Area, target: string, context: unknown): Record<string, unknown> {
        return {
            elementId: area.id,
            parentTo: target.replace('#', ''),
            containerElement: target,
            qualities: area.qualities,
            context,
        };
    }

    private dispatchAreaBox(area: Area, context: Record<string, unknown>, correlationId: string): void {
        const target = this.resolveAreaContainer(area.parentId);
        const boxContext = {
            area,
            context,
            correlationId,
        };
        this.pulse(BoxSignalType.RENDER, this.createBoxPayload(area, target, boxContext));
    }

    private extractAreaList(composition: unknown): AreaConcept[] {
        const comp = (composition ?? {}) as Record<string, unknown>;
        return (comp.areas ?? (Array.isArray(composition) ? composition : [])) as AreaConcept[];
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

    private emitCompositionAreas(result: BuiltResult, areaId: string): void {
        const {
            composition,
            context = {},
            correlationId = crypto.randomUUID(),
        } = result;
        const areas = this.extractAreaList(composition);
        areas.forEach((concept) => this.emitArea(concept, context, correlationId, areaId));
    }

    private resolveCurrentAreaId(context?: Record<string, unknown>): string {
        const {
            areaId = ROOT_AREA_ID,
        } = (context ?? {}) as { areaId?: string };
        return areaId;
    }

    private handleLayoutInferred(result: BuiltResult): void {
        const areaId = this.resolveCurrentAreaId(result.context);
        this.emitCompositionAreas(result, areaId);
        this.removeAreaSkeleton(areaId);
        this.pulse(SignalType.BUILT, result);
    }

    private extractInferredResult(value: unknown): BuiltResult {
        const raw = (value ?? {}) as InferResult;
        const {
            data,
            response,
            correlationId,
            request,
        } = raw;
        const composition = data ?? response;
        const context = (request?.context ?? request?.metadata ?? {}) as Record<string, unknown>;
        return {
            composition,
            context,
            correlationId,
        };
    }

    private handleLlmInferred(signal: Signal): void {
        const {
            value,
        } = signal;
        const result: BuiltResult = this.extractInferredResult(value);
        this.handleLayoutInferred(result);
    }

    private handleLlmStreaming(_signal: Signal): void {}

    private buildTransformPayload(result: StreamResult): Record<string, unknown> {
        const {
            correlationId,
            stream,
            request,
        } = result;
        const meta = (request?.metadata ?? {}) as Record<string, unknown>;
        return {
            correlationId,
            stream,
            schema: areaConceptSchema,
            mode: StreamTransformerMode.ITEMS,
            context: {
                ...meta,
                request,
            },
        };
    }

    private handleLlmStreamed(signal: Signal): void {
        const result = signal.value as StreamResult;
        this.pulse(StreamTransformerSignalType.TRANSFORM, this.buildTransformPayload(result));
    }

    private handleLlmStreamEnd(_signal: Signal): void {}

    private extractTransformedPayload(signal: Signal): StreamTransformerResult {
        const {
            value,
        } = signal;
        return (value ?? {}) as StreamTransformerResult;
    }

    private async handleStreamTransformerTransformed(signal: Signal): Promise<void> {
        const {
            stream,
            context,
            correlationId,
        } = this.extractTransformedPayload(signal);
        if (stream) {
            await stream.pipeTo(this.createStreamConsumer(context as Record<string, unknown> | undefined, correlationId));
        }
    }

    private createStreamConsumer(
        context?: Record<string, unknown>,
        correlationId?: string,
    ): WritableStream<Record<string, unknown>> {
        const areas: Record<string, unknown>[] = [];
        return new WritableStream({
            write: (item) => {
                areas.push(item);
                this.handleStreamChunk(item, context, correlationId);
            },
            close: () => this.handleStreamClose(areas, context, correlationId),
        });
    }

    private handleStreamClose(
        areas: Record<string, unknown>[],
        context?: Record<string, unknown>,
        correlationId?: string,
    ): void {
        const areaId = (context?.areaId as string) ?? ROOT_AREA_ID;
        this.removeAreaSkeleton(areaId);
        this.pulse(SignalType.BUILT, {
            composition: { areas },
            areaId,
            correlationId,
        });
    }

    private handleStreamChunk(
        item: Record<string, unknown>,
        context?: Record<string, unknown>,
        correlationId?: string,
    ): void {
        const cid = correlationId ?? crypto.randomUUID();
        const body = (context?.body ?? {}) as LayoutBody;
        const inherited = (body ?? {}) as Record<string, unknown>;
        const currentAreaId = (context?.areaId as string) ?? body?.area?.id;
        this.emitArea(item as unknown as AreaConcept, inherited, cid, currentAreaId);
    }

    private handleStreamTransformerRecover(signal: Signal): void {
        const recovery = signal.value as StreamTransformerRecoveryRequest;
        const {
            requestId,
            error,
        } = recovery;
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

    private clearParentSkeleton(area?: Area): void {
        const parentId = area?.parentId ?? ROOT_AREA_ID;
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
        } = (signal.value ?? {}) as { areaId?: string; correlationId?: string };
        this.removeAreaSkeleton(areaId);
    }
}

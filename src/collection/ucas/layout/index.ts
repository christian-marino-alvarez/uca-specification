import { Llm } from '@uca/llm';
import {
    SignalType as LlmSignalType,
    type InferPayload,
    type InferResult,
    type StreamResult,
} from '@uca/llm/types';
import { Render } from '@uca/render';
import { SignalType as RenderSignalType } from '@uca/render/types';
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
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    ICapability,
    Signal,
} from '@uca/core/types';
import { z } from 'zod';
import {
    __ID__,
    DEFAULT_IMAGINATION,
    DEFAULT_LIMIT,
    LAYOUT_GOAL,
    LAYOUT_INTENTION,
    LAYOUT_PURPOSE,
    ROOT_AREA_ID,
} from './constants.js';
import {
    areaConceptSchema,
    buildPayloadSchema,
    builtResultSchema,
    layoutCompositionSchema,
    type Area,
    type AreaConcept,
    type AreaDefined,
    type Body,
    type BuildPayload,
    type BuiltResult,
    type LayoutComposition,
} from './schema.js';
import {
    DataType,
    SignalType,
    type VisualPrimitive,
} from './types.js';

export class Layout extends Uca<Body> {
    public static override purpose: string = LAYOUT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: LAYOUT_INTENTION,
            body: {},
        },
        reactTo: [
            ...Layout.reactToSelf(),
            ...Layout.reactToLlm(),
            ...Layout.reactToRender(),
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
                description: 'Child area container defined and ready for cognitive evaluation',
            },
            {
                signal: SignalType.AREA_CREATED,
                type: DataType.AREA_CREATED,
                description: 'Child area container mounted and ready for cognitive evaluation',
            },
            {
                signal: SignalType.BUILT,
                type: DataType.BUILT_RESULT,
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

    private static reactToRender(): string[] {
        return [
            RenderSignalType.ERROR,
            ...Render.disposition.reactTo ?? [],
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
                Render,
                {
                    aim: {
                        description: Render.purpose,
                        body: {
                            id: `${id}:render`,
                        },
                    },
                    reactTo: [
                        ...Render.disposition.reactTo ?? [],
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
            case RenderSignalType.ERROR:
                this.handleRenderError(signal);
                break;
            case BoxSignalType.CREATED:
                this.handleBoxCreated(signal);
                break;
            case ViewSignalType.CREATED:
                this.handleViewCreated(signal);
                break;
        }
    }

    private extractPrimitiveInfo(capability: ICapability): VisualPrimitive {
        const {
            id,
            disposition,
        } = capability;
        const {
            aim,
        } = disposition;
        const {
            description,
        } = aim;
        const name = id.split(':').pop() ?? id;
        const purpose = (capability as Uca).purpose ?? description;
        return {
            name,
            proposito: purpose,
            intencion: description,
        };
    }

    private isVisualUca(capability: ICapability): boolean {
        const isUca = (capability as Uca).purpose !== undefined;
        const isNotCss = !capability.id.endsWith(':css');
        return isUca && isNotCss;
    }

    private getVisualPrimitives(): VisualPrimitive[] {
        const {
            id,
        } = this;
        const render = this.getCapability(`${id}:render`) as Uca | undefined;
        const list = render?.registry ? [...render.registry.values()] : [];
        return list
            .filter((cap) => this.isVisualUca(cap))
            .map((cap) => this.extractPrimitiveInfo(cap));
    }

    private resolveGoal(areaId?: string, parentId?: string): string {
        if (areaId && areaId !== 'root' && areaId !== 'app') {
            return `Generate layout sub-area partitions for area '${areaId}' (parent: '${parentId ?? 'root'}')`;
        }
        return LAYOUT_GOAL;
    }

    private buildInferContext(payload: BuildPayload): Record<string, unknown> {
        const {
            areaId,
            parentId,
            context = {},
        } = payload;
        return {
            ...context,
            areaId,
            parentId,
            visualPrimitives: this.getVisualPrimitives(),
        };
    }

    private createInferRequest(payload: BuildPayload, correlationId: string): Record<string, unknown> {
        const { areaId, parentId, context = {} } = payload;
        const intention = (context.visualIntention as string) ?? (context.intention as string) ?? LAYOUT_INTENTION;
        return {
            id: 'layout',
            intention,
            purpose: this.purpose,
            outputSchema: z.toJSONSchema(layoutCompositionSchema) as Record<string, unknown>,
            context: this.buildInferContext(payload),
            metadata: { areaId, parentId },
            goal: this.resolveGoal(areaId, parentId),
            limits: { limit: DEFAULT_LIMIT, imagination: DEFAULT_IMAGINATION },
            correlationId,
            streamId: `${correlationId}:layout`,
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
        if (!parentId || parentId === 'none' || parentId === 'app') {
            return undefined;
        }
        return parentId;
    }

    private resolveAreaId(id: string, currentAreaId?: string): string {
        if (!currentAreaId || currentAreaId === 'root' || currentAreaId === 'app' || id.startsWith(`${currentAreaId}-`)) {
            return id;
        }
        return `${currentAreaId}-${id}`;
    }

    private resolveParentId(parentId?: string, currentAreaId?: string): string | undefined {
        if (currentAreaId && currentAreaId !== 'app') {
            return currentAreaId;
        }
        return this.normalizeParentId(parentId);
    }

    private resolveAreaIdentity(id: string, parentId?: string, currentAreaId?: string): { id: string; parentId?: string } {
        return {
            id: this.resolveAreaId(id, currentAreaId),
            parentId: this.resolveParentId(parentId, currentAreaId),
        };
    }

    private buildAreaFromConcept(concept: AreaConcept, currentAreaId?: string): Area {
        const {
            id,
            parentId,
            proposito,
            intencion,
            ...dispositions
        } = concept;
        const identity = this.resolveAreaIdentity(id, parentId, currentAreaId);
        return {
            ...identity,
            purpose: proposito,
            intention: intencion,
            ...dispositions,
        };
    }

    private logArea(area: Area, correlationId: string, context: Record<string, unknown>): void {
        const title = `%c🏛️ [LAYOUT::AREA_DEFINED] %c${area.id}%c (parent: ${area.parentId ?? 'root'})`;
        console.log(title, 'color: #00B4D8; font-weight: bold;', 'color: #10B981; font-weight: bold;', 'color: #888;', {
            area,
            correlationId,
            context,
        });
    }

    private emitArea(concept: AreaConcept, context: Record<string, unknown>, correlationId: string, currentAreaId?: string): void {
        const area = this.buildAreaFromConcept(concept, currentAreaId);
        this.logArea(area, correlationId, context);
        this.pulse(SignalType.AREA_DEFINED, {
            area,
            context,
            correlationId,
        });
        this.dispatchAreaBox(area, context, correlationId);
    }

    private resolveAreaContainer(parentId?: string): string {
        const {
            containerElement = '#app',
        } = this.disposition.aim.body ?? {};
        const fallback = containerElement.startsWith('#') ? containerElement : `#${containerElement}`;
        if (!parentId || parentId === 'app') {
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

    private handleLayoutInferred(result: BuiltResult): void {
        const {
            composition,
            context = {},
            correlationId = crypto.randomUUID(),
        } = result;
        const currentAreaId = (context as { areaId?: string })?.areaId;
        this.extractAreaList(composition).forEach((concept) => this.emitArea(concept, context, correlationId, currentAreaId));
        this.removeAreaSkeleton(currentAreaId ?? ROOT_AREA_ID);
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

    private handleLlmStreaming(signal: Signal): void {
        const {
            correlationId,
            model,
        } = (signal.value ?? {}) as { correlationId?: string; model?: string };
        console.log('[LAYOUT::STREAM::START]', { correlationId, model });
    }

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

    private handleLlmStreamEnd(signal: Signal): void {
        const {
            correlationId,
            model,
        } = (signal.value ?? {}) as { correlationId?: string; model?: string };
        console.log('[LAYOUT::STREAM::END]', { correlationId, model });
    }

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
            await stream.pipeTo(this.createStreamConsumer(context as BuildPayload | undefined, correlationId));
        }
    }

    private createStreamConsumer(
        context?: BuildPayload,
        correlationId?: string,
    ): WritableStream<Record<string, unknown>> {
        return new WritableStream({
            write: (item) => this.handleStreamChunk(item, context, correlationId),
            close: () => this.handleStreamClose(context, correlationId),
        });
    }

    private handleStreamClose(context?: BuildPayload, correlationId?: string): void {
        const areaId = context?.areaId ?? ROOT_AREA_ID;
        this.removeAreaSkeleton(areaId);
        this.pulse(SignalType.BUILT, {
            context,
            correlationId,
        });
    }

    private handleStreamChunk(
        item: Record<string, unknown>,
        context?: BuildPayload,
        correlationId?: string,
    ): void {
        this.logStreamChunk(item, context, correlationId);
        const cid = correlationId ?? crypto.randomUUID();
        const inherited = (context?.context ?? {}) as Record<string, unknown>;
        this.emitArea(item as unknown as AreaConcept, inherited, cid, context?.areaId);
    }

    private logStreamChunk(
        item: Record<string, unknown>,
        context?: BuildPayload,
        correlationId?: string,
    ): void {
        console.log('%c🌊 [LAYOUT::STREAM::CHUNK]', 'color: #00B4D8; font-weight: bold;', {
            correlationId,
            item,
        });
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

    private handleRenderError(signal: Signal): void {
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

    private logAreaCreated(elementId: string, correlationId?: string): void {
        console.log(`%c📦 [LAYOUT::AREA_CREATED] %c${elementId}%c Contenedor montado en DOM`, 'color: #00B4D8; font-weight: bold;', 'color: #10B981; font-weight: bold;', 'color: #888;', {
            elementId,
            correlationId,
        });
    }

    private logViewCreated(areaId: string, correlationId?: string): void {
        console.log(`%c👁️ [LAYOUT::VIEW_CREATED] %c${areaId}%c Vista completada`, 'color: #00B4D8; font-weight: bold;', 'color: #F6E05E; font-weight: bold;', 'color: #888;', {
            areaId,
            correlationId,
        });
    }

    private handleBoxCreated(signal: Signal): void {
        const {
            elementId = '',
            context: rawContext,
        } = (signal.value ?? {}) as BoxCreatedResult;
        const payload = (rawContext ?? {}) as AreaDefined;
        this.showAreaSkeleton(elementId);
        this.logAreaCreated(elementId, payload.correlationId);
        this.pulse(SignalType.AREA_CREATED, payload);
    }

    private handleViewCreated(signal: Signal): void {
        const {
            areaId = 'root',
            correlationId,
        } = (signal.value ?? {}) as { areaId?: string; correlationId?: string };
        this.removeAreaSkeleton(areaId);
        this.logViewCreated(areaId, correlationId);
    }
}

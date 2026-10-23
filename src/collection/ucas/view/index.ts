import { Llm } from '@uca/llm';
import {
    SignalType as LlmSignalType,
    type InferResult,
    type StreamResult,
} from '@uca/llm/types';
import { Render } from '@uca/render';
import { SignalType as RenderSignalType } from '@uca/render/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import { Css } from '@uca/capability-css';
import {
    Mode as StreamTransformerMode,
    SignalType as StreamTransformerSignalType,
    type RecoveryRequest as StreamTransformerRecoveryRequest,
    type TransformResult as StreamTransformerResult,
} from '@uca/capability-stream-transformer/types';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { Zod } from '@uca/capability-zod';
import { SignalType as ZodSignalType } from '@uca/capability-zod/types';
import { Skeleton } from '@uca/capability-skeleton';
import { SignalType as SkeletonSignalType } from '@uca/capability-skeleton/types';
import {
    webContextSchema,
    webSignalBodySchema,
} from '../schema.js';
import type { WebContext } from '../types.js';
import { z } from 'zod';
import {
    __ID__,
    DEFAULT_CONTAINER,
    DEFAULT_IMAGINATION,
    DEFAULT_LIMIT,
    VIEW_GOAL,
    VIEW_INTENTION,
    VIEW_PURPOSE,
} from './constants.js';
import {
    buildPayloadSchema,
    builtResultSchema,
    componentItemSchema,
    createdResultSchema,
    renderedResultSchema,
    viewCompositionSchema,
    type Body,
    type BuildPayload,
    type BuiltResult,
    type ViewBody,
} from './schema.js';
import {
    DataType,
    SignalType,
} from './types.js';


export class View extends Uca<Body> {
    public static override purpose: string = VIEW_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: VIEW_INTENTION,
            body: {
                containerElement: DEFAULT_CONTAINER,
            },
        },
        reactTo: [
            ...View.reactToSelf(),
            ...View.reactToLlm(),
            ...View.reactToRender(),
            ...View.reactToStreamTransformer(),
            ...View.reactToZod(),
            ...View.reactToSkeleton(),
        ],
        inputs: [
            {
                signal: SignalType.BUILD,
                type: DataType.BUILD_PAYLOAD,
                schema: buildPayloadSchema,
                description:
                    'Construct visual element composition for given area and design context',
            },
        ],
        outputs: [
            {
                signal: SignalType.BUILT,
                type: DataType.BUILT_RESULT,
                schema: builtResultSchema,
                description: 'Emitted when view component hierarchy is constructed',
            },
            {
                signal: SignalType.RENDERED,
                type: DataType.RENDERED_RESULT,
                schema: renderedResultSchema,
                description: 'Emitted when view components are rendered in the visual surface',
            },
            {
                signal: SignalType.CREATED,
                type: DataType.CREATED_RESULT,
                schema: createdResultSchema,
                description: 'Emitted when view rendering completes for an area',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Emitted when view construction fails',
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
            RenderSignalType.RENDERED,
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
                this.handleBuild(signal);
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
            case RenderSignalType.RENDERED:
                this.handleRenderRendered(signal);
                break;
            case RenderSignalType.ERROR:
                this.handleRenderError(signal);
                break;
            case SkeletonSignalType.SHOWN:
            case SkeletonSignalType.REMOVED:
            case SkeletonSignalType.ERROR:
                break;
        }
    }

    private formatAreaSpatialDirectives(area: Record<string, unknown>): string {
        const { disposicionEspacial, disposicionVisual, disposicionInformacion, qualities, visualIntention } = area;
        const space = disposicionEspacial ? ` Ubicación: ${disposicionEspacial}.` : '';
        const visualTarget = visualIntention ?? disposicionVisual;
        const visual = visualTarget ? ` Flujo visual: ${visualTarget}.` : '';
        const layout = qualities ? ` Cualidades del área: ${JSON.stringify(qualities)}.` : '';
        const info = disposicionInformacion ? ` Información a cubrir: ${disposicionInformacion}.` : '';
        return `${space}${visual}${layout}${info}`;
    }

    private getGoal(areaId?: string, area: Record<string, unknown> = {}): string {
        const { purpose, intention } = area as { purpose?: string; intention?: string };
        const directives = this.formatAreaSpatialDirectives(area);
        const target = areaId ?? 'main';
        const targetDesc = intention ?? purpose ?? VIEW_GOAL;
        const contrast = ' Contrast rule: on light surfaces use textColor dark, muted, or brand; use light only on dark surfaces.';
        return `Articular componentes visuales directamente en '${target}' (container mounted): ${targetDesc}.${directives} Infer direction/gap for boxes with children.${contrast}`;
    }

    private resolveAreaVisual(area?: Record<string, unknown>): string {
        const { visualIntention = VIEW_INTENTION } = area ?? {};
        return visualIntention as string;
    }

    private extractAreaDescriptors(area?: Record<string, unknown>): { containerId: string; dimensions: Record<string, unknown> } {
        const { id, dimensions = {}, parentId = 'root' } = area ?? {};
        return {
            containerId: (id ?? parentId) as string,
            dimensions: dimensions as Record<string, unknown>,
        };
    }

    private assembleContextLimits(limits: Record<string, unknown> = {}): Record<string, unknown> {
        return {
            limit: DEFAULT_LIMIT,
            imagination: DEFAULT_IMAGINATION,
            ...limits,
        };
    }

    private createBaseWebContext(containerId: string, areaId: string, dimensions: Record<string, unknown>, capabilities: unknown[]) {
        return {
            containerId,
            areaId,
            areaContainerDimensions: dimensions,
            webCapabilitiesAvailables: capabilities as Record<string, unknown>[],
            styleDomains: this.resolveStyleDomains(),
        };
    }

    private enrichContextWithArea(
        base: ReturnType<typeof this.createBaseWebContext>,
        area?: Record<string, unknown>,
        limits: Record<string, unknown> = {},
    ): WebContext {
        const { disposicionEspacial, disposicionInformacion } = area ?? {};
        return {
            ...base,
            visualIntention: this.resolveAreaVisual(area),
            disposicionEspacial: disposicionEspacial as string | undefined,
            disposicionInformacion: disposicionInformacion as string | undefined,
            theme: 'light',
            contrastRule: 'Use textColor dark/brand on light surfaces; light on dark/primary surfaces',
            limits: this.assembleContextLimits(limits),
        };
    }

    private buildEnrichedContext(body?: ViewBody): WebContext {
        const { area, limits = {} } = (body ?? {}) as { area?: Record<string, unknown>; limits?: Record<string, unknown> };
        const { containerId, dimensions } = this.extractAreaDescriptors(area);
        const areaId = (area?.id as string) ?? containerId;
        const capabilities = this.resolveAvailableCapabilities();
        const base = this.createBaseWebContext(containerId, areaId, dimensions, capabilities);
        return this.enrichContextWithArea(base, area, limits);
    }

    private resolveAvailableCapabilities(): unknown[] {
        return Render.getVisualPrimitives();
    }

    private resolveStyleDomains(): string[] {
        const { tokens } = Css.visualLanguage() as { tokens?: Record<string, unknown> };
        return Object.keys(tokens ?? {});
    }

    private createInferMeta(
        goal: string,
        correlationId: string,
        streamId: string,
    ): Record<string, unknown> {
        return {
            goal,
            correlationId,
            streamId,
        };
    }

    private createInferRequest(payload: BuildPayload, correlationId: string): Record<string, unknown> {
        const { aim } = payload;
        const { description: intention, body } = aim;
        const area = (body?.area ?? {}) as Record<string, unknown>;
        const areaId = (area.id as string) ?? 'main';
        const context = this.buildEnrichedContext(body);
        const goal = this.getGoal(areaId, area);
        const meta = this.createInferMeta(goal, correlationId, `${correlationId}:view:${areaId}`);
        const outputSchema = Zod.toJsonSchema(viewCompositionSchema);
        return { id: 'view', purpose: this.purpose, goal, intention, context, outputSchema, ...meta };
    }

    private dispatchLlmInfer(payload: BuildPayload, correlationId: string): void {
        const inferPayload = this.createInferRequest(payload, correlationId);
        webSignalBodySchema.parse(inferPayload);
        this.pulse(LlmSignalType.INFER, inferPayload, undefined, correlationId);
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

    private handleBuild(signal: Signal): void {
        const {
            correlationId = crypto.randomUUID(),
            value,
        } = signal;
        const payload = value as BuildPayload;
        const areaId = (payload?.aim?.body?.area as { id?: string })?.id;
        if (areaId) {
            this.showAreaSkeleton(areaId);
        }
        this.dispatchLlmInfer(payload, correlationId);
    }

    private dispatchRender(
        components: unknown,
        context: Record<string, unknown>,
        areaId?: string,
    ): void {
        const {
            containerElement = DEFAULT_CONTAINER,
        } = this.disposition.aim.body ?? {};
        this.pulse(RenderSignalType.RENDER, {
            components,
            context,
            targetContainer: areaId ?? containerElement,
        });
    }

    private extractComponentList(composition: unknown): unknown[] {
        const comp = (composition ?? {}) as Record<string, unknown>;
        return (comp.components ?? comp.items ?? []) as unknown[];
    }

    private handleViewInferred(result: BuiltResult, correlationId?: string): void {
        const {
            composition,
            context = {},
            areaId,
        } = result;
        if (areaId) {
            this.removeAreaSkeleton(areaId);
        }
        const list = this.extractComponentList(composition);
        this.dispatchRender(list, context, areaId);
        this.pulse(SignalType.BUILT, result, undefined, correlationId);
        this.pulse(SignalType.CREATED, {
            areaId,
            context,
        }, undefined, correlationId);
    }

    private resolveInferredAreaId(context: Record<string, unknown>): string | undefined {
        const { areaId, containerId } = context as { areaId?: string; containerId?: string };
        return areaId ?? containerId;
    }

    private extractInferredResult(value: unknown): BuiltResult {
        const { data, response, context = {} } = (value ?? {}) as InferResult & { context?: Record<string, unknown> };
        const areaId = this.resolveInferredAreaId(context);
        return {
            composition: data ?? response,
            context,
            areaId,
        };
    }

    private handleLlmInferred(signal: Signal): void {
        const {
            value,
            correlationId = (signal.value as InferResult)?.correlationId,
        } = signal;
        const result = this.extractInferredResult(value);
        this.handleViewInferred(result, correlationId);
    }

    private handleLlmStreaming(_signal: Signal): void {}

    private buildTransformPayload(result: StreamResult): Record<string, unknown> {
        const { correlationId, stream, context, request } = result as StreamResult & { context?: Record<string, unknown> };
        const resolvedContext = context ?? request?.context ?? (request as unknown as Record<string, unknown>) ?? {};
        return {
            correlationId,
            stream,
            schema: componentItemSchema,
            mode: StreamTransformerMode.ITEMS,
            context: resolvedContext,
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
        const { stream, context, correlationId } = this.extractTransformedPayload(signal);
        if (!stream) { return; }
        try {
            await stream.pipeTo(this.createStreamConsumer(context as Record<string, unknown> | undefined, correlationId));
        } catch (error) {
            this.pulse(SignalType.ERROR, error, undefined, correlationId);
        }
    }

    private createStreamConsumer(
        context?: Record<string, unknown>,
        correlationId?: string,
    ): WritableStream<Record<string, unknown>> {
        const components: Record<string, unknown>[] = [];
        return new WritableStream({
            write: (item) => {
                components.push(item);
                this.handleStreamChunk(item, context, correlationId);
            },
            close: () => this.handleStreamClose(components, context, correlationId),
        });
    }

    private handleStreamClose(
        components: Record<string, unknown>[],
        context?: Record<string, unknown>,
        correlationId?: string,
    ): void {
        const areaId = (context?.areaId as string) ?? (context?.containerId as string) ?? 'main';
        this.removeAreaSkeleton(areaId);
        this.pulse(SignalType.BUILT, {
            composition: { components },
            areaId,
        }, undefined, correlationId);
        this.pulse(SignalType.CREATED, {
            areaId,
            context,
        }, undefined, correlationId);
    }

    private handleStreamChunk(
        item: Record<string, unknown>,
        context?: Record<string, unknown>,
        _correlationId?: string,
    ): void {
        const areaId = (context?.areaId as string) ?? (context?.containerId as string) ?? 'main';
        const body = (context?.body ?? context ?? {}) as Record<string, unknown>;
        this.dispatchRender([item], body, areaId);
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
        const { correlationId, value } = signal;
        const areaId = (value as { context?: { areaId?: string } })?.context?.areaId;
        if (areaId) {
            this.removeAreaSkeleton(areaId);
        }
        this.pulse(SignalType.ERROR, value, undefined, correlationId);
    }

    private handleRenderRendered(signal: Signal): void {
        this.pulse(SignalType.RENDERED, signal.value);
    }

    private handleRenderError(signal: Signal): void {
        this.pulse(SignalType.ERROR, signal.value);
    }
}

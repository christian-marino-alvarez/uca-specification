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
            case RenderSignalType.RENDERED:
                this.handleRenderRendered(signal);
                break;
            case RenderSignalType.ERROR:
                this.handleRenderError(signal);
                break;
        }
    }

    private formatAreaSpatialDirectives(area: Record<string, unknown>): string {
        const { disposicionEspacial, disposicionVisual, disposicionInformacion, qualities } = area;
        const space = disposicionEspacial ? ` Ubicación: ${disposicionEspacial}.` : '';
        const visual = disposicionVisual ? ` Flujo visual: ${disposicionVisual}.` : '';
        const layout = qualities ? ` Cualidades del área: ${JSON.stringify(qualities)}.` : '';
        const info = disposicionInformacion ? ` Contenido: ${disposicionInformacion}.` : '';
        return `${space}${visual}${layout}${info}`;
    }

    private getGoal(areaId?: string, area: Record<string, unknown> = {}): string {
        const { purpose } = area as { purpose?: string };
        const directives = this.formatAreaSpatialDirectives(area);
        const target = areaId ?? 'main';
        return `Articulate visual components directly inside '${target}' (container already mounted; do NOT create a redundant wrapper): ${purpose ?? VIEW_GOAL}.${directives} For every Box with descendants, infer direction or division and choose gap, spacing, or marginBlock when its role needs separation; preserve semantic tree order unless a distinct visual sequence is required. flex only sizes an item in an already declared parent flow. Leaf primitives must not invent container flow.`;
    }


    private buildEnrichedContext(body?: ViewBody): Record<string, unknown> {
        const {
            area,
            id,
            containerElement,
            browser,
            specification,
        } = body ?? {};
        const visualPrimitives = Render.getVisualPrimitives();
        const visualLanguage = Css.visualLanguage();
        return {
            area,
            id,
            containerElement,
            browser,
            specification,
            visualPrimitives,
            visualLanguage,
        };
    }

    private createInferMeta(
        goal: string,
        correlationId: string,
        streamId: string,
        metadata: Record<string, unknown>,
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
            streamId,
        };
    }

    private createInferRequest(payload: BuildPayload, correlationId: string): Record<string, unknown> {
        const { aim, limits = {} } = payload;
        const { description: intention, body } = aim;
        const area = (body?.area ?? {}) as Record<string, unknown>;
        const areaId = (area.id as string) ?? 'main';
        const context = this.buildEnrichedContext(body);
        const goal = this.getGoal(areaId, area);
        const meta = this.createInferMeta(goal, correlationId, `${correlationId}:view:${areaId}`, { areaId, body }, limits);
        return { purpose: this.purpose, goal, intention, context, outputSchema: z.toJSONSchema(viewCompositionSchema), contextSchema: { const: context }, ...meta };
    }

    private dispatchLlmInfer(payload: BuildPayload, correlationId: string): void {
        const inferPayload = this.createInferRequest(payload, correlationId);
        this.pulse(LlmSignalType.INFER, inferPayload);
    }

    private handleBuild(payload: BuildPayload): void {
        const {
            correlationId = crypto.randomUUID(),
        } = payload;
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

    private handleViewInferred(result: BuiltResult): void {
        const {
            composition,
            context = {},
            areaId,
        } = result;
        const list = this.extractComponentList(composition);
        this.dispatchRender(list, context, areaId);
        this.pulse(SignalType.BUILT, result);
        this.pulse(SignalType.CREATED, {
            areaId,
            context,
            correlationId: result.correlationId,
        });
    }

    private resolveInferredAreaId(context: Record<string, unknown>, metadata: Record<string, unknown>): string | undefined {
        const { areaId } = context as { areaId?: string };
        return areaId ?? (metadata.areaId as string);
    }

    private extractInferredResult(value: unknown): BuiltResult {
        const { data, response, correlationId, request } = (value ?? {}) as InferResult;
        const metadata = (request?.metadata ?? {}) as Record<string, unknown>;
        const context = (request?.context ?? metadata) as Record<string, unknown>;
        const areaId = this.resolveInferredAreaId(context, metadata);
        return {
            composition: data ?? response,
            context,
            correlationId,
            areaId,
        };
    }

    private handleLlmInferred(signal: Signal): void {
        const {
            value,
        } = signal;
        const result = this.extractInferredResult(value);
        this.handleViewInferred(result);
    }

    private handleLlmStreaming(_signal: Signal): void {}

    private buildTransformPayload(result: StreamResult): Record<string, unknown> {
        const {
            correlationId,
            stream,
            request,
        } = result;
        const binding = (request?.metadata ?? {}) as BuildPayload;
        return {
            correlationId,
            stream,
            schema: componentItemSchema,
            mode: StreamTransformerMode.ITEMS,
            context: {
                ...binding,
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
        const areaId = (context?.areaId as string) ?? 'main';
        this.pulse(SignalType.BUILT, {
            composition: { components },
            areaId,
            correlationId,
        });
        this.pulse(SignalType.CREATED, {
            areaId,
            correlationId,
        });
    }

    private handleStreamChunk(
        item: Record<string, unknown>,
        context?: Record<string, unknown>,
        _correlationId?: string,
    ): void {
        const areaId = (context?.areaId as string) ?? 'main';
        const body = (context?.body ?? {}) as Record<string, unknown>;
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
        this.pulse(SignalType.ERROR, signal.value);
    }

    private handleRenderRendered(signal: Signal): void {
        this.pulse(SignalType.RENDERED, signal.value);
    }

    private handleRenderError(signal: Signal): void {
        this.pulse(SignalType.ERROR, signal.value);
    }
}

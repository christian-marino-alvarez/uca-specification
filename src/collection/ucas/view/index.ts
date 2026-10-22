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

    private resolveAreaGoal(areaId?: string, context?: Record<string, unknown>): string {
        const area = (context?.area ?? {}) as { purpose?: string; disposicionEspacial?: string; disposicionInformacion?: string };
        const { purpose, disposicionEspacial, disposicionInformacion } = area;
        const info = disposicionInformacion ? ` Info: ${disposicionInformacion}.` : '';
        const space = disposicionEspacial ? ` Ubicación: ${disposicionEspacial}.` : '';
        const target = areaId ?? 'main';
        return `Articulate visual components directly inside '${target}' (container already mounted; do NOT create a redundant wrapper): ${purpose ?? VIEW_GOAL}.${space}${info}`;
    }


    private resolveDispositionTarget(areaId?: string, parentId?: string): Record<string, unknown> {
        const target = areaId ?? 'main';
        return {
            targetArea: target,
            parentArea: parentId ?? 'body',
        };
    }

    private buildVisualDisposition(areaId?: string, context?: Record<string, unknown>): Record<string, unknown> {
        const { area, browser } = (context ?? {}) as { area?: Record<string, unknown>; browser?: { viewport?: unknown; device?: string } };
        const { parentId, qualities, container, disposicionEspacial, disposicionVisual, disposicionInformacion } = (area ?? {}) as Record<string, unknown>;
        return {
            ...this.resolveDispositionTarget(areaId, parentId as string | undefined),
            qualities: qualities ?? {},
            container: container ?? {},
            disposicionEspacial,
            disposicionVisual,
            disposicionInformacion,
            viewport: browser?.viewport ?? { width: 1024, height: 768 },
            device: browser?.device ?? 'desktop',
            containment: 'strict-viewport-fit',
        };
    }


    private filterAreaContext(context: Record<string, unknown>): Record<string, unknown> {
        const {
            area,
            browser,
            guidelines,
        } = context;
        return {
            area,
            browser,
            guidelines,
        };
    }

    private buildEnrichedContext(context: Record<string, unknown>, areaId?: string): Record<string, unknown> {
        const clean = this.filterAreaContext(context);
        return {
            ...clean,
            visualDisposition: this.buildVisualDisposition(areaId, clean),
            visualPrimitives: Render.getVisualPrimitives(),
            visualLanguage: Css.visualLanguage(),
        };
    }

    private buildStreamMetadata(areaId?: string, body?: ViewBody): Record<string, unknown> {
        return {
            areaId,
            body,
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

    private assembleInferPayload(id: string, intention: string, context: Record<string, unknown>, meta: Record<string, unknown>): Record<string, unknown> {
        return {
            id,
            intention,
            purpose: this.purpose,
            outputSchema: z.toJSONSchema(viewCompositionSchema) as Record<string, unknown>,
            contextSchema: { const: context },
            context,
            ...meta,
        };
    }

    private createInferRequest(payload: BuildPayload, correlationId: string): Record<string, unknown> {
        const { aim, limits = {} } = payload;
        const { description, body } = aim;
        const area = (body?.area ?? {}) as Record<string, unknown>;
        const areaId = (area.id as string) ?? 'main';
        const enrichedContext = this.buildEnrichedContext(body as Record<string, unknown>, areaId);
        const goal = this.resolveAreaGoal(areaId, body as Record<string, unknown>);
        const metadata = this.buildStreamMetadata(areaId, body as Record<string, unknown>);
        const meta = this.createInferMeta(goal, correlationId, `${correlationId}:view:${areaId}`, metadata, limits);
        return this.assembleInferPayload(`view:${areaId}`, description, enrichedContext, meta);
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

    private handleLlmStreaming(signal: Signal): void {
        const {
            correlationId,
            model,
        } = (signal.value ?? {}) as { correlationId?: string; model?: string };
        console.log('%c🎨 [VIEW::STREAM::START]', 'color: #9B5DE5; font-weight: bold;', {
            correlationId,
            model,
        });
    }

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

    private handleLlmStreamEnd(signal: Signal): void {
        const {
            correlationId,
            model,
        } = (signal.value ?? {}) as { correlationId?: string; model?: string };
        console.log('%c🎨 [VIEW::STREAM::END]', 'color: #9B5DE5; font-weight: bold;', {
            correlationId,
            model,
        });
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

    private logComponent(
        item: Record<string, unknown>,
        correlationId?: string,
        areaId?: string,
    ): void {
        const componentId = (item.id as string) ?? (item.component as string) ?? 'box';
        const title = `%c🎨 [VIEW::COMPONENT_DEFINED] %c${componentId}%c (area: ${areaId ?? 'body'})`;
        console.log(title, 'color: #9B5DE5; font-weight: bold;', 'color: #F6E05E; font-weight: bold;', 'color: #888;', {
            item,
            areaId,
            correlationId,
        });
    }

    private handleStreamChunk(
        item: Record<string, unknown>,
        context?: Record<string, unknown>,
        correlationId?: string,
    ): void {
        const areaId = (context?.areaId as string) ?? 'main';
        const body = (context?.body ?? {}) as Record<string, unknown>;
        this.logComponent(item, correlationId, areaId);
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

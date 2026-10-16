import { z } from 'zod';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import type {
    InferPayload,
} from '@uca/capability-llm/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    Mode,
    SignalType as TransformerSignalType,
    type RecoveryRequest,
    type TransformResult,
} from '@uca/capability-stream-transformer/types';
import { SseClient } from '@uca/capability-sse-client';
import {
    SignalType as SseSignalType,
    type ErrorPayload as StreamFailure,
    type StreamResult,
} from '@uca/capability-sse-client/types';
import { Skeleton } from '@uca/skeleton';
import {
    type ErrorResult as SkeletonError,
    SignalType as SkeletonSignalType,
} from '@uca/skeleton/types';
import {
    DEFAULT_CONFIGURATION,
    GOAL,
    INFERENCE_LIMITS,
    LAYOUT_REPAIR_REASON,
    PARENT_SKELETON_KIND,
    RECOVERY_GOAL,
    RECOVERY_LIMITS,
    __ID__,
} from './constants.js';
import {
    completedSchema,
    errorSchema,
    repairSchema,
    requestSchema,
    resultSchema,
    streamSchema,
} from './schema.js';
import {
    type Area,
    type Body,
    type Completed,
    type Repair,
    type Request,
    DataType,
    SignalType,
} from './types.js';

export class Layout extends Uca<Body> {
    public static override purpose = 'Create a structural layout for the target area that represents every requested need within the declared browser context, design system, and limits';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Layout.purpose,
        },
        reactTo: [
            SignalType.CREATE,
            SignalType.REPAIR,
            ...Layout.reactToSseClient(),
            ...Layout.reactToStreamTransformer(),
            ...Layout.reactToSkeleton(),
        ],
        inputs: [
            {
                signal: SignalType.CREATE,
                type: DataType.REQUEST,
                schema: requestSchema,
                description: 'Create a structural composition for a target area',
            },
            {
                signal: SignalType.REPAIR,
                type: DataType.REPAIR_REQUEST,
                schema: repairSchema,
                description: 'Correct a completed layout that violates its binding decision',
            },
        ],
        outputs: [
            {
                signal: SignalType.AREA_CREATED,
                type: DataType.AREA_RESULT,
                schema: resultSchema,
                description: 'Structural area rendered progressively from the stream',
            },
            {
                signal: SignalType.COMPLETED,
                type: DataType.COMPLETED_RESULT,
                schema: completedSchema,
                description: 'Completed structural composition for Builder validation',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
                description: 'Layout creation, streaming, or rendering failure',
            },
        ],
    };

    private static reactToSseClient(): string[] {
        const {
            reactTo = [],
        } = SseClient.disposition;
        return [
            ...reactTo,
            SseSignalType.STREAMED,
            SseSignalType.ERROR,
        ];
    }

    private static reactToStreamTransformer(): string[] {
        const {
            reactTo = [],
        } = StreamTransformer.disposition;
        return [
            ...reactTo,
            TransformerSignalType.TRANSFORMED,
            TransformerSignalType.RECOVER,
            TransformerSignalType.ERROR,
        ];
    }

    private static reactToSkeleton(): string[] {
        const {
            reactTo = [],
        } = Skeleton.disposition;
        return [
            ...reactTo,
            SkeletonSignalType.RENDERED,
            SkeletonSignalType.ERROR,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        const {
            registry,
        } = this;
        registry.forEach((capability) => capability.denervate());
        super.denervate();
    }

    protected override react(signal: Signal): void | Promise<void> {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate(signal);
                break;
            case SignalType.REPAIR:
                this.handleRepair(signal);
                break;
            case SseSignalType.STREAMED:
                return this.handleStreamed(signal);
            case SseSignalType.ERROR:
                this.handleStreamError(signal);
                break;
            case TransformerSignalType.TRANSFORMED:
                return this.handleTransformed(signal);
            case TransformerSignalType.RECOVER:
                this.handleRecovery(signal);
                break;
            case TransformerSignalType.ERROR:
                this.handleTransformerError(signal);
                break;
            case SkeletonSignalType.RENDERED:
                this.handleSkeletonRendered(signal);
                break;
            case SkeletonSignalType.ERROR:
                this.handleSkeletonError(signal);
                break;
        }
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [SseClient, this.createSseClientDisposition(`${id}:sse-client`)],
            [StreamTransformer, this.createTransformerDisposition(`${id}:stream-transformer`)],
            [Skeleton, this.createSkeletonDisposition(`${id}:skeleton`)],
        ];
    }

    private createSseClientDisposition(id: string): Disposition {
        return {
            ...SseClient.disposition,
            aim: {
                description: SseClient.AIM,
                body: {
                    id,
                },
            },
        };
    }

    private createTransformerDisposition(id: string): Disposition {
        return {
            ...StreamTransformer.disposition,
            aim: {
                description: StreamTransformer.AIM,
                body: {
                    id,
                    schema: streamSchema,
                },
            },
        };
    }

    private createSkeletonDisposition(id: string): Disposition {
        return {
            ...Skeleton.disposition,
            aim: {
                description: Skeleton.purpose,
                body: {
                    id,
                },
            },
        };
    }

    private handleCreate(signal: Signal): void {
        const {
            value,
        } = signal;
        const request = requestSchema.parse(value);
        const {
            area: {
                id: areaId,
            },
        } = request;
        this.pulse(SkeletonSignalType.RENDER, {
            areaId,
            name: PARENT_SKELETON_KIND,
            context: request,
        });
        this.pulse(SseSignalType.STREAM, this.createStreamRequest(request));
    }

    private handleRepair(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            completion,
            error,
        } = repairSchema.parse(value) as Repair;
        const request = this.createCorrectedRequest(completion, error);
        const {
            composition: {
                areas,
            },
        } = completion;
        areas.forEach(({ id: areaId }) => {
            this.pulse(SkeletonSignalType.DISCARD, {
                areaId,
            });
        });
        this.pulse(
            SignalType.CREATE,
            request,
            this.id,
        );
    }

    private handleStreamed(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            streamId,
            stream,
            context,
        } = value as StreamResult;
        const request = requestSchema.parse(context);
        this.pulse(TransformerSignalType.TRANSFORM, {
            correlationId,
            streamId,
            stream,
            context: request,
            schema: streamSchema,
            mode: Mode.ENTRIES,
            maxAttempts: 1,
        });
    }

    private handleStreamError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            streamId,
            error,
            context,
        } = value as StreamFailure;
        if (streamId) {
            this.pulse(TransformerSignalType.REPAIR, {
                requestId: streamId,
                error,
            });
            return;
        }
        const request = requestSchema.parse(context);
        this.emitError(error, request, correlationId);
    }

    private async handleTransformed(signal: Signal): Promise<void> {
        const stream = this.extractStream(signal);
        const request = this.extractRequest(signal);
        try {
            await stream.pipeTo(this.createAreaWriter(request));
        }
        catch (error) {
            this.emitError(error, request);
        }
    }

    private extractStream(signal: Signal): ReadableStream<Record<string, unknown>> {
        const {
            value,
        } = signal;
        const {
            stream,
        } = value as TransformResult;
        return stream;
    }

    private extractRequest(signal: Signal): Request {
        const {
            value,
        } = signal;
        const {
            context,
        } = value as TransformResult;
        return requestSchema.parse(context);
    }

    private createAreaWriter(request: Request): WritableStream<Record<string, unknown>> {
        let parentSkeletonVisible = true;
        const areas: Area[] = [];
        return new WritableStream({
            write: (entry) => {
                if (parentSkeletonVisible) {
                    this.removeParentSkeleton(request);
                    parentSkeletonVisible = false;
                }
                const area = this.consumeAreaChunk(entry, request);
                if (area) {
                    areas.push(area);
                }
            },
            close: () => this.emitCompleted(areas, request),
        });
    }

    private removeParentSkeleton(request: Request): void {
        const {
            area: {
                id: areaId,
            },
        } = request;
        this.pulse(SkeletonSignalType.REMOVE, {
            areaId,
        });
    }

    private handleTransformerError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            error,
            context,
        } = value as StreamFailure;
        const request = requestSchema.parse(context);
        this.emitError(error, request, correlationId);
    }

    private consumeAreaChunk(entry: Record<string, unknown>, request: Request): Area | undefined {
        const area = this.extractArea(entry);
        if (!area) {
            return undefined;
        }
        this.renderArea(area, request);
        return area;
    }

    private extractArea(entry: Record<string, unknown>): Area | undefined {
        const [
            candidate,
        ] = Object.values(entry);
        return candidate as Area | undefined;
    }

    private handleRecovery(signal: Signal): void {
        const {
            value,
        } = signal;
        const recovery = value as RecoveryRequest;
        this.pulse(SseSignalType.STREAM, this.createRecoveryRequest(recovery));
    }

    private createStreamRequest(request: Request): InferPayload & { context: Request } {
        const {
            correlationId,
            purpose,
            decision: {
                minimumAreas,
            },
            context,
        } = request;
        const {
            limits,
        } = context;
        return {
            ...DEFAULT_CONFIGURATION,
            correlationId,
            purpose,
            goal: GOAL,
            outputSchema: z.toJSONSchema(streamSchema),
            contextSchema: {
                const: context,
            },
            limits: {
                ...INFERENCE_LIMITS,
                minimumAreas,
                declared: limits,
            },
            context: request,
        };
    }

    private createRecoveryRequest(recovery: RecoveryRequest): InferPayload & { context: Request } {
        const {
            requestId,
            value,
            error,
            acceptedKeys = [],
            context,
        } = recovery;
        const request = requestSchema.parse(context);
        const {
            correlationId,
            purpose,
            decision: {
                minimumAreas,
            },
            context: layoutContext,
        } = request;
        const {
            limits,
        } = layoutContext;
        return {
            ...DEFAULT_CONFIGURATION,
            correlationId,
            streamId: requestId,
            purpose,
            goal: RECOVERY_GOAL,
            outputSchema: z.toJSONSchema(streamSchema),
            contextSchema: {
                const: {
                    ...layoutContext,
                    recovery: {
                        invalidEntry: value,
                        validationError: String(error),
                        acceptedKeys,
                    },
                },
            },
            limits: {
                ...INFERENCE_LIMITS,
                ...RECOVERY_LIMITS,
                minimumAreas,
                declared: limits,
            },
            context: request,
        };
    }

    private createCorrectedRequest(completion: Completed, error: string): Request {
        const {
            composition,
            request,
        } = completion;
        const {
            context,
            attempt,
        } = request;
        const {
            areas,
        } = composition;
        return {
            ...request,
            attempt: attempt + 1,
            context: {
                ...context,
                ...(areas.length > 0 && {
                    composition,
                }),
                correction: {
                    reason: error || LAYOUT_REPAIR_REASON,
                },
            },
        };
    }


    private renderArea(area: Area, request: Request): void {
        const {
            area: {
                id: areaId,
            },
        } = request;
        this.renderAreaSkeleton(area, areaId, request);
    }

    private renderAreaSkeleton(area: Area, parentTo: string, request: Request): void {
        const {
            id: areaId,
            name,
            dimensions,
        } = area;
        this.pulse(SkeletonSignalType.RENDER, {
            areaId,
            parentTo,
            name,
            dimensions,
            areaQualities: this.createAreaQualities(area),
            context: {
                area,
                request,
            },
        });
    }

    private handleSkeletonRendered(signal: Signal): void {
        const context = this.extractSkeletonContext(signal);
        if (context) {
            const {
                area,
                request,
            } = context;
            this.emitAreaCreated(area, request);
        }
    }

    private handleSkeletonError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            error,
            context,
        } = value as SkeletonError;
        const {
            request: nestedRequest,
        } = (context ?? {}) as {
            request?: Request;
        };
        const request = nestedRequest ?? context as Request | undefined;
        if (!request) {
            return;
        }
        this.emitError(error, request);
    }

    private extractSkeletonContext(signal: Signal): { area: Area; request: Request } | undefined {
        const {
            value,
        } = signal;
        const {
            context,
        } = value as { context?: { area: Area; request: Request } };
        return context;
    }

    private createAreaQualities(area: Area): Record<string, unknown> {
        const {
            dimensions,
            qualities,
            design,
        } = area;
        return {
            ...dimensions,
            ...qualities,
            ...design,
        };
    }

    private emitAreaCreated(area: Area, request: Request): void {
        const {
            correlationId,
            area: {
                id: targetAreaId,
            },
        } = request;
        this.pulse(SignalType.AREA_CREATED, {
            correlationId,
            targetAreaId,
            area,
            request,
        });
    }

    private emitCompleted(areas: Area[], request: Request): void {
        const {
            correlationId,
            area: {
                id: targetAreaId,
            },
        } = request;
        this.pulse(SignalType.COMPLETED, {
            correlationId,
            targetAreaId,
            composition: {
                areas,
            },
            request,
        });
    }

    private emitError(error: unknown, request: Request, correlationId?: string): void {
        const {
            correlationId: requestCorrelationId,
            area: {
                id: areaId,
            },
        } = request;
        this.pulse(SignalType.ERROR, {
            correlationId: correlationId ?? requestCorrelationId,
            areaId,
            error: error instanceof Error ? error.message : String(error),
            request,
        });
    }
}

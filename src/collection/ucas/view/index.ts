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
import { SseClient } from '@uca/capability-sse-client';
import {
    SignalType as SseSignalType,
    type ErrorPayload as StreamFailure,
    type StreamResult,
} from '@uca/capability-sse-client/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    Mode,
    SignalType as TransformerSignalType,
    type ErrorResult as TransformerFailure,
    type RecoveryRequest,
    type TransformResult,
} from '@uca/capability-stream-transformer/types';
import { Connection as ConnectionCapability } from '@uca/capability-connection';
import {
    SignalType as ConnectionSignalType,
    type Route,
} from '@uca/capability-connection/types';
import { Action } from '@uca/action';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Collection } from '@uca/collection';
import { SignalType as CollectionSignalType } from '@uca/collection/types';
import { Dropdown } from '@uca/dropdown';
import { SignalType as DropdownSignalType } from '@uca/dropdown/types';
import { Input } from '@uca/input';
import { SignalType as InputSignalType } from '@uca/input/types';
import { Interaction } from '@uca/interaction';
import { SignalType as InteractionSignalType } from '@uca/interaction/types';
import { Logger } from '@uca/logger';
import {
    Scope,
    SignalType as LoggerSignalType,
} from '@uca/logger/types';
import { Skeleton } from '@uca/skeleton';
import {
    SignalType as SkeletonSignalType,
    type ErrorResult as SkeletonError,
} from '@uca/skeleton/types';
import { Options } from '@uca/options';
import { SignalType as OptionsSignalType } from '@uca/options/types';
import { Picture } from '@uca/picture';
import { SignalType as PictureSignalType } from '@uca/picture/types';
import {
    DEFAULT_CONFIGURATION,
    CONNECTION_FORWARD_PROPERTIES,
    GOAL,
    INFERENCE_LIMITS,
    INCOMPLETE_COMPOSITION_ERROR,
    LOGGER_SIGNALS,
    RECOVERY_GOAL,
    RECOVERY_LIMITS,
    VIEW_SKELETON_KIND,
    __ID__,
} from './constants.js';
import {
    actionElementSchema,
    boxElementSchema,
    collectionElementSchema,
    completedSchema,
    componentSignalSchema,
    connectionSchema,
    dropdownElementSchema,
    entrySchema,
    errorSchema,
    inputElementSchema,
    logicSchema,
    optionsElementSchema,
    pictureElementSchema,
    requestSchema,
    resultSchema,
    streamSchema,
} from './schema.js';
import {
    CapabilitySource,
    ComponentSignalType,
    DataType,
    Kind,
    Name,
    SignalType,
    type Body,
    type ComponentContext,
    type Composition,
    type Connection as ViewConnection,
    type Element as ViewElement,
    type Entry,
    type Logic,
    type Request,
    type Result,
} from './types.js';

export class View extends Uca<Body> {
    public static override purpose = 'Materialize a target area as a confirmed composition of visual and logical UCAs whose declared reactive connections enable autonomous runtime collaboration';

    private static readonly recoverySchemas: Record<string, z.ZodType> = {
        [Name.ACTION]: actionElementSchema,
        [Name.BOX]: boxElementSchema,
        [Name.COLLECTION]: collectionElementSchema,
        [Name.DROPDOWN]: dropdownElementSchema,
        [Name.INPUT]: inputElementSchema,
        [Name.INTERACTION]: logicSchema,
        [Name.OPTIONS]: optionsElementSchema,
        [Name.PICTURE]: pictureElementSchema,
        [Kind.CONNECTION]: connectionSchema,
    };

    public static override disposition: Disposition<Body> = {
        aim: {
            description: View.purpose,
        },
        reactTo: [
            SignalType.CREATE,
            ...View.reactToSseClient(),
            ...View.reactToStreamTransformer(),
            ...View.reactToConnection(),
            ...View.reactToElements(),
            ...View.reactToLogger(),
            ...View.reactToSkeleton(),
        ],
        inputs: [
            {
                signal: SignalType.CREATE,
                type: DataType.REQUEST,
                schema: requestSchema,
                description: 'Create the final component composition for a target area',
            },
        ],
        outputs: [
            {
                signal: SignalType.ELEMENT_CREATED,
                type: DataType.ELEMENT_RESULT,
                schema: resultSchema,
                description: 'Final component creation confirmed by its responsible UCA',
            },
            {
                signal: SignalType.COMPLETED,
                type: DataType.COMPLETED_RESULT,
                schema: completedSchema,
                description: 'Final visual, logical, and reactive composition completed',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
                description: 'Final view creation failure',
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

    private static reactToConnection(): string[] {
        const {
            reactTo = [],
        } = ConnectionCapability.disposition;
        return [
            ...reactTo,
        ];
    }

    private static reactToElements(): string[] {
        return [
            ...Action.disposition.reactTo ?? [],
            ActionSignalType.CREATED,
            ...Box.disposition.reactTo ?? [],
            BoxSignalType.CREATED,
            ...Collection.disposition.reactTo ?? [],
            CollectionSignalType.CREATED,
            ...Dropdown.disposition.reactTo ?? [],
            DropdownSignalType.CREATED,
            ...Input.disposition.reactTo ?? [],
            InputSignalType.CREATED,
            ...Interaction.disposition.reactTo ?? [],
            ...Options.disposition.reactTo ?? [],
            OptionsSignalType.CREATED,
            ...Picture.disposition.reactTo ?? [],
            PictureSignalType.CREATED,
        ];
    }

    private static reactToLogger(): string[] {
        const {
            reactTo = [],
        } = Logger.disposition;
        return [
            ...reactTo,
        ];
    }

    private static reactToSkeleton(): string[] {
        const {
            reactTo = [],
        } = Skeleton.disposition;
        return [
            ...reactTo,
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

    protected override receptors(): string[] {
        return super.receptors().filter(
            (property) => property !== LoggerSignalType.OBSERVE,
        );
    }

    protected override react(signal: Signal): void | Promise<void> {
        const {
            source,
        } = signal;
        const capabilitySource = this.resolveCapabilitySource(source);
        switch (capabilitySource) {
            case CapabilitySource.SSE_CLIENT:
                this.reactSseClient(signal);
                break;
            case CapabilitySource.STREAM_TRANSFORMER:
                return this.reactStreamTransformer(signal);
            case CapabilitySource.SKELETON:
                this.reactSkeleton(signal);
                break;
            case CapabilitySource.ACTION:
                this.reactComponent(signal);
                break;
            case CapabilitySource.BOX:
                this.reactComponent(signal);
                break;
            case CapabilitySource.COLLECTION:
                this.reactComponent(signal);
                break;
            case CapabilitySource.DROPDOWN:
                this.reactComponent(signal);
                break;
            case CapabilitySource.INPUT:
                this.reactComponent(signal);
                break;
            case CapabilitySource.OPTIONS:
                this.reactComponent(signal);
                break;
            case CapabilitySource.PICTURE:
                this.reactComponent(signal);
                break;
            default:
                this.reactView(signal);
        }
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [SseClient, this.createDisposition(`${id}:sse-client`, SseClient.disposition, SseClient.AIM)],
            [StreamTransformer, this.createTransformerDisposition(`${id}:stream-transformer`)],
            [ConnectionCapability, this.createDisposition(`${id}:connection`, ConnectionCapability.disposition, ConnectionCapability.AIM)],
            [Action, this.createDisposition(`${id}:action`, Action.disposition, Action.purpose)],
            [Box, this.createDisposition(`${id}:box`, Box.disposition, Box.purpose)],
            [Collection, this.createDisposition(`${id}:collection`, Collection.disposition, Collection.purpose)],
            [Dropdown, this.createDisposition(`${id}:dropdown`, Dropdown.disposition, Dropdown.purpose)],
            [Input, this.createDisposition(`${id}:input`, Input.disposition, Input.purpose)],
            [Interaction, this.createDisposition(`${id}:interaction`, Interaction.disposition, Interaction.purpose)],
            [Options, this.createDisposition(`${id}:options`, Options.disposition, Options.purpose)],
            [Picture, this.createDisposition(`${id}:picture`, Picture.disposition, Picture.purpose)],
            [Logger, this.createLoggerDisposition(`${id}:logger`)],
            [Skeleton, this.createDisposition(`${id}:skeleton`, Skeleton.disposition, Skeleton.purpose)],
        ];
    }

    private resolveCapabilitySource(source: string): string | undefined {
        return source.split(':').pop();
    }

    private reactSseClient(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SseSignalType.STREAMED:
                this.handleStreamed(signal);
                break;
            case SseSignalType.ERROR:
                this.handleStreamError(signal);
                break;
        }
    }

    private reactStreamTransformer(signal: Signal): void | Promise<void> {
        const {
            property,
        } = signal;
        switch (property) {
            case TransformerSignalType.TRANSFORMED:
                return this.handleTransformed(signal);
            case TransformerSignalType.RECOVER:
                this.handleRecovery(signal);
                break;
            case TransformerSignalType.ERROR:
                this.handleTransformerError(signal);
                break;
        }
    }

    private reactSkeleton(signal: Signal): void {
        const {
            property,
        } = signal;
        if (property === SkeletonSignalType.ERROR) {
            this.handleSkeletonError(signal);
        }
    }

    private reactView(signal: Signal): void {
        const {
            property,
        } = signal;
        if (property === SignalType.CREATE) {
            this.handleCreate(signal);
        }
    }

    private reactComponent(signal: Signal): void {
        const {
            property,
        } = signal;
        const componentSignal = property.split('.').pop();
        switch (componentSignal) {
            case ComponentSignalType.CREATED:
                this.handleComponentCreated(signal);
                break;
        }
    }

    private createDisposition(id: string, disposition: Disposition, description: string): Disposition {
        const {
            aim,
        } = disposition;
        return {
            ...disposition,
            aim: {
                description,
                body: {
                    ...aim.body as object,
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

    private createLoggerBody(id: string) {
        return {
            id,
            scope: Scope.FRONT,
            prefix: 'View Flow',
            filter: ({
                property,
            }: Signal) => LOGGER_SIGNALS.includes(property),
        };
    }

    private createLoggerDisposition(id: string): Disposition {
        return {
            ...Logger.disposition,
            aim: {
                description: Logger.purpose,
                body: this.createLoggerBody(id),
            },
        };
    }

    private handleCreate(signal: Signal): void {
        const {
            value,
        } = signal;
        const request = requestSchema.parse(value);
        if (this.restoreComposition(request)) {
            return;
        }
        this.startStream(request);
    }

    private restoreComposition(request: Request): boolean {
        const {
            context: {
                composition,
            },
        } = request;
        if (!composition || !this.isCompositionValid(composition, request)) {
            return false;
        }
        this.materializeComposition(composition, request);
        return true;
    }

    private startStream(request: Request): void {
        this.renderSkeleton(request);
        this.pulse(
            SseSignalType.STREAM,
            this.createStreamRequest(request),
        );
    }

    private renderSkeleton(request: Request): void {
        const {
            area: {
                id: areaId,
            },
        } = request;
        this.pulse(SkeletonSignalType.RENDER, {
            areaId,
            name: VIEW_SKELETON_KIND,
            context: request,
        });
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
        this.emitError(error, requestSchema.parse(context), correlationId);
    }

    private async handleTransformed(signal: Signal): Promise<void> {
        const {
            value,
        } = signal;
        const {
            stream,
            context,
        } = value as TransformResult;
        const request = requestSchema.parse(context);
        try {
            await stream.pipeTo(this.createElementWriter(request));
        }
        catch (error) {
            this.emitError(error, request);
        }
    }

    private createElementWriter(request: Request): WritableStream<Record<string, unknown>> {
        const composition: Composition = {
            visual: [],
            logic: [],
            connections: [],
        };
        return new WritableStream({
            write: (entry) => {
                const item = this.extractEntry(entry);
                this.compose(item, composition);
            },
            close: () => this.completeComposition(composition, request),
        });
    }

    private extractEntry(entry: Record<string, unknown>): Entry {
        const [
            item,
        ] = Object.values(entry);
        return item as Entry;
    }

    private compose(item: Entry, composition: Composition): void {
        const {
            kind,
        } = item;
        switch (kind) {
            case Kind.VISUAL:
                composition.visual.push(item);
                break;
            case Kind.LOGIC:
                composition.logic.push(item);
                break;
            case Kind.CONNECTION:
                composition.connections.push(item);
                break;
        }
    }

    private renderElement(element: ViewElement, request: Request): void {
        const {
            name,
        } = element;
        switch (name) {
            case Name.ACTION:
                this.renderWebElement(ActionSignalType.RENDER, element, request);
                break;
            case Name.BOX:
                this.renderWebElement(BoxSignalType.RENDER, element, request);
                break;
            case Name.COLLECTION:
                this.renderWebElement(CollectionSignalType.RENDER, element, request);
                break;
            case Name.DROPDOWN:
                this.renderWebElement(DropdownSignalType.RENDER, element, request);
                break;
            case Name.INPUT:
                this.renderWebElement(InputSignalType.RENDER, element, request);
                break;
            case Name.OPTIONS:
                this.renderWebElement(OptionsSignalType.RENDER, element, request);
                break;
            case Name.PICTURE:
                this.renderWebElement(PictureSignalType.RENDER, element, request);
                break;
        }
    }

    private renderWebElement(property: string, element: ViewElement, request: Request): void {
        const {
            id: elementId,
            parentId,
            properties,
        } = element;
        const {
            area: {
                id: areaId,
            },
        } = request;
        this.pulse(property, {
            ...properties,
            elementId,
            parentTo: parentId ?? areaId,
            context: {
                element,
                request,
            },
        });
    }

    private bindLogic(logic: Logic, request: Request): void {
        const {
            properties: {
                context,
                fields,
            },
        } = logic;
        const {
            correlationId,
        } = request;
        fields.forEach((field) => this.pulse(InteractionSignalType.BIND, {
            ...field,
            context,
            correlationId,
        }));
    }

    private completeComposition(composition: Composition, request: Request): void {
        const {
            attempt,
        } = request;
        const isValid = this.isCompositionValid(composition, request);
        if (!isValid && attempt === 0) {
            this.pulse(SseSignalType.STREAM, this.createStreamRequest(this.createCorrectedRequest(composition, request)));
            return;
        }
        if (!isValid) {
            this.emitError(INCOMPLETE_COMPOSITION_ERROR, request);
            return;
        }
        this.materializeComposition(composition, request);
    }

    private materializeComposition(composition: Composition, request: Request): void {
        const {
            visual,
            logic,
        } = composition;
        visual.forEach((element) => this.renderElement(element, request));
        logic.forEach((item) => this.bindLogic(item, request));
        const routes = this.createRoutes(composition);
        this.pulse(ConnectionSignalType.CONFIGURE, {
            routes,
        });
        this.emitCompleted(composition, request);
    }

    private isCompositionValid(composition: Composition, request: Request): boolean {
        const {
            context: {
                requirements,
            },
        } = request;
        const visual = new Set(composition.visual.map(({ name }) => name));
        const logic = new Set(composition.logic.map(({ name }) => name));
        return !requirements || requirements.visual.every((name) => visual.has(name))
            && requirements.logic.every((name) => logic.has(name));
    }

    private createCorrectedRequest(composition: Composition, request: Request): Request {
        const {
            context,
            attempt,
        } = request;
        const requirements = context.requirements!;
        const visual = new Set(composition.visual.map(({ name }) => name));
        const logic = new Set(composition.logic.map(({ name }) => name));
        return {
            ...request,
            attempt: attempt + 1,
            context: {
                ...context,
                composition,
                correction: {
                    missingVisual: requirements.visual.filter((name) => !visual.has(name)),
                    missingLogic: requirements.logic.filter((name) => !logic.has(name)),
                },
            },
        };
    }

    private createRoutes(composition: Composition): Route[] {
        const {
            logic,
            connections,
        } = composition;
        return connections.map((connection) => this.createRoute(connection, logic));
    }

    private createRoute(connection: ViewConnection, logic: Logic[]): Route {
        const {
            id,
        } = this;
        const {
            source,
            target,
            properties,
        } = connection;
        const targetLogic = logic.find(({ id: logicId }) => logicId === target.id);
        if (!targetLogic) {
            throw new Error(`Connection target ${target.id} is not declared as logic`);
        }
        const {
            properties: {
                context,
            },
        } = targetLogic;
        return {
            source,
            target: {
                id: `${id}:interaction`,
                signal: target.signal,
            },
            value: {
                context,
                ...properties,
            },
            forward: [
                ...CONNECTION_FORWARD_PROPERTIES,
            ],
        };
    }

    private handleRecovery(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(
            SseSignalType.STREAM,
            this.createRecoveryRequest(value as RecoveryRequest),
        );
    }

    private handleTransformerError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            error,
            context,
        } = value as TransformerFailure;
        this.emitError(error, requestSchema.parse(context), correlationId);
    }

    private createStreamRequest(request: Request): InferPayload & { context: Request } {
        const {
            correlationId,
            purpose,
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
                declared: limits,
            },
            context: request,
        };
    }

    private createRecoverySchema(value: unknown): Record<string, unknown> {
        const record = value as Record<string, Entry>;
        const identifier = Object.keys(record).at(0)!;
        const {
            kind,
            name,
        } = record[identifier]! as Entry & {
            name?: string;
        };
        const recoverySchema = View.recoverySchemas[name ?? kind] ?? entrySchema;
        const properties: Record<string, unknown> = {};
        properties[identifier] = z.toJSONSchema(recoverySchema);
        return {
            type: 'object',
            properties,
            required: Array.of(identifier),
            additionalProperties: false,
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
            context: viewContext,
        } = request;
        return {
            ...DEFAULT_CONFIGURATION,
            correlationId,
            streamId: requestId,
            purpose,
            goal: RECOVERY_GOAL,
            outputSchema: this.createRecoverySchema(value),
            contextSchema: {
                const: {
                    ...viewContext,
                    recovery: {
                        invalidEntry: value,
                        validationError: String(error),
                        acceptedKeys,
                    },
                },
            },
            limits: RECOVERY_LIMITS,
            context: request,
        };
    }

    private handleComponentCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(
            SignalType.ELEMENT_CREATED,
            this.createElementResult(value),
        );
    }

    private createElementResult(value: unknown): Result {
        const componentSignal = componentSignalSchema.parse(value);
        const {
            context,
            detail,
        } = componentSignal as {
            context?: ComponentContext;
            detail?: { context?: ComponentContext };
        };
        const {
            context: nestedContext,
        } = detail ?? {};
        const {
            element,
            request,
        } = (context ?? nestedContext) as ComponentContext;
        const {
            correlationId,
            area: {
                id: targetAreaId,
            },
        } = request;
        return {
            correlationId,
            targetAreaId,
            element,
            request,
            detail: value,
        };
    }

    private emitCompleted(composition: Composition, request: Request): void {
        const {
            correlationId,
            area: {
                id: targetAreaId,
            },
        } = request;
        this.pulse(SkeletonSignalType.REMOVE, {
            areaId: targetAreaId,
        });
        this.pulse(SignalType.COMPLETED, {
            correlationId,
            targetAreaId,
            composition,
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
        this.pulse(SkeletonSignalType.REMOVE, {
            areaId,
        });
        this.pulse(SignalType.ERROR, {
            correlationId: correlationId ?? requestCorrelationId,
            areaId,
            error: error instanceof Error ? error.message : String(error),
            request,
        });
    }

    private handleSkeletonError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            error,
            context,
        } = value as SkeletonError;
        const parsed = requestSchema.safeParse(context);
        if (parsed.success) {
            const {
                data: request,
            } = parsed;
            this.pulse(SignalType.ERROR, {
                correlationId: request.correlationId,
                areaId: request.area.id,
                error,
                request,
            });
        }
    }
}

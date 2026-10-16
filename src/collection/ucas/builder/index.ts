import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { Schema } from '@uca/capability-schema';
import { Catalog } from '@uca/capability-catalog';
import {
    Kind as CatalogKind,
    SignalType as CatalogSignalType,
    type Entry as CatalogEntry,
    type Failure as CatalogFailure,
    type Result as CatalogResult,
} from '@uca/capability-catalog/types';
import {
    SignalType as SchemaSignalType,
    type ErrorResult as SchemaError,
    type ValidatedResult,
} from '@uca/capability-schema/types';
import { Decision } from '@uca/decision';
import { Logger } from '@uca/logger';
import {
    SignalType as DecisionSignalType,
    type Failure as DecisionFailure,
    type Request as DecisionRequest,
    type Result as DecisionResult,
} from '@uca/decision/types';
import {
    Scope,
    SignalType as LoggerSignalType,
} from '@uca/logger/types';
import { Layout } from '@uca/layout';
import {
    SignalType as LayoutSignalType,
    type Area as LayoutArea,
    type Completed as LayoutCompleted,
    type Composition as LayoutComposition,
    type Failure as LayoutFailure,
    type Request as LayoutRequest,
} from '@uca/layout/types';
import { View } from '@uca/view';
import {
    SignalType as ViewSignalType,
    type Completed as ViewCompleted,
    type Composition as ViewComposition,
    type Failure as ViewFailure,
    type Request as ViewRequest,
    type Result as ViewElementResult,
} from '@uca/view/types';
import {
    __ID__,
    CATALOG_KINDS,
    DECISION_REQUEST,
    INVALID_LAYOUT_ERROR,
    LOGGER_SIGNALS,
    MINIMUM_LAYOUT_AREAS,
} from './constants.js';
import {
    errorSchema,
    layoutAreaResultSchema,
    requestSchema,
    resultSchema,
    viewCompletedSchema,
    viewElementResultSchema,
} from './schema.js';
import {
    DataType,
    Path,
    SignalType,
    type AvailableUcas,
    type Body,
    type Composition,
    type DecisionContinuation,
    type DecisionContext,
    type Request,
} from './types.js';

export class Builder extends Uca<Body> {
    public static override purpose = 'Determine whether a defined DOM area requires a structural layout or its final view';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Builder.purpose,
        },
        reactTo: [
            SignalType.BUILD,
            ...Builder.reactToSchema(),
            ...Builder.reactToCatalog(),
            ...Builder.reactToDecision(),
            ...Builder.reactToLayout(),
            ...Builder.reactToView(),
            ...Builder.reactToLogger(),
        ],
        inputs: [
            {
                signal: SignalType.BUILD,
                type: DataType.REQUEST,
                schema: requestSchema,
            },
        ],
        outputs: [
            {
                signal: SignalType.DECIDED,
                type: DataType.RESULT,
                schema: resultSchema,
            },
            {
                signal: SignalType.LAYOUT_AREA_CREATED,
                type: DataType.LAYOUT_AREA_RESULT,
                schema: layoutAreaResultSchema,
            },
            {
                signal: SignalType.VIEW_ELEMENT_CREATED,
                type: DataType.VIEW_ELEMENT_RESULT,
                schema: viewElementResultSchema,
            },
            {
                signal: SignalType.VIEW_COMPLETED,
                type: DataType.VIEW_COMPLETED_RESULT,
                schema: viewCompletedSchema,
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
            },
        ],
    };

    private static reactToSchema(): string[] {
        const {
            reactTo = [],
        } = Schema.disposition;
        return [
            ...reactTo,
            SchemaSignalType.VALIDATED,
            SchemaSignalType.ERROR,
        ];
    }

    private static reactToDecision(): string[] {
        const {
            reactTo = [],
        } = Decision.disposition;
        return [
            ...reactTo,
            DecisionSignalType.DECIDED,
            DecisionSignalType.ERROR,
        ];
    }

    private static reactToCatalog(): string[] {
        const {
            reactTo = [],
        } = Catalog.disposition;
        return [
            ...reactTo,
            CatalogSignalType.LISTED,
            CatalogSignalType.ERROR,
        ];
    }

    private static reactToLayout(): string[] {
        const {
            reactTo = [],
        } = Layout.disposition;
        return [
            ...reactTo,
            LayoutSignalType.COMPLETED,
            LayoutSignalType.ERROR,
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

    private static reactToView(): string[] {
        const {
            reactTo = [],
        } = View.disposition;
        return [
            ...reactTo,
            ViewSignalType.ELEMENT_CREATED,
            ViewSignalType.COMPLETED,
            ViewSignalType.ERROR,
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

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.BUILD:
                this.handleBuild(signal);
                break;
            case SchemaSignalType.VALIDATED:
                this.handleSchemaValidated(signal);
                break;
            case SchemaSignalType.ERROR:
                this.handleSchemaError(signal);
                break;
            case CatalogSignalType.LISTED:
                this.handleCatalogListed(signal);
                break;
            case CatalogSignalType.ERROR:
                this.handleCatalogError(signal);
                break;
            case DecisionSignalType.DECIDED:
                this.handleDecisionDecided(signal);
                break;
            case DecisionSignalType.ERROR:
                this.handleDecisionError(signal);
                break;
            case LayoutSignalType.COMPLETED:
                this.handleLayoutCompleted(signal);
                break;
            case LayoutSignalType.ERROR:
                this.handleLayoutError(signal);
                break;
            case ViewSignalType.ELEMENT_CREATED:
                this.handleViewElementCreated(signal);
                break;
            case ViewSignalType.COMPLETED:
                this.handleViewCompleted(signal);
                break;
            case ViewSignalType.ERROR:
                this.handleViewError(signal);
                break;
        }
    }

    protected override receptors(): string[] {
        return super.receptors().filter(
            (property) => property !== LoggerSignalType.OBSERVE,
        );
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [Schema, this.createSchemaDisposition(`${id}:schema`)],
            [Catalog, this.createCatalogDisposition(`${id}:catalog`)],
            [Decision, this.createDecisionDisposition(`${id}:decision`)],
            [Layout, this.createLayoutDisposition(`${id}:layout`)],
            [View, this.createViewDisposition(`${id}:view`)],
            [Logger, this.createLoggerDisposition(`${id}:logger`)],
        ];
    }

    private createSchemaDisposition(id: string): Disposition {
        return {
            ...Schema.disposition,
            aim: {
                description: Schema.AIM,
                body: {
                    id,
                },
            },
        };
    }

    private createDecisionDisposition(id: string): Disposition {
        return {
            ...Decision.disposition,
            aim: {
                description: Decision.purpose,
                body: {
                    id,
                },
            },
        };
    }

    private createCatalogDisposition(id: string): Disposition {
        const {
            aim,
        } = Catalog.disposition;
        const {
            body,
        } = aim;
        return {
            ...Catalog.disposition,
            aim: {
                ...aim,
                body: {
                    ...body,
                    id,
                },
            },
        };
    }

    private createLayoutDisposition(id: string): Disposition {
        return {
            ...Layout.disposition,
            aim: {
                description: Layout.purpose,
                body: {
                    id,
                },
            },
        };
    }

    private createViewDisposition(id: string): Disposition {
        return {
            ...View.disposition,
            aim: {
                description: View.purpose,
                body: {
                    id,
                },
            },
        };
    }

    private createLoggerBody(id: string) {
        return {
            id,
            scope: Scope.FRONT,
            prefix: 'Builder Flow',
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

    private handleBuild(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SchemaSignalType.VALIDATE, {
            schema: requestSchema,
            value,
        });
    }

    private handleSchemaValidated(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            value: request,
        } = value as ValidatedResult;
        const validated = request as Request;
        const {
            correlationId,
        } = validated;
        this.pulse(CatalogSignalType.LIST, {
            correlationId,
            kinds: CATALOG_KINDS,
            context: validated,
        });
    }

    private handleSchemaError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            error,
        } = value as SchemaError;
        this.emitError(error, null, 0);
    }

    private handleCatalogListed(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            entries,
            context,
        } = value as CatalogResult;
        const request = context as Request;
        this.pulse(
            DecisionSignalType.DECIDE,
            this.createDecisionRequest(request, entries),
        );
    }

    private handleCatalogError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            error,
            context,
        } = value as CatalogFailure;
        this.emitError(
            error,
            correlationId,
            0,
            (context as Request | undefined) ?? null,
        );
    }

    private handleDecisionDecided(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            result: {
                selectedId,
                continuation,
            },
        } = value as DecisionResult;
        const {
            request,
            availableUcas,
        } = continuation as DecisionContinuation;
        this.pulse(SignalType.DECIDED, {
            correlationId,
            result: {
                path: selectedId as Path,
            },
        });
        if (selectedId === Path.LAYOUT) {
            this.pulse(
                LayoutSignalType.CREATE,
                this.createLayoutRequest(request, availableUcas),
            );
        }
        if (selectedId === Path.VIEW) {
            this.pulse(
                ViewSignalType.CREATE,
                this.createViewRequest(request, availableUcas),
            );
        }
    }

    private handleDecisionError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            error,
            attempts,
        } = value as DecisionFailure;
        this.emitError(error, correlationId, attempts);
    }

    private handleLayoutCompleted(signal: Signal): void {
        const {
            value,
        } = signal;
        const completion = value as LayoutCompleted;
        const {
            correlationId,
            targetAreaId,
            composition: {
                areas,
            },
            request,
        } = completion;
        const {
            attempt,
        } = request;
        if (this.isLayoutValid(completion)) {
            areas.forEach((area) => {
                this.pulse(SignalType.LAYOUT_AREA_CREATED, {
                    correlationId,
                    targetAreaId,
                    area,
                    request,
                });
                this.pulse(
                    SignalType.BUILD,
                    this.createAreaRequest(area, request),
                );
            });
            return;
        }
        if (attempt === 0) {
            this.pulse(LayoutSignalType.REPAIR, {
                completion,
                error: INVALID_LAYOUT_ERROR,
            });
            return;
        }
        this.emitError(
            INVALID_LAYOUT_ERROR,
            correlationId,
            attempt,
            this.createBuildRequest(request),
        );
    }

    private handleLayoutError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            error,
            request,
        } = value as LayoutFailure;
        this.emitError(
            error,
            correlationId,
            0,
            this.createBuildRequest(request),
        );
    }

    private handleViewElementCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(
            SignalType.VIEW_ELEMENT_CREATED,
            value as ViewElementResult,
        );
    }

    private handleViewCompleted(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(
            SignalType.VIEW_COMPLETED,
            value as ViewCompleted,
        );
    }

    private handleViewError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            correlationId,
            error,
        } = value as ViewFailure;
        this.emitError(error, correlationId, 0);
    }

    private createDecisionRequest(request: Request, entries: CatalogEntry[]): DecisionRequest {
        const {
            correlationId,
            areaId,
            name,
            aim,
            context: fulfillment,
        } = request;
        const availableUcas: AvailableUcas = {
            web: entries.filter(({
                kind,
            }) => kind === CatalogKind.WEB),
            logic: entries.filter(({
                kind,
            }) => kind === CatalogKind.LOGIC),
        };
        const context: DecisionContext = {
            area: {
                id: areaId,
                ...(name && {
                    name,
                }),
                aim,
                context: fulfillment,
            },
            availableUcas,
        };
        return {
            ...DECISION_REQUEST,
            context,
            continuation: {
                request,
                availableUcas,
            },
            correlationId,
        };
    }

    private createAreaRequest(area: LayoutArea, request: LayoutRequest): Request {
        const {
            id: areaId,
            name,
            purpose: aim,
        } = area;
        const {
            context: {
                fulfillment,
                browser,
                design,
                limits,
            },
        } = request;
        return {
            correlationId: crypto.randomUUID(),
            areaId,
            name,
            browser,
            design,
            aim,
            context: fulfillment,
            limits,
        };
    }

    private createBuildRequest(request: LayoutRequest): Request {
        const {
            correlationId,
            area: {
                id: areaId,
                name,
            },
            purpose: aim,
            context: {
                fulfillment,
                browser,
                design,
                limits,
                composition,
            },
        } = request;
        return {
            correlationId,
            areaId,
            ...(name && {
                name,
            }),
            browser,
            design,
            aim,
            context: fulfillment,
            limits,
            ...(composition && {
                composition,
            }),
        };
    }

    private extractLayoutComposition(composition?: Composition): LayoutComposition | undefined {
        if (composition && 'areas' in composition) {
            return composition as LayoutComposition;
        }
        return undefined;
    }

    private extractViewComposition(composition?: Composition): ViewComposition | undefined {
        if (composition && 'visual' in composition) {
            return composition as ViewComposition;
        }
        return undefined;
    }

    private createLayoutContext(request: Request, availableUcas: AvailableUcas): LayoutRequest['context'] {
        const {
            browser,
            design,
            context: fulfillment,
            limits,
            composition,
        } = request;
        const layoutComposition = this.extractLayoutComposition(composition);
        return {
            fulfillment,
            browser,
            design,
            limits,
            availableUcas,
            ...(layoutComposition && {
                composition: layoutComposition,
            }),
        };
    }

    private createLayoutRequest(request: Request, availableUcas: AvailableUcas): LayoutRequest {
        const {
            correlationId,
            areaId,
            name,
            aim,
        } = request;
        return {
            correlationId,
            area: {
                id: areaId,
                ...(name && {
                    name,
                }),
            },
            purpose: aim,
            decision: {
                path: Path.LAYOUT,
                minimumAreas: MINIMUM_LAYOUT_AREAS,
            },
            attempt: 0,
            context: this.createLayoutContext(request, availableUcas),
        };
    }

    private createViewContext(request: Request, availableUcas: AvailableUcas): ViewRequest['context'] {
        const {
            browser,
            design,
            context: fulfillment,
            limits,
            requirements,
            composition,
        } = request;
        const viewComposition = this.extractViewComposition(composition);
        return {
            fulfillment,
            browser,
            design,
            limits,
            availableUcas,
            ...(requirements && {
                requirements,
            }),
            ...(viewComposition && {
                composition: viewComposition,
            }),
        };
    }

    private createViewRequest(request: Request, availableUcas: AvailableUcas): ViewRequest {
        const {
            correlationId,
            areaId,
            name,
            aim,
        } = request;
        return {
            correlationId,
            area: {
                id: areaId,
                ...(name && {
                    name,
                }),
            },
            purpose: aim,
            attempt: 0,
            context: this.createViewContext(request, availableUcas),
        };
    }

    private isLayoutValid(completion: LayoutCompleted): boolean {
        const {
            composition: {
                areas,
            },
            request: {
                decision: {
                    minimumAreas,
                },
            },
        } = completion;
        return areas.length >= minimumAreas;
    }

    private emitError(
        error: unknown,
        correlationId: string | null,
        attempts: number,
        request: Request | null = null,
    ): void {
        this.pulse(SignalType.ERROR, {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            attempts,
            request,
        });
    }
}

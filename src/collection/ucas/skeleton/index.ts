import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { Placeholder } from '@uca/capability-placeholder';
import {
    SignalType as PlaceholderSignalType,
    type ErrorResult as PlaceholderError,
    type Result as PlaceholderResult,
} from '@uca/capability-placeholder/types';
import { Schema } from '@uca/capability-schema';
import {
    SignalType as SchemaSignalType,
    type ErrorResult as SchemaError,
    type ValidatedResult,
} from '@uca/capability-schema/types';
import { Box } from '@uca/box';
import {
    SignalType as BoxSignalType,
} from '@uca/box/types';
import { Picture } from '@uca/picture';
import {
    SignalType as PictureSignalType,
} from '@uca/picture/types';
import {
    DEFAULT_QUALITIES,
    ELEMENT_SUFFIX,
    FRAME_BORDER,
    __ID__,
} from './constants.js';
import {
    errorSchema,
    discardSchema,
    removeSchema,
    renderSchema,
    resultSchema,
} from './schema.js';
import {
    type Body,
    type DiscardPayload,
    type RemovePayload,
    type RenderPayload,
    type ValidationContext,
    DataType,
    SignalType,
} from './types.js';

export class Skeleton extends Uca<Body> {
    public static override purpose = 'Represent the pending construction state of a structural area';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Skeleton.purpose,
        },
        reactTo: [
            SignalType.RENDER,
            SignalType.REMOVE,
            SignalType.DISCARD,
            ...Skeleton.reactToSchema(),
            ...Skeleton.reactToPlaceholder(),
            ...Skeleton.reactToBox(),
            ...Skeleton.reactToPicture(),
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.RENDER_PAYLOAD,
                schema: renderSchema,
                description: 'Represent an area while its construction is pending',
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.REMOVE_PAYLOAD,
                schema: removeSchema,
                description: 'Finish the pending representation of an area',
            },
            {
                signal: SignalType.DISCARD,
                type: DataType.DISCARD_PAYLOAD,
                schema: discardSchema,
                description: 'Discard an invalid pending structural area',
            },
        ],
        outputs: [
            {
                signal: SignalType.RENDERED,
                type: DataType.RESULT,
                schema: resultSchema,
                description: 'Pending area representation created',
            },
            {
                signal: SignalType.REMOVED,
                type: DataType.RESULT,
                schema: resultSchema,
                description: 'Pending area representation removed',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                schema: errorSchema,
                description: 'Pending area representation failed',
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

    private static reactToPlaceholder(): string[] {
        const {
            reactTo = [],
        } = Placeholder.disposition;
        return [
            ...reactTo,
            PlaceholderSignalType.GENERATED,
            PlaceholderSignalType.ERROR,
        ];
    }

    private static reactToBox(): string[] {
        const {
            reactTo = [],
        } = Box.disposition;
        return [
            ...reactTo,
            BoxSignalType.ERROR,
        ];
    }

    private static reactToPicture(): string[] {
        const {
            reactTo = [],
        } = Picture.disposition;
        return [
            ...reactTo,
            PictureSignalType.CREATED,
            PictureSignalType.REMOVED,
            PictureSignalType.ERROR,
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
            case SignalType.RENDER:
                this.handleRender(signal);
                break;
            case SignalType.REMOVE:
                this.handleRemove(signal);
                break;
            case SignalType.DISCARD:
                this.handleDiscard(signal);
                break;
            case SchemaSignalType.VALIDATED:
                this.handleValidated(signal);
                break;
            case SchemaSignalType.ERROR:
                this.handleSchemaError(signal);
                break;
            case PlaceholderSignalType.GENERATED:
                this.handlePlaceholderGenerated(signal);
                break;
            case PlaceholderSignalType.ERROR:
                this.handlePlaceholderError(signal);
                break;
            case BoxSignalType.ERROR:
                this.handleBoxError(signal);
                break;
            case PictureSignalType.CREATED:
                this.handlePictureCreated(signal);
                break;
            case PictureSignalType.REMOVED:
                this.handlePictureRemoved(signal);
                break;
            case PictureSignalType.ERROR:
                this.handlePictureError(signal);
                break;
        }
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [Schema, this.createSchemaDisposition(`${id}:schema`)],
            [Placeholder, this.createPlaceholderDisposition(`${id}:placeholder`)],
            [Box, this.createBoxDisposition(`${id}:box`)],
            [Picture, this.createPictureDisposition(`${id}:picture`)],
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

    private createPlaceholderDisposition(id: string): Disposition {
        return {
            ...Placeholder.disposition,
            aim: {
                description: Placeholder.AIM,
                body: {
                    id,
                },
            },
        };
    }

    private createBoxDisposition(id: string): Disposition {
        return {
            ...Box.disposition,
            aim: {
                description: Box.purpose,
                body: {
                    id,
                },
            },
        };
    }

    private createPictureDisposition(id: string): Disposition {
        return {
            ...Picture.disposition,
            aim: {
                description: Picture.purpose,
                body: {
                    id,
                },
            },
        };
    }

    private handleRender(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SchemaSignalType.VALIDATE, {
            schema: renderSchema,
            value,
            context: {
                operation: SignalType.RENDER,
                request: value,
            },
        });
    }

    private handleRemove(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SchemaSignalType.VALIDATE, {
            schema: removeSchema,
            value,
            context: {
                operation: SignalType.REMOVE,
                request: value,
            },
        });
    }

    private handleDiscard(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SchemaSignalType.VALIDATE, {
            schema: discardSchema,
            value,
            context: {
                operation: SignalType.DISCARD,
                request: value,
            },
        });
    }

    private handleValidated(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            value: validated,
            context,
        } = value as ValidatedResult;
        const {
            operation,
        } = context as ValidationContext;
        switch (operation) {
            case SignalType.RENDER:
                this.renderValidated(validated as RenderPayload);
                break;
            case SignalType.REMOVE:
                this.removeValidated(validated as RemovePayload);
                break;
            case SignalType.DISCARD:
                this.discardValidated(validated as DiscardPayload);
                break;
        }
    }

    private discardValidated(request: DiscardPayload): void {
        const {
            areaId,
        } = request;
        this.pulse(BoxSignalType.REMOVE, {
            elementId: areaId,
        });
    }

    private renderValidated(request: RenderPayload): void {
        const {
            areaId,
            parentTo,
            areaQualities,
            name,
            dimensions,
            context,
        } = request;
        if (parentTo) {
            this.pulse(BoxSignalType.RENDER, {
                elementId: areaId,
                parentTo,
                qualities: {
                    ...areaQualities,
                    border: FRAME_BORDER,
                },
            });
        }
        this.pulse(PlaceholderSignalType.GENERATE, {
            areaId,
            kind: name,
            dimensions,
            context,
        });
    }

    private removeValidated(request: RemovePayload): void {
        const {
            areaId,
            areaQualities,
        } = request;
        if (areaQualities) {
            this.pulse(BoxSignalType.UPDATE, {
                elementId: areaId,
                qualities: areaQualities,
            });
        }
        this.pulse(PictureSignalType.REMOVE, {
            elementId: `${areaId}${ELEMENT_SUFFIX}`,
        });
    }

    private handlePlaceholderGenerated(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            areaId,
            source,
            context,
        } = value as PlaceholderResult;
        this.pulse(PictureSignalType.RENDER, {
            elementId: `${areaId}${ELEMENT_SUFFIX}`,
            parentTo: areaId,
            src: source,
            qualities: {
                ...DEFAULT_QUALITIES,
            },
            ...(context !== undefined && {
                context,
            }),
        });
    }

    private handlePictureCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            elementId,
            context,
        } = value as {
            elementId: string;
            context?: unknown;
        };
        this.pulse(SignalType.RENDERED, this.createResult(elementId, context));
    }

    private handlePictureRemoved(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            elementId,
            context,
        } = value as {
            elementId: string;
            context?: unknown;
        };
        this.pulse(SignalType.REMOVED, this.createResult(elementId, context));
    }

    private handleSchemaError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            error,
            context,
        } = value as SchemaError;
        const {
            request,
        } = context as ValidationContext;
        const {
            areaId = null,
        } = request as {
            areaId?: string;
        };
        this.emitError(error, areaId, request);
    }

    private handlePlaceholderError(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            areaId,
            error,
            context,
        } = value as PlaceholderError;
        this.emitError(error, areaId, context);
    }

    private handleBoxError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.emitError(value);
    }

    private handlePictureError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.emitError(value);
    }

    private createResult(elementId: string, context?: unknown): object {
        const areaId = elementId.endsWith(ELEMENT_SUFFIX)
            ? elementId.slice(0, -ELEMENT_SUFFIX.length)
            : elementId;
        return {
            areaId,
            elementId,
            ...(context !== undefined && {
                context,
            }),
        };
    }

    private emitError(error: unknown, areaId: string | null = null, context?: unknown): void {
        this.pulse(SignalType.ERROR, {
            areaId,
            error: error instanceof Error ? error.message : String(error),
            ...(context !== undefined && {
                context,
            }),
        });
    }
}

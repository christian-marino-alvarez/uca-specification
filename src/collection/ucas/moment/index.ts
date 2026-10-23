import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Presentation } from '@uca/capability-presentation';
import { Kind } from '@uca/capability-presentation/types';
import { SignalType as ComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { stylePayload, cssDeclaration, presentationDeclaration } from '../declaration.js';
import { Operation, type Interaction, type Lifecycle } from '../types.js';
import { bodySchema, renderPayloadSchema } from './schema.js';
import { __ID__, OPERATIONS, INVALID_BOUNDS } from './constants.js';
import { DataType, SignalType, type Body } from './types.js';

export class Moment extends Uca<Body> {
    public static override purpose = 'Express a calendar date independently of an input platform';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Moment.purpose,
        },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
            ...Moment.reactToPresentation(),
            ...Moment.reactToCss(),
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.RENDER_PAYLOAD,
                schema: renderPayloadSchema,
            },
            {
                signal: SignalType.UPDATE,
                type: DataType.BODY,
                schema: bodySchema,
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.BODY,
                schema: bodySchema,
            },
        ],
        outputs: [
            {
                signal: SignalType.CREATED,
                type: DataType.BODY,
                schema: bodySchema,
            },
            {
                signal: SignalType.UPDATED,
                type: DataType.BODY,
                schema: bodySchema,
            },
            {
                signal: SignalType.REMOVED,
                type: DataType.BODY,
                schema: bodySchema,
            },
            {
                signal: SignalType.CHANGED,
                type: DataType.BODY,
                schema: bodySchema,
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
            },
        ],
    };

    private static reactToPresentation(): string[] {
        const {
            reactTo = [],
        } = Presentation.disposition;
        return reactTo.concat(
            ComponentSignalType.RENDERED,
            ComponentSignalType.UPDATED,
            ComponentSignalType.REMOVED,
            ComponentSignalType.EVENT,
            ComponentSignalType.ERROR,
        );
    }

    private static reactToCss(): string[] {
        const {
            reactTo = [],
        } = Css.disposition;
        return [
            ...reactTo,
            CssSignalType.ERROR,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        switch (property) {
            case SignalType.RENDER:
                this.handleRender(value);
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            case ComponentSignalType.RENDERED:
                this.handleCreated(value as Lifecycle<Body>);
                break;
            case ComponentSignalType.UPDATED:
                this.handleUpdated(value as Lifecycle<Body>);
                break;
            case ComponentSignalType.REMOVED:
                this.handleRemoved(value as Lifecycle<Body>);
                break;
            case ComponentSignalType.EVENT:
                this.handleInteraction(value);
                break;
            case ComponentSignalType.ERROR:
                this.handlePresentationError(value);
                break;
            case CssSignalType.ERROR:
                this.handleCssError(value);
                break;
        }
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            presentationDeclaration(id, Kind.MOMENT),
            cssDeclaration(id),
        ];
    }

    private handleRender(value: unknown): void {
        const body = this.domainBody(value);
        const coherent = this.isCoherent(body);
        this.pulse(coherent ? OPERATIONS[Operation.RENDER] : SignalType.ERROR, coherent ? body : INVALID_BOUNDS);
    }

    private handleUpdate(value: unknown): void {
        const body = this.domainBody(value);
        const coherent = this.isCoherent(body);
        this.pulse(coherent ? OPERATIONS[Operation.UPDATE] : SignalType.ERROR, coherent ? body : INVALID_BOUNDS);
    }

    private handleRemove(value: unknown): void {
        const body = this.domainBody(value);
        this.pulse(OPERATIONS[Operation.REMOVE], body);
    }

    private domainBody(value: unknown): Body {
        const {
            aim,
        } = this.disposition;
        const body = Object.assign({}, aim.body, value as Body);
        const {
            elementId = this.id,
        } = body;
        return Object.assign(body, {
            elementId,
        });
    }

    private handleCreated(payload: Lifecycle<Body>): void {
        const {
            context: body,
        } = payload;
        this.pulse(CssSignalType.APPLY, stylePayload(body));
        this.pulse(SignalType.CREATED, body);
    }

    private handleUpdated(payload: Lifecycle<Body>): void {
        const {
            context: body,
        } = payload;
        this.pulse(CssSignalType.APPLY, stylePayload(body));
        this.pulse(SignalType.UPDATED, body);
    }

    private handleRemoved(payload: Lifecycle<Body>): void {
        const {
            context: body,
        } = payload;
        const {
            elementId,
        } = body;
        this.pulse(CssSignalType.REMOVE, {
            elementId,
        });
        this.pulse(SignalType.REMOVED, body);
    }

    private handleInteraction(payload: unknown): void {
        const body = this.interactionBody(payload as Interaction<Body>);
        const coherent = this.isCoherent(body);
        this.pulse(coherent ? OPERATIONS[Operation.CHANGE] : SignalType.ERROR, coherent ? body : INVALID_BOUNDS);
    }

    private interactionBody(payload: Interaction<Body>): Body {
        const {
            context: body,
            value: selectedValue,
        } = payload;
        return Object.assign({}, body, {
            value: selectedValue,
        });
    }

    private handlePresentationError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleCssError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private isCoherent(body: Body): boolean {
        const {
            minimum,
            maximum,
            value,
        } = body;
        return (minimum === undefined || maximum === undefined || minimum <= maximum)
            && (value === undefined || minimum === undefined || value >= minimum)
            && (value === undefined || maximum === undefined || value <= maximum);
    }
}

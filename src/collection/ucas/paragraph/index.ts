import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Presentation } from '@uca/capability-presentation';
import { Kind } from '@uca/capability-presentation/types';
import { SignalType as ComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { cssDeclaration, presentationDeclaration } from '../declaration.js';
import { Operation, type Interaction, type Lifecycle } from '../types.js';
import { bodySchema, renderPayloadSchema } from './schema.js';
import {
    OPERATIONS,
    PARAGRAPH_VISUAL_DISPOSITION,
    __ID__,
    resolveParagraphQualities,
} from './constants.js';
import { DataType, SignalType, type Body } from './types.js';

export class Paragraph extends Uca<Body> {
    public static override purpose = 'Express one coherent block of textual content';

    public static readonly visualDisposition = PARAGRAPH_VISUAL_DISPOSITION;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Paragraph.purpose,
        },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
            ...Paragraph.reactToPresentation(),
            ...Paragraph.reactToCss(),
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
            presentationDeclaration(id, Kind.PARAGRAPH),
            cssDeclaration(id),
        ];
    }

    private handleRender(value: unknown): void {
        const body = this.domainBody(value);
        this.pulse(OPERATIONS[Operation.RENDER], body);
    }

    private handleUpdate(value: unknown): void {
        const body = this.domainBody(value);
        this.pulse(OPERATIONS[Operation.UPDATE], body);
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

    private applyParagraphQualities(body: Body): void {
        const {
            elementId,
            qualities,
        } = body;
        const resolvedQualities = resolveParagraphQualities(qualities);
        this.pulse(CssSignalType.APPLY, {
            elementId,
            qualities: resolvedQualities,
        });
    }

    private handleCreated(payload: Lifecycle<Body>): void {
        const {
            context: body,
        } = payload;
        this.applyParagraphQualities(body);
        this.pulse(SignalType.CREATED, body);
    }

    private handleUpdated(payload: Lifecycle<Body>): void {
        const {
            context: body,
        } = payload;
        this.applyParagraphQualities(body);
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
        const {
            context: body,
        } = payload as Interaction<Body>;
        this.pulse(OPERATIONS[Operation.CHANGE], body);
    }

    private handlePresentationError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleCssError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }
}

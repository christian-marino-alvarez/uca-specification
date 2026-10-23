import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import {
    CARD_VISUAL_DISPOSITION,
    DEFAULT_EVENTS,
    DEFAULT_TAG,
    __ID__,
    resolveCardContent,
    resolveCardQualities,
    resolveContainerSelector,
} from './constants.js';
import {
    type Body,
    DataType,
    SignalType,
} from './types.js';

export class Card extends Uca<Body> {
    public static override purpose: string =
        'Autonomous structured containment unit providing Material Design 3 elevated, filled, and outlined surfaces';

    public static readonly visualDisposition = CARD_VISUAL_DISPOSITION;

    public static override disposition: Disposition<Body> = {
        aim: { description: Card.purpose },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
            WebComponentSignalType.RENDERED,
            WebComponentSignalType.UPDATED,
            WebComponentSignalType.REMOVED,
            WebComponentSignalType.ERROR,
            WebComponentSignalType.EVENT,
            ...WebComponent.disposition.reactTo ?? [],
            ...Css.disposition.reactTo ?? [],
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.RENDER_PAYLOAD,
                description: 'Render the Material 3 card container',
            },
            {
                signal: SignalType.UPDATE,
                type: DataType.UPDATE_PAYLOAD,
                description: 'Update the card properties and content',
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.REMOVE_PAYLOAD,
                description: 'Remove the card element',
            },
        ],
        outputs: [
            {
                signal: SignalType.CREATED,
                type: DataType.CREATED_RESULT,
                description: 'Card rendered confirmation',
            },
            {
                signal: SignalType.UPDATED,
                type: DataType.UPDATED_RESULT,
                description: 'Card updated confirmation',
            },
            {
                signal: SignalType.REMOVED,
                type: DataType.REMOVED_RESULT,
                description: 'Card removed confirmation',
            },
            {
                signal: SignalType.CLICKED,
                type: DataType.CLICKED_RESULT,
                description: 'Card interaction event',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
                description: 'Card error notification',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { id } = this;
        return [
            [
                WebComponent,
                {
                    aim: { description: WebComponent.AIM, body: { id: `${id}:web-component` } },
                    reactTo: [...WebComponent.disposition.reactTo ?? []],
                },
            ],
            [
                Css,
                {
                    aim: { description: Css.AIM, body: { id: `${id}:css` } },
                    reactTo: [...Css.disposition.reactTo ?? []],
                },
            ],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
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
            case WebComponentSignalType.RENDERED:
                this.handleComponentRendered(signal);
                break;
            case WebComponentSignalType.UPDATED:
                this.handleComponentUpdated(signal);
                break;
            case WebComponentSignalType.ERROR:
                this.handleComponentError(signal);
                break;
            case WebComponentSignalType.REMOVED:
                this.handleComponentRemoved(signal);
                break;
            case WebComponentSignalType.EVENT:
                this.handleComponentEvent(signal);
                break;
            default:
                break;
        }
    }

    private handleRender(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const { elementId = this.id, parentTo, containerElement, qualities, events = [...DEFAULT_EVENTS], context, variant } = payload;
        const targetContainer = resolveContainerSelector(containerElement, parentTo);
        const resolvedQualities = resolveCardQualities(qualities, variant);
        const content = resolveCardContent(payload);
        this.pulse(CssSignalType.APPLY, { elementId, qualities: resolvedQualities });
        this.pulse(WebComponentSignalType.RENDER, { elementId, tag: DEFAULT_TAG, containerElement: targetContainer, content, events, context });
    }

    private handleUpdate(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const { elementId = this.id, qualities, events, context, variant } = payload;
        const resolvedQualities = resolveCardQualities(qualities, variant);
        const content = resolveCardContent(payload);
        this.pulse(CssSignalType.APPLY, { elementId, qualities: resolvedQualities });
        this.pulse(WebComponentSignalType.UPDATE, { elementId, content, events, context });
    }

    private handleRemove(value?: unknown): void {
        const { elementId = this.id, context } = (value ?? {}) as Body & { context?: unknown };
        this.pulse(CssSignalType.REMOVE, { elementId });
        this.pulse(WebComponentSignalType.REMOVE, { elementId, context });
    }

    private handleComponentRendered(signal: Signal): void {
        const { value } = signal;
        const { elementId = this.id } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.CREATED, { elementId, detail: value });
    }

    private handleComponentUpdated(signal: Signal): void {
        const { value } = signal;
        const { elementId = this.id } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.UPDATED, { elementId, detail: value });
    }

    private handleComponentRemoved(signal: Signal): void {
        const { value } = signal;
        const { elementId = this.id } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.REMOVED, { elementId, detail: value });
    }

    private handleComponentEvent(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.CLICKED, value);
    }

    private handleComponentError(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.ERROR, value);
    }
}

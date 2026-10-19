import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { __ID__ } from './constants.js';
import { type Body, type CreatedResult, type EventContext, DataType, SignalType } from './types.js';

export class Box extends Uca<Body> {
    public static override purpose: string = 'Autonomous spatial container that groups, distributes, and visually delimits elements through dimension, layout, and appearance qualities';

    public static override disposition: Disposition<Body> = {
        aim: { description: Box.purpose },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
            WebComponentSignalType.RENDERED,
            WebComponentSignalType.UPDATED,
            WebComponentSignalType.REMOVED,
            WebComponentSignalType.EVENT,
            WebComponentSignalType.ERROR,
            ...WebComponent.disposition.reactTo ?? [],
            ...Css.disposition.reactTo ?? [],
        ],
        inputs: [
            { signal: SignalType.RENDER, type: DataType.RENDER_PAYLOAD, description: 'Command to render the box' },
            { signal: SignalType.UPDATE, type: DataType.UPDATE_PAYLOAD, description: 'Command to update the box' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Command to remove the box' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.CREATED_RESULT, description: 'Box created confirmation' },
            { signal: SignalType.UPDATED, type: DataType.UPDATED_RESULT, description: 'Box updated confirmation' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Box removed confirmation' },
            { signal: SignalType.EVENT, type: DataType.EVENT_CONTEXT, description: 'Box interaction event triggered' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Box error notification' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const { id } = this;
        const declarations: Cooky = [
            [WebComponent, { aim: { description: WebComponent.AIM, body: { id: `${id}:web-component` } }, reactTo: [...WebComponent.disposition.reactTo ?? []] }],
            [Css, { aim: { description: Css.AIM, body: { id: `${id}:css` } }, reactTo: [...Css.disposition.reactTo ?? []] }],
        ];
        return declarations;
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
            case WebComponentSignalType.REMOVED:
                this.handleComponentRemoved(signal);
                break;
            case WebComponentSignalType.ERROR:
                this.handleComponentError(signal);
                break;
            case WebComponentSignalType.EVENT:
                this.handleComponentEvent(signal);
                break;
            default:
                break;
        }
    }

    private handleRender(value?: unknown): void {
        const { elementId = this.id, parentTo, containerElement, content, qualities, events, context } = (value ?? {}) as Body & { context?: unknown };
        const targetContainer = containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);
        if (qualities) { this.pulse(CssSignalType.APPLY, { elementId, qualities }); }
        this.pulse(WebComponentSignalType.RENDER, { elementId, containerElement: targetContainer, content, events, context });
    }

    private handleUpdate(value?: unknown): void {
        const { elementId = this.id, content, qualities, events, context } = (value ?? {}) as Body & { context?: unknown };
        if (qualities) { this.pulse(CssSignalType.APPLY, { elementId, qualities }); }
        this.pulse(WebComponentSignalType.UPDATE, { elementId, content, events, context });
    }

    private handleRemove(value?: unknown): void {
        const { elementId = this.id, context } = (value ?? {}) as Body & { context?: unknown };
        this.pulse(CssSignalType.REMOVE, { elementId });
        this.pulse(WebComponentSignalType.REMOVE, { elementId, context });
    }

    private handleComponentRendered(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            elementId,
            context,
        } = value as CreatedResult;
        this.pulse(SignalType.CREATED, {
            elementId,
            context,
        });
    }

    private handleComponentError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
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
        const { elementId, event, action, value: eventValue, checked, detail, context } = (value ?? {}) as EventContext & { context?: unknown };
        if (!elementId) { return; }
        this.pulse(SignalType.EVENT, { elementId, event, action, value: eventValue, checked, detail, context });
    }
}

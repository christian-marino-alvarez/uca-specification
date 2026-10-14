import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { __ID__ } from './constants.js';
import { type Body, type EventContext, DataType, SignalType } from './types.js';

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
                this.handleComponentRendered(value);
                break;
            case WebComponentSignalType.UPDATED:
                this.handleComponentUpdated(value);
                break;
            case WebComponentSignalType.REMOVED:
                this.handleComponentRemoved(value);
                break;
            case WebComponentSignalType.EVENT:
                this.handleComponentEvent(value);
                break;
            default:
                break;
        }
    }

    private handleRender(value?: unknown): void {
        const { elementId = this.id, parentTo, containerElement, content, qualities, events } = (value ?? {}) as Body;
        const targetContainer = containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);
        if (qualities) { this.pulse(CssSignalType.APPLY, { id: `${this.id}:css`, elementId, qualities }); }
        this.pulse(WebComponentSignalType.RENDER, { id: `${this.id}:web-component`, elementId, containerElement: targetContainer, content, events });
    }

    private handleUpdate(value?: unknown): void {
        const { elementId = this.id, content, qualities, events } = (value ?? {}) as Body;
        if (qualities) { this.pulse(CssSignalType.APPLY, { id: `${this.id}:css`, elementId, qualities }); }
        this.pulse(WebComponentSignalType.UPDATE, { id: `${this.id}:web-component`, elementId, content, events });
    }

    private handleRemove(value?: unknown): void {
        const { elementId = this.id } = (value ?? {}) as Body;
        this.pulse(CssSignalType.REMOVE, { elementId });
        this.pulse(WebComponentSignalType.REMOVE, { elementId });
    }

    private handleComponentRendered(value?: unknown): void {
        const { elementId = this.id, tag } = (value ?? {}) as { elementId?: string; tag?: string };
        if (tag === 'img') { return; }
        this.pulse(SignalType.CREATED, { elementId, detail: value });
    }

    private handleComponentUpdated(value?: unknown): void {
        const { elementId = this.id } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.UPDATED, { elementId, detail: value });
    }

    private handleComponentRemoved(value?: unknown): void {
        const { elementId = this.id } = (value ?? {}) as { elementId?: string };
        this.pulse(SignalType.REMOVED, { elementId, detail: value });
    }

    private handleComponentEvent(value?: unknown): void {
        const { elementId, event, action, value: eventVal, checked, detail } = (value ?? {}) as EventContext;
        if (!elementId) { return; }
        this.pulse(SignalType.EVENT, { elementId, event, action, value: eventVal, checked, detail });
    }
}

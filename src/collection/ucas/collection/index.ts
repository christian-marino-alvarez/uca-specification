import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { __ID__, DEFAULT_EVENTS, DEFAULT_METHOD, DEFAULT_TAG, buildCollectionAttributes, resolveContainerSelector } from './constants.js';
import { type Body, type EventContext, DataType, SignalType } from './types.js';

export class Collection extends Uca<Body> {
    public static override purpose: string = 'Autonomous data collection container that groups interactive fields, orchestrates user input, and handles form submission';

    public static override disposition: Disposition<Body> = {
        aim: { description: Collection.purpose },
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
            { signal: SignalType.RENDER, type: DataType.RENDER_PAYLOAD, description: 'Command to render the form collection' },
            { signal: SignalType.UPDATE, type: DataType.UPDATE_PAYLOAD, description: 'Command to update the form collection' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Command to remove the form collection' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.CREATED_RESULT, description: 'Form collection created confirmation' },
            { signal: SignalType.UPDATED, type: DataType.UPDATED_RESULT, description: 'Form collection updated confirmation' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Form collection removed confirmation' },
            { signal: SignalType.EVENT, type: DataType.EVENT_CONTEXT, description: 'Form collection interaction event triggered' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Form collection error notification' },
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
        const { elementId = this.id, parentTo, containerElement, content, qualities, events = [...DEFAULT_EVENTS], context } = payload;
        const targetContainer = resolveContainerSelector(containerElement, parentTo);
        const attributes = buildCollectionAttributes(payload, DEFAULT_METHOD);
        if (qualities) { this.pulse(CssSignalType.APPLY, { elementId, qualities }); }
        this.pulse(WebComponentSignalType.RENDER, { elementId, tag: DEFAULT_TAG, containerElement: targetContainer, attributes, content, events, context });
    }

    private handleUpdate(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const { elementId = this.id, content, qualities, events, context } = payload;
        const attributes = buildCollectionAttributes(payload);
        if (qualities) { this.pulse(CssSignalType.APPLY, { elementId, qualities }); }
        this.pulse(WebComponentSignalType.UPDATE, { elementId, attributes, content, events, context });
    }

    private handleRemove(value?: unknown): void {
        const { elementId = this.id, context } = (value ?? {}) as Body & { context?: unknown };
        this.pulse(CssSignalType.REMOVE, { elementId });
        this.pulse(WebComponentSignalType.REMOVE, { elementId, context });
    }

    private handleComponentRendered(signal: Signal): void {
        const { value } = signal;
        const { elementId = this.id, tag } = (value ?? {}) as { elementId?: string; tag?: string };
        if (tag && tag !== DEFAULT_TAG) { return; }
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
        const { elementId, event, action, value: eventValue, checked, detail, context } = (value ?? {}) as EventContext & { context?: unknown };
        if (!elementId) { return; }
        this.pulse(SignalType.EVENT, { elementId, event, action, value: eventValue, checked, detail, context });
    }
    private handleComponentError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }

}

import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType, ControlType } from '@uca/capability-css/types';
import { __ID__, DEFAULT_EVENTS, DEFAULT_TAG, DEFAULT_TYPE, buildInputAttributes, resolveContainerSelector } from './constants.js';
import { type Body, type EventContext, DataType, SignalType } from './types.js';

export class Input extends Uca<Body> {
    public static override purpose: string = 'Autonomous text entry unit that captures, validates, and emits user text input through a native input field';

    public static override disposition: Disposition<Body> = {
        aim: { description: Input.purpose },
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
            { signal: SignalType.RENDER, type: DataType.RENDER_PAYLOAD, description: 'Command to render the text input' },
            { signal: SignalType.UPDATE, type: DataType.UPDATE_PAYLOAD, description: 'Command to update the text input' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Command to remove the text input' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.CREATED_RESULT, description: 'Text input created confirmation' },
            { signal: SignalType.UPDATED, type: DataType.UPDATED_RESULT, description: 'Text input updated confirmation' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Text input removed confirmation' },
            { signal: SignalType.EVENT, type: DataType.EVENT_CONTEXT, description: 'Text input interaction event triggered' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Text input error notification' },
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
            case WebComponentSignalType.EVENT:
                this.handleComponentEvent(signal);
                break;
            default:
                break;
        }
    }

    private handleRender(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const { elementId = this.id, parentTo, containerElement, qualities, events = [...DEFAULT_EVENTS], context } = payload;
        const targetContainer = resolveContainerSelector(containerElement, parentTo);
        const attributes = buildInputAttributes(payload, DEFAULT_TYPE);
        this.pulse(CssSignalType.APPLY, { elementId, qualities: qualities ?? {}, control: ControlType.INPUT });
        this.pulse(WebComponentSignalType.RENDER, { elementId, tag: DEFAULT_TAG, containerElement: targetContainer, attributes, events, context });
    }

    private handleUpdate(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const { elementId = this.id, qualities, events, context } = payload;
        const attributes = buildInputAttributes(payload);
        this.pulse(CssSignalType.APPLY, { elementId, qualities: qualities ?? {}, control: ControlType.INPUT });
        this.pulse(WebComponentSignalType.UPDATE, { elementId, attributes, events, context });
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
}

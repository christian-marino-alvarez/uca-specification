import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType, ControlType } from '@uca/capability-css/types';
import {
    DEFAULT_EVENTS,
    DEFAULT_SLIDER_QUALITIES,
    DEFAULT_TAG,
    SLIDER_VISUAL_DISPOSITION,
    __ID__,
    buildSliderAttributes,
    resolveContainerSelector,
} from './constants.js';
import {
    type Body,
    DataType,
    SignalType,
} from './types.js';

export class Slider extends Uca<Body> {
    public static override purpose: string =
        'Autonomous range selection unit that captures and adjusts continuous or discrete values along a track';

    public static readonly visualDisposition = SLIDER_VISUAL_DISPOSITION;

    public static override disposition: Disposition<Body> = {
        aim: { description: Slider.purpose },
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
                description: 'Render the Material 3 slider element',
            },
            {
                signal: SignalType.UPDATE,
                type: DataType.UPDATE_PAYLOAD,
                description: 'Update the slider value and constraints',
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.REMOVE_PAYLOAD,
                description: 'Remove the slider element',
            },
        ],
        outputs: [
            {
                signal: SignalType.CREATED,
                type: DataType.CREATED_RESULT,
                description: 'Slider created confirmation',
            },
            {
                signal: SignalType.UPDATED,
                type: DataType.UPDATED_RESULT,
                description: 'Slider updated confirmation',
            },
            {
                signal: SignalType.REMOVED,
                type: DataType.REMOVED_RESULT,
                description: 'Slider removed confirmation',
            },
            {
                signal: SignalType.CHANGED,
                type: DataType.CHANGED_RESULT,
                description: 'Slider value changed event',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
                description: 'Slider error notification',
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
        const { elementId = this.id, parentTo, containerElement, qualities, events = [...DEFAULT_EVENTS], context } = payload;
        const targetContainer = resolveContainerSelector(containerElement, parentTo);
        const attributes = buildSliderAttributes(payload);
        const resolvedQualities = { ...DEFAULT_SLIDER_QUALITIES, ...qualities };
        this.pulse(CssSignalType.APPLY, { elementId, qualities: resolvedQualities, control: ControlType.INPUT });
        this.pulse(WebComponentSignalType.RENDER, { elementId, tag: DEFAULT_TAG, containerElement: targetContainer, attributes, events, context });
    }

    private handleUpdate(value?: unknown): void {
        const payload = (value ?? {}) as Body & { context?: unknown };
        const { elementId = this.id, qualities, events, context } = payload;
        const attributes = buildSliderAttributes(payload);
        const resolvedQualities = { ...DEFAULT_SLIDER_QUALITIES, ...qualities };
        this.pulse(CssSignalType.APPLY, { elementId, qualities: resolvedQualities, control: ControlType.INPUT });
        this.pulse(WebComponentSignalType.UPDATE, { elementId, attributes, events, context });
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
        this.pulse(SignalType.CHANGED, value);
    }

    private handleComponentError(signal: Signal): void {
        const { value } = signal;
        this.pulse(SignalType.ERROR, value);
    }
}

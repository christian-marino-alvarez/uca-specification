import { createPayload, lifecycleChannel } from './projection.js';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as ComponentSignalType } from '@uca/capability-web-component/types';
import type { Disposition, Signal } from '@uca/core/types';
import {
    ACCESS_EVENTS,
    CONTROL_EVENTS,
    CONTROL_KINDS,
    DEFAULT_KIND,
    EMPTY_EVENTS,
    MANAGED_ATTRIBUTES,
    LIFECYCLE_SIGNALS,
    KIND_EVENTS,
    PROJECTORS,
    __ID__,
} from './constants.js';

import { DataType, Kind, SignalType, type Body, type Content, type Payload, type Response } from './types.js';

export class Presentation extends WebComponent {
    public static override readonly AIM = 'Transduce domain presentation primitives into native web element representations';

    public static override disposition: Disposition<Body> = {
        ...WebComponent.disposition,
        aim: {
            description: Presentation.AIM,
        },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.CONTENT,
            },
            {
                signal: SignalType.UPDATE,
                type: DataType.CONTENT,
            },
            {
                signal: SignalType.REMOVE,
                type: DataType.CONTENT,
            },
        ],
    };

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
                this.handlePresentationRender(value as Content);
                break;
            case SignalType.UPDATE:
                this.handlePresentationUpdate(value as Content);
                break;
            case SignalType.REMOVE:
                this.handlePresentationRemove(value as Content);
                break;
        }
    }

    protected override pulse(property: string, value: unknown, targetId?: string): Signal | undefined {
        const {
            property: channel,
            value: payload,
        } = lifecycleChannel(property, value);
        return super.pulse(channel, payload, targetId);
    }

    private handlePresentationRender(body: Content): void {
        const payload = this.project(body, SignalType.RENDER);
        super.react({
            source: this.id,
            property: ComponentSignalType.RENDER,
            value: payload,
        });
    }

    private handlePresentationUpdate(body: Content): void {
        const payload = this.project(body, SignalType.UPDATE);
        this.synchronizeElement(payload);
        super.react({
            source: this.id,
            property: this.updateOperation(payload),
            value: payload,
        });
    }

    private handlePresentationRemove(body: Content): void {
        const value = this.project(body, SignalType.REMOVE);
        super.react({
            source: this.id,
            property: ComponentSignalType.REMOVE,
            value,
        });
    }

    private project(body: Content, operation: SignalType): Payload {
        const {
            aim,
        } = this.disposition;
        const {
            kind = DEFAULT_KIND,
        } = (aim.body ?? {}) as Body;
        return createPayload(PROJECTORS[kind](body), KIND_EVENTS[kind], body, operation);
    }

    private synchronizeElement(payload: Payload): void {
        const {
            elementId = this.id,
            attributes = {},
        } = payload;
        const element = document.getElementById(elementId);
        MANAGED_ATTRIBUTES.filter((name) => !(name in attributes)).forEach((name) => element?.removeAttribute(name));
        if (element?.tagName === 'INPUT') {
            (element as HTMLInputElement).checked = 'checked' in attributes;
        }
    }
    private updateOperation(payload: Payload): ComponentSignalType {
        const {
            elementId = this.id,
            tag,
        } = payload;
        const element = document.getElementById(elementId);
        return element?.localName === tag ? ComponentSignalType.UPDATE : ComponentSignalType.RENDER;
    }

}

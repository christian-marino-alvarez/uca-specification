import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Dropdown extends Uca<Body> {
    public static override purpose: string = 'Present a collapsible list of text options, highlight selected text, and emit user choice';

    public static override disposition: Disposition<Body> = {
        aim: { description: Dropdown.purpose, body: {} },
        reactTo: [
            SignalType.CREATE,
            SignalType.UPDATE,
            SignalType.REMOVE,
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
        ],
    };

    public constructor(id: string = 'dropdown') {
        super(id);
    }


    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate(value);
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            default:
                this.handleCapabilitySignal(property);
                break;
        }
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as { container?: HTMLElement } & Body;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, container: payload.container, attributes });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as { container?: HTMLElement } & Body;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        this.pulse(CapabilitySignalType.UPDATED, { id: this.id, container: payload.container, attributes });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as { id?: string };
        const id = payload.id ?? this.id;
        this.pulse(CapabilitySignalType.REMOVED, { id });
    }

    private handleCapabilitySignal(property: string): void {
        const properties = this.getDomainProperties();
        switch (property) {
            case CapabilitySignalType.RENDERED:
                this.pulse(SignalType.CREATED, properties);
                break;
            case CapabilitySignalType.UPDATED:
                this.pulse(SignalType.UPDATED, properties);
                break;
            case CapabilitySignalType.REMOVED:
                this.pulse(SignalType.REMOVED, properties);
                break;
            default:
                break;
        }
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        const properties = (aim.body ?? {}) as Body;
        return properties;
    }

    protected override capabilities(): Cooky {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const body = { id: this.id, attributes };
        const purpose = 'Render interactive dropdown list in target presentation tree';
        const disposition: Disposition = { aim: { description: purpose, body }, reactTo: [...this.getReactToSignals()] };
        const cooky: Cooky = [[WebComponent, disposition]];
        return cooky;
    }

    private getReactToSignals(): readonly string[] {
        const reactTo = [
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
        ];
        return reactTo;
    }

    protected override getAttributeMapping(capabilityId?: string): Record<string, unknown> {
        switch (capabilityId) {
            case WEB_COMPONENT_ID:
            default:
                return this.getWebComponentAttributes();
        }
    }

    private getWebComponentAttributes(): Record<string, unknown> {
        const { aim } = this.disposition;
        const { value, placeholder, disabled, required, items = [], fontSize, color, backgroundColor, fontFamily } = aim.body ?? {};
        const mapping: Record<string, unknown> = {
            'value': value,
            'placeholder': placeholder,
            'disabled': disabled ? '' : undefined,
            'required': required ? '' : undefined,
            'data-options': items.length > 0 ? JSON.stringify(items) : undefined,
            'data-font-size': fontSize,
            'data-color': color,
            'data-background-color': backgroundColor,
            'data-font-family': fontFamily,
        };
        return mapping;
    }
}

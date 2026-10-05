import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as CapabilitySignalType } from '@uca/capability-web-component/types';
import { __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component/constants';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Toggle extends Uca<Body> {
    public static override purpose: string = 'Represent a binary state selection switchable by interaction';

    public static override disposition: Disposition<Body> = {
        aim: { description: Toggle.purpose, body: {} },
        reactTo: [
            SignalType.CREATE,
            SignalType.UPDATE,
            SignalType.REMOVE,
            SignalType.CHANGE,
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
            CapabilitySignalType.EVENT,
        ],
    };

    public constructor(id: string = 'toggle') {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        super.innervate(target, disposition);
        if (disposition?.parentTo) {
            this.disposition = { ...this.disposition, parentTo: disposition.parentTo };
        }
        if (disposition) {
            this.onDispositionUpdated();
        }
        return this;
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
            case SignalType.CHANGE:
                this.handleChange(value);
                break;
            default:
                this.handleCapabilitySignal(property, value);
                break;
        }
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as { container?: HTMLElement } & Body;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = payload.label ?? this.disposition.aim.body?.label;
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, container: payload.container, text, attributes });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as { container?: HTMLElement } & Body;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = payload.label ?? this.disposition.aim.body?.label;
        this.pulse(CapabilitySignalType.UPDATED, { id: this.id, container: payload.container, text, attributes });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as { id?: string };
        const id = payload.id ?? this.id;
        this.pulse(CapabilitySignalType.REMOVED, { id });
    }

    private handleChange(value: unknown): void {
        const payload = (value ?? {}) as { checked?: boolean };
        const properties = this.getDomainProperties();
        const nextChecked = payload.checked ?? !properties.checked;
        const result = { ...properties, checked: nextChecked };
        this.pulse(SignalType.CHANGED, result);
        if (`${this.id}.changed` !== SignalType.CHANGED) {
            this.pulse(`${this.id}.changed`, result);
        }
    }

    private handleCapabilitySignal(property: string, value: unknown): void {
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
            case CapabilitySignalType.EVENT:
                this.handleUserEvent(value);
                break;
            default:
                break;
        }
    }

    private handleUserEvent(value: unknown): void {
        const { event, checked } = (value ?? {}) as { event?: string; checked?: boolean };
        if (event === 'click' || event === 'change') {
            this.handleChange({ checked });
        }
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        const properties = (aim.body ?? {}) as Body;
        return properties;
    }
    protected override onDispositionUpdated(): void {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { aim, parentTo } = this.disposition;
        const { label = aim.description } = (aim.body ?? {}) as Body;
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, text: label, attributes, parentTo });
    }

    protected override capabilities(): Cooky {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { aim, parentTo } = this.disposition;
        const { label } = aim.body ?? {};
        const body = { id: this.id, text: label, attributes };
        const purpose = 'Render binary toggle element in target presentation tree';
        const disposition: Disposition = { aim: { description: purpose, body }, reactTo: [...this.getReactToSignals()], parentTo };
        return [[WebComponent, disposition]];
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
        const { checked, title, disabled, hidden, className } = (aim.body ?? {}) as Body;
        const mapping: Record<string, unknown> = {
            'checked': checked ? '' : undefined,
            'title': title,
            'disabled': disabled ? '' : undefined,
            'hidden': hidden ? '' : undefined,
            'class': className,
        };
        return mapping;
    }
}


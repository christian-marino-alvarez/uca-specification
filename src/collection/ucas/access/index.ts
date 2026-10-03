import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Access extends Uca<Body> {
    public static override purpose: string = 'Represent reference connection to an identifiable source via an interactive label and identifying title';

    public static override disposition: Disposition<Body> = {
        aim: { description: Access.purpose, body: {} },
        reactTo: [
            SignalType.CREATE, SignalType.UPDATE, SignalType.REMOVE,
            CapabilitySignalType.RENDERED, CapabilitySignalType.UPDATED, CapabilitySignalType.REMOVED,
        ],
    };

    public constructor(id: string = 'access') {
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
        const { aim, parentTo } = this.disposition;
        const { label } = aim.body ?? {};
        const body = { id: this.id, text: label, attributes };
        const purpose = 'Render reference connection element in target presentation tree';
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
        const { source, title } = aim.body ?? {};
        const mapping: Record<string, unknown> = {
            'href': source,
            'title': title,
        };
        return mapping;
    }
}

export * from './types.js';

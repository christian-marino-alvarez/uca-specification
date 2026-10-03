import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Action extends Uca<Body> {
    public static override purpose: string = 'Represent an invokable action triggered by a user interaction';

    public static override disposition: Disposition<Body> = {
        aim: { description: Action.purpose, body: {} },
        reactTo: [
            SignalType.CREATE, SignalType.UPDATE, SignalType.REMOVE, SignalType.TRIGGER,
            CapabilitySignalType.RENDERED, CapabilitySignalType.UPDATED, CapabilitySignalType.REMOVED, CapabilitySignalType.EVENT,
        ],
    };

    public constructor(id: string = 'action') {
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
            case SignalType.TRIGGER:
                this.handleTrigger();
                break;
            default:
                this.handleCapabilitySignal(property, value);
                break;
        }
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as { id?: string; container?: HTMLElement } & Body;
        const targetId = payload.id ?? this.id;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = payload.label ?? this.disposition.aim.body?.label;
        this.pulse(CapabilitySignalType.RENDERED, { id: targetId, container: payload.container, text, attributes });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as { id?: string; container?: HTMLElement } & Body;
        const targetId = payload.id ?? this.id;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = payload.label ?? this.disposition.aim.body?.label;
        this.pulse(CapabilitySignalType.UPDATED, { id: targetId, container: payload.container, text, attributes });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as { id?: string };
        const id = payload.id ?? this.id;
        this.pulse(CapabilitySignalType.REMOVED, { id });
    }

    private handleTrigger(detail?: unknown): void {
        const properties = this.getDomainProperties();
        const payload = detail !== undefined ? { ...properties, detail } : properties;
        this.pulse(SignalType.TRIGGERED, payload);
        if (`${this.id}.triggered` !== SignalType.TRIGGERED) {
            this.pulse(`${this.id}.triggered`, payload);
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
        const { id, event, detail } = (value ?? {}) as { id?: string; event?: string; detail?: unknown };
        if (!id || !this.matchesId(id)) { return; }
        if (event === 'click') {
            this.handleTrigger(detail);
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
        const { label = aim.description } = aim.body ?? {};
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, text: label, attributes, parentTo });
    }

    protected override capabilities(): Cooky {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { aim, parentTo } = this.disposition;
        const { label } = aim.body ?? {};
        const body = { id: this.id, text: label, attributes };
        const purpose = 'Render action invoker element in target presentation tree';
        const disposition: Disposition = { aim: { description: purpose, body }, reactTo: [...this.getReactToSignals()], parentTo };
        return [[WebComponent, disposition]];
    }

    private getReactToSignals(): readonly string[] {
        const reactTo = [
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
            CapabilitySignalType.EVENT,
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
        const { title, disabled, hidden, className } = aim.body ?? {};
        const mapping: Record<string, unknown> = {
            'title': title,
            'disabled': disabled ? '' : undefined,
            'hidden': hidden ? '' : undefined,
            'class': className,
        };
        return mapping;
    }
}

export * from './types.js';
export * from './schema.js';

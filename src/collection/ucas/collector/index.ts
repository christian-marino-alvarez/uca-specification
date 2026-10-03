import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component';
import { DEFAULT_TRIGGER_SIGNAL } from './constants.js';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Collector extends Uca<Body> {
    public static override purpose: string = 'Aggregate and encapsulate interactive input data collection';

    public static override disposition: Disposition<Body> = {
        aim: { description: Collector.purpose, body: {} },
        reactTo: [
            SignalType.CREATE,
            SignalType.UPDATE,
            SignalType.REMOVE,
            SignalType.SUBMIT,
            SignalType.RESET,
            DEFAULT_TRIGGER_SIGNAL,
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
        ],
    };

    public constructor(id: string = 'collector') {
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

    protected override onDispositionUpdated(): void {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { parentTo } = this.disposition;
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, attributes, parentTo });
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
            case SignalType.SUBMIT:
                this.handleSubmit(value);
                break;
            case DEFAULT_TRIGGER_SIGNAL:
                this.handleTrigger(value);
                break;
            case SignalType.RESET:
                this.handleReset();
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

    private handleSubmit(value: unknown): void {
        const payload = (value ?? {}) as Record<string, unknown>;
        const properties = this.getDomainProperties();
        this.pulse(SignalType.SUBMITTED, { ...properties, data: payload });
    }

    private handleTrigger(value: unknown): void {
        const payload = (value ?? {}) as Record<string, unknown>;
        const properties = this.getDomainProperties();
        this.pulse(SignalType.SUBMITTED, { ...properties, data: payload });
    }

    private handleReset(): void {
        const properties = this.getDomainProperties();
        this.pulse(SignalType.RESETTED, properties);
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
        const { parentTo } = this.disposition;
        const body = { id: this.id, attributes };
        const purpose = 'Render data collector container element in target presentation tree';
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
        const { name, title, disabled } = aim.body ?? {};
        const mapping: Record<string, unknown> = {
            'name': name,
            'title': title,
            'disabled': disabled ? '' : undefined,
        };
        return mapping;
    }
}

export * from './constants.js';
export * from './types.js';

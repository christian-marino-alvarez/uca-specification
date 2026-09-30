import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '../../capabilities/web-component/index.js';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Action extends Uca<Body> {
    public static readonly PURPOSE: string = 'Represent an invokable action triggered by a user interaction';

    public constructor(id: string = 'action') {
        super(id, Action.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const defaultSignals = [
            SignalType.CREATE,
            SignalType.UPDATE,
            SignalType.REMOVE,
            SignalType.TRIGGER,
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
            CapabilitySignalType.EVENT,
        ];
        const activeDisposition = disposition ?? Capability.createDisposition(this.purpose, {}, defaultSignals);
        const configured = activeDisposition.reactTo.length ? activeDisposition : { ...activeDisposition, reactTo: defaultSignals };
        return super.innervate(target, configured);
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

    private handleTrigger(detail?: unknown): void {
        const properties = this.getDomainProperties();
        const payload = detail !== undefined ? { ...properties, detail } : properties;
        this.pulse(SignalType.TRIGGERED, payload);
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
        const { event, detail } = (value ?? {}) as { event?: string; detail?: unknown };
        if (event === 'click') {
            this.handleTrigger(detail);
        }
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        const properties = (aim.body ?? {}) as Body;
        return properties;
    }

    protected override capabilities(): Cooky {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { label } = this.disposition.aim.body ?? {};
        const body = { id: this.id, text: label, attributes };
        const purpose = 'Render action invoker element in target presentation tree';
        const disposition = Capability.createDisposition(purpose, body, this.getReactToSignals());
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
        const { title, disabled } = aim.body ?? {};
        const mapping: Record<string, unknown> = {
            'title': title,
            'disabled': disabled ? '' : undefined,
        };
        return mapping;
    }
}

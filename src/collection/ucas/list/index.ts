import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '../../capabilities/web-component/index.js';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class List extends Uca<Body> {
    public static readonly PURPOSE: string = 'Present an ordered or unordered textual list of items, format and render items sequence';

    public constructor(id: string = 'list') {
        super(id, List.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const defaultSignals = [
            SignalType.CREATE,
            SignalType.UPDATE,
            SignalType.REMOVE,
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
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
        const purpose = 'Render sequential textual list in target presentation tree';
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
        const { items = [], ordered, fontSize, spacing, alignment, color, backgroundColor } = aim.body ?? {};
        const mapping: Record<string, unknown> = {
            'data-items': items.length > 0 ? JSON.stringify(items) : undefined,
            'data-ordered': ordered ? 'true' : undefined,
            'data-font-size': fontSize,
            'data-spacing': spacing,
            'data-alignment': alignment,
            'data-color': color,
            'data-background-color': backgroundColor,
        };
        return mapping;
    }
}

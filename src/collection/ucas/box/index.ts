import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Box extends Uca<Body> {
    public static override purpose: string = 'Represent layout structural box and boundary container';

    public static override disposition: Disposition<Body> = {
        aim: { description: Box.purpose, body: {} },
        reactTo: [
            SignalType.CREATE, SignalType.UPDATE, SignalType.REMOVE,
            CapabilitySignalType.RENDERED, CapabilitySignalType.UPDATED, CapabilitySignalType.REMOVED,
        ],
    };

    public constructor(id: string = 'box') {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        super.innervate(target, disposition);
        const { aim } = this.disposition;
        const hasBodyProperties = Boolean(aim.body && Object.keys(aim.body).length > 0);
        if (hasBodyProperties) {
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
            default:
                this.handleSignal(signal);
                break;
        }
    }

    private handleSignal(signal: Signal): void {
        const { property } = signal;
        const { reactTo = [] } = this.disposition;
        if (reactTo.includes(property) && !property.startsWith('element.')) {
            this.handleReactiveStimulus(signal);
            return;
        }
        this.handleCapabilitySignal(property);
    }

    private handleReactiveStimulus(signal: Signal): void {
        const { property, value } = signal;
        const payload = (value ?? {}) as { text?: string };
        const text = payload.text ?? `⚡ ¡Estímulo nervioso recibido de ${property}!`;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        this.pulse(CapabilitySignalType.UPDATED, { id: this.id, text, attributes });
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as { id?: string; container?: HTMLElement } & Body;
        if (payload.id && !this.matchesId(payload.id)) { return; }
        const targetId = payload.id ?? this.id;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = payload.text ?? this.disposition.aim.body?.text;
        this.pulse(CapabilitySignalType.RENDERED, { id: targetId, container: payload.container, text, attributes });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as { id?: string; container?: HTMLElement } & Body;
        if (payload.id && !this.matchesId(payload.id)) { return; }
        const targetId = payload.id ?? this.id;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = payload.text ?? this.disposition.aim.body?.text;
        this.pulse(CapabilitySignalType.UPDATED, { id: targetId, container: payload.container, text, attributes });
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

    protected override onDispositionUpdated(): void {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { aim } = this.disposition;
        const { text } = aim.body ?? {};
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, text, attributes });
    }

    protected override capabilities(): Cooky {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { aim, parentTo } = this.disposition;
        const { text } = aim.body ?? {};
        const body = { id: this.id, text, attributes };
        const purpose = 'Render structural box container in target presentation tree';
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
        const { text, role, hidden, className } = aim.body ?? {};
        const mapping: Record<string, unknown> = {
            'text': text,
            'role': role,
            'class': className,
            'hidden': hidden ? '' : undefined,
        };
        return mapping;
    }
}

export * from './types.js';
export * from './schema.js';

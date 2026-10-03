import { Uca } from '@uca/core/uca';
import { Capability } from '@uca/core/capability';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent, SignalType as CapabilitySignalType, __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component';
import type { Body } from './types.js';
import { SignalType } from './types.js';

export class Input extends Uca<Body> {
    public static override purpose: string = 'Capture entered textual data, its typography, appearance and make it available to the system';

    public static override disposition: Disposition<Body> = {
        aim: { description: Input.purpose, body: {} },
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

    public constructor(id: string = 'input') {
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

    protected override onDispositionUpdated(): void {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { aim } = this.disposition;
        const { value } = aim.body ?? {};
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, text: value, attributes });
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
        const payload = (value ?? {}) as { id?: string; container?: HTMLElement } & Body;
        const targetId = payload.id ?? this.id;
        const baseAttributes = this.buildAttributes(WEB_COMPONENT_ID);
        const attributes = payload.placeholder ? { ...baseAttributes, placeholder: payload.placeholder } : baseAttributes;
        this.pulse(CapabilitySignalType.RENDERED, { id: targetId, container: payload.container, attributes });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as { id?: string; container?: HTMLElement } & Body;
        const targetId = payload.id ?? this.id;
        const baseAttributes = this.buildAttributes(WEB_COMPONENT_ID);
        const attributes = payload.placeholder ? { ...baseAttributes, placeholder: payload.placeholder } : baseAttributes;
        this.pulse(CapabilitySignalType.UPDATED, { id: targetId, container: payload.container, attributes });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as { id?: string };
        const id = payload.id ?? this.id;
        this.pulse(CapabilitySignalType.REMOVED, { id });
    }

    private handleChange(value: unknown): void {
        const { value: nextValue } = (value ?? {}) as { value?: string };
        const properties = this.getDomainProperties();
        this.pulse(SignalType.CHANGED, { ...properties, value: nextValue });
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
        const { event, value: eventValue } = (value ?? {}) as { event?: string; value?: unknown };
        if (event === 'input' || event === 'change') {
            const nextValue = eventValue !== undefined ? String(eventValue) : undefined;
            this.handleChange({ value: nextValue });
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
        const purpose = 'Render interactive input in target presentation tree';
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
        const { value, placeholder, disabled, readOnly } = aim.body ?? {};
        const isEditable = disabled || readOnly ? 'false' : 'true';
        return {
            'value': value,
            'placeholder': placeholder,
            'disabled': disabled ? '' : undefined,
            'readonly': readOnly ? '' : undefined,
            'contenteditable': isEditable,
            ...this.getStyleAttributes(),
        };
    }

    private getStyleAttributes(): Record<string, unknown> {
        const { aim } = this.disposition;
        const { fontSize, color, backgroundColor, fontFamily } = aim.body ?? {};
        return {
            'data-font-size': fontSize,
            'data-color': color,
            'data-background-color': backgroundColor,
            'data-font-family': fontFamily,
        };
    }
}

export * from './types.js';
export * from './schema.js';

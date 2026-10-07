import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as CapabilitySignalType } from '@uca/capability-web-component/types';
import { __ID__ as WEB_COMPONENT_ID } from '@uca/capability-web-component/constants';
import type { Body } from './types.js';
import { DataType, SignalType } from './types.js';
import { bodySchema } from './schema.js';

export class List extends Uca<Body> {
    public static override purpose: string = 'Present an ordered or unordered textual list of items, format and render items sequence';

    public static override disposition: Disposition<Body> = {
        aim: { description: List.purpose, body: {} },
        inputs: [{ signal: SignalType.CREATE, type: DataType.RECORD, schema: bodySchema, description: 'Domain body contract' }],
        reactTo: [
            SignalType.CREATE,
            SignalType.UPDATE,
            SignalType.REMOVE,
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
        ],
    };

    public constructor(id: string = 'list') {
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
        const { value } = signal;
        const payload = (value ?? {}) as { checked?: boolean };
        const isHidden = payload.checked === false;
        const attributes = { ...this.buildAttributes(WEB_COMPONENT_ID), hidden: isHidden ? '' : undefined };
        const text = this.getFormattedText();
        this.pulse(CapabilitySignalType.UPDATED, { id: this.id, text, attributes });
    }

    protected override onDispositionUpdated(): void {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { parentTo } = this.disposition;
        const text = this.getFormattedText();
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, text, attributes, parentTo });
    }

    protected override capabilities(): Cooky {
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const { parentTo } = this.disposition;
        const text = this.getFormattedText();
        const body = { id: this.id, text, attributes };
        const purpose = 'Render sequential textual list in target presentation tree';
        const disposition: Disposition = { aim: { description: purpose, body }, reactTo: [...this.getReactToSignals()], parentTo };
        return [[WebComponent, disposition]];
    }

    protected override getAttributeMapping(capabilityId?: string): Record<string, unknown> {
        switch (capabilityId) {
            case WEB_COMPONENT_ID:
            default:
                return this.getWebComponentAttributes();
        }
    }

    private getReactToSignals(): readonly string[] {
        return [
            CapabilitySignalType.RENDERED,
            CapabilitySignalType.UPDATED,
            CapabilitySignalType.REMOVED,
        ];
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as { container?: HTMLElement } & Body;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = this.getFormattedText();
        this.pulse(CapabilitySignalType.RENDERED, { id: this.id, container: payload.container, text, attributes });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as { container?: HTMLElement } & Body;
        const attributes = this.buildAttributes(WEB_COMPONENT_ID);
        const text = this.getFormattedText();
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

    private getFormattedText(): string | undefined {
        const { aim } = this.disposition;
        const { text, items = [] } = (aim.body ?? {}) as Body;
        if (text) { return text; }
        if (items.length === 0) { return undefined; }
        return items.map((item, index) => `${index + 1}. ${item}`).join('\n\n');
    }

    private getWebComponentAttributes(): Record<string, unknown> {
        const { aim } = this.disposition;
        const { items = [], ordered, fontSize, spacing, alignment, color, backgroundColor, hidden, className } = (aim.body ?? {}) as Body;
        return {
            'data-items': items.length > 0 ? JSON.stringify(items) : undefined,
            'data-ordered': ordered ? 'true' : undefined,
            'data-font-size': fontSize,
            'data-spacing': spacing,
            'data-alignment': alignment,
            'data-color': color,
            'data-background-color': backgroundColor,
            'class': className,
            'hidden': hidden ? '' : undefined,
        };
    }
}


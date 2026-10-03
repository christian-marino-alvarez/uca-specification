import {
    DispositionSignal,
    StorageSignal,
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
    type DispositionProvidePayload,
    type DispositionUpdatedPayload,
    type DispositionUpdatePayload,
    type ICapability,
    type Signal,
} from './types.js';
import { Capability } from './capability.js';
import { LocalStorage } from '@uca/capability-local-storage';

/**
 * Uca: Abstracción ontológica fundamental del sistema.
 * Se constituye exclusivamente de Purpose, Capabilities y Disposition.
 * Hereda de Capability, poseyendo su propio target de eventos e integrabilidad fractal.
 */
export abstract class Uca<TBody = unknown> extends Capability<TBody> {
    public static purpose: string = 'Universal Cognitive Agent';

    public readonly id: string;
    public override target?: EventTarget;
    private readonly registry: Map<string, ICapability>;

    public constructor(id: string) {
        super(id);
        this.id = id;
        this.target = new EventTarget();
        this.registry = new Map();
    }

    public get purpose(): string {
        return (this.constructor as typeof Uca).purpose;
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<TBody>): this {
        const activeTarget = target || this.target || new EventTarget();
        const incoming = disposition ?? this.disposition;
        const { reactTo = [] } = incoming;
        const controlSignals = [DispositionSignal.UPDATE, DispositionSignal.GET];
        const signals = [...new Set([...reactTo, ...controlSignals])];
        super.innervate(activeTarget, { ...incoming, reactTo: signals });
        this.innervateCapabilities(activeTarget);
        return this;
    }

    public override denervate(): void {
        super.denervate();
        for (const capability of this.registry.values()) {
            capability.denervate();
        }
    }

    protected override async executeReaction(signal: Signal): Promise<void> {
        const { property } = signal;
        if (property === DispositionSignal.UPDATE) {
            this.handleDispositionUpdate(signal);
            return;
        }
        if (property === DispositionSignal.GET) {
            this.handleDispositionGet();
            return;
        }
        await super.executeReaction(signal);
    }

    protected override react(_signal: Signal): void | Promise<void> {
        return;
    }

    protected defaultCapabilities(): Cooky {
        const body = { id: 'local-storage', ownerId: this.id };
        const disposition: Disposition = { aim: { description: LocalStorage.AIM, body }, reactTo: [...LocalStorage.disposition.reactTo ?? []] };
        return [[LocalStorage, disposition]];
    }

    protected capabilities(): Cooky {
        const declarations: Cooky = [];
        return declarations;
    }

    protected buildAttributes(capabilityId?: string): Record<string, string> {
        const mapping = this.getAttributeMapping(capabilityId);
        const attributes: Record<string, string> = {};
        for (const [attributeName, rawValue] of Object.entries(mapping)) {
            if (rawValue !== undefined) {
                attributes[attributeName] = String(rawValue);
            }
        }
        return attributes;
    }

    protected getAttributeMapping(_capabilityId?: string): Record<string, unknown> {
        const mapping: Record<string, unknown> = {};
        return mapping;
    }

    protected capability(id: string): ICapability | undefined {
        const result = this.registry.get(id);
        return result;
    }

    protected hasCapability(id: string): boolean {
        const exists = this.registry.has(id);
        return exists;
    }

    protected override matchesId(id?: string): boolean {
        const targetBase = id?.includes(':') ? id.split(':')[1] : id;
        const currentBase = this.id.includes(':') ? this.id.split(':')[1] : this.id;
        const matches = !id || id === this.id || targetBase === currentBase;
        return matches;
    }

    protected onDispositionUpdated(): void {}

    private handleDispositionUpdate(signal: Signal): void {
        const payload = signal.value as DispositionUpdatePayload<TBody> | undefined;
        const { id, disposition } = payload ?? {};
        if (id !== this.id || !disposition) {
            return;
        }
        this.innervate(undefined, disposition as Disposition<TBody>);
        this.pulse(StorageSignal.SET, { key: this.id, value: this.disposition });
        const updatedPayload: DispositionUpdatedPayload<TBody> = { id: this.id, disposition: this.disposition };
        this.pulse(DispositionSignal.UPDATED, updatedPayload);
        this.onDispositionUpdated();
    }

    private handleDispositionGet(): void {
        const prefix = this.id.includes(':') ? this.id.split(':')[0] : this.id;
        const payload: DispositionProvidePayload<TBody> = {
            ucaId: this.id,
            prefix: prefix ?? this.id,
            purpose: this.purpose,
            disposition: this.disposition,
            ucaConstructor: this.constructor as CapabilityConstructor,
        };
        this.pulse(DispositionSignal.PROVIDE, payload);
    }

    private createCapability(CapabilityClass: CapabilityConstructor, disposition: Disposition): ICapability {
        const { aim } = disposition;
        const { id: bodyId } = (aim.body as { id?: string } | undefined) ?? {};
        const Factory = CapabilityClass as unknown as new (id?: string) => ICapability;
        const instance = bodyId !== undefined ? new Factory(bodyId) : new Factory();
        this.registry.set(instance.id, instance);
        return instance;
    }

    private getCapabilityId(CapabilityClass: CapabilityConstructor, disposition: Disposition): string | undefined {
        const { aim } = disposition;
        const { id: bodyId } = (aim.body as { id?: string } | undefined) ?? {};
        const staticId = (CapabilityClass as unknown as { __ID__?: string }).__ID__;
        return bodyId ?? staticId;
    }

    private innervateCapabilities(activeTarget: EventTarget): void {
        const declarations = [...this.defaultCapabilities(), ...this.capabilities()];
        for (const [CapabilityClass, capabilityDisposition] of declarations) {
            const capabilityId = this.getCapabilityId(CapabilityClass, capabilityDisposition);
            const capability = (capabilityId ? this.registry.get(capabilityId) : undefined) ?? this.createCapability(CapabilityClass, capabilityDisposition);
            capability.innervate(activeTarget, capabilityDisposition);
        }
    }
}

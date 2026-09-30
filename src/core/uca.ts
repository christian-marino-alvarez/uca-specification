import type { CapabilityConstructor, Cooky, Disposition, DispositionSnapshot, ICapability, Signal } from './types.js';
import { Capability } from './capability.js';

/**
 * Uca: Abstracción ontológica fundamental del sistema.
 * Se constituye exclusivamente de Purpose, Capabilities y Disposition.
 * Hereda de Capability, poseyendo su propio target de eventos e integrabilidad fractal.
 */
export abstract class Uca<TBody = unknown> extends Capability<TBody> {
    public readonly id: string;
    public readonly purpose: string;
    public override target?: EventTarget;
    private readonly registry: Map<string, ICapability>;
    private instantiatedFromCooky: boolean;

    constructor(id: string, purpose: string) {
        super(id);
        this.id = id;
        this.purpose = purpose;
        this.target = new EventTarget();
        this.registry = new Map();
        this.instantiatedFromCooky = false;
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<TBody>): this {
        const activeTarget = target || this.target || new EventTarget();
        super.innervate(activeTarget, disposition);
        this.resolveIntrinsicCapabilities(activeTarget);
        return this;
    }

    public override denervate(): void {
        super.denervate();
        for (const capability of this.registry.values()) {
            capability.denervate();
        }
    }

    protected override react(_signal: Signal): void | Promise<void> {
        return;
    }

    public describe(): DispositionSnapshot {
        const { id, purpose } = this;
        const { reactTo, aim, inputs, outputs } = this.disposition;
        const capabilities = this.describeCapabilities();
        return { id, purpose, description: aim.description, reactTo, inputs, outputs, capabilities };
    }

    protected attach(capability: ICapability): this {
        this.registerCapabilityInstance(capability, this.target);
        return this;
    }

    protected detach(id: string): void {
        const capability = this.registry.get(id);
        if (capability) {
            capability.denervate();
            this.registry.delete(id);
        }
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

    private describeCapabilities(): DispositionSnapshot[] {
        const snapshots: DispositionSnapshot[] = [];
        for (const capability of this.registry.values()) {
            snapshots.push(this.describeCapability(capability));
        }
        return snapshots;
    }

    private describeCapability(capability: ICapability): DispositionSnapshot {
        if (capability instanceof Uca) {
            return capability.describe();
        }
        const { id, disposition } = capability;
        const { reactTo, aim, inputs, outputs } = disposition;
        return { id, description: aim.description, reactTo, inputs, outputs };
    }

    private registerCapabilityInstance(capability: ICapability, target?: EventTarget, disposition?: Disposition): void {
        const existing = this.registry.get(capability.id);
        if (existing && existing !== capability) {
            existing.denervate();
        }
        capability.innervate(target, disposition);
        this.registry.set(capability.id, capability);
    }

    private createCapabilityInstance(CapabilityClass: CapabilityConstructor, disposition: Disposition): ICapability {
        const bodyId = (disposition.aim.body as { id?: string } | undefined)?.id;
        const Factory = CapabilityClass as unknown as new (id?: string) => ICapability;
        const instance = bodyId !== undefined ? new Factory(bodyId) : new Factory();
        return instance;
    }

    private instantiateFromCookyDeclaration(activeTarget: EventTarget): void {
        const declarations = this.capabilities();
        for (const [CapabilityClass, disposition] of declarations) {
            const instance = this.createCapabilityInstance(CapabilityClass, disposition);
            this.registerCapabilityInstance(instance, activeTarget, disposition);
        }
        this.instantiatedFromCooky = true;
    }

    private reinnervateRegisteredCapabilities(activeTarget: EventTarget): void {
        const declarations = this.capabilities();
        for (const [CapabilityClass, disposition] of declarations) {
            const bodyId = (disposition.aim.body as { id?: string } | undefined)?.id;
            const targetId = bodyId ?? (CapabilityClass as unknown as { __ID__?: string }).__ID__;
            const capability = targetId ? this.registry.get(targetId) : undefined;
            if (capability) {
                capability.innervate(activeTarget, disposition);
            }
        }
        for (const capability of this.registry.values()) {
            capability.innervate(activeTarget);
        }
    }

    private resolveIntrinsicCapabilities(activeTarget: EventTarget): void {
        if (!this.instantiatedFromCooky) {
            this.instantiateFromCookyDeclaration(activeTarget);
        } else {
            this.reinnervateRegisteredCapabilities(activeTarget);
        }
    }
}

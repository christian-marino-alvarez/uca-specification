import type { CapabilityConstructor, Cooky, Disposition, DispositionMutation, DispositionSnapshot, ICapability, Signal } from './types.js';
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

    constructor(id: string, purpose: string) {
        super(id);
        this.id = id;
        this.purpose = purpose;
        this.target = new EventTarget();
        this.registry = new Map();
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<TBody>): this {
        const activeTarget = target || this.target || new EventTarget();
        super.innervate(activeTarget, disposition);
        for (const [CapabilityClass, capabilityDisposition] of this.capabilities()) {
            const targetId = this.getTargetId(CapabilityClass, capabilityDisposition);
            const capability = (targetId ? this.registry.get(targetId) : undefined) ?? this.createCapability(CapabilityClass, capabilityDisposition);
            capability.innervate(activeTarget, capabilityDisposition);
        }
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

    public reconfigure(mutation: DispositionMutation): this {
        const updated = this.mergeDisposition(this.disposition, mutation);
        return this.innervate(this.target, updated as Disposition<TBody>);
    }

    public reconfigureCapability(id: string, mutation: DispositionMutation): boolean {
        const capability = this.registry.get(id);
        if (!capability) { return false; }
        const updated = this.mergeDisposition(capability.disposition, mutation);
        capability.innervate(this.target, updated);
        return true;
    }

    protected attach(capability: ICapability): this {
        const { id } = capability;
        const existing = this.registry.get(id);
        if (existing && existing !== capability) {
            existing.denervate();
        }
        this.registry.set(id, capability);
        capability.innervate(this.target);
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

    private createCapability(CapabilityClass: CapabilityConstructor, disposition: Disposition): ICapability {
        const { aim } = disposition;
        const { id: bodyId } = (aim.body as { id?: string } | undefined) ?? {};
        const Factory = CapabilityClass as unknown as new (id?: string) => ICapability;
        const instance = bodyId !== undefined ? new Factory(bodyId) : new Factory();
        this.registry.set(instance.id, instance);
        return instance;
    }

    private getTargetId(CapabilityClass: CapabilityConstructor, disposition: Disposition): string | undefined {
        const { aim } = disposition;
        const { id: bodyId } = (aim.body as { id?: string } | undefined) ?? {};
        const staticId = (CapabilityClass as unknown as { __ID__?: string }).__ID__;
        return bodyId ?? staticId;
    }


    private mergeDisposition(current: Disposition, mutation: DispositionMutation): Disposition {
        const { description, reactTo, properties } = mutation;
        const { aim } = current;
        const currentBody = (aim.body as Record<string, unknown> | undefined) ?? {};
        const updatedBody = properties !== undefined ? { ...currentBody, ...properties } : currentBody;
        const updatedAim = { ...aim, description: description ?? aim.description, body: updatedBody };
        const updatedReactTo = reactTo !== undefined ? [...reactTo] : current.reactTo;
        return { ...current, aim: updatedAim, reactTo: updatedReactTo };
    }
}

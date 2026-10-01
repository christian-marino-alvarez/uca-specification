import type { CapabilityConstructor, Cooky, Disposition, ICapability, Signal } from './types.js';
import { Capability } from './capability.js';

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
        super.innervate(activeTarget, disposition);
        this.innervateCapabilities(activeTarget);
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

    private innervateCapabilities(activeTarget: EventTarget): void {
        for (const [CapabilityClass, capabilityDisposition] of this.capabilities()) {
            const targetId = this.getTargetId(CapabilityClass, capabilityDisposition);
            const capability = (targetId ? this.registry.get(targetId) : undefined) ?? this.createCapability(CapabilityClass, capabilityDisposition);
            capability.innervate(activeTarget, capabilityDisposition);
        }
    }
}

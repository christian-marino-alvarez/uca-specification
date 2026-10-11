import {
    DispositionSignal,
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
    type DispositionProvidePayload,
    type ICapability,
    type Signal,
} from './types.js';
import { Capability } from './capability.js';

/**
 * Uca: Abstracción ontológica fundamental del sistema.
 * Se constituye exclusivamente de Purpose, Capabilities y Disposition.
 * Hereda de Capability, poseyendo su propio target de eventos e integrabilidad fractal.
 * Su catalog declara las capacidades posibles; su reactTo determina cuáles están activas.
 */
export abstract class Uca<TBody = unknown> extends Capability<TBody> {
    public static purpose: string = 'Universal Cognitive Agent';

    public readonly registry: Map<string, ICapability>;

    public constructor(id: string) {
        super(id);
        this.registry = new Map();
    }

    protected override react(_signal: Signal): void | Promise<void> {
        return;
    }

    public get purpose(): string {
        return (this.constructor as typeof Uca).purpose;
    }

    public get context(): string | undefined {
        const { aim } = this.disposition;
        const { context } = (aim?.body ?? {}) as { context?: string };
        return context;
    }

    protected override onDispositionUpdated(event: Event): void {
        this.syncCatalog();
        super.onDispositionUpdated(event);
    }

    protected override handleDispositionGet(_event: Event): void {
        const { id, disposition, purpose } = this;
        const [prefix] = id.split(':');
        const ucaConstructor = this.constructor as CapabilityConstructor;
        const payload: DispositionProvidePayload<TBody> = {
            id, ucaId: id, prefix: prefix ?? id, purpose, disposition, ucaConstructor,
        };
        this.pulse(DispositionSignal.PROVIDE, payload);
    }

    protected catalog(): Cooky {
        const declarations: Cooky = [];
        return declarations;
    }

    protected getCapability(id: string): ICapability | undefined {
        const result = this.registry.get(id);
        return result;
    }

    protected override matchesId(id?: string): boolean {
        if (!id || id === this.id) { return true; }
        const matches = this.id.endsWith(`:${id}`) || id.endsWith(`:${this.id}`);
        return matches;
    }

    private syncCatalog(): void {
        for (const [Factory, declared] of this.catalog()) {
            this.syncCatalogEntry(Factory, declared);
        }
    }

    private syncCatalogEntry(Factory: CapabilityConstructor, declared: Disposition): void {
        const { reactTo = [] } = this.disposition;
        const { reactTo: signals = [], aim } = declared;
        const { id } = (aim.body ?? {}) as { id?: string };
        const isActive = signals.some((signal) => reactTo.includes(signal));
        if (!isActive) { return void this.getCapability(id ?? '')?.denervate(); }
        const capability = this.getCapability(id ?? '') ?? this.registerCapability(Factory, id);
        this.connectCapability(capability, declared);
    }

    private registerCapability(Factory: CapabilityConstructor, id?: string): ICapability {
        const created = new (Factory as unknown as new (id?: string) => ICapability)(id);
        this.registry.set(created.id, created);
        return created;
    }

    private connectCapability(capability: ICapability, declared: Disposition): void {
        if (!capability.target) {
            capability.innervate(this.target);
        }
        this.updateCapability(capability, declared);
    }

    private updateCapability(capability: ICapability, declared: Disposition): void {
        const context = this.context ? `${this.context} → ${this.purpose}` : this.purpose;
        const { aim } = declared;
        const disposition = { ...declared, aim: { ...aim, body: { context, ...(aim.body as object) } } };
        this.pulse(capability.updateEvent, disposition);
    }
}

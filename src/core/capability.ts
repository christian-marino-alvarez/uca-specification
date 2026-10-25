import {
    DispositionSignal,
    EntityKind,
    type Disposition,
    type DispositionProvidePayload,
    type DispositionUpdatedPayload,
    type ICapability,
    type Signal,
} from './types.js';

export abstract class Capability<TBody = unknown> implements ICapability<TBody>, EventListenerObject {
    public static disposition: Disposition<unknown> = {
        aim: { description: 'Default' },
    };

    public static updateEvent(id: string): string {
        return `Disposition-${id}::${DispositionSignal.UPDATE}`;
    }

    public static getEvent(id: string): string {
        return `Disposition-${id}::${DispositionSignal.GET}`;
    }

    public static readPayload<T = unknown>(event: Event): T | undefined {
        const { detail } = event as CustomEvent<Signal<T> | undefined>;
        const { value } = detail ?? {};
        return value;
    }

    public static extractPayload<T = unknown>(value: unknown): T | undefined {
        if (!value || typeof value !== 'object') {
            return value as T | undefined;
        }
        const hasBody = 'body' in value;
        const extracted = hasBody ? (value as { body: T }).body : (value as T);
        return extracted;
    }

    public readonly id: string;
    public target?: EventTarget;
    public readonly updateEvent: string;
    public readonly getEvent: string;
    private _disposition: Disposition<TBody>;

    public constructor(id: string) {
        this.id = id;
        this.updateEvent = Capability.updateEvent(id);
        this.getEvent = Capability.getEvent(id);
        this._disposition = this.initialDisposition();
    }

    public innervate(target?: EventTarget): this {
        const activeTarget = target ?? this.target ?? new EventTarget();
        this.denervate();
        this.target = activeTarget;
        this.target.addEventListener(this.updateEvent, this);
        this.target.addEventListener(this.getEvent, this);
        this.target.addEventListener(DispositionSignal.GET, this);
        this.connectReceptors();
        this.pulse(DispositionSignal.INNERVATED, this.disposition.aim.body ?? { id: this.id });
        return this;
    }

    public denervate(): void {
        if (!this.target) { return; }
        this.pulse(DispositionSignal.DENERVATED, { id: this.id });
        this.disconnectReceptors();
        this.target.removeEventListener(this.updateEvent, this);
        this.target.removeEventListener(this.getEvent, this);
        this.target.removeEventListener(DispositionSignal.GET, this);
        this.target = undefined;
        this._disposition = this.initialDisposition();
    }

    private initialDisposition(): Disposition<TBody> {
        const {
            disposition,
        } = this.constructor as typeof Capability;
        return {
            ...disposition,
        } as Disposition<TBody>;
    }


    protected abstract react(signal: Signal): void | Promise<void>;

    public handleEvent(event: Event): void {
        switch (event.type) {
            case this.updateEvent:
                this.handleDispositionUpdate(event);
                break;
            case this.getEvent:
            case DispositionSignal.GET:
                this.handleDispositionGet(event);
                break;
            default:
                this.handleSignal(event);
        }
    }

    public get disposition(): Disposition<TBody> {
        return this._disposition;
    }

    protected set disposition(value: Disposition<TBody>) {
        this._disposition = value;
    }

    protected get entityKind(): EntityKind {
        return EntityKind.CAPABILITY;
    }

    protected onDispositionUpdated(_event: Event): void {
        const { id, disposition } = this;
        const payload: DispositionUpdatedPayload<TBody> = { id, disposition };
        this.pulse(DispositionSignal.UPDATED, payload);
    }

    protected handleDispositionGet(_event: Event): void {
        const { id, disposition } = this;
        const payload: DispositionProvidePayload<TBody> = { id, disposition };
        this.pulse(DispositionSignal.PROVIDE, payload);
    }

    protected receptors(): string[] {
        const { reactTo = [] } = this.disposition;
        return [...reactTo];
    }

    protected connectReceptors(): void {
        const { target } = this;
        for (const pattern of this.receptors()) {
            target?.addEventListener(pattern, this);
        }
    }

    protected disconnectReceptors(): void {
        const { target } = this;
        for (const pattern of this.receptors()) {
            target?.removeEventListener(pattern, this);
        }
    }

    /** Emits domain data; Uca resolves a unique active catalog recipient unless targetId is supplied. */
    protected pulse(
        property: string,
        value: unknown,
        targetId?: string,
        sessionId?: string,
    ): Signal | undefined {
        const {
            target,
            id,
            entityKind,
        } = this;
        if (!target) { return undefined; }
        const destination = targetId ?? this.resolveTargetId(property);
        const resolvedSessionId = sessionId ?? (value as { sessionId?: string })?.sessionId;
        const signal: Signal = {
            source: id,
            sourceKind: entityKind,
            ...(destination && {
                targetId: destination,
            }),
            property,
            value,
            timestamp: Date.now(),
            ...(resolvedSessionId && {
                sessionId: resolvedSessionId,
            }),
        };
        if (property !== '*') {
            target.dispatchEvent(new CustomEvent('*', { detail: signal, bubbles: true }));
        }
        target.dispatchEvent(new CustomEvent(property, { detail: signal, bubbles: true }));
        return signal;
    }

    protected resolveTargetId(_property: string): string | undefined {
        return undefined;
    }

    protected acceptsSource(_signal: Signal): boolean {
        return true;
    }

    protected extractPayload<T = TBody>(value: unknown): T | undefined {
        const payload = Capability.extractPayload<T>(value);
        return payload;
    }

    protected matchesId(id?: string): boolean {
        return this.id === id;
    }

    protected async executeReaction(signal: Signal): Promise<void> {
        try {
            await this.react(signal);
        } catch (error) {
            this.pulse('error', error);
        }
    }

    private handleDispositionUpdate(event: Event): void {
        const disposition = Capability.readPayload<Disposition<TBody>>(event);
        if (!disposition) { return; }
        const hasChanged = this.isDispositionChanged(this.disposition, disposition);
        if (!hasChanged) { return; }
        this.disconnectReceptors();
        this.disposition = disposition;
        this.connectReceptors();
        this.onDispositionUpdated(event);
    }

    private isDispositionChanged(current: unknown, incoming: unknown): boolean {
        if (current === incoming) {
            return false;
        }
        const normalizedCurrent = JSON.stringify(this.normalizeKeys(current));
        const normalizedIncoming = JSON.stringify(this.normalizeKeys(incoming));
        return normalizedCurrent !== normalizedIncoming;
    }

    private normalizeKeys(value: unknown): unknown {
        if (value === null || typeof value !== 'object') { return value; }
        if (Array.isArray(value)) { return value.map((item) => this.normalizeKeys(item)); }
        const record = value as Record<string, unknown>;
        const sorted = Object.keys(record).sort();
        return Object.fromEntries(sorted.map((key) => [key, this.normalizeKeys(record[key])]));
    }

    private handleSignal(event: Event): void {
        const { detail: signal } = event as CustomEvent<Signal | undefined>;
        if (!signal || !this.acceptsSignal(signal) || !this.acceptsSource(signal)) { return; }
        void this.executeReaction(signal);
    }

    private acceptsSignal(signal: Signal): boolean {
        const { targetId, value } = signal;
        if (targetId !== undefined) { return targetId === this.id || this.receptors().includes('*'); }
        // Compatibility for callers that still address signals through value.id.
        const payload = Capability.extractPayload<Record<string, unknown>>(value);
        const { id } = (payload ?? {}) as { id?: unknown };
        return !id || this.matchesId(String(id));
    }
}

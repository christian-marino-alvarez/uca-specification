import {
    DispositionSignal,
    type Aim,
    type Disposition,
    type DispositionUpdatedPayload,
    type DispositionUpdatePayload,
    type ICapability,
    type Signal,
} from './types.js';

export abstract class Capability<TBody = unknown> implements ICapability<TBody> {
    public static disposition: Disposition<unknown> = {
        aim: { description: 'Default' },
        reactTo: [],
    };

    private static mergeAim<T>(current?: Aim<T>, incoming?: Aim<T>): Aim<T> {
        const description = incoming?.description ?? current?.description ?? '';
        const currentBody = current?.body ?? {};
        const incomingBody = incoming?.body ?? {};
        const hasBody = current?.body !== undefined || incoming?.body !== undefined;
        const body = hasBody ? { ...currentBody, ...incomingBody } as T : undefined;
        return body !== undefined ? { description, body } : { description };
    }

    private static mergeReactTo(current?: readonly string[], incoming?: readonly string[]): string[] {
        if (!incoming?.length) {
            return current?.length ? [...current] : [];
        }
        if (!current?.length) {
            return [...incoming];
        }
        return [...new Set([...current, ...incoming])];
    }

    public static buildDisposition<T>(current: Disposition<T>, incoming?: Partial<Disposition<T>>): Disposition<T> {
        const { aim: incomingAim, reactTo: incomingReactTo, inputs, outputs } = incoming ?? {};
        const aim = Capability.mergeAim(current?.aim, incomingAim);
        const reactTo = Capability.mergeReactTo(current?.reactTo, incomingReactTo);
        const activeInputs = inputs ?? current?.inputs;
        const activeOutputs = outputs ?? current?.outputs;
        return { aim, reactTo, inputs: activeInputs, outputs: activeOutputs };
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
    private _disposition: Disposition<TBody>;
    private boundPatterns: string[];
    private readonly eventListener: (event: Event) => void;
    private storageCapability?: ICapability;

    public constructor(id: string) {
        this.id = id;
        this._disposition = (this.constructor as typeof Capability).disposition as Disposition<TBody>;
        this.boundPatterns = [];
        this.eventListener = (event: Event) => this.handleEvent(event);
    }

    public innervate(
        target?: EventTarget,
        disposition: Disposition<TBody> = (this.constructor as typeof Capability).disposition as Disposition<TBody>,
    ): this {
        this.disconnectReceptors();
        if (target) {
            this.target = target;
        }
        const incoming = disposition ?? (this.constructor as typeof Capability).disposition as Disposition<TBody>;
        this._disposition = Capability.buildDisposition(this._disposition, incoming);
        this.connectReceptors();
        this.innervateStorage();
        return this;
    }

    public denervate(): void {
        this.disconnectReceptors();
        this.storageCapability?.denervate();
        this.storageCapability = undefined;
        this.target = undefined;
    }

    protected abstract react(signal: Signal): void | Promise<void>;

    public get disposition(): Disposition<TBody> {
        return this._disposition;
    }

    public set disposition(value: Disposition<TBody>) {
        this._disposition = value;
    }

    protected pulse(property: string, value: unknown): Signal | undefined {
        const { target, id } = this;
        if (!target) { return undefined; }
        const signal: Signal = { source: id, property, value, timestamp: Date.now() };
        target.dispatchEvent(new CustomEvent(property, { detail: signal, bubbles: true }));
        if (property !== '*') {
            target.dispatchEvent(new CustomEvent('*', { detail: signal, bubbles: true }));
        }
        return signal;
    }

    protected extractPayload<T = TBody>(value: unknown): T | undefined {
        const payload = Capability.extractPayload<T>(value);
        return payload;
    }

    private static readonly CONTROL_SIGNALS = [DispositionSignal.UPDATE] as const;

    private connectReceptors(): void {
        const { reactTo = [] } = this.disposition;
        this.boundPatterns = [...new Set([...reactTo, ...Capability.CONTROL_SIGNALS])];
        for (const pattern of this.boundPatterns) {
            this.target?.addEventListener(pattern, this.eventListener);
        }
    }

    private disconnectReceptors(): void {
        if (this.target) {
            for (const pattern of this.boundPatterns) {
                this.target.removeEventListener(pattern, this.eventListener);
            }
        }
        this.boundPatterns = [];
    }

    private handleEvent(event: Event): void {
        const signal = this.validateSignal(event);
        if (!signal) {
            return;
        }
        const { property } = signal;
        switch (property) {
            case DispositionSignal.UPDATE:
                this.handleDispositionUpdate(signal);
                break;
            default:
                void this.executeReaction(signal);
                break;
        }
    }

    private validateSignal(event: Event): Signal | undefined {
        const customEvent = event as CustomEvent<Signal>;
        const { detail: signal } = customEvent;
        if (!signal) {
            return undefined;
        }
        const { targetId } = (signal.value ?? {}) as { targetId?: string };
        if (targetId !== undefined && targetId !== this.id) {
            return undefined;
        }
        return signal;
    }

    protected shouldInnervateStorage(): boolean {
        return !this.id.endsWith(':storage');
    }

    private async innervateStorage(): Promise<void> {
        const { target } = this;
        if (!target || !this.shouldInnervateStorage()) {
            return;
        }
        if (!this.storageCapability) {
            const { LocalStorage } = await import('@uca/capability-local-storage');
            this.storageCapability = new LocalStorage(`${this.id}:storage`);
        }
        this.storageCapability.innervate(target);
    }

    private handleDispositionUpdate(signal: Signal): void {
        const payload = signal.value as DispositionUpdatePayload<TBody> | undefined;
        const { disposition } = payload ?? {};
        if (!disposition) {
            return;
        }
        this.innervate(undefined, disposition as Disposition<TBody>);
        this.pulse('local-storage.set', { key: this.id, value: JSON.stringify(this.disposition) });
        const updatedPayload: DispositionUpdatedPayload<TBody> = { id: this.id, disposition: this.disposition };
        this.pulse(DispositionSignal.UPDATED, updatedPayload);
    }

    private async executeReaction(signal: Signal): Promise<void> {
        try {
            await this.react(signal);
        } catch (error) {
            this.pulse('error', error);
        }
    }
}

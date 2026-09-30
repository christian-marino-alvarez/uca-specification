import type {
    Disposition,
    DispositionOptions,
    ICapability,
    Port,
    PortDeclaration,
    Signal,
} from './types.js';

export abstract class Capability<TBody = unknown> implements ICapability<TBody> {
    public readonly id: string;
    public disposition: Disposition<TBody>;
    public target?: EventTarget;
    private boundPatterns: string[];
    private readonly eventListener: (event: Event) => void;

    private static normalizePorts(ports?: readonly PortDeclaration[]): Port[] | undefined {
        if (!ports) {
            return undefined;
        }
        return [...ports];
    }


    public static createDisposition<T>(
        description: string,
        body?: T,
        reactTo: readonly string[] = [],
        options?: DispositionOptions,
    ): Disposition<T> {
        const aim = body !== undefined ? { description, body } : { description };
        const inputs = Capability.normalizePorts(options?.inputs);
        const outputs = Capability.normalizePorts(options?.outputs);
        const initialReactTo = reactTo.length ? [...reactTo] : (inputs?.map((port) => port.signal) ?? []);
        const disposition: Disposition<T> = { reactTo: initialReactTo, aim, inputs, outputs };
        return disposition;
    }

    constructor(id: string, disposition?: Disposition<TBody>) {
        this.id = id;
        this.disposition = disposition ?? Capability.createDisposition('Default');
        this.boundPatterns = [];
        this.eventListener = (event: Event) => this.handleEvent(event);
    }

    public innervate(target?: EventTarget, disposition?: Disposition<TBody>): this {
        this.disconnectReceptors();
        if (target) {
            this.target = target;
        }
        if (disposition) {
            this.disposition = disposition;
        }
        this.connectReceptors();
        return this;
    }

    public denervate(): void {
        this.disconnectReceptors();
        this.target = undefined;
    }

    protected abstract react(signal: Signal): void | Promise<void>;

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

    public static extractPayload<T = unknown>(value: unknown): T | undefined {
        if (!value || typeof value !== 'object') {
            return value as T | undefined;
        }
        const hasBody = 'body' in value;
        const extracted = hasBody ? (value as { body: T }).body : (value as T);
        return extracted;
    }

    protected extractPayload<T = TBody>(value: unknown): T | undefined {
        const payload = Capability.extractPayload<T>(value);
        return payload;
    }

    protected createDisposition(
        description: string,
        body?: TBody,
        reactTo: readonly string[] = [],
        options?: DispositionOptions,
    ): Disposition<TBody> {
        const disposition = Capability.createDisposition(description, body, reactTo, options);
        return disposition;
    }

    private connectReceptors(): void {
        const { reactTo = [] } = this.disposition;
        this.boundPatterns = [...reactTo];
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
        const customEvent = event as CustomEvent<Signal>;
        const { detail: signal } = customEvent;
        if (signal) {
            void this.executeReaction(signal);
        }
    }

    private async executeReaction(signal: Signal): Promise<void> {
        try {
            await this.react(signal);
        } catch (error) {
            this.pulse('error', error);
        }
    }
}

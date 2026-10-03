import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

export class ViewComposer extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: ViewComposer.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.VOID, description: 'Initialize view composition scaffolding' },
            { signal: SignalType.UPDATE, type: DataType.VOID, description: 'Update view composition scaffolding' },
            { signal: SignalType.REMOVE, type: DataType.VOID, description: 'Tear down view composition scaffolding' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RECORD, description: 'View composition initialized' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'View composition updated' },
            { signal: SignalType.REMOVED, type: DataType.RECORD, description: 'View composition torn down' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ViewComposer.disposition;
        const { reactTo = [] } = base;
        const signals = [...new Set([...reactTo, ...DEFAULT_SIGNALS])];
        super.innervate(target, { ...base, reactTo: signals });
        this.pulse(SignalType.CREATE, this.getDomainProperties());
        return this;
    }

    protected override capabilities(): Cooky {
        return [];
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
                break;
        }
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), ...payload });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.UPDATED, { ...this.getDomainProperties(), ...payload });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.REMOVED, { ...this.getDomainProperties(), ...payload });
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        const properties = (aim.body ?? {}) as Body;
        return properties;
    }
}

export * from './constants.js';
export * from './types.js';

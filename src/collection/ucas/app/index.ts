import { Uca } from '@uca/core/uca';
import {
    type Cooky,
    type Disposition,
    type Signal,
} from '@uca/core/types';
import { ViewComposer, SignalType as ViewComposerSignalType, type Body as ViewComposerBody } from '@uca/view-composer';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.VOID, description: 'Initialize application scaffolding' },
            { signal: SignalType.UPDATE, type: DataType.VOID, description: 'Update application scaffolding' },
            { signal: SignalType.REMOVE, type: DataType.VOID, description: 'Tear down application scaffolding' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RECORD, description: 'Application initialized' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'Application state updated' },
            { signal: SignalType.REMOVED, type: DataType.RECORD, description: 'Application torn down' },
        ],
    };

    private hasInitialized: boolean = false;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? App.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [ViewComposerSignalType.CREATED];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        super.innervate(target, { ...base, reactTo: signals });
        this.pulse(SignalType.CREATE, this.getDomainProperties());
        return this;
    }

    public override denervate(): void {
        super.denervate();
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const viewDisp: Disposition<ViewComposerBody> = {
            aim: { description: ViewComposer.purpose, body: {} },
            reactTo: [...ViewComposer.disposition.reactTo ?? []],
        };
        return [[ViewComposer, viewDisp]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate();
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            case ViewComposerSignalType.CREATED:
                this.handleViewCreated(value);
                break;
            default:
                break;
        }
    }

    private handleCreate(): void {
        if (this.hasInitialized) { return; }
        this.hasInitialized = true;
        const { aim } = this.disposition;
        const { description = PURPOSE } = aim;
        this.pulse(ViewComposerSignalType.CREATE, { title: description });
        this.pulse(SignalType.CREATED, this.getDomainProperties());
    }

    private handleUpdate(value: unknown): void {
        this.pulse(ViewComposerSignalType.UPDATE, value);
        this.pulse(SignalType.UPDATED, this.getDomainProperties());
    }

    private handleRemove(value: unknown): void {
        this.pulse(ViewComposerSignalType.REMOVE, value);
        this.pulse(SignalType.REMOVED, this.getDomainProperties());
    }

    private handleViewCreated(value: unknown): void {
        const payload = (value ?? {}) as ViewComposerBody;
        this.pulse(SignalType.UPDATED, { view: payload });
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}

export * from './constants.js';
export * from './types.js';

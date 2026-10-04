import { Uca } from '@uca/core/uca';
import {
    type Cooky,
    type Disposition,
    type Signal,
} from '@uca/core/types';
import { ConceptComposer, SignalType as ConceptComposerSignalType, type Body as ConceptComposerBody } from '@uca/concept-composer';
import { ViewComposer, SignalType as ViewComposerSignalType, type Body as ViewComposerBody } from '@uca/view-composer';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

function createChildDisposition<T>(purpose: string, body: T, reactTo?: readonly string[]): Disposition<T> {
    return { aim: { description: purpose, body }, reactTo: [...reactTo ?? []] };
}

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
            { signal: ConceptComposerSignalType.CREATE, type: DataType.RECORD, description: 'Request conceptual capability map' },
        ],
    };

    private hasInitialized: boolean = false;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? App.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [ConceptComposerSignalType.CREATED, ViewComposerSignalType.CREATED];
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
        const { description = PURPOSE } = aim;
        const conceptDisp = createChildDisposition(ConceptComposer.purpose, { prompt: description } as ConceptComposerBody, ConceptComposer.disposition.reactTo);
        const viewDisp = createChildDisposition(ViewComposer.purpose, {} as ViewComposerBody, ViewComposer.disposition.reactTo);
        return [[ConceptComposer, conceptDisp], [ViewComposer, viewDisp]];
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
            case ConceptComposerSignalType.CREATED:
                this.handleConceptCreated(value);
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
        this.pulse(ConceptComposerSignalType.CREATE, { prompt: description, title: description });
        this.pulse(SignalType.CREATED, this.getDomainProperties());
    }

    private handleUpdate(value: unknown): void {
        this.pulse(ConceptComposerSignalType.UPDATE, value);
        this.pulse(ViewComposerSignalType.UPDATE, value);
        this.pulse(SignalType.UPDATED, this.getDomainProperties());
    }

    private handleRemove(value: unknown): void {
        this.pulse(ConceptComposerSignalType.REMOVE, value);
        this.pulse(ViewComposerSignalType.REMOVE, value);
        this.pulse(SignalType.REMOVED, this.getDomainProperties());
    }

    private handleConceptCreated(value: unknown): void {
        this.pulse(SignalType.UPDATED, { concept: value });
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

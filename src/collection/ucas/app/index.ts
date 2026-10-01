import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { ViewComposer, SignalType as ViewComposerSignalType } from '@uca/view-composer';
import { __ID__, DEFAULT_SIGNALS, INITIAL_VIEW_DISPOSITION, INITIAL_VIEW_NEED, VIEW_DISPOSITION_SCHEMA } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = 'Coordinate application lifecycle and scaffolding orchestration';
    public static readonly VIEW_SCHEMA = VIEW_DISPOSITION_SCHEMA;
    public static readonly INITIAL_VIEW = INITIAL_VIEW_DISPOSITION;
    public static readonly INITIAL_NEED = INITIAL_VIEW_NEED;

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: { initialView: INITIAL_VIEW_DISPOSITION } },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.INIT, type: DataType.VOID, description: 'Initialize application scaffolding' },
            { signal: SignalType.START, type: DataType.VOID, description: 'Start application execution' },
            { signal: SignalType.STOP, type: DataType.VOID, description: 'Stop application execution' },
        ],
        outputs: [
            { signal: SignalType.READY, type: DataType.STRING, description: 'Application initialized and ready' },
            { signal: SignalType.STARTED, type: DataType.BOOLEAN, description: 'Application started' },
            { signal: SignalType.STOPPED, type: DataType.BOOLEAN, description: 'Application stopped' },
            { signal: SignalType.VIEW_COMPOSED, type: DataType.COMPOSED_RESULT, description: 'View graph composed' },
            { signal: SignalType.ERROR, type: DataType.STRING, description: 'Application error occurred' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? App.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [ViewComposerSignalType.COMPOSED];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override capabilities(): Cooky {
        const disposition: Disposition = {
            aim: { description: ViewComposer.purpose, body: { schema: VIEW_DISPOSITION_SCHEMA } },
            reactTo: [...ViewComposer.disposition.reactTo ?? []],
        };
        const cooky: Cooky = [[ViewComposer, disposition]];
        return cooky;
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.INIT:
                this.handleInit(value);
                break;
            case SignalType.START:
                this.handleStart();
                break;
            case SignalType.STOP:
                this.handleStop();
                break;
            case ViewComposerSignalType.COMPOSED:
                this.pulse(SignalType.VIEW_COMPOSED, value);
                break;
        }
    }

    public createInitialView(): Record<string, Disposition> {
        const { aim } = this.disposition;
        const { initialView } = aim.body ?? {};
        return initialView ?? INITIAL_VIEW_DISPOSITION;
    }

    private handleInit(value: unknown): void {
        const payload = (value ?? {}) as Body;
        const { title = 'ready', request, initialView } = payload;
        const viewNeed = request ?? INITIAL_VIEW_NEED;
        const ucas = initialView ?? this.createInitialView();
        const viewPayload = { request: viewNeed, schema: VIEW_DISPOSITION_SCHEMA, ucas };
        this.pulse(ViewComposerSignalType.COMPOSE, viewPayload);
        this.pulse(SignalType.READY, title);
    }

    private handleStart(): void {
        this.pulse(SignalType.STARTED, true);
    }

    private handleStop(): void {
        this.pulse(SignalType.STOPPED, false);
    }
}

export * from './types.js';
export * from './constants.js';

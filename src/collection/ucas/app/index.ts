import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { ViewComposer, SignalType as ViewComposerSignalType, type Body as ViewComposerBody, type ComposedResult } from '@uca/view-composer';
import { StyleComposer, type Body as StyleComposerBody } from '@uca/style-composer';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { UCA_ARCHITECTURE_DOCUMENTATION } from './docs.js';
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

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? App.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [ViewComposerSignalType.COMPOSED, ViewComposerSignalType.ERROR];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        super.innervate(target, { ...base, reactTo: signals });
        this.pulse(SignalType.CREATE, this.getDomainProperties());
        return this;
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { documentation = UCA_ARCHITECTURE_DOCUMENTATION, model, endpoint, sseEndpoint } = (aim.body ?? {}) as Body;
        const viewComposerDisposition: Disposition<ViewComposerBody> = {
            aim: { description: ViewComposer.purpose, body: { documentation, model, endpoint, sseEndpoint } },
            reactTo: [...ViewComposer.disposition.reactTo ?? []],
        };
        const styleComposerDisposition: Disposition<StyleComposerBody> = {
            aim: { description: StyleComposer.purpose, body: {} },
            reactTo: [...StyleComposer.disposition.reactTo ?? []],
        };
        return [
            [ViewComposer, viewComposerDisposition],
            [StyleComposer, styleComposerDisposition],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate();
                break;
            case SignalType.UPDATE:
                this.pulse(SignalType.UPDATED, this.getDomainProperties());
                break;
            case SignalType.REMOVE:
                this.pulse(SignalType.REMOVED, this.getDomainProperties());
                break;
            case ViewComposerSignalType.COMPOSED:
                this.handleComposedView(value);
                break;
            default:
                break;
        }
    }

    private hasInitialized: boolean = false;

    private handleCreate(): void {
        if (this.hasInitialized) { return; }
        this.hasInitialized = true;
        const { aim } = this.disposition;
        const { description = PURPOSE } = aim;
        const { documentation = UCA_ARCHITECTURE_DOCUMENTATION } = (aim.body ?? {}) as Body;
        this.pulse(ViewComposerSignalType.COMPOSE, { request: description, documentation, stream: true });
        this.pulse(SignalType.CREATED, this.getDomainProperties());
    }

    private handleComposedView(value: unknown): void {
        const result = (value ?? {}) as ComposedResult;
        this.updateAppDisposition(result);
        this.pulse(SignalType.UPDATED, { composed: true, result });
    }

    private updateAppDisposition(result: ComposedResult): void {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        this.disposition = { ...this.disposition, aim: { ...aim, body: { ...body, composedResult: result } } };
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        const properties = (aim.body ?? {}) as Body;
        return properties;
    }
}

export * from './constants.js';
export * from './types.js';
export * from './docs.js';

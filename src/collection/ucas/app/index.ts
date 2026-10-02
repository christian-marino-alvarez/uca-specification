import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { ViewComposer, SignalType as ViewComposerSignalType, type Body as ViewComposerBody, type ComposedResult } from '@uca/view-composer';
import { Box, SignalType as BoxSignalType } from '@uca/box';
import { Action, SignalType as ActionSignalType } from '@uca/action';
import { __ID__, DEFAULT_BUTTON_LABEL, DEFAULT_QUESTION, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { UCA_ARCHITECTURE_DOCUMENTATION } from './docs.js';
import { type Body, DataType, SignalType } from './types.js';

export class App extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: { question: DEFAULT_QUESTION, buttonLabel: DEFAULT_BUTTON_LABEL } },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.VOID, description: 'Initialize application scaffolding' },
            { signal: SignalType.UPDATE, type: DataType.VOID, description: 'Update application scaffolding' },
            { signal: SignalType.REMOVE, type: DataType.VOID, description: 'Tear down application scaffolding' },
            { signal: SignalType.EXPLAIN, type: DataType.VOID, description: 'Trigger UCA view composition via ViewComposer' },
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
        const internalSignals = [
            ViewComposerSignalType.COMPOSED,
            ViewComposerSignalType.ERROR,
            ActionSignalType.TRIGGER,
            ActionSignalType.TRIGGERED,
        ];
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
        const boxDisposition: Disposition = {
            aim: { description: 'Centered loading box', body: { id: 'box:center-container', text: DEFAULT_QUESTION, className: 'loading' } },
            reactTo: [...Box.disposition.reactTo ?? []],
        };
        const actionDisposition: Disposition = {
            aim: { description: 'Action button', body: { id: 'action:query-button', label: DEFAULT_BUTTON_LABEL } },
            reactTo: [...Action.disposition.reactTo ?? []],
        };
        return [[ViewComposer, viewComposerDisposition], [Box, boxDisposition], [Action, actionDisposition]];
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
            case ActionSignalType.TRIGGER:
            case ActionSignalType.TRIGGERED:
            case SignalType.EXPLAIN:
                this.triggerExplanation();
                break;
            case ViewComposerSignalType.COMPOSED:
                this.handleComposedView(value);
                break;
            default:
                break;
        }
    }

    private handleCreate(): void {
        const { aim } = this.disposition;
        const { documentation = UCA_ARCHITECTURE_DOCUMENTATION } = (aim.body ?? {}) as Body;
        const request = 'Componer la vista inicial interactiva: debe contener un texto central invitando a conocer la arquitectura UCA y un botón interactivo para explorarlo';
        this.pulse(ViewComposerSignalType.COMPOSE, { request, documentation });
        this.pulse(SignalType.CREATED, this.getDomainProperties());
    }

    private triggerExplanation(): void {
        const { aim } = this.disposition;
        const { documentation = UCA_ARCHITECTURE_DOCUMENTATION } = (aim.body ?? {}) as Body;
        this.pulse(BoxSignalType.UPDATE, { id: 'box:center-container', text: '🧠 Razonando arquitectura UCA con Gemini...', className: 'loading' });
        this.pulse(ActionSignalType.UPDATE, { id: 'action:query-button', label: 'Razonando...', disabled: true });
        const request = 'Explicar de forma interactiva y estructurada qué es la arquitectura UCA, sus invariantes ontológicas y composición Cooky';
        this.pulse(ViewComposerSignalType.COMPOSE, { request, documentation });
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

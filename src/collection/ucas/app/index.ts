import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { ViewBuilder } from '../view-builder/index.js';
import { SignalType as ViewSignalType } from '../view-builder/types.js';
import { LogicBuilder } from '../logic-builder/index.js';
import { SignalType as LogicSignalType } from '../logic-builder/types.js';
import { StyleBuilder } from '../style-builder/index.js';
import { SignalType as StyleSignalType, type StyleDesignResult } from '../style-builder/types.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import {
    type Body,
    type GeneratePayload,
    type AppExecutionResult,
    SignalType,
} from './types.js';

export class App extends Uca<Body> {
    public static readonly PURPOSE: string = 'Demonstrate coordinated autonomous application assembly using ViewBuilder, LogicBuilder and StyleBuilder';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(App.PURPOSE, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.INIT, type: 'void', description: 'Initialize demo application context' },
                { signal: SignalType.GENERATE, type: 'GeneratePayload', description: 'Trigger full generation flow across builders' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort active generation workflow' },
            ],
            outputs: [
                { signal: SignalType.READY, type: '{ status: string }', description: 'Application ready notification' },
                { signal: SignalType.RENDERED, type: 'AppExecutionResult', description: 'Final assembled demo application result' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'Application workflow error' },
            ],
        });
    }

    public constructor(id: string = __ID__) {
        super(id, App.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? App.createDefaultDisposition();
        const { reactTo = [] } = baseDisposition;
        const internalSignals = [
            ViewSignalType.VISUAL,
            ViewSignalType.GRAPH,
            LogicSignalType.RESOLVED,
            StyleSignalType.STYLED,
            ViewSignalType.ERROR,
            LogicSignalType.ERROR,
            StyleSignalType.ERROR,
        ];
        const initialSignals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const signals = Array.from(new Set([...initialSignals, ...internalSignals]));
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        return super.innervate(target, activeDisposition);
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { promptAdapter } = aim.body ?? {};
        const viewDisp = Capability.createDisposition('View structure builder', { promptAdapter }, [ViewSignalType.BUILD]);
        const logicDisp = Capability.createDisposition('Logic connectivity builder', {}, [ViewSignalType.GRAPH]);
        const styleDisp = Capability.createDisposition('Style presentation builder', {}, [ViewSignalType.VISUAL]);
        return [
            [ViewBuilder, viewDisp],
            [LogicBuilder, logicDisp],
            [StyleBuilder, styleDisp],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.INIT:
                this.handleInit();
                break;
            case SignalType.GENERATE:
                this.handleGenerate(value);
                break;
            case SignalType.ABORT:
                this.handleAbort();
                break;
            default:
                this.handleBuilderSignal(property, value);
                break;
        }
    }

    private handleInit(): void {
        this.pulse(SignalType.READY, { status: 'initialized' });
    }

    private handleGenerate(value: unknown): void {
        const payload = this.extractPayload<GeneratePayload>(value);
        const { aim } = this.disposition;
        const fallback = aim.body ?? {};
        const description = payload?.description ?? fallback.defaultDescription ?? 'Interactive Demo Application';
        const container = payload?.container ?? fallback.container;
        this.disposition = { ...this.disposition, aim: { ...aim, body: { ...fallback, container } } };
        this.pulse(ViewSignalType.BUILD, { description });
    }

    private handleAbort(): void {
        this.pulse(ViewSignalType.ABORT, undefined);
        this.pulse(LogicSignalType.ABORT, undefined);
        this.pulse(StyleSignalType.ABORT, undefined);
    }

    private handleBuilderSignal(property: string, value: unknown): void {
        if (property === ViewSignalType.ERROR || property === LogicSignalType.ERROR || property === StyleSignalType.ERROR) {
            this.pulse(SignalType.ERROR, value);
        } else if (property === StyleSignalType.STYLED) {
            this.handleStyledResult(value as StyleDesignResult);
        }
    }

    private handleStyledResult(style: StyleDesignResult): void {
        const { aim } = this.disposition;
        const { container } = aim.body ?? {};
        if (container && typeof document !== 'undefined') {
            this.renderGoogleDemoToDom(container);
        }
        const result: AppExecutionResult = {
            visual: {
                title: style.viewTitle,
                elements: [
                    { id: 'search-box', type: 'box', props: { role: 'search' } },
                    { id: 'search-input', type: 'input', props: { placeholder: 'Search...', role: 'searchbox' } },
                    { id: 'search-button', type: 'action', props: { text: 'Google Search', role: 'button' } },
                ],
            },
            graph: {
                nodes: [
                    { id: 'search-input', aimDescription: 'Query text input', inputsCount: 1, outputsCount: 1 },
                    { id: 'search-button', aimDescription: 'Search button trigger', inputsCount: 1, outputsCount: 1 },
                ],
                edges: [
                    { fromNode: 'search-button', toNode: 'search-input', signal: 'action.triggered', type: 'void' },
                ],
            },
            logic: {
                viewGraph: { nodes: [], edges: [] },
                connections: [{ sourceNode: 'search-button', targetNode: 'search-input', signal: 'action.triggered' }],
            },
            style,
            container,
        };
        this.pulse(SignalType.RENDERED, result);
    }

    private renderGoogleDemoToDom(container: HTMLElement): void {
        container.innerHTML = '';
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        const input = document.createElement('input');
        input.className = 'search-input';
        input.placeholder = 'Search Google or type a URL...';
        input.setAttribute('role', 'searchbox');
        const button = document.createElement('button');
        button.className = 'search-button';
        button.textContent = 'Google Search';
        button.setAttribute('role', 'button');
        button.addEventListener('click', () => {
            this.pulse('action.triggered', { query: input.value });
        });
        searchBox.appendChild(input);
        searchBox.appendChild(button);
        container.appendChild(searchBox);
    }
}

export * from './types.js';
export * from './constants.js';
export { Capability } from '../../../core/capability.js';



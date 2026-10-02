import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { LlmWeb, SignalType as LlmWebSignalType } from '@uca/llm-web';
import { Graph, SignalType as GraphSignalType, type ResolvedResult, type ViewGraph } from '@uca/capability-graph';
import { Box, SignalType as BoxSignalType } from '@uca/box';
import { List } from '@uca/list';
import { Action, SignalType as ActionSignalType } from '@uca/action';
import { Toggle } from '@uca/toggle';
import { AVAILABLE_UCAS_CATALOG, __ID__, DEFAULT_SIGNALS, DEFAULT_VIEW_SCHEMA, PURPOSE } from './constants.js';
import {
    type Body,
    type ComposePayload,
    type ComposedResult,
    DataType,
    SignalType,
} from './types.js';

export class ViewComposer extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: ViewComposer.purpose, body: { schema: { ...DEFAULT_VIEW_SCHEMA } } },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.COMPOSE, type: DataType.COMPOSE_PAYLOAD, description: 'Request cognitive view graph composition' },
        ],
        outputs: [
            { signal: SignalType.COMPOSED, type: DataType.COMPOSED_RESULT, description: 'Emits composed view graph and dispositions' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits cognitive composition error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ViewComposer.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [
            LlmWebSignalType.RESPONSE,
            LlmWebSignalType.ERROR,
            GraphSignalType.RESOLVED,
            ActionSignalType.TRIGGER,
            ActionSignalType.TRIGGERED,
        ];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, endpoint, sseEndpoint } = (aim.body ?? {}) as Body;
        const llmDisp: Disposition = { aim: { description: LlmWeb.purpose, body: { model, endpoint, sseEndpoint } }, reactTo: [...LlmWeb.disposition.reactTo ?? []] };
        const graphDisp: Disposition = { aim: { description: Graph.AIM, body: {} }, reactTo: [...Graph.disposition.reactTo ?? []] };
        const visualDeclarations = this.getComposedVisualCapabilities();
        return [[LlmWeb, llmDisp], [Graph, graphDisp], ...visualDeclarations];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.COMPOSE:
                this.handleCompose(value);
                break;
            case LlmWebSignalType.RESPONSE:
                this.handleLlmResponse(value);
                break;
            case GraphSignalType.RESOLVED:
                this.handleGraphResolved(value);
                break;
            case ActionSignalType.TRIGGER:
            case ActionSignalType.TRIGGERED:
                this.handleActionTrigger(value);
                break;
            case LlmWebSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private getComposedVisualCapabilities(): Cooky {
        const boxDisp: Disposition = { aim: { description: 'Explanation card', body: { id: 'box:explanation-card', className: 'explanation-card' } }, reactTo: [...Box.disposition.reactTo ?? []] };
        const listDisp: Disposition = { aim: { description: 'Ontological pillars list', body: { id: 'list:ontological-pillars', className: 'pillars-list' } }, reactTo: [...List.disposition.reactTo ?? []] };
        const actionDisp: Disposition = { aim: { description: 'Pulse simulation trigger', body: { id: 'action:simulate-pulse', className: 'simulate-action' } }, reactTo: [...Action.disposition.reactTo ?? []] };
        const toggleDisp: Disposition = { aim: { description: 'Reactive stream toggle', body: { id: 'toggle:reactive-mode', className: 'reactive-toggle' } }, reactTo: [...Toggle.disposition.reactTo ?? []] };
        return [[Box, boxDisp], [List, listDisp], [Action, actionDisp], [Toggle, toggleDisp]];
    }

    private handleCompose(value: unknown): void {
        const payload = (value ?? {}) as ComposePayload;
        const { ucas, request, model, documentation } = payload;
        if (ucas) {
            this.pulse(GraphSignalType.RESOLVE, { ucas });
            return;
        }
        if (!request) { return; }
        const { aim } = this.disposition;
        const activeDocs = documentation ?? aim.body?.documentation;
        const prompt = this.buildPrompt(request, activeDocs);
        this.pulse(LlmWebSignalType.PROMPT, { prompt, model });
    }

    private buildPrompt(request: string, documentation?: string): string {
        if (!documentation) { return request; }
        const schemaHint = 'Compose a visual interactive explanation using "box:explanation-card" (with "text" explaining formula u = (p, d, C, O)), "list:ontological-pillars" (with "items" array for Purpose, Disposition, Capabilities, Outcomes), "action:simulate-pulse" (hidden: false), and "toggle:reactive-mode" (checked: true, hidden: false). Return JSON object with "ucas": [ { "id": "...", "aim": { "description": "...", "body": {...} }, "reactTo": [...] } ] and "answer": "<concise summary>".';
        return `${documentation}\n\n${AVAILABLE_UCAS_CATALOG}\n\nTask: ${request}\n${schemaHint}`;
    }

    private handleLlmResponse(value: unknown): void {
        this.pulse(GraphSignalType.RESOLVE, value);
    }

    private handleGraphResolved(value: unknown): void {
        const resolved = (value ?? {}) as ResolvedResult;
        const { ucas, graph, answer } = resolved;
        this.updateViewDisposition(ucas, graph, answer);
        const composed: ComposedResult = { ucas, graph, result: { answer } };
        this.pulse(SignalType.COMPOSED, composed);
    }

    private handleActionTrigger(value: unknown): void {
        const { id } = (value ?? {}) as { id?: string };
        if (id && !id.includes('simulate-pulse')) { return; }
        const pulseInfo = { timestamp: Date.now(), signal: 'uca.pulse', message: '⚡ [UCA Bus] ¡Estímulo nervioso propagado en tiempo real!' };
        this.pulse('uca.pulse', pulseInfo);
        this.pulse(BoxSignalType.UPDATE, { id: 'box:center-container', text: '⚡ ¡Pulso nervioso recibido y procesado por la red UCA!' });
    }

    private updateViewDisposition(ucas: Record<string, Disposition>, graph: ViewGraph, answer?: string): void {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const updatedBody = { ...body, ucas, graph, answer };
        this.disposition = { ...this.disposition, aim: { ...aim, body: updatedBody } };
    }
}

export * from './constants.js';
export * from './types.js';
export { ViewComposer as ViewBuilder };

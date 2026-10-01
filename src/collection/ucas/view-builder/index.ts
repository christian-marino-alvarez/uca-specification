import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Llm, SignalType as LlmSignalType, type Body as LlmBody, type InferResult } from '@uca/llm';
import { __ID__, DEFAULT_SIGNALS, DEFAULT_VIEW_SCHEMA } from './constants.js';
import {
    type Body,
    type BuildPayload,
    type ViewGraphResult,
    type ViewVisualResult,
    DataType,
    SignalType,
} from './types.js';

export class ViewBuilder extends Uca<Body> {
    public static override purpose: string = 'Orchestrate cognitive generation of web capability views using LLM';

    public static override disposition: Disposition<Body> = {
        aim: { description: ViewBuilder.purpose, body: { schema: { ...DEFAULT_VIEW_SCHEMA } } },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.BUILD, type: DataType.BUILD_PAYLOAD, description: 'Request cognitive web view generation' },
            { signal: SignalType.ABORT, type: DataType.VOID, description: 'Abort active view generation' },
        ],
        outputs: [
            { signal: SignalType.VISUAL, type: DataType.VIEW_VISUAL, description: 'Generated visual web capabilities tree' },
            { signal: SignalType.GRAPH, type: DataType.VIEW_GRAPH, description: 'Generated reactive topology graph' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Cognitive view generation error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ViewBuilder.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [LlmSignalType.INFERRED, LlmSignalType.ERROR];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, connection } = aim.body ?? {};
        const purpose = 'Cognitive reasoning engine for web capability view generation';
        const disposition: Disposition<LlmBody> = {
            aim: { description: purpose, body: { model, connection } },
            reactTo: [LlmSignalType.INFER, LlmSignalType.CONNECT],
        };
        const cooky: Cooky = [[Llm, disposition]];
        return cooky;
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.BUILD:
                this.handleBuild(value);
                break;
            case LlmSignalType.INFERRED:
                this.handleLlmInferred(value);
                break;
            case LlmSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
        }
    }

    private handleBuild(value: unknown): void {
        const payload = (value ?? {}) as BuildPayload;
        const { description, context, model, schema: payloadSchema } = payload;
        if (!description) {
            return;
        }
        const { aim } = this.disposition;
        const { schema: fallbackSchema } = aim.body ?? {};
        const expectations = payloadSchema ?? fallbackSchema ?? DEFAULT_VIEW_SCHEMA;
        const request = `Generate web capability view elements and reactive graph for: ${description}`;
        this.pulse(LlmSignalType.INFER, { request, context, model, expectations });
    }

    private handleLlmInferred(value: unknown): void {
        const result = (value ?? {}) as InferResult;
        const { data, response } = result;
        const payload = data ?? response;
        const { aim } = this.disposition;
        const { parser } = aim.body ?? {};
        const parsed = parser ? parser(payload) : this.parseViewOutcome(payload);
        const { visual, graph } = parsed;
        this.pulse(SignalType.VISUAL, visual);
        this.pulse(SignalType.GRAPH, graph);
    }

    private parseViewOutcome(answer: unknown): { visual: ViewVisualResult; graph: ViewGraphResult } {
        const record = (typeof answer === 'object' && answer !== null ? answer : {}) as Record<string, unknown>;
        const visual = this.resolveVisual(record.visual);
        const graph = this.resolveGraph(record.graph);
        return { visual, graph };
    }

    private resolveVisual(visual: unknown): ViewVisualResult {
        if (visual && typeof visual === 'object' && 'elements' in visual) {
            return visual as ViewVisualResult;
        }
        return {
            title: 'Generated Web View',
            elements: [
                { id: 'view-container', type: 'box', props: { role: 'main' } },
                { id: 'view-input', type: 'input', props: { placeholder: 'Enter value...' } },
                { id: 'view-submit', type: 'action', props: { label: 'Submit' } },
            ],
        };
    }

    private resolveGraph(graph: unknown): ViewGraphResult {
        if (graph && typeof graph === 'object' && 'nodes' in graph) {
            return graph as ViewGraphResult;
        }
        return {
            nodes: [
                { id: 'view-input', aimDescription: 'User input element', inputsCount: 1, outputsCount: 1 },
                { id: 'view-submit', aimDescription: 'Action button to trigger view submission', inputsCount: 1, outputsCount: 1 },
            ],
            edges: [
                { fromNode: 'view-submit', toNode: 'view-input', signal: 'action.triggered', type: 'void' },
            ],
        };
    }
}

export * from './constants.js';
export * from './types.js';

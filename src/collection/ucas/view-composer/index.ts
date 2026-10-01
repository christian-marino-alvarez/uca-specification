import { Uca } from '@uca/core/uca';
import { DispositionSignal, type Cooky, type Disposition, type DispositionUpdatePayload, type Signal } from '@uca/core/types';
import { Llm, SignalType as LlmSignalType, type Body as LlmBody, type InferResult } from '@uca/llm';
import { __ID__, DEFAULT_SIGNALS, DEFAULT_VIEW_SCHEMA, PURPOSE } from './constants.js';
import {
    type Body,
    type ComposePayload,
    type ComposedResult,
    type GraphEdge,
    type GraphNode,
    type ViewGraph,
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
        const internalSignals = [LlmSignalType.INFERRED, LlmSignalType.ERROR];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, connection } = aim.body ?? {};
        const purpose = 'Cognitive reasoning engine for view graph composition';
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
            case SignalType.COMPOSE:
                this.handleCompose(value);
                break;
            case LlmSignalType.INFERRED:
                this.handleLlmInferred(value);
                break;
            case LlmSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
        }
    }

    private handleCompose(value: unknown): void {
        const payload = (value ?? {}) as ComposePayload;
        const { request, context, model, schema: payloadSchema } = payload;
        if (!request) { return; }
        const { aim } = this.disposition;
        const { schema: fallbackSchema } = aim.body ?? {};
        const expectations = payloadSchema ?? fallbackSchema ?? DEFAULT_VIEW_SCHEMA;
        this.pulse(LlmSignalType.INFER, { request, context, model, expectations });
    }

    private handleLlmInferred(value: unknown): void {
        const result = (value ?? {}) as InferResult;
        const { data, response } = result;
        const rawPayload = (data ?? response ?? {}) as Record<string, unknown>;
        const ucas = (rawPayload.ucas ?? rawPayload) as Record<string, Disposition>;
        this.propagateDispositions(ucas);
        const graph = this.buildGraph(ucas);
        const composed: ComposedResult = { ucas, graph };
        this.pulse(SignalType.COMPOSED, composed);
    }

    private propagateDispositions(ucas: Record<string, Disposition>): void {
        for (const [ucaId, disposition] of Object.entries(ucas)) {
            const updatePayload: DispositionUpdatePayload = { targetId: ucaId, disposition };
            this.pulse(DispositionSignal.UPDATE, updatePayload);
        }
    }

    private buildGraph(ucas: Record<string, Disposition>): ViewGraph {
        const nodes = this.buildNodes(ucas);
        const edges = this.buildEdges(ucas);
        return { nodes, edges };
    }

    private buildNodes(ucas: Record<string, Disposition>): GraphNode[] {
        return Object.entries(ucas).map(([id, disposition]) => {
            const { aim, inputs = [], outputs = [] } = disposition;
            const { description = '' } = aim ?? {};
            return { id, aimDescription: description, inputsCount: inputs.length, outputsCount: outputs.length };
        });
    }

    private buildEdges(ucas: Record<string, Disposition>): GraphEdge[] {
        const edges: GraphEdge[] = [];
        for (const [consumerId, consumerDisp] of Object.entries(ucas)) {
            const { reactTo = [] } = consumerDisp;
            this.matchEdgesForConsumer(consumerId, reactTo, ucas, edges);
        }
        return edges;
    }

    private matchEdgesForConsumer(
        toNode: string,
        reactTo: readonly string[],
        ucas: Record<string, Disposition>,
        edges: GraphEdge[],
    ): void {
        for (const [producerId, producerDisp] of Object.entries(ucas)) {
            const { outputs = [] } = producerDisp;
            for (const output of outputs) {
                if (reactTo.includes(output.signal) && producerId !== toNode) {
                    edges.push({ fromNode: producerId, toNode, signal: output.signal, type: output.type });
                }
            }
        }
    }
}

export * from './constants.js';
export * from './types.js';

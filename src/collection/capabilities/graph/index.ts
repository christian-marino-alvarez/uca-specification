import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, AIM, DEFAULT_SIGNALS } from './constants.js';
import {
    type Body,
    type GraphEdge,
    type GraphNode,
    type StreamDecodedPayload,
    type ViewGraph,
    DataType,
    SignalType,
} from './types.js';
import type { UcaItem } from './schema.js';
import { scanUcaCandidates } from './parser.js';

export class Graph extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: Graph.AIM, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.STREAM_DECODED, type: DataType.STREAM_DECODED_PAYLOAD, description: 'Readable stream of decoded token texts' },
        ],
        outputs: [
            { signal: SignalType.UCA_STREAM, type: DataType.UCA_STREAM_PAYLOAD, description: 'Readable stream of validated UCA items' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits graph validation error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.STREAM_DECODED:
                this.handleDecodedStream(value);
                break;
            default:
                break;
        }
    }

    public createUcaTransform(): TransformStream<string, UcaItem> {
        const context = { buffer: '', dispatched: new Set<string>() };
        return new TransformStream({
            transform: (delta, controller) => this.transformUcaDelta(delta, controller, context),
        });
    }

    private transformUcaDelta(
        delta: string,
        controller: TransformStreamDefaultController<UcaItem>,
        context: { buffer: string; dispatched: Set<string> },
    ): void {
        context.buffer += delta;
        const { validUcas } = scanUcaCandidates(context.buffer);
        for (const uca of validUcas) {
            const { id } = uca;
            if (!context.dispatched.has(id)) {
                context.dispatched.add(id);
                controller.enqueue(uca);
            }
        }
    }

    private handleDecodedStream(value: unknown): void {
        const payload = (value ?? {}) as StreamDecodedPayload;
        const { stream, streamId } = payload;
        if (!stream) { return; }
        const ucaStream = stream.pipeThrough(this.createUcaTransform());
        this.pulse(SignalType.UCA_STREAM, { streamId, stream: ucaStream });
    }
}

export function buildGraph(ucas: Record<string, Disposition>): ViewGraph {
    const nodes = buildNodes(ucas);
    const edges = buildEdges(ucas);
    return { nodes, edges };
}

function buildNodes(ucas: Record<string, Disposition>): GraphNode[] {
    return Object.entries(ucas).map(([id, disposition]) => {
        const { aim, inputs = [], outputs = [] } = disposition;
        const { description = '' } = aim ?? {};
        return { id, aimDescription: description, inputsCount: inputs.length, outputsCount: outputs.length };
    });
}

function buildEdges(ucas: Record<string, Disposition>): GraphEdge[] {
    const edges: GraphEdge[] = [];
    for (const [consumerId, consumerDisp] of Object.entries(ucas)) {
        const { reactTo = [] } = consumerDisp;
        matchEdgesForConsumer(consumerId, reactTo, ucas, edges);
    }
    return edges;
}

function matchEdgesForConsumer(
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

export * from './constants.js';
export * from './types.js';
export * from './schema.js';
export * from './parser.js';

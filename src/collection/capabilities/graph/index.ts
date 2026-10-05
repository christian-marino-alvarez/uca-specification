import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, AIM, DEFAULT_SIGNALS } from './constants.js';
import {
    type Body,
    type GraphNode,
    type StreamDecodedPayload,
    DataType,
    SignalType,
} from './types.js';
import { scanGraphNodes, scanUcaCandidates } from './parser.js';

export class Graph extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: Graph.AIM, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.STREAM_DECODED, type: DataType.STREAM_DECODED_PAYLOAD, description: 'Readable stream of decoded token texts' },
        ],
        outputs: [
            { signal: SignalType.STREAM, type: DataType.GRAPH_STREAM_PAYLOAD, description: 'Readable stream of validated graph nodes' },
            { signal: SignalType.NODE_DETECTED, type: DataType.GRAPH_NODE, description: 'Emitted when a graph node key-value is read' },
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

    public createGraphTransform(schema?: unknown): TransformStream<string, GraphNode> {
        const context = { buffer: '', dispatched: new Set<string>(), schema };
        return new TransformStream({
            transform: (delta, controller) => this.transformGraphDelta(delta, controller, context),
        });
    }

    public createUcaTransform(): TransformStream<string, GraphNode> {
        return this.createGraphTransform();
    }

    private dispatchUcaList(
        controller: TransformStreamDefaultController<GraphNode>,
        context: { buffer: string; dispatched: Set<string> },
    ): void {
        const { validUcas } = scanUcaCandidates(context.buffer);
        for (const uca of validUcas) {
            const { id } = uca;
            if (!context.dispatched.has(id)) {
                context.dispatched.add(id);
                controller.enqueue({ key: id, value: uca, id } as GraphNode & { id: string });
                this.pulse(SignalType.NODE_DETECTED, uca);
            }
        }
    }

    private dispatchGraphNodes(
        controller: TransformStreamDefaultController<GraphNode>,
        context: { buffer: string; dispatched: Set<string>; schema?: unknown },
    ): void {
        const nodes = scanGraphNodes(context.buffer, context.schema);
        for (const node of nodes) {
            const { key } = node;
            if (!context.dispatched.has(key)) {
                context.dispatched.add(key);
                controller.enqueue(node);
                this.pulse(SignalType.NODE_DETECTED, node);
            }
        }
    }

    private transformGraphDelta(
        delta: string,
        controller: TransformStreamDefaultController<GraphNode>,
        context: { buffer: string; dispatched: Set<string>; schema?: unknown },
    ): void {
        context.buffer += delta;
        if (/"ucas"\s*:\s*\[/.test(context.buffer)) {
            this.dispatchUcaList(controller, context);
            return;
        }
        this.dispatchGraphNodes(controller, context);
    }

    private handleDecodedStream(value: unknown): void {
        const payload = (value ?? {}) as StreamDecodedPayload;
        const { stream, streamId } = payload;
        if (!stream) { return; }
        const { aim } = this.disposition;
        const { schema } = (aim.body ?? {}) as Body;
        const nodeStream = stream.pipeThrough(this.createGraphTransform(schema));
        this.pulse(SignalType.STREAM, { streamId, stream: nodeStream });
    }
}



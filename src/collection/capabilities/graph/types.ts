export enum SignalType {
    STREAM_DECODED = 'llm-web.stream_decoded',
    STREAM = 'graph.stream',
    UCA_STREAM = 'graph.stream',
    NODE_DETECTED = 'graph.node_detected',
    ERROR = 'graph.error',
}

export enum DataType {
    STREAM_DECODED_PAYLOAD = 'StreamDecodedPayload',
    GRAPH_STREAM_PAYLOAD = 'GraphStreamPayload',
    GRAPH_NODE = 'GraphNode',
    UNKNOWN = 'unknown',
}

export interface StreamDecodedPayload {
    readonly streamId?: string;
    readonly stream: ReadableStream<string>;
    readonly model?: string;
}

export interface GraphNode<T = unknown> {
    readonly key: string;
    readonly value: T;
}

export interface GraphStreamPayload {
    readonly streamId?: string;
    readonly stream: ReadableStream<GraphNode>;
}

export interface NodeDetectedPayload {
    readonly key: string;
    readonly value: unknown;
    readonly streamId?: string;
}

export interface Body {
    readonly schema?: unknown;
    readonly strict?: boolean;
}

export type UcaItem = GraphNode;
export type UcaStreamPayload = GraphStreamPayload;
export type { ResponseSchema } from './schemas/index.js';


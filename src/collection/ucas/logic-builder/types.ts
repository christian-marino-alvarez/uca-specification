import type { GraphNode, GraphEdge } from '../view-builder/types.js';

export type { GraphNode, GraphEdge };

export enum SignalType {
    COMPOSE = 'logic-builder.compose',
    ABORT = 'logic-builder.abort',
    RESOLVED = 'logic-builder.resolved',
    STREAM = 'logic-builder.stream',
    ERROR = 'logic-builder.error',
}

export interface LogicConnection {
    readonly sourceNode: string;
    readonly targetNode: string;
    readonly signal: string;
}

export interface LogicPlan {
    readonly viewGraph: { nodes: readonly GraphNode[]; edges: readonly GraphEdge[] };
    readonly connections: readonly LogicConnection[];
}

export interface ComposePayload {
    readonly nodes: readonly GraphNode[];
    readonly edges: readonly GraphEdge[];
    readonly requirements?: string;
    readonly signal?: AbortSignal;
}

export interface Body {
    readonly resolver?: (graph: ComposePayload) => LogicPlan;
}

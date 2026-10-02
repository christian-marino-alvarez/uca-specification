import type { Disposition } from '@uca/core/types';

export enum SignalType {
    RESOLVE = 'graph.resolve',
    RESOLVED = 'graph.resolved',
    ERROR = 'graph.error',
}

export enum DataType {
    RESOLVE_PAYLOAD = 'ResolvePayload',
    RESOLVED_RESULT = 'ResolvedResult',
    UNKNOWN = 'unknown',
}

export interface GraphNode {
    readonly id: string;
    readonly aimDescription: string;
    readonly inputsCount: number;
    readonly outputsCount: number;
}

export interface GraphEdge {
    readonly fromNode: string;
    readonly toNode: string;
    readonly signal: string;
    readonly type: string;
}

export interface ViewGraph {
    readonly nodes: readonly GraphNode[];
    readonly edges: readonly GraphEdge[];
}

export interface ResolvePayload {
    readonly response?: string;
    readonly data?: Record<string, unknown>;
    readonly ucas?: Record<string, Disposition>;
}

export interface ResolvedResult {
    readonly ucas: Record<string, Disposition>;
    readonly graph: ViewGraph;
    readonly answer?: string;
}

export interface Body {
    readonly strict?: boolean;
}

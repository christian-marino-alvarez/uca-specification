import type { Disposition } from '@uca/core/types';

export enum SignalType {
    COMPOSE = 'view-composer.compose',
    COMPOSED = 'view-composer.composed',
    ERROR = 'view-composer.error',
}

export enum DataType {
    COMPOSE_PAYLOAD = 'ComposePayload',
    COMPOSED_RESULT = 'ComposedResult',
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

export interface ComposedResult {
    readonly ucas: Record<string, Disposition>;
    readonly graph: ViewGraph;
}

export interface ComposePayload {
    readonly request?: string;
    readonly context?: Record<string, unknown>;
    readonly model?: string;
    readonly schema?: Record<string, unknown>;
    readonly ucas?: Record<string, Disposition>;
}

export interface Body {
    readonly model?: string;
    readonly connection?: Record<string, unknown>;
    readonly schema?: Record<string, unknown>;
}

import type { Disposition } from '@uca/core/types';

export enum SignalType {
    RESOLVE = 'graph.resolve',
    RESOLVED = 'graph.resolved',
    CHUNK = 'llm-web.chunk',
    CHUNK_PROMPT_API = 'prompt-api.chunk',
    COMPLETED = 'llm-web.completed',
    STREAM_END_PROMPT_API = 'prompt-api.stream-end',
    UCA_DETECTED = 'graph.uca_detected',
    RETRY = 'graph.retry',
    ERROR = 'graph.error',
}

export enum DataType {
    RESOLVE_PAYLOAD = 'ResolvePayload',
    RESOLVED_RESULT = 'ResolvedResult',
    STREAM_CHUNK_PAYLOAD = 'StreamChunkPayload',
    UCA_DETECTED_PAYLOAD = 'UcaDetectedPayload',
    RETRY_PAYLOAD = 'RetryPayload',
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

export interface StreamChunkPayload {
    readonly text: string;
    readonly model?: string;
}

export interface UcaDetectedPayload {
    readonly id: string;
    readonly disposition: Disposition;
}

export interface RetryPayload {
    readonly raw?: string;
    readonly error?: unknown;
    readonly reason?: string;
}

export interface Body {
    readonly strict?: boolean;
}

export type { ResponseSchema, ResponseData, UcaItem } from './schema.js';

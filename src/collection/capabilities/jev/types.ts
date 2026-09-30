import type { Disposition } from '../../../core/types.js';
import type { TypeSafeClient } from '@typesafe-ai/sdk';

export enum SignalType {
    CONNECT = 'jev.connect',
    GRAPH = 'jev.graph',
    DISCONNECT = 'jev.disconnect',
    ABORT = 'jev.abort',
    CONNECTED = 'jev.connected',
    STREAM = 'jev.stream',
    CLOSED = 'jev.closed',
    ERROR = 'jev.error',
}

export interface ConnectionConfig {
    readonly apiKey?: string;
    readonly endpoint?: string;
    readonly model?: string;
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

export interface GraphChunk {
    readonly type: 'node' | 'edge' | 'meta';
    readonly payload: GraphNode | GraphEdge | Record<string, unknown>;
}

export interface DomainDispositionsPayload {
    readonly domain: string;
    readonly dispositions: readonly Disposition[];
    readonly context?: Record<string, unknown>;
}

export type StreamOutput = ReadableStream<GraphChunk>;

export interface GraphStreamResolver {
    (payload: DomainDispositionsPayload, signal?: AbortSignal): StreamOutput | Promise<StreamOutput>;
}

export interface Body {
    readonly client?: TypeSafeClient;
    readonly connection?: ConnectionConfig;
    readonly resolver?: GraphStreamResolver;
}


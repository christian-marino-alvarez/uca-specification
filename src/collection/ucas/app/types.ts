import type { Body, CreatePayload, StreamPayload } from './schema.js';
import type { Item, Node, Scaffold as ScaffoldStructure } from '@uca/scaffold/types';

export enum SignalType {
    CREATE = 'app.create',
    CREATED = 'app.created',
    STREAM = 'app.stream',
    STREAMED = 'app.streamed',
    CHUNK = 'app.chunk',
    LOADING = 'app.loading',
    PROGRESS = 'app.progress',
    DESTROY = 'app.destroy',
    DESTROYED = 'app.destroyed',
    ERROR = 'app.error',
}

export enum DataType {
    PAYLOAD = 'payload',
    RECORD = 'record',
    STREAM = 'stream',
    BOOLEAN = 'boolean',
    NUMBER = 'number',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export interface ProgressResult {
    readonly percentage: number;
    readonly loaded?: number;
    readonly total?: number;
}

export interface LoadingResult {
    readonly loading: boolean;
    readonly message?: string;
}

export interface CreatedResult {
    readonly correlationId?: string;
    readonly scaffold: ScaffoldStructure;
}

export interface StreamResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<Item>;
}

export interface DestroyResult {
    readonly destroyed: boolean;
}

export type { Body, CreatePayload, StreamPayload, Item, Node, ScaffoldStructure as Scaffold };

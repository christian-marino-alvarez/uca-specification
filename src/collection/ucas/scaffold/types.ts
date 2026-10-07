import type {
    Body,
    CreatePayload,
    Item,
    Node,
    Scaffold,
    StreamPayload,
} from './schema.js';

export enum SignalType {
    CREATE = 'scaffold.create',
    CREATED = 'scaffold.created',
    STREAM = 'scaffold.stream',
    STREAMED = 'scaffold.streamed',
    CHUNK = 'scaffold.chunk',
    DESTROY = 'scaffold.destroy',
    DESTROYED = 'scaffold.destroyed',
    ERROR = 'scaffold.error',
}

export enum DataType {
    PAYLOAD = 'payload',
    RESULT = 'result',
    STREAM = 'stream',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export interface StreamResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly stream: ReadableStream<Item>;
}

export interface CreatedResult {
    readonly correlationId?: string;
    readonly scaffold: Scaffold;
}

export interface ChunkResult {
    readonly correlationId?: string;
    readonly streamId?: string;
    readonly chunk: Item;
}

export interface ErrorResult {
    readonly action: string;
    readonly error: string;
    readonly correlationId?: string;
}

export interface DestroyResult {
    readonly destroyed: boolean;
}

export type {
    Body,
    CreatePayload,
    Item,
    Node,
    Scaffold,
    StreamPayload,
};

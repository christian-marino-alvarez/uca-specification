import type { Body, Item } from './schema.js';
export type { Body, Dimensions, Node, Item, Structure, CreatePayload } from './schema.js';

export enum SignalType {
    CREATE = 'composer.create',
    UPDATE = 'composer.update',
    CREATED = 'composer.created',
    STREAM = 'composer.stream',
    STREAMED = 'composer.streamed',
    CHUNK = 'composer.chunk',
    DESTROY = 'composer.destroy',
    DESTROYED = 'composer.destroyed',
    ERROR = 'composer.error',
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

export interface CreatedResult extends Body {
    readonly correlationId?: string;
}

export interface ErrorResult {
    readonly error: string;
    readonly correlationId?: string;
}

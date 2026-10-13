import type { Body, Dimensions, Layout, Section, Style } from './schema.js';

export { type Body, type Dimensions, type Layout, type Section, type Style } from './schema.js';

export interface Limits {
    readonly width?: number;
    readonly height?: number;
    readonly orientation?: string;
    readonly [key: string]: unknown;
}

export interface ComposePayload extends Partial<Body> {
    readonly limits?: Limits;
    readonly depth?: number;
}

export interface StreamEntry {
    readonly controller: ReadableStreamDefaultController<string>;
    readonly depth: number;
}

export enum SignalType {
    COMPOSE = 'composer.compose',
    COMPOSED = 'composer.composed',
    CHUNK = 'composer.chunk',
    STREAM_END = 'composer.stream-end',
    ERROR = 'composer.error',
}

export enum DataType {
    BODY = 'Body',
    COMPOSE_PAYLOAD = 'ComposePayload',
    LAYOUT_RESULT = 'LayoutResult',
    UNKNOWN = 'unknown',
}

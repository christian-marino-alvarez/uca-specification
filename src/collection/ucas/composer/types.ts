import type { Body, Dimensions, Layout, MediaRange, Section, Style } from './schema.js';

export { type Body, type Dimensions, type Layout, type MediaRange, type Section, type Style } from './schema.js';

export interface Limits {
    readonly width?: number | string;
    readonly height?: number | string;
    readonly ratio?: number;
    readonly orientation?: string;
    readonly [key: string]: unknown;
}

export interface ComposePayload extends Partial<Body> {
    readonly limits?: Limits;
    readonly depth?: number;
}

export interface MediaMemoryItem {
    readonly media: MediaRange;
    readonly layout: Layout;
}

export interface ComposerMemoryState {
    readonly request: string;
    readonly context: string;
    readonly activeMediaKey?: string;
    readonly activeLayout?: Layout;
    readonly medias: Record<string, MediaMemoryItem>;
}

export interface StreamEntry {
    readonly controller: ReadableStreamDefaultController<string>;
    readonly depth: number;
    readonly parentTo: string;
    readonly request: string;
    readonly context: string;
    readonly limits?: Limits;
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

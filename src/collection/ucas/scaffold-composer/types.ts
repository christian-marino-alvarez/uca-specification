export enum SignalType {
    CREATE = 'scaffold-composer.create',
    CREATED = 'scaffold-composer.created',
    STREAM = 'scaffold-composer.stream',
    UPDATE = 'scaffold-composer.update',
    UPDATED = 'scaffold-composer.updated',
    REMOVE = 'scaffold-composer.remove',
    REMOVED = 'scaffold-composer.removed',
}

export enum DataType {
    VOID = 'void',
    RECORD = 'record',
    SCAFFOLD = 'scaffold',
    STREAM = 'stream',
}

export type { Scaffold, UcaNode, Theme } from './schema.js';
import type { Scaffold } from './schema.js';
export type { GraphNode, GraphStreamPayload } from '@uca/capability-graph/types';

export interface Body {
    readonly prompt?: string;
    readonly title?: string;
    readonly characteristics?: readonly string[] | string;
    readonly determinism?: number;
    readonly imagination?: number;
    readonly deliberation?: number;
    readonly conciseness?: number;
    readonly scaffold?: Scaffold;
}


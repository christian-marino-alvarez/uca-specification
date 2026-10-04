export enum SignalType {
    CREATE = 'concept-composer.create',
    UPDATE = 'concept-composer.update',
    REMOVE = 'concept-composer.remove',
    CREATED = 'concept-composer.created',
    UPDATED = 'concept-composer.updated',
    REMOVED = 'concept-composer.removed',
}

export enum DataType {
    VOID = 'void',
    RECORD = 'Record',
    CONCEPT_MAP = 'ConceptMap',
}

export * from './schemas/index.js';
import type { ConceptMap } from './schemas/index.js';

export interface Body {
    readonly prompt?: string;
    readonly title?: string;
    readonly description?: string;
    readonly model?: string;
    readonly provider?: string;
    readonly endpoint?: string;
    readonly sseEndpoint?: string;
    readonly factory?: unknown;
    readonly concept?: ConceptMap;
    readonly thinkingBudget?: number;
    readonly temperature?: number;
    readonly maxOutputTokens?: number;
}

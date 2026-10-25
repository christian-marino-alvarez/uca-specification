import type { InferPayload } from '@uca/llm/types';
import type { Body } from './schema.js';

export enum SignalType {
    COMPOSE = 'visual-composition.compose',
    STRUCTURED = 'visual-composition.structured',
    PLANNED = 'visual-composition.planned',
    COMPOSED = 'visual-composition.composed',
    ERROR = 'visual-composition.error',
}

export enum DataType {
    INFER_PAYLOAD = 'InferPayload',
    COMPOSITION = 'Composition',
    PLAN = 'Plan',
    UNKNOWN = 'unknown',
}

export interface CompositionPayload {
    readonly request: InferPayload;
    readonly sessionId: string;
}

export type { Body } from './schema.js';

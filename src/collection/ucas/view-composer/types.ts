import type { ZodType } from 'zod';
import type { CapabilityConstructor, Disposition } from '@uca/core/types';
import type { AILanguageModelFactory } from '@uca/capability-prompt-api';

export enum SignalType {
    COMPOSE = 'view-composer.compose',
    COMPOSED = 'view-composer.composed',
    REGISTER = 'view-composer.register',
    ERROR = 'view-composer.error',
}

export enum DataType {
    COMPOSE_PAYLOAD = 'ComposePayload',
    COMPOSED_RESULT = 'ComposedResult',
    UCA_SCHEMA_DEFINITION = 'UcaSchemaDefinition',
    UNKNOWN = 'unknown',
}

export interface UcaSchemaDefinition<TBody = unknown> {
    readonly name: string;
    readonly prefix: string;
    readonly description: string;
    readonly bodySchema: ZodType<TBody>;
    readonly emittedSignals?: readonly string[];
    readonly constructor?: CapabilityConstructor;
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

export interface ComposedResult {
    readonly ucas: Record<string, Disposition>;
    readonly graph: ViewGraph;
    readonly result?: unknown;
}

export interface ComposePayload {
    readonly request?: string;
    readonly context?: Record<string, unknown>;
    readonly model?: string;
    readonly schema?: Record<string, unknown>;
    readonly ucas?: Record<string, Disposition>;
    readonly documentation?: string;
    readonly stream?: boolean;
    readonly definitions?: readonly UcaSchemaDefinition[];
}

export interface Body {
    readonly model?: string;
    readonly endpoint?: string;
    readonly sseEndpoint?: string;
    readonly factory?: AILanguageModelFactory;
    readonly schema?: Record<string, unknown>;
    readonly documentation?: string;
}

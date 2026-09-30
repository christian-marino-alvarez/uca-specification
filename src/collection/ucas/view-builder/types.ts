import type { PromptAdapter } from '../../capabilities/google-web-prompt/types.js';

export enum SignalType {
    BUILD = 'view-builder.build',
    ABORT = 'view-builder.abort',
    VISUAL = 'view-builder.visual',
    GRAPH = 'view-builder.graph',
    STREAM = 'view-builder.stream',
    ERROR = 'view-builder.error',
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

export interface ViewElementDeclaration {
    readonly id: string;
    readonly type: 'box' | 'picture' | 'input' | 'dropdown' | 'list' | 'access' | 'action' | 'collector' | 'toggle' | 'choice';
    readonly props?: Record<string, unknown>;
    readonly children?: readonly ViewElementDeclaration[];
}

export interface ViewVisualResult {
    readonly title?: string;
    readonly elements: readonly ViewElementDeclaration[];
}

export interface ViewGraphResult {
    readonly nodes: readonly GraphNode[];
    readonly edges: readonly GraphEdge[];
}

export interface BuildPayload {
    readonly description: string;
    readonly context?: Record<string, unknown>;
    readonly signal?: AbortSignal;
}

export interface Body {
    readonly systemPrompt?: string;
    readonly temperature?: number;
    readonly parser?: (raw: string) => { visual: ViewVisualResult; graph: ViewGraphResult };
    readonly promptAdapter?: PromptAdapter;
}

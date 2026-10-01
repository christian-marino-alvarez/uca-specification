export enum SignalType {
    BUILD = 'view-builder.build',
    ABORT = 'view-builder.abort',
    VISUAL = 'view-builder.visual',
    GRAPH = 'view-builder.graph',
    ERROR = 'view-builder.error',
}

export enum DataType {
    BUILD_PAYLOAD = 'BuildPayload',
    VIEW_VISUAL = 'ViewVisualResult',
    VIEW_GRAPH = 'ViewGraphResult',
    VOID = 'void',
    UNKNOWN = 'unknown',
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

export type WebCapabilityType =
    | 'box'
    | 'picture'
    | 'input'
    | 'dropdown'
    | 'list'
    | 'access'
    | 'action'
    | 'collector'
    | 'toggle'
    | 'choice';

export interface ViewElementDeclaration {
    readonly id: string;
    readonly type: WebCapabilityType;
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
    readonly model?: string;
}

export interface Body {
    readonly model?: string;
    readonly connection?: Record<string, unknown>;
    readonly parser?: (raw: unknown) => { visual: ViewVisualResult; graph: ViewGraphResult };
}

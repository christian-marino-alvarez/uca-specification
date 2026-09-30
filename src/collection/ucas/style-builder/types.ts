import type { ViewVisualResult } from '../view-builder/types.js';

export enum SignalType {
    DESIGN = 'style-builder.design',
    ABORT = 'style-builder.abort',
    STYLED = 'style-builder.styled',
    STREAM = 'style-builder.stream',
    ERROR = 'style-builder.error',
}

export interface ElementStyle {
    readonly elementId: string;
    readonly theme?: 'light' | 'dark' | 'custom';
    readonly classes?: readonly string[];
    readonly attributes?: Record<string, string>;
}

export interface StyleDesignResult {
    readonly viewTitle?: string;
    readonly palette?: Record<string, string>;
    readonly elementStyles: readonly ElementStyle[];
    readonly generatedCssRules?: readonly { selector: string; declarations: Record<string, string> }[];
}

export interface DesignPayload {
    readonly visual: ViewVisualResult;
    readonly theme?: string;
    readonly signal?: AbortSignal;
}

export interface Body {
    readonly theme?: string;
    readonly designer?: (payload: DesignPayload) => StyleDesignResult;
}

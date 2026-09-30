import type { ViewVisualResult, ViewGraphResult } from '../view-builder/types.js';
import type { LogicPlan } from '../logic-builder/types.js';
import type { StyleDesignResult } from '../style-builder/types.js';
import type { PromptAdapter } from '../../capabilities/google-web-prompt/types.js';

export enum SignalType {
    INIT = 'app.init',
    GENERATE = 'app.generate',
    ABORT = 'app.abort',
    READY = 'app.ready',
    RENDERED = 'app.rendered',
    ERROR = 'app.error',
}

export interface GeneratePayload {
    readonly description: string;
    readonly theme?: 'light' | 'dark';
    readonly container?: HTMLElement | null;
}

export interface AppExecutionResult {
    readonly visual: ViewVisualResult;
    readonly graph: ViewGraphResult;
    readonly logic: LogicPlan;
    readonly style: StyleDesignResult;
    readonly container?: HTMLElement | null;
}

export interface Body {
    readonly container?: HTMLElement | null;
    readonly defaultDescription?: string;
    readonly theme?: 'light' | 'dark';
    readonly promptAdapter?: PromptAdapter;
}

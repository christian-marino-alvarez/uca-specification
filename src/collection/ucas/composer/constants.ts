import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { SignalType } from './types.js';

export const __ID__ = 'composer';

export const DEFAULT_PURPOSE =
    'Compose fractal templates and logic for emergent UCAs using available web and logic primitives and CSS capability';

export const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

export const DEFAULT_PROVIDER = 'gemini';

export const AVAILABLE_PRIMITIVES: readonly string[] = [
    'box',
    'action',
    'input',
    'list',
    'picture',
    'toggle',
    'dropdown',
] as const;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.COMPOSE,
    SignalType.STREAM,
    SignalType.DESTROY,
    WebLlmSignalType.STREAMED,
    WebLlmSignalType.ERROR,
    CssSignalType.CREATED,
    CssSignalType.ERROR,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

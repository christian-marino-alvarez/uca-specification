import { SignalType as PromptApiSignalType } from '@uca/capability-prompt-api';
import { SignalType as GraphSignalType } from '@uca/capability-graph';
import { SignalType } from './types.js';

export const __ID__ = 'style-composer';
export const PURPOSE = 'Compose aesthetic visual presentation and theme stylesheets for the application and its constituent UCAs';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.COMPOSE_THEME,
    SignalType.STYLE_UCA,
    GraphSignalType.UCA_DETECTED,
    PromptApiSignalType.RESPONDED,
    PromptApiSignalType.ERROR,
];

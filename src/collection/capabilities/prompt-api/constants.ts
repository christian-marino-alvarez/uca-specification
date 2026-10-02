import { SignalType } from './types.js';

export const __ID__ = 'prompt-api';
export const AIM = 'Perform on-device neural language model inference via browser Web Prompt API';
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_TOP_K = 3;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CHECK,
    SignalType.PROMPT,
    SignalType.STREAM,
    SignalType.DESTROY,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

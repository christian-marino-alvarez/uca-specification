import { SignalType } from './types.js';

export const __ID__ = 'graph';
export const AIM = 'Validate LLM graph response and dispatch dispositions to UCAs';

export const DEFAULT_SIGNALS = [
    SignalType.RESOLVE,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

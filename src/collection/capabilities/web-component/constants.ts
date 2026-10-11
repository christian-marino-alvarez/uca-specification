import { SignalType } from './types.js';

export const __ID__ = 'web-component';

export const DEFAULT_TAG = 'ext-uca';

export const DEFAULT_EVENTS: readonly string[] = ['click', 'input', 'change'] as const;

export const DEFAULT_SIGNALS: readonly SignalType[] = [
    SignalType.RENDER,
    SignalType.UPDATE,
    SignalType.REMOVE,
] as const;

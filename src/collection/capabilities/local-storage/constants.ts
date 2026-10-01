import { SignalType } from './types.js';

export const __ID__ = 'local-storage';

export const AIM = 'Persist, retrieve, remove, and synchronize string data using Web Storage API (localStorage)';

export const DEFAULT_PREFIX = '';

export const DEFAULT_SIGNALS = [
    SignalType.SET,
    SignalType.GET,
    SignalType.REMOVE,
    SignalType.CLEAR,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

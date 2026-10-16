import { Operation, SignalType } from './types.js';

export const __ID__ = 'local-storage';

export const AIM = 'Persist, retrieve, remove, and synchronize string data using Web Storage API (localStorage)';

export const DEFAULT_PREFIX = '';

export const MISSING_STORAGE = 'Storage not available';
export const MISSING_STORAGE_OR_KEY = 'Storage not available or missing key';
export const OPERATIONS = {
    [SignalType.SET]: Operation.SET,
    [SignalType.GET]: Operation.GET,
    [SignalType.REMOVE]: Operation.REMOVE,
    [SignalType.CLEAR]: Operation.CLEAR,
} as const;

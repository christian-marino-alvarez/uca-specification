import { SignalType } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'range';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const DEFAULT_MINIMUM = 0;
export const DEFAULT_MAXIMUM = 100;

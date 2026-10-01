import { SignalType } from './types.js';

export const __ID__ = 'view-builder';

export const DEFAULT_SIGNALS = [
    SignalType.BUILD,
    SignalType.ABORT,
] as const;

export const SUPPORTED_ELEMENT_TYPES = [
    'box',
    'picture',
    'input',
    'dropdown',
    'list',
    'access',
    'action',
    'collector',
    'toggle',
    'choice',
] as const;

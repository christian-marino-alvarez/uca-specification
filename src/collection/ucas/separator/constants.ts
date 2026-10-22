import { SignalType } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'separator';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const SEPARATOR_VISUAL_DISPOSITION = {
    role: 'divider',
    defaultQualities: {
        border: 'subtle',
    },
    supportedQualities: [
        'border',
        'direction',
        'width',
        'height',
    ],
    description: 'Línea de división y separación visual entre bloques',
} as const;

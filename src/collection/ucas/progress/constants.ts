import { SignalType, type Qualities } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'progress';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const DEFAULT_TOTAL = 100;

export const DEFAULT_PROGRESS_QUALITIES: Qualities = {
    width: 'full',
    height: 'small',
    surface: 'muted',
    radius: 'full',
};

export const PROGRESS_VISUAL_DISPOSITION = {
    role: 'meter',
    defaultQualities: DEFAULT_PROGRESS_QUALITIES,
    supportedQualities: [
        'width',
        'height',
        'surface',
        'radius',
        'border',
    ],
    description: 'Indicador visual de progreso o avance cuantitativo',
} as const;


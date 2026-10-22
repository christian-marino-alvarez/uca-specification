import { SignalType, type Qualities } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'toggle';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const DEFAULT_TOGGLE_QUALITIES: Qualities = {
    surface: 'card',
    border: 'subtle',
    radius: 'full',
    spacingInline: 'small',
    spacingBlock: 'none',
    textColor: 'light',
    textSize: 'small',
};

export const TOGGLE_VISUAL_DISPOSITION = {
    role: 'control',
    defaultQualities: DEFAULT_TOGGLE_QUALITIES,
    supportedQualities: [
        'surface',
        'border',
        'radius',
        'spacingInline',
        'spacingBlock',
        'textColor',
        'textSize',
    ],
    description: 'Conmutador binario o interruptor de estado activo/inactivo',
} as const;


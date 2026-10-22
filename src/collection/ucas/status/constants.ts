import { SignalType, type Qualities } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'status';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const DEFAULT_STATUS_QUALITIES: Qualities = {
    surface: 'card',
    border: 'subtle',
    radius: 'full',
    spacingInline: 'small',
    spacingBlock: 'none',
    textColor: 'light',
    textSize: 'small',
    fontWeight: 'medium',
};

export const STATUS_VISUAL_DISPOSITION = {
    role: 'badge',
    defaultQualities: DEFAULT_STATUS_QUALITIES,
    supportedQualities: [
        'surface',
        'border',
        'radius',
        'spacingInline',
        'spacingBlock',
        'textColor',
        'textSize',
        'fontWeight',
    ],
    description: 'Etiqueta o indicador visual del estado de una entidad u operación',
} as const;


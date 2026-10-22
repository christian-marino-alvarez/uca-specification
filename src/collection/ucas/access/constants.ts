import { SignalType, type Qualities } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'access';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.ACTIVATED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const DEFAULT_ACCESS_QUALITIES: Qualities = {
    textColor: 'accent',
    textSize: 'small',
    fontWeight: 'medium',
    spacingInline: 'small',
    spacingBlock: 'none',
};

export const resolveAccessQualities = (qualities?: Qualities): Qualities => {
    return {
        ...DEFAULT_ACCESS_QUALITIES,
        ...qualities,
    };
};

export const ACCESS_VISUAL_DISPOSITION = {
    role: 'navigation',
    defaultQualities: DEFAULT_ACCESS_QUALITIES,
    supportedQualities: [
        'textColor',
        'textSize',
        'fontWeight',
        'spacingInline',
        'spacingBlock',
        'surface',
        'border',
        'radius',
    ],
    description: 'Enlace interactivo o disparador de navegación accesible',
} as const;


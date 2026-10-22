import { SignalType, type Qualities } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'symbol';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const DEFAULT_SYMBOL_QUALITIES: Qualities = {
    textColor: 'light',
    textSize: 'medium',
    alignment: 'center',
    distribution: 'center',
};

export const SYMBOL_VISUAL_DISPOSITION = {
    role: 'icon',
    defaultQualities: DEFAULT_SYMBOL_QUALITIES,
    supportedQualities: [
        'textColor',
        'textSize',
        'width',
        'height',
        'alignment',
        'distribution',
    ],
    description: 'Glifo vectorial, icono simbólico o indicador representativo',
} as const;


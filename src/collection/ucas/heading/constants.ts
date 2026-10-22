import { SignalType } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'heading';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const HEADING_VISUAL_DISPOSITION = {
    role: 'typography',
    defaultQualities: {
        textSize: 'title',
        fontWeight: 'bold',
        textColor: 'light',
        lineHeight: 'tight',
    },
    supportedQualities: [
        'textSize',
        'fontWeight',
        'textColor',
        'lineHeight',
        'textAlign',
        'marginBlock',
    ],
    description: 'Encabezado o título jerárquico de sección',
} as const;

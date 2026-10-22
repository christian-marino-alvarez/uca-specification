import type { Qualities } from './schema.js';
import { SignalType } from './types.js';
import { SignalType as PresentationSignalType } from '@uca/capability-presentation/types';
import { Operation } from '../types.js';

export const __ID__ = 'paragraph';
export const OPERATIONS = {
    [Operation.RENDER]: PresentationSignalType.RENDER,
    [Operation.UPDATE]: PresentationSignalType.UPDATE,
    [Operation.REMOVE]: PresentationSignalType.REMOVE,
    [Operation.CHANGE]: SignalType.CHANGED,
} as const;

export const INVALID_BOUNDS = {
    error: 'The value and bounds are inconsistent with the domain contract',
} as const;

export const DEFAULT_PARAGRAPH_QUALITIES: Qualities = {
    textSize: 'small',
    textColor: 'muted',
    lineHeight: 'normal',
};

export const resolveParagraphQualities = (qualities?: Qualities): Qualities => {
    return {
        ...DEFAULT_PARAGRAPH_QUALITIES,
        ...qualities,
    };
};

export const PARAGRAPH_VISUAL_DISPOSITION = {
    role: 'typography',
    defaultQualities: DEFAULT_PARAGRAPH_QUALITIES,
    supportedQualities: [
        'textSize',
        'textColor',
        'lineHeight',
        'textAlign',
        'fontWeight',
        'marginBlock',
    ],
    description: 'Texto descriptivo, explicativo o telemetría secundaria',
} as const;

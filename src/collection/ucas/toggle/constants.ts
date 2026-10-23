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
    outline: 'subtle',
    shape: 'full',
    spacingInline: 'small',
    spacingBlock: 'none',
    textColor: 'light',
    textSize: 'small',
};

export const TOGGLE_M3_VARIANTS: Record<string, Qualities> = {
    switch: { surface: 'card', outline: 'subtle', shape: 'full', spacingInline: 'small', spacingBlock: 'none' },
    checkbox: { surface: 'transparent', outline: 'strong', shape: 'extraSmall', spacingInline: 'none', spacingBlock: 'none' },
};

export const resolveToggleQualities = (qualities?: Qualities, variant?: string): Qualities => {
    const selectedVariant = variant ?? qualities?.variant;
    const variantQualities = selectedVariant ? TOGGLE_M3_VARIANTS[selectedVariant] ?? {} : {};
    return {
        ...DEFAULT_TOGGLE_QUALITIES,
        ...variantQualities,
        ...qualities,
    };
};

export const TOGGLE_VISUAL_DISPOSITION = {
    role: 'control',
    defaultQualities: DEFAULT_TOGGLE_QUALITIES,
    supportedQualities: [
        'surface',
        'outline',
        'shape',
        'spacingInline',
        'spacingBlock',
        'textColor',
        'textSize',
        'variant',
    ],
    variants: TOGGLE_M3_VARIANTS,
    description: 'Conmutador binario de Material Design 3 (switch o checkbox)',
} as const;


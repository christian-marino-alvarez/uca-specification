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
    shape: 'full',
};

export const PROGRESS_M3_VARIANTS: Record<string, Qualities> = {
    linear: { width: 'full', height: 'small', surface: 'muted', shape: 'full' },
    circular: { width: 'medium', height: 'medium', surface: 'transparent', shape: 'full' },
};

export const resolveProgressQualities = (qualities?: Qualities, variant?: string): Qualities => {
    const selectedVariant = variant ?? qualities?.variant;
    const variantQualities = selectedVariant ? PROGRESS_M3_VARIANTS[selectedVariant] ?? {} : {};
    return {
        ...DEFAULT_PROGRESS_QUALITIES,
        ...variantQualities,
        ...qualities,
    };
};

export const PROGRESS_VISUAL_DISPOSITION = {
    role: 'meter',
    defaultQualities: DEFAULT_PROGRESS_QUALITIES,
    supportedQualities: [
        'width',
        'height',
        'surface',
        'shape',
        'outline',
        'variant',
    ],
    variants: PROGRESS_M3_VARIANTS,
    description: 'Indicador visual de progreso de Material Design 3 (linear o circular)',
} as const;


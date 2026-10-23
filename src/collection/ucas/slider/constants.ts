import type { Body, Qualities } from './schema.js';

export const __ID__ = 'slider';

export const DEFAULT_TAG = 'input' as const;

export const DEFAULT_EVENTS: readonly string[] = ['input', 'change'] as const;

export const DEFAULT_SLIDER_QUALITIES: Qualities = {
    width: 'full',
    surface: 'transparent',
    spacingBlock: 'small',
    spacingInline: 'none',
};

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const buildSliderAttributes = (payload: Body): Record<string, string> => {
    const { min = 0, max = 100, step, value = 0, disabled } = payload;
    return {
        type: 'range',
        min: String(min),
        max: String(max),
        value: String(value),
        ...(step !== undefined && { step: String(step) }),
        ...(disabled && { disabled: 'disabled' }),
    };
};

export const SLIDER_VISUAL_DISPOSITION = {
    role: 'control',
    defaultQualities: DEFAULT_SLIDER_QUALITIES,
    supportedQualities: [
        'width',
        'surface',
        'spacingBlock',
        'spacingInline',
        'variant',
    ],
    description: 'Selector de valor en rango continuo o discreto de Material Design 3',
} as const;

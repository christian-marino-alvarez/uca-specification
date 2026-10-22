import type { Qualities } from './schema.js';

export const __ID__ = 'action';

export const DEFAULT_TAG = 'button' as const;

export const DEFAULT_TYPE = 'button' as const;

export const DEFAULT_EVENTS: readonly string[] = ['click'] as const;

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const buildActionAttributes = (
    payload: { readonly type?: string; readonly action?: string; readonly disabled?: boolean },
    defaultType?: string,
): Record<string, string> => {
    const { type = defaultType, action, disabled } = payload;
    return {
        ...(type && { type }),
        ...(action && { 'data-action': action }),
        ...(disabled && { disabled: 'disabled' }),
    };
};

export const DEFAULT_QUALITIES: Qualities = {
    surface: 'card',
    border: 'subtle',
    radius: 'medium',
    spacingInline: 'medium',
    spacingBlock: 'small',
    textSize: 'small',
    fontWeight: 'medium',
    textColor: 'light',
    alignment: 'center',
    distribution: 'center',
};

export const resolveActionQualities = (qualities?: Qualities): Qualities => {
    return {
        ...DEFAULT_QUALITIES,
        ...qualities,
    };
};

export const ACTION_VISUAL_DISPOSITION = {
    role: 'control',
    defaultQualities: DEFAULT_QUALITIES,
    supportedQualities: [
        'surface',
        'textColor',
        'radius',
        'border',
        'spacingInline',
        'spacingBlock',
        'textSize',
        'fontWeight',
    ],
    variants: {
        primary: { surface: 'brand', textColor: 'dark' },
        secondary: { surface: 'transparent', border: 'subtle', textColor: 'light' },
    },
    description: 'Botón de acción interactiva o disparador de comandos',
} as const;

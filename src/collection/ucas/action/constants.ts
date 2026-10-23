import type { Qualities } from './schema.js';

export const __ID__ = 'action';

export const DEFAULT_TAG = 'button' as const;

export const DEFAULT_TYPE = 'button' as const;

export const DEFAULT_EVENTS: readonly string[] = ['click'] as const;

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const resolveActionContent = (payload: { readonly label?: string; readonly content?: string; readonly icon?: string; readonly iconPosition?: 'leading' | 'trailing' }): string | undefined => {
    const { label, content, icon, iconPosition = 'leading' } = payload;
    const baseText = label ?? content ?? '';
    if (!icon) {
        return baseText || undefined;
    }
    const iconHtml = `<span class="material-symbols-outlined">${icon}</span>`;
    return iconPosition === 'trailing' ? `${baseText} ${iconHtml}`.trim() : `${iconHtml} ${baseText}`.trim();
};

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
    outline: 'subtle',
    shape: 'medium',
    spacingInline: 'medium',
    spacingBlock: 'small',
    textSize: 'small',
    fontWeight: 'medium',
    textColor: 'light',
    alignment: 'center',
    distribution: 'center',
};

export const ACTION_M3_VARIANTS: Record<string, Qualities> = {
    elevated: { surface: 'card', elevation: 'card', textColor: 'brand', shape: 'full', outline: 'none' },
    filled: { surface: 'brand', textColor: 'dark', shape: 'full', outline: 'none' },
    tonal: { surface: 'card', textColor: 'brand', shape: 'full', outline: 'none' },
    outlined: { surface: 'transparent', outline: 'subtle', textColor: 'light', shape: 'full' },
    text: { surface: 'transparent', outline: 'none', textColor: 'brand', shape: 'full' },
    icon: { surface: 'transparent', outline: 'none', shape: 'full', spacingInline: 'small', spacingBlock: 'small' },
};

export const resolveActionQualities = (qualities?: Qualities, variant?: string): Qualities => {
    const selectedVariant = variant ?? qualities?.variant;
    const variantQualities = selectedVariant ? ACTION_M3_VARIANTS[selectedVariant] ?? {} : {};
    return {
        ...DEFAULT_QUALITIES,
        ...variantQualities,
        ...qualities,
    };
};

export const ACTION_VISUAL_DISPOSITION = {
    role: 'control',
    defaultQualities: DEFAULT_QUALITIES,
    supportedQualities: [
        'surface',
        'textColor',
        'shape',
        'outline',
        'spacingInline',
        'spacingBlock',
        'textSize',
        'fontWeight',
        'elevation',
        'variant',
    ],
    variants: {
        ...ACTION_M3_VARIANTS,
        primary: ACTION_M3_VARIANTS.filled,
        secondary: ACTION_M3_VARIANTS.outlined,
    },
    description: 'Botón de acción interactiva o disparador de comandos de Material Design 3',
} as const;

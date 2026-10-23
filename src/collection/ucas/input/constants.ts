import type { Qualities } from './schema.js';

export const __ID__ = 'input';

export const DEFAULT_TAG = 'input' as const;

export const DEFAULT_TYPE = 'text' as const;

export const DEFAULT_EVENTS: readonly string[] = ['input', 'change'] as const;

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const buildInputAttributes = (
    payload: {
        readonly type?: string;
        readonly name?: string;
        readonly value?: string;
        readonly placeholder?: string;
        readonly action?: string;
        readonly autocomplete?: string;
        readonly disabled?: boolean;
        readonly readonly?: boolean;
        readonly required?: boolean;
    },
    defaultType?: string,
): Record<string, string> => {
    const { type = defaultType, name, value, placeholder, action, autocomplete, disabled, readonly: isReadOnly, required } = payload;
    return {
        ...(type && { type }),
        ...(name && { name }),
        ...(value !== undefined && { value }),
        ...(placeholder && { placeholder }),
        ...(action && { 'data-action': action }),
        ...(autocomplete && { autocomplete }),
        ...(disabled && { disabled: 'disabled' }),
        ...(isReadOnly && { readonly: 'readonly' }),
        ...(required && { required: 'required' }),
    };
};

export const DEFAULT_INPUT_QUALITIES: Qualities = {
    surface: 'card',
    outline: 'subtle',
    shape: 'medium',
    spacingInline: 'small',
    spacingBlock: 'small',
    textColor: 'light',
    textSize: 'small',
    width: 'full',
};

export const INPUT_M3_VARIANTS: Record<string, Qualities> = {
    filled: { surface: 'card', outline: 'none', outlineBottom: 'strong', shape: 'small', spacingBlock: 'small', spacingInline: 'medium' },
    outlined: { surface: 'transparent', outline: 'subtle', shape: 'small', spacingBlock: 'small', spacingInline: 'medium' },
};

export const resolveInputQualities = (qualities?: Qualities, variant?: string): Qualities => {
    const selectedVariant = variant ?? qualities?.variant;
    const variantQualities = selectedVariant ? INPUT_M3_VARIANTS[selectedVariant] ?? {} : {};
    return {
        ...DEFAULT_INPUT_QUALITIES,
        ...variantQualities,
        ...qualities,
    };
};

export const INPUT_VISUAL_DISPOSITION = {
    role: 'control',
    defaultQualities: DEFAULT_INPUT_QUALITIES,
    supportedQualities: [
        'surface',
        'outline',
        'outlineBottom',
        'shape',
        'spacingInline',
        'spacingBlock',
        'width',
        'textColor',
        'textSize',
        'variant',
    ],
    variants: INPUT_M3_VARIANTS,
    description: 'Campo interactivo de entrada de datos o búsqueda de Material Design 3',
} as const;

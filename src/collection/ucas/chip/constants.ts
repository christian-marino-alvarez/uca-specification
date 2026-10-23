import type { Body, Qualities } from './schema.js';

export const __ID__ = 'chip';

export const DEFAULT_TAG = 'button' as const;

export const DEFAULT_EVENTS: readonly string[] = ['click'] as const;

export const CHIP_M3_VARIANTS: Record<string, Qualities> = {
    assist: {
        surface: 'transparent',
        outline: 'subtle',
        shape: 'small',
        spacingInline: 'small',
        spacingBlock: 'extraSmall',
        textSize: 'small',
        alignment: 'center',
    },
    filter: {
        surface: 'card',
        outline: 'subtle',
        shape: 'small',
        spacingInline: 'small',
        spacingBlock: 'extraSmall',
        textSize: 'small',
        alignment: 'center',
    },
    input: {
        surface: 'transparent',
        outline: 'subtle',
        shape: 'small',
        spacingInline: 'small',
        spacingBlock: 'extraSmall',
        textSize: 'small',
        alignment: 'center',
    },
    suggestion: {
        surface: 'card',
        outline: 'none',
        shape: 'small',
        spacingInline: 'small',
        spacingBlock: 'extraSmall',
        textSize: 'small',
        alignment: 'center',
    },
};

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const resolveChipQualities = (qualities?: Qualities, variant: string = 'assist', selected?: boolean): Qualities => {
    const baseVariant = CHIP_M3_VARIANTS[variant] ?? CHIP_M3_VARIANTS.assist;
    const selectedQualities: Qualities = selected
        ? { surface: 'brand', textColor: 'dark', outline: 'none' }
        : {};
    return {
        ...baseVariant,
        ...selectedQualities,
        ...qualities,
    };
};

export const resolveChipContent = (payload: Body): string => {
    const { label, leadingIcon, trailingIcon, removable } = payload;
    const parts: string[] = [];
    if (leadingIcon) {
        parts.push(`<span class="material-symbols-outlined" style="font-size: 1.1rem;">${leadingIcon}</span>`);
    }
    parts.push(`<span>${label}</span>`);
    if (removable || trailingIcon) {
        const iconName = trailingIcon ?? (removable ? 'close' : '');
        if (iconName) {
            parts.push(`<span class="material-symbols-outlined m3-chip-trailing" style="font-size: 1.1rem; cursor: pointer;">${iconName}</span>`);
        }
    }
    return parts.join(' ');
};

export const CHIP_VISUAL_DISPOSITION = {
    role: 'control',
    supportedQualities: [
        'surface',
        'outline',
        'shape',
        'textColor',
        'textSize',
        'spacingInline',
        'spacingBlock',
        'variant',
    ],
    variants: CHIP_M3_VARIANTS,
    description: 'Píldora de acción, filtro o entrada compacta de Material Design 3',
} as const;

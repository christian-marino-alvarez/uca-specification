import type { Qualities } from './schema.js';

export const __ID__ = 'box';

export const BOX_M3_VARIANTS: Record<string, Qualities> = {
    elevated: { surface: 'card', elevation: 'card', shape: 'medium', outline: 'none' },
    filled: { surface: 'card', elevation: 'none', shape: 'medium', outline: 'none' },
    outlined: { surface: 'transparent', elevation: 'none', shape: 'medium', outline: 'subtle' },
};

export const resolveBoxQualities = (qualities?: Qualities, variant?: string): Qualities => {
    const selectedVariant = variant ?? qualities?.variant;
    const variantQualities = selectedVariant ? BOX_M3_VARIANTS[selectedVariant] ?? {} : {};
    return {
        ...variantQualities,
        ...qualities,
    };
};

export const BOX_CUSTOMIZABLE_PROPERTIES = {
    flow: {
        direction: [
            'row',
            'column',
        ],
        alignment: [
            'start',
            'center',
            'end',
            'stretch',
            'baseline',
        ],
        distribution: [
            'start',
            'center',
            'end',
            'between',
            'around',
            'evenly',
        ],
        wrap: [
            'nowrap',
            'wrap',
            'reverse',
        ],
    },
    spacing: {
        spacing: [
            'none',
            'small',
            'medium',
            'large',
            'xlarge',
        ],
        spacingInline: [
            'none',
            'small',
            'medium',
            'large',
            'xlarge',
        ],
        spacingBlock: [
            'none',
            'small',
            'medium',
            'large',
            'xlarge',
        ],
        gap: [
            'none',
            'small',
            'medium',
            'large',
            'xlarge',
        ],
    },
    sizing: {
        width: [
            'full',
            'auto',
            'compact',
            'regular',
            'wide',
            'small',
            'medium',
            'large',
            'xlarge',
        ],
        height: [
            'full',
            'auto',
            'small',
            'medium',
            'large',
            'xlarge',
            'screen',
        ],
        minWidth: [
            'auto',
            'compact',
            'regular',
            'small',
            'medium',
            'large',
        ],
        minHeight: [
            'auto',
            'small',
            'medium',
            'large',
        ],
        maxWidth: [
            'full',
            'wide',
            'compact',
            'regular',
        ],
        flex: [
            'none',
            'fill',
            'initial',
            'auto',
            'grow',
            'shrink',
        ],
    },
    boundaries: {
        outline: [
            'none',
            'subtle',
            'strong',
        ],
        outlineBottom: [
            'none',
            'subtle',
            'strong',
        ],
        outlineTop: [
            'none',
            'subtle',
            'strong',
        ],
        outlineRight: [
            'none',
            'subtle',
            'strong',
        ],
        outlineLeft: [
            'none',
            'subtle',
            'strong',
        ],
        shape: [
            'none',
            'extraSmall',
            'small',
            'medium',
            'large',
            'extraLarge',
            'full',
        ],
    },
    appearance: {
        surface: [
            'transparent',
            'default',
            'card',
            'muted',
            'dark',
            'brand',
            'accent',
        ],
        elevation: [
            'none',
            'low',
            'card',
            'medium',
            'high',
        ],
    },
    containment: {
        overflow: [
            'visible',
            'hidden',
            'auto',
            'scroll',
        ],
    },
} as const;

export const BOX_VISUAL_DISPOSITION = {
    role: 'container',
    customizableProperties: BOX_CUSTOMIZABLE_PROPERTIES,
    supportedQualities: [
        'direction',
        'alignment',
        'distribution',
        'wrap',
        'gap',
        'flex',
        'overflow',
        'surface',
        'outline',
        'outlineBottom',
        'outlineTop',
        'outlineRight',
        'outlineLeft',
        'shape',
        'elevation',
        'width',
        'height',
        'minWidth',
        'minHeight',
        'maxWidth',
        'spacing',
        'spacingInline',
        'spacingBlock',
    ],
    description: 'Contenedor espacial flexible delimitado cuyas propiedades de flujo, dimensiones, espaciado y apariencia son completamente customizables',
} as const;

import type { Body, Qualities } from './schema.js';

export const __ID__ = 'card';

export const DEFAULT_TAG = 'article' as const;

export const DEFAULT_EVENTS: readonly string[] = ['click'] as const;

export const CARD_M3_VARIANTS: Record<string, Qualities> = {
    elevated: {
        surface: 'card',
        elevation: 'card',
        shape: 'medium',
        outline: 'none',
        spacingInline: 'medium',
        spacingBlock: 'medium',
    },
    filled: {
        surface: 'card',
        elevation: 'none',
        shape: 'medium',
        outline: 'none',
        spacingInline: 'medium',
        spacingBlock: 'medium',
    },
    outlined: {
        surface: 'transparent',
        elevation: 'none',
        shape: 'medium',
        outline: 'subtle',
        spacingInline: 'medium',
        spacingBlock: 'medium',
    },
};

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const resolveCardQualities = (qualities?: Qualities, variant: string = 'elevated'): Qualities => {
    const variantQualities = CARD_M3_VARIANTS[variant] ?? CARD_M3_VARIANTS.elevated;
    return {
        ...variantQualities,
        ...qualities,
    };
};

export const resolveCardContent = (payload: Body): string => {
    const { media, title, subtitle, content } = payload;
    const parts: string[] = [];
    if (media) {
        parts.push(`<img src="${media}" alt="${title ?? ''}" class="m3-card-media" style="width: 100%; object-fit: cover; border-radius: inherit;" />`);
    }
    if (title) {
        parts.push(`<h3 class="m3-card-title" style="margin: 0; font-size: 1.25rem;">${title}</h3>`);
    }
    if (subtitle) {
        parts.push(`<p class="m3-card-subtitle" style="margin: 0.25rem 0 0 0; opacity: 0.7;">${subtitle}</p>`);
    }
    if (content) {
        parts.push(`<div class="m3-card-body" style="margin-top: 0.5rem;">${content}</div>`);
    }
    return parts.join('\n');
};

export const CARD_VISUAL_DISPOSITION = {
    role: 'container',
    supportedQualities: [
        'surface',
        'outline',
        'shape',
        'elevation',
        'spacingInline',
        'spacingBlock',
        'width',
        'variant',
    ],
    variants: CARD_M3_VARIANTS,
    description: 'Contenedor interactivo estructurado de Material Design 3 (elevated, filled, outlined)',
} as const;

import type { Qualities } from './schema.js';

export const __ID__ = 'picture';

export const DEFAULT_ALT = 'Visual representation image';

export const DEFAULT_LOADING = 'lazy' as const;

export const DEFAULT_DIMENSION = 'small' as const;

export const DEFAULT_PICTURE_WIDTH = '32' as const;

export const DEFAULT_PICTURE_HEIGHT = '32' as const;

export const DEFAULT_PICTURE_QUALITIES: Qualities = {
    width: DEFAULT_DIMENSION,
    height: 'auto',
    flex: 'none',
    radius: 'small',
};

export const resolvePictureQualities = (qualities?: Qualities): Qualities => {
    return {
        ...DEFAULT_PICTURE_QUALITIES,
        ...qualities,
    };
};

export const PICTURE_VISUAL_DISPOSITION = {
    role: 'media',
    defaultQualities: DEFAULT_PICTURE_QUALITIES,
    supportedQualities: [
        'width',
        'height',
        'maxWidth',
        'radius',
        'flex',
    ],
    description: 'Elemento visual gráfico o logotipo vectorial',
} as const;

import type {
    Body,
    ListItem,
    Qualities,
} from './schema.js';

export const __ID__ = 'list';

export const DEFAULT_TAG = 'ext-list' as const;

export const DEFAULT_LIST_QUALITIES: Qualities = {
    direction: 'column',
    gap: 'small',
    spacing: 'none',
    width: 'full',
};

export const LIST_VISUAL_DISPOSITION = {
    role: 'list',
    defaultQualities: DEFAULT_LIST_QUALITIES,
    supportedQualities: [
        'direction',
        'gap',
        'spacing',
        'spacingInline',
        'spacingBlock',
        'width',
        'height',
        'surface',
        'outline',
        'shape',
    ],
    description: 'Estructura secuencial ordenada o no ordenada que agrupa y articula elementos relacionados',
} as const;

export const resolveContainerSelector = (
    containerElement?: string,
    parentTo?: string,
): string | undefined => {
    if (containerElement) {
        return containerElement;
    }
    if (!parentTo) {
        return undefined;
    }
    return parentTo.startsWith('#') ? parentTo : `#${parentTo}`;
};

export const formatListItemsContent = (
    items?: Array<string | ListItem>,
    ordered?: boolean,
): string => {
    if (!items || items.length === 0) {
        return '';
    }
    const tag = ordered ? 'ol' : 'ul';
    const children = items
        .map((item) => {
            const text = typeof item === 'string' ? item : (item.text ?? item.content ?? '');
            return `<li>${text}</li>`;
        })
        .join('');
    return `<${tag}>${children}</${tag}>`;
};

export const buildListAttributes = (
    payload: Body,
): Record<string, string> => {
    const {
        ordered,
    } = payload;
    return {
        ...(ordered && { ordered: 'true' }),
    };
};

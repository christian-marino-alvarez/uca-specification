export const __ID__ = 'collection';

export const DEFAULT_TAG = 'form' as const;

export const DEFAULT_METHOD = 'post' as const;

export const DEFAULT_EVENTS: readonly string[] = ['submit', 'change', 'input', 'click'] as const;

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const buildCollectionAttributes = (
    payload: {
        readonly name?: string;
        readonly action?: string;
        readonly method?: string;
        readonly autocomplete?: string;
        readonly novalidate?: boolean;
    },
    defaultMethod?: string,
): Record<string, string> => {
    const { name, action, method = defaultMethod, autocomplete, novalidate } = payload;
    return {
        ...(name && { name }),
        ...(action && { 'data-action': action }),
        ...(method && { method }),
        ...(autocomplete && { autocomplete }),
        ...(novalidate && { novalidate: 'novalidate' }),
    };
};

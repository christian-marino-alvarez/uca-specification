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

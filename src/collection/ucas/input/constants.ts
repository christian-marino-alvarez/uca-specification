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

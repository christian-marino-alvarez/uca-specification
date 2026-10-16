export const __ID__ = 'dropdown';

export const DEFAULT_TAG = 'select' as const;

export const DEFAULT_EVENTS: readonly string[] = ['change', 'input'] as const;

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const buildDropdownAttributes = (payload: {
    readonly name?: string;
    readonly action?: string;
    readonly disabled?: boolean;
    readonly required?: boolean;
}): Record<string, string> => {
    const { name, action, disabled, required } = payload;
    return {
        ...(name && { name }),
        ...(action && { 'data-action': action }),
        ...(disabled && { disabled: 'disabled' }),
        ...(required && { required: 'required' }),
    };
};

const formatSelectOptionHtml = (
    selectedValue: string | undefined,
    item: { readonly value: string; readonly label: string; readonly selected?: boolean; readonly disabled?: boolean },
): string => {
    const { value, label, selected, disabled } = item;
    const isSelected = selected ?? (selectedValue !== undefined && selectedValue === value);
    const selectedAttribute = isSelected ? ' selected="selected"' : '';
    const disabledAttribute = disabled ? ' disabled="disabled"' : '';
    return `<option value="${value}"${selectedAttribute}${disabledAttribute}>${label}</option>`;
};

export const buildDropdownContent = (payload: {
    readonly placeholder?: string;
    readonly value?: string;
    readonly items?: readonly { readonly value: string; readonly label: string; readonly selected?: boolean; readonly disabled?: boolean }[];
    readonly content?: string;
}): string | undefined => {
    const { placeholder, value, items, content } = payload;
    if (!items && !placeholder) { return content; }
    const placeholderSelected = !value ? ' selected="selected"' : '';
    const placeholderHtml = placeholder ? `<option value="" disabled="disabled"${placeholderSelected}>${placeholder}</option>` : '';
    const optionsHtml = (items ?? []).map((item) => formatSelectOptionHtml(value, item)).join('');
    return `${placeholderHtml}${optionsHtml}`;
};

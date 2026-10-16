export const __ID__ = 'options';

export const DEFAULT_TAG = 'fieldset' as const;

export const DEFAULT_ACTION = 'select' as const;

export const DEFAULT_EVENTS: readonly string[] = ['change', 'click'] as const;

export const resolveContainerSelector = (containerElement?: string, parentTo?: string): string | undefined =>
    containerElement ?? (parentTo?.startsWith('#') ? parentTo : parentTo ? `#${parentTo}` : undefined);

export const buildOptionsAttributes = (payload: {
    readonly name?: string;
    readonly action?: string;
    readonly disabled?: boolean;
}): Record<string, string> => {
    const { name, action, disabled } = payload;
    return {
        ...(name && { 'data-name': name }),
        ...(action && { 'data-action': action }),
        ...(disabled && { disabled: 'disabled' }),
    };
};

const formatRadioOptionHtml = (
    elementId: string,
    groupName: string,
    action: string,
    selectedValue: string | undefined,
    item: { readonly value: string; readonly label: string; readonly checked?: boolean; readonly disabled?: boolean },
): string => {
    const { value, label, checked, disabled } = item;
    const isChecked = checked ?? (selectedValue !== undefined && selectedValue === value);
    const checkedAttribute = isChecked ? ' checked="checked"' : '';
    const disabledAttribute = disabled ? ' disabled="disabled"' : '';
    return `<label for="${elementId}-${value}"><input type="radio" id="${elementId}-${value}" name="${groupName}" value="${value}" data-action="${action}"${checkedAttribute}${disabledAttribute} /><span>${label}</span></label>`;
};

export const buildOptionsContent = (
    elementId: string,
    payload: {
        readonly name?: string;
        readonly legend?: string;
        readonly value?: string;
        readonly action?: string;
        readonly items?: readonly { readonly value: string; readonly label: string; readonly checked?: boolean; readonly disabled?: boolean }[];
        readonly content?: string;
    },
): string | undefined => {
    const { name = elementId, legend, value, action = DEFAULT_ACTION, items, content } = payload;
    if (!items) { return content; }
    const legendHtml = legend ? `<legend>${legend}</legend>` : '';
    const radiosHtml = items.map((item) => formatRadioOptionHtml(elementId, name, action, value, item)).join('');
    return `${legendHtml}${radiosHtml}`;
};

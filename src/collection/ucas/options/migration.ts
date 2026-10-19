import type { Body as ChoiceBody } from '@uca/choice/types';
import type { OptionItem } from './types.js';

export function selectedItems(items?: OptionItem[]): Partial<ChoiceBody> {
    return items === undefined ? {} : {
        items: items.map(({ checked, ...item }) => ({
            ...item,
            selected: checked,
        })),
    };
}

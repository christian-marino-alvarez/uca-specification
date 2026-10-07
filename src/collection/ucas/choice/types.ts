export enum SignalType {
    CREATE = 'choice.create',
    UPDATE = 'choice.update',
    REMOVE = 'choice.remove',
    SELECT = 'choice.select',
    CREATED = 'choice.created',
    UPDATED = 'choice.updated',
    REMOVED = 'choice.removed',
    SELECTED = 'choice.selected',
}

export interface OptionItem {
    readonly value: string;
    readonly label: string;
    readonly disabled?: boolean;
}

export interface Body {
    readonly options?: readonly (string | OptionItem)[];
    readonly selected?: readonly string[];
    readonly multiple?: boolean;
    readonly title?: string;
    readonly disabled?: boolean;
}

export enum DataType {
    RECORD = 'record',
}

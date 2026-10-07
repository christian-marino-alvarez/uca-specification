export enum SignalType {
    CREATE = 'dropdown.create',
    UPDATE = 'dropdown.update',
    REMOVE = 'dropdown.remove',
    CREATED = 'dropdown.created',
    UPDATED = 'dropdown.updated',
    REMOVED = 'dropdown.removed',
}

export interface Body {
    readonly value?: string;
    readonly items?: readonly string[];
    readonly placeholder?: string;
    readonly disabled?: boolean;
    readonly required?: boolean;
    readonly fontSize?: number | string;
    readonly color?: string;
    readonly backgroundColor?: string;
    readonly fontFamily?: string;
}

export enum DataType {
    RECORD = 'record',
}

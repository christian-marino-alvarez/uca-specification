export enum SignalType {
    CREATE = 'input.create',
    UPDATE = 'input.update',
    REMOVE = 'input.remove',
    CHANGE = 'input.change',
    CREATED = 'input.created',
    UPDATED = 'input.updated',
    REMOVED = 'input.removed',
    CHANGED = 'input.changed',
}

export interface Body {
    readonly value?: string;
    readonly placeholder?: string;
    readonly disabled?: boolean;
    readonly readOnly?: boolean;
    readonly fontSize?: number | string;
    readonly color?: string;
    readonly backgroundColor?: string;
    readonly fontFamily?: string;
}

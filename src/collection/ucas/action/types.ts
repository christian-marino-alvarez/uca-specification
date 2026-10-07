export enum SignalType {
    CREATE = 'action.create',
    UPDATE = 'action.update',
    REMOVE = 'action.remove',
    TRIGGER = 'action.trigger',
    CREATED = 'action.created',
    UPDATED = 'action.updated',
    REMOVED = 'action.removed',
    TRIGGERED = 'action.triggered',
}

export interface Body {
    readonly label?: string;
    readonly title?: string;
    readonly disabled?: boolean;
    readonly hidden?: boolean;
    readonly className?: string;
}

export enum DataType {
    RECORD = 'record',
}

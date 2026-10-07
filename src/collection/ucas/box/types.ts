export enum SignalType {
    CREATE = 'box.create',
    UPDATE = 'box.update',
    REMOVE = 'box.remove',
    CREATED = 'box.created',
    UPDATED = 'box.updated',
    REMOVED = 'box.removed',
}

export interface Body {
    readonly id?: string;
    readonly text?: string;
    readonly role?: string;
    readonly hidden?: boolean;
    readonly className?: string;
}

export enum DataType {
    RECORD = 'record',
}

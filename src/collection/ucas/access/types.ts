export enum SignalType {
    CREATE = 'access.create',
    UPDATE = 'access.update',
    REMOVE = 'access.remove',
    CREATED = 'access.created',
    UPDATED = 'access.updated',
    REMOVED = 'access.removed',
}

export interface Body {
    readonly source?: string;
    readonly label?: string;
    readonly title?: string;
}

export enum DataType {
    RECORD = 'record',
}

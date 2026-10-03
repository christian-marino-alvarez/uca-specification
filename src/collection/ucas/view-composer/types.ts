export enum SignalType {
    CREATE = 'view-composer.create',
    UPDATE = 'view-composer.update',
    REMOVE = 'view-composer.remove',
    CREATED = 'view-composer.created',
    UPDATED = 'view-composer.updated',
    REMOVED = 'view-composer.removed',
}

export enum DataType {
    VOID = 'void',
    RECORD = 'Record',
}

export interface Body {
    readonly title?: string;
    readonly layout?: string;
    readonly description?: string;
}

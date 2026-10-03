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
    STREAM = 'Stream',
}

export interface Body {
    readonly title?: string;
    readonly layout?: string;
    readonly description?: string;
    readonly prompt?: string;
    readonly model?: string;
    readonly documentation?: string;
    readonly endpoint?: string;
    readonly sseEndpoint?: string;
    readonly detectedUca?: { id: string; disposition: unknown };
}

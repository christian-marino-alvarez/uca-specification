export enum SignalType {
    CREATE = 'app.create',
    UPDATE = 'app.update',
    REMOVE = 'app.remove',
    EXPLAIN = 'app.explain',
    CREATED = 'app.created',
    UPDATED = 'app.updated',
    REMOVED = 'app.removed',
}

export enum DataType {
    VOID = 'void',
    RECORD = 'Record',
    STRING = 'string',
}

export interface Body {
    readonly title?: string;
    readonly question?: string;
    readonly buttonLabel?: string;
    readonly documentation?: string;
    readonly model?: string;
    readonly endpoint?: string;
    readonly sseEndpoint?: string;
    readonly composedResult?: unknown;
}

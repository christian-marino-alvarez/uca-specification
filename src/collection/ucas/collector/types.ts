export enum SignalType {
    CREATE = 'collector.create',
    UPDATE = 'collector.update',
    REMOVE = 'collector.remove',
    SUBMIT = 'collector.submit',
    RESET = 'collector.reset',
    CREATED = 'collector.created',
    UPDATED = 'collector.updated',
    REMOVED = 'collector.removed',
    SUBMITTED = 'collector.submitted',
    RESETTED = 'collector.resetted',
}

export interface Body {
    readonly id?: string;
    readonly name?: string;
    readonly title?: string;
    readonly disabled?: boolean;
}

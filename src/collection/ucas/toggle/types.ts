export enum SignalType {
    CREATE = 'toggle.create',
    UPDATE = 'toggle.update',
    REMOVE = 'toggle.remove',
    CHANGE = 'toggle.change',
    CREATED = 'toggle.created',
    UPDATED = 'toggle.updated',
    REMOVED = 'toggle.removed',
    CHANGED = 'toggle.changed',
}

export interface Body {
    readonly checked?: boolean;
    readonly label?: string;
    readonly title?: string;
    readonly disabled?: boolean;
}

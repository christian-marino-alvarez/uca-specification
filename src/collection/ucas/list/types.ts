export enum SignalType {
    CREATE = 'list.create',
    UPDATE = 'list.update',
    REMOVE = 'list.remove',
    CREATED = 'list.created',
    UPDATED = 'list.updated',
    REMOVED = 'list.removed',
}

export type TextAlignment = 'left' | 'right';

export interface Body {
    readonly items?: readonly string[];
    readonly ordered?: boolean;
    readonly fontSize?: number | string;
    readonly spacing?: number | string;
    readonly alignment?: TextAlignment;
    readonly color?: string;
    readonly backgroundColor?: string;
    readonly text?: string;
    readonly hidden?: boolean;
    readonly className?: string;
}

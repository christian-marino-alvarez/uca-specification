export enum SignalType {
    CREATE = 'picture.create',
    UPDATE = 'picture.update',
    REMOVE = 'picture.remove',
    CREATED = 'picture.created',
    UPDATED = 'picture.updated',
    REMOVED = 'picture.removed',
}

export interface Dimensions {
    readonly width?: number | string;
    readonly height?: number | string;
}

export interface Body {
    readonly source?: string;
    readonly dimensions?: Dimensions;
    readonly quality?: number;
    readonly sharpness?: number;
    readonly alt?: string;
}

export enum SignalType {
    APPLY = 'style.apply',
    RESOLVE = 'style.resolve',
    THEME = 'style.theme',
    REMOVE = 'style.remove',
    MOUNT = 'style.mount',
    SCHEMA = 'style.schema',
    APPLIED = 'style.applied',
    RESOLVED = 'style.resolved',
    THEMED = 'style.themed',
    REMOVED = 'style.removed',
    MOUNTED = 'style.mounted',
    SCHEMA_RESOLVED = 'style.schema.resolved',
    ERROR = 'style.error',
}

export enum DataType {
    BODY = 'Body',
    APPLY_PAYLOAD = 'ApplyPayload',
    RESOLVE_PAYLOAD = 'ResolvePayload',
    THEME_PAYLOAD = 'ThemePayload',
    REMOVE_PAYLOAD = 'RemovePayload',
    MOUNT_PAYLOAD = 'MountPayload',
    SCHEMA_PAYLOAD = 'SchemaPayload',
    APPLIED_RESULT = 'AppliedResult',
    RESOLVED_RESULT = 'ResolvedResult',
    THEMED_RESULT = 'ThemedResult',
    REMOVED_RESULT = 'RemovedResult',
    MOUNTED_RESULT = 'MountedResult',
    SCHEMA_RESOLVED_RESULT = 'SchemaResolvedResult',
    UNKNOWN = 'unknown',
}

export interface DesignToken<T = string> {
    readonly $value: T;
    readonly $type?: string;
    readonly $description?: string;
}

export type DesignTokenGroup = {
    readonly $type?: string;
    readonly $description?: string;
    readonly [name: string]: DesignToken<unknown> | DesignTokenGroup | unknown;
};

export interface Qualities {
    readonly width?: string;
    readonly height?: string;
    readonly spacing?: string;
    readonly surface?: string;
    readonly tone?: string;
    readonly typeface?: string;
    readonly textSize?: string;
    readonly elevation?: string;
    readonly radius?: string;
    readonly direction?: string;
    readonly alignment?: string;
    readonly custom?: Record<string, string>;
}

export interface ApplyPayload {
    readonly elementId: string;
    readonly qualities: Qualities;
}

export interface ResolvePayload {
    readonly elementId?: string;
    readonly qualities: Qualities;
}

export interface ThemePayload {
    readonly tokens: Record<string, Record<string, unknown>>;
}

export interface RemovePayload {
    readonly elementId: string;
}

export interface MountPayload {
    readonly tokens?: Record<string, Record<string, unknown>>;
}

export interface MountedResult {
    readonly mounted: boolean;
}

export interface SchemaPayload {
    readonly format?: string;
}

export interface SchemaResolvedResult {
    readonly tokens: Record<string, Record<string, unknown>>;
    readonly summary: string;
}

export interface AppliedResult {
    readonly elementId: string;
    readonly declarations: Record<string, string>;
}

export interface ResolvedResult {
    readonly elementId?: string;
    readonly declarations: Record<string, string>;
    readonly cssText: string;
}

export interface ThemedResult {
    readonly updated: boolean;
}

export interface RemovedResult {
    readonly elementId: string;
    readonly removed: boolean;
}

export interface Body {
    readonly qualities?: Qualities;
    readonly tokens?: Record<string, Record<string, unknown>>;
}

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

export type DesignTokens = Readonly<Record<
    string,
    Readonly<Record<string, DesignToken<string | number>>>
>>;

export interface DesignModes {
    readonly light?: DesignTokens;
    readonly dark?: DesignTokens;
    readonly reducedMotion?: DesignTokens;
}

export interface StylesheetDesign {
    readonly tokens: DesignTokens;
    readonly modes?: DesignModes;
    readonly rules?: Readonly<Record<
        string,
        Readonly<Record<string, string | number>>
    >>;
}

export type DesignTokenGroup = {
    readonly $type?: string;
    readonly $description?: string;
    readonly [name: string]: DesignToken<unknown> | DesignTokenGroup | unknown;
};

import type { Qualities, BaseRules, Body } from './schema.js';
import type { DESIGN_TOKENS } from './constants.js';
export type { Qualities, BaseRules, Body };

export type TokenProperty = readonly [quality: keyof Qualities, group: keyof typeof DESIGN_TOKENS, property: string];
export type DimensionProperty = readonly [quality: 'width' | 'height' | 'maxWidth' | 'minWidth' | 'minHeight', property: string, viewport: string];

export interface ApplyPayload {
    readonly elementId: string;
    readonly qualities: Qualities;
    readonly control?: ControlType;
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


export enum ControlType { INPUT = 'input', ACTION = 'action' }
export interface StateRule { readonly suffix: string; readonly declarations: Readonly<Record<string, string>>; }

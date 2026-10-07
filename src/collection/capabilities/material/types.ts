export enum SignalType {
    APPLY = 'material.apply',
    THEME = 'material.theme',
    APPLIED = 'material.applied',
}

export enum DataType {
    APPLY_PAYLOAD = 'ApplyPayload',
    THEME_MODE = 'ThemeMode',
    APPLIED_RESULT = 'AppliedResult',
}

export type ThemeMode = 'dark' | 'light';

export interface ApplyPayload {
    readonly theme?: ThemeMode;
    readonly seedColor?: string;
    readonly targetSelector?: string;
}

export interface AppliedResult {
    readonly theme: ThemeMode;
    readonly tokens: Record<string, string>;
}

export type Body = ApplyPayload;

import type {
    Body,
    CreatePayload,
    CssRule,
    Theme,
    ThemeResult,
} from './schema.js';

export enum SignalType {
    CREATE = 'theme-css.create',
    CREATED = 'theme-css.created',
    DESTROY = 'theme-css.destroy',
    DESTROYED = 'theme-css.destroyed',
    ERROR = 'theme-css.error',
}

export enum DataType {
    CREATE_PAYLOAD = 'CreatePayload',
    THEME_RESULT = 'ThemeResult',
    VOID = 'void',
    UNKNOWN = 'unknown',
}

export type { Body, CreatePayload, CssRule, Theme, ThemeResult };


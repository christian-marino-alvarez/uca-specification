export type {
    Body,
    DesignSpecification,
    DesignToken,
    DesignTokens,
    ResolvePayload,
    ResolvedResult,
    Theme,
    ThemePayload,
} from './schema.js';

export enum SignalType {
    GET = 'design.get',
    SET_THEME = 'design.set_theme',
    RESOLVE = 'design.resolve',
    PROVIDED = 'design.provided',
    THEME_CHANGED = 'design.theme_changed',
    RESOLVED = 'design.resolved',
    ERROR = 'design.error',
}

export enum DataType {
    BODY = 'Body',
    THEME_PAYLOAD = 'ThemePayload',
    RESOLVE_PAYLOAD = 'ResolvePayload',
    DESIGN_SPECIFICATION = 'DesignSpecification',
    RESOLVED_RESULT = 'ResolvedResult',
    ERROR = 'Error',
    VOID = 'void',
}

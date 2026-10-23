export enum SignalType {
    APPLY = 'material.apply',
    THEME = 'material.theme',
    APPLIED = 'material.applied',
}

export enum DataType {
    APPLY_PAYLOAD = 'ApplyPayload',
    THEME_MODE = 'ThemeMode',
    APPLIED_RESULT = 'AppliedResult',
    MATERIAL_QUALITIES = 'MaterialQualities',
    BODY = 'Body',
}

export type {
    AppliedResult,
    ApplyPayload,
    Body,
    ColorRole,
    ComponentVariant,
    Elevation,
    MaterialQualities,
    Shape,
    SpacingScale,
    ThemeMode,
} from './schema.js';

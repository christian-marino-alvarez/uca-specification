import type { CssRule } from '@uca/capability-css';
import type { Disposition } from '@uca/core/types';
import type { AILanguageModelFactory } from '@uca/capability-prompt-api';

export enum SignalType {
    COMPOSE_THEME = 'style-composer.compose-theme',
    STYLE_UCA = 'style-composer.style-uca',
    THEME_COMPOSED = 'style-composer.theme-composed',
    UCA_STYLED = 'style-composer.uca-styled',
    ERROR = 'style-composer.error',
}

export enum DataType {
    COMPOSE_THEME_PAYLOAD = 'ComposeThemePayload',
    STYLE_UCA_PAYLOAD = 'StyleUcaPayload',
    THEME_COMPOSED_RESULT = 'ThemeComposedResult',
    UCA_STYLED_RESULT = 'UcaStyledResult',
    UNKNOWN = 'unknown',
}

export interface ComposeThemePayload {
    readonly purpose?: string;
    readonly palette?: string;
}

export interface StyleUcaPayload {
    readonly id: string;
    readonly disposition?: Disposition;
}

export interface ThemeComposedResult {
    readonly rules: readonly CssRule[];
}

export interface UcaStyledResult {
    readonly id: string;
    readonly rules: readonly CssRule[];
}

export interface Body {
    readonly palette?: string;
    readonly factory?: AILanguageModelFactory;
}

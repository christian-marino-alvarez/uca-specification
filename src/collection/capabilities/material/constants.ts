import { SignalType, type ThemeMode } from './types.js';

export const __ID__ = 'material';

export const AIM = 'Inject and synchronize Google Material Design 3 (M3) design tokens, dynamic color palettes, elevation layers, and shape scales';

export const DEFAULT_THEME: ThemeMode = 'light';

export const DEFAULT_SEED_COLOR = '#1a73e8';

export const STYLE_ELEMENT_ID = 'uca-material-tokens';

export const DARK_TOKENS: Readonly<Record<string, string>> = {
    '--md-sys-color-background': '#202124',
    '--md-sys-color-on-background': '#e8eaed',
    '--md-sys-color-surface': '#202124',
    '--md-sys-color-on-surface': '#e8eaed',
    '--md-sys-color-surface-container': '#303134',
    '--md-sys-color-surface-container-high': '#3c4043',
    '--md-sys-color-surface-variant': '#444746',
    '--md-sys-color-on-surface-variant': '#9aa0a6',
    '--md-sys-color-primary': '#8ab4f8',
    '--md-sys-color-on-primary': '#202124',
    '--md-sys-color-primary-container': '#1b3864',
    '--md-sys-color-on-primary-container': '#d3e3fd',
    '--md-sys-color-outline': '#5f6368',
    '--md-sys-color-outline-variant': '#3c4043',
    '--bg': '#202124',
    '--surface': '#303134',
    '--surface-card': '#202124',
    '--border': '#5f6368',
    '--primary': '#8ab4f8',
    '--text': '#e8eaed',
    '--text-muted': '#9aa0a6',
};

export const LIGHT_TOKENS: Readonly<Record<string, string>> = {
    '--md-sys-color-background': '#ffffff',
    '--md-sys-color-on-background': '#202124',
    '--md-sys-color-surface': '#ffffff',
    '--md-sys-color-on-surface': '#202124',
    '--md-sys-color-surface-container': '#f8f9fa',
    '--md-sys-color-surface-container-high': '#f1f3f4',
    '--md-sys-color-surface-variant': '#e8eaed',
    '--md-sys-color-on-surface-variant': '#5f6368',
    '--md-sys-color-primary': '#1a73e8',
    '--md-sys-color-on-primary': '#ffffff',
    '--md-sys-color-primary-container': '#d2e3fc',
    '--md-sys-color-on-primary-container': '#174ea6',
    '--md-sys-color-secondary': '#3c4043',
    '--md-sys-color-secondary-container': '#f1f3f4',
    '--md-sys-color-outline': '#dadce0',
    '--md-sys-color-outline-variant': '#dfe1e5',
    '--bg': '#ffffff',
    '--surface': '#f8f9fa',
    '--surface-card': '#ffffff',
    '--border': '#dfe1e5',
    '--primary': '#1a73e8',
    '--text': '#202124',
    '--text-muted': '#5f6368',
};

export const SHAPE_TOKENS: Readonly<Record<string, string>> = {
    '--md-sys-shape-corner-extra-small': '4px',
    '--md-sys-shape-corner-small': '8px',
    '--md-sys-shape-corner-medium': '12px',
    '--md-sys-shape-corner-large': '16px',
    '--md-sys-shape-corner-extra-large': '24px',
    '--md-sys-shape-corner-full': '9999px',
    '--radius': '24px',
};

export const ELEVATION_TOKENS: Readonly<Record<string, string>> = {
    '--md-sys-elevation-level0': 'none',
    '--md-sys-elevation-level1': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
    '--md-sys-elevation-level2': '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
    '--md-sys-elevation-level3': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
};

export const TYPOGRAPHY_TOKENS: Readonly<Record<string, string>> = {
    '--md-sys-typescale-font': '"Open Sans", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    '--font-google': '"Open Sans", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

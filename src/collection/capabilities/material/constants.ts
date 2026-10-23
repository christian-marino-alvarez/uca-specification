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

export const GRID_GRAMMAR = {
    specification: 'Material Design 3 Generative Grid & Spatial Modulation System',
    designPhilosophy:
        'Construct the most efficient, fluid and ergonomic spatial partition tailored strictly to the functional intention, density needs, and available viewport.',
    densityArchetypes: {
        workbench:
            'Cockpit / Multi-pane studio: asymmetric partitioning with command rails and elastic canvas for high-density tools',
        exploratory:
            'Supporting pane / Master-detail: clear hierarchy between navigation, primary task canvas, and contextual inspection',
        focused:
            'Hero / Immersive canvas: single dominant area with minimal perimeter toolbars',
        adaptiveGrid:
            'Fluid matrix: auto-responsive wrapping for modular cards or metrics tiles using span modulation',
    },
    spatialPrinciples: {
        gravitationalBalance:
            'The primary operational area must absorb available space (1fr or flex: fill), while secondary controls remain compact',
        cellSpanModulation:
            'Use span (single, double, triple, full) to reflect semantic weight and hierarchy of each child area within the grid',
        viewportContainment:
            'Preserve 100dvh viewport budget without outer scrolling; delegate inner scrolling (overflow: auto) strictly to terminal work areas',
        rhythmAndGutter:
            'Apply consistent M3 gutters via gap (small for data-dense, medium for standard, large for airy breathing space)',
    },
    windowSizeGuidance: {
        compact: {
            breakpoint: '< 600px',
            columns: 4,
            pattern: 'Single-column vertical stack (Top App Bar + Main Scroll + Optional Bottom Bar)',
            recommendedDivision: 'single',
        },
        medium: {
            breakpoint: '600px - 839px',
            columns: 8,
            pattern: 'Supporting Pane: Navigation Rail (80px) or Compact Drawer (260px) + Main Canvas (1fr)',
            recommendedDivision: 'sidebar-main',
        },
        expanded: {
            breakpoint: '>= 840px',
            columns: 12,
            pattern: 'Two or Three Panes: Drawer (260px) + Main Canvas (1fr) + Optional Inspector (260px)',
            recommendedDivision: 'sidebar-main | sidebar-main-aside | halves | thirds | auto',
        },
    },
} as const;

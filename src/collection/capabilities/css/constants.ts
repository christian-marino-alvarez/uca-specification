import { ControlType, type StateRule, type TokenProperty, type DimensionProperty } from './types.js';
export const __ID__ = 'css';

export const TOKENS_STYLE_ID = 'uca-tokens';

export const DESIGN_READY_PROPERTY = '--uca-design-ready';

export const LIGHT_SCHEME_QUERY = '(prefers-color-scheme: light)';

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const STYLE_PREFIX = 'uca-style-';

export const DESIGN_TOKENS = {
    dimensions: {
        $type: 'dimension',
        auto: { $value: 'auto', $description: 'Automatic intrinsic size' },
        full: { $value: '100%', $description: 'Full container span' },
        half: { $value: '50%', $description: 'Half container span' },
        third: { $value: '33.333%', $description: 'One-third container span' },
        'two-thirds': { $value: '66.666%', $description: 'Two-thirds container span' },
        quarter: { $value: '25%', $description: 'One-quarter container span' },
        'three-quarters': { $value: '75%', $description: 'Three-quarters container span' },
        narrow: { $value: '64px', $description: 'Compact narrow container span' },
        wide: { $value: '80%', $description: 'Wide container span' },
        screen: { $value: '100vh', $description: 'Full viewport height' },
        content: { $value: 'fit-content', $description: 'Fit to inner content' },
    },
    control: {
        $type: 'color',
        border: { $value: '#cbd5e1', $description: 'Control boundary' },
        'border-hover': { $value: '#94a3b8', $description: 'Hovered control boundary' },
        placeholder: { $value: '#64748b', $description: 'Placeholder text' },
    },
    spacing: {
        $type: 'dimension',
        none: { $value: '0', $description: 'Zero spacing' },
        small: { $value: '0.5rem', $description: 'Compact density spacing' },
        medium: { $value: '1rem', $description: 'Baseline layout spacing' },
        large: { $value: '2rem', $description: 'Spacious section spacing' },
        xlarge: { $value: '3rem', $description: 'Extended hero spacing' },
    },
    surface: {
        $type: 'color',
        transparent: { $value: 'transparent', $description: 'Transparent surface revealing the containing area' },
        default: { $value: '#ffffff', $description: 'Default surface background' },
        card: { $value: '#ffffff', $description: 'Card elevated surface' },
        muted: { $value: '#f3f4f6', $description: 'Subtle neutral surface' },
        dark: { $value: '#111827', $description: 'High contrast dark surface' },
        brand: { $value: '#2563eb', $description: 'Primary accent brand surface' },
        accent: { $value: '#f59e0b', $description: 'Attention accent surface' },
        danger: { $value: '#ef4444', $description: 'Destructive warning surface' },
    },
    tone: {
        $type: 'color',
        brand: { $value: '#2563eb', $description: 'Primary accent brand color' },
        surface: { $value: '#ffffff', $description: 'Default surface background' },
        muted: { $value: '#f3f4f6', $description: 'Subtle surface tint' },
        dark: { $value: '#111827', $description: 'High contrast dark surface' },
        accent: { $value: '#f59e0b', $description: 'Attention accent color' },
        danger: { $value: '#ef4444', $description: 'Destructive warning color' },
    },
    textColor: {
        $type: 'color',
        light: { $value: '#ffffff', $description: 'Light foreground for dark surfaces' },
        dark: { $value: '#111827', $description: 'Dark foreground for light surfaces' },
        muted: { $value: '#64748b', $description: 'Secondary foreground; verify contrast against the chosen surface' },
        brand: { $value: '#2563eb', $description: 'Brand accent foreground' },
        accent: { $value: '#f59e0b', $description: 'Attention accent foreground' },
        danger: { $value: '#ef4444', $description: 'Destructive warning foreground' },
    },
    typeface: {
        $type: 'fontFamily',
        sans: { $value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', $description: 'Clean sans-serif typeface' },
        serif: { $value: 'Georgia, Cambria, "Times New Roman", Times, serif', $description: 'Editorial serif typeface' },
        mono: { $value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', $description: 'Code monospace typeface' },
    },
    textSize: {
        $type: 'dimension',
        small: { $value: '0.875rem', $description: 'Small secondary text scale' },
        medium: { $value: '1rem', $description: 'Base body text scale' },
        large: { $value: '1.25rem', $description: 'Subheading text scale' },
        title: { $value: '1.5rem', $description: 'Prominent title text scale' },
        display: { $value: '2.25rem', $description: 'Display hero text scale' },
    },
    fontWeight: {
        $type: 'fontWeight',
        normal: { $value: 400, $description: 'Regular text weight' },
        medium: { $value: 500, $description: 'Medium text emphasis' },
        semibold: { $value: 600, $description: 'Semibold text emphasis' },
        bold: { $value: 700, $description: 'Bold text emphasis' },
    },
    lineHeight: {
        $type: 'number',
        tight: { $value: 1.2, $description: 'Compact line height relative to the font size' },
        normal: { $value: 1.5, $description: 'Standard line height relative to the font size' },
        relaxed: { $value: 1.75, $description: 'Spacious line height relative to the font size' },
    },
    textAlign: {
        $type: 'string',
        start: { $value: 'start', $description: 'Text aligned to the writing direction start' },
        center: { $value: 'center', $description: 'Text centered within its line box' },
        end: { $value: 'end', $description: 'Text aligned to the writing direction end' },
        justify: { $value: 'justify', $description: 'Text distributed across the line box' },
    },
    elevation: {
        $type: 'shadow',
        none: { $value: 'none', $description: 'Flat surface without shadow' },
        low: { $value: '0 1px 2px rgba(0, 0, 0, 0.05)', $description: 'Subtle elevation shadow' },
        card: { $value: '0 1px 3px rgba(0, 0, 0, 0.1)', $description: 'Standard card elevation shadow' },
        medium: { $value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)', $description: 'Medium elevated shadow' },
        modal: { $value: '0 10px 15px rgba(0, 0, 0, 0.1)', $description: 'Elevated overlay modal shadow' },
        high: { $value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', $description: 'High elevation shadow' },
    },
    radius: {
        $type: 'dimension',
        none: { $value: '0', $description: 'Sharp corners' },
        small: { $value: '0.25rem', $description: 'Subtle rounded corners' },
        medium: { $value: '0.5rem', $description: 'Standard rounded corners' },
        large: { $value: '1rem', $description: 'Card rounded corners' },
        full: { $value: '9999px', $description: 'Fully rounded pill corners' },
    },
    border: {
        $type: 'border',
        none: { $value: 'none', $description: 'No border' },
        subtle: { $value: '1px solid #e5e7eb', $description: 'Light solid hairline border' },
        strong: { $value: '1px solid #94a3b8', $description: 'Visible solid border' },
        outline: { $value: '1px dashed #cbd5e1', $description: 'Dashed outline delimiting a placeholder area' },
    },
    direction: {
        $type: 'string',
        row: { $value: 'row', $description: 'Horizontal flow direction' },
        column: { $value: 'column', $description: 'Vertical flow direction' },
    },
    alignment: {
        $type: 'string',
        start: { $value: 'flex-start', $description: 'Align items to start' },
        center: { $value: 'center', $description: 'Align items to center' },
        end: { $value: 'flex-end', $description: 'Align items to end' },
        stretch: { $value: 'stretch', $description: 'Stretch items across cross-axis' },
        between: { $value: 'space-between', $description: 'Distribute items with space between' },
    },
    distribution: {
        $type: 'string',
        start: { $value: 'flex-start', $description: 'Children grouped at the main axis start' },
        center: { $value: 'center', $description: 'Children centered on the main axis' },
        end: { $value: 'flex-end', $description: 'Children grouped at the main axis end' },
        between: { $value: 'space-between', $description: 'Free main axis space between children' },
        around: { $value: 'space-around', $description: 'Free main axis space around children' },
        evenly: { $value: 'space-evenly', $description: 'Equal main axis spaces between children and at both edges' },
    },
    wrap: {
        $type: 'string',
        nowrap: { $value: 'nowrap', $description: 'Keep children on a single flex line' },
        wrap: { $value: 'wrap', $description: 'Allow children to wrap onto further flex lines' },
        reverse: { $value: 'wrap-reverse', $description: 'Wrap children with reversed cross axis line order' },
    },
} as const;

export const CSS_TOKENS_SUMMARY = `Design tokens: ${Object.entries(DESIGN_TOKENS).map(([category, group]) => `${category}: ${Object.keys(group).filter((name) => !name.startsWith('$')).join(', ')}`).join('. ')}.`;

export const TOKEN_PROPERTIES = [
    ['spacing', 'spacing', 'padding'], ['spacingInline', 'spacing', 'padding-inline'], ['spacingBlock', 'spacing', 'padding-block'],
    ['marginInline', 'spacing', 'margin-inline'], ['gap', 'spacing', 'gap'],
    ['tone', 'tone', 'background-color'], ['surface', 'surface', 'background-color'], ['textColor', 'textColor', 'color'],
    ['typeface', 'typeface', 'font-family'], ['textSize', 'textSize', 'font-size'], ['fontWeight', 'fontWeight', 'font-weight'],
    ['lineHeight', 'lineHeight', 'line-height'], ['textAlign', 'textAlign', 'text-align'],
    ['elevation', 'elevation', 'box-shadow'], ['radius', 'radius', 'border-radius'], ['border', 'border', 'border'],
    ['direction', 'direction', 'flex-direction'], ['distribution', 'distribution', 'justify-content'], ['wrap', 'wrap', 'flex-wrap'],
] as const satisfies readonly TokenProperty[];
export const DIMENSION_PROPERTIES = [
    ['width', 'width', '100vw'], ['height', 'height', '100vh'], ['maxWidth', 'max-width', '100vw'],
    ['minWidth', 'min-width', '100vw'], ['minHeight', 'min-height', '100vh'],
] as const satisfies readonly DimensionProperty[];
export const ALIGNMENT_DISTRIBUTIONS: readonly string[] = ['space-between', 'center', 'flex-end'];

export const BASE_RULES = { 'box-sizing': 'border-box' } as const;
export const CONTAINER_RULES = { display: 'block' } as const;
export const CONTROL_INHERITANCE_RULES = { font: 'inherit', color: 'inherit' } as const;
export const IDENTIFIED_DESCENDANT_SELECTOR = '[id]';

export const formatDeclarations = (declarations: Record<string, string>): string =>
    Object.entries(declarations).map(([property, value]) => `${property}: ${value};`).join(' ');

export const generateBaseRulesCss = (): string => `*, *::before, *::after { ${formatDeclarations(BASE_RULES)} } ext-uca { ${formatDeclarations(CONTAINER_RULES)} } input, button, select, textarea { ${formatDeclarations(CONTROL_INHERITANCE_RULES)} }`;

export const DIMENSION_PATTERN = /^(?:0|\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh|dvh|svh))$/;
export const ACCESSIBLE_CONTROL_STATES = [
    { suffix: ':focus-visible', declarations: { outline: 'auto' } },
    { suffix: ':disabled', declarations: { cursor: 'not-allowed' } },
] as const;
export const CONTROL_STATE_RULES: Readonly<Record<ControlType, readonly StateRule[]>> = {
    [ControlType.INPUT]: ACCESSIBLE_CONTROL_STATES,
    [ControlType.ACTION]: ACCESSIBLE_CONTROL_STATES,
};

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
        compact: { $value: '260px', $description: 'Compact rail container span' },
        regular: { $value: '320px', $description: 'Regular column container span' },
        wide: { $value: '80%', $description: 'Wide container span' },
        small: { $value: '2rem', $description: 'Small compact scale dimension' },
        medium: { $value: '2.5rem', $description: 'Medium control scale dimension' },
        large: { $value: '3.5rem', $description: 'Large section scale dimension' },
        xlarge: { $value: '4rem', $description: 'Extra large hero scale dimension' },
        screen: { $value: '100vh', $description: 'Full viewport height' },
        content: { $value: 'fit-content', $description: 'Fit to inner content' },
        sidebar: { $value: '260px', $description: 'Alias for compact rail width' },
        header: { $value: '3.5rem', $description: 'Alias for large section height' },
        footer: { $value: '2.5rem', $description: 'Alias for medium scale height' },
    },
    flex: {
        $type: 'string',
        none: { $value: 'none', $description: 'Do not grow or shrink (0 0 auto)' },
        initial: { $value: 'initial', $description: 'Do not grow, shrink if needed (0 1 auto)' },
        auto: { $value: 'auto', $description: 'Flexible sizing (1 1 auto)' },
        fill: { $value: '1 1 0%', $description: 'Fill available container space equally' },
        grow: { $value: '1 0 auto', $description: 'Grow to absorb free space' },
        shrink: { $value: '0 1 auto', $description: 'Shrink if space is constrained' },
    },
    overflow: {
        $type: 'string',
        visible: { $value: 'visible', $description: 'Content overflows container bounds' },
        hidden: { $value: 'hidden', $description: 'Content clipped at container boundary without scrollbars' },
        auto: { $value: 'auto', $description: 'Scrollbars appear automatically when content overflows' },
        scroll: { $value: 'scroll', $description: 'Always provide scrollbars' },
    },
    control: {
        $type: 'color',
        border: { $value: 'rgba(226, 232, 240, 0.16)', $description: 'Control boundary' },
        'border-hover': { $value: '#e2e8f0', $description: 'Hovered control boundary' },
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
        default: { $value: 'var(--md-sys-color-surface, #070a12)', $description: 'Default matte dark surface background' },
        surface: { $value: 'var(--md-sys-color-surface, #070a12)', $description: 'M3 base surface' },
        surfaceContainer: { $value: 'var(--md-sys-color-surface-container, #111624)', $description: 'M3 surface container' },
        surfaceContainerLow: { $value: 'var(--md-sys-color-surface-container-low, #0d111c)', $description: 'M3 low surface container' },
        surfaceContainerHigh: { $value: 'var(--md-sys-color-surface-container-high, #1a2030)', $description: 'M3 high surface container' },
        surfaceContainerLowest: { $value: 'var(--md-sys-color-surface-container-lowest, #05070c)', $description: 'M3 lowest surface container' },
        surfaceContainerHighest: { $value: 'var(--md-sys-color-surface-container-highest, #232b3e)', $description: 'M3 highest surface container' },
        surfaceVariant: { $value: 'var(--md-sys-color-surface-variant, #2a344a)', $description: 'M3 surface variant' },
        primary: { $value: 'var(--md-sys-color-primary, #8ab4f8)', $description: 'M3 primary container color' },
        secondary: { $value: 'var(--md-sys-color-secondary, #3c4043)', $description: 'M3 secondary container color' },
        tertiary: { $value: 'var(--md-sys-color-tertiary, #80cbc4)', $description: 'M3 tertiary container color' },
        card: { $value: 'var(--md-sys-color-surface-container-high, #0d111c)', $description: 'Layered dark card surface' },
        muted: { $value: 'var(--md-sys-color-surface-container, #111624)', $description: 'Subtle dark surface' },
        dark: { $value: 'var(--md-sys-color-surface-container-lowest, #05070c)', $description: 'Deep matte dark surface' },
        brand: { $value: 'var(--md-sys-color-primary, #e2e8f0)', $description: 'Brand contrast surface' },
        accent: { $value: 'var(--md-sys-color-secondary, #cbd5e1)', $description: 'Secondary contrast surface' },
        danger: { $value: 'var(--md-sys-color-error, #f28b82)', $description: 'Warning surface' },
    },
    textColor: {
        $type: 'color',
        light: { $value: 'var(--md-sys-color-on-primary, #ffffff)', $description: 'Light foreground for dark or high-emphasis colored surfaces' },
        dark: { $value: 'var(--md-sys-color-on-surface, #202124)', $description: 'High-contrast dark foreground for light surfaces' },
        muted: { $value: 'var(--md-sys-color-on-surface-variant, #5f6368)', $description: 'Secondary readable muted foreground' },
        brand: { $value: 'var(--md-sys-color-primary, #1a73e8)', $description: 'Brand primary foreground' },
        accent: { $value: 'var(--md-sys-color-primary, #1a73e8)', $description: 'Accent foreground for links and interactive targets' },
        danger: { $value: 'var(--md-sys-color-error, #d93025)', $description: 'Contrast foreground for warnings' },
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
        level0: { $value: 'none', $description: 'M3 flat surface 0dp' },
        level1: { $value: 'var(--md-sys-elevation-level1, 0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30))', $description: 'M3 resting card elevation 1dp' },
        level2: { $value: 'var(--md-sys-elevation-level2, 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30))', $description: 'M3 navigation bar elevation 3dp' },
        level3: { $value: 'var(--md-sys-elevation-level3, 0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30))', $description: 'M3 dialog elevation 6dp' },
        level4: { $value: 'var(--md-sys-elevation-level4, 0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.30))', $description: 'M3 floating sheet elevation 8dp' },
        level5: { $value: 'var(--md-sys-elevation-level5, 0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.30))', $description: 'M3 top app bar elevation 12dp' },
        low: { $value: 'var(--md-sys-elevation-level1, 0 1px 2px rgba(0, 0, 0, 0.05))', $description: 'Subtle elevation shadow' },
        card: { $value: 'var(--md-sys-elevation-level1, 0 1px 3px rgba(0, 0, 0, 0.1))', $description: 'Standard card elevation shadow' },
        medium: { $value: 'var(--md-sys-elevation-level2, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1))', $description: 'Medium elevated shadow' },
        modal: { $value: 'var(--md-sys-elevation-level3, 0 10px 15px rgba(0, 0, 0, 0.1))', $description: 'Elevated overlay modal shadow' },
        high: { $value: 'var(--md-sys-elevation-level4, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1))', $description: 'High elevation shadow' },
    },
    shape: {
        $type: 'dimension',
        none: { $value: '0', $description: 'Sharp corners' },
        extraSmall: { $value: 'var(--md-sys-shape-corner-extra-small, 4px)', $description: 'M3 extra small shape 4px' },
        small: { $value: 'var(--md-sys-shape-corner-small, 8px)', $description: 'M3 small shape 8px' },
        medium: { $value: 'var(--md-sys-shape-corner-medium, 12px)', $description: 'M3 medium card shape 12px' },
        large: { $value: 'var(--md-sys-shape-corner-large, 16px)', $description: 'M3 large dialog shape 16px' },
        extraLarge: { $value: 'var(--md-sys-shape-corner-extra-large, 28px)', $description: 'M3 extra large sheet shape 28px' },
        full: { $value: 'var(--md-sys-shape-corner-full, 9999px)', $description: 'M3 full pill shape 9999px' },
    },
    variant: {
        $type: 'string',
        elevated: { $value: 'elevated', $description: 'M3 elevated surface container variant' },
        filled: { $value: 'filled', $description: 'M3 filled high-emphasis variant' },
        tonal: { $value: 'tonal', $description: 'M3 filled tonal medium-emphasis variant' },
        outlined: { $value: 'outlined', $description: 'M3 outlined bounded variant' },
        text: { $value: 'text', $description: 'M3 text-only low-emphasis variant' },
    },
    outline: {
        $type: 'border',
        none: { $value: 'none', $description: 'No outline' },
        subtle: { $value: '1px solid var(--md-sys-color-outline-variant, rgba(226, 232, 240, 0.12))', $description: 'M3 subtle outline variant' },
        strong: { $value: '1px solid var(--md-sys-color-outline, rgba(226, 232, 240, 0.28))', $description: 'M3 prominent outline' },
        dashed: { $value: '1px dashed var(--md-sys-color-outline-variant, rgba(226, 232, 240, 0.24))', $description: 'M3 dashed outline for placeholders' },
    },
    direction: {
        $type: 'string',
        row: { $value: 'row', $description: 'Horizontal flow direction' },
        column: { $value: 'column', $description: 'Vertical flow direction' },
    },
    alignment: {
        $type: 'string',
        start: { $value: 'flex-start', $description: 'Align items to cross-axis start' },
        center: { $value: 'center', $description: 'Align items to cross-axis center' },
        end: { $value: 'flex-end', $description: 'Align items to cross-axis end' },
        stretch: { $value: 'stretch', $description: 'Stretch items across cross-axis' },
        baseline: { $value: 'baseline', $description: 'Align items along text baseline' },
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
    division: {
        $type: 'string',
        single: { $value: 'repeat(1, 1fr)', $description: 'Single continuous full-width column' },
        halves: { $value: 'repeat(2, 1fr)', $description: 'Two equal proportional columns' },
        thirds: { $value: 'repeat(3, 1fr)', $description: 'Three equal proportional columns' },
        quarters: { $value: 'repeat(4, 1fr)', $description: 'Four equal proportional columns' },
        'sidebar-main': { $value: '260px 1fr', $description: 'Compact sidebar rail alongside flexible main space' },
        'main-sidebar': { $value: '1fr 260px', $description: 'Flexible main space alongside compact sidebar rail' },
        'sidebar-main-aside': { $value: '260px 1fr 260px', $description: 'Three-pane layout: sidebar, main canvas and inspector' },
        auto: { $value: 'repeat(auto-fit, minmax(240px, 1fr))', $description: 'Adaptive columns responding to available width' },
    },
    span: {
        $type: 'string',
        single: { $value: 'span 1', $description: 'Span across a single grid cell' },
        double: { $value: 'span 2', $description: 'Span across two grid cells' },
        triple: { $value: 'span 3', $description: 'Span across three grid cells' },
        full: { $value: '1 / -1', $description: 'Span across all available columns in the grid track' },
    },
} as const;

export const CSS_TOKENS_SUMMARY = `Design tokens: ${Object.entries(DESIGN_TOKENS).map(([category, group]) => `${category}: ${Object.keys(group).filter((name) => !name.startsWith('$')).join(', ')}`).join('. ')}.`;

export const TOKEN_PROPERTIES = [
    ['spacing', 'spacing', 'padding'],
    ['spacingInline', 'spacing', 'padding-inline'],
    ['spacingBlock', 'spacing', 'padding-block'],
    ['marginInline', 'spacing', 'margin-inline'],
    ['marginBlock', 'spacing', 'margin-block'],
    ['gap', 'spacing', 'gap'],
    ['surface', 'surface', 'background-color'],
    ['textColor', 'textColor', 'color'],
    ['typeface', 'typeface', 'font-family'],
    ['textSize', 'textSize', 'font-size'],
    ['fontWeight', 'fontWeight', 'font-weight'],
    ['lineHeight', 'lineHeight', 'line-height'],
    ['textAlign', 'textAlign', 'text-align'],
    ['elevation', 'elevation', 'box-shadow'],
    ['shape', 'shape', 'border-radius'],
    ['outline', 'outline', 'border'],
    ['outlineBottom', 'outline', 'border-bottom'],
    ['outlineTop', 'outline', 'border-top'],
    ['outlineRight', 'outline', 'border-right'],
    ['outlineLeft', 'outline', 'border-left'],
    ['direction', 'direction', 'flex-direction'],
    ['alignment', 'alignment', 'align-items'],
    ['distribution', 'distribution', 'justify-content'],
    ['wrap', 'wrap', 'flex-wrap'],
    ['division', 'division', 'grid-template-columns'],
    ['span', 'span', 'grid-column'],
    ['flex', 'flex', 'flex'],
    ['overflow', 'overflow', 'overflow'],
] as const satisfies readonly TokenProperty[];

export const DIMENSION_PROPERTIES = [
    ['width', 'width', '100vw'],
    ['height', 'height', '100vh'],
    ['maxWidth', 'max-width', '100vw'],
    ['minWidth', 'min-width', '100vw'],
    ['minHeight', 'min-height', '100vh'],
] as const satisfies readonly DimensionProperty[];

export const BASE_RULES = {
    'box-sizing': 'border-box',
} as const;

export const CONTAINER_RULES = {
    'box-sizing': 'border-box',
    display: 'block',
} as const;

export const MEDIA_RULES = {
    'max-width': '100%',
    height: 'auto',
    display: 'block',
} as const;

export const CONTROL_INHERITANCE_RULES = {
    font: 'inherit',
    'font-size': 'inherit',
    'font-family': 'inherit',
    'font-weight': 'inherit',
    'line-height': 'inherit',
    color: 'inherit',
    background: 'transparent',
    border: 'none',
    padding: '0',
    margin: '0',
    'text-decoration': 'none',
    width: '100%',
    height: '100%',
    outline: 'none',
    'box-sizing': 'border-box',
} as const;

export const HEADING_RULES = {
    margin: '0',
    font: 'inherit',
    'font-size': 'inherit',
    'font-weight': 'inherit',
    'line-height': 'inherit',
    color: 'inherit',
} as const;

export const SEPARATOR_RULES = {
    border: 'none',
    margin: '0',
    padding: '0',
    width: '100%',
    height: '100%',
    background: 'currentColor',
} as const;

export const PICTURE_RULES = {
    width: '100%',
    height: '100%',
    'object-fit': 'cover',
    display: 'block',
} as const;

export const UCA_ELEMENTS = [
    'ext-uca',
    'ext-uca-app',
    'ext-uca-layout',
    'ext-uca-view',
    'ext-uca-box',
    'ext-uca-heading',
    'ext-uca-paragraph',
    'ext-uca-picture',
    'ext-uca-action',
    'ext-uca-input',
    'ext-uca-separator',
    'ext-uca-progress',
    'ext-uca-list',
    '[id^="ext-uca"]',
    '[class*="ext-uca"]',
] as const;

export const UCA_ELEMENTS_SELECTOR = UCA_ELEMENTS.join(', ');

export const IDENTIFIED_DESCENDANT_SELECTOR = '[id]';

export const GRID_EXCLUDED_QUALITIES = [
    'direction',
    'wrap',
] as const;

export const formatDeclarations = (declarations: Record<string, string>): string =>
    Object.entries(declarations).map(([property, value]) => `${property}: ${value};`).join(' ');

export const BASE_STYLESHEET_RULES = [
    `*, *::before, *::after { ${formatDeclarations(BASE_RULES)} }`,
    'html, body { min-block-size: 100%; margin: 0; }',
    'body { min-block-size: 100vh; }',
    'h1, h2, h3, h4, h5, h6, p, ul, ol, menu, figure, blockquote { margin: 0; }',
    'ul, ol, menu { padding: 0; list-style: none; }',
    `${UCA_ELEMENTS_SELECTOR} { ${formatDeclarations(CONTAINER_RULES)} }`,
    `img, svg, video, canvas { ${formatDeclarations(MEDIA_RULES)} }`,
    `ext-uca-picture > img { ${formatDeclarations(PICTURE_RULES)} }`,
    `ext-uca-heading > :is(h1, h2, h3, h4, h5, h6) { ${formatDeclarations(HEADING_RULES)} }`,
    `ext-uca-separator > hr { ${formatDeclarations(SEPARATOR_RULES)} }`,
    `input, button, select, textarea, a { ${formatDeclarations(CONTROL_INHERITANCE_RULES)} }`,
] as const;

export const generateBaseRulesCss = (): string =>
    BASE_STYLESHEET_RULES.join(' ');

export const ACCESSIBLE_CONTROL_STATES = [
    { suffix: ':focus-visible', declarations: { outline: 'auto' } },
    { suffix: ':disabled', declarations: { cursor: 'not-allowed' } },
] as const;
export const CONTROL_STATE_RULES: Readonly<Record<ControlType, readonly StateRule[]>> = {
    [ControlType.INPUT]: ACCESSIBLE_CONTROL_STATES,
    [ControlType.ACTION]: ACCESSIBLE_CONTROL_STATES,
};

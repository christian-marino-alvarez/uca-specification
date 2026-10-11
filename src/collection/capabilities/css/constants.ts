export const __ID__ = 'css';

export const TOKENS_STYLE_ID = 'uca-tokens';

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
    typeface: {
        $type: 'fontFamily',
        sans: { $value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', $description: 'Clean sans-serif typeface' },
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
    elevation: {
        $type: 'shadow',
        none: { $value: 'none', $description: 'Flat surface without shadow' },
        low: { $value: '0 1px 2px rgba(0, 0, 0, 0.05)', $description: 'Subtle elevation shadow' },
        card: { $value: '0 1px 3px rgba(0, 0, 0, 0.1)', $description: 'Standard card elevation shadow' },
        modal: { $value: '0 10px 15px rgba(0, 0, 0, 0.1)', $description: 'Elevated overlay modal shadow' },
    },
    radius: {
        $type: 'dimension',
        none: { $value: '0', $description: 'Sharp corners' },
        small: { $value: '0.25rem', $description: 'Subtle rounded corners' },
        medium: { $value: '0.5rem', $description: 'Standard rounded corners' },
        large: { $value: '1rem', $description: 'Card rounded corners' },
        full: { $value: '9999px', $description: 'Fully rounded pill corners' },
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
} as const;

import type { StylesheetDesign } from '@uca/capability-css/types';

export const DESIGN: StylesheetDesign = {
    tokens: {
        dimensions: {
            auto: {
                $type: 'dimension',
                $value: 'auto',
                $description: 'Automatic intrinsic size',
            },
            full: {
                $type: 'dimension',
                $value: '100%',
                $description: 'Full container span',
            },
            half: {
                $type: 'dimension',
                $value: '50%',
                $description: 'Half container span',
            },
            third: {
                $type: 'dimension',
                $value: '33.333%',
                $description: 'One third container span',
            },
            'two-thirds': {
                $type: 'dimension',
                $value: '66.666%',
                $description: 'Two thirds container span',
            },
            quarter: {
                $type: 'dimension',
                $value: '25%',
                $description: 'One quarter container span',
            },
            'three-quarters': {
                $type: 'dimension',
                $value: '75%',
                $description: 'Three quarters container span',
            },
            narrow: {
                $type: 'dimension',
                $value: '64px',
                $description: 'Compact narrow span',
            },
            wide: {
                $type: 'dimension',
                $value: '80%',
                $description: 'Wide container span',
            },
            screen: {
                $type: 'dimension',
                $value: '100dvh',
                $description: 'Full dynamic viewport height',
            },
            content: {
                $type: 'dimension',
                $value: 'fit-content',
                $description: 'Fit the inner content',
            },
            small: {
                $type: 'dimension',
                $value: '2rem',
                $description: 'Small compact scale dimension',
            },
            medium: {
                $type: 'dimension',
                $value: '2.5rem',
                $description: 'Medium control scale dimension',
            },
            large: {
                $type: 'dimension',
                $value: '3.5rem',
                $description: 'Large section scale dimension',
            },
            xlarge: {
                $type: 'dimension',
                $value: '4rem',
                $description: 'Extra large hero scale dimension',
            },
            compact: {
                $type: 'dimension',
                $value: '260px',
                $description: 'Compact rail container span',
            },
            regular: {
                $type: 'dimension',
                $value: '320px',
                $description: 'Regular column container span',
            },
            sidebar: {
                $type: 'dimension',
                $value: '260px',
                $description: 'Alias for compact rail width',
            },
            header: {
                $type: 'dimension',
                $value: '3.5rem',
                $description: 'Alias for large section height',
            },
            footer: {
                $type: 'dimension',
                $value: '2.5rem',
                $description: 'Alias for medium scale height',
            },
        },
        control: {
            border: {
                $type: 'color',
                $value: 'rgba(226, 232, 240, 0.18)',
                $description: 'Control boundary',
            },
            'border-hover': {
                $type: 'color',
                $value: '#e2e8f0',
                $description: 'Hovered control boundary',
            },
            placeholder: {
                $type: 'color',
                $value: '#64748b',
                $description: 'Placeholder foreground',
            },
        },
        spacing: {
            none: {
                $type: 'dimension',
                $value: '0',
                $description: 'Zero spacing',
            },
            small: {
                $type: 'dimension',
                $value: '0.5rem',
                $description: 'Compact spacing',
            },
            medium: {
                $type: 'dimension',
                $value: '1rem',
                $description: 'Baseline spacing',
            },
            large: {
                $type: 'dimension',
                $value: '2rem',
                $description: 'Spacious section spacing',
            },
            xlarge: {
                $type: 'dimension',
                $value: 'clamp(3rem, 8vw, 7rem)',
                $description: 'Responsive section separation',
            },
        },
        surface: {
            transparent: {
                $type: 'color',
                $value: 'transparent',
                $description: 'Transparent surface',
            },
            default: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface, #070A12)',
                $description: 'Application background',
            },
            surface: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface, #070A12)',
                $description: 'M3 base surface',
            },
            surfaceContainer: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container, #111624)',
                $description: 'M3 surface container',
            },
            surfaceContainerLow: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container-low, #0d111c)',
                $description: 'M3 low surface container',
            },
            surfaceContainerHigh: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container-high, #1a2030)',
                $description: 'M3 high surface container',
            },
            surfaceContainerLowest: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container-lowest, #05070c)',
                $description: 'M3 lowest surface container',
            },
            surfaceContainerHighest: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container-highest, #232b3e)',
                $description: 'M3 highest surface container',
            },
            surfaceVariant: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-variant, #2a344a)',
                $description: 'M3 surface variant',
            },
            primary: {
                $type: 'color',
                $value: 'var(--md-sys-color-primary, #8ab4f8)',
                $description: 'M3 primary container color',
            },
            secondary: {
                $type: 'color',
                $value: 'var(--md-sys-color-secondary, #3c4043)',
                $description: 'M3 secondary container color',
            },
            tertiary: {
                $type: 'color',
                $value: 'var(--md-sys-color-tertiary, #80cbc4)',
                $description: 'M3 tertiary container color',
            },
            card: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container-high, #0d111c)',
                $description: 'Layered card surface',
            },
            muted: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container, #111624)',
                $description: 'Subtle secondary surface',
            },
            dark: {
                $type: 'color',
                $value: 'var(--md-sys-color-surface-container-lowest, #05070c)',
                $description: 'Deep contrast surface',
            },
            brand: {
                $type: 'color',
                $value: 'var(--md-sys-color-primary, #e2e8f0)',
                $description: 'Primary brand surface',
            },
            accent: {
                $type: 'color',
                $value: 'var(--md-sys-color-secondary, #cbd5e1)',
                $description: 'Secondary accent surface',
            },
            danger: {
                $type: 'color',
                $value: 'var(--md-sys-color-error, #94a3b8)',
                $description: 'Destructive warning surface',
            },
        },
        textColor: {
            light: {
                $type: 'color',
                $value: '#e2e8f0',
                $description: 'Primary foreground on dark surfaces',
            },
            dark: {
                $type: 'color',
                $value: '#070A12',
                $description: 'Primary foreground on light surfaces',
            },
            muted: {
                $type: 'color',
                $value: '#94a3b8',
                $description: 'Secondary readable foreground',
            },
            brand: {
                $type: 'color',
                $value: '#e2e8f0',
                $description: 'Brand foreground in blanco grisáceo',
            },
            accent: {
                $type: 'color',
                $value: '#cbd5e1',
                $description: 'Highlight foreground in blanco grisáceo',
            },
            danger: {
                $type: 'color',
                $value: '#e2e8f0',
                $description: 'Error foreground',
            },
        },
        typeface: {
            sans: {
                $type: 'fontFamily',
                $value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                $description: 'Primary interface typeface',
            },
            serif: {
                $type: 'fontFamily',
                $value: 'Georgia, Cambria, "Times New Roman", serif',
                $description: 'Editorial contrast typeface',
            },
            mono: {
                $type: 'fontFamily',
                $value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                $description: 'Technical code typeface',
            },
        },
        textSize: {
            small: {
                $type: 'dimension',
                $value: '0.875rem',
                $description: 'Secondary text',
            },
            medium: {
                $type: 'dimension',
                $value: '1rem',
                $description: 'Body text',
            },
            large: {
                $type: 'dimension',
                $value: '1.25rem',
                $description: 'Lead text',
            },
            title: {
                $type: 'dimension',
                $value: 'clamp(1.5rem, 3vw, 2.25rem)',
                $description: 'Section heading',
            },
            display: {
                $type: 'dimension',
                $value: 'clamp(3rem, 7vw, 6.5rem)',
                $description: 'Hero heading',
            },
        },
        fontWeight: {
            normal: {
                $type: 'fontWeight',
                $value: 400,
                $description: 'Regular weight',
            },
            medium: {
                $type: 'fontWeight',
                $value: 500,
                $description: 'Medium emphasis',
            },
            semibold: {
                $type: 'fontWeight',
                $value: 600,
                $description: 'Strong emphasis',
            },
            bold: {
                $type: 'fontWeight',
                $value: 700,
                $description: 'Maximum emphasis',
            },
        },
        lineHeight: {
            tight: {
                $type: 'number',
                $value: 1.15,
                $description: 'Compact heading line height',
            },
            normal: {
                $type: 'number',
                $value: 1.6,
                $description: 'Readable body line height',
            },
            relaxed: {
                $type: 'number',
                $value: 1.75,
                $description: 'Spacious explanatory line height',
            },
        },
        textAlign: {
            start: {
                $type: 'string',
                $value: 'start',
                $description: 'Writing direction start',
            },
            center: {
                $type: 'string',
                $value: 'center',
                $description: 'Centered text',
            },
            end: {
                $type: 'string',
                $value: 'end',
                $description: 'Writing direction end',
            },
            justify: {
                $type: 'string',
                $value: 'justify',
                $description: 'Distributed text',
            },
        },
        elevation: {
            none: {
                $type: 'shadow',
                $value: 'none',
                $description: 'Flat surface',
            },
            level0: {
                $type: 'shadow',
                $value: 'none',
                $description: 'M3 flat surface 0dp',
            },
            level1: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level1, 0 1px 3px 1px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30))',
                $description: 'M3 resting card elevation 1dp',
            },
            level2: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level2, 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.30))',
                $description: 'M3 navigation bar elevation 3dp',
            },
            level3: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level3, 0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.30))',
                $description: 'M3 dialog elevation 6dp',
            },
            level4: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level4, 0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.30))',
                $description: 'M3 floating sheet elevation 8dp',
            },
            level5: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level5, 0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px 0 rgba(0, 0, 0, 0.30))',
                $description: 'M3 top app bar elevation 12dp',
            },
            low: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level1, 0 8px 24px rgba(0, 0, 0, 0.16))',
                $description: 'Subtle elevation',
            },
            card: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level1, 0 24px 80px rgba(0, 0, 0, 0.28))',
                $description: 'Card elevation',
            },
            medium: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level2, 0 16px 48px rgba(0, 0, 0, 0.32))',
                $description: 'Floating elevation',
            },
            modal: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level3, 0 32px 96px rgba(0, 0, 0, 0.4))',
                $description: 'Overlay elevation',
            },
            high: {
                $type: 'shadow',
                $value: 'var(--md-sys-elevation-level4, 0 40px 120px rgba(0, 0, 0, 0.48))',
                $description: 'Maximum elevation',
            },
        },
        shape: {
            none: {
                $type: 'dimension',
                $value: '0',
                $description: 'Sharp corners',
            },
            extraSmall: {
                $type: 'dimension',
                $value: 'var(--md-sys-shape-corner-extra-small, 4px)',
                $description: 'M3 extra small shape 4px',
            },
            small: {
                $type: 'dimension',
                $value: 'var(--md-sys-shape-corner-small, 0.5rem)',
                $description: 'Small rounded corners',
            },
            medium: {
                $type: 'dimension',
                $value: 'var(--md-sys-shape-corner-medium, 1rem)',
                $description: 'Standard rounded corners',
            },
            large: {
                $type: 'dimension',
                $value: 'var(--md-sys-shape-corner-large, 1.5rem)',
                $description: 'Large card corners',
            },
            extraLarge: {
                $type: 'dimension',
                $value: 'var(--md-sys-shape-corner-extra-large, 28px)',
                $description: 'M3 extra large sheet shape 28px',
            },
            full: {
                $type: 'dimension',
                $value: 'var(--md-sys-shape-corner-full, 9999px)',
                $description: 'Pill corners',
            },
        },
        variant: {
            elevated: {
                $type: 'string',
                $value: 'elevated',
                $description: 'M3 elevated surface container variant',
            },
            filled: {
                $type: 'string',
                $value: 'filled',
                $description: 'M3 filled high-emphasis variant',
            },
            tonal: {
                $type: 'string',
                $value: 'tonal',
                $description: 'M3 filled tonal medium-emphasis variant',
            },
            outlined: {
                $type: 'string',
                $value: 'outlined',
                $description: 'M3 outlined bounded variant',
            },
            text: {
                $type: 'string',
                $value: 'text',
                $description: 'M3 text-only low-emphasis variant',
            },
        },
        outline: {
            none: {
                $type: 'border',
                $value: 'none',
                $description: 'No outline',
            },
            subtle: {
                $type: 'border',
                $value: '1px solid var(--md-sys-color-outline-variant, rgba(226, 232, 240, 0.12))',
                $description: 'M3 subtle outline variant',
            },
            strong: {
                $type: 'border',
                $value: '1px solid var(--md-sys-color-outline, rgba(226, 232, 240, 0.28))',
                $description: 'M3 prominent outline',
            },
            dashed: {
                $type: 'border',
                $value: '1px dashed var(--md-sys-color-outline-variant, rgba(226, 232, 240, 0.24))',
                $description: 'M3 dashed outline for placeholders',
            },
        },
        direction: {
            row: {
                $type: 'string',
                $value: 'row',
                $description: 'Horizontal flow',
            },
            column: {
                $type: 'string',
                $value: 'column',
                $description: 'Vertical flow',
            },
        },
        alignment: {
            start: {
                $type: 'string',
                $value: 'flex-start',
                $description: 'Align at start',
            },
            center: {
                $type: 'string',
                $value: 'center',
                $description: 'Center alignment',
            },
            end: {
                $type: 'string',
                $value: 'flex-end',
                $description: 'Align at end',
            },
            stretch: {
                $type: 'string',
                $value: 'stretch',
                $description: 'Stretch on cross axis',
            },
            between: {
                $type: 'string',
                $value: 'space-between',
                $description: 'Distribute available space',
            },
        },
        distribution: {
            start: {
                $type: 'string',
                $value: 'flex-start',
                $description: 'Group at start',
            },
            center: {
                $type: 'string',
                $value: 'center',
                $description: 'Group at center',
            },
            end: {
                $type: 'string',
                $value: 'flex-end',
                $description: 'Group at end',
            },
            between: {
                $type: 'string',
                $value: 'space-between',
                $description: 'Distribute between children',
            },
            around: {
                $type: 'string',
                $value: 'space-around',
                $description: 'Distribute around children',
            },
            evenly: {
                $type: 'string',
                $value: 'space-evenly',
                $description: 'Distribute evenly',
            },
        },
        wrap: {
            nowrap: {
                $type: 'string',
                $value: 'nowrap',
                $description: 'Single line flow',
            },
            wrap: {
                $type: 'string',
                $value: 'wrap',
                $description: 'Allow additional lines',
            },
            reverse: {
                $type: 'string',
                $value: 'wrap-reverse',
                $description: 'Reverse cross axis wrapping',
            },
        },
        duration: {
            immediate: {
                $type: 'duration',
                $value: '80ms',
                $description: 'Immediate feedback',
            },
            fast: {
                $type: 'duration',
                $value: '160ms',
                $description: 'Fast interaction',
            },
            normal: {
                $type: 'duration',
                $value: '280ms',
                $description: 'Standard transition',
            },
            deliberate: {
                $type: 'duration',
                $value: '480ms',
                $description: 'Structural transition',
            },
        },
        easing: {
            standard: {
                $type: 'cubicBezier',
                $value: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                $description: 'Standard movement curve',
            },
            enter: {
                $type: 'cubicBezier',
                $value: 'cubic-bezier(0.16, 1, 0.3, 1)',
                $description: 'Entrance curve',
            },
            exit: {
                $type: 'cubicBezier',
                $value: 'cubic-bezier(0.7, 0, 0.84, 0)',
                $description: 'Exit curve',
            },
        },
        breakpoint: {
            compact: {
                $type: 'dimension',
                $value: '480px',
                $description: 'Compact viewport breakpoint',
            },
            tablet: {
                $type: 'dimension',
                $value: '768px',
                $description: 'Tablet viewport breakpoint',
            },
            desktop: {
                $type: 'dimension',
                $value: '1200px',
                $description: 'Desktop viewport breakpoint',
            },
            wide: {
                $type: 'dimension',
                $value: '1440px',
                $description: 'Wide viewport breakpoint',
            },
        },
    },
    modes: {
        reducedMotion: {
            duration: {
                immediate: {
                    $type: 'duration',
                    $value: '0.01ms',
                    $description: 'Reduced immediate feedback',
                },
                fast: {
                    $type: 'duration',
                    $value: '0.01ms',
                    $description: 'Reduced fast transition',
                },
                normal: {
                    $type: 'duration',
                    $value: '0.01ms',
                    $description: 'Reduced standard transition',
                },
                deliberate: {
                    $type: 'duration',
                    $value: '0.01ms',
                    $description: 'Reduced structural transition',
                },
            },
        },
    },
    rules: {
        '*, *::before, *::after': {
            'box-sizing': 'border-box',
        },
        ':root': {
            'color-scheme': 'dark light',
            'font-family': 'var(--uca-typeface-sans)',
            color: 'var(--uca-textColor-light)',
            'background-color': 'var(--uca-surface-default)',
            'font-synthesis': 'none',
            'text-rendering': 'optimizeLegibility',
        },
        'html': {
            'min-width': '320px',
            height: '100%',
            'background-color': 'var(--uca-surface-default)',
        },
        'body': {
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh',
            'min-width': '320px',
            'box-sizing': 'border-box',
            display: 'flex',
            'flex-direction': 'column',
            overflow: 'hidden',
            color: 'var(--uca-textColor-light)',
            'background-color': 'var(--uca-surface-default)',
        },
        'ext-uca': {
            display: 'flex',
            'box-sizing': 'border-box',
            'min-width': '0',
            'min-height': '0',
        },
        'img': {
            'max-width': '100%',
            'max-height': '100%',
            height: 'auto',
            'object-fit': 'contain',
        },
        ':focus-visible': {
            outline: '2px solid var(--uca-textColor-brand, #e2e8f0)',
            'outline-offset': '3px',
        },
        '::selection': {
            color: 'var(--uca-surface-default, #070A12)',
            'background-color': 'var(--uca-textColor-brand, #e2e8f0)',
        },
    },
};

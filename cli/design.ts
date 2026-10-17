import type { StylesheetDesign } from '@uca/capability-css/types';

export const BRAND = {
    src: '/assets/uca-logo.svg',
    maximumWidth: 'min(100%, 18rem, 55vw)',
    maximumHeight: 'min(4.8rem, 14svh)',
} as const;

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
        },
        control: {
            border: {
                $type: 'color',
                $value: 'rgba(174, 196, 230, 0.28)',
                $description: 'Control boundary',
            },
            'border-hover': {
                $type: 'color',
                $value: 'rgba(240, 165, 106, 0.72)',
                $description: 'Hovered control boundary',
            },
            placeholder: {
                $type: 'color',
                $value: '#7F8BA3',
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
                $value: '#070A12',
                $description: 'Application background',
            },
            card: {
                $type: 'color',
                $value: '#121A2B',
                $description: 'Layered card surface',
            },
            muted: {
                $type: 'color',
                $value: '#0D1220',
                $description: 'Subtle secondary surface',
            },
            dark: {
                $type: 'color',
                $value: '#05070D',
                $description: 'Deep contrast surface',
            },
            brand: {
                $type: 'color',
                $value: '#D97745',
                $description: 'Primary brand surface',
            },
            accent: {
                $type: 'color',
                $value: '#E8C66A',
                $description: 'Secondary accent surface',
            },
            danger: {
                $type: 'color',
                $value: '#FF7A90',
                $description: 'Destructive warning surface',
            },
        },
        tone: {
            brand: {
                $type: 'color',
                $value: '#D97745',
                $description: 'Primary accent color',
            },
            surface: {
                $type: 'color',
                $value: '#121A2B',
                $description: 'Default content surface',
            },
            muted: {
                $type: 'color',
                $value: '#0D1220',
                $description: 'Muted surface tone',
            },
            dark: {
                $type: 'color',
                $value: '#05070D',
                $description: 'Deep background tone',
            },
            accent: {
                $type: 'color',
                $value: '#E8C66A',
                $description: 'Secondary accent color',
            },
            danger: {
                $type: 'color',
                $value: '#FF7A90',
                $description: 'Destructive warning color',
            },
        },
        textColor: {
            light: {
                $type: 'color',
                $value: '#F7F9FC',
                $description: 'Primary foreground on dark surfaces',
            },
            dark: {
                $type: 'color',
                $value: '#101828',
                $description: 'Primary foreground on light surfaces',
            },
            muted: {
                $type: 'color',
                $value: '#AAB5C8',
                $description: 'Secondary readable foreground',
            },
            brand: {
                $type: 'color',
                $value: '#F0A56A',
                $description: 'Brand foreground',
            },
            accent: {
                $type: 'color',
                $value: '#F3D982',
                $description: 'Highlight foreground',
            },
            danger: {
                $type: 'color',
                $value: '#FF7A90',
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
            low: {
                $type: 'shadow',
                $value: '0 8px 24px rgba(0, 0, 0, 0.16)',
                $description: 'Subtle elevation',
            },
            card: {
                $type: 'shadow',
                $value: '0 24px 80px rgba(0, 0, 0, 0.28)',
                $description: 'Card elevation',
            },
            medium: {
                $type: 'shadow',
                $value: '0 16px 48px rgba(0, 0, 0, 0.32)',
                $description: 'Floating elevation',
            },
            modal: {
                $type: 'shadow',
                $value: '0 32px 96px rgba(0, 0, 0, 0.4)',
                $description: 'Overlay elevation',
            },
            high: {
                $type: 'shadow',
                $value: '0 40px 120px rgba(0, 0, 0, 0.48)',
                $description: 'Maximum elevation',
            },
        },
        radius: {
            none: {
                $type: 'dimension',
                $value: '0',
                $description: 'Sharp corners',
            },
            small: {
                $type: 'dimension',
                $value: '0.5rem',
                $description: 'Small rounded corners',
            },
            medium: {
                $type: 'dimension',
                $value: '1rem',
                $description: 'Standard rounded corners',
            },
            large: {
                $type: 'dimension',
                $value: '1.5rem',
                $description: 'Large card corners',
            },
            full: {
                $type: 'dimension',
                $value: '9999px',
                $description: 'Pill corners',
            },
        },
        border: {
            none: {
                $type: 'border',
                $value: 'none',
                $description: 'No border',
            },
            subtle: {
                $type: 'border',
                $value: '1px solid rgba(174, 196, 230, 0.18)',
                $description: 'Subtle surface boundary',
            },
            strong: {
                $type: 'border',
                $value: '1px solid rgba(174, 196, 230, 0.36)',
                $description: 'Visible surface boundary',
            },
            outline: {
                $type: 'border',
                $value: '1px dashed rgba(174, 196, 230, 0.42)',
                $description: 'Structural placeholder boundary',
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
        light: {
            surface: {
                default: {
                    $type: 'color',
                    $value: '#F5F7FB',
                    $description: 'Light application background',
                },
                card: {
                    $type: 'color',
                    $value: '#FFFFFF',
                    $description: 'Light card surface',
                },
                muted: {
                    $type: 'color',
                    $value: '#EAF0F8',
                    $description: 'Light muted surface',
                },
            },
            textColor: {
                light: {
                    $type: 'color',
                    $value: '#101828',
                    $description: 'Primary light-theme foreground',
                },
                muted: {
                    $type: 'color',
                    $value: '#526079',
                    $description: 'Secondary light-theme foreground',
                },
            },
        },
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
            'background-color': 'var(--uca-surface-default)',
            'scroll-behavior': 'smooth',
        },
        'body': {
            margin: 0,
            'min-width': '320px',
            'min-height': '100dvh',
            'overflow-x': 'hidden',
            color: 'var(--uca-textColor-light)',
            'background-color': 'var(--uca-surface-default)',
        },
        '#app': {
            isolation: 'isolate',
            display: 'flex',
            'min-height': '100dvh',
            padding: 'clamp(1.5rem, 5vw, 4rem)',
            'align-items': 'center',
            'justify-content': 'center',
            'flex-direction': 'column',
            gap: 'var(--uca-spacing-medium)',
            background: 'radial-gradient(circle at 73% 22%, color-mix(in srgb, var(--uca-tone-accent) 14%, transparent), transparent 28rem), linear-gradient(rgba(240, 165, 106, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 165, 106, 0.035) 1px, transparent 1px), var(--uca-surface-default)',
            'background-size': 'auto, 5rem 5rem, 5rem 5rem, auto',
        },
        '#app > ext-uca': {
            width: 'min(46rem, 100%)',
            height: 'auto !important',
            color: 'var(--uca-textColor-light)',
            'font-size': 'var(--uca-textSize-title)',
            'font-weight': 'var(--uca-fontWeight-semibold)',
            'line-height': 'var(--uca-lineHeight-tight)',
            'text-align': 'center',
        },
        '#app > ext-uca:has(input)': {
            display: 'flex',
            'flex-direction': 'row',
            'align-items': 'center',
            width: 'min(46rem, 100%)',
            padding: 'var(--uca-spacing-small)',
            gap: 'var(--uca-spacing-small)',
            background: 'color-mix(in srgb, var(--uca-surface-card) 92%, transparent)',
            border: 'var(--uca-border-subtle)',
            'border-radius': 'var(--uca-radius-large)',
            'box-shadow': 'var(--uca-elevation-card)',
            'backdrop-filter': 'blur(1rem)',
            'text-align': 'left',
            'font-size': 'var(--uca-textSize-medium)',
            'font-weight': 'var(--uca-fontWeight-regular)',
        },
        '#app ext-uca input': {
            flex: '1 1 auto',
            width: '100% !important',
            'min-width': '0',
            background: 'transparent',
            border: '0',
            'box-shadow': 'none',
            'font-size': 'var(--uca-textSize-medium)',
            'font-weight': 'var(--uca-fontWeight-regular)',
            'line-height': 'var(--uca-lineHeight-normal)',
            'text-align': 'left',
            padding: '0.8rem 1rem',
            outline: 'none',
        },
        '#app ext-uca button': {
            'flex-shrink': '0',
            'margin-left': 'auto',
            'white-space': 'nowrap',
        },
        '#app > form:empty': {
            display: 'none',
        },
        '#app, #app *': {
            'min-width': '0',
        },
        '#app img': {
            'max-width': '100%',
            height: 'auto',
            'object-fit': 'contain',
        },
        [`#app img[src="${BRAND.src}"], #app img[src$="${BRAND.src}"]`]: {
            'max-width': `${BRAND.maximumWidth} !important`,
            'max-height': `${BRAND.maximumHeight} !important`,
            'min-width': '0 !important',
            'min-height': '0 !important',
            height: 'auto !important',
            'object-fit': 'contain',
            'object-position': 'center',
        },
        '#app form': {
            display: 'flex',
            width: 'min(46rem, 100%)',
            padding: 'var(--uca-spacing-small)',
            gap: 'var(--uca-spacing-small)',
            'align-items': 'center',
            background: 'color-mix(in srgb, var(--uca-surface-card) 92%, transparent)',
            border: 'var(--uca-border-subtle)',
            'border-radius': 'var(--uca-radius-large)',
            'box-shadow': 'var(--uca-elevation-card)',
            'backdrop-filter': 'blur(1rem)',
        },
        '#app input, #app select, #app textarea': {
            font: 'inherit',
            'font-size': 'var(--uca-textSize-medium)',
            'font-weight': 'var(--uca-fontWeight-regular)',
            width: 'min(46rem, 100%) !important',
            padding: '1rem 1.2rem',
            color: 'var(--uca-textColor-light)',
            background: 'color-mix(in srgb, var(--uca-surface-card) 90%, transparent)',
            border: 'var(--uca-border-subtle)',
            'border-radius': 'var(--uca-radius-medium)',
            'box-shadow': 'var(--uca-elevation-low)',
            transition: 'border-color var(--uca-duration-fast) var(--uca-easing-standard), box-shadow var(--uca-duration-fast) var(--uca-easing-standard)',
        },
        '#app input::placeholder, #app textarea::placeholder': {
            color: 'var(--uca-control-placeholder)',
        },
        '#app input:hover, #app select:hover, #app textarea:hover': {
            'border-color': 'var(--uca-control-border-hover)',
        },
        '#app button': {
            display: 'inline-flex',
            width: 'auto !important',
            padding: '0.95rem 1.35rem',
            gap: '2rem',
            'align-items': 'center',
            'justify-content': 'space-between',
            color: 'var(--uca-surface-default)',
            background: 'var(--uca-textColor-brand)',
            border: 0,
            'border-radius': 'var(--uca-radius-small)',
            'font-size': 'var(--uca-textSize-small)',
            'font-weight': 'var(--uca-fontWeight-semibold)',
            cursor: 'pointer',
            transition: 'transform var(--uca-duration-fast) var(--uca-easing-standard)',
        },
        '#app button:hover': {
            transform: 'translateY(-2px)',
        },
        ':focus-visible': {
            outline: '2px solid #F8D66D',
            'outline-offset': '3px',
        },
        '::selection': {
            color: '#070A12',
            'background-color': '#F0A56A',
        },
    },
};

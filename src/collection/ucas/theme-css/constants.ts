import { SignalType as MaterialSignalType } from '@uca/capability-material/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { SignalType, type CssRule } from './types.js';

export const __ID__ = 'theme-css';

export const DEFAULT_PURPOSE =
    'Conceive and emit reusable OOCSS theme rules and tokens satisfying an application purpose';

export const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

export const DEFAULT_PROVIDER = 'gemini';

export const BASE_THEME_RULES: readonly CssRule[] = [
    {
        selector: '*, *::before, *::after',
        declarations: {
            'box-sizing': 'border-box',
            margin: '0',
            padding: '0',
        },
    },
    {
        selector: ':root',
        declarations: {
            '--font-family': "'Inter', system-ui, -apple-system, sans-serif",
            '--font-heading': "'Outfit', 'Inter', sans-serif",
            '--font-mono': "'JetBrains Mono', monospace",
            '--font-size-sm': '0.875rem',
            '--font-size-base': '1rem',
            '--font-size-lg': '1.125rem',
            '--font-size-xl': '1.25rem',
            '--font-size-2xl': '1.5rem',
            '--font-size-3xl': '2rem',
            '--line-height-base': '1.6',
            '--line-height-heading': '1.2',
            '--letter-spacing-tight': '-0.025em',
            '--color-bg': '#0a0f1d',
            '--color-surface': '#131c31',
            '--color-surface-hover': '#1e293b',
            '--color-primary': '#38bdf8',
            '--color-text': '#f8fafc',
            '--color-text-muted': '#94a3b8',
            '--color-border': '#1e293b',
            '--radius-md': '10px',
            '--radius-lg': '16px',
        },
    },
    {
        selector: 'body',
        declarations: {
            'font-family': 'var(--font-family)',
            'font-size': 'var(--font-size-base)',
            'line-height': 'var(--line-height-base)',
            color: 'var(--color-text)',
            'background-color': 'var(--color-bg)',
            '-webkit-font-smoothing': 'antialiased',
        },
    },
    {
        selector: 'h1, h2, h3, h4, h5, h6',
        declarations: {
            'font-family': 'var(--font-heading)',
            'line-height': 'var(--line-height-heading)',
            'letter-spacing': 'var(--letter-spacing-tight)',
            'font-weight': '700',
        },
    },
] as const;

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.CREATE,
    SignalType.DESTROY,
    WebLlmSignalType.STREAMED,
    WebLlmSignalType.ERROR,
    MaterialSignalType.APPLIED,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

import type { CssRule } from '@uca/capability-css';
import type { Disposition } from '@uca/core/types';

function buildRootRule(): CssRule {
    const declarations = {
        '--bg-primary': '#090d16',
        '--bg-surface': 'rgba(18, 24, 38, 0.75)',
        '--bg-surface-elevated': 'rgba(30, 41, 59, 0.9)',
        '--border-subtle': 'rgba(56, 189, 248, 0.2)',
        '--text-primary': '#f8fafc',
        '--text-secondary': '#94a3b8',
        '--accent-cyan': '#38bdf8',
        '--accent-indigo': '#818cf8',
        '--accent-emerald': '#10b981',
        '--font-sans': "'Inter', system-ui, -apple-system, sans-serif",
        '--font-mono': "'JetBrains Mono', 'Fira Code', monospace",
    };
    return { selector: ':root', declarations };
}

function buildBodyRule(): CssRule {
    const declarations = {
        'margin': '0',
        'min-height': '100vh',
        'display': 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        'justify-content': 'center',
        'background': '#090d16',
        'color': '#f8fafc',
        'font-family': "var(--font-sans, 'Inter', sans-serif)",
        'padding': '2.5rem 1.5rem',
    };
    return { selector: 'body', declarations };
}

export function generateThemeRules(): readonly CssRule[] {
    const rootRule = buildRootRule();
    const bodyRule = buildBodyRule();
    const hiddenRule = { selector: '[hidden]', declarations: { 'display': 'none !important' } };
    const loadingRule = { selector: '.loading', declarations: { 'animation': 'pulseGlow 1.8s ease-in-out infinite' } };
    return [rootRule, bodyRule, hiddenRule, loadingRule];
}

function buildBoxDeclarations(name?: string): Record<string, string> {
    if (name?.includes('center') || name?.includes('title') || name?.includes('hero') || name?.includes('header')) {
        return {
            'font-size': '2.2rem', 'font-weight': '800', 'letter-spacing': '-0.025em', 'margin-bottom': '1.5rem',
            'background': 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
            '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent',
            'display': 'block', 'transition': 'all 0.3s ease',
        };
    }
    return {
        'display': 'block', 'max-width': '880px', 'width': '100%', 'margin-top': '1.8rem',
        'padding': '2.2rem 2.6rem', 'background': 'rgba(18, 24, 38, 0.75)',
        'border': '1px solid rgba(56, 189, 248, 0.25)', 'border-radius': '20px',
        'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.6)', 'text-align': 'left',
        'line-height': '1.85', 'color': '#e2e8f0', 'font-family': 'var(--font-sans)',
    };
}

function buildActionDeclarations(): Record<string, string> {
    return {
        'display': 'inline-block', 'margin-top': '1.5rem', 'padding': '0.9rem 2.2rem',
        'font-size': '1rem', 'font-weight': '600', 'color': '#ffffff',
        'background': 'linear-gradient(135deg, #0284c7, #6366f1)',
        'border': '1px solid rgba(255, 255, 255, 0.15)', 'border-radius': '9999px',
        'cursor': 'pointer', 'box-shadow': '0 12px 28px -5px rgba(2, 132, 199, 0.45)',
        'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 'user-select': 'none',
    };
}

function buildListDeclarations(): Record<string, string> {
    return {
        'display': 'block', 'max-width': '880px', 'width': '100%', 'margin-top': '1.5rem',
        'padding': '2rem 2.5rem', 'background': 'rgba(15, 23, 42, 0.85)',
        'border': '1px solid rgba(129, 140, 248, 0.25)', 'border-radius': '20px',
        'box-shadow': '0 20px 40px -15px rgba(0, 0, 0, 0.5)', 'text-align': 'left',
        'line-height': '1.9', 'color': '#cbd5e1',
    };
}

function buildToggleDeclarations(): Record<string, string> {
    return {
        'display': 'inline-block', 'margin-top': '1rem', 'padding': '0.6rem 1.5rem',
        'font-size': '0.95rem', 'font-weight': '500', 'font-family': 'var(--font-mono)',
        'color': '#34d399', 'background': 'rgba(16, 185, 129, 0.12)',
        'border': '1px solid rgba(16, 185, 129, 0.35)', 'border-radius': '9999px',
        'cursor': 'pointer',
    };
}

function buildPictureDeclarations(): Record<string, string> {
    return {
        'display': 'block', 'max-width': '100%', 'width': 'auto', 'margin': '1.8rem auto',
        'border-radius': '16px', 'border': '1px solid rgba(56, 189, 248, 0.2)',
        'box-shadow': '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
    };
}

function buildInputDeclarations(): Record<string, string> {
    return {
        'display': 'block', 'max-width': '640px', 'width': '100%', 'margin-top': '1.2rem',
        'padding': '0.9rem 1.4rem', 'font-size': '1rem', 'color': '#f8fafc',
        'background': 'rgba(15, 23, 42, 0.85)', 'border': '1px solid rgba(56, 189, 248, 0.3)',
        'border-radius': '12px', 'box-shadow': '0 8px 20px -4px rgba(0, 0, 0, 0.4)',
    };
}

function buildDropdownDeclarations(): Record<string, string> {
    return {
        'display': 'block', 'max-width': '400px', 'width': '100%', 'margin-top': '1rem',
        'padding': '0.8rem 1.2rem', 'font-size': '0.95rem', 'color': '#f8fafc',
        'background': 'rgba(15, 23, 42, 0.85)', 'border': '1px solid rgba(129, 140, 248, 0.3)',
        'border-radius': '12px',
    };
}

function buildChoiceDeclarations(): Record<string, string> {
    return {
        'display': 'flex', 'gap': '0.8rem', 'flex-wrap': 'wrap', 'margin-top': '1rem',
        'padding': '0.5rem 0',
    };
}

function resolveDeclarationsByPrefix(prefix: string, name?: string): Record<string, string> {
    switch (prefix) {
        case 'box': return buildBoxDeclarations(name);
        case 'action': return buildActionDeclarations();
        case 'list': return buildListDeclarations();
        case 'toggle': return buildToggleDeclarations();
        case 'picture': return buildPictureDeclarations();
        case 'input': return buildInputDeclarations();
        case 'dropdown': return buildDropdownDeclarations();
        case 'choice': return buildChoiceDeclarations();
        default: return { 'display': 'block', 'padding': '1rem' };
    }
}

export function generateUcaRules(id: string, _disposition?: Disposition): readonly CssRule[] {
    const [prefix, name] = id.includes(':') ? id.split(':') : [id, id];
    const declarations = resolveDeclarationsByPrefix(prefix, name);
    const selector = name ? `ext-${prefix}#${name}` : `ext-${prefix}`;
    const rule: CssRule = { selector, declarations };
    return [rule];
}

export function buildThemePrompt(purpose?: string): string {
    const appPurpose = purpose ?? 'Developer didactic architecture exploration';
    return `You are a principal frontend designer creating a minimalist, premium web theme for developers.
Purpose: "${appPurpose}".
Respond with strict JSON containing CSS rules:
{ "rules": [
  { "selector": ":root", "declarations": { "--bg-primary": "#090d16", "--text-primary": "#f8fafc", "--accent-cyan": "#38bdf8" } },
  { "selector": "body", "declarations": { "background": "#090d16", "color": "#f8fafc" } }
] }`;
}

export function buildUcaPrompt(id: string, description?: string): string {
    const descText = description ? ` for purpose: ${description}` : '';
    const [prefix, name] = id.includes(':') ? id.split(':') : [id, id];
    const selector = name ? `ext-${prefix}#${name}` : `ext-${prefix}`;
    return `Generate minimalist developer CSS for component '${id}'${descText}.
Respond strictly with JSON: { "rules": [{ "selector": "${selector}", "declarations": { "display": "block" } }] }`;
}

export function parseCssRulesFromResponse(response: string): readonly CssRule[] {
    try {
        const clean = response.replace(/^```json\s*|^```\s*|```$/gm, '').trim();
        const parsed = JSON.parse(clean) as { selector?: string; declarations?: Record<string, string>; rules?: CssRule[] };
        if (parsed.rules && Array.isArray(parsed.rules)) { return parsed.rules; }
        if (parsed.selector && parsed.declarations) {
            return [{ selector: parsed.selector, declarations: parsed.declarations }];
        }
    } catch {}
    return [];
}

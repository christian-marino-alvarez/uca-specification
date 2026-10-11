import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    DESIGN_TOKENS,
    STYLE_PREFIX,
    TOKENS_STYLE_ID,
} from './constants.js';
import {
    type ApplyPayload,
    type Body,
    type Qualities,
    type RemovePayload,
    type ResolvePayload,
    type ThemePayload,
    DataType,
    SignalType,
} from './types.js';

export class Css extends Capability<Body> {
    public static readonly AIM: string = 'Apply a modular CSS stylesheet architecture based on W3C Design Tokens (DTCG), injecting root token definitions and scoped atomic style rules for autonomous elements';

    public static override disposition: Disposition<Body> = {
        aim: { description: Css.AIM },
        reactTo: [
            SignalType.APPLY,
            SignalType.RESOLVE,
            SignalType.THEME,
            SignalType.REMOVE,
        ],
        inputs: [
            { signal: SignalType.APPLY, type: DataType.APPLY_PAYLOAD, description: 'Apply autonomous qualities for element' },
            { signal: SignalType.RESOLVE, type: DataType.RESOLVE_PAYLOAD, description: 'Resolve domain qualities to CSS declarations' },
            { signal: SignalType.THEME, type: DataType.THEME_PAYLOAD, description: 'Update design tokens theme' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Remove element style rule' },
        ],
        outputs: [
            { signal: SignalType.APPLIED, type: DataType.APPLIED_RESULT, description: 'Style rule applied confirmation' },
            { signal: SignalType.RESOLVED, type: DataType.RESOLVED_RESULT, description: 'Qualities resolved with css declarations' },
            { signal: SignalType.THEMED, type: DataType.THEMED_RESULT, description: 'Design tokens theme updated confirmation' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Style rule removed confirmation' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'CSS operation error notification' },
        ],
    };

    public static translateQualities(qualities: Qualities): Record<string, string> {
        const { width, height, spacing, surface, tone, typeface, textSize, elevation, radius, direction, alignment, custom } = qualities;
        return {
            ...Css.resolveDimensions(width, height),
            ...Css.resolveVisuals(spacing, surface, tone, elevation, radius),
            ...Css.resolveTypography(typeface, textSize),
            ...Css.resolveLayout(direction, alignment),
            ...(custom ?? {}),
        };
    }

    public static formatSelector(elementId: string): string {
        return elementId.includes(':') ? `[id="${elementId}"]` : `#${elementId}`;
    }

    public static formatCssRule(selector: string, declarations: Record<string, string>): string {
        const rules = Object.entries(declarations).map(([k, v]) => `${k}: ${v};`).join(' ');
        return `${selector} { ${rules} }`;
    }

    public static generateTokensCss(tokens: Record<string, Record<string, unknown>>): string {
        const lines: string[] = [];
        for (const [category, group] of Object.entries(tokens)) {
            for (const [name, token] of Object.entries(group)) {
                if (name.startsWith('$')) { continue; }
                const val = typeof token === 'object' && token && '$value' in token ? (token as { $value: string }).$value : token;
                lines.push(`--uca-${category}-${name}: ${val};`);
            }
        }
        const mediaRules = '@media (max-width: 768px) { #app { flex-direction: column !important; flex-wrap: nowrap !important; overflow-y: auto !important; height: 100vh !important; } ext-uca { width: 100% !important; flex-basis: auto !important; flex-grow: 0 !important; flex-shrink: 0 !important; height: auto !important; min-height: 80px !important; } }';
        const baseRules = `body { margin: 0; padding: 0; background: #0a0d14; color: #e2e8f0; font-family: var(--uca-typeface-sans, system-ui, sans-serif); height: 100vh; overflow: hidden; } #app { width: 100vw; height: 100vh; display: flex; flex-direction: row; flex-wrap: wrap; background: #0a0d14; overflow: hidden; } ext-uca { display: block; box-sizing: border-box; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); background: #0e121a; } ${mediaRules}`;
        return `:root { ${lines.join(' ')} } ${baseRules}`;
    }

    private static resolveTokenValue(group: Record<string, unknown>, key?: string): string | undefined {
        if (!key) { return undefined; }
        const entry = group[key] as { $value?: string } | string | undefined;
        return typeof entry === 'object' && entry ? entry.$value ?? key : entry ?? key;
    }

    private static resolvePanelHeight(width?: string, height?: string, fallback?: string): string | undefined {
        const isPanel = height === 'full' || height === 'screen' || (width === 'auto' && (!height || height === 'auto'));
        return isPanel ? 'calc(100vh - 32px)' : fallback;
    }

    private static resolveDimensions(width?: string, height?: string): Record<string, string> {
        const resolvedWidth = Css.resolveTokenValue(DESIGN_TOKENS.dimensions, width);
        const resolvedHeight = Css.resolveTokenValue(DESIGN_TOKENS.dimensions, height);
        const panelHeight = Css.resolvePanelHeight(width, height, resolvedHeight);
        const isFlexGrow = width === 'auto' || width === 'two-thirds' || width === 'wide' || (width === 'full' && height === 'full');
        return {
            ...(resolvedWidth && { width: resolvedWidth, 'flex-basis': width === 'auto' ? '0' : resolvedWidth }),
            ...(panelHeight && { height: panelHeight }),
            ...(width === 'narrow' && { 'flex-shrink': '0', 'flex-grow': '0' }),
            ...(isFlexGrow && { 'flex-grow': '1', 'flex-shrink': '1', 'min-width': '0' }),
            ...(width === 'full' && height !== 'full' && { 'flex-grow': '0', 'flex-shrink': '0', 'min-height': '32px' }),
        };
    }

    private static resolveVisuals(spacing?: string, surface?: string, tone?: string, elevation?: string, radius?: string): Record<string, string> {
        const pad = Css.resolveTokenValue(DESIGN_TOKENS.spacing, spacing);
        const bg = Css.resolveTokenValue(DESIGN_TOKENS.surface, surface) ?? Css.resolveTokenValue(DESIGN_TOKENS.tone, tone);
        const shadow = Css.resolveTokenValue(DESIGN_TOKENS.elevation, elevation);
        const rad = Css.resolveTokenValue(DESIGN_TOKENS.radius, radius);
        return {
            ...(pad && { padding: pad }),
            ...(bg && { 'background-color': bg }),
            ...(shadow && { 'box-shadow': shadow }),
            ...(rad && { 'border-radius': rad }),
        };
    }

    private static resolveTypography(typeface?: string, textSize?: string): Record<string, string> {
        const font = Css.resolveTokenValue(DESIGN_TOKENS.typeface, typeface);
        const size = Css.resolveTokenValue(DESIGN_TOKENS.textSize, textSize);
        return {
            ...(font && { 'font-family': font }),
            ...(size && { 'font-size': size }),
        };
    }

    private static resolveLayout(direction?: string, alignment?: string): Record<string, string> {
        const dir = Css.resolveTokenValue(DESIGN_TOKENS.direction, direction);
        const align = Css.resolveTokenValue(DESIGN_TOKENS.alignment, alignment);
        return {
            ...(dir && { 'flex-direction': dir }),
            ...(align && { 'align-items': align }),
        };
    }

    private static mountStyleElement(id: string, cssText: string): void {
        if (typeof document === 'undefined') { return; }
        const head = document.head ?? document.documentElement;
        let style = document.getElementById(id) as HTMLStyleElement | null;
        if (!style) {
            style = document.createElement('style');
            style.id = id;
            head.appendChild(style);
        }
        style.textContent = cssText;
    }

    private static removeStyleElement(id: string): void {
        if (typeof document === 'undefined') { return; }
        document.getElementById(id)?.remove();
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        const { aim } = this.disposition;
        const tokens = aim.body?.tokens ?? DESIGN_TOKENS;
        Css.mountStyleElement(TOKENS_STYLE_ID, Css.generateTokensCss(tokens));
        this.pulse(SignalType.THEMED, { updated: true });
    }

    public override denervate(): void {
        Css.removeStyleElement(TOKENS_STYLE_ID);
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.APPLY:
                this.handleApply(value);
                break;
            case SignalType.RESOLVE:
                this.handleResolve(value);
                break;
            case SignalType.THEME:
                this.handleTheme(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            default:
                break;
        }
    }

    private handleApply(value?: unknown): void {
        const { elementId, qualities } = (value ?? {}) as ApplyPayload;
        if (!elementId || !qualities) { return; }
        const declarations = Css.translateQualities(qualities);
        const selector = Css.formatSelector(elementId);
        const cssText = Css.formatCssRule(selector, declarations);
        Css.mountStyleElement(`${STYLE_PREFIX}${elementId}`, cssText);
        this.pulse(SignalType.APPLIED, { elementId, declarations });
    }

    private handleResolve(value?: unknown): void {
        const { elementId, qualities } = (value ?? {}) as ResolvePayload;
        if (!qualities) { return; }
        const declarations = Css.translateQualities(qualities);
        const selector = elementId ? Css.formatSelector(elementId) : ':root';
        const cssText = Css.formatCssRule(selector, declarations);
        this.pulse(SignalType.RESOLVED, { elementId, declarations, cssText });
    }

    private handleTheme(value?: unknown): void {
        const { tokens } = (value ?? {}) as ThemePayload;
        if (!tokens) { return; }
        const cssText = Css.generateTokensCss(tokens);
        Css.mountStyleElement(TOKENS_STYLE_ID, cssText);
        this.pulse(SignalType.THEMED, { updated: true });
    }

    private handleRemove(value?: unknown): void {
        const { elementId } = (value ?? {}) as RemovePayload;
        if (!elementId) { return; }
        Css.removeStyleElement(`${STYLE_PREFIX}${elementId}`);
        this.pulse(SignalType.REMOVED, { elementId, removed: true });
    }
}

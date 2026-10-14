import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    CSS_TOKENS_SUMMARY,
    DESIGN_TOKENS,
    STYLE_PREFIX,
    TOKENS_STYLE_ID,
    generateBaseRulesCss,
} from './constants.js';
import {
    type ApplyPayload,
    type Body,
    type MountPayload,
    type Qualities,
    type RemovePayload,
    type ResolvePayload,
    type SchemaPayload,
    type ThemePayload,
    DataType,
    SignalType,
} from './types.js';

export class Css extends Capability<Body> {
    public static readonly AIM: string = 'Apply a modular CSS stylesheet architecture based on W3C Design Tokens (DTCG), injecting root token definitions and scoped atomic style rules for autonomous elements';

    public static override disposition: Disposition<Body> = {
        aim: { description: Css.AIM, body: { tokens: DESIGN_TOKENS } },
        reactTo: [
            SignalType.APPLY,
            SignalType.RESOLVE,
            SignalType.THEME,
            SignalType.REMOVE,
            SignalType.MOUNT,
            SignalType.SCHEMA,
        ],
        inputs: [
            { signal: SignalType.APPLY, type: DataType.APPLY_PAYLOAD, description: 'Apply autonomous qualities for element' },
            { signal: SignalType.RESOLVE, type: DataType.RESOLVE_PAYLOAD, description: 'Resolve domain qualities to CSS declarations' },
            { signal: SignalType.THEME, type: DataType.THEME_PAYLOAD, description: 'Update design tokens theme' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Remove element style rule' },
            { signal: SignalType.MOUNT, type: DataType.MOUNT_PAYLOAD, description: 'Mount root design token stylesheet' },
            { signal: SignalType.SCHEMA, type: DataType.SCHEMA_PAYLOAD, description: 'Query design tokens schema and summary' },
        ],
        outputs: [
            { signal: SignalType.APPLIED, type: DataType.APPLIED_RESULT, description: 'Style rule applied confirmation' },
            { signal: SignalType.RESOLVED, type: DataType.RESOLVED_RESULT, description: 'Qualities resolved with css declarations' },
            { signal: SignalType.THEMED, type: DataType.THEMED_RESULT, description: 'Design tokens theme updated confirmation' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Style rule removed confirmation' },
            { signal: SignalType.MOUNTED, type: DataType.MOUNTED_RESULT, description: 'Root design tokens stylesheet mounted confirmation' },
            { signal: SignalType.SCHEMA_RESOLVED, type: DataType.SCHEMA_RESOLVED_RESULT, description: 'Design tokens schema and summary resolved' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'CSS operation error notification' },
        ],
    };

    public static translateQualities(qualities: Qualities): Record<string, string> {
        const { width, height, spacing, gap, surface, tone, typeface, textSize, elevation, radius, border, direction, alignment, custom } = qualities;
        return {
            ...Css.resolveDimensions(width, height),
            ...Css.resolveVisuals(spacing, surface, tone, elevation, radius),
            ...Css.resolveGap(gap ?? spacing),
            ...Css.resolveBorder(border),
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

    public static generateTokensCss(tokens: Record<string, Record<string, unknown>> = DESIGN_TOKENS as unknown as Record<string, Record<string, unknown>>): string {
        const lines: string[] = [];
        for (const [category, group] of Object.entries(tokens)) {
            for (const [name, token] of Object.entries(group)) {
                if (name.startsWith('$')) { continue; }
                const val = typeof token === 'object' && token && '$value' in token ? (token as { $value: string }).$value : token;
                lines.push(`--uca-${category}-${name}: ${val};`);
            }
        }
        return `:root { ${lines.join(' ')} } ${generateBaseRulesCss()}`;
    }

    private static resolveTokenValue(group: Record<string, unknown>, key?: string): string | undefined {
        if (!key) { return undefined; }
        const entry = group[key] as { $value?: string } | string | undefined;
        return typeof entry === 'object' && entry ? entry.$value ?? key : entry ?? key;
    }

    private static resolveDimensions(width?: string, height?: string): Record<string, string> {
        const resolvedWidth = width === 'screen' ? '100vw' : Css.resolveTokenValue(DESIGN_TOKENS.dimensions, width);
        const resolvedHeight = Css.resolveTokenValue(DESIGN_TOKENS.dimensions, height);
        const narrowRules: Record<string, string> = width === 'narrow' ? { 'flex-shrink': '0', 'flex-grow': '0' } : {};
        const maxWidthRules = { 'max-width': width === 'wide' ? '768px' : '100%' };
        return { 'box-sizing': 'border-box', ...maxWidthRules, ...(resolvedWidth && { width: resolvedWidth }), ...(resolvedHeight && { height: resolvedHeight }), ...narrowRules };
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

    private static resolveGap(gap?: string): Record<string, string> {
        const resolvedGap = Css.resolveTokenValue(DESIGN_TOKENS.spacing, gap);
        return resolvedGap ? { gap: resolvedGap } : {};
    }

    private static resolveBorder(border?: string): Record<string, string> {
        const resolvedBorder = Css.resolveTokenValue(DESIGN_TOKENS.border, border);
        return resolvedBorder ? { border: resolvedBorder } : {};
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
        const justify = ['space-between', 'center', 'flex-end'].includes(align ?? '') ? align : undefined;
        const cross = align && align !== 'space-between' ? align : undefined;
        return {
            ...((dir || align) ? { display: 'flex' } : {}),
            ...(dir ? { 'flex-direction': dir } : {}),
            ...(cross ? { 'align-items': cross } : {}),
            ...(justify ? { 'justify-content': justify } : {}),
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
            case SignalType.MOUNT:
                this.handleMount(value);
                break;
            case SignalType.SCHEMA:
                this.handleSchema(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            default:
                break;
        }
    }

    private handleSchema(value?: unknown): void {
        const { format } = (value ?? {}) as SchemaPayload;
        const { aim } = this.disposition;
        const tokens = aim.body?.tokens ?? DESIGN_TOKENS;
        const summary = CSS_TOKENS_SUMMARY;
        this.pulse(SignalType.SCHEMA_RESOLVED, { tokens, summary });
    }

    private ensureTokensMounted(): void {
        if (typeof document === 'undefined') { return; }
        if (document.getElementById(TOKENS_STYLE_ID)) { return; }
        const { aim } = this.disposition;
        const tokens = aim.body?.tokens ?? DESIGN_TOKENS;
        Css.mountStyleElement(TOKENS_STYLE_ID, Css.generateTokensCss(tokens));
    }

    private handleMount(value?: unknown): void {
        const { tokens } = (value ?? {}) as MountPayload;
        const { aim } = this.disposition;
        const target = tokens ?? aim.body?.tokens ?? DESIGN_TOKENS;
        Css.mountStyleElement(TOKENS_STYLE_ID, Css.generateTokensCss(target));
        this.pulse(SignalType.MOUNTED, { mounted: true });
    }

    private handleApply(value?: unknown): void {
        const { elementId, qualities } = (value ?? {}) as ApplyPayload;
        if (!elementId || !qualities) { return; }
        this.ensureTokensMounted();
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

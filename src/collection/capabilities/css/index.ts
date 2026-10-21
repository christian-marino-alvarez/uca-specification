import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    CONTROL_STATE_RULES,
    DIMENSION_PROPERTIES,
    TOKEN_PROPERTIES,
    IDENTIFIED_DESCENDANT_SELECTOR,
    CSS_TOKENS_SUMMARY,
    DARK_SCHEME_QUERY,
    DESIGN_READY_PROPERTY,
    DESIGN_TOKENS,
    LIGHT_SCHEME_QUERY,
    REDUCED_MOTION_QUERY,
    STYLE_PREFIX,
    TOKENS_STYLE_ID,
    generateBaseRulesCss,
} from './constants.js';
import {
    type ApplyPayload,
    type DesignTokens,
    type DesignToken,
    type Body,
    type MountPayload,
    type Qualities,
    type RemovePayload,
    type ResolvePayload,
    type SchemaPayload,
    type StylesheetDesign,
    type ThemePayload,
    ControlType,
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
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Remove scoped style rules for the element and its existing descendants' },
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

    private static isTokenQualityKey(key: string): boolean {
        return TOKEN_PROPERTIES.some(([k]) => k === key) || DIMENSION_PROPERTIES.some(([k]) => k === key);
    }

    public static normalizeQualities(qualities: Qualities = {}): Qualities {
        return qualities;
    }

    public static translateQualities(qualities: Qualities): Record<string, string> {
        const normalized = Css.normalizeQualities(qualities);
        const {
            marginInline,
        } = normalized;
        return {
            ...Css.resolveDimensions(normalized),
            ...Css.resolveLayout(normalized),
            ...Css.resolveTokenQualities(normalized),
            ...(marginInline === 'auto' && { 'margin-inline': marginInline }),
        };
    }

    public static formatSelector(elementId: string): string {
        if (elementId === 'body' || elementId === 'html') {
            return elementId;
        }
        return elementId.includes(':') ? `[id="${elementId}"]` : `#${elementId}`;
    }

    private static toKebabCase(prop: string): string {
        return prop.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    private static formatDeclaration(property: string, value: string | number): string {
        if (property === 'style') {
            return String(value).trim().endsWith(';') ? String(value) : `${value};`;
        }
        return `${Css.toKebabCase(property)}: ${value};`;
    }

    public static formatCssRule(selector: string, declarations: Readonly<Record<string, string | number>>): string {
        const rules = Object.entries(declarations).map(([k, v]) => Css.formatDeclaration(k, v)).join(' ');
        return `${selector} { ${rules} }`;
    }

    private static formatControlStates(selector: string, control: ControlType): string {
        return CONTROL_STATE_RULES[control].map(({ suffix, declarations }) => Css.formatCssRule(`${selector}${suffix}`, { ...declarations })).join(' ');
    }

    public static generateTokensCss(tokens: DesignTokens = DESIGN_TOKENS as unknown as DesignTokens): string {
        const declarations = Css.formatTokenDeclarations(tokens);
        return `:root { ${DESIGN_READY_PROPERTY}: 1; ${declarations} } ${generateBaseRulesCss()}`;
    }

    public static generateStylesheet(design: StylesheetDesign): string {
        const {
            tokens,
            modes = {},
            rules = {},
        } = design;
        const {
            light,
            dark,
            reducedMotion,
        } = modes;
        return [
            Css.generateTokensCss(tokens),
            Css.formatRulesCss(rules),
            Css.formatModeCss(LIGHT_SCHEME_QUERY, light),
            Css.formatModeCss(DARK_SCHEME_QUERY, dark),
            Css.formatModeCss(REDUCED_MOTION_QUERY, reducedMotion),
        ].filter(Boolean).join('\n');
    }

    private static formatTokenDeclarations(tokens: DesignTokens): string {
        return Object.entries(tokens).flatMap(([
            category,
            group,
        ]) => Object.entries(group).filter(([
            name,
        ]) => !name.startsWith('$')).map(([
            name,
            token,
        ]) => `--uca-${category}-${name}: ${token.$value};`)).join(' ');
    }

    private static formatRulesCss(rules: StylesheetDesign['rules'] = {}): string {
        return Object.entries(rules).map(([
            selector,
            declarations,
        ]) => Css.formatCssRule(selector, declarations)).join('\n');
    }

    private static formatModeCss(query: string, tokens?: DesignTokens): string {
        if (!tokens) {
            return '';
        }
        const declarations = Css.formatTokenDeclarations(tokens);
        return `@media ${query} { :root { ${declarations} } }`;
    }

    private static tokenReference(group: string, name: string, fallback: string): string {
        return `var(--uca-${group}-${name}, ${fallback})`;
    }

    private static resolveDimensionProperty(property: string, name?: string, viewport?: string): [string, string][] {
        if (!name) {
            return [];
        }
        if (name === 'screen') {
            return viewport ? [[property, viewport]] : [];
        }
        const { dimensions } = DESIGN_TOKENS;
        const tokens = dimensions as unknown as Record<string, DesignToken>;
        const { $value } = tokens[name] ?? {};
        const value = $value !== undefined ? Css.tokenReference('dimensions', name, String($value)) : name;
        return [[property, value]];
    }

    private static resolveDimensions(qualities: Qualities): Record<string, string> {
        return {
            'box-sizing': 'border-box',
            ...Object.fromEntries(DIMENSION_PROPERTIES.flatMap(([quality, property, viewport]) => {
                const { [quality]: name } = qualities;
                return Css.resolveDimensionProperty(property, name, viewport);
            })),
        };
    }

    private static resolveTokenProperty(property: string, group: string, name?: string): [string, string][] {
        if (!name) {
            return [];
        }
        const tokenCatalog = DESIGN_TOKENS as unknown as Record<string, Record<string, DesignToken<string | number>>>;
        const groupTokens = tokenCatalog[group] ?? {};
        const { $value } = groupTokens[name] ?? {};
        const value = $value !== undefined ? Css.tokenReference(group, name, String($value)) : String(name);
        return [[property, value]];
    }

    private static resolveTokenQualities(qualities: Qualities): Record<string, string> {
        return Object.fromEntries(TOKEN_PROPERTIES.flatMap(([quality, group, property]) => {
            const { [quality]: name } = qualities;
            return Css.resolveTokenProperty(property, group, name);
        }));
    }

    private static resolveLayout(qualities: Qualities): Record<string, string> {
        const {
            direction,
            alignment,
            distribution,
            wrap,
            gap,
            flex,
        } = qualities;
        const isFlex = Boolean(direction || alignment || distribution || wrap || gap || flex);
        return isFlex ? { display: 'flex' } : {};
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

    private static removeScopedStyles(elementId: string): void {
        if (typeof document === 'undefined') {
            return;
        }
        const descendants = document.getElementById(elementId)?.querySelectorAll(IDENTIFIED_DESCENDANT_SELECTOR) ?? [];
        const identifiers = [elementId, ...Array.from(descendants, ({ id }) => id)];
        identifiers.forEach((identifier) => document.getElementById(`${STYLE_PREFIX}${identifier}`)?.remove());
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
        const readiness = getComputedStyle(document.documentElement).getPropertyValue(DESIGN_READY_PROPERTY);
        if (readiness.trim()) { return; }
        const { aim } = this.disposition;
        const tokens = aim.body?.tokens as DesignTokens | undefined
            ?? DESIGN_TOKENS as unknown as DesignTokens;
        Css.mountStyleElement(TOKENS_STYLE_ID, Css.generateTokensCss(tokens));
    }

    private handleMount(value?: unknown): void {
        const { tokens } = (value ?? {}) as MountPayload;
        const { aim } = this.disposition;
        const target = tokens as DesignTokens | undefined
            ?? aim.body?.tokens as DesignTokens | undefined
            ?? DESIGN_TOKENS as unknown as DesignTokens;
        Css.mountStyleElement(TOKENS_STYLE_ID, Css.generateTokensCss(target));
        this.pulse(SignalType.MOUNTED, { mounted: true });
    }

    private handleApply(value?: unknown): void {
        const { elementId, qualities, control } = (value ?? {}) as ApplyPayload;
        if (!elementId || !qualities) {
            return;
        }
        this.ensureTokensMounted();
        const declarations = Css.translateQualities(qualities);
        const selector = Css.formatSelector(elementId);
        const cssText = Css.formatCssRule(selector, declarations) + (control ? Css.formatControlStates(selector, control) : '');
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
        const cssText = Css.generateTokensCss(tokens as DesignTokens);
        Css.mountStyleElement(TOKENS_STYLE_ID, cssText);
        this.pulse(SignalType.THEMED, { updated: true });
    }

    private handleRemove(value?: unknown): void {
        const { elementId } = (value ?? {}) as RemovePayload;
        if (!elementId) {
            return;
        }
        Css.removeScopedStyles(elementId);
        this.pulse(SignalType.REMOVED, { elementId, removed: true });
    }
}

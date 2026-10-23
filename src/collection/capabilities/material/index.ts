import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    DARK_TOKENS,
    DEFAULT_THEME,
    ELEVATION_TOKENS,
    GRID_GRAMMAR,
    LIGHT_TOKENS,
    SHAPE_TOKENS,
    STYLE_ELEMENT_ID,
    TYPOGRAPHY_TOKENS,
} from './constants.js';
import {
    appliedResultSchema,
    applyPayloadSchema,
    themeModeSchema,
    type ApplyPayload,
    type Body,
    type ThemeMode,
} from './schema.js';
import {
    DataType,
    SignalType,
} from './types.js';

export class Material extends Capability<Body> {
    public static readonly AIM: string = AIM;
    public static readonly gridGrammar = GRID_GRAMMAR;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Material.AIM,
            body: {},
        },
        reactTo: [
            SignalType.APPLY,
            SignalType.THEME,
        ],
        inputs: [
            {
                signal: SignalType.APPLY,
                type: DataType.APPLY_PAYLOAD,
                schema: applyPayloadSchema,
                description: 'Apply M3 tokens and color roles',
            },
            {
                signal: SignalType.THEME,
                type: DataType.THEME_MODE,
                schema: themeModeSchema,
                description: 'Switch active theme mode',
            },
        ],
        outputs: [
            {
                signal: SignalType.APPLIED,
                type: DataType.APPLIED_RESULT,
                schema: appliedResultSchema,
                description: 'M3 tokens applied confirmation',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.synchronizeTokens();
    }

    public override denervate(): void {
        this.removeStyleElement();
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        switch (property) {
            case SignalType.APPLY:
                this.handleApply(value);
                break;
            case SignalType.THEME:
                this.handleTheme(value);
                break;
            default:
                break;
        }
    }

    private handleApply(value: unknown): void {
        const payload = this.extractPayload<ApplyPayload>(value);
        this.synchronizeTokens(payload);
    }

    private handleTheme(value: unknown): void {
        const mode = typeof value === 'string' ? value : undefined;
        const theme = mode === 'light' ? 'light' : 'dark';
        this.synchronizeTokens({
            theme,
        });
    }

    private resolveThemeConfig(payload?: ApplyPayload): { theme: ThemeMode; seedColor?: string; target: string } {
        const {
            aim,
        } = this.disposition;
        const {
            theme: bTheme,
            seedColor: bSeed,
            targetSelector: bTarget,
        } = (aim.body ?? {}) as ApplyPayload;
        const theme = payload?.theme ?? bTheme ?? DEFAULT_THEME;
        const seedColor = payload?.seedColor ?? bSeed;
        const target = payload?.targetSelector ?? bTarget ?? ':root';
        return {
            theme,
            seedColor,
            target,
        };
    }

    private computeTokens(theme: ThemeMode, seedColor?: string): Record<string, string> {
        const colorTokens = theme === 'light' ? LIGHT_TOKENS : DARK_TOKENS;
        return {
            ...colorTokens,
            ...SHAPE_TOKENS,
            ...ELEVATION_TOKENS,
            ...TYPOGRAPHY_TOKENS,
            ...(seedColor && { '--md-sys-color-primary': seedColor }),
        };
    }

    private buildCssText(target: string, tokens: Record<string, string>): string {
        const entries = Object.entries(tokens);
        const declarations = entries.map(([key, value]) => `  ${key}: ${value};`).join('\n');
        return `${target} {\n${declarations}\n}`;
    }

    private synchronizeTokens(payload?: ApplyPayload): void {
        const {
            theme,
            seedColor,
            target,
        } = this.resolveThemeConfig(payload);
        const tokens = this.computeTokens(theme, seedColor);
        const cssText = this.buildCssText(target, tokens);
        this.injectStyleSheet(cssText);
        this.pulse(SignalType.APPLIED, {
            theme,
            tokens,
        });
    }

    private injectStyleSheet(cssText: string): void {
        if (typeof document === 'undefined') {
            return;
        }
        const head = document.head;
        const existing = document.getElementById(STYLE_ELEMENT_ID);
        const element = existing ?? document.createElement('style');
        element.id = STYLE_ELEMENT_ID;
        element.textContent = cssText;
        if (!existing && head) {
            head.appendChild(element);
        }
    }

    private removeStyleElement(): void {
        if (typeof document === 'undefined') {
            return;
        }
        const element = document.getElementById(STYLE_ELEMENT_ID);
        element?.remove();
    }
}

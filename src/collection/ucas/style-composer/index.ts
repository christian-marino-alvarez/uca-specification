import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Css, SignalType as CssSignalType, type CssRule } from '@uca/capability-css';
import { PromptApi, SignalType as PromptApiSignalType, type PromptResult } from '@uca/capability-prompt-api';
import { SignalType as GraphSignalType } from '@uca/capability-graph';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import {
    buildThemePrompt,
    buildUcaPrompt,
    generateThemeRules,
    generateUcaRules,
    parseCssRulesFromResponse,
} from './engine.js';
import {
    type Body,
    type ComposeThemePayload,
    type StyleUcaPayload,
    DataType,
    SignalType,
} from './types.js';

export class StyleComposer extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: StyleComposer.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.COMPOSE_THEME, type: DataType.COMPOSE_THEME_PAYLOAD, description: 'Compose global theme stylesheet' },
            { signal: SignalType.STYLE_UCA, type: DataType.STYLE_UCA_PAYLOAD, description: 'Compose CSS rules for specific UCA' },
        ],
        outputs: [
            { signal: SignalType.THEME_COMPOSED, type: DataType.THEME_COMPOSED_RESULT, description: 'Emits composed theme rules' },
            { signal: SignalType.UCA_STYLED, type: DataType.UCA_STYLED_RESULT, description: 'Emits composed UCA rules' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits styling error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? StyleComposer.disposition;
        const { reactTo = [] } = base;
        const internalSignals = this.getInternalSignals();
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override matchesId(_id?: string): boolean {
        return true;
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { factory } = (aim.body ?? {}) as Body;
        const cssDisp: Disposition = { aim: { description: Css.AIM, body: {} }, reactTo: [...Css.disposition.reactTo ?? []] };
        const promptDisp: Disposition = { aim: { description: PromptApi.AIM, body: { factory } }, reactTo: [...PromptApi.disposition.reactTo ?? []] };
        return [[Css, cssDisp], [PromptApi, promptDisp]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.COMPOSE_THEME:
                this.handleComposeTheme(value);
                break;
            case GraphSignalType.UCA_DETECTED:
            case SignalType.STYLE_UCA:
                this.handleStyleUca(value);
                break;
            case PromptApiSignalType.RESPONDED:
                this.handlePromptResponded(value);
                break;
            case PromptApiSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private getInternalSignals(): readonly string[] {
        return [
            PromptApiSignalType.RESPONDED,
            PromptApiSignalType.ERROR,
            GraphSignalType.UCA_DETECTED,
            CssSignalType.CREATED,
            CssSignalType.UPDATED,
        ];
    }

    private handleComposeTheme(value: unknown): void {
        const payload = (value ?? {}) as ComposeThemePayload;
        const rules = generateThemeRules();
        this.applyRules(rules);
        this.pulse(SignalType.THEME_COMPOSED, { rules });
        if (this.isPromptApiAvailable()) {
            this.promptForThemeRefinement(payload);
        }
    }

    private handleStyleUca(value: unknown): void {
        const payload = (value ?? {}) as StyleUcaPayload;
        const { id, disposition } = payload;
        if (!id) { return; }
        const rules = generateUcaRules(id, disposition);
        this.applyRules(rules);
        this.pulse(SignalType.UCA_STYLED, { id, rules });
        if (this.isPromptApiAvailable()) {
            this.promptForUcaStyles(id, disposition);
        }
    }

    private isPromptApiAvailable(): boolean {
        const { aim } = this.disposition;
        const { factory } = (aim.body ?? {}) as Body;
        const globalAi = (globalThis as unknown as { ai?: { languageModel?: unknown } }).ai;
        return Boolean(factory ?? globalAi?.languageModel);
    }

    private applyRules(rules: readonly CssRule[]): void {
        for (const rule of rules) {
            this.pulse(CssSignalType.CREATE, rule);
        }
    }

    private promptForThemeRefinement(payload: ComposeThemePayload): void {
        const { purpose } = payload;
        const prompt = buildThemePrompt(purpose);
        this.pulse(PromptApiSignalType.PROMPT, { prompt });
    }

    private promptForUcaStyles(id: string, disposition?: Disposition): void {
        const { aim } = disposition ?? {};
        const { description } = aim ?? {};
        const prompt = buildUcaPrompt(id, description);
        this.pulse(PromptApiSignalType.PROMPT, { prompt });
    }

    private handlePromptResponded(value: unknown): void {
        const result = (value ?? {}) as PromptResult;
        const { response = '' } = result;
        const rules = parseCssRulesFromResponse(response);
        for (const rule of rules) {
            this.pulse(CssSignalType.UPDATE, rule);
        }
    }
}

export * from './constants.js';
export * from './types.js';
export * from './engine.js';

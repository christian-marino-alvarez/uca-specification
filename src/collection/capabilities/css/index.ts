import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import {
    type Body,
    type CssRule,
    type SheetAdapter,
    DataType,
    SignalType,
} from './types.js';

export class Css extends Capability<Body> {
    public static readonly AIM: string = 'Create and manage reusable OOCSS rules as independent style resources';

    public static override disposition: Disposition<Body> = {
        aim: { description: Css.AIM, body: {} },
        reactTo: [...__DEFAULT_SIGNALS__],
        inputs: [
                { signal: SignalType.CREATE, type: DataType.CSS_RULE, description: 'Create new reusable CSS rule' },
                { signal: SignalType.UPDATE, type: DataType.CSS_RULE, description: 'Update existing CSS rule declarations' },
                { signal: SignalType.REMOVE, type: DataType.STRING, description: 'Remove CSS rule by selector' },
            ],
            outputs: [
                { signal: SignalType.CREATED, type: DataType.CSS_RULE, description: 'Notification that CSS rule was created' },
                { signal: SignalType.UPDATED, type: DataType.CSS_RULE, description: 'Notification that CSS rule was updated' },
                { signal: SignalType.REMOVED, type: DataType.STRING, description: 'Notification that CSS rule was removed' },
                { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'CSS operation error' },
            ],
    };

    private sheet?: SheetAdapter;
    private readonly ruleIndexes: Map<string, number>;

    public constructor(id: string = __ID__) {
        super(id);
        this.ruleIndexes = new Map();
    }


    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        super.innervate(target, disposition);
        this.ensureStyleSheet();
        return this;
    }

    public override denervate(): void {
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate(value);
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            default:
                this.handleDynamicSignal(property, value);
                break;
        }
    }

    public getRules(): readonly string[] {
        const sheet = this.ensureStyleSheet();
        const { length } = sheet.cssRules;
        const rules: string[] = [];
        for (let i = 0; i < length; i++) {
            const rule = sheet.cssRules[i];
            if (rule?.cssText) { rules.push(rule.cssText); }
        }
        return rules;
    }

    private handleDynamicSignal(property: string, value: unknown): void {
        if (typeof value === 'string') {
            this.handleRemove(value);
        } else if (value && typeof value === 'object' && 'selector' in value) {
            this.handleCreateOrUpdate(value as CssRule);
        }
    }

    private handleCreateOrUpdate(rule: CssRule): void {
        const { selector } = rule;
        if (this.ruleIndexes.has(selector)) {
            this.handleUpdate(rule);
        } else {
            this.handleCreate(rule);
        }
    }

    private handleCreate(value: unknown): void {
        if (typeof value === 'string') {
            if (this.id !== 'css' && !this.id.endsWith(':app')) { return; }
            this.insertCssText(value);
            return;
        }
        const payload = this.extractPayload<CssRule & { cssText?: string }>(value);
        if (payload?.cssText) {
            this.insertCssText(payload.cssText);
            return;
        }
        if (!payload?.selector || !payload.declarations) { return; }
        this.insertRule(payload);
    }

    private insertCssText(cssText: string): void {
        if (typeof document !== 'undefined') {
            let style = document.querySelector<HTMLStyleElement>(`style[data-uca-capability="${this.id}"]`);
            if (!style) {
                style = document.createElement('style');
                style.setAttribute('data-uca-capability', this.id);
                document.head.appendChild(style);
            }
            if (style.textContent?.trim() !== cssText.trim()) {
                style.textContent = cssText;
            }
        }
        this.pulse(SignalType.CREATED, { id: this.id, selector: ':root', declarations: { cssText } });
    }

    private insertRule(rule: CssRule): void {
        const ruleText = this.formatRuleText(rule);
        this.appendRuleToDom(ruleText);
        try {
            const sheet = this.ensureStyleSheet();
            const index = sheet.insertRule(ruleText, sheet.cssRules?.length ?? 0);
            this.ruleIndexes.set(rule.selector, index);
            this.pulse(SignalType.CREATED, rule);
        } catch { this.pulse(SignalType.CREATED, rule); }
    }

    private appendRuleToDom(ruleText: string): void {
        if (typeof document !== 'undefined') {
            const styleElement = document.querySelector<HTMLStyleElement>(`style[data-uca-capability="${this.id}"]`);
            if (styleElement) {
                styleElement.appendChild(document.createTextNode(`${ruleText}\n`));
            }
        }
    }

    private handleUpdate(value: unknown): void {
        const rule = this.extractPayload<CssRule>(value);
        if (!rule?.selector || !rule.declarations) { return; }
        const currentIndex = this.ruleIndexes.get(rule.selector);
        if (currentIndex === undefined) { return; }
        const ruleText = this.formatRuleText(rule);
        try {
            const sheet = this.ensureStyleSheet();
            sheet.deleteRule(currentIndex);
            const newIndex = sheet.insertRule(ruleText, currentIndex);
            this.ruleIndexes.set(rule.selector, newIndex);
            this.rebuildDomText();
            this.pulse(SignalType.UPDATED, rule);
        } catch (error) { this.pulse(SignalType.ERROR, error); }
    }

    private handleRemove(value: unknown): void {
        const selector = typeof value === 'string' ? value : (value as { selector?: string })?.selector;
        if (!selector) { return; }
        const currentIndex = this.ruleIndexes.get(selector);
        if (currentIndex === undefined) { return; }
        try {
            const sheet = this.ensureStyleSheet();
            sheet.deleteRule(currentIndex);
            this.ruleIndexes.delete(selector);
            this.rebuildIndexPositions();
            this.rebuildDomText();
            this.pulse(SignalType.REMOVED, selector);
        } catch (error) { this.pulse(SignalType.ERROR, error); }
    }

    private rebuildDomText(): void {
        if (typeof document !== 'undefined') {
            const styleElement = document.querySelector<HTMLStyleElement>(`style[data-uca-capability="${this.id}"]`);
            if (styleElement) {
                const rules = this.getRules();
                styleElement.textContent = rules.length ? `${rules.join('\n')}\n` : '';
            }
        }
    }

    private rebuildIndexPositions(): void {
        const sheet = this.ensureStyleSheet();
        this.ruleIndexes.clear();
        for (let i = 0; i < sheet.cssRules.length; i++) {
            const rule = sheet.cssRules[i];
            const selector = rule?.selectorText ?? this.extractSelectorFromRuleText(rule?.cssText);
            if (selector) { this.ruleIndexes.set(selector, i); }
        }
    }

    private extractSelectorFromRuleText(cssText?: string): string | undefined {
        if (!cssText) { return undefined; }
        const braceIndex = cssText.indexOf('{');
        return braceIndex !== -1 ? cssText.slice(0, braceIndex).trim() : undefined;
    }

    private formatRuleText(rule: CssRule): string {
        const { selector, declarations } = rule;
        const entries = Object.entries(declarations);
        const body = entries.map(([prop, val]) => `${prop}: ${val};`).join(' ');
        return `${selector} { ${body} }`;
    }

    private ensureStyleSheet(): SheetAdapter {
        if (!this.sheet) {
            const { aim } = this.disposition;
            const { sheetAdapter } = aim.body ?? {};
            this.sheet = sheetAdapter ?? this.createDefaultStyleSheet();
        }
        return this.sheet;
    }

    private createDefaultStyleSheet(): SheetAdapter {
        if (typeof document !== 'undefined' && document.createElement) {
            let styleElement = document.querySelector<HTMLStyleElement>(`style[data-uca-capability="${this.id}"]`);
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.setAttribute('data-uca-capability', this.id);
                document.head.appendChild(styleElement);
            }
            return (styleElement.sheet as unknown as SheetAdapter) ?? this.createFallbackMemorySheet();
        }
        return this.createFallbackMemorySheet();
    }

    private createFallbackMemorySheet(): SheetAdapter {
        const store: { cssText: string; selectorText?: string }[] = [];
        return {
            insertRule: (ruleText: string, index = store.length) => {
                const selector = this.extractSelectorFromRuleText(ruleText);
                store.splice(index, 0, { cssText: ruleText, selectorText: selector });
                return index;
            },
            deleteRule: (index: number) => { store.splice(index, 1); },
            get cssRules() {
                const rulesObj: any = { length: store.length };
                store.forEach((r, idx) => { rulesObj[idx] = r; });
                return rulesObj;
            },
        };
    }
}



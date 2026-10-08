import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Material } from '@uca/capability-material';
import { SignalType as MaterialSignalType } from '@uca/capability-material/types';
import { WebLlm } from '@uca/web-llm';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import {
    __ID__,
    BASE_THEME_RULES,
    DEFAULT_MODEL,
    DEFAULT_PROVIDER,
    DEFAULT_PURPOSE,
    DEFAULT_SIGNALS,
} from './constants.js';
import {
    type Body,
    type CreatePayload,
    type CssRule,
    type ThemeResult,
    DataType,
    SignalType,
} from './types.js';

export class ThemeCss extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: ThemeCss.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.CREATE_PAYLOAD, description: 'Generate OOCSS theme' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Cancel theme generation' },
            { signal: MaterialSignalType.APPLIED, type: DataType.UNKNOWN, description: 'Material tokens applied' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.THEME_RESULT, description: 'Complete OOCSS theme generated' },
            { signal: SignalType.DESTROYED, type: DataType.VOID, description: 'Theme generation canceled' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Theme generation error' },
            { signal: MaterialSignalType.APPLY, type: DataType.UNKNOWN, description: 'Apply Material tokens' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, source, value } = signal;
        switch (property) {
            case SignalType.CREATE: this.handleCreate(value); break;
            case SignalType.DESTROY: this.handleDestroy(); break;
            case WebLlmSignalType.STREAMED: await this.handleStreamed(value, source); break;
            case WebLlmSignalType.ERROR: this.handleError(value, source); break;
            case MaterialSignalType.APPLIED: this.handleMaterialApplied(value); break;
            default: break;
        }
    }

    protected override capabilities(): Cooky {
        const webLlm = this.createWebLlmCapability();
        const material = this.createMaterialCapability();
        return [...webLlm, ...material];
    }

    private isOwnedSource(source: string): boolean {
        return source === `${this.id}:web-llm` || source === 'test' || source === 'web-llm';
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as CreatePayload;
        const { request, context, model = DEFAULT_MODEL, provider = DEFAULT_PROVIDER } = payload;
        const correlationId = payload.correlationId ?? `${this.id}:create:${Date.now()}`;
        const prompt = this.formatPrompt(request, context);
        console.log('🎨 [ThemeCss:Prompt]\n', prompt);
        const webLlmPayload = { id: `${this.id}:web-llm`, request: prompt, model, provider, correlationId };
        this.pulse(WebLlmSignalType.STREAM, webLlmPayload);
    }

    private formatPrompt(request: string, context?: string): string {
        const schema = '{"selector":"<selector>","declarations":{"<cssProperty>":"<cssValue>"}}';
        const goal = `Diseña OOCSS puro y tipografía con Material Design 3 para: "${request}".`;
        const rules = 'PROHIBIDO grids, layout o disposición (emergen de UCAs). Solo pieles, colores y tipografía componibles:';
        const lines = [goal, context && `Contexto: ${context}`, rules, schema].filter(Boolean);
        return lines.join('\n');
    }

    private async handleStreamed(value: unknown, source: string): Promise<void> {
        if (!this.isOwnedSource(source)) { return; }
        const { correlationId, stream } = (value ?? {}) as { correlationId?: string; stream?: ReadableStream<string> };
        if (!stream) { return; }
        const text = await this.readFullStream(stream);
        const rules = this.parseRules(text);
        this.pulse(SignalType.CREATED, { correlationId, rules } satisfies ThemeResult);
    }

    private async readFullStream(stream: ReadableStream<string>): Promise<string> {
        const reader = stream.getReader();
        let accumulated = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            accumulated += value;
        }
        return accumulated;
    }

    private parseRules(text: string): CssRule[] {
        const cleaned = text.replace(/```(?:json|css)?/g, '').replace(/```/g, '').trim();
        const parsedLines = cleaned.split('\n').map((line) => this.parseSingleRule(line) ?? this.parseCssRule(line));
        const lineRules = parsedLines.filter((rule): rule is CssRule => Boolean(rule));
        const resolvedRules = lineRules.length > 0 ? lineRules : this.parseArrayRules(cleaned);
        return this.mergeWithBaseRules(resolvedRules);
    }

    private mergeWithBaseRules(rules: CssRule[]): CssRule[] {
        const existing = new Set(rules.map((rule) => rule.selector));
        const missing = BASE_THEME_RULES.filter((baseRule) => !existing.has(baseRule.selector));
        return [...missing, ...rules];
    }

    private parseArrayRules(text: string): CssRule[] {
        try {
            const parsed = JSON.parse(text);
            if (!Array.isArray(parsed)) { return []; }
            const mapped = parsed.map((item) => this.normalizeParsedRule(item as Record<string, unknown>));
            return mapped.filter((rule): rule is CssRule => Boolean(rule));
        } catch { return []; }
    }

    private parseSingleRule(line: string): CssRule | undefined {
        const trimmed = line.trim().replace(/,$/, '');
        if (!trimmed.startsWith('{')) { return undefined; }
        try {
            const parsed = JSON.parse(trimmed);
            return this.normalizeParsedRule(parsed);
        } catch { return undefined; }
    }

    private normalizeParsedRule(parsed: Record<string, unknown>): CssRule | undefined {
        const selector = typeof parsed.selector === 'string' ? parsed.selector.trim() : undefined;
        if (!selector) { return undefined; }
        const rawDeclarations = this.extractRawDeclarations(parsed);
        const declarations = this.sanitizeOocss(rawDeclarations);
        return Object.keys(declarations).length > 0 ? { selector, declarations } : undefined;
    }

    private sanitizeOocss(declarations: Record<string, string>): Record<string, string> {
        const entries = Object.entries(declarations);
        const filtered = entries.filter(([property, value]) => !property.startsWith('grid') && !value.includes('grid'));
        return Object.fromEntries(filtered);
    }

    private extractRawDeclarations(parsed: Record<string, unknown>): Record<string, string> {
        const { declarations, styles, css } = parsed;
        if (declarations && typeof declarations === 'object') {
            return declarations as Record<string, string>;
        }
        const text = typeof styles === 'string' ? styles : (typeof css === 'string' ? css : undefined);
        return text ? this.extractDeclarations(text) : {};
    }

    private parseCssRule(line: string): CssRule | undefined {
        const trimmed = line.trim();
        const open = trimmed.indexOf('{');
        const close = trimmed.lastIndexOf('}');
        if (open === -1 || close <= open) { return undefined; }
        const selector = trimmed.slice(0, open).trim();
        const rawDeclarations = this.extractDeclarations(trimmed.slice(open + 1, close));
        const declarations = this.sanitizeOocss(rawDeclarations);
        return selector && Object.keys(declarations).length > 0 ? { selector, declarations } : undefined;
    }

    private extractDeclarations(body: string): Record<string, string> {
        const statements = body.split(';').map((statement) => statement.trim()).filter(Boolean);
        const pairs = statements.map((statement) => {
            const [property, ...values] = statement.split(':');
            return [property?.trim() ?? '', values.join(':').trim()] as const;
        });
        const valid = pairs.filter(([property, value]) => Boolean(property && value));
        return Object.fromEntries(valid);
    }

    private handleDestroy(): void {
        this.pulse(WebLlmSignalType.DESTROY, { id: `${this.id}:web-llm` });
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private handleError(value: unknown, source: string): void {
        if (!this.isOwnedSource(source)) { return; }
        this.pulse(SignalType.ERROR, value);
    }

    private handleMaterialApplied(value: unknown): void {
        console.log('💎 [ThemeCss:Material-Applied]', value);
    }

    private createWebLlmCapability(): Cooky {
        const { reactTo = [] } = WebLlm.disposition;
        const body = { id: `${this.id}:web-llm` };
        const aim = { description: 'Web LLM for theme generation', body };
        return [[WebLlm, { aim, reactTo: [...reactTo] }]];
    }

    private createMaterialCapability(): Cooky {
        const { reactTo = [] } = Material.disposition;
        const body = { id: `${this.id}:material` };
        const aim = { description: 'Material Design 3 tokens for ThemeCss', body };
        return [[Material, { aim, reactTo: [...reactTo] }]];
    }
}

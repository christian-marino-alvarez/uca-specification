import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { WebLlm } from '@uca/web-llm';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import {
    __ID__,
    AVAILABLE_PRIMITIVES,
    DEFAULT_MODEL,
    DEFAULT_PROVIDER,
    DEFAULT_PURPOSE,
    DEFAULT_SIGNALS,
} from './constants.js';
import {
    type Body,
    type ComposePayload,
    type ComposeStreamPayload,
    type ComposedResult,
    type CustomCssRule,
    type TemplateNode,
    DataType,
    SignalType,
} from './types.js';

export class Composer extends Uca<Body> {
    public static override purpose: string = DEFAULT_PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: Composer.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.COMPOSE, type: DataType.COMPOSE_PAYLOAD, description: 'Compose template and logic for an emergent UCA' },
            { signal: SignalType.STREAM, type: DataType.STREAM_PAYLOAD, description: 'Stream scaffold items to compose' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Cancel composition' },
            { signal: CssSignalType.CREATED, type: DataType.UNKNOWN, description: 'Custom CSS rule created' },
            { signal: CssSignalType.ERROR, type: DataType.UNKNOWN, description: 'CSS error notification' },
        ],
        outputs: [
            { signal: SignalType.COMPOSED, type: DataType.COMPOSED_RESULT, description: 'Fractal template and logic composed' },
            { signal: SignalType.STREAMED, type: DataType.STREAM_RESULT, description: 'ReadableStream of composed template results' },
            { signal: SignalType.DESTROYED, type: DataType.VOID, description: 'Composition canceled' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Composition error' },
            { signal: CssSignalType.CREATE, type: DataType.UNKNOWN, description: 'Create custom CSS rule' },
            { signal: WebLlmSignalType.STREAM, type: DataType.UNKNOWN, description: 'Stream LLM reasoning' },
        ],
    };

    private ucaContexts: Map<string, string> = new Map();
    private pendingReasonings: Map<string, (text: string) => void> = new Map();

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, source, value } = signal;
        switch (property) {
            case SignalType.COMPOSE: this.handleCompose(value); break;
            case SignalType.STREAM: this.handleStream(value); break;
            case SignalType.DESTROY: this.handleDestroy(); break;
            case WebLlmSignalType.STREAMED: await this.handleStreamed(value, source); break;
            case WebLlmSignalType.ERROR: this.handleError(value, source); break;
            case CssSignalType.CREATED: this.handleCssCreated(value); break;
            default: break;
        }
    }

    protected override capabilities(): Cooky {
        const webLlm = this.createWebLlmCapability();
        const css = this.createCssCapability();
        return [...webLlm, ...css];
    }

    private isOwnedSource(source: string): boolean {
        return source === `${this.id}:web-llm` || source === 'test' || source === 'web-llm';
    }

    private handleCompose(value: unknown): void {
        const payload = (value ?? {}) as ComposePayload;
        const { targetUca, purpose, parentTo, parentContext, themeClasses, model = DEFAULT_MODEL, provider = DEFAULT_PROVIDER } = payload;
        const correlationId = payload.correlationId ?? `${this.id}:compose:${targetUca}:${Date.now()}`;
        const prompt = this.formatPrompt(targetUca, purpose, parentTo, parentContext, themeClasses);
        console.log(`🎼 [Composer:Prompt] Componiendo #${targetUca}\n`, prompt);
        const webLlmPayload = { id: `${this.id}:web-llm`, request: prompt, model, provider, correlationId, targetUca };
        this.pulse(WebLlmSignalType.STREAM, webLlmPayload);
    }

    private handleStream(value: unknown): void {
        const payload = (value ?? {}) as ComposeStreamPayload;
        const { stream, parentContext, themeClasses, correlationId } = payload;
        if (!stream) { return; }
        const outputStream = this.createPipedComposerStream(stream, parentContext, themeClasses, correlationId);
        this.pulse(SignalType.STREAMED, { stream: outputStream, correlationId });
    }

    private createPipedComposerStream(
        inputStream: ReadableStream<unknown>,
        parentContext?: string,
        themeClasses?: string[],
        correlationId?: string,
    ): ReadableStream<ComposedResult> {
        const self = this;
        return new ReadableStream<ComposedResult>({
            async start(controller) {
                await self.pumpScaffoldStream(inputStream, controller, parentContext, themeClasses, correlationId);
            },
        });
    }

    private async pumpScaffoldStream(
        inputStream: ReadableStream<unknown>,
        controller: ReadableStreamDefaultController<ComposedResult>,
        parentContext?: string,
        themeClasses?: string[],
        correlationId?: string,
    ): Promise<void> {
        const reader = (inputStream as ReadableStream<Record<string, { purpose?: string; parentTo?: string | null }>>).getReader();
        try {
            while (true) {
                const { done, value: chunk } = await reader.read();
                if (done) { break; }
                await this.processChunkItems(chunk, controller, parentContext, themeClasses, correlationId);
            }
        } finally {
            controller.close();
        }
    }

    private async processChunkItems(
        chunk: Record<string, { purpose?: string; parentTo?: string | null }>,
        controller: ReadableStreamDefaultController<ComposedResult>,
        parentContext?: string,
        themeClasses?: string[],
        correlationId?: string,
    ): Promise<void> {
        if (!chunk || typeof chunk !== 'object') { return; }
        for (const [ucaName, ucaDef] of Object.entries(chunk)) {
            if (ucaName.toLowerCase() === 'app') { continue; }
            await this.composeAndEnqueue(ucaName, ucaDef, controller, parentContext, themeClasses, correlationId);
        }
    }

    private async composeAndEnqueue(
        targetUca: string,
        ucaDef: { purpose?: string; parentTo?: string | null },
        controller: ReadableStreamDefaultController<ComposedResult>,
        parentContext?: string,
        themeClasses?: string[],
        correlationId?: string,
    ): Promise<void> {
        const { purpose = targetUca, parentTo = 'app' } = ucaDef ?? {};
        const parentId = parentTo || 'app';
        const resolvedContext = this.ucaContexts.get(parentId) ?? parentContext;
        this.ucaContexts.set(targetUca, purpose);
        const composed = await this.composeUcaAsync(targetUca, purpose, parentId, resolvedContext, themeClasses, correlationId);
        controller.enqueue(composed);
        this.pulse(SignalType.COMPOSED, composed);
    }

    private async composeUcaAsync(
        targetUca: string,
        purpose: string,
        parentTo: string,
        parentContext?: string,
        themeClasses?: string[],
        correlationId?: string,
    ): Promise<ComposedResult> {
        const cid = correlationId ?? `${this.id}:compose:${targetUca}:${Date.now()}`;
        const prompt = this.formatPrompt(targetUca, purpose, parentTo, parentContext, themeClasses);
        console.log(`🎼 [Composer:Prompt] Componiendo #${targetUca}\n`, prompt);
        const text = await this.requestReasoning(prompt, cid, targetUca);
        const { nodes, rules } = this.parseComposedData(text);
        this.applyCustomRules(rules);
        return { targetUca, nodes, rules, correlationId: cid };
    }

    private requestReasoning(prompt: string, correlationId: string, targetUca: string): Promise<string> {
        return new Promise<string>((resolve) => {
            this.pendingReasonings.set(correlationId, resolve);
            const payload = { id: `${this.id}:web-llm`, request: prompt, model: DEFAULT_MODEL, provider: DEFAULT_PROVIDER, correlationId, targetUca };
            this.pulse(WebLlmSignalType.STREAM, payload);
        });
    }

    private formatPrompt(targetUca: string, purpose: string, parentTo: string, parentContext?: string, themeClasses?: string[]): string {
        const parentInfo = parentContext ? `(parentTo: "${parentTo}", contexto del padre: "${parentContext}")` : `(parentTo: "${parentTo}")`;
        const goal = `Compón la plantilla UCA para "${targetUca}" ${parentInfo}.`;
        const role = `Propósito: "${purpose}". Usa primitivas: box, action, input, list, picture, toggle, dropdown.`;
        const classes = themeClasses?.length ? `Clases OOCSS disponibles: ${themeClasses.join(', ')}` : '';
        const schema = 'JSON puro: {"nodes":[{"id":"<id>","uca":"<box|action|input|list|picture|toggle>","parentTo":"<parent>","body":{"className":"...","label":"...","text":"..."}}],"rules":[{"selector":"<sel>","declarations":{"<p>":"<v>"}}]}';
        const lines = [goal, role, classes, schema].filter(Boolean);
        return lines.join('\n');
    }

    private async handleStreamed(value: unknown, source: string): Promise<void> {
        if (!this.isOwnedSource(source)) { return; }
        const { correlationId, stream, targetUca = 'unknown' } = (value ?? {}) as { correlationId?: string; stream?: ReadableStream<string>; targetUca?: string };
        if (!stream) { return; }
        const text = await this.readFullStream(stream);
        const resolver = correlationId ? this.pendingReasonings.get(correlationId) : undefined;
        if (resolver) {
            this.pendingReasonings.delete(correlationId!);
            resolver(text);
            return;
        }
        this.finishComposition(text, targetUca, correlationId);
    }

    private finishComposition(text: string, targetUca: string, correlationId?: string): void {
        const { nodes, rules } = this.parseComposedData(text);
        this.applyCustomRules(rules);
        console.log(`🎼 [Composer:Composed] Compuestos ${nodes.length} nodos y ${rules.length} reglas para #${targetUca}`);
        this.pulse(SignalType.COMPOSED, { targetUca, nodes, rules, correlationId } satisfies ComposedResult);
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

    private parseComposedData(text: string): { nodes: TemplateNode[]; rules: CustomCssRule[] } {
        const cleaned = text.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
        try {
            const parsed = JSON.parse(cleaned) as Record<string, unknown>;
            const nodes = this.parseNodes(parsed.nodes);
            const rules = this.parseRules(parsed.rules);
            return { nodes, rules };
        } catch {
            return { nodes: [], rules: [] };
        }
    }

    private parseNodes(data: unknown): TemplateNode[] {
        if (!Array.isArray(data)) { return []; }
        const mapped = data.map((item) => this.normalizeNode((item ?? {}) as Record<string, unknown>));
        return mapped.filter((node): node is TemplateNode => Boolean(node));
    }

    private normalizeNode(item: Record<string, unknown>): TemplateNode | undefined {
        const { id, uca, parentTo, body = {}, purpose } = item;
        const validUcas = new Set(AVAILABLE_PRIMITIVES);
        if (typeof id !== 'string' || typeof parentTo !== 'string' || !validUcas.has(String(uca))) {
            return undefined;
        }
        const nodeBody = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {};
        const nodePurpose = typeof purpose === 'string' ? purpose : undefined;
        return { id, uca: uca as TemplateNode['uca'], parentTo, body: nodeBody, purpose: nodePurpose };
    }

    private parseRules(data: unknown): CustomCssRule[] {
        if (!Array.isArray(data)) { return []; }
        const mapped = data.map((item) => this.normalizeRule((item ?? {}) as Record<string, unknown>));
        return mapped.filter((rule): rule is CustomCssRule => Boolean(rule));
    }

    private normalizeRule(item: Record<string, unknown>): CustomCssRule | undefined {
        const { selector, declarations } = item;
        if (typeof selector !== 'string' || !declarations || typeof declarations !== 'object') {
            return undefined;
        }
        return { selector, declarations: declarations as Record<string, string> };
    }

    private applyCustomRules(rules: CustomCssRule[]): void {
        rules.forEach((rule) => this.pulse(CssSignalType.CREATE, rule));
    }

    private handleCssCreated(value: unknown): void {
        const { selector } = (value ?? {}) as { selector?: string };
        console.log(`🎨 [Composer:Css-Created] Regla personalizada inyectada: ${selector}`);
    }

    private handleDestroy(): void {
        this.pulse(WebLlmSignalType.DESTROY, { id: `${this.id}:web-llm` });
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private handleError(value: unknown, source: string): void {
        if (!this.isOwnedSource(source)) { return; }
        this.pulse(SignalType.ERROR, value);
    }

    private createWebLlmCapability(): Cooky {
        const { reactTo = [] } = WebLlm.disposition;
        const body = { id: `${this.id}:web-llm` };
        const aim = { description: 'Web LLM for template composition', body };
        return [[WebLlm, { aim, reactTo: [...reactTo] }]];
    }

    private createCssCapability(): Cooky {
        const { reactTo = [] } = Css.disposition;
        const body = { id: `${this.id}:css` };
        const aim = { description: 'CSS capability for Composer custom styles', body };
        return [[Css, { aim, reactTo: [...reactTo] }]];
    }
}

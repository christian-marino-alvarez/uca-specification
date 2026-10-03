import { Uca } from '@uca/core/uca';
import {
    DispositionSignal,
    type CapabilityConstructor,
    type Cooky,
    type CookyEntry,
    type Disposition,
    type DispositionProvidePayload,
    type ICapability,
    type Signal,
} from '@uca/core/types';
import { LlmWeb, SignalType as LlmWebSignalType } from '@uca/llm-web';
import { PromptApi, SignalType as PromptApiSignalType } from '@uca/capability-prompt-api';
import {
    Graph,
    SignalType as GraphSignalType,
    type UcaItem,
    type UcaStreamPayload,
} from '@uca/capability-graph';
import { Box } from '@uca/box';
import { Picture } from '@uca/picture';
import { Toggle } from '@uca/toggle';
import { Action } from '@uca/action';
import { List } from '@uca/list';
import { Input } from '@uca/input';
import { Dropdown } from '@uca/dropdown';
import { Choice } from '@uca/choice';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import {
    type Body,
    type ComposePayload,
    type ComposedResult,
    type UcaSchemaDefinition,
    DataType,
    SignalType,
} from './types.js';

export class ViewComposer extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: ViewComposer.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.COMPOSE, type: DataType.COMPOSE_PAYLOAD, description: 'Request cognitive view graph composition' },
            { signal: SignalType.REGISTER, type: DataType.UCA_SCHEMA_DEFINITION, description: 'Dynamically register a UCA schema definition' },
        ],
        outputs: [
            { signal: SignalType.COMPOSED, type: DataType.COMPOSED_RESULT, description: 'Emits composed view graph and dispositions' },
            { signal: SignalType.UCA_DETECTED, type: DataType.UCA_ITEM, description: 'Emits individual validated UCA detected from stream' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits cognitive composition error' },
        ],
    };

    private readonly activeUcas: Map<string, ICapability> = new Map();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public registerUca(definition: UcaSchemaDefinition): this {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const current = body.definitions ?? [];
        const filtered = current.filter((item) => item.name !== definition.name);
        const definitions = [...filtered, definition];
        this.disposition = { ...this.disposition, aim: { ...aim, body: { ...body, definitions } } };
        return this;
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ViewComposer.disposition;
        const { reactTo = [] } = base;
        const signals = [...new Set([...reactTo, ...this.getInternalSignals()])];
        const targetWithMax = target as unknown as { setMaxListeners?: (limit: number) => void };
        targetWithMax?.setMaxListeners?.(50);
        return super.innervate(target, { ...base, reactTo: signals });
    }

    public override denervate(): void {
        super.denervate();
        for (const uca of this.activeUcas.values()) {
            uca.denervate();
        }
        this.activeUcas.clear();
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, endpoint, sseEndpoint, factory } = (aim.body ?? {}) as Body;
        const promptDisp: Disposition = { aim: { description: PromptApi.AIM, body: { factory } }, reactTo: [...PromptApi.disposition.reactTo ?? []] };
        const llmDisp: Disposition = { aim: { description: LlmWeb.purpose, body: { model, endpoint, sseEndpoint } }, reactTo: [...LlmWeb.disposition.reactTo ?? []] };
        const graphDisp: Disposition = { aim: { description: Graph.AIM, body: {} }, reactTo: [...Graph.disposition.reactTo ?? []] };
        const ucas = [Box, Picture, Toggle, Action, List, Input, Dropdown, Choice];
        const webCooky = ucas.map((U) => [U as unknown as CapabilityConstructor, { aim: { description: U.purpose, body: {} }, reactTo: [...U.disposition.reactTo ?? []] } as Disposition] as CookyEntry);
        return [[PromptApi, promptDisp], [LlmWeb, llmDisp], [Graph, graphDisp], ...webCooky];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.COMPOSE:
                this.handleCompose(value);
                break;
            case SignalType.REGISTER:
                this.handleRegister(value);
                break;
            case DispositionSignal.PROVIDE:
                this.handleDispositionProvide(value);
                break;
            case GraphSignalType.UCA_STREAM:
                this.handleUcaStream(value);
                break;
            case LlmWebSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private getInternalSignals(): readonly string[] {
        return [
            LlmWebSignalType.STREAM_DECODED,
            LlmWebSignalType.ERROR,
            GraphSignalType.UCA_STREAM,
            DispositionSignal.PROVIDE,
        ];
    }

    private handleDispositionProvide(value: unknown): void {
        const payload = (value ?? {}) as DispositionProvidePayload;
        const { ucaId, prefix, purpose, disposition, ucaConstructor } = payload;
        if (!ucaId || !disposition || ucaId === this.id) { return; }
        const name = ucaId.includes(':') ? ucaId.split(':')[1] : ucaId;
        const description = purpose ?? disposition.aim?.description ?? '';
        const definition: UcaSchemaDefinition = { name: name ?? ucaId, prefix: prefix ?? ucaId, description, disposition, ucaConstructor };
        this.registerUca(definition);
    }

    private handleCompose(value: unknown): void {
        const payload = (value ?? {}) as ComposePayload;
        const { request, ucas } = payload;
        if (ucas) { return void this.handleDirectComposition(ucas); }
        if (request) { this.dispatchComposeRequest(payload); }
    }

    private dispatchComposeRequest(payload: ComposePayload): void {
        this.pulse(DispositionSignal.GET, { source: this.id });
        const { request = '', model, documentation } = payload;
        const { aim } = this.disposition;
        const prompt = this.buildPrompt(request, documentation ?? aim.body?.documentation);
        if (this.isPromptApiAvailable()) {
            return void this.pulse(PromptApiSignalType.STREAM, { prompt });
        }
        this.pulse(LlmWebSignalType.STREAM, { prompt, model });
    }

    private isPromptApiAvailable(): boolean {
        const { aim } = this.disposition;
        const { factory } = (aim.body ?? {}) as Body;
        const globalAi = (globalThis as unknown as { ai?: { languageModel?: unknown } }).ai;
        return Boolean(factory ?? globalAi?.languageModel);
    }

    private handleRegister(value: unknown): void {
        if (Array.isArray(value)) {
            return void value.forEach((item) => this.handleRegister(item));
        }
        const definition = (value ?? {}) as UcaSchemaDefinition;
        const { name, bodySchema } = definition;
        if (name && bodySchema) { this.registerUca(definition); }
    }

    private handleUcaStream(value: unknown): void {
        const payload = (value ?? {}) as UcaStreamPayload;
        const { stream, streamId } = payload;
        if (!stream) { return; }
        const sessionUcas: Record<string, Disposition> = {};
        const consumer = this.createUcaConsumer(sessionUcas, streamId);
        stream.pipeTo(consumer).catch((error: unknown) => {
            this.pulse(SignalType.ERROR, error);
        });
    }

    private createUcaConsumer(sessionUcas: Record<string, Disposition>, streamId?: string): WritableStream<UcaItem> {
        return new WritableStream<UcaItem>({
            write: (uca: UcaItem) => this.consumeStreamUca(uca, sessionUcas, streamId),
            close: () => this.handleStreamCompleted(sessionUcas),
        });
    }

    private consumeStreamUca(uca: UcaItem, sessionUcas: Record<string, Disposition>, streamId?: string): void {
        const { id, disposition } = uca;
        if (!id || !disposition) { return; }
        sessionUcas[id] = disposition;
        this.instantiateDynamicUca(id, disposition);
        this.pulse(DispositionSignal.UPDATE, { id, disposition });
        this.pulse(SignalType.UCA_DETECTED, { id, disposition, streamId });
        this.pulse(GraphSignalType.UCA_DETECTED, { id, disposition, streamId });
    }

    private handleStreamCompleted(sessionUcas: Record<string, Disposition>): void {
        this.mountHierarchicalElements(sessionUcas);
        this.updateViewDisposition(sessionUcas);
        const composed: ComposedResult = { ucas: sessionUcas };
        this.pulse(SignalType.COMPOSED, composed);
    }

    private mountHierarchicalElements(ucas: Record<string, Disposition>): void {
        if (typeof document === 'undefined') { return; }
        for (const [childId, disposition] of Object.entries(ucas)) {
            const { parentTo } = disposition;
            if (parentTo?.uca) { this.attachChildToParent(childId, parentTo.uca); }
        }
    }

    private attachChildToParent(childId: string, parentId: string): void {
        const childEl = this.findDomElement(childId);
        const parentEl = this.findDomElement(parentId);
        if (childEl && parentEl && !parentEl.contains(childEl)) {
            parentEl.appendChild(childEl);
        }
    }

    private findDomElement(id: string): HTMLElement | null {
        const resolvedId = id.includes(':') ? id.split(':')[1] : id;
        return document.getElementById(resolvedId ?? id) ?? document.getElementById(id);
    }

    private instantiateDynamicUca(id: string, disposition: Disposition): void {
        const existing = this.activeUcas.get(id);
        if (existing) { return void existing.innervate(this.target, disposition); }
        const prefix = id.includes(':') ? id.split(':')[0] : id;
        const definition = this.findDefinitionByPrefix(prefix ?? id);
        const instance = this.createDynamicInstance(id, definition);
        if (instance) {
            instance.innervate(this.target, disposition);
            this.activeUcas.set(id, instance);
        }
    }

    private createDynamicInstance(id: string, definition?: UcaSchemaDefinition): ICapability | undefined {
        const { ucaConstructor } = definition ?? {};
        if (!ucaConstructor) { return undefined; }
        const Factory = ucaConstructor as new (id: string) => ICapability;
        return new Factory(id);
    }

    private getDefinitions(): readonly UcaSchemaDefinition[] {
        const { aim } = this.disposition;
        const { definitions = [] } = (aim.body ?? {}) as Body;
        return definitions;
    }

    private findDefinitionByPrefix(prefix: string): UcaSchemaDefinition | undefined {
        const definitions = this.getDefinitions();
        return definitions.find((item) => item.prefix === prefix);
    }

    private formatDefinition(definition: UcaSchemaDefinition): string {
        const { name, prefix, description, disposition, emittedSignals } = definition;
        const outputs = disposition?.outputs ?? [];
        const outputsEmitted = outputs.map((out) => `"${prefix}:<id>.${out.signal}"`);
        const manualEmitted = emittedSignals?.map((s) => `"${prefix}:<id>.${s}"`) ?? [];
        const allEmitted = [...outputsEmitted, ...manualEmitted];
        const emittedStr = allEmitted.length > 0 ? allEmitted.join(', ') : 'none';
        const bodyContent = this.formatBodyContent(definition);
        return `- ${name} (prefix "${prefix}:<id>"): ${description}\n  Allowed aim.body: ${bodyContent}\n  Emits outcomes: ${emittedStr}`;
    }

    private formatBodyContent(definition: UcaSchemaDefinition): string {
        const { disposition, bodySchema } = definition;
        const schemaWithShape = bodySchema as unknown as { shape?: Record<string, unknown> };
        if (schemaWithShape && typeof schemaWithShape.shape === 'object' && schemaWithShape.shape !== null) {
            const keys = Object.keys(schemaWithShape.shape);
            return `{ ${keys.map((k) => `${k}?: string`).join(', ')} }`;
        }
        const body = disposition?.aim?.body;
        return body && Object.keys(body).length > 0 ? JSON.stringify(body) : '{}';
    }

    private buildCatalogSpecification(): string {
        const definitions = this.getDefinitions();
        if (definitions.length === 0) { return ''; }
        const lines = definitions.map((d) => this.formatDefinition(d));
        return `Available UCAs Catalog (Dynamic Schemas):\n${lines.join('\n')}\n\n`;
    }

    private buildPrompt(request: string, documentation?: string): string {
        const catalog = this.buildCatalogSpecification();
        const guidelines = this.getViewGuidelines();
        const outputContract = this.getOutputSchemaContract();
        const contextDoc = documentation ? `${documentation}\n\n` : '';
        return `${contextDoc}${catalog}${guidelines}\n\nTask: ${request}\n${outputContract}`;
    }

    private getViewGuidelines(): string {
        const line1 = 'VIEW IMAGINATION GUIDELINES:\n- Imagine and compose an engaging, didactic view hierarchy for developers from scratch. Do not use any hardcoded structure.';
        const line2 = '- Assign unique descriptive IDs (e.g. "box:hero", "picture:architecture", "list:advantages", "list:strengths", "box:what-is-not-uca", "action:explore").';
        const line3 = '- Connect interactive triggers with real reactTo subscriptions (e.g. reactTo: ["action:explore.triggered"]).';
        const line4 = '- Use "parentTo": { "uca": "<parentUcaId>", "relation": "..." } for structural visual nesting inside parent containers. Root containers omit parentTo.';
        return `${line1}\n${line2}\n${line3}\n${line4}`;
    }

    private getOutputSchemaContract(): string {
        const schema = 'OUTPUT JSON SCHEMA (Strict response format):\n{\n  "data": {\n    "ucas": [\n      {\n        "id": "<prefix>:<uniqueName>",\n        "disposition": {\n          "aim": { "description": string, "body": { ...only valid keys from UCA schema... } },\n          "reactTo": ["<producerUcaId>.<emittedOutcome>"],\n          "parentTo": { "uca": "<parentUcaId>", "relation": "<description of relation>" }\n        }\n      }\n    ],\n    "answer": "<concise explanation>"\n  },\n  "error": null,\n  "metadata": {}\n}';
        const rules = 'CRITICAL RULES:\n1. reactTo: external signals from OTHER UCAs (e.g. ["action:explore.triggered"]). Empty array [] if no trigger.\n2. parentTo: structural visual hierarchy { "uca": "<parentUcaId>", "relation": "child" }. Omit on root containers.\n3. FORBIDDEN: NEVER put a UCA\'s own name in its reactTo.';
        return `${schema}\n\n${rules}`;
    }

    private handleDirectComposition(ucas: Record<string, Disposition>): void {
        for (const [id, disposition] of Object.entries(ucas)) {
            this.instantiateDynamicUca(id, disposition);
            this.pulse(DispositionSignal.UPDATE, { id, disposition });
        }
        this.handleStreamCompleted(ucas);
    }



    private updateViewDisposition(ucas: Record<string, Disposition>, answer?: string): void {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const updatedBody = { ...body, ucas, answer };
        this.disposition = { ...this.disposition, aim: { ...aim, body: updatedBody } };
    }
}

export * from './constants.js';
export * from './types.js';
export { ViewComposer as ViewBuilder };

import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, ICapability, Signal } from '@uca/core/types';
import { LlmWeb, SignalType as LlmWebSignalType } from '@uca/llm-web';
import { PromptApi, SignalType as PromptApiSignalType } from '@uca/capability-prompt-api';
import { Graph, SignalType as GraphSignalType, type ResolvedResult, type ViewGraph } from '@uca/capability-graph';
import { Box } from '@uca/box';
import { Picture } from '@uca/picture';
import { Toggle } from '@uca/toggle';
import { Action } from '@uca/action';
import { List } from '@uca/list';
import { Input } from '@uca/input';
import { Dropdown } from '@uca/dropdown';
import { Choice } from '@uca/choice';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { buildDynamicCatalogSpecification, createDefaultUcaDefinitions } from './registry.js';
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
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits cognitive composition error' },
        ],
    };

    private readonly registeredSchemas: Map<string, UcaSchemaDefinition> = new Map();
    private readonly activeUcas: Map<string, ICapability> = new Map();
    private isComposing: boolean = false;
    private retryCount: number = 0;

    public constructor(id: string = __ID__) {
        super(id);
        this.initializeDefaultSchemas();
    }

    public registerUca(definition: UcaSchemaDefinition): this {
        const { name } = definition;
        this.registeredSchemas.set(name, definition);
        return this;
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ViewComposer.disposition;
        const { reactTo = [] } = base;
        const internalSignals = this.getInternalSignals();
        const signals = [...new Set([...reactTo, ...internalSignals])];
        const targetWithMax = target as unknown as { setMaxListeners?: (limit: number) => void };
        if (typeof targetWithMax?.setMaxListeners === 'function') {
            targetWithMax.setMaxListeners(50);
        }
        return super.innervate(target, { ...base, reactTo: signals });
    }

    public override denervate(): void {
        super.denervate();
        for (const uca of this.activeUcas.values()) {
            uca.denervate();
        }
        this.activeUcas.clear();
        this.isComposing = false;
    }

    protected override capabilities(): Cooky {
        const reasoning = this.getReasoningCapabilities();
        const webComponents = this.getWebComponentCapabilities();
        return [...reasoning, ...webComponents];
    }

    private getReasoningCapabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, endpoint, sseEndpoint, factory } = (aim.body ?? {}) as Body;
        const promptDisp: Disposition = { aim: { description: PromptApi.AIM, body: { factory } }, reactTo: [...PromptApi.disposition.reactTo ?? []] };
        const llmDisp: Disposition = { aim: { description: LlmWeb.purpose, body: { model, endpoint, sseEndpoint } }, reactTo: [...LlmWeb.disposition.reactTo ?? []] };
        const graphDisp: Disposition = { aim: { description: Graph.AIM, body: {} }, reactTo: [...Graph.disposition.reactTo ?? []] };
        return [[PromptApi, promptDisp], [LlmWeb, llmDisp], [Graph, graphDisp]];
    }

    private getWebComponentCapabilities(): Cooky {
        const ucaClasses = [Box, Picture, Toggle, Action, List, Input, Dropdown, Choice];
        return ucaClasses.map((UcaClass) => this.createCookyEntry(UcaClass as unknown as typeof Uca)) as unknown as Cooky;
    }

    private createCookyEntry(UcaClass: typeof Uca): [typeof Uca, Disposition] {
        const disposition: Disposition = { aim: { description: UcaClass.purpose, body: {} }, reactTo: [...UcaClass.disposition.reactTo ?? []] };
        return [UcaClass, disposition];
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
            case PromptApiSignalType.RESPONDED:
            case LlmWebSignalType.RESPONSE:
                this.handleLlmResponse(value);
                break;
            case GraphSignalType.UCA_DETECTED:
                this.handleUcaDetected(value);
                break;
            case GraphSignalType.RESOLVED:
                this.handleGraphResolved(value);
                break;
            case GraphSignalType.RETRY:
                this.handleRetry(value);
                break;
            case LlmWebSignalType.ERROR:
                this.isComposing = false;
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private initializeDefaultSchemas(): void {
        const defaultDefinitions = createDefaultUcaDefinitions();
        defaultDefinitions.forEach((definition) => this.registerUca(definition));
    }

    private getInternalSignals(): readonly string[] {
        return [
            LlmWebSignalType.RESPONSE, LlmWebSignalType.CHUNK,
            LlmWebSignalType.COMPLETED, LlmWebSignalType.ERROR,
            PromptApiSignalType.RESPONDED, PromptApiSignalType.CHUNK,
            PromptApiSignalType.STREAM_END,
            GraphSignalType.RESOLVED, GraphSignalType.RETRY,
            GraphSignalType.UCA_DETECTED,
        ];
    }

    private handleCompose(value: unknown): void {
        const payload = (value ?? {}) as ComposePayload;
        const { ucas, request, definitions } = payload;
        if (definitions) {
            definitions.forEach((def) => this.registerUca(def));
        }
        if (ucas) {
            this.pulse(GraphSignalType.RESOLVE, { ucas });
            return;
        }
        if (request && !this.isComposing) {
            this.isComposing = true;
            this.dispatchComposeRequest(payload);
        }
    }

    private dispatchComposeRequest(payload: ComposePayload): void {
        const { request = '', model, documentation, stream } = payload;
        const { aim } = this.disposition;
        const activeDocs = documentation ?? aim.body?.documentation;
        const prompt = this.buildPrompt(request, activeDocs);
        const hasPromptApi = this.isPromptApiAvailable();
        if (hasPromptApi) {
            this.pulse(PromptApiSignalType.STREAM, { prompt });
            return;
        }
        const signal = stream ? LlmWebSignalType.STREAM : LlmWebSignalType.PROMPT;
        this.pulse(signal, { prompt, model });
    }

    private isPromptApiAvailable(): boolean {
        const { aim } = this.disposition;
        const { factory } = (aim.body ?? {}) as Body;
        const globalAi = (globalThis as unknown as { ai?: { languageModel?: unknown } }).ai;
        return Boolean(factory ?? globalAi?.languageModel);
    }

    private handleRegister(value: unknown): void {
        if (Array.isArray(value)) {
            value.forEach((item) => this.handleRegister(item));
            return;
        }
        const definition = (value ?? {}) as UcaSchemaDefinition;
        const { name, bodySchema } = definition;
        if (name && bodySchema) {
            this.registerUca(definition);
        }
    }

    private handleUcaDetected(value: unknown): void {
        const { id, disposition } = (value ?? {}) as { id?: string; disposition?: Disposition };
        if (!id || !disposition) { return; }
        this.instantiateDynamicUca(id, disposition);
    }

    private instantiateDynamicUca(id: string, disposition: Disposition): void {
        const existing = this.activeUcas.get(id);
        if (existing) {
            existing.innervate(this.target, disposition);
            return;
        }
        const prefix = id.includes(':') ? id.split(':')[0] : id;
        const definition = this.findDefinitionByPrefix(prefix);
        if (!definition?.constructor) { return; }
        const Factory = definition.constructor as new (id: string) => ICapability;
        const instance = new Factory(id);
        instance.innervate(this.target, disposition);
        this.activeUcas.set(id, instance);
    }

    private findDefinitionByPrefix(prefix: string): UcaSchemaDefinition | undefined {
        for (const definition of this.registeredSchemas.values()) {
            if (definition.prefix === prefix) {
                return definition;
            }
        }
        return undefined;
    }

    private handleRetry(value: unknown): void {
        if (this.retryCount >= 1) { return; }
        this.retryCount++;
        const { raw, reason } = (value ?? {}) as { raw?: string; reason?: string };
        const { aim } = this.disposition;
        const { model } = (aim.body ?? {}) as Body;
        const retryPrompt = `Retrying UCA generation. Previous fragment: ${raw ?? ''}. Error: ${reason ?? 'Schema error'}. Return valid UCA JSON.`;
        this.pulse(LlmWebSignalType.STREAM, { prompt: retryPrompt, model });
    }

    private buildPrompt(request: string, documentation?: string): string {
        const catalog = buildDynamicCatalogSpecification(this.registeredSchemas.values());
        const guidelines = this.getViewGuidelines();
        const outputContract = this.getOutputSchemaContract();
        const contextDoc = documentation ? `${documentation}\n\n` : '';
        return `${contextDoc}${catalog}\n\n${guidelines}\n\nTask: ${request}\n${outputContract}`;
    }

    private getViewGuidelines(): string {
        const line1 = 'VIEW IMAGINATION GUIDELINES:\n- Imagine and compose an engaging, didactic view hierarchy for developers from scratch. Do not use any hardcoded structure.';
        const line2 = '- Assign unique descriptive IDs (e.g. "box:hero", "picture:architecture", "list:advantages", "list:strengths", "box:what-is-not-uca", "action:explore").';
        const line3 = '- Connect interactive triggers with real reactTo subscriptions (e.g. reactTo: ["action:explore.triggered"]).';
        return `${line1}\n${line2}\n${line3}`;
    }

    private getOutputSchemaContract(): string {
        const schema = 'OUTPUT JSON SCHEMA (Strict response format):\n{\n  "data": {\n    "ucas": [\n      {\n        "id": "<prefix>:<uniqueName>",\n        "disposition": {\n          "aim": { "description": string, "body": { ...only valid keys from UCA schema... } },\n          "reactTo": ["<producerUcaId>.<emittedOutcome>"]\n        }\n      }\n    ],\n    "answer": "<concise explanation>"\n  },\n  "error": null,\n  "metadata": {}\n}';
        const rules = 'CRITICAL RULES FOR REACTTO:\n1. reactTo specifies external signals from OTHER UCAs that trigger this UCA (e.g. ["action:simulate-pulse.triggered"]).\n2. If a UCA has no external dependencies, its reactTo MUST be [] (empty array).\n3. FORBIDDEN: NEVER put a UCA\'s own name or internal operations in its own reactTo (e.g. a Box never listens to its own signals, an Action never listens to itself).';
        return `${schema}\n\n${rules}`;
    }

    private handleLlmResponse(value: unknown): void {
        this.pulse(GraphSignalType.RESOLVE, value);
    }

    private handleGraphResolved(value: unknown): void {
        this.isComposing = false;
        this.retryCount = 0;
        const resolved = (value ?? {}) as ResolvedResult;
        const { ucas, graph, answer } = resolved;
        for (const [id, disposition] of Object.entries(ucas)) {
            this.instantiateDynamicUca(id, disposition);
        }
        this.updateViewDisposition(ucas, graph, answer);
        const composed: ComposedResult = { ucas, graph, result: { answer } };
        this.pulse(SignalType.COMPOSED, composed);
    }

    private updateViewDisposition(ucas: Record<string, Disposition>, graph: ViewGraph, answer?: string): void {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const updatedBody = { ...body, ucas, graph, answer };
        this.disposition = { ...this.disposition, aim: { ...aim, body: updatedBody } };
    }
}

export * from './constants.js';
export * from './types.js';
export * from './registry.js';
export { ViewComposer as ViewBuilder };

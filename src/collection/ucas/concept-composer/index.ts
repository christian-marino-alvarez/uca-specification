import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { LlmWeb, SignalType as LlmWebSignalType } from '@uca/llm-web';
import {
    __ID__,
    DEFAULT_CONCEPT_MAP,
    DEFAULT_MODEL,
    DEFAULT_PROVIDER,
    DEFAULT_SIGNALS,
    PURPOSE,
} from './constants.js';
import { buildConceptPrompt } from './prompt.js';
import { CONCEPT_MAP_SCHEMA, conceptMapSchema } from './schemas/index.js';
import { type Body, type ConceptMap, DataType, SignalType } from './types.js';

function parseConceptMap(content?: string): ConceptMap {
    if (!content) { return DEFAULT_CONCEPT_MAP; }
    const cleaned = content.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    try {
        const parsed = JSON.parse(cleaned);
        const result = conceptMapSchema.safeParse(parsed);
        return result.success ? result.data : DEFAULT_CONCEPT_MAP;
    } catch {
        return DEFAULT_CONCEPT_MAP;
    }
}

export class ConceptComposer extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: ConceptComposer.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.VOID, description: 'Initialize conceptual map generation' },
            { signal: SignalType.UPDATE, type: DataType.VOID, description: 'Update conceptual map' },
            { signal: SignalType.REMOVE, type: DataType.VOID, description: 'Tear down conceptual map' },
            { signal: LlmWebSignalType.RESPONSE, type: DataType.RECORD, description: 'Receive LLM concept synthesis' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.CONCEPT_MAP, description: 'Thematic concept map created' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'Thematic concept map updated' },
            { signal: SignalType.REMOVED, type: DataType.RECORD, description: 'Thematic concept map torn down' },
            { signal: LlmWebSignalType.PROMPT, type: DataType.RECORD, description: 'Request concept map from LLM' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ConceptComposer.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [LlmWebSignalType.RESPONSE, LlmWebSignalType.ERROR];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    public override denervate(): void {
        super.denervate();
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model = DEFAULT_MODEL, provider = DEFAULT_PROVIDER, endpoint, sseEndpoint, factory, thinkingBudget = 0 } = (aim.body ?? {}) as Body;
        const llmDisp: Disposition = {
            aim: { description: LlmWeb.purpose, body: { id: `llm-web:${this.id}`, model, provider, endpoint, sseEndpoint, factory, thinkingBudget } },
            reactTo: [...LlmWeb.disposition.reactTo ?? []],
        };
        return [[LlmWeb, llmDisp]];
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
            case LlmWebSignalType.RESPONSE:
                this.handleLlmResponse(value);
                break;
            case LlmWebSignalType.ERROR:
                this.handleLlmError(value);
                break;
            default:
                break;
        }
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        const { concept, prompt, title } = payload;
        if (concept) {
            this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), concept });
            return;
        }
        const request = prompt ?? title ?? this.disposition.aim.description;
        const fullPrompt = buildConceptPrompt(request);
        const { model = DEFAULT_MODEL, provider = DEFAULT_PROVIDER, thinkingBudget } = payload;
        const correlationId = `concept-${this.id}-${Date.now()}`;
        this.pulse(LlmWebSignalType.PROMPT, { id: `llm-web:${this.id}`, correlationId, prompt: fullPrompt, schema: CONCEPT_MAP_SCHEMA, model, provider, thinkingBudget });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.UPDATED, { ...this.getDomainProperties(), ...payload });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.REMOVED, { ...this.getDomainProperties(), ...payload });
    }

    private handleLlmResponse(value: unknown): void {
        const { response, data, correlationId } = (value ?? {}) as { response?: string; data?: unknown; correlationId?: string };
        if (correlationId && !correlationId.includes(this.id)) { return; }
        const concept = (data as ConceptMap) ?? parseConceptMap(response);
        console.log(`💡 [CONCEPT-COMPOSER] Mapa conceptual sintetizado: "${concept.theme.name}" (${concept.capabilities.length} capacidades, ${concept.zones.length} zonas)`);
        this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), concept });
    }

    private handleLlmError(value: unknown): void {
        console.warn('⚠️ [CONCEPT-COMPOSER] LLM error en síntesis conceptual, aplicando fallback:', value);
        this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), concept: DEFAULT_CONCEPT_MAP });
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}

export * from './constants.js';
export * from './types.js';
export * from './prompt.js';
export * from './schemas/index.js';

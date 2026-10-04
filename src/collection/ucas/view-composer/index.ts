import { Uca } from '@uca/core/uca';
import {
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
    type ICapability,
    type Signal,
} from '@uca/core/types';
import { LlmWeb, SignalType as LlmWebSignalType } from '@uca/llm-web';
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
import { Access } from '@uca/access';
import { Collector } from '@uca/collector';
import { SignalType as ConceptComposerSignalType, type ConceptMap } from '@uca/concept-composer/types';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { buildCompositionPrompt, getCommunicationJsonSchema } from './prompt.js';
import { type Body, DataType, SignalType } from './types.js';

const UCA_CATALOG: Record<string, CapabilityConstructor> = {
    box: Box as unknown as CapabilityConstructor,
    picture: Picture as unknown as CapabilityConstructor,
    toggle: Toggle as unknown as CapabilityConstructor,
    action: Action as unknown as CapabilityConstructor,
    list: List as unknown as CapabilityConstructor,
    input: Input as unknown as CapabilityConstructor,
    dropdown: Dropdown as unknown as CapabilityConstructor,
    choice: Choice as unknown as CapabilityConstructor,
    access: Access as unknown as CapabilityConstructor,
    collector: Collector as unknown as CapabilityConstructor,
};

const WEB_UCAS: CapabilityConstructor[] = Object.values(UCA_CATALOG);

function createUcaEntry(UcaClass: CapabilityConstructor): [CapabilityConstructor, Disposition] {
    const TargetClass = UcaClass as unknown as typeof Uca;
    const { purpose, disposition } = TargetClass;
    const { reactTo = [] } = disposition ?? {};
    return [UcaClass, { aim: { description: purpose, body: {} }, reactTo: [...reactTo] }];
}

export class ViewComposer extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: ViewComposer.purpose, body: {} },
        reactTo: [ConceptComposerSignalType.CREATED, GraphSignalType.UCA_STREAM, SignalType.UPDATE, SignalType.REMOVE],
        inputs: [
            { signal: ConceptComposerSignalType.CREATED, type: DataType.CONCEPT_MAP, description: 'Compose view from conceptual map' },
            { signal: SignalType.UPDATE, type: DataType.VOID, description: 'Update view composition scaffolding' },
            { signal: SignalType.REMOVE, type: DataType.VOID, description: 'Tear down view composition scaffolding' },
            { signal: GraphSignalType.UCA_STREAM, type: DataType.STREAM, description: 'Stream of parsed UCA candidates' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RECORD, description: 'View composition initialized' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'View composition updated' },
            { signal: SignalType.REMOVED, type: DataType.RECORD, description: 'View composition torn down' },
            { signal: LlmWebSignalType.STREAM, type: DataType.RECORD, description: 'Request token stream from LLM' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ViewComposer.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [ConceptComposerSignalType.CREATED, GraphSignalType.UCA_STREAM];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, provider, endpoint, sseEndpoint, factory } = (aim.body ?? {}) as Body;
        const llmDisp: Disposition = { aim: { description: LlmWeb.purpose, body: { id: `llm-web:${this.id}`, model, provider, endpoint, sseEndpoint, factory } }, reactTo: [...LlmWeb.disposition.reactTo ?? []] };
        const graphDisp: Disposition = { aim: { description: Graph.AIM, body: {} }, reactTo: [...Graph.disposition.reactTo ?? []] };
        return [[LlmWeb, llmDisp], [Graph, graphDisp]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case ConceptComposerSignalType.CREATED:
                this.handleCreate(value);
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            case GraphSignalType.UCA_STREAM:
                this.handleUcaStream(value);
                break;
            default:
                break;
        }
    }

    private streamStartTime: number = 0;
    private renderedCount: number = 0;

    private handleCreate(value: unknown): void {
        this.streamStartTime = Date.now();
        this.renderedCount = 0;
        const payload = (value ?? {}) as Body;
        const { concept, prompt, model, provider, documentation, factory } = payload;
        const request = this.formatRequest(concept, prompt ?? payload.title);
        const fullPrompt = buildCompositionPrompt(request, UCA_CATALOG, documentation);
        const streamId = `view-${this.id}-${Date.now()}`;
        this.pulse(LlmWebSignalType.STREAM, { id: `llm-web:${this.id}`, correlationId: streamId, streamId, prompt: fullPrompt, model, provider, factory, schema: getCommunicationJsonSchema() });
        this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), ...payload });
    }

    private formatRequest(concept?: ConceptMap, title?: string): string {
        if (!concept) { return title ?? this.disposition.aim.description; }
        const { theme, capabilities, zones } = concept;
        const { name, essence, mood, aesthetic } = theme;
        const caps = capabilities.map((c) => `- ${c.name}: ${c.purpose}`).join('\n');
        const zonesDesc = zones.map((z) => `- Zone "${z.name}" -> Materialize UCAs for: [${z.capabilities.join(', ')}]`).join('\n');
        const themeDetails = [name, essence, mood, aesthetic].filter(Boolean).join(' | ');
        return `THEMATIC CONCEPT: ${themeDetails}\n\nCONCEPTUAL CAPABILITIES:\n${caps}\n\nZONES TO MATERIALIZE:\n${zonesDesc}\n\nINSTRUCTION: Structure each Zone as a container Box, and instantiate child UCAs for each capability.`;
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.UPDATED, { ...this.getDomainProperties(), ...payload });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.REMOVED, { ...this.getDomainProperties(), ...payload });
    }

    private readonly instances: Map<string, ICapability> = new Map();

    public override denervate(): void {
        super.denervate();
        for (const uca of this.instances.values()) {
            uca.denervate();
        }
        this.instances.clear();
    }

    private handleUcaStream(value: unknown): void {
        const payload = (value ?? {}) as UcaStreamPayload;
        const { stream, streamId } = payload;
        if (!stream || (streamId && !streamId.includes(this.id))) { return; }
        const consumer = new WritableStream<UcaItem>({
            write: (item: UcaItem) => this.handleUcaItem(item),
            close: () => this.handleStreamClose(),
        });
        stream.pipeTo(consumer).catch(() => { });
    }

    private handleUcaItem(item: UcaItem): void {
        const { id, disposition } = item;
        if (!id || !disposition) { return; }
        this.renderedCount += 1;
        const elapsed = this.streamStartTime ? Date.now() - this.streamStartTime : 0;
        console.log(`⚡ [STREAM-RENDER] [t=+${elapsed}ms] UCA #${this.renderedCount} montada en DOM en vivo: "${id}"`);
        const uca = this.resolveUcaInstance(id);
        uca?.innervate(this.target, disposition);
    }

    private handleStreamClose(): void {
        const elapsed = this.streamStartTime ? Date.now() - this.streamStartTime : 0;
        console.log(`🏁 [STREAM-RENDER] [t=+${elapsed}ms] Stream completado. Total UCAs renderizadas en vivo: ${this.renderedCount}`);
    }

    private resolveUcaInstance(id: string): ICapability | undefined {
        const existing = this.instances.get(id);
        if (existing) { return existing; }
        const [prefix] = id.split(':');
        const resolved = prefix && UCA_CATALOG[prefix] ? prefix : 'box';
        const Factory = UCA_CATALOG[resolved] as unknown as new (id: string) => ICapability;
        const instance = new Factory(id);
        this.instances.set(id, instance);
        return instance;
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}

export * from './constants.js';
export * from './types.js';
export * from './prompt.js';

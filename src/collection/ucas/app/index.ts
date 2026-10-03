import { Uca } from '@uca/core/uca';
import {
    DispositionSignal,
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
    type ICapability,
    type Signal,
} from '@uca/core/types';
import { PromptApi, SignalType as PromptApiSignalType } from '@uca/capability-prompt-api';
import { LlmWeb, SignalType as LlmWebSignalType } from '@uca/llm-web';
import {
    Graph,
    SignalType as GraphSignalType,
    type UcaItem,
    type UcaStreamPayload,
} from '@uca/capability-graph';
import { ViewComposer, SignalType as ViewComposerSignalType, type Body as ViewComposerBody } from '@uca/view-composer';
import { Box } from '@uca/box';
import { Picture } from '@uca/picture';
import { Toggle } from '@uca/toggle';
import { Action } from '@uca/action';
import { List } from '@uca/list';
import { Input } from '@uca/input';
import { Dropdown } from '@uca/dropdown';
import { Choice } from '@uca/choice';
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { buildAppPrompt } from './prompt.js';
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
};

export class App extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: App.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.VOID, description: 'Initialize application scaffolding' },
            { signal: SignalType.UPDATE, type: DataType.VOID, description: 'Update application scaffolding' },
            { signal: SignalType.REMOVE, type: DataType.VOID, description: 'Tear down application scaffolding' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RECORD, description: 'Application initialized' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'Application state updated' },
            { signal: SignalType.REMOVED, type: DataType.RECORD, description: 'Application torn down' },
        ],
    };

    private readonly instances: Map<string, ICapability> = new Map();
    private hasInitialized: boolean = false;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? App.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [ViewComposerSignalType.CREATED, GraphSignalType.UCA_STREAM, LlmWebSignalType.ERROR];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        super.innervate(target, { ...base, reactTo: signals });
        this.pulse(SignalType.CREATE, this.getDomainProperties());
        return this;
    }

    public override denervate(): void {
        super.denervate();
        for (const instance of this.instances.values()) {
            instance.denervate();
        }
        this.instances.clear();
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, endpoint, sseEndpoint, factory } = (aim.body ?? {}) as Body;
        const promptDisp: Disposition = { aim: { description: PromptApi.AIM, body: { factory } }, reactTo: [...PromptApi.disposition.reactTo ?? []] };
        const llmDisp: Disposition = { aim: { description: LlmWeb.purpose, body: { model, endpoint, sseEndpoint } }, reactTo: [...LlmWeb.disposition.reactTo ?? []] };
        const graphDisp: Disposition = { aim: { description: Graph.AIM, body: {} }, reactTo: [...Graph.disposition.reactTo ?? []] };
        const viewDisp: Disposition<ViewComposerBody> = { aim: { description: ViewComposer.purpose, body: {} }, reactTo: [...ViewComposer.disposition.reactTo ?? []] };
        return [[ViewComposer, viewDisp], [PromptApi, promptDisp], [LlmWeb, llmDisp], [Graph, graphDisp]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate();
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            case ViewComposerSignalType.CREATED:
                this.handleViewCreated(value);
                break;
            case GraphSignalType.UCA_STREAM:
                this.handleUcaStream(value);
                break;
            default:
                break;
        }
    }

    private handleCreate(): void {
        if (this.hasInitialized) { return; }
        this.hasInitialized = true;
        const { aim } = this.disposition;
        const { description = PURPOSE } = aim;
        const { documentation, model } = (aim.body ?? {}) as Body;
        const prompt = buildAppPrompt(description, documentation);
        this.pulse(ViewComposerSignalType.CREATE, { title: description });
        this.dispatchStream(prompt, model);
        this.pulse(SignalType.CREATED, this.getDomainProperties());
    }

    private handleUpdate(value: unknown): void {
        this.pulse(ViewComposerSignalType.UPDATE, value);
        this.pulse(SignalType.UPDATED, this.getDomainProperties());
    }

    private handleRemove(value: unknown): void {
        this.pulse(ViewComposerSignalType.REMOVE, value);
        this.pulse(SignalType.REMOVED, this.getDomainProperties());
    }

    private handleViewCreated(value: unknown): void {
        const payload = (value ?? {}) as ViewComposerBody;
        this.pulse(SignalType.UPDATED, { view: payload });
    }

    private dispatchStream(prompt: string, model?: string): void {
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

    private handleUcaStream(value: unknown): void {
        const payload = (value ?? {}) as UcaStreamPayload;
        const { stream, streamId } = payload;
        if (!stream) { return; }
        const consumer = new WritableStream<UcaItem>({
            write: (item: UcaItem) => this.consumeStreamUca(item, streamId),
        });
        stream.pipeTo(consumer).catch(() => { });
    }

    private consumeStreamUca(uca: UcaItem, streamId?: string): void {
        const { id, disposition } = uca;
        if (!id || !disposition) { return; }
        this.innervateUca(id, disposition);
        this.pulse(DispositionSignal.UPDATE, { id, disposition });
        this.pulse(GraphSignalType.UCA_DETECTED, { id, disposition, streamId });
    }

    private innervateUca(id: string, disposition: Disposition): void {
        const existing = this.instances.get(id);
        if (existing) { return void existing.innervate(this.target, disposition); }
        const [prefix] = id.split(':');
        const Factory = UCA_CATALOG[prefix ?? id] as (new (id: string) => ICapability) | undefined;
        if (!Factory) { return; }
        const instance = new Factory(id).innervate(this.target, disposition);
        this.instances.set(id, instance);
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}

export * from './constants.js';
export * from './types.js';
export * from './docs.js';
export * from './prompt.js';

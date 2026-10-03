import { Uca } from '@uca/core/uca';
import {
    type CapabilityConstructor,
    type Cooky,
    type Disposition,
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
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
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
        reactTo: [...DEFAULT_SIGNALS, GraphSignalType.UCA_STREAM],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.VOID, description: 'Initialize view composition scaffolding' },
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

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, endpoint, sseEndpoint } = (aim.body ?? {}) as Body;
        const llmDisp: Disposition = { aim: { description: LlmWeb.purpose, body: { model, endpoint, sseEndpoint } }, reactTo: [...LlmWeb.disposition.reactTo ?? []] };
        const graphDisp: Disposition = { aim: { description: Graph.AIM, body: {} }, reactTo: [...Graph.disposition.reactTo ?? []] };
        const webEntries = WEB_UCAS.map(createUcaEntry);
        return [[LlmWeb, llmDisp], [Graph, graphDisp], ...webEntries];
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
            case GraphSignalType.UCA_STREAM:
                this.handleUcaStream(value);
                break;
            default:
                break;
        }
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        const { prompt, model } = payload;
        if (prompt) {
            this.pulse(LlmWebSignalType.STREAM, { prompt, model });
        }
        this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), ...payload });
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.UPDATED, { ...this.getDomainProperties(), ...payload });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.REMOVED, { ...this.getDomainProperties(), ...payload });
    }

    private handleUcaStream(value: unknown): void {
        const payload = (value ?? {}) as UcaStreamPayload;
        const { stream } = payload;
        if (!stream) { return; }
        const consumer = new WritableStream<UcaItem>({
            write: (item: UcaItem) => this.handleUcaItem(item),
        });
        stream.pipeTo(consumer).catch(() => { });
    }

    private handleUcaItem(item: UcaItem): void {
        const { id, disposition } = item;
        if (!id || !disposition) { return; }
        const [prefix] = id.split(':');
        const existing = this.capability(id) ?? this.capability(prefix ?? id);
        existing?.innervate(this.target, disposition);
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}

export * from './constants.js';
export * from './types.js';

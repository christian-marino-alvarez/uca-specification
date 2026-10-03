import { Uca } from '@uca/core/uca';
import {
    DispositionSignal,
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
import { __ID__, DEFAULT_SIGNALS, PURPOSE } from './constants.js';
import { type Body, DataType, SignalType } from './types.js';

export class ViewComposer extends Uca<Body> {
    public static override purpose: string = PURPOSE;

    public static override disposition: Disposition<Body> = {
        aim: { description: ViewComposer.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
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

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? ViewComposer.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [GraphSignalType.UCA_STREAM];
        const signals = [...new Set([...reactTo, ...DEFAULT_SIGNALS, ...internalSignals])];
        super.innervate(target, { ...base, reactTo: signals });
        this.pulse(SignalType.CREATE, this.getDomainProperties());
        return this;
    }

    public override denervate(): void {
        super.denervate();
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { model, endpoint, sseEndpoint } = (aim.body ?? {}) as Body;
        const llmDisp: Disposition = {
            aim: { description: LlmWeb.purpose, body: { model, endpoint, sseEndpoint } },
            reactTo: [...LlmWeb.disposition.reactTo ?? []],
        };
        const graphDisp: Disposition = {
            aim: { description: Graph.AIM, body: {} },
            reactTo: [...Graph.disposition.reactTo ?? []],
        };
        return [[LlmWeb, llmDisp], [Graph, graphDisp]];
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
        this.pulse(DispositionSignal.UPDATE, { id, disposition });
        this.pulse(SignalType.UPDATED, { detectedUca: { id, disposition } });
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}

export * from './constants.js';
export * from './types.js';

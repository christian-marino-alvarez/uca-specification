import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { LlmWeb } from '@uca/llm-web';
import { SignalType as LlmWebSignalType } from '@uca/llm-web/types';
import { Graph } from '@uca/capability-graph';
import { SignalType as GraphSignalType, type GraphNode, type GraphStreamPayload } from '@uca/capability-graph/types';
import {
    __ID__,
    DEFAULT_CONCISENESS,
    DEFAULT_DELIBERATION,
    DEFAULT_DETERMINISM,
    DEFAULT_IMAGINATION,
    DEFAULT_SCAFFOLD,
    DEFAULT_SIGNALS,
} from './constants.js';
import { scaffoldSchema } from './schema.js';
import { type Body, type Scaffold, type UcaNode, DataType, SignalType } from './types.js';

export class ScaffoldComposer extends Uca<Body> {
    public static override purpose: string = 'Interpret application intent and construct minimal conceptual scaffold with global styles';

    public static override disposition: Disposition<Body> = {
        aim: { description: ScaffoldComposer.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.RECORD, description: 'Receive application intent from App' },
            { signal: SignalType.UPDATE, type: DataType.VOID, description: 'Update scaffold structure' },
            { signal: SignalType.REMOVE, type: DataType.VOID, description: 'Tear down scaffold' },
            { signal: GraphSignalType.STREAM, type: DataType.STREAM, description: 'Receive streaming graph nodes' },
            { signal: LlmWebSignalType.RESPONSE, type: DataType.RECORD, description: 'Receive LLM scaffold synthesis' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.SCAFFOLD, description: 'Scaffold and global styles created for App' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'Scaffold updated' },
            { signal: SignalType.STREAM, type: DataType.STREAM, description: 'Stream scaffold nodes to App' },
            { signal: SignalType.REMOVED, type: DataType.RECORD, description: 'Scaffold removed' },
            { signal: LlmWebSignalType.STREAM, type: DataType.RECORD, description: 'Request token stream from LLM' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const { determinism = DEFAULT_DETERMINISM, imagination = DEFAULT_IMAGINATION, deliberation = DEFAULT_DELIBERATION, conciseness = DEFAULT_CONCISENESS } = body;
        const llmDisp: Disposition = {
            aim: { description: LlmWeb.purpose, body: { id: `llm-web:${this.id}`, determinism, imagination, deliberation, conciseness } },
            reactTo: [...LlmWeb.disposition.reactTo ?? []],
        };
        const graphDisp: Disposition = {
            aim: { description: Graph.AIM, body: { id: `graph:${this.id}`, schema: scaffoldSchema } },
            reactTo: [...Graph.disposition.reactTo ?? []],
        };
        return [[LlmWeb, llmDisp], [Graph, graphDisp]];
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
            case GraphSignalType.STREAM:
                this.handleGraphStream(value);
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

    private handleCreate(): void {
        this.requestScaffoldStream('create');
    }

    private requestScaffoldStream(action: 'create' | 'update' = 'create'): void {
        const { disposition, purpose, id } = this;
        const { aim } = disposition;
        const body = (aim?.body ?? {}) as Body;
        const { determinism = DEFAULT_DETERMINISM, imagination = DEFAULT_IMAGINATION, deliberation = DEFAULT_DELIBERATION, conciseness = DEFAULT_CONCISENESS } = body;
        const streamId = `${action}:${id}:${Date.now()}`;
        const targetAim = this.buildCognitiveAim(aim);
        this.pulse(LlmWebSignalType.STREAM, { id: `llm-web:${id}`, correlationId: streamId, streamId, purpose, aim: targetAim, determinism, imagination, deliberation, conciseness });
    }

    private buildCognitiveAim(aim: { description: string; body?: unknown }): { description: string; body: unknown } {
        const body = (aim.body ?? {}) as Record<string, unknown>;
        const targetSchema = {
            hero: { parentTo: '', purpose: 'first emitted region: primary value proposition visible above the fold' },
            '<ucaName>': { parentTo: '<parentUcaName>', purpose: 'teleological purpose of this UCA' },
            global: '/* last emitted: CSS design tokens and core reusable OOCSS classes */',
        };
        return { description: aim.description, body: { ...body, targetSchema } };
    }

    private handleUpdate(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.requestScaffoldStream('update');
        this.pulse(SignalType.UPDATED, { ...this.getDomainProperties(), ...payload });
    }

    private handleRemove(value: unknown): void {
        const payload = (value ?? {}) as Body;
        this.pulse(SignalType.REMOVED, { ...this.getDomainProperties(), ...payload });
    }

    private handleGraphStream(value: unknown): void {
        const { stream, streamId } = (value ?? {}) as GraphStreamPayload;
        if (!stream) { return; }
        const [appStream, accStream] = stream.tee();
        this.pulse(SignalType.STREAM, { streamId, stream: appStream });
        const acc: { purpose: string; theme: { global: unknown }; ucas: Record<string, UcaNode> } = { purpose: '', theme: { global: '' }, ucas: {} };
        const writable = new WritableStream<GraphNode>({
            write: (node) => this.accumulateNode(node, acc),
            close: () => this.finalizeStreamScaffold(acc, streamId),
        });
        accStream.pipeTo(writable).catch(() => {});
    }

    private accumulateNode(node: GraphNode, acc: { theme: { global: unknown }; ucas: Record<string, UcaNode> }): void {
        const { key, value } = node;
        if (key === 'global') {
            acc.theme.global = value;
            return;
        }
        acc.ucas[key] = value as UcaNode;
    }

    private finalizeStreamScaffold(acc: { purpose: string; theme: { global: unknown }; ucas: Record<string, UcaNode> }, streamId?: string): void {
        const result = scaffoldSchema.safeParse(acc);
        const scaffold = result.success ? (result.data as Scaffold) : DEFAULT_SCAFFOLD;
        const signal = streamId?.startsWith('update:') ? SignalType.UPDATED : SignalType.CREATED;
        this.pulse(signal, { ...this.getDomainProperties(), scaffold });
    }

    private handleLlmResponse(value: unknown): void {
        const { data, response, correlationId } = (value ?? {}) as { data?: unknown; response?: string; correlationId?: string };
        if (correlationId && !correlationId.includes(this.id)) { return; }
        const parsed = data ?? (response ? JSON.parse(response) : undefined);
        const result = scaffoldSchema.safeParse(parsed);
        const scaffold = result.success ? (result.data as Scaffold) : DEFAULT_SCAFFOLD;
        const signal = correlationId?.startsWith('update:') ? SignalType.UPDATED : SignalType.CREATED;
        this.pulse(signal, { ...this.getDomainProperties(), scaffold });
    }

    private handleLlmError(value: unknown): void {
        console.warn('⚠️ [scaffold-composer] LLM error en síntesis conceptual, aplicando fallback:', value);
        this.pulse(SignalType.CREATED, { ...this.getDomainProperties(), scaffold: DEFAULT_SCAFFOLD });
    }

    private getDomainProperties(): Body {
        const { aim } = this.disposition;
        return (aim.body ?? {}) as Body;
    }
}


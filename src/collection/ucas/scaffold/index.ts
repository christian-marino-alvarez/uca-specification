import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { WebLlm } from '@uca/web-llm';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import { SignalType as StreamTransformerSignalType } from '@uca/capability-stream-transformer/types';
import {
    __ID__,
    DEFAULT_GOAL,
    DEFAULT_IMAGINATION,
    DEFAULT_SIGNALS,
    SCAFFOLD_INSTRUCTION_PREFIX,
    SCAFFOLD_RESTRICTIONS,
} from './constants.js';
import { itemSchema } from './schema.js';
import {
    type Body,
    type CreatePayload,
    type Item,
    type Scaffold as ScaffoldStructure,
    type StreamPayload,
    DataType,
    SignalType,
} from './types.js';

export class Scaffold extends Uca<Body> {
    public static override purpose: string = 'Emerge the conceptual disposition of interactive experience required to fulfill an ontological purpose';

    public static override disposition: Disposition<Body> = {
        aim: { description: Scaffold.purpose, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.CREATE, type: DataType.PAYLOAD, description: 'Request full structured web scaffolding generation' },
            { signal: SignalType.STREAM, type: DataType.PAYLOAD, description: 'Request streaming structured web scaffolding generation' },
            { signal: SignalType.DESTROY, type: DataType.VOID, description: 'Cancel active scaffolding reasoning and streaming' },
        ],
        outputs: [
            { signal: SignalType.CREATED, type: DataType.RESULT, description: 'Complete structured scaffolding object' },
            { signal: SignalType.STREAMED, type: DataType.STREAM, description: 'ReadableStream of validated UCA item chunks' },
            { signal: SignalType.CHUNK, type: DataType.RESULT, description: 'Individual validated UCA item chunk' },
            { signal: SignalType.DESTROYED, type: DataType.RESULT, description: 'Scaffolding destruction confirmation' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Scaffolding generation error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, source, value } = signal;
        switch (property) {
            case SignalType.CREATE:
                this.handleCreate(value);
                break;
            case SignalType.STREAM:
                this.handleStream(value);
                break;
            case SignalType.DESTROY:
                this.handleDestroy();
                break;
            case WebLlmSignalType.STREAMED:
                this.handleWebLlmStreamed(value, source);
                break;
            case StreamTransformerSignalType.TRANSFORMED:
                await this.handleTransformed(value, source);
                break;
            case WebLlmSignalType.ERROR:
                this.handleWebLlmError(value, source);
                break;
            case StreamTransformerSignalType.ERROR:
                this.handleTransformerError(value, source);
                break;
            default:
                break;
        }
    }

    protected override capabilities(): Cooky {
        const { reactTo: llmSignals = [] } = WebLlm.disposition;
        const { reactTo: transformerSignals = [] } = StreamTransformer.disposition;
        const llmItem: Cooky[number] = [WebLlm, { aim: { description: 'Web LLM for scaffolding', body: { id: `${this.id}:web-llm` } }, reactTo: [...llmSignals] }];
        const transformerItem: Cooky[number] = [StreamTransformer, { aim: { description: 'Stream transformer', body: { id: `${this.id}:stream-transformer`, schema: itemSchema } }, reactTo: [...transformerSignals] }];
        return [llmItem, transformerItem];
    }

    private formatGoalRequest(request: string, context?: string, parentUca?: string): string {
        const root = parentUca ?? 'app';
        const schema = '{"<ucaName>":{"purpose":"<Propósito rico de 1-2 líneas>","parentTo":"<ucaPadre>"}}';
        const goal = `¿Qué disposición conceptual necesita este Purpose para ser satisfecho?: "${request}".`;
        const role = 'Concibe la disposición conceptual de la experiencia que satisface el Purpose (no describas su dominio).';
        const rules = `"${root}" ya existe como anfitrión (los elementos raíz deben usar "parentTo": "${root}"). Prohibido generar "${root}" o "App". Emerge la disposición conceptual mínima necesaria para comenzar a satisfacer el Purpose y finaliza. NDJSON sin markdown: ${schema}`;
        const lines = [goal, context && `Contexto: ${context}`, role, rules].filter(Boolean);
        return lines.join('\n');
    }

    private handleCreate(value: unknown): void {
        const payload = (value ?? {}) as CreatePayload;
        const { correlationId = `${this.id}:create:${Date.now()}` } = payload;
        this.dispatchReasoning({ ...payload, correlationId });
    }

    private handleStream(value: unknown): void {
        const payload = (value ?? {}) as StreamPayload;
        const { correlationId = `${this.id}:stream:${Date.now()}` } = payload;
        this.dispatchReasoning({ ...payload, correlationId });
    }

    private dispatchReasoning(payload: CreatePayload): void {
        const { request = DEFAULT_GOAL, model, provider, imagination = DEFAULT_IMAGINATION, correlationId, streamId } = payload;
        const resolvedContext = payload.context ?? this.context;
        const parentUca = payload.parentTo ?? this.disposition.parentTo?.uca;
        const promptText = this.formatGoalRequest(request, resolvedContext, parentUca);
        console.log('📝 [Scaffold:Prompt]\n', promptText);
        const webLlmPayload = { id: `${this.id}:web-llm`, request: promptText, model, provider, imagination, correlationId, streamId };
        this.pulse(WebLlmSignalType.STREAM, webLlmPayload);
    }

    private handleWebLlmStreamed(value: unknown, source: string): void {
        const matches = source === 'test' || source === 'web-llm' || source === `${this.id}:web-llm`;
        if (!matches) { return; }
        const streamResult = (value ?? {}) as { correlationId?: string; streamId?: string; stream: ReadableStream<string> };
        const { correlationId, streamId, stream } = streamResult;
        this.pulse(StreamTransformerSignalType.TRANSFORM, { id: `${this.id}:stream-transformer`, correlationId, streamId, stream, schema: itemSchema });
    }

    private async handleTransformed(value: unknown, source: string): Promise<void> {
        const matches = source === 'test' || source === 'stream-transformer' || source === `${this.id}:stream-transformer`;
        if (!matches) { return; }
        const transformResult = (value ?? {}) as { correlationId?: string; streamId?: string; stream: ReadableStream<Item> };
        const { correlationId, streamId, stream } = transformResult;
        const [clientStream, accumulateStream] = stream.tee();
        this.pulse(SignalType.STREAMED, { correlationId, streamId, stream: clientStream });
        await this.accumulateScaffold(accumulateStream, correlationId, streamId);
    }

    private async accumulateScaffold(stream: ReadableStream<Item>, correlationId?: string, streamId?: string): Promise<void> {
        const reader = stream.getReader();
        let scaffold: ScaffoldStructure = {};
        for (let next = await reader.read(); !next.done; next = await reader.read()) {
            scaffold = this.consumeItemChunk(next.value, scaffold, correlationId, streamId);
        }
        this.completeScaffold(scaffold, correlationId);
    }

    private consumeItemChunk(item: Item | undefined, current: ScaffoldStructure, correlationId?: string, streamId?: string): ScaffoldStructure {
        const valid = this.sanitizeItem(item);
        if (!valid) { return current; }
        this.pulse(SignalType.CHUNK, { correlationId, streamId, chunk: valid });
        return { ...current, ...valid };
    }

    private sanitizeItem(item?: Item): Item | undefined {
        if (!item) { return undefined; }
        const filtered = Object.entries(item).filter(([k]) => k.toLowerCase() !== 'app');
        return filtered.length > 0 ? Object.fromEntries(filtered) : undefined;
    }

    private completeScaffold(scaffold: ScaffoldStructure, correlationId?: string): void {
        if (Object.keys(scaffold).length === 0) {
            const error = 'Empty scaffolding stream received from LLM';
            this.pulse(SignalType.ERROR, { action: 'stream', error, correlationId });
            return;
        }
        this.pulse(SignalType.CREATED, { correlationId, scaffold });
    }

    private handleDestroy(): void {
        this.pulse(WebLlmSignalType.DESTROY, { id: `${this.id}:web-llm` });
        this.pulse(SignalType.DESTROYED, { destroyed: true });
    }

    private handleWebLlmError(value: unknown, source: string): void {
        const matches = source === 'test' || source === 'web-llm' || source === `${this.id}:web-llm`;
        if (!matches) { return; }
        const { error, correlationId } = (value ?? {}) as { error?: string; correlationId?: string };
        const message = error ?? String(value);
        this.pulse(SignalType.ERROR, { action: 'web-llm', error: message, correlationId });
    }

    private handleTransformerError(value: unknown, source: string): void {
        const matches = source === 'test' || source === 'stream-transformer' || source === `${this.id}:stream-transformer`;
        if (!matches) { return; }
        const { error, correlationId } = (value ?? {}) as { error?: string; correlationId?: string };
        const message = error ?? String(value);
        this.pulse(SignalType.ERROR, { action: 'stream-transformer', error: message, correlationId });
    }
}

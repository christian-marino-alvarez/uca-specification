import { Capability } from '@uca/core/capability';
import { DispositionSignal, type Disposition, type DispositionUpdatePayload, type Signal } from '@uca/core/types';
import { __ID__, AIM, DEFAULT_SIGNALS } from './constants.js';
import {
    type Body,
    type GraphEdge,
    type GraphNode,
    type ResolvePayload,
    type ResolvedResult,
    type RetryPayload,
    type StreamChunkPayload,
    type ViewGraph,
    DataType,
    SignalType,
} from './types.js';
import { responseSchema, type ResponseSchema, type UcaItem } from './schema.js';
import { scanUcaCandidates, type InvalidCandidate } from './parser.js';

export class Graph extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: Graph.AIM, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.RESOLVE, type: DataType.RESOLVE_PAYLOAD, description: 'Validate LLM response and build graph' },
            { signal: SignalType.CHUNK, type: DataType.STREAM_CHUNK_PAYLOAD, description: 'Stream chunk containing response alphas' },
            { signal: SignalType.COMPLETED, type: DataType.UNKNOWN, description: 'Stream session completed' },
        ],
        outputs: [
            { signal: SignalType.RESOLVED, type: DataType.RESOLVED_RESULT, description: 'Emits validated graph and ucas' },
            { signal: SignalType.UCA_DETECTED, type: DataType.UCA_DETECTED_PAYLOAD, description: 'Emits detected valid UCA in stream' },
            { signal: SignalType.RETRY, type: DataType.RETRY_PAYLOAD, description: 'Requests LLM retry on schema failure' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits graph validation error' },
        ],
    };

    private streamBuffer: string = '';
    private readonly dispatchedUcas: Set<string> = new Set();
    private readonly streamAccumulatedUcas: Record<string, Disposition> = {};

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.RESOLVE:
                this.handleResolve(value);
                break;
            case SignalType.CHUNK:
            case SignalType.CHUNK_PROMPT_API:
                this.handleStreamChunk(value);
                break;
            case SignalType.COMPLETED:
            case SignalType.STREAM_END_PROMPT_API:
                this.handleStreamCompleted();
                break;
            default:
                break;
        }
    }

    private handleStreamChunk(value: unknown): void {
        const { text } = (value ?? {}) as StreamChunkPayload;
        if (!text) { return; }
        this.streamBuffer += text;
        const { validUcas, invalidCandidates } = scanUcaCandidates(this.streamBuffer);
        this.dispatchValidStreamUcas(validUcas);
        this.handleInvalidStreamCandidates(invalidCandidates);
    }

    private dispatchValidStreamUcas(validUcas: readonly UcaItem[]): void {
        for (const item of validUcas) {
            const { id, disposition } = item;
            if (this.dispatchedUcas.has(id)) { continue; }
            this.dispatchedUcas.add(id);
            this.streamAccumulatedUcas[id] = disposition;
            console.log(`✅ [CLIENT][Graph] UCA válida detectada (Zod): "${id}"! Disparando en nervous system...`);
            this.pulse(DispositionSignal.UPDATE, { id, disposition });
            this.pulse(SignalType.UCA_DETECTED, { id, disposition });
        }
    }

    private handleInvalidStreamCandidates(invalidCandidates: readonly InvalidCandidate[]): void {
        for (const candidate of invalidCandidates) {
            const { raw, error } = candidate;
            console.warn('⚠️ [CLIENT][Graph] Candidato descartado por schema Zod. Solicitando reintento...');
            const payload: RetryPayload = { raw, error, reason: 'Invalid UCA schema structure' };
            this.pulse(SignalType.RETRY, payload);
            this.pulse(SignalType.ERROR, payload);
        }
    }

    private handleStreamCompleted(): void {
        const answer = this.extractStreamAnswer();
        const ucas = { ...this.streamAccumulatedUcas };
        console.log('🧩 [CLIENT][Graph] Stream completado. Resolviendo ViewGraph con nodos:', Object.keys(ucas));
        const graph = this.buildGraph(ucas);
        const result: ResolvedResult = { ucas, graph, answer };
        this.pulse(SignalType.RESOLVED, result);
        this.resetStreamState();
    }

    private extractStreamAnswer(): string | undefined {
        const match = this.streamBuffer.match(/"answer"\s*:\s*"([^"]+)/);
        const answer = match ? match[1] : undefined;
        return answer;
    }

    private resetStreamState(): void {
        this.streamBuffer = '';
        this.dispatchedUcas.clear();
        for (const key of Object.keys(this.streamAccumulatedUcas)) {
            delete this.streamAccumulatedUcas[key];
        }
    }

    private handleResolve(value: unknown): void {
        const payload = (value ?? {}) as ResolvePayload;
        try {
            const raw = this.extractRawData(payload);
            const { ucas, answer } = this.validateAndExtractUcas(raw);
            this.dispatchDispositions(ucas);
            const graph = this.buildGraph(ucas);
            const result: ResolvedResult = { ucas, graph, answer };
            this.pulse(SignalType.RESOLVED, result);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private extractRawData(payload: ResolvePayload): Record<string, unknown> {
        const { data, response, ucas } = payload;
        if (ucas) { return { ucas }; }
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            return data as Record<string, unknown>;
        }
        return response ? this.parseRawResponse(response) : {};
    }

    private parseRawResponse(response: string): Record<string, unknown> {
        const clean = response.replace(/^```json\s*|^```\s*|```$/gm, '').trim();
        return JSON.parse(clean) as Record<string, unknown>;
    }

    private validateAndExtractUcas(data: Record<string, unknown>): { ucas: Record<string, Disposition>; answer?: string } {
        const { ucas: directUcas } = data as { ucas?: Record<string, Disposition> };
        if (directUcas && !Array.isArray(directUcas)) {
            return { ucas: directUcas };
        }
        const validated = responseSchema.parse(data);
        return this.extractFromValidated(validated);
    }

    private extractFromValidated(validated: ResponseSchema): { ucas: Record<string, Disposition>; answer?: string } {
        const { data } = validated;
        const { ucas: rawUcas, answer } = data;
        const normalized = this.normalizeUcas(rawUcas);
        return { ucas: normalized, answer };
    }

    private normalizeUcas(rawUcas: readonly UcaItem[]): Record<string, Disposition> {
        const record: Record<string, Disposition> = {};
        for (const item of rawUcas) {
            const { id, disposition } = item;
            record[id] = disposition as Disposition;
        }
        return record;
    }

    private dispatchDispositions(ucas: Record<string, Disposition>): void {
        for (const [id, disposition] of Object.entries(ucas)) {
            const updatePayload: DispositionUpdatePayload = { id, disposition };
            this.pulse(DispositionSignal.UPDATE, updatePayload);
        }
    }

    private buildGraph(ucas: Record<string, Disposition>): ViewGraph {
        const nodes = this.buildNodes(ucas);
        const edges = this.buildEdges(ucas);
        return { nodes, edges };
    }

    private buildNodes(ucas: Record<string, Disposition>): GraphNode[] {
        return Object.entries(ucas).map(([id, disposition]) => {
            const { aim, inputs = [], outputs = [] } = disposition;
            const { description = '' } = aim ?? {};
            return { id, aimDescription: description, inputsCount: inputs.length, outputsCount: outputs.length };
        });
    }

    private buildEdges(ucas: Record<string, Disposition>): GraphEdge[] {
        const edges: GraphEdge[] = [];
        for (const [consumerId, consumerDisp] of Object.entries(ucas)) {
            const { reactTo = [] } = consumerDisp;
            this.matchEdgesForConsumer(consumerId, reactTo, ucas, edges);
        }
        return edges;
    }

    private matchEdgesForConsumer(
        toNode: string,
        reactTo: readonly string[],
        ucas: Record<string, Disposition>,
        edges: GraphEdge[],
    ): void {
        for (const [producerId, producerDisp] of Object.entries(ucas)) {
            const { outputs = [] } = producerDisp;
            for (const output of outputs) {
                if (reactTo.includes(output.signal) && producerId !== toNode) {
                    edges.push({ fromNode: producerId, toNode, signal: output.signal, type: output.type });
                }
            }
        }
    }
}

export * from './constants.js';
export * from './types.js';
export * from './schema.js';
export * from './parser.js';

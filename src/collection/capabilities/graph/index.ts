import { Capability } from '@uca/core/capability';
import { DispositionSignal, type Disposition, type DispositionUpdatePayload, type Signal } from '@uca/core/types';
import { __ID__, AIM, DEFAULT_SIGNALS } from './constants.js';
import {
    type Body,
    type GraphEdge,
    type GraphNode,
    type ResolvePayload,
    type ResolvedResult,
    type ViewGraph,
    DataType,
    SignalType,
} from './types.js';

export class Graph extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: Graph.AIM, body: {} },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.RESOLVE, type: DataType.RESOLVE_PAYLOAD, description: 'Validate LLM response and build graph' },
        ],
        outputs: [
            { signal: SignalType.RESOLVED, type: DataType.RESOLVED_RESULT, description: 'Emits validated graph and ucas' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Emits graph validation error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.RESOLVE:
                this.handleResolve(value);
                break;
            default:
                break;
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
        try {
            const clean = response.replace(/^```json\s*|^```\s*|```$/gm, '').trim();
            return JSON.parse(clean) as Record<string, unknown>;
        } catch {
            return this.repairOrFallback(response);
        }
    }

    private repairOrFallback(response: string): Record<string, unknown> {
        const match = response.match(/"answer"\s*:\s*"([^"]+)/);
        const answer = match ? match[1] : undefined;
        return { answer };
    }

    private validateAndExtractUcas(data: Record<string, unknown>): { ucas: Record<string, Disposition>; answer?: string } {
        const rawUcas = data.ucas;
        const answer = typeof data.answer === 'string' ? data.answer : undefined;
        const normalized = this.normalizeUcas(rawUcas);
        const hasEntries = Object.keys(normalized).length > 0;
        const ucas = hasEntries ? normalized : this.synthesizeFallbackUcas(data);
        this.enrichVisualDispositions(ucas, answer);
        return { ucas, answer };
    }

    private enrichVisualDispositions(ucas: Record<string, Disposition>, answer?: string): void {
        if (!answer) { return; }
        const card = ucas['box:explanation-card'];
        const currentText = (card?.aim?.body as { text?: string } | undefined)?.text ?? 'u = (p, d, C, O)';
        const cardText = `📐 Fórmula Ontológica: ${currentText}\n\n${answer}`;
        ucas['box:explanation-card'] = {
            aim: { description: 'Formula and explanation', body: { text: cardText } },
            reactTo: ['box.update'],
        };
        ucas['box:center-container'] = {
            aim: { description: 'Title header', body: { text: 'Arquitectura Cognitiva Universal (UCA)', className: 'ready' } },
            reactTo: ['box.update'],
        };
        ucas['action:query-button'] = {
            aim: { description: 'Action button', body: { label: 'Descubrir qué es UCA', hidden: true } },
            reactTo: ['action.update'],
        };
    }

    private normalizeUcas(rawUcas: unknown): Record<string, Disposition> {
        if (!rawUcas) { return {}; }
        if (!Array.isArray(rawUcas)) {
            return rawUcas as Record<string, Disposition>;
        }
        const record: Record<string, Disposition> = {};
        for (const item of rawUcas) {
            this.mergeUcaItem(record, item);
        }
        return record;
    }

    private mergeUcaItem(record: Record<string, Disposition>, item: unknown): void {
        const isTuple = Array.isArray(item) && item.length >= 2;
        if (isTuple) { record[String(item[0])] = item[1] as Disposition; return; }
        const obj = (item ?? {}) as { id?: string; disposition?: Disposition; aim?: unknown; reactTo?: readonly string[] } & Record<string, Disposition>;
        const { id, disposition, aim, reactTo } = obj;
        if (id && disposition) { record[id] = disposition; return; }
        if (id && aim) { record[id] = { aim, reactTo: reactTo ?? [] } as unknown as Disposition; return; }
        for (const [key, value] of Object.entries(obj)) {
            if (value && typeof value === 'object' && 'aim' in value) { record[key] = value as Disposition; }
        }
    }

    private synthesizeFallbackUcas(data: Record<string, unknown>): Record<string, Disposition> {
        const { answer, answers } = data as { answer?: string; answers?: Record<string, unknown> };
        if (answer) {
            return this.buildVisualExplanationUcas(answer);
        }
        const container = { aim: { description: 'Centered container', body: { text: '¿Quieres saber que es Uca?' } }, reactTo: ['box.create'] };
        const button = { aim: { description: 'Submit button', body: { label: 'Descubrir qué es UCA', answers } }, reactTo: ['action.create', 'action.trigger'] };
        return { 'box:center-container': container, 'action:query-button': button };
    }

    private buildVisualExplanationUcas(answer: string): Record<string, Disposition> {
        const header = { aim: { description: 'Title header', body: { text: 'Arquitectura Cognitiva Universal (UCA)', className: 'ready' } }, reactTo: ['box.update'] };
        const cardText = `📐 Fórmula Ontológica: u = (p, d, C, O)\n\n${answer}`;
        const card = { aim: { description: 'Formula and explanation', body: { text: cardText, hidden: false } }, reactTo: ['box.update'] };
        const pillars = [
            '🎯 Propósito (p): Razón teleológica de existencia inmutable que guía a la unidad.',
            '🧭 Disposición (d): Intencionalidad reactiva (aim, reactTo, inputs, outputs).',
            '⚡ Capacidades (C): Sustrato operacional ejecutable y terminales reactivas.',
            '📡 Resultados (O): Consecuencias observables emitidas como pulsos nerviosos.',
        ];
        const list = { aim: { description: 'Pillars list', body: { items: pillars, hidden: false } }, reactTo: ['list.update'] };
        const action = { aim: { description: 'Simulate pulse', body: { label: '⚡ Emitir pulso nervioso de prueba', hidden: false } }, reactTo: ['action.update', 'action.trigger'] };
        const toggle = { aim: { description: 'Reactive stream toggle', body: { label: '🧠 Red Nerviosa UCA: Activa', checked: true, hidden: false } }, reactTo: ['toggle.update'] };
        return {
            'box:center-container': header,
            'box:explanation-card': card,
            'list:ontological-pillars': list,
            'action:simulate-pulse': action,
            'toggle:reactive-mode': toggle,
        };
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

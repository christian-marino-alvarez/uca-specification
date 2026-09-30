import { Capability } from '../../../core/capability.js';
import type { Disposition, Signal } from '../../../core/types.js';
import {
    type Body,
    type DomainDispositionsPayload,
    type GraphChunk,
    type GraphNode,
    type GraphStreamResolver,
    type StreamOutput,
    SignalType,
} from './types.js';
import { TypeSafeClient } from '@typesafe-ai/sdk';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';


export class Jev extends Capability<Body> {
    public static readonly AIM: string = 'Resolve and stream UCA and capability graph topology from domain dispositions';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(Jev.AIM, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.CONNECT, type: 'ConnectionConfig', description: 'Configure Jev engine parameters' },
                { signal: SignalType.GRAPH, type: 'DomainDispositionsPayload', description: 'Domain dispositions to resolve into graph topology' },
                { signal: SignalType.DISCONNECT, type: 'void', description: 'Disconnect and clean up resources' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort active graph resolution stream' },
            ],
            outputs: [
                { signal: SignalType.CONNECTED, type: '{ status: string }', description: 'Jev engine connection confirmed' },
                { signal: SignalType.STREAM, type: 'ReadableStream<GraphChunk>', description: 'Streaming graph nodes and edges topology' },
                { signal: SignalType.CLOSED, type: '{ closedAt: number }', description: 'Connection closed confirmation' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'Error notification' },
            ],
        });
    }

    private activeController?: AbortController;
    private isConnected: boolean = false;

    public constructor(id: string = __ID__) {
        super(id, Jev.createDefaultDisposition());
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? this.disposition;
        const { reactTo = [] } = baseDisposition;
        const signals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        super.innervate(target, activeDisposition);
        return this;
    }

    public override denervate(): void {
        this.closeConnection();
        super.denervate();
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.CONNECT:
                this.handleConnect(value);
                break;
            case SignalType.GRAPH:
                await this.handleGraph(value);
                break;
            case SignalType.DISCONNECT:
            case SignalType.ABORT:
                this.closeConnection();
                break;
            default:
                break;
        }
    }

    private handleConnect(value: unknown): void {
        const payload = this.extractPayload<unknown>(value);
        this.isConnected = true;
        this.pulse(SignalType.CONNECTED, payload ?? { status: 'ready' });
    }

    private async handleGraph(value: unknown): Promise<void> {
        const payload = this.extractPayload<DomainDispositionsPayload>(value);
        if (payload?.dispositions) {
            await this.produceStream(payload);
        }
    }

    private async produceStream(payload: DomainDispositionsPayload): Promise<void> {
        this.abortActiveStream();
        const controller = new AbortController();
        this.activeController = controller;
        try {
            const stream = await this.resolveResolver()(payload, controller.signal);
            this.pulse(SignalType.STREAM, stream);
        } catch (error) {
            this.pulse(SignalType.ERROR, error);
        }
    }

    private abortActiveStream(): void {
        if (this.activeController) {
            this.activeController.abort();
            this.activeController = undefined;
        }
    }

    private closeConnection(): void {
        this.abortActiveStream();
        if (this.isConnected) {
            this.isConnected = false;
            this.pulse(SignalType.CLOSED, { closedAt: Date.now() });
        }
    }

    private resolveResolver(): GraphStreamResolver {
        const { aim } = this.disposition;

        const { resolver, client, connection } = aim.body ?? {};
        if (resolver) {
            return resolver;
        }
        if (client || connection?.apiKey) {
            return (payload, signal) => this.resolveWithJevSdk(payload, signal);
        }
        return this.createDefaultGraphResolver;
    }

    private resolveWithJevSdk(payload: DomainDispositionsPayload, signal?: AbortSignal): StreamOutput {
        const { aim } = this.disposition;
        const { client, connection } = aim.body ?? {};
        const jevClient = client ?? new TypeSafeClient({ apiKey: connection?.apiKey, baseURL: connection?.endpoint });
        return new ReadableStream<GraphChunk>({
            async start(controller) {
                controller.enqueue({ type: 'meta', payload: { domain: payload.domain, status: 'resolving_via_jev_sdk' } });
                const requestState = { domain: payload.domain, count: payload.dispositions.length };
                await jevClient.systemOne({ state: requestState, questions: { valid_graph: { type: 'noul' } } }, { signal });
                payload.dispositions.forEach((disp, idx) => {
                    const node: GraphNode = { id: `node-${idx + 1}`, aimDescription: disp.aim.description, inputsCount: disp.inputs?.length ?? 0, outputsCount: disp.outputs?.length ?? 0 };
                    controller.enqueue({ type: 'node', payload: node });
                });
                controller.close();
            },
        });
    }

    private createDefaultGraphResolver(payload: DomainDispositionsPayload): StreamOutput {
        const { domain, dispositions } = payload;
        return new ReadableStream<GraphChunk>({
            start(controller) {
                controller.enqueue({ type: 'meta', payload: { domain, count: dispositions.length } });
                dispositions.forEach((disp, index) => {
                    const { aim, inputs = [], outputs = [] } = disp;
                    const id = `node-${index + 1}`;
                    const node: GraphNode = { id, aimDescription: aim.description, inputsCount: inputs.length, outputsCount: outputs.length };
                    controller.enqueue({ type: 'node', payload: node });
                });
                controller.close();
            },
        });
    }
}


export * from './constants.js';
export * from './types.js';

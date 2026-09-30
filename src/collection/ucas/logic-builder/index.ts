import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { Equal } from '../../capabilities/equal/index.js';
import { Divide } from '../../capabilities/divide/index.js';
import { Multiply } from '../../capabilities/multiply/index.js';
import { GreaterThan } from '../../capabilities/greater-than/index.js';
import { LessThan } from '../../capabilities/less-than/index.js';
import { Contains } from '../../capabilities/contains/index.js';
import { Loop } from '../../capabilities/loop/index.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import {
    type Body,
    type ComposePayload,
    type LogicPlan,
    type GraphNode,
    type GraphEdge,
    SignalType,
} from './types.js';

export class LogicBuilder extends Uca<Body> {
    public static readonly PURPOSE: string = 'Create behavioral logic and reactive connections based on view graph topology';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(LogicBuilder.PURPOSE, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.COMPOSE, type: 'ComposePayload', description: 'View graph topology nodes and edges' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort logic composition' },
            ],
            outputs: [
                { signal: SignalType.RESOLVED, type: 'LogicPlan', description: 'Resolved reactive logic connections and bindings' },
                { signal: SignalType.STREAM, type: 'ReadableStream<string>', description: 'Streaming tokens from Prompt API' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'Logic composition error' },
            ],
        });
    }

    public constructor(id: string = __ID__) {
        super(id, LogicBuilder.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? LogicBuilder.createDefaultDisposition();
        const { reactTo = [] } = baseDisposition;
        const initialSignals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const signals = Array.from(new Set(initialSignals));
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        return super.innervate(target, activeDisposition);
    }

    protected override capabilities(): Cooky {
        const equalDisp = Capability.createDisposition('Equality comparison primitive');
        const divideDisp = Capability.createDisposition('Division arithmetic primitive');
        const multiplyDisp = Capability.createDisposition('Multiplication arithmetic primitive');
        const gtDisp = Capability.createDisposition('Greater than relational comparison');
        const ltDisp = Capability.createDisposition('Less than relational comparison');
        const containsDisp = Capability.createDisposition('Inclusion predicate primitive');
        const loopDisp = Capability.createDisposition('Iteration looping primitive');
        return [
            [Equal, equalDisp],
            [Divide, divideDisp],
            [Multiply, multiplyDisp],
            [GreaterThan, gtDisp],
            [LessThan, ltDisp],
            [Contains, containsDisp],
            [Loop, loopDisp],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        if (property === SignalType.ABORT) {
            this.handleAbort();
            return;
        }
        this.handleCompose(value);
    }

    private handleCompose(value: unknown): void {
        const payload = this.extractPayload<ComposePayload>(value);
        if (!payload) { return; }
        const { nodes = [], edges = [] } = payload;
        const { aim } = this.disposition;
        const { resolver } = aim.body ?? {};
        const plan: LogicPlan = resolver ? resolver(payload) : this.createDefaultLogicPlan(nodes, edges);
        this.pulse(SignalType.RESOLVED, plan);
    }

    private handleAbort(): void {
        this.pulse(SignalType.ABORT, undefined);
    }

    private createDefaultLogicPlan(nodes: readonly GraphNode[], edges: readonly GraphEdge[]): LogicPlan {
        const defaultConnections = [
            { sourceNode: 'search-button', targetNode: 'search-input', signal: 'action.triggered' },
        ];
        return {
            viewGraph: { nodes, edges },
            connections: defaultConnections,
        };
    }
}

export * from './types.js';
export * from './constants.js';



import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import type { Signal } from '../../../../core/types.js';
import { LogicBuilder } from '../index.js';
import { SignalType, type LogicPlan } from '../types.js';
import { __ID__ } from '../constants.js';
import { SignalType as ViewSignalType, type ViewGraphResult } from '../../view-builder/types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testLogicBuilder_IdentityAndDefaults(): void {
    const builder = new LogicBuilder();
    assert.strictEqual(builder.id, __ID__);
    assert.strictEqual(builder.purpose, LogicBuilder.PURPOSE);
    assert.ok(builder instanceof Uca);
    builder.innervate();
    assert.strictEqual(builder.disposition.inputs?.length, 2);
    assert.strictEqual(builder.disposition.outputs?.length, 3);
    builder.denervate();
}

function testLogicBuilder_ComposesLogicFromViewGraphOutcome(): void {
    const bus = new EventTarget();
    // LogicBuilder connects its reactTo directly to ViewBuilder's graph output
    const logicDisposition = LogicBuilder.createDisposition('Dynamic logic composition', {}, [ViewSignalType.GRAPH]);
    const logic = new LogicBuilder('test-logic-builder').innervate(bus, logicDisposition);

    let capturedPlan: LogicPlan | undefined;
    bus.addEventListener(SignalType.RESOLVED, (event: Event) => {
        capturedPlan = (event as CustomEvent<Signal<LogicPlan>>).detail.value;
    });

    const mockGraph: ViewGraphResult = {
        nodes: [
            { id: 'btn-1', aimDescription: 'Action button', inputsCount: 1, outputsCount: 1 },
            { id: 'display-1', aimDescription: 'Visual text box', inputsCount: 1, outputsCount: 0 },
        ],
        edges: [
            { fromNode: 'btn-1', toNode: 'display-1', signal: 'action.triggered', type: 'void' },
        ],
    };

    // Emit graph outcome from ViewBuilder
    emitSignal(bus, ViewSignalType.GRAPH, mockGraph);

    assert.ok(capturedPlan !== undefined);
    assert.strictEqual(capturedPlan.viewGraph.nodes.length, 2);
    assert.strictEqual(capturedPlan.viewGraph.edges.length, 1);
    assert.strictEqual(capturedPlan.viewGraph.edges[0]?.fromNode, 'btn-1');

    logic.denervate();
}

function runAllLogicBuilderTests(): void {
    testLogicBuilder_IdentityAndDefaults();
    testLogicBuilder_ComposesLogicFromViewGraphOutcome();
    console.log('✔ All LogicBuilder UCA minimal architecture tests passed successfully.');
}

runAllLogicBuilderTests();

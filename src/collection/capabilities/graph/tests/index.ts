import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import { DispositionSignal, type Disposition, type DispositionUpdatePayload, type Signal } from '@uca/core/types';
import { Graph, SignalType, DataType, __ID__, AIM, type ResolvedResult } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testGraph_IdentityAndDefaults(): void {
    const graph = new Graph();
    assert.ok(graph instanceof Capability);
    assert.strictEqual(graph.id, __ID__);
    assert.strictEqual(Graph.AIM, AIM);
    const { inputs, outputs, aim } = graph.disposition;
    assert.strictEqual(inputs?.length, 1);
    assert.strictEqual(inputs?.[0]?.type, DataType.RESOLVE_PAYLOAD);
    assert.strictEqual(outputs?.length, 2);
    assert.strictEqual(outputs?.[0]?.type, DataType.RESOLVED_RESULT);
    assert.strictEqual(aim.description, AIM);
}

function testGraph_ResolveDispatchesDispositionsAndBuildsGraph(): void {
    const bus = new EventTarget();
    const graphCap = new Graph('graph-test').innervate(bus);
    const updates: DispositionUpdatePayload[] = [];
    let capturedResolved: ResolvedResult | undefined;

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        updates.push((event as CustomEvent<Signal<DispositionUpdatePayload>>).detail.value);
    });

    bus.addEventListener(SignalType.RESOLVED, (event: Event) => {
        capturedResolved = (event as CustomEvent<Signal<ResolvedResult>>).detail.value;
    });

    const mockUcas: Record<string, Disposition> = {
        'uca-1': { aim: { description: 'Producer' }, outputs: [{ signal: 'data.ready', type: 'string' }] },
        'uca-2': { aim: { description: 'Consumer' }, reactTo: ['data.ready'] },
    };

    emitSignal(bus, SignalType.RESOLVE, { ucas: mockUcas });

    assert.strictEqual(updates.length, 2);
    assert.strictEqual(updates[0]?.id, 'uca-1');
    assert.strictEqual(updates[1]?.id, 'uca-2');

    assert.ok(capturedResolved);
    assert.strictEqual(capturedResolved?.graph.nodes.length, 2);
    assert.strictEqual(capturedResolved?.graph.edges.length, 1);
    assert.strictEqual(capturedResolved?.graph.edges[0]?.fromNode, 'uca-1');
    assert.strictEqual(capturedResolved?.graph.edges[0]?.toNode, 'uca-2');

    graphCap.denervate();
}

function runAllGraphTests(): void {
    testGraph_IdentityAndDefaults();
    testGraph_ResolveDispatchesDispositionsAndBuildsGraph();
    console.log('✔ All Graph capability tests passed successfully.');
}

runAllGraphTests();

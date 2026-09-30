import '../../../../../tests/shared/dom-harness.js';
import * as assert from 'node:assert';
import { Uca } from '../../../../core/uca.js';
import { Capability } from '../../../../core/capability.js';
import type { Signal } from '../../../../core/types.js';
import { ViewBuilder } from '../index.js';
import { SignalType, type ViewVisualResult, type ViewGraphResult } from '../types.js';
import { __ID__ } from '../constants.js';
import { SignalType as PromptSignalType } from '../../../capabilities/google-web-prompt/index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testViewBuilder_IdentityAndDefaults(): void {
    const builder = new ViewBuilder();
    assert.strictEqual(builder.id, __ID__);
    assert.strictEqual(builder.purpose, ViewBuilder.PURPOSE);
    assert.ok(builder instanceof Uca);
    builder.innervate();
    assert.strictEqual(builder.disposition.inputs?.length, 2);
    assert.strictEqual(builder.disposition.outputs?.length, 4);
    builder.denervate();
}

async function testViewBuilder_BuildEmitsVisualAndGraphOutcomes(): Promise<void> {
    const bus = new EventTarget();
    const mockStream = new ReadableStream<string>({
        start(controller) {
            controller.enqueue('Dashboard View');
            controller.close();
        },
    });

    const builder = new ViewBuilder('custom-view-builder').innervate(bus);
    let capturedVisual: ViewVisualResult | undefined;
    let capturedGraph: ViewGraphResult | undefined;

    bus.addEventListener(SignalType.VISUAL, (event: Event) => {
        capturedVisual = (event as CustomEvent<Signal<ViewVisualResult>>).detail.value;
    });
    bus.addEventListener(SignalType.GRAPH, (event: Event) => {
        capturedGraph = (event as CustomEvent<Signal<ViewGraphResult>>).detail.value;
    });

    // Simulate Prompt API streaming completion to builder
    emitSignal(bus, PromptSignalType.STREAM, mockStream);
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.ok(capturedVisual !== undefined);
    assert.strictEqual(capturedVisual.title, 'Dashboard View');
    assert.strictEqual(capturedVisual.elements.length, 3);
    assert.strictEqual(capturedVisual.elements[1]?.type, 'input');
    assert.strictEqual(capturedVisual.elements[2]?.type, 'action');

    assert.ok(capturedGraph !== undefined);
    assert.strictEqual(capturedGraph.nodes.length, 2);
    assert.strictEqual(capturedGraph.nodes[0]?.id, 'search-input');
    assert.strictEqual(capturedGraph.nodes[1]?.id, 'search-button');

    builder.denervate();
}

async function runAllViewBuilderTests(): Promise<void> {
    testViewBuilder_IdentityAndDefaults();
    await testViewBuilder_BuildEmitsVisualAndGraphOutcomes();
    console.log('✔ All ViewBuilder UCA minimal architecture tests passed successfully.');
}

void runAllViewBuilderTests();

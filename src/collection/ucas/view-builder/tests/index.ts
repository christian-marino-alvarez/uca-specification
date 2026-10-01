import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { ViewBuilder } from '../index.js';
import { SignalType, type ViewVisualResult, type ViewGraphResult } from '../types.js';
import { __ID__ } from '../constants.js';
import { SignalType as LlmSignalType } from '@uca/llm';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testViewBuilder_IdentityAndDefaults(): void {
    const builder = new ViewBuilder();
    assert.strictEqual(builder.id, __ID__);
    assert.strictEqual(builder.purpose, ViewBuilder.purpose);
    assert.ok(builder instanceof Uca);
    builder.innervate();
    assert.strictEqual(builder.disposition.inputs?.length, 2);
    assert.strictEqual(builder.disposition.outputs?.length, 3);
    builder.denervate();
}

function testViewBuilder_BuildPulsesLlmInferSignal(): void {
    const bus = new EventTarget();
    const builder = new ViewBuilder('test-builder').innervate(bus);
    let capturedRequest: unknown;

    bus.addEventListener(LlmSignalType.INFER, (event: Event) => {
        capturedRequest = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, SignalType.BUILD, { description: 'Login form with email and password' });

    assert.ok(capturedRequest !== undefined);
    const requestRecord = capturedRequest as { request: string; expectations: Record<string, unknown> };
    assert.ok(requestRecord.request.includes('Login form'));
    assert.ok(requestRecord.expectations?.visual !== undefined);
    assert.ok(requestRecord.expectations?.graph !== undefined);

    builder.denervate();
}

function testViewBuilder_LlmInferredPulsesVisualAndGraph(): void {
    const bus = new EventTarget();
    const builder = new ViewBuilder('test-builder').innervate(bus);
    let capturedVisual: ViewVisualResult | undefined;
    let capturedGraph: ViewGraphResult | undefined;

    bus.addEventListener(SignalType.VISUAL, (event: Event) => {
        capturedVisual = (event as CustomEvent<Signal<ViewVisualResult>>).detail.value;
    });
    bus.addEventListener(SignalType.GRAPH, (event: Event) => {
        capturedGraph = (event as CustomEvent<Signal<ViewGraphResult>>).detail.value;
    });

    const mockAnswer = {
        visual: {
            title: 'Custom Search View',
            elements: [
                { id: 'search-box', type: 'box' as const },
                { id: 'search-input', type: 'input' as const },
            ],
        },
        graph: {
            nodes: [
                { id: 'search-input', aimDescription: 'Input field', inputsCount: 1, outputsCount: 1 },
            ],
            edges: [],
        },
    };

    emitSignal(bus, LlmSignalType.INFERRED, { data: mockAnswer, model: 'test-model' });

    assert.ok(capturedVisual !== undefined);
    assert.strictEqual(capturedVisual.title, 'Custom Search View');
    assert.strictEqual(capturedVisual.elements.length, 2);
    assert.strictEqual(capturedVisual.elements[0].type, 'box');

    assert.ok(capturedGraph !== undefined);
    assert.strictEqual(capturedGraph.nodes.length, 1);
    assert.strictEqual(capturedGraph.nodes[0].id, 'search-input');

    builder.denervate();
}

function testViewBuilder_LlmErrorPulsesError(): void {
    const bus = new EventTarget();
    const builder = new ViewBuilder('test-builder').innervate(bus);
    let capturedError: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        capturedError = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, LlmSignalType.ERROR, { message: 'Inference failure' });

    assert.deepStrictEqual(capturedError, { message: 'Inference failure' });

    builder.denervate();
}

function runAllViewBuilderTests(): void {
    testViewBuilder_IdentityAndDefaults();
    testViewBuilder_BuildPulsesLlmInferSignal();
    testViewBuilder_LlmInferredPulsesVisualAndGraph();
    testViewBuilder_LlmErrorPulsesError();
    console.log('✔ All ViewBuilder UCA minimal architecture tests passed successfully.');
}

runAllViewBuilderTests();

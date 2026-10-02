import * as assert from 'node:assert';
import { DispositionSignal, type Disposition, type Signal } from '@uca/core/types';
import { SignalType as LlmWebSignalType, type PromptPayload, type ResponsePayload } from '@uca/llm-web';
import {
    ViewComposer,
    DataType,
    SignalType,
    type ComposedResult,
    __ID__,
    PURPOSE,
} from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testViewComposer_IdentityAndDefaults(): void {
    const composer = new ViewComposer();
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, PURPOSE);
    composer.innervate();
    const { inputs, outputs } = composer.disposition;
    assert.strictEqual(inputs?.length, 1);
    assert.strictEqual(inputs?.[0]?.type, DataType.COMPOSE_PAYLOAD);
    assert.strictEqual(outputs?.length, 2);
    assert.strictEqual(outputs?.[0]?.type, DataType.COMPOSED_RESULT);
    composer.denervate();
}

function testViewComposer_ComposePulsesLlmPrompt(): void {
    const bus = new EventTarget();
    const composer = new ViewComposer('test-composer').innervate(bus);
    let capturedPromptPayload: PromptPayload | undefined;

    bus.addEventListener(LlmWebSignalType.PROMPT, (event: Event) => {
        capturedPromptPayload = (event as CustomEvent<Signal<PromptPayload>>).detail.value;
    });

    emitSignal(bus, SignalType.COMPOSE, { request: 'Generate dashboard with header and list' });
    assert.ok(capturedPromptPayload);
    assert.strictEqual(capturedPromptPayload?.prompt, 'Generate dashboard with header and list');
    composer.denervate();
}

function testViewComposer_LlmResponse_PropagatesDispositionsAndBuildsGraph(): void {
    const bus = new EventTarget();
    const composer = new ViewComposer('test-composer').innervate(bus);
    const updates: Array<{ id: string; disposition: Disposition }> = [];
    let capturedComposed: ComposedResult | undefined;

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        updates.push((event as CustomEvent<Signal<{ id: string; disposition: Disposition }>>).detail.value);
    });

    bus.addEventListener(SignalType.COMPOSED, (event: Event) => {
        capturedComposed = (event as CustomEvent<Signal<ComposedResult>>).detail.value;
    });

    const mockUcas: Record<string, Disposition> = {
        'search-input': {
            aim: { description: 'Search bar' },
            reactTo: [],
            outputs: [{ signal: 'search.query', type: 'string' }],
        },
        'result-list': {
            aim: { description: 'Results list' },
            reactTo: ['search.query'],
            inputs: [{ signal: 'search.query', type: 'string' }],
        },
    };

    const mockResult: ResponsePayload = { response: 'ok', data: { ucas: mockUcas } };
    emitSignal(bus, LlmWebSignalType.RESPONSE, mockResult);

    assert.strictEqual(updates.length, 2);
    assert.strictEqual(updates[0]?.id, 'search-input');
    assert.strictEqual(updates[1]?.id, 'result-list');

    assert.ok(capturedComposed);
    const { graph } = capturedComposed!;
    assert.strictEqual(graph.nodes.length, 2);
    assert.strictEqual(graph.edges.length, 1);
    assert.strictEqual(graph.edges[0]?.fromNode, 'search-input');
    assert.strictEqual(graph.edges[0]?.toNode, 'result-list');
    assert.strictEqual(graph.edges[0]?.signal, 'search.query');

    composer.denervate();
}

function testViewComposer_LlmErrorPulsesError(): void {
    const bus = new EventTarget();
    const composer = new ViewComposer('test-composer').innervate(bus);
    let capturedError: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        capturedError = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, LlmWebSignalType.ERROR, { message: 'Provider timeout' });
    assert.deepStrictEqual(capturedError, { message: 'Provider timeout' });
    composer.denervate();
}

function runAllViewComposerTests(): void {
    testViewComposer_IdentityAndDefaults();
    testViewComposer_ComposePulsesLlmPrompt();
    testViewComposer_LlmResponse_PropagatesDispositionsAndBuildsGraph();
    testViewComposer_LlmErrorPulsesError();
    console.log('✔ All ViewComposer UCA minimal architecture tests passed successfully.');
}

runAllViewComposerTests();

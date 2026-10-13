import * as assert from 'node:assert';
import { Capability } from '@uca/core/capability';
import type { Signal } from '@uca/core/types';
import { SignalType as LlmSignalType, type InferPayload } from '@uca/llm/types';
import { Decision } from '../index.js';
import { SignalType, type DecidedResult } from '../types.js';
import { __ID__, DEFAULT_PROVIDER, DEFAULT_MODEL } from '../constants.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testDecision_IdentityAndDefaults(): void {
    const decision = new Decision();
    assert.strictEqual(decision.id, __ID__);
    assert.ok(decision instanceof Capability);
    decision.innervate();
    assert.strictEqual(decision.disposition.inputs?.length, 2);
    assert.strictEqual(decision.disposition.outputs?.length, 3);
    decision.denervate();
}

function testDecision_DecideSignalEmitsLlmInfer(): void {
    const bus = new EventTarget();
    const decision = new Decision('decision-infer').innervate(bus);
    emitSignal(bus, decision.updateEvent, Decision.disposition);
    let capturedInfer: InferPayload | undefined;

    bus.addEventListener(LlmSignalType.INFER, (event: Event) => {
        capturedInfer = (event as CustomEvent<Signal<InferPayload>>).detail.value;
    });

    emitSignal(bus, SignalType.DECIDE, {
        state: { areaId: 'mainContainer' },
        question: 'Should this container be subdivided?',
        correlationId: 'test-correlation-1',
    });

    assert.ok(capturedInfer !== undefined);
    assert.strictEqual(capturedInfer.provider, DEFAULT_PROVIDER);
    assert.strictEqual(capturedInfer.model, DEFAULT_MODEL);
    assert.strictEqual(capturedInfer.correlationId, 'test-correlation-1');
    assert.strictEqual(capturedInfer.request, 'Should this container be subdivided?');

    decision.denervate();
}

function testDecision_InferredSignalEmitsDecided(): void {
    const bus = new EventTarget();
    const decision = new Decision('decision-result').innervate(bus);
    emitSignal(bus, decision.updateEvent, Decision.disposition);
    let capturedDecided: DecidedResult | undefined;

    bus.addEventListener(SignalType.DECIDED, (event: Event) => {
        capturedDecided = (event as CustomEvent<Signal<DecidedResult>>).detail.value;
    });

    emitSignal(bus, LlmSignalType.INFERRED, {
        correlationId: 'test-correlation-2',
        data: { decision: true },
        context: { areaId: 'mainContainer' },
    });

    assert.ok(capturedDecided !== undefined);
    assert.strictEqual(capturedDecided.decision, true);
    assert.strictEqual(capturedDecided.correlationId, 'test-correlation-2');

    decision.denervate();
}

function testDecision_ErrorSignalPropagated(): void {
    const bus = new EventTarget();
    const decision = new Decision('decision-error').innervate(bus);
    emitSignal(bus, decision.updateEvent, Decision.disposition);
    let capturedError: unknown;

    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        capturedError = (event as CustomEvent<Signal>).detail.value;
    });

    emitSignal(bus, LlmSignalType.ERROR, { message: 'Inference failure' });
    assert.ok(capturedError !== undefined);

    decision.denervate();
}

function captureDecided(bus: EventTarget): () => DecidedResult | undefined {
    let captured: DecidedResult | undefined;
    bus.addEventListener(SignalType.DECIDED, (event: Event) => {
        captured = (event as CustomEvent<Signal<DecidedResult>>).detail.value;
    });
    return () => captured;
}

function testDecision_ResolvesNoulProbabilityWithThreshold(): void {
    const bus = new EventTarget();
    const decision = new Decision('decision-noul').innervate(bus);
    emitSignal(bus, decision.updateEvent, Decision.disposition);
    const getDecided = captureDecided(bus);
    emitSignal(bus, LlmSignalType.INFERRED, { correlationId: 'c-yes', data: { decision: { type: 'noul', noul: 0.87 } } });
    assert.strictEqual(getDecided()?.decision, true);
    emitSignal(bus, LlmSignalType.INFERRED, { correlationId: 'c-no', data: { decision: { type: 'noul', noul: 0.12 } } });
    assert.strictEqual(getDecided()?.decision, false);
    emitSignal(bus, LlmSignalType.INFERRED, { correlationId: 'c-text', response: 'I do not know' });
    assert.strictEqual(getDecided()?.decision, false);
    decision.denervate();
}

function testDecision_IgnoresInferencesFromForeignLlm(): void {
    const bus = new EventTarget();
    const decision = new Decision('decision-source').innervate(bus);
    const disposition = { ...Decision.disposition, aim: { description: Decision.AIM, body: { llm: 'owner:llm' } } };
    emitSignal(bus, decision.updateEvent, disposition);
    const getDecided = captureDecided(bus);
    emitSignal(bus, LlmSignalType.INFERRED, { correlationId: 'foreign', data: { decision: true } });
    assert.strictEqual(getDecided(), undefined);
    decision.denervate();
}

function runAllDecisionTests(): void {
    testDecision_IdentityAndDefaults();
    testDecision_DecideSignalEmitsLlmInfer();
    testDecision_InferredSignalEmitsDecided();
    testDecision_ErrorSignalPropagated();
    testDecision_ResolvesNoulProbabilityWithThreshold();
    testDecision_IgnoresInferencesFromForeignLlm();
    console.log('✔ All Decision capability tests passed successfully.');
}

runAllDecisionTests();

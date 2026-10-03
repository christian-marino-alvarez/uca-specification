import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { DispositionSignal, type Signal } from '@uca/core/types';
import { SignalType as LlmWebSignalType, type StreamPayload } from '@uca/llm-web';
import { SignalType as GraphSignalType, type UcaItem } from '@uca/capability-graph';
import { App, SignalType, DataType, __ID__, PURPOSE } from '../index.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testApp_IdentityAndDefaults(): void {
    const app = new App();
    assert.ok(app instanceof Uca);
    assert.strictEqual(app.id, __ID__);
    assert.strictEqual(app.purpose, PURPOSE);
    const { inputs, outputs, aim } = app.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(inputs?.[0]?.type, DataType.VOID);
    assert.strictEqual(outputs?.length, 3);
    assert.strictEqual(outputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(aim.description, PURPOSE);
}

function testApp_InnervationAndCooky(): void {
    const bus = new EventTarget();
    const app = new App().innervate(bus);
    assert.notStrictEqual(app.target, undefined);
    assert.notStrictEqual(app.disposition, undefined);
    app.denervate();
}

function testApp_PulsesDomainSignals(): void {
    const bus = new EventTarget();
    const captured: { property: string; value: unknown }[] = [];

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        captured.push({ property: SignalType.CREATED, value: (event as CustomEvent<Signal>).detail?.value });
    });
    bus.addEventListener(SignalType.UPDATED, (event: Event) => {
        captured.push({ property: SignalType.UPDATED, value: (event as CustomEvent<Signal>).detail?.value });
    });
    bus.addEventListener(SignalType.REMOVED, (event: Event) => {
        captured.push({ property: SignalType.REMOVED, value: (event as CustomEvent<Signal>).detail?.value });
    });

    const app = new App('app-scaffold').innervate(bus);
    emitSignal(bus, SignalType.UPDATE, {});
    emitSignal(bus, SignalType.REMOVE, {});

    assert.ok(captured.length >= 3);
    assert.ok(captured.some((c) => c.property === SignalType.CREATED));
    assert.ok(captured.some((c) => c.property === SignalType.UPDATED));
    assert.ok(captured.some((c) => c.property === SignalType.REMOVED));

    app.denervate();
}

function testApp_InnervateTriggersViewComposer(): void {
    const bus = new EventTarget();
    let capturedCreate: unknown;

    bus.addEventListener('view-composer.create', (event: Event) => {
        capturedCreate = (event as CustomEvent<Signal>).detail?.value;
    });

    const app = new App('app-composer-test').innervate(bus);
    assert.ok(capturedCreate !== undefined);
    app.denervate();
}

function testApp_InnervateTriggersLlmStream(): void {
    const bus = new EventTarget();
    let capturedStream: StreamPayload | undefined;

    bus.addEventListener(LlmWebSignalType.STREAM, (event: Event) => {
        const signal = (event as CustomEvent<Signal<StreamPayload>>).detail;
        capturedStream = signal?.value;
    });

    const app = new App('app-orchestrator').innervate(bus);

    assert.ok(capturedStream !== undefined);
    assert.ok(capturedStream?.prompt?.includes('Universal Cognitive Architecture'));
    assert.ok(capturedStream?.prompt?.includes('VIEW IMAGINATION GUIDELINES'));

    app.denervate();
}

async function testApp_ConsumesUcaStreamAndInnervates(): Promise<void> {
    const bus = new EventTarget();
    const app = new App('app-stream-consumer').innervate(bus);
    const capturedUpdates: string[] = [];
    const capturedDetected: string[] = [];

    bus.addEventListener(DispositionSignal.UPDATE, (event: Event) => {
        const payload = (event as CustomEvent<Signal<{ id: string }>>).detail.value;
        capturedUpdates.push(payload.id);
    });

    bus.addEventListener(GraphSignalType.UCA_DETECTED, (event: Event) => {
        const payload = (event as CustomEvent<Signal<{ id: string }>>).detail.value;
        capturedDetected.push(payload.id);
    });

    const stream = new ReadableStream<UcaItem>({
        start(controller) {
            controller.enqueue({
                id: 'box:hero-card',
                disposition: { aim: { description: 'Hero Card', body: { text: 'Welcome' } } },
            });
            controller.enqueue({
                id: 'action:start-btn',
                disposition: { aim: { description: 'Start Button', body: { label: 'Go' } } },
            });
            controller.close();
        },
    });

    emitSignal(bus, GraphSignalType.UCA_STREAM, { stream, streamId: 'session-123' });
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.strictEqual(capturedUpdates.length, 2);
    assert.ok(capturedUpdates.includes('box:hero-card'));
    assert.ok(capturedUpdates.includes('action:start-btn'));
    assert.strictEqual(capturedDetected.length, 2);
    assert.ok(capturedDetected.includes('box:hero-card'));
    assert.ok(capturedDetected.includes('action:start-btn'));

    app.denervate();
}

async function runAllAppTests(): Promise<void> {
    testApp_IdentityAndDefaults();
    testApp_InnervationAndCooky();
    testApp_PulsesDomainSignals();
    testApp_InnervateTriggersViewComposer();
    testApp_InnervateTriggersLlmStream();
    await testApp_ConsumesUcaStreamAndInnervates();
    console.log('✔ All App UCA lifecycle, ViewComposer scaffolding, and stream orchestration tests passed successfully.');
}

runAllAppTests();

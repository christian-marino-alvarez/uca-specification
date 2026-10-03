import * as assert from 'node:assert';
import { setMaxListeners } from 'node:events';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as LlmWebSignalType, type StreamPayload } from '@uca/llm-web';
import { SignalType as GraphSignalType, type UcaItem } from '@uca/capability-graph';
import { SignalType as BoxSignalType } from '@uca/box';
import { SignalType as ActionSignalType } from '@uca/action';
import { ViewComposer, SignalType, DataType, __ID__, PURPOSE } from '../index.js';

function createTestBus(): EventTarget {
    const bus = new EventTarget();
    try { setMaxListeners(50, bus); } catch { }
    return bus;
}

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testViewComposer_IdentityAndDefaults(): void {
    const composer = new ViewComposer();
    assert.ok(composer instanceof Uca);
    assert.strictEqual(composer.id, __ID__);
    assert.strictEqual(composer.purpose, PURPOSE);
    const { inputs, outputs, aim } = composer.disposition;
    assert.strictEqual(inputs?.length, 4);
    assert.strictEqual(inputs?.[0]?.type, DataType.VOID);
    assert.strictEqual(outputs?.length, 4);
    assert.strictEqual(outputs?.[0]?.type, DataType.RECORD);
    assert.strictEqual(aim.description, PURPOSE);
}

function testViewComposer_InnervationAndCooky(): void {
    const bus = createTestBus();
    const composer = new ViewComposer().innervate(bus);
    assert.notStrictEqual(composer.target, undefined);
    assert.notStrictEqual(composer.disposition, undefined);
    composer.denervate();
}

function testViewComposer_PulsesDomainSignals(): void {
    const bus = createTestBus();
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

    const composer = new ViewComposer('test-composer').innervate(bus);
    emitSignal(bus, SignalType.CREATE, { title: 'Initial View' });
    emitSignal(bus, SignalType.UPDATE, { title: 'Updated View' });
    emitSignal(bus, SignalType.REMOVE, {});

    assert.ok(captured.length >= 3);
    assert.strictEqual(captured[0]?.property, SignalType.CREATED);
    assert.strictEqual(captured[1]?.property, SignalType.UPDATED);
    assert.strictEqual(captured[2]?.property, SignalType.REMOVED);

    composer.denervate();
}

function testViewComposer_CreatePulsesLlmWebStream(): void {
    const bus = createTestBus();
    let capturedStream: StreamPayload | undefined;

    bus.addEventListener(LlmWebSignalType.STREAM, (event: Event) => {
        capturedStream = (event as CustomEvent<Signal<StreamPayload>>).detail?.value;
    });

    const composer = new ViewComposer('composer-llm-test').innervate(bus);
    emitSignal(bus, SignalType.CREATE, { prompt: 'Compose modern hero card' });

    assert.ok(capturedStream !== undefined);
    assert.strictEqual(capturedStream?.prompt, 'Compose modern hero card');

    composer.denervate();
}

async function testViewComposer_ConsumesGraphUcaStreamAndInnervatesWebUca(): Promise<void> {
    const bus = createTestBus();
    const composer = new ViewComposer('composer-stream-test').innervate(bus);
    const capturedSignals: string[] = [];

    bus.addEventListener(BoxSignalType.CREATED, () => capturedSignals.push(BoxSignalType.CREATED));
    bus.addEventListener(ActionSignalType.CREATED, () => capturedSignals.push(ActionSignalType.CREATED));

    const stream = new ReadableStream<UcaItem>({
        start(controller) {
            controller.enqueue({
                id: 'box:hero-card',
                disposition: { aim: { description: 'Hero Card', body: { text: 'Welcome' } }, reactTo: [] },
            });
            controller.enqueue({
                id: 'action:submit-btn',
                disposition: { aim: { description: 'Submit Button', body: { label: 'Go' } }, reactTo: [] },
            });
            controller.close();
        },
    });

    emitSignal(bus, GraphSignalType.UCA_STREAM, { stream });
    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.ok(capturedSignals.includes(BoxSignalType.CREATED));
    assert.ok(capturedSignals.includes(ActionSignalType.CREATED));

    composer.denervate();
}

async function runAllViewComposerTests(): Promise<void> {
    testViewComposer_IdentityAndDefaults();
    testViewComposer_InnervationAndCooky();
    testViewComposer_PulsesDomainSignals();
    testViewComposer_CreatePulsesLlmWebStream();
    await testViewComposer_ConsumesGraphUcaStreamAndInnervatesWebUca();
    console.log('✔ All ViewComposer UCA tests with LlmWeb, Graph, and Web UCAs passed successfully.');
}

runAllViewComposerTests();

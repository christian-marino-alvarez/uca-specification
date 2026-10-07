import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as ApiPromptSignalType } from '@uca/capability-api-prompt/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { SignalType as ContentSignalType } from '@uca/content/types';
import { SignalType as FooterSignalType } from '@uca/footer/types';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { App } from '../index.js';
import { __ID__ } from '../constants.js';
import {
    type DestroyResult,
    type LoadingResult,
    type ProgressResult,
    DataType,
    SignalType,
} from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testApp_IdentityAndDefaults(): void {
    const app = new App();
    assert.ok(app instanceof Uca);
    assert.strictEqual(app.id, __ID__);
    assert.strictEqual(app.purpose, App.purpose);
    const { inputs, outputs, aim } = App.disposition;
    assert.strictEqual(inputs?.length, 14);
    assert.strictEqual(outputs?.length, 17);
    assert.strictEqual(inputs?.[0]?.type, DataType.PAYLOAD);
    assert.strictEqual(aim.description, App.purpose);
}

function testApp_Innervation(): void {
    const bus = new EventTarget();
    const app = new App('custom-app').innervate(bus);
    assert.strictEqual(app.id, 'custom-app');
    assert.strictEqual(app.target, bus);
    app.denervate();
}

async function testApp_LocalLlmLoadingAndProgressFlow(): Promise<void> {
    const bus = new EventTarget();
    const loadingStates: LoadingResult[] = [];
    const progressList: ProgressResult[] = [];
    bus.addEventListener(SignalType.LOADING, (e) => loadingStates.push((e as CustomEvent<Signal>).detail?.value as LoadingResult));
    bus.addEventListener(SignalType.PROGRESS, (e) => progressList.push((e as CustomEvent<Signal>).detail?.value as ProgressResult));
    const app = new App().innervate(bus);
    emitSignal(bus, ApiPromptSignalType.DOWNLOADING, { loaded: 50, total: 100, percentage: 50 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.strictEqual(progressList.length, 1);
    assert.strictEqual(loadingStates[0]?.loading, true);
    emitSignal(bus, WebLlmSignalType.READY, { ready: true });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.strictEqual(loadingStates[1]?.loading, false);
    app.denervate();
}

function setupStreamListeners(bus: EventTarget): { get: () => [boolean, boolean] } {
    let contentStreamStarted = false;
    let footerStreamStarted = false;
    bus.addEventListener(ContentSignalType.STREAM, () => { contentStreamStarted = true; });
    bus.addEventListener(FooterSignalType.STREAM, () => { footerStreamStarted = true; });
    return { get: () => [contentStreamStarted, footerStreamStarted] };
}

async function testApp_CascadeScaffoldForwardingAndCompletion(): Promise<void> {
    const bus = new EventTarget();
    const streams = setupStreamListeners(bus);
    let completedCount = 0;
    bus.addEventListener(SignalType.CREATED, () => { completedCount++; });
    const app = new App().innervate(bus);
    emitSignal(bus, SignalType.STREAM, { model: 'local' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.deepStrictEqual(streams.get(), [true, false]);
    await advanceCascadeStages(bus, streams);
    assert.strictEqual(completedCount, 2);
    app.denervate();
}

async function advanceCascadeStages(bus: EventTarget, streams: { get: () => [boolean, boolean] }): Promise<void> {
    emitSignal(bus, ContentSignalType.CREATED, { correlationId: 'content:stream:1', scaffold: { hero: {} } });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.deepStrictEqual(streams.get(), [true, true]);
    emitSignal(bus, FooterSignalType.CREATED, { correlationId: 'footer:stream:2', scaffold: { copyright: {} } });
    await new Promise((resolve) => setTimeout(resolve, 20));
}

async function testApp_DestroyContract(): Promise<void> {
    const bus = new EventTarget();
    let destroyedResult: DestroyResult | undefined;
    bus.addEventListener(SignalType.DESTROYED, (event: Event) => {
        destroyedResult = (event as CustomEvent<Signal>).detail?.value as DestroyResult;
    });
    const app = new App().innervate(bus);
    emitSignal(bus, SignalType.DESTROY, {});
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.ok(destroyedResult !== undefined);
    assert.strictEqual(destroyedResult?.destroyed, true);
    app.denervate();
}

async function testApp_ActionTriggeredStartsScaffolding(): Promise<void> {
    const bus = new EventTarget();
    let contentStreamTriggered = false;
    bus.addEventListener(ContentSignalType.STREAM, () => { contentStreamTriggered = true; });
    const app = new App().innervate(bus);
    emitSignal(bus, ActionSignalType.TRIGGERED, { id: 'action:submit', request: 'Test query' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.strictEqual(contentStreamTriggered, true);
    app.denervate();
}

function testApp_CascadingConceptualLineageTrace(): void {
    const app = new App('app').innervate(new EventTarget());
    const { registry } = app as unknown as { registry: Map<string, Uca> };
    const content = registry.get('content');
    const { registry: contentRegistry } = content as unknown as { registry: Map<string, Uca> };
    const scaffold = contentRegistry.get('content:scaffold');
    assert.strictEqual(content?.context, App.purpose);
    assert.strictEqual(scaffold?.context, `${App.purpose} → ${content?.purpose}`);
    app.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing App UCA with Content and Footer...');
    testApp_IdentityAndDefaults();
    testApp_Innervation();
    testApp_CascadingConceptualLineageTrace();
    await testApp_LocalLlmLoadingAndProgressFlow();
    await testApp_ActionTriggeredStartsScaffolding();
    await testApp_CascadeScaffoldForwardingAndCompletion();
    await testApp_DestroyContract();
    console.log('✅ All App UCA tests passed successfully!');
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});

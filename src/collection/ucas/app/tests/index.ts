import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as ApiPromptSignalType } from '@uca/capability-api-prompt/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { SignalType as HeaderSignalType } from '@uca/header/types';
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
    assert.strictEqual(inputs?.length, 18);
    assert.strictEqual(outputs?.length, 22);
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

    bus.addEventListener(SignalType.LOADING, (event: Event) => {
        loadingStates.push((event as CustomEvent<Signal>).detail?.value as LoadingResult);
    });

    bus.addEventListener(SignalType.PROGRESS, (event: Event) => {
        progressList.push((event as CustomEvent<Signal>).detail?.value as ProgressResult);
    });

    const app = new App().innervate(bus);
    emitSignal(bus, ApiPromptSignalType.DOWNLOADING, { loaded: 50, total: 100, percentage: 50 });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(progressList.length, 1);
    assert.strictEqual(progressList[0]?.percentage, 50);
    assert.strictEqual(loadingStates[0]?.loading, true);

    emitSignal(bus, WebLlmSignalType.READY, { ready: true });
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.strictEqual(loadingStates[1]?.loading, false);
    app.denervate();
}

function setupStreamListeners(bus: EventTarget): { get: () => [boolean, boolean, boolean] } {
    let headerStreamStarted = false;
    let contentStreamStarted = false;
    let footerStreamStarted = false;
    bus.addEventListener(HeaderSignalType.STREAM, () => { headerStreamStarted = true; });
    bus.addEventListener(ContentSignalType.STREAM, () => { contentStreamStarted = true; });
    bus.addEventListener(FooterSignalType.STREAM, () => { footerStreamStarted = true; });
    return { get: () => [headerStreamStarted, contentStreamStarted, footerStreamStarted] };
}

async function testApp_CascadeScaffoldForwardingAndCompletion(): Promise<void> {
    const bus = new EventTarget();
    const streams = setupStreamListeners(bus);
    let sectionsCompleted = 0;
    bus.addEventListener(SignalType.CREATED, () => { sectionsCompleted++; });
    const app = new App().innervate(bus);
    emitSignal(bus, SignalType.STREAM, { model: 'local' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.deepStrictEqual(streams.get(), [true, false, false]);
    await advanceCascadeStages(bus, streams);
    assert.strictEqual(sectionsCompleted, 3);
    app.denervate();
}

async function advanceCascadeStages(bus: EventTarget, streams: { get: () => [boolean, boolean, boolean] }): Promise<void> {
    emitSignal(bus, HeaderSignalType.CREATED, { correlationId: 'header:stream:1', scaffold: { brandLogo: {} } });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.deepStrictEqual(streams.get(), [true, true, false]);
    emitSignal(bus, ContentSignalType.CREATED, { correlationId: 'content:stream:2', scaffold: { heroBanner: {} } });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.deepStrictEqual(streams.get(), [true, true, true]);
    emitSignal(bus, FooterSignalType.CREATED, { correlationId: 'footer:stream:3', scaffold: { copyright: {} } });
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
    let headerStreamTriggered = false;
    bus.addEventListener(HeaderSignalType.STREAM, () => { headerStreamTriggered = true; });
    const app = new App().innervate(bus);
    emitSignal(bus, ActionSignalType.TRIGGERED, { id: 'action:generate' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.strictEqual(headerStreamTriggered, true);
    app.denervate();
}

function testApp_CascadingConceptualLineageTrace(): void {
    const app = new App('app').innervate(new EventTarget());
    const { registry } = app as unknown as { registry: Map<string, Uca> };
    const header = registry.get('header');
    const { registry: headerRegistry } = header as unknown as { registry: Map<string, Uca> };
    const scaffold = headerRegistry.get('header:scaffold');
    assert.strictEqual(header?.context, App.purpose);
    assert.strictEqual(scaffold?.context, `${App.purpose} → ${header?.purpose}`);
    app.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing App UCA with cascade Header, Content, and Footer...');
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

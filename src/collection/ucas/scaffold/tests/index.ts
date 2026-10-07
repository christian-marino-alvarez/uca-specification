import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import { type Signal } from '@uca/core/types';
import { SignalType as WebLlmSignalType } from '@uca/web-llm/types';
import { Scaffold } from '../index.js';
import { __ID__ } from '../constants.js';
import {
    type ChunkResult,
    type CreatedResult,
    type DestroyResult,
    type ErrorResult,
    type StreamResult,
    DataType,
    SignalType,
} from '../types.js';

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function createTextStream(chunks: string[]): ReadableStream<string> {
    return new ReadableStream<string>({
        start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(chunk);
            }
            controller.close();
        },
    });
}

function testScaffold_IdentityAndDefaults(): void {
    const scaffold = new Scaffold();
    assert.ok(scaffold instanceof Uca);
    assert.strictEqual(scaffold.id, __ID__);
    assert.strictEqual(scaffold.purpose, Scaffold.purpose);
    const { inputs, outputs, aim } = Scaffold.disposition;
    assert.strictEqual(inputs?.length, 3);
    assert.strictEqual(outputs?.length, 5);
    assert.strictEqual(inputs?.[0]?.type, DataType.PAYLOAD);
    assert.strictEqual(aim.description, Scaffold.purpose);
}

function testScaffold_Innervation(): void {
    const bus = new EventTarget();
    const scaffold = new Scaffold('custom-scaffold').innervate(bus);
    assert.strictEqual(scaffold.id, 'custom-scaffold');
    assert.strictEqual(scaffold.target, bus);
    scaffold.denervate();
}

async function testScaffold_PipelineStreamingAndAccumulation(): Promise<void> {
    const bus = new EventTarget();
    let streamResult: StreamResult | undefined;
    const receivedChunks: ChunkResult[] = [];
    let createdResult: CreatedResult | undefined;

    bus.addEventListener(SignalType.STREAMED, (event: Event) => {
        streamResult = (event as CustomEvent<Signal>).detail?.value as StreamResult;
    });

    bus.addEventListener(SignalType.CHUNK, (event: Event) => {
        receivedChunks.push((event as CustomEvent<Signal>).detail?.value as ChunkResult);
    });

    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        createdResult = (event as CustomEvent<Signal>).detail?.value as CreatedResult;
    });

    const scaffold = new Scaffold().innervate(bus);

    const mockChunks = [
        '{"main-layout": {"purpose": "Primary application layout container", "parentTo": null}}\n',
        '{"navigation-bar": {"purpose": "Header navigation bar", "parentTo": "main-layout"}}\n',
        '{"search-input": {"purpose": "Keyword search input element", "parentTo": "navigation-bar"}}\n',
    ];

    emitSignal(bus, SignalType.STREAM, {
        request: 'Create an e-commerce catalog dashboard',
        correlationId: 'c-scaffold-1',
        streamId: 's-scaffold-1',
    });

    emitSignal(bus, WebLlmSignalType.STREAMED, {
        correlationId: 'c-scaffold-1',
        streamId: 's-scaffold-1',
        stream: createTextStream(mockChunks),
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    assert.ok(streamResult !== undefined);
    assert.strictEqual(streamResult?.correlationId, 'c-scaffold-1');
    assert.ok(streamResult?.stream instanceof ReadableStream);

    assert.strictEqual(receivedChunks.length, 3);
    assert.deepStrictEqual(receivedChunks[0]?.chunk, {
        'main-layout': { purpose: 'Primary application layout container', parentTo: null },
    });
    assert.deepStrictEqual(receivedChunks[1]?.chunk, {
        'navigation-bar': { purpose: 'Header navigation bar', parentTo: 'main-layout' },
    });
    assert.deepStrictEqual(receivedChunks[2]?.chunk, {
        'search-input': { purpose: 'Keyword search input element', parentTo: 'navigation-bar' },
    });

    assert.ok(createdResult !== undefined);
    assert.strictEqual(createdResult?.correlationId, 'c-scaffold-1');
    const { scaffold: generatedScaffold } = createdResult;
    assert.ok('main-layout' in generatedScaffold);
    assert.ok('navigation-bar' in generatedScaffold);
    assert.ok('search-input' in generatedScaffold);
    assert.strictEqual(generatedScaffold['search-input']?.parentTo, 'navigation-bar');

    scaffold.denervate();
}

async function testScaffold_DestroyContract(): Promise<void> {
    const bus = new EventTarget();
    let destroyedResult: DestroyResult | undefined;

    bus.addEventListener(SignalType.DESTROYED, (event: Event) => {
        destroyedResult = (event as CustomEvent<Signal>).detail?.value as DestroyResult;
    });

    const scaffold = new Scaffold().innervate(bus);
    emitSignal(bus, SignalType.DESTROY, {});
    await new Promise((resolve) => setTimeout(resolve, 20));

    assert.ok(destroyedResult !== undefined);
    assert.strictEqual(destroyedResult?.destroyed, true);

    scaffold.denervate();
}

function setupErrorCapture(bus: EventTarget): { get: () => ErrorResult | undefined } {
    let errorResult: ErrorResult | undefined;
    bus.addEventListener(SignalType.ERROR, (event: Event) => {
        errorResult = (event as CustomEvent<Signal>).detail?.value as ErrorResult;
    });
    return { get: () => errorResult };
}

async function testScaffold_EmptyStreamEmitsError(): Promise<void> {
    const bus = new EventTarget();
    const capture = setupErrorCapture(bus);
    const scaffold = new Scaffold().innervate(bus);
    emitSignal(bus, SignalType.STREAM, { request: 'Test', correlationId: 'c-empty' });
    emitSignal(bus, WebLlmSignalType.STREAMED, { correlationId: 'c-empty', stream: createTextStream([]) });
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.ok(capture.get() !== undefined);
    assert.strictEqual(capture.get()?.action, 'stream');
    scaffold.denervate();
}

async function runTests(): Promise<void> {
    console.log('🧪 Testing Scaffold UCA (structured web application scaffolding)...');
    testScaffold_IdentityAndDefaults();
    testScaffold_Innervation();
    await testScaffold_PipelineStreamingAndAccumulation();
    await testScaffold_EmptyStreamEmitsError();
    await testScaffold_DestroyContract();
    console.log('✅ All Scaffold UCA tests passed successfully!');
}

runTests().catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});

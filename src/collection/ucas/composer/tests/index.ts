import { strict as assert } from 'node:assert';
import { Composer } from '../index.js';
import { SignalType, type ComposedResult } from '../types.js';
import { __ID__, DEFAULT_PURPOSE } from '../constants.js';

function createMockStream(content: string): ReadableStream<string> {
    return new ReadableStream<string>({
        start(controller) {
            controller.enqueue(content);
            controller.close();
        },
    });
}

function testComposer_Initialization(): void {
    const composer = new Composer();
    assert.equal(composer.id, __ID__);
    assert.equal(Composer.purpose, DEFAULT_PURPOSE);
    const { aim } = Composer.disposition;
    assert.equal(aim.description, DEFAULT_PURPOSE);
}

function assertComposedResult(result: ComposedResult, customCssRules: unknown[]): void {
    assert.equal(result.targetUca, 'panelExplorer');
    assert.equal(result.nodes.length, 2);
    assert.equal(result.nodes[0]?.uca, 'box');
    assert.equal(result.nodes[1]?.uca, 'action');
    assert.equal(customCssRules.length, 1);
}

async function testComposer_StreamedReaction(): Promise<void> {
    const bus = new EventTarget();
    const composer = new Composer();
    composer.innervate(bus);
    let composedResult: ComposedResult | undefined;
    const customCssRules: unknown[] = [];
    bus.addEventListener(SignalType.COMPOSED, (event: Event) => {
        const { detail } = event as CustomEvent;
        composedResult = detail?.value as ComposedResult;
    });
    bus.addEventListener('css.create', (event: Event) => {
        const { detail } = event as CustomEvent;
        customCssRules.push(detail?.value);
    });
    const mockContent = JSON.stringify({
        nodes: [
            { id: 'boxCard', uca: 'box', parentTo: 'panelExplorer', body: { className: 'uca-skin-surface' } },
            { id: 'btnSubmit', uca: 'action', parentTo: 'boxCard', body: { label: 'Ejecutar', className: 'uca-component-button' } },
        ],
        rules: [
            { selector: '.custom-highlight', declarations: { 'border-color': '#00ff88' } },
        ],
    });
    const stream = createMockStream(mockContent);
    bus.dispatchEvent(new CustomEvent('web-llm.streamed', {
        detail: { source: 'test', property: 'web-llm.streamed', value: { correlationId: 'c-1', stream, targetUca: 'panelExplorer' } },
    }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.ok(composedResult);
    assertComposedResult(composedResult, customCssRules);
}

async function runTests(): Promise<void> {
    testComposer_Initialization();
    await testComposer_StreamedReaction();
    console.log('✅ Composer UCA tests passed successfully');
}

runTests();

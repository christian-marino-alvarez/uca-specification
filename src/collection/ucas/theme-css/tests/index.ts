import { strict as assert } from 'node:assert';
import { ThemeCss } from '../index.js';
import { SignalType, type ThemeResult } from '../types.js';
import { __ID__, DEFAULT_PURPOSE } from '../constants.js';

function testThemeCssInitialization(): void {
    const theme = new ThemeCss();
    assert.equal(theme.id, __ID__);
    assert.equal(ThemeCss.purpose, DEFAULT_PURPOSE);
    const { aim } = ThemeCss.disposition;
    assert.equal(aim.description, DEFAULT_PURPOSE);
}

async function testThemeCssStreamedReaction(): Promise<void> {
    const bus = new EventTarget();
    const theme = new ThemeCss();
    theme.innervate(bus);

    let createdResult: ThemeResult | undefined;
    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        const customEvent = event as CustomEvent;
        createdResult = customEvent.detail?.value as ThemeResult;
    });

    const mockContent = '{"selector":":root","declarations":{"--primary":"#00d2ff"}}\n{"selector":".box","declarations":{"padding":"1rem"}}';
    const stream = new ReadableStream<string>({
        start(controller) {
            controller.enqueue(mockContent);
            controller.close();
        },
    });

    bus.dispatchEvent(new CustomEvent('web-llm.streamed', {
        detail: { source: 'test', property: 'web-llm.streamed', value: { correlationId: 'test-123', stream } },
    }));

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.ok(createdResult);
    assert.equal(createdResult.correlationId, 'test-123');
    assert.ok(createdResult.rules.length >= 2);
    const rootRule = createdResult.rules.find((r) => r.selector === ':root');
    assert.equal(rootRule?.declarations['--primary'], '#00d2ff');
    const bodyRule = createdResult.rules.find((r) => r.selector === 'body');
    assert.ok(bodyRule?.declarations['font-family']);
}

function createMockStream(content: string): ReadableStream<string> {
    return new ReadableStream<string>({
        start(controller) {
            controller.enqueue(content);
            controller.close();
        },
    });
}

function assertOocssRules(result: ThemeResult): void {
    const { rules } = result;
    const gridRule = rules.find((rule) => rule.selector === '.grid-layout');
    assert.equal(gridRule, undefined);
    const cardRule = rules.find((rule) => rule.selector === '.card');
    assert.ok(cardRule);
    assert.equal(cardRule.declarations['background'], '#fff');
    assert.equal(cardRule.declarations['grid-area'], undefined);
}

async function testThemeCssOocssSanitization(): Promise<void> {
    const bus = new EventTarget();
    const theme = new ThemeCss();
    theme.innervate(bus);
    let createdResult: ThemeResult | undefined;
    bus.addEventListener(SignalType.CREATED, (event: Event) => {
        const { detail } = event as CustomEvent;
        createdResult = detail?.value as ThemeResult;
    });
    const content = '{"selector":".grid-layout","declarations":{"display":"grid","grid-template-columns":"1fr"}}\n{"selector":".card","declarations":{"background":"#fff","grid-area":"main"}}';
    const stream = createMockStream(content);
    bus.dispatchEvent(new CustomEvent('web-llm.streamed', {
        detail: { source: 'test', property: 'web-llm.streamed', value: { correlationId: 'test-oocss', stream } },
    }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.ok(createdResult);
    assertOocssRules(createdResult);
}

async function runTests(): Promise<void> {
    testThemeCssInitialization();
    await testThemeCssStreamedReaction();
    await testThemeCssOocssSanitization();
    console.log('✅ ThemeCss UCA tests passed successfully');
}

runTests();


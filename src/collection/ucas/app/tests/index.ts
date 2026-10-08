import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { SignalType as ThemeCssSignalType, type CssRule, type ThemeResult } from '@uca/theme-css/types';
import { App } from '../index.js';
import { DEFAULT_CONTEXT, DEFAULT_MODEL, DEFAULT_THEME_MODEL, DEFAULT_PROVIDER, DEFAULT_PURPOSE } from '../constants.js';
import { SignalType } from '../types.js';

function emitSignal(app: App, property: string, value?: unknown): void {
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    app.target?.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testApp_IdentityAndPurpose(): void {
    const app = new App();
    assert.ok(app instanceof Uca);
    assert.strictEqual(app.id, 'app');
    assert.strictEqual(app.purpose, DEFAULT_PURPOSE);
    assert.strictEqual(app.context, DEFAULT_CONTEXT);
    app.denervate();
}

function testApp_ContextProvisioningToScaffold(): void {
    const app = new App().innervate();
    let capturedScaffoldPayload: { request?: string; context?: string; model?: string; provider?: string } | undefined;

    app.target?.addEventListener(ScaffoldSignalType.STREAM, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<{ request: string; context: string; model: string; provider: string }>>;
        capturedScaffoldPayload = detail.value;
    });

    emitSignal(app, SignalType.START);
    assert.notStrictEqual(capturedScaffoldPayload, undefined);
    assert.strictEqual(capturedScaffoldPayload?.request, DEFAULT_PURPOSE);
    assert.strictEqual(capturedScaffoldPayload?.context, DEFAULT_CONTEXT);
    assert.strictEqual(capturedScaffoldPayload?.model, DEFAULT_MODEL);
    assert.strictEqual(capturedScaffoldPayload?.provider, DEFAULT_PROVIDER);

    app.denervate();
}

function testApp_ContextProvisioningToTheme(): void {
    const app = new App().innervate();
    let capturedThemePayload: { request?: string; context?: string; model?: string; provider?: string } | undefined;

    app.target?.addEventListener(ThemeCssSignalType.CREATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<{ request: string; context: string; model: string; provider: string }>>;
        capturedThemePayload = detail.value;
    });

    emitSignal(app, SignalType.START);
    assert.notStrictEqual(capturedThemePayload, undefined);
    assert.strictEqual(capturedThemePayload?.request, DEFAULT_PURPOSE);
    assert.strictEqual(capturedThemePayload?.model, DEFAULT_THEME_MODEL);
    assert.strictEqual(capturedThemePayload?.model, 'gemini-3.5-flash-lite');

    app.denervate();
}

function testApp_InjectsBaseThemeOnStart(): void {
    const app = new App().innervate();
    const createdRules: unknown[] = [];
    app.target?.addEventListener(CssSignalType.CREATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<unknown>>;
        createdRules.push(detail.value);
    });
    emitSignal(app, SignalType.START);
    assert.ok(createdRules.length >= 4);
    app.denervate();
}

function testApp_BarrierHoldsScaffold(): void {
    const app = new App().innervate();
    let receivedChunk: unknown;
    app.target?.addEventListener(SignalType.CHUNK, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<{ chunk: unknown }>>;
        receivedChunk = detail.value.chunk;
    });
    const mockChunk = { boxHeader: { purpose: 'Header', parentTo: 'app' } };
    emitSignal(app, ScaffoldSignalType.CHUNK, { chunk: mockChunk });
    assert.strictEqual(receivedChunk, undefined);
    app.denervate();
}

function testApp_BarrierFlushesOnTheme(): void {
    const app = new App().innervate();
    let receivedChunk: unknown;
    app.target?.addEventListener(SignalType.CHUNK, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<{ chunk: unknown }>>;
        receivedChunk = detail.value.chunk;
    });
    const mockChunk = { boxHeader: { purpose: 'Header', parentTo: 'app' } };
    emitSignal(app, ScaffoldSignalType.CHUNK, { chunk: mockChunk });
    emitSignal(app, ThemeCssSignalType.CREATED, { correlationId: 't1', rules: [] } satisfies ThemeResult);
    assert.deepStrictEqual(receivedChunk, mockChunk);
    app.denervate();
}

function testApp_ThemeAndCssIntegration(): void {
    const app = new App().innervate();
    const createdCssRules: unknown[] = [];
    let capturedThemeResult: unknown;

    app.target?.addEventListener(CssSignalType.CREATE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<unknown>>;
        createdCssRules.push(detail.value);
    });
    app.target?.addEventListener(SignalType.THEME_CREATED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<unknown>>;
        capturedThemeResult = detail.value;
    });

    const mockRules: CssRule[] = [
        { selector: ':root', declarations: { '--bg-color': '#111' } },
        { selector: '.box', declarations: { padding: '1rem' } },
    ];
    emitSignal(app, ThemeCssSignalType.CREATED, { correlationId: 'theme-1', rules: mockRules } satisfies ThemeResult);

    assert.strictEqual(createdCssRules.length, 2);
    assert.deepStrictEqual(createdCssRules, mockRules);
    assert.ok(capturedThemeResult);
    app.denervate();
}

import { SignalType as ComposerSignalType, type ComposePayload, type ComposedResult } from '@uca/composer/types';

function testApp_PassesParentContextToComposer(): void {
    const app = new App().innervate();
    const capturedPayloads: ComposePayload[] = [];

    app.target?.addEventListener(ComposerSignalType.COMPOSE, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<ComposePayload>>;
        capturedPayloads.push(detail.value);
    });

    emitSignal(app, ThemeCssSignalType.CREATED, { correlationId: 't1', rules: [] } satisfies ThemeResult);

    const chunk1 = {
        mainContainer: { purpose: 'Main layout box container', parentTo: 'app' },
    };
    emitSignal(app, ScaffoldSignalType.CHUNK, { chunk: chunk1 });

    assert.strictEqual(capturedPayloads.length, 1);
    assert.strictEqual(capturedPayloads[0].targetUca, 'mainContainer');
    assert.strictEqual(capturedPayloads[0].parentTo, 'app');
    assert.strictEqual(capturedPayloads[0].parentContext, DEFAULT_CONTEXT);

    const chunk2 = {
        headerNav: { purpose: 'Top navigation bar', parentTo: 'mainContainer' },
    };
    emitSignal(app, ScaffoldSignalType.CHUNK, { chunk: chunk2 });

    assert.strictEqual(capturedPayloads.length, 2);
    assert.strictEqual(capturedPayloads[1].targetUca, 'headerNav');
    assert.strictEqual(capturedPayloads[1].parentTo, 'mainContainer');
    assert.strictEqual(capturedPayloads[1].parentContext, 'Main layout box container');

    app.denervate();
}

function testApp_MountsComposedNodes(): void {
    const app = new App().innervate();
    let capturedComposed: ComposedResult | undefined;

    app.target?.addEventListener(SignalType.COMPOSED, (event: Event) => {
        const { detail } = event as CustomEvent<Signal<ComposedResult>>;
        capturedComposed = detail.value;
    });

    const mockComposed: ComposedResult = {
        targetUca: 'mainContainer',
        nodes: [
            { id: 'container-box', uca: 'box', parentTo: 'app', body: { className: 'p-4' }, purpose: 'Layout box' },
            { id: 'btn-action', uca: 'action', parentTo: 'container-box', body: { label: 'Click me' }, purpose: 'Action button' },
        ],
    };
    emitSignal(app, ComposerSignalType.COMPOSED, mockComposed);

    assert.notStrictEqual(capturedComposed, undefined);
    assert.strictEqual(capturedComposed?.targetUca, 'mainContainer');
    assert.strictEqual(capturedComposed?.nodes.length, 2);

    app.denervate();
}

testApp_IdentityAndPurpose();
testApp_ContextProvisioningToScaffold();
testApp_ContextProvisioningToTheme();
testApp_InjectsBaseThemeOnStart();
testApp_BarrierHoldsScaffold();
testApp_BarrierFlushesOnTheme();
testApp_ThemeAndCssIntegration();
testApp_PassesParentContextToComposer();
testApp_MountsComposedNodes();

console.log('✅ App UCA with Scaffold, ThemeCss, Barrier, Composer, and parentTo context tests passed successfully');


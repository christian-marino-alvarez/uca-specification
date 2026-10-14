import * as assert from 'node:assert';
import { Uca } from '@uca/core/uca';
import type { Signal } from '@uca/core/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Picture } from '@uca/picture';
import { SignalType as PictureSignalType } from '@uca/picture/types';
import { Decision } from '@uca/capability-decision';
import { SignalType as DecisionSignalType } from '@uca/capability-decision/types';
import { Llm } from '@uca/llm';
import { SignalType as LlmSignalType } from '@uca/llm/types';
import { Composer } from '@uca/composer';
import { SignalType as ComposerSignalType } from '@uca/composer/types';
import { Builder } from '../index.js';
import { __ID__, SKELETON_BORDER, capSpacing, createDynamicSkeletonSvg, isLeafKind, isNestedArea, resolveGap, resolveNestedHeight, resolveNestedWidth } from '../constants.js';
import { SignalType } from '../types.js';

function testBuilder_NestedWideBecomesFull(): void {
    assert.strictEqual(resolveNestedWidth('wide', 0), 'wide');
    assert.strictEqual(resolveNestedWidth('wide', 1), 'wide');
    assert.strictEqual(resolveNestedWidth('half', 1), 'half');
}

function testBuilder_NestedFullHeightBecomesAuto(): void {
    assert.strictEqual(resolveNestedHeight('full', 0), 'full');
    assert.strictEqual(resolveNestedHeight('screen', 0), 'screen');
    assert.strictEqual(resolveNestedHeight('full', 1), 'auto');
    assert.strictEqual(resolveNestedHeight('screen', 1), 'auto');
}

function testBuilder_NestedAreaClassification(): void {
    assert.strictEqual(isNestedArea('app', 0), false);
    assert.strictEqual(isNestedArea('canvasRoot', 0), false);
    assert.strictEqual(isNestedArea('canvasRoot', 1, 'container'), false);
    assert.strictEqual(isNestedArea('mainContainer', 0), true);
    assert.strictEqual(isNestedArea('canvasRoot', 0, 'action'), true);
    assert.strictEqual(isLeafKind('action'), true);
    assert.strictEqual(isLeafKind('container'), false);
}

const guardedBuses = new WeakSet<EventTarget>();

function emitSignal(bus: EventTarget, property: string, value: unknown): void {
    if (!guardedBuses.has(bus)) {
        guardedBuses.add(bus);
        bus.addEventListener(LlmSignalType.STREAM, (event: Event) => { event.stopImmediatePropagation(); });
        bus.addEventListener(LlmSignalType.INFER, (event: Event) => { event.stopImmediatePropagation(); });
    }
    const signal: Signal = { source: 'test', property, value, timestamp: Date.now() };
    bus.dispatchEvent(new CustomEvent(property, { detail: signal }));
}

function testBuilder_Identity(): void {
    const builder = new Builder();
    assert.strictEqual(builder.id, __ID__);
    assert.strictEqual(builder.purpose, Builder.purpose);
    assert.ok(builder instanceof Uca);
}

function testBuilder_Disposition(): void {
    const { aim, inputs, outputs, reactTo } = Builder.disposition;
    assert.strictEqual(aim.description, Builder.purpose);
    assert.strictEqual(inputs?.length, 5);
    assert.strictEqual(outputs?.length, 5);
    assert.ok(reactTo?.includes(SignalType.BUILD));
    assert.ok(reactTo?.includes(SignalType.SKELETON));
    assert.ok(reactTo?.includes(SignalType.EVALUATE));
    assert.ok(reactTo?.includes(BoxSignalType.CREATED));
    assert.ok(reactTo?.includes(PictureSignalType.CREATED));
    assert.ok(reactTo?.includes(DecisionSignalType.DECIDED));
    assert.ok(reactTo?.includes(ComposerSignalType.CHUNK));
}

function testBuilder_CatalogComposition(): void {
    class TestableBuilder extends Builder {
        public exposeCatalog(): ReturnType<Builder['catalog']> {
            return this.catalog();
        }
    }
    const builder = new TestableBuilder('catalog-builder');
    const catalog = builder.exposeCatalog();
    assert.strictEqual(catalog.length, 6);
    const [BoxClass] = catalog[0];
    const [PictureClass] = catalog[1];
    const [DecisionClass] = catalog[2];
    const [LlmClass] = catalog[3];
    const [ComposerClass] = catalog[5];
    assert.strictEqual(BoxClass, Box);
    assert.strictEqual(PictureClass, Picture);
    assert.strictEqual(DecisionClass, Decision);
    assert.strictEqual(LlmClass, Llm);
    assert.strictEqual(ComposerClass, Composer);
}

function testBuilder_RendersSkeletonOnBuild(): void {
    const bus = new EventTarget();
    let boxRenderReceived: { elementId?: string; parentTo?: string } | undefined;
    let pictureRenderReceived: { elementId?: string; parentTo?: string } | undefined;

    bus.addEventListener(BoxSignalType.RENDER, (event: Event) => {
        boxRenderReceived = (event as CustomEvent<Signal>).detail?.value as { elementId?: string; parentTo?: string };
    });
    bus.addEventListener(PictureSignalType.RENDER, (event: Event) => {
        pictureRenderReceived = (event as CustomEvent<Signal>).detail?.value as { elementId?: string; parentTo?: string };
    });

    const builder = new Builder('build-test').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);

    emitSignal(bus, SignalType.BUILD, { areaId: 'canvas-1', dimensions: { width: 'full', height: 'screen' } });

    assert.ok(boxRenderReceived !== undefined);
    assert.strictEqual(boxRenderReceived.elementId, 'canvas-1');
    assert.ok(pictureRenderReceived !== undefined);
    assert.strictEqual(pictureRenderReceived.elementId, 'canvas-1:skeleton-pic');

    builder.denervate();
}

function testBuilder_ReactsToSkeleton(): void {
    const bus = new EventTarget();
    let boxRenderReceived = false;
    let pictureRenderReceived = false;

    bus.addEventListener(BoxSignalType.RENDER, () => {
        boxRenderReceived = true;
    });
    bus.addEventListener(PictureSignalType.RENDER, () => {
        pictureRenderReceived = true;
    });

    const builder = new Builder('skeleton-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.SKELETON, { areaId: 'area-skeleton' });

    assert.ok(boxRenderReceived);
    assert.ok(pictureRenderReceived);
    builder.denervate();
}

function testBuilder_ReactsToEvaluate(): void {
    const bus = new EventTarget();
    let decideSignal: unknown;
    bus.addEventListener(DecisionSignalType.DECIDE, (event: Event) => {
        decideSignal = (event as CustomEvent<Signal>).detail?.value;
    });
    const builder = new Builder('eval-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.EVALUATE, { areaId: 'area-eval' });
    assert.ok(decideSignal !== undefined);
    builder.denervate();
}

function testBuilder_ReactsToDecision(): void {
    const bus = new EventTarget();
    let builtSignal: unknown;
    let subdivideSignal: unknown;
    bus.addEventListener(SignalType.BUILT, (event: Event) => {
        builtSignal = (event as CustomEvent<Signal>).detail?.value;
    });
    bus.addEventListener(SignalType.SUBDIVIDE, (event: Event) => {
        subdivideSignal = (event as CustomEvent<Signal>).detail?.value;
    });
    const builder = new Builder('decision-reaction-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);

    emitSignal(bus, DecisionSignalType.DECIDED, { correlationId: 'decision-reaction-builder::leaf-1', decision: false });
    assert.ok(builtSignal !== undefined);

    emitSignal(bus, DecisionSignalType.DECIDED, { correlationId: 'decision-reaction-builder::complex-1', decision: true });
    assert.ok(subdivideSignal !== undefined);

    builder.denervate();
}

function testBuilder_GeneratesDynamicSkeletonSvg(): void {
    const actionSvg = createDynamicSkeletonSvg('action');
    const headingSvg = createDynamicSkeletonSvg('heading');
    const inputSvg = createDynamicSkeletonSvg('input');
    const mediaSvg = createDynamicSkeletonSvg('media');
    assert.ok(actionSvg.includes('height="40"'));
    assert.ok(headingSvg.includes('height="36"'));
    assert.ok(inputSvg.includes('height="56"'));
    assert.ok(mediaSvg.includes('height="96"'));
}

function testBuilder_UnknownKindFallsBackToLine(): void {
    const lineSvg = createDynamicSkeletonSvg('text');
    assert.strictEqual(createDynamicSkeletonSvg(), lineSvg);
    assert.strictEqual(createDynamicSkeletonSvg('unknown-kind'), lineSvg);
}

function testBuilder_GeneratesCompactSkeletonSvg(): void {
    const compactSvg = createDynamicSkeletonSvg('action', undefined, 'narrow');
    assert.ok(compactSvg.includes('<rect x="0" y="0" width="100%" height="40"'));
}

function testBuilder_CapsSpacingByDepth(): void {
    assert.strictEqual(capSpacing('xlarge', 0), 'large');
    assert.strictEqual(capSpacing('xlarge', 1), 'medium');
    assert.strictEqual(capSpacing('large', 2), 'small');
    assert.strictEqual(capSpacing('large', 5), 'small');
    assert.strictEqual(capSpacing('small', 2), 'small');
    assert.strictEqual(capSpacing('none', 2), 'none');
    assert.strictEqual(resolveGap(0), 'medium');
    assert.strictEqual(resolveGap(1), 'small');
}

function testBuilder_TerminalByRootOrDepth(): void {
    const bus = new EventTarget();
    const decided: unknown[] = [];
    const built: unknown[] = [];
    const composed: unknown[] = [];
    bus.addEventListener(DecisionSignalType.DECIDE, (event: Event) => { decided.push((event as CustomEvent<Signal>).detail?.value); });
    bus.addEventListener(SignalType.BUILT, (event: Event) => { built.push((event as CustomEvent<Signal>).detail?.value); });
    bus.addEventListener(ComposerSignalType.COMPOSE, (event: Event) => { composed.push((event as CustomEvent<Signal>).detail?.value); });
    const builder = new Builder('depth-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.BUILD, { elementId: 'viewport', parentTo: 'app', depth: 0 });
    emitSignal(bus, SignalType.BUILD, { elementId: 'deep-leaf', parentTo: 'nested', depth: 2, kind: 'action' });
    assert.strictEqual(decided.length, 0);
    assert.strictEqual(composed.length, 1);
    assert.strictEqual(built.length, 1);
    emitSignal(bus, SignalType.BUILD, { elementId: 'action-bar', parentTo: 'prompt-container', depth: 2, kind: 'container' });
    assert.strictEqual(decided.length, 1);
    builder.denervate();
}

function testBuilder_FirstLevelSubdividesWithoutDecision(): void {
    const bus = new EventTarget();
    const decided: unknown[] = [];
    let composePayload: { parentTo?: string; depth?: number } | undefined;
    bus.addEventListener(DecisionSignalType.DECIDE, (event: Event) => { decided.push(event); });
    bus.addEventListener(ComposerSignalType.COMPOSE, (event: Event) => {
        composePayload = (event as CustomEvent<Signal>).detail?.value as typeof composePayload;
    });
    const builder = new Builder('structural-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.BUILD, { elementId: 'canvasRoot', parentTo: 'app', depth: 0 });
    assert.strictEqual(decided.length, 0);
    assert.strictEqual(composePayload?.parentTo, 'canvasRoot');
    assert.strictEqual(composePayload?.depth, 1);
    builder.denervate();
}

function testBuilder_SubdivisionPropagatesDepth(): void {
    const bus = new EventTarget();
    let composePayload: { depth?: number; parentTo?: string } | undefined;
    bus.addEventListener(ComposerSignalType.COMPOSE, (event: Event) => {
        composePayload = (event as CustomEvent<Signal>).detail?.value as { depth?: number; parentTo?: string };
    });
    const builder = new Builder('propagate-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, DecisionSignalType.DECIDED, { correlationId: 'propagate-builder::card', decision: true, state: { depth: 1 } });
    assert.strictEqual(composePayload?.parentTo, 'card');
    assert.strictEqual(composePayload?.depth, 2);
    builder.denervate();
}

function testBuilder_DimensionsStayRawThroughDecisionRoundTrip(): void {
    const bus = new EventTarget();
    let decideState: { dimensions?: { width?: string }; dimensionsDescription?: { width?: string } } | undefined;
    let composePayload: { request?: string; limits?: { width?: string; height?: string; direction?: string } } | undefined;
    bus.addEventListener(DecisionSignalType.DECIDED, () => undefined);
    bus.addEventListener(DecisionSignalType.DECIDE, (event: Event) => {
        decideState = ((event as CustomEvent<Signal>).detail?.value as { state: typeof decideState }).state;
    });
    bus.addEventListener(ComposerSignalType.COMPOSE, (event: Event) => {
        composePayload = (event as CustomEvent<Signal>).detail?.value as typeof composePayload;
    });
    const builder = new Builder('raw-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.BUILD, { elementId: 'card', parentTo: 'viewport', depth: 1, dimensions: { width: 'wide', height: 'half' } });
    assert.strictEqual(decideState?.dimensions?.width, 'wide');
    assert.ok(decideState?.dimensionsDescription?.width?.includes('80%'));
    emitSignal(bus, DecisionSignalType.DECIDED, { correlationId: 'raw-builder::card', decision: true, state: decideState });
    assert.deepStrictEqual(composePayload?.limits, { width: 'wide', height: 'half', direction: 'column' });
    assert.ok(composePayload?.request?.includes('card'));
    builder.denervate();
}

function testBuilder_SkeletonBoxesAreFramedExceptRoot(): void {
    const bus = new EventTarget();
    const rendered: Array<{ elementId: string; qualities: { border?: string } }> = [];
    bus.addEventListener(BoxSignalType.RENDER, (event: Event) => {
        rendered.push((event as CustomEvent<Signal>).detail?.value as (typeof rendered)[number]);
    });
    const builder = new Builder('frame-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.SKELETON, { areaId: 'viewport', parentTo: 'app' });
    emitSignal(bus, SignalType.SKELETON, { areaId: 'card', parentTo: 'viewport' });
    emitSignal(bus, SignalType.SKELETON, { areaId: 'leaf', parentTo: 'card', depth: 1 });
    const [root, card, leaf] = rendered;
    assert.strictEqual(root.qualities.border, undefined);
    assert.strictEqual(card.qualities.border, SKELETON_BORDER);
    assert.strictEqual(leaf.qualities.border, SKELETON_BORDER);
    builder.denervate();
}

function testBuilder_SkeletonBoxCapsSpacingAndSetsGap(): void {
    const bus = new EventTarget();
    const rendered: Array<{ qualities: { spacing?: string; gap?: string } }> = [];
    bus.addEventListener(BoxSignalType.RENDER, (event: Event) => {
        rendered.push((event as CustomEvent<Signal>).detail?.value as (typeof rendered)[number]);
    });
    const builder = new Builder('spacing-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.SKELETON, { areaId: 'card', parentTo: 'viewport', depth: 0, style: { spacing: 'xlarge' } });
    emitSignal(bus, SignalType.SKELETON, { areaId: 'leaf', parentTo: 'card', depth: 2, style: { spacing: 'large' } });
    const [card, leaf] = rendered;
    assert.deepStrictEqual([card.qualities.spacing, card.qualities.gap], ['large', 'medium']);
    assert.deepStrictEqual([leaf.qualities.spacing, leaf.qualities.gap], ['small', 'small']);
    builder.denervate();
}

function testBuilder_LeafKindsAreTerminal(): void {
    const bus = new EventTarget();
    const decided: unknown[] = [];
    const built: unknown[] = [];
    bus.addEventListener(DecisionSignalType.DECIDE, (event: Event) => { decided.push(event); });
    bus.addEventListener(SignalType.BUILT, (event: Event) => { built.push(event); });
    const builder = new Builder('leaf-test').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.BUILD, { elementId: 'submit-btn', parentTo: 'main', depth: 0, kind: 'action' });
    emitSignal(bus, SignalType.BUILD, { elementId: 'text-in', parentTo: 'main', depth: 0, kind: 'input' });
    assert.strictEqual(decided.length, 0);
    assert.strictEqual(built.length, 2);
    builder.denervate();
}

function testBuilder_MemoryDifferentialUpdate(): void {
    const bus = new EventTarget();
    const renders: unknown[] = [];
    const updates: Array<{ elementId: string; qualities: { width?: string; direction?: string } }> = [];
    bus.addEventListener(BoxSignalType.RENDER, (event: Event) => { renders.push((event as CustomEvent<Signal>).detail?.value); });
    bus.addEventListener(BoxSignalType.UPDATE, (event: Event) => { updates.push((event as CustomEvent<Signal>).detail?.value as (typeof updates)[number]); });
    const builder = new Builder('mem-diff-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.BUILD, { elementId: 'hero-box', parentTo: 'app', dimensions: { width: 'wide', height: 'auto' }, style: { direction: 'row' } });
    assert.strictEqual(renders.length, 1);
    assert.strictEqual(updates.length, 0);
    emitSignal(bus, SignalType.BUILD, { elementId: 'hero-box', parentTo: 'app', dimensions: { width: 'wide', height: 'auto' }, style: { direction: 'row' } });
    assert.strictEqual(renders.length, 1);
    assert.strictEqual(updates.length, 0);
    emitSignal(bus, SignalType.BUILD, { elementId: 'hero-box', parentTo: 'app', dimensions: { width: 'full', height: 'auto' }, style: { direction: 'column' } });
    assert.strictEqual(renders.length, 1);
    assert.strictEqual(updates.length, 1);
    assert.strictEqual(updates[0].elementId, 'hero-box');
    assert.strictEqual(updates[0].qualities.width, 'full');
    assert.strictEqual(updates[0].qualities.direction, 'column');
    builder.denervate();
}

function testBuilder_CascadePropagatesToSubdividedChildren(): void {
    const bus = new EventTarget();
    const composeCalls: Array<{ parentTo?: string; limits?: { width?: string; minWidth?: number; maxWidth?: number } }> = [];
    bus.addEventListener(ComposerSignalType.COMPOSE, (event: Event) => {
        composeCalls.push((event as CustomEvent<Signal>).detail?.value as (typeof composeCalls)[number]);
    });
    const builder = new Builder('cascade-builder').innervate(bus);
    emitSignal(bus, builder.updateEvent, Builder.disposition);
    emitSignal(bus, SignalType.BUILD, { elementId: 'mainContainer', parentTo: 'canvasRoot', depth: 0, kind: 'container', dimensions: { width: 'half', height: 'full' }, media: { minWidth: 1024, maxWidth: 4096 } });
    assert.strictEqual(composeCalls.length, 1);
    assert.strictEqual(composeCalls[0].parentTo, 'mainContainer');
    emitSignal(bus, SignalType.BUILD, { elementId: 'mainContainer', parentTo: 'canvasRoot', depth: 0, kind: 'container', dimensions: { width: 'full', height: 'full' }, media: { minWidth: 0, maxWidth: 639 } });
    assert.strictEqual(composeCalls.length, 2);
    assert.strictEqual(composeCalls[1].parentTo, 'mainContainer');
    assert.strictEqual(composeCalls[1].limits?.width, 'full');
    assert.strictEqual(composeCalls[1].limits?.minWidth, 0);
    builder.denervate();
}

function runTests(): void {
    console.log('🧪 Testing autonomous Builder UCA with Box, Picture, and Decision composition...');
    testBuilder_Identity();
    testBuilder_Disposition();
    testBuilder_CatalogComposition();
    testBuilder_RendersSkeletonOnBuild();
    testBuilder_ReactsToSkeleton();
    testBuilder_ReactsToEvaluate();
    testBuilder_ReactsToDecision();
    testBuilder_GeneratesDynamicSkeletonSvg();
    testBuilder_GeneratesCompactSkeletonSvg();
    testBuilder_NestedWideBecomesFull();
    testBuilder_NestedFullHeightBecomesAuto();
    testBuilder_TerminalByRootOrDepth();
    testBuilder_FirstLevelSubdividesWithoutDecision();
    testBuilder_SubdivisionPropagatesDepth();
    testBuilder_DimensionsStayRawThroughDecisionRoundTrip();
    testBuilder_SkeletonBoxesAreFramedExceptRoot();
    testBuilder_UnknownKindFallsBackToLine();
    testBuilder_CapsSpacingByDepth();
    testBuilder_SkeletonBoxCapsSpacingAndSetsGap();
    testBuilder_NestedAreaClassification();
    testBuilder_LeafKindsAreTerminal();
    testBuilder_MemoryDifferentialUpdate();
    testBuilder_CascadePropagatesToSubdividedChildren();
    console.log('✅ All Builder UCA tests passed successfully!');
}

runTests();

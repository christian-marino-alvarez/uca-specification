import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { Capability } from '@uca/core/capability';
import type { Cooky, Signal } from '@uca/core/types';
import { App } from '@uca/app';
import { SignalType as AppSignalType } from '@uca/app/types';
import { SignalType as DecisionSignalType, type Request } from '@uca/decision/types';
import { SignalType as LlmSignalType, type InferPayload } from '@uca/llm/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import { Render } from '@uca/render';
import { SignalType as RenderSignalType } from '@uca/render/types';
import { Builder } from '../index.js';
import { SignalType, type AreaCreated, type BuildPayload } from '../types.js';

class OfflineBuilder extends Builder {
    protected override catalog(): Cooky {
        return super.catalog().filter(([Factory]) => Factory === Render || Factory === StreamTransformer);
    }
}

class OfflineApp extends App {
    protected override catalog(): Cooky {
        return [[OfflineBuilder, {
            ...Builder.disposition,
            aim: {
                description: Builder.purpose,
                body: {
                    id: `${this.id}:builder`,
                },
            },
        }]];
    }
}

function prepareDom(): void {
    const { window } = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>');
    const { document, customElements, HTMLElement, HTMLStyleElement, AbortController, AbortSignal } = window;
    Object.assign(globalThis, {
        document, customElements, HTMLElement, HTMLStyleElement, AbortController, AbortSignal,
        getComputedStyle: window.getComputedStyle.bind(window),
    });
}

function emit(bus: EventTarget, property: string, value: unknown, source = 'test', targetId?: string): void {
    const signal: Signal = {
        source,
        targetId,
        property,
        value,
    };
    bus.dispatchEvent(new CustomEvent(property, {
        detail: signal,
    }));
}

function observe<T>(bus: EventTarget, property: string, callback: (value: T) => void): void {
    bus.addEventListener(property, (event) => callback(Capability.readPayload<T>(event) as T));
}

function bindBuilder(bus: EventTarget): OfflineBuilder {
    const builder = new OfflineBuilder('builder').innervate(bus);
    emit(bus, builder.updateEvent, Builder.disposition);
    return builder;
}

function componentList(): unknown {
    return {
        components: [
            { id: 'caption', parentId: 'panel', content: 'Child content', qualities: null },
            { id: 'panel', content: 'Parent content', qualities: null },
        ],
    };
}

function answer(bus: EventTarget, request: InferPayload, data: unknown): void {
    const { correlationId } = request;
    emit(bus, LlmSignalType.INFERRED, {
        correlationId,
        request,
        data,
    }, 'test-llm');
}

test('App starts each child only after its Box is connected and preserves inherited context', () => {
    prepareDom();
    const bus = new EventTarget();
    const app = new OfflineApp('app').innervate(bus);
    const created: AreaCreated[] = [];
    const decisions: Request[] = [];
    const errors: unknown[] = [];
    observe(bus, AppSignalType.ERROR, (error) => errors.push(error));
    observe<AreaCreated>(bus, SignalType.AREA_CREATED, (value) => {
        const { area } = value;
        const { id, parentId } = area;
        assert.equal(document.getElementById(id)?.parentElement?.id, parentId);
        created.push(value);
    });
    observe<Request>(bus, DecisionSignalType.DECIDE, (request) => {
        const { context, correlationId, question } = request;
        const { areaId } = context ?? {};
        assert.ok(document.getElementById(String(areaId))?.isConnected);
        decisions.push(request);
        emit(bus, DecisionSignalType.DECIDED, {
            correlationId,
            context,
            result: { questionId: question.id, choice: areaId === 'app:shell' ? 'LAYOUT' : 'VIEW' },
        }, 'test-decision', 'app');
    });
    observe<InferPayload>(bus, LlmSignalType.INFER, (request) => {
        const { metadata } = request;
        const { choice, areaId } = metadata as BuildPayload;
        const data = choice === 'VIEW' ? componentList() : {
            areas: [{ id: areaId === 'app' ? 'shell' : 'leaf', description: 'Inherited task' }],
        };
        answer(bus, request, data);
    });
    emit(bus, app.updateEvent, App.disposition);
    emit(bus, DecisionSignalType.DECIDED, {
        correlationId: 'opaque-root-operation',
        context: { input: { task: 'Preserve this request' }, purpose: 'Page', intention: 'Compose page' },
        result: { choice: 'LAYOUT' },
    }, 'test-decision', 'app');
    assert.equal(created.length, 2);
    assert.equal(decisions.length, 2);
    assert.deepEqual(decisions[1]?.context?.input, { task: 'Preserve this request' });
    assert.equal(decisions[1]?.context?.description, 'Inherited task');
    assert.equal(document.getElementById('app:shell:leaf:panel')?.parentElement?.id, 'app:shell:leaf');
    assert.equal(document.getElementById('app:shell:leaf:caption')?.parentElement?.id, 'app:shell:leaf:panel');
    const actualTree = [...document.querySelectorAll('#app [id]')].map((element) => [
        element.id,
        element.parentElement?.id,
    ]);
    assert.deepEqual(actualTree, [
        ['app:shell', 'app'],
        ['app:shell:leaf', 'app:shell'],
        ['app:shell:leaf:panel', 'app:shell:leaf'],
        ['app:shell:leaf:caption', 'app:shell:leaf:panel'],
    ]);
    assert.deepEqual(errors, []);
});

test('duplicate layout responses do not remount an area or restart its construction', () => {
    prepareDom();
    const bus = new EventTarget();
    const builder = bindBuilder(bus);
    const created: AreaCreated[] = [];
    observe<AreaCreated>(bus, SignalType.AREA_CREATED, (value) => created.push(value));
    observe<InferPayload>(bus, LlmSignalType.INFER, (request) => {
        const data = { areas: [{ id: 'stable' }] };
        answer(bus, request, data);
        answer(bus, request, data);
    });
    emit(bus, SignalType.BUILD, {
        choice: 'LAYOUT', areaId: 'app', context: {}, correlationId: 'opaque-operation',
    });
    assert.equal(created.length, 1);
    assert.equal(document.querySelectorAll('[id="app:stable"]').length, 1);
    assert.ok(builder);
});

test('a missing explicit parent reports an error without mounting in the root', () => {
    prepareDom();
    const bus = new EventTarget();
    bindBuilder(bus);
    const errors: unknown[] = [];
    const created: AreaCreated[] = [];
    observe(bus, SignalType.ERROR, (value) => errors.push(value));
    observe<AreaCreated>(bus, SignalType.AREA_CREATED, (value) => created.push(value));
    observe<InferPayload>(bus, LlmSignalType.INFER, (request) => answer(bus, request, {
        areas: [{ id: 'child' }],
    }));
    emit(bus, SignalType.BUILD, {
        choice: 'LAYOUT', areaId: 'missing', context: {}, correlationId: 'unrelated-id',
    });
    assert.equal(errors.length, 1);
    assert.equal(created.length, 0);
    assert.equal(document.getElementById('missing:child'), null);
});

test('streamed areas mount incrementally without clearing previous siblings or decoding correlation IDs', async () => {
    prepareDom();
    const bus = new EventTarget();
    bindBuilder(bus);
    const created: AreaCreated[] = [];
    observe<AreaCreated>(bus, SignalType.AREA_CREATED, (value) => created.push(value));
    const completed = new Promise<void>((resolve) => observe(bus, SignalType.BUILT, () => resolve()));
    observe<InferPayload>(bus, LlmSignalType.INFER, (request) => {
        const stream = new ReadableStream<string>({
            start(controller) {
                controller.enqueue('{"areas":[{"id":"first"},');
                controller.enqueue('{"id":"second"}]}');
                controller.close();
            },
        });
        emit(bus, LlmSignalType.STREAMED, {
            request, stream, correlationId: 'arbitrary-correlation-with-hyphens',
        }, 'test-llm');
    });
    emit(bus, SignalType.BUILD, {
        choice: 'LAYOUT', areaId: 'app', context: { task: 'Streamed layout' }, correlationId: 'arbitrary-correlation-with-hyphens',
    });
    await completed;
    assert.equal(created.length, 2);
    assert.equal(document.getElementById('app:first')?.parentElement?.id, 'app');
    assert.equal(document.getElementById('app:second')?.parentElement?.id, 'app');
    assert.equal(created[0]?.context.task, 'Streamed layout');
});

test('streamed components received before their parent wait and mount inside it', async () => {
    prepareDom();
    const bus = new EventTarget();
    bindBuilder(bus);
    const mounted: unknown[] = [];
    observe(bus, RenderSignalType.RENDERED, (value) => mounted.push(value));
    const completed = new Promise<void>((resolve) => observe(bus, SignalType.BUILT, () => resolve()));
    observe<InferPayload>(bus, LlmSignalType.INFER, (request) => {
        const stream = new ReadableStream<string>({
            start(controller) {
                controller.enqueue('{"components":[{"id":"caption","parentId":"panel","content":"Child","qualities":null},');
                controller.enqueue('{"id":"panel","content":"Parent","qualities":null}]}');
                controller.close();
            },
        });
        emit(bus, LlmSignalType.STREAMED, {
            request,
            stream,
            correlationId: 'opaque-view-operation',
        }, 'test-llm');
    });
    emit(bus, SignalType.BUILD, {
        choice: 'VIEW',
        areaId: 'app',
        context: {},
        correlationId: 'opaque-view-operation',
    });
    await completed;
    assert.equal(mounted.length, 2);
    assert.equal(document.getElementById('app:panel')?.parentElement?.id, 'app');
    assert.equal(document.getElementById('app:caption')?.parentElement?.id, 'app:panel');
});

test('identical component names in sibling areas remain inside their respective area', () => {
    prepareDom();
    const bus = new EventTarget();
    bindBuilder(bus);
    const errors: unknown[] = [];
    observe(bus, SignalType.ERROR, (value) => errors.push(value));
    observe<AreaCreated>(bus, SignalType.AREA_CREATED, ({ area, context }) => {
        const { id: areaId, parentId } = area;
        emit(bus, SignalType.BUILD, {
            choice: 'VIEW',
            areaId,
            parentId,
            context,
            correlationId: crypto.randomUUID(),
        });
    });
    observe<InferPayload>(bus, LlmSignalType.INFER, (request) => {
        const { metadata } = request;
        const { choice } = metadata as BuildPayload;
        answer(bus, request, choice === 'VIEW' ? componentList() : {
            areas: [
                { id: 'area-a' },
                { id: 'area-b' },
            ],
        });
    });
    emit(bus, SignalType.BUILD, {
        choice: 'LAYOUT',
        areaId: 'app',
        context: {},
        correlationId: 'opaque-operation',
    });
    const actualTree = [...document.querySelectorAll('#app [id]')].map((element) => [
        element.id,
        element.parentElement?.id,
    ]);
    assert.deepEqual(actualTree, [
        ['app:area-a', 'app'],
        ['app:area-a:panel', 'app:area-a'],
        ['app:area-a:caption', 'app:area-a:panel'],
        ['app:area-b', 'app'],
        ['app:area-b:panel', 'app:area-b'],
        ['app:area-b:caption', 'app:area-b:panel'],
    ]);
    assert.equal(new Set(actualTree.map(([id]) => id)).size, actualTree.length);
    assert.deepEqual(errors, []);
});

test('semantic primitives render through their own UCAs inside the requested parent', () => {
    prepareDom();
    const bus = new EventTarget();
    bindBuilder(bus);
    const errors: unknown[] = [];
    observe(bus, SignalType.ERROR, (value) => errors.push(value));
    observe<InferPayload>(bus, LlmSignalType.INFER, (request) => answer(bus, request, {
        components: [
            { id: 'title', parentId: 'panel', component: 'heading', content: 'Title', properties: { importance: 2 }, qualities: null },
            { id: 'body', parentId: 'panel', component: 'paragraph', content: 'Description', qualities: null },
            { id: 'access', parentId: 'panel', component: 'access', content: 'Explore', properties: { destination: '#app' }, qualities: null },
            { id: 'panel', component: 'box', qualities: null },
        ],
    }));
    emit(bus, SignalType.BUILD, {
        choice: 'VIEW',
        areaId: 'app',
        context: {},
        correlationId: 'semantic-components',
    });
    assert.equal(document.getElementById('app:title')?.localName, 'h2');
    assert.equal(document.getElementById('app:body')?.localName, 'p');
    assert.equal(document.getElementById('app:access')?.localName, 'a');
    assert.equal(document.getElementById('app:access')?.getAttribute('href'), '#app');
    const tree = [...document.querySelectorAll('#app [id]')].map((element) => [
        element.id,
        element.parentElement?.id,
    ]);
    assert.deepEqual(tree, [
        ['app:panel', 'app'],
        ['app:title', 'app:panel'],
        ['app:body', 'app:panel'],
        ['app:access', 'app:panel'],
    ]);
    assert.deepEqual(errors, []);
});

import './harness.js';
import { App, SignalType as AppSignalType } from '../collection/ucas/app/index.js';
import { Box } from '../collection/ucas/box/index.js';
import { Input } from '../collection/ucas/input/index.js';
import { Action } from '../collection/ucas/action/index.js';
import { SignalType as ViewComposerSignalType, type ComposedResult } from '../collection/ucas/view-composer/index.js';
import type { Signal } from '../core/types.js';

function formatSignalValue(value: unknown): string {
    if (value === undefined || value === null) {
        return '';
    }
    const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return serialized.length > 80 ? `${serialized.slice(0, 77)}...` : serialized;
}

function logBusSignal(event: Event): void {
    const customEvent = event as CustomEvent<Signal>;
    const { detail } = customEvent;
    if (!detail) { return; }
    const { source, property, value } = detail;
    const formatted = formatSignalValue(value);
    console.log(`  ⚡ [${source}] -> \x1b[36m${property}\x1b[0m ${formatted}`);
}

function printHeader(): void {
    const key = process.env.JEV_API_KEY ?? process.env.TYPESAFE_API_KEY;
    console.log('\n========================================');
    console.log('   🧠 UCA Application Demo (CLI Runner)  ');
    console.log('========================================');
    if (key) {
        const masked = `${key.slice(0, 6)}...${key.slice(-4)}`;
        console.log(`🔑 Jev API Key configurada: \x1b[32m${masked}\x1b[0m\n`);
    } else {
        console.log('ℹ️  JEV_API_KEY no detectada. Puedes pasarla con:');
        console.log('   \x1b[33mJEV_API_KEY="tu-key" npm run demo\x1b[0m\n');
    }
}

function printComposedView(result: ComposedResult): void {
    const { ucas, graph } = result;
    const { nodes, edges } = graph;
    console.log('\n\x1b[32m✔ Vista compuesta con éxito en ViewComposer:\x1b[0m');
    console.log(`  📦 Nodos UCA (${nodes.length}):`);
    for (const node of nodes) {
        const { id, aimDescription } = node;
        console.log(`     • [${id}]: "${aimDescription}"`);
    }
    console.log(`  🔗 Conexiones del grafo (${edges.length}):`);
    for (const edge of edges) {
        const { fromNode, toNode, signal } = edge;
        console.log(`     • ${fromNode} ──(${signal})──> ${toNode}`);
    }
    printStoredDispositions(ucas);
}

function printStoredDispositions(ucas: Record<string, unknown>): void {
    console.log('\n  💾 Disposiciones en LocalStorage:');
    for (const ucaId of Object.keys(ucas)) {
        const stored = globalThis.localStorage.getItem(ucaId);
        console.log(`     • [${ucaId}]: ${stored ? 'Persistido ✔' : 'Pendiente'}`);
    }
    console.log('\n========================================\n');
}

function setupAppLifecycle(bus: EventTarget): void {
    bus.addEventListener(AppSignalType.READY, () => {
        console.log('  🚀 App inicializada y lista.');
    });
    bus.addEventListener(AppSignalType.VIEW_COMPOSED, (event: Event) => {
        const customEvent = event as CustomEvent<Signal<ComposedResult>>;
        const { detail } = customEvent;
        const { value } = detail ?? {};
        if (value) {
            printComposedView(value);
        }
    });
}

function innervateViewUcas(bus: EventTarget): void {
    new Box('center-container').innervate(bus);
    new Input('query-input').innervate(bus);
    new Action('query-button').innervate(bus);
}

function runDemo(): void {
    printHeader();
    const bus = new EventTarget();
    bus.addEventListener('*', logBusSignal);
    setupAppLifecycle(bus);
    innervateViewUcas(bus);
    const app = new App('main-app');
    app.innervate(bus);
    console.log('📡 Inervando UCAs en el sistema nervioso...');
    const initSignal: Signal = { source: 'cli', property: AppSignalType.INIT, value: { title: 'UCA Demo' } };
    bus.dispatchEvent(new CustomEvent(AppSignalType.INIT, { detail: initSignal }));
}

runDemo();

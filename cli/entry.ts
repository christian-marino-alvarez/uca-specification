import { App } from '@uca/app';
import { Logger } from '@uca/logger';

console.log(
    '%c🧠 [UCA Client] Iniciando red neuronal UCA y registrador del bus...',
    'color: #00d2ff; font-weight: bold; font-size: 13px; padding: 4px;'
);

const bus = new EventTarget();
const logger = new Logger('bus-logger');
logger.innervate(bus);

const app = new App();
app.innervate(bus);

if (typeof window !== 'undefined') {
    const globalAny = window as unknown as { LanguageModel?: unknown; ai?: { languageModel?: unknown } };
    const hasNativeAi = Boolean(globalAny.LanguageModel ?? globalAny.ai?.languageModel);
    console.log(
        hasNativeAi
            ? '%c✨ [PromptApi] LanguageModel / ai.languageModel nativo detectado en este navegador.'
            : '%cℹ️ [PromptApi] LanguageModel no detectado de forma nativa. Modo híbrido activo (SSE Backend). Puedes probar PromptApi en consola con __UCA__.testPromptApi() o comprobando en consola: await window.LanguageModel?.availability().',
        'color: #a855f7; font-weight: bold; font-size: 11px;'
    );
    (window as unknown as { __UCA__: unknown }).__UCA__ = {
        app,
        logger,
        bus,
        testPromptApi: (customJson?: string) => runPromptApiTest(bus, customJson),
    };
}

function runPromptApiTest(eventBus: EventTarget, customJson?: string): void {
    const json = customJson ?? JSON.stringify({
        ucas: [
            { id: 'box:prompt_demo', disposition: { aim: { description: 'Generado con PromptApi', body: {} } } },
            { id: 'box:nano_title', disposition: { aim: { description: 'Título local', body: { text: '⚡ Generado 100% en local con PromptApi (Gemini Nano)' } }, parentTo: { uca: 'box:prompt_demo', relation: 'child' } } },
            { id: 'action:nano_action', disposition: { aim: { description: 'Acción local', body: { label: 'Acción Instantánea en Cliente' } }, parentTo: { uca: 'box:prompt_demo', relation: 'action' } } },
        ],
    });
    const factory = {
        availability: async () => 'readily' as const,
        capabilities: async () => ({ available: 'readily' as const }),
        create: async () => ({
            promptStreaming: () => new ReadableStream({
                start(controller) { controller.enqueue(json); controller.close(); },
            }),
            destroy: () => {},
        }),
    };
    const signal = { source: 'prompt-test', property: 'view-composer.create', value: { factory }, timestamp: Date.now() };
    eventBus.dispatchEvent(new CustomEvent('view-composer.create', { detail: signal }));
}

console.log(
    '%c⚡ [UCA Client] Red neuronal UCA activa. Todos los pulsos y señales son visibles en esta consola.',
    'color: #00ff88; font-weight: bold; font-size: 12px; padding: 2px;'
);

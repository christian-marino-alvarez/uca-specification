import { App } from '@uca/app';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { SignalType as AppSignalType } from '@uca/app/types';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { SignalType as LayoutSignalType } from '@uca/layout/types';
import { SignalType as ViewSignalType } from '@uca/view/types';
import { SignalType as LlmSignalType } from '@uca/capability-llm/types';
import { SignalType as SpecificationSignalType } from '@uca/capability-specification/types';

const bus = new EventTarget();

// Logging en Browser DevTools
bus.addEventListener(SpecificationSignalType.PARSED, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c📖 [SPECIFICATION::PARSED] Arquitectura de Información cargada', 'color: #319795; font-weight: bold; font-size: 13px;');
    console.log('Título:', detail?.value?.title);
    console.log('Dimensiones:', detail?.value?.dimensions);
    console.log('Primitivas:', detail?.value?.primitives);
    console.log('Principios:', detail?.value?.principles);
    console.groupEnd();
});

bus.addEventListener(AppSignalType.NAVIGATE, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.log('%c🚀 [APP::NAVIGATE] Input recibido:', 'color: #805AD5; font-weight: bold;', detail?.value);
});

bus.addEventListener(MemorySignalType.RETRIEVED, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.log('%c💾 [MEMORY::RETRIEVED] Sesión consultada:', 'color: #DD6B20; font-weight: bold;', detail?.value);
});

bus.addEventListener(DecisionSignalType.DECIDE, (event: Event) => {
    const { detail } = event as CustomEvent;
    const question = detail?.value?.question;
    console.group('%c📨 [DECISION::DECIDE] Prompt y Pregunta enviada', 'color: #F0A56A; font-weight: bold; font-size: 13px;');
    console.log('%cPROMPT:', 'font-weight: bold;', question?.prompt);
    console.log('ID Pregunta:', question?.id);
    console.log('Opciones:', question?.options);
    console.log('Contexto:', detail?.value?.context);
    console.groupEnd();
});

bus.addEventListener(DecisionSignalType.DECIDED, (event: Event) => {
    const { detail } = event as CustomEvent;
    const result = detail?.value?.result;
    console.group('%c🎯 [DECISION::DECIDED] Respuesta de Decision', 'color: #38A169; font-weight: bold; font-size: 13px;');
    console.log('%cRESPUESTA (Choice):', 'font-weight: bold; color: #38A169; font-size: 14px;', result?.choice);
    console.log('Nivel de Confianza:', result?.confidence);
    console.log('Probabilidades:', result?.probabilities);
    console.log('Detalle completo:', detail?.value);
    console.groupEnd();
});

bus.addEventListener(DecisionSignalType.ERROR, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c❌ [DECISION::ERROR]', 'color: #E53E3E; font-weight: bold;');
    console.error('Error en Decision:', detail?.value);
    console.groupEnd();
});

bus.addEventListener(AppSignalType.DECIDED, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.log('%c🧠 [APP::DECIDED]', 'color: #3182CE; font-weight: bold;', detail?.value);
});

bus.addEventListener(LayoutSignalType.BUILD, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c📐 [LAYOUT::BUILD] Petición de Layout', 'color: #D69E2E; font-weight: bold; font-size: 13px;');
    console.log('Contexto:', detail?.value?.context);
    console.groupEnd();
});

bus.addEventListener(LayoutSignalType.AREA_DEFINED, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.log('%c🏛️ [LAYOUT::AREA_DEFINED] Área definida:', 'color: #38A169; font-weight: bold;', detail?.value?.area);
});

bus.addEventListener(ViewSignalType.BUILD, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c🎨 [VIEW::BUILD] Petición de Vista', 'color: #9B5DE5; font-weight: bold; font-size: 13px;');
    console.log('Contexto:', detail?.value?.context);
    console.groupEnd();
});

function resolveInferLabel(value: Record<string, unknown> | undefined): string {
    const id = (value?.id as string) ?? '';
    if (id) {
        return id.toUpperCase();
    }
    const purpose = (value?.purpose as string) ?? '';
    const goal = (value?.goal as string) ?? '';
    if (purpose.includes('layout') || goal.includes('layout')) return 'LAYOUT';
    if (purpose.includes('view') || goal.includes('view')) return 'VIEW';
    if (purpose.includes('probabilistic') || goal.includes('candidate') || goal.includes('model')) return 'DECISION';
    return 'INFERENCE';
}

bus.addEventListener(LlmSignalType.INFER, (event: Event) => {
    const { detail } = event as CustomEvent;
    const value = detail?.value as Record<string, unknown> | undefined;
    const label = resolveInferLabel(value);
    console.group(`%c🤖 [LLM::INFER::${label}] Contrato enviado al modelo`, 'color: #2563EB; font-weight: bold; font-size: 13px;');
    console.log('Goal:', value?.goal);
    console.log('Purpose:', value?.purpose);
    console.log('ContextSchema facts:', (value?.contextSchema as Record<string, unknown> | undefined)?.const);
    console.groupEnd();
});

bus.addEventListener(LlmSignalType.INFERRED, (event: Event) => {
    const { detail } = event as CustomEvent;
    const value = detail?.value as Record<string, unknown> | undefined;
    const request = value?.request as Record<string, unknown> | undefined;
    const label = resolveInferLabel(request);
    console.group(`%c✨ [LLM::INFERRED::${label}] Respuesta generada por LLM`, 'color: #16A34A; font-weight: bold; font-size: 13px;');
    console.log('Data:', value?.data);
    console.log('Raw response:', value?.response);
    console.groupEnd();
});

bus.addEventListener(LayoutSignalType.BUILT, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c📦 [LAYOUT::BUILT] Estructura completada', 'color: #38A169; font-weight: bold; font-size: 13px;');
    console.log('Composition:', detail?.value?.composition);
    console.groupEnd();
});

bus.addEventListener(ViewSignalType.BUILT, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c🎨 [VIEW::BUILT] Componentes construidos', 'color: #9B5DE5; font-weight: bold; font-size: 13px;');
    console.log('Composition:', detail?.value?.composition);
    console.groupEnd();
});

bus.addEventListener(AppSignalType.BUILT, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.log('%c🎉 [APP::BUILT] Composición recibida en App:', 'color: #805AD5; font-weight: bold;', detail?.value);
});

const app = new App();
app.innervate(bus);

if (typeof window !== 'undefined') {
    (window as unknown as { __UCA__: unknown }).__UCA__ = {
        app,
        bus,
    };
}

if (typeof document !== 'undefined') {
    const container = document.getElementById('app');
    if (container) {
        container.innerHTML = '';
    }
}

// 1. Inicializa y sincroniza el catálogo de la UCA (conecta Memory, Decision, Browser...)
bus.dispatchEvent(new CustomEvent(app.updateEvent, {
    detail: {
        property: app.updateEvent,
        source: 'boot',
        timestamp: Date.now(),
        value: App.disposition,
    },
}));

// 2. Despacha el estímulo de entrada inicial que desencadena el ciclo cognitivo
bus.dispatchEvent(new CustomEvent(AppSignalType.NAVIGATE, {
    detail: {
        property: AppSignalType.NAVIGATE,
        source: 'boot',
        timestamp: Date.now(),
        value: {
            navigateTo: '/',
        },
    },
}));

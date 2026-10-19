import { App } from '@uca/app';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { SignalType as AppSignalType } from '@uca/app/types';
import { SignalType as MemorySignalType } from '@uca/memory/types';
import { SignalType as BuilderSignalType } from '@uca/builder/types';
import { SignalType as LlmSignalType } from '@uca/capability-llm/types';

const bus = new EventTarget();

// Logging en Browser DevTools
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

bus.addEventListener(BuilderSignalType.BUILD, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c🏗️ [BUILDER::BUILD] Petición de Construcción', 'color: #D69E2E; font-weight: bold; font-size: 13px;');
    console.log('Choice:', detail?.value?.choice);
    console.log('Contexto:', detail?.value?.context);
    console.groupEnd();
});

bus.addEventListener(LlmSignalType.INFER, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c🤖 [LLM::INFER] Contrato enviado al modelo', 'color: #2563EB; font-weight: bold; font-size: 13px;');
    console.log('Goal:', detail?.value?.goal);
    console.log('Purpose:', detail?.value?.purpose);
    console.log('ContextSchema facts:', detail?.value?.contextSchema?.const);
    console.groupEnd();
});

bus.addEventListener(LlmSignalType.INFERRED, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c✨ [LLM::INFERRED] Respuesta generada por LLM', 'color: #16A34A; font-weight: bold; font-size: 13px;');
    console.log('Data:', detail?.value?.data);
    console.log('Raw response:', detail?.value?.response);
    console.groupEnd();
});

bus.addEventListener(BuilderSignalType.BUILT, (event: Event) => {
    const { detail } = event as CustomEvent;
    console.group('%c📦 [BUILDER::BUILT] Estructura materializada por Builder', 'color: #38A169; font-weight: bold; font-size: 13px;');
    console.log('Choice:', detail?.value?.choice);
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

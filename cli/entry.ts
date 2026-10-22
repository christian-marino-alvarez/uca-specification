import { App } from '@uca/app';
import { SignalType as AppSignalType } from '@uca/app/types';

const bus = new EventTarget();

const app = new App();
app.innervate(bus);

if (typeof window !== 'undefined') {
    (window as unknown as { __UCA__: unknown }).__UCA__ = {
        app,
        bus,
    };
}

if (typeof document !== 'undefined') {
    document.querySelectorAll('ext-uca, style[id^="uca-"]').forEach((element) => {
        element.remove();
    });
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

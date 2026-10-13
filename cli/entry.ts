import { App } from '@uca/app';

const bus = new EventTarget();

const emitSignal = (property: string, value: unknown): void => {
    bus.dispatchEvent(new CustomEvent(property, {
        detail: { source: 'client', property, value, timestamp: Date.now() },
    }));
};

const app = new App('app');
app.innervate(bus);
emitSignal(app.updateEvent, App.disposition);

if (typeof window !== 'undefined') {
    (window as unknown as { __UCA__: unknown }).__UCA__ = {
        app,
        bus,
    };
}


import { App } from '@uca/app';
import { Logger } from '@uca/logger';

console.log(
    '%c🧠 [UCA Client] Iniciando red neuronal UCA con App, Composer y Builder...',
    'color: #00d2ff; font-weight: bold; font-size: 13px; padding: 4px;'
);

const bus = new EventTarget();
const logger = new Logger('bus-logger');
logger.innervate(bus);

const app = new App('app');
app.innervate(bus);

if (typeof window !== 'undefined') {
    (window as unknown as { __UCA__: unknown }).__UCA__ = {
        app,
        logger,
        bus,
    };
}

console.log(
    '%c⚡ [UCA Client] Red neuronal UCA activa. Todos los pulsos y señales son visibles en esta consola.',
    'color: #00ff88; font-weight: bold; font-size: 12px; padding: 2px;'
);

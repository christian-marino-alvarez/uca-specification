import { App } from '@uca/app';
import { Logger } from '@uca/logger';
import { ApiPrompt } from '@uca/capability-api-prompt';

ApiPrompt.prewarm();

console.log(
    '%c🧠 [UCA Client] Iniciando red neuronal UCA con App y Scaffolding...',
    'color: #00d2ff; font-weight: bold; font-size: 13px; padding: 4px;'
);

const bus = new EventTarget();
const logger = new Logger('bus-logger');
logger.innervate(bus);

const app = new App();
app.innervate(bus);

function getQueryText(): string | undefined {
    const input = document.querySelector('ext-input, #input\\:query, [id*="query"]') as HTMLElement | null;
    return input?.textContent?.trim() || undefined;
}

function setStatusFeedback(message: string, busy: boolean = true): void {
    const statusText = document.getElementById('app:status-text');
    const statusContainer = document.getElementById('app:status');
    if (statusText) { statusText.textContent = message; }
    if (statusContainer) { statusContainer.classList.toggle('busy', busy); }
}

function triggerDiscovery(): void {
    const actionElement = document.querySelector('ext-action, #action\\:submit, [id*="submit"]') as HTMLElement | null;
    if (actionElement?.hasAttribute('disabled') || actionElement?.classList.contains('disabled')) {
        return;
    }
    const request = getQueryText();
    setStatusFeedback(`🧠 Descubriendo para "${request ?? 'UCA'}"...`, true);
    const event = new CustomEvent('action.triggered', {
        detail: { source: 'user', property: 'action.triggered', value: { request } },
    });
    bus.dispatchEvent(event);
}

if (typeof document !== 'undefined') {
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target?.closest?.('ext-action, #action\\:submit, [id*="submit"]')) {
            triggerDiscovery();
        }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            const target = event.target as HTMLElement;
            if (target?.closest?.('ext-input, #input\\:query, [id*="query"]')) {
                event.preventDefault();
                triggerDiscovery();
            }
        }
    });
}

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

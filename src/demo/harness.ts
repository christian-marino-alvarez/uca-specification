import { JSDOM } from 'jsdom';

export function setupDomEnvironment(): void {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
    const { window } = dom;
    const {
        document,
        HTMLElement,
        MutationObserver,
        Event,
        CustomEvent,
        EventTarget,
        customElements,
        AbortController,
        AbortSignal,
        MouseEvent,
        localStorage,
    } = window;

    globalThis.window = window as unknown as Window & typeof globalThis;
    globalThis.document = document;
    globalThis.HTMLElement = HTMLElement;
    globalThis.MutationObserver = MutationObserver;
    globalThis.Event = Event;
    globalThis.CustomEvent = CustomEvent;
    globalThis.MouseEvent = MouseEvent;
    globalThis.EventTarget = EventTarget;
    globalThis.customElements = customElements;
    globalThis.AbortController = AbortController;
    globalThis.AbortSignal = AbortSignal;
    globalThis.localStorage = localStorage;
}

setupDomEnvironment();

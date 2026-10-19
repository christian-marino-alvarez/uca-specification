import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    DEFAULT_EVENTS,
    DEFAULT_TAG,
    INPUT_TAG,
} from './constants.js';
import {
    type Body,
    type EventContext,
    type RemovePayload,
    type RenderPayload,
    type UpdatePayload,
    DataType,
    SignalType,
} from './types.js';

export class WebComponent extends Capability<Body> {
    public static readonly AIM: string = 'Manage native Custom Element lifecycle, Light DOM rendering, and user interactions';

    public static override disposition: Disposition<Body> = {
        aim: { description: WebComponent.AIM },
        reactTo: [
            SignalType.RENDER,
            SignalType.UPDATE,
            SignalType.REMOVE,
        ],
        inputs: [
            { signal: SignalType.RENDER, type: DataType.RENDER_PAYLOAD, description: 'Render element in Light DOM' },
            { signal: SignalType.UPDATE, type: DataType.UPDATE_PAYLOAD, description: 'Update element attributes and content' },
            { signal: SignalType.REMOVE, type: DataType.REMOVE_PAYLOAD, description: 'Remove element from DOM' },
        ],
        outputs: [
            { signal: SignalType.RENDERED, type: DataType.RENDERED_RESULT, description: 'Element rendered confirmation' },
            { signal: SignalType.UPDATED, type: DataType.UPDATED_RESULT, description: 'Element updated confirmation' },
            { signal: SignalType.REMOVED, type: DataType.REMOVED_RESULT, description: 'Element removed confirmation' },
            { signal: SignalType.EVENT, type: DataType.EVENT_CONTEXT, description: 'DOM interaction event triggered' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'DOM error notification' },
        ],
    };

    private static createCustomElementClass(): CustomElementConstructor {
        return class extends HTMLElement {
            public onConnected?: () => void;
            public onDisconnected?: () => void;
            public connectedCallback(): void { this.onConnected?.(); }
            public disconnectedCallback(): void { this.onDisconnected?.(); }
        };
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.RENDER:
                this.handleRender(value);
                break;
            case SignalType.UPDATE:
                this.handleUpdate(value);
                break;
            case SignalType.REMOVE:
                this.handleRemove(value);
                break;
            default:
                break;
        }
    }

    private handleRender(value?: unknown): void {
        const payload = (value ?? {}) as RenderPayload;
        const { elementId = this.id, tag, containerElement, attributes, content, events, context } = payload;
        const container = this.resolveContainerElement(containerElement);
        const element = elementId && container ? this.createElement(this.registerElement(tag), elementId, attributes, content) : null;
        if (!element || !container) { return; }
        this.mountElement(element, container, elementId, events, context);
    }

    private mountElement(element: HTMLElement, container: Element, elementId: string, events?: readonly string[], context?: unknown): void {
        const controller = this.bindLifecycle(element, elementId, events, context);
        document.getElementById(elementId)?.remove();
        container.querySelectorAll(':scope > svg').forEach((svg) => svg.remove());
        container.appendChild(element);
        if (!element.tagName.includes('-')) {
            this.handleConnected(element, elementId, controller.signal, events, context);
        }
    }

    private bindLifecycle(element: HTMLElement, elementId: string, events?: readonly string[], context?: unknown): AbortController {
        const controller = new AbortController();
        const customElement = element as HTMLElement & { onConnected?: () => void; onDisconnected?: () => void; abortController?: AbortController };
        customElement.abortController = controller;
        customElement.onConnected = () => this.handleConnected(element, elementId, controller.signal, events, context);
        customElement.onDisconnected = () => this.handleDisconnected(elementId, controller, context);
        return controller;
    }

    private handleConnected(element: HTMLElement, elementId: string, signal: AbortSignal, events?: readonly string[], context?: unknown): void {
        this.attachEventListeners(element, elementId, signal, events, context);
        this.pulse(SignalType.RENDERED, {
            elementId,
            tag: element.tagName.toLowerCase(),
            ...(context !== undefined && { context }),
        });
    }

    private handleDisconnected(elementId: string, controller: AbortController, context?: unknown): void {
        controller.abort();
        this.pulse(SignalType.REMOVED, {
            elementId,
            removed: true,
            ...(context !== undefined && {
                context,
            }),
        });
    }

    private createElement(tag: string, elementId: string, attributes?: Record<string, string>, content?: string): HTMLElement | null {
        if (typeof document === 'undefined') { return null; }
        const element = document.createElement(tag);
        element.id = elementId;
        this.applyAttributes(element, attributes);
        if (content) { element.innerHTML = content; }
        return element;
    }

    private handleUpdate(value?: unknown): void {
        const { elementId = this.id, attributes, content, events, context } = (value ?? {}) as UpdatePayload;
        if (!elementId || typeof document === 'undefined') { return; }
        const element = document.getElementById(elementId) as (HTMLElement & { abortController?: AbortController }) | null;
        if (!element) { return; }
        this.applyAttributes(element, attributes);
        if (content !== undefined) { element.innerHTML = content; }
        if (events) { this.updateEventListeners(element, elementId, events, context); }
        this.pulse(SignalType.UPDATED, { elementId, updated: true, context });
    }

    private updateEventListeners(element: HTMLElement & { abortController?: AbortController }, elementId: string, events: readonly string[], context?: unknown): void {
        element.abortController?.abort();
        const controller = new AbortController();
        element.abortController = controller;
        this.attachEventListeners(element, elementId, controller.signal, events, context);
    }

    private handleRemove(value?: unknown): void {
        const { elementId = this.id, context } = (value ?? {}) as RemovePayload;
        if (!elementId || typeof document === 'undefined') { return; }
        const element = document.getElementById(elementId) as (HTMLElement & { onDisconnected?: () => void; abortController?: AbortController }) | null;
        if (!element) { return; }
        const { tagName, abortController } = element;
        element.remove();
        if (!tagName.includes('-') && abortController) {
            this.handleDisconnected(elementId, abortController, context);
        }
    }

    private registerElement(tag: string = DEFAULT_TAG): string {
        if (typeof customElements !== 'undefined' && tag.includes('-') && !customElements.get(tag)) {
            customElements.define(tag, WebComponent.createCustomElementClass());
        }
        return tag;
    }

    private resolveContainerElement(selector?: string): Element | null {
        if (typeof document === 'undefined') {
            return null;
        }
        if (!selector) {
            return document.getElementById('app') ?? document.body;
        }
        return this.findRenderContainer(selector);
    }

    private findRenderContainer(selector: string): Element | null {
        const container = selector.startsWith('#') ? document.getElementById(selector.slice(1)) : document.querySelector(selector);
        if (!container) {
            this.pulse(SignalType.ERROR, {
                containerElement: selector,
                error: `Missing render container: ${selector}`,
            });
        }
        return container;
    }

    private applyAttributes(element: HTMLElement, attributes?: Record<string, string>): void {
        const { value } = attributes ?? {}, { tagName } = element;
        Object.entries(attributes ?? {}).forEach(([name, attribute]) => element.setAttribute(name, attribute));
        if (value !== undefined && tagName === INPUT_TAG) {
            (element as HTMLInputElement).value = value;
        }
    }

    private attachEventListeners(element: HTMLElement, elementId: string, signal: AbortSignal, events?: readonly string[], context?: unknown): void {
        const targetEvents = events ?? DEFAULT_EVENTS;
        for (const eventName of targetEvents) {
            element.addEventListener(eventName, (event: Event) => {
                this.delegateDomEvent(elementId, eventName, event, context);
            }, { signal });
        }
    }

    private delegateDomEvent(rootElementId: string, eventName: string, event: Event, context?: unknown): void {
        const { target } = event;
        const eventTarget = target as HTMLElement | null;
        const resolved = eventTarget?.closest?.('[data-action], [id]') ?? eventTarget;
        const elementId = resolved?.id || rootElementId;
        const action = resolved?.getAttribute?.('data-action') ?? eventName;
        const { value, checked } = (resolved as HTMLInputElement | null) ?? {};
        const { detail } = event as CustomEvent;
        this.pulse(SignalType.EVENT, { elementId, event: eventName, action, value, checked, detail, context });
    }
}

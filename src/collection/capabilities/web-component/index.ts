import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    type Body,
    type EventContext,
    DataType,
    SignalType,
    LifecycleEventType,
} from './types.js';
import {
    __ID__,
    __DEFAULT_TAG__,
    __DEFAULT_OBSERVED_ATTRIBUTES__,
    __DEFAULT_DOM_EVENTS__,
} from './constants.js';
import {
    createReactiveElementClass,
    synchronizeElementAttributes,
    synchronizeElementText,
    mountElementToContainer,
} from './helpers.js';

export class WebComponent extends Capability<Body> {
    public static readonly AIM: string = 'Manage Web Component';

    public static override disposition: Disposition<Body> = {
        aim: { description: WebComponent.AIM, body: {} },
        reactTo: [
            SignalType.RENDERED,
            SignalType.UPDATED,
            SignalType.REMOVED,
        ],
        inputs: [
            { signal: SignalType.RENDERED, type: DataType.HTML_ELEMENT, description: 'Mount and render Web Component' },
            { signal: SignalType.UPDATED, type: DataType.RECORD, description: 'Update component attributes and properties' },
            { signal: SignalType.REMOVED, type: DataType.VOID, description: 'Unmount and destroy Web Component' },
        ],
        outputs: [
            { signal: SignalType.EVENT, type: DataType.EVENT_CONTEXT, description: 'DOM and custom component events' },
            { signal: SignalType.CONNECTED, type: DataType.LIFECYCLE_CONTEXT, description: 'Web Component connected to DOM lifecycle' },
            { signal: SignalType.DISCONNECTED, type: DataType.LIFECYCLE_CONTEXT, description: 'Web Component disconnected from DOM lifecycle' },
            { signal: SignalType.ATTRIBUTE_CHANGED, type: DataType.LIFECYCLE_CONTEXT, description: 'Observed attribute changed lifecycle' },
        ],
    };

    private readonly elements: Map<string, HTMLElement>;
    private readonly elementControllers: WeakMap<HTMLElement, AbortController>;

    public constructor(id: string = __ID__) {
        super(id);
        this.elements = new Map();
        this.elementControllers = new WeakMap();
    }


    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        super.innervate(target, disposition);
        this.defineComponentTag();
        return this;
    }

    public override denervate(): void {
        super.denervate();
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        const payload = this.extractPayload(value);
        if (!this.matchesId(payload?.id)) { return; }
        const componentId = payload?.id ?? this.id;
        switch (property) {
            case SignalType.REMOVED:
                this.removeComponent(componentId);
                break;
            case SignalType.RENDERED:
                this.createComponent(componentId, payload);
                break;
            case SignalType.UPDATED:
                this.updateComponent(componentId, payload);
                break;
            default:
                break;
        }
    }

    protected override matchesId(id?: string): boolean {
        if (!id) { return true; }
        const { aim } = this.disposition;
        const { id: configuredId } = aim.body ?? {};
        if (!configuredId) { return true; }
        const matches = id === configuredId || id.startsWith(`${configuredId}-`);
        return matches;
    }

    private defineComponentTag(): void {
        const tag = this.getTag();
        if (!this.isCustomElementDefined(tag)) {
            this.defineCustomElement(tag);
        }
    }

    private createComponent(id: string, payload?: Body): HTMLElement {
        const existing = this.getElement(id);
        if (existing) {
            this.updateComponent(id, payload);
            return existing;
        }
        return this.instantiateComponent(id, payload);
    }

    private instantiateComponent(id: string, payload?: Body): HTMLElement {
        const tag = this.getTag(payload?.tag);
        const element = this.instance(id, tag);
        this.mountElement(element, payload?.container);
        this.paintComponent(element, payload);
        return element;
    }

    private updateComponent(id: string, payload?: Body): void {
        const element = this.getElement(id);
        if (!element) {
            return;
        }
        this.mountElement(element, payload?.container);
        this.paintComponent(element, payload);
    }

    private paintComponent(element: HTMLElement, payload?: Body): void {
        const { aim } = this.disposition;
        const { attributes: dispositionAttributes, text: dispositionText } = aim.body ?? {};
        const combinedAttributes = { ...dispositionAttributes, ...payload?.attributes };
        const text = payload?.text ?? dispositionText;
        synchronizeElementAttributes(element, combinedAttributes);
        synchronizeElementText(element, text);
    }

    private getTag(payloadTag?: string): string {
        const { aim } = this.disposition;
        const { tag: dispositionTag } = aim.body ?? {};
        const fallbackTag = this.deriveTagFromId();
        const result = payloadTag ?? dispositionTag ?? fallbackTag;
        return result;
    }

    private deriveTagFromId(): string {
        const { aim } = this.disposition;
        const { id: bodyId } = aim.body ?? {};
        const sourceId = bodyId ?? this.id;
        const [prefix] = sourceId.split(':');
        const lower = prefix.trim().toLowerCase();
        const baseName = lower.split('-')[0];
        const result = baseName ? `ext-${baseName}` : __DEFAULT_TAG__;
        return result;
    }

    private isCustomElementDefined(tag: string): boolean {
        if (typeof customElements === 'undefined') { return true; }
        const isDefined = customElements.get(tag) !== undefined;
        return isDefined;
    }

    private defineCustomElement(tag: string): void {
        if (typeof customElements === 'undefined') { return; }
        const observedAttributes = this.getObservedAttributes();
        const elementClass = createReactiveElementClass(observedAttributes);
        customElements.define(tag, elementClass);
    }

    private getObservedAttributes(): readonly string[] {
        const { aim } = this.disposition;
        const { observedAttributes } = aim.body ?? {};
        const result = observedAttributes?.length ? observedAttributes : __DEFAULT_OBSERVED_ATTRIBUTES__;
        return result;
    }

    private getElement(id: string): HTMLElement | undefined {
        const element = this.elements.get(id);
        return element;
    }

    private setElement(id: string, element: HTMLElement): void {
        this.elements.set(id, element);
    }

    private instance(id: string, tag: string): HTMLElement {
        if (!this.isCustomElementDefined(tag)) {
            this.defineCustomElement(tag);
        }
        const element = document.createElement(tag);
        const resolvedId = id.includes(':') ? id.split(':')[1] : id;
        element.id = resolvedId;
        this.bindLifecycleListeners(element, id);
        this.setElement(id, element);
        return element;
    }

    private removeComponent(id: string): void {
        const element = this.elements.get(id);
        if (element) {
            this.unbindElementListeners(element);
            element.remove();
            this.elements.delete(id);
        }
    }

    private bindLifecycleListeners(element: HTMLElement, id: string): void {
        const controller = new AbortController();
        this.elementControllers.set(element, controller);
        const { signal } = controller;
        this.attachConnectedListener(element, id, signal);
        this.attachDisconnectedListener(element, id, signal);
        this.attachAttributeListener(element, id, signal);
        this.attachContentListener(element, id, signal);
        this.attachTagListener(element, id, signal);
        this.attachUserEventListeners(element, id, signal);
    }

    private attachUserEventListeners(element: HTMLElement, id: string, signal: AbortSignal): void {
        for (const eventType of __DEFAULT_DOM_EVENTS__) {
            const handleUserEvent: EventListener = (event: Event): void => {
                const context = this.buildEventContext(id, event);
                this.pulse(SignalType.EVENT, context);
            };
            this.attachListener(element, eventType, handleUserEvent, signal);
        }
    }

    private buildEventContext(id: string, event: Event): EventContext {
        const { type, target } = event;
        const { detail } = (event as CustomEvent);
        const { value: rawValue, checked, textContent } = (target ?? {}) as { value?: unknown; checked?: boolean; textContent?: string };
        const value = rawValue !== undefined ? rawValue : (textContent ?? undefined);
        const context: EventContext = { id, event: type, value, checked, detail };
        return context;
    }

    private attachConnectedListener(element: HTMLElement, id: string, signal: AbortSignal): void {
        const handleConnected: EventListener = (): void => {
            this.pulse(SignalType.CONNECTED, { id, tag: element.tagName.toLowerCase() });
        };
        this.attachListener(element, LifecycleEventType.CONNECTED, handleConnected, signal);
    }

    private attachDisconnectedListener(element: HTMLElement, id: string, signal: AbortSignal): void {
        const handleDisconnected: EventListener = (): void => {
            this.pulse(SignalType.DISCONNECTED, { id, tag: element.tagName.toLowerCase() });
        };
        this.attachListener(element, LifecycleEventType.DISCONNECTED, handleDisconnected, signal);
    }

    private attachAttributeListener(element: HTMLElement, id: string, signal: AbortSignal): void {
        const handleAttribute: EventListener = (event: Event): void => {
            const { name, oldValue, newValue } = (event as CustomEvent).detail;
            this.pulse(SignalType.ATTRIBUTE_CHANGED, { id, tag: element.tagName.toLowerCase(), attribute: name, oldValue, newValue });
        };
        this.attachListener(element, LifecycleEventType.ATTRIBUTE_CHANGED, handleAttribute, signal);
    }

    private attachContentListener(element: HTMLElement, id: string, signal: AbortSignal): void {
        const handleContent: EventListener = (event: Event): void => {
            const { content } = (event as CustomEvent<{ content: string }>).detail;
            this.pulse(SignalType.CONTENT_CHANGED, { id, tag: element.tagName.toLowerCase(), content });
        };
        this.attachListener(element, LifecycleEventType.CONTENT_CHANGED, handleContent, signal);
    }

    private attachTagListener(element: HTMLElement, id: string, signal: AbortSignal): void {
        const handleTag: EventListener = (event: Event): void => {
            const { oldTag, newTag } = (event as CustomEvent<{ oldTag: string; newTag: string }>).detail;
            this.pulse(SignalType.TAG_CHANGED, { id, oldTag, newTag });
        };
        this.attachListener(element, LifecycleEventType.TAG_CHANGED, handleTag, signal);
    }

    private attachListener(element: HTMLElement, type: string, action: EventListener, signal: AbortSignal): void {
        element.addEventListener(type, action, { signal });
    }

    private mountElement(element: HTMLElement, container?: HTMLElement): void {
        const { aim, parentTo } = this.disposition;
        const { container: fallbackContainer } = aim.body ?? {};
        const parentContainer = this.resolveParentContainer(parentTo);
        const defaultContainer = typeof document !== 'undefined' ? document.body : undefined;
        const activeContainer = container ?? fallbackContainer ?? parentContainer ?? defaultContainer;
        mountElementToContainer(element, activeContainer);
    }

    private resolveParentContainer(parentTo?: Disposition['parentTo']): HTMLElement | undefined {
        if (!parentTo?.uca || typeof document === 'undefined') { return undefined; }
        const { uca } = parentTo;
        const resolvedId = uca.includes(':') ? uca.split(':')[1] : uca;
        return document.getElementById(resolvedId ?? uca) ?? document.getElementById(uca) ?? undefined;
    }

    private unbindElementListeners(element: HTMLElement): void {
        const controller = this.elementControllers.get(element);
        if (controller) {
            controller.abort();
        }
    }
}

export { WebComponent as WebComponents };
export * from './constants.js';
export * from './types.js';
export * from './helpers.js';

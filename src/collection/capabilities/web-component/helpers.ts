import { LifecycleEventType, type ReactiveCustomElementConstructor } from './types.js';

function setupElementSlot(element: HTMLElement): void {
    if (!element.shadowRoot) {
        const shadowRoot = element.attachShadow({ mode: 'open' });
        const slot = document.createElement('slot');
        slot.addEventListener('slotchange', () => {
            const detail = { content: element.textContent ?? '' };
            element.dispatchEvent(new CustomEvent(LifecycleEventType.CONTENT_CHANGED, { detail, bubbles: false }));
        });
        shadowRoot.appendChild(slot);
    }
}

function notifyAttributeChange(
    element: HTMLElement,
    name: string,
    oldValue: string | null,
    newValue: string | null,
): void {
    const detail = { name, oldValue, newValue };
    element.dispatchEvent(new CustomEvent(LifecycleEventType.ATTRIBUTE_CHANGED, { detail, bubbles: false }));
    if (name === 'tag' && oldValue && newValue) {
        const tagDetail = { oldTag: oldValue, newTag: newValue };
        element.dispatchEvent(new CustomEvent(LifecycleEventType.TAG_CHANGED, { detail: tagDetail, bubbles: false }));
    }
}

export function createReactiveElementClass(observedAttributes: readonly string[]): ReactiveCustomElementConstructor {
    return class extends HTMLElement {
        public static get observedAttributes(): string[] {
            return [...observedAttributes];
        }

        public connectedCallback(): void {
            setupElementSlot(this);
            this.dispatchEvent(new CustomEvent(LifecycleEventType.CONNECTED, { bubbles: false }));
        }

        public disconnectedCallback(): void {
            this.dispatchEvent(new CustomEvent(LifecycleEventType.DISCONNECTED, { bubbles: false }));
        }

        public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
            if (oldValue !== newValue) {
                notifyAttributeChange(this, name, oldValue, newValue);
            }
        }
    };
}

export function copyElementAttributes(source: HTMLElement, target: HTMLElement): void {
    const attributes = Array.from(source.attributes);
    for (const { name, value } of attributes) {
        target.setAttribute(name, value);
    }
}

export function copyElementState(source: HTMLElement, target: HTMLElement): void {
    copyElementAttributes(source, target);
    const { textContent } = source;
    if (textContent) {
        target.textContent = textContent;
    }
}

export function synchronizeElementAttributes(
    element: HTMLElement,
    attributes?: Readonly<Record<string, string>>,
): void {
    if (!attributes) { return; }
    if (!('hidden' in attributes) && element.hasAttribute('hidden')) {
        element.removeAttribute('hidden');
    }
    for (const [name, value] of Object.entries(attributes)) {
        if (value !== undefined && value !== null) {
            element.setAttribute(name, value);
        } else {
            element.removeAttribute(name);
        }
    }
}

export function synchronizeElementText(element: HTMLElement, text?: string): void {
    const { textContent } = element;
    if (text !== undefined && textContent !== text) {
        element.textContent = text;
    }
}

export function mountElementToContainer(element: HTMLElement, container?: HTMLElement): void {
    if (container && !container.contains(element)) {
        container.appendChild(element);
    }
}

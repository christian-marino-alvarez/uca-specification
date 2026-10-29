import { Capability } from '@uca/core/capability';
import type {
  Disposition,
  Signal,
} from '@uca/core/types';
import {
  AIM,
  DEFAULT_EVENTS,
  DEFAULT_TAG,
  INPUT_TAG,
  TAG_PREFIX,
  __ID__,
} from './constants.js';
import {
  errorSchema,
  eventContextSchema,
  removePayloadSchema,
  removedResultSchema,
  renderPayloadSchema,
  renderedResultSchema,
  updatePayloadSchema,
  updatedResultSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type ManagedElement,
  type RemovePayload,
  type RenderPayload,
  type UpdatePayload,
} from './types.js';

export class WebComponent extends Capability<Body> {
  public static readonly AIM: string = AIM;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: WebComponent.AIM,
    },
    reactTo: [
      SignalType.RENDER,
      SignalType.UPDATE,
      SignalType.REMOVE,
    ],
    inputs: [
      {
        signal: SignalType.RENDER,
        type: DataType.RENDER_PAYLOAD,
        schema: renderPayloadSchema,
        description: 'Renderizar o actualizar idempotentemente un elemento en el Light DOM',
      },
      {
        signal: SignalType.UPDATE,
        type: DataType.UPDATE_PAYLOAD,
        schema: updatePayloadSchema,
        description: 'Actualizar atributos, contenido y escuchadores de eventos de un elemento existente',
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.REMOVE_PAYLOAD,
        schema: removePayloadSchema,
        description: 'Eliminar un elemento del DOM y abortar sus escuchadores de eventos',
      },
    ],
    outputs: [
      {
        signal: SignalType.RENDERED,
        type: DataType.RENDERED_RESULT,
        schema: renderedResultSchema,
        description: 'Confirmación de elemento renderizado en el DOM',
      },
      {
        signal: SignalType.UPDATED,
        type: DataType.UPDATED_RESULT,
        schema: updatedResultSchema,
        description: 'Confirmación de elemento actualizado en el DOM',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.REMOVED_RESULT,
        schema: removedResultSchema,
        description: 'Confirmación de elemento eliminado del DOM',
      },
      {
        signal: SignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción del usuario capturado y delegado desde el DOM',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.UNKNOWN,
        schema: errorSchema,
        description: 'Notificación de error durante la operación en el DOM',
      },
    ],
  };

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override react(signal: Signal): void {
    const {
      property,
    } = signal;
    switch (property) {
      case SignalType.RENDER:
        this.handleRender(signal);
        break;
      case SignalType.UPDATE:
        this.handleUpdate(signal);
        break;
      case SignalType.REMOVE:
        this.handleRemove(signal);
        break;
      default:
        break;
    }
  }

  private handleRender(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const payload = this.extractPayload<RenderPayload>(value);
    const tagName = this.registerCustomTag(payload, source);
    const element = this.mountElement(payload, tagName);
    this.applyElementState(element, payload);
    this.bindElementEvents(element, payload, DEFAULT_EVENTS);
    this.emitRenderOutcome(element, payload);
  }

  private handleUpdate(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<UpdatePayload>(value);
    const {
      context,
      elementId = this.id,
    } = payload ?? {};
    const element = this.findElement(elementId);
    if (!element) {
      return;
    }
    this.applyElementState(element, payload);
    this.bindElementEvents(element, payload);
    this.pulse(SignalType.UPDATED, {
      context,
      elementId,
      updated: true,
    });
  }

  private handleRemove(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      context,
      elementId = this.id,
    } = this.extractPayload<RemovePayload>(value) ?? {};
    const element = this.findElement(elementId);
    if (!element) {
      return;
    }
    element.abortController?.abort();
    element.remove();
    this.pulse(SignalType.REMOVED, {
      context,
      elementId,
      removed: true,
    });
  }

  private registerCustomTag(payload?: RenderPayload, source?: string): string {
    const {
      tag,
    } = payload ?? {};
    const origin = source && source !== __ID__ ? source : this.id;
    const suffix = origin.split(':').filter((part) => part && part !== __ID__).pop();
    const resolvedTag = tag ?? (suffix ? `${TAG_PREFIX}${suffix}` : DEFAULT_TAG);
    if (typeof customElements !== 'undefined' && resolvedTag.includes('-') && !customElements.get(resolvedTag)) {
      customElements.define(resolvedTag, class extends HTMLElement {});
    }
    return resolvedTag;
  }

  private mountElement(
    payload: RenderPayload | undefined,
    tagName: string,
  ): ManagedElement | null {
    const {
      containerElement,
      elementId = this.id,
    } = payload ?? {};
    const existing = elementId === 'body' ? document.body : document.getElementById(elementId);
    const container = !containerElement || containerElement === 'body' || containerElement === '#body'
      ? document.body
      : document.querySelector(containerElement);
    const element = existing ?? (container ? document.createElement(tagName) : null);
    if (element && !existing && container) {
      element.id = elementId;
      container.appendChild(element);
    }
    return element as ManagedElement | null;
  }

  private applyElementState(
    element: HTMLElement | null,
    payload?: RenderPayload | UpdatePayload,
  ): void {
    const {
      attributes,
      content,
    } = payload ?? {};
    const {
      value,
    } = attributes ?? {};
    if (!element) {
      return;
    }
    Object.entries(attributes ?? {}).forEach(([name, attribute]) => {
      element.setAttribute(name, attribute);
    });
    if (value !== undefined && element.tagName === INPUT_TAG) {
      (element as HTMLInputElement).value = value;
    }
    if (content !== undefined) {
      element.innerHTML = content;
    }
  }

  private bindElementEvents(
    element: ManagedElement | null,
    payload?: RenderPayload | UpdatePayload,
    fallbackEvents?: readonly string[],
  ): void {
    const {
      context,
      elementId = this.id,
      events = fallbackEvents,
    } = payload ?? {};
    if (!element || !events) {
      return;
    }
    element.abortController?.abort();
    const controller = new AbortController();
    element.abortController = controller;
    events.forEach((eventName) => {
      element.addEventListener(eventName, (event: Event) => {
        this.emitDomEvent(elementId, eventName, event, context);
      }, {
        signal: controller.signal,
      });
    });
  }

  private emitRenderOutcome(
    element: HTMLElement | null,
    payload?: RenderPayload,
  ): void {
    const {
      containerElement,
      context,
      elementId = this.id,
    } = payload ?? {};
    if (element) {
      this.pulse(SignalType.RENDERED, {
        context,
        elementId,
        tag: element.tagName.toLowerCase(),
      });
    }
    else {
      this.pulse(SignalType.ERROR, {
        containerElement,
        error: `Contenedor de renderizado no encontrado: ${containerElement}`,
      });
    }
  }

  private findElement(elementId: string): ManagedElement | null {
    const target = elementId === 'body'
      ? document.body
      : document.getElementById(elementId);
    return target as ManagedElement | null;
  }

  private emitDomEvent(
    rootElementId: string,
    eventName: string,
    event: Event,
    context?: unknown,
  ): void {
    const {
      detail,
      target,
    } = event as CustomEvent;
    const eventTarget = target as HTMLElement | null;
    const resolved = eventTarget?.closest?.('[data-action], [id]') ?? eventTarget;
    const {
      checked,
      value,
    } = ((eventTarget ?? resolved) as HTMLInputElement | null) ?? {};
    this.pulse(SignalType.EVENT, {
      action: resolved?.getAttribute?.('data-action') ?? eventName,
      checked,
      context,
      detail,
      elementId: resolved?.id || rootElementId,
      event: eventName,
      value,
    });
  }
}

import { Css } from '@uca/capability-css';
import {
  SignalType as CssSignalType,
  type ResolvedResult,
} from '@uca/capability-css/types';
import { Material } from '@uca/capability-material';
import {
  SignalType as MaterialSignalType,
  type ResolvedQualities,
} from '@uca/capability-material/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Uca } from '@uca/core/uca';
import {
  DispositionSignal,
  type CapabilityConstructor,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import {
  DEFAULT_INTENTION,
  DEFAULT_PURPOSE,
  __ID__,
} from './constants.js';
import {
  bodySchema,
  errorSchema,
  eventContextSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type EventContext,
} from './types.js';

export class Card extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: DEFAULT_INTENTION,
      body: {},
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.RENDER,
      SignalType.UPDATE,
      SignalType.REMOVE,
      ...Card.reactToWebComponent(),
      ...Card.reactToMaterial(),
      ...Card.reactToCss(),
    ],
    inputs: [
      {
        signal: DispositionSignal.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Continuar el flujo reactivo de la tarjeta tras actualizar su disposición',
        handler: Card.prototype.handleUpdated,
      },
      {
        signal: SignalType.RENDER,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Materializar la tarjeta en el DOM aplicando su contenido y cualidades visuales',
        handler: Card.prototype.handleRender,
      },
      {
        signal: SignalType.UPDATE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Actualizar el contenido o las cualidades visuales de la tarjeta',
        handler: Card.prototype.handleUpdate,
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Eliminar la tarjeta y sus estilos asociados del DOM',
        handler: Card.prototype.handleRemove,
      },
      {
        signal: WebComponentSignalType.RENDERED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de tarjeta renderizado en el DOM',
        handler: Card.prototype.handleWebComponentRendered,
      },
      {
        signal: WebComponentSignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de tarjeta actualizado en el DOM',
        handler: Card.prototype.handleWebComponentModified,
      },
      {
        signal: WebComponentSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de tarjeta eliminado del DOM',
        handler: Card.prototype.handleWebComponentRemoved,
      },
      {
        signal: WebComponentSignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción capturado desde la tarjeta',
        handler: Card.prototype.handleWebComponentEvent,
      },
      {
        signal: WebComponentSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de componente web',
        handler: Card.prototype.handleWebComponentError,
      },
      {
        signal: MaterialSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de Material Design 3 resueltas para el componente',
        handler: Card.prototype.handleMaterialResolved,
      },
      {
        signal: MaterialSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de Material Design 3',
        handler: Card.prototype.handleMaterialError,
      },
      {
        signal: CssSignalType.MOUNTED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de hoja raíz de tokens CSS montada en el documento',
        handler: Card.prototype.handleCssMounted,
      },
      {
        signal: CssSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de dominio traducidas a declaraciones y regla CSS',
        handler: Card.prototype.handleCssResolved,
      },
      {
        signal: CssSignalType.APPLIED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de regla CSS aplicada a la tarjeta en el DOM',
        handler: Card.prototype.handleCssApplied,
      },
      {
        signal: CssSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de reglas CSS retiradas de la tarjeta en el DOM',
        handler: Card.prototype.handleCssRemoved,
      },
      {
        signal: CssSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de estilos CSS',
        handler: Card.prototype.handleCssError,
      },
    ],
    outputs: [
      {
        signal: SignalType.CREATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Tarjeta creada y estilizada en el DOM',
      },
      {
        signal: SignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Tarjeta actualizada en el DOM',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Tarjeta eliminada del DOM',
      },
      {
        signal: SignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción emitido desde la tarjeta',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la operación de la tarjeta',
      },
    ],
  };

  private static reactToWebComponent(): string[] {
    const {
      reactTo = [],
    } = WebComponent.disposition;
    return [
      ...reactTo,
      WebComponentSignalType.RENDERED,
      WebComponentSignalType.UPDATED,
      WebComponentSignalType.REMOVED,
      WebComponentSignalType.EVENT,
      WebComponentSignalType.ERROR,
    ];
  }

  private static reactToMaterial(): string[] {
    const {
      reactTo = [],
    } = Material.disposition;
    return [
      ...reactTo,
      MaterialSignalType.RESOLVED,
      MaterialSignalType.ERROR,
    ];
  }

  private static reactToCss(): string[] {
    const {
      reactTo = [],
    } = Css.disposition;
    return [
      ...reactTo,
      CssSignalType.MOUNTED,
      CssSignalType.RESOLVED,
      CssSignalType.APPLIED,
      CssSignalType.REMOVED,
      CssSignalType.ERROR,
    ];
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override catalog(): Cooky {
    const webComponent = this.catalogWebComponent();
    const material = this.catalogMaterial();
    const css = this.catalogCss();
    return [
      webComponent,
      material,
      css,
    ];
  }

  private catalogWebComponent(): Cooky[number] {
    const disposition = this.createDisposition(
      WebComponent.disposition,
      WebComponent.AIM,
      'web-component',
    );
    return [
      WebComponent as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogMaterial(): Cooky[number] {
    const disposition = this.createDisposition(
      Material.disposition,
      Material.AIM,
      'material',
    );
    return [
      Material as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogCss(): Cooky[number] {
    const disposition = this.createDisposition(
      Css.disposition,
      Css.AIM,
      'css',
    );
    return [
      Css as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private handleUpdated(): void {
    const {
      source = this.id,
    } = this.body ?? {};
    if (source !== this.id) {
      this.handleSelfUpdated();
    }
  }

  private handleRender(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const payload = this.extractPayload<Body>(value);
    this.replaceDispositionBody({
      ...payload,
      source,
    });
  }

  private handleUpdate(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const payload = this.extractPayload<Body>(value);
    this.replaceDispositionBody({
      ...this.body,
      ...payload,
      source,
    });
  }

  private handleRemove(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      elementId = this.id,
    } = this.extractPayload<Body>(value) ?? {};
    this.pulse(CssSignalType.REMOVE, {
      elementId,
    });
  }

  private handleSelfUpdated(): void {
    const payload = this.createWebComponentPayload();
    this.pulse(WebComponentSignalType.RENDER, payload);
  }

  private handleWebComponentRendered(): void {
    this.pulse(CssSignalType.MOUNT, {});
  }

  private handleWebComponentModified(): void {
    this.pulse(CssSignalType.MOUNT, {});
  }

  private handleCssMounted(): void {
    const {
      qualities,
    } = this.body ?? {};
    this.pulse(MaterialSignalType.RESOLVE, {
      component: __ID__,
      qualities,
    });
  }

  private handleMaterialResolved(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      qualities,
    } = this.extractPayload<ResolvedQualities>(value) ?? {};
    const {
      elementId = this.id,
    } = this.body ?? {};
    this.pulse(CssSignalType.RESOLVE, {
      elementId,
      qualities,
    });
  }

  private handleCssResolved(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<ResolvedResult>(value);
    this.pulse(CssSignalType.APPLY, payload);
  }

  private handleCssApplied(): void {
    this.pulse(SignalType.CREATED, this.body);
  }

  private handleCssRemoved(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      elementId = this.id,
    } = this.extractPayload<Body>(value) ?? {};
    this.pulse(WebComponentSignalType.REMOVE, {
      elementId,
    });
  }

  private handleWebComponentRemoved(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<Body>(value);
    this.pulse(SignalType.REMOVED, {
      ...this.body,
      ...payload,
    });
  }

  private handleWebComponentEvent(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<EventContext>(value);
    this.pulse(SignalType.EVENT, payload);
  }

  private handleWebComponentError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleMaterialError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleCssError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private createWebComponentPayload(): Record<string, unknown> {
    const {
      disabled,
      elementId = this.id,
      events,
      parentTo,
    } = this.body ?? {};
    const containerElement = parentTo?.startsWith('#') ? parentTo : parentTo && `#${parentTo}`;
    return {
      attributes: {
        ...(disabled && {
          disabled: 'disabled',
        }),
      },
      containerElement,
      elementId,
      events,
    };
  }

  private replaceDispositionBody(body: Body): void {
    const {
      aim,
    } = this.disposition;
    const {
      context,
      id,
    } = (this.body ?? {}) as Record<string, unknown>;
    this.pulse(this.updateEvent, {
      ...this.disposition,
      aim: {
        ...aim,
        body: {
          ...body,
          context,
          id,
        },
      },
    });
  }
}

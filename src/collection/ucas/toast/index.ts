import { z } from 'zod';
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
import { Llm } from '@uca/llm';
import {
  SignalType as LlmSignalType,
  type InferPayload,
  type InferResult,
} from '@uca/llm/types';
import {
  DEFAULT_INTENTION,
  DEFAULT_PURPOSE,
  DEFAULT_TONE,
  __ID__,
} from './constants.js';
import {
  bodySchema,
  errorSchema,
  eventContextSchema,
  inferenceSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type EventContext,
} from './types.js';

export class Toast extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  private static readonly outputSchema: Record<string, unknown> =
    z.toJSONSchema(inferenceSchema);

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
      ...Toast.reactToWebComponent(),
      ...Toast.reactToMaterial(),
      ...Toast.reactToCss(),
      ...Toast.reactToLlm(),
    ],
    inputs: [
      {
        signal: DispositionSignal.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Continuar el flujo reactivo de la notificación emergente tras actualizar su disposición',
        handler: Toast.prototype.handleUpdated,
      },
      {
        signal: SignalType.RENDER,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Materializar la notificación emergente en el DOM aplicando su mensaje y cualidades visuales',
        handler: Toast.prototype.handleRender,
      },
      {
        signal: SignalType.UPDATE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Actualizar el mensaje, tono o estado de la notificación emergente',
        handler: Toast.prototype.handleUpdate,
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Descartar y eliminar la notificación emergente y sus estilos asociados del DOM',
        handler: Toast.prototype.handleRemove,
      },
      {
        signal: WebComponentSignalType.RENDERED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de notificación renderizado en el DOM',
        handler: Toast.prototype.handleWebComponentRendered,
      },
      {
        signal: WebComponentSignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de notificación actualizado en el DOM',
        handler: Toast.prototype.handleWebComponentModified,
      },
      {
        signal: WebComponentSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de notificación eliminado del DOM',
        handler: Toast.prototype.handleWebComponentRemoved,
      },
      {
        signal: WebComponentSignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción capturado desde la notificación emergente',
        handler: Toast.prototype.handleWebComponentEvent,
      },
      {
        signal: WebComponentSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de componente web',
        handler: Toast.prototype.handleWebComponentError,
      },
      {
        signal: MaterialSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de Material Design 3 resueltas para el componente',
        handler: Toast.prototype.handleMaterialResolved,
      },
      {
        signal: MaterialSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de Material Design 3',
        handler: Toast.prototype.handleMaterialError,
      },
      {
        signal: CssSignalType.MOUNTED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de hoja raíz de tokens CSS montada en el documento',
        handler: Toast.prototype.handleCssMounted,
      },
      {
        signal: CssSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de dominio traducidas a declaraciones y regla CSS',
        handler: Toast.prototype.handleCssResolved,
      },
      {
        signal: CssSignalType.APPLIED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de regla CSS aplicada a la notificación emergente en el DOM',
        handler: Toast.prototype.handleCssApplied,
      },
      {
        signal: CssSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de reglas CSS retiradas de la notificación emergente en el DOM',
        handler: Toast.prototype.handleCssRemoved,
      },
      {
        signal: CssSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de estilos CSS',
        handler: Toast.prototype.handleCssError,
      },
      {
        signal: LlmSignalType.INFERRED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Propiedades de dominio inferidas para la notificación emergente',
        handler: Toast.prototype.handleLlmInferred,
      },
      {
        signal: LlmSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la UCA de modelo de lenguaje',
        handler: Toast.prototype.handleLlmError,
      },
    ],
    outputs: [
      {
        signal: SignalType.CREATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Notificación emergente creada y estilizada en el DOM',
      },
      {
        signal: SignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Notificación emergente actualizada en el DOM',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Notificación emergente eliminada del DOM',
      },
      {
        signal: SignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción emitido desde la notificación emergente',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la operación de la notificación emergente',
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

  private static reactToLlm(): string[] {
    const {
      reactTo = [],
    } = Llm.disposition;
    return [
      ...reactTo,
      LlmSignalType.INFERRED,
      LlmSignalType.ERROR,
    ];
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override catalog(): Cooky {
    const webComponent = this.catalogWebComponent();
    const material = this.catalogMaterial();
    const css = this.catalogCss();
    const llm = this.catalogLlm();
    return [
      webComponent,
      material,
      css,
      llm,
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

  private catalogLlm(): Cooky[number] {
    const disposition = this.createDisposition(
      Llm.disposition,
      Llm.purpose,
      'llm',
    );
    return [
      Llm as unknown as CapabilityConstructor,
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
      tone = DEFAULT_TONE,
    } = this.body ?? {};
    this.pulse(MaterialSignalType.RESOLVE, {
      component: __ID__,
      qualities,
      tone,
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
    const shouldInfer = this.needsInference();
    if (shouldInfer) {
      const request = this.createInferRequest();
      this.pulse(LlmSignalType.INFER, request);
    }
    else {
      this.pulse(SignalType.CREATED, this.body);
    }
  }

  private needsInference(): boolean {
    const {
      content,
      intention,
      message,
      purpose,
      source,
    } = this.body ?? {};
    const hasMessage = !!(content || message);
    return source !== `${this.id}:llm` && !hasMessage && !!(purpose || intention);
  }

  private createInferRequest(): InferPayload {
    const {
      intention = DEFAULT_INTENTION,
      purpose = DEFAULT_PURPOSE,
    } = this.body ?? {};
    return {
      purpose,
      intention,
      id: __ID__,
      context: {
        ...this.body,
      },
      outputSchema: Toast.outputSchema,
    };
  }

  private handleLlmInferred(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      data,
      request,
    } = this.extractPayload<InferResult>(value) ?? {};
    const {
      context,
    } = request ?? {};
    const origin = (context ?? this.body ?? {}) as Body;
    const inferred = (data ?? {}) as Partial<Body>;
    this.replaceDispositionBody({
      ...origin,
      ...inferred,
      source,
    });
  }

  private handleLlmError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
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
      content,
      elementId = this.id,
      events,
      message,
      open = true,
      parentTo,
      tone = DEFAULT_TONE,
    } = this.body ?? {};
    const containerElement = parentTo?.startsWith('#') ? parentTo : parentTo && `#${parentTo}`;
    return {
      attributes: {
        'data-tone': tone,
        role: 'status',
        ...(open && {
          open: 'open',
        }),
      },
      containerElement,
      content: content || message,
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

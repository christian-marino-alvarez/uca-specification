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
  DEFAULT_TYPE,
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

export class Action extends Uca<Body> {
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
      ...Action.reactToWebComponent(),
      ...Action.reactToMaterial(),
      ...Action.reactToCss(),
      ...Action.reactToLlm(),
    ],
    inputs: [
      {
        signal: DispositionSignal.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Continuar el flujo reactivo del control de acción tras actualizar su disposición',
        handler: Action.prototype.handleUpdated,
      },
      {
        signal: SignalType.RENDER,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Materializar el control de acción en el DOM aplicando su etiqueta y cualidades visuales',
        handler: Action.prototype.handleRender,
      },
      {
        signal: SignalType.UPDATE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Actualizar la etiqueta, estado o cualidades visuales del control de acción',
        handler: Action.prototype.handleUpdate,
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Eliminar el control de acción y sus estilos asociados del DOM',
        handler: Action.prototype.handleRemove,
      },
      {
        signal: WebComponentSignalType.RENDERED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de acción renderizado en el DOM',
        handler: Action.prototype.handleWebComponentRendered,
      },
      {
        signal: WebComponentSignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de acción actualizado en el DOM',
        handler: Action.prototype.handleWebComponentModified,
      },
      {
        signal: WebComponentSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de acción eliminado del DOM',
        handler: Action.prototype.handleWebComponentRemoved,
      },
      {
        signal: WebComponentSignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción capturado desde el control de acción',
        handler: Action.prototype.handleWebComponentEvent,
      },
      {
        signal: WebComponentSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de componente web',
        handler: Action.prototype.handleWebComponentError,
      },
      {
        signal: MaterialSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de Material Design 3 resueltas para el componente',
        handler: Action.prototype.handleMaterialResolved,
      },
      {
        signal: MaterialSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de Material Design 3',
        handler: Action.prototype.handleMaterialError,
      },
      {
        signal: CssSignalType.MOUNTED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de hoja raíz de tokens CSS montada en el documento',
        handler: Action.prototype.handleCssMounted,
      },
      {
        signal: CssSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de dominio traducidas a declaraciones y regla CSS',
        handler: Action.prototype.handleCssResolved,
      },
      {
        signal: CssSignalType.APPLIED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de regla CSS aplicada al control de acción en el DOM',
        handler: Action.prototype.handleCssApplied,
      },
      {
        signal: CssSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de reglas CSS retiradas del control de acción en el DOM',
        handler: Action.prototype.handleCssRemoved,
      },
      {
        signal: CssSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de estilos CSS',
        handler: Action.prototype.handleCssError,
      },
      {
        signal: LlmSignalType.INFERRED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Propiedades de dominio inferidas para el control de acción',
        handler: Action.prototype.handleLlmInferred,
      },
      {
        signal: LlmSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la UCA de modelo de lenguaje',
        handler: Action.prototype.handleLlmError,
      },
    ],
    outputs: [
      {
        signal: SignalType.CREATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Control de acción creado y estilizado en el DOM',
      },
      {
        signal: SignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Control de acción actualizado en el DOM',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Control de acción eliminado del DOM',
      },
      {
        signal: SignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción emitido desde el control de acción',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la operación del control de acción',
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
      label,
      purpose,
      source,
      text,
      title,
    } = this.body ?? {};
    const hasContent = !!(content || label || text || title);
    return source !== `${this.id}:llm` && !hasContent && !!(purpose || intention);
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
      outputSchema: Action.outputSchema,
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
      action,
      content,
      disabled,
      elementId = this.id,
      events,
      label,
      parentTo,
      text,
      title,
      type = DEFAULT_TYPE,
    } = this.body ?? {};
    const containerElement = parentTo?.startsWith('#') ? parentTo : parentTo && `#${parentTo}`;
    return {
      attributes: {
        type,
        ...(action && {
          'data-action': action,
        }),
        ...(disabled && {
          disabled: 'disabled',
        }),
      },
      containerElement,
      content: content || label || text || title,
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

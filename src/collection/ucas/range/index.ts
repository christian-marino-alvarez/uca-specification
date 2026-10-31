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
  DEFAULT_MAXIMUM,
  DEFAULT_MINIMUM,
  DEFAULT_PURPOSE,
  DEFAULT_STEP,
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

export class Range extends Uca<Body> {
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
      ...Range.reactToWebComponent(),
      ...Range.reactToMaterial(),
      ...Range.reactToCss(),
      ...Range.reactToLlm(),
    ],
    inputs: [
      {
        signal: DispositionSignal.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Continuar el flujo reactivo del control de rango tras actualizar su disposición',
        handler: Range.prototype.handleUpdated,
      },
      {
        signal: SignalType.RENDER,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Materializar el control de rango en el DOM aplicando sus cotas y cualidades visuales',
        handler: Range.prototype.handleRender,
      },
      {
        signal: SignalType.UPDATE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Actualizar el valor, límites o cualidades visuales del control de rango',
        handler: Range.prototype.handleUpdate,
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Eliminar el control de rango y sus estilos asociados del DOM',
        handler: Range.prototype.handleRemove,
      },
      {
        signal: WebComponentSignalType.RENDERED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de rango renderizado en el DOM',
        handler: Range.prototype.handleWebComponentRendered,
      },
      {
        signal: WebComponentSignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de rango actualizado en el DOM',
        handler: Range.prototype.handleWebComponentModified,
      },
      {
        signal: WebComponentSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de elemento de rango eliminado del DOM',
        handler: Range.prototype.handleWebComponentRemoved,
      },
      {
        signal: WebComponentSignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción capturado desde el control de rango',
        handler: Range.prototype.handleWebComponentEvent,
      },
      {
        signal: WebComponentSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de componente web',
        handler: Range.prototype.handleWebComponentError,
      },
      {
        signal: MaterialSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de Material Design 3 resueltas para el componente',
        handler: Range.prototype.handleMaterialResolved,
      },
      {
        signal: MaterialSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de Material Design 3',
        handler: Range.prototype.handleMaterialError,
      },
      {
        signal: CssSignalType.MOUNTED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de hoja raíz de tokens CSS montada en el documento',
        handler: Range.prototype.handleCssMounted,
      },
      {
        signal: CssSignalType.RESOLVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Cualidades de dominio traducidas a declaraciones y regla CSS',
        handler: Range.prototype.handleCssResolved,
      },
      {
        signal: CssSignalType.APPLIED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de regla CSS aplicada al control de rango en el DOM',
        handler: Range.prototype.handleCssApplied,
      },
      {
        signal: CssSignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de reglas CSS retiradas del control de rango en el DOM',
        handler: Range.prototype.handleCssRemoved,
      },
      {
        signal: CssSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de estilos CSS',
        handler: Range.prototype.handleCssError,
      },
      {
        signal: LlmSignalType.INFERRED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Propiedades de dominio inferidas para el control de rango',
        handler: Range.prototype.handleLlmInferred,
      },
      {
        signal: LlmSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la UCA de modelo de lenguaje',
        handler: Range.prototype.handleLlmError,
      },
    ],
    outputs: [
      {
        signal: SignalType.CREATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Control de rango creado y estilizado en el DOM',
      },
      {
        signal: SignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Control de rango actualizado en el DOM',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Control de rango eliminado del DOM',
      },
      {
        signal: SignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción emitido desde el control de rango',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la operación del control de rango',
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
      intention,
      label,
      maximum,
      minimum,
      purpose,
      source,
      value,
    } = this.body ?? {};
    const hasRange = value !== undefined || minimum !== undefined || maximum !== undefined || !!label;
    return source !== `${this.id}:llm` && !hasRange && !!(purpose || intention);
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
      outputSchema: Range.outputSchema,
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
      disabled,
      elementId = this.id,
      events,
      label,
      maximum = DEFAULT_MAXIMUM,
      minimum = DEFAULT_MINIMUM,
      name,
      parentTo,
      required,
      step = DEFAULT_STEP,
      value = DEFAULT_MINIMUM,
    } = this.body ?? {};
    const containerElement = parentTo?.startsWith('#') ? parentTo : parentTo && `#${parentTo}`;
    return {
      attributes: {
        max: String(maximum),
        min: String(minimum),
        step: String(step),
        type: DEFAULT_TYPE,
        value: String(value),
        ...(action && {
          'data-action': action,
        }),
        ...(disabled && {
          disabled: 'disabled',
        }),
        ...(label && {
          'aria-label': label,
        }),
        ...(name && {
          name,
        }),
        ...(required && {
          required: 'required',
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

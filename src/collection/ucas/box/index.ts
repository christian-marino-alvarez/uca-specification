import { Css } from '@uca/capability-css';
import {
  SignalType as CssSignalType,
  type ResolvedResult,
} from '@uca/capability-css/types';
import { Skeleton } from '@uca/capability-skeleton';
import { SignalType as SkeletonSignalType } from '@uca/capability-skeleton/types';
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

export class Box extends Uca<Body> {
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
      ...Box.reactToWebComponent(),
      ...Box.reactToCss(),
      ...Box.reactToSkeleton(),
    ],
    inputs: [
      {
        signal: SignalType.RENDER,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Materializar el contenedor espacial en el DOM aplicando sus cualidades y estado de skeleton',
      },
      {
        signal: SignalType.UPDATE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Actualizar las cualidades, el contenido o el estado de skeleton del contenedor espacial',
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Eliminar el contenedor espacial y sus reglas de estilo asociadas del DOM',
      },
    ],
    outputs: [
      {
        signal: SignalType.CREATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Contenedor espacial creado y estilizado en el DOM',
      },
      {
        signal: SignalType.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Contenedor espacial actualizado en el DOM',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Contenedor espacial eliminado del DOM',
      },
      {
        signal: SignalType.EVENT,
        type: DataType.EVENT_CONTEXT,
        schema: eventContextSchema,
        description: 'Evento de interacción emitido desde el contenedor espacial',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la operación del contenedor espacial',
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

  private static reactToSkeleton(): string[] {
    const {
      reactTo = [],
    } = Skeleton.disposition;
    return [
      ...reactTo,
      SkeletonSignalType.MOUNTED,
      SkeletonSignalType.SHOWN,
      SkeletonSignalType.REMOVED,
      SkeletonSignalType.ERROR,
    ];
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override react(signal: Signal): void {
    const {
      property,
    } = signal;
    switch (property) {
      case DispositionSignal.UPDATED:
        this.handleUpdated();
        break;
      case SignalType.RENDER:
        this.handleRender(signal);
        break;
      case SignalType.UPDATE:
        this.handleUpdate(signal);
        break;
      case SignalType.REMOVE:
        this.handleRemove(signal);
        break;
      case WebComponentSignalType.RENDERED:
        this.handleWebComponentRendered(signal);
        break;
      case WebComponentSignalType.UPDATED:
        this.handleWebComponentModified(signal);
        break;
      case WebComponentSignalType.REMOVED:
        this.handleWebComponentRemoved(signal);
        break;
      case WebComponentSignalType.EVENT:
        this.handleWebComponentEvent(signal);
        break;
      case WebComponentSignalType.ERROR:
        this.handleWebComponentError(signal);
        break;
      case CssSignalType.MOUNTED:
        this.handleCssMounted();
        break;
      case CssSignalType.RESOLVED:
        this.handleCssResolved(signal);
        break;
      case CssSignalType.APPLIED:
        this.handleCssApplied(signal);
        break;
      case CssSignalType.REMOVED:
        this.handleCssRemoved(signal);
        break;
      case CssSignalType.ERROR:
        this.handleCssError(signal);
        break;
      case SkeletonSignalType.MOUNTED:
        this.handleSkeletonMounted();
        break;
      case SkeletonSignalType.SHOWN:
        this.handleSkeletonShown(signal);
        break;
      case SkeletonSignalType.REMOVED:
        this.handleSkeletonRemoved(signal);
        break;
      case SkeletonSignalType.ERROR:
        this.handleSkeletonError(signal);
        break;
      default:
        break;
    }
  }

  protected override catalog(): Cooky {
    const webComponent = this.catalogWebComponent();
    const css = this.catalogCss();
    const skeleton = this.catalogSkeleton();
    return [
      webComponent,
      css,
      skeleton,
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

  private catalogSkeleton(): Cooky[number] {
    const disposition = this.createDisposition(
      Skeleton.disposition,
      Skeleton.AIM,
      'skeleton',
    );
    return [
      Skeleton as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private handleUpdated(): void {
    const {
      source = this.id,
    } = this.body ?? {};
    switch (source) {
      case this.id:
        break;
      case `${this.id}:web-component`:
        this.handleWebComponentUpdated();
        break;
      case `${this.id}:css`:
        this.handleCssUpdated();
        break;
      case `${this.id}:skeleton`:
        this.handleSkeletonUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleRender(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      content,
      elementId = this.id,
      events,
      parentTo,
      qualities,
      skeleton,
    } = this.extractPayload<Body>(value) ?? {};
    this.updateDispositionBody({
      content,
      elementId,
      events,
      parentTo,
      qualities,
      skeleton,
      source,
    });
  }

  private handleUpdate(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      content,
      elementId = this.id,
      events,
      parentTo,
      qualities,
      skeleton,
    } = this.extractPayload<Body>(value) ?? {};
    this.updateDispositionBody({
      content,
      elementId,
      events,
      parentTo,
      qualities,
      skeleton,
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

  private handleWebComponentRendered(signal: Signal): void {
    const {
      source,
    } = signal;
    this.updateDispositionBody({
      source,
    });
  }

  private handleWebComponentModified(signal: Signal): void {
    const {
      source,
    } = signal;
    this.updateDispositionBody({
      source,
    });
  }

  private handleWebComponentUpdated(): void {
    const {
      qualities,
    } = this.body ?? {};
    if (qualities) {
      this.pulse(CssSignalType.MOUNT, {});
    }
    else {
      this.handleCssUpdated();
    }
  }

  private handleCssMounted(): void {
    const {
      elementId = this.id,
      qualities,
    } = this.body ?? {};
    if (qualities) {
      this.pulse(CssSignalType.RESOLVE, {
        elementId,
        qualities,
      });
    }
  }

  private handleCssResolved(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<ResolvedResult>(value);
    this.pulse(CssSignalType.APPLY, payload);
  }

  private handleCssApplied(signal: Signal): void {
    const {
      source,
    } = signal;
    this.updateDispositionBody({
      source,
    });
  }

  private handleCssUpdated(): void {
    const {
      elementId = this.id,
      skeleton,
    } = this.body ?? {};
    switch (skeleton) {
      case true:
        this.pulse(SkeletonSignalType.MOUNT, {});
        break;
      case false:
        this.pulse(SkeletonSignalType.REMOVE, {
          elementId,
        });
        break;
      default:
        this.pulse(SignalType.CREATED, this.body);
        break;
    }
  }

  private handleSkeletonMounted(): void {
    const {
      elementId = this.id,
    } = this.body ?? {};
    this.pulse(SkeletonSignalType.SHOW, {
      elementId,
    });
  }

  private handleSkeletonShown(signal: Signal): void {
    const {
      source,
    } = signal;
    this.updateDispositionBody({
      source,
    });
  }

  private handleSkeletonRemoved(signal: Signal): void {
    const {
      source,
    } = signal;
    this.updateDispositionBody({
      source,
    });
  }

  private handleSkeletonUpdated(): void {
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

  private handleCssError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleSkeletonError(signal: Signal): void {
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
      parentTo,
    } = this.body ?? {};
    const containerElement = parentTo?.startsWith('#') ? parentTo : parentTo && `#${parentTo}`;
    return {
      containerElement,
      content,
      elementId,
      events,
    };
  }

  private updateDispositionBody(partial: Partial<Body>): void {
    this.pulse(this.updateEvent, {
      ...this.disposition,
      aim: {
        description: DEFAULT_INTENTION,
        body: {
          ...this.body,
          ...partial,
        },
      },
    });
  }
}

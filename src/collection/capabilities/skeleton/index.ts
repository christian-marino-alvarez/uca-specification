import { Capability } from '@uca/core/capability';
import type {
  Disposition,
  Signal,
} from '@uca/core/types';
import {
  AIM,
  DEFAULT_CLASS,
  DEFAULT_STYLES,
  STYLE_TAG_ID,
  __ID__,
} from './constants.js';
import {
  errorSchema,
  mountedResultSchema,
  mountPayloadSchema,
  removedResultSchema,
  removePayloadSchema,
  shownResultSchema,
  showPayloadSchema,
  type Body,
  type RemovePayload,
  type ShowPayload,
} from './schema.js';
import {
  DataType,
  SignalType,
} from './types.js';

export class Skeleton extends Capability<Body> {
  public static readonly AIM: string = AIM;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: Skeleton.AIM,
      body: {},
    },
    reactTo: [
      SignalType.MOUNT,
      SignalType.SHOW,
      SignalType.REMOVE,
    ],
    inputs: [
      {
        signal: SignalType.MOUNT,
        type: DataType.MOUNT_PAYLOAD,
        schema: mountPayloadSchema,
        description: 'Montar la hoja de estilos de animación del marcador visual de carga (skeleton)',
      },
      {
        signal: SignalType.SHOW,
        type: DataType.SHOW_PAYLOAD,
        schema: showPayloadSchema,
        description: 'Renderizar marcador visual de carga (skeleton) en el contenedor objetivo',
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.REMOVE_PAYLOAD,
        schema: removePayloadSchema,
        description: 'Retirar marcador visual de carga (skeleton) del contenedor objetivo',
      },
    ],
    outputs: [
      {
        signal: SignalType.MOUNTED,
        type: DataType.MOUNTED_RESULT,
        schema: mountedResultSchema,
        description: 'Confirmación de hoja de estilos de skeleton montada en el documento',
      },
      {
        signal: SignalType.SHOWN,
        type: DataType.SHOWN_RESULT,
        schema: shownResultSchema,
        description: 'Confirmación de marcador visual de carga (skeleton) renderizado',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.REMOVED_RESULT,
        schema: removedResultSchema,
        description: 'Confirmación de marcador visual de carga (skeleton) retirado',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR_RESULT,
        schema: errorSchema,
        description: 'Error emitido durante la gestión del skeleton',
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
      case SignalType.MOUNT:
        this.handleMount(signal);
        break;
      case SignalType.SHOW:
        this.handleShow(signal);
        break;
      case SignalType.REMOVE:
        this.handleRemove(signal);
        break;
      default:
        break;
    }
  }

  private handleMount(_signal: Signal): void {
    const existing = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
    if (existing?.sheet) {
      this.pulse(SignalType.MOUNTED, {
        mounted: true,
      });
    }
    else {
      this.mountStyles(existing);
    }
  }

  private handleShow(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      containerElement,
      context,
      elementId = this.id,
    } = this.extractPayload<ShowPayload>(value) ?? {};
    const container = this.resolveContainer(containerElement ?? elementId);
    this.mountSkeleton(container, elementId);
    this.pulse(SignalType.SHOWN, {
      context,
      elementId,
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
    this.unmountSkeleton(elementId);
    this.pulse(SignalType.REMOVED, {
      context,
      elementId,
    });
  }

  private mountStyles(existing: HTMLStyleElement | null): void {
    const style = existing ?? document.createElement('style');
    style.id = STYLE_TAG_ID;
    style.textContent = DEFAULT_STYLES;
    style.addEventListener('load', () => {
      this.pulse(SignalType.MOUNTED, {
        mounted: true,
      });
    }, {
      once: true,
    });
    if (!existing) {
      document.head.appendChild(style);
    }
  }

  private resolveContainer(target: string): Element | null {
    const id = target.startsWith('#') ? target.slice(1) : target;
    const element = id === 'body'
      ? document.body
      : document.getElementById(id) ?? document.querySelector(target);
    return element;
  }

  private mountSkeleton(container: Element | null, elementId: string): void {
    const selector = `[data-skeleton="${elementId}"]`;
    if (!container || container.querySelector(selector)) {
      return;
    }
    const skeleton = document.createElement('div');
    skeleton.className = DEFAULT_CLASS;
    skeleton.setAttribute('data-skeleton', elementId);
    container.appendChild(skeleton);
  }

  private unmountSkeleton(elementId: string): void {
    const selector = `[data-skeleton="${elementId}"]`;
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((node) => {
      node.remove();
    });
  }
}

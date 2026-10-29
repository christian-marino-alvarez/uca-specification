import { Capability } from '@uca/core/capability';
import type {
  Disposition,
  Signal,
} from '@uca/core/types';
import {
  AIM,
  IDENTIFIED_DESCENDANT_SELECTOR,
  PROPERTY_MAPPINGS,
  STYLE_PREFIX,
  TOKENS_STYLESHEET,
  TOKENS_STYLE_ID,
  TOKEN_VARIABLES,
  __ID__,
} from './constants.js';
import {
  appliedResultSchema,
  applyPayloadSchema,
  errorSchema,
  mountedResultSchema,
  mountPayloadSchema,
  removedResultSchema,
  removePayloadSchema,
  resolvedResultSchema,
  resolvePayloadSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type ApplyPayload,
  type Body,
  type Qualities,
  type RemovePayload,
  type ResolvePayload,
} from './types.js';

export class Css extends Capability<Body> {
  public static readonly AIM: string = AIM;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: Css.AIM,
      body: {},
    },
    reactTo: [
      SignalType.MOUNT,
      SignalType.RESOLVE,
      SignalType.APPLY,
      SignalType.REMOVE,
    ],
    inputs: [
      {
        signal: SignalType.MOUNT,
        type: DataType.MOUNT_PAYLOAD,
        schema: mountPayloadSchema,
        description: 'Montar la hoja raíz de tokens de diseño y reglas base en el documento',
      },
      {
        signal: SignalType.RESOLVE,
        type: DataType.RESOLVE_PAYLOAD,
        schema: resolvePayloadSchema,
        description: 'Traducir cualidades de dominio del elemento a declaraciones y regla CSS',
      },
      {
        signal: SignalType.APPLY,
        type: DataType.APPLY_PAYLOAD,
        schema: applyPayloadSchema,
        description: 'Aplicar la regla de estilo CSS resuelta al elemento en el DOM',
      },
      {
        signal: SignalType.REMOVE,
        type: DataType.REMOVE_PAYLOAD,
        schema: removePayloadSchema,
        description: 'Retirar las reglas de estilo acotadas del elemento y sus descendientes',
      },
    ],
    outputs: [
      {
        signal: SignalType.MOUNTED,
        type: DataType.MOUNTED_RESULT,
        schema: mountedResultSchema,
        description: 'Confirmación de hoja raíz de tokens de diseño montada en el documento',
      },
      {
        signal: SignalType.RESOLVED,
        type: DataType.RESOLVED_RESULT,
        schema: resolvedResultSchema,
        description: 'Cualidades de dominio traducidas a declaraciones y regla CSS',
      },
      {
        signal: SignalType.APPLIED,
        type: DataType.APPLIED_RESULT,
        schema: appliedResultSchema,
        description: 'Confirmación de regla de estilo CSS aplicada al elemento en el DOM',
      },
      {
        signal: SignalType.REMOVED,
        type: DataType.REMOVED_RESULT,
        schema: removedResultSchema,
        description: 'Confirmación de reglas de estilo CSS retiradas del elemento',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Notificación de error durante la operación de estilo CSS',
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
      case SignalType.RESOLVE:
        this.handleResolve(signal);
        break;
      case SignalType.APPLY:
        this.handleApply(signal);
        break;
      case SignalType.REMOVE:
        this.handleRemove(signal);
        break;
      default:
        break;
    }
  }

  private handleMount(_signal: Signal): void {
    const existing = document.getElementById(TOKENS_STYLE_ID) as HTMLStyleElement | null;
    if (existing?.sheet) {
      this.pulse(SignalType.MOUNTED, {
        mounted: true,
      });
    }
    else {
      this.mountTokensStyle(existing);
    }
  }

  private handleResolve(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      elementId,
      qualities,
    } = this.extractPayload<ResolvePayload>(value) ?? {};
    if (!elementId || !qualities) {
      return;
    }
    const declarations = this.resolveDeclarations(qualities);
    const cssText = this.formatCssRule(elementId, declarations);
    this.pulse(SignalType.RESOLVED, {
      cssText,
      declarations,
      elementId,
    });
  }

  private handleApply(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      cssText,
      declarations = {},
      elementId,
    } = this.extractPayload<ApplyPayload>(value) ?? {};
    if (!elementId || !cssText) {
      return;
    }
    this.mountElementStyle(elementId, cssText, declarations);
  }

  private handleRemove(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      elementId,
    } = this.extractPayload<RemovePayload>(value) ?? {};
    if (!elementId) {
      return;
    }
    this.unmountElementStyles(elementId);
    this.pulse(SignalType.REMOVED, {
      elementId,
      removed: true,
    });
  }

  private resolveDeclarations(qualities: Qualities): Record<string, string> {
    const {
      alignment,
      direction,
      distribution,
      division,
      gap,
      wrap,
    } = qualities;
    const isFlex = Boolean(direction || alignment || distribution || wrap || gap);
    const entries = PROPERTY_MAPPINGS
      .filter(([
        quality,
      ]) => qualities[quality] !== undefined && !(division && (quality === 'direction' || quality === 'wrap')))
      .map(([
        quality,
        group,
        property,
      ]) => [
        property,
        TOKEN_VARIABLES[`${group}:${String(qualities[quality])}`] ?? String(qualities[quality]),
      ]);
    const mapped = Object.fromEntries(entries);
    return {
      'box-sizing': 'border-box',
      ...(isFlex && {
        display: 'flex',
      }),
      ...(division && {
        display: 'grid',
      }),
      ...mapped,
    };
  }

  private formatCssRule(
    elementId: string,
    declarations: Record<string, string>,
  ): string {
    const isRootTag = elementId === 'body' || elementId === 'html';
    const selector = isRootTag ? elementId : `[id="${elementId}"]`;
    const rules = Object.entries(declarations)
      .map(([
        property,
        value,
      ]) => `${property}: ${value};`)
      .join(' ');
    return `${selector} { ${rules} }`;
  }

  private mountTokensStyle(existing: HTMLStyleElement | null): void {
    const style = existing ?? document.createElement('style');
    style.id = TOKENS_STYLE_ID;
    style.textContent = TOKENS_STYLESHEET;
    style.addEventListener('load', () => {
      this.pulse(SignalType.MOUNTED, {
        mounted: true,
      });
    }, {
      once: true,
    });
    if (!existing) {
      document.head.prepend(style);
    }
  }

  private mountElementStyle(
    elementId: string,
    cssText: string,
    declarations: Record<string, string>,
  ): void {
    const styleId = `${STYLE_PREFIX}${elementId}`;
    document.getElementById(styleId)?.remove();
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = cssText;
    style.addEventListener('load', () => {
      this.pulse(SignalType.APPLIED, {
        declarations,
        elementId,
      });
    }, {
      once: true,
    });
    document.head.appendChild(style);
  }

  private unmountElementStyles(elementId: string): void {
    const element = document.getElementById(elementId);
    const nodes = element?.querySelectorAll(IDENTIFIED_DESCENDANT_SELECTOR) ?? [];
    const descendants = Array.from(nodes, ({
      id,
    }) => id);
    const styles = document.querySelectorAll(`style[id^="${STYLE_PREFIX}"]`);
    styles.forEach((style) => {
      const targetId = style.id.slice(STYLE_PREFIX.length);
      const isTarget = targetId === elementId || descendants.includes(targetId);
      const targetElement = document.getElementById(targetId);
      const isOrphan = targetId !== 'body' && targetId !== 'html' && !targetElement;
      if (isTarget || isOrphan) {
        style.remove();
      }
    });
  }
}

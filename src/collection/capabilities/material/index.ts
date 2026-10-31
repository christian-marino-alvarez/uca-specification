import { Capability } from '@uca/core/capability';
import type {
  Disposition,
  Signal,
} from '@uca/core/types';
import {
  AIM,
  COMPACT_MAX_WIDTH,
  COMPONENT_QUALITIES,
  DEFAULT_DIMENSIONS,
  DEFAULT_MATERIAL_MODEL,
  HEADING_IMPORTANCE_QUALITIES,
  MEDIUM_MAX_WIDTH,
  TONE_QUALITIES,
  VARIANT_QUALITIES,
  WINDOW_SIZE_RULES,
  __ID__,
} from './constants.js';
import {
  errorSchema,
  materialModelSchema,
  queryRequestSchema,
  resolvedQualitiesSchema,
  resolveRequestSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type MaterialModel,
  type QueryRequest,
  type ResolveRequest,
} from './types.js';

export class Material extends Capability<Body> {
  public static readonly AIM: string = AIM;
  public static readonly __ID__: string = __ID__;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: AIM,
      body: {
        model: DEFAULT_MATERIAL_MODEL,
      },
    },
    reactTo: [
      SignalType.QUERY,
      SignalType.RESOLVE,
    ],
    inputs: [
      {
        signal: SignalType.QUERY,
        type: DataType.QUERY_REQUEST,
        schema: queryRequestSchema,
        description: 'Consultar las reglas de distribución espacial y layouts canónicos de Material Design 3 para las dimensiones disponibles',
        handler: Material.prototype.handleQuery,
      },
      {
        signal: SignalType.RESOLVE,
        type: DataType.RESOLVE_REQUEST,
        schema: resolveRequestSchema,
        description: 'Resolver las cualidades visuales de Material Design 3 para un componente según su rol, importancia, variante o tono',
        handler: Material.prototype.handleResolve,
      },
    ],
    outputs: [
      {
        signal: SignalType.PROVIDED,
        type: DataType.MATERIAL_MODEL,
        schema: materialModelSchema,
        description: 'Modelo espacial de Material Design 3 resuelto según las dimensiones del contenedor',
      },
      {
        signal: SignalType.RESOLVED,
        type: DataType.RESOLVED_QUALITIES,
        schema: resolvedQualitiesSchema,
        description: 'Cualidades visuales de Material Design 3 resueltas para el componente',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la consulta o resolución de Material Design 3',
      },
    ],
  };

  public constructor(id: string = __ID__) {
    super(id);
  }

  private handleQuery(signal: Signal): void {
    const {
      value,
    } = signal;
    const model = this.resolveModel(value);
    this.pulse(SignalType.PROVIDED, model);
  }

  private handleResolve(signal: Signal): void {
    const {
      value,
    } = signal;
    const qualities = this.resolveComponentQualities(value);
    this.pulse(SignalType.RESOLVED, {
      qualities,
    });
  }

  private resolveModel(value: unknown): MaterialModel {
    const {
      dimensions = DEFAULT_DIMENSIONS,
    } = this.extractPayload<QueryRequest>(value) ?? {};
    const {
      width,
    } = dimensions;
    const sizeClass = width <= COMPACT_MAX_WIDTH
      ? 'compact'
      : width <= MEDIUM_MAX_WIDTH
        ? 'medium'
        : 'expanded';
    return {
      ...DEFAULT_MATERIAL_MODEL,
      windowSizeRule: WINDOW_SIZE_RULES[sizeClass],
    };
  }

  private resolveComponentQualities(value: unknown): Record<string, unknown> {
    const {
      component = 'box',
      importance,
      qualities,
      tone,
      variant,
    } = this.extractPayload<ResolveRequest>(value) ?? {};
    return {
      ...COMPONENT_QUALITIES[component],
      ...(importance && HEADING_IMPORTANCE_QUALITIES[importance]),
      ...(variant && VARIANT_QUALITIES[variant]),
      ...(tone && TONE_QUALITIES[tone]),
      ...qualities,
    };
  }
}

import { Capability } from '@uca/core/capability';
import type {
  Disposition,
  Signal,
} from '@uca/core/types';
import {
  AIM,
  COMPACT_MAX_WIDTH,
  DEFAULT_DIMENSIONS,
  DEFAULT_MATERIAL_MODEL,
  MEDIUM_MAX_WIDTH,
  WINDOW_SIZE_RULES,
  __ID__,
} from './constants.js';
import {
  errorSchema,
  materialModelSchema,
  queryRequestSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type MaterialModel,
  type QueryRequest,
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
    ],
    inputs: [
      {
        signal: SignalType.QUERY,
        type: DataType.QUERY_REQUEST,
        schema: queryRequestSchema,
        description: 'Consultar las reglas de distribución espacial y layouts canónicos de Material Design 3 para las dimensiones disponibles',
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
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la consulta del sistema espacial de Material Design 3',
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
      case SignalType.QUERY:
        this.handleQuery(signal);
        break;
      default:
        break;
    }
  }

  private handleQuery(signal: Signal): void {
    const {
      value,
    } = signal;
    const model = this.resolveModel(value);
    this.pulse(SignalType.PROVIDED, model);
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
}

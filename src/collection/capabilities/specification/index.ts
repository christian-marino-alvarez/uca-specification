import { Capability } from '@uca/core/capability';
import type {
  Disposition,
  Signal,
} from '@uca/core/types';
import {
  AIM,
  DEFAULT_SPECIFICATION_MODEL,
  __ID__,
} from './constants.js';
import {
  queryRequestSchema,
  specificationModelSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type QueryRequest,
  type SpecificationModel,
} from './types.js';

export class Specification extends Capability<Body> {
  public static readonly AIM: string = AIM;
  public static readonly __ID__: string = __ID__;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: AIM,
      body: {
        model: DEFAULT_SPECIFICATION_MODEL,
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
        description: 'Consultar el modelo de especificación con filtro opcional de claves',
      },
    ],
    outputs: [
      {
        signal: SignalType.PROVIDED,
        type: DataType.SPECIFICATION_MODEL,
        schema: specificationModelSchema,
        description: 'Modelo de especificación activo o subconjunto filtrado proporcionado',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        description: 'Error emitido durante la consulta de la especificación',
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

  private resolveActiveModel(): SpecificationModel {
    const {
      aim,
    } = this.disposition;
    const {
      model = DEFAULT_SPECIFICATION_MODEL,
    } = aim.body ?? {};
    return model;
  }

  private handleQuery(signal: Signal): void {
    const {
      value,
    } = signal;
    const keys = this.extractQueryKeys(value);
    const model = this.resolveActiveModel();
    const payload = this.filterSpecification(model, keys);
    this.pulse(SignalType.PROVIDED, payload);
  }

  private extractQueryKeys(value?: unknown): string[] | undefined {
    const {
      keys,
    } = (value ?? {}) as QueryRequest ?? {};
    return keys;
  }

  private filterSpecification(
    model: SpecificationModel,
    keys?: string[],
  ): SpecificationModel {
    if (!keys || keys.length === 0) {
      return model;
    }
    const keySet = new Set(keys);
    return Object.fromEntries(
      Object.entries(model).filter(([key]) => keySet.has(key)),
    ) as SpecificationModel;
  }
}

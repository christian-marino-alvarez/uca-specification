import { Specification as SpecificationCapability } from '@uca/capability-specification';
import {
  SignalType as SpecificationSignalType,
  type SpecificationModel,
} from '@uca/capability-specification/types';
import { Decision } from '@uca/decision';
import {
  SignalType as DecisionSignalType,
  type Request as DecisionRequest,
  type Result as DecisionResult,
} from '@uca/decision/types';
import { Uca } from '@uca/core/uca';
import {
  DispositionSignal,
  type CapabilityConstructor,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import {
  AREA_DECISION_QUESTION,
  DEFAULT_AREA_ID,
  DEFAULT_PURPOSE,
  DEFAULT_ROOT_AREA,
  DEFAULT_URL,
  ROOT_DECISION_QUESTION,
  SPECIFICATION_DECISION_KEYS,
  __ID__,
} from './constants.js';
import {
  composeRequestSchema,
  errorPayloadSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type AreaTarget,
  type Body,
  type Choice,
  type ComposeRequest,
} from './types.js';

export class Composition extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: DEFAULT_PURPOSE,
      body: {
        area: DEFAULT_ROOT_AREA,
        url: DEFAULT_URL,
      },
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.COMPOSE,
      ...Composition.reactToSpecification(),
      ...Composition.reactToDecision(),
    ],
    inputs: [
      {
        signal: SignalType.COMPOSE,
        type: DataType.COMPOSE_REQUEST,
        schema: composeRequestSchema,
        description: 'Analizar la especificación y decidir si componer el área objetivo como Layout o View',
      },
    ],
    outputs: [
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorPayloadSchema,
        description: 'Error emitido durante la consulta de la especificación o la decisión de composición',
      },
    ],
  };

  private static reactToSpecification(): string[] {
    const {
      reactTo = [],
    } = SpecificationCapability.disposition;
    return [
      ...reactTo,
      SpecificationSignalType.PROVIDED,
      SpecificationSignalType.ERROR,
    ];
  }

  private static reactToDecision(): string[] {
    const {
      reactTo = [],
    } = Decision.disposition;
    return [
      ...reactTo,
      DecisionSignalType.DECIDED,
      DecisionSignalType.ERROR,
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
      case SignalType.COMPOSE:
        this.handleCompose(signal);
        break;
      case SpecificationSignalType.PROVIDED:
        this.handleSpecificationProvided(signal);
        break;
      case SpecificationSignalType.ERROR:
        this.handleSpecificationError(signal);
        break;
      case DecisionSignalType.DECIDED:
        this.handleDecisionDecided(signal);
        break;
      case DecisionSignalType.ERROR:
        this.handleDecisionError(signal);
        break;
      default:
        break;
    }
  }

  protected override catalog(): Cooky {
    return [
      this.catalogSpecification(),
      this.catalogDecision(),
    ];
  }

  private catalogSpecification(): Cooky[number] {
    const disposition = this.createDisposition(
      SpecificationCapability.disposition,
      SpecificationCapability.AIM,
      'specification',
    );
    return [
      SpecificationCapability as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogDecision(): Cooky[number] {
    const disposition = this.createDisposition(
      Decision.disposition,
      Decision.purpose,
      'decision',
    );
    return [
      Decision as unknown as CapabilityConstructor,
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
      case `${this.id}:specification`:
        this.handleSpecificationUpdated();
        break;
      case `${this.id}:decision`:
        this.handleDecisionUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleCompose(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      area = DEFAULT_ROOT_AREA,
      url = DEFAULT_URL,
    } = this.extractPayload<ComposeRequest>(value) ?? {};
    this.updateDispositionBody({
      area,
      choice: undefined,
      decision: undefined,
      source,
      url,
    });
  }

  private handleSelfUpdated(): void {
    this.pulse(SpecificationSignalType.QUERY, {
      keys: [
        ...SPECIFICATION_DECISION_KEYS,
      ],
    });
  }

  private handleSpecificationProvided(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const specification = this.extractPayload<SpecificationModel>(value);
    this.updateDispositionBody({
      source,
      specification,
    });
  }

  private handleSpecificationUpdated(): void {
    const {
      area,
      specification,
      url = DEFAULT_URL,
    } = this.body ?? {};
    if (specification) {
      const request = this.createDecisionRequest(area, specification, url);
      this.pulse(DecisionSignalType.DECIDE, request);
    }
  }

  private createDecisionRequest(
    area: AreaTarget | undefined,
    specification: SpecificationModel,
    url: string,
  ): DecisionRequest {
    const isRoot = !area?.id || area.id === DEFAULT_AREA_ID;
    return {
      context: {
        area,
        specification,
        url,
      },
      question: isRoot ? ROOT_DECISION_QUESTION : AREA_DECISION_QUESTION,
    };
  }

  private handleDecisionDecided(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      result,
    } = this.extractPayload<DecisionResult>(value) ?? {};
    this.updateDispositionBody({
      choice: result?.choice as Choice,
      decision: result,
      source,
    });
  }

  private handleDecisionUpdated(): void {
    const {
      choice,
      decision,
    } = this.body ?? {};
    console.log('[Composition] Decision consolidated:', choice, decision);
  }

  private handleSpecificationError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleDecisionError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private updateDispositionBody(partial: Partial<Body>): void {
    const {
      aim,
    } = this.disposition;
    this.pulse(this.updateEvent, {
      ...this.disposition,
      aim: {
        ...aim,
        body: {
          ...aim.body,
          ...partial,
        },
      },
    });
  }
}

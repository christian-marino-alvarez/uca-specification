import { Uca } from '@uca/core/uca';
import { Llm } from '@uca/capability-llm';
import { Zod } from '@uca/capability-zod';
import {
  DispositionSignal,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import {
  SignalType as LlmSignalType,
  type InferResult,
  type Failure as InferenceFailure,
} from '@uca/capability-llm/types';
import {
  __ID__,
  DEFAULT_IMAGINATION,
  INFERENCE_LIMITS,
  INVALID_PROBABILITIES,
  PROBABILITY_TOLERANCE,
} from './constants.js';
import {
  choiceResultSchema,
  errorSchema,
  requestSchema,
  resultSchema,
  type Body,
  type DecisionPayload,
  type Question,
  type Request,
} from './schema.js';
import {
  DataType,
  SignalType,
} from './types.js';

export class Decision extends Uca<Body> {
  public static override purpose =
    'Realizar selección probabilística rápida y ligera de candidatos y decisiones binarias sin imaginación';

  public static override disposition: Disposition<Body> = {
    aim: {
      description: Decision.purpose,
      body: {
        imagination: DEFAULT_IMAGINATION,
      },
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.DECIDE,
      ...Decision.reactToLlm(),
    ],
    inputs: [
      {
        signal: SignalType.DECIDE,
        type: DataType.REQUEST,
        schema: requestSchema,
        description: 'Evaluar probabilísticamente una pregunta de elección y seleccionar un candidato',
      },
    ],
    outputs: [
      {
        signal: SignalType.DECIDED,
        type: DataType.RESULT,
        schema: resultSchema,
        description: 'Decisión probabilística consolidada junto con sus pesos y confianza',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la evaluación o validación de la decisión',
      },
    ],
  };

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

  public override denervate(): void {
    const {
      registry,
    } = this;
    registry.forEach((capability) => {
      capability.denervate();
    });
    super.denervate();
  }

  protected override catalog(): Cooky {
    const {
      id,
    } = this;
    return [
      [
        Llm,
        {
          ...Llm.disposition,
          aim: {
            description: Llm.AIM,
            body: {
              id: `${id}:llm`,
            },
          },
        },
      ],
    ];
  }

  protected override react(signal: Signal): void {
    const {
      property,
    } = signal;
    switch (property) {
      case DispositionSignal.UPDATED:
        this.handleUpdated();
        break;
      case SignalType.DECIDE:
        this.handleDecide(signal);
        break;
      case LlmSignalType.INFERRED:
        this.handleLlmInferred(signal);
        break;
      case LlmSignalType.ERROR:
        this.handleLlmError(signal);
        break;
    }
  }

  private handleUpdated(): void {
    const {
      source = this.id,
    } = this.body ?? {};
    switch (source) {
      case this.id:
        break;
      case `${this.id}:llm`:
        this.handleLlmUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleDecide(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      context,
      question,
    } = this.extractPayload<Request>(value) ?? {};
    this.updateDispositionBody({
      question,
      replyTo: source,
      requestContext: context,
      result: undefined,
      source,
    });
  }

  private handleSelfUpdated(): void {
    const {
      question,
    } = this.body ?? {};
    if (question) {
      const payload = this.createInferPayload(question);
      console.log('[Decision] Prompt payload:', payload);
      this.pulse(LlmSignalType.INFER, payload);
    }
  }

  private handleLlmInferred(signal: Signal): void {
    const {
      source,
    } = signal;
    try {
      const result = this.extractDecisionResult(signal);
      this.updateDispositionBody({
        result,
        source,
      });
    } catch (error) {
      this.emitError(error);
    }
  }

  private handleLlmUpdated(): void {
    const {
      replyTo,
      requestContext,
      result,
    } = this.body ?? {};
    if (result) {
      this.pulse(SignalType.DECIDED, {
        context: requestContext,
        result,
      }, replyTo);
    }
  }

  private handleLlmError(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      error,
    } = this.extractPayload<InferenceFailure>(value) ?? {};
    this.emitError(error);
  }

  private createInferPayload(question: Question): Record<string, unknown> {
    const {
      prompt,
    } = question;
    const {
      imagination = DEFAULT_IMAGINATION,
      limit,
      requestContext = {},
    } = this.body ?? {};
    const outputSchema = Zod.toJsonSchema(choiceResultSchema);
    return {
      id: this.id,
      purpose: Decision.purpose,
      intention: prompt,
      limits: [
        ...INFERENCE_LIMITS,
      ],
      imagination,
      ...(limit !== undefined && {
        limit,
      }),
      outputSchema,
      context: {
        ...requestContext,
        question,
      },
    };
  }

  private extractDecisionResult(signal: Signal): DecisionPayload {
    const {
      value,
    } = signal;
    const {
      data,
      response,
    } = this.extractPayload<InferResult>(value) ?? {};
    const {
      question,
    } = this.body ?? {};
    if (!question) {
      throw new Error(INVALID_PROBABILITIES);
    }
    const {
      id: questionId,
      options,
    } = question;
    const raw = (data ?? JSON.parse(response ?? '')) as Record<string, unknown>;
    const {
      type: _type,
      ...answer
    } = (raw[questionId] ?? raw) as Record<string, unknown>;
    const {
      choice,
      confidence,
      probabilities,
    } = choiceResultSchema.parse(answer);
    const sum = Object.values(probabilities).reduce((total, value) => total + value, 0);
    if (!options.some(({ id }) => id === choice) || Math.abs(sum - 1) > PROBABILITY_TOLERANCE) {
      throw new Error(INVALID_PROBABILITIES);
    }
    return {
      choice,
      confidence,
      probabilities,
      questionId,
    };
  }

  private emitError(error: unknown): void {
    const {
      replyTo,
    } = this.body ?? {};
    this.pulse(SignalType.ERROR, {
      error: error instanceof Error ? error.message : String(error),
    }, replyTo);
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
          ...this.body,
          ...partial,
        },
      },
    });
  }
}

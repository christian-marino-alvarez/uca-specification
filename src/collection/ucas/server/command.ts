import { SignalType as JevSignalType } from '@uca/capability-jev/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
import { SignalType as OpenaiSignalType } from '@uca/capability-openai/types';
import {
  SignalType as LlmSignalType,
  type InferPayload,
  type ProviderType,
} from '@uca/llm/types';
import {
  DEFAULT_PROVIDER,
  DEFAULT_JEV_MODEL,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL,
  SYSTEM_INSTRUCTION,
  serializeRequest,
} from '@uca/llm/constants';
import { JEV_CONTEXT_INSTRUCTION } from './constants.js';
import type {
  Command,
  EvaluationContext,
  InferenceRequest,
  Question,
} from './types.js';

export function normalizeInference(payload: InferenceRequest): InferPayload {
  const {
    sessionId = crypto.randomUUID(),
    ...request
  } = payload;
  return {
    ...request,
    sessionId,
  };
}

function resolveGeminiModel(payload: InferPayload): string {
  const {
    model,
  } = payload;
  return model ?? DEFAULT_GEMINI_MODEL;
}

export function resolveProvider(payload: InferPayload, stream: boolean): ProviderType {
  const {
    context,
    imagination,
    provider,
  } = payload;
  const evaluationContext = (context ?? {}) as EvaluationContext & { question?: Question };
  const hasEvaluationQuestion = Boolean(evaluationContext.question ?? evaluationContext.questions);
  const useJev = !stream && (imagination === 0 || hasEvaluationQuestion);
  return provider ?? (useJev ? 'jev' : DEFAULT_PROVIDER);
}

export function createCommand(payload: InferPayload, stream = false): Command {
  const provider = resolveProvider(payload, stream);
  const {
    outputSchema,
    model,
    limit,
    imagination,
    thinkingBudget,
    thinkingLevel,
    sessionId,
    streamId,
    contextSchema,
    context,
    purpose,
    goal,
  } = payload;
  const prompt = JSON.stringify({
    context: context ?? (contextSchema as { const?: unknown })?.const,
    purpose,
    goal,
  });
  const value = {
    prompt,
    schema: outputSchema,
    systemInstruction: SYSTEM_INSTRUCTION,
    temperature: imagination,
    maxOutputTokens: limit,
    thinkingBudget,
    thinkingLevel,
    sessionId,
    streamId,
  };
  let command: Command;
  switch (provider) {
    case 'jev':
      command = stream
        ? {
          property: LlmSignalType.ERROR,
          value: {
            error: 'Jev no soporta streaming',
            sessionId,
          },
        }
        : {
          property: JevSignalType.INFER,
          value: createEvaluation(payload),
        };
      break;
    case 'gemini':
      command = {
        property: stream ? GeminiSignalType.STREAM : GeminiSignalType.GENERATE,
        value: {
          ...value,
          model: resolveGeminiModel(payload),
        },
      };
      break;
    case 'openai':
      command = {
        property: stream ? OpenaiSignalType.STREAM : OpenaiSignalType.GENERATE,
        value: {
          ...value,
          model: model ?? DEFAULT_OPENAI_MODEL,
        },
      };
      break;
  }
  return command;
}

function normalizeCriteria(
  options: Question['options'],
  criteria?: Record<string, string>,
): Record<string, string> | undefined {
  const mappedOptions = Array.isArray(options)
    ? Object.fromEntries(options.map(({ id, criteria: itemCriteria, description, label }) => [
      id,
      itemCriteria ?? description ?? label ?? id,
    ]))
    : (options as Record<string, string> | undefined);
  return criteria ?? mappedOptions;
}

function buildQuestionCriteria(
  questions: Record<string, unknown>,
  contract: string,
): Record<string, unknown> {
  return Object.fromEntries(Object.keys(questions).map((key) => {
    const item = questions[key];
    const {
      instructions,
      prompt,
      options,
      criteria,
      id: _id,
      ...definition
    } = typeof item === 'string'
      ? { instructions: item } as Question
      : item as Question;
    const resolvedCriteria = normalizeCriteria(options, criteria);
    return [
      key,
      {
        ...definition,
        ...(resolvedCriteria && {
          criteria: resolvedCriteria,
        }),
        instructions: `${String(instructions ?? prompt ?? key)}\n${JEV_CONTEXT_INSTRUCTION}\n${contract}`,
      },
    ];
  }));
}

export function createEvaluation(payload: InferPayload): Record<string, unknown> {
  const {
    contextSchema,
    context,
    goal,
    model = DEFAULT_JEV_MODEL,
    limit,
    sessionId,
  } = payload;
  const facts = (context ?? (contextSchema as { const?: unknown })?.const ?? {}) as Record<string, unknown>;
  const {
    state,
    questions,
    question,
    ...restFacts
  } = facts as EvaluationContext & { question?: Question };
  const resolved = questions ?? (question ? { [question.id ?? 'question']: question } : { assessment: goal });
  const criteria = buildQuestionCriteria(resolved, serializeRequest(payload));
  const evaluation = {
    state: state ?? restFacts,
    questions: criteria,
    model,
    limit,
    sessionId,
  };
  console.log('[Server:Command] Jev evaluation prompt built:', JSON.stringify(evaluation, null, 2));
  return evaluation;
}

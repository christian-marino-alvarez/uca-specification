import { SignalType as JevSignalType } from '@uca/capability-jev/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
import { SignalType as OpenaiSignalType } from '@uca/capability-openai/types';
import { SignalType as LlmSignalType, type InferPayload } from '@uca/llm/types';
import { DEFAULT_PROVIDER, DEFAULT_JEV_MODEL, DEFAULT_GEMINI_MODEL, DEFAULT_OPENAI_MODEL, SYSTEM_INSTRUCTION, serializeRequest } from '@uca/llm/constants';
import { JEV_CONTEXT_INSTRUCTION } from './constants.js';
import type { Command, EvaluationContext, Question } from './types.js';

export function createCommand(payload: InferPayload, stream = false): Command {
    const {
        provider = DEFAULT_PROVIDER,
        outputSchema,
        model,
        limit,
        imagination,
        thinkingBudget,
        thinkingLevel,
        correlationId,
        streamId,
        contextSchema,
        purpose,
        goal,
        limits,
    } = payload;
    const prompt = JSON.stringify({
        contextSchema,
        purpose,
        goal,
        limits,
    });
    const value = {
        prompt,
        schema: outputSchema,
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: imagination,
        maxOutputTokens: limit,
        thinkingBudget,
        thinkingLevel,
        correlationId,
        streamId,
    };
    switch (provider) {
        case 'jev': return stream ? { property: LlmSignalType.ERROR, value: { error: 'Jev does not support streaming', correlationId } } : { property: JevSignalType.INFER, value: createEvaluation(payload) };
        case 'gemini': return { property: stream ? GeminiSignalType.STREAM : GeminiSignalType.GENERATE, value: { ...value, model: model ?? DEFAULT_GEMINI_MODEL } };
        case 'openai': return { property: stream ? OpenaiSignalType.STREAM : OpenaiSignalType.GENERATE, value: { ...value, model: model ?? DEFAULT_OPENAI_MODEL } };
    }
}

export function createEvaluation(payload: InferPayload): Record<string, unknown> {
    const { contextSchema, goal, model = DEFAULT_JEV_MODEL, limit, correlationId } = payload;
    const { const: facts } = contextSchema;
    const { state = facts, questions = { assessment: goal } } = (facts ?? {}) as EvaluationContext;
    const contract = serializeRequest(payload);
    const criteria = Object.fromEntries(Object.keys(questions).map((key) => {
        const question = questions[key];
        const { instructions = key, ...definition } = typeof question === 'string' ? { instructions: question } : question as Question;
        return [key, { ...definition, instructions: `${instructions}\n${JEV_CONTEXT_INSTRUCTION}\n${contract}` }];
    }));
    return { state, questions: criteria, model, limit, correlationId };
}

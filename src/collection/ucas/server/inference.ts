import { SignalType as JevSignalType } from '@uca/capability-jev/types';
import { SignalType as GeminiSignalType } from '@uca/capability-gemini/types';
import { SignalType as OpenaiSignalType } from '@uca/capability-openai/types';
import { SignalType as LlmSignalType, type InferPayload } from '@uca/llm/types';
import {
    DEFAULT_PROVIDER,
    DEFAULT_JEV_MODEL,
    DEFAULT_GEMINI_MODEL,
    DEFAULT_GEMINI_FLASH_MODEL,
    DEFAULT_GEMINI_FLASH_LITE_MODEL,
    DEFAULT_OPENAI_MODEL,
    SYSTEM_INSTRUCTION,
    serializeRequest,
} from '@uca/llm/constants';
import { JEV_CONTEXT_INSTRUCTION } from './constants.js';
import type { Command, EvaluationContext, Question } from './types.js';

function resolveGeminiModel(payload: InferPayload): string {
    const { model } = payload;
    if (model) {
        return model;
    }
    return DEFAULT_GEMINI_MODEL;
}

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
        case 'gemini': return { property: stream ? GeminiSignalType.STREAM : GeminiSignalType.GENERATE, value: { ...value, model: resolveGeminiModel(payload) } };
        case 'openai': return { property: stream ? OpenaiSignalType.STREAM : OpenaiSignalType.GENERATE, value: { ...value, model: model ?? DEFAULT_OPENAI_MODEL } };
    }
}

function buildQuestionCriteria(questions: Record<string, unknown>, contract: string): Record<string, unknown> {
    return Object.fromEntries(Object.keys(questions).map((key) => {
        const item = questions[key];
        const { instructions = key, ...definition } = typeof item === 'string' ? { instructions: item } : item as Question;
        return [key, { ...definition, instructions: `${instructions}\n${JEV_CONTEXT_INSTRUCTION}\n${contract}` }];
    }));
}

export function createEvaluation(payload: InferPayload): Record<string, unknown> {
    const { contextSchema, goal, model = DEFAULT_JEV_MODEL, limit, correlationId } = payload;
    const { const: facts } = (contextSchema ?? {}) as Record<string, unknown>;
    const { state = facts, questions, question } = (facts ?? {}) as EvaluationContext & { question?: Question & { id?: string } };
    const resolved = questions ?? (question ? { [question.id ?? 'question']: question } : { assessment: goal });
    const criteria = buildQuestionCriteria(resolved, serializeRequest(payload));
    return { state, questions: criteria, model, limit, correlationId };
}

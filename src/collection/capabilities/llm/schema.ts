import { z } from 'zod';
export const thinkingLevelSchema = z.enum(['minimal', 'low', 'medium', 'high']);
export type ThinkingLevel = z.infer<typeof thinkingLevelSchema>;
export const providerSchema = z.enum(['openai', 'gemini', 'jev']);
export const jsonSchema = z.record(z.string(), z.unknown());
export const contractSchema = z.object({
    outputSchema: jsonSchema.optional(),
    contextSchema: jsonSchema.optional(),
    context: z.record(z.string(), z.unknown()).optional(),
    purpose: z.string().min(1),
    goal: z.string().optional(),
    intention: z.string().optional(),
    limits: jsonSchema.optional().default({}),
});
export const configurationSchema = z.object({
    provider: providerSchema.optional(),
    model: z.string().optional(),
    imagination: z.number().optional(),
    limit: z.number().optional(),
    thinkingBudget: z.number().optional(),
    thinkingLevel: thinkingLevelSchema.optional(),
});
export const inferenceSchema = contractSchema.extend({
    metadata: z.unknown().optional(),
    ...configurationSchema.shape,
    id: z.string().optional(),
    correlationId: z.string().optional(),
    streamId: z.string().optional(),
});
export type Contract = z.infer<typeof contractSchema>;
export type InferPayload = z.infer<typeof inferenceSchema>;
export type ProviderType = z.infer<typeof providerSchema>;
export const bodySchema = z.object({
    id: z.string().optional(),
    endpoint: z.string().optional(), streamEndpoint: z.string().optional(),
    ...configurationSchema.shape,
});
export type Body = z.infer<typeof bodySchema>;

import { z } from 'zod';

export const modelSchema = z.enum(['local', 'nube', 'cloud']);

export const providerSchema = z.enum(['gemini-nano', 'gemini', 'openai']);

export const maxTokensMultiplierSchema = z.union([
    z.literal(1024),
    z.literal(2048),
    z.literal(3072),
    z.number(),
]);

export const bodySchema = z.object({
    model: modelSchema.optional(),
    provider: providerSchema.optional(),
    imagination: z.number().min(0).max(10).optional(),
    schema: z.record(z.string(), z.unknown()).optional(),
    maxTokens: maxTokensMultiplierSchema.optional(),
    endpoint: z.string().optional(),
    systemPrompt: z.string().optional(),
});

export const inferPayloadSchema = z.object({
    correlationId: z.string().optional(),
    streamId: z.string().optional(),
    request: z.unknown(),
    model: modelSchema.optional(),
    provider: providerSchema.optional(),
    imagination: z.number().min(0).max(10).optional(),
    schema: z.record(z.string(), z.unknown()).optional(),
    maxTokens: maxTokensMultiplierSchema.optional(),
    endpoint: z.string().optional(),
});

export type Body = z.infer<typeof bodySchema>;
export type Model = z.infer<typeof modelSchema>;
export type Provider = z.infer<typeof providerSchema>;
export type InferPayload = z.infer<typeof inferPayloadSchema>;

import { z } from 'zod';
import { scaffoldSchema } from '@uca/scaffold/schema';

export const bodySchema = z.object({
    request: z.string().optional(),
    loading: z.boolean().optional(),
    progress: z.number().min(0).max(100).optional(),
    scaffold: scaffoldSchema.optional(),
});

export const createPayloadSchema = z.object({
    request: z.string().describe('Web application goal or prompt to scaffold'),
    model: z.enum(['local', 'nube']).optional().default('local'),
    provider: z.string().optional(),
    imagination: z.number().min(0).max(10).optional().default(4),
    correlationId: z.string().optional(),
    streamId: z.string().optional(),
});

export const streamPayloadSchema = createPayloadSchema;

export type Body = z.infer<typeof bodySchema>;
export type CreatePayload = z.infer<typeof createPayloadSchema>;
export type StreamPayload = z.infer<typeof streamPayloadSchema>;

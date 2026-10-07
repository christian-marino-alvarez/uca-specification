import { z } from 'zod';
import { scaffoldSchema } from '@uca/scaffold/schema';

export const createPayloadSchema = z.object({
    request: z.string().optional().describe('Header goal or prompt request'),
    context: z.string().optional().describe('Application context or parent purpose'),
    parentTo: z.string().optional().describe('Parent UCA identifier'),
    model: z.enum(['local', 'nube']).optional().default('local'),
    provider: z.string().optional(),
    imagination: z.number().min(0).max(10).optional().default(1),
    correlationId: z.string().optional(),
    streamId: z.string().optional(),
    forceRefresh: z.boolean().optional(),
});

export const streamPayloadSchema = createPayloadSchema;

export const bodySchema = z.object({
    context: z.string().optional(),
    parentTo: z.string().optional(),
    request: z.string().optional(),
    scaffold: scaffoldSchema.optional(),
});

export type CreatePayload = z.infer<typeof createPayloadSchema>;
export type StreamPayload = z.infer<typeof streamPayloadSchema>;
export type Body = z.infer<typeof bodySchema>;

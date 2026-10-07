import { z } from 'zod';

export const nodeSchema = z.object({
    purpose: z.string().optional().default('Visual component').describe('Ontological purpose of the UCA in the web scaffolding'),
    parentTo: z.string().nullable().optional().default(null).describe('Parent UCA identifier pointer (string or null)'),
});

export const itemSchema = z.record(z.string(), nodeSchema);

export const scaffoldSchema = z.record(z.string(), nodeSchema);

export const createPayloadSchema = z.object({
    request: z.string().describe('Web application goal or prompt request'),
    context: z.string().optional().describe('Parent UCA context or purpose'),
    parentTo: z.string().optional().describe('Parent UCA identifier acting as the root of this disposition'),
    model: z.enum(['local', 'nube']).optional().default('local'),
    provider: z.string().optional(),
    imagination: z.number().min(0).max(10).optional().default(1),
    correlationId: z.string().optional(),
    streamId: z.string().optional(),
});

export const streamPayloadSchema = createPayloadSchema;

export const bodySchema = z.object({
    context: z.string().optional(),
    parentTo: z.string().optional(),
    request: z.string().optional(),
    scaffold: scaffoldSchema.optional(),
});

export type Node = z.infer<typeof nodeSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Scaffold = z.infer<typeof scaffoldSchema>;
export type CreatePayload = z.infer<typeof createPayloadSchema>;
export type StreamPayload = z.infer<typeof streamPayloadSchema>;
export type Body = z.infer<typeof bodySchema>;

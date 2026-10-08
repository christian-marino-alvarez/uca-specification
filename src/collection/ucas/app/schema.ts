import { z } from 'zod';

export const bodySchema = z.object({
    id: z.string().optional(),
    context: z.string().optional(),
    title: z.string().optional(),
});

export type BodySchema = z.infer<typeof bodySchema>;

export const emittedSignals = ['started', 'stopped'] as const;

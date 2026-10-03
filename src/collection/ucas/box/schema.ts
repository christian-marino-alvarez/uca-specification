import { z } from 'zod';

export const bodySchema = z.object({
    id: z.string().optional(),
    text: z.string().optional(),
    role: z.string().optional(),
    hidden: z.boolean().optional(),
    className: z.string().optional(),
});

export type BodySchema = z.infer<typeof bodySchema>;

export const emittedSignals = ['updated'] as const;

import { z } from 'zod';

export const bodySchema = z.object({
    id: z.string().optional(),
    items: z.array(z.string()).optional(),
    ordered: z.boolean().optional(),
    fontSize: z.union([z.number(), z.string()]).optional(),
    spacing: z.union([z.number(), z.string()]).optional(),
    alignment: z.enum(['left', 'right']).optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
    text: z.string().optional(),
    hidden: z.boolean().optional(),
    className: z.string().optional(),
});

export type BodySchema = z.infer<typeof bodySchema>;

export const emittedSignals = ['updated'] as const;

import { z } from 'zod';

export const bodySchema = z.object({
    id: z.string().optional(),
    label: z.string().optional(),
    title: z.string().optional(),
    disabled: z.boolean().optional(),
    hidden: z.boolean().optional(),
    className: z.string().optional(),
});

export type BodySchema = z.infer<typeof bodySchema>;

export const emittedSignals = ['triggered'] as const;

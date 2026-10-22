import { z } from 'zod';

export const bodySchema = z.object({
    id: z.string().optional(),
});

export type Body = z.infer<typeof bodySchema>;

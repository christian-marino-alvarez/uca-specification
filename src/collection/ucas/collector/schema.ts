import { z } from 'zod';

export const bodySchema = z.object({
    name: z.string().optional().describe('Collected data set name'),
    title: z.string().optional().describe('Visible title of the collection'),
    disabled: z.boolean().optional(),
});

export type BodySchema = z.infer<typeof bodySchema>;

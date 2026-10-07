import { z } from 'zod';

export const bodySchema = z.object({
    source: z.string().optional().describe('Destination reference to access'),
    label: z.string().optional().describe('Visible interactive label'),
    title: z.string().optional().describe('Identifying title'),
});

export type BodySchema = z.infer<typeof bodySchema>;

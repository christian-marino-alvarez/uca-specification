import { z } from 'zod';
import { ucaItemSchema } from './uca-item.js';

export const responseSchema = z.object({
    ucas: z.array(ucaItemSchema).describe('Composed list of UCAs forming the reactive view hierarchy'),
    answer: z.string().optional().describe('Concise description of the designed layout, structure, and reactive wiring'),
});

export type ResponseSchema = z.infer<typeof responseSchema>;

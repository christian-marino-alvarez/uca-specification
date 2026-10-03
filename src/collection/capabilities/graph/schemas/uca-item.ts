import { z } from 'zod';
import { dispositionSchema } from './disposition.js';

export const ucaItemSchema = z.object({
    id: z.string().describe('Unique UCA identifier with prefix (e.g. "box:hero", "action:submit", "picture:logo")'),
    disposition: dispositionSchema,
});

export type UcaItem = z.infer<typeof ucaItemSchema>;

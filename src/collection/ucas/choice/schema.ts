import { z } from 'zod';
import { identitySchema } from '../schema.js';

export const itemSchema = z.object({
    value: z.string(),
    label: z.string(),
    selected: z.boolean().optional(),
    disabled: z.boolean().optional(),
});

export const bodySchema = identitySchema.extend({
    name: z.string().optional(),
    action: z.string().optional(),
    label: z.string().optional(),
    placeholder: z.string().optional(),
    value: z.string().optional(),
    items: z.array(itemSchema).optional(),
    disabled: z.boolean().optional(),
    required: z.boolean().optional(),
});

export type Body = z.infer<typeof bodySchema>;

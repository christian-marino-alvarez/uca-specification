import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const optionItemSchema = z.object({
    value: z.string(),
    label: z.string(),
    checked: z.boolean().optional(),
    disabled: z.boolean().optional(),
});

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    name: z.string().optional(),
    legend: z.string().optional(),
    value: z.string().optional(),
    action: z.string().optional(),
    items: z.array(optionItemSchema).optional(),
    content: z.string().optional(),
    disabled: z.boolean().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type OptionItem = z.infer<typeof optionItemSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

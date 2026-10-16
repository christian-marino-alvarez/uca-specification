import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const dropdownItemSchema = z.object({
    value: z.string(),
    label: z.string(),
    selected: z.boolean().optional(),
    disabled: z.boolean().optional(),
});

export const qualitiesSchema = visualQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    name: z.string().optional(),
    placeholder: z.string().optional(),
    value: z.string().optional(),
    action: z.string().optional(),
    items: z.array(dropdownItemSchema).optional(),
    content: z.string().optional(),
    disabled: z.boolean().optional(),
    required: z.boolean().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type DropdownItem = z.infer<typeof dropdownItemSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;

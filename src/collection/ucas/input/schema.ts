import { z } from 'zod';

import { qualitiesSchema as controlQualitiesSchema } from '@uca/capability-css/schema';
export const qualitiesSchema = controlQualitiesSchema.optional();

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    type: z.enum(['text', 'email', 'password', 'search', 'tel', 'url', 'number']).optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    placeholder: z.string().optional(),
    label: z.string().optional().describe('Material Design 3 field label'),
    supportingText: z.string().optional().describe('Material Design 3 supporting text below input'),
    leadingIcon: z.string().optional().describe('Material Design 3 leading icon symbol'),
    trailingIcon: z.string().optional().describe('Material Design 3 trailing icon symbol'),
    variant: z.enum(['filled', 'outlined']).optional().describe('Material Design 3 text field variant'),
    error: z.boolean().optional().describe('Field error validation state'),
    action: z.string().optional(),
    autocomplete: z.string().optional(),
    disabled: z.boolean().optional(),
    readonly: z.boolean().optional(),
    required: z.boolean().optional(),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export const renderPayloadSchema = bodySchema.extend({
    type: z.enum(['text', 'email', 'password', 'search', 'tel', 'url', 'number']).optional().default('text'),
}).refine(
    (data) => Boolean((data.name && data.name.trim().length > 0) || (data.placeholder && data.placeholder.trim().length > 0) || data.type),
    {
        message: 'Input requires a name, placeholder, or type',
    },
);

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;

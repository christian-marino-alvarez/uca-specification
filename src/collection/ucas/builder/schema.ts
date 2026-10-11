import { z } from 'zod';
import { qualitiesSchema } from '@uca/box/schema';

export const dimensionsSchema = z.object({
    width: z.string().min(1),
    height: z.string().min(1),
}).optional();

export const buildPayloadSchema = z.object({
    id: z.string().optional(),
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    purpose: z.string().optional(),
    context: z.string().optional(),
    dimensions: dimensionsSchema,
    qualities: qualitiesSchema.optional(),
    content: z.string().optional(),
});

export const bodySchema = buildPayloadSchema;

export type Dimensions = z.infer<typeof dimensionsSchema>;
export type BuildPayload = z.infer<typeof buildPayloadSchema>;
export type Body = z.infer<typeof bodySchema>;

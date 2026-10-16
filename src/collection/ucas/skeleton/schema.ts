import { z } from 'zod';
import {
    qualitiesSchema,
} from '@uca/capability-css/schema';

export const dimensionsSchema = qualitiesSchema.pick({
    width: true,
    height: true,
    maxWidth: true,
    minWidth: true,
    minHeight: true,
});

export const renderSchema = z.object({
    areaId: z.string().min(1),
    parentTo: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    dimensions: dimensionsSchema.optional(),
    areaQualities: qualitiesSchema.optional(),
    context: z.unknown().optional(),
}).strict();

export const removeSchema = z.object({
    areaId: z.string().min(1),
    areaQualities: qualitiesSchema.optional(),
}).strict();

export const discardSchema = z.object({
    areaId: z.string().min(1),
}).strict();

export const resultSchema = z.object({
    areaId: z.string().min(1),
    elementId: z.string().min(1),
    context: z.unknown().optional(),
}).strict();

export const errorSchema = z.object({
    areaId: z.string().min(1).nullable(),
    error: z.string(),
    context: z.unknown().optional(),
}).strict();

export const validationContextSchema = z.object({
    operation: z.enum([
        'skeleton.render',
        'skeleton.remove',
        'skeleton.discard',
    ]),
    request: z.unknown(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    context: z.string().optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type DiscardPayload = z.infer<typeof discardSchema>;
export type ErrorResult = z.infer<typeof errorSchema>;
export type RemovePayload = z.infer<typeof removeSchema>;
export type RenderPayload = z.infer<typeof renderSchema>;
export type Result = z.infer<typeof resultSchema>;
export type ValidationContext = z.infer<typeof validationContextSchema>;

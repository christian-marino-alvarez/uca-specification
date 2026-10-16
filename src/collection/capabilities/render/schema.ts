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

export const spatialQualitiesSchema = qualitiesSchema.pick({
    spacing: true,
    spacingInline: true,
    spacingBlock: true,
    marginInline: true,
    gap: true,
    direction: true,
    alignment: true,
    distribution: true,
    wrap: true,
});

export const designSchema = qualitiesSchema.pick({
    surface: true,
    tone: true,
    textColor: true,
    typeface: true,
    textSize: true,
    fontWeight: true,
    lineHeight: true,
    textAlign: true,
    elevation: true,
    radius: true,
    border: true,
});

export const requestSchema = z.object({
    correlationId: z.string().min(1),
    targetAreaId: z.string().min(1),
    areaId: z.string().min(1),
    parentTo: z.string().min(1),
    name: z.string().min(1).describe('Name of the UCA responsible for the area'),
    dimensions: dimensionsSchema,
    qualities: spatialQualitiesSchema,
    design: designSchema,
    context: z.unknown(),
}).strict();

export const resultSchema = requestSchema;

export const streamRequestSchema = z.object({
    correlationId: z.string().min(1),
    targetAreaId: z.string().min(1),
    stream: z.unknown(),
    context: z.unknown(),
}).strict();

export const areaSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    purpose: z.string().min(1),
    order: z.number().int().nonnegative(),
    dimensions: dimensionsSchema,
    qualities: spatialQualitiesSchema,
    design: designSchema,
}).strict();

export const streamEntrySchema = z.record(
    z.string().min(1),
    areaSchema,
);

export const errorSchema = z.object({
    correlationId: z.string().min(1).nullable(),
    areaId: z.string().min(1).nullable(),
    error: z.string(),
    context: z.unknown(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    context: z.string().optional(),
    skeleton: z.string().min(1).optional(),
}).strict();

export type Request = z.infer<typeof requestSchema>;
export type Result = z.infer<typeof resultSchema>;
export type Area = z.infer<typeof areaSchema>;
export type StreamRequest = Omit<z.infer<typeof streamRequestSchema>, 'stream'> & {
    readonly stream: ReadableStream<Record<string, unknown>>;
};
export type Failure = z.infer<typeof errorSchema>;
export type Body = z.infer<typeof bodySchema>;

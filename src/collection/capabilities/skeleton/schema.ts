import { z } from 'zod';

export const showPayloadSchema = z.object({
    elementId: z.string().min(1),
    containerElement: z.string().optional(),
    context: z.unknown().optional(),
}).strict();

export const removePayloadSchema = z.object({
    elementId: z.string().min(1),
    containerElement: z.string().optional(),
    context: z.unknown().optional(),
}).strict();

export const shownResultSchema = z.object({
    elementId: z.string().min(1),
    context: z.unknown().optional(),
}).strict();

export const removedResultSchema = z.object({
    elementId: z.string().min(1),
    context: z.unknown().optional(),
}).strict();

export const errorSchema = z.object({
    elementId: z.string().min(1).nullable(),
    error: z.string(),
    context: z.unknown().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type ShowPayload = z.infer<typeof showPayloadSchema>;
export type RemovePayload = z.infer<typeof removePayloadSchema>;
export type ShownResult = z.infer<typeof shownResultSchema>;
export type RemovedResult = z.infer<typeof removedResultSchema>;
export type ErrorResult = z.infer<typeof errorSchema>;

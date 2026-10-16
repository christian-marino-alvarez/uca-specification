import { z } from 'zod';
import { Kind } from './types.js';

export const entrySchema = z.object({
    name: z.string().min(1),
    kind: z.enum(Kind),
    purpose: z.string().min(1),
    capabilities: z.array(z.string().min(1)),
}).strict();

export const requestSchema = z.object({
    correlationId: z.string().min(1),
    kinds: z.array(z.enum(Kind)).min(1),
    context: z.unknown().optional(),
}).strict();

export const resultSchema = z.object({
    correlationId: z.string().min(1),
    entries: z.array(entrySchema),
    context: z.unknown().optional(),
}).strict();

export const errorSchema = z.object({
    correlationId: z.string().min(1).nullable(),
    error: z.string(),
    context: z.unknown().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    entries: z.array(entrySchema).optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type Entry = z.infer<typeof entrySchema>;
export type Request = z.infer<typeof requestSchema>;
export type Result = z.infer<typeof resultSchema>;
export type Failure = z.infer<typeof errorSchema>;

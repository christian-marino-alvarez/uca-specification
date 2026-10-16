import { z } from 'zod';
import { Scope, type LogFilter, type LogCallback } from './types.js';
export const bodySchema = z.object({
    scope: z.enum(Scope).optional(), prefix: z.string().optional(), filter: z.custom<LogFilter>().optional(), onLog: z.custom<LogCallback>().optional(),
});
export type Body = z.infer<typeof bodySchema>;

export const contextSchema = z.object({
    areaId: z.string().optional(),
    parentTo: z.string().optional(),
    compositionId: z.string().optional(),
    depth: z.number().optional(),
    correlationId: z.string().optional(),
    selectedId: z.string().optional(),
    aim: z.string().optional(),
});
export type Context = z.infer<typeof contextSchema>;

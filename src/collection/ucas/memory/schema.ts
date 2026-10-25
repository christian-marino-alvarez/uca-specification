import { z } from 'zod';
import {
    CacheOperation,
    StorageStage,
    ValidationStage,
} from './types.js';

export const bodySchema = z.object({
    id: z.string().optional(),
    namespace: z.string().default('uca'),
    maxEntries: z.number().int().positive().optional(),
    maxAge: z.number().int().positive().optional(),
});

export const recallSchema = z.object({
    descriptor: z.record(z.string(), z.unknown()),
    sessionId: z.string().min(1),
    context: z.unknown().optional(),
}).strict();

export const rememberSchema = recallSchema.extend({
    value: z.unknown(),
}).strict();

export const storedEntrySchema = z.object({
    key: z.string().min(1),
    identity: z.string(),
    value: z.unknown(),
    accessedAt: z.number(),
}).strict();

export const cacheSchema = z.array(storedEntrySchema);

export const cacheResultSchema = z.object({
    sessionId: z.string(),
    value: z.unknown(),
    context: z.unknown().optional(),
}).strict();

export const cacheContextSchema = z.object({
    operation: z.lazy(() => z.enum(CacheOperation)),
    request: recallSchema.extend({
        value: z.unknown().optional(),
    }),
    recipient: z.string(),
    key: z.string().optional(),
    identity: z.string().optional(),
    result: z.unknown().optional(),
    stage: z.lazy(() => z.enum(StorageStage)).optional(),
});

export const cacheValidationSchema = z.object({
    stage: z.lazy(() => z.enum(ValidationStage)),
    cache: cacheContextSchema,
});

export type Body = z.infer<typeof bodySchema>;
export type Recall = z.infer<typeof recallSchema>;
export type Remember = z.infer<typeof rememberSchema>;
export type StoredEntry = z.infer<typeof storedEntrySchema>;
export type CacheResult = z.infer<typeof cacheResultSchema>;
export type CacheContext = z.infer<typeof cacheContextSchema>;
export type CacheValidation = z.infer<typeof cacheValidationSchema>;

import { z } from 'zod';
import { StorageType } from './types.js';

export const storageTypeSchema = z.enum([
    StorageType.LOCAL_STORAGE,
    StorageType.SESSION_STORAGE,
]);

export const memoryEntrySchema = z.object({
    key: z.string().min(1),
    value: z.unknown(),
}).strict();

export const memoryQuerySchema = z.object({
    keys: z.array(z.string().min(1)),
}).strict();

export const memoryPayloadSchema = z.object({
    entries: z.array(memoryEntrySchema),
}).strict();

export const memoryResultSchema = z.unknown();

export const bodySchema = z.object({
    id: z.string().optional(),
    storage: storageTypeSchema.default(StorageType.SESSION_STORAGE),
    prefix: z.string().default(''),
}).strict();

export type MemoryEntry = z.infer<typeof memoryEntrySchema>;
export type MemoryQuery = z.infer<typeof memoryQuerySchema>;
export type MemoryPayload = z.infer<typeof memoryPayloadSchema>;
export type MemoryResult = z.infer<typeof memoryResultSchema>;
export type Body = z.infer<typeof bodySchema>;

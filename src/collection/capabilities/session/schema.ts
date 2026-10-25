import { z } from 'zod';
import { StorageType } from './types.js';

export const storageTypeSchema = z.enum([
    StorageType.SESSION_STORAGE,
    StorageType.LOCAL_STORAGE,
    StorageType.INDEXED_DB,
    StorageType.DB,
]);

export const sessionSchema = z.object({
    id: z.string().min(1),
    createdAt: z.number(),
    deletedAt: z.number().nullable().optional(),
    delectedAt: z.number().nullable().optional(),
    storage: storageTypeSchema.default(StorageType.SESSION_STORAGE),
}).passthrough();

export const sessionPayloadSchema = z.object({
    sessionId: z.string().optional(),
    timestamp: z.number(),
    value: sessionSchema.nullable().optional(),
}).strict();

export const sessionRequestSchema = z.object({
    sessionId: z.string().optional(),
    timestamp: z.number().optional(),
    storage: storageTypeSchema.optional(),
    value: sessionSchema.optional(),
}).strict();

export const bodySchema = z.object({
    defaultSessionId: z.string().optional(),
    defaultStorage: storageTypeSchema.default(StorageType.SESSION_STORAGE),
    memoryKey: z.string().default('session'),
}).strict();

export type Session = z.infer<typeof sessionSchema>;
export type SessionValue = Session;
export type SessionPayload = z.infer<typeof sessionPayloadSchema>;
export type SessionRequest = z.infer<typeof sessionRequestSchema>;
export type Body = z.infer<typeof bodySchema>;

import { z } from 'zod';
import { SignalType } from './types.js';

export const dimensionsSchema = z.object({
    width: z.union([z.number(), z.string()]).optional(),
    height: z.union([z.number(), z.string()]).optional(),
});

export const bodySchema = z.object({
    source: z.string().optional(),
    alt: z.string().optional(),
    dimensions: dimensionsSchema.optional(),
    quality: z.number().optional(),
    sharpness: z.number().optional(),
    hidden: z.boolean().optional(),
    className: z.string().optional(),
});

export const emittedSignals: readonly string[] = [
    SignalType.CREATED,
    SignalType.UPDATED,
    SignalType.REMOVED,
];

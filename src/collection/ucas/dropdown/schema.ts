import { z } from 'zod';
import { SignalType } from './types.js';

export const bodySchema = z.object({
    id: z.string().optional(),
    value: z.string().optional(),
    items: z.array(z.string()).optional(),
    placeholder: z.string().optional(),
    disabled: z.boolean().optional(),
    required: z.boolean().optional(),
    fontSize: z.union([z.number(), z.string()]).optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
    fontFamily: z.string().optional(),
});

export type BodySchema = z.infer<typeof bodySchema>;

export const emittedSignals: readonly string[] = [
    SignalType.CREATED,
    SignalType.UPDATED,
    SignalType.REMOVED,
];

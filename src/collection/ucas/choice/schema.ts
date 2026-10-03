import { z } from 'zod';
import { SignalType } from './types.js';

export const optionItemSchema = z.object({
    value: z.string(),
    label: z.string(),
    disabled: z.boolean().optional(),
});

export const bodySchema = z.object({
    id: z.string().optional(),
    options: z.array(z.union([z.string(), optionItemSchema])).optional(),
    selected: z.array(z.string()).optional(),
    multiple: z.boolean().optional(),
    title: z.string().optional(),
    disabled: z.boolean().optional(),
});

export type BodySchema = z.infer<typeof bodySchema>;

export const emittedSignals: readonly string[] = [
    SignalType.CREATED,
    SignalType.UPDATED,
    SignalType.REMOVED,
    SignalType.SELECTED,
];

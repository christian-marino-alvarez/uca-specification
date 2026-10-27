import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const toneSchema = z.enum([
    'info',
    'success',
    'warning',
    'error',
]).default('info');

export const bodySchema = z.object({
    actionLabel: z.string().optional().describe('Optional interactive action button label'),
    containerElement: z.string().optional(),
    duration: z.number().int().positive().optional().describe('Auto-dismiss duration in milliseconds'),
    elementId: z.string().optional(),
    events: z.array(z.string()).optional(),
    icon: z.string().optional().describe('Material Design leading icon symbol'),
    message: z.string().describe('Primary notification message text'),
    open: z.boolean().default(true).describe('Whether the notification is visible'),
    parentTo: z.string().optional(),
    qualities: qualitiesSchema,
    tone: toneSchema.optional().describe('Semantic status tone of the notification'),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Tone = z.infer<typeof toneSchema>;
export type Body = z.infer<typeof bodySchema>;

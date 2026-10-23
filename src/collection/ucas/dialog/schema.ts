import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const dialogVariantSchema = z.enum([
    'basic',
    'confirmation',
    'fullscreen',
]).default('basic');

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    icon: z.string().optional().describe('Material Design header icon symbol'),
    headline: z.string().describe('Dialog title headline'),
    supportingText: z.string().optional().describe('Supporting explanatory dialog text'),
    content: z.string().optional().describe('Custom inner HTML body content'),
    confirmLabel: z.string().default('OK').describe('Primary confirmation action button label'),
    cancelLabel: z.string().optional().describe('Optional cancellation action button label'),
    variant: dialogVariantSchema.optional().describe('Material Design 3 dialog variant'),
    open: z.boolean().default(true).describe('Whether the dialog modal is visible'),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type DialogVariant = z.infer<typeof dialogVariantSchema>;
export type Body = z.infer<typeof bodySchema>;

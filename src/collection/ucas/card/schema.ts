import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const cardVariantSchema = z.enum([
    'elevated',
    'filled',
    'outlined',
]).default('elevated');

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    title: z.string().optional().describe('Material Design 3 card headline'),
    subtitle: z.string().optional().describe('Material Design 3 card subhead'),
    content: z.string().optional().describe('Body content or text of the card'),
    media: z.string().optional().describe('Header image or media URL'),
    variant: cardVariantSchema.optional().describe('Material Design 3 card variant'),
    interactive: z.boolean().optional().describe('Whether the card responds to click/tap interactions'),
    disabled: z.boolean().optional().describe('Whether interactive states are disabled'),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type CardVariant = z.infer<typeof cardVariantSchema>;
export type Body = z.infer<typeof bodySchema>;

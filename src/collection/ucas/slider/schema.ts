import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const sliderVariantSchema = z.enum([
    'continuous',
    'discrete',
]).default('continuous');

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    label: z.string().optional().describe('Slider descriptive label'),
    value: z.number().default(0).describe('Current slider numeric value'),
    min: z.number().default(0).describe('Minimum value of the range'),
    max: z.number().default(100).describe('Maximum value of the range'),
    step: z.number().positive().optional().describe('Step interval for discrete sliders'),
    variant: sliderVariantSchema.optional().describe('Material Design 3 slider variant'),
    disabled: z.boolean().optional().describe('Whether the slider is disabled'),
    showValueIndicator: z.boolean().optional().describe('Show floating value indicator on thumb'),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type SliderVariant = z.infer<typeof sliderVariantSchema>;
export type Body = z.infer<typeof bodySchema>;

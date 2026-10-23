import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const chipVariantSchema = z.enum([
    'assist',
    'filter',
    'input',
    'suggestion',
]).default('assist');

export const bodySchema = z.object({
    elementId: z.string().optional(),
    parentTo: z.string().optional(),
    containerElement: z.string().optional(),
    label: z.string().describe('Chip textual label'),
    leadingIcon: z.string().optional().describe('Material Design leading icon'),
    trailingIcon: z.string().optional().describe('Material Design trailing icon or remove icon'),
    variant: chipVariantSchema.optional().describe('Material Design 3 chip variant'),
    selected: z.boolean().optional().describe('Selection state for filter chips'),
    removable: z.boolean().optional().describe('Whether chip exhibits a trailing remove button'),
    disabled: z.boolean().optional().describe('Whether the chip is disabled'),
    qualities: qualitiesSchema,
    events: z.array(z.string()).optional(),
});

export type Qualities = z.infer<typeof qualitiesSchema>;
export type ChipVariant = z.infer<typeof chipVariantSchema>;
export type Body = z.infer<typeof bodySchema>;

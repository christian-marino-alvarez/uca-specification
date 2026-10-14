import { z } from 'zod';
import { KINDS } from './constants.js';

export const dimensionValueSchema = z.union([
    z.string().min(1),
    z.number(),
]);

export const dimensionsSchema = z.object({
    width: dimensionValueSchema.describe('Relative or semantic width (e.g. full, half, third, 100%, 0.5)'),
    height: dimensionValueSchema.describe('Relative or semantic height (e.g. full, auto, screen, 5%, 0.05)'),
}).strict();

export const styleSchema = z.object({
    surface: z.string().optional().describe('Surface color token: default, card, muted, dark, brand, accent'),
    spacing: z.string().optional().describe('Spacing token: none, small, medium, large, xlarge'),
    tone: z.string().optional().describe('Accent/text tone token: brand, surface, muted, dark, accent'),
    typeface: z.string().optional().describe('Typeface token: sans, serif, mono'),
    textSize: z.string().optional().describe('Text size token: small, medium, large, title'),
    elevation: z.string().optional().describe('Box shadow elevation token: none, low, medium, high'),
    radius: z.string().optional().describe('Border radius token: none, small, medium, large, full'),
    direction: z.string().optional().describe('Flexbox layout direction: row, column'),
    alignment: z.string().optional().describe('Flexbox layout alignment: start, center, end, space-between'),
}).strict();

export const mediaRangeSchema = z.object({
    minWidth: z.number().optional().describe('Minimum viewport width in pixels for which this layout is valid'),
    maxWidth: z.number().optional().describe('Maximum viewport width in pixels for which this layout is valid'),
    orientation: z.string().optional().describe('Screen orientation for which this layout is valid'),
}).strict();

export const sectionSchema = z.object({
    kind: z.enum(KINDS).optional().describe('Nature of this area: container, heading, text, action, input or media'),
    purpose: z.string().min(1).describe('Ontological purpose and responsibility of this section'),
    context: z.string().min(1).describe('Operating context delegated to this section'),
    parentTo: z.string().min(1).describe('Identifier of the parent host UCA'),
    dimensions: dimensionsSchema,
    style: styleSchema.optional().describe('Qualities and design tokens for styling this section'),
    media: mediaRangeSchema.optional().describe('Viewport media range for which this section layout is valid'),
}).strict();

export const layoutSchema = z.record(z.string().min(1), sectionSchema);

export const bodySchema = z.object({
    request: z.string().describe('Request instruction that Composer uses with its LLM to build the layout'),
    context: z.string().describe('Operational context inherited from App that determines the layout'),
    catalog: z.array(z.string()).default(['Box']).describe('Array of available UCAs to compose the layout'),
    parentTo: z.string().default('app').describe('Host identifier for parentTo relationship'),
    layout: layoutSchema.optional().describe('Composed layout structure'),
    medias: z.record(z.string(), z.unknown()).optional().describe('Memorized media ranges and layouts'),
});

export type DimensionValue = z.infer<typeof dimensionValueSchema>;
export type Dimensions = z.infer<typeof dimensionsSchema>;
export type Style = z.infer<typeof styleSchema>;
export type MediaRange = z.infer<typeof mediaRangeSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Layout = z.infer<typeof layoutSchema>;
export type Body = z.infer<typeof bodySchema>;

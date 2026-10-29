import { z } from 'zod';

export const dimensionsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

export const windowSizeClassSchema = z.enum([
  'compact',
  'medium',
  'expanded',
]);

export const windowSizeRuleSchema = z.object({
  windowSizeClass: windowSizeClassSchema,
  breakpoint: z.string().min(1),
  columns: z.number().int().positive(),
  margin: z.string().min(1),
  spacer: z.string().min(1),
  recommendedDivision: z.string().min(1),
  pattern: z.string().min(1),
});

export const canonicalLayoutsSchema = z.object({
  supportingPane: z.string().min(1),
  listDetail: z.string().min(1),
  feed: z.string().min(1),
});

export const spatialPrinciplesSchema = z.object({
  containment: z.string().min(1),
  gravitationalBalance: z.string().min(1),
  surfaceHierarchy: z.string().min(1),
  spacingAndSpacers: z.string().min(1),
});

export const materialModelSchema = z.object({
  specification: z.string().min(1),
  philosophy: z.string().min(1),
  windowSizeRule: windowSizeRuleSchema,
  canonicalLayouts: canonicalLayoutsSchema,
  spatialPrinciples: spatialPrinciplesSchema,
});

export const queryRequestSchema = z.object({
  dimensions: dimensionsSchema.optional(),
}).optional();

export const errorSchema = z.object({
  error: z.string(),
}).passthrough();

export const bodySchema = z.object({
  id: z.string().optional(),
  context: z.string().optional(),
  model: materialModelSchema.optional(),
});

export type Dimensions = z.infer<typeof dimensionsSchema>;
export type WindowSizeClass = z.infer<typeof windowSizeClassSchema>;
export type WindowSizeRule = z.infer<typeof windowSizeRuleSchema>;
export type CanonicalLayouts = z.infer<typeof canonicalLayoutsSchema>;
export type SpatialPrinciples = z.infer<typeof spatialPrinciplesSchema>;
export type MaterialModel = z.infer<typeof materialModelSchema>;
export type QueryRequest = z.infer<typeof queryRequestSchema>;
export type Body = z.infer<typeof bodySchema>;

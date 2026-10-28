import { z } from 'zod';

export const visualDispositionsSchema = z.object({
  density: z.string().min(1),
  contrastMode: z.string().min(1),
  paletteIntent: z.string().min(1),
  dynamicPrinciples: z.array(z.string().min(1)),
  dayPeriodAdaptation: z.boolean(),
  locationAdaptation: z.boolean(),
  supportedDevices: z.array(z.string().min(1)),
}).strict();

export const audienceSchema = z.object({
  profile: z.array(z.string().min(1)),
  cognitiveGoal: z.string().min(1),
}).strict();

export const specificationModelSchema = z.object({
  purpose: z.string().min(1).optional(),
  intention: z.string().min(1).optional(),
  tone: z.string().min(1).optional(),
  interactiveFeatures: z.array(z.string().min(1)).optional(),
  visualDispositions: visualDispositionsSchema.optional(),
  audience: audienceSchema.optional(),
  limits: z.array(z.string().min(1)).optional(),
}).strict();

export const queryRequestSchema = z.object({
  keys: z.array(z.string().min(1)).optional(),
}).strict().optional();

export const bodySchema = z.object({
  model: specificationModelSchema,
}).strict();

export type VisualDispositions = z.infer<typeof visualDispositionsSchema>;
export type Audience = z.infer<typeof audienceSchema>;
export type SpecificationModel = z.infer<typeof specificationModelSchema>;
export type QueryRequest = z.infer<typeof queryRequestSchema>;
export type Body = z.infer<typeof bodySchema>;

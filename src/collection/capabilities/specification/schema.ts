import { z } from 'zod';

export const experienceScenarioSchema = z.object({
    name: z.string().min(1),
    context: z.string().min(1),
    perceptionGoal: z.string().min(1),
}).strict();

export const userExperienceSchema = z.object({
    scenarios: z.array(experienceScenarioSchema),
    dynamicPrinciples: z.array(z.string().min(1)),
}).strict();

export const informationDispositionSchema = z.object({
    tone: z.string().min(1),
    structure: z.string().min(1),
    segmentation: z.array(z.string().min(1)),
}).strict();

export const functionalDesignSchema = z.object({
    interactiveFeatures: z.array(z.string().min(1)),
    feedbackModes: z.array(z.string().min(1)),
    dynamicCapabilities: z.array(z.string().min(1)),
}).strict();

export const graphicDesignSchema = z.object({
    density: z.string().min(1),
    contrastMode: z.string().min(1),
    paletteIntent: z.string().min(1),
    dayPeriodAdaptation: z.boolean(),
    locationAdaptation: z.boolean(),
    supportedDevices: z.array(z.string().min(1)),
}).strict();

export const audienceSchema = z.object({
    profile: z.array(z.string().min(1)),
    cognitiveGoal: z.string().min(1),
}).strict();

export const domainEntitySchema = z.object({
    name: z.string().min(1),
    symbol: z.string().min(1),
    definition: z.string().min(1),
}).strict();

export const specificationDataSchema = z.object({
    experience: userExperienceSchema,
    information: informationDispositionSchema,
    functional: functionalDesignSchema,
    graphic: graphicDesignSchema,
    limits: z.array(z.string().min(1)),
    audience: audienceSchema,
    domainEntities: z.array(domainEntitySchema),
}).passthrough();

export const specificationModelSchema = z.object({
    purpose: z.string().min(1),
    intention: z.string().min(1),
    data: specificationDataSchema,
}).strict();

export const queryRequestSchema = z.object({
    keys: z.array(z.string().min(1)).optional(),
}).strict().optional();

export const bodySchema = z.object({
    model: specificationModelSchema,
}).strict();

export type ExperienceScenario = z.infer<typeof experienceScenarioSchema>;
export type UserExperience = z.infer<typeof userExperienceSchema>;
export type InformationDisposition = z.infer<typeof informationDispositionSchema>;
export type FunctionalDesign = z.infer<typeof functionalDesignSchema>;
export type GraphicDesign = z.infer<typeof graphicDesignSchema>;
export type Audience = z.infer<typeof audienceSchema>;
export type DomainEntity = z.infer<typeof domainEntitySchema>;
export type SpecificationData = z.infer<typeof specificationDataSchema>;
export type SpecificationModel = z.infer<typeof specificationModelSchema>;
export type QueryRequest = z.infer<typeof queryRequestSchema>;
export type Body = z.infer<typeof bodySchema>;

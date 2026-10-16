import { z } from 'zod';
import { entrySchema } from '@uca/capability-catalog/schema';
import {
    aimSchema,
    browserSchema,
    compositionSchema as layoutCompositionSchema,
    designSchema,
    limitsSchema as layoutLimitsSchema,
    resultSchema as createdLayoutSchema,
} from '@uca/layout/schema';
import { Path } from './types.js';
import {
    completedSchema as completedViewSchema,
    compositionSchema as viewCompositionSchema,
    requirementsSchema as viewRequirementsSchema,
    resultSchema as createdViewElementSchema,
} from '@uca/view/schema';

export {
    aimSchema,
    browserSchema,
    designSchema,
};

export const compositionSchema = z.union([
    layoutCompositionSchema,
    viewCompositionSchema,
]);

export const limitsSchema = layoutLimitsSchema;

export const requestSchema = z.object({
    correlationId: z.string().min(1),
    areaId: z.string().min(1),
    name: z.string().min(1).describe('Name of the UCA responsible for managing the target area').optional(),
    browser: browserSchema,
    design: designSchema,
    aim: aimSchema,
    context: z.string().min(1),
    limits: limitsSchema,
    requirements: viewRequirementsSchema.optional(),
    composition: compositionSchema.optional(),
}).strict();
export const layoutAreaResultSchema = createdLayoutSchema;
export const viewElementResultSchema = createdViewElementSchema;
export const viewCompletedSchema = completedViewSchema;

export const availableUcasSchema = z.object({
    web: z.array(entrySchema),
    logic: z.array(entrySchema),
}).strict();

export const decisionAreaSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).optional(),
    aim: z.string().min(1),
    context: z.string().min(1),
}).strict();

export const decisionContextSchema = z.object({
    area: decisionAreaSchema,
    availableUcas: availableUcasSchema,
}).strict();

export const decisionContinuationSchema = z.object({
    request: requestSchema,
    availableUcas: availableUcasSchema,
}).strict();

export const resultSchema = z.object({
    correlationId: z.string().min(1),
    result: z.object({
        path: z.enum(Path),
    }).strict(),
}).strict();

export const errorSchema = z.object({
    correlationId: z.string().min(1).nullable(),
    error: z.string(),
    attempts: z.number().int().nonnegative(),
    request: requestSchema.nullable(),
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    context: z.string().optional(),
}).strict();

export type Aim = z.infer<typeof aimSchema>;
export type AvailableUcas = z.infer<typeof availableUcasSchema>;
export type Body = z.infer<typeof bodySchema>;
export type Browser = z.infer<typeof browserSchema>;
export type Composition = z.infer<typeof compositionSchema>;
export type Design = z.infer<typeof designSchema>;
export type DecisionContext = z.infer<typeof decisionContextSchema>;
export type DecisionContinuation = z.infer<typeof decisionContinuationSchema>;
export type Failure = z.infer<typeof errorSchema>;
export type Limits = z.infer<typeof limitsSchema>;
export type Request = z.infer<typeof requestSchema>;
export type Result = z.infer<typeof resultSchema>;

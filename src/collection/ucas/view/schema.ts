import { z } from 'zod';
import {
    availableUcasSchema,
    browserSchema,
    designSchema,
    limitsSchema,
    targetAreaSchema,
} from '@uca/layout/schema';
import {
    Kind,
    Name,
} from './types.js';
import { bodySchema as actionBodySchema } from '@uca/action/schema';
import { bodySchema as boxBodySchema } from '@uca/box/schema';
import { bodySchema as collectionBodySchema } from '@uca/collection/schema';
import { bodySchema as dropdownBodySchema } from '@uca/dropdown/schema';
import { bodySchema as inputBodySchema } from '@uca/input/schema';
import {
    bindingSchema as interactionBindingSchema,
    contextSchema as interactionContextSchema,
} from '@uca/interaction/schema';
import {
    SignalType as InteractionSignalType,
} from '@uca/interaction/types';
import { bodySchema as optionsBodySchema } from '@uca/options/schema';
import { bodySchema as pictureBodySchema } from '@uca/picture/schema';

export const identityShape = {
    id: z.string().min(1),
    purpose: z.string().min(1),
    order: z.number().int().nonnegative(),
    parentId: z.string().min(1).optional(),
};

export const webPropertiesMask = {
    elementId: true,
    parentTo: true,
    containerElement: true,
} as const;

export const interactionPropertiesSchema = z.object({
    context: interactionContextSchema,
    fields: z.array(z.object({
        field: z.string().min(1),
        initialValue: z.string().optional(),
    }).strict()),
}).strict();

export const actionElementSchema = z.object({
        ...identityShape,
        kind: z.literal(Kind.VISUAL),
        name: z.literal(Name.ACTION),
        properties: actionBodySchema.omit(webPropertiesMask),
    }).strict();

export const boxElementSchema = z.object({
        ...identityShape,
        kind: z.literal(Kind.VISUAL),
        name: z.literal(Name.BOX),
        properties: boxBodySchema.omit(webPropertiesMask),
    }).strict();

export const collectionElementSchema = z.object({
        ...identityShape,
        kind: z.literal(Kind.VISUAL),
        name: z.literal(Name.COLLECTION),
        properties: collectionBodySchema.omit(webPropertiesMask),
    }).strict();

export const dropdownElementSchema = z.object({
        ...identityShape,
        kind: z.literal(Kind.VISUAL),
        name: z.literal(Name.DROPDOWN),
        properties: dropdownBodySchema.omit(webPropertiesMask),
    }).strict();

export const inputElementSchema = z.object({
        ...identityShape,
        kind: z.literal(Kind.VISUAL),
        name: z.literal(Name.INPUT),
        properties: inputBodySchema.omit(webPropertiesMask),
    }).strict();

export const optionsElementSchema = z.object({
        ...identityShape,
        kind: z.literal(Kind.VISUAL),
        name: z.literal(Name.OPTIONS),
        properties: optionsBodySchema.omit(webPropertiesMask),
    }).strict();

export const pictureElementSchema = z.object({
        ...identityShape,
        kind: z.literal(Kind.VISUAL),
        name: z.literal(Name.PICTURE),
        properties: pictureBodySchema.omit({
            ...webPropertiesMask,
            context: true,
        }),
    }).strict();

export const elementSchema = z.discriminatedUnion('name', [
    actionElementSchema,
    boxElementSchema,
    collectionElementSchema,
    dropdownElementSchema,
    inputElementSchema,
    optionsElementSchema,
    pictureElementSchema,
]);

export const logicSchema = z.object({
    id: z.string().min(1),
    kind: z.literal(Kind.LOGIC),
    name: z.literal(Name.INTERACTION),
    purpose: z.string().min(1),
    properties: interactionPropertiesSchema,
}).strict();

export const endpointSchema = z.object({
    id: z.string().min(1),
    signal: z.string().min(1),
}).strict();

export const interactionEndpointSchema = endpointSchema.extend({
    signal: z.literal(InteractionSignalType.HANDLE),
}).strict();

export const connectionSchema = z.object({
    id: z.string().min(1),
    kind: z.literal(Kind.CONNECTION),
    purpose: z.string().min(1),
    source: endpointSchema,
    target: interactionEndpointSchema,
    properties: z.object({
        field: z.string().min(1).optional(),
        interaction: interactionBindingSchema.optional(),
    }).strict(),
}).strict();

export const compositionSchema = z.object({
    visual: z.array(elementSchema).min(1),
    logic: z.array(logicSchema),
    connections: z.array(connectionSchema),
}).strict();

export const requirementsSchema = z.object({
    visual: z.array(z.enum([
        Name.ACTION,
        Name.BOX,
        Name.COLLECTION,
        Name.DROPDOWN,
        Name.INPUT,
        Name.OPTIONS,
        Name.PICTURE,
    ])),
    logic: z.array(z.literal(Name.INTERACTION)),
}).strict();

export const correctionSchema = z.object({
    missingVisual: requirementsSchema.shape.visual,
    missingLogic: requirementsSchema.shape.logic,
}).strict();

export const contextSchema = z.object({
    fulfillment: z.string().min(1),
    browser: browserSchema,
    design: designSchema,
    limits: limitsSchema,
    availableUcas: availableUcasSchema,
    composition: compositionSchema.optional(),
    requirements: requirementsSchema.optional(),
    correction: correctionSchema.optional(),
}).strict();

export const requestSchema = z.object({
    correlationId: z.string().min(1),
    area: targetAreaSchema,
    purpose: z.string().min(1),
    attempt: z.number().int().min(0).max(1),
    context: contextSchema,
}).strict();

export const componentContextSchema = z.object({
    element: elementSchema,
    request: requestSchema,
}).strict();

export const componentSignalSchema = z.union([
    z.object({
        context: componentContextSchema,
    }).passthrough(),
    z.object({
        detail: z.object({
            context: componentContextSchema,
        }).passthrough(),
    }).passthrough(),
]);

export const entrySchema = z.union([
    elementSchema,
    logicSchema,
    connectionSchema,
]);

export const streamSchema = z.record(
    z.string().min(1),
    entrySchema,
);

export const resultSchema = z.object({
    correlationId: z.string().min(1),
    targetAreaId: z.string().min(1),
    element: elementSchema,
    request: requestSchema,
    detail: z.unknown().optional(),
}).strict();

export const completedSchema = z.object({
    correlationId: z.string().min(1),
    targetAreaId: z.string().min(1),
    composition: compositionSchema,
    request: requestSchema,
}).strict();

export const errorSchema = z.object({
    correlationId: z.string().min(1).nullable(),
    areaId: z.string().min(1).nullable(),
    error: z.string(),
    request: requestSchema,
}).strict();

export const bodySchema = z.object({
    id: z.string().min(1).optional(),
    context: z.string().optional(),
}).strict();

export type Body = z.infer<typeof bodySchema>;
export type Completed = z.infer<typeof completedSchema>;
export type ComponentContext = z.infer<typeof componentContextSchema>;
export type ComponentSignal = z.infer<typeof componentSignalSchema>;
export type Composition = z.infer<typeof compositionSchema>;
export type Connection = z.infer<typeof connectionSchema>;
export type Context = z.infer<typeof contextSchema>;
export type Element = z.infer<typeof elementSchema>;
export type Entry = z.infer<typeof entrySchema>;
export type Failure = z.infer<typeof errorSchema>;
export type Logic = z.infer<typeof logicSchema>;
export type Request = z.infer<typeof requestSchema>;
export type Requirements = z.infer<typeof requirementsSchema>;
export type Result = z.infer<typeof resultSchema>;

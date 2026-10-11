import { z } from 'zod';

export const dimensionValueSchema = z.union([
    z.string().min(1),
    z.number().transform((num) => `${Math.round(num <= 1 ? num * 100 : num)}%`),
]);

export const dimensionsSchema = z.object({
    width: dimensionValueSchema.describe('Relative or semantic width within host (e.g. full, half, third, 100%, 0.5)'),
    height: dimensionValueSchema.describe('Relative or semantic height within host (e.g. full, auto, screen, 5%, 0.05)'),
}).strict();

export const nodeSchema = z.object({
    purpose: z.string().min(1).describe('Ontological responsibility of this immediate child UCA'),
    context: z.string().min(1).describe('Operating context delegated to this child'),
    dimensions: dimensionsSchema,
    parentTo: z.string().min(1).describe('Identifier of the existing host UCA'),
}).strict();

export const flatNodeSchema = z.object({
    id: z.string().min(1).describe('Child identity'),
    purpose: z.string().min(1).describe('Ontological responsibility of this immediate child UCA'),
    context: z.string().min(1).describe('Operating context delegated to this child'),
    dimensions: dimensionsSchema,
    parentTo: z.string().min(1).describe('Identifier of the existing host UCA'),
}).strict();

export const keyedItemSchema = z.record(z.string().min(1), nodeSchema);
export const flatItemSchema = flatNodeSchema.transform((node) => {
    const { id, ...rest } = node;
    return { [id]: rest };
});

export const itemSchema = z.union([keyedItemSchema, flatItemSchema]);
export const structureSchema = keyedItemSchema;

export function schemaForParent(parentTo: string) {
    const boundNode = nodeSchema.extend({ parentTo: z.literal(parentTo) });
    const boundKeyed = z.record(z.string().min(1).refine((id) => id !== parentTo), boundNode);
    const boundFlat = flatNodeSchema.extend({ parentTo: z.literal(parentTo) }).transform((node) => {
        const { id, ...rest } = node;
        return { [id]: rest };
    });
    return z.union([boundKeyed, boundFlat]);
}

export const bodySchema = z.object({
    id: z.string().optional(),
    request: z.string().optional().describe('Purpose to satisfy through immediate children'),
    context: z.string().optional(),
    parentTo: z.string().optional(),
    composition: structureSchema.optional().describe('Current complete composition, replaced on recomposition'),
    correlationId: z.string().optional(),
    streamId: z.string().optional(),
});

export const createPayloadSchema = bodySchema.extend({
    model: z.enum(['local', 'nube']).optional(),
    provider: z.string().optional(),
    imagination: z.number().min(0).max(10).optional(),
});

export type Dimensions = z.infer<typeof dimensionsSchema>;
export type Body = z.infer<typeof bodySchema>;
export type Node = z.infer<typeof nodeSchema>;
export type Item = z.infer<typeof itemSchema>;
export type Structure = z.infer<typeof structureSchema>;
export type CreatePayload = z.infer<typeof createPayloadSchema>;

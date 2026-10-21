import { z } from 'zod';

export const corePrincipleSchema = z.object({
    number: z.number().optional(),
    title: z.string().min(1),
    statement: z.string().min(1),
}).strict();

export const formalEntitySchema = z.object({
    domain: z.string().min(1),
    symbol: z.string().min(1),
    name: z.string().min(1),
    definition: z.string().min(1),
}).strict();

export const formalRelationSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
}).strict();

export interface SpecificationSection {
    id: string;
    title: string;
    level: number;
    content: string;
    subsections?: SpecificationSection[];
}

export const specificationSectionSchema: z.ZodType<SpecificationSection> = z.lazy(() => {
    return z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        level: z.number().min(1),
        content: z.string(),
        subsections: z.array(specificationSectionSchema).optional(),
    }).strict();
});

export const specificationModelSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    source: z.string().min(1),
    summary: z.string().min(1),
    principles: z.array(corePrincipleSchema),
    entities: z.array(formalEntitySchema),
    relations: z.array(formalRelationSchema),
    sections: z.array(specificationSectionSchema),
    rawContent: z.string().optional(),
}).strict();

export const parsePayloadSchema = z.object({
    source: z.string().optional(),
    content: z.string().optional(),
    correlationId: z.string().optional(),
}).strict();

export const bodySchema = z.object({
    id: z.string().optional(),
    source: z.string().optional(),
    model: specificationModelSchema.optional(),
}).strict();

export type CorePrinciple = z.infer<typeof corePrincipleSchema>;
export type FormalEntity = z.infer<typeof formalEntitySchema>;
export type FormalRelation = z.infer<typeof formalRelationSchema>;
export type SpecificationModel = z.infer<typeof specificationModelSchema>;
export type ParsePayload = z.infer<typeof parsePayloadSchema>;
export type Body = z.infer<typeof bodySchema>;

import { z } from 'zod';
import {
    qualitiesSchema as visualQualitiesSchema,
} from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema
    .passthrough()
    .describe(
        'Visual and layout tokens: direction (column|row), spacing (small|medium|large), gap (small|medium|large), surface (card|brand|muted|dark), border (none|subtle|strong), radius (small|medium|large|full), elevation (none|low|card|medium), textColor (light|dark|muted|brand), textSize (small|medium|large|title|display), fontWeight (normal|medium|semibold|bold)',
    )
    .optional();

export const choiceSchema = z.enum([
    'LAYOUT',
    'VIEW',
]);

export const areaSchema = z.object({
    id: z.string().min(1),
    parentId: z.string().min(1).optional(),
    role: z.string().optional(),
    proportion: z.string().optional(),
    description: z.string().optional(),
    purpose: z.string().optional(),
    intention: z.string().optional(),
});

export const layoutCompositionSchema = z.object({
    areas: z.array(areaSchema),
});

export const buildPayloadSchema = z.object({
    choice: choiceSchema,
    areaId: z.string().optional(),
    parentId: z.string().optional(),
    containerElement: z.string().optional(),
    purpose: z.string().optional(),
    intention: z.string().optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ),
    correlationId: z.string().optional(),
});

export const builtResultSchema = z.object({
    choice: choiceSchema,
    composition: z.unknown(),
    areaId: z.string().optional(),
    parentId: z.string().optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    correlationId: z.string().optional(),
});

export const componentInfoSchema = z.object({
    purpose: z.string(),
    tag: z.string().optional(),
});

export const bodySchema = z.object({
    id: z.string().optional(),
    containerElement: z.string().optional(),
    components: z.record(
        z.string(),
        componentInfoSchema,
    ).optional(),
});

export const componentItemSchema = z.object({
    id: z.string().describe('Identificador único del componente').optional(),
    parentId: z.string().describe('Identificador del contenedor o componente padre').optional(),
    component: z.string().describe('Tipo ontológico de UCA: heading, paragraph, action, picture, box, input, separator').nullable().optional().default('box'),
    content: z.string().describe('Texto visible, titular, etiqueta o descripción del elemento').nullable().optional(),
    label: z.string().describe('Etiqueta textual visible para acciones o botones').nullable().optional(),
    title: z.string().describe('Título textual del componente').nullable().optional(),
    text: z.string().describe('Cuerpo de texto o contenido explicativo').nullable().optional(),
    src: z.string().describe('URL o ruta del recurso de imagen para picture, p. ej. assets/uca-logo.svg').nullable().optional(),
    properties: z.record(
        z.string(),
        z.unknown(),
    ).nullable().optional(),
    qualities: qualitiesSchema
        .nullable()
        .describe('Cualidades estéticas y de disposición basadas en tokens de diseño (spacing, gap, surface, border, radius, elevation, textSize, fontWeight, direction)'),
    attributes: z.record(
        z.string(),
        z.unknown(),
    ).nullable().optional(),
}).passthrough();

export const viewCompositionSchema = z.object({
    components: z.array(componentItemSchema).min(1).describe('Secuencia jerárquica de componentes que articulan la presentación visual'),
});

export const areaCreatedSchema = z.object({
    area: areaSchema,
    correlationId: z.string(),
    context: z.record(
        z.string(),
        z.unknown(),
    ),
});

export type Choice = z.infer<typeof choiceSchema>;
export type Area = z.infer<typeof areaSchema>;
export type LayoutComposition = z.infer<typeof layoutCompositionSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type ComponentItem = z.infer<typeof componentItemSchema>;
export type ViewComposition = z.infer<typeof viewCompositionSchema>;
export type BuildPayload = z.infer<typeof buildPayloadSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;
export type ComponentInfo = z.infer<typeof componentInfoSchema>;
export type Body = z.infer<typeof bodySchema>;
export type AreaCreated = z.infer<typeof areaCreatedSchema>;

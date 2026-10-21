import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const areaConceptSchema = z.object({
    id: z.string().min(1).describe('Identificador único o nombre del área (ej. header, sidebar, main, footer, workspace)'),
    proposito: z.string().min(1).describe('Propósito funcional del área'),
    intencion: z.string().min(1).describe('Estrategia de composición visual: cómo se cumple el propósito'),
    disposicionEspacial: z.string().min(1).describe('Ubicación y anclaje espacial respecto al contenedor padre y áreas hermanas (ej. franja horizontal superior, columna lateral izquierda de navegación, escenario central interactivo, franja inferior de estado)'),
    disposicionVisual: z.string().min(1).describe('Directrices de manifestación visual y flujo dimensional (ej. fila horizontal sin scroll, columna vertical con navegación, panel con desplazamiento interno)'),
    disposicionInformacion: z.string().min(1).describe('Naturaleza y alcance semántico de la información a albergar (ej. identidad ontológica y acciones globales, árbol de navegación y módulos, telemetría y estado cognitivo)'),
    parentId: z.string().min(1).describe('Identificador del área padre actual contenedora (ej. root, main, etc.)'),
    qualities: qualitiesSchema.describe('Cualidades dimensionales y espaciales inferidas del área (width, height, minHeight, direction, distribution, alignment, surface, spacing, flex, overflow) según tokens Lego'),
});

export const layoutCompositionSchema = z.object({
    areas: z.array(
        areaConceptSchema,
    ).min(1).describe('Colección de áreas conceptuales que estructuran el layout educando a sus hijos en su disposición espacial, visual e informacional'),
});

export const areaSchema = z.object({
    id: z.string().min(1),
    parentId: z.string().min(1).optional(),
    role: z.string().optional(),
    proportion: z.string().optional(),
    description: z.string().optional(),
    purpose: z.string().optional(),
    intention: z.string().optional(),
    proposito: z.string().optional(),
    intencion: z.string().optional(),
    disposicionEspacial: z.string().optional(),
    disposicionVisual: z.string().optional(),
    disposicionInformacion: z.string().optional(),
    qualities: qualitiesSchema,
});

export const buildPayloadSchema = z.object({
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
    composition: z.unknown(),
    areaId: z.string().optional(),
    parentId: z.string().optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    correlationId: z.string().optional(),
});

export const bodySchema = z.object({
    id: z.string().optional(),
    containerElement: z.string().optional(),
});

export type AreaConcept = z.infer<typeof areaConceptSchema>;
export type LayoutComposition = z.infer<typeof layoutCompositionSchema>;
export type Area = z.infer<typeof areaSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type BuildPayload = z.infer<typeof buildPayloadSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;
export type Body = z.infer<typeof bodySchema>;

export interface AreaDefined {
    readonly area: Area;
    readonly context: Record<string, unknown>;
    readonly correlationId: string;
}

import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const layoutQualitiesDirectionSchema = visualQualitiesSchema.required({
    direction: true,
    spacing: true,
    outline: true,
    marginBlock: true,
});

export const layoutQualitiesDivisionSchema = visualQualitiesSchema.required({
    division: true,
    spacing: true,
    outline: true,
    marginBlock: true,
});

export const layoutQualitiesSchema = z.union([
    layoutQualitiesDirectionSchema,
    layoutQualitiesDivisionSchema,
]);

export const areaConceptSchema = z.object({
    id: z.string().min(1).describe('Identificador único o nombre del área (ej. header, sidebar, main, footer, workspace)'),
    proposito: z.string().min(1).describe('Propósito funcional del área'),
    intencion: z.string().min(1).describe('Estrategia de composición visual: cómo se cumple el propósito'),
    disposicionEspacial: z.string().min(1).describe('Ubicación y anclaje espacial respecto al contenedor padre y áreas hermanas (ej. franja horizontal superior, columna lateral izquierda de navegación, escenario central interactivo, franja inferior de estado)'),
    disposicionVisual: z.string().min(1).describe('Directrices de manifestación visual y flujo dimensional (ej. fila horizontal sin scroll, columna vertical con navegación, panel con desplazamiento interno)'),
    disposicionInformacion: z.string().min(1).describe('Naturaleza y alcance semántico de la información a albergar (ej. identidad ontológica y acciones globales, árbol de navegación y módulos, telemetría y estado cognitivo)'),
    parentId: z.string().min(1).describe('Identificador del contenedor directo que se particiona (ej. body para franjas principales, workspace para sidebar/main). Debe coincidir con el contenedor actual.'),
    qualities: layoutQualitiesSchema.describe('Cualidades espaciales obligatorias del área: debe declarar direction o division para organizar a sus hijos; ' +
        'debe declarar spacing ("none"|"small"|"medium"|"large"|"xlarge") para respiración interior; ' +
        'debe declarar outline ("subtle"|"strong"|"dashed"|"none") para delimitar su frontera perimetral; ' +
        'debe declarar marginBlock ("none"|"small"|"medium"|"large") para respiración exterior vertical; ' +
        'debe declarar surface ("default"|"card"|"muted"); y si contiene elementos múltiples declarar gap ("small"|"medium"). ' +
        'flex solo dimensiona el área dentro de su padre.'),
});

export const layoutCompositionSchema = z.object({
    areas: z.array(
        areaConceptSchema,
    ).min(1).describe('Colección de áreas conceptuales que estructuran el layout educando a sus hijos en su disposición espacial, visual e informacional'),
});

export const containerQualitiesSchema = z.object({
    id: z.string().min(1).describe('Identificador único del contenedor padre directo'),
    qualities: visualQualitiesSchema.describe('Cualidades espaciales declaradas en el contenedor padre que delimitan y educan al área'),
}).describe('Cualidades espaciales del contenedor padre que delimitan y educan al área');

export const areaSchema = z.object({
    id: z.string().min(1),
    parentId: z.string().min(1).optional(),
    purpose: z.string().min(1).describe('Propósito ontológico obligatorio del área'),
    intention: z.string().min(1).describe('Intención de composición obligatoria del área'),
    disposicionEspacial: z.string().min(1).describe('Disposición espacial obligatoria del área'),
    disposicionVisual: z.string().min(1).describe('Disposición visual obligatoria del área'),
    disposicionInformacion: z.string().min(1).describe('Disposición informacional obligatoria del área'),
    qualities: qualitiesSchema,
    container: containerQualitiesSchema,
});

export const layoutBodySchema = z.object({
    id: z.string().optional(),
    containerElement: z.string().optional(),
    area: areaSchema.optional().describe('Especificación del área a particionar'),
    browser: z.record(
        z.string(),
        z.unknown(),
    ).optional().describe('Dimensiones y capacidades del navegador'),
    specification: z.unknown().optional().describe('Especificación funcional completa'),
    structural: z.unknown().optional().describe('Disposición estructural recibida de App'),
    spatial: z.unknown().optional().describe('Disposición espacial recibida de App'),
    design: z.unknown().optional().describe('Directrices de diseño recibidas de App'),
});

export const bodySchema = layoutBodySchema;

export const buildPayloadSchema = z.object({
    aim: z.object({
        description: z.string().min(1).describe('Intención cognitiva u objetivo del estímulo de layout'),
        body: bodySchema.describe('Cuerpo de dominio con el área a estructurar y contexto'),
    }),
    limits: z.record(
        z.string(),
        z.unknown(),
    ).optional().describe('Restricciones operativas (viewport, dimensiones, cuotas)'),
    correlationId: z.string().optional().describe('Identificador para trazabilidad nerviosa'),
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

export const areaDefinedSchema = z.object({
    area: areaSchema,
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
    correlationId: z.string().optional(),
});

export type AreaConcept = z.infer<typeof areaConceptSchema>;
export type LayoutComposition = z.infer<typeof layoutCompositionSchema>;
export type Area = z.infer<typeof areaSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type LayoutBody = z.infer<typeof layoutBodySchema>;
export type Body = LayoutBody;
export type BuildPayload = z.infer<typeof buildPayloadSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;
export type AreaDefined = z.infer<typeof areaDefinedSchema>;
export type ContainerQualities = z.infer<typeof containerQualitiesSchema>;

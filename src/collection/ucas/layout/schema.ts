import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import { areaContainerDimensionsSchema } from '../schema.js';

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

export const areaVisualSchema = z.object({
    intention: z.string().min(1).describe('Directriz de manifestación visual espacial (muy conciso, máximo 6-8 palabras)'),
    disposicion: layoutQualitiesSchema.describe('Disposición y cualidades espaciales obligatorias de la caja: direction o division, spacing perimetral, outline, marginBlock, surface y gap'),
}).describe('Manifestación y disposición visual del área');

export const areaConceptDimensionsSchema = z.object({
    width: z.string().optional().describe('Anchura espacial (full, compact, regular, sidebar, wide, auto)'),
    height: z.string().optional().describe('Altura espacial (full, header, footer, screen, auto)'),
    flex: z.string().optional().describe('Comportamiento flex (none, initial, auto, fill, grow, shrink)'),
}).default({}).describe('Propiedades dimensionales y elasticidad del área');

export const areaConceptSchema = z.object({
    id: z.string().min(1).describe('Identificador único o nombre del área (ej. header, sidebar, main, footer, workspace)'),
    parentId: z.string().min(1).describe('Identificador del contenedor directo que se particiona. Debe coincidir con el contenedor actual.'),
    purpose: z.string().min(1).describe('Propósito ontológico funcional del área (muy conciso, máximo 6-8 palabras)'),
    intention: z.string().min(1).describe('Estrategia de composición funcional: cómo se cumple el propósito (muy conciso, máximo 6-8 palabras)'),
    dimensions: areaConceptDimensionsSchema,
    visual: areaVisualSchema.describe('Manifestación visual y cualidades espaciales del área inferidas a partir de context.visual'),
}).describe('Área conceptual inferida para la partición del layout');

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
    dimensions: areaContainerDimensionsSchema.optional().describe('Propiedades dimensionales y restricciones espaciales del área contenedora'),
    visual: areaVisualSchema.optional().describe('Manifestación visual y cualidades espaciales del área'),
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
    limits: z.record(
        z.string(),
        z.unknown(),
    ).optional().describe('Límites operativos, dimensionales o de viewport definidos para el contexto'),
});

export const bodySchema = layoutBodySchema;

export const buildPayloadSchema = z.object({
    aim: z.object({
        description: z.string().min(1).describe('Intención cognitiva u objetivo del estímulo de layout'),
        body: bodySchema.describe('Cuerpo de dominio con el área a estructurar y contexto'),
    }),
});

export const builtResultSchema = z.object({
    composition: z.unknown(),
    areaId: z.string().optional(),
    parentId: z.string().optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
});

export const areaDefinedSchema = z.object({
    area: areaSchema,
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
});

export const contextAreaSchema = z.object({
    containerId: z.string().min(1).describe('Identificador único del contenedor anfitrión que el layout debe particionar en áreas hijas directas (ej. "body", "workspace")'),
    description: z.string().optional().describe('Directriz funcional del contenedor anfitrión a particionar'),
    design: z.record(
        z.string(),
        z.unknown(),
    ).describe('Objeto del diseño definido: paleta de colores, contraste positivo/negativo y directrices estéticas del contenedor'),
    dimensions: areaContainerDimensionsSchema.default({}).describe('Área espacial donde el layout debe renderizarse: anchura, altura, flex y restricciones de tamaño del contenedor'),
}).describe('Área contenedora anfitriona que el layout debe particionar');

export const spatialPieceSchema = z.object({
    name: z.string().min(1).describe('Nombre de la pieza visual o arquetipo estructural'),
    category: z.string().min(1).describe('Categoría funcional de la pieza'),
    description: z.string().optional().describe('Descripción del comportamiento visual de la pieza'),
    values: z.array(z.string()).readonly().optional().describe('Valores o tokens permitidos'),
}).passthrough().describe('Pieza visual disponible para estructurar el layout');

export const contextVisualSchema = z.object({
    description: z.string().optional().describe('Resumen del sistema y capacidades visuales disponibles'),
    disposicion: z.record(
        z.string(),
        z.unknown(),
    ).describe('Disposición visual y propiedades espaciales declarativas que el motor de layout puede instanciar (flujo, alineación, espaciado, dimensiones, contención)'),
    role: z.record(
        z.string(),
        z.unknown(),
    ).describe('Definición de roles y responsabilidades de las cajas: propiedades que debe definir el contenedor padre (direction, division, gap, spacing) frente a las propiedades de cada área hija (width, height, flex, span, surface)'),
    language: z.record(
        z.string(),
        z.unknown(),
    ).describe('Lenguaje visual del sistema con el catálogo completo de tokens de diseño ontológicos (dimensiones, espaciados, superficies, colores, elevación, tipografía)'),
    pieces: z.array(spatialPieceSchema).describe('Lista de piezas visuales de las que dispone para crear la percepción visual: bloques estructurales Box y opciones de Material Design 3 para crear grids fluidos, márgenes y paddings'),
}).describe('Objeto que define la percepción, capacidades y experiencia visual disponible para construir el layout');

export const contextBrowserViewportSchema = z.object({
    width: z.number().describe('Anchura del viewport del navegador en píxeles'),
    height: z.number().describe('Altura del viewport del navegador en píxeles'),
}).describe('Dimensiones físicas activas del viewport');

export const contextBrowserSchema = z.object({
    description: z.string().optional().describe('Descripción del entorno físico de renderizado y directrices de contención'),
    device: z.string().describe('Tipo de dispositivo o factor de forma de renderizado (desktop, mobile, tablet)'),
    viewport: contextBrowserViewportSchema.optional().describe('Dimensiones de la ventana del navegador'),
}).passthrough().describe('Datos de entorno, dispositivo y viewport del navegador donde se renderiza el layout');

export const layoutContextSchema = z.object({
    area: contextAreaSchema.describe('Área contenedora que se particiona con su identificador, diseño y dimensiones espaciales'),
    browser: contextBrowserSchema.describe('Datos de entorno del navegador: dispositivo, resolución y dimensiones físicas del viewport'),
    limits: z.record(
        z.string(),
        z.unknown(),
    ).describe('Objeto clave-valor de los límites dimensionales y de viewport que el modelo debe respetar para construir el layout'),
    visual: contextVisualSchema.describe('Objeto que define la percepción y experiencia visual'),
    goal: z.string().min(1).describe('Define la intención y qué debe conseguirse con este layout en el contenedor actual'),
    id: z.string().min(1).describe('Identificador del layout que se está infiriendo'),
}).describe('Contexto formal que recibe el modelo para inferir la partición del layout');

export type AreaConcept = z.infer<typeof areaConceptSchema>;
export type AreaConceptDimensions = z.infer<typeof areaConceptDimensionsSchema>;
export type LayoutComposition = z.infer<typeof layoutCompositionSchema>;
export type Area = z.infer<typeof areaSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type LayoutBody = z.infer<typeof layoutBodySchema>;
export type Body = LayoutBody;
export type BuildPayload = z.infer<typeof buildPayloadSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;
export type AreaDefined = z.infer<typeof areaDefinedSchema>;
export type ContainerQualities = z.infer<typeof containerQualitiesSchema>;
export type SpatialPiece = z.infer<typeof spatialPieceSchema>;
export type AreaVisual = z.infer<typeof areaVisualSchema>;
export type ContextArea = z.infer<typeof contextAreaSchema>;
export type ContextBrowser = z.infer<typeof contextBrowserSchema>;
export type ContextVisual = z.infer<typeof contextVisualSchema>;
export type LayoutContext = z.infer<typeof layoutContextSchema>;


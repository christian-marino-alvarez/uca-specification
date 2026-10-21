import { z } from 'zod';
import {
    qualitiesSchema as visualQualitiesSchema,
} from '@uca/capability-css/schema';

export const qualitiesSchema = visualQualitiesSchema
    .describe('Abstract visual Lego tokens; combine them to compose layout and appearance')
    .optional();

export const componentItemSchema = z.object({
    id: z.string().describe('Identificador único del componente en el grafo').optional(),
    parentId: z.string().describe('Identificador del componente padre dentro de esta área, o vacío para el contenedor raíz de la vista. Prohibido usar "root" o áreas externas').optional(),
    component: z.string().describe('Tipo ontológico de UCA: box (para tarjetas delimitadas, contenedores o barras de herramientas), heading (titulares con jerarquía), paragraph (textos y descripciones), action (botones de interacción primaria con surface \'brand\' o secundaria con border \'subtle\'), access (enlaces y navegación), picture (logotipos e imágenes con width: \'small\'), input (campos interactivos), separator (divisores). Usa box para estructurar tarjetas y módulos visibles').nullable().optional().default('box'),
    content: z.string().describe('Texto visible, titular, etiqueta o descripción del elemento').nullable().optional(),
    label: z.string().describe('Etiqueta textual visible para acciones o botones').nullable().optional(),
    title: z.string().describe('Título textual del componente').nullable().optional(),
    text: z.string().describe('Cuerpo de texto o contenido explicativo').nullable().optional(),
    src: z.string().describe('Ruta de imagen: únicamente assets/uca-logo.svg o assets/favicon.svg; no inventar rutas').nullable().optional(),
    properties: z.record(
        z.string(),
        z.unknown(),
    ).nullable().optional(),
    qualities: qualitiesSchema
        .describe('Cualidades visuales ontológicas: estructurar presencia y materialidad mediante superficie delimitada (surface: \'card\' o \'muted\'), borde perimetral (border: \'subtle\'), esquinas (radius: \'medium\' o \'large\'), relleno interno (spacing: \'medium\') y respiración (gap: \'small\' o \'medium\'). Para botones primarios, contrastar (surface: \'brand\', textColor: \'dark\'). Para imágenes o logos, acotar tamaño con width: \'small\' o \'medium\'')
        .nullable(),
    attributes: z.record(
        z.string(),
        z.unknown(),
    ).nullable().optional(),
});

export const viewCompositionSchema = z.object({
    components: z.array(componentItemSchema).min(2).describe('Árbol fractal completo de componentes ontológicos que materializan la vista. Organiza la información en módulos y tarjetas visuales delimitadas (box con surface \'card\', border \'subtle\', padding), con títulos, párrafos, acciones y campos interactivos, logrando una estética visual limpia, moderna y con contraste'),
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

export type ComponentItem = z.infer<typeof componentItemSchema>;
export type ViewComposition = z.infer<typeof viewCompositionSchema>;
export type BuildPayload = z.infer<typeof buildPayloadSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;
export type Body = z.infer<typeof bodySchema>;

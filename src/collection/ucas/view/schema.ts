import { z } from 'zod';
import {
    qualitiesSchema as visualQualitiesSchema,
} from '@uca/capability-css/schema';
import { areaSchema } from '@uca/layout/schema';

export const qualitiesSchema = visualQualitiesSchema
    .describe('Abstract visual Lego tokens; combine them to compose layout and appearance');

export const componentItemSchema = z.object({
    id: z.string().describe('Identificador único del componente en el grafo').optional(),
    parentId: z.string().describe('Identificador del componente padre dentro de esta área, o vacío para el contenedor raíz de la vista. Prohibido usar "root" o áreas externas').optional(),
    component: z.string().describe('Tipo ontológico de UCA disponible en visualPrimitives. Selecciona la primitiva cuyo propósito satisfaga el contenido, la interacción o la estructura requerida.').nullable().optional().default('box'),
    content: z.string().describe('Texto visible, titular, etiqueta o descripción del elemento').nullable().optional(),
    label: z.string().describe('Etiqueta textual visible para acciones o botones').nullable().optional(),
    title: z.string().describe('Título textual del componente').nullable().optional(),
    text: z.string().describe('Cuerpo de texto o contenido explicativo').nullable().optional(),
    src: z.string().describe('Ruta de imagen: únicamente assets/uca-logo.svg o assets/favicon.svg; no inventar rutas').nullable().optional(),
    items: z.array(z.unknown()).describe('Elementos o alternativas para choice, options, dropdown, list o collection').nullable().optional(),
    value: z.unknown().describe('Valor numérico, seleccionado o actual para range, quantity, status o progress').nullable().optional(),
    minimum: z.number().describe('Límite inferior para range o quantity').nullable().optional(),
    maximum: z.number().describe('Límite superior para range o quantity').nullable().optional(),
    unit: z.string().describe('Unidad de medida para quantity').nullable().optional(),
    step: z.number().describe('Paso de incremento para range o quantity').nullable().optional(),
    disabled: z.boolean().describe('Estado deshabilitado').nullable().optional(),
    properties: z.record(
        z.string(),
        z.unknown(),
    ).nullable().optional(),
    qualities: qualitiesSchema
        .describe('Cualidades visuales ontológicas del componente')
        .nullable()
        .optional(),
});

export const viewCompositionSchema = z.object({
    components: z.array(componentItemSchema).min(2).describe('Árbol fractal completo de componentes ontológicos que materializan la vista. La jerarquía, primitivas y cualidades se infieren desde el propósito, el área, visualPrimitives y visualLanguage suministrados.'),
});

export const viewBodySchema = z.object({
    id: z.string().optional(),
    containerElement: z.string().optional(),
    area: areaSchema.optional().describe('Especificación del área donde se materializan los componentes'),
    browser: z.record(
        z.string(),
        z.unknown(),
    ).optional().describe('Dimensiones y capacidades del navegador'),
    specification: z.unknown().optional().describe('Especificación funcional del sistema'),
    limits: z.record(
        z.string(),
        z.unknown(),
    ).optional().describe('Límites operativos, dimensionales o de viewport definidos para el contexto'),
});

export const bodySchema = viewBodySchema;

export const buildPayloadSchema = z.object({
    aim: z.object({
        description: z.string().min(1).describe('Intención cognitiva u objetivo del estímulo de vista'),
        body: bodySchema.required({
            area: true,
        }).describe('Cuerpo de dominio con el área obligatoria a materializar y contexto'),
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

export const createdResultSchema = z.object({
    areaId: z.string().optional(),
    context: z.record(
        z.string(),
        z.unknown(),
    ).optional(),
});

export const renderedResultSchema = z.object({
    elementId: z.string().optional(),
    context: z.unknown().optional(),
});

export type ComponentItem = z.infer<typeof componentItemSchema>;
export type ViewComposition = z.infer<typeof viewCompositionSchema>;
export type ViewBody = z.infer<typeof viewBodySchema>;
export type Body = ViewBody;
export type BuildPayload = z.infer<typeof buildPayloadSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;
export type CreatedResult = z.infer<typeof createdResultSchema>;
export type RenderedResult = z.infer<typeof renderedResultSchema>;

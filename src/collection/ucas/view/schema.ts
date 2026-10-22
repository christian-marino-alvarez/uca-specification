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
    properties: z.record(
        z.string(),
        z.unknown(),
    ).nullable().optional(),
    qualities: qualitiesSchema
        .describe('Cualidades visuales ontológicas delimitadas por UCA: ' +
            'Para box con hijos: debe declarar direction o division para expresar el flujo de sus descendientes, nunca ambos. Si tiene dos o más hijos directos, debe declarar gap ("small"|"medium") para separarlos entre sí. Usa order solo si el orden visual debe diferir del orden semántico del árbol. flex dimensiona el box dentro de su padre y no activa ni sustituye el flujo. Para box hoja: no declares direction, division ni gap sin descendientes. ' +
            'Para box (tarjetas y contenedores): respiración interna perimetral obligatoria mediante padding (spacing: "medium"|"large") si tiene surface ("card"|"muted") o border ("subtle") para que su contenido no toque los bordes; layout (direction: "row"|"column", division: "halves"|"thirds"|"sidebar-main"|"auto", gap: "small"|"medium"), dimensiones (width, height, flex: "fill"|"none", span), apariencia (surface: "card"|"muted", border: "subtle", radius: "medium", elevation: "low"|"medium", overflow: "hidden"|"auto"). ' +
            'Para heading (titulares): tipografía (textSize: "xlarge"|"large"|"medium", fontWeight: "bold"|"semibold", textColor: "light"|"brand", lineHeight: "tight"), separación (marginBlock: "small"|"none"), flex: "none". Prohibido ponerle surface o border de tarjeta. ' +
            'Para paragraph (textos): tipografía (textSize: "small"|"medium", textColor: "muted"|"light", lineHeight: "normal"), separación (marginBlock: "small"|"none"). ' +
            'Para action (botones): apariencia (surface: "brand"|"card"|"transparent", border: "subtle"|"none", radius: "medium"|"full"), respiración interna (spacingInline: "medium"|"large", spacingBlock: "small"), tipografía (textSize: "small", fontWeight: "medium", textColor: "dark"|"light"), flex: "none". ' +
            'Para input (campos): dimensiones (width: "full", height: "medium"), respiración interna (spacingInline: "small", spacingBlock: "small"), apariencia (surface: "card", border: "subtle", radius: "medium", textColor: "light", textSize: "small"). ' +
            'Para picture (logos e iconos): dimensiones (width: "small"|"medium", height: "auto", maxWidth: "full"), forma (radius: "small"|"full"), flex: "none". Prohibido añadirle padding.'),
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
});

export const bodySchema = viewBodySchema;

export const buildPayloadSchema = z.object({
    aim: z.object({
        description: z.string().min(1).describe('Intención cognitiva u objetivo del estímulo de vista'),
        body: bodySchema.required({
            area: true,
        }).describe('Cuerpo de dominio con el área obligatoria a materializar y contexto'),
    }),
    limits: z.record(
        z.string(),
        z.unknown(),
    ).describe('Restricciones operativas (viewport, dimensiones, cuotas)'),
    correlationId: z.string().min(1).describe('Identificador para trazabilidad nerviosa'),
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

export const createdResultSchema = z.object({
    areaId: z.string().optional(),
    correlationId: z.string().optional(),
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

import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';

export const componentTypeSchema = z.enum([
  'box',
  'card',
  'list',
  'heading',
  'paragraph',
  'separator',
  'symbol',
  'status',
  'progress',
  'picture',
  'chip',
  'action',
  'access',
  'input',
  'toggle',
  'choice',
  'slider',
  'range',
  'quantity',
  'moment',
  'dialog',
  'toast',
]);

export const componentQualitiesSchema = visualQualitiesSchema.pick({
  alignment: true,
  direction: true,
  distribution: true,
  division: true,
  elevation: true,
  flex: true,
  fontWeight: true,
  gap: true,
  height: true,
  outline: true,
  overflow: true,
  shape: true,
  spacing: true,
  surface: true,
  textAlign: true,
  textColor: true,
  textSize: true,
  variant: true,
  width: true,
});

export const portSummarySchema = z.object({
  signal: z.string(),
  type: z.string(),
  description: z.string().optional(),
});

export const webUcaDescriptorSchema = z.object({
  purpose: z.string(),
  intention: z.string(),
  component: componentTypeSchema,
  limits: z.array(z.string()),
  inputs: z.array(portSummarySchema),
  outputs: z.array(portSummarySchema),
});

export const logicUcaDescriptorSchema = z.object({
  purpose: z.string(),
  intention: z.string(),
  id: z.string(),
  limits: z.array(z.string()),
  inputs: z.array(portSummarySchema),
  outputs: z.array(portSummarySchema),
});

export const componentSchema = z.object({
  purpose: z.string().min(10).max(90).describe('Propósito ontológico inmutable, acotado y directo del área o componente Web UCA (1 frase breve y directa de 4 a 12 palabras): define qué es dentro de su contenedor padre.'),
  intention: z.string().min(120).describe('Intención modulada de cómo debe exponerse el área o componente Web UCA, articulando tres dimensiones: 1) Expectativa: qué expone (texto literal, titular, icono, ítems, rango, valores o destino) y qué resultado aporta al usuario; 2) Intención funcional: cómo responde al situarse encima (over/hover), qué ocurre al hacer click o interactuar (ej. abrir dialog modal, mostrar toast, filtrar o navegar), qué parámetros envía a otro componente (por su id) o UCA de lógica mediante outputs y cómo reacciona por inputs ante otra UCA visual; 3) Intención visual: tamaño de fuente (textSize), peso (fontWeight), color (textColor), superficie (surface), forma (shape), contorno (outline) y espaciado (spacing) en reposo, y a qué color o iluminación cambia en over/hover o activo.'),
  id: z.string().min(1).describe('context.area.id al definir el contenedor del área visual en el primer elemento, o identificador kebab-case único para cada componente Web UCA hijo dentro del área'),
  parentId: z.string().min(1).describe('context.area.id para el contenedor del área visual y los componentes de primer nivel, o id de un componente contenedor (box o card) emitido previamente'),
  component: componentTypeSchema.describe('UCA Web especializada del catálogo (context.webUcas): contenedores estructurales (box, card), tipografía (heading, paragraph, separator), indicadores (symbol, status, progress, chip, picture, list) o controles interactivos (action, access, input, toggle, choice, slider, range, quantity, moment, dialog, toast)'),
  qualities: componentQualitiesSchema.describe('Cualidades visuales, tipográficas y espaciales de Material Design 3 obligatorias que definen el diseño esperado del área o componente respetando el diseño global de la aplicación y sus límites'),
});

export const compositionSchema = z.object({
  components: z.array(
    componentSchema,
  ).min(1).describe('Secuencia ordenada que comienza definiendo el área visual contenedora (id === context.area.id, component: box) seguida de los elementos Web UCA hijos de forma que cada contenedor padre (box o card) aparezca antes que sus hijos'),
});

export const repairCompositionSchema = z.object({
  components: z.array(
    componentSchema,
  ).min(1).max(1).describe('Único componente reparado que sustituye al componente rechazado'),
});

export const areaSchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().min(1),
  parentId: z.string().optional(),
  dimensions: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
  qualities: z.record(
    z.string(),
    z.unknown(),
  ).optional(),
}).passthrough();

export const specificationSchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  tone: z.string().optional(),
  interactiveFeatures: z.array(z.string()).optional(),
  visualDispositions: z.unknown().optional(),
  audience: z.unknown().optional(),
  limits: z.array(z.string()).optional(),
});

export const bodySchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  id: z.string().optional(),
  context: z.string().optional(),
  source: z.string().optional(),
  area: areaSchema.optional().describe('Área visual hija de un layout donde se define y materializa la vista'),
  siblingAreas: z.array(areaSchema).optional().describe('Áreas hermanas del mismo layout para evitar duplicar paneles o funciones ya cubiertas'),
  specification: specificationSchema.optional().describe('Especificación global de diseño, funcionalidad y límites de la aplicación'),
  webUcas: z.array(webUcaDescriptorSchema).optional().describe('Catálogo de UCAs Web con sus propósitos, intenciones, límites, inputs y outputs'),
  logicUcas: z.array(logicUcaDescriptorSchema).optional().describe('Catálogo de UCAs de Lógica con sus propósitos, intenciones, límites, inputs y outputs'),
  components: z.array(componentSchema).optional().describe('Elementos Web UCA hidratados y materializados en la vista'),
  pendingComponent: componentSchema.optional().describe('Componente Web UCA en curso de hidratación y renderizado reactivo'),
});

export const builtResultSchema = z.object({
  areaId: z.string(),
  components: z.array(componentSchema),
});

export const errorSchema = z.unknown();

export type ComponentType = z.infer<typeof componentTypeSchema>;
export type PortSummary = z.infer<typeof portSummarySchema>;
export type WebUcaDescriptor = z.infer<typeof webUcaDescriptorSchema>;
export type LogicUcaDescriptor = z.infer<typeof logicUcaDescriptorSchema>;
export type Qualities = z.infer<typeof componentQualitiesSchema>;
export type Component = z.infer<typeof componentSchema>;
export type Composition = z.infer<typeof compositionSchema>;
export type Area = z.infer<typeof areaSchema>;
export type Specification = z.infer<typeof specificationSchema>;
export type Body = z.infer<typeof bodySchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;

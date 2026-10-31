import { z } from 'zod';
import { qualitiesSchema as visualQualitiesSchema } from '@uca/capability-css/schema';
import {
  dimensionsSchema,
  materialModelSchema,
} from '@uca/capability-material/schema';

export const qualitiesSchema = visualQualitiesSchema.optional();

export const containerQualitiesSchema = visualQualitiesSchema.omit({
  fontWeight: true,
  lineHeight: true,
  marginBlock: true,
  marginInline: true,
  maxWidth: true,
  minHeight: true,
  minWidth: true,
  order: true,
  outlineBottom: true,
  outlineLeft: true,
  outlineRight: true,
  outlineTop: true,
  spacingBlock: true,
  spacingInline: true,
  textAlign: true,
  textColor: true,
  textSize: true,
  typeface: true,
  variant: true,
});

export const spatialQualitiesSchema = containerQualitiesSchema.required({
  direction: true,
  flex: true,
  height: true,
  overflow: true,
  width: true,
});

export const areaSchema = z.object({
  purpose: z.string().min(10).max(90).describe('Propósito ontológico inmutable, acotado y directo del área (1 frase breve y directa de 4 a 12 palabras): define qué es el área.'),
  intention: z.string().min(100).describe('Intención modulada de cómo debe exponerse el área para cumplir su propósito, articulando tres dimensiones: 1) Expectativa (qué experiencia y responsabilidad resuelve para el usuario dentro de la vista), 2) Intención funcional (qué capacidades interactivas, controles, flujos de señales e indicadores de context.specification.interactiveFeatures alberga sin solaparse con context.siblingAreas), y 3) Intención visual (cómo se expone en Material Design 3: superficie tonal, jerarquía espacial, contención y presencia en el layout).'),
  id: z.string().min(1).describe('Identificador del área: usar context.area.id para el primer elemento (el propio contenedor objetivo) e identificadores semánticos únicos para cada una de sus áreas hijas directas'),
  qualities: spatialQualitiesSchema.describe('Cualidades espaciales de Box en Material Design 3: width, height, flex, direction y overflow obligatorios (direction fija el eje donde se reparten sus hijos; division opcional convierte el área en cuadrícula y prevalece sobre direction; overflow: hidden en contenedores estructurales y auto o hidden en áreas terminales); gap, spacing, surface, shape y outline coherentes con el eje del contenedor'),
});

export const repairCompositionSchema = z.object({
  areas: z.array(
    areaSchema,
  ).min(1).max(1).describe('Único elemento de área reparado que sustituye al elemento rechazado'),
});

export const designSchema = materialModelSchema.pick({
  windowSizeRule: true,
  canonicalLayouts: true,
  spatialPrinciples: true,
});

export const specificationSchema = z.object({
  purpose: z.string().optional(),
  intention: z.string().optional(),
  tone: z.string().optional(),
  interactiveFeatures: z.unknown().optional(),
  visualDispositions: z.unknown().optional(),
  audience: z.unknown().optional(),
  limits: z.unknown().optional(),
});

export const containerAreaSchema = z.object({
  purpose: z.string().min(1).optional(),
  intention: z.string().min(1).optional(),
  id: z.string().min(1),
  parentId: z.string().min(1).optional(),
  dimensions: dimensionsSchema.optional().describe('Dimensiones físicas disponibles del contenedor en píxeles'),
  qualities: qualitiesSchema,
}).passthrough();

export const compositionSchema = z.object({
  areas: z.array(
    areaSchema,
  ).min(3).describe('Secuencia ordenada de áreas donde el primer elemento es el propio contenedor objetivo (id === context.area.id) con la dirección o división donde se contendrán sus hijos, seguido de sus áreas hijas directas de primer nivel'),
});

export const bodySchema = z.object({
  id: z.string().optional(),
  context: z.string().optional(),
  source: z.string().optional(),
  area: containerAreaSchema.optional().describe('Contenedor objetivo a particionar con sus dimensiones disponibles'),
  siblingAreas: z.array(containerAreaSchema).optional().describe('Áreas hermanas ya definidas en el mismo contenedor padre'),
  areas: z.array(areaSchema).optional().describe('Áreas hijas generadas en la partición del layout'),
  browser: z.record(
    z.string(),
    z.unknown(),
  ).optional().describe('Dimensiones y capacidades del navegador'),
  specification: specificationSchema.optional().describe('Especificación estructural y experiencial del sistema'),
  design: designSchema.optional().describe('Regla de tamaño de ventana y layouts canónicos de Material Design 3 provistos por la capability Material'),
  limits: z.record(
    z.string(),
    z.unknown(),
  ).optional().describe('Límites operativos y dimensionales del contexto'),
});

export const areaCreatedSchema = z.object({
  area: areaSchema,
});

export const builtResultSchema = z.object({
  areaId: z.string(),
  areas: z.array(areaSchema),
});

export const errorSchema = z.object({
  error: z.string(),
}).passthrough();

export type Area = z.infer<typeof areaSchema>;
export type Design = z.infer<typeof designSchema>;
export type Specification = z.infer<typeof specificationSchema>;
export type ContainerArea = z.infer<typeof containerAreaSchema>;
export type Composition = z.infer<typeof compositionSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type AreaCreated = z.infer<typeof areaCreatedSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;

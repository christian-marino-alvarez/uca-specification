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
  textAlign: true,
  textColor: true,
  textSize: true,
  typeface: true,
});

export const directionQualitiesSchema = containerQualitiesSchema.required({
  direction: true,
});

export const divisionQualitiesSchema = containerQualitiesSchema.required({
  division: true,
});

export const spatialQualitiesSchema = z.union([
  directionQualitiesSchema,
  divisionQualitiesSchema,
]);

export const areaSchema = z.object({
  id: z.string().min(1).describe('Identificador del área: usar context.area.id para el primer elemento (el propio contenedor objetivo) e identificadores semánticos únicos para cada una de sus áreas hijas directas'),
  purpose: z.string().min(1).describe('Propósito ontológico funcional del área (máximo 6-8 palabras)'),
  intention: z.string().min(1).describe('Estrategia de composición funcional del área (máximo 6-8 palabras)'),
  qualities: spatialQualitiesSchema.describe('Cualidades espaciales de Box en Material Design 3 (requiere direction o division, junto con las dimensiones, superficie, forma, espaciado o separación coherentes con el eje del contenedor)'),
});

export const containerAreaSchema = z.object({
  id: z.string().min(1),
  parentId: z.string().min(1).optional(),
  purpose: z.string().min(1).optional(),
  intention: z.string().min(1).optional(),
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
  areas: z.array(areaSchema).optional().describe('Áreas hijas generadas en la partición del layout'),
  browser: z.record(
    z.string(),
    z.unknown(),
  ).optional().describe('Dimensiones y capacidades del navegador'),
  specification: z.unknown().optional().describe('Especificación funcional y experiencial del sistema'),
  design: materialModelSchema.optional().describe('Sistema de distribución espacial y layouts canónicos de Material Design 3 provisto por la capability Material'),
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
export type ContainerArea = z.infer<typeof containerAreaSchema>;
export type Composition = z.infer<typeof compositionSchema>;
export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type AreaCreated = z.infer<typeof areaCreatedSchema>;
export type BuiltResult = z.infer<typeof builtResultSchema>;

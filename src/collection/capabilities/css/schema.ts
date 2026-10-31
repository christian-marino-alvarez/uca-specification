import { z } from 'zod';
import {
  DESIGN_TOKENS,
  HEIGHT_ONLY_DIMENSIONS,
  WIDTH_ONLY_DIMENSIONS,
} from './constants.js';
import type { DesignToken } from './types.js';

const tokenSchema = (
  group: Record<string, unknown>,
  description: string,
) => {
  const entries = Object.entries(group).filter(([
    name,
  ]) => !name.startsWith('$'));
  const meanings = entries.map(([
    name,
    token,
  ]) => {
    const {
      $description,
      $value,
    } = token as DesignToken<string | number>;
    return `${name} (${String($value)}): ${$description}`;
  });
  return z.enum(entries.map(([
    name,
  ]) => name)).describe(`${description}. Tokens: ${meanings.join('; ')}.`);
};

export const dimensionSchema = tokenSchema(
  Object.fromEntries(
    Object.entries(DESIGN_TOKENS.dimensions).filter(([
      name,
    ]) => !HEIGHT_ONLY_DIMENSIONS.includes(name)),
  ),
  'Token de dimensión horizontal abstracta',
);

export const heightDimensionSchema = tokenSchema(
  Object.fromEntries(
    Object.entries(DESIGN_TOKENS.dimensions).filter(([
      name,
    ]) => !WIDTH_ONLY_DIMENSIONS.includes(name)),
  ),
  'Token de dimensión vertical abstracta',
);

const maximumDimensionSchema = tokenSchema(
  Object.fromEntries(
    Object.entries(DESIGN_TOKENS.dimensions).filter(([
      name,
    ]) => name !== 'auto' && !HEIGHT_ONLY_DIMENSIONS.includes(name)),
  ),
  'Token de dimensión máxima abstracta',
);

export const designTokenSchema = z.object({
  $value: z.unknown(),
  $type: z.string().optional(),
  $description: z.string().optional(),
});

export const qualitiesSchema = z.object({
  width: dimensionSchema.optional().describe('Ancho preferido de este elemento; no selecciona un layout para los hijos'),
  height: heightDimensionSchema.optional().describe('Alto preferido de este elemento'),
  maxWidth: maximumDimensionSchema.optional().describe('Límite superior explícito de ancho; si se omite no se añade máximo'),
  minWidth: dimensionSchema.optional().describe('Límite inferior explícito de ancho'),
  minHeight: heightDimensionSchema.optional().describe('Límite inferior explícito de alto'),
  spacing: tokenSchema(DESIGN_TOKENS.spacing, 'Relleno interno (padding) en todos los lados; no crea espacio (gap) entre hijos').optional(),
  spacingInline: tokenSchema(DESIGN_TOKENS.spacing, 'Relleno interno en ambos lados del eje en línea (inline); sobrescribe spacing en este eje').optional(),
  spacingBlock: tokenSchema(DESIGN_TOKENS.spacing, 'Relleno interno en ambos lados del eje en bloque (block); sobrescribe spacing en este eje').optional(),
  marginInline: tokenSchema(DESIGN_TOKENS.spacing, 'Margen externo en ambos lados del eje en línea').optional(),
  marginBlock: tokenSchema(DESIGN_TOKENS.spacing, 'Margen externo en ambos lados verticales (block); crea espacio vertical entre elementos').optional(),
  order: z.number().int().describe('Secuencia visual explícita entre hermanos flex o grid; omitir cuando el orden semántico del DOM ya sea el orden visual').optional(),
  gap: tokenSchema(DESIGN_TOKENS.spacing, 'Espacio entre hijos en un layout flex o grid; no añade padding ni activa flex por sí mismo').optional(),
  surface: tokenSchema(DESIGN_TOKENS.surface, 'Rol de color de fondo (tokens del sistema / Material Design 3). Combinar con un textColor de contraste adecuado').optional(),
  variant: tokenSchema(DESIGN_TOKENS.variant, 'Variante canónica de componente Material Design 3 (elevated, filled, tonal, outlined, text)').optional(),
  textColor: tokenSchema(DESIGN_TOKENS.textColor, 'Color de texto en primer plano independiente del fondo; heredado por los descendientes salvo que se sobrescriba. dark es para superficies claras de marca o acento; light y muted son para superficies oscuras. Nunca seleccionar un color de texto con el mismo token que su superficie').optional(),
  typeface: tokenSchema(DESIGN_TOKENS.typeface, 'Familia tipográfica; heredada por los descendientes salvo que se sobrescriba').optional(),
  textSize: tokenSchema(DESIGN_TOKENS.textSize, 'Tamaño de fuente; heredado por los descendientes salvo que se sobrescriba').optional(),
  fontWeight: tokenSchema(DESIGN_TOKENS.fontWeight, 'Peso de fuente; heredado por los descendientes salvo que se sobrescriba').optional(),
  lineHeight: tokenSchema(DESIGN_TOKENS.lineHeight, 'Multiplicador de altura de línea sin unidad; heredado por los descendientes salvo que se sobrescriba').optional(),
  textAlign: tokenSchema(DESIGN_TOKENS.textAlign, 'Alineación del texto dentro de su caja de línea; no posiciona elementos hijos').optional(),
  elevation: tokenSchema(DESIGN_TOKENS.elevation, 'Sombra de elevación de la caja').optional(),
  shape: tokenSchema(DESIGN_TOKENS.shape, 'Escala de curvatura de esquinas Material Design 3 (none, extraSmall, small, medium, large, extraLarge, full)').optional(),
  outline: tokenSchema(DESIGN_TOKENS.outline, 'Contorno perimetral Material Design 3 (none, subtle, strong, dashed)').optional(),
  outlineBottom: tokenSchema(DESIGN_TOKENS.outline, 'Contorno inferior de este elemento').optional(),
  outlineTop: tokenSchema(DESIGN_TOKENS.outline, 'Contorno superior de este elemento').optional(),
  outlineRight: tokenSchema(DESIGN_TOKENS.outline, 'Contorno derecho de este elemento').optional(),
  outlineLeft: tokenSchema(DESIGN_TOKENS.outline, 'Contorno izquierdo de este elemento').optional(),
  direction: tokenSchema(DESIGN_TOKENS.direction, 'Activa layout flex y selecciona su eje principal (row, column). Mutuamente excluyente con division').optional(),
  alignment: tokenSchema(DESIGN_TOKENS.alignment, 'Alineación de elementos en el eje transversal (start, center, end, stretch, baseline)').optional(),
  distribution: tokenSchema(DESIGN_TOKENS.distribution, 'Distribución de elementos en el eje principal (start, center, end, between, around, evenly)').optional(),
  wrap: tokenSchema(DESIGN_TOKENS.wrap, 'Comportamiento de salto de línea flex (nowrap, wrap, reverse)').optional(),
  division: tokenSchema(DESIGN_TOKENS.division, 'División de pistas en layout grid. Mutuamente excluyente con direction y wrap').optional(),
  span: tokenSchema(DESIGN_TOKENS.span, 'Cobertura de celdas de cuadrícula para el área hija (single, double, triple, full)').optional(),
  flex: tokenSchema(DESIGN_TOKENS.flex, 'Dimensionamiento flex y comportamiento de crecimiento/encogimiento (none, initial, auto, fill, grow, shrink)').optional(),
  overflow: tokenSchema(DESIGN_TOKENS.overflow, 'Contención de desbordamiento del contenedor (visible, hidden, auto, scroll)').optional(),
});

export const bodySchema = z.object({
  id: z.string().optional(),
  qualities: qualitiesSchema.optional(),
});

export const mountPayloadSchema = z.object({}).passthrough().optional();

export const mountedResultSchema = z.object({
  mounted: z.boolean(),
});

export const resolvePayloadSchema = z.object({
  elementId: z.string().min(1),
  qualities: qualitiesSchema,
});

export const resolvedResultSchema = z.object({
  elementId: z.string().min(1),
  declarations: z.record(
    z.string(),
    z.string(),
  ),
  cssText: z.string().min(1),
});

export const applyPayloadSchema = z.object({
  elementId: z.string().min(1),
  cssText: z.string().min(1),
  declarations: z.record(
    z.string(),
    z.string(),
  ).optional(),
  control: z.string().optional(),
});

export const removePayloadSchema = z.object({
  elementId: z.string().min(1),
});

export const appliedResultSchema = z.object({
  elementId: z.string().min(1),
  declarations: z.record(
    z.string(),
    z.string(),
  ),
});

export const removedResultSchema = z.object({
  elementId: z.string().min(1),
  removed: z.boolean(),
});

export const errorSchema = z.object({
  error: z.string(),
}).passthrough();

export type Qualities = z.infer<typeof qualitiesSchema>;
export type Body = z.infer<typeof bodySchema>;
export type MountPayload = z.infer<typeof mountPayloadSchema>;
export type MountedResult = z.infer<typeof mountedResultSchema>;
export type ResolvePayload = z.infer<typeof resolvePayloadSchema>;
export type ResolvedResult = z.infer<typeof resolvedResultSchema>;
export type ApplyPayload = z.infer<typeof applyPayloadSchema>;
export type RemovePayload = z.infer<typeof removePayloadSchema>;
export type AppliedResult = z.infer<typeof appliedResultSchema>;
export type RemovedResult = z.infer<typeof removedResultSchema>;
export type ErrorResult = z.infer<typeof errorSchema>;

import { z } from 'zod';

export const attributesSchema = z.record(z.string(), z.string());

export const bodySchema = z.object({
  id: z.string().optional(),
  attributes: attributesSchema.optional(),
  content: z.string().optional(),
  events: z.array(z.string()).readonly().optional(),
  defaultTag: z.string().optional(),
});

export const renderPayloadSchema = z.object({
  elementId: z.string().optional(),
  tag: z.string().optional(),
  containerElement: z.string().optional(),
  attributes: attributesSchema.optional(),
  content: z.string().optional(),
  events: z.array(z.string()).readonly().optional(),
  context: z.unknown().optional(),
});

export const updatePayloadSchema = z.object({
  elementId: z.string().optional(),
  attributes: attributesSchema.optional(),
  content: z.string().optional(),
  events: z.array(z.string()).readonly().optional(),
  context: z.unknown().optional(),
});

export const removePayloadSchema = z.object({
  elementId: z.string().optional(),
  context: z.unknown().optional(),
});

export const renderedResultSchema = z.object({
  elementId: z.string(),
  tag: z.string(),
  context: z.unknown().optional(),
});

export const updatedResultSchema = z.object({
  elementId: z.string(),
  updated: z.boolean(),
  context: z.unknown().optional(),
});

export const removedResultSchema = z.object({
  elementId: z.string(),
  removed: z.boolean(),
  context: z.unknown().optional(),
});

export const eventContextSchema = z.object({
  elementId: z.string(),
  rootElementId: z.string().optional(),
  event: z.string(),
  action: z.string().optional(),
  value: z.unknown().optional(),
  checked: z.boolean().optional(),
  detail: z.unknown().optional(),
  context: z.unknown().optional(),
});

export const errorSchema = z.unknown();

export type Body = z.infer<typeof bodySchema>;
export type RenderPayload = z.infer<typeof renderPayloadSchema>;
export type UpdatePayload = z.infer<typeof updatePayloadSchema>;
export type RemovePayload = z.infer<typeof removePayloadSchema>;
export type RenderedResult = z.infer<typeof renderedResultSchema>;
export type UpdatedResult = z.infer<typeof updatedResultSchema>;
export type RemovedResult = z.infer<typeof removedResultSchema>;
export type EventContext = z.infer<typeof eventContextSchema>;


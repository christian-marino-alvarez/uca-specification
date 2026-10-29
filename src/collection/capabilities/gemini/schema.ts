import type { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

export const thinkingLevelSchema = z.enum([
  'minimal',
  'low',
  'medium',
  'high',
]);

export const connectionConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
  defaultModel: z.string().optional(),
});

export const connectionStatusSchema = z.object({
  status: z.string(),
  connection: connectionConfigSchema.optional(),
});

export const generatePayloadSchema = z.object({
  id: z.string().optional(),
  sessionId: z.string().optional(),
  streamId: z.string().optional(),
  prompt: z.string(),
  systemInstruction: z.string().optional(),
  schema: z.union([
    z.string(),
    z.record(z.string(), z.unknown()),
  ]).optional(),
  model: z.string().optional(),
  temperature: z.number().optional(),
  maxOutputTokens: z.number().optional(),
  thinkingBudget: z.number().optional(),
  thinkingLevel: thinkingLevelSchema.optional(),
  responseMimeType: z.string().optional(),
});

export const generateResultSchema = z.object({
  sessionId: z.string().optional(),
  prompt: z.string(),
  text: z.string().optional(),
  data: z.unknown().optional(),
  model: z.string().optional(),
  usage: z.record(z.string(), z.unknown()).optional(),
});

export const chunkResultSchema = z.object({
  sessionId: z.string().optional(),
  streamId: z.string().optional(),
  text: z.string(),
  prompt: z.string().optional(),
  model: z.string().optional(),
});

export const streamEndResultSchema = z.object({
  sessionId: z.string().optional(),
  streamId: z.string().optional(),
  prompt: z.string().optional(),
  model: z.string().optional(),
});

export const streamResultSchema = z.object({
  sessionId: z.string().optional(),
  streamId: z.string().optional(),
  stream: z.custom<ReadableStream<string>>(),
});

export const abortPayloadSchema = z.object({
  sessionId: z.string().optional(),
  streamId: z.string().optional(),
});

export const failureSchema = z.object({
  error: z.string(),
  status: z.number().optional(),
  model: z.string(),
  configuration: z.string(),
  schemaSize: z.number(),
  sessionId: z.string().optional(),
});

export const bodySchema = z.object({
  id: z.string().optional(),
  client: z.custom<GoogleGenAI>().optional(),
  connection: connectionConfigSchema.optional(),
  model: z.string().optional(),
  thinkingBudget: z.number().optional(),
  thinkingLevel: thinkingLevelSchema.optional(),
  temperature: z.number().optional(),
  maxOutputTokens: z.number().optional(),
  systemInstruction: z.string().optional(),
  responseMimeType: z.string().optional(),
});

export type ConnectionConfig = z.infer<typeof connectionConfigSchema>;
export type ConnectionStatus = z.infer<typeof connectionStatusSchema>;
export type GeneratePayload = z.infer<typeof generatePayloadSchema>;
export type GenerateResult = z.infer<typeof generateResultSchema>;
export type ChunkResult = z.infer<typeof chunkResultSchema>;
export type StreamEndResult = z.infer<typeof streamEndResultSchema>;
export type StreamResult = z.infer<typeof streamResultSchema>;
export type AbortPayload = z.infer<typeof abortPayloadSchema>;
export type Failure = z.infer<typeof failureSchema>;
export type Body = z.infer<typeof bodySchema>;


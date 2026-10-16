import type { z } from 'zod';
import type { bodySchema, identitySchema, definitionSchema } from './schema.js';
import type { InferPayload, InferResult } from '@uca/llm/types';
export type Body = z.infer<typeof bodySchema>;
export type Identity = z.infer<typeof identitySchema>;
export type Definition = z.infer<typeof definitionSchema>;
export interface DesignPayload { readonly areaId: string; readonly purpose: string; readonly brief: string; readonly interaction?: unknown; readonly previousIdentity?: Identity; readonly correlationId: string; }
export interface Correlation { readonly owner: string; readonly correlationId: string; }
export type Request = InferPayload;
export type Result = InferResult;
export enum RoleKind { SURFACE = 'surface', TEXT = 'text', INPUT = 'input', ACTION = 'action' }
export enum SignalType { DESIGN = 'designer.design', ABORT = 'designer.abort', DESIGNED = 'designer.designed', ERROR = 'designer.error' }
export enum DataType { REQUEST = 'Request', DESIGN = 'Design', ERROR = 'Error' }

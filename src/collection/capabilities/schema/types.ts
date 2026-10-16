import type { z } from 'zod';
export interface Body { readonly schema?: z.ZodType; }
export interface ValidatePayload { readonly schema: z.ZodType; readonly value: unknown; readonly context?: unknown; }
export interface ValidatedResult { readonly value: unknown; readonly context?: unknown; }
export interface ErrorResult { readonly error: unknown; readonly context?: unknown; }
export enum SignalType { VALIDATE = 'schema.validate', VALIDATED = 'schema.validated', ERROR = 'schema.error' }
export enum DataType { VALUE = 'Value', RESULT = 'Result', ERROR = 'Error' }

export enum SignalType {
  CONNECT = 'gemini.connect',
  GENERATE = 'gemini.generate',
  STREAM = 'gemini.stream',
  ABORT = 'gemini.abort',
  STREAMED = 'gemini.streamed',
  CONNECTED = 'gemini.connected',
  GENERATED = 'gemini.generated',
  CHUNK = 'gemini.chunk',
  STREAM_END = 'gemini.stream-end',
  ERROR = 'gemini.error',
}

export enum DataType {
  CONNECTION_CONFIG = 'ConnectionConfig',
  GENERATE_PAYLOAD = 'GeneratePayload',
  CONNECTION_STATUS = 'ConnectionStatus',
  GENERATE_RESULT = 'GenerateResult',
  STREAM_RESULT = 'StreamResult',
  ABORT_PAYLOAD = 'AbortPayload',
  CHUNK_RESULT = 'ChunkResult',
  STREAM_END_RESULT = 'StreamEndResult',
  UNKNOWN = 'unknown',
}

export enum ThinkingLevel {
  MINIMAL = 'minimal',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface ActiveStream {
  readonly controller: AbortController;
  readonly sessionId: string;
}

export type StreamIterator = AsyncIterator<{ text?: string }>;

export interface ApiFailure {
  readonly message?: string;
  readonly status?: number;
}

export type {
  AbortPayload,
  Body,
  ChunkResult,
  ConnectionConfig,
  ConnectionStatus,
  Failure,
  GeneratePayload,
  GenerateResult,
  StreamEndResult,
  StreamResult,
} from './schema.js';

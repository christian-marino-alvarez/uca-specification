import { Uca } from '@uca/core/uca';
import type {
  CapabilityConstructor,
  Cooky,
  Disposition,
  Signal,
} from '@uca/core/types';
import { HttpClient } from '@uca/capability-http-client';
import {
  SignalType as HttpSignalType,
  type ErrorPayload,
  type ResponsePayload,
} from '@uca/capability-http-client/types';
import { SseClient } from '@uca/capability-sse-client';
import {
  SignalType as SseSignalType,
  type StreamResult as SseStreamResult,
} from '@uca/capability-sse-client/types';
import { DEFAULT_ENDPOINT as DEFAULT_SSE_ENDPOINT } from '@uca/capability-sse-client/constants';
import { Zod } from '@uca/capability-zod';
import {
  SignalType as ZodSignalType,
  type ErrorResult,
  type ValidatedResult,
} from '@uca/capability-zod/types';
import type { z } from 'zod';
import { inferenceSchema } from './schema.js';
import {
  DEFAULT_ENDPOINT,
  DEFAULT_IMAGINATION,
  __ID__,
} from './constants.js';
import {
  DataType,
  SignalType,
  type AbortPayload,
  type Body,
  type InferPayload,
  type InferResult,
  type TransportContext,
} from './types.js';

export class Llm extends Uca<Body> {
  public static override purpose =
    'Solicitar inferencias cognitivas completas a través del backend de la aplicación';

  public static override disposition: Disposition<Body> = {
    aim: {
      description: Llm.purpose,
      body: {
        imagination: DEFAULT_IMAGINATION,
      },
    },
    reactTo: [
      SignalType.INFER,
      SignalType.STREAM,
      SignalType.ABORT,
      SignalType.CONNECT,
      ...Llm.reactToHttpClient(),
      ...Llm.reactToSseClient(),
      ...Llm.reactToZod(),
    ],
    inputs: [
      {
        signal: SignalType.INFER,
        type: DataType.INFER_PAYLOAD,
        schema: inferenceSchema,
        description: 'Petición de inferencia con propósito, objetivo/intención, contexto y esquema de salida',
      },
      {
        signal: SignalType.STREAM,
        type: DataType.INFER_PAYLOAD,
        schema: inferenceSchema,
        description: 'Petición de inferencia en streaming con propósito, objetivo/intención, contexto y esquema de salida',
      },
      {
        signal: SignalType.ABORT,
        type: DataType.ABORT_PAYLOAD,
        description: 'Abortar inferencia en curso',
      },
      {
        signal: SignalType.CONNECT,
        type: DataType.VOID,
        description: 'Señal de conexión para comprobación de estado',
      },
    ],
    outputs: [
      {
        signal: SignalType.INFERRED,
        type: DataType.INFER_RESULT,
        description: 'Resultado de inferencia conforme al esquema de salida',
      },
      {
        signal: SignalType.STREAMING,
        type: DataType.UNKNOWN,
        description: 'Confirmación de inicio de sesión de streaming',
      },
      {
        signal: SignalType.STREAMED,
        type: DataType.STREAM_RESULT,
        description: 'Fuente activa de respuesta en streaming desde SSE',
      },
      {
        signal: SignalType.STREAM_END,
        type: DataType.STREAM_END_RESULT,
        description: 'Sesión de streaming completada',
      },
      {
        signal: SignalType.CONNECTED,
        type: DataType.STRING,
        description: 'Confirmación del estado de conexión',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.UNKNOWN,
        description: 'Error de fallo de inferencia o incumplimiento de esquema',
      },
    ],
  };

  private static reactToSseClient(): string[] {
    const {
      reactTo = [],
    } = SseClient.disposition;
    return [
      ...reactTo,
      SseSignalType.STREAMED,
      SseSignalType.END,
      SseSignalType.ERROR,
    ];
  }

  private static reactToHttpClient(): string[] {
    const {
      reactTo = [],
    } = HttpClient.disposition;
    return [
      ...reactTo,
      HttpSignalType.RESPONSE,
      HttpSignalType.ERROR,
    ];
  }

  private static reactToZod(): string[] {
    const {
      reactTo = [],
    } = Zod.disposition;
    return [
      ...reactTo,
      ZodSignalType.VALIDATED,
      ZodSignalType.ERROR,
    ];
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override react(signal: Signal): void {
    const {
      property,
      source,
      value,
    } = signal;
    switch (property) {
      case SignalType.INFER:
        this.handleInfer(value as InferPayload, source);
        break;
      case SignalType.STREAM:
        this.handleStream(value as InferPayload, source);
        break;
      case SignalType.ABORT:
        this.handleAbort(value as AbortPayload);
        break;
      case SignalType.CONNECT:
        this.handleConnect();
        break;
      case ZodSignalType.VALIDATED:
        this.handleZodValidated(value as ValidatedResult);
        break;
      case ZodSignalType.ERROR:
        this.handleZodError(value as ErrorResult);
        break;
      case HttpSignalType.RESPONSE:
        this.handleBackendResponse(value as ResponsePayload);
        break;
      case HttpSignalType.ERROR:
        this.handleBackendError(value as ErrorPayload);
        break;
      case SseSignalType.STREAMED:
        this.handleSseStreamed(value as SseStreamResult);
        break;
      case SseSignalType.END:
        this.handleSseEnd(value as { sessionId?: string; context?: unknown });
        break;
      case SseSignalType.ERROR:
        this.handleSseError(value as ErrorPayload);
        break;
      default:
        break;
    }
  }

  protected override catalog(): Cooky {
    const httpClient = this.catalogHttpClient();
    const sseClient = this.catalogSseClient();
    const zod = this.catalogZod();
    return [
      httpClient,
      sseClient,
      zod,
    ];
  }

  private catalogHttpClient(): Cooky[number] {
    const disposition = this.createDisposition(
      HttpClient.disposition,
      HttpClient.AIM,
      'http-client',
    );
    return [
      HttpClient as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogSseClient(): Cooky[number] {
    const disposition = this.createDisposition(
      SseClient.disposition,
      SseClient.AIM,
      'sse-client',
      {
        endpoint: DEFAULT_SSE_ENDPOINT,
      },
    );
    return [
      SseClient as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogZod(): Cooky[number] {
    const disposition = this.createDisposition(
      Zod.disposition,
      Zod.AIM,
      'zod',
    );
    return [
      Zod as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private handleConnect(): void {
    this.pulse(SignalType.CONNECTED, 'connected');
  }

  private handleInfer(payload: InferPayload, replyTo: string): void {
    const {
      id,
      streamId,
    } = payload;
    const isStream = id === 'layout' || id === 'view' || Boolean(streamId);
    const operation = isStream ? SignalType.STREAM : SignalType.INFER;
    this.dispatchBackendRequest(payload, replyTo, operation);
  }

  private handleStream(payload: InferPayload, replyTo: string): void {
    this.dispatchBackendRequest(payload, replyTo, SignalType.STREAM);
  }

  private dispatchBackendRequest(
    payload: InferPayload,
    replyTo: string,
    operation: SignalType,
  ): void {
    const body = this.createBackendPayload(payload);
    this.pulse(ZodSignalType.VALIDATE, {
      context: {
        operation,
        replyTo,
      },
      schema: inferenceSchema,
      value: body,
    });
  }

  private createBackendPayload(payload: InferPayload): InferPayload {
    const {
      goal,
      intention,
      ...request
    } = payload;
    const resolvedIntention = intention ?? goal ?? '';
    return {
      ...this.body,
      ...request,
      intention: resolvedIntention,
      goal: goal ?? resolvedIntention,
    };
  }

  private handleZodValidated(result: ValidatedResult): void {
    const {
      context,
      value,
    } = result;
    const {
      operation,
      replyTo = '',
    } = (context ?? {}) as { operation?: SignalType; replyTo?: string };
    const body = this.normalizeOutputSchema(value as InferPayload);
    if (operation === SignalType.STREAM) {
      this.dispatchStreamRequest(body, replyTo);
    }
    else {
      this.dispatchHttpRequest(body, replyTo);
    }
  }

  private normalizeOutputSchema(body: InferPayload): InferPayload {
    const {
      outputSchema,
    } = body;
    const isZod = Boolean(outputSchema && typeof outputSchema === 'object' && 'safeParse' in outputSchema);
    const resolvedSchema = isZod ? Zod.toJsonSchema(outputSchema as z.ZodType) : outputSchema;
    return {
      ...body,
      outputSchema: resolvedSchema,
    };
  }

  private handleZodError(result: ErrorResult): void {
    const {
      context,
      error,
    } = result;
    const {
      replyTo,
    } = (context ?? {}) as { replyTo?: string };
    const target = replyTo ?? this.resultTarget();
    this.pulse(SignalType.ERROR, {
      error,
    }, target);
  }

  private dispatchStreamRequest(body: InferPayload, replyTo: string): void {
    this.pulse(SseSignalType.STREAM, {
      ...body,
      context: {
        ...body,
        replyTo,
      },
      endpoint: DEFAULT_SSE_ENDPOINT,
    });
  }

  private dispatchHttpRequest(body: InferPayload, replyTo: string): void {
    const {
      endpoint = DEFAULT_ENDPOINT,
    } = this.body ?? {};
    this.pulse(HttpSignalType.REQUEST, {
      context: {
        ...body,
        replyTo,
      },
      endpoint,
      payload: body,
    });
  }

  private handleSseStreamed(result: SseStreamResult): void {
    const {
      context,
      stream,
    } = result;
    const {
      replyTo,
      ...request
    } = (context ?? {}) as TransportContext;
    const target = replyTo ?? this.resultTarget();
    this.pulse(SignalType.STREAMED, {
      context: request.context ?? request,
      request,
      stream,
    }, target);
  }

  private handleSseEnd(result: { sessionId?: string; context?: unknown }): void {
    const {
      context,
    } = result;
    const {
      replyTo,
    } = (context ?? {}) as { replyTo?: string };
    const target = replyTo ?? this.resultTarget();
    this.pulse(SignalType.STREAM_END, {}, target);
  }

  private handleSseError(result: ErrorPayload): void {
    const {
      context,
      ...failure
    } = result;
    const {
      replyTo,
    } = (context ?? {}) as TransportContext;
    const target = replyTo ?? this.resultTarget();
    this.pulse(SignalType.ERROR, failure, target);
  }

  private handleBackendResponse(result: ResponsePayload): void {
    const {
      context,
      data,
    } = result;
    const {
      replyTo,
      ...request
    } = (context ?? {}) as TransportContext;
    const target = replyTo ?? this.resultTarget();
    this.pulse(SignalType.INFERRED, {
      ...(data as InferResult),
      request,
    }, target);
  }

  private handleBackendError(result: ErrorPayload): void {
    const {
      context,
      ...failure
    } = result;
    const {
      replyTo,
      ...request
    } = (context ?? {}) as TransportContext;
    const target = replyTo ?? this.resultTarget();
    this.pulse(SignalType.ERROR, {
      ...failure,
      request,
    }, target);
  }

  private handleAbort(value: AbortPayload): void {
    this.pulse(HttpSignalType.ABORT, value);
    this.pulse(SseSignalType.ABORT, value);
  }

  private resultTarget(): string | undefined {
    const {
      id,
    } = this;
    const boundary = id.lastIndexOf(':');
    return boundary < 0 ? undefined : id.slice(0, boundary);
  }
}

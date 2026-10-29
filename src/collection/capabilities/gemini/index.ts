import { Capability } from '@uca/core/capability';
import type {
  Disposition,
  Signal,
} from '@uca/core/types';
import {
  AIM,
  __ID__,
} from './constants.js';
import {
  abortPayloadSchema,
  connectionConfigSchema,
  connectionStatusSchema,
  failureSchema,
  generatePayloadSchema,
  generateResultSchema,
  streamResultSchema,
} from './schema.js';
import {
  describeFailure,
  executeGeneration,
  executeStream,
} from './stream.js';
import {
  DataType,
  SignalType,
  type AbortPayload,
  type ActiveStream,
  type Body,
  type ConnectionConfig,
  type GeneratePayload,
} from './types.js';

export class Gemini extends Capability<Body> {
  public static readonly AIM: string = AIM;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: Gemini.AIM,
      body: {},
    },
    reactTo: [
      SignalType.CONNECT,
      SignalType.GENERATE,
      SignalType.STREAM,
      SignalType.ABORT,
    ],
    inputs: [
      {
        signal: SignalType.ABORT,
        type: DataType.ABORT_PAYLOAD,
        schema: abortPayloadSchema,
        description: 'Abortar una generación o stream activo en curso',
        handler: Gemini.prototype.handleAbort,
      },
      {
        signal: SignalType.CONNECT,
        type: DataType.CONNECTION_CONFIG,
        schema: connectionConfigSchema,
        description: 'Configurar la conexión con la API de Google Gemini',
        handler: Gemini.prototype.handleConnect,
      },
      {
        signal: SignalType.GENERATE,
        type: DataType.GENERATE_PAYLOAD,
        schema: generatePayloadSchema,
        description: 'Generar texto cognitivo o salida JSON estructurada',
        handler: Gemini.prototype.handleGenerate,
      },
      {
        signal: SignalType.STREAM,
        type: DataType.GENERATE_PAYLOAD,
        schema: generatePayloadSchema,
        description: 'Transmitir tokens cognitivos en tiempo real mediante stream',
        handler: Gemini.prototype.handleStream,
      },
    ],
    outputs: [
      {
        signal: SignalType.CONNECTED,
        type: DataType.CONNECTION_STATUS,
        schema: connectionStatusSchema,
        description: 'Confirmación de conexión lista con Google Gemini',
      },
      {
        signal: SignalType.GENERATED,
        type: DataType.GENERATE_RESULT,
        schema: generateResultSchema,
        description: 'Resultado de inferencia y datos estructurados generados',
      },
      {
        signal: SignalType.STREAMED,
        type: DataType.STREAM_RESULT,
        schema: streamResultSchema,
        description: 'Stream activo de texto generado en tiempo real',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.UNKNOWN,
        schema: failureSchema,
        description: 'Notificación de error durante la inferencia con Gemini',
      },
    ],
  };

  private readonly controllers = new Map<string, ActiveStream>();

  public constructor(id: string = __ID__) {
    super(id);
  }

  public override denervate(): void {
    this.controllers.forEach(({
      controller,
    }) => controller.abort());
    this.controllers.clear();
    super.denervate();
  }

  private handleAbort(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      sessionId,
      streamId,
    } = this.extractPayload<AbortPayload>(value) ?? {};
    this.abortMatchingStreams(sessionId, streamId);
  }

  private abortMatchingStreams(sessionId?: string, streamId?: string): void {
    this.controllers.forEach(({
      controller,
      sessionId: activeSession,
    }, requestId) => {
      const matches = streamId ? requestId === streamId : !sessionId || activeSession === sessionId;
      if (matches) {
        controller.abort();
        this.controllers.delete(requestId);
      }
    });
  }

  private handleConnect(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<ConnectionConfig>(value);
    const connection = payload ?? this.body?.connection;
    this.updateConnection(connection);
    this.pulse(SignalType.CONNECTED, {
      connection,
      status: 'ready',
    });
  }

  private updateConnection(connection?: ConnectionConfig): void {
    const {
      aim,
    } = this.disposition;
    this.pulse(this.updateEvent, {
      ...this.disposition,
      aim: {
        ...aim,
        body: {
          ...this.body,
          connection,
        },
      },
    });
  }

  private async handleGenerate(signal: Signal): Promise<void> {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<GeneratePayload>(value);
    if (payload) {
      try {
        const result = await executeGeneration(payload, this.body);
        this.pulse(SignalType.GENERATED, result);
      } catch (error) {
        const failure = describeFailure(error, payload, this.body);
        this.pulse(SignalType.ERROR, failure);
      }
    }
  }

  private async handleStream(signal: Signal): Promise<void> {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<GeneratePayload>(value)!;
    const sessionId = payload.sessionId ?? crypto.randomUUID();
    const requestId = payload.streamId ?? sessionId;
    const controller = this.replaceController(requestId, sessionId);
    try {
      const result = await executeStream(payload, this.body, sessionId, controller, () => this.releaseController(requestId, controller));
      this.pulse(SignalType.STREAMED, result);
    } catch (error) {
      this.releaseController(requestId, controller);
      if (!controller.signal.aborted) {
        const failure = describeFailure(error, payload, this.body);
        this.pulse(SignalType.ERROR, failure);
      }
    }
  }

  private replaceController(requestId: string, sessionId: string): AbortController {
    const active = this.controllers.get(requestId);
    active?.controller.abort();
    const controller = new AbortController();
    this.controllers.set(requestId, {
      controller,
      sessionId,
    });
    return controller;
  }

  private releaseController(requestId: string, controller: AbortController): void {
    const active = this.controllers.get(requestId);
    if (active?.controller === controller) {
      this.controllers.delete(requestId);
    }
  }
}

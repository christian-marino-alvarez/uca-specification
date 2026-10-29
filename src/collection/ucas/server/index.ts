import * as fs from 'node:fs';
import * as path from 'node:path';
import { Logger } from '@uca/logger';
import {
  Scope,
  SignalType as LoggerSignalType,
} from '@uca/logger/types';
import { Uca } from '@uca/core/uca';
import {
  DispositionSignal,
  type CapabilityConstructor,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import { HttpServer } from '@uca/capability-http-server';
import {
  SignalType as HttpServerSignalType,
  type RequestContext,
  type RespondConfig,
  type RouteConfig,
} from '@uca/capability-http-server/types';
import { SseServer } from '@uca/capability-sse-server';
import {
  SignalType as SseServerSignalType,
  type ErrorPayload as SseErrorPayload,
  type OpenedPayload,
} from '@uca/capability-sse-server/types';
import { Jev } from '@uca/capability-jev';
import {
  SignalType as JevSignalType,
  type InferResult as JevResult,
} from '@uca/capability-jev/types';
import { Gemini } from '@uca/capability-gemini';
import {
  SignalType as GeminiSignalType,
  type GenerateResult,
} from '@uca/capability-gemini/types';
import { Openai } from '@uca/capability-openai';
import { SignalType as OpenaiSignalType } from '@uca/capability-openai/types';
import {
  DEFAULT_GEMINI_FLASH_LITE_MODEL,
  DEFAULT_PROVIDER,
} from '@uca/llm/constants';
import {
  SignalType as LlmSignalType,
  type ChosenModelConfig,
  type Failure,
  type InferPayload,
  type InferResult,
} from '@uca/llm/types';
import {
  createCommand,
  createModelSelectionEvaluation,
  needsModelSelection,
  normalizeInference,
  resolveChosenModelConfig,
  resolveModelCacheKey,
} from './command.js';
import {
  DEFAULT_AUTO_START,
  DEFAULT_DIST_DIR,
  DEFAULT_HOSTNAME,
  DEFAULT_PORT,
  DEFAULT_PURPOSE,
  DEFAULT_WEB_DIR,
  HEALTH_PATH,
  LLM_PATH,
  LLM_SSE_PATH,
  MIME_MAP,
  SSE_HEADERS,
  STATIC_CACHE_CONTROL,
  WARMUP_CONTRACT,
  WILDCARD_PATH,
  __ID__,
} from './constants.js';
import {
  inferenceSchema,
  requestContextSchema,
  respondConfigSchema,
  routeConfigSchema,
  startConfigSchema,
  startedStatusSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type InferenceRequest,
  type PendingRequest,
  type StartedStatus,
} from './types.js';

export class Server extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: DEFAULT_PURPOSE,
      body: {
        autoStart: DEFAULT_AUTO_START,
        hostname: DEFAULT_HOSTNAME,
        port: DEFAULT_PORT,
      },
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.START,
      SignalType.STOP,
      SignalType.ROUTE,
      SignalType.RESPOND,
      LlmSignalType.INFER,
      LlmSignalType.STREAM,
      ...Server.reactToLogger(),
      ...Server.reactToHttpServer(),
      ...Server.reactToSseServer(),
      ...Server.reactToJev(),
      ...Server.reactToGemini(),
      ...Server.reactToOpenai(),
    ],
    inputs: [
      {
        signal: SignalType.START,
        type: DataType.START_CONFIG,
        schema: startConfigSchema,
        description: 'Iniciar el servidor HTTP',
      },
      {
        signal: SignalType.STOP,
        type: DataType.VOID,
        description: 'Detener el servidor HTTP',
      },
      {
        signal: SignalType.ROUTE,
        type: DataType.ROUTE_CONFIG,
        schema: routeConfigSchema,
        description: 'Registrar una ruta de endpoint',
      },
      {
        signal: SignalType.RESPOND,
        type: DataType.RESPOND_CONFIG,
        schema: respondConfigSchema,
        description: 'Responder a una petición HTTP en curso',
      },
      {
        signal: LlmSignalType.INFER,
        type: DataType.INFER_RESULT,
        schema: inferenceSchema,
        description: 'Despachar una inferencia sin streaming desde una UCA compuesta',
      },
      {
        signal: LlmSignalType.STREAM,
        type: DataType.INFER_RESULT,
        schema: inferenceSchema,
        description: 'Despachar una inferencia con streaming desde una UCA compuesta',
      },
    ],
    outputs: [
      {
        signal: SignalType.STARTED,
        type: DataType.STARTED_STATUS,
        schema: startedStatusSchema,
        description: 'Servidor iniciado correctamente',
      },
      {
        signal: SignalType.STOPPED,
        type: DataType.VOID,
        description: 'Servidor detenido',
      },
      {
        signal: SignalType.REQUEST,
        type: DataType.REQUEST_CONTEXT,
        schema: requestContextSchema,
        description: 'Petición HTTP entrante',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.UNKNOWN,
        description: 'Error del servidor',
      },
      {
        signal: LlmSignalType.INFERRED,
        type: DataType.INFER_RESULT,
        description: 'Resultado de inferencia completada',
      },
      {
        signal: LlmSignalType.STREAMED,
        type: DataType.STREAM_RESULT,
        description: 'Stream de inferencia abierto',
      },
      {
        signal: LlmSignalType.STREAM_END,
        type: DataType.STREAM_END_RESULT,
        description: 'Stream de inferencia finalizado',
      },
      {
        signal: LlmSignalType.ERROR,
        type: DataType.UNKNOWN,
        description: 'Error durante la inferencia',
      },
    ],
  };

  private static reactToLogger(): string[] {
    const {
      reactTo = [],
    } = Logger.disposition;
    return [
      ...reactTo,
    ];
  }

  private static reactToHttpServer(): string[] {
    const {
      reactTo = [],
    } = HttpServer.disposition;
    return [
      ...reactTo,
      HttpServerSignalType.LISTENING,
      HttpServerSignalType.CLOSED,
      HttpServerSignalType.REQUEST,
      HttpServerSignalType.ERROR,
    ];
  }

  private static reactToSseServer(): string[] {
    const {
      reactTo = [],
    } = SseServer.disposition;
    return [
      ...reactTo,
      SseServerSignalType.OPENED,
      SseServerSignalType.ERROR,
    ];
  }

  private static reactToJev(): string[] {
    const {
      reactTo = [],
    } = Jev.disposition;
    return [
      ...reactTo,
      JevSignalType.INFERRED,
      JevSignalType.ERROR,
    ];
  }

  private static reactToGemini(): string[] {
    const {
      reactTo = [],
    } = Gemini.disposition;
    return [
      ...reactTo,
      GeminiSignalType.GENERATED,
      GeminiSignalType.STREAMED,
      GeminiSignalType.ERROR,
    ];
  }

  private static reactToOpenai(): string[] {
    const {
      reactTo = [],
    } = Openai.disposition;
    return [
      ...reactTo,
      OpenaiSignalType.GENERATED,
      OpenaiSignalType.STREAMED,
      OpenaiSignalType.ERROR,
    ];
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override react(signal: Signal): void {
    const {
      property,
    } = signal;
    switch (property) {
      case DispositionSignal.UPDATED:
        this.handleUpdated();
        break;
      case SignalType.START:
        this.handleStart(signal);
        break;
      case SignalType.STOP:
        this.handleStop(signal);
        break;
      case SignalType.ROUTE:
        this.handleRoute(signal);
        break;
      case SignalType.RESPOND:
        this.handleRespond(signal);
        break;
      case LlmSignalType.INFER:
        this.handleInferRequest(signal);
        break;
      case LlmSignalType.STREAM:
        this.handleStreamRequest(signal);
        break;
      case JevSignalType.INFERRED:
        this.handleJevInferred(signal);
        break;
      case JevSignalType.ERROR:
        this.handleJevError(signal);
        break;
      case GeminiSignalType.GENERATED:
        this.handleGeminiGenerated(signal);
        break;
      case GeminiSignalType.STREAMED:
        this.handleGeminiStreamed(signal);
        break;
      case GeminiSignalType.ERROR:
        this.handleGeminiError(signal);
        break;
      case OpenaiSignalType.GENERATED:
        this.handleOpenaiGenerated(signal);
        break;
      case OpenaiSignalType.STREAMED:
        this.handleOpenaiStreamed(signal);
        break;
      case OpenaiSignalType.ERROR:
        this.handleOpenaiError(signal);
        break;
      default:
        this.handleCapabilitySignal(signal);
        break;
    }
  }

  protected override receptors(): string[] {
    return super.receptors().filter((property) => property !== LoggerSignalType.OBSERVE);
  }

  protected override catalog(): Cooky {
    return [
      this.catalogLogger(),
      this.catalogHttpServer(),
      this.catalogJev(),
      this.catalogGemini(),
      this.catalogOpenai(),
      this.catalogSseServer(),
    ];
  }

  private catalogLogger(): Cooky[number] {
    const disposition = this.createDisposition(
      Logger.disposition,
      Logger.purpose,
      'logger',
      {
        scope: Scope.BACKEND,
      },
    );
    return [
      Logger as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogHttpServer(): Cooky[number] {
    const extraBody = this.createHttpServerExtraBody();
    const disposition = this.createDisposition(
      HttpServer.disposition,
      HttpServer.AIM,
      'http-server',
      extraBody,
    );
    return [
      HttpServer as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogJev(): Cooky[number] {
    const disposition = this.createDisposition(
      Jev.disposition,
      Jev.AIM,
      'jev',
    );
    return [
      Jev as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogGemini(): Cooky[number] {
    const disposition = this.createDisposition(
      Gemini.disposition,
      Gemini.AIM,
      'gemini',
    );
    return [
      Gemini as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogOpenai(): Cooky[number] {
    const disposition = this.createDisposition(
      Openai.disposition,
      Openai.AIM,
      'openai',
    );
    return [
      Openai as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogSseServer(): Cooky[number] {
    const disposition = this.createDisposition(
      SseServer.disposition,
      SseServer.AIM,
      'sse-server',
    );
    return [
      SseServer as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private createHttpServerExtraBody(): Record<string, unknown> {
    const {
      autoStart = DEFAULT_AUTO_START,
      hostname = DEFAULT_HOSTNAME,
      port = DEFAULT_PORT,
      routes = [],
    } = this.body ?? {};
    const defaultRoutes = this.buildDefaultRoutes();
    return {
      autoStart,
      hostname,
      port,
      routes: [
        ...routes,
        ...defaultRoutes,
      ],
    };
  }

  private buildDefaultRoutes(): RouteConfig[] {
    return [
      {
        method: 'GET',
        path: HEALTH_PATH,
        response: {
          status: 200,
          body: {
            status: 'healthy',
            uca: 'Server',
          },
        },
      },
      {
        method: 'POST',
        path: LLM_PATH,
      },
      {
        method: 'ALL',
        path: LLM_SSE_PATH,
      },
      {
        method: 'ALL',
        path: WILDCARD_PATH,
      },
    ];
  }

  private handleUpdated(): void {
    const {
      source = this.id,
    } = this.body ?? {};
    switch (source) {
      case `${this.id}:http-server`:
        this.handleHttpServerUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleSelfUpdated(): void {
  }

  private handleHttpServerUpdated(): void {
  }

  private handleStart(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(HttpServerSignalType.LISTEN, value);
  }

  private handleStop(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(HttpServerSignalType.CLOSE, value);
  }

  private handleRoute(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(HttpServerSignalType.ROUTE, value);
  }

  private handleRespond(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(HttpServerSignalType.RESPOND, value);
  }

  private handleCapabilitySignal(signal: Signal): void {
    const {
      property,
    } = signal;
    switch (property) {
      case HttpServerSignalType.LISTENING:
        this.handleListening(signal);
        break;
      case HttpServerSignalType.CLOSED:
        this.handleClosed(signal);
        break;
      case HttpServerSignalType.REQUEST:
        this.handleHttpServerRequest(signal);
        break;
      case HttpServerSignalType.ERROR:
        this.handleHttpServerError(signal);
        break;
      case SseServerSignalType.OPENED:
        this.handleSseOpened(signal);
        break;
      case SseServerSignalType.ERROR:
        this.handleSseError(signal);
        break;
      default:
        break;
    }
  }

  private handleListening(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      url,
    } = this.extractPayload<StartedStatus>(value) ?? {};
    if (url) {
      this.logServerStarted(url);
    }
    this.pulse(SignalType.STARTED, value);
    this.warmupLlm();
  }

  private handleClosed(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.STOPPED, value);
  }

  private handleHttpServerError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleHttpServerRequest(signal: Signal): void {
    const {
      value,
    } = signal;
    const context = value as RequestContext | undefined;
    if (context?.requestId) {
      this.pulse(SignalType.REQUEST, context);
      this.routeHttpRequest(context);
    }
  }

  private routeHttpRequest(context: RequestContext): void {
    const {
      path: requestPath,
    } = context;
    if (!this.hasCustomRoute(context)) {
      switch (requestPath) {
        case HEALTH_PATH:
          break;
        case LLM_PATH:
          this.handleLlmHttpRequest(context);
          break;
        case LLM_SSE_PATH:
          this.handleLlmSseHttpRequest(context);
          break;
        default:
          this.handleStaticHttpRequest(context);
          break;
      }
    }
  }

  private hasCustomRoute(context: RequestContext): boolean {
    const {
      method,
      path: requestPath,
    } = context;
    const {
      routes = [],
    } = this.body ?? {};
    return routes.some((route) => {
      const methodMatches = route.method === 'ALL' || route.method === method.toUpperCase();
      return methodMatches && route.path === requestPath && Boolean(route.handler ?? route.response);
    });
  }

  private handleLlmHttpRequest(context: RequestContext): void {
    const {
      body,
      requestId,
    } = context;
    const payload = normalizeInference({
      sessionId: requestId,
      ...(body as InferenceRequest),
    });
    this.dispatchBackendInference(payload, requestId, false);
  }

  private handleLlmSseHttpRequest(context: RequestContext): void {
    const {
      body,
      query,
      requestId,
    } = context;
    const payload = normalizeInference({
      sessionId: requestId,
      ...query,
      ...(body as InferenceRequest),
    });
    this.dispatchBackendInference(payload, requestId, true);
  }

  private dispatchBackendInference(
    payload: InferPayload,
    requestId: string,
    stream: boolean,
  ): void {
    const cacheKey = resolveModelCacheKey(payload);
    const cached = cacheKey ? this.getCachedModel(cacheKey) : undefined;
    const resolvedPayload = cached ? {
      ...payload,
      ...cached,
    } : payload;
    if (needsModelSelection(resolvedPayload, stream)) {
      this.requestBackendModelSelection(resolvedPayload, requestId, stream, cacheKey);
    }
    else {
      this.executeInference(resolvedPayload, requestId, stream);
    }
  }

  private requestBackendModelSelection(
    payload: InferPayload,
    requestId: string,
    stream: boolean,
    cacheKey?: string,
  ): void {
    const selectionSessionId = `${requestId}:model-select`;
    this.registerPendingRequest(selectionSessionId, {
      cacheKey,
      payload,
      requestId,
      selectingModel: true,
      stream,
    });
    const evaluation = createModelSelectionEvaluation(payload, selectionSessionId);
    this.pulse(JevSignalType.INFER, evaluation);
  }

  private executeInference(
    payload: InferPayload,
    requestId: string,
    stream: boolean,
  ): void {
    const {
      provider = DEFAULT_PROVIDER,
      sessionId = requestId,
    } = payload;
    this.registerPendingRequest(sessionId, {
      payload,
      provider,
      requestId,
      stream,
    });
    if (stream) {
      this.openSseChannel(payload, sessionId, provider);
    }
    else {
      const command = createCommand(payload, false);
      this.pulse(command.property, command.value);
    }
  }

  private openSseChannel(payload: InferPayload, sessionId: string, provider: string): void {
    const abortSignal = provider === 'openai' ? OpenaiSignalType.ABORT : GeminiSignalType.ABORT;
    const request = () => {
      const command = createCommand(payload, true);
      this.pulse(command.property, command.value);
    };
    const cancel = () => {
      this.pulse(abortSignal, {
        sessionId,
      });
    };
    this.pulse(SseServerSignalType.OPEN, {
      cancel,
      request,
      sessionId,
    });
  }

  private handleSseOpened(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      sessionId = '',
      stream,
    } = this.extractPayload<OpenedPayload>(value) ?? {};
    const pending = this.getPendingRequest(sessionId);
    if (pending) {
      this.clearPendingRequest(sessionId);
      this.respondHttp({
        body: stream,
        headers: {
          ...SSE_HEADERS,
        },
        requestId: pending.requestId,
        status: 200,
      });
    }
  }

  private handleSseError(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      error,
      sessionId = '',
    } = this.extractPayload<SseErrorPayload>(value) ?? {};
    const pending = this.getPendingRequest(sessionId);
    if (pending && !this.retryPendingSseWithFallback(sessionId, pending)) {
      this.clearPendingRequest(sessionId);
      this.respondHttp({
        body: {
          error: String(error ?? 'SSE stream failed'),
        },
        requestId: pending.requestId,
        status: 502,
      });
    }
  }

  private retryPendingSseWithFallback(sessionId: string, pending: PendingRequest): boolean {
    const {
      payload,
      provider = DEFAULT_PROVIDER,
    } = pending;
    const {
      model = DEFAULT_GEMINI_FLASH_LITE_MODEL,
    } = payload;
    const canRetry = model !== DEFAULT_GEMINI_FLASH_LITE_MODEL;
    if (canRetry) {
      const fallbackPayload = {
        ...payload,
        model: DEFAULT_GEMINI_FLASH_LITE_MODEL,
      };
      this.registerPendingRequest(sessionId, {
        ...pending,
        payload: fallbackPayload,
      });
      this.openSseChannel(fallbackPayload, sessionId, provider);
    }
    return canRetry;
  }

  private handleInferRequest(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<InferPayload>(value);
    if (payload) {
      const command = createCommand(payload, false);
      this.pulse(command.property, command.value);
    }
  }

  private handleStreamRequest(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = this.extractPayload<InferPayload>(value);
    if (payload) {
      const command = createCommand(payload, true);
      this.pulse(command.property, command.value);
    }
  }

  private handleJevInferred(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      answers,
      model,
      sessionId = '',
      state,
    } = this.extractPayload<JevResult>(value) ?? {};
    const pending = this.getPendingRequest(sessionId);
    if (pending?.selectingModel) {
      this.handleModelSelectionInferred(sessionId, pending, answers);
    }
    else {
      this.completeInference({
        context: state,
        data: answers,
        model,
        response: JSON.stringify(answers),
        sessionId,
      });
    }
  }

  private handleModelSelectionInferred(
    selectionSessionId: string,
    pending: PendingRequest,
    answers: unknown,
  ): void {
    const {
      cacheKey,
      payload,
      requestId,
      stream = false,
    } = pending;
    this.clearPendingRequest(selectionSessionId);
    const config = resolveChosenModelConfig(answers);
    if (cacheKey) {
      this.cacheSelectedModel(cacheKey, config);
    }
    this.executeInference({
      ...payload,
      ...config,
      sessionId: requestId,
    }, requestId, stream);
  }

  private handleGeminiGenerated(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      data,
      model,
      sessionId,
      text: response = '',
      usage,
    } = this.extractPayload<GenerateResult>(value) ?? {};
    this.completeInference({
      data,
      model,
      response,
      sessionId,
      usage,
    });
  }

  private handleOpenaiGenerated(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      data,
      model,
      sessionId,
      text: response = '',
      usage,
    } = this.extractPayload<GenerateResult>(value) ?? {};
    this.completeInference({
      data,
      model,
      response,
      sessionId,
      usage,
    });
  }

  private completeInference(result: InferResult): void {
    this.pulse(LlmSignalType.INFERRED, result);
    const {
      sessionId = '',
    } = result;
    const pending = this.getPendingRequest(sessionId);
    if (pending && !pending.stream) {
      this.clearPendingRequest(sessionId);
      this.respondHttp({
        body: {
          ...result,
          context: pending.payload.context ?? result.context,
        },
        requestId: pending.requestId,
        status: 200,
      });
    }
  }

  private handleJevError(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      sessionId = '',
    } = this.extractPayload<Failure>(value) ?? {};
    const pending = this.getPendingRequest(sessionId);
    if (pending?.selectingModel) {
      this.clearPendingRequest(sessionId);
      this.executeInference({
        ...pending.payload,
        model: DEFAULT_GEMINI_FLASH_LITE_MODEL,
        sessionId: pending.requestId,
      }, pending.requestId, Boolean(pending.stream));
    }
    else {
      this.failInference(value);
    }
  }

  private handleGeminiError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.failInference(value);
  }

  private handleOpenaiError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.failInference(value);
  }

  private failInference(value: unknown): void {
    this.pulse(LlmSignalType.ERROR, value);
    const {
      error,
      sessionId = '',
    } = this.extractPayload<Failure>(value) ?? {};
    const pending = this.getPendingRequest(sessionId);
    if (pending && !pending.stream && !this.retryPendingInferenceWithFallback(sessionId, pending)) {
      this.clearPendingRequest(sessionId);
      this.respondHttp({
        body: {
          error: String(error),
          sessionId,
        },
        requestId: pending.requestId,
        status: 502,
      });
    }
  }

  private retryPendingInferenceWithFallback(sessionId: string, pending: PendingRequest): boolean {
    const {
      payload,
    } = pending;
    const {
      model = DEFAULT_GEMINI_FLASH_LITE_MODEL,
    } = payload;
    const canRetry = model !== DEFAULT_GEMINI_FLASH_LITE_MODEL;
    if (canRetry) {
      const fallbackPayload = {
        ...payload,
        model: DEFAULT_GEMINI_FLASH_LITE_MODEL,
      };
      this.registerPendingRequest(sessionId, {
        ...pending,
        payload: fallbackPayload,
      });
      const command = createCommand(fallbackPayload, false);
      this.pulse(command.property, command.value);
    }
    return canRetry;
  }

  private handleGeminiStreamed(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(LlmSignalType.STREAMED, value);
  }

  private handleOpenaiStreamed(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(LlmSignalType.STREAMED, value);
  }

  private handleStaticHttpRequest(context: RequestContext): void {
    const {
      path: requestPath,
      requestId,
    } = context;
    const filePath = this.resolveStaticPath(requestPath);
    if (filePath) {
      this.respondStaticFile(requestId, filePath);
    }
    else {
      this.respondNotFound(requestId, requestPath);
    }
  }

  private respondStaticFile(requestId: string, filePath: string): void {
    const contentType = this.resolveMimeType(filePath);
    const content = fs.readFileSync(filePath);
    this.respondHttp({
      body: new Uint8Array(content),
      headers: {
        'Cache-Control': STATIC_CACHE_CONTROL,
        'Content-Type': contentType,
      },
      requestId,
      status: 200,
    });
  }

  private respondNotFound(requestId: string, requestPath: string): void {
    this.respondHttp({
      body: {
        error: 'Not Found',
        path: requestPath,
      },
      requestId,
      status: 404,
    });
  }

  private respondHttp(config: RespondConfig): void {
    this.pulse(HttpServerSignalType.RESPOND, config);
  }

  private resolveStaticPath(requestPath: string): string | null {
    const {
      staticDir,
      webDir,
    } = this.body ?? {};
    const effectiveWebDir = webDir ?? path.resolve(process.cwd(), DEFAULT_WEB_DIR);
    const effectiveStaticDir = staticDir ?? path.resolve(process.cwd(), DEFAULT_DIST_DIR);
    const normalized = requestPath === '/' || requestPath === '' ? '/index.html' : requestPath;
    const candidates = [
      normalized.startsWith('/src/') ? path.join(process.cwd(), normalized) : null,
      path.join(effectiveWebDir, normalized),
      path.join(effectiveStaticDir, normalized),
    ].filter(Boolean) as string[];
    return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) ?? null;
  }

  private resolveMimeType(filePath: string): string {
    const extension = path.extname(filePath).toLowerCase();
    return MIME_MAP[extension] ?? 'application/octet-stream';
  }

  private getCachedModel(key: string): ChosenModelConfig | undefined {
    const {
      modelCache = {},
    } = this.body ?? {};
    return modelCache[key];
  }

  private cacheSelectedModel(key: string, config: ChosenModelConfig): void {
    const {
      modelCache = {},
    } = this.body ?? {};
    this.updateDispositionBody({
      modelCache: {
        ...modelCache,
        [key]: config,
      },
      source: `${this.id}:http-server`,
    });
  }

  private getPendingRequest(sessionId: string): PendingRequest | undefined {
    const {
      pendingRequests = {},
    } = this.body ?? {};
    return pendingRequests[sessionId];
  }

  private registerPendingRequest(sessionId: string, entry: PendingRequest): void {
    const {
      pendingRequests = {},
    } = this.body ?? {};
    this.updateDispositionBody({
      pendingRequests: {
        ...pendingRequests,
        [sessionId]: entry,
      },
      source: `${this.id}:http-server`,
    });
  }

  private clearPendingRequest(sessionId: string): void {
    const {
      pendingRequests = {},
    } = this.body ?? {};
    const {
      [sessionId]: _removed,
      ...remaining
    } = pendingRequests;
    this.updateDispositionBody({
      pendingRequests: remaining,
      source: `${this.id}:http-server`,
    });
  }

  private updateDispositionBody(partial: Partial<Body>): void {
    const {
      aim,
    } = this.disposition;
    this.pulse(this.updateEvent, {
      ...this.disposition,
      aim: {
        ...aim,
        body: {
          ...this.body,
          ...partial,
        },
      },
    });
  }

  private logServerStarted(url: string): void {
    console.log(`\n[${Scope.BACKEND}] [${this.id}] 🚀 UCA Server successfully started at: ${url}`);
    console.log(`[${Scope.BACKEND}] [${this.id}] 🌐 Web Application running at: ${url}`);
    console.log(`[${Scope.BACKEND}] [${this.id}] 📡 Health endpoint: ${url}/api/health`);
    console.log(`[${Scope.BACKEND}] [${this.id}] 🧠 LLM Request endpoint: ${url}/api/llm`);
    console.log(`[${Scope.BACKEND}] [${this.id}] ⚡ LLM SSE Stream endpoint: ${url}/api/llm/sse\n`);
  }

  private warmupLlm(): void {
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const hasKey = typeof process !== 'undefined' && Boolean(process.env?.GEMINI_API_KEY ?? process.env?.GOOGLE_GENAI_API_KEY);
    if (!isTest && hasKey) {
      const command = createCommand({
        ...WARMUP_CONTRACT,
        limit: 1,
        sessionId: 'system-warmup',
      });
      this.pulse(command.property, command.value);
    }
  }
}

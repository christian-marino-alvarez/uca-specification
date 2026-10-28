import {
  Hono,
  type Context,
} from 'hono';
import {
  serve,
  type ServerType,
} from '@hono/node-server';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { Capability } from '@uca/core/capability';
import {
  DispositionSignal,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import {
  AIM,
  DEFAULT_HOSTNAME,
  DEFAULT_PORT,
  DEFAULT_TIMEOUT_MS,
  __ID__,
} from './constants.js';
import {
  listenConfigSchema,
  listeningStatusSchema,
  requestContextSchema,
  respondConfigSchema,
  routeConfigSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Body,
  type ListenConfig,
  type RequestContext,
  type RespondConfig,
  type ResponsePayload,
  type RouteConfig,
  type RouteHandler,
} from './types.js';

export class HttpServer extends Capability<Body> {
  public static readonly AIM: string = AIM;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: AIM,
      body: {},
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.LISTEN,
      SignalType.CLOSE,
      SignalType.ROUTE,
      SignalType.RESPOND,
    ],
    inputs: [
      {
        signal: SignalType.LISTEN,
        type: DataType.LISTEN_CONFIG,
        schema: listenConfigSchema,
        description: 'Iniciar la escucha del servidor HTTP',
      },
      {
        signal: SignalType.CLOSE,
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
        description: 'Enviar respuesta a una petición HTTP en curso',
      },
    ],
    outputs: [
      {
        signal: SignalType.LISTENING,
        type: DataType.LISTENING_STATUS,
        schema: listeningStatusSchema,
        description: 'Estado de escucha activa del servidor',
      },
      {
        signal: SignalType.CLOSED,
        type: DataType.VOID,
        description: 'Notificación de parada del servidor',
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
        description: 'Error del servidor o de enrutamiento',
      },
    ],
  };

  private readonly app: Hono;
  private server?: ServerType;
  private readonly registeredRoutes: Map<string, RouteConfig>;
  private readonly pendingResolvers: Map<string, (response: Response) => void>;

  public constructor(id: string = __ID__) {
    super(id);
    this.app = new Hono();
    this.registeredRoutes = new Map();
    this.pendingResolvers = new Map();
    this.setupDispatcher();
  }

  public override denervate(): void {
    this.stopServer();
    this.registeredRoutes.clear();
    this.pendingResolvers.clear();
    super.denervate();
  }

  protected override async react(signal: Signal): Promise<void> {
    const {
      property,
    } = signal;
    switch (property) {
      case DispositionSignal.UPDATED:
        this.handleUpdated();
        break;
      case SignalType.LISTEN:
        this.handleListen(signal);
        break;
      case SignalType.CLOSE:
        this.handleClose();
        break;
      case SignalType.ROUTE:
        this.handleRoute(signal);
        break;
      case SignalType.RESPOND:
        this.handleRespond(signal);
        break;
      default:
        break;
    }
  }

  private handleUpdated(): void {
    this.configureInitialRoutes();
    this.evaluateAutoStart();
  }

  private handleListen(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      hostname: payloadHost,
      port: payloadPort,
    } = this.extractPayload<ListenConfig>(value) ?? {};
    const {
      hostname: bodyHost,
      port: bodyPort,
    } = this.body ?? {};
    const port = payloadPort ?? bodyPort ?? DEFAULT_PORT;
    const hostname = payloadHost ?? bodyHost ?? DEFAULT_HOSTNAME;
    this.startServer(port, hostname);
  }

  private handleClose(): void {
    this.stopServer();
    this.pulse(SignalType.CLOSED, undefined);
  }

  private handleRoute(signal: Signal): void {
    const {
      value,
    } = signal;
    const route = this.extractPayload<RouteConfig>(value);
    if (route) {
      this.registerEndpoint(route);
    }
  }

  private handleRespond(signal: Signal): void {
    const {
      value,
    } = signal;
    const payload = value as RespondConfig | undefined;
    if (payload?.requestId) {
      this.resolvePendingRequest(payload);
    }
  }

  private resolvePendingRequest(payload: RespondConfig): void {
    const {
      body,
      headers = {},
      requestId,
      status = 200,
    } = payload;
    const resolver = this.pendingResolvers.get(requestId);
    if (resolver) {
      this.pendingResolvers.delete(requestId);
      const content = this.serializeResponseBody(body);
      const response = new Response(content, {
        headers,
        status,
      });
      resolver(response);
    }
  }

  private serializeResponseBody(body: unknown): BodyInit | null {
    const isRaw = body instanceof ReadableStream || body instanceof Uint8Array || typeof body === 'string';
    const serialized = body === undefined ? null : JSON.stringify(body);
    return isRaw ? (body as BodyInit) : serialized;
  }

  private configureInitialRoutes(): void {
    const {
      routes = [],
    } = this.body ?? {};
    routes.forEach((route) => {
      this.registerEndpoint(route);
    });
  }

  private evaluateAutoStart(): void {
    const {
      autoStart,
      hostname = DEFAULT_HOSTNAME,
      port = DEFAULT_PORT,
    } = this.body ?? {};
    if (autoStart && !this.server) {
      this.startServer(port, hostname);
    }
  }

  private setupDispatcher(): void {
    this.app.all('*', async (context: Context) => {
      return this.dispatchHttpContext(context);
    });
  }

  private async dispatchHttpContext(context: Context): Promise<Response> {
    const {
      req,
    } = context;
    const {
      method,
      path,
    } = req;
    const route = this.findMatchingRoute(method, path);
    return route
      ? this.processEndpointRequest(route, context)
      : context.json({
        error: 'Not Found',
        path,
      }, 404);
  }

  private startServer(port: number, hostname: string): void {
    if (!this.server) {
      this.tryListen(port, hostname);
    }
  }

  private tryListen(port: number, hostname: string): void {
    try {
      this.server = serve({
        fetch: this.app.fetch,
        hostname,
        port,
      });
      this.pulse(SignalType.LISTENING, {
        hostname,
        port,
        url: `http://${hostname}:${port}`,
      });
    } catch (error) {
      this.pulse(SignalType.ERROR, error);
    }
  }

  private stopServer(): void {
    if (this.server) {
      this.server.close();
      this.server = undefined;
    }
  }

  private registerEndpoint(route: RouteConfig): void {
    const {
      method,
      path,
    } = route;
    const key = `${method.toUpperCase()}:${path}`;
    this.registeredRoutes.set(key, route);
  }

  private findMatchingRoute(method: string, path: string): RouteConfig | undefined {
    const directKey = `${method.toUpperCase()}:${path}`;
    const allKey = `ALL:${path}`;
    const directMatch = this.registeredRoutes.get(directKey) ?? this.registeredRoutes.get(allKey);
    return directMatch ?? this.matchPatternRoute(method, path);
  }

  private matchPatternRoute(method: string, path: string): RouteConfig | undefined {
    const routes = [
      ...this.registeredRoutes.values(),
    ];
    return routes.find((route) => this.matchesRouteEntry(route, method, path));
  }

  private matchesRouteEntry(route: RouteConfig, method: string, path: string): boolean {
    const {
      method: routeMethod,
      path: routePath,
    } = route;
    const methodMatches = routeMethod === 'ALL' || routeMethod === method.toUpperCase();
    const isWildcard = routePath === '*' || routePath === '/*';
    return methodMatches && (isWildcard || this.isPatternMatch(routePath, path));
  }

  private isPatternMatch(routePath: string, requestPath: string): boolean {
    const hasTokens = routePath.includes(':') || routePath.includes('*');
    const regexStr = '^' + routePath.replace(/:[^\s/]+/g, '([\\w-]+)').replace(/\*/g, '.*') + '$';
    return hasTokens && new RegExp(regexStr).test(requestPath);
  }

  private async processEndpointRequest(route: RouteConfig, context: Context): Promise<Response> {
    const requestContext = await this.createRequestContext(context);
    const {
      handler,
      response,
    } = route;
    const responsePromise = response
      ? this.respondStaticRoute(requestContext, response, context)
      : this.waitForSignalResponse(requestContext, context);
    return handler
      ? this.respondHandlerRoute(requestContext, handler, context)
      : responsePromise;
  }

  private async respondHandlerRoute(
    requestContext: RequestContext,
    handler: RouteHandler,
    context: Context,
  ): Promise<Response> {
    this.pulse(SignalType.REQUEST, requestContext);
    return this.executeRouteHandler(handler, requestContext, context);
  }

  private respondStaticRoute(
    requestContext: RequestContext,
    response: ResponsePayload,
    context: Context,
  ): Response {
    this.pulse(SignalType.REQUEST, requestContext);
    return this.buildStaticResponse(response, context);
  }

  private async createRequestContext(context: Context): Promise<RequestContext> {
    const {
      req,
    } = context;
    const {
      method,
      path,
    } = req;
    const requestId = crypto.randomUUID();
    const query = req.query();
    const headers = req.header();
    const body = await this.parseRequestBody(req);
    return {
      body,
      headers,
      method,
      path,
      query,
      requestId,
    };
  }

  private async parseRequestBody(request: Context['req']): Promise<unknown> {
    let parsed: unknown;
    try {
      const text = await request.text();
      parsed = text ? JSON.parse(text) : undefined;
    } catch {
      parsed = undefined;
    }
    return parsed;
  }

  private async executeRouteHandler(
    handler: RouteHandler,
    data: RequestContext,
    context: Context,
  ): Promise<Response> {
    const result = await handler(data);
    return result instanceof Response
      ? result
      : this.buildStaticResponse(result ?? {}, context);
  }

  private buildStaticResponse(response: ResponsePayload, context: Context): Response {
    const {
      body,
      headers = {},
      status = 200,
    } = response;
    const statusCode = status as ContentfulStatusCode;
    return context.json(body, statusCode, headers);
  }

  private waitForSignalResponse(requestContext: RequestContext, context: Context): Promise<Response> {
    const {
      requestId,
    } = requestContext;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.pendingResolvers.delete(requestId);
        const timeoutResponse = context.json({
          error: 'Request timeout',
        }, 504);
        resolve(timeoutResponse);
      }, DEFAULT_TIMEOUT_MS);
      this.pendingResolvers.set(requestId, (response: Response) => {
        clearTimeout(timer);
        resolve(response);
      });
      this.pulse(SignalType.REQUEST, requestContext);
    });
  }
}

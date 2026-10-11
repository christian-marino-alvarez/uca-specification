import { Hono, type Context } from 'hono';
import { serve, type ServerType } from '@hono/node-server';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { Capability } from '@uca/core/capability';
import type { Disposition, Signal } from '@uca/core/types';
import {
    __ID__,
    AIM,
    DEFAULT_HOSTNAME,
    DEFAULT_PORT,
    DEFAULT_TIMEOUT_MS,
} from './constants.js';
import {
    type Body,
    type ListenConfig,
    type RequestContext,
    type RespondConfig,
    type ResponsePayload,
    type RouteConfig,
    type RouteHandler,
    DataType,
    SignalType,
} from './types.js';

export class HttpServer extends Capability<Body> {
    public static readonly AIM: string = AIM;

    public static override disposition: Disposition<Body> = {
        aim: { description: AIM, body: {} },
        reactTo: [
            SignalType.LISTEN,
            SignalType.CLOSE,
            SignalType.ROUTE,
            SignalType.RESPOND,
        ],
        inputs: [
            { signal: SignalType.LISTEN, type: DataType.LISTEN_CONFIG, description: 'Start HTTP server listening' },
            { signal: SignalType.CLOSE, type: DataType.VOID, description: 'Stop HTTP server' },
            { signal: SignalType.ROUTE, type: DataType.ROUTE_CONFIG, description: 'Register an endpoint route' },
            { signal: SignalType.RESPOND, type: DataType.RESPOND_CONFIG, description: 'Send response to an in-flight request' },
        ],
        outputs: [
            { signal: SignalType.LISTENING, type: DataType.LISTENING_STATUS, description: 'Server listening status' },
            { signal: SignalType.CLOSED, type: DataType.VOID, description: 'Server stopped notification' },
            { signal: SignalType.REQUEST, type: DataType.REQUEST_CONTEXT, description: 'Incoming HTTP request' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Server or routing error' },
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

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.configureInitialRoutes();
        this.evaluateAutoStart();
    }

    public override denervate(): void {
        this.stopServer();
        this.registeredRoutes.clear();
        this.pendingResolvers.clear();
        super.denervate();
    }

    protected override async react(signal: Signal): Promise<void> {
        const { property, value } = signal;
        switch (property) {
            case SignalType.LISTEN:
                this.handleListen(value);
                break;
            case SignalType.CLOSE:
                this.handleClose();
                break;
            case SignalType.ROUTE:
                this.handleRoute(value);
                break;
            case SignalType.RESPOND:
                this.handleRespond(value);
                break;
            default:
                break;
        }
    }

    private handleListen(value: unknown): void {
        const payload = Capability.extractPayload<ListenConfig>(value);
        const { aim } = this.disposition;
        const { port: bodyPort, hostname: bodyHost } = (aim.body ?? {}) as Body;
        const port = payload?.port ?? bodyPort ?? DEFAULT_PORT;
        const hostname = payload?.hostname ?? bodyHost ?? DEFAULT_HOSTNAME;
        this.startServer(port, hostname);
    }

    private handleClose(): void {
        this.stopServer();
        this.pulse(SignalType.CLOSED, undefined);
    }

    private handleRoute(value: unknown): void {
        const route = Capability.extractPayload<RouteConfig>(value);
        if (!route) { return; }
        this.registerEndpoint(route);
    }

    private handleRespond(value: unknown): void {
        const payload = Capability.extractPayload<RespondConfig>(value);
        if (!payload) { return; }
        this.resolvePendingRequest(payload);
    }

    private resolvePendingRequest(payload: RespondConfig): void {
        const { requestId, status = 200, headers = {}, body } = payload;
        const resolver = this.pendingResolvers.get(requestId);
        if (!resolver) { return; }
        this.pendingResolvers.delete(requestId);
        const content = typeof body === 'string' ? body : JSON.stringify(body);
        resolver(new Response(content, { status, headers }));
    }

    private configureInitialRoutes(): void {
        const { aim } = this.disposition;
        const { routes = [] } = (aim.body ?? {}) as Body;
        for (const route of routes) {
            this.registerEndpoint(route);
        }
    }

    private evaluateAutoStart(): void {
        const { aim } = this.disposition;
        const { autoStart, port, hostname } = (aim.body ?? {}) as Body;
        if (autoStart) {
            this.startServer(port ?? DEFAULT_PORT, hostname ?? DEFAULT_HOSTNAME);
        }
    }

    private setupDispatcher(): void {
        this.app.all('*', async (context: Context) => {
            const { method, path } = context.req;
            const route = this.findMatchingRoute(method, path);
            if (!route) {
                return context.json({ error: 'Not Found', path }, 404);
            }
            return this.processEndpointRequest(route, context);
        });
    }

    private startServer(port: number, hostname: string): void {
        try {
            this.stopServer();
            this.server = serve({ fetch: this.app.fetch, port, hostname });
            this.pulse(SignalType.LISTENING, { port, hostname, url: `http://${hostname}:${port}` });
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
        const { method, path } = route;
        const key = `${method.toUpperCase()}:${path}`;
        this.registeredRoutes.set(key, route);
    }

    private findMatchingRoute(method: string, path: string): RouteConfig | undefined {
        const directKey = `${method.toUpperCase()}:${path}`;
        const directMatch = this.registeredRoutes.get(directKey);
        if (directMatch) { return directMatch; }
        const allKey = `ALL:${path}`;
        const allMatch = this.registeredRoutes.get(allKey);
        if (allMatch) { return allMatch; }
        return this.matchPatternRoute(method, path);
    }

    private matchPatternRoute(method: string, path: string): RouteConfig | undefined {
        for (const route of this.registeredRoutes.values()) {
            const methodMatches = route.method === 'ALL' || route.method === method.toUpperCase();
            if (!methodMatches) { continue; }
            if (route.path === '*' || route.path === '/*') { return route; }
            if (this.isPatternMatch(route.path, path)) { return route; }
        }
        return undefined;
    }

    private isPatternMatch(routePath: string, requestPath: string): boolean {
        if (!routePath.includes(':') && !routePath.includes('*')) { return false; }
        const regexStr = '^' + routePath.replace(/:[^\s/]+/g, '([\\w-]+)').replace(/\*/g, '.*') + '$';
        return new RegExp(regexStr).test(requestPath);
    }

    private async processEndpointRequest(route: RouteConfig, context: Context): Promise<Response> {
        const requestContext = await this.createRequestContext(context);
        this.pulse(SignalType.REQUEST, requestContext);
        const { handler, response } = route;
        if (handler) { return this.executeRouteHandler(handler, requestContext, context); }
        if (response) { return this.buildStaticResponse(response, context); }
        return this.waitForSignalResponse(requestContext.requestId, context);
    }

    private async createRequestContext(context: Context): Promise<RequestContext> {
        const { req } = context;
        const requestId = crypto.randomUUID();
        const query = req.query();
        const headers = req.header();
        const body = await this.parseRequestBody(req);
        return { requestId, method: req.method, path: req.path, query, headers, body };
    }

    private async parseRequestBody(request: Context['req']): Promise<unknown> {
        try {
            const text = await request.text();
            return text ? JSON.parse(text) : undefined;
        } catch {
            return undefined;
        }
    }

    private async executeRouteHandler(handler: RouteHandler, data: RequestContext, context: Context): Promise<Response> {
        const result = await handler(data);
        if (result instanceof Response) { return result; }
        const { status = 200, headers = {}, body } = result ?? {};
        const statusCode = status as ContentfulStatusCode;
        return context.json(body, statusCode, headers);
    }

    private buildStaticResponse(response: ResponsePayload, context: Context): Response {
        const { status = 200, headers = {}, body } = response;
        const statusCode = status as ContentfulStatusCode;
        return context.json(body, statusCode, headers);
    }

    private waitForSignalResponse(requestId: string, context: Context): Promise<Response> {
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.pendingResolvers.delete(requestId);
                resolve(context.json({ error: 'Request timeout' }, 504));
            }, DEFAULT_TIMEOUT_MS);
            this.pendingResolvers.set(requestId, (response: Response) => {
                clearTimeout(timer);
                resolve(response);
            });
        });
    }
}


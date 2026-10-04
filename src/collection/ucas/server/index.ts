import * as fs from 'node:fs';
import * as path from 'node:path';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import {
    HttpServer,
    SignalType as HttpServerSignalType,
    type Body as HttpServerBody,
    type RequestContext,
    type RouteConfig,
} from '@uca/capability-http-server';
import {
    Llm,
    SignalType as LlmSignalType,
    DEFAULT_PROVIDER,
    DEFAULT_GEMINI_MODEL,
    type Body as LlmBody,
    type InferResult,
    type ChunkResult,
    type StreamEndResult,
} from '@uca/llm';
import {
    __ID__,
    DEFAULT_AUTO_START,
    DEFAULT_DIST_DIR,
    DEFAULT_HOSTNAME,
    DEFAULT_PORT,
    DEFAULT_SIGNALS,
    DEFAULT_WEB_DIR,
    DEFAULT_TEMPERATURE,
    DEFAULT_MAX_OUTPUT_TOKENS,
} from './constants.js';
import {
    type Body,
    type StartedStatus,
    DataType,
    SignalType,
} from './types.js';

export class Server extends Uca<Body> {
    public static override purpose: string = 'Orchestrate HTTP server lifecycle, cognitive LLM endpoints, and routing';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Server.purpose,
            body: { port: DEFAULT_PORT, hostname: DEFAULT_HOSTNAME, autoStart: DEFAULT_AUTO_START },
        },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: [
            { signal: SignalType.START, type: DataType.START_CONFIG, description: 'Start HTTP server' },
            { signal: SignalType.STOP, type: DataType.VOID, description: 'Stop HTTP server' },
            { signal: SignalType.ROUTE, type: DataType.ROUTE_CONFIG, description: 'Register an endpoint route' },
            { signal: SignalType.RESPOND, type: DataType.RESPOND_CONFIG, description: 'Respond to an in-flight request' },
        ],
        outputs: [
            { signal: SignalType.STARTED, type: DataType.STARTED_STATUS, description: 'Server started successfully' },
            { signal: SignalType.STOPPED, type: DataType.VOID, description: 'Server stopped' },
            { signal: SignalType.REQUEST, type: DataType.REQUEST_CONTEXT, description: 'Incoming HTTP request' },
            { signal: SignalType.ERROR, type: DataType.UNKNOWN, description: 'Server error' },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const base = disposition ?? Server.disposition;
        const { reactTo = [] } = base;
        const internalSignals = [
            HttpServerSignalType.LISTENING,
            HttpServerSignalType.CLOSED,
            HttpServerSignalType.REQUEST,
            HttpServerSignalType.ERROR,
            LlmSignalType.INFERRED,
            LlmSignalType.CHUNK,
            LlmSignalType.STREAM_END,
        ];
        const signals = [...new Set([...reactTo, ...internalSignals])];
        return super.innervate(target, { ...base, reactTo: signals });
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const body = (aim.body ?? {}) as Body;
        const allRoutes = [...(body.routes ?? []), ...this.buildDefaultRoutes(body)];
        const httpServerDisposition = this.createHttpServerDisposition(body, allRoutes);
        const llmDisposition = this.createLlmDisposition();
        return [[HttpServer, httpServerDisposition], [Llm, llmDisposition]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.START:
                this.pulse(HttpServerSignalType.LISTEN, value);
                break;
            case SignalType.STOP:
                this.pulse(HttpServerSignalType.CLOSE, value);
                break;
            case SignalType.ROUTE:
                this.pulse(HttpServerSignalType.ROUTE, value);
                break;
            case SignalType.RESPOND:
                this.pulse(HttpServerSignalType.RESPOND, value);
                break;
            default:
                this.handleCapabilitySignal(property, value);
                break;
        }
    }

    private createHttpServerDisposition(body: Body, routes: RouteConfig[]): Disposition<HttpServerBody> {
        const { port = DEFAULT_PORT, hostname = DEFAULT_HOSTNAME, autoStart = DEFAULT_AUTO_START } = body;
        return {
            aim: { description: HttpServer.AIM, body: { port, hostname, routes, autoStart } },
            reactTo: [...HttpServer.disposition.reactTo ?? []],
        };
    }

    private createLlmDisposition(): Disposition<LlmBody> {
        return {
            aim: { description: Llm.purpose, body: { provider: DEFAULT_PROVIDER, model: DEFAULT_GEMINI_MODEL } },
            reactTo: [...Llm.disposition.reactTo ?? []],
        };
    }

    private handleCapabilitySignal(property: string, value: unknown): void {
        switch (property) {
            case HttpServerSignalType.LISTENING:
                this.handleListening(value);
                break;
            case HttpServerSignalType.CLOSED:
                this.pulse(SignalType.STOPPED, value);
                break;
            case HttpServerSignalType.REQUEST:
                this.pulse(SignalType.REQUEST, value);
                break;
            case HttpServerSignalType.ERROR:
                this.pulse(SignalType.ERROR, value);
                break;
            default:
                break;
        }
    }

    private handleListening(value: unknown): void {
        const { url } = (value ?? {}) as StartedStatus;
        if (url) {
            this.logServerStarted(url);
        }
        this.pulse(SignalType.STARTED, value);
        this.warmupLlm();
    }

    private logServerStarted(url: string): void {
        console.log(`\n🚀 UCA Server successfully started at: ${url}`);
        console.log(`🌐 Web Application running at: ${url}`);
        console.log(`📡 Health endpoint: ${url}/api/health`);
        console.log(`🧠 LLM Request endpoint: ${url}/api/llm`);
        console.log(`⚡ LLM SSE Stream endpoint: ${url}/api/llm/sse\n`);
    }

    private warmupLlm(): void {
        const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
        const hasKey = typeof process !== 'undefined' && Boolean(process.env?.GEMINI_API_KEY ?? process.env?.GOOGLE_GENAI_API_KEY);
        if (isTest || !hasKey) { return; }
        this.pulse(LlmSignalType.INFER, { request: 'Warmup', limit: 1, correlationId: 'system-warmup', thinkingBudget: 0 });
    }

    private buildDefaultRoutes(body: Body): RouteConfig[] {
        const { staticDir, webDir } = body;
        const effectiveWebDir = webDir ?? path.resolve(process.cwd(), DEFAULT_WEB_DIR);
        const effectiveStaticDir = staticDir ?? path.resolve(process.cwd(), DEFAULT_DIST_DIR);
        return [
            { method: 'GET', path: '/api/health', response: { status: 200, body: { status: 'healthy', uca: 'Server' } } },
            { method: 'POST', path: '/api/llm', handler: (context) => this.handleLlmPost(context) },
            { method: 'ALL', path: '/api/llm/sse', handler: (context) => this.handleLlmSse(context) },
            { method: 'ALL', path: '*', handler: (context) => this.handleStaticRequest(context, effectiveStaticDir, effectiveWebDir) },
        ];
    }

    private async handleLlmPost(context: RequestContext): Promise<Response> {
        const { body } = context;
        const { prompt = 'UCA reasoning request', model, provider, temperature, maxOutputTokens, schema, correlationId: bId, requestId, thinkingBudget } = (body ?? {}) as Record<string, unknown>;
        const correlationId = String(bId ?? requestId ?? crypto.randomUUID());
        const budget = typeof thinkingBudget === 'number' ? thinkingBudget : undefined;
        const temp = typeof temperature === 'number' ? temperature : undefined;
        const limit = typeof maxOutputTokens === 'number' ? maxOutputTokens : undefined;
        const targetModel = model ? String(model) : undefined;
        const targetProvider = provider ? String(provider) : undefined;
        const result = await this.requestLlmInference(String(prompt), targetModel, targetProvider, temp, limit, schema as Record<string, unknown> | undefined, correlationId, budget);
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    private requestLlmInference(request: string, model?: string, provider?: string, imagination?: number, limit?: number, expectations?: Record<string, unknown>, correlationId: string = crypto.randomUUID(), thinkingBudget?: number): Promise<InferResult> {
        return new Promise((resolve) => {
            const onInferred = (event: Event) => this.resolveInference(event, resolve, onInferred, onError, correlationId);
            const onError = (event: Event) => this.failInference(event, resolve, onInferred, onError, request, correlationId);
            this.target?.addEventListener(LlmSignalType.INFERRED, onInferred);
            this.target?.addEventListener(LlmSignalType.ERROR, onError);
            this.pulse(LlmSignalType.INFER, { request, model, provider, imagination, limit, expectations, correlationId, thinkingBudget });
        });
    }

    private resolveInference(event: Event, resolve: (r: InferResult) => void, onInferred: (e: Event) => void, onError: (e: Event) => void, correlationId: string): void {
        const customEvent = event as CustomEvent<Signal>;
        const result = customEvent.detail.value as InferResult | undefined;
        if (result?.correlationId && result.correlationId !== correlationId) { return; }
        this.removeInferenceListeners(onInferred, onError);
        resolve(result as InferResult);
    }

    private failInference(event: Event, resolve: (r: InferResult) => void, onInferred: (e: Event) => void, onError: (e: Event) => void, request: string, correlationId: string): void {
        const customEvent = event as CustomEvent<Signal>;
        const { correlationId: errorCorrelationId } = (customEvent.detail.value ?? {}) as { correlationId?: string };
        if (errorCorrelationId && errorCorrelationId !== correlationId) { return; }
        this.removeInferenceListeners(onInferred, onError);
        resolve(this.buildFallbackResult(request, String(customEvent.detail.value)));
    }

    private buildFallbackResult(request: string, errorMessage: string): InferResult {
        const isInitial = request.includes('inicial') || request.includes('¿Quieres saber');
        if (isInitial) {
            return this.buildInitialViewFallback(errorMessage);
        }
        return this.buildExplanationFallback(errorMessage);
    }

    private buildInitialViewFallback(errorMessage: string): InferResult {
        const boxDisp = { aim: { description: 'Contenedor de bienvenida', body: { text: '¿Quieres saber qué es Uca?' } }, reactTo: ['box.create', 'box.update'] };
        const actionDisp = { aim: { description: 'Botón de exploración', body: { label: 'Descubrir qué es UCA' } }, reactTo: ['action.create', 'action.trigger'] };
        const ucas = [
            { id: 'box:center-container', disposition: boxDisp },
            { id: 'action:query-button', disposition: actionDisp },
        ];
        const answer = '¿Quieres saber qué es Uca?';
        const payload = { data: { ucas, answer }, error: errorMessage };
        return { response: JSON.stringify(payload), data: payload };
    }

    private buildExplanationFallback(errorMessage: string): InferResult {
        const panelText = 'UCA (Unidad Cognitiva Artificial) es una primitiva funcional mínima definida formalmente como u = (p, d, C, O), donde p es el Purpose (teleológico e inmutable), d es la Disposition (aim, reactTo y puertos), C son las Capabilities (sustrato reactivo) y O son los Outcomes observables. La cognición emerge fractalmente a través de la interacción de la red de UCAs.';
        const listItems = [
            '1. Purpose: Identidad y objetivo teleológico inmutable.',
            '2. Disposition: Inclinación adaptativa, contratos y reactTo.',
            '3. Capabilities: Habilidades operativas compuestas mediante Cooky.',
            '4. Outcomes: Pulsos nerviosos y eventos observables en el canal.',
        ];
        const ucas = [
            { id: 'box:center-container', disposition: { aim: { description: 'Panel ontológico', body: { text: panelText } }, reactTo: ['box.create'] } },
            { id: 'list:features', disposition: { aim: { description: 'Pilares conceptuales', body: { items: listItems } }, reactTo: ['list.create'] } },
            { id: 'action:query-button', disposition: { aim: { description: 'Botón reintentar', body: { label: 'Volver a consultar UCA' } }, reactTo: ['action.create', 'action.trigger'] } },
        ];
        const payload = { data: { ucas, answer: panelText }, error: errorMessage };
        return { response: JSON.stringify(payload), data: payload };
    }

    private removeInferenceListeners(onInferred: (e: Event) => void, onError: (e: Event) => void): void {
        this.target?.removeEventListener(LlmSignalType.INFERRED, onInferred);
        this.target?.removeEventListener(LlmSignalType.ERROR, onError);
    }

    private handleLlmSse(context: RequestContext): Response {
        const { query, body } = context;
        const { prompt: qP, model: qM, provider: qPr, correlationId: qC, streamId: qS, thinkingBudget: qB } = (query ?? {}) as Record<string, string>;
        const { prompt: bP, model: bM, provider: bPr, correlationId: bC, streamId: bS, thinkingBudget: bB, schema: bSchema } = (body ?? {}) as Record<string, unknown>;
        const prompt = qP ?? (bP ? String(bP) : 'UCA streaming reasoning');
        const correlationId = (bC ? String(bC) : undefined) ?? (bS ? String(bS) : undefined) ?? qC ?? qS ?? crypto.randomUUID();
        const rawBudget = bB ?? qB;
        const budget = typeof rawBudget === 'number' ? rawBudget : (typeof rawBudget === 'string' ? Number(rawBudget) : undefined);
        const model = qM ?? (bM ? String(bM) : undefined);
        const provider = qPr ?? (bPr ? String(bPr) : undefined);
        const schema = bSchema as Record<string, unknown> | undefined;
        return this.createSseResponse(this.createSseReadableStream(prompt, model, provider, correlationId, budget, schema));
    }

    private createSseResponse(stream: ReadableStream): Response {
        const headers = { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache', Connection: 'keep-alive' };
        return new Response(stream, { headers });
    }

    private createSseReadableStream(prompt: string, model: string | undefined, provider: string | undefined, correlationId: string, thinkingBudget?: number, schema?: Record<string, unknown>): ReadableStream {
        let chunkListener: ((e: Event) => void) | undefined;
        let endListener: ((e: Event) => void) | undefined;
        const state = { startTime: Date.now(), chunkCount: 0, correlationId };
        const start = (controller: ReadableStreamDefaultController) => {
            const encoder = new TextEncoder();
            chunkListener = (e: Event) => this.writeSseChunk(e, controller, encoder, state);
            endListener = (e: Event) => this.finishSseStream(e, controller, encoder, state, chunkListener, endListener);
            this.bindSseNervousEvents(controller, encoder, prompt, model, provider, correlationId, chunkListener, endListener, thinkingBudget, schema);
        };
        return new ReadableStream({ start, cancel: () => this.removeSseListeners(chunkListener, endListener) });
    }

    private removeSseListeners(chunkListener?: (event: Event) => void, endListener?: (event: Event) => void): void {
        if (chunkListener) { this.target?.removeEventListener(LlmSignalType.CHUNK, chunkListener); }
        if (endListener) { this.target?.removeEventListener(LlmSignalType.STREAM_END, endListener); }
    }

    private bindSseNervousEvents(
        controller: ReadableStreamDefaultController,
        encoder: TextEncoder,
        prompt: string,
        model: string | undefined,
        provider: string | undefined,
        correlationId: string,
        chunkListener: (event: Event) => void,
        endListener: (event: Event) => void,
        thinkingBudget?: number,
        schema?: Record<string, unknown>,
    ): void {
        console.log(`⚡ [SERVER] Conectando canal SSE [${correlationId}] con LLM (${provider ?? 'default'}/${model ?? 'default'})...`);
        try { controller.enqueue(encoder.encode(`event: start\ndata: ${JSON.stringify({ status: 'connected', correlationId, prompt, model, provider })}\n\n`)); } catch {}
        this.target?.addEventListener(LlmSignalType.CHUNK, chunkListener);
        this.target?.addEventListener(LlmSignalType.STREAM_END, endListener);
        this.pulse(LlmSignalType.STREAM, { request: prompt, model, provider, correlationId, streamId: correlationId, expectations: schema, thinkingBudget });
    }

    private writeSseChunk(event: Event, controller: ReadableStreamDefaultController, encoder: TextEncoder, state: { startTime: number; chunkCount: number; correlationId: string }): void {
        const customEvent = event as CustomEvent<Signal>;
        const { text, correlationId, streamId } = (customEvent.detail.value ?? {}) as ChunkResult;
        const eventId = correlationId ?? streamId;
        if ((eventId && eventId !== state.correlationId) || !text) { return; }
        state.chunkCount += 1;
        const elapsed = Date.now() - state.startTime;
        console.log(`📤 [SERVER] [${state.correlationId}] [t=+${elapsed}ms] Chunk #${state.chunkCount} (${text.length} ch)`);
        try { controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify({ text, correlationId: state.correlationId })}\n\n`)); } catch {}
    }

    private finishSseStream(
        event: Event,
        controller: ReadableStreamDefaultController,
        encoder: TextEncoder,
        state: { startTime: number; chunkCount: number; correlationId: string },
        chunkListener?: (event: Event) => void,
        endListener?: (event: Event) => void,
    ): void {
        const customEvent = event as CustomEvent<Signal>;
        const { correlationId, streamId } = (customEvent.detail?.value ?? {}) as StreamEndResult;
        const eventId = correlationId ?? streamId;
        if (eventId && eventId !== state.correlationId) { return; }
        const elapsed = Date.now() - state.startTime;
        console.log(`🏁 [SERVER] [${state.correlationId}] [t=+${elapsed}ms] Finalizado stream SSE (${state.chunkCount} chunks enviados).`);
        this.removeSseListeners(chunkListener, endListener);
        try {
            controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ done: true, correlationId: state.correlationId })}\n\n`));
            controller.close();
        } catch {}
    }

    private handleStaticRequest(context: RequestContext, staticDir?: string, webDir?: string): Response {
        const { path: requestPath } = context;
        const filePath = this.resolveStaticPath(requestPath, staticDir, webDir);
        if (!filePath) {
            return new Response(JSON.stringify({ error: 'Not Found', path: requestPath }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const contentType = this.resolveMimeType(filePath);
        const content = fs.readFileSync(filePath);
        return new Response(content, { status: 200, headers: { 'Content-Type': contentType } });
    }

    private resolveStaticPath(requestPath: string, staticDir?: string, webDir?: string): string | null {
        const normalized = requestPath === '/' || requestPath === '' ? '/index.html' : requestPath;
        if (webDir) {
            const webPath = path.join(webDir, normalized);
            if (fs.existsSync(webPath) && fs.statSync(webPath).isFile()) { return webPath; }
        }
        if (staticDir) {
            const distPath = path.join(staticDir, normalized);
            if (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) { return distPath; }
        }
        return null;
    }

    private resolveMimeType(filePath: string): string {
        const extension = path.extname(filePath).toLowerCase();
        const mimeMap: Record<string, string> = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
        };
        return mimeMap[extension] ?? 'application/octet-stream';
    }
}

export * from './types.js';
export * from './constants.js';

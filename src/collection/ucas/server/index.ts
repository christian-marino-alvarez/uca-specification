import { Logger } from '@uca/logger';
import { SignalType as LoggerSignalType, Scope } from '@uca/logger/types';
import { normalizeInference } from './constants.js';
import { createSseStream, requestStreamSource } from './sse.js';
import type { InferenceRequest, ValidationContext } from './types.js';
import { Schema } from '@uca/capability-schema';
import { SignalType as SchemaSignalType, type ValidatedResult, type ErrorResult } from '@uca/capability-schema/types';
import { inferenceSchema } from '@uca/llm/schema';
import type { Failure } from '@uca/llm/types';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { HttpServer } from '@uca/capability-http-server';
import {
    SignalType as HttpServerSignalType,
    type Body as HttpServerBody,
    type RequestContext,
    type RouteConfig,
} from '@uca/capability-http-server/types';
import { Jev } from '@uca/capability-jev';
import { Gemini } from '@uca/capability-gemini';
import { Openai } from '@uca/capability-openai';
import { SignalType as JevSignalType, type InferResult as JevResult } from '@uca/capability-jev/types';
import { SignalType as GeminiSignalType, type GenerateResult } from '@uca/capability-gemini/types';
import { SignalType as OpenaiSignalType } from '@uca/capability-openai/types';
import { createCommand } from './inference.js';
import { DEFAULT_PROVIDER } from '@uca/llm/constants';
import {
    SignalType as LlmSignalType,
    type InferPayload,
    type InferResult,
} from '@uca/llm/types';
import {
    __ID__,
    SSE_HEADERS,
    DEFAULT_AUTO_START,
    DEFAULT_DIST_DIR,
    DEFAULT_HOSTNAME,
    DEFAULT_PORT,
    DEFAULT_WEB_DIR,
    MIME_MAP,
    WARMUP_CONTRACT,
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
        reactTo: [
            ...Logger.disposition.reactTo ?? [],
            SignalType.START,
            SignalType.STOP,
            SignalType.ROUTE,
            SignalType.RESPOND,
            HttpServerSignalType.LISTENING,
            HttpServerSignalType.CLOSED,
            HttpServerSignalType.REQUEST,
            HttpServerSignalType.ERROR,
            JevSignalType.INFERRED, JevSignalType.ERROR,
            GeminiSignalType.GENERATED, GeminiSignalType.STREAMED, GeminiSignalType.ERROR,
            OpenaiSignalType.GENERATED, OpenaiSignalType.STREAMED, OpenaiSignalType.ERROR,
            SchemaSignalType.VALIDATE, SchemaSignalType.VALIDATED, SchemaSignalType.ERROR,
            ...HttpServer.disposition.reactTo ?? [],
            ...Jev.disposition.reactTo ?? [], ...Gemini.disposition.reactTo ?? [], ...Openai.disposition.reactTo ?? [],
        ],
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
            { signal: LlmSignalType.INFERRED, type: DataType.INFER_RESULT },
            { signal: LlmSignalType.STREAMED, type: DataType.STREAM_RESULT },
            { signal: LlmSignalType.STREAM_END, type: DataType.STREAM_END_RESULT },
            { signal: LlmSignalType.ERROR, type: DataType.UNKNOWN },
        ],
    };

    private readonly streams = new Map<string, AbortController>();

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.streams.forEach((controller) => controller.abort());
        this.streams.clear();
        this.registry.forEach((capability) => capability.denervate());
        super.denervate();
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
            case JevSignalType.INFERRED: this.handleJevInferred(signal); break;
            case JevSignalType.ERROR: this.handleJevError(signal); break;
            case GeminiSignalType.GENERATED: this.handleGeminiGenerated(signal); break;
            case GeminiSignalType.STREAMED: this.handleGeminiStreamed(signal); break;
            case GeminiSignalType.ERROR: this.handleGeminiError(signal); break;
            case OpenaiSignalType.GENERATED: this.handleOpenaiGenerated(signal); break;
            case OpenaiSignalType.STREAMED: this.handleOpenaiStreamed(signal); break;
            case OpenaiSignalType.ERROR: this.handleOpenaiError(signal); break;
            case SchemaSignalType.VALIDATED: this.handleValidated(value as ValidatedResult); break;
            case SchemaSignalType.ERROR: this.handleValidationError(value as ErrorResult); break;
            default:
                this.handleCapabilitySignal(property, value);
                break;
        }
    }

    // The wildcard activates Logger in the catalog; only Logger subscribes to it.
    protected override receptors(): string[] {
        return super.receptors().filter((property) => property !== LoggerSignalType.OBSERVE);
    }

    protected override catalog(): Cooky {
        const { aim } = this.disposition;
        const body = aim.body ?? {}; const { routes = [] } = body;
        return [
            [Logger, { aim: { description: Logger.purpose, body: { id: `${this.id}:logger`, scope: Scope.BACKEND } }, reactTo: [...Logger.disposition.reactTo ?? []] }],
            [HttpServer, this.createHttpServerDisposition(body, [...routes, ...this.buildDefaultRoutes(body)])],
            [Jev, { ...Jev.disposition, aim: { description: Jev.AIM, body: { id: `${this.id}:jev` } } }],
            [Gemini, { ...Gemini.disposition, aim: { description: Gemini.AIM, body: { id: `${this.id}:gemini` } } }],
            [Openai, { ...Openai.disposition, aim: { description: Openai.AIM, body: { id: `${this.id}:openai` } } }],
            [Schema, { ...Schema.disposition, aim: { description: Schema.AIM, body: { id: `${this.id}:schema` } } }],
        ];
    }

    private createHttpServerDisposition(body: Body, routes: RouteConfig[]): Disposition<HttpServerBody> {
        const { port = DEFAULT_PORT, hostname = DEFAULT_HOSTNAME, autoStart = DEFAULT_AUTO_START } = body;
        return {
            aim: { description: HttpServer.AIM, body: { port, hostname, routes, autoStart } },
            reactTo: [...HttpServer.disposition.reactTo ?? []],
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
        console.log(`\n[${Scope.BACKEND}] [${this.id}] 🚀 UCA Server successfully started at: ${url}`);
        console.log(`[${Scope.BACKEND}] [${this.id}] 🌐 Web Application running at: ${url}`);
        console.log(`[${Scope.BACKEND}] [${this.id}] 📡 Health endpoint: ${url}/api/health`);
        console.log(`[${Scope.BACKEND}] [${this.id}] 🧠 LLM Request endpoint: ${url}/api/llm`);
        console.log(`[${Scope.BACKEND}] [${this.id}] ⚡ LLM SSE Stream endpoint: ${url}/api/llm/sse\n`);
    }

    private warmupLlm(): void {
        const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
        const hasKey = typeof process !== 'undefined' && Boolean(process.env?.GEMINI_API_KEY ?? process.env?.GOOGLE_GENAI_API_KEY);
        if (isTest || !hasKey) { return; }
        const { property, value } = createCommand({ ...WARMUP_CONTRACT, limit: 1, correlationId: 'system-warmup' });
        this.pulse(property, value);
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
        const payload = normalizeInference(body as InferenceRequest);
        console.log(`[BACKEND::LLM::INPUT] [${payload.correlationId}]`, { purpose: payload.purpose, goal: payload.goal, model: payload.model, provider: payload.provider });
        try {
            const result = await this.requestLlmInference(payload);
            console.log(`[BACKEND::LLM::RESPONSE] [${payload.correlationId}]`, { model: result.model });
            return Response.json(result);
        } catch (error) {
            console.error(`[BACKEND::LLM::ERROR] [${payload.correlationId}]`, error);
            const { correlationId } = payload;
            return Response.json({ error: String(error), correlationId }, { status: 502 });
        }
    }

    private requestLlmInference(payload: InferPayload): Promise<InferResult> {
        const { correlationId } = payload;
        return new Promise((resolve, reject) => {
            const onInferred = (event: Event) => { const { detail: { source, value } } = event as CustomEvent<Signal<InferResult>>; const { correlationId: receivedId } = value; if (source !== this.id || receivedId !== correlationId) { return; } this.removeInferenceListeners(onInferred, onError); resolve(value); };
            const onError = (event: Event) => { const { detail: { source, value } } = event as CustomEvent<Signal<Failure>>; const { correlationId: receivedId, error } = value; if (source !== this.id || receivedId !== correlationId) { return; } this.removeInferenceListeners(onInferred, onError); reject(new Error(String(error))); };
            this.target?.addEventListener(LlmSignalType.INFERRED, onInferred);
            this.target?.addEventListener(LlmSignalType.ERROR, onError);
            this.pulse(SchemaSignalType.VALIDATE, { schema: inferenceSchema, value: payload, context: { stream: false, correlationId } });
        });
    }

    private removeInferenceListeners(onInferred: (e: Event) => void, onError: (e: Event) => void): void {
        this.target?.removeEventListener(LlmSignalType.INFERRED, onInferred);
        this.target?.removeEventListener(LlmSignalType.ERROR, onError);
    }

    private handleLlmSse(context: RequestContext): Response {
        const { target, id: source } = this;
        const { query, body } = context;
        const payload = normalizeInference({ ...query, ...(body as InferenceRequest) });
        const { correlationId = crypto.randomUUID(), provider = DEFAULT_PROVIDER } = payload;
        const controller = new AbortController(); const { signal: abort } = controller; this.streams.set(correlationId, controller);
        const request = () => this.pulse(SchemaSignalType.VALIDATE, { schema: inferenceSchema, value: payload, context: { stream: true, correlationId } });
        const cancel = () => this.pulse(provider === 'openai' ? OpenaiSignalType.ABORT : GeminiSignalType.ABORT, { correlationId });
        const response = requestStreamSource({ target, source, correlationId, abort, request, cancel });
        const stream = createSseStream(response, correlationId, controller, () => this.streams.delete(correlationId), () => this.pulse(LlmSignalType.STREAM_END, { correlationId }));
        return new Response(stream, { headers: SSE_HEADERS });
    }

    private handleJevInferred(signal: Signal): void {
        const { value } = signal;
        const { answers, state, model, correlationId } = value as JevResult;
        this.pulse(LlmSignalType.INFERRED, { response: JSON.stringify(answers), data: answers, context: state, model, correlationId });
    }
    private handleValidated(result: ValidatedResult): void {
        const { value: payload, context } = result;
        const { stream } = context as ValidationContext;
        const { property, value } = createCommand(payload as InferPayload, stream);
        this.pulse(property, value);
    }
    private handleValidationError(result: ErrorResult): void {
        const { error, context } = result;
        const { correlationId } = context as ValidationContext;
        this.pulse(LlmSignalType.ERROR, { error, correlationId });
    }
    private handleGeminiGenerated(signal: Signal): void {
        const { value } = signal;
        const { text: response, data, model, usage, correlationId } = value as GenerateResult;
        this.pulse(LlmSignalType.INFERRED, { response, data, model, usage, correlationId });
    }
    private handleOpenaiGenerated(signal: Signal): void {
        const { value } = signal;
        const { text: response, data, model, usage, correlationId } = value as GenerateResult;
        this.pulse(LlmSignalType.INFERRED, { response, data, model, usage, correlationId });
    }
    private handleJevError(signal: Signal): void {
        const { value } = signal;
        this.pulse(LlmSignalType.ERROR, value);
    }
    private handleGeminiStreamed(signal: Signal): void {
        const { value } = signal;
        this.pulse(LlmSignalType.STREAMED, value);
    }
    private handleGeminiError(signal: Signal): void {
        const { value } = signal;
        this.pulse(LlmSignalType.ERROR, value);
    }
    private handleOpenaiStreamed(signal: Signal): void {
        const { value } = signal;
        this.pulse(LlmSignalType.STREAMED, value);
    }
    private handleOpenaiError(signal: Signal): void {
        const { value } = signal;
        this.pulse(LlmSignalType.ERROR, value);
    }

    private handleStaticRequest(context: RequestContext, staticDir?: string, webDir?: string): Response {
        const { path: requestPath } = context;
        const filePath = this.resolveStaticPath(requestPath, staticDir, webDir);
        if (!filePath) {
            return Response.json({ error: 'Not Found', path: requestPath }, { status: 404 });
        }
        const contentType = this.resolveMimeType(filePath);
        const content = fs.readFileSync(filePath);
        const headers = { 'Content-Type': contentType, 'Cache-Control': 'no-cache, no-store, must-revalidate' };
        return new Response(content, { status: 200, headers });
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
        return MIME_MAP[extension] ?? 'application/octet-stream';
    }
}



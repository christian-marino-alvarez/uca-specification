import { Uca } from '@uca/core/uca';
import type { Cooky, Disposition, Signal } from '@uca/core/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { __ID__, DEFAULT_SIGNALS, INPUTS, OUTPUTS } from './constants.js';
import { type Body, type BuildPayload, type StreamPayload, SignalType } from './types.js';

export class Builder extends Uca<Body> {
    public static override purpose: string = 'Materialize and visually delimit UI regions and spatial layouts using Box containers according to compositional declarations';

    public static override disposition: Disposition<Body> = {
        aim: { description: Builder.purpose },
        reactTo: [...DEFAULT_SIGNALS],
        inputs: INPUTS,
        outputs: OUTPUTS,
    };

    private streamController?: AbortController;

    public constructor(id: string = __ID__) {
        super(id);
    }

    public override denervate(): void {
        this.streamController?.abort();
        this.streamController = undefined;
        super.denervate();
    }

    protected override capabilities(): Cooky {
        const { reactTo } = Box.disposition;
        const body = { id: `${this.id}:box` };
        return [
            [Box, { aim: { description: Box.purpose, body }, reactTo }],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value, source } = signal;
        switch (property) {
            case SignalType.BUILD: this.handleBuild(value); break;
            case SignalType.STREAM: this.handleStream(value); break;
            case SignalType.UPDATE: this.handleUpdate(value); break;
            case SignalType.REMOVE: this.handleRemove(value); break;
            case SignalType.RESET: this.handleReset(value); break;
            case BoxSignalType.CREATED: this.handleBoxCreated(value, source); break;
            case BoxSignalType.UPDATED: this.handleBoxUpdated(value, source); break;
            case BoxSignalType.REMOVED: this.handleBoxRemoved(value, source); break;
            case BoxSignalType.ERROR: this.handleBoxError(value, source); break;
            default: break;
        }
    }

    private handleBuild(value: unknown): void {
        const { id, elementId = id ?? this.id, parentTo, qualities, content, dimensions } = (value ?? {}) as BuildPayload;
        const resolvedQualities = { ...qualities, ...(dimensions && { width: dimensions.width, height: dimensions.height }) };
        const safeContent = this.sanitizeContent(content);
        this.pulse(BoxSignalType.RENDER, { elementId, parentTo, qualities: resolvedQualities, content: safeContent });
    }

    private handleUpdate(value: unknown): void {
        const { id, elementId = id ?? this.id, qualities, content, dimensions } = (value ?? {}) as BuildPayload;
        const resolvedQualities = { ...qualities, ...(dimensions && { width: dimensions.width, height: dimensions.height }) };
        const safeContent = this.sanitizeContent(content);
        this.pulse(BoxSignalType.UPDATE, { elementId, qualities: resolvedQualities, content: safeContent });
    }

    private handleRemove(value: unknown): void {
        const { id, elementId = id ?? this.id } = (value ?? {}) as BuildPayload;
        this.pulse(BoxSignalType.REMOVE, { elementId });
    }

    private handleStream(value: unknown): void {
        const { stream, reset, correlationId } = (value ?? {}) as StreamPayload;
        if (!stream) { return; }
        if (reset) { this.clearHost(); }
        void this.executeStream(stream, correlationId);
    }

    private async executeStream(stream: ReadableStream, correlationId?: string): Promise<void> {
        this.streamController?.abort();
        this.streamController = new AbortController();
        const { signal } = this.streamController;
        const writable = new WritableStream({
            write: (chunk) => this.renderStreamChunk(chunk as BuildPayload | Record<string, BuildPayload>),
        });
        try {
            await stream.pipeTo(writable, { signal });
            this.pulse(SignalType.BUILT, { done: true, correlationId });
        } catch (error) {
            this.handleStreamError(error, correlationId);
        }
    }

    private handleStreamError(error: unknown, correlationId?: string): void {
        const { name = '', message = '' } = (error ?? {}) as { name?: string; message?: string };
        if (name === 'AbortError' || message.includes('aborted')) { return; }
        const errMessage = error instanceof Error ? error.message : String(error);
        this.pulse(SignalType.ERROR, { error: errMessage, correlationId });
    }

    private handleReset(value?: unknown): void {
        const { parentTo } = (value ?? {}) as { parentTo?: string };
        this.clearHost(parentTo);
        this.pulse(SignalType.REMOVED, { parentTo });
    }

    private clearHost(targetHost?: string): void {
        if (typeof document === 'undefined') { return; }
        const { aim } = this.disposition;
        const { parentTo = targetHost ?? 'app' } = aim.body ?? {};
        const host = document.getElementById(parentTo);
        if (host) { host.innerHTML = ''; }
    }

    private renderStreamChunk(chunk: BuildPayload | Record<string, BuildPayload>): void {
        const payload = this.normalizeChunk(chunk);
        if (!payload) { return; }
        this.reconcileElement(payload);
    }

    private reconcileElement(payload: BuildPayload): void {
        const { elementId = this.id } = payload;
        const exists = typeof document !== 'undefined' && Boolean(document.getElementById(elementId));
        if (exists) {
            this.handleUpdate(payload);
            return;
        }
        this.handleBuild(payload);
    }

    private normalizeChunk(chunk: BuildPayload | Record<string, BuildPayload>): BuildPayload | undefined {
        if ('elementId' in chunk && typeof chunk.elementId === 'string') {
            return chunk as BuildPayload;
        }
        const [entry] = Object.entries(chunk);
        if (!entry) { return undefined; }
        const [elementId, node] = entry;
        const { dimensions, parentTo, purpose, context, qualities, content } = (node ?? {}) as BuildPayload;
        const safeContent = this.sanitizeContent(content);
        return { elementId, parentTo, dimensions, qualities, content: safeContent, purpose, context };
    }

    private sanitizeContent(content?: string): string | undefined {
        if (!content) { return undefined; }
        const cleaned = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        return cleaned.replace(/javascript:/gi, '');
    }

    private handleBoxCreated(value: unknown, source: string): void {
        if (!source.startsWith(this.id)) { return; }
        const { elementId = this.id, detail } = (value ?? {}) as { elementId?: string; detail?: unknown };
        this.pulse(SignalType.BUILT, { elementId, detail });
        this.pulse(SignalType.CREATED, { elementId, detail });
    }

    private handleBoxUpdated(value: unknown, source: string): void {
        if (!source.startsWith(this.id)) { return; }
        const { elementId = this.id, detail } = (value ?? {}) as { elementId?: string; detail?: unknown };
        this.pulse(SignalType.UPDATED, { elementId, detail });
    }

    private handleBoxRemoved(value: unknown, source: string): void {
        if (!source.startsWith(this.id)) { return; }
        const { elementId = this.id, detail } = (value ?? {}) as { elementId?: string; detail?: unknown };
        this.pulse(SignalType.REMOVED, { elementId, detail });
    }

    private handleBoxError(value: unknown, source: string): void {
        if (!source.startsWith(this.id)) { return; }
        const { error = 'Box build failed' } = (value ?? {}) as { error?: string };
        this.pulse(SignalType.ERROR, { error });
    }
}

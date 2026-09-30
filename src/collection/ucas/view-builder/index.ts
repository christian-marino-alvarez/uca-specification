import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { GoogleWebPrompt, SignalType as PromptSignalType } from '../../capabilities/google-web-prompt/index.js';
import { WebComponent } from '../../capabilities/web-component/index.js';
import { Css } from '../../capabilities/css/index.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import {
    type Body,
    type BuildPayload,
    type ViewGraphResult,
    type ViewVisualResult,
    SignalType,
} from './types.js';

export class ViewBuilder extends Uca<Body> {
    public static readonly PURPOSE: string = 'Create web capability views using native Web Prompt LLM and pulse visual and graph outcomes';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(ViewBuilder.PURPOSE, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.BUILD, type: 'BuildPayload', description: 'Prompt and requirements to generate view' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort active view generation' },
            ],
            outputs: [
                { signal: SignalType.VISUAL, type: 'ViewVisualResult', description: 'Visual UI elements tree created with web capabilities' },
                { signal: SignalType.GRAPH, type: 'ViewGraphResult', description: 'Topological graph of view nodes and connections' },
                { signal: SignalType.STREAM, type: 'ReadableStream<string>', description: 'Streaming tokens from Prompt API' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'View generation error' },
            ],
        });
    }

    public constructor(id: string = __ID__) {
        super(id, ViewBuilder.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? ViewBuilder.createDefaultDisposition();
        const { reactTo = [] } = baseDisposition;
        const internalSignals = [PromptSignalType.STREAM, PromptSignalType.ERROR];
        const initialSignals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const signals = Array.from(new Set([...initialSignals, ...internalSignals]));
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        return super.innervate(target, activeDisposition);
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { systemPrompt, temperature, promptAdapter } = aim.body ?? {};
        const defaultPrompt = 'You are an autonomous UI architect generating view structures and topology graphs.';
        const promptDisp = Capability.createDisposition('Native Web Prompt capability', {
            systemPrompt: systemPrompt ?? defaultPrompt,
            temperature: temperature ?? 0.2,
            adapter: promptAdapter,
        });
        const webComponentDisp = Capability.createDisposition('Web component structure capability');
        const cssDisp = Capability.createDisposition('CSS presentation capability');
        return [
            [GoogleWebPrompt, promptDisp],
            [WebComponent, webComponentDisp],
            [Css, cssDisp],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.BUILD:
                this.handleBuild(value);
                break;
            case SignalType.ABORT:
                this.handleAbort();
                break;
            default:
                this.handleCapabilitySignal(property, value);
                break;
        }
    }

    private handleCapabilitySignal(property: string, value: unknown): void {
        if (property === PromptSignalType.STREAM) {
            this.handlePromptStream(value as ReadableStream<string>);
        } else if (property === PromptSignalType.ERROR) {
            this.emitOutcomes('');
            this.pulse(SignalType.ERROR, value);
        }
    }

    private handleBuild(value: unknown): void {
        const payload = this.extractPayload<BuildPayload>(value);
        if (!payload?.description) { return; }
        const promptText = `Generate view structure and topology for: ${payload.description}`;
        this.pulse(PromptSignalType.GENERATE, { text: promptText, signal: payload.signal });
    }

    private handleAbort(): void {
        this.pulse(PromptSignalType.ABORT, undefined);
    }

    private handlePromptStream(stream: ReadableStream<string>): void {
        const [pulseStream, consumeStream] = stream.tee();
        this.pulse(SignalType.STREAM, pulseStream);
        void this.materializeStream(consumeStream);
    }

    private async materializeStream(stream: ReadableStream<string>): Promise<void> {
        try {
            const rawText = await this.readAllChunks(stream.getReader());
            console.debug('[ViewBuilder] ◄ STREAM PARSED TEXT:', rawText);
            this.emitOutcomes(rawText);
        } catch (error) {
            console.error('[ViewBuilder] ✗ CONSUME STREAM ERROR:', error);
            this.pulse(SignalType.ERROR, error);
        }
    }

    private async readAllChunks(reader: ReadableStreamDefaultReader<string>): Promise<string> {
        const chunks: string[] = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) { break; }
            if (value) { chunks.push(value); }
        }
        return chunks.join('');
    }

    private emitOutcomes(rawText: string): void {
        const { aim } = this.disposition;
        const { parser } = aim.body ?? {};
        const parsed = parser ? parser(rawText) : this.createFallbackParsedView(rawText);
        const { visual, graph } = parsed;
        this.pulse(SignalType.VISUAL, visual);
        this.pulse(SignalType.GRAPH, graph);
    }

    private createFallbackParsedView(rawText: string): { visual: ViewVisualResult; graph: ViewGraphResult } {
        const visual: ViewVisualResult = {
            title: rawText || 'Google Style Search View',
            elements: [
                { id: 'search-box', type: 'box', props: { role: 'search' } },
                { id: 'search-input', type: 'input', props: { placeholder: 'Search or enter query...', role: 'searchbox' } },
                { id: 'search-button', type: 'action', props: { text: 'Google Search', role: 'button' } },
            ],
        };
        const graph: ViewGraphResult = {
            nodes: [
                { id: 'search-input', aimDescription: 'User search query text input', inputsCount: 1, outputsCount: 1 },
                { id: 'search-button', aimDescription: 'Action button to trigger query search', inputsCount: 1, outputsCount: 1 },
            ],
            edges: [
                { fromNode: 'search-button', toNode: 'search-input', signal: 'action.triggered', type: 'void' },
            ],
        };
        return { visual, graph };
    }
}

export * from './types.js';
export * from './constants.js';



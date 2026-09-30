import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { Gemini, SignalType as GeminiCapabilitySignalType } from '../../capabilities/gemini/index.js';
import { GoogleWebPrompt, SignalType as PromptCapabilitySignalType } from '../../capabilities/google-web-prompt/index.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import { type Body, type PromptPayload, SignalType } from './types.js';

export class Llm extends Uca<Body> {
    public static readonly PURPOSE: string = 'Encapsulate dedicated on-device or cloud LLM inference and stream cognitive generative responses';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(Llm.PURPOSE, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.PROMPT, type: 'PromptPayload', description: 'Prompt and stream response from dedicated LLM' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort ongoing LLM generation' },
            ],
            outputs: [
                { signal: SignalType.STREAM, type: 'ReadableStream<string>', description: 'Streaming tokens from dedicated LLM' },
                { signal: SignalType.RESPONSE, type: '{ completed: boolean }', description: 'Generation completion notification' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'LLM generation error' },
            ],
        });
    }

    public constructor(id: string = __ID__) {
        super(id, Llm.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? Llm.createDefaultDisposition();
        const { reactTo = [] } = baseDisposition;
        const internalSignals = [GeminiCapabilitySignalType.STREAM, PromptCapabilitySignalType.STREAM, GeminiCapabilitySignalType.ERROR, PromptCapabilitySignalType.ERROR];
        const initialSignals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const signals = Array.from(new Set([...initialSignals, ...internalSignals]));
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        return super.innervate(target, activeDisposition);
    }

    protected override capabilities(): Cooky {
        const { aim } = this.disposition;
        const { provider = 'gemini', model, systemPrompt, temperature, maxOutputTokens, apiKey } = aim.body ?? {};
        if (provider === 'google-web-prompt') {
            const promptDisp = Capability.createDisposition('Web Prompt provider', { temperature, systemPrompt });
            return [[GoogleWebPrompt, promptDisp]];
        }
        const geminiDisp = Capability.createDisposition('Gemini provider', { model, temperature, maxOutputTokens, connection: { apiKey, model } });
        return [[Gemini, geminiDisp]];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        switch (property) {
            case SignalType.PROMPT:
                this.handlePrompt(value);
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
        if (property === GeminiCapabilitySignalType.STREAM || property === PromptCapabilitySignalType.STREAM) {
            this.pulse(SignalType.STREAM, value);
        } else if (property === GeminiCapabilitySignalType.ERROR || property === PromptCapabilitySignalType.ERROR) {
            this.pulse(SignalType.ERROR, value);
        }
    }

    private handlePrompt(value: unknown): void {
        const payload = this.extractPayload<PromptPayload>(value);
        if (!payload?.text) { return; }
        const { aim } = this.disposition;
        const { provider = 'gemini' } = aim.body ?? {};
        const targetSignal = provider === 'google-web-prompt' ? PromptCapabilitySignalType.GENERATE : GeminiCapabilitySignalType.GENERATE;
        this.pulse(targetSignal, { text: payload.text, model: payload.model, temperature: payload.temperature, signal: payload.signal });
    }

    private handleAbort(): void {
        const { aim } = this.disposition;
        const { provider = 'gemini' } = aim.body ?? {};
        const targetSignal = provider === 'google-web-prompt' ? PromptCapabilitySignalType.ABORT : GeminiCapabilitySignalType.ABORT;
        this.pulse(targetSignal, undefined);
    }
}




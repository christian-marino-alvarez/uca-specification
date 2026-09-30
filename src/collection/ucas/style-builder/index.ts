import { Uca } from '../../../core/uca.js';
import { Capability } from '../../../core/capability.js';
import type { Cooky, Disposition, Signal } from '../../../core/types.js';
import { Css, SignalType as CssSignalType } from '../../capabilities/css/index.js';
import { __ID__, __DEFAULT_SIGNALS__ } from './constants.js';
import {
    type Body,
    type DesignPayload,
    type StyleDesignResult,
    SignalType,
} from './types.js';
import type { ViewVisualResult } from '../view-builder/types.js';

export class StyleBuilder extends Uca<Body> {
    public static readonly PURPOSE: string = 'Design visual styles and themes for views created by web capability view builders';

    private static createDefaultDisposition(): Disposition<Body> {
        return Capability.createDisposition<Body>(StyleBuilder.PURPOSE, {}, [...__DEFAULT_SIGNALS__], {
            inputs: [
                { signal: SignalType.DESIGN, type: 'DesignPayload', description: 'Visual view structure and styling requirements' },
                { signal: SignalType.ABORT, type: 'void', description: 'Abort style designing process' },
            ],
            outputs: [
                { signal: SignalType.STYLED, type: 'StyleDesignResult', description: 'Visual styles, classes and theme attributes' },
                { signal: SignalType.STREAM, type: 'ReadableStream<string>', description: 'Streaming tokens from Prompt capability' },
                { signal: SignalType.ERROR, type: 'unknown', description: 'Style design error' },
            ],
        });
    }

    public constructor(id: string = __ID__) {
        super(id, StyleBuilder.PURPOSE);
    }

    public override innervate(target?: EventTarget, disposition?: Disposition<Body>): this {
        const baseDisposition = disposition ?? StyleBuilder.createDefaultDisposition();
        const { reactTo = [] } = baseDisposition;
        const initialSignals = reactTo.length > 0 ? reactTo : [...__DEFAULT_SIGNALS__];
        const signals = Array.from(new Set(initialSignals));
        const activeDisposition: Disposition<Body> = { ...baseDisposition, reactTo: signals };
        return super.innervate(target, activeDisposition);
    }

    protected override capabilities(): Cooky {
        const cssDisp = Capability.createDisposition('CSS rule manager for OOCSS presentation');
        return [
            [Css, cssDisp],
        ];
    }

    protected override react(signal: Signal): void {
        const { property, value } = signal;
        if (property === SignalType.ABORT) {
            this.handleAbort();
            return;
        }
        this.handleDesign(value);
    }

    private handleDesign(value: unknown): void {
        const payload = this.resolveDesignPayload(value);
        if (!payload?.visual) { return; }
        const { aim } = this.disposition;
        const { designer } = aim.body ?? {};
        const result: StyleDesignResult = designer ? designer(payload) : this.createDefaultStyles(payload);
        this.pulse(SignalType.STYLED, result);
        this.pulseCssRules(result);
    }

    private resolveDesignPayload(value: unknown): DesignPayload | undefined {
        const raw = this.extractPayload<DesignPayload | ViewVisualResult>(value);
        if (!raw || typeof raw !== 'object') { return undefined; }
        if ('elements' in raw) {
            return { visual: raw as ViewVisualResult };
        }
        return raw as DesignPayload;
    }

    private pulseCssRules(result: StyleDesignResult): void {
        const { generatedCssRules = [] } = result;
        for (const rule of generatedCssRules) {
            this.pulse(CssSignalType.CREATE, rule);
        }
    }

    private handleAbort(): void {
        this.pulse(SignalType.ABORT, undefined);
    }

    private createDefaultStyles(payload: DesignPayload): StyleDesignResult {
        const { visual, theme = 'light' } = payload;
        const elementStyles = (visual.elements ?? []).map((el) => ({
            elementId: el.id,
            theme: theme as 'light' | 'dark',
            classes: [`ext-${el.type}`, el.id],
        }));
        const boxRule: { selector: string; declarations: Record<string, string> } = {
            selector: '.search-box',
            declarations: { display: 'flex', 'flex-direction': 'column', 'align-items': 'center', gap: '1rem', padding: '2rem' },
        };
        const inputRule: { selector: string; declarations: Record<string, string> } = {
            selector: '.search-input',
            declarations: { width: '100%', 'max-width': '584px', padding: '0.75rem 1.25rem', 'border-radius': '24px', border: '1px solid #dfe1e5', 'font-size': '16px', outline: 'none' },
        };
        const buttonRule: { selector: string; declarations: Record<string, string> } = {
            selector: '.search-button',
            declarations: { 'background-color': '#f8f9fa', border: '1px solid #f8f9fa', padding: '0.6rem 1.2rem', 'border-radius': '4px', cursor: 'pointer', 'font-size': '14px', color: '#3c4043' },
        };
        return {
            viewTitle: visual.title,
            palette: { primary: '#4285f4', background: theme === 'dark' ? '#0f172a' : '#ffffff' },
            elementStyles,
            generatedCssRules: [boxRule, inputRule, buttonRule],
        };
    }
}

export * from './types.js';
export * from './constants.js';



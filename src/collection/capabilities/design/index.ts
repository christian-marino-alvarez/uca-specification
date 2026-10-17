import { Capability } from '@uca/core/capability';
import type {
    Aim,
    Disposition,
    Signal,
} from '@uca/core/types';
import {
    AIM,
    DEFAULT_THEME,
    DEFAULT_VARIANT,
    __ID__,
} from './constants.js';
import {
    designSpecificationSchema,
    resolvePayloadSchema,
    resolvedResultSchema,
    themePayloadSchema,
} from './schema.js';
import {
    DataType,
    SignalType,
    type Body,
    type DesignSpecification,
    type ResolvePayload,
    type ResolvedResult,
    type Theme,
    type ThemePayload,
} from './types.js';

export class Design extends Capability<Body> {
    public static readonly AIM: string = AIM;
    public static readonly __ID__: string = __ID__;

    public static override disposition: Disposition<Body> = {
        aim: {
            description: AIM,
            body: {
                theme: DEFAULT_THEME,
                variant: DEFAULT_VARIANT,
            },
        },
        reactTo: [
            SignalType.GET,
            SignalType.SET_THEME,
            SignalType.RESOLVE,
        ],
        inputs: [
            {
                signal: SignalType.GET,
                type: DataType.VOID,
                description: 'Query active design specification',
            },
            {
                signal: SignalType.SET_THEME,
                type: DataType.THEME_PAYLOAD,
                schema: themePayloadSchema,
                description: 'Set active visual theme',
            },
            {
                signal: SignalType.RESOLVE,
                type: DataType.RESOLVE_PAYLOAD,
                schema: resolvePayloadSchema,
                description: 'Resolve design token by category and name',
            },
        ],
        outputs: [
            {
                signal: SignalType.PROVIDED,
                type: DataType.DESIGN_SPECIFICATION,
                schema: designSpecificationSchema,
                description: 'Active design specification provided',
            },
            {
                signal: SignalType.THEME_CHANGED,
                type: DataType.THEME_PAYLOAD,
                schema: themePayloadSchema,
                description: 'Visual theme changed notification',
            },
            {
                signal: SignalType.RESOLVED,
                type: DataType.RESOLVED_RESULT,
                schema: resolvedResultSchema,
                description: 'Design token resolution result',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Design error notification',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
        } = signal;
        switch (property) {
            case SignalType.GET:
                this.handleGet();
                break;
            case SignalType.SET_THEME:
                this.handleSetTheme(signal);
                break;
            case SignalType.RESOLVE:
                this.handleResolve(signal);
                break;
            default:
                break;
        }
    }

    private extractSpecification(): DesignSpecification {
        const {
            aim,
        } = this.disposition;
        const {
            theme = DEFAULT_THEME,
            variant = DEFAULT_VARIANT,
            tokens,
        } = aim.body ?? {};
        return {
            theme,
            variant,
            tokens,
        };
    }

    private handleGet(): void {
        const specification = this.extractSpecification();
        this.pulse(SignalType.PROVIDED, specification);
    }

    private handleSetTheme(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            theme,
        } = (value ?? {}) as ThemePayload;
        this.updateTheme(theme);
    }

    private createAimBody(theme: Theme): Body {
        const {
            aim,
        } = this.disposition;
        return {
            ...aim.body,
            theme,
        };
    }

    private createUpdatedAim(body: Body): Aim<Body> {
        const {
            aim,
        } = this.disposition;
        return {
            ...aim,
            body,
        };
    }

    private applyTheme(aim: Aim<Body>, theme: Theme): void {
        this.pulse(this.updateEvent, {
            ...this.disposition,
            aim,
        });
        this.pulse(SignalType.THEME_CHANGED, {
            theme,
        });
    }

    private updateTheme(theme: Theme): void {
        const body = this.createAimBody(theme);
        const aim = this.createUpdatedAim(body);
        this.applyTheme(aim, theme);
    }

    private resolveToken(category: string, token: string): ResolvedResult {
        return {
            category,
            token,
            value: `var(--${category}-${token})`,
        };
    }

    private handleResolve(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            category,
            token,
        } = (value ?? {}) as ResolvePayload;
        const resolved = this.resolveToken(category, token);
        this.pulse(SignalType.RESOLVED, resolved);
    }
}

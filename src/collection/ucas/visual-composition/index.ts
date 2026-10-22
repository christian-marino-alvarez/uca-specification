import { Uca } from '@uca/core/uca';
import type { Disposition, Signal } from '@uca/core/types';
import {
    SignalType as LlmSignalType,
    type InferPayload,
    type InferResult,
    type Failure,
} from '@uca/llm/types';
import {
    __ID__,
    VISUAL_DOMAIN_NAMES,
} from './constants.js';
import { bodySchema } from './schema.js';
import {
    type Body,
    type CompositionPayload,
    DataType,
    SignalType,
} from './types.js';

export class VisualComposition extends Uca<Body> {
    public static override purpose: string = 'Compose visual structure and selected CSS domains from an interface intention';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: VisualComposition.purpose,
            body: {},
        },
        reactTo: [
            SignalType.COMPOSE,
            LlmSignalType.INFERRED,
            LlmSignalType.ERROR,
        ],
        inputs: [
            {
                signal: SignalType.COMPOSE,
                type: DataType.INFER_PAYLOAD,
                schema: bodySchema,
                description: 'Visual inference request to compose through structure and CSS domain selection',
            },
            {
                signal: LlmSignalType.INFERRED,
                type: DataType.COMPOSITION,
                description: 'Completed phase inference from the active provider',
            },
            {
                signal: LlmSignalType.ERROR,
                type: DataType.UNKNOWN,
                description: 'Inference failure from the active provider',
            },
        ],
        outputs: [
            {
                signal: LlmSignalType.INFER,
                type: DataType.INFER_PAYLOAD,
                description: 'Non-streaming phase inference request',
            },
            {
                signal: LlmSignalType.STREAM,
                type: DataType.INFER_PAYLOAD,
                description: 'Final streaming visual inference request',
            },
            {
                signal: SignalType.STRUCTURED,
                type: DataType.COMPOSITION,
                description: 'Semantic structure resolved',
            },
            {
                signal: SignalType.PLANNED,
                type: DataType.PLAN,
                description: 'CSS domain plan resolved by Jev',
            },
            {
                signal: SignalType.COMPOSED,
                type: DataType.COMPOSITION,
                description: 'Visual composition dispatched for streaming',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.UNKNOWN,
                description: 'Visual composition inference failed',
            },
        ],
    };

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override react(signal: Signal): void {
        const {
            property,
            source,
            value,
        } = signal;
        if (source === this.id) {
            return;
        }
        switch (property) {
            case SignalType.COMPOSE:
                this.handleCompose(value as CompositionPayload);
                break;
            case LlmSignalType.INFERRED:
                this.handleInferred(value as InferResult);
                break;
            case LlmSignalType.ERROR:
                this.handleFailure(value as Failure);
                break;
            default:
                break;
        }
    }

    protected override onDispositionUpdated(event: Event): void {
        super.onDispositionUpdated(event);
        this.dispatchPhase();
    }

    private handleCompose(payload: CompositionPayload): void {
        const {
            request,
            correlationId,
        } = payload;
        this.updateComposition({
            request,
            correlationId,
            phase: 'structure',
        });
    }

    private handleInferred(result: InferResult): void {
        const {
            correlationId,
            data,
            response,
        } = result;
        const { aim } = this.disposition;
        const { body } = aim;
        const { phase } = body ?? {};
        if (correlationId === `${this.correlationId()}:structure` && phase === 'structure') {
            this.handleStructured(data ?? response);
        }
        if (correlationId === `${this.correlationId()}:plan` && phase === 'plan') {
            this.handlePlanned(data ?? response);
        }
    }

    private handleStructured(structure: unknown): void {
        this.pulse(SignalType.STRUCTURED, structure);
        this.updateComposition({
            ...this.currentBody(),
            phase: 'plan',
            structure,
        });
    }

    private handlePlanned(visualPlan: unknown): void {
        this.pulse(SignalType.PLANNED, visualPlan);
        this.updateComposition({
            ...this.currentBody(),
            phase: 'visual',
            visualPlan: visualPlan as Record<string, unknown>,
        });
    }

    private handleFailure(failure: Failure): void {
        const { correlationId } = failure;
        if (correlationId?.startsWith(this.correlationId())) {
            this.pulse(SignalType.ERROR, failure);
        }
    }

    private dispatchPhase(): void {
        const {
            phase,
        } = this.currentBody();
        switch (phase) {
            case 'structure':
                this.pulse(LlmSignalType.INFER, this.createStructureRequest());
                break;
            case 'plan':
                this.pulse(LlmSignalType.INFER, this.createPlanRequest());
                break;
            case 'visual':
                this.pulse(SignalType.COMPOSED, this.currentBody());
                this.pulse(LlmSignalType.STREAM, this.createVisualRequest());
                break;
        }
    }

    private createStructureRequest(): InferPayload {
        const request = this.request();
        return {
            ...request,
            correlationId: `${this.correlationId()}:structure`,
            outputSchema: this.removeQualities(request.outputSchema) as Record<string, unknown>,
            goal: `${request.goal ?? request.intention ?? ''} Produce only the semantic hierarchy; omit visual qualities.`,
        };
    }

    private createPlanRequest(): InferPayload {
        const request = this.request();
        const { purpose, goal, limits } = request;
        const { structure } = this.currentBody();
        const facts = (request.contextSchema as { const?: Record<string, unknown> } | undefined)?.const ?? request.context ?? {};
        return {
            provider: 'jev',
            correlationId: `${this.correlationId()}:plan`,
            purpose: 'Select visual domain names from a finite CSS catalog',
            goal: 'Select only the CSS domain names required by each node to satisfy its purpose and intention.',
            limits,
            contextSchema: {
                const: {
                    state: {
                        purpose,
                        goal,
                        structure,
                        visualLanguage: (facts as Record<string, unknown>).visualLanguage,
                    },
                    questions: {
                        visualPlan: {
                            type: 'noul',
                            instructions: `Return a plan keyed by structural node id. Each value is an array containing only justified names from: ${VISUAL_DOMAIN_NAMES.join(', ')}. Select domain names, never CSS values. For every node with two or more direct children, include gap, spacing, or marginBlock. Select direction or division, never both. Include surface and textColor together whenever a node visibly contains text.`,
                        },
                    },
                },
            },
        };
    }

    private createVisualRequest(): InferPayload {
        const request = this.request();
        const { contextSchema, context, goal, intention } = request;
        const facts = (contextSchema as { const?: Record<string, unknown> } | undefined)?.const ?? context ?? {};
        const { structure, visualPlan } = this.currentBody();
        return {
            ...request,
            contextSchema: {
                const: {
                    ...facts,
                    structure,
                    visualPlan,
                },
            },
            goal: `${goal ?? intention ?? ''} Preserve the supplied structure exactly. Assign qualities only for domain names selected in visualPlan. For nodes with two or more direct children, choose one separation quality: gap, spacing, or marginBlock. Choose direction or division, never both. Pair every visible surface with a contrasting textColor: dark on light brand or accent surfaces; light or muted on dark surfaces.`,
        };
    }

    private updateComposition(body: Body): void {
        const {
            aim,
            ...disposition
        } = this.disposition;
        this.pulse(this.updateEvent, {
            ...disposition,
            aim: {
                ...aim,
                body,
            },
        });
    }

    private currentBody(): Body {
        const { aim } = this.disposition;
        return aim.body ?? {};
    }

    private request(): InferPayload {
        const { request = {} } = this.currentBody();
        return request as InferPayload;
    }

    private correlationId(): string {
        const { correlationId = '' } = this.currentBody();
        return correlationId;
    }

    private removeQualities(schema: unknown): unknown {
        if (Array.isArray(schema)) {
            return schema.map((item) => this.removeQualities(item));
        }
        if (!schema || typeof schema !== 'object') {
            return schema;
        }
        const record = schema as Record<string, unknown>;
        const { qualities: _qualities, ...properties } = (record.properties ?? {}) as Record<string, unknown>;
        const required = ((record.required ?? []) as string[]).filter((name) => name !== 'qualities');
        return {
            ...record,
            ...('properties' in record && { properties: Object.fromEntries(Object.entries(properties).map(([name, value]) => [name, this.removeQualities(value)])) }),
            ...('required' in record && { required }),
            ...Object.fromEntries(Object.entries(record).filter(([name]) => name !== 'properties' && name !== 'required').map(([name, value]) => [name, this.removeQualities(value)])),
        };
    }
}

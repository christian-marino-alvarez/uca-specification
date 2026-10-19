import { z } from 'zod';
import { Uca } from '@uca/core/uca';
import {
    DispositionSignal,
    type Cooky,
    type Disposition,
    type DispositionProvidePayload,
    type Signal,
} from '@uca/core/types';
import { Llm } from '@uca/llm';
import {
    SignalType as LlmSignalType,
    type InferPayload,
    type InferResult,
    type StreamResult,
} from '@uca/llm/types';
import {
    createContextSchema,
} from '@uca/llm/constants';
import { Render } from '@uca/render';
import {
    SignalType as RenderSignalType,
} from '@uca/render/types';
import { Decision } from '@uca/decision';
import {
    SignalType as DecisionSignalType,
    type OptionItem,
} from '@uca/decision/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
    Mode as StreamTransformerMode,
    SignalType as StreamTransformerSignalType,
} from '@uca/capability-stream-transformer/types';
import {
    __ID__,
    DEFAULT_IMAGINATION,
    DEFAULT_LIMIT,
    ROOT_AREA_ID,
} from './constants.js';
import {
    areaSchema,
    buildPayloadSchema,
    componentItemSchema,
    layoutCompositionSchema,
    viewCompositionSchema,
    type Area,
    type Body,
    type BuildPayload,
    type BuiltResult,
    type ComponentInfo,
    type ComponentItem,
    type LayoutComposition,
} from './schema.js';
import {
    DataType,
    SignalType,
    type AreaCreated,
    type StreamChunk,
    type StreamComplete,
    type ContractParams,
} from './types.js';

export class Builder extends Uca<Body> {
    public static override purpose: string =
        'Construct autonomous layout partition structures and view component compositions';

    public static override disposition: Disposition<Body> = {
        aim: {
            description:
                'Materialize spatial layout partitions or direct view component hierarchies from cognitive decision',
            body: {},
        },
        reactTo: [
            ...Builder.reactToSelf(),
            ...Builder.reactToLlm(),
            ...Builder.reactToRender(),
            ...Builder.reactToDecision(),
            ...Builder.reactToStreamTransformer(),
            ...Builder.reactToDisposition(),
        ],
        inputs: [
            {
                signal: SignalType.BUILD,
                type: DataType.BUILD_PAYLOAD,
                schema: buildPayloadSchema,
                description:
                    'Build layout partition or direct view composition from cognitive decision',
            },
        ],
        outputs: [
            {
                signal: SignalType.AREA_CREATED,
                type: DataType.AREA_CREATED,
                description: 'Child area container connected and ready for construction',
            },
            {
                signal: SignalType.BUILT,
                type: DataType.BUILT_RESULT,
                description: 'Emitted when structure composition is generated',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Emitted when structure building fails',
            },
        ],
    };

    private static reactToSelf(): string[] {
        return [
            SignalType.BUILD,
        ];
    }

    private static reactToLlm(): string[] {
        return [
            LlmSignalType.INFERRED,
            LlmSignalType.STREAMING,
            LlmSignalType.STREAMED,
            LlmSignalType.STREAM_END,
            LlmSignalType.ERROR,
            ...Llm.disposition.reactTo ?? [],
        ];
    }

    private static reactToRender(): string[] {
        return [
            RenderSignalType.AREA_CREATED,
            RenderSignalType.RENDERED,
            RenderSignalType.ERROR,
            ...Render.disposition.reactTo ?? [],
        ];
    }

    private static reactToDecision(): string[] {
        return [
            DecisionSignalType.DECIDED,
            DecisionSignalType.ERROR,
            ...Decision.disposition.reactTo ?? [],
        ];
    }

    private static reactToStreamTransformer(): string[] {
        return [
            StreamTransformerSignalType.CHUNK,
            StreamTransformerSignalType.COMPLETE,
            StreamTransformerSignalType.ERROR,
            ...StreamTransformer.disposition.reactTo ?? [],
        ];
    }

    private static reactToDisposition(): string[] {
        return [
            DispositionSignal.PROVIDE,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    protected override catalog(): Cooky {
        const {
            id,
        } = this;
        return [
            [
                Llm,
                {
                    aim: {
                        description: Llm.purpose,
                        body: {
                            id: `${id}:llm`,
                        },
                    },
                    reactTo: [
                        ...Llm.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                Render,
                {
                    aim: {
                        description: Render.purpose,
                        body: {
                            id: `${id}:render`,
                        },
                    },
                    reactTo: [
                        ...Render.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                Decision,
                {
                    aim: {
                        description: Decision.purpose,
                        body: {
                            id: `${id}:decision`,
                        },
                    },
                    reactTo: [
                        ...Decision.disposition.reactTo ?? [],
                    ],
                },
            ],
            [
                StreamTransformer,
                {
                    aim: {
                        description: StreamTransformer.AIM,
                        body: {
                            id: `${id}:stream-transformer`,
                        },
                    },
                    reactTo: [
                        ...StreamTransformer.disposition.reactTo ?? [],
                    ],
                },
            ],
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        switch (property) {
            case SignalType.BUILD:
                this.handleBuild(value);
                break;
            case LlmSignalType.INFERRED:
                this.handleLlmInferred(signal);
                break;
            case LlmSignalType.STREAMING:
                this.handleLlmStreaming(signal);
                break;
            case LlmSignalType.STREAMED:
                this.handleLlmStreamed(signal);
                break;
            case LlmSignalType.STREAM_END:
                this.handleLlmStreamEnd(signal);
                break;
            case LlmSignalType.ERROR:
                this.handleLlmError(signal);
                break;
            case StreamTransformerSignalType.CHUNK:
                this.handleStreamTransformerChunk(signal);
                break;
            case StreamTransformerSignalType.COMPLETE:
                this.handleStreamTransformerComplete(signal);
                break;
            case StreamTransformerSignalType.ERROR:
                this.handleStreamTransformerError(signal);
                break;
            case DecisionSignalType.DECIDED:
                this.handleDecisionDecided(signal);
                break;
            case DecisionSignalType.ERROR:
                this.handleDecisionError(signal);
                break;
            case RenderSignalType.AREA_CREATED:
                this.handleRenderAreaCreated(signal);
                break;
            case RenderSignalType.RENDERED:
                this.handleRenderRendered(signal);
                break;
            case RenderSignalType.ERROR:
                this.handleRenderError(signal);
                break;
            case DispositionSignal.PROVIDE:
                this.handleDispositionProvide(signal);
                break;
        }
    }

    private handleBuild(value?: unknown): void {
        const parsed = buildPayloadSchema.safeParse(value);
        if (!parsed.success) {
            this.pulse(SignalType.ERROR, parsed.error.message);
            return;
        }
        this.dispatchBuild(parsed.data);
    }

    private dispatchBuild(payload: BuildPayload): void {
        if (payload.choice === 'LAYOUT') {
            this.requestLayoutInference(payload);
            return;
        }
        this.requestViewInference(payload);
    }

    private pulseInferenceSetup(areaId: string): void {
        this.pulse(RenderSignalType.CLEAR, {
            areaId,
        });
        this.pulse(RenderSignalType.SKELETON, {
            areaId,
            kind: 'container',
        });
    }

    private requestViewInference(payload: BuildPayload): void {
        const {
            areaId = ROOT_AREA_ID,
            context,
            correlationId = crypto.randomUUID(),
        } = payload;
        this.pulseInferenceSetup(areaId);
        this.dispatchViewInference(payload, areaId, context, correlationId);
    }

    private dispatchViewInference(payload: BuildPayload, areaId: string, context: Record<string, unknown>, correlationId: string): void {
        const {
            purpose = 'Render view component',
            intention = 'Synthesize presentation properties',
        } = context;
        const inference = this.createViewInferPayload(areaId, String(purpose), String(intention), context, correlationId);
        this.pulse(LlmSignalType.INFER, {
            ...inference,
            metadata: payload,
        });
    }

    private formatViewGoal(intention: string, areaId: string, design?: unknown): string {
        const guideline = design ? ` ${String(design)}` : '';
        return `${intention}. Generate components sequence for area #${areaId}.${guideline}`;
    }

    private createViewContract(purpose: string, goal: string, targetArea: string): ContractParams {
        const outputSchema = z.toJSONSchema(viewCompositionSchema) as Record<string, unknown>;
        return {
            purpose,
            goal,
            outputSchema,
            limits: {
                targetArea,
            },
        };
    }

    private createViewFacts(areaId: string, purpose: string, intention: string, context: Record<string, unknown>): Record<string, unknown> {
        return {
            areaId,
            purpose,
            intention,
            ...context,
        };
    }

    private createViewInferPayload(areaId: string, purpose: string, intention: string, context: Record<string, unknown>, correlationId: string): InferPayload {
        const goal = this.formatViewGoal(intention, areaId, context.design ?? context.guidelines);
        const contract = this.createViewContract(purpose, goal, areaId);
        const facts = this.createViewFacts(areaId, purpose, intention, context);
        const config = this.createInferenceConfig(correlationId);
        return this.assembleInferPayload(contract, facts, config);
    }

    private logLlmRequest(type: 'LAYOUT' | 'VIEW', payload: InferPayload): void {
        const { correlationId, purpose, goal } = payload;
        console.log(`%c[BUILDER::LLM::REQUEST:${type}]`, 'color: #2563EB; font-weight: bold;', { correlationId, purpose, goal, payload });
    }

    private requestLayoutInference(payload: BuildPayload): void {
        const {
            areaId = ROOT_AREA_ID,
            context,
            correlationId = crypto.randomUUID(),
        } = payload;
        this.pulseInferenceSetup(areaId);
        this.dispatchLayoutInference(payload, areaId, context, correlationId);
    }

    private dispatchLayoutInference(payload: BuildPayload, areaId: string, context: Record<string, unknown>, correlationId: string): void {
        const inference = this.createInferPayload(context, correlationId, `#${areaId}`, areaId);
        this.pulse(LlmSignalType.INFER, {
            ...inference,
            metadata: payload,
        });
    }



    private extractDynamicComponents(): Record<string, ComponentInfo> {
        const {
            aim,
        } = this.disposition;
        const {
            components = {},
        } = (aim.body ?? {}) as Body;
        return components;
    }

    private createDecisionOptions(): OptionItem[] {
        const components = this.extractDynamicComponents();
        return Object.entries(components).map(([id, meta]) => ({
            id,
            label: id,
            description: meta.purpose,
        }));
    }

    private buildDecisionQuestion(): Record<string, unknown> {
        return {
            id: 'component_selection',
            type: 'choice',
            prompt:
                'Selecciona el componente UCA más acorde para la vista según propósito, intención y contexto',
            options: this.createDecisionOptions(),
        };
    }

    private buildDecisionPayload(
        payload: BuildPayload,
        id: string,
    ): Record<string, unknown> {
        return {
            correlationId: id,
            question: this.buildDecisionQuestion(),
            context: payload.context,
        };
    }

    private logDecisionRequest(decisionPayload: Record<string, unknown>): void {
        console.log('[BUILDER::DECISION::REQUEST]', decisionPayload);
    }

    private requestViewDecision(payload: BuildPayload): void {
        const id = payload.correlationId ?? `view-${Date.now()}`;
        const components = this.extractDynamicComponents();
        if (Object.keys(components).length === 0) {
            this.pulse(DispositionSignal.GET, {});
        }
        const decisionPayload = this.buildDecisionPayload(payload, id);
        this.logDecisionRequest(decisionPayload);
        this.pulse(DecisionSignalType.DECIDE, decisionPayload);
    }

    private handleDispositionProvide(signal: Signal): void {
        const payload = (signal.value ?? {}) as DispositionProvidePayload;
        const { id, prefix, purpose, disposition } = payload;
        const name = prefix ?? id;
        const description = purpose ?? disposition?.aim?.description;
        if (!name || !description || name === this.id) {
            return;
        }
        this.registerDynamicComponent(name, description);
    }

    private registerDynamicComponent(name: string, purpose: string): void {
        const components = this.extractDynamicComponents();
        if (components[name]?.purpose === purpose) {
            return;
        }
        const tag = `ext-${name.toLowerCase()}`;
        const updated = { ...components, [name]: { purpose, tag } };
        this.updateDispositionBody({ components: updated });
    }

    private updateDispositionBody(patch: Partial<Body>): void {
        const { aim } = this.disposition;
        const body = { ...(aim.body ?? {}), ...patch };
        this.pulse(this.updateEvent, { ...this.disposition, aim: { ...aim, body } });
    }

    private formatLayoutGoal(target: string, parent: string, intention?: string): string {
        const suffix = intention ? ` to satisfy: ${intention}` : '';
        return `Generate layout area partition schema for ${target}${suffix}. Area IDs must be distinct direct children inside ${parent} and not duplicate '${parent}'.`;
    }

    private resolveLayoutContract(targetContainer?: string, parentArea?: string, intention?: string): ContractParams {
        const parent = parentArea ?? 'container';
        const target = targetContainer ?? parent;
        const goal = this.formatLayoutGoal(target, parent, intention);
        return {
            purpose: `Construct layout partition structure inside ${target}`,
            goal,
            outputSchema: z.toJSONSchema(layoutCompositionSchema) as Record<string, unknown>,
            limits: { parentContainer: target, namingRule: `Area id must not be '${parent}'` },
        };
    }

    private buildFacts(
        context: Record<string, unknown>,
        targetContainer?: string,
        parentArea?: string,
    ): Record<string, unknown> {
        const parent = parentArea ?? 'container';
        return {
            ...context,
            ...(targetContainer && { targetContainer }),
            parentArea: parent,
            forbiddenIds: [parent],
            components: this.extractDynamicComponents(),
        };
    }

    private createInferenceConfig(
        correlationId: string,
    ): Record<string, unknown> {
        return {
            limits: {},
            imagination: DEFAULT_IMAGINATION,
            limit: DEFAULT_LIMIT,
            correlationId,
        };
    }

    private assembleInferPayload(
        contract: ContractParams,
        facts: Record<string, unknown>,
        config: Record<string, unknown>,
    ): InferPayload {
        return {
            ...contract,
            ...config,
            contextSchema: createContextSchema(facts),
        };
    }

    private createInferPayload(
        context: Record<string, unknown>,
        correlationId?: string,
        targetContainer?: string,
        parentArea?: string,
    ): InferPayload {
        const { intention } = context;
        const contract = this.resolveLayoutContract(targetContainer, parentArea, intention ? String(intention) : undefined);
        const facts = this.buildFacts(context, targetContainer, parentArea);
        const id = correlationId ?? `build-${Date.now()}`;
        return this.assembleInferPayload(contract, facts, this.createInferenceConfig(id));
    }

    private logDecisionResponse(choice: string, correlationId?: string): void {
        console.log('[BUILDER::DECISION::RESPONSE]', { correlationId, choice });
    }

    private handleDecisionDecided(signal: Signal): void {
        const {
            value,
        } = signal;
        const {
            choice,
            context,
            correlationId,
        } = (value ?? {}) as {
            choice: string;
            context?: Record<string, unknown>;
            correlationId?: string;
        };
        this.logDecisionResponse(choice, correlationId);
        this.requestComponentInference(choice, context, correlationId);
    }

    private resolveComponentOutputSchema(): Record<string, unknown> {
        return {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
                areaId: { type: 'string' },
                component: { type: 'string' },
                content: { type: 'string' },
                qualities: { type: 'object' },
                attributes: { type: 'object' },
            },
            required: ['component'],
        };
    }

    private createComponentInferConfig(
        component: string,
        correlationId: string,
    ): Record<string, unknown> {
        return {
            limits: {},
            imagination: DEFAULT_IMAGINATION,
            limit: DEFAULT_LIMIT,
            correlationId,
            outputSchema: this.resolveComponentOutputSchema(),
            metadata: {
                component,
            },
        };
    }

    private createComponentInferPayload(
        component: string,
        context: Record<string, unknown>,
        correlationId: string,
    ): InferPayload {
        const config = this.createComponentInferConfig(component, correlationId);
        return {
            purpose: 'Synthesize component presentation and properties',
            goal: `Generate configuration and content for component ${component}`,
            contextSchema: createContextSchema({
                chosenComponent: component,
                ...context,
            }),
            ...config,
        } as InferPayload;
    }

    private requestComponentInference(
        component: string,
        context?: Record<string, unknown>,
        correlationId?: string,
    ): void {
        const id = correlationId ?? `comp-${Date.now()}`;
        const payload = this.createComponentInferPayload(
            component,
            context ?? {},
            id,
        );
        this.logLlmRequest('VIEW', payload);
        this.pulse(LlmSignalType.INFER, payload);
    }

    private resolveInferredChoice(
        composition: unknown,
    ): 'LAYOUT' | 'VIEW' {
        const {
            areas,
        } = (composition ?? {}) as {
            areas?: unknown[];
        };
        return Array.isArray(areas) ? 'LAYOUT' : 'VIEW';
    }

    private buildBuiltResult(
        data: unknown,
        response: string | undefined,
        correlationId?: string,
    ): BuiltResult {
        const composition = data ?? this.parseResponse(response);
        const choice = this.resolveInferredChoice(composition);
        return {
            choice,
            composition,
            correlationId,
        };
    }

    private extractInferredResult(value: unknown): BuiltResult {
        const {
            data,
            response,
            correlationId,
            request,
        } = value as InferResult;
        const {
            metadata,
        } = request ?? {};
        const {
            areaId = ROOT_AREA_ID,
            parentId,
            context,
        } = metadata as BuildPayload;
        return {
            ...this.buildBuiltResult(data, response, correlationId),
            areaId,
            parentId,
            context,
        };
    }

    private logLlmResponse(result: BuiltResult): void {
        const { choice, correlationId, composition } = result;
        console.log(`%c[BUILDER::LLM::RESPONSE:${choice}]`, 'color: #16A34A; font-weight: bold;', { correlationId, choice, composition });
    }

    private handleLlmInferred(signal: Signal): void {
        const {
            value,
        } = signal;
        const result = this.extractInferredResult(value);
        this.logLlmResponse(result);
        if (result.choice === 'LAYOUT') {
            this.handleLayoutInferred(result);
            return;
        }
        this.handleViewInferred(result);
    }



    private buildDeterministicRenderPayload(areas: Area[], binding: BuiltResult): Record<string, unknown> {
        const { areaId = ROOT_AREA_ID, correlationId = crypto.randomUUID(), context = {} } = binding;
        return {
            mode: 'deterministic',
            containerElement: `#${areaId}`,
            areas,
            skeleton: true,
            context: {
                correlationId,
                context,
            },
        };
    }

    private logRenderRequest(mode: string, payload: Record<string, unknown>): void {
        console.log(`[BUILDER::RENDER::REQUEST:${mode.toUpperCase()}]`, payload);
    }

    private sanitizeArea(area: Area, parentId: string): Area {
        const {
            id,
        } = area;
        return {
            ...area,
            id: id.startsWith(`${parentId}:`) ? id : `${parentId}:${id}`,
            parentId,
        };
    }

    private handleLayoutInferred(result: BuiltResult): void {
        const {
            composition,
            areaId = ROOT_AREA_ID,
        } = result;
        const {
            areas = [],
        } = composition as LayoutComposition;
        const identifiers = areas.map(({ id }) => id);
        if (new Set(identifiers).size !== identifiers.length) {
            this.pulse(SignalType.ERROR, 'Layout contains duplicate area identifiers');
            return;
        }
        const sanitized = areas.map((area) => this.sanitizeArea(area, areaId));
        this.pulse(RenderSignalType.RENDER, this.buildDeterministicRenderPayload(sanitized, result));
        this.pulse(SignalType.BUILT, {
            ...result,
            composition: {
                areas: sanitized,
            },
        });
    }

    private handleLlmStreaming(signal: Signal): void {
        const { correlationId, model } = (signal.value ?? {}) as { correlationId?: string; model?: string };
        console.log('[BUILDER::STREAM::START]', { correlationId, model });
    }





    private handleLlmStreamed(signal: Signal): void {
        const {
            correlationId,
            stream,
            request,
        } = signal.value as StreamResult;
        const {
            metadata,
        } = request ?? {};
        const binding = metadata as BuildPayload;
        const {
            choice,
        } = binding;
        this.pulse(StreamTransformerSignalType.TRANSFORM, {
            correlationId,
            stream,
            schema: choice === 'VIEW' ? componentItemSchema : areaSchema,
            mode: StreamTransformerMode.ITEMS,
            context: binding,
        });
    }

    private handleLlmStreamEnd(signal: Signal): void {
        const { correlationId, model } = (signal.value ?? {}) as { correlationId?: string; model?: string };
        console.log('[BUILDER::STREAM::END]', { correlationId, model });
    }

    private handleStreamTransformerChunk(signal: Signal): void {
        const chunk = signal.value as StreamChunk;
        const {
            context,
        } = chunk;
        const {
            choice,
        } = context;
        switch (choice) {
            case 'VIEW':
                this.handleStreamViewChunk(chunk);
                break;
            case 'LAYOUT':
                this.handleStreamLayoutChunk(chunk);
                break;
        }
    }

    private handleStreamLayoutChunk(chunk: StreamChunk): void {
        const {
            item,
            correlationId,
            context: binding,
        } = chunk;
        const {
            areaId = ROOT_AREA_ID,
            context,
        } = binding;
        const area = this.sanitizeArea(areaSchema.parse(item), areaId);
        const result: BuiltResult = {
            ...binding,
            context,
            correlationId,
            composition: item,
        };
        this.pulse(RenderSignalType.RENDER, this.buildDeterministicRenderPayload([area], result));
    }

    private handleStreamViewChunk(chunk: StreamChunk): void {
        const {
            item,
            correlationId,
            context,
        } = chunk;
        const {
            areaId = ROOT_AREA_ID,
        } = context;
        const parsed = componentItemSchema.parse(item);
        this.pulse(RenderSignalType.RENDER, this.buildSingleComponentRenderPayload(areaId, parsed, correlationId));
    }

    private extractItemContent(item: ComponentItem): string | undefined {
        const {
            content,
            label,
            title,
            text,
        } = item;
        const raw = content ?? label ?? title ?? text ?? item.attributes?.text;
        return raw != null ? String(raw) : undefined;
    }

    private buildSingleComponentRenderPayload(areaId: string, item: ComponentItem, correlationId?: string): Record<string, unknown> {
        const component = this.normalizeComponent(areaId, item);
        return {
            ...component,
            mode: 'inference',
            areaId,
            context: {
                correlationId,
            },
        };
    }

    private extractItemValue(item: ComponentItem): string | undefined {
        const {
            content,
            label,
            title,
            text,
            attributes,
        } = item;
        const {
            text: attributeText,
        } = attributes ?? {};
        const value = content ?? label ?? title ?? text ?? attributeText;
        return value == null ? undefined : String(value);
    }

    private resolveComponentId(areaId: string, id?: string): string {
        const clean = (id ?? crypto.randomUUID()).replace(/^#/, '');
        return clean.startsWith(`${areaId}:`) ? clean : `${areaId}:${clean}`;
    }

    private isParentTarget(areaId: string, clean: string): boolean {
        const normClean = clean.replace(/_/g, '-');
        const normArea = areaId.replace(/_/g, '-');
        if (!clean || clean === 'root' || normClean === normArea) {
            return true;
        }
        const isAncestor = normArea.startsWith(`${normClean}:`);
        const isSuffix = normArea.endsWith(`:${normClean}`);
        return isAncestor || isSuffix || normArea.split(':').includes(normClean);
    }

    private resolveNormalizedParent(areaId: string, parentId?: string): string {
        const clean = (parentId ?? '').replace(/^#/, '');
        if (this.isParentTarget(areaId, clean)) {
            return areaId;
        }
        return clean.startsWith(`${areaId}:`) ? clean : `${areaId}:${clean}`;
    }

    private hoistQualities(qualities?: Record<string, unknown> | null): Record<string, unknown> | undefined {
        if (!qualities) {
            return undefined;
        }
        const { custom, ...rest } = qualities;
        const customProps = (custom ?? {}) as Record<string, unknown>;
        return { ...customProps, ...rest };
    }

    private normalizeComponent(areaId: string, item: ComponentItem): Record<string, unknown> {
        return {
            ...item,
            id: this.resolveComponentId(areaId, item.id),
            parentId: this.resolveNormalizedParent(areaId, item.parentId),
            content: this.extractItemValue(item),
            qualities: this.hoistQualities(item.qualities),
        };
    }

    private handleStreamTransformerComplete(signal: Signal): void {
        const {
            correlationId,
            items,
            context,
        } = signal.value as StreamComplete;
        const {
            choice,
            areaId = ROOT_AREA_ID,
        } = context;
        const composition = choice === 'VIEW' ? {
            components: items,
        } : {
            areas: items.map((item) => this.sanitizeArea(areaSchema.parse(item), areaId)),
        };
        this.pulse(SignalType.BUILT, {
            ...context,
            composition,
            correlationId,
        });
    }



    private handleStreamTransformerError(signal: Signal): void {
        const { correlationId, error } = (signal.value ?? {}) as { correlationId?: string; error?: unknown };
        console.error('[BUILDER::STREAM::ERROR]', { correlationId, error });
        this.pulse(SignalType.ERROR, { correlationId, error });
    }

    private logStreamArea(area: Area, correlationId?: string): void {
        console.log('[BUILDER::STREAM::AREA]', { correlationId, area });
    }









    private extractComponentsFromComposition(composition: unknown): ComponentItem[] {
        const comp = (composition ?? {}) as Record<string, unknown>;
        const list = comp.components ?? comp.items;
        if (Array.isArray(list)) {
            return list as ComponentItem[];
        }
        if (comp.component) {
            return [comp as unknown as ComponentItem];
        }
        return [];
    }

    private handleViewInferred(result: BuiltResult): void {
        const {
            composition,
            correlationId,
            areaId = ROOT_AREA_ID,
        } = result;
        this.dispatchInferredItems(areaId, composition, correlationId);
        this.pulse(SignalType.BUILT, result);
    }

    private dispatchInferredItems(areaId: string, composition: unknown, correlationId?: string): void {
        const items = this.extractComponentsFromComposition(composition);
        for (const item of items) {
            const payload = this.buildSingleComponentRenderPayload(areaId, item, correlationId);
            this.logRenderRequest('INFERENCE', payload);
            this.pulse(RenderSignalType.RENDER, payload);
        }
    }

    private parseResponse(response?: string): unknown {
        if (!response) {
            return null;
        }
        try {
            return JSON.parse(response);
        } catch {
            return response;
        }
    }

    private handleLlmError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }

    private handleDecisionError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }

    private handleRenderRendered(signal: Signal): void {
        const {
            value,
        } = signal;
        console.log('[BUILDER::RENDER::RENDERED]', value);
    }

    private handleRenderAreaCreated(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.AREA_CREATED, value as AreaCreated);
    }

    private handleRenderError(signal: Signal): void {
        const {
            value,
        } = signal;
        this.pulse(SignalType.ERROR, value);
    }
}

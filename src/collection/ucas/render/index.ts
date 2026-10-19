import { Separator } from '@uca/separator';
import { SignalType as SeparatorSignalType } from '@uca/separator/types';
import { Progress } from '@uca/progress';
import { SignalType as ProgressSignalType } from '@uca/progress/types';
import { Status } from '@uca/status';
import { SignalType as StatusSignalType } from '@uca/status/types';
import { Symbol as SymbolUnit } from '@uca/symbol';
import { SignalType as SymbolSignalType } from '@uca/symbol/types';
import { Moment } from '@uca/moment';
import { SignalType as MomentSignalType } from '@uca/moment/types';
import { Quantity } from '@uca/quantity';
import { SignalType as QuantitySignalType } from '@uca/quantity/types';
import { Range } from '@uca/range';
import { SignalType as RangeSignalType } from '@uca/range/types';
import { Toggle } from '@uca/toggle';
import { SignalType as ToggleSignalType } from '@uca/toggle/types';
import { Choice } from '@uca/choice';
import { SignalType as ChoiceSignalType } from '@uca/choice/types';
import { Access } from '@uca/access';
import { SignalType as AccessSignalType } from '@uca/access/types';
import { Paragraph } from '@uca/paragraph';
import { SignalType as ParagraphSignalType } from '@uca/paragraph/types';
import { Heading } from '@uca/heading';
import { SignalType as HeadingSignalType } from '@uca/heading/types';
import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { Css } from '@uca/capability-css';
import {
    SignalType as CssSignalType,
} from '@uca/capability-css/types';
import { Box } from '@uca/box';
import {
    SignalType as BoxSignalType,
} from '@uca/box/types';
import { Action } from '@uca/action';
import {
    SignalType as ActionSignalType,
} from '@uca/action/types';
import { Picture } from '@uca/picture';
import {
    SignalType as PictureSignalType,
} from '@uca/picture/types';
import { Input } from '@uca/input';
import {
    SignalType as InputSignalType,
} from '@uca/input/types';
import { Collection } from '@uca/collection';
import {
    SignalType as CollectionSignalType,
} from '@uca/collection/types';
import {
    COMPONENT_MAP,
    DEFAULT_CONTAINER,
    DEFAULT_SKELETON_KIND,
    PALETTES,
    SKELETON_TEMPLATES,
    VIEWBOX_WIDTH,
    __ID__,
} from './constants.js';
import {
    clearPayloadSchema,
    deterministicPayloadSchema,
    inferencePayloadSchema,
    skeletonPayloadSchema,
    type Appearance,
    type Body,
    type ClearPayload,
    type DeterministicPayload,
    type InferencePayload,
    type LayoutArea,
    type RenderModeType,
    type RenderPayload,
    type RenderedResult,
    type SkeletonPayload,
    type CreatedElement,
    type LayoutContext,
    type MountContext,
    MountKind,
    ComponentType,
    DataType,
    RenderMode,
    SignalType,
} from './types.js';

export class Render extends Uca<Body> {
    public static override purpose: string =
        'Materialize and orchestrate autonomous spatial layouts and visual elements through Web UCAs';

    public static override disposition: Disposition<Body> = {
        aim: {
            description: Render.purpose,
        },
        reactTo: [
            SignalType.RENDER,
            SignalType.SKELETON,
            SignalType.CLEAR,
            ...Render.reactToCss(),
            ...Render.reactToBox(),
            ...Render.reactToAction(),
            ...Render.reactToPicture(),
            ...Render.reactToInput(),
            ...Render.reactToHeading(),
            ...Render.reactToParagraph(),
            ...Render.reactToAccess(),
            ...Render.reactToChoice(),
            ...Render.reactToToggle(),
            ...Render.reactToRange(),
            ...Render.reactToQuantity(),
            ...Render.reactToMoment(),
            ...Render.reactToSymbol(),
            ...Render.reactToStatus(),
            ...Render.reactToProgress(),
            ...Render.reactToSeparator(),
            ...Render.reactToCollection(),
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.RENDER_PAYLOAD,
                description:
                    'Render web structures deterministically or via inference',
            },
            {
                signal: SignalType.SKELETON,
                type: DataType.SKELETON_PAYLOAD,
                description: 'Inject loading skeleton SVG into an area',
            },
            {
                signal: SignalType.CLEAR,
                type: DataType.CLEAR_PAYLOAD,
                description: 'Clear area content and skeleton',
            },
        ],
        outputs: [
            {
                signal: SignalType.AREA_CREATED,
                type: DataType.AREA_CREATED,
                description: 'Area container confirmed by its connected Box',
            },
            {
                signal: SignalType.RENDERED,
                type: DataType.RENDERED_RESULT,
                description: 'Rendering successfully completed',
            },
            {
                signal: SignalType.SKELETON_ATTACHED,
                type: DataType.RENDERED_RESULT,
                description: 'Skeleton SVG attached to target area',
            },
            {
                signal: SignalType.CLEARED,
                type: DataType.RENDERED_RESULT,
                description: 'Target area cleared successfully',
            },
            {
                signal: SignalType.ERROR,
                type: DataType.ERROR,
                description: 'Render operation failed',
            },
        ],
    };

    private static reactToCss(): string[] {
        return [
            CssSignalType.APPLIED,
            CssSignalType.THEMED,
            CssSignalType.REMOVED,
            ...Css.disposition.reactTo ?? [],
        ];
    }

    private static reactToBox(): string[] {
        return [
            BoxSignalType.CREATED,
            BoxSignalType.ERROR,
            BoxSignalType.UPDATED,
            BoxSignalType.REMOVED,
            ...Box.disposition.reactTo ?? [],
        ];
    }

    private static reactToAction(): string[] {
        return [
            ActionSignalType.CREATED,
            ActionSignalType.ERROR,
            ActionSignalType.UPDATED,
            ActionSignalType.REMOVED,
            ...Action.disposition.reactTo ?? [],
        ];
    }

    private static reactToPicture(): string[] {
        return [
            PictureSignalType.CREATED,
            PictureSignalType.ERROR,
            PictureSignalType.UPDATED,
            PictureSignalType.REMOVED,
            ...Picture.disposition.reactTo ?? [],
        ];
    }

    private static reactToInput(): string[] {
        return [
            InputSignalType.CREATED,
            InputSignalType.ERROR,
            InputSignalType.UPDATED,
            InputSignalType.REMOVED,
            ...Input.disposition.reactTo ?? [],
        ];
    }



    private static reactToCollection(): string[] {
        return [
            CollectionSignalType.CREATED,
            CollectionSignalType.ERROR,
            CollectionSignalType.UPDATED,
            CollectionSignalType.REMOVED,
            ...Collection.disposition.reactTo ?? [],
        ];
    }

    private static reactToHeading(): string[] {
        const { reactTo = [] } = Heading.disposition;
        return [
            ...reactTo,
            HeadingSignalType.CREATED,
            HeadingSignalType.ERROR,
        ];
    }

    private static reactToParagraph(): string[] {
        const { reactTo = [] } = Paragraph.disposition;
        return [
            ...reactTo,
            ParagraphSignalType.CREATED,
            ParagraphSignalType.ERROR,
        ];
    }

    private static reactToAccess(): string[] {
        const { reactTo = [] } = Access.disposition;
        return [
            ...reactTo,
            AccessSignalType.CREATED,
            AccessSignalType.ERROR,
        ];
    }

    private static reactToChoice(): string[] {
        const { reactTo = [] } = Choice.disposition;
        return [
            ...reactTo,
            ChoiceSignalType.CREATED,
            ChoiceSignalType.ERROR,
        ];
    }

    private static reactToToggle(): string[] {
        const { reactTo = [] } = Toggle.disposition;
        return [
            ...reactTo,
            ToggleSignalType.CREATED,
            ToggleSignalType.ERROR,
        ];
    }

    private static reactToRange(): string[] {
        const { reactTo = [] } = Range.disposition;
        return [
            ...reactTo,
            RangeSignalType.CREATED,
            RangeSignalType.ERROR,
        ];
    }

    private static reactToQuantity(): string[] {
        const { reactTo = [] } = Quantity.disposition;
        return [
            ...reactTo,
            QuantitySignalType.CREATED,
            QuantitySignalType.ERROR,
        ];
    }

    private static reactToMoment(): string[] {
        const { reactTo = [] } = Moment.disposition;
        return [
            ...reactTo,
            MomentSignalType.CREATED,
            MomentSignalType.ERROR,
        ];
    }

    private static reactToSymbol(): string[] {
        const { reactTo = [] } = SymbolUnit.disposition;
        return [
            ...reactTo,
            SymbolSignalType.CREATED,
            SymbolSignalType.ERROR,
        ];
    }

    private static reactToStatus(): string[] {
        const { reactTo = [] } = Status.disposition;
        return [
            ...reactTo,
            StatusSignalType.CREATED,
            StatusSignalType.ERROR,
        ];
    }

    private static reactToProgress(): string[] {
        const { reactTo = [] } = Progress.disposition;
        return [
            ...reactTo,
            ProgressSignalType.CREATED,
            ProgressSignalType.ERROR,
        ];
    }

    private static reactToSeparator(): string[] {
        const { reactTo = [] } = Separator.disposition;
        return [
            ...reactTo,
            SeparatorSignalType.CREATED,
            SeparatorSignalType.ERROR,
        ];
    }

    public constructor(id: string = __ID__) {
        super(id);
    }

    private createChildDisposition(id: string, name: string, purpose: string, reactTo: readonly string[]): Disposition {
        return {
            aim: {
                description: purpose,
                body: { id: `${id}:${name}` },
            },
            reactTo: [...reactTo],
        };
    }

    private structuralCatalog(id: string): Cooky {
        return [
            [Box, this.createChildDisposition(id, 'box', Box.purpose, Box.disposition.reactTo ?? [])],
            [Picture, this.createChildDisposition(id, 'picture', Picture.purpose, Picture.disposition.reactTo ?? [])],
        ];
    }

    private interactiveCatalog(id: string): Cooky {
        return [
            [Action, this.createChildDisposition(id, 'action', Action.purpose, Action.disposition.reactTo ?? [])],
            [Input, this.createChildDisposition(id, 'input', Input.purpose, Input.disposition.reactTo ?? [])],
        ];
    }

    private dataCatalog(id: string): Cooky {
        return [
            [Collection, this.createChildDisposition(id, 'collection', Collection.purpose, Collection.disposition.reactTo ?? [])],
        ];
    }

    private capabilityCatalog(id: string): Cooky {
        return [
            [
                Css,
                {
                    aim: {
                        description: Css.AIM,
                        body: {
                            id: `${id}:css`,
                        },
                    },
                    reactTo: [
                        ...Css.disposition.reactTo ?? [],
                    ],
                },
            ],
        ];
    }

    private primitiveCatalog(id: string): Cooky {
        return [
            [Heading, this.createChildDisposition(id, 'heading', Heading.purpose, Heading.disposition.reactTo ?? [])],
            [Paragraph, this.createChildDisposition(id, 'paragraph', Paragraph.purpose, Paragraph.disposition.reactTo ?? [])],
            [Access, this.createChildDisposition(id, 'access', Access.purpose, Access.disposition.reactTo ?? [])],
            [Choice, this.createChildDisposition(id, 'choice', Choice.purpose, Choice.disposition.reactTo ?? [])],
            [Toggle, this.createChildDisposition(id, 'toggle', Toggle.purpose, Toggle.disposition.reactTo ?? [])],
            [Range, this.createChildDisposition(id, 'range', Range.purpose, Range.disposition.reactTo ?? [])],
            [Quantity, this.createChildDisposition(id, 'quantity', Quantity.purpose, Quantity.disposition.reactTo ?? [])],
            [Moment, this.createChildDisposition(id, 'moment', Moment.purpose, Moment.disposition.reactTo ?? [])],
            [SymbolUnit, this.createChildDisposition(id, 'symbol', SymbolUnit.purpose, SymbolUnit.disposition.reactTo ?? [])],
            [Status, this.createChildDisposition(id, 'status', Status.purpose, Status.disposition.reactTo ?? [])],
            [Progress, this.createChildDisposition(id, 'progress', Progress.purpose, Progress.disposition.reactTo ?? [])],
            [Separator, this.createChildDisposition(id, 'separator', Separator.purpose, Separator.disposition.reactTo ?? [])],
        ];
    }

    protected override catalog(): Cooky {
        const { id } = this;
        return [
            ...this.capabilityCatalog(id),
            ...this.structuralCatalog(id),
            ...this.interactiveCatalog(id),
            ...this.dataCatalog(id),
            ...this.primitiveCatalog(id),
        ];
    }

    protected override react(signal: Signal): void {
        const {
            property,
            value,
        } = signal;
        switch (property) {
            case SignalType.RENDER:
                this.handleRender(value);
                break;
            case SignalType.SKELETON:
                this.handleSkeleton(value);
                break;
            case SignalType.CLEAR:
                this.handleClear(value);
                break;
            case BoxSignalType.CREATED:
                this.handleBoxCreated(value);
                break;
            case BoxSignalType.ERROR:
                this.handleBoxError(value);
                break;
            case ActionSignalType.ERROR:
                this.handleActionError(value);
                break;
            case ActionSignalType.CREATED:
                this.handleActionCreated(value);
                break;
            case PictureSignalType.ERROR:
                this.handlePictureError(value);
                break;
            case PictureSignalType.CREATED:
                this.handlePictureCreated(value);
                break;
            case InputSignalType.ERROR:
                this.handleInputError(value);
                break;
            case InputSignalType.CREATED:
                this.handleInputCreated(value);
                break;
            case CollectionSignalType.ERROR:
                this.handleCollectionError(value);
                break;
            case CollectionSignalType.CREATED:
                this.handleCollectionCreated(value);
                break;
            case HeadingSignalType.CREATED:
                this.handleHeadingCreated(value);
                break;
            case HeadingSignalType.ERROR:
                this.handleHeadingError(value);
                break;
            case ParagraphSignalType.CREATED:
                this.handleParagraphCreated(value);
                break;
            case ParagraphSignalType.ERROR:
                this.handleParagraphError(value);
                break;
            case AccessSignalType.CREATED:
                this.handleAccessCreated(value);
                break;
            case AccessSignalType.ERROR:
                this.handleAccessError(value);
                break;
            case ChoiceSignalType.CREATED:
                this.handleChoiceCreated(value);
                break;
            case ChoiceSignalType.ERROR:
                this.handleChoiceError(value);
                break;
            case ToggleSignalType.CREATED:
                this.handleToggleCreated(value);
                break;
            case ToggleSignalType.ERROR:
                this.handleToggleError(value);
                break;
            case RangeSignalType.CREATED:
                this.handleRangeCreated(value);
                break;
            case RangeSignalType.ERROR:
                this.handleRangeError(value);
                break;
            case QuantitySignalType.CREATED:
                this.handleQuantityCreated(value);
                break;
            case QuantitySignalType.ERROR:
                this.handleQuantityError(value);
                break;
            case MomentSignalType.CREATED:
                this.handleMomentCreated(value);
                break;
            case MomentSignalType.ERROR:
                this.handleMomentError(value);
                break;
            case SymbolSignalType.CREATED:
                this.handleSymbolCreated(value);
                break;
            case SymbolSignalType.ERROR:
                this.handleSymbolError(value);
                break;
            case StatusSignalType.CREATED:
                this.handleStatusCreated(value);
                break;
            case StatusSignalType.ERROR:
                this.handleStatusError(value);
                break;
            case ProgressSignalType.CREATED:
                this.handleProgressCreated(value);
                break;
            case ProgressSignalType.ERROR:
                this.handleProgressError(value);
                break;
            case SeparatorSignalType.CREATED:
                this.handleSeparatorCreated(value);
                break;
            case SeparatorSignalType.ERROR:
                this.handleSeparatorError(value);
                break;
            default:
                break;
        }
    }

    private logRenderInput(value: unknown): void {
        const payload = (value ?? {}) as RenderPayload;
        const { mode, areaId, containerElement } = payload;
        console.log('[RENDER::INPUT]', { mode, areaId, containerElement, payload });
    }

    private logRenderResponse(mode: RenderModeType, targetId: string, success: boolean, context?: unknown): void {
        console.log('[RENDER::RESPONSE]', { mode, targetId, success, context });
    }

    private isRenderInference(mode?: RenderModeType, areaId?: string): boolean {
        return mode === RenderMode.INFERENCE || Boolean(areaId);
    }

    private handleRender(value?: unknown): void {
        this.logRenderInput(value);
        const {
            mode,
            areaId,
        } = (value ?? {}) as RenderPayload;
        if (this.isRenderInference(mode, areaId)) {
            this.handleInference(value);
            return;
        }
        this.handleDeterministic(value);
    }

    private handleDeterministic(value?: unknown): void {
        const parsed = deterministicPayloadSchema.safeParse(value);
        if (!parsed.success) {
            this.pulseError(null, parsed.error.message);
            return;
        }
        this.renderDeterministicAreas(parsed.data);
    }

    private renderDeterministicAreas(payload: DeterministicPayload): void {
        const target = payload.containerElement ?? DEFAULT_CONTAINER;
        this.executeAreaMount(payload, target);
    }

    private executeAreaMount(payload: DeterministicPayload, target: string): void {
        const {
            areas,
            skeleton = true,
            appearance,
            context,
        } = payload;
        this.applyThemeAppearance(appearance);
        const binding = (context ?? {
            correlationId: crypto.randomUUID(),
            context: {},
        }) as LayoutContext;
        this.mountAreas(areas, target, skeleton, binding, appearance);
    }

    private applyThemeAppearance(appearance?: Appearance): void {
        if (!appearance?.colorScheme) {
            return;
        }
        this.pulse(CssSignalType.THEME, {
            theme: appearance.colorScheme,
        });
    }



    private mountAreas(
        areas: readonly LayoutArea[],
        target: string,
        skeleton: boolean,
        context: LayoutContext,
        appearance?: Appearance,
    ): void {
        areas.forEach((area) => this.mountSingleArea(area, target, skeleton, context, appearance));
    }

    private mountSingleArea(
        area: LayoutArea,
        target: string,
        skeleton: boolean,
        context: LayoutContext,
        appearance?: Appearance,
    ): void {
        const {
            skeletonKind,
            role,
            id,
        } = area;
        const content = skeleton ? this.buildSkeletonSvg(skeletonKind ?? role ?? id, appearance) : area.content;
        this.dispatchBoxRender(area, target, content, context);
    }

    private dispatchBoxRender(area: LayoutArea, target: string, content: string | undefined, binding: LayoutContext): void {
        const {
            id: elementId,
            parentId = target.replace(/^#/,
            ''),
        } = area;
        const {
            correlationId,
        } = binding;
        const {
            aim,
        } = this.disposition;
        const {
            confirmedMounts = [],
        } = aim.body ?? {};
        if (confirmedMounts.includes(`${correlationId}:${elementId}`)) {
            return;
        }
        const qualities = this.resolveAreaQualities(area);
        const mount = this.createAreaMount(area, parentId, binding);
        this.pulse(BoxSignalType.RENDER, {
            elementId,
            containerElement: `#${parentId}`,
            content,
            qualities,
            context: mount,
        });
    }

    private resolveAreaQualities(area: LayoutArea): Record<string, unknown> {
        const { proportion, qualities = {} } = area;
        const flex = proportion
            ? (proportion.includes('%') ? `0 0 ${proportion}` : proportion)
            : undefined;
        return {
            ...qualities,
            ...(flex && { flex }),
            width: '100%',
        };
    }

    private handleInference(value?: unknown): void {
        const parsed = inferencePayloadSchema.safeParse(value);
        if (!parsed.success) {
            this.pulseError(null, parsed.error.message);
            return;
        }
        this.scheduleComponent(parsed.data);
    }

    private isParentReady(parentId: string, areaId: string, connected: readonly string[]): boolean {
        if (parentId === areaId || connected.includes(parentId)) {
            return true;
        }
        return typeof document !== 'undefined' && Boolean(document.getElementById(parentId));
    }

    private resolveMountState(): { connected: readonly string[]; pending: readonly InferencePayload[] } {
        const {
            aim,
        } = this.disposition;
        const {
            connectedElements = [],
            pendingComponents = [],
        } = aim.body ?? {};
        return {
            connected: connectedElements,
            pending: pendingComponents,
        };
    }

    private enqueuePendingComponent(payload: InferencePayload, pending: readonly InferencePayload[]): void {
        this.updateMountDisposition({
            pendingComponents: [...pending, payload],
        });
    }

    private scheduleComponent(payload: InferencePayload): void {
        const {
            areaId,
            parentId = areaId,
        } = payload;
        const {
            connected,
            pending,
        } = this.resolveMountState();
        if (this.isParentReady(parentId, areaId, connected)) {
            this.renderInferenceComponent(payload);
            return;
        }
        this.enqueuePendingComponent(payload, pending);
    }

    private renderInferenceComponent(data: InferencePayload): void {
        const {
            areaId,
            parentId = areaId,
            context,
        } = data;
        const {
            correlationId = crypto.randomUUID(),
        } = (context ?? {}) as LayoutContext;
        const mount: MountContext = {
            kind: MountKind.COMPONENT,
            areaId,
            parentId,
            correlationId,
            context: {},
        };
        this.dispatchWebUcaRender(areaId, { ...data, context: mount });
    }

    private normalizeComponentKey(component?: string): string {
        const raw = component?.toLowerCase() ?? '';
        return raw.replace(/^(core:)?(ext-)?/, '').trim();
    }

    private resolveComponentType(component?: string): ComponentType {
        const key = this.normalizeComponentKey(component);
        const mapped = COMPONENT_MAP[key] as ComponentType | undefined;
        return mapped ?? ComponentType.BOX;
    }

    private resolveTargetContainer(areaId: string, parentId?: string): string {
        if (!parentId) {
            return `#${areaId}`;
        }
        return parentId.startsWith('#') ? parentId : `#${parentId}`;
    }

    private dispatchWebUcaRender(areaId: string, payload: InferencePayload): void {
        const componentType = this.resolveComponentType(payload.component);
        switch (componentType) {
            case ComponentType.ACTION:
                this.pulse(ActionSignalType.RENDER, this.buildActionRenderPayload(areaId, payload));
                break;
            case ComponentType.PICTURE:
                this.pulse(PictureSignalType.RENDER, this.buildPictureRenderPayload(areaId, payload));
                break;
            case ComponentType.INPUT:
                this.pulse(InputSignalType.RENDER, this.buildInputRenderPayload(areaId, payload));
                break;
            case ComponentType.COLLECTION:
                this.pulse(CollectionSignalType.RENDER, this.buildCollectionRenderPayload(areaId, payload));
                break;
            case ComponentType.HEADING:
                this.handleHeadingRender(areaId, payload);
                break;
            case ComponentType.PARAGRAPH:
                this.handleParagraphRender(areaId, payload);
                break;
            case ComponentType.ACCESS:
                this.handleAccessRender(areaId, payload);
                break;
            case ComponentType.CHOICE:
                this.handleChoiceRender(areaId, payload);
                break;
            case ComponentType.TOGGLE:
                this.handleToggleRender(areaId, payload);
                break;
            case ComponentType.RANGE:
                this.handleRangeRender(areaId, payload);
                break;
            case ComponentType.QUANTITY:
                this.handleQuantityRender(areaId, payload);
                break;
            case ComponentType.MOMENT:
                this.handleMomentRender(areaId, payload);
                break;
            case ComponentType.SYMBOL:
                this.handleSymbolRender(areaId, payload);
                break;
            case ComponentType.STATUS:
                this.handleStatusRender(areaId, payload);
                break;
            case ComponentType.PROGRESS:
                this.handleProgressRender(areaId, payload);
                break;
            case ComponentType.SEPARATOR:
                this.handleSeparatorRender(areaId, payload);
                break;
            default:
                this.pulse(BoxSignalType.RENDER, this.buildBoxInferencePayload(areaId, payload));
                break;
        }
    }

    private resolveElementId(areaId: string, type: string, id?: string): string {
        return id ?? `${areaId}:${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    }

    private buildBoxInferencePayload(areaId: string, payload: InferencePayload): Record<string, unknown> {
        const {
            id,
            context,
            parentId,
            content,
            qualities,
        } = payload;
        return {
            context,
            elementId: this.resolveElementId(areaId, 'box', id),
            containerElement: this.resolveTargetContainer(areaId, parentId),
            content,
            qualities,
        };
    }

    private buildActionRenderPayload(areaId: string, payload: InferencePayload): Record<string, unknown> {
        const {
            id,
            context,
            parentId,
            content,
            qualities,
            attributes,
        } = payload;
        return {
            context,
            elementId: this.resolveElementId(areaId, 'action', id),
            containerElement: this.resolveTargetContainer(areaId, parentId),
            content,
            label: content,
            qualities,
            type: attributes?.type ?? 'button',
        };
    }

    private extractPictureSource(payload: InferencePayload): string | undefined {
        const raw = payload as Record<string, unknown>;
        return (raw.src ?? raw.url ?? payload.attributes?.src) as string | undefined;
    }

    private buildPictureRenderPayload(areaId: string, payload: InferencePayload): Record<string, unknown> {
        const { id, context, parentId, qualities, attributes } = payload;
        const src = this.extractPictureSource(payload);
        return {
            context,
            elementId: this.resolveElementId(areaId, 'picture', id),
            containerElement: this.resolveTargetContainer(areaId, parentId),
            src,
            alt: attributes?.alt ?? 'UCA',
            qualities,
        };
    }

    private buildInputRenderPayload(areaId: string, payload: InferencePayload): Record<string, unknown> {
        const {
            id,
            context,
            parentId,
            content,
            qualities,
            attributes,
        } = payload;
        return {
            context,
            elementId: this.resolveElementId(areaId, 'input', id),
            containerElement: this.resolveTargetContainer(areaId, parentId),
            value: content,
            placeholder: attributes?.placeholder,
            qualities,
        };
    }



    private buildCollectionRenderPayload(areaId: string, payload: InferencePayload): Record<string, unknown> {
        const {
            id,
            context,
            parentId,
            content,
            qualities,
        } = payload;
        return {
            context,
            elementId: this.resolveElementId(areaId, 'collection', id),
            containerElement: this.resolveTargetContainer(areaId, parentId),
            content,
            qualities,
        };
    }

    private handleSkeleton(value?: unknown): void {
        const parsed = skeletonPayloadSchema.safeParse(value);
        if (!parsed.success) {
            this.pulseError(null, parsed.error.message);
            return;
        }
        this.renderSkeleton(parsed.data);
    }

    private renderSkeleton(data: SkeletonPayload): void {
        const {
            areaId,
            kind = DEFAULT_SKELETON_KIND,
            appearance,
            context,
        } = data;
        const skeletonSvg = this.buildSkeletonSvg(kind, appearance);
        this.pulse(BoxSignalType.UPDATE, {
            elementId: areaId,
            content: skeletonSvg,
        });
        this.pulseSkeletonAttached(areaId, context);
    }

    private pulseSkeletonAttached(targetId: string, context?: unknown): void {
        const result = this.buildRenderedResult(
            RenderMode.DETERMINISTIC,
            targetId,
            context,
        );
        this.pulse(SignalType.SKELETON_ATTACHED, result);
    }

    private resolveSkeletonTemplate(kind: string): { height: number; elements: string } {
        const alias: Record<string, string> = {
            banner: 'header',
            content: 'main',
            contentinfo: 'footer',
        };
        const key = alias[kind.toLowerCase()] ?? kind.toLowerCase();
        return SKELETON_TEMPLATES[key] ?? SKELETON_TEMPLATES.container;
    }

    private buildSkeletonSvg(kind: string, appearance?: Appearance): string {
        const {
            elements,
            height,
        } = this.resolveSkeletonTemplate(kind);
        const colorScheme = appearance?.colorScheme ?? 'dark';
        const palette = colorScheme === 'light' ? PALETTES.light : PALETTES.dark;
        const styles = `${palette} .surface{fill:var(--surface);stroke:var(--edge);stroke-width:1}.line{fill:var(--line);animation:shimmer 2.2s ease-in-out infinite}@keyframes shimmer{0%,100%{opacity:.45}50%{opacity:.85}}`;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${height}" viewBox="0 0 ${VIEWBOX_WIDTH} ${height}" preserveAspectRatio="none"><style>${styles}</style>${elements}</svg>`;
    }

    private handleClear(value?: unknown): void {
        const parsed = clearPayloadSchema.safeParse(value);
        if (!parsed.success) {
            this.pulseError(null, parsed.error.message);
            return;
        }
        this.forgetAreaChildren(parsed.data);
        this.executeClear(parsed.data);
    }

    private executeClear(data: ClearPayload): void {
        const {
            areaId,
            context,
        } = data;
        this.pulse(BoxSignalType.UPDATE, {
            elementId: areaId,
            content: '',
        });
        this.pulse(CssSignalType.REMOVE, {
            elementId: areaId,
        });
        const result = this.buildRenderedResult(RenderMode.INFERENCE, areaId, context);
        this.pulse(SignalType.CLEARED, result);
    }

    private buildRenderedResult(
        mode: RenderModeType,
        targetId: string,
        context?: unknown,
    ): RenderedResult {
        return {
            mode,
            targetId,
            context,
        };
    }

    private pulseRendered(
        mode: RenderModeType,
        targetId: string,
        context?: unknown,
    ): void {
        const result = this.buildRenderedResult(mode, targetId, context);
        this.logRenderResponse(mode, targetId, true, context);
        this.pulse(SignalType.RENDERED, result);
    }

    private pulseError(areaId: string | null, error: string): void {
        console.error('[RENDER::ERROR]', { areaId, error });
        this.pulse(SignalType.ERROR, {
            areaId,
            error,
        });
    }
    private createAreaMount(area: LayoutArea, parentId: string, binding: LayoutContext): MountContext {
        const {
            id: areaId,
        } = area;
        return {
            ...binding,
            kind: MountKind.AREA,
            area,
            areaId,
            parentId,
        };
    }

    private handleBoxCreated(value: unknown): void {
        const {
            context,
        } = value as CreatedElement;
        if (context?.kind !== MountKind.AREA) {
            this.confirmComponent(value);
            return;
        }
        this.confirmArea(context);
    }

    private confirmArea(mount: MountContext): void {
        const {
            area,
            areaId,
            correlationId,
            context,
        } = mount;
        const {
            aim,
        } = this.disposition;
        const {
            confirmedMounts = [],
        } = aim.body ?? {};
        const key = `${correlationId}:${areaId}`;
        if (confirmedMounts.includes(key)) {
            return;
        }
        this.rememberAreaMount(key);
        this.releaseChildren(areaId);
        this.pulse(SignalType.AREA_CREATED, {
            area,
            correlationId,
            context,
        });
    }

    private rememberAreaMount(key: string): void {
        const {
            aim,
        } = this.disposition;
        const {
            confirmedMounts = [],
        } = aim.body ?? {};
        const body = {
            ...aim.body,
            confirmedMounts: [...confirmedMounts, key],
        };
        this.pulse(this.updateEvent, {
            ...this.disposition,
            aim: { ...aim, body },
        });
    }

    private confirmComponent(value: unknown): void {
        const {
            elementId,
            context,
            detail,
        } = value as CreatedElement;
        const mount = context ?? detail?.context;
        if (mount?.kind !== MountKind.COMPONENT) {
            return;
        }
        this.releaseChildren(elementId);
        this.pulseRendered(RenderMode.INFERENCE, elementId, mount);
    }

    private handleBoxError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleActionCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handlePictureCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleInputCreated(value: unknown): void {
        this.confirmComponent(value);
    }



    private handleCollectionCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private updateConnectedState(elementId: string, pending: readonly InferencePayload[]): void {
        const {
            aim,
        } = this.disposition;
        const {
            connectedElements = [],
        } = aim.body ?? {};
        this.updateMountDisposition({
            connectedElements: [...new Set([...connectedElements, elementId])],
            pendingComponents: pending.filter(({ parentId }) => parentId !== elementId),
        });
    }

    private releaseChildren(elementId: string): void {
        const {
            pending,
        } = this.resolveMountState();
        const ready = pending.filter(({ parentId }) => parentId === elementId);
        this.updateConnectedState(elementId, pending);
        ready.forEach((payload) => this.renderInferenceComponent(payload));
    }

    private updateMountDisposition(patch: Partial<Body>): void {
        const {
            aim,
        } = this.disposition;
        const body = {
            ...aim.body,
            ...patch,
        };
        this.pulse(this.updateEvent, {
            ...this.disposition,
            aim: { ...aim, body },
        });
    }

    private handleActionError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handlePictureError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleInputError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }



    private handleCollectionError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private forgetAreaChildren(payload: ClearPayload): void {
        const {
            areaId,
        } = payload;
        const {
            aim,
        } = this.disposition;
        const {
            connectedElements = [],
            pendingComponents = [],
            confirmedMounts = [],
        } = aim.body ?? {};
        this.updateMountDisposition({
            connectedElements: connectedElements.filter((id) => !id.startsWith(`${areaId}:`)),
            pendingComponents: pendingComponents.filter(({ areaId: pendingArea }) => pendingArea !== areaId && !pendingArea.startsWith(`${areaId}:`)),
            confirmedMounts: confirmedMounts.filter((key) => !key.includes(`:${areaId}:`)),
        });
    }


    private handleHeadingRender(areaId: string, payload: InferencePayload): void {
        this.pulse(HeadingSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleHeadingCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleHeadingError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleParagraphRender(areaId: string, payload: InferencePayload): void {
        this.pulse(ParagraphSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleParagraphCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleParagraphError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleAccessRender(areaId: string, payload: InferencePayload): void {
        this.pulse(AccessSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleAccessCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleAccessError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleChoiceRender(areaId: string, payload: InferencePayload): void {
        this.pulse(ChoiceSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleChoiceCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleChoiceError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleToggleRender(areaId: string, payload: InferencePayload): void {
        this.pulse(ToggleSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleToggleCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleToggleError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleRangeRender(areaId: string, payload: InferencePayload): void {
        this.pulse(RangeSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleRangeCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleRangeError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleQuantityRender(areaId: string, payload: InferencePayload): void {
        this.pulse(QuantitySignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleQuantityCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleQuantityError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleMomentRender(areaId: string, payload: InferencePayload): void {
        this.pulse(MomentSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleMomentCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleMomentError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleSymbolRender(areaId: string, payload: InferencePayload): void {
        this.pulse(SymbolSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleSymbolCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleSymbolError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleStatusRender(areaId: string, payload: InferencePayload): void {
        this.pulse(StatusSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleStatusCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleStatusError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleProgressRender(areaId: string, payload: InferencePayload): void {
        this.pulse(ProgressSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleProgressCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleProgressError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private handleSeparatorRender(areaId: string, payload: InferencePayload): void {
        this.pulse(SeparatorSignalType.RENDER, this.primitivePayload(areaId, payload));
    }

    private handleSeparatorCreated(value: unknown): void {
        this.confirmComponent(value);
    }

    private handleSeparatorError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private resolvePrimitiveData(payload: InferencePayload): Record<string, unknown> {
        const {
            attributes,
            properties,
            content,
            qualities,
        } = payload;
        return {
            ...attributes,
            ...properties,
            text: content ?? properties?.text,
            qualities: qualities ?? properties?.qualities,
        };
    }

    private primitivePayload(areaId: string, payload: InferencePayload): Record<string, unknown> {
        const {
            id,
            parentId = areaId,
            context,
        } = payload;
        return {
            ...this.resolvePrimitiveData(payload),
            elementId: id,
            parentId,
            containerElement: this.resolveTargetContainer(areaId, parentId),
            context,
        };
    }

}

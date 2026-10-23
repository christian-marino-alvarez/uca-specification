import { Uca } from '@uca/core/uca';
import type {
    Cooky,
    Disposition,
    Signal,
} from '@uca/core/types';
import { WebComponent } from '@uca/capability-web-component';
import { SignalType as WebComponentSignalType } from '@uca/capability-web-component/types';
import { Css } from '@uca/capability-css';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { Box } from '@uca/box';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { Heading } from '@uca/heading';
import { SignalType as HeadingSignalType } from '@uca/heading/types';
import { Paragraph } from '@uca/paragraph';
import { SignalType as ParagraphSignalType } from '@uca/paragraph/types';
import { Action } from '@uca/action';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { Access } from '@uca/access';
import { SignalType as AccessSignalType } from '@uca/access/types';
import { Picture } from '@uca/picture';
import { SignalType as PictureSignalType } from '@uca/picture/types';
import { Input } from '@uca/input';
import { SignalType as InputSignalType } from '@uca/input/types';
import { Separator } from '@uca/separator';
import { SignalType as SeparatorSignalType } from '@uca/separator/types';
import { Symbol as SymbolUca } from '@uca/symbol';
import { SignalType as SymbolSignalType } from '@uca/symbol/types';
import { Status } from '@uca/status';
import { SignalType as StatusSignalType } from '@uca/status/types';
import { Progress } from '@uca/progress';
import { SignalType as ProgressSignalType } from '@uca/progress/types';
import { List } from '../list/index.js';
import { SignalType as ListSignalType } from '../list/types.js';
import { Toggle } from '@uca/toggle';
import { SignalType as ToggleSignalType } from '@uca/toggle/types';
import { Choice } from '@uca/choice';
import { SignalType as ChoiceSignalType } from '@uca/choice/types';
import { Range } from '@uca/range';
import { SignalType as RangeSignalType } from '@uca/range/types';
import { Quantity } from '@uca/quantity';
import { SignalType as QuantitySignalType } from '@uca/quantity/types';
import { Moment } from '@uca/moment';
import { SignalType as MomentSignalType } from '@uca/moment/types';
import { Card } from '../card/index.js';
import { SignalType as CardSignalType } from '../card/types.js';
import { Chip } from '../chip/index.js';
import { SignalType as ChipSignalType } from '../chip/types.js';
import { Slider } from '../slider/index.js';
import { SignalType as SliderSignalType } from '../slider/types.js';
import { Dialog } from '../dialog/index.js';
import { SignalType as DialogSignalType } from '../dialog/types.js';
import {
    type Body,
    type ComponentDef,
    type RenderChannel,
    type VisualPrimitive,
    DataType,
    RenderMode,
    SignalType,
} from './types.js';
import {
    BATCH_SIZE,
    DEFAULT_CHANNEL,
} from './constants.js';

const PRIMITIVE_UCAS = [
    {
        name: 'box',
        uca: Box,
    },
    {
        name: 'list',
        uca: List,
    },
    {
        name: 'heading',
        uca: Heading,
    },
    {
        name: 'paragraph',
        uca: Paragraph,
    },
    {
        name: 'action',
        uca: Action,
    },
    {
        name: 'access',
        uca: Access,
    },
    {
        name: 'picture',
        uca: Picture,
    },
    {
        name: 'input',
        uca: Input,
    },
    {
        name: 'separator',
        uca: Separator,
    },
    {
        name: 'symbol',
        uca: SymbolUca,
    },
    {
        name: 'status',
        uca: Status,
    },
    {
        name: 'progress',
        uca: Progress,
    },
    {
        name: 'toggle',
        uca: Toggle,
    },
    {
        name: 'choice',
        uca: Choice,
    },
    {
        name: 'range',
        uca: Range,
    },
    {
        name: 'quantity',
        uca: Quantity,
    },
    {
        name: 'moment',
        uca: Moment,
    },
    {
        name: 'card',
        uca: Card,
    },
    {
        name: 'chip',
        uca: Chip,
    },
    {
        name: 'slider',
        uca: Slider,
    },
    {
        name: 'dialog',
        uca: Dialog,
    },
] as const;


export class Render extends Uca<Body> {
    public static override purpose: string =
        'Materialize and orchestrate autonomous spatial layouts and visual elements through Web UCAs';

    private static createVisualPrimitive(name: string, uca: (typeof PRIMITIVE_UCAS)[number]['uca']): VisualPrimitive {
        const visual = (uca as unknown as { visualDisposition?: Record<string, unknown> }).visualDisposition;
        return {
            name,
            nombre: name,
            proposito: uca.purpose,
            intencion: uca.disposition.aim.description,
            ...(visual && { disposicionVisual: visual }),
        };
    }

    public static getVisualPrimitives(): VisualPrimitive[] {
        return PRIMITIVE_UCAS.map(({ name, uca }) => this.createVisualPrimitive(name, uca));
    }


    private static reactToWebComponent(): string[] {
        return [
            WebComponentSignalType.RENDERED,
            WebComponentSignalType.ERROR,
            ...WebComponent.disposition.reactTo ?? [],
        ];
    }

    private static reactToCss(): string[] {
        return [
            CssSignalType.APPLIED,
            CssSignalType.ERROR,
            ...Css.disposition.reactTo ?? [],
        ];
    }

    private static reactToPrimitives(): string[] {
        return [
            BoxSignalType.CREATED,
            ListSignalType.CREATED,
            HeadingSignalType.CREATED,
            ParagraphSignalType.CREATED,
            ActionSignalType.CREATED,
            AccessSignalType.CREATED,
            PictureSignalType.CREATED,
            InputSignalType.CREATED,
            SeparatorSignalType.CREATED,
            SymbolSignalType.CREATED,
            StatusSignalType.CREATED,
            ProgressSignalType.CREATED,
            ToggleSignalType.CREATED,
            ChoiceSignalType.CREATED,
            RangeSignalType.CREATED,
            QuantitySignalType.CREATED,
            MomentSignalType.CREATED,
            CardSignalType.CREATED,
            ChipSignalType.CREATED,
            SliderSignalType.CREATED,
            DialogSignalType.CREATED,
        ];
    }


    public static override disposition: Disposition<Body> = {
        aim: {
            description: Render.purpose,
        },
        reactTo: [
            SignalType.RENDER,
            ...Render.reactToWebComponent(),
            ...Render.reactToCss(),
            ...Render.reactToPrimitives(),
        ],
        inputs: [
            {
                signal: SignalType.RENDER,
                type: DataType.RENDER_PAYLOAD,
                description: 'Estímulo de renderizado de componentes y áreas',
            },
        ],
        outputs: [
            {
                signal: SignalType.RENDERED,
                type: DataType.RENDERED_RESULT,
                description: 'Notificación de renderizado completado',
            },
        ],
    };

    private readonly channels: Map<string, RenderChannel> = new Map();

    public constructor(id: string = 'render') {
        super(id);
    }

    private catalogWebComponent(): Cooky[number] {
        return [
            WebComponent,
            {
                aim: {
                    description: WebComponent.AIM,
                    body: {
                        id: `${this.id}:web-component`,
                    },
                },
                reactTo: [
                    ...WebComponent.disposition.reactTo ?? [],
                ],
            },
        ];
    }

    private catalogCss(): Cooky[number] {
        return [
            Css,
            {
                aim: {
                    description: Css.AIM,
                    body: {
                        id: `${this.id}:css`,
                    },
                },
                reactTo: [
                    ...Css.disposition.reactTo ?? [],
                ],
            },
        ];
    }

    private buildPrimitiveAim(
        id: string,
        name: string,
        uca: (typeof PRIMITIVE_UCAS)[number]['uca'],
    ): Disposition['aim'] {
        return {
            description: uca.purpose,
            body: {
                id: `${id}:${name}`,
            },
        };
    }

    private buildPrimitiveEntry(
        id: string,
        entry: (typeof PRIMITIVE_UCAS)[number],
    ): Cooky[number] {
        const { name, uca } = entry;
        return [
            uca,
            {
                aim: this.buildPrimitiveAim(id, name, uca),
                reactTo: [
                    ...uca.disposition.reactTo ?? [],
                ],
            },
        ];
    }

    private catalogPrimitives(): Cooky {
        const { id } = this;
        return PRIMITIVE_UCAS.map((entry) => (
            this.buildPrimitiveEntry(id, entry)
        ));
    }

    protected override catalog(): Cooky {
        return [
            this.catalogWebComponent(),
            this.catalogCss(),
            ...this.catalogPrimitives(),
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
            case WebComponentSignalType.RENDERED:
                this.handleComponentRendered(value);
                break;
            case BoxSignalType.CREATED:
                this.handleBoxCreated(value);
                break;
            case ListSignalType.CREATED:
                this.handleListCreated(value);
                break;
            case HeadingSignalType.CREATED:
                this.handleHeadingCreated(value);
                break;
            case ParagraphSignalType.CREATED:
                this.handleParagraphCreated(value);
                break;
            case ActionSignalType.CREATED:
                this.handleActionCreated(value);
                break;
            case AccessSignalType.CREATED:
                this.handleAccessCreated(value);
                break;
            case PictureSignalType.CREATED:
                this.handlePictureCreated(value);
                break;
            case InputSignalType.CREATED:
                this.handleInputCreated(value);
                break;
            case SeparatorSignalType.CREATED:
                this.handleSeparatorCreated(value);
                break;
            case SymbolSignalType.CREATED:
                this.handleSymbolCreated(value);
                break;
            case StatusSignalType.CREATED:
                this.handleStatusCreated(value);
                break;
            case ProgressSignalType.CREATED:
                this.handleProgressCreated(value);
                break;
            case ToggleSignalType.CREATED:
                this.handleToggleCreated(value);
                break;
            case ChoiceSignalType.CREATED:
                this.handleChoiceCreated(value);
                break;
            case RangeSignalType.CREATED:
                this.handleRangeCreated(value);
                break;
            case QuantitySignalType.CREATED:
                this.handleQuantityCreated(value);
                break;
            case MomentSignalType.CREATED:
                this.handleMomentCreated(value);
                break;
            case CardSignalType.CREATED:
                this.handleCardCreated(value);
                break;
            case ChipSignalType.CREATED:
                this.handleChipCreated(value);
                break;
            case SliderSignalType.CREATED:
                this.handleSliderCreated(value);
                break;
            case DialogSignalType.CREATED:
                this.handleDialogCreated(value);
                break;
            case WebComponentSignalType.ERROR:
                this.handleComponentError(value);
                break;
            default:
                break;
        }

    }

    private handleCardCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleChipCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleSliderCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleDialogCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleBoxCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleListCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleHeadingCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }


    private handleParagraphCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleActionCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleAccessCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handlePictureCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleInputCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleSeparatorCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleSymbolCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleStatusCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleProgressCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleToggleCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleChoiceCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleRangeCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleQuantityCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleMomentCreated(value: unknown): void {
        this.handleComponentRendered(value);
    }

    private handleComponentRendered(value: unknown): void {
        // Confirmation received from primitive UCA or WebComponent
    }

    private handleComponentError(value: unknown): void {
        this.pulse(SignalType.ERROR, value);
    }

    private getChannel(id: string): RenderChannel {
        let channel = this.channels.get(id);
        if (!channel) {
            channel = this.createChannel(id);
        }
        return channel;
    }

    private createChannel(id: string): RenderChannel {
        const channel: RenderChannel = {
            id,
            queue: [],
            isDraining: false,
        };
        this.channels.set(id, channel);
        return channel;
    }

    private handleRender(value: unknown): void {
        const {
            targetContainer = DEFAULT_CHANNEL,
            components = [],
        } = (value ?? {}) as { targetContainer?: string; components?: unknown[] };
        const channel = this.getChannel(targetContainer);
        const items = Array.isArray(components) ? components : [components];
        channel.queue.push(...items);
        this.scheduleDrain(channel);
    }

    private scheduleDrain(channel: RenderChannel): void {
        if (channel.isDraining || channel.queue.length === 0) {
            return;
        }
        channel.isDraining = true;
        const runner = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : queueMicrotask;
        runner(() => {
            this.processNextBatch(channel);
        });
    }

    private renderBatch(batch: unknown[], areaId: string): void {
        batch.forEach((item) => {
            this.renderComponentItem(item as ComponentDef, areaId);
        });
    }

    private processNextBatch(channel: RenderChannel): void {
        const batch = channel.queue.splice(0, BATCH_SIZE);
        channel.isDraining = false;
        this.renderBatch(batch, channel.id);
        this.logFlush(channel.id, batch.length, channel.queue.length);
        this.pulseBatch(channel.id, batch.length);
        if (channel.queue.length > 0) {
            this.scheduleDrain(channel);
        }
    }

    private resolveComponentSignal(component?: string): string {
        switch (component) {
            case 'list':
                return ListSignalType.RENDER;
            case 'heading':
                return HeadingSignalType.RENDER;
            case 'paragraph':
                return ParagraphSignalType.RENDER;
            case 'action':
                return ActionSignalType.RENDER;
            case 'access':
                return AccessSignalType.RENDER;
            case 'picture':
                return PictureSignalType.RENDER;
            case 'input':
                return InputSignalType.RENDER;
            case 'separator':
                return SeparatorSignalType.RENDER;
            case 'symbol':
                return SymbolSignalType.RENDER;
            case 'status':
                return StatusSignalType.RENDER;
            case 'progress':
                return ProgressSignalType.RENDER;
            case 'toggle':
                return ToggleSignalType.RENDER;
            case 'choice':
                return ChoiceSignalType.RENDER;
            case 'range':
                return RangeSignalType.RENDER;
            case 'quantity':
                return QuantitySignalType.RENDER;
            case 'moment':
                return MomentSignalType.RENDER;
            case 'card':
                return CardSignalType.RENDER;
            case 'chip':
                return ChipSignalType.RENDER;
            case 'slider':
                return SliderSignalType.RENDER;
            case 'dialog':
                return DialogSignalType.RENDER;
            default:
                return BoxSignalType.RENDER;
        }

    }

    private buildComponentPayload(item: ComponentDef, areaId: string): Record<string, unknown> {
        const elementId = item.id ?? crypto.randomUUID();
        const container = this.resolveItemContainer(item, areaId);
        const text = item.text ?? item.content ?? item.label ?? item.title;
        return {
            elementId,
            id: elementId,
            parentTo: container.replace('#', ''),
            containerElement: container,
            content: text,
            text,
            label: item.label ?? text,
            title: item.title,
            src: item.src,
            qualities: item.qualities ?? undefined,
            items: item.items ?? undefined,
            value: item.value ?? undefined,
            minimum: item.minimum ?? undefined,
            maximum: item.maximum ?? undefined,
            unit: item.unit ?? undefined,
            step: item.step ?? undefined,
            disabled: item.disabled ?? undefined,
            ...item.properties,
        };
    }

    private clearAreaSkeleton(areaId: string): void {
        if (typeof document === 'undefined') {
            return;
        }
        document.querySelectorAll(`[data-skeleton="${areaId}"]`).forEach((node) => {
            node.remove();
        });
    }

    private renderComponentItem(item: ComponentDef, areaId: string): void {
        const { component = 'box' } = item;
        const normalized = (component ?? 'box').toLowerCase();
        this.clearAreaSkeleton(areaId);
        const signal = this.resolveComponentSignal(normalized);
        const payload = this.buildComponentPayload(item, areaId);
        const targetId = `${this.id}:${normalized}`;
        this.pulse(signal, payload, targetId);
    }

    private isDescendantOfArea(parentId: string, areaId: string): boolean {
        if (typeof document === 'undefined' || parentId === 'root' || parentId === 'app' || parentId === 'body') {
            return false;
        }
        const area = document.getElementById(areaId);
        const target = document.getElementById(parentId);
        return Boolean(area && target && area.contains(target));
    }

    private resolveItemContainer(item: ComponentDef, areaId: string): string {
        const { parentId } = item;
        const valid = parentId && parentId !== 'null' && this.isDescendantOfArea(parentId, areaId);
        return valid ? `#${parentId}` : `#${areaId}`;
    }

    private pulseBatch(targetId: string, renderedCount: number): void {
        this.pulse(SignalType.RENDERED, {
            mode: RenderMode.INFERENCE,
            targetId,
            renderedCount,
        });
    }

    private logFlush(id: string, batchCount: number, pendingCount: number): void {
        const title = `%c🌊 [RENDER::CHANNEL] %c${id}%c (procesados: ${batchCount}, pendientes: ${pendingCount})`;
        console.log(title, 'color: #06D6A0; font-weight: bold;', 'color: #F6E05E; font-weight: bold;', 'color: #888;');
    }
}

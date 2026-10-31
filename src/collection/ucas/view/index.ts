import { z } from 'zod';
import { Access } from '@uca/access';
import { SignalType as AccessSignalType } from '@uca/access/types';
import { Action } from '@uca/action';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { Box } from '@uca/box';
import {
  SignalType as BoxSignalType,
  type Body as BoxBody,
} from '@uca/box/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
  Mode as StreamTransformerMode,
  SignalType as StreamTransformerSignalType,
  type RecoveryRequest as StreamTransformerRecoveryRequest,
  type TransformResult as StreamTransformerResult,
} from '@uca/capability-stream-transformer/types';
import { Card } from '@uca/card';
import { SignalType as CardSignalType } from '@uca/card/types';
import { Chip } from '@uca/chip';
import { SignalType as ChipSignalType } from '@uca/chip/types';
import { Choice } from '@uca/choice';
import { SignalType as ChoiceSignalType } from '@uca/choice/types';
import { Uca } from '@uca/core/uca';
import {
  DispositionSignal,
  type CapabilityConstructor,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import { Dialog } from '@uca/dialog';
import { SignalType as DialogSignalType } from '@uca/dialog/types';
import { Heading } from '@uca/heading';
import { SignalType as HeadingSignalType } from '@uca/heading/types';
import { Input } from '@uca/input';
import { SignalType as InputSignalType } from '@uca/input/types';
import { List } from '@uca/list';
import { SignalType as ListSignalType } from '@uca/list/types';
import { Llm } from '@uca/llm';
import { createRepairRequest } from '@uca/llm/recovery';
import {
  SignalType as LlmSignalType,
  type InferPayload,
  type StreamResult,
} from '@uca/llm/types';
import { Moment } from '@uca/moment';
import { SignalType as MomentSignalType } from '@uca/moment/types';
import { Paragraph } from '@uca/paragraph';
import { SignalType as ParagraphSignalType } from '@uca/paragraph/types';
import { Picture } from '@uca/picture';
import { SignalType as PictureSignalType } from '@uca/picture/types';
import { Progress } from '@uca/progress';
import { SignalType as ProgressSignalType } from '@uca/progress/types';
import { Quantity } from '@uca/quantity';
import { SignalType as QuantitySignalType } from '@uca/quantity/types';
import { Range } from '@uca/range';
import { SignalType as RangeSignalType } from '@uca/range/types';
import { Separator } from '@uca/separator';
import { SignalType as SeparatorSignalType } from '@uca/separator/types';
import { Slider } from '@uca/slider';
import { SignalType as SliderSignalType } from '@uca/slider/types';
import { Status } from '@uca/status';
import { SignalType as StatusSignalType } from '@uca/status/types';
import { Symbol as SymbolUca } from '@uca/symbol';
import { SignalType as SymbolSignalType } from '@uca/symbol/types';
import { Toast } from '@uca/toast';
import { SignalType as ToastSignalType } from '@uca/toast/types';
import { Toggle } from '@uca/toggle';
import { SignalType as ToggleSignalType } from '@uca/toggle/types';
import {
  COMPONENT_SEPARATOR,
  DEFAULT_AREA_ID,
  DEFAULT_INTENTION,
  DEFAULT_LIMITS,
  DEFAULT_PURPOSE,
  INFER_CONTRACT,
  LOGIC_UCAS,
  RENDER_SIGNALS,
  WEB_UCAS,
  __ID__,
} from './constants.js';
import {
  bodySchema,
  builtResultSchema,
  componentSchema,
  compositionSchema,
  errorSchema,
  repairCompositionSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Area,
  type Body,
  type Component,
  type ComponentType,
  type Qualities,
} from './types.js';

export class View extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  private static readonly outputSchema: Record<string, unknown> =
    z.toJSONSchema(compositionSchema);

  private static readonly repairOutputSchema: Record<string, unknown> =
    z.toJSONSchema(repairCompositionSchema);

  private static readonly primitives: Readonly<Record<ComponentType, typeof Uca>> = {
    access: Access as unknown as typeof Uca,
    action: Action as unknown as typeof Uca,
    box: Box as unknown as typeof Uca,
    card: Card as unknown as typeof Uca,
    chip: Chip as unknown as typeof Uca,
    choice: Choice as unknown as typeof Uca,
    dialog: Dialog as unknown as typeof Uca,
    heading: Heading as unknown as typeof Uca,
    input: Input as unknown as typeof Uca,
    list: List as unknown as typeof Uca,
    moment: Moment as unknown as typeof Uca,
    paragraph: Paragraph as unknown as typeof Uca,
    picture: Picture as unknown as typeof Uca,
    progress: Progress as unknown as typeof Uca,
    quantity: Quantity as unknown as typeof Uca,
    range: Range as unknown as typeof Uca,
    separator: Separator as unknown as typeof Uca,
    slider: Slider as unknown as typeof Uca,
    status: Status as unknown as typeof Uca,
    symbol: SymbolUca as unknown as typeof Uca,
    toast: Toast as unknown as typeof Uca,
    toggle: Toggle as unknown as typeof Uca,
  };

  public static override disposition: Disposition<Body> = {
    aim: {
      description: DEFAULT_INTENTION,
      body: {
        components: [],
        logicUcas: [
          ...LOGIC_UCAS,
        ],
        webUcas: [
          ...WEB_UCAS,
        ],
      },
    },
    limits: {
      rules: DEFAULT_LIMITS,
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.BUILD,
      ...View.reactToLlm(),
      ...View.reactToStreamTransformer(),
      ...View.reactToAccess(),
      ...View.reactToAction(),
      ...View.reactToBox(),
      ...View.reactToCard(),
      ...View.reactToChip(),
      ...View.reactToChoice(),
      ...View.reactToDialog(),
      ...View.reactToHeading(),
      ...View.reactToInput(),
      ...View.reactToList(),
      ...View.reactToMoment(),
      ...View.reactToParagraph(),
      ...View.reactToPicture(),
      ...View.reactToProgress(),
      ...View.reactToQuantity(),
      ...View.reactToRange(),
      ...View.reactToSeparator(),
      ...View.reactToSlider(),
      ...View.reactToStatus(),
      ...View.reactToSymbol(),
      ...View.reactToToast(),
      ...View.reactToToggle(),
    ],
    inputs: [
      {
        signal: DispositionSignal.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Continuar el flujo reactivo de la vista tras actualizar e hidratar su disposición',
        handler: View.prototype.handleUpdated,
      },
      {
        signal: SignalType.BUILD,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Crear el área visual hija del layout e hidratar sus elementos Web UCA',
        handler: View.prototype.handleBuild,
      },
      {
        signal: LlmSignalType.STREAMED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Stream de inferencia recibido desde la UCA de modelo de lenguaje',
        handler: View.prototype.handleLlmStreamed,
      },
      {
        signal: LlmSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la UCA de modelo de lenguaje',
        handler: View.prototype.handleLlmError,
      },
      {
        signal: StreamTransformerSignalType.TRANSFORMED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Stream de componentes transformado y validado progresivamente',
        handler: View.prototype.handleStreamTransformed,
      },
      {
        signal: StreamTransformerSignalType.RECOVER,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Solicitud de reparación de componente del stream ante fallo de validación',
        handler: View.prototype.handleStreamRecover,
      },
      {
        signal: StreamTransformerSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de transformación de stream',
        handler: View.prototype.handleStreamError,
      },
      ...View.createPrimitiveCreatedPorts(),
      ...View.createPrimitiveErrorPorts(),
    ],
    outputs: [
      {
        signal: SignalType.BUILT,
        type: DataType.BUILT_RESULT,
        schema: builtResultSchema,
        description: 'Área visual y elementos Web UCA hidratados y materializados',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la construcción o hidratación de la vista',
      },
    ],
  };

  private static createPrimitiveCreatedPorts(): NonNullable<Disposition<Body>['inputs']> {
    const signals = [
      AccessSignalType.CREATED,
      ActionSignalType.CREATED,
      BoxSignalType.CREATED,
      CardSignalType.CREATED,
      ChipSignalType.CREATED,
      ChoiceSignalType.CREATED,
      DialogSignalType.CREATED,
      HeadingSignalType.CREATED,
      InputSignalType.CREATED,
      ListSignalType.CREATED,
      MomentSignalType.CREATED,
      ParagraphSignalType.CREATED,
      PictureSignalType.CREATED,
      ProgressSignalType.CREATED,
      QuantitySignalType.CREATED,
      RangeSignalType.CREATED,
      SeparatorSignalType.CREATED,
      SliderSignalType.CREATED,
      StatusSignalType.CREATED,
      SymbolSignalType.CREATED,
      ToastSignalType.CREATED,
      ToggleSignalType.CREATED,
    ];
    return signals.map((signal) => ({
      signal,
      type: DataType.BODY,
      schema: bodySchema,
      description: 'Confirmación de elemento Web UCA hidratado y creado en el DOM',
      handler: View.prototype.handlePrimitiveCreated,
    }));
  }

  private static createPrimitiveErrorPorts(): NonNullable<Disposition<Body>['inputs']> {
    const signals = [
      AccessSignalType.ERROR,
      ActionSignalType.ERROR,
      BoxSignalType.ERROR,
      CardSignalType.ERROR,
      ChipSignalType.ERROR,
      ChoiceSignalType.ERROR,
      DialogSignalType.ERROR,
      HeadingSignalType.ERROR,
      InputSignalType.ERROR,
      ListSignalType.ERROR,
      MomentSignalType.ERROR,
      ParagraphSignalType.ERROR,
      PictureSignalType.ERROR,
      ProgressSignalType.ERROR,
      QuantitySignalType.ERROR,
      RangeSignalType.ERROR,
      SeparatorSignalType.ERROR,
      SliderSignalType.ERROR,
      StatusSignalType.ERROR,
      SymbolSignalType.ERROR,
      ToastSignalType.ERROR,
      ToggleSignalType.ERROR,
    ];
    return signals.map((signal) => ({
      signal,
      type: DataType.ERROR,
      schema: errorSchema,
      description: 'Error emitido por una UCA Web hidratada en la vista',
      handler: View.prototype.handlePrimitiveError,
    }));
  }

  private static reactToLlm(): string[] {
    const {
      reactTo = [],
    } = Llm.disposition;
    return [
      ...reactTo,
      LlmSignalType.STREAMED,
      LlmSignalType.ERROR,
    ];
  }

  private static reactToStreamTransformer(): string[] {
    const {
      reactTo = [],
    } = StreamTransformer.disposition;
    return [
      ...reactTo,
      StreamTransformerSignalType.TRANSFORMED,
      StreamTransformerSignalType.RECOVER,
      StreamTransformerSignalType.ERROR,
    ];
  }

  private static reactToAccess(): string[] {
    const {
      reactTo = [],
    } = Access.disposition;
    return [
      ...reactTo,
      AccessSignalType.CREATED,
      AccessSignalType.ERROR,
    ];
  }

  private static reactToAction(): string[] {
    const {
      reactTo = [],
    } = Action.disposition;
    return [
      ...reactTo,
      ActionSignalType.CREATED,
      ActionSignalType.ERROR,
    ];
  }

  private static reactToBox(): string[] {
    const {
      reactTo = [],
    } = Box.disposition;
    return [
      ...reactTo,
      BoxSignalType.CREATED,
      BoxSignalType.ERROR,
    ];
  }

  private static reactToCard(): string[] {
    const {
      reactTo = [],
    } = Card.disposition;
    return [
      ...reactTo,
      CardSignalType.CREATED,
      CardSignalType.ERROR,
    ];
  }

  private static reactToChip(): string[] {
    const {
      reactTo = [],
    } = Chip.disposition;
    return [
      ...reactTo,
      ChipSignalType.CREATED,
      ChipSignalType.ERROR,
    ];
  }

  private static reactToChoice(): string[] {
    const {
      reactTo = [],
    } = Choice.disposition;
    return [
      ...reactTo,
      ChoiceSignalType.CREATED,
      ChoiceSignalType.ERROR,
    ];
  }

  private static reactToDialog(): string[] {
    const {
      reactTo = [],
    } = Dialog.disposition;
    return [
      ...reactTo,
      DialogSignalType.CREATED,
      DialogSignalType.ERROR,
    ];
  }

  private static reactToHeading(): string[] {
    const {
      reactTo = [],
    } = Heading.disposition;
    return [
      ...reactTo,
      HeadingSignalType.CREATED,
      HeadingSignalType.ERROR,
    ];
  }

  private static reactToInput(): string[] {
    const {
      reactTo = [],
    } = Input.disposition;
    return [
      ...reactTo,
      InputSignalType.CREATED,
      InputSignalType.ERROR,
    ];
  }

  private static reactToList(): string[] {
    const {
      reactTo = [],
    } = List.disposition;
    return [
      ...reactTo,
      ListSignalType.CREATED,
      ListSignalType.ERROR,
    ];
  }

  private static reactToMoment(): string[] {
    const {
      reactTo = [],
    } = Moment.disposition;
    return [
      ...reactTo,
      MomentSignalType.CREATED,
      MomentSignalType.ERROR,
    ];
  }

  private static reactToParagraph(): string[] {
    const {
      reactTo = [],
    } = Paragraph.disposition;
    return [
      ...reactTo,
      ParagraphSignalType.CREATED,
      ParagraphSignalType.ERROR,
    ];
  }

  private static reactToPicture(): string[] {
    const {
      reactTo = [],
    } = Picture.disposition;
    return [
      ...reactTo,
      PictureSignalType.CREATED,
      PictureSignalType.ERROR,
    ];
  }

  private static reactToProgress(): string[] {
    const {
      reactTo = [],
    } = Progress.disposition;
    return [
      ...reactTo,
      ProgressSignalType.CREATED,
      ProgressSignalType.ERROR,
    ];
  }

  private static reactToQuantity(): string[] {
    const {
      reactTo = [],
    } = Quantity.disposition;
    return [
      ...reactTo,
      QuantitySignalType.CREATED,
      QuantitySignalType.ERROR,
    ];
  }

  private static reactToRange(): string[] {
    const {
      reactTo = [],
    } = Range.disposition;
    return [
      ...reactTo,
      RangeSignalType.CREATED,
      RangeSignalType.ERROR,
    ];
  }

  private static reactToSeparator(): string[] {
    const {
      reactTo = [],
    } = Separator.disposition;
    return [
      ...reactTo,
      SeparatorSignalType.CREATED,
      SeparatorSignalType.ERROR,
    ];
  }

  private static reactToSlider(): string[] {
    const {
      reactTo = [],
    } = Slider.disposition;
    return [
      ...reactTo,
      SliderSignalType.CREATED,
      SliderSignalType.ERROR,
    ];
  }

  private static reactToStatus(): string[] {
    const {
      reactTo = [],
    } = Status.disposition;
    return [
      ...reactTo,
      StatusSignalType.CREATED,
      StatusSignalType.ERROR,
    ];
  }

  private static reactToSymbol(): string[] {
    const {
      reactTo = [],
    } = SymbolUca.disposition;
    return [
      ...reactTo,
      SymbolSignalType.CREATED,
      SymbolSignalType.ERROR,
    ];
  }

  private static reactToToast(): string[] {
    const {
      reactTo = [],
    } = Toast.disposition;
    return [
      ...reactTo,
      ToastSignalType.CREATED,
      ToastSignalType.ERROR,
    ];
  }

  private static reactToToggle(): string[] {
    const {
      reactTo = [],
    } = Toggle.disposition;
    return [
      ...reactTo,
      ToggleSignalType.CREATED,
      ToggleSignalType.ERROR,
    ];
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override catalog(): Cooky {
    const {
      components = [],
    } = this.body ?? {};
    const areaBox = this.catalogAreaBox();
    const llm = this.catalogLlm();
    const streamTransformer = this.catalogStreamTransformer();
    const webComponents = components.map((component) =>
      this.catalogComponent(component),
    );
    return [
      areaBox,
      llm,
      streamTransformer,
      ...webComponents,
    ];
  }

  private catalogAreaBox(): Cooky[number] {
    const {
      area,
    } = this.body ?? {};
    const {
      id = DEFAULT_AREA_ID,
      intention = Box.disposition.aim.description,
      purpose = Box.purpose,
      qualities,
    } = area ?? {};
    const disposition = this.createDisposition(
      Box.disposition,
      intention,
      `box${COMPONENT_SEPARATOR}${id}`,
      {
        elementId: id,
        intention,
        purpose,
        ...(qualities && {
          qualities,
        }),
      },
    );
    return [
      Box as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogComponent(component: Component): Cooky[number] {
    const {
      component: type,
      id,
      intention,
    } = component;
    const Factory = View.primitives[type];
    const extraBody = this.createComponentPayload(component);
    const disposition = this.createDisposition(
      Factory.disposition,
      intention,
      `${type}${COMPONENT_SEPARATOR}${id}`,
      extraBody,
    );
    return [
      Factory as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogLlm(): Cooky[number] {
    const {
      aim,
    } = Llm.disposition;
    const disposition = this.createDisposition(
      Llm.disposition,
      aim.description,
      'llm',
    );
    return [
      Llm as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogStreamTransformer(): Cooky[number] {
    const disposition = this.createDisposition(
      StreamTransformer.disposition,
      StreamTransformer.AIM,
      'stream-transformer',
    );
    return [
      StreamTransformer as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private handleUpdated(): void {
    const {
      source = this.id,
    } = this.body ?? {};
    switch (source) {
      case this.id:
        break;
      case `${this.id}:component`:
        this.handleComponentUpdated();
        break;
      case `${this.id}:stream-transformer`:
        this.handleStreamTransformerUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleBuild(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      area,
      siblingAreas,
      specification,
    } = this.extractPayload<Body>(value) ?? {};
    this.updateDispositionBody({
      area,
      components: [],
      logicUcas: [
        ...LOGIC_UCAS,
      ],
      pendingComponent: undefined,
      siblingAreas,
      source,
      specification,
      webUcas: [
        ...WEB_UCAS,
      ],
    });
  }

  private handleSelfUpdated(): void {
    const request = this.createInferRequest();
    this.pulse(LlmSignalType.INFER, request);
  }

  private createInferRequest(): InferPayload {
    const {
      area,
      logicUcas = LOGIC_UCAS,
      siblingAreas,
      specification,
      webUcas = WEB_UCAS,
    } = this.body ?? {};
    const {
      limits = [],
    } = specification ?? {};
    return {
      ...INFER_CONTRACT,
      limits: [
        ...DEFAULT_LIMITS,
        ...limits,
      ],
      context: {
        area,
        logicUcas,
        ...(siblingAreas?.length && {
          siblingAreas,
        }),
        specification,
        webUcas,
      },
      outputSchema: View.outputSchema,
    };
  }

  private handleLlmStreamed(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      request,
      stream,
    } = this.extractPayload<StreamResult>(value) ?? {};
    const {
      streamId,
    } = request ?? {};
    this.pulse(StreamTransformerSignalType.TRANSFORM, {
      mode: StreamTransformerMode.ITEMS,
      schema: componentSchema,
      stream,
      streamId,
    });
  }

  private async handleStreamTransformed(signal: Signal): Promise<void> {
    const {
      source,
      value,
    } = signal;
    const {
      stream,
    } = this.extractPayload<StreamTransformerResult<Component>>(value) ?? {};
    const writable = this.createComponentWritable();
    if (stream) {
      await stream.pipeTo(writable);
      this.updateDispositionBody({
        pendingComponent: undefined,
        source,
      });
    }
  }

  private createComponentWritable(): WritableStream<Component> {
    return new WritableStream<Component>({
      write: (component) => {
        this.hydrateComponent(component);
      },
    });
  }

  private hydrateComponent(component: Component): void {
    const {
      id,
    } = component;
    const {
      area,
    } = this.body ?? {};
    const {
      id: areaId = DEFAULT_AREA_ID,
    } = area ?? {};
    if (id === areaId) {
      this.hydrateAreaContainer(component);
    }
    else {
      this.hydrateChildComponent(component);
    }
  }

  private hydrateAreaContainer(component: Component): void {
    const updatedArea = this.resolveUpdatedArea(component);
    const {
      qualities,
    } = updatedArea;
    this.updateDispositionBody({
      area: updatedArea,
      pendingComponent: {
        ...component,
        component: 'box',
        qualities: qualities as Qualities,
      },
      source: `${this.id}:component`,
    });
  }

  private resolveUpdatedArea(component: Component): Area {
    const {
      intention,
      purpose,
      qualities,
    } = component;
    const {
      area: currentArea,
    } = this.body ?? {};
    const {
      id = DEFAULT_AREA_ID,
      purpose: currentPurpose,
      qualities: parentQualities,
    } = currentArea ?? {};
    const {
      flex,
      height,
      width,
    } = (parentQualities ?? {}) as Qualities;
    return {
      ...currentArea,
      id,
      intention,
      purpose: currentPurpose ?? purpose,
      qualities: {
        ...(parentQualities as Qualities),
        ...qualities,
        overflow: 'hidden',
        ...(flex && {
          flex,
        }),
        ...(height && {
          height,
        }),
        ...(width && {
          width,
        }),
      },
    };
  }

  private hydrateChildComponent(component: Component): void {
    const {
      qualities,
    } = component;
    const {
      components = [],
    } = this.body ?? {};
    const normalized: Component = {
      ...component,
      qualities: {
        ...qualities,
        ...(qualities.height === 'screen' && {
          height: 'auto',
        }),
      },
    };
    this.updateDispositionBody({
      components: [
        ...components,
        normalized,
      ],
      pendingComponent: normalized,
      source: `${this.id}:component`,
    });
  }

  private handleComponentUpdated(): void {
    const {
      area,
      pendingComponent,
    } = this.body ?? {};
    if (!pendingComponent) {
      return;
    }
    const {
      component: type,
      id,
    } = pendingComponent;
    const {
      id: areaId = DEFAULT_AREA_ID,
    } = area ?? {};
    const payload = id === areaId
      ? this.createAreaPayload(true)
      : this.createComponentPayload(pendingComponent);
    this.pulse(
      RENDER_SIGNALS[type],
      payload,
      `${this.id}:${type}${COMPONENT_SEPARATOR}${id}`,
    );
  }

  private createAreaPayload(skeleton: boolean): Record<string, unknown> {
    const {
      area,
    } = this.body ?? {};
    const {
      id = DEFAULT_AREA_ID,
      intention,
      purpose,
      qualities,
    } = area ?? {};
    return {
      elementId: id,
      intention,
      purpose,
      ...(qualities && {
        qualities,
      }),
      skeleton,
    };
  }

  private createComponentPayload(component: Component): Record<string, unknown> {
    const {
      id,
      intention,
      parentId,
      purpose,
      qualities,
    } = component;
    const {
      area,
      components = [],
    } = this.body ?? {};
    const {
      id: areaId = DEFAULT_AREA_ID,
    } = area ?? {};
    const isKnownParent = components.some(({
      id: renderedId,
    }) => renderedId === parentId && renderedId !== id);
    return {
      elementId: `${areaId}-${id}`,
      intention,
      parentTo: isKnownParent ? `${areaId}-${parentId}` : areaId,
      purpose,
      qualities,
    };
  }

  private handleStreamTransformerUpdated(): void {
    const {
      area,
    } = this.body ?? {};
    const {
      id: areaId = DEFAULT_AREA_ID,
    } = area ?? {};
    const payload = this.createAreaPayload(false);
    this.pulse(
      BoxSignalType.RENDER,
      payload,
      `${this.id}:box${COMPONENT_SEPARATOR}${areaId}`,
    );
  }

  private handlePrimitiveCreated(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      elementId,
      skeleton,
    } = this.extractPayload<BoxBody>(value) ?? {};
    const {
      area,
      components = [],
    } = this.body ?? {};
    const {
      id: areaId = DEFAULT_AREA_ID,
    } = area ?? {};
    if (source === `${this.id}:box${COMPONENT_SEPARATOR}${areaId}` && elementId === areaId && skeleton === false) {
      this.pulse(SignalType.BUILT, {
        areaId,
        components,
      });
    }
  }

  private handleStreamRecover(signal: Signal): void {
    const {
      value,
    } = signal;
    const recovery = this.extractPayload<StreamTransformerRecoveryRequest>(value);
    if (recovery) {
      const request = this.createComponentRepairRequest(recovery);
      this.pulse(LlmSignalType.INFER, request);
    }
  }

  private createComponentRepairRequest(
    recovery: StreamTransformerRecoveryRequest,
  ): InferPayload {
    const {
      requestId,
    } = recovery;
    const baseRequest = this.createInferRequest();
    const repairRequest = createRepairRequest(baseRequest, recovery);
    return {
      ...repairRequest,
      outputSchema: View.repairOutputSchema,
      streamId: requestId,
    };
  }

  private handlePrimitiveError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleLlmError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleStreamError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private updateDispositionBody(partial: Partial<Body>): void {
    const {
      aim,
    } = this.disposition;
    this.pulse(this.updateEvent, {
      ...this.disposition,
      aim: {
        ...aim,
        body: {
          ...this.body,
          ...partial,
        },
      },
    });
  }
}

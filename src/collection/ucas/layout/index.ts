import { z } from 'zod';
import { Box } from '@uca/box';
import {
  SignalType as BoxSignalType,
  type Body as BoxBody,
} from '@uca/box/types';
import { Llm } from '@uca/llm';
import {
  SignalType as LlmSignalType,
  type StreamResult,
} from '@uca/llm/types';
import { Material } from '@uca/capability-material';
import {
  SignalType as MaterialSignalType,
  type Dimensions,
  type MaterialModel,
} from '@uca/capability-material/types';
import { StreamTransformer } from '@uca/capability-stream-transformer';
import {
  Mode as StreamTransformerMode,
  SignalType as StreamTransformerSignalType,
  type RecoveryRequest as StreamTransformerRecoveryRequest,
  type TransformResult as StreamTransformerResult,
} from '@uca/capability-stream-transformer/types';
import { Uca } from '@uca/core/uca';
import {
  DispositionSignal,
  type CapabilityConstructor,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import {
  DEFAULT_INTENTION,
  DEFAULT_PURPOSE,
  INFER_CONTRACT,
  __ID__,
} from './constants.js';
import {
  areaCreatedSchema,
  areaSchema,
  bodySchema,
  builtResultSchema,
  compositionSchema,
  errorSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Area,
  type Body,
  type Design,
} from './types.js';

export class Layout extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  private static readonly outputSchema: Record<string, unknown> =
    z.toJSONSchema(compositionSchema);

  public static override disposition: Disposition<Body> = {
    aim: {
      description: DEFAULT_INTENTION,
      body: {},
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.BUILD,
      ...Layout.reactToBox(),
      ...Layout.reactToMaterial(),
      ...Layout.reactToLlm(),
      ...Layout.reactToStreamTransformer(),
    ],
    inputs: [
      {
        signal: DispositionSignal.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Continuar el flujo reactivo del layout tras actualizar su disposición',
        handler: Layout.prototype.handleUpdated,
      },
      {
        signal: SignalType.BUILD,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Construir las particiones espaciales de áreas del layout para el contenedor objetivo',
        handler: Layout.prototype.handleBuild,
      },
      {
        signal: BoxSignalType.CREATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Confirmación de contenedor o área hija materializada por Box en el DOM',
        handler: Layout.prototype.handleBoxCreated,
      },
      {
        signal: BoxSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la UCA Box durante el renderizado espacial',
        handler: Layout.prototype.handleBoxError,
      },
      {
        signal: MaterialSignalType.PROVIDED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Modelo espacial de Material Design 3 provisto para las dimensiones del contenedor',
        handler: Layout.prototype.handleMaterialProvided,
      },
      {
        signal: MaterialSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de Material Design 3',
        handler: Layout.prototype.handleMaterialError,
      },
      {
        signal: LlmSignalType.STREAMED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Stream de inferencia recibido desde la UCA de modelo de lenguaje',
        handler: Layout.prototype.handleLlmStreamed,
      },
      {
        signal: LlmSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la UCA de modelo de lenguaje',
        handler: Layout.prototype.handleLlmError,
      },
      {
        signal: StreamTransformerSignalType.TRANSFORMED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Stream de áreas transformado y validado progresivamente',
        handler: Layout.prototype.handleStreamTransformed,
      },
      {
        signal: StreamTransformerSignalType.RECOVER,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Solicitud de reparación de elemento del stream ante fallo de validación',
        handler: Layout.prototype.handleStreamRecover,
      },
      {
        signal: StreamTransformerSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido por la capacidad de transformación de stream',
        handler: Layout.prototype.handleStreamError,
      },
    ],
    outputs: [
      {
        signal: SignalType.AREA_CREATED,
        type: DataType.AREA_CREATED,
        schema: areaCreatedSchema,
        description: 'Contenedor de área hija montado en el DOM y listo para composición',
      },
      {
        signal: SignalType.BUILT,
        type: DataType.BUILT_RESULT,
        schema: builtResultSchema,
        description: 'Estructura de partición de áreas del layout completada',
      },
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorSchema,
        description: 'Error emitido durante la construcción del layout',
      },
    ],
  };

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

  private static reactToMaterial(): string[] {
    const {
      reactTo = [],
    } = Material.disposition;
    return [
      ...reactTo,
      MaterialSignalType.PROVIDED,
      MaterialSignalType.ERROR,
    ];
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

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override catalog(): Cooky {
    const box = this.catalogBox();
    const material = this.catalogMaterial();
    const llm = this.catalogLlm();
    const streamTransformer = this.catalogStreamTransformer();
    return [
      box,
      material,
      llm,
      streamTransformer,
    ];
  }

  private catalogBox(): Cooky[number] {
    const disposition = this.createDisposition(
      Box.disposition,
      Box.purpose,
      'box',
    );
    return [
      Box as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogMaterial(): Cooky[number] {
    const disposition = this.createDisposition(
      Material.disposition,
      Material.AIM,
      'material',
    );
    return [
      Material as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogLlm(): Cooky[number] {
    const disposition = this.createDisposition(
      Llm.disposition,
      Llm.purpose,
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
      case `${this.id}:box`:
        this.handleBoxUpdated();
        break;
      case `${this.id}:material`:
        this.handleMaterialUpdated();
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
    const body = this.resolveBuildBody(value);
    this.updateDispositionBody({
      ...body,
      areas: [],
      design: undefined,
      source,
    });
  }

  private resolveBuildBody(value: unknown): Body {
    const {
      area,
      specification,
    } = this.extractPayload<Body>(value) ?? {};
    const {
      intention: areaIntention,
    } = area ?? {};
    const {
      intention,
      interactiveFeatures,
      limits,
    } = specification ?? {};
    return {
      area,
      specification: {
        ...(!areaIntention && {
          intention,
        }),
        interactiveFeatures,
        limits,
      },
    };
  }

  private handleSelfUpdated(): void {
    const elementId = this.resolveTargetAreaId();
    this.pulse(BoxSignalType.RENDER, {
      elementId,
      skeleton: true,
    });
  }

  private handleBoxCreated(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      design,
    } = this.body ?? {};
    if (!design) {
      this.updateDispositionBody({
        source,
      });
    }
    else {
      this.emitCreatedArea(value);
    }
  }

  private emitCreatedArea(value: unknown): void {
    const {
      elementId,
    } = this.extractPayload<BoxBody>(value) ?? {};
    const {
      areas = [],
    } = this.body ?? {};
    const area = areas.find(({
      id,
    }) => id === elementId);
    if (area) {
      this.pulse(SignalType.AREA_CREATED, {
        area,
      });
    }
  }

  private handleBoxUpdated(): void {
    const dimensions = this.resolveAreaDimensions();
    this.pulse(MaterialSignalType.QUERY, {
      dimensions,
    });
  }

  private resolveTargetAreaId(): string {
    const {
      area,
    } = this.body ?? {};
    const {
      id = 'body',
    } = area ?? {};
    return id;
  }

  private resolveAreaDimensions(): Dimensions | undefined {
    const {
      area,
    } = this.body ?? {};
    const {
      dimensions,
    } = area ?? {};
    return dimensions;
  }

  private handleMaterialProvided(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const design = this.resolveDesign(value);
    this.updateDispositionBody({
      design,
      source,
    });
  }

  private resolveDesign(value: unknown): Design {
    const {
      canonicalLayouts,
      spatialPrinciples,
      windowSizeRule,
    } = this.extractPayload<MaterialModel>(value)!;
    return {
      canonicalLayouts,
      spatialPrinciples,
      windowSizeRule,
    };
  }

  private handleMaterialUpdated(): void {
    const request = this.createInferRequest();
    this.pulse(LlmSignalType.INFER, request);
  }

  private createInferRequest(): Record<string, unknown> {
    const {
      area,
      design,
      specification,
    } = this.body ?? {};
    return {
      ...INFER_CONTRACT,
      context: {
        area,
        design,
        specification,
      },
      outputSchema: Layout.outputSchema,
    };
  }

  private handleLlmStreamed(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      stream,
    } = this.extractPayload<StreamResult>(value) ?? {};
    this.pulse(StreamTransformerSignalType.TRANSFORM, {
      mode: StreamTransformerMode.ITEMS,
      schema: areaSchema,
      stream,
    });
  }

  private async handleStreamTransformed(signal: Signal): Promise<void> {
    const {
      source,
      value,
    } = signal;
    const {
      stream,
    } = this.extractPayload<StreamTransformerResult<Area>>(value) ?? {};
    const writable = this.createAreaWritable();
    if (stream) {
      await stream.pipeTo(writable);
      this.updateDispositionBody({
        source,
      });
    }
  }

  private createAreaWritable(): WritableStream<Area> {
    return new WritableStream<Area>({
      write: (area) => {
        this.renderArea(area);
      },
    });
  }

  private renderArea(area: Area): void {
    const {
      id: elementId,
      qualities,
    } = area;
    const targetId = this.resolveTargetAreaId();
    const isContainer = elementId === targetId;
    this.recordStreamedArea(area, isContainer);
    this.pulse(BoxSignalType.RENDER, {
      elementId,
      ...(!isContainer && {
        parentTo: targetId,
      }),
      qualities,
      skeleton: !isContainer,
    });
  }

  private recordStreamedArea(area: Area, isContainer: boolean): void {
    const {
      area: currentArea,
      areas = [],
    } = this.body ?? {};
    this.disposition = {
      ...this.disposition,
      aim: {
        ...this.disposition.aim,
        body: {
          ...this.body,
          area: isContainer ? {
            ...currentArea,
            ...area,
          } : currentArea,
          areas: isContainer ? areas : [
            ...areas,
            area,
          ],
        },
      },
    };
  }

  private handleStreamTransformerUpdated(): void {
    const {
      areas = [],
    } = this.body ?? {};
    const areaId = this.resolveTargetAreaId();
    this.pulse(SignalType.BUILT, {
      areaId,
      areas,
    });
  }

  private handleStreamRecover(signal: Signal): void {
    const {
      value,
    } = signal;
    const {
      error,
      requestId,
    } = this.extractPayload<StreamTransformerRecoveryRequest>(value) ?? {};
    this.pulse(StreamTransformerSignalType.REPAIR, {
      error,
      requestId,
    });
  }

  private handleBoxError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleMaterialError(signal: Signal): void {
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

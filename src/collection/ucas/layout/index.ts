import { z } from 'zod';
import { Box } from '@uca/box';
import {
  SignalType as BoxSignalType,
  type Body as BoxBody,
} from '@uca/box/types';
import { Llm } from '@uca/llm';
import { createRepairRequest } from '@uca/llm/recovery';
import {
  SignalType as LlmSignalType,
  type InferPayload,
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
  DEFAULT_LIMITS,
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
  repairCompositionSchema,
} from './schema.js';
import {
  DataType,
  SignalType,
  type Area,
  type Body,
  type Design,
  type Qualities,
} from './types.js';

export class Layout extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  private static readonly outputSchema: Record<string, unknown> =
    z.toJSONSchema(compositionSchema);

  private static readonly repairOutputSchema: Record<string, unknown> =
    z.toJSONSchema(repairCompositionSchema);

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
    const {
      aim,
    } = Box.disposition;
    const disposition = this.createDisposition(
      Box.disposition,
      aim.description,
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
      siblingAreas,
      specification,
    } = this.extractPayload<Body>(value) ?? {};
    return {
      area,
      siblingAreas,
      specification,
    };
  }

  private handleSelfUpdated(): void {
    const {
      area,
    } = this.body ?? {};
    const {
      id: elementId = 'body',
      intention,
      purpose,
      qualities,
    } = area ?? {};
    this.pulse(BoxSignalType.RENDER, {
      elementId,
      intention,
      purpose,
      qualities,
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
      this.syncContainerCreated(source, value);
    }
    else {
      this.emitCreatedArea(value);
    }
  }

  private syncContainerCreated(source: string, value: unknown): void {
    const {
      dimensions,
      elementId = this.id,
    } = this.extractPayload<BoxBody>(value) ?? {};
    const {
      area,
    } = this.body ?? {};
    this.updateDispositionBody({
      area: {
        id: elementId,
        ...area,
        ...(dimensions && {
          dimensions,
        }),
      },
      source,
    });
  }

  private emitCreatedArea(value: unknown): void {
    const {
      dimensions,
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
        area: {
          ...area,
          ...(dimensions && {
            dimensions,
          }),
        },
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

  private createInferRequest(): InferPayload {
    const {
      area,
      design,
      siblingAreas,
      specification,
    } = this.body ?? {};
    const {
      limits = [],
    } = specification ?? {};
    return {
      ...INFER_CONTRACT,
      limits: [
        ...DEFAULT_LIMITS,
        ...(Array.isArray(limits) ? (limits as string[]) : []),
      ],
      context: {
        area,
        design,
        ...(siblingAreas?.length && {
          siblingAreas,
        }),
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
      request,
      stream,
    } = this.extractPayload<StreamResult>(value) ?? {};
    const {
      streamId,
    } = request ?? {};
    this.pulse(StreamTransformerSignalType.TRANSFORM, {
      mode: StreamTransformerMode.ITEMS,
      schema: areaSchema,
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
      intention,
      purpose,
      qualities,
    } = area;
    const {
      area: currentArea,
    } = this.body ?? {};
    const targetId = this.resolveTargetAreaId();
    const isContainer = elementId === targetId;
    const mergedQualities = this.resolveAreaQualities(qualities, currentArea?.qualities, isContainer);
    this.recordStreamedArea({
      ...area,
      qualities: mergedQualities,
    }, isContainer);
    this.pulse(BoxSignalType.RENDER, {
      elementId,
      intention,
      ...(!isContainer && {
        parentTo: targetId,
      }),
      purpose: isContainer ? (currentArea?.purpose ?? purpose) : purpose,
      qualities: mergedQualities,
      skeleton: !isContainer,
    });
  }

  private resolveAreaQualities(
    qualities: Area['qualities'],
    parentQualities: Qualities,
    isContainer: boolean,
  ): Area['qualities'] {
    const {
      direction: parentDirection,
      flex,
      height,
      width,
    } = parentQualities ?? {};
    const isColumnChild = !isContainer && parentDirection === 'column';
    const isFullHeight = qualities.height === 'full' || qualities.height === 'screen';
    return {
      ...qualities,
      overflow: isContainer || qualities.overflow === 'visible' ? 'hidden' : qualities.overflow,
      ...(isColumnChild && isFullHeight && {
        height: qualities.flex === 'none' ? 'content' : 'auto',
      }),
      ...(isContainer && {
        ...(flex && {
          flex,
        }),
        ...(height && {
          height,
        }),
        ...(width && {
          width,
        }),
      }),
    };
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
            purpose: currentArea?.purpose ?? area.purpose,
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
    const recovery = this.extractPayload<StreamTransformerRecoveryRequest>(value);
    if (recovery) {
      const request = this.createAreaRepairRequest(recovery);
      this.pulse(LlmSignalType.INFER, request);
    }
  }

  private createAreaRepairRequest(
    recovery: StreamTransformerRecoveryRequest,
  ): InferPayload {
    const {
      requestId,
    } = recovery;
    const baseRequest = this.createInferRequest();
    const repairRequest = createRepairRequest(baseRequest, recovery);
    return {
      ...repairRequest,
      outputSchema: Layout.repairOutputSchema,
      streamId: requestId,
    };
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

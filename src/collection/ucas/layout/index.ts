import { z } from 'zod';
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
      ...Layout.reactToMaterial(),
      ...Layout.reactToLlm(),
      ...Layout.reactToStreamTransformer(),
    ],
    inputs: [
      {
        signal: SignalType.BUILD,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Construir las particiones espaciales de áreas del layout para el contenedor objetivo',
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

  protected override async react(signal: Signal): Promise<void> {
    const {
      property,
      source,
      value,
    } = signal;
    switch (property) {
      case DispositionSignal.UPDATED:
        this.handleUpdated();
        break;
      case SignalType.BUILD:
        this.handleBuild(value, source);
        break;
      case MaterialSignalType.PROVIDED:
        this.handleMaterialProvided(value, source);
        break;
      case MaterialSignalType.ERROR:
        this.handleMaterialError(value);
        break;
      case LlmSignalType.STREAMED:
        this.handleLlmStreamed(value as StreamResult);
        break;
      case LlmSignalType.ERROR:
        this.handleLlmError(value);
        break;
      case StreamTransformerSignalType.TRANSFORMED:
        await this.handleStreamTransformed(value as StreamTransformerResult<Area>);
        break;
      case StreamTransformerSignalType.RECOVER:
        this.handleStreamRecover(value as StreamTransformerRecoveryRequest);
        break;
      case StreamTransformerSignalType.ERROR:
        this.handleStreamError(value);
        break;
      default:
        break;
    }
  }

  protected override catalog(): Cooky {
    const material = this.catalogMaterial();
    const llm = this.catalogLlm();
    const streamTransformer = this.catalogStreamTransformer();
    return [
      material,
      llm,
      streamTransformer,
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
      case `${this.id}:material`:
        this.handleMaterialUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleBuild(value: unknown, source: string): void {
    const body = this.extractPayload<Body>(value);
    this.updateDispositionBody({
      ...body,
      areas: [],
      source,
    });
  }

  private handleSelfUpdated(): void {
    const dimensions = this.resolveAreaDimensions();
    this.pulse(MaterialSignalType.QUERY, {
      dimensions,
    });
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

  private handleMaterialProvided(value: unknown, source: string): void {
    const design = this.extractPayload<MaterialModel>(value);
    this.updateDispositionBody({
      design,
      source,
    });
  }

  private handleMaterialUpdated(): void {
    const request = this.createInferRequest();
    console.log('[Layout] Prompt de inferencia:', request);
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

  private handleLlmStreamed(result: StreamResult): void {
    const {
      stream,
    } = result;
    this.pulse(StreamTransformerSignalType.TRANSFORM, {
      mode: StreamTransformerMode.ITEMS,
      schema: areaSchema,
      stream,
    });
  }

  private async handleStreamTransformed(
    result: StreamTransformerResult<Area>,
  ): Promise<void> {
    const {
      stream,
    } = result;
    const transform = this.createAreaTransform();
    const writable = new WritableStream<Area>({
      write: (area) => {
        console.log('[Layout] Área recibida:', area);
      },
    });
    await stream.pipeThrough(transform).pipeTo(writable);
  }

  private createAreaTransform(): TransformStream<Area, Area> {
    return new TransformStream<Area, Area>({
      transform: (area, controller) => {
        controller.enqueue(area);
      },
    });
  }

  private handleStreamRecover(
    recovery: StreamTransformerRecoveryRequest,
  ): void {
    const {
      error,
      requestId,
    } = recovery;
    this.pulse(StreamTransformerSignalType.REPAIR, {
      error,
      requestId,
    });
  }

  private handleMaterialError(value: unknown): void {
    this.pulse(SignalType.ERROR, value);
  }

  private handleLlmError(value: unknown): void {
    this.pulse(SignalType.ERROR, value);
  }

  private handleStreamError(value: unknown): void {
    this.pulse(SignalType.ERROR, value);
  }

  private updateDispositionBody(partial: Partial<Body>): void {
    this.pulse(this.updateEvent, {
      ...this.disposition,
      aim: {
        description: DEFAULT_INTENTION,
        body: {
          ...this.body,
          ...partial,
        },
      },
    });
  }
}

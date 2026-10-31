import { Browser } from '@uca/capability-browser';
import {
  SignalType as BrowserSignalType,
  type BrowserContext,
} from '@uca/capability-browser/types';
import { Specification as SpecificationCapability } from '@uca/capability-specification';
import {
  SignalType as SpecificationSignalType,
  type SpecificationModel,
} from '@uca/capability-specification/types';
import { Decision } from '@uca/decision';
import {
  SignalType as DecisionSignalType,
  type Result as DecisionResult,
} from '@uca/decision/types';
import { Layout } from '@uca/layout';
import {
  SignalType as LayoutSignalType,
  type AreaCreated,
} from '@uca/layout/types';
import { View } from '@uca/view';
import { SignalType as ViewSignalType } from '@uca/view/types';
import { Uca } from '@uca/core/uca';
import {
  DispositionSignal,
  type CapabilityConstructor,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import {
  AREA_DECISION_QUESTION,
  AREA_SEPARATOR,
  BUILD_SIGNALS,
  CHOICE_ROLES,
  DEFAULT_INTENTION,
  DEFAULT_PURPOSE,
  DEFAULT_ROOT_AREA,
  DEFAULT_URL,
  MAXIMUM_DEPTH,
  ROOT_DECISION_QUESTION,
  __ID__,
} from './constants.js';
import {
  bodySchema,
  choiceSchema,
  composeRequestSchema,
  errorPayloadSchema,
} from './schema.js';
import {
  DataType,
  Role,
  SignalType,
  type AreaTarget,
  type Body,
  type Choice,
  type ComposeRequest,
} from './types.js';

export class Composition extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  private static readonly builders = {
    LAYOUT: Layout,
    VIEW: View,
  } as const;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: DEFAULT_INTENTION,
      body: {
        area: DEFAULT_ROOT_AREA,
        url: DEFAULT_URL,
      },
    },
    reactTo: [
      DispositionSignal.UPDATED,
      SignalType.COMPOSE,
      ...Composition.reactToBrowser(),
      ...Composition.reactToSpecification(),
      ...Composition.reactToDecision(),
      ...Composition.reactToLayout(),
      ...Composition.reactToView(),
    ],
    inputs: [
      {
        signal: DispositionSignal.UPDATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Continuar el flujo reactivo de la composición tras actualizar su disposición',
        handler: Composition.prototype.handleUpdated,
      },
      {
        signal: SignalType.COMPOSE,
        type: DataType.COMPOSE_REQUEST,
        schema: composeRequestSchema,
        description: 'Analizar la especificación y componer el área objetivo como Layout o View',
        handler: Composition.prototype.handleCompose,
      },
      {
        signal: BrowserSignalType.DETECTED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Contexto real del navegador y viewport detectado',
        handler: Composition.prototype.handleBrowserDetected,
      },
      {
        signal: SpecificationSignalType.PROVIDED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Especificación funcional y experiencial del sistema',
        handler: Composition.prototype.handleSpecificationProvided,
      },
      {
        signal: SpecificationSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorPayloadSchema,
        description: 'Error emitido por la capacidad de especificación',
        handler: Composition.prototype.handleSpecificationError,
      },
      {
        signal: DecisionSignalType.DECIDED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Decisión probabilística LAYOUT o VIEW para un área',
        handler: Composition.prototype.handleDecisionDecided,
      },
      {
        signal: DecisionSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorPayloadSchema,
        description: 'Error emitido por la UCA de decisión',
        handler: Composition.prototype.handleDecisionError,
      },
      {
        signal: LayoutSignalType.AREA_CREATED,
        type: DataType.BODY,
        schema: bodySchema,
        description: 'Área hija montada por un Layout y lista para componerse',
        handler: Composition.prototype.handleLayoutAreaCreated,
      },
      {
        signal: LayoutSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorPayloadSchema,
        description: 'Error emitido por un Layout de área',
        handler: Composition.prototype.handleLayoutError,
      },
      {
        signal: ViewSignalType.ERROR,
        type: DataType.ERROR,
        schema: errorPayloadSchema,
        description: 'Error emitido por una View de área',
        handler: Composition.prototype.handleViewError,
      },
    ],
    outputs: [
      {
        signal: SignalType.ERROR,
        type: DataType.ERROR,
        schema: errorPayloadSchema,
        description: 'Error emitido durante la consulta de la especificación o la composición de áreas',
      },
    ],
  };

  private static reactToBrowser(): string[] {
    const {
      reactTo = [],
    } = Browser.disposition;
    return [
      ...reactTo,
      BrowserSignalType.DETECTED,
    ];
  }

  private static reactToSpecification(): string[] {
    const {
      reactTo = [],
    } = SpecificationCapability.disposition;
    return [
      ...reactTo,
      SpecificationSignalType.PROVIDED,
      SpecificationSignalType.ERROR,
    ];
  }

  private static reactToDecision(): string[] {
    const {
      reactTo = [],
    } = Decision.disposition;
    return [
      ...reactTo,
      DecisionSignalType.DECIDED,
      DecisionSignalType.ERROR,
    ];
  }

  private static reactToLayout(): string[] {
    const {
      reactTo = [],
    } = Layout.disposition;
    return [
      ...reactTo,
      LayoutSignalType.AREA_CREATED,
      LayoutSignalType.ERROR,
    ];
  }

  private static reactToView(): string[] {
    const {
      reactTo = [],
    } = View.disposition;
    return [
      ...reactTo,
      ViewSignalType.ERROR,
    ];
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override catalog(): Cooky {
    const {
      areas = [],
    } = this.body ?? {};
    const browser = this.catalogBrowser();
    const specification = this.catalogSpecification();
    const decisions = areas.map(({
      area,
    }) => this.catalogDecision(area));
    const builders = areas.flatMap(({
      area,
      choice,
    }) => (choice ? [this.catalogBuilder(area, choice)] : []));
    return [
      browser,
      specification,
      ...decisions,
      ...builders,
    ];
  }

  private catalogBrowser(): Cooky[number] {
    const disposition = this.createDisposition(
      Browser.disposition,
      Browser.AIM,
      Role.BROWSER,
    );
    return [
      Browser as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogSpecification(): Cooky[number] {
    const disposition = this.createDisposition(
      SpecificationCapability.disposition,
      SpecificationCapability.AIM,
      Role.SPECIFICATION,
    );
    return [
      SpecificationCapability as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogDecision(area: AreaTarget): Cooky[number] {
    const {
      id,
    } = area;
    const {
      aim,
    } = Decision.disposition;
    const disposition = this.createDisposition(
      Decision.disposition,
      aim.description,
      `${Role.DECISION}${AREA_SEPARATOR}${id}`,
    );
    return [
      Decision as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogBuilder(area: AreaTarget, choice: Choice): Cooky[number] {
    const {
      id,
    } = area;
    const Builder = Composition.builders[choice];
    const {
      aim,
    } = Builder.disposition;
    const disposition = this.createDisposition(
      Builder.disposition as Disposition,
      aim.description,
      `${CHOICE_ROLES[choice]}${AREA_SEPARATOR}${id}`,
    );
    return [
      Builder as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private handleUpdated(): void {
    const {
      source = this.id,
    } = this.body ?? {};
    const {
      role,
    } = this.resolveSourceRoute(source);
    switch (role) {
      case Role.SELF:
        break;
      case Role.BROWSER:
        this.handleBrowserUpdated();
        break;
      case Role.SPECIFICATION:
        this.handleSpecificationUpdated();
        break;
      case Role.DECISION:
        this.handleDecisionUpdated();
        break;
      case Role.LAYOUT:
        this.handleLayoutUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleCompose(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      area = DEFAULT_ROOT_AREA,
      url = DEFAULT_URL,
    } = this.extractPayload<ComposeRequest>(value) ?? {};
    this.updateDispositionBody({
      area,
      areas: [],
      source,
      url,
    });
  }

  private handleSelfUpdated(): void {
    this.pulse(BrowserSignalType.DETECT, {});
  }

  private handleBrowserDetected(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const context = this.extractPayload<BrowserContext>(value);
    const area = this.resolveAreaWithDimensions(context);
    this.updateDispositionBody({
      area,
      browser: context as unknown as Record<string, unknown>,
      source,
    });
  }

  private resolveAreaWithDimensions(context?: BrowserContext): AreaTarget {
    const {
      area = DEFAULT_ROOT_AREA,
    } = this.body ?? {};
    const {
      dimensions,
    } = area;
    const {
      viewport,
    } = context ?? {};
    return {
      ...area,
      dimensions: dimensions ?? (viewport as unknown as Record<string, unknown>),
    };
  }

  private handleBrowserUpdated(): void {
    this.pulse(SpecificationSignalType.QUERY, {});
  }

  private handleSpecificationProvided(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const specification = this.extractPayload<SpecificationModel>(value);
    const {
      area = DEFAULT_ROOT_AREA,
    } = this.body ?? {};
    this.updateDispositionBody({
      areas: [
        {
          area,
          depth: 0,
        },
      ],
      source,
      specification,
    });
  }

  private handleSpecificationUpdated(): void {
    const {
      areas = [],
    } = this.body ?? {};
    const [root] = areas;
    if (root) {
      const {
        area,
      } = root;
      this.dispatchDecision(area);
    }
  }

  private handleDecisionDecided(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      result,
    } = this.extractPayload<DecisionResult>(value) ?? {};
    const {
      choice,
    } = result ?? {};
    const {
      areaId,
    } = this.resolveSourceRoute(source);
    const {
      areas = [],
    } = this.body ?? {};
    const decided = areas.map((entry) => {
      const {
        area: {
          id,
        },
      } = entry;
      return id === areaId ? {
        ...entry,
        choice: choice as Choice,
      } : entry;
    });
    this.updateDispositionBody({
      areas: decided,
      source,
    });
  }

  private handleDecisionUpdated(): void {
    const {
      areas = [],
      source = this.id,
    } = this.body ?? {};
    const {
      areaId,
    } = this.resolveSourceRoute(source);
    const {
      area,
      choice,
    } = areas.find(({
      area: {
        id,
      },
    }) => id === areaId) ?? {};
    if (area && choice) {
      this.dispatchBuild(area, choice);
    }
  }

  private handleLayoutAreaCreated(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const {
      area,
    } = this.extractPayload<AreaCreated>(value) ?? {};
    const {
      areaId: parentId,
    } = this.resolveSourceRoute(source);
    const {
      areas = [],
    } = this.body ?? {};
    const {
      depth: parentDepth = 0,
    } = areas.find(({
      area: {
        id,
      },
    }) => id === parentId) ?? {};
    const depth = parentDepth + 1;
    if (area) {
      this.updateDispositionBody({
        areas: [
          ...areas,
          {
            area: {
              ...area,
              parentId,
            },
            depth,
            parentId,
            ...(depth >= MAXIMUM_DEPTH && {
              choice: choiceSchema.enum.VIEW,
            }),
          },
        ],
        source,
      });
    }
  }

  private handleLayoutUpdated(): void {
    const {
      areas = [],
    } = this.body ?? {};
    const {
      area,
      choice,
      parentId,
    } = areas.at(-1) ?? {};
    if (area && choice) {
      this.dispatchBuild(area, choice);
    }
    else if (area) {
      this.dispatchDecision(area, parentId);
    }
  }

  private dispatchDecision(area: AreaTarget, parentId?: string): void {
    const {
      id,
    } = area;
    const context = this.createDecisionContext(area);
    this.pulse(DecisionSignalType.DECIDE, {
      context,
      question: parentId ? AREA_DECISION_QUESTION : ROOT_DECISION_QUESTION,
    }, `${this.id}:${Role.DECISION}${AREA_SEPARATOR}${id}`);
  }

  private createDecisionContext(area: AreaTarget): Record<string, unknown> {
    const {
      dimensions,
      intention,
      purpose,
    } = area;
    const {
      browser,
      specification,
    } = this.body ?? {};
    const {
      intention: specificationIntention,
      limits,
      purpose: specificationPurpose,
    } = specification ?? {};
    return {
      purpose: purpose ?? specificationPurpose,
      intention: intention ?? specificationIntention,
      browser: dimensions ?? browser,
      limits,
    };
  }

  private dispatchBuild(area: AreaTarget, choice: Choice): void {
    const {
      id,
      parentId,
    } = area;
    const {
      specification,
    } = this.body ?? {};
    const siblingAreas = this.resolveSiblingAreas(id, parentId);
    this.pulse(BUILD_SIGNALS[choice], {
      area,
      siblingAreas,
      specification,
    }, `${this.id}:${CHOICE_ROLES[choice]}${AREA_SEPARATOR}${id}`);
  }

  private resolveSiblingAreas(
    targetId: string,
    targetParentId?: string,
  ): AreaTarget[] {
    const {
      areas = [],
    } = this.body ?? {};
    return areas
      .filter(({
        area: {
          id,
        },
        parentId,
      }) => id !== targetId && parentId === targetParentId)
      .map(({
        area,
      }) => area);
  }

  private resolveSourceRoute(source: string): { role?: string; areaId?: string } {
    const prefix = `${this.id}:`;
    const [role, areaId] = source.startsWith(prefix)
      ? source.slice(prefix.length).split(AREA_SEPARATOR)
      : [];
    return {
      areaId,
      role: source === this.id ? Role.SELF : role,
    };
  }

  private handleSpecificationError(signal: Signal): void {
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

  private handleLayoutError(signal: Signal): void {
    const {
      value,
    } = signal;
    this.pulse(SignalType.ERROR, value);
  }

  private handleViewError(signal: Signal): void {
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

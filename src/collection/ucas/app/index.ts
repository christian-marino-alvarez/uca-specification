import { Navigate } from '@uca/navigate';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { Composition } from '@uca/composition';
import { SignalType as CompositionSignalType } from '@uca/composition/types';
import { composeRequestSchema } from '@uca/composition/schema';
import { Telemetry } from '@uca/capability-telemetry';
import { Session as SessionCapability } from '@uca/capability-session';
import {
  SignalType as SessionSignalType,
  type Session,
} from '@uca/capability-session/types';
import { Uca } from '@uca/core/uca';
import {
  DispositionSignal,
  type CapabilityConstructor,
  type Cooky,
  type Disposition,
  type Signal,
} from '@uca/core/types';
import {
  DEFAULT_AIM_BODY,
  DEFAULT_AIM_DESCRIPTION,
  DEFAULT_PAGE,
  DEFAULT_PURPOSE,
  TELEMETRY_OBSERVED_SIGNALS,
  __ID__,
} from './constants.js';
import {
  DataType,
  type Body,
} from './types.js';

export class App extends Uca<Body> {
  public static override purpose: string = DEFAULT_PURPOSE;

  public static override disposition: Disposition<Body> = {
    aim: {
      description: DEFAULT_AIM_DESCRIPTION,
      body: {
        ...DEFAULT_AIM_BODY,
      },
    },
    reactTo: [
      DispositionSignal.INNERVATED,
      DispositionSignal.UPDATED,
      ...App.reactToSession(),
      ...App.reactToNavigate(),
      ...App.reactToComposition(),
    ],
    inputs: [
      {
        signal: DispositionSignal.INNERVATED,
        type: DataType.VOID,
        description: 'Señal de ciclo de vida del Core emitida tras la inervación',
      },
    ],
    outputs: [
      {
        signal: DispositionSignal.INNERVATED,
        type: DataType.BODY,
        description: 'Señal de ciclo de vida del Core emitida tras la inervación',
      },
      {
        signal: CompositionSignalType.COMPOSE,
        type: DataType.COMPOSE_REQUEST,
        schema: composeRequestSchema,
        description: 'Delegar la composición cognitiva para la página activa',
      },
      {
        signal: DataType.ERROR,
        type: DataType.ERROR,
        description: 'Error emitido durante la ejecución de la aplicación',
      },
    ],
  };

  private static reactToComposition(): string[] {
    const {
      reactTo = [],
    } = Composition.disposition;
    return [
      ...reactTo,
    ];
  }

  private static reactToSession(): string[] {
    const {
      reactTo = [],
    } = SessionCapability.disposition;
    return [
      ...reactTo,
      SessionSignalType.RETRIEVED,
      SessionSignalType.CREATED,
      SessionSignalType.DELETED,
    ];
  }

  private static reactToNavigate(): string[] {
    const {
      reactTo = [],
    } = Navigate.disposition;
    return [
      ...reactTo,
      NavigateSignalType.CHANGED,
    ];
  }

  private static createTelemetryExtraBody(): Record<string, unknown> {
    return {
      filter: [
        ...TELEMETRY_OBSERVED_SIGNALS,
      ],
    };
  }

  public constructor(id: string = __ID__) {
    super(id);
  }

  protected override react(signal: Signal): void {
    const {
      property,
    } = signal;
    switch (property) {
      case DispositionSignal.INNERVATED:
        this.handleInnervated();
        break;
      case DispositionSignal.UPDATED:
        this.handleUpdated();
        break;
      case SessionSignalType.RETRIEVED:
        this.handleSessionRetrieved(signal);
        break;
      case SessionSignalType.CREATED:
        this.handleSessionCreated(signal);
        break;
      case NavigateSignalType.CHANGED:
        this.handleNavigateChanged(signal);
        break;
      default:
        break;
    }
  }

  protected override catalog(): Cooky {
    return [
      this.catalogTelemetry(),
      this.catalogSession(),
      this.catalogNavigate(),
      this.catalogComposition(),
    ];
  }

  private catalogComposition(): Cooky[number] {
    const {
      aim,
    } = Composition.disposition;
    const disposition = this.createDisposition(
      Composition.disposition,
      aim.description,
      'composition',
    );
    return [
      Composition as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogSession(): Cooky[number] {
    const disposition = this.createDisposition(
      SessionCapability.disposition,
      SessionCapability.AIM,
      'session',
    );
    return [
      SessionCapability as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogTelemetry(): Cooky[number] {
    const extraBody = App.createTelemetryExtraBody();
    const disposition = this.createDisposition(
      Telemetry.disposition,
      Telemetry.AIM,
      'telemetry',
      extraBody,
    );
    return [
      Telemetry as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private catalogNavigate(): Cooky[number] {
    const extra = this.createNavigateExtraBody();
    const {
      aim,
    } = Navigate.disposition;
    const disposition = this.createDisposition(
      Navigate.disposition,
      aim.description,
      'navigate',
      extra,
    );
    return [
      Navigate as unknown as CapabilityConstructor,
      disposition,
    ];
  }

  private createNavigateExtraBody(): Record<string, unknown> {
    const {
      activePage = DEFAULT_PAGE,
    } = this.body ?? {};
    return {
      url: activePage,
    };
  }

  private handleInnervated(): void {
    this.pulse(SessionSignalType.GET, {});
  }

  private handleUpdated(): void {
    const {
      source = this.id,
    } = this.body ?? {};
    switch (source) {
      case `${this.id}:navigate`:
        this.handleNavigateUpdated();
        break;
      case `${this.id}:session`:
        this.handleSessionUpdated();
        break;
      default:
        this.handleSelfUpdated();
        break;
    }
  }

  private handleNavigateUpdated(): void {
    const {
      activePage,
    } = this.body ?? {};
    if (activePage) {
      this.pulse(CompositionSignalType.COMPOSE, {
        url: activePage,
      });
    }
  }

  private handleSessionUpdated(): void {
    console.log('[App] Session established');
  }

  private handleSelfUpdated(): void {
    console.log('[App] Self disposition updated:', this.body);
  }

  private handleSessionRetrieved(signal: Signal): void {
    const {
      value,
    } = signal;
    if (value) {
      this.handleSessionCreated(signal);
    }
    else {
      this.pulse(SessionSignalType.CREATE, {});
    }
  }

  private handleSessionCreated(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const session = this.extractPayload<Session>(value);
    this.applySession(session, source);
  }

  private handleNavigateChanged(signal: Signal): void {
    const {
      source,
      value,
    } = signal;
    const activePage = this.extractNavigateUrl(value);
    this.updateDispositionBody({
      activePage,
      source,
    });
  }

  private extractNavigateUrl(value: unknown): string {
    const {
      url = DEFAULT_PAGE,
    } = this.extractPayload<{ url?: string }>(value) ?? {};
    return url;
  }

  private applySession(session?: Session | null, source?: string): void {
    const {
      id = '',
    } = session ?? {};
    if (source) {
      this.updateDispositionBody({
        source,
      });
    }
    this.initNavigation(id);
  }

  private initNavigation(sessionId?: string): void {
    if (sessionId) {
      this.pulse(NavigateSignalType.INIT, {
        url: DEFAULT_PAGE,
      });
    }
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
          ...aim.body,
          ...partial,
        },
      },
    });
  }
}

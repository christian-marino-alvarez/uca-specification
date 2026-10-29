import { DispositionSignal } from '@uca/core/types';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { SignalType as SessionSignalType } from '@uca/capability-session/types';
import { SignalType as MemorySignalType } from '@uca/capability-memory/types';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { SignalType as CompositionSignalType } from '@uca/composition/types';
import { SignalType as SpecificationSignalType } from '@uca/capability-specification/types';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { SignalType as LayoutSignalType } from '@uca/layout/types';
import { SignalType as MaterialSignalType } from '@uca/capability-material/types';
import { SignalType as LlmSignalType } from '@uca/llm/types';
import { SignalType as StreamTransformerSignalType } from '@uca/capability-stream-transformer/types';
import { SignalType as SkeletonSignalType } from '@uca/capability-skeleton/types';
import { SignalType as BoxSignalType } from '@uca/box/types';

export const __ID__ = 'app';

export const TELEMETRY_OBSERVED_SIGNALS = [
  DispositionSignal.INNERVATED,
  DispositionSignal.UPDATED,
  BrowserSignalType.DETECT,
  BrowserSignalType.DETECTED,
  BrowserSignalType.CHANGED,
  SessionSignalType.GET,
  SessionSignalType.RETRIEVED,
  SessionSignalType.CREATE,
  SessionSignalType.CREATED,
  NavigateSignalType.INIT,
  NavigateSignalType.GO,
  NavigateSignalType.CHANGED,
  NavigateSignalType.DESTROY,
  MemorySignalType.GET,
  MemorySignalType.SET,
  MemorySignalType.CLEAR,
  MemorySignalType.RETRIEVED,
  MemorySignalType.SAVED,
  MemorySignalType.CLEARED,
  CompositionSignalType.COMPOSE,
  CompositionSignalType.ERROR,
  SpecificationSignalType.QUERY,
  SpecificationSignalType.PROVIDED,
  SpecificationSignalType.ERROR,
  DecisionSignalType.DECIDE,
  DecisionSignalType.DECIDED,
  DecisionSignalType.ERROR,
  LayoutSignalType.BUILD,
  LayoutSignalType.AREA_CREATED,
  LayoutSignalType.BUILT,
  LayoutSignalType.ERROR,
  MaterialSignalType.QUERY,
  MaterialSignalType.PROVIDED,
  MaterialSignalType.ERROR,
  LlmSignalType.INFER,
  LlmSignalType.INFERRED,
  LlmSignalType.STREAM,
  LlmSignalType.STREAMED,
  LlmSignalType.STREAM_END,
  LlmSignalType.ERROR,
  StreamTransformerSignalType.TRANSFORM,
  StreamTransformerSignalType.TRANSFORMED,
  StreamTransformerSignalType.ERROR,
  SkeletonSignalType.SHOW,
  SkeletonSignalType.SHOWN,
  SkeletonSignalType.REMOVE,
  SkeletonSignalType.REMOVED,
  SkeletonSignalType.ERROR,
  BoxSignalType.RENDER,
  BoxSignalType.UPDATE,
  BoxSignalType.CREATED,
  BoxSignalType.UPDATED,
  BoxSignalType.ERROR,
] as const;

export const DEFAULT_PAGE = '/';

export const DEFAULT_PURPOSE =
  'Orquestar el ciclo de vida de la aplicación coordinando sesión, navegación y composición cognitiva';

export const DEFAULT_AIM_DESCRIPTION =
  'Inicializar la sesión activa, sincronizar el estado de navegación y delegar la composición de la ruta activa';

export const DEFAULT_AIM_BODY = {
  activePage: DEFAULT_PAGE,
} as const;

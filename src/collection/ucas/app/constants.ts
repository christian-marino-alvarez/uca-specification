import { DispositionSignal } from '@uca/core/types';
import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { SignalType as SessionSignalType } from '@uca/capability-session/types';
import { SignalType as MemorySignalType } from '@uca/capability-memory/types';
import { SignalType as NavigateSignalType } from '@uca/navigate/types';
import { SignalType as CompositionSignalType } from '@uca/composition/types';
import { SignalType as SpecificationSignalType } from '@uca/capability-specification/types';
import { SignalType as DecisionSignalType } from '@uca/decision/types';
import { SignalType as LayoutSignalType } from '@uca/layout/types';
import { SignalType as ViewSignalType } from '@uca/view/types';
import { SignalType as MaterialSignalType } from '@uca/capability-material/types';
import { SignalType as LlmSignalType } from '@uca/llm/types';
import { SignalType as StreamTransformerSignalType } from '@uca/capability-stream-transformer/types';
import { SignalType as SkeletonSignalType } from '@uca/capability-skeleton/types';
import { SignalType as AccessSignalType } from '@uca/access/types';
import { SignalType as ActionSignalType } from '@uca/action/types';
import { SignalType as BoxSignalType } from '@uca/box/types';
import { SignalType as CardSignalType } from '@uca/card/types';
import { SignalType as ChipSignalType } from '@uca/chip/types';
import { SignalType as ChoiceSignalType } from '@uca/choice/types';
import { SignalType as DialogSignalType } from '@uca/dialog/types';
import { SignalType as HeadingSignalType } from '@uca/heading/types';
import { SignalType as InputSignalType } from '@uca/input/types';
import { SignalType as ListSignalType } from '@uca/list/types';
import { SignalType as MomentSignalType } from '@uca/moment/types';
import { SignalType as ParagraphSignalType } from '@uca/paragraph/types';
import { SignalType as PictureSignalType } from '@uca/picture/types';
import { SignalType as ProgressSignalType } from '@uca/progress/types';
import { SignalType as QuantitySignalType } from '@uca/quantity/types';
import { SignalType as RangeSignalType } from '@uca/range/types';
import { SignalType as SeparatorSignalType } from '@uca/separator/types';
import { SignalType as SliderSignalType } from '@uca/slider/types';
import { SignalType as StatusSignalType } from '@uca/status/types';
import { SignalType as SymbolSignalType } from '@uca/symbol/types';
import { SignalType as ToastSignalType } from '@uca/toast/types';
import { SignalType as ToggleSignalType } from '@uca/toggle/types';

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
  ViewSignalType.BUILD,
  ViewSignalType.BUILT,
  ViewSignalType.ERROR,
  MaterialSignalType.QUERY,
  MaterialSignalType.PROVIDED,
  MaterialSignalType.RESOLVE,
  MaterialSignalType.RESOLVED,
  MaterialSignalType.ERROR,
  LlmSignalType.INFER,
  LlmSignalType.INFERRED,
  LlmSignalType.STREAM,
  LlmSignalType.STREAMED,
  LlmSignalType.STREAM_END,
  LlmSignalType.ERROR,
  StreamTransformerSignalType.TRANSFORM,
  StreamTransformerSignalType.TRANSFORMED,
  StreamTransformerSignalType.RECOVER,
  StreamTransformerSignalType.REPAIR,
  StreamTransformerSignalType.ERROR,
  SkeletonSignalType.SHOW,
  SkeletonSignalType.SHOWN,
  SkeletonSignalType.REMOVE,
  SkeletonSignalType.REMOVED,
  SkeletonSignalType.ERROR,
  AccessSignalType.RENDER,
  AccessSignalType.CREATED,
  AccessSignalType.ERROR,
  ActionSignalType.RENDER,
  ActionSignalType.CREATED,
  ActionSignalType.ERROR,
  BoxSignalType.RENDER,
  BoxSignalType.UPDATE,
  BoxSignalType.CREATED,
  BoxSignalType.UPDATED,
  BoxSignalType.ERROR,
  CardSignalType.RENDER,
  CardSignalType.CREATED,
  CardSignalType.ERROR,
  ChipSignalType.RENDER,
  ChipSignalType.CREATED,
  ChipSignalType.ERROR,
  ChoiceSignalType.RENDER,
  ChoiceSignalType.CREATED,
  ChoiceSignalType.ERROR,
  DialogSignalType.RENDER,
  DialogSignalType.CREATED,
  DialogSignalType.ERROR,
  HeadingSignalType.RENDER,
  HeadingSignalType.CREATED,
  HeadingSignalType.ERROR,
  InputSignalType.RENDER,
  InputSignalType.CREATED,
  InputSignalType.ERROR,
  ListSignalType.RENDER,
  ListSignalType.CREATED,
  ListSignalType.ERROR,
  MomentSignalType.RENDER,
  MomentSignalType.CREATED,
  MomentSignalType.ERROR,
  ParagraphSignalType.RENDER,
  ParagraphSignalType.CREATED,
  ParagraphSignalType.ERROR,
  PictureSignalType.RENDER,
  PictureSignalType.CREATED,
  PictureSignalType.ERROR,
  ProgressSignalType.RENDER,
  ProgressSignalType.CREATED,
  ProgressSignalType.ERROR,
  QuantitySignalType.RENDER,
  QuantitySignalType.CREATED,
  QuantitySignalType.ERROR,
  RangeSignalType.RENDER,
  RangeSignalType.CREATED,
  RangeSignalType.ERROR,
  SeparatorSignalType.RENDER,
  SeparatorSignalType.CREATED,
  SeparatorSignalType.ERROR,
  SliderSignalType.RENDER,
  SliderSignalType.CREATED,
  SliderSignalType.ERROR,
  StatusSignalType.RENDER,
  StatusSignalType.CREATED,
  StatusSignalType.ERROR,
  SymbolSignalType.RENDER,
  SymbolSignalType.CREATED,
  SymbolSignalType.ERROR,
  ToastSignalType.RENDER,
  ToastSignalType.CREATED,
  ToastSignalType.ERROR,
  ToggleSignalType.RENDER,
  ToggleSignalType.CREATED,
  ToggleSignalType.ERROR,
] as const;

export const DEFAULT_PAGE = '/';

export const DEFAULT_PURPOSE =
  'Orquestar el ciclo de vida de la aplicación coordinando sesión, navegación y composición cognitiva';

export const DEFAULT_AIM_DESCRIPTION =
  'Inicializar la sesión activa, sincronizar el estado de navegación y delegar la composición de la ruta activa';

export const DEFAULT_AIM_BODY = {
  activePage: DEFAULT_PAGE,
} as const;

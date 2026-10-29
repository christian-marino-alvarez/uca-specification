import { DispositionSignal } from '@uca/core/types';
import { SignalType as SessionSignalType } from '@uca/capability-session/types';

export const __ID__ = 'telemetry';

export const DEFAULT_AIM =
  'Detectar, trazar y registrar las señales de sesión y del ciclo de vida de la aplicación en el bus reactivo';

export const INTERCEPTED_SIGNALS = [
  '*',
] as const;

export const DEFAULT_FILTER = [
  DispositionSignal.INNERVATED,
  DispositionSignal.DENERVATED,
  SessionSignalType.GET,
  SessionSignalType.RETRIEVED,
  SessionSignalType.CREATE,
  SessionSignalType.CREATED,
] as const;

export const SOURCE_COLORS: Readonly<Record<string, string>> = {
  app: '#0284C7',
  'app:composition': '#0D9488',
  'app:composition:browser': '#0891B2',
  'app:composition:decision': '#DB2777',
  'app:composition:decision:llm': '#4F46E5',
  'app:composition:layout': '#059669',
  'app:composition:layout:box': '#EA580C',
  'app:composition:layout:llm': '#4F46E5',
  'app:composition:layout:material': '#D97706',
  'app:composition:layout:skeleton': '#0284C7',
  'app:composition:layout:stream-transformer': '#7C3AED',
  'app:composition:specification': '#8B5CF6',
  'app:navigate': '#E11D48',
  'app:navigate:history': '#7C3AED',
  'app:navigate:memory': '#D97706',
  'app:session': '#059669',
  'app:specification': '#8B5CF6',
  server: '#4F46E5',
  'server:http-server': '#0891B2',
  'server:logger': '#475569',
  'server:jev': '#DB2777',
  'server:gemini': '#9333EA',
  'server:openai': '#0D9488',
  'server:sse-server': '#CA8A04',
};

export const COLOR_PALETTE: readonly string[] = [
  '#0284C7',
  '#E11D48',
  '#7C3AED',
  '#D97706',
  '#059669',
  '#4F46E5',
  '#DB2777',
  '#0891B2',
  '#CA8A04',
  '#475569',
] as const;

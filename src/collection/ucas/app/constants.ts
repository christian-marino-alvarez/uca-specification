import { SignalType as BrowserSignalType } from '@uca/capability-browser/types';
import { SignalType as CssSignalType } from '@uca/capability-css/types';
import { SignalType as ScaffoldSignalType } from '@uca/scaffold/types';
import { SignalType as ThemeCssSignalType } from '@uca/theme-css/types';
import { SignalType } from './types.js';

export const __ID__ = 'app';

export const DEFAULT_PURPOSE =
    'Crear una interfaz web interactiva para explicar la arquitectura UCA (Universal Cognitive Architecture - Unidades Cognitivas Autónomas)';

export const DEFAULT_CONTEXT =
    'Interfaz web minimalista y reactiva organizada jerárquicamente en contenedores y componentes para una demo viva de UCA';

export const DEFAULT_MODEL = 'gemini-3.5-flash';

export const DEFAULT_THEME_MODEL = 'gemini-3.5-flash-lite';

export const DEFAULT_PROVIDER = 'gemini';

export const DEFAULT_SIGNALS: readonly string[] = [
    SignalType.INIT,
    SignalType.START,
    SignalType.STOP,
    SignalType.TRIGGER,
    BrowserSignalType.DETECTED,
    BrowserSignalType.CHANGED,
    ScaffoldSignalType.CHUNK,
    ScaffoldSignalType.CREATED,
    ScaffoldSignalType.ERROR,
    ThemeCssSignalType.CREATED,
    ThemeCssSignalType.ERROR,
    CssSignalType.CREATED,
    CssSignalType.ERROR,
] as const;

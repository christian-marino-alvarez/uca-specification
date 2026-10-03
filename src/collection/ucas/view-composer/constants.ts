import { SignalType } from './types.js';

export const __ID__ = 'view-composer';
export const PURPOSE = 'Compose cognitive view graphs and propagate reactive dispositions via LLM';
export const DEFAULT_SIGNALS = [SignalType.COMPOSE, SignalType.REGISTER] as const;


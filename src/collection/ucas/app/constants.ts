import { SignalType } from './types.js';

export const __ID__ = 'app';

export const PURPOSE = 'Crear una web muy profesional y didáctica para explicar de forma muy fácil y sencilla qué es la arquitectura UCA, sus ventajas, puntos fuertes y qué no es UCA';

export const DEFAULT_SIGNALS = [
    SignalType.CREATE,
    SignalType.UPDATE,
    SignalType.REMOVE,
] as const;

export const __DEFAULT_SIGNALS__ = DEFAULT_SIGNALS;

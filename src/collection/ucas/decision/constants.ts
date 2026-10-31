export const __ID__ = 'decision';

export const DEFAULT_PURPOSE =
  'Realizar selección probabilística rápida y ligera de candidatos y decisiones arquitectónicas valorando el potencial emergente dentro de los límites del sistema';

export const DEFAULT_IMAGINATION = 0.5;
export const MAXIMUM_CANDIDATES = 64;
export const PROBABILITY_TOLERANCE = 0.05;

export const INFERENCE_LIMITS: readonly string[] = [
  'Evaluar exclusivamente los criterios de las opciones propuestas frente a la capacidad espacial del área y la complejidad funcional de la especificación',
  'Seleccionar únicamente un identificador existente dentro de las opciones de la pregunta',
  'Ignorar cualquier inferencia o validación sobre estilos, colores o dominios ajenos a la decisión solicitada',
  'Garantizar que las probabilidades asignadas a las opciones sean coherentes con la confianza y sumen exactamente 1',
] as const;

export const INVALID_PROBABILITIES = 'Las probabilidades de elección deben ser válidas y sumar uno';

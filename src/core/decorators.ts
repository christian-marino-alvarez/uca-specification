import type { Signal } from './types.js';

export const DISPOSITION_CHANGE_HANDLERS = Symbol('DISPOSITION_CHANGE_HANDLERS');

export type DispositionPredicate<T = any> = (current: T, previous?: T) => boolean;

export interface DispositionChangeRegistration {
  key: string;
  methodName: string;
  predicate?: DispositionPredicate;
}

/**
 * Compares two values for equality (deep comparison for objects/arrays, Object.is for primitives).
 */
export function isValueEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * Internal factory to create standard Stage 3 and Legacy (experimentalDecorators) method decorators.
 */
function createDispositionDecorator<T = unknown>(
  key: string,
  predicate?: DispositionPredicate<T>,
) {
  return function (
    target: any,
    contextOrKey: any,
    descriptor?: TypedPropertyDescriptor<(value: T, previous?: T) => void | Promise<void>>,
  ): any {
    // Stage 3 Decorator
    if (contextOrKey && typeof contextOrKey === 'object' && 'kind' in contextOrKey) {
      const methodName = String(contextOrKey.name);
      contextOrKey.addInitializer(function (this: any) {
        const list: DispositionChangeRegistration[] = this[DISPOSITION_CHANGE_HANDLERS] ?? [];
        list.push({ key, methodName, predicate: predicate as DispositionPredicate });
        this[DISPOSITION_CHANGE_HANDLERS] = list;
      });
      return target;
    }

    // Stage 2 (Legacy / experimentalDecorators) Decorator
    const methodName = contextOrKey as string;
    const list: DispositionChangeRegistration[] = target[DISPOSITION_CHANGE_HANDLERS] ?? [];
    list.push({ key, methodName, predicate: predicate as DispositionPredicate });
    target[DISPOSITION_CHANGE_HANDLERS] = list;
    return descriptor;
  };
}

/**
 * 1. @onDispositionChanged
 * Se dispara cuando el valor de la clave cambia efectivamente.
 */
export function onDispositionChanged<T = unknown>(key: string) {
  return createDispositionDecorator<T>(key, (current, previous) => !isValueEqual(current, previous));
}

/**
 * 2. @onDispositionEqual
 * Se dispara cuando el valor cambia y su nuevo valor coincide exactamente con expectedValue.
 */
export function onDispositionEqual<T = unknown>(key: string, expectedValue: T) {
  return createDispositionDecorator<T>(
    key,
    (current, previous) => current !== undefined && !isValueEqual(current, previous) && isValueEqual(current, expectedValue),
  );
}

/**
 * 3. @onDispositionPresent
 * Se dispara cuando el valor pasa de nulo/indefinido/vacío a estar presente.
 */
export function onDispositionPresent<T = unknown>(key: string) {
  return createDispositionDecorator<T>(key, (current, previous) => {
    const isNowPresent = current !== undefined && current !== null && current !== '';
    const wasPresent = previous !== undefined && previous !== null && previous !== '';
    return isNowPresent && (!wasPresent || !isValueEqual(current, previous));
  });
}

/**
 * 4. @onDispositionAbsent
 * Se dispara cuando el valor pasa a ser nulo, indefinido o vacío.
 */
export function onDispositionAbsent<T = unknown>(key: string) {
  return createDispositionDecorator<T>(key, (current, previous) => {
    const isNowAbsent = current === undefined || current === null || current === '';
    const wasAbsent = previous === undefined || previous === null || previous === '';
    return isNowAbsent && !wasAbsent;
  });
}

/**
 * 5. @onDispositionGreater
 * Se dispara cuando el valor numérico cambia y supera estrictamente el umbral.
 */
export function onDispositionGreater(key: string, threshold: number) {
  return createDispositionDecorator<number>(
    key,
    (current, previous) => !isValueEqual(current, previous) && Number(current) > threshold,
  );
}

/**
 * 6. @onDispositionLess
 * Se dispara cuando el valor numérico cambia y cae estrictamente por debajo del umbral.
 */
export function onDispositionLess(key: string, threshold: number) {
  return createDispositionDecorator<number>(
    key,
    (current, previous) => !isValueEqual(current, previous) && Number(current) < threshold,
  );
}

/**
 * 7. @onDispositionBetween
 * Se dispara cuando el valor numérico cambia y entra en el rango inclusivo [min, max].
 */
export function onDispositionBetween(key: string, min: number, max: number) {
  return createDispositionDecorator<number>(
    key,
    (current, previous) =>
      !isValueEqual(current, previous) && Number(current) >= min && Number(current) <= max,
  );
}

/**
 * 8. @onDispositionDown
 * Se dispara cuando el valor numérico decrece respecto al anterior.
 * Opcionalmente requiere que se sitúe por debajo o igual a targetFloor.
 */
export function onDispositionDown(key: string, targetFloor?: number) {
  return createDispositionDecorator<number>(key, (current, previous) => {
    if (previous === undefined || previous === null) return false;
    const isDecreasing = Number(current) < Number(previous);
    return targetFloor !== undefined
      ? isDecreasing && Number(current) <= targetFloor
      : isDecreasing;
  });
}

/**
 * 9. @onDispositionUp
 * Se dispara cuando el valor numérico aumenta respecto al anterior.
 * Opcionalmente requiere que alcance o supere targetCeiling.
 */
export function onDispositionUp(key: string, targetCeiling?: number) {
  return createDispositionDecorator<number>(key, (current, previous) => {
    if (previous === undefined || previous === null) return false;
    const isIncreasing = Number(current) > Number(previous);
    return targetCeiling !== undefined
      ? isIncreasing && Number(current) >= targetCeiling
      : isIncreasing;
  });
}

/**
 * Dispatches notifications to all decorated methods whose predicate evaluates to true.
 */
export function dispatchDispositionChanges(
  instance: any,
  prevBody: Record<string, unknown> | undefined,
  currentBody: Record<string, unknown> | undefined,
): void {
  const handlers: DispositionChangeRegistration[] = instance[DISPOSITION_CHANGE_HANDLERS] ?? [];
  if (handlers.length === 0) return;

  const current = currentBody ?? {};
  const prev = prevBody ?? {};

  for (const { key, methodName, predicate } of handlers) {
    const currentVal = current[key];
    const prevVal = prev[key];

    // Only evaluate if currentVal is defined (or was defined and became absent)
    if (currentVal === undefined && prevVal === undefined) {
      continue;
    }

    if (predicate) {
      if (predicate(currentVal, prevVal)) {
        instance[methodName]?.call(instance, currentVal, prevVal);
      }
    } else {
      if (!isValueEqual(currentVal, prevVal) && currentVal !== undefined) {
        instance[methodName]?.call(instance, currentVal, prevVal);
      }
    }
  }
}

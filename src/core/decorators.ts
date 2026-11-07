import type { Signal } from './types.js';

export const DISPOSITION_CHANGE_HANDLERS = Symbol('DISPOSITION_CHANGE_HANDLERS');

export interface DispositionChangeRegistration {
  key: string;
  methodName: string;
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
 * Method decorator that registers a handler to be invoked ONLY when a specific key
 * in the UCA/Capability disposition body (`disposition.aim.body[key]`) has actually changed its value.
 *
 * It will NOT fire if the disposition was updated without modifying this key's value.
 *
 * Supports both Stage 3 standard decorators and TypeScript legacy (experimentalDecorators).
 *
 * @param key The property name in `disposition.aim.body` to observe.
 *
 * @example
 * ```typescript
 * \@onDispositionChanged<boolean>('online')
 * private onOnlineChanged(online: boolean, previous?: boolean): void {
 *   this.pulse(CommunicationSignalType.SET, {
 *     event: BrowserSignalType.ONLINE,
 *     value: { online },
 *   });
 * }
 * ```
 */
export function onDispositionChanged<T = unknown>(key: string) {
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
        list.push({ key, methodName });
        this[DISPOSITION_CHANGE_HANDLERS] = list;
      });
      return target;
    }

    // Stage 2 (Legacy / experimentalDecorators) Decorator
    const methodName = contextOrKey as string;
    const list: DispositionChangeRegistration[] = target[DISPOSITION_CHANGE_HANDLERS] ?? [];
    list.push({ key, methodName });
    target[DISPOSITION_CHANGE_HANDLERS] = list;
    return descriptor;
  };
}

/**
 * Dispatches notifications to all methods decorated with `@onDispositionChanged`
 * whose observed key has actually changed value between `prevBody` and `currentBody`.
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

  for (const { key, methodName } of handlers) {
    const currentVal = current[key];
    const prevVal = prev[key];

    if (!isValueEqual(currentVal, prevVal) && currentVal !== undefined) {
      instance[methodName]?.call(instance, currentVal, prevVal);
    }
  }
}

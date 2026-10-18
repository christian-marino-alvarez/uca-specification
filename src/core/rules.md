# Normas y Reglas del Dominio Core (`src/core/rules.md`)

Este documento establece las directrices obligatorias e invariantes arquitectónicas para el mantenimiento y evolución del dominio **Core** de la Universal Cognitive Architecture (UCA).

## Política de pruebas manuales y cierre de implementación

* **Las pruebas las realiza manualmente el usuario.** El agente no debe crear ni ejecutar pruebas automáticas salvo petición expresa del usuario.
* Tras implementar, el agente debe detenerse y comunicar los cambios. No debe iniciar revisiones posteriores, inspeccionar logs, probar la aplicación en el navegador, capturar pantallas ni ejecutar comprobaciones de tipos, lint, tests o compilaciones para validar el resultado, salvo petición expresa del usuario.
* No ejecutar validaciones automáticas previas por iniciativa propia, incluidas las de Core. La lectura de las reglas y del código necesaria para implementar sigue siendo obligatoria.
* Una petición de implementar no autoriza por sí misma pruebas o revisiones. Las peticiones expresas de revisión o prueba se limitan al alcance indicado por el usuario.
* Esta política sustituye cualquier obligación anterior de ejecutar validaciones antes o después de modificar el repositorio. No altera las validaciones de datos que forman parte del funcionamiento de la aplicación.

---

## 1. Responsabilidad y Alcance del Dominio Core
El dominio `src/core` contiene **única y exclusivamente las primitivas ontológicas fundamentales y abstractas** de la arquitectura UCA:
* `Uca`: Unidad Cognitiva Autónoma base, contenedora fractal de propósito, capacidades y sistema reactivo.
* `Capability`: Mecanismo reactivo base capaz de inervarse a un objetivo nervioso (`EventTarget`), reaccionar a señales y emitir impulsos.
* `types.ts`: Contratos e interfaces formales del modelo (`Signal`, `Aim`, `Disposition`, `ICapability`, `Cooky`, `Impulse`).
* `index.ts`: Punto único de exportación pública del dominio núcleo.
* `tests/`: Suite de verificación ontológica e invariantes del ciclo de vida (`uca.test.ts`).

---

## 2. Invariantes Arquitectónicas Estrictas

1. **Cero Dependencias Externas**:
   * El núcleo debe ser 100% puro y agnóstico a cualquier framework, runtime externo o librería de terceros.
   * Solo está permitido el uso de APIs web estándar de eventos (`EventTarget`, `CustomEvent`, `Event`) y tipos nativos de TypeScript.
2. **Aislamiento e Inversión de Dependencias (Prohibición de Importar de `collection`)**:
   * Queda estrictamente prohibido importar cualquier fichero, clase o tipo procedente de `src/collection/` o de dominios superiores dentro de `src/core/`.
   * El núcleo no conoce implementaciones concretas ni casos de uso particulares.
3. **Pureza Ontológica**:
   * Toda abstracción debe respetar formalmente la especificación matemática y ontológica de UCA:
     * Una `Uca` se compone estrictamente de `purpose`, `capabilities` y `disposition`.
     * `Capability` opera como el sustrato mecánico que materializa o apoya la reacción.
     * Toda comunicación nerviosa viaja como `Signal` estructurada a través de un `EventTarget`.
4. **Declaratividad Cooky**:
   * La relación entre una `Uca` y sus capacidades intrínsecas se define mediante tuplas declarativas `[CapabilityConstructor, Disposition]`.
5. **Ciclo de Vida Idempotente de la Disposición y Sincronización del Catálogo**:
   * **Propagación reactiva**: La disposición se actualiza mediante eventos dirigidos `Capability.updateEvent(id)`.
   * **Idempotencia**: `handleDispositionUpdate` verifica si hubo un cambio real comparando las estructuras con normalización recursiva de claves (`isDispositionChanged` / `normalizeKeys`). Si no hay cambio, la ejecución se detiene sin coste ni reconexión.
   * **Reconexión y Catálogo**: Si la disposición cambia efectivamente, se desconectan y reconectan los receptores, actualizándose `this.disposition`, y se invoca `onDispositionUpdated(event)`.
   * **Sincronización en `Uca`**: En `Uca.onDispositionUpdated()`, se ejecuta `syncCatalog()`, activando/inervando dinámicamente o silenciando/denervando capacidades según `disposition.reactTo`.
6. **`innervate()` y `denervate()` son Puramente de Infraestructura (NO Ciclo de Vida de Negocio)**:
   * `innervate()` y `denervate()` **NO** forman parte del ciclo de vida reactivo u ontológico de una UCA o Capability.
   * Su cometido es estrictamente técnico: instanciar y conectar el cableado del bus nervioso (`EventTarget`).
   * Queda terminantemente prohibido ejecutar lógica de negocio, emitir señales de dominio o arrancar procesos dentro de `innervate()`.
   * El ciclo de vida de negocio de UCA es **100% reactivo**: se activa mediante estímulos nerviosos (`react(signal)`) o actualizaciones de disposición (`onDispositionUpdated`).
7. **Pruebas Manuales de Core**:
   * Las pruebas de integridad de Core corresponden al usuario. El agente solo ejecuta validaciones si el usuario las solicita expresamente.

---

## 3. Directrices de Codificación para Agentes en `src/core`

1. **Límite Estricto de 10 Líneas por Función/Método**:
   * Ninguna función o método puede exceder las **10 líneas de código**.
   * Si la lógica requiere mayor extensión, debe modularizarse en métodos privados de propósito único.
2. **Propósito Único Estricto**:
   * Cada método o función realiza exactamente una operación (evitar funciones con conjunciones o responsabilidades mixtas).
3. **Desestructuración Obligatoria (Destructuring)**:
   * Extraer propiedades al inicio del método mediante `const { target, disposition } = ...`. Prohibido el acceso reiterado por punto (`this.disposition.reactTo...`).
4. **Prohibición de Abreviaturas**:
   * Usar siempre identificadores descriptivos completos: `capability`, `disposition`, `signal`, `target`, `listener` (nunca `cap`, `disp`, `sig`).
5. **Tipado Estricto sin `any`**:
   * Todo tipo debe declararse explícitamente en `src/core/types.ts`. Prohibido el uso de `any`.
6. **Manejo de Errores Reactivo**:
   * Cualquier fallo en la ejecución de `react()` debe emitir una señal de error mediante `this.pulse('error', error)`.
7. **Prohibición Estricta de Modificaciones Sin Aprobación Previa**:
   * Queda terminantemente prohibido aplicar cambios, ediciones o refactorizaciones en el código sin mostrarlos antes de forma clara y detallada.
   * El agente **NUNCA** debe modificar ficheros sin presentar previamente la propuesta exacta de cambios para que sea revisada y aceptada por el usuario.

---

## 4. Guía para Crear o Modificar Primitivas en Core

Cuando un agente necesite intervenir en `src/core`:
1. **Propuesta y Aprobación Previa (Obligatorio)**: Mostrar al usuario la propuesta exacta de cambios a realizar y esperar su aceptación antes de tocar ningún fichero.
2. **Verificar `types.ts`**: Si se introduce un nuevo concepto ontológico, modelar primero su interfaz inmutable en `src/core/types.ts`.
3. **Implementar en archivo dedicado**: Cada primitiva residirá en su archivo homónimo (ej. `uca.ts`, `capability.ts`).
4. **Actualizar `index.ts`**: Re-exportar las definiciones públicas usando extensiones `.js` relativas:
   ```typescript
   export * from './types.js';
   export * from './capability.js';
   export * from './uca.js';
   ```
5. **Pruebas Manuales**: El usuario realiza las pruebas. Solo crear o ejecutar pruebas automáticas si las solicita expresamente; los archivos deben seguir las convenciones de `AGENTS.md`.

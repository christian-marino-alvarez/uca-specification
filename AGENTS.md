# Directrices de Desarrollo y Gobierno para Agentes (AGENTS.md)

Este documento es el punto de entrada normativo para asistentes inteligentes y desarrolladores que operen en el repositorio **`uca-specification` (`@extensio/uca`)**.

---

## 1. Principio Fundamental de Operación por Dominios

> [!IMPORTANT]
> **OBLIGACIÓN PARA AGENTES:**
> Cada dominio funcional de la arquitectura UCA cuenta con su propio fichero **`rules.md`** que define sus invariantes ontológicas, patrones de diseño y directrices de implementación.
> 
> **Antes de generar, modificar o refactorizar código en cualquier dominio, el agente DEBE consultar y aplicar estrictamente el fichero `rules.md` del dominio correspondiente.**

### 1.1 Revisión Obligatoria de la Estructura y Flow del Core antes de cualquier Implementación

> [!CAUTION]
> **INVARIANTE PRIMARIA DEL SISTEMA:**
> **Antes de cualquier implementación, modificación o refactorización en cualquier elemento del sistema (UCAs, Capabilities o Core), el agente DEBE revisar minuciosamente la estructura interna y el flujo reactivo del Core (`src/core/uca.ts`, `src/core/capability.ts`, `src/core/types.ts`)**.
> 
> Cualquier diseño o cambio **DEBE respetar, integrarse de forma natural y seguir rigurosamente el ciclo de vida ontológico del Core**:
> 1. **Inervación y Receptores**: `innervate`, `connectReceptors`, `disconnectReceptors`, `denervate`.
> 2. **Ciclo de Disposición Idempotente**: `Capability.updateEvent(id)` $\rightarrow$ `handleDispositionUpdate` $\rightarrow$ verificación idempotente con ordenación alfabética recursiva (`isDispositionChanged` / `normalizeKeys`) $\rightarrow$ reconexión $\rightarrow$ `onDispositionUpdated(event)`.
> 3. **Sincronización Declarativa del Catálogo en UCAs**: `syncCatalog()` activando/denervando capacidades según `disposition.reactTo` sobre `catalog(): Cooky`.
> 4. **Enrutamiento Reactivo Unívoco**: `react(signal: Signal)` con handlers dedicados por señal, sin fallthrough ni atajos artificiales.
> 5. **Emisión Pura de Impulsos**: `this.pulse(property, value)`.
> 
> Queda terminantemente prohibido implementar mecanismos ad-hoc, estados paralelos o atajos reactivos que se salten o ignoren el flujo natural del Core.
> **Las pruebas son manuales y corresponden al usuario; se aplica la política de la sección 5. No ejecutar validaciones automáticas por iniciativa propia.**

---

## 2. Mapa de Dominios y Ficheros `rules.md`

| Dominio | Ruta del Directorio | Fichero de Reglas | Responsabilidad Principal |
| :--- | :--- | :--- | :--- |
| **Core** | `src/core/` | [src/core/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/core/rules.md) | Primitivas ontológicas fundamentales (`Uca`, `Capability`, `Cooky`, `Signal`, `Disposition`). Cero dependencias externas. |
| **Collection (General)** | `src/collection/` | [src/collection/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/rules.md) | Estructura del catálogo público, integración y barreras de exportación unificada. |
| **Capabilities** | `src/collection/capabilities/` | [src/collection/capabilities/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/capabilities/rules.md) | Habilidades funcionales y terminales reactivas. Sin `purpose` propio (poseen `aim`). Emisión de impulsos con `pulse()`. |
| **UCAs** | `src/collection/ucas/` | [src/collection/ucas/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/ucas/rules.md) | Unidades Cognitivas Autónomas. Con `purpose` ontológico explícito y composición declarativa de capacidades mediante `Cooky`. |

---

## 3. Normas Transversales de Codificación

Todo código producido en este repositorio debe respetar rigurosamente los siguientes estándares:

1. **Límite Estricto de 10 Líneas por Función/Método**:
   * Ningún método o función puede superar las 10 líneas de código (excepto funciones switch-router).
   * Refactorizar cualquier lógica compleja en métodos privados de propósito único.
2. **Propósito Único Estricto**:
   * Cada función realiza una única tarea clara, reflejada fielmente en su nombre sin conjunciones "and/y".
3. **Desestructuración Obligatoria (Destructuring) y Prohibición de Acceso Encadenado por Punto**:
   * Es estrictamente obligatorio utilizar la sintaxis de desestructuración (`const { prop1, prop2 } = obj`) al consumir propiedades de objetos, payloads, señales, configuraciones, estados y disposiciones.
   * Queda terminantemente prohibido el acceso profundo o reiterado por punto (ej. `this.disposition.aim.body?.tag`, `this.disposition.aim.body?.observedAttributes`, `signal.value.id`, `customEvent.detail.name`).
   * Desestructurar siempre al inicio de los métodos, aplicando valores por defecto cuando proceda:
     ```typescript
     const {
         aim,
     } = this.disposition;
     const {
         observedAttributes,
         tag,
     } = aim.body ?? {};
     ```
4. **Prohibición de Redundancia de Dominio y Namespace en Ficheros e Identificadores**:
   * **Nombres de Ficheros y Carpetas**: Nombrar directamente en singular por el concepto funcional (ej. `web-component/`, `div.ts`, nunca `web-components/`, `web-component.capability.ts` ni `div.uca.ts`).
   * **Fichero Principal de Dominio (`index.ts`)**: Cuando un elemento posea su propia carpeta/subdominio (ej. `capabilities/web-component/`), su implementación principal y punto de entrada **DEBE** ser directamente `index.ts`. Queda terminantemente prohibido crear ficheros que repitan el nombre de la carpeta contenedora dentro de ella (ej. `web-component/web-component.ts` está **PROHIBIDO**; debe ser `web-component/index.ts`). **`index.ts` debe exportar exclusivamente la clase**. Queda estrictamente prohibido utilizar `index.ts` como "barrel file" re-exportando `constants.ts`, `types.ts` o `schema.ts` (`export * from ...`). Los consumidores deben importar tipos desde `<modulo>/types`, esquemas desde `<modulo>/schema` y constantes desde `<modulo>/constants`.
   * **Tipos, Enums e Interfaces dentro del Dominio**: Queda terminantemente prohibido prefijar los tipos o enumerados con el nombre del propio dominio o carpeta. El contexto y la desambiguación ya los proporciona el namespace o ruta del módulo.
     * Correcto dentro de `web-component/types.ts`: `SignalType`, `LifecycleEventType`, `Body`, `Config`, `LifecycleContext`.
     * Incorrecto: `WebComponentSignalType`, `WebComponentLifecycleEventType`, `WebComponentBody`.
   * **Constantes dentro del Dominio**:
     * Correcto dentro de `web-component/constants.ts`: `DEFAULT_TAG`, `DEFAULT_OBSERVED_ATTRIBUTES`.
     * Incorrecto: `DEFAULT_COMPONENT_TAG`.
5. **Nombres Claros, Específicos y Prohibición Estricta de Abreviaturas**:
   * Todos los nombres de variables, parámetros, propiedades, métodos y clases deben ser completos, específicos y auto-explicativos.
   * Queda estrictamente prohibido el uso de términos crípticos, abreviados o truncados (ej. `observed` en lugar de `observedAttributes`, `el` en lugar de `element`, `cap`, `disp`, `sig`, `cb`). Usar siempre términos completos del dominio: `observedAttributes`, `element`, `capability`, `disposition`, `signal`, `callback`.
6. **Estructuras de Control Claras y Prohibición de Encadenar `else if`**:
   * Obligatoriedad de bloques multilínea con llaves `{ }` en sentencias `if / else`, incluso para una única instrucción. Nunca escribir sus cuerpos inline, ni siquiera con llaves. Escribir `else` en una línea nueva, después de la llave de cierre del bloque anterior.
   * **Prohibición estricta de encadenar múltiples `else if`**: Queda terminantemente prohibido utilizar más de un `else if`. Ante más de 2 ramas o condiciones alternativas, **DEBE** utilizarse siempre una estructura `switch-case`.
7. **Tipos Dedicados (`types.ts`)**:
   * Todas las interfaces, tipos y contratos deben residir en el archivo `types.ts` del dominio correspondiente.
   * Prohibido el uso de `any`.
8. **Ubicación y Correspondencia de Tests en Subcarpeta `tests/` (Espejo Idéntico Sin Sufijo Redundante)**:
   * Toda prueba debe alojarse exclusivamente en `tests/` dentro de su respectivo subdominio (ej. `src/core/tests/`, `src/collection/capabilities/<nombre>/tests/`, `src/collection/ucas/<nombre>/tests/`).
   * **Replicación Idéntica de Ficheros**: Al estar dentro del directorio `tests/`, el contexto ya define que es una prueba. El archivo debe replicar **exactamente el mismo nombre** del archivo que valida (ej. para probar `index.ts`, su test es `tests/index.ts`; para `helpers.ts`, su test es `tests/helpers.ts`).
   * **Prohibición de Sufijo/Prefijo Redundante**: Queda terminantemente prohibido utilizar el sufijo `.test.ts`, `.spec.ts` o prefijos equivalentes dentro de la carpeta `tests/`.
   * Prohibido introducir atajos o lógica de test en archivos de producción.
9. **Gestión Asíncrona Moderna**:
   * Utilizar exclusivamente `async / await` y bloques `try / catch`. Prohibido el uso de `.then()` o `.catch()`.
10. **Uso Obligatorio de Enums para Nombres de Señales y Eventos**:
   * Queda estrictamente prohibido el uso de cadenas de texto literales (*magic strings*) para identificar señales nerviosas o eventos. Deben declararse y consumirse mediante tipos enumerados (`enum`) formales en el archivo `types.ts` del dominio correspondiente (ej. `SignalType`).
11. **Fichero Dedicado de Constantes (`constants.ts`)**:
   * Queda terminantemente prohibido hardcodear arrays por defecto, etiquetas fallback, listas de atributos fijos o valores de configuración estáticos de forma inline dentro de las clases o métodos.
   * Todos los valores por defecto, configuraciones inmutables y listas fijas deben declararse en un archivo dedicado `constants.ts` del dominio correspondiente, nombrados en `SCREAMING_SNAKE_CASE` (ej. `DEFAULT_OBSERVED_ATTRIBUTES`, `DEFAULT_COMPONENT_TAG`) y tipados con inmutabilidad (`as const` o `readonly`).
   * **El propósito existencial (`purpose`) pertenece ontológicamente a la clase** y debe declararse directamente en ella (`public static override purpose: string = '...'`), nunca en `constants.ts`. Las constantes se importan a través del subpath dedicado (`./constants`).
12. **Orden Canónico de Miembros y Métodos en Clases y Capabilities**:
   * **Propiedades y métodos estáticos (`static`)**: Siempre en la cabecera de la clase, por encima del constructor.
   * **Propiedades de instancia**: Justo antes del constructor.
   * **Constructor**: `public constructor(...)`.
   * **Conexión de Infraestructura (Instanciación privada / cableado técnico, NO ciclo de vida de negocio)**:
     1. `innervate(...)`
     2. `denervate()`
   * **Ciclo de Vida Reactivo de Negocio**:
     1. `react(...)` (reacción unívoca a señales y estímulos externos o internos)
     2. `onDispositionUpdated(...)` (adaptación ante cambios en la disposición)
   * **Métodos públicos y protegidos auxiliares**: Ubicados inmediatamente después del bloque reactivo, cerca del constructor.
   * **Métodos privados**: Siempre al final de la clase, ordenados tras los métodos públicos.
13. **Invariante de Ausencia de Almacenamiento de Estado (UCAs y Capabilities No Guardan Propiedades)**:
   * **Ni las UCAs ni las Capabilities deben almacenar propiedades de dominio como estado mutable en variables privadas de instancia** (`this.value`, `this.items`, `this.selected`, etc.).
   * Ambas son entidades reactivas y sin estado intrínseco de dominio: **reaccionan en tiempo real a los cambios de propiedades** transmitidas a través de señales nerviosas (`Signal`) o configuradas inicialmente en su disposición (`disposition.aim.body`).
   * Los constructores de UCAs y Capabilities son estrictamente identitarios (`constructor(id: string = '<default>')`) y no reciben objetos de opciones o propiedades de datos.
14. **Separación Ontológica de Dominio frente a Etiquetas HTML y Presentación Física (CSS)**:
   * Las UCAs deben nombrarse y modelarse según conceptos ontológicos y teleológicos de dominio (ej. `Box`, `Picture`, `List`), nunca mediante etiquetas HTML de bajo nivel (`div`, `img`, `ul`).
   * **Prohibición de Etiquetas o Tags de Plataforma en UCAs**: Las UCAs no deben especificar ni conocer tags HTML o WebComponent (ej. `tag: 'ext-box'`). La UCA delega la representación física en la capability correspondiente (`WebComponent`, Canvas, WebGL, Mobile), pasando solo su identidad y atributos de dominio.
   * Las UCAs no primitivas definen y orquestan cualidades de dominio (dimensiones, alineación, color, espacio, visibilidad), **nunca primitivas de formato o cadenas CSS inline (`style`)**. La transducción física y DOM pertenece a las capacidades terminales especializadas (ej. `WebComponent`).
15. **Transducción Reactiva Bidireccional y Emisión de Pulsos de Dominio (`created`, `updated`, `removed`)**:
   * Toda UCA debe implementar `protected override react(signal: Signal): void` e inervarse con los estímulos de ciclo de vida de la capability (`element.render`, `element.update`, `element.remove`).
   * Ante estos eventos técnicos, la UCA transduce el ciclo de vida y emite un pulso nervioso hacia el exterior con su enumerado de dominio `SignalType`: `CREATED`, `UPDATED`, `REMOVED`.
   * **El payload transmitido en el pulso DEBE ser siempre un objeto con sus propiedades de dominio** (`Body` de la UCA), garantizando que las UCAs y diseñadores externos reciban contratos ontológicos puros y no atributos de plataforma técnica.
16. **Programación Minimalista y Cero Validaciones Defensivas Redundantes**:
   * En TypeScript estricto (`strict: true`), los contratos de tipos (`types.ts`) y esquemas ya garantizan la integridad de las estructuras.
   * Queda terminantemente prohibido escribir código defensivo hiperbólico o comprobaciones redundantes de tipo (ej. `typeof x === 'object' && x !== null && 'prop' in x`).
   * Utilizar siempre operadores idiomáticos directos: coalescencia nula (`??`), spreading condicional (`...(cond && { prop })`) y valores por defecto en desestructuración.
17. **Topología Plana y Prohibición de Profundidad Excesiva de Métodos (Profundidad Máxima = 1)**:
   * El flujo interno de una clase debe ser plano: un método del ciclo de vida (`react`, `innervate`, `capabilities`) puede delegar en un handler de dominio (`handleX`), y este debe resolver el flujo y emitir el pulso directamente.
   * A lo sumo, un handler puede apoyarse en **1 función auxiliar terminal hoja** (ej. extracción de metadatos o formateo puro).
   * Queda terminantemente prohibido que una función auxiliar llame a otro método auxiliar (`handleX -> helperA -> helperB -> helperC` está **PROHIBIDO**).
   * Queda prohibido crear métodos privados "trampolín" o micro-helpers de 1-2 líneas que solo se usan en un único sitio; deben resolverse de forma inline directa.
18. **Construcción Declarativa Directa (Prohibición de Bucles Imperativos para Mapeos)**:
   * Queda prohibido fragmentar la clase en métodos privados con bucles imperativos (`for..in`, `for..of`, `Object.entries`) para combinar o filtrar propiedades.
   * Usar siempre patrones declarativos de TypeScript (spreading condicional, operadores lógicos y mapeos directos).
19. **Mapeo Unívoco Señal -> Handler Dedicado en `react()` (Prohibición de Fallthrough de Casos)**:
   * Cada señal nerviosa capturada en la estructura `switch-case` del método `react(signal: Signal)` representa un estímulo u operación de dominio independiente.
   * **Queda estrictamente prohibido agrupar múltiples señales bajo un mismo bloque o fallthrough** (ej. `case CREATED: case UPDATED: this.handleX(...)` está **PROHIBIDO**).
   * **Cada `case` de señal DEBE delegar en su propio método privado unívoco y dedicado** (`handleCreated`, `handleUpdated`, `handleScaffoldCreated`, `handleScaffoldUpdated`), garantizando propósito único y trazabilidad reactiva nítida.
20. **Definición de Schemas con Zod como Única Fuente de Verdad (`schema.ts`)**:
   * Las UCAs deben modelar sus contratos de datos y cuerpo de disposición (`Body`) mediante esquemas formales de **Zod** en un archivo dedicado `schema.ts`.
   * Los tipos TypeScript se infieren directamente de Zod (`export type Body = z.infer<typeof bodySchema>`), erradicando interfaces escritas manualmente sin validación en runtime.
   * `types.ts` re-exporta los tipos derivados de `schema.ts` junto a los enumerados obligatorios de señales (`SignalType`) y tipos de datos (`DataType`).
   * La validación en tiempo de ejecución se realiza de forma reactiva y determinista mediante la capability primitiva `@uca/capability-schema`.
   * **Los archivos de esquemas (`schema.ts`) no pueden contener lógica de negocio.** Solo declaran y componen contratos de datos, restricciones estructurales y tipos inferidos.
   * Se permiten restricciones declarativas de estructura, tipos, obligatoriedad, enumerados, rangos y longitudes. Las decisiones, cálculos, comparaciones entre campos, comprobaciones contra una petición concreta, selección de modelos, reintentos y construcción dinámica de contratos según el contexto pertenecen a métodos de la UCA o Capability responsable.
   * No ocultar lógica de negocio en funciones auxiliares ni en callbacks de `.refine()`, `.superRefine()` o `.transform()` dentro de archivos de esquemas. Por ejemplo, calcular que los pesos sumen 100 %, comprobar identificadores duplicados o comparar los extremos de una escala debe resolverse en métodos del dominio.
21. **Alineación Obligatoria con el Flujo y Ciclo de Vida de Core**:
   * Toda UCA y Capability debe operar en estricta sincronía con las primitivas del Core (`Capability` y `Uca`).
   * Ante actualizaciones de disposición (`onDispositionUpdated`), las UCAs deben discriminar conscientemente la naturaleza del estímulo:
     - **Cambio Semántico** (`aim.body.request`, `aim.body.context`): Justifica reevaluación cognitiva (`ADAPT` o `RECOMPOSE`).
     - **Cambio Ambiental** (`limits`): Si las dimensiones relativas (`%`, `full`) son compatibles, la estrategia es **`KEEP`** (no llamar al LLM).
     - **Continuidad Estructural** (`aim.body.composition`): Conservación de la composición confirmada por el organismo responsable para permitir reconciliación incremental.
   * Queda estrictamente prohibido emitir pulsos de regeneración ciegos (`pulse(UPDATE)`) en `onDispositionUpdated` o diseñar circuitos paralelos al Core.
22. **Formato Vertical de Desestructuraciones, Objetos y Arrays**:
   * Las desestructuraciones, los objetos y los arrays no vacíos deben escribirse en varias líneas, con una propiedad o elemento por línea, incluidos los spreads. Se aplica también cuando contienen un único elemento.
   * Las estructuras anidadas siguen el mismo formato. En particular, cada objeto de `inputs` y `outputs` debe declarar `signal`, `type`, `schema` y `description`, cuando correspondan, en líneas independientes.
   * Los literales vacíos (`{}` y `[]`) pueden permanecer inline. No comprimir propiedades o elementos en una línea para cumplir el límite de longitud de los métodos.
23. **Agrupación de `reactTo` por Capacidad en Métodos**:
   * En UCAs compuestas, agrupar las suscripciones por capacidad en métodos privados estáticos dedicados, llamados `reactTo<Capacidad>()`, situados junto a los demás miembros estáticos.
   * Cada método desestructura `reactTo` de la disposición de la capacidad y devuelve sus señales junto a los eventos de esa capacidad que escucha la UCA, utilizando enums formales y formato vertical.
   * `disposition.reactTo` combina estos grupos mediante spreads y mantiene explícitas las señales propias de la UCA. No introducir constantes auxiliares de señales ni modificar las suscripciones al reorganizarlas.
   * Estos métodos declarativos están permitidos aunque sean breves y se utilicen una sola vez: su propósito es hacer visible la agrupación por capacidad.

---

## 4. Guía para Ayudar a Crear Nuevo Contenido en los Dominios

### ¿Cómo Crear una Nueva Capability?
1. Leer [src/collection/capabilities/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/capabilities/rules.md).
2. Declarar el tipo del cuerpo (`Body`) e interfaces en `src/collection/capabilities/<nombre>/types.ts`.
3. Crear la clase en `src/collection/capabilities/<nombre>/index.ts` heredando de `Capability<Body>`. Sin variables de estado de datos; constructor identitario.
4. Implementar `react(signal: Signal)` y emitir eventos con `this.pulse(property, value)`.
5. Exportar en `src/collection/capabilities/index.ts`.
6. Solo si el usuario solicita pruebas automáticas, crear la suite en `src/collection/capabilities/<nombre>/tests/index.ts`.

### ¿Cómo Crear una Nueva UCA?
1. Leer [src/collection/ucas/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/ucas/rules.md).
2. Definir el esquema formal con Zod (`bodySchema`) en `src/collection/ucas/<nombre>/schema.ts` e inferir `Body = z.infer<typeof bodySchema>`.
3. Re-exportar tipos en `src/collection/ucas/<nombre>/types.ts` junto a `SignalType` y `DataType`.
4. Crear la clase en `src/collection/ucas/<nombre>/index.ts` heredando de `Uca<Body>`. Sin guardar propiedades de datos; constructor identitario `super(id, purpose)`.
5. Definir `purpose` en la propiedad estática y componer capacidades en `protected override catalog(): Cooky`.
6. Exportar en `src/collection/ucas/index.ts`.
7. Solo si el usuario solicita pruebas automáticas, crear la suite en `src/collection/ucas/<nombre>/tests/index.ts`.

---

## 5. Pruebas manuales y cierre de implementación

* **Las pruebas las realiza manualmente el usuario.** El agente no debe crear ni ejecutar pruebas automáticas salvo petición expresa del usuario.
* Tras implementar, el agente debe detenerse y comunicar los cambios. No debe iniciar revisiones posteriores, inspeccionar logs, probar la aplicación en el navegador, capturar pantallas ni ejecutar comprobaciones de tipos, lint, tests o compilaciones para validar el resultado, salvo petición expresa del usuario.
* No ejecutar validaciones automáticas previas por iniciativa propia, incluidas las de Core. La lectura de las reglas y del código necesaria para implementar sigue siendo obligatoria.
* Una petición de implementar no autoriza por sí misma pruebas o revisiones. Las peticiones expresas de revisión o prueba se limitan al alcance indicado por el usuario.
* Esta política sustituye cualquier obligación anterior de ejecutar validaciones antes o después de modificar el repositorio. No altera las validaciones de datos que forman parte del funcionamiento de la aplicación.

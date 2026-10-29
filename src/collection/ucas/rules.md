# Normas y Reglas del Dominio UCAs (`src/collection/ucas/rules.md`)

Este documento establece las directrices obligatorias para el desarrollo, mantenimiento y creación de nuevas Unidades Cognitivas Autónomas (UCAs) dentro del dominio `src/collection/ucas`.

## Política de pruebas manuales y cierre de implementación

* **Las pruebas las realiza manualmente el usuario.** El agente no debe crear ni ejecutar pruebas automáticas salvo petición expresa del usuario.
* Tras implementar, el agente debe detenerse y comunicar los cambios. No debe iniciar revisiones posteriores, inspeccionar logs, probar la aplicación en el navegador, capturar pantallas ni ejecutar comprobaciones de tipos, lint, tests o compilaciones para validar el resultado, salvo petición expresa del usuario.
* No ejecutar validaciones automáticas previas por iniciativa propia, incluidas las de Core. La lectura de las reglas y del código necesaria para implementar sigue siendo obligatoria.
* Una petición de implementar no autoriza por sí misma pruebas o revisiones. Las peticiones expresas de revisión o prueba se limitan al alcance indicado por el usuario.
* Esta política sustituye cualquier obligación anterior de ejecutar validaciones antes o después de modificar el repositorio. No altera las validaciones de datos que forman parte del funcionamiento de la aplicación.

---

## 1. Responsabilidad y Naturaleza de una UCA
Una **UCA** (Unidad Cognitiva Autónoma) es la unidad primaria de comportamiento autónomo, reactivo y fractal:
* Posee una identidad (`id`) y un propósito teleológico explícito e inmutable (`purpose`).
* Encapsula capacidades (`capabilities`) intrínsecas o acopladas dinámicamente (`attach`/`detach`).
* Dispone de su propio sistema nervioso local (`target = new EventTarget()`) que inerva a todas sus capacidades constitutivas.
* Orquesta de forma declarativa las capacidades que componen su cuerpo operativo mediante el patrón `Cooky`.

---

## 2. Invariantes Ontológicas y Arquitectónicas

1. **Herencia Obligatoria**:
   * Toda clase UCA en este dominio debe heredar de `Uca`:
     ```typescript
     import { Uca } from '../../core/uca.js';
     export class Div extends Uca { ... }
     ```
2. **Propósito Obligatorio (`purpose`)**:
   * Toda UCA debe declarar su propósito existencial en una propiedad estática: `public static override purpose: string = '...';`.
   * El getter `this.purpose` de la instancia resuelve dinámicamente el propósito de la clase (`(this.constructor as typeof Uca).purpose`).
   * En el constructor identitario se delega limpiamente: `super(id)`.
3. **Declaración Fractal de Capacidades mediante `Cooky` en `catalog()`**:
   * La UCA debe declarar sus capacidades intrínsecas sobrescribiendo el método `catalog()`:
     ```typescript
     protected override catalog(): Cooky {
         const capabilityId = `${this.id}:sub-capability`;
         const body = { id: capabilityId, ... };
         const disposition: Disposition<Body> = {
             aim: { description: 'Descripción del aim', body },
             reactTo: ['pattern.event'],
         };
         const cooky: Cooky = [[CapabilityClass, disposition]];
         return cooky;
     }
     ```
   * Al actualizarse o inervarse la UCA, `syncCatalog()` sincroniza, conecta y actualiza dinámicamente estas capacidades.
4. **Prohibición de Redundancia de Dominio en Nombres de Ficheros**:
   * Queda estrictamente prohibido usar el sufijo `.uca.ts` o prefijos equivalentes.
   * El nombre del archivo debe ser únicamente el sustantivo en kebab-case:
     * Correcto: `div.ts`, `button.ts`, `counter.ts`, `chat-assistant.ts`.
     * Incorrecto: `div.uca.ts`, `uca-div.ts`, `divUca.ts`.
   * El nombre de la clase debe ser en `PascalCase`: `Div`, `Button`, `Counter`, `ChatAssistant`.
5. **Constructor Puramente Identitario (Sin Opciones de Configuración)**:
   * El constructor de una UCA tiene como único fin fijar su identidad ontológica (`id`) y propósito (`purpose`).
   * Queda terminantemente prohibido recibir objetos de opciones (`options`) o propiedades de configuración en el constructor.
   * La firma del constructor debe ser exclusivamente:
     ```typescript
     public static override purpose: string = '<propósito teleológico>';

     public constructor(id: string = '<default-id>') {
         super(id);
     }
     ```
6. **Invariante de Ausencia de Estado Local (Las UCAs No Guardan Propiedades)**:
   * Una UCA **no almacena estado de dominio ni propiedades en variables privadas de instancia** (`this.value`, `this.items`, etc.).
   * Las UCAs son entidades de orquestación y transducción cognitiva: **reaccionan dinámicamente a cambios de propiedades** transmitidas mediante señales (`Signal`) en su sistema nervioso (`target`) o configuradas a través de su disposición (`disposition.aim.body`).
   * Si una UCA necesita proyectar atributos iniciales hacia sus capacidades constitutivas (`Cooky`), debe extraerlos directamente de su propia disposición (`const { ... } = this.disposition.aim.body ?? {};`).
7. **`innervate()` y `denervate()` son Puramente de Infraestructura/Instanciación (NO Ciclo de Vida de Negocio)**:
   * `innervate()` y `denervate()` **NO** forman parte del ciclo de vida ontológico o de negocio de una UCA.
   * Su función es estrictamente técnica y privada a nivel de arquitectura del Core (`Capability` y `Uca`): cablear el canal nervioso (`EventTarget`) e instanciar las conexiones.
   * **Prohibición de sobrescribir `denervate()` o `innervate()` en UCAs de dominio**: Las UCAs de dominio **NO DEBEN** sobrescribir `denervate()` (por ejemplo, para recorrer manualmente `this.registry.forEach((capability) => capability.denervate())`) ni `innervate()`. La activación y denervación de las capacidades del catálogo (`registry`) es gobernada declarativamente por el Core mediante `syncCatalog()` según `disposition.reactTo`.
   * Queda estrictamente prohibido introducir lógica de negocio, emisiones de pulsos o arrancar procesos dentro de `innervate()`.
   * El ciclo de vida de negocio de una UCA es **100% reactivo**: se activa únicamente mediante estímulos/señales recibidas en `react(signal)` o cambios de disposición en `onDispositionUpdated(event)`.
8. **Contrato Ontológico de Comunicación (Signal, Body como Schema y Actualización de Disposición)**:
   * Toda interacción o estímulo inter-UCA viaja estructurado mediante `Signal`.
   * El `Body` formalizado con Zod en `schema.ts` constituye la fuente de verdad y el esquema formal de validación (`schema`) para los puertos de entrada (`inputs`) y salida (`outputs`).
   * Toda coordinación, delegación o comunicación entre UCAs **debe actualizar y sincronizar siempre la `Disposition` receptora** (`aim.body`), activando el ciclo idempotente de actualización y sincronización de catálogo del Core (`onDispositionUpdated` y `syncCatalog`). Prohibido emitir datos o comandos fuera del contrato de disposición.
9. **Lectura Obligatoria del Core**:
   * Antes de cualquier creación o modificación de una UCA, el agente **DEBE revisar minuciosamente la estructura interna y el flujo reactivo del Core** (`src/core/uca.ts`, `src/core/types.ts`) sin ejecutar validaciones automáticas; las pruebas corresponden al usuario.

---

## 3. Directrices de Codificación para Agentes

1. **Límite de 10 Líneas por Función/Método**:
   * Descomponer métodos de configuración en funciones auxiliares privadas si superan las 10 líneas.
2. **Desestructuración Obligatoria**:
   * Desestructurar siempre los cuerpos de disposición (`disposition.aim.body`) o payloads de señales al inicio de los métodos.
3. **Gestión de Tipos en `types.ts`**:
   * Declarar interfaces para el cuerpo de la disposición (`Body`) y estructuras de dominio en `types.ts`:
     ```typescript
     export interface Body {
         readonly role?: string;
         readonly hidden?: boolean;
     }
     ```
4. **Prohibición de `any`**:
   * Todos los contratos deben tiparse con precisión.
5. **Mapeo Declarativo de Propiedades a Capacidades (Patrón Diccionario/JSON)**:
   * La UCA no debe manipular cadenas o atributos HTML con lógica condicional imperativa (`if / else`).
   * Debe utilizarse un método privado que devuelva un mapa/diccionario declarativo (`Record<string, unknown>`) asociando las propiedades recibidas en la disposición con el contrato de la capacidad:
     ```typescript
     private getAttributeMapping(): Record<string, unknown> {
         const { aim } = this.disposition;
         const { className, role, hidden } = (aim.body as Body) ?? {};
         const mapping: Record<string, unknown> = {
             'class': className,
             'role': role,
             'hidden': hidden ? '' : undefined,
         };
         return mapping;
     }
     ```
   * El método `buildAttributes()` itera sobre dicho mapa filtrando valores `undefined`.
6. **Separación Ontológica Estricta de la UCA frente al DOM y Presentación Física**:
   * Las UCAs representan conceptos teleológicos de dominio (ej. `Box`, `Picture`, `List`), nunca nombres de etiquetas HTML de bajo nivel (como `div`, `img`, `ul`).
   * **Prohibición de Etiquetas o Tags de Plataforma**: Las UCAs no deben conocer ni especificar nombres de etiquetas HTML ni prefijos de WebComponent (ej. `tag: 'ext-box'`). La resolución de la representación física concreta corresponde exclusivamente a la capability especializada (`WebComponent`, Canvas, WebGL, Mobile, etc.). La UCA se limita a pasar su identidad (`id`) y atributos/disposición de dominio.
   * Las UCAs no primitivas definen cualidades ontológicas de dominio (dimensiones, ordenación, alineación, color, espacio, visibilidad), **nunca primitivas de presentación física o formato (como strings CSS inline `style`)**. Esa transducción pertenece a las capacidades terminales especializadas.
   * Queda prohibido hardcodear listas de `observedAttributes` de HTML en la UCA; esta responsabilidad corresponde a la capacidad (ej. `WebComponent`).
7. **Replicación Espejo de Ficheros en `tests/` (Sin Sufijo `.test`)**:
   * Los tests alojados en `tests/` dentro del subdominio de la UCA deben replicar exactamente el nombre del archivo bajo prueba sin sufijos redundantes.
   * Para la implementación principal `index.ts`, su test debe ser estrictamente `tests/index.ts` (nunca `index.test.ts` ni `<nombre>.test.ts`).
8. **Transducción Reactiva Bidireccional y Emisión de Pulsos de Dominio (`created`, `updated`, `removed`)**:
   * Toda UCA debe implementar `protected override react(signal: Signal): void` e inervarse por defecto escuchando los eventos de la capability terminal (`element.render`, `element.update`, `element.remove`).
   * Al recibir estos estímulos técnicos, la UCA transduce el ciclo de vida y emite un pulso nervioso hacia el exterior con su enumerado de dominio `SignalType`:
     - `SignalType.CREATED`: emitido ante `element.render`.
     - `SignalType.UPDATED`: emitido ante `element.update`.
     - `SignalType.REMOVED`: emitido ante `element.remove`.
   * **El payload transmitido en el pulso DEBE ser siempre un objeto con sus propiedades de dominio** (`Body` de la UCA), nunca atributos HTML ni objetos de plataforma técnica.
9. **Agrupación y Distinción Estricta de Reacciones por Origen (`SignalType` vs `CapabilitySignalType`)**:
   * Toda UCA posee dos orígenes ontológicos bien diferenciados de señales a las que reacciona en su método `react(signal: Signal)`:
     1. **Señales de Dominio Propio / Inter-UCA (`SignalType`)**: Comandos y estímulos intencionales o semánticos (`CREATE`, `UPDATE`, `REMOVE`, `SUBMIT`, `SELECT`, etc.).
     2. **Señales de Capacidad Terminal (`CapabilitySignalType`)**: Eventos técnicos de ciclo de vida de capacidades constitutivas (`RENDERED`, `UPDATED`, `REMOVED`).
   * **Prohibición de Colisión o Mezcla en `react()`**: En el `switch-case` de `react(signal)`, las señales de dominio se gestionan en sus ramas dedicadas y las señales técnicas de capacidad se delegan a un método handler especializado (ej. `handleCapabilitySignal(property)`).
10. **Declaración de Señales Reactivas en `disposition.reactTo`**:
    * Las señales nerviosas a las que la UCA reacciona se declaran formalmente en su propiedad estática `disposition.reactTo` utilizando enums formales (`SignalType`). Queda terminantemente prohibido el uso de variables o constantes auxiliares como `DEFAULT_SIGNALS` o `defaultSignals`.
    * Agrupar las señales por capacidad en métodos privados estáticos `reactTo<Capacidad>()`. Cada método desestructura `reactTo` de la disposición de esa capacidad y devuelve las suscripciones junto a los eventos de la capacidad que escucha la UCA.
    * Componer `disposition.reactTo` mediante spreads de estos métodos, manteniendo explícitas las señales propias de la UCA y conservando las suscripciones existentes.
    * Estos métodos declarativos se sitúan con los miembros estáticos y están permitidos aunque sean breves y tengan un único uso.
11. **Propiedad Estática de Propósito (`public static override purpose`)**:
    * Para maximizar mantenibilidad, legibilidad e introspección, el propósito de la UCA debe residir en una propiedad estática: `public static override purpose: string = '...';`, ubicada en la primera posición de la clase por encima del constructor.
    * La clase base `Uca` expone un getter `public get purpose(): string` que resuelve dinámicamente el propósito de la clase, y el constructor identitario delega limpiamente con `super(id)`.
12. **Estandarización de Identificador por Defecto (`__ID__`)**:
    * El identificador por defecto de la entidad dentro de su archivo `constants.ts` debe nombrarse rigurosamente como `__ID__` (ej. `export const __ID__ = 'box';`), eliminando prefijos redundantes como `DEFAULT_ID`.
13. **Declaración Explícita de Puertos con Enumerado `DataType` (`inputs` y `outputs`) en Disposiciones**:
    * Toda UCA declara en su `Disposition` formalmente los estímulos de entrada (`inputs`) que orquesta y las señales de dominio de salida (`outputs`) que emite hacia el bus nervioso, garantizando la descubribilidad e interconectabilidad fractal entre organismos UCA.
    * Los tipos de datos de los puertos (`type`) deben agruparse en un enumerado formal `DataType` en el archivo `types.ts` del dominio correspondiente (sin usar cadenas mágicas ni firmas inline `{ ... }`).
    * **El `Body` como Schema de los Puertos**: La propiedad `schema` de cada puerto debe enlazar directamente con el esquema Zod formal del cuerpo (`bodySchema`) o con sus sub-esquemas de dominio correspondientes en `schema.ts`. Lo que viaja como `signal.value` en los estímulos de entrada o en los pulsos emitidos valida estrictamente contra este esquema.
    * Aplicar el formato vertical de `AGENTS.md` a desestructuraciones, objetos y arrays no vacíos: una propiedad o elemento por línea, incluidos spreads y estructuras anidadas, incluso con un único elemento.
    * En `inputs` y `outputs`, cada objeto de puerto debe presentar sus propiedades (`signal`, `type`, `schema`, `description`, cuando correspondan) en líneas independientes. Solo los literales vacíos (`{}` y `[]`) pueden permanecer inline.
14. **Programación Minimalista y Cero Validaciones Defensivas Redundantes**:
    * En TypeScript estricto, no saturar el código con comprobaciones de tipo de bajo nivel (`typeof x === 'object' && x !== null`). Confiar en los contratos de `types.ts`, coalescencia nula (`??`) y valores fallback en desestructuración.
15. **Topología Plana y Prohibición de Profundidad Excesiva de Métodos (Profundidad Máxima = 1)**:
    * El flujo interno de una UCA debe ser plano: `react(signal)` delega en un manejador (`handleX`), y este resuelve y pulsa directamente. A lo sumo puede apoyarse en 1 función auxiliar terminal hoja.
    * Queda terminantemente prohibido encadenar métodos auxiliares privados (`handleX -> helperA -> helperB -> helperC` está **PROHIBIDO**).
    * Prohibido crear métodos privados "trampolín" o micro-helpers de 1-2 líneas que solo se usan en un único sitio.
16. **Construcción Declarativa Directa (Sin Bucles para Mapeos)**:
    * Prohibido fragmentar la UCA en métodos privados con bucles imperativos (`for..in`, `for..of`, `Object.entries`) para combinar o filtrar propiedades.
    * Usar siempre patrones declarativos directos (spreading condicional `...(cond && { prop })`, operadores lógicos y mapeos directos).
17. **Máxima Ontológica de UCA: Superación del "Prompt sin Propósito" y la Disposición (`Disposition`) como Medio de Comunicación**:
    * **La UCA no es un prompt**: Una UCA es una Unidad Cognitiva Autónoma definida formalmente por su identidad teleológica inmutable (`purpose`), su disposición situacional (`aim`: `description` + `body`), sus puertos reactivos (`inputs`, `outputs`) y sus capacidades (`capabilities` / `Cooky`).
    * **Prohibición Estricta de Ficheros de Plantillas de Prompt (`prompt.ts`)**: Queda terminantemente prohibido crear archivos `prompt.ts` con cadenas imperativas de texto ("Eres un asistente...", "TAREA: ..."). UCA existe precisamente para erradicar la ingeniería artesanal de prompts sin propósito y sustituirla por arquitectura ontológica tipada.
    * **La Disposición (`Disposition`) como Medio Universal de Comunicación Cognitiva e Inter-UCA**:
      * **Actualización Permanente de la Disposición**: Toda comunicación entre UCAs (por ejemplo, `App` -> `Layout`, `Layout` -> `View`) o interacción fractal debe actualizar formalmente la disposición receptora (`aim.body`). Queda estrictamente prohibido comunicar datos o comandos mediante atajos o canales paralelos sin actualizar la `disposition` a través de los ciclos reactivos de Core (`Capability.updateEvent(id)`).
      * Al interactuar con capacidades o terminales de inteligencia artificial (ej. `LlmWeb`, `Llm`), la UCA **comunica directamente su propia ontología**:
        - Su identidad ontológica: `this.purpose`.
        - Su teleología situacional: `this.disposition.aim` (`description` como misión activa y `body` como contexto/características de dominio).
        - Sus diales cognitivos universales: `determinism` e `imagination` (porcentajes de fidelidad estructural vs. creatividad).
      * La terminal cognitiva (`LlmWeb`) es la responsable exclusiva de transducir este estado ontológico a las particularidades técnicas de los modelos de IA, preservando la pureza ontológica y el desacoplamiento total de los compositores y agentes de dominio respecto a cualquier vendor o configuración técnica de LLM.
18. **Mapeo Unívoco Señal -> Handler Dedicado en `react()` y Regla de Único `pulse` por Handler**:
    * Cada señal nerviosa capturada en el switch-router de `react(signal: Signal)` representa un evento semántico y ontológico independiente (ej. `SignalType.CREATED` vs `SignalType.UPDATED`).
    * **Queda estrictamente prohibido agrupar múltiples señales mediante fallthrough de `case`** (ej. `case CREATED: case UPDATED: this.handleX(...)` está **PROHIBIDO**).
    * **Cada `case` de señal DEBE delegar en su propio handler privado unívoco y dedicado** (`handleCreated`, `handleUpdated`, `handleScaffoldCreated`, `handleScaffoldUpdated`).
    * **Un Único `pulse` y Una Única Funcionalidad por Handler**: Como el canal reactivo no garantiza sincronicidad entre operaciones de distintas capacidades/UCAs, queda terminantemente prohibido que un handler ejecute múltiples funcionalidades o emita más de un `this.pulse(...)` (ni directamente ni invocando múltiples métodos que pulsen). Cada paso debe encadenarse reactivamente esperando la señal de confirmación de la capacidad o UCA invocada a través del ciclo de actualización de la disposición (`updateDispositionBody` -> `DispositionSignal.UPDATED` -> `handleUpdated`).
    * Compartir un único handler para señales de semántica distinta o encadenar múltiples pulsos imperativos colapsa el ciclo de vida ontológico y vulnera el principio de propósito único.
19. **Definición de Schemas con Zod como Única Fuente de Verdad (`schema.ts`)**:
    * Toda UCA debe declarar sus contratos de datos y cuerpo de disposición (`Body`) mediante esquemas formales de **Zod** en un archivo dedicado `schema.ts`.
    * Los tipos TypeScript se infieren directamente de Zod (`export type Body = z.infer<typeof bodySchema>`), erradicando interfaces `interface Body` redactadas manualmente sin validación.
    * El fichero `types.ts` actúa como fachada re-exportando los tipos derivados de `schema.ts` junto a los enumerados de señales (`SignalType`) y tipos de datos (`DataType`).
    * Los esquemas Zod formalizan la estructura y tipos del contrato tanto en tiempo de compilación como en tiempo de ejecución.
    * **Los archivos de esquemas (`schema.ts`) no pueden contener lógica de negocio.** Solo declaran y componen contratos, restricciones estructurales y tipos inferidos, conforme a la sección 3.20 de `AGENTS.md`.
    * Los cálculos, comparaciones entre campos, validaciones contra una petición concreta y construcción dinámica de contratos según el contexto deben implementarse en métodos de la UCA responsable; no en funciones ni callbacks de `.refine()`, `.superRefine()` o `.transform()` dentro de `schema.ts`.
20. **Evaluación Consciente en `onDispositionUpdated` (Prohibición de Regeneración Ciega)**:
    * Al sobrescribir `onDispositionUpdated(event: Event)`, es obligatorio invocar `super.onDispositionUpdated(event)` para permitir la sincronización del catálogo (`syncCatalog`).
    * **Prohibición de Regeneraciones Ciegas**: Queda estrictamente prohibido emitir de forma refleja pulsos como `this.pulse(SignalType.UPDATE)` o abortar e invocar LLMs/redes ante cualquier actualización de disposición.
    * La UCA debe **discriminar la naturaleza del cambio** antes de actuar:
      * **Cambio Semántico** (`aim.body.request`, `aim.body.context`): Modificación del propósito o contexto de negocio; justifica reevaluación cognitiva (`ADAPT` o `RECOMPOSE`).
      * **Cambio Ambiental** (`limits`): Variación de viewport o pantalla; si la composición vigente utiliza dimensiones relativas (%) o tokens semánticos compatibles, la estrategia debe ser **`KEEP`** (no llamar al LLM).
      * **Continuidad Estructural** (`aim.body.composition`): La composición vigente confirmada suministrada por el anfitrión para permitir reconciliación incremental.

---

## 4. Protocolo para Crear una Nueva UCA
 
Para añadir una nueva UCA al catálogo, cada UCA constituye su propio subdominio:
 
1. **Crear Directorio de Subdominio en Singular**:
   * Crear la carpeta `src/collection/ucas/<nombre>/`.
2. **Definir Schemas con Zod (`schema.ts`) y Tipos de Dominio (`types.ts`)**:
   * Crear `src/collection/ucas/<nombre>/schema.ts` con Zod:
     ```typescript
     import { z } from 'zod';
     export const bodySchema = z.object({
         label: z.string().optional(),
     });
     export type Body = z.infer<typeof bodySchema>;
     ```
   * En `types.ts`, re-exportar `Body` de `./schema.js` y declarar `SignalType` y `DataType`.
3. **Implementar la Clase UCA (`index.ts`)**:
   * Crear el archivo `src/collection/ucas/<nombre>/index.ts`.
   * Extender `Uca<Body>`, declarar `purpose` inline en la clase (`public static override purpose: string = '...'`) y componer `catalog(): Cooky`.
   * **`index.ts` exporta exclusivamente la clase**. Queda estrictamente prohibido re-exportar `types`, `constants` o `schema` al pie del fichero. Cada recurso se consume a través de los subpaths de `package.json` (`./types`, `./constants`, `./schema`).
4. **Suite de Pruebas Espejo Solo Bajo Petición Expresa (`tests/index.ts`)**:
   * Crear `src/collection/ucas/<nombre>/tests/index.ts` replicando exactamente el nombre del archivo testeado (`index.ts`) sin sufijo `.test`.
   * Verificar instanciación identitaria, asignación de propósito, inervación con disposición o señales y flujo reactivo.
5. **Re-exportar en el Catálogo (`src/collection/ucas/index.ts`)**:
   * Añadir la exportación:
     ```typescript
     export * from './<nombre>/index.js';
     ```
6. **Cerrar la Implementación**:
   * Comunicar los cambios y dejar las pruebas manuales al usuario. No realizar revisiones ni validaciones posteriores salvo petición expresa.

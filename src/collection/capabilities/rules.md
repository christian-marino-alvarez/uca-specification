# Normas y Reglas del Dominio Capabilities (`src/collection/capabilities/rules.md`)

Este documento establece las directrices obligatorias para el desarrollo, mantenimiento y creación de nuevas capacidades dentro del dominio `src/collection/capabilities`.

---

## 1. Responsabilidad y Naturaleza de una Capability
Una **Capability** representa una habilidad funcional o mecánica pura, terminal o interactiva, capaz de integrarse en una UCA:
* Interactúa con recursos externos o del entorno (DOM, Web Components, audio, red, temporizadores, sensores).
* Se inerva a un objetivo de eventos (`EventTarget`) provisto por la UCA u organismo contenedor.
* Escucha estímulos declarados en su `disposition.reactTo` y reacciona a través de `protected abstract react(signal: Signal)`.
* Emite cambios observables mediante pulsos nerviosos: `this.pulse(property, value)`.

---

## 2. Invariantes Ontológicas y Arquitectónicas

1. **Herencia Obligatoria**:
   * Toda clase del dominio debe heredar de `Capability<TBody>`:
     ```typescript
     import { Capability } from '../../core/capability.js';
     export class WebComponents extends Capability<WebComponentBody> { ... }
     ```
2. **Prohibición Estricta de `purpose` Propio**:
   * Las Capabilities **NO** tienen propósito teleológico (`purpose`); el propósito pertenece exclusivamente a las UCAs.
   * Las Capabilities definen un **`aim`** (objetivo operativo) compuesto por `description` y opcionalmente un `body` paramétrico dentro de su `disposition`.
3. **Nombres de Ficheros y Carpetas en Singular (Sin Redundancia de Dominio)**:
   * Nombrar en singular por el concepto funcional (`web-component/`, `audio-player/`, `timer.ts`).
   * Queda estrictamente prohibido usar el sufijo `.capability.ts` o nombres en plural (`web-components`).
   * El nombre de la clase debe ser en `PascalCase` y en singular: `WebComponent`, `AudioPlayer`, `Counter`, `Timer`.
4. **Desacoplamiento de Recursos de Dominio vs. Target Nervioso**:
   * El `target` de la capability es estrictamente nervioso (`EventTarget` para señales/impulsos).
   * Los recursos de dominio físicos o del entorno (ej. elementos HTML del DOM, sockets, buffers) deben gestionarse internamente en propiedades dedicadas de la capability (ej. `private readonly elements: Map<string, HTMLElement>`), nunca confundiéndolos con el `target` nervioso.
5. **Emisión de Señales mediante `this.pulse`**:
   * Cuando se produzca un cambio observable, la capability debe emitir la señal mediante `this.pulse(property, value)`.
6. **Invariante de Ausencia de Almacenamiento de Propiedades de Dominio**:
   * Las Capabilities **no deben almacenar propiedades de dominio como variables de estado de instancia** (`this.value`, `this.items`, etc.).
   * Son procesadores mecánicos reactivos: reciben los estímulos a través de su `react(signal: Signal)` o leen la configuración del receptor desde `this.disposition.aim.body`.
   * Los constructores son puramente identitarios (`constructor(id: string = '<default>')`) y no aceptan objetos de opciones o valores de dominio.

---

## 3. Directrices de Codificación para Agentes

1. **Límite de 10 Líneas por Función/Método**:
   * Todo método debe modularizarse para no superar las 10 líneas de código.
2. **Desestructuración Obligatoria y Prohibición de Acceso Encadenado**:
   * Desestructurar objetos, configuraciones, disposiciones y payloads al inicio de cada método (`const { aim } = this.disposition; const { tag, observedAttributes } = aim.body ?? {};`).
   * Prohibido el acceso profundo encadenado por punto (`this.disposition.aim.body?.tag`).
3. **Gestión de Tipos en `types.ts` y Prohibición de Redundancia de Namespace**:
   * Toda interfaz, tipo y configuración auxiliar propia de la capability debe residir en su `types.ts`.
   * **Prohibición de redundancia**: No prefijar tipos ni enums con el nombre del dominio (`SignalType`, `LifecycleEventType`, `Body`, `Config`), ya que el namespace o módulo ya los desambigua.
4. **Prohibición de `any`**:
   * Utilizar tipado genérico (`Capability<TBody>`) o tipos estrictos.
5. **Uso Obligatorio de Enums para Nombres de Señales y Eventos**:
   * Queda estrictamente prohibido el uso de cadenas de texto literales (*magic strings*) para identificar señales nerviosas (`'element.render'`, `'element.remove'`) o eventos de ciclo de vida (`'lifecycle.connected'`).
   * Todos los nombres de señales y eventos deben declararse como enumerados (`enum`) formales en `types.ts` (ej. `SignalType`, `LifecycleEventType`).
6. **Constantes de Dominio en `constants.ts` (Sin Redundancia)**:
   * Todos los valores por defecto, etiquetas fallback y listas inmutables de atributos deben alojarse en `constants.ts` (`DEFAULT_OBSERVED_ATTRIBUTES`, `DEFAULT_TAG`) y nombrarse de forma pura sin repetir el nombre del dominio (evitar `DEFAULT_COMPONENT_TAG`).
7. **Prohibición Estricta de Abreviaturas**:
   * Todos los identificadores deben ser completos y auto-explicativos (`observedAttributes` y nunca `observed`, `element` y nunca `el`).
8. **Orden Canónico de Miembros y Métodos en Capabilities**:
   * **Propiedades y métodos estáticos (`static`)**: Siempre en la cabecera de la clase, por encima del constructor.
   * **Propiedades de instancia**: Declaradas antes del constructor.
   * **Constructor**: `public constructor(...)`.
   * **Ciclo de vida principal (orden estricto)**:
     1. `innervate(...)`
     2. `denervate()`
     3. `react(...)`
   * **Métodos públicos / protegidos adicionales**: Justo tras el bloque del ciclo de vida (cerca del constructor).
   * **Métodos privados**: Siempre al final de la clase.
9. **Replicación Espejo de Ficheros en `tests/` (Sin Sufijo `.test`)**:
   * Toda prueba dentro del subdominio de una capability debe replicar exactamente el nombre del archivo de producción que valida, sin añadir sufijos redundantes.
   * Para `index.ts`, su suite debe denominarse estrictamente `tests/index.ts`. Para módulos auxiliares como `helpers.ts`, `tests/helpers.ts`.
10. **Definición de Señales Reactivas en `disposition.reactTo`**:
    * Las señales a las que una Capability se predispone a reaccionar se declaran directamente en el array `reactTo` de su objeto estático `disposition` utilizando el enumerado formal `SignalType`. Queda prohibido el uso de constantes independientes (`DEFAULT_SIGNALS` o `__DEFAULT_SIGNALS__`). Las entidades o UCAs que compongan la Capability consumen estas señales directamente desde `<CapabilityClass>.disposition.reactTo`.
11. **Emisión Unificada de Eventos de Interacción (`component.event`)**:
    * Para evitar proliferación de canales nerviosos y simplificar la escucha por parte de las UCAs, los eventos de interacción y del entorno (como `click`, `input`, `change`) se emiten a través de una **única propiedad de señal**: `SignalType.EVENT` (`'component.event'`).
    * El tipo concreto de evento y sus datos se encapsulan en el payload (`EventContext`: `{ id, event: string, value?: unknown, checked?: boolean, detail?: unknown }`).
    * Quien escuche únicamente se suscribe a `component.event` e inspecciona la propiedad `event` del payload y sus datos contextuales (`value`, `checked`, `detail`).
12. **Estandarización de Identificador por Defecto (`__ID__`)**:
    * El identificador por defecto de la capability en su archivo `constants.ts` debe nombrarse rigurosamente como `__ID__` (ej. `export const __ID__ = 'web-component';`, `export const __ID__ = 'equal';`), prescindiendo de prefijos redundantes como `DEFAULT_ID`.
13. **Propiedad Estática de Objetivo Operativo (`public static readonly AIM`)**:
    * Para maximizar mantenibilidad, legibilidad e introspección ontológica, el objetivo operativo descriptivo de la Capability debe residir en una propiedad estática: `public static readonly AIM: string = '...';`, ubicada en la primera posición de la clase por encima del constructor.
    * Se utiliza en la creación de su disposición o aim por defecto: `{ aim: { description: <Clase>.AIM } }`.
14. **Declaración Explícita de Puertos con Enumerado `DataType` (`inputs` y `outputs`)**:
    * Para garantizar la descubribilidad, introspección y orquestación declarativa, toda `Disposition` **DEBE** declarar formalmente qué señales de entrada acepta (`inputs`) y qué señales de salida emite (`outputs`).
    * Los tipos de datos de los puertos (`type`) deben agruparse en un enumerado formal `DataType` en el archivo `types.ts` del dominio correspondiente (sin usar cadenas mágicas ni firmas inline `{ ... }`):
      ```typescript
      public static override disposition: Disposition<Body> = {
          aim: { description: <Clase>.AIM },
          reactTo: [SignalType.EVALUATE],
          inputs: [{ signal: SignalType.EVALUATE, type: DataType.OPERANDS, description: 'Operands [a, b]' }],
          outputs: [{ signal: SignalType.EVALUATED, type: DataType.BOOLEAN, description: 'Evaluation result' }],
      };
      ```
15. **Programación Minimalista y Cero Validaciones Defensivas Redundantes**:
    * En TypeScript estricto, no saturar los métodos con comprobaciones defensivas de tipo superfluas. Confiar en los contratos de `types.ts`, desestructuración con valores por defecto y coalescencia nula (`??`).
16. **Topología Plana y Prohibición de Profundidad Excesiva de Métodos (Profundidad Máxima = 1)**:
    * El flujo interno de una Capability debe ser plano: `react(signal)` delega en un manejador específico (`handleX`), y este resuelve y emite el pulso directamente.
    * A lo sumo puede apoyarse en 1 función auxiliar terminal hoja. Queda terminantemente prohibido encadenar llamadas entre métodos auxiliares privados (`handleX -> helperA -> helperB -> helperC` está **PROHIBIDO**).
    * Prohibido crear métodos privados "trampolín" de 1-2 líneas de un solo uso; deben resolverse de forma inline directa.
17. **Construcción Declarativa Directa (Sin Bucles para Mapeos)**:
    * Prohibido fragmentar la Capability en métodos privados con bucles imperativos (`for..in`, `for..of`, `Object.entries`) para combinar o filtrar propiedades.
    * Usar siempre patrones declarativos directos (spreading condicional `...(cond && { prop })`, operadores lógicos y mapeos directos).

---

## 4. Protocolo para Crear una Nueva Capability
 
Cada capability constituye su propio subdominio dentro de `src/collection/capabilities/`:
 
1. **Crear Directorio de Subdominio en Singular**:
   * Crear la carpeta `src/collection/capabilities/<nombre>/` (ej. `web-component/`, `audio/`, `timer/`).
2. **Definir Tipos y Enums en `types.ts`**:
   * Crear `src/collection/capabilities/<nombre>/types.ts`.
   * Declarar el contrato del cuerpo (`Body`), enums de señales (`SignalType`), enums de eventos (`LifecycleEventType`) y contextos auxiliares sin prefijos redundantes de namespace.
3. **Constantes en `constants.ts` (si aplica)**:
   * Declarar valores por defecto inmutables en `src/collection/capabilities/<nombre>/constants.ts` en `SCREAMING_SNAKE_CASE`.
4. **Implementar la Clase Capability (`index.ts`)**:
   * Crear `src/collection/capabilities/<nombre>/index.ts`.
   * Extender `Capability<Body>`, implementar `constructor`, `innervate`, `denervate`, y `react(signal: Signal)`.
   * Emplear `this.pulse(property, value)` para emitir cambios observables.
5. **Crear Suite de Pruebas Espejo en su Subdominio (`tests/index.ts`)**:
   * Alojar las pruebas dentro de `src/collection/capabilities/<nombre>/tests/index.ts` replicando exactamente el nombre del archivo (`index.ts`) sin sufijo `.test`.
   * Verificar inervación, recepción reactiva de señales, emisión nerviosa (`pulse`) y desconexión limpia en denervación.
6. **Re-exportar en el Catálogo de Capabilities (`src/collection/capabilities/index.ts`)**:
   * Exportar el punto de entrada:
     ```typescript
     export * from './<nombre>/index.js';
     ```
7. **Añadir Script y Validar**:
   * Registrar o verificar el script en `package.json` (`npm run test:capabilities`).
   * Ejecutar y validar:
     ```bash
     npm test && npm run typecheck
     ```


# Directrices de Desarrollo y Gobierno para Agentes (AGENTS.md)

Este documento es el punto de entrada normativo para asistentes inteligentes y desarrolladores que operen en el repositorio **`uca-specification` (`@extensio/uca`)**.

---

## 1. Principio Fundamental de Operación por Dominios

> [!IMPORTANT]
> **OBLIGACIÓN PARA AGENTES:**
> Cada dominio funcional de la arquitectura UCA cuenta con su propio fichero **`rules.md`** que define sus invariantes ontológicas, patrones de diseño y directrices de implementación.
> 
> **Antes de generar, modificar o refactorizar código en cualquier dominio, el agente DEBE consultar y aplicar estrictamente el fichero `rules.md` del dominio correspondiente.**

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
     const { aim } = this.disposition;
     const { observedAttributes, tag } = aim.body ?? {};
     ```
4. **Prohibición de Redundancia de Dominio y Namespace en Ficheros e Identificadores**:
   * **Nombres de Ficheros y Carpetas**: Nombrar directamente en singular por el concepto funcional (ej. `web-component/`, `div.ts`, nunca `web-components/`, `web-component.capability.ts` ni `div.uca.ts`).
   * **Fichero Principal de Dominio (`index.ts`)**: Cuando un elemento posea su propia carpeta/subdominio (ej. `capabilities/web-component/`), su implementación principal y punto de entrada **DEBE** ser directamente `index.ts`. Queda terminantemente prohibido crear ficheros que repitan el nombre de la carpeta contenedora dentro de ella (ej. `web-component/web-component.ts` está **PROHIBIDO**; debe ser `web-component/index.ts`).
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
   * Obligatoriedad de bloques con llaves `{ }` en sentencias `if / else`. Prohibido el código inline sin llaves.
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
   * El archivo `constants.ts` debe re-exportarse en el `index.ts` del dominio correspondiente.
12. **Orden Canónico de Miembros y Métodos en Clases y Capabilities**:
   * **Propiedades y métodos estáticos (`static`)**: Siempre en la cabecera de la clase, por encima del constructor.
   * **Propiedades de instancia**: Justo antes del constructor.
   * **Constructor**: `public constructor(...)`.
   * **Ciclo de vida principal**:
     1. `innervate(...)`
     2. `denervate()`
     3. `react(...)`
   * **Métodos públicos y protegidos auxiliares**: Ubicados inmediatamente después del bloque del ciclo de vida, cerca del constructor.
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

---

## 4. Guía para Ayudar a Crear Nuevo Contenido en los Dominios

### ¿Cómo Crear una Nueva Capability?
1. Leer [src/collection/capabilities/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/capabilities/rules.md).
2. Declarar el tipo del cuerpo (`Body`) e interfaces en `src/collection/capabilities/<nombre>/types.ts`.
3. Crear la clase en `src/collection/capabilities/<nombre>/index.ts` heredando de `Capability<Body>`. Sin variables de estado de datos; constructor identitario.
4. Implementar `react(signal: Signal)` y emitir eventos con `this.pulse(property, value)`.
5. Exportar en `src/collection/capabilities/index.ts`.
6. Crear la suite en `src/collection/capabilities/<nombre>/tests/index.ts`.

### ¿Cómo Crear una Nueva UCA?
1. Leer [src/collection/ucas/rules.md](file:///Users/milos/Documents/workspace/uca-specification/src/collection/ucas/rules.md).
2. Declarar el tipo del cuerpo (`Body`) en `src/collection/ucas/<nombre>/types.ts`.
3. Crear la clase en `src/collection/ucas/<nombre>/index.ts` heredando de `Uca<Body>`. Sin guardar propiedades de datos; constructor identitario `super(id, purpose)`.
4. Definir `purpose` en el constructor y componer capacidades en `protected override capabilities(): Cooky`.
5. Exportar en `src/collection/ucas/index.ts`.
6. Crear la suite en `src/collection/ucas/<nombre>/tests/index.ts`.

---

## 5. Comandos de Validación Obligatorios

Tras cualquier cambio o creación de contenido, ejecutar:
```bash
npm run typecheck    # Verifica consistencia estricta de tipos en TypeScript
npm test             # Ejecuta las suites de core, capabilities y ucas
npm run build        # Compila la distribución ESM y tipos
```

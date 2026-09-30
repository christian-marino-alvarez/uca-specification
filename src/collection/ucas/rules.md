# Normas y Reglas del Dominio UCAs (`src/collection/ucas/rules.md`)

Este documento establece las directrices obligatorias para el desarrollo, mantenimiento y creación de nuevas Unidades Cognitivas Autónomas (UCAs) dentro del dominio `src/collection/ucas`.

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
2. **Propósito Obligatorio e Inmutable (`purpose`)**:
   * Toda UCA debe declarar su propósito existencial en una propiedad estática inmutable: `public static readonly PURPOSE: string = '...';`.
   * En el constructor, invoca a `super(id, <Clase>.PURPOSE)` garantizando mantenibilidad, visibilidad externa y reutilización sin strings mágicos duplicados.
3. **Declaración Fractal de Capacidades mediante `Cooky`**:
   * La UCA debe declarar sus capacidades intrínsecas sobrescribiendo el método:
     ```typescript
     protected override capabilities(): Cooky {
         const capabilityId = `${this.id}:sub-capability`;
         const body = { id: capabilityId, ... };
         const disposition = Capability.createDisposition('Descripción del aim', body, ['pattern.event']);
         const cooky: Cooky = [[CapabilityClass, disposition]];
         return cooky;
     }
     ```
   * Al inervarse la UCA (`innervate()`), estas capacidades son instanciadas, configuradas e inervadas automáticamente a su `target` nervioso.
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
     public static readonly PURPOSE: string = '<propósito teleológico inmutable>';

     public constructor(id: string = '<default-id>') {
         super(id, <Clase>.PURPOSE);
     }
     ```
6. **Invariante de Ausencia de Estado Local (Las UCAs No Guardan Propiedades)**:
   * Una UCA **no almacena estado de dominio ni propiedades en variables privadas de instancia** (`this.value`, `this.items`, etc.).
   * Las UCAs son entidades de orquestación y transducción cognitiva: **reaccionan dinámicamente a cambios de propiedades** transmitidas mediante señales (`Signal`) en su sistema nervioso (`target`) o configuradas a través de su disposición (`disposition.aim.body`).
   * Si una UCA necesita proyectar atributos iniciales hacia sus capacidades constitutivas (`Cooky`), debe extraerlos directamente de su propia disposición (`const { ... } = this.disposition.aim.body ?? {};`).

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
10. **Nomenclatura Semántica de Señales en `innervate()` (`defaultSignals`)**:
    * Las listas de señales a las que una UCA se predispone a reaccionar por defecto deben nombrarse conceptualmente como señales (`defaultSignals`), no como patrones abstractos (`defaultPatterns`). Son señales nerviosas explícitas (`Signal`), no patrones de coincidencia difusos.
11. **Propiedad Estática de Propósito (`public static readonly PURPOSE`)**:
    * Para maximizar mantenibilidad, legibilidad e introspección, el propósito de la UCA debe residir en una propiedad estática: `public static readonly PURPOSE: string = '...';`, ubicada en la primera posición de la clase por encima del constructor.
    * En el constructor identitario se referencia directamente: `super(id, <Clase>.PURPOSE);`.
12. **Estandarización de Identificador por Defecto (`__ID__`)**:
    * El identificador por defecto de la entidad dentro de su archivo `constants.ts` debe nombrarse rigurosamente como `__ID__` (ej. `export const __ID__ = 'box';`), eliminando prefijos redundantes como `DEFAULT_ID`.
13. **Declaración Explícita de Puertos de Entrada y Salida (`inputs` y `outputs`) en Disposiciones**:
    * Toda UCA declara en su `Disposition` formalmente los estímulos de entrada (`inputs`) que orquesta y las señales de dominio de salida (`outputs`) que emite hacia el bus nervioso, garantizando la descubribilidad e interconectabilidad fractal entre organismos UCA.

---

## 4. Protocolo para Crear una Nueva UCA
 
Para añadir una nueva UCA al catálogo, cada UCA constituye su propio subdominio:
 
1. **Crear Directorio de Subdominio en Singular**:
   * Crear la carpeta `src/collection/ucas/<nombre>/`.
2. **Definir Tipos de Dominio (`types.ts`)**:
   * Crear `src/collection/ucas/<nombre>/types.ts` sin redundancia de prefijos:
     ```typescript
     export interface Body {
         readonly label?: string;
     }
     ```
3. **Implementar la Clase UCA (`index.ts`)**:
   * Crear el archivo `src/collection/ucas/<nombre>/index.ts`.
   * Extender `Uca<Body>`, invocar `super(id, purpose)` en el constructor (sin opciones) y declarar `capabilities(): Cooky` vinculando las capacidades necesarias.
   * Re-exportar sus tipos: `export * from './types.js';`.
4. **Crear Suite de Pruebas Espejo en su Subdominio (`tests/index.ts`)**:
   * Crear `src/collection/ucas/<nombre>/tests/index.ts` replicando exactamente el nombre del archivo testeado (`index.ts`) sin sufijo `.test`.
   * Verificar instanciación identitaria, asignación de propósito, inervación con disposición o señales y flujo reactivo.
5. **Re-exportar en el Catálogo (`src/collection/ucas/index.ts`)**:
   * Añadir la exportación:
     ```typescript
     export * from './<nombre>/index.js';
     ```
6. **Añadir Script y Validar**:
   * Añadir el comando de prueba en `package.json` (`"test:<nombre>"` e integrarlo en `"test"`).
   * Ejecutar y validar:
     ```bash
     npm test && npm run typecheck
     ```

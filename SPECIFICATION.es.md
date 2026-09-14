# UCA — Unidad Cognitiva Autónoma (Autonomous Cognitive Unit)
*Especificación de Arquitectura (Open Specification RFC)*

[ [English](SPECIFICATION.md) | Español ]

---

## Arquitectura en Tres Niveles: Core, Arquitectura y Runtime

Para garantizar que la Unidad Cognitiva Autónoma (UCA) sea una abstracción duradera e implementable de forma universal, esta especificación diferencia estrictamente tres niveles:

```text
┌─────────────────────────────────────────────────────────────────┐
│                           UCA CORE                              │
│  Define qué es una UCA: identidad, contratos y activación.      │
│  U = (P, D, C)  |  S = (G, X)  |  compat(P, G)  |  O = F_U(S)   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITIVE ARCHITECTURE                       │
│  Define cómo un sistema organiza y compone múltiples UCAs:     │
│  Coordinación, supervisión, distribución de estado, causalidad. │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                            RUNTIME                              │
│  Define la infraestructura de ejecución y transporte:           │
│  Sobres Impulse, protocolos de mensajería, concurrencia, trazas.│
└─────────────────────────────────────────────────────────────────┘
```

Una unidad funcional es una UCA si y solo si satisface el **UCA Core**.

La Arquitectura Cognitiva y el Runtime son decisiones organizativas y de implementación; no determinan la identidad de una UCA individual.

---

# 1. UCA CORE

El UCA Core contiene estrictamente las propiedades necesarias y suficientes para identificar una unidad funcional como Unidad Cognitiva Autónoma.

---

## 1.1 Definición

Una **Unidad Cognitiva Autónoma (UCA)** es una unidad funcional acotada definida por un **propósito autónomo (`Purpose`)**.

Una UCA no se define por el algoritmo que ejecuta, por el modelo al que consulta, por el lenguaje en el que está programada ni por las estructuras de datos que procesa.

Se define por **para qué existe dentro de un sistema cognitivo**.

> Una UCA se define no por lo que ejecuta, sino por el propósito que es responsable de alcanzar.

Definición formal:

```text
U = (P, D, C)
```

Donde:
- $P$ = **Purpose** (Propósito)
- $D$ = **Disposition** (Disposición de comportamiento)
- $C$ = **Capabilities** (Capacidades operacionales)

---

## 1.2 Purpose ($P$)

El `Purpose` expresa **por qué existe una UCA**.

Es estable, persistente e independiente de ejecuciones concretas o detalles mecánicos. Define la frontera operativa y la identidad de la unidad.

- Un Purpose delimita qué dominio de responsabilidad pertenece a la unidad.
- Una UCA no puede alterar arbitrariamente su propio Purpose, ya que destruiría su identidad funcional.
- Una UCA nunca debe definirse por sus mecanismos (por ejemplo, "consultar una base de datos vectorial" o "llamar a un LLM" son mecanismos, no propósitos cognitivos).

---

## 1.3 Goal ($G$)

El `Goal` representa **qué resultado concreto debe alcanzarse en una activación determinada**.

En contraste con el Purpose:

```text
PURPOSE (P)
¿Por qué existe esta UCA? (Identidad persistente e invariante)

GOAL (G)
¿Qué resultado concreto se requiere ahora? (Contextual, transitorio, específico de la activación)
```

Una UCA siempre interpreta un Goal recibido a través del prisma de su propio Purpose.

---

## 1.4 Compatibilidad Purpose / Goal: $\text{compat}(P, G)$

Una UCA solo debe aceptar Goals que sean estrictamente compatibles con su Purpose:

```text
compat(P, G) = true
```

Si un Goal entrante cae fuera del Purpose definido para la unidad, la activación no pertenece a su dominio y debe ser rechazada o redirigida.

Esta restricción asegura que una UCA permanezca acotada y especializada, evitando que degenere en un agente monolítico e ilimitado. La especificación no prescribe un algoritmo o umbral numérico específico para evaluar dicha compatibilidad.

---

## 1.5 Stimulus ($S$)

Una UCA se ejecuta estrictamente al recibir un `Stimulus`.

El Stimulus representa la activación cognitiva de la UCA. Formalmente:

```text
S = (G, X)
```

Donde:
- $G$ = **Goal** (resultado objetivo para esta activación)
- $X$ = **Context** (datos contextuales relevantes requeridos para interpretar y alcanzar $G$)

El Stimulus es una abstracción cognitiva. No prescribe ningún sobre de red específico, protocolo de cable ni mecanismo físico de transporte.

---

## 1.6 Context ($X$)

El `Context` contiene la información relevante requerida para que la UCA interprete y resuelva su Goal.

El contexto no debe representar una fotografía global e indiscriminada de toda la memoria del sistema. Proporciona continuidad cognitiva local entre interacciones:

```text
Outcomes previos + Evidencia activa + Entradas inmediatas ──► Context (X)
```

---

## 1.7 Observation (Observación)

Al activarse, la UCA extrae los datos cognitivamente significativos del Stimulus $(G, X)$ y de la evidencia disponible.

La `Observation` resultante captura los hechos salientes, parámetros y restricciones relevantes para resolver el Goal.

La observación no es una fase obligatoria de introspección moral; es la etapa de procesamiento de entrada que prepara a la UCA para la deliberación y la acción.

---

## 1.8 Disposition ($D$)

La `Disposition` representa las predisposiciones de comportamiento de la UCA.

No es mera configuración técnica. Condiciona cómo la UCA razona, delibera y selecciona capacidades bajo su Purpose.

Ejemplos de parámetros gobernados por la Disposition:
- tolerancia a la ambigüedad;
- sensibilidad a contradicciones;
- umbral de confianza requerido antes de emitir un resultado;
- preferencias en la selección de capacidades (ej. prioridad por heurísticas deterministas frente a inferencia probabilística);
- tolerancia al riesgo bajo incertidumbre.

---

## 1.9 Capabilities ($C$)

Las `Capabilities` son los recursos operacionales que una UCA puede aprovechar para satisfacer su Purpose.

Pueden abarcar:
- algoritmos deterministas, parsers y heurísticas;
- motores de almacenamiento, bases de datos e índices;
- herramientas externas, APIs y drivers;
- modelos predictivos, embeddings y modelos de lenguaje (LLMs);
- otras UCAs subordinadas.

Una Capability es un instrumento. Una Capability no es automáticamente una UCA.

---

## 1.10 Capacidades Terminales vs Capacidades Autónomas

Una Capability se convierte en otra UCA únicamente cuando existe un **Purpose autónomo y diferenciado**:

> Una capability se convierte en otra UCA solo cuando existe un Purpose autónomo diferenciado.
> Cuando dejan de emerger propósitos autónomos y solo restan mecanismos, se han alcanzado capacidades terminales.

Si un componente ejecuta una función algorítmica o mecánica sin un propósito cognitivo estable e independiente, permanece como una capacidad terminal.

---

## 1.11 Action ($A$)

La `Action` representa lo que la UCA ejecuta para satisfacer el Goal bajo su Purpose, condicionado por su Disposition y sus Capabilities:

```text
A = Acción seleccionada bajo (P, D, C, G, X)
```

Una Action no requiere necesariamente inferencia de un modelo de lenguaje. Puede ser computación determinista, recuperación de datos, transformación estructural o invocación de una capacidad.

---

## 1.12 Outcome ($O$)

El `Outcome` representa **lo que la Action produjo efectivamente en la realidad**:

```text
O = execute(A)
```

Distinción ontológica:
```text
GOAL (G): Lo que se pretendía alcanzar.
OUTCOME (O): Lo que la acción ejecutada produjo realmente.
```

El Outcome pertenece estrictamente a la unidad ejecutora.

---

## 1.13 Attainment ($T$)

`Attainment` representa el grado en que un Outcome satisface el Goal que originó la activación.

Principio de Separación:
> El Outcome pertenece a quien ejecuta.
> El Attainment pertenece a quien originó el Goal.

La UCA ejecutora produce el Outcome. No está obligada a autoevaluarse para dictaminar si su salida cumple la intención operacional más amplia de la entidad que la invocó. Es el emisor del Goal quien evalúa el Outcome para determinar el Attainment:

```text
O₂ = U₂(G, X)
T₁ = Evaluador_Attainment₁(G, O₂, X)
```

El Attainment es relativo al Goal del observador; no se exige una autocertificación universal o absoluta.

---

## 1.14 Reactividad Local

Una UCA es localmente reactiva:
> Ninguna activación sin un Stimulus.

Una UCA nunca se ejecuta espontáneamente sin un Stimulus entrante. Su lógica interna no despierta sin un evento activador.

*(Nota: El origen último de ese Stimulus —sea externo o interno— es una cuestión de la Arquitectura Cognitiva, no del UCA Core).*

---

## 1.15 Composición Recursiva

Las UCAs pueden componerse jerárquica y recursivamente:

```text
UCA₁ (Purpose P₁)
├── Capability A (Algoritmo)
├── Capability B (Herramienta)
└── UCA₂ (Purpose P₂)
      ├── Capability C
      └── Capability D
```

Una UCA puede utilizar a otra UCA como una de sus capacidades siempre que dicha unidad subordinada cumpla su propio Purpose autónomo y diferenciado.

---

## 1.16 Resumen del UCA Core

Conceptualmente, el UCA Core se formaliza como:

```text
Unidad:        U = (P, D, C)
Estímulo:      S = (G, X)
Contrato:      compat(P, G) = true
Ejecución:     O = F_U(S) = F(P, D, C, G, X)
```

---

# 2. COGNITIVE ARCHITECTURE (Sistemas Multi-UCA)

La Arquitectura Cognitiva define cómo se organizan, conectan y gobiernan múltiples UCAs dentro de un sistema cognitivo global.

---

## 2.1 Interacción Multi-UCA y Cadenas Causales

Cuando múltiples UCAs colaboran, el Outcome de una unidad puede formar parte del Context o detonar un Stimulus para otra unidad:

```text
UCA₁ ──► Stimulus(G₁, X₁) ──► UCA₂ ──► Outcome₂ ──► UCA₁
```

El comportamiento sistémico complejo se despliega a través de cadenas de interacción entre unidades especializadas sin requerir un controlador central omnisciente.

---

## 2.2 Fuentes de Causalidad

Aunque cada UCA es localmente reactiva (requiere un Stimulus), una Arquitectura Cognitiva puede originar estímulos a partir de:
- interacciones externas humanas o mecánicas;
- eventos sensoriales y del entorno;
- tareas programadas o temporizadores de software;
- monitores homeostáticos internos o bucles de fondo;
- eventos de arranque del sistema.

La restricción de *causalidad estrictamente externa* es una decisión de diseño para sistemas específicos, no un requisito universal del UCA Core.

---

## 2.3 Patrón Opcional: Coordinación y Dispatch

Un sistema cognitivo **PUEDE** definir una UCA cuyo Purpose sea coordinar o distribuir estímulos entre unidades especializadas:

```text
                  UCA (Coordinador)
                /        |        \
               ↓         ↓         ↓
             UCA₁      UCA₂      UCA₃
```

De existir, el alcance del coordinador está estrictamente acotado por su Purpose definido de coordinación. Los sistemas pueden optar alternativamente por coreografía descentralizada, topologías en pipeline o comunicación punto a punto.

---

## 2.4 Patrón Opcional: Supervisión y Preservación de Coherencia

Un sistema cognitivo **PUEDE** definir una o varias UCAs cuyo Purpose autónomo implique monitorizar la coherencia del comportamiento, diagnosticar desviaciones o adaptar disposiciones:

```text
UCA de Supervisión
├── Capacidad / UCA de Diagnóstico (Identifica causas raíz de desviaciones)
└── Capacidad / UCA de Adaptación (Calcula ajustes en las disposiciones)
```

---

## 2.5 Patrón Opcional: Identidad y Autorrepresentación

Un sistema cognitivo **PUEDE** definir una UCA cuyo Purpose sea mantener y articular una representación coherente de la identidad, límites y rol del sistema.

Sistemas especializados o desatendidos pueden operar sin una UCA de Identidad explícita.

---

## 2.6 Patrón Opcional: Almacenes de Conocimiento y Memoria

Un sistema cognitivo **PUEDE** definir una o varias UCAs cuyo Purpose sea la curación, indexación y recuperación contextual de conocimiento adquirido.

---

## 2.7 Estrategias de Estado: Contexto Dinámico frente a Estado Global

Una Arquitectura Cognitiva puede seleccionar cómo se organiza el estado:
- **Estado Distribuido**: El estado emerge de las UCAs activas, sus Dispositions individuales y los Contextos activos.
- **Contexto Sintetizado**: El contexto se construye dinámicamente bajo demanda a partir de los Outcomes de las unidades.
- **Estado Global / Blackboard**: Se mantiene un árbol o pizarra de estado compartido para rastrear variables operacionales globales.

UCA no exige la eliminación del estado global, ni exige su presencia; es una decisión de arquitectura de implementación.

---

## 2.8 Políticas de Adaptación: Mutación de Purpose frente a Adaptación de Disposition

El modelo UCA distingue dos niveles de adaptación:

1. **Mutación de Purpose**: Cambiar para qué existe una unidad. Esto está **prohibido** dentro de una UCA estable, ya que altera la identidad funcional de la unidad.
2. **Adaptación de Disposition**: Ajustar las predisposiciones de comportamiento ($D$) bajo un Purpose ($P$) invariante.

Una Arquitectura Cognitiva puede adoptar diferentes políticas de adaptación:
- **Adaptación Supervisada**: Solo unidades supervisoras dedicadas pueden alterar la Disposition de unidades destino.
- **Adaptación Auto-sintonizada**: Una unidad puede poseer una capacidad de aprendizaje interna que ajuste sus propios parámetros de Disposition a partir del feedback de rendimiento, siempre que su Purpose permanezca estrictamente invariante.

---

# 3. RUNTIME (Infraestructura)

El Runtime suministra la infraestructura técnica de ejecución y comunicación. Está completamente desacoplado de las definiciones cognitivas.

---

## 3.1 Mecanismos de Transporte

La transferencia de un Stimulus o un Outcome puede implementarse mediante:
- llamadas a funciones asíncronas directas;
- paso de mensajes bajo el modelo de actores;
- buses de eventos o tópicos publish-subscribe;
- colas persistentes de mensajes;
- sockets de streaming o transportes HTTP/gRPC;
- estructuras de memoria compartida.

La tecnología de transporte no afecta a la conformidad con UCA.

---

## 3.2 El Impulse: Sobre de Transporte

Un `Impulse` es un sobre opcional de infraestructura utilizado por las capas de transporte para enrutar activaciones y metadatos operacionales:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── payload (Stimulus | Outcome | metadatos)
```

> **El Impulse es infraestructura, no cognición.**

Una implementación UCA puede operar con o sin una abstracción explícita de Impulse.

---

## 3.3 Trazabilidad, Concurrencia y Aislamiento de Fallos

Las implementaciones de runtime habitualmente gestionan:
- **Trazabilidad**: Propagación de identificadores de transacción (`traceId`, `parentImpulseId`) para permitir auditorías;
- **Concurrencia**: Gestión de colas de ejecución, hilos o planificadores de actores;
- **Aislamiento de Fallos**: Manejo de tiempos límite (timeouts), reintentos y contención de fallos sin afectar al sistema global.

---

# 4. HIPÓTESIS EXPERIMENTALES Y PREGUNTAS ABIERTAS

Los conceptos de esta sección representan hipótesis de investigación exploratorias y preguntas abiertas. No constituyen hechos demostrados ni requisitos normativos de UCA.

---

## 4.1 Hipótesis: Cognición Emergente

Se plantea como hipótesis que el comportamiento cognitivo complejo no requiere residir de forma centralizada en un único modelo monolítico. Capacidades cognitivas robustas pueden **emerger** de la interacción contextual orientada a propósitos entre unidades especializadas.

---

## 4.2 Hipótesis: Proactividad Emergente

Aunque cada UCA individual es localmente reactiva a un Stimulus, un conjunto de UCAs interactuando puede exhibir un comportamiento que aparenta ser proactivo ante un observador externo a medida que las unidades detonan activaciones subsiguientes.

---

## 4.3 Hipótesis: Aprendizaje Estructural mediante Interacción

Se plantea como hipótesis que los sistemas pueden lograr una mejora conductual adaptativa sin reentrenar pesos de modelos y sin modificar código fuente, mediante el ajuste dinámico de las Dispositions en respuesta a la retroalimentación del entorno.

---

## 4.4 Exploración: Plasticidad Inter-UCA (Concepto de Sinapsis)

La adaptación actual se enfoca en la **adaptación intra-unidad** ($\Delta D$).

Un área activa de investigación explora la **plasticidad relacional inter-unidad** (ajuste dinámico de ponderaciones de ruta, afinidad o topología de comunicación entre unidades):

```text
Plasticidad INTRA-UCA:  ΔDisposition (Modifica umbrales internos de la unidad)
Plasticidad INTER-UCA:  ΔRelación(UCA_i, UCA_j) (Modifica conectividad y afinidad)
```

La formalización y estabilidad de la plasticidad relacional entre unidades cognitivas permanece como una pregunta abierta de investigación y queda explícitamente fuera del Core normativo de UCA.

---

## 4.5 Criterios de Validación Empírica

Para validar empíricamente el modelo UCA, una implementación debe demostrar que un conjunto de unidades es capaz de:
1. Recibir un estímulo;
2. Reaccionar según sus propósitos especializados sin un cerebro central monolítico;
3. Colaborar mediante intercambio de estímulos y outcomes;
4. Generar una acción hacia el entorno exterior;
5. Recibir retroalimentación o corrección externa respecto a dicha acción;
6. Utilizar esa evidencia para diagnosticar desviaciones;
7. Adaptar una o más Dispositions;
8. Reaccionar correctamente en un escenario futuro equivalente;
9. Lograrlo **sin modificación de código fuente**;
10. Lograrlo **sin reentrenamiento de pesos de modelos**;
11. Lograrlo **sin reglas cableadas ad-hoc diseñadas para el caso de prueba**.

---

# 5. CONFORMIDAD (CONFORMANCE)

Una entidad o componente de software cumple con el **UCA Core** si y solo si satisface la totalidad de los siguientes criterios:

1. **Purpose Autónomo**: Define un Purpose ($P$) explícito, estable e independiente de la implementación.
2. **Compatibilidad de Goal**: Acepta Goals ($G$) únicamente cuando son compatibles con su Purpose ($\text{compat}(P, G) = \text{true}$).
3. **Reactividad Local**: Se ejecuta estrictamente al recibir un Stimulus activador ($S$).
4. **Ingesta Contextual**: Consume el Context ($X$) requerido para su activación.
5. **Capabilities Acotadas**: Opera mediante un conjunto explícito de capacidades ($C$).
6. **Condicionamiento Disposicional**: Su razonamiento o selección de acción puede estar condicionado por predisposiciones de comportamiento ($D$).
7. **Formulación de Acción**: Ejecuta una Action ($A$) orientada a satisfacer el Goal.
8. **Producción de Outcome**: Produce un Outcome ($O$) que representa lo que la acción produjo efectivamente.
9. **Descomposición por Propósito**: Trata a otro componente como UCA solo si dicho componente posee su propio Purpose autónomo.

**No-requisitos para la Conformidad**:
Un componente o sistema **no** necesita ninguno de los siguientes elementos para ser conforme con UCA:
- un sobre Impulse;
- un Event Bus o Nervous System;
- un modelo de lenguaje o LLM específico;
- causalidad exclusivamente externa;
- prohibición de dispositions auto-sintonizadas;
- Sinapsis o plasticidad relacional;
- estado global o snapshots;
- un Coordinador o Supervisor centralizado.

---

# 6. TESIS CENTRAL

> **Una UCA es una unidad cognitiva funcional definida por un Purpose autónomo.**
>
> **Es autónoma en su Purpose y reactiva en su ejecución.**
>
> **Al activarse, recibe un Goal dentro de un Context, utiliza Capabilities acotadas condicionadas por su Disposition, ejecuta una Action y produce un Outcome.**
>
> **El Outcome es evaluado respecto al Goal por la entidad que originó la necesidad (Attainment).**
>
> **Las UCAs pueden componer recursivamente otras UCAs cuando existe un propósito autónomo diferenciado.**

---

## Licencia

UCA Specification © 2026 Christian Marino Alvarez.

Esta especificación y su documentación están licenciadas bajo la
Licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).

Eres libre de usar, compartir, adaptar e implementar esta especificación,
incluso con fines comerciales, siempre que se proporcione la atribución
adecuada.

Las implementaciones de software y los runtimes de referencia se licencian por separado.

# UCA — Unidad Cognitiva Autónoma (Autonomous Cognitive Unit)
*Especificación de Primitiva Funcional (Open Specification RFC)*

[ [English](SPECIFICATION.md) | Español ]

---

## 1. Introducción

### Qué es UCA

UCA define una **primitiva funcional mínima** para construir sistemas en los que el comportamiento cognitivo puede emerger mediante composición e interacción.

> **Una UCA no es cognición.**
>
> **Una UCA es una primitiva funcional mínima propuesta para componer sistemas en los que el comportamiento cognitivo puede emerger.**

Las capas conceptuales del modelo UCA:

```text
┌──────────────────────────────┐
│             UCA              │  ← primitiva funcional (normativa)
│  U = (P, D, C)              │
│  (U, S) → A → O             │
└──────────────┬───────────────┘
               │ composición
               ▼
┌──────────────────────────────┐
│       SISTEMA DE UCAs        │  ← red de primitivas funcionales
│   U₁ ↔ U₂ ↔ ... ↔ Uₙ       │
└──────────────┬───────────────┘
               │ organización
               ▼
┌──────────────────────────────┐
│    COGNITIVE ARCHITECTURE    │  ← organización de primitivas
└──────────────┬───────────────┘
               │ ejecutado por
               ▼
┌──────────────────────────────┐
│           RUNTIME            │  ← infraestructura de ejecución
└──────────────────────────────┘
```

Y de forma separada, como hipótesis de investigación:

```text
SISTEMA DE UCAs
       │
       │ hipótesis experimental
       ▼
EMERGENT COGNITIVE BEHAVIOUR
```

El comportamiento cognitivo pertenece al nivel del sistema. No es una propiedad de ninguna UCA individual.

### Qué no prescribe UCA

Esta especificación **no** prescribe:
- una topología cognitiva o jerarquía específica;
- analogías biológicas o neuroanatómicas;
- unidades cognitivas específicas que todo sistema deba instanciar;
- una tecnología de comunicación o broker de mensajes particular;
- un modelo de lenguaje, framework o proveedor específico;
- un motor de memoria o base de datos concreto;
- una representación centralizada de estado global;
- un entorno de ejecución específico;
- que ninguna UCA individual posea o demuestre cognición.

### Principio de Minimalidad

> **Un concepto pertenece al UCA Core solo si eliminarlo impide que la unidad satisfaga el contrato UCA universal.**

Antes de extender el Core, preguntar:
1. ¿Es requerido por **toda** UCA posible, independientemente del dominio, topología o implementación?
2. ¿Puede expresarse mediante Purpose, Action, Outcome o composición de UCAs?

Si (1) es NO, el concepto no pertenece al Core.
Si (2) es SÍ, el concepto debe permanecer fuera del Core.

### Principio de Composición

> **Antes de extender la primitiva UCA con un nuevo mecanismo cognitivo, intentar representar esa responsabilidad mediante composición de UCAs existentes.**

Los conceptos que puedan expresarse mediante Purpose, Action, Outcome o composición de UCAs no deben añadirse como primitivas universales del UCA.

---

## 2. UCA Core

El UCA Core define las propiedades mínimas requeridas para identificar una unidad funcional como Unidad Cognitiva Autónoma.

---

### 2.1 Definición

Una **Unidad Cognitiva Autónoma (UCA)** es una unidad funcional acotada definida por un **propósito autónomo**.

> Una UCA se define no por lo que ejecuta, sino por el propósito que es responsable de alcanzar.

```text
U = (P, D, C)
```

Donde:
- `P` — **Purpose** (Propósito): por qué existe la UCA
- `D` — **Disposition** (Disposición): predisposiciones de comportamiento
- `C` — **Capabilities** (Capacidades): recursos operacionales

El modelo mínimo de activación:

```text
U = (P, D, C)

S = (G, X)

(U, S) → A → O
```

> **No se asume que una UCA individual constituya cognición por sí misma.**

---

### 2.2 Purpose (P)

El `Purpose` expresa **por qué existe una UCA**.

Es estable, persistente e independiente de ejecuciones concretas o mecanismos específicos. Define la frontera operativa y la identidad de la unidad.

- Un Purpose delimita el dominio de responsabilidad perteneciente a la unidad.
- Una UCA no puede alterar arbitrariamente su propio Purpose, ya que destruiría su identidad funcional.
- Una UCA nunca debe definirse por sus mecanismos. Consultar una base de datos o llamar a un modelo de lenguaje son mecanismos, no propósitos cognitivos.

---

### 2.3 Disposition (D)

> **Disposition es el conjunto de parámetros que condicionan cómo una UCA utiliza sus capacidades para cumplir su Purpose.**

Una `Disposition`:
- pertenece a la UCA;
- condiciona cómo utiliza sus `Capabilities`;
- puede afectar a la efectividad con la que cumple su `Purpose`;
- puede existir tanto en UCAs deterministas como basadas en inferencia;
- no implica aprendizaje;
- no implica razonamiento;
- no implica percepción;
- no implica uso de modelos de lenguaje (LLM);
- puede ser modificada posteriormente como consecuencia de mecanismos de adaptación.

#### Capability frente a Implementación Tecnológica

Es fundamental distinguir los niveles de abstracción:

```text
Library / Model / Algorithm
            ↓
      implements/enables
            ↓
        Capability
            ↓
         used by
            ↓
           UCA
            ↓
      fulfills Purpose
```

Ejemplo:
```text
Sherpa-ONNX ──► Speech Recognition ──► Ear UCA ──► Transcribir continuamente voz humana
(Tecnología)       (Capability)         (UCA)               (Purpose)
```

`Sherpa-ONNX` es una biblioteca o implementación tecnológica. `Speech Recognition` es una capacidad primitiva. `Ear` es la UCA porque posee un `Purpose` autónomo.

#### Criterio para Determinar una Disposition

No se clasifica un parámetro como `Disposition` simplemente porque sea configurable, técnico, cognitivo o aprendido. Se aplica el siguiente criterio:

> **¿Este parámetro condiciona cómo la UCA utiliza sus capacidades para cumplir su Purpose?**

- Si la respuesta es **SÍ**, forma parte conceptualmente de su `Disposition`.
- Si la respuesta es **NO**, los detalles exclusivamente internos necesarios para implementar una Capability permanecen encapsulados en dicha implementación (ej. `modelPath`, `libraryVersion`, `binaryPath`).

Ejemplo: `Ear.disposition.framingMs` determina la granularidad temporal con la que Ear utiliza Speech Recognition y emite sus Outcomes. La efectividad de una Disposition siempre se evalúa respecto al Purpose de la UCA, sin prescribir que un valor sea universalmente mejor que otro.

El Core define que la Disposition condiciona el comportamiento. Las políticas sobre quién puede modificar la Disposition, cuándo y cómo pertenecen a la **Arquitectura Cognitiva** (§4).

---

### 2.4 Capabilities (C)

Las `Capabilities` son los recursos operacionales que una UCA puede aprovechar para satisfacer su Purpose.

> **Una UCA selecciona y utiliza las Capabilities disponibles según sea necesario para realizar una Action hacia su Goal bajo su Purpose. Otras UCAs pueden estar entre esas Capabilities.**

Pueden incluir:
- algoritmos deterministas, parsers y heurísticas;
- motores de almacenamiento, bases de datos e índices;
- herramientas externas, APIs y drivers;
- modelos predictivos, embeddings y modelos de lenguaje;
- otras UCAs cuyo Purpose autónomo proporciona la funcionalidad requerida por la Action.

Una Capability es un instrumento. Una Capability no es automáticamente una UCA. Utilizar otra UCA como Capability no implica subordinación, jerarquía ni control irrestricto — la UCA utilizada conserva su propio Purpose y solo acepta Goals compatibles con él.

---

### 2.5 Goal (G)

El `Goal` representa **el resultado concreto requerido en una activación determinada**.

```text
PURPOSE (P)
¿Por qué existe esta UCA? — Identidad persistente e invariante.

GOAL (G)
¿Qué resultado se requiere ahora? — Contextual, específico de la activación.
```

Una UCA siempre interpreta un Goal recibido a través del prisma de su propio Purpose.

---

### 2.6 Context (X)

El `Context` contiene la información requerida para que la UCA interprete y resuelva su Goal.

El contexto no debe representar una fotografía global e indiscriminada de toda la memoria del sistema. Proporciona continuidad local entre interacciones:

```text
Outcomes previos + Evidencia activa + Entradas inmediatas ──► Context (X)
```

---

### 2.7 Stimulus (S)

Una UCA se ejecuta estrictamente al recibir un `Stimulus`:

```text
S = (G, X)
```

El Stimulus es una abstracción cognitiva. No prescribe ningún sobre de red, protocolo de cable ni mecanismo de transporte.

---

### 2.8 Compatibilidad Goal/Purpose

Una UCA solo debe aceptar Goals que sean compatibles con su Purpose.

> **Un Goal debe ser compatible con el Purpose de la UCA que lo recibe.**

Si un Goal entrante cae fuera del Purpose de la unidad, la activación no pertenece a su dominio y debe ser rechazada o redirigida.

Esta restricción asegura que una UCA permanezca acotada y especializada, evitando que degenere en un agente monolítico ilimitado.

La especificación no prescribe un método algorítmico o umbral numérico específico para evaluar la compatibilidad. El mecanismo de evaluación es una decisión de implementación.

---

### 2.9 Action (A)

La `Action` es lo que la UCA realiza en respuesta a un Stimulus para satisfacer su Goal:

```text
(U, S) → A
```

La Action está condicionada por el Purpose, la Disposition, las Capabilities de la unidad, y el Goal y Context recibidos en el Stimulus.

Una Action no requiere necesariamente inferencia de un modelo de lenguaje. Puede ser computación determinista, recuperación de datos, transformación estructural o invocación de una capacidad.

---

### 2.10 Outcome (O)

El `Outcome` representa **lo que la Action produjo efectivamente**:

```text
A → O
```

Distinción ontológica:
```text
GOAL (G):    Lo que se pretendía alcanzar.
OUTCOME (O): Lo que la Action ejecutada produjo realmente.
```

El Outcome pertenece estrictamente a la unidad ejecutora.

#### Outcomes Parciales y Streaming

Una UCA no está obligada a producir un único Outcome final. Una activación puede emitir múltiples Outcomes parciales de forma continua (streaming):

```text
Stimulus
   ↓
  UCA
   ↓
Outcome₁
Outcome₂
Outcome₃
...
```

En sistemas de flujo continuo (como audio o procesamiento en tiempo real), cada Outcome parcial refleja un fragmento discreto de resultado generado bajo el Purpose de la UCA durante el curso de su Action.

---

### 2.11 Reactividad Local

> **Ninguna activación sin un Stimulus.**

Una UCA nunca se ejecuta espontáneamente. Actúa estrictamente en respuesta a un Stimulus.

El origen último de ese Stimulus —externo o interno— es una cuestión de la Arquitectura Cognitiva (§4), no del UCA Core.

---

### 2.12 Frontera de la UCA

**Sobre "Autónoma"**

El término `Autónoma` no debe interpretarse como:
- autoejecutante sin un Stimulus;
- autoplanificadora o autoactivadora;
- un agente de propósito general;
- conciencia independiente.

> Una UCA es autónoma en su Purpose y reactiva en su ejecución.

La autonomía pertenece al Purpose: la unidad posee su propio dominio funcional acotado. La ejecución permanece estrictamente reactiva.

**Sobre "Cognitiva"**

El término `Cognitiva` no afirma que una UCA individual:
- piense o comprenda;
- sea consciente o inteligente;
- posea cognición independiente.

Indica que la abstracción está diseñada para componer responsabilidades funcionales dentro de sistemas cognitivos. El comportamiento cognitivo puede ser una propiedad emergente de un sistema de UCAs compuesto — no una propiedad intrínseca de ninguna unidad individual.

---

### 2.13 Resumen

El modelo mínimo completo de una UCA individual:

```text
Estructura:   U = (P, D, C)
Estímulo:     S = (G, X)
Restricción:  El Goal debe ser compatible con el Purpose
Activación:   (U, S) → A → O
```

---

## 3. Composición de UCAs

Esta sección define cómo las UCAs individuales pueden relacionarse y combinarse para formar sistemas más complejos. La composición es el mecanismo mediante el cual la complejidad cognitiva se construye fuera de la primitiva Core.

> **La composición recursiva de UCAs es uso de Capabilities, no orquestación centralizada.**

Una UCA solo necesita conocer las Capabilities disponibles para ella. No necesita conocer la topología global de UCAs del sistema. La composición permanece local y recursiva.

---

### 3.1 UCA como Capability

Una UCA puede utilizar otra UCA como una de sus Capabilities cuando esa unidad cumple su propio Purpose autónomo y diferenciado. No existe diferencia estructural entre utilizar una Capability técnica y utilizar una UCA como Capability, salvo que esta última conserva su propio Purpose y solo acepta Goals compatibles con él:

```text
UCA A
────────────────────
Purpose A
Disposition A

Capabilities
├── algoritmo
├── herramienta
└── UCA B
      │
      ├── Purpose B      ← Purpose autónomo propio de UCA B
      ├── Disposition B
      └── Capabilities B
```

Utilizar UCA B como Capability significa:
- UCA A requiere UCA B para realizar su Action.
- UCA A no coordina, orquesta ni controla a UCA B.
- Cualquier Goal que UCA A envíe a UCA B debe ser compatible con Purpose B.

---

### 3.2 Capacidades Terminales

> Una Capability se convierte en otra UCA solo cuando existe un Purpose autónomo diferenciado.
> Cuando dejan de emerger propósitos autónomos y solo restan mecanismos, se han alcanzado capacidades terminales.

Si un componente ejecuta una función mecánica o algorítmica sin un Purpose estable e independiente, permanece como capacidad terminal y no debe modelarse como UCA.

---

### 3.3 Relaciones Outcome → Stimulus

El Outcome de una UCA puede formar parte del Context o detonar un Stimulus para otra:

```text
UCA A
   │
   └── Outcome ──► Stimulus
                       │
                       ▼
                     UCA B
                       │
                       └── Outcome ──► ...
```

El comportamiento sistémico complejo se despliega a través de cadenas de interacción entre unidades especializadas. No se requiere ningún coordinador central para que esta cadena funcione.

---

### 3.4 Composición Causal

Mediante relaciones Outcome → Stimulus, las UCAs forman cadenas causales:

```text
Uᵢ → Aᵢ → Oᵢ → Stimulus → Uⱼ → Aⱼ → Oⱼ → Stimulus → Uₖ → ...
```

Esta notación describe un patrón relacional de comportamiento arquitectónico. No es una definición matemática formal.

---

### 3.5 Uso Recursivo de Capabilities

Una UCA puede exponer otra UCA como una de sus Capabilities. Esa UCA puede utilizar recursivamente sus propias Capabilities para cumplir su Goal. Esta relación recursiva no implica coordinación centralizada, jerarquía ni control irrestricto.

```text
UCA A (Purpose A)
├── Capability X
└── UCA B (Purpose B)
      ├── Capability Y
      └── UCA C (Purpose C)
            └── Capability Z
```

Durante una activación:

```text
Stimulus A
    ↓
  UCA A
    ↓
  Action A requiere UCA B
    │
    └── Stimulus B
            ↓
          UCA B
            ↓
          Action B requiere UCA C
            │
            └── Stimulus C
                    ↓
                  UCA C → Action C → Outcome C
                    ↓
          Outcome C disponible para Action B
            ↓
          Outcome B
    ↓
  Outcome B disponible para Action A
    ↓
  Outcome A
```

Esto significa:
- A *requiere* B para realizar su Action.
- B *requiere* C para realizar su Action.
- A no coordina a B. A no conoce ni controla a C.
- Cada unidad permanece acotada por su propio Purpose.

---

## 4. Arquitectura Cognitiva

La Arquitectura Cognitiva define cómo múltiples UCAs se organizan, conectan y gobiernan dentro de un sistema global.

La Arquitectura Cognitiva es distinta de la primitiva UCA. Organiza y conecta primitivas UCA; no modifica qué es una UCA. La definición normativa de una UCA pertenece exclusivamente al UCA Core.

---

### 4.1 Attainment

`Attainment` representa el grado en que un Outcome satisface el Goal que originó la activación.

> El Outcome pertenece a quien ejecuta.
> El Attainment pertenece a quien originó el Goal.

La UCA ejecutora produce el Outcome. No está obligada a autoevaluarse para dictaminar si su salida cumple la intención operacional de la entidad que la invocó.

Una Arquitectura Cognitiva puede definir UCAs cuyo Purpose implique evaluar Outcomes frente a Goals:

```text
Originador del Goal (UCA₁)
        │
        ▼
Ejecutor (UCA₂)
        │
        └── Outcome
                │
                ▼
Evaluador (UCA₃)
                │
                └── Evaluación de Attainment
```

La evaluación se construye mediante composición. No se requiere ningún evaluador especial en el Core.

---

### 4.2 Percepción y Observación

La percepción y la observación **no** son fases universales del ciclo de activación de una UCA. Son responsabilidades cognitivas que pueden modelarse mediante composición.

Una UCA cuyo Purpose requiere percibir información del entorno realiza ese trabajo a través de su Action:

```text
entorno ──► Stimulus
                │
                ▼
      UCA B (Purpose: percibir)
                │
                └── Action: percibir
                        │
                        └── Outcome: representación percibida
```

La observación sigue el mismo patrón:

```text
Stimulus → UCA C (Purpose: observar e interpretar)
                    │
                    └── Action: observar
                            │
                            └── Outcome: observación estructurada
```

No existe ningún `Observer` especial en la estructura UCA. Cada una de estas unidades es simplemente `U = (P, D, C)` con un Purpose que justifica su Action.

---

### 4.3 Adaptación de Disposition

El Core define que la Disposition condiciona el comportamiento de una unidad. El Core no establece:
- que una UCA deba modificar su propia Disposition;
- que una UCA no deba modificar su propia Disposition.

Las políticas sobre quién puede modificar la Disposition, cuándo y en base a qué evidencia son decisiones arquitectónicas.

Una Arquitectura Cognitiva puede definir una UCA cuyo Purpose implique evaluar y adaptar la Disposition de otra:

```text
UCA A (Disposition D₀)
   │
   └── Action → Outcome Oₐ
                    │
                    ▼
     Stimulus → UCA B (Purpose: evaluar y adaptar comportamiento)
                    │
                    └── Action → Outcome
                                     │
                               D₀ → D₁  (aplicado a UCA A)
```

> La adaptación puede emerger de interacciones entre UCAs en lugar de ser una fase intrínseca del ciclo de vida de toda UCA.

**Distinción**:

```text
Mutación de Purpose        ← prohibida; cambia la identidad funcional
Adaptación de Disposition  ← permitida bajo Purpose invariante
```

Una UCA antes y después de la adaptación:

```text
t₀:  U = (P₀, D₀, C₀)
t₁:  U = (P₀, D₁, C₀)   ← Purpose sin cambios; Disposition evolucionada
```

---

### 4.4 Coordinación como Uso de Capabilities

La coordinación no es un rol UCA privilegiado. No existe ningún Coordinador ni Dispatcher predefinido en el modelo UCA.

Si un sistema identifica un Purpose autónomo real que requiera integrar Outcomes de múltiples UCAs — por ejemplo, sintetizar resultados parciales o secuenciar activaciones en función del contexto — ese Purpose puede justificar una UCA. Pero la UCA no es coordinadora por naturaleza: es una unidad cuya Action utiliza otras UCAs como Capabilities:

```text
UCA A
────────────────────
Purpose: sintetizar resultados de las fuentes de conocimiento disponibles

Capabilities
├── UCA B (Purpose B)
├── UCA C (Purpose C)
└── UCA D (Purpose D)
```

UCA A realiza su Action utilizando B, C y D como Capabilities. No las orquesta. Cada una de B, C y D conserva su propio Purpose y solo acepta Goals compatibles con él.

---

### 4.5 Análisis de Comportamiento Mediante Composición

La supervisión no es un rol UCA privilegiado. No existe ningún Supervisor predefinido en el modelo UCA.

Si un sistema identifica un Purpose autónomo que requiera analizar Outcomes en busca de desviaciones o determinar si se necesita adaptación de comportamiento, ese Purpose puede justificar una UCA. Esa UCA no es supervisora: es simplemente una unidad cuya Action utiliza las Capabilities disponibles (que pueden incluir otras UCAs) para cumplir su propio Purpose:

```text
UCA A
   │
   └── Outcome A
           │
           ▼
       Stimulus
           │
           ▼
         UCA B
Purpose: determinar si la evidencia disponible
requiere adaptación de comportamiento.
           │
           └── Action B → Outcome B
                               │
                         D₀ → D₁  (posible cambio de Disposition)
```

UCA B no necesita llamarse Supervisor. Es una UCA cuyo Purpose justifica su Action.

---

### 4.6 Identidad

Un sistema cognitivo **puede** definir una UCA cuyo Purpose sea mantener y articular una representación coherente de la identidad, límites y rol del sistema.

La identidad no es un requisito fundamental de toda UCA. Los sistemas especializados o desatendidos pueden operar sin una UCA de Identidad explícita.

---

### 4.7 Almacenes de Memoria

Un sistema cognitivo **puede** definir UCAs cuyo Purpose sea la curación, indexación y recuperación contextual de conocimiento adquirido.

---

### 4.8 Estrategias de Estado

Una Arquitectura Cognitiva puede elegir cómo se organiza el estado:
- **Estado Distribuido**: emerge de las UCAs activas, sus Dispositions y los Contexts activos.
- **Contexto Sintetizado**: construido bajo demanda a partir de los Outcomes de las unidades.
- **Estado Global / Blackboard**: árbol de estado compartido para variables operacionales globales.

UCA no prescribe ninguna estrategia de estado particular.

---

### 4.9 Fuentes de Causalidad

Aunque toda UCA es localmente reactiva, una Arquitectura Cognitiva puede originar Stimuli a partir de:
- interacciones externas humanas o mecánicas;
- eventos sensoriales y del entorno;
- tareas programadas o temporizadores de software;
- monitores homeostáticos internos o bucles de fondo;
- eventos de arranque del sistema.

La causalidad estrictamente externa es una decisión de diseño arquitectónico, no un requisito universal de UCA.

---

## 5. Runtime (Infraestructura)

El Runtime suministra la infraestructura técnica de ejecución y comunicación. Está completamente desacoplado de las definiciones cognitivas.

---

### 5.1 Mecanismos de Transporte

La transferencia de un Stimulus o un Outcome puede implementarse mediante:
- llamadas a funciones asíncronas directas;
- paso de mensajes bajo el modelo de actores;
- buses de eventos o tópicos publish-subscribe;
- colas persistentes de mensajes;
- sockets de streaming o transportes HTTP/gRPC;
- estructuras de memoria compartida.

La tecnología de transporte no afecta a la conformidad con UCA.

---

### 5.2 El Impulse: Sobre de Transporte

Un `Impulse` es un sobre opcional de infraestructura utilizado por las capas de transporte para enrutar activaciones y metadatos operacionales:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── payload  (Stimulus | Outcome | metadatos)
```

> **El Impulse es infraestructura, no cognición.**

El Stimulus `(G, X)` es una abstracción cognitiva. El Impulse es una posible representación en runtime de ese concepto. Una implementación UCA puede operar con o sin una abstracción Impulse explícita.

---

### 5.3 Event Bus

Un bus de eventos es un mecanismo opcional de runtime que puede facilitar el desacoplamiento, el despacho asíncrono y el fan-out entre UCAs.

> Un runtime basado en eventos puede soportar desacoplamiento, concurrencia y aislamiento de fallos según su implementación.

Un Event Bus no es requerido para la conformidad UCA. El contrato UCA no hace ninguna suposición sobre cómo se transmiten Stimuli y Outcomes.

---

### 5.4 Trazabilidad y Correlación

Las implementaciones de runtime habitualmente propagan identificadores de transacción (como `traceId` o `parentImpulseId`) a través de fronteras asíncronas para habilitar auditoría y depuración.

La trazabilidad es una responsabilidad del runtime y no afecta a la identidad semántica de una UCA.

---

### 5.5 Concurrencia

La gestión de colas de ejecución, hilos, planificadores de actores y activaciones paralelas es una responsabilidad del runtime. El Core no hace suposiciones sobre la concurrencia de ejecución.

---

### 5.6 Aislamiento de Fallos

El manejo de timeouts, reintentos y contención de fallos sin afectar al sistema global es una responsabilidad del runtime. Las estrategias de aislamiento de fallos no afectan a la conformidad con UCA.

---

## 6. Hipótesis Experimentales

Los conceptos de esta sección representan hipótesis de investigación exploratorias y preguntas abiertas. No constituyen hechos demostrados ni requisitos normativos de UCA.

---

### 6.1 Cognición Emergente

Se plantea como hipótesis que el comportamiento cognitivo complejo no requiere residir de forma centralizada en un único modelo monolítico. Capacidades cognitivas útiles **pueden emerger** de la interacción contextual orientada a propósitos entre unidades especializadas.

Esto sigue siendo una hipótesis. No se afirma que el comportamiento cognitivo emerja necesariamente de cualquier conjunto de UCAs, ni que UCA sea una condición necesaria o suficiente para la cognición.

---

### 6.2 Proactividad Emergente

> El comportamiento proactivo a nivel del sistema puede emerger de cadenas de interacciones reactivas entre UCAs.

Aunque cada UCA individual es localmente reactiva, un conjunto de UCAs interactuando puede exhibir un comportamiento que aparenta ser proactivo ante un observador externo. Esta es una hipótesis a verificar empíricamente.

---

### 6.3 Adaptación Distribuida

> La adaptación puede emerger de interacciones entre UCAs en lugar de ser una fase intrínseca del ciclo de vida de toda UCA.

El patrón causal:

```text
Oᵢ → Stimulus → Uⱼ → Aⱼ → Oⱼ → ΔDᵢ
```

describe un patrón relacional de comportamiento arquitectónico: el Outcome de una UCA estimula a otra, cuya Action resulta en un cambio de Disposition en la primera. Esta es una hipótesis sobre lo que es alcanzable mediante composición.

---

### 6.4 Aprendizaje Estructural mediante Interacción

Se plantea como hipótesis que los sistemas pueden lograr una mejora conductual adaptativa sin reentrenar pesos de modelos ni modificar código fuente, mediante el ajuste dinámico de las Dispositions en respuesta a la retroalimentación del entorno.

---

### 6.5 Plasticidad Relacional (Sinapsis)

La adaptación actual se enfoca en el ajuste intra-unidad de la Disposition. Una pregunta activa de investigación explora la plasticidad relacional inter-unidad: ajuste de ponderaciones de ruta, afinidad o topología de comunicación entre unidades:

```text
INTRA-UCA:  ΔDisposition(Uᵢ)
INTER-UCA:  ΔRelación(Uᵢ, Uⱼ)
```

Una abstracción `Synapse` representaría una propiedad persistente de la relación entre dos UCAs que no puede modelarse adecuadamente como estado, Disposition o Capability de ninguna de las unidades individualmente.

Si dicha abstracción es necesaria permanece como pregunta abierta. Synapse no forma parte del Core normativo de UCA.

---

### 6.6 La Hipótesis Falsable

> **¿Puede emerger comportamiento cognitivo de la interacción de UCAs acotadas por propósito, mientras cada unidad individual permanece estructuralmente limitada a `U = (P, D, C)` y conductualmente limitada a `(U, S) → A → O`?**

Esta es la pregunta experimental central que plantea UCA. Es falsable:
- Un sistema que satisfaga todos los criterios de conformidad UCA pero no produzca ningún comportamiento cognitivo reconocible constituye evidencia en contra de la hipótesis.
- Un sistema que demuestre comportamiento cognitivo mientras cada unidad satisface únicamente el contrato mínimo constituye evidencia positiva.

---

### 6.7 Criterios de Validación Empírica

Para validar empíricamente el modelo UCA, una implementación debe demostrar que un conjunto de unidades es capaz de:
1. Recibir un estímulo;
2. Reaccionar según sus propósitos especializados sin un controlador central monolítico;
3. Colaborar mediante intercambio de Stimuli y Outcomes;
4. Generar una acción hacia el entorno exterior;
5. Recibir retroalimentación respecto a dicha acción;
6. Utilizar esa evidencia para diagnosticar desviaciones;
7. Adaptar una o más Dispositions;
8. Reaccionar correctamente en un escenario futuro equivalente;
9. Lograrlo **sin modificación de código fuente**;
10. Lograrlo **sin reentrenamiento de pesos de modelos**;
11. Lograrlo **sin reglas cableadas ad-hoc** diseñadas para el caso de prueba.

---

## 7. Ejemplos

Los ejemplos de esta sección son no normativos. Ilustran cómo las responsabilidades cognitivas pueden modelarse mediante composición de UCAs sin añadir nuevas primitivas al Core.

### 7.1 UCA Atómica Determinista y Streaming (Ear UCA)

Una UCA puede ser completamente determinista y no requerir inferencia ni modelos de lenguaje para cumplir su Purpose:

```text
EAR UCA

Purpose
│
└── Transcribir continuamente voz humana.

Capability
│
└── Speech Recognition (ej. implementada mediante un motor de ASR local, Whisper, o pipeline de audio)

Disposition
│
└── framingMs (granularidad temporal del procesamiento, ej. 50ms vs 500ms)

Outcome (Stream continuo)
│
└── Chunk { startAt, endAt, text }
```

Ejemplo de Outcomes parciales emitidos:
```text
{ startAt: 0,   endAt: 400,  text: "Creo que" }
{ startAt: 400, endAt: 850,  text: "deberíamos cambiar" }
{ startAt: 850, endAt: 1200, text: "esta arquitectura" }
```

**Lo que Ear NO determina:**
- No detecta silencio (el silencio es una observación/percepción derivada de no recibir nuevos chunks en un intervalo de tiempo).
- No determina fin de turno (`userFinishedTurn`).
- No interpreta intención, significado ni relevancia.

Ear afirma estrictamente que esas voces fueron transcritas durante esos intervalos temporales.

---

### 7.2 Percepción Mediante Composición

La percepción puede ser la Action de una UCA cuyo Purpose requiere percibir e interpretar información del entorno:

```text
UCA A (Purpose: actuar)
   │
   └── Action → Outcome ──► entorno ──► Stimulus
                                            │
                                            ▼
                                 UCA B (Purpose: percibir)
                                            │
                                            └── Action: percibir
                                                    │
                                                    └── Outcome: representación percibida
```

`UCA B` es estructuralmente idéntica a cualquier otra UCA: `U = (P, D, C)`. Su Purpose requiere percepción.

---

### 7.3 Observación Mediante Composición

La observación puede ser igualmente la Action de una UCA:

```text
Stimulus → UCA C (Purpose: observar e interpretar)
                   │
                   └── Action: observar
                           │
                           └── Outcome: observación estructurada
                                           │
                                           ▼
                                       Stimulus → UCA D
```

---

### 7.4 Adaptación de Disposition Mediante Composición

Una UCA puede adaptar la Disposition de otra mediante una cadena Outcome → Stimulus estándar:

```text
UCA A (Disposition D₀)
   │
   └── Action → Outcome Oₐ
                    │
                    ▼
     Stimulus → UCA B (Purpose: evaluar y adaptar comportamiento)
                    │
                    └── Action → Outcome: ΔD
                                     │
                               D₀ → D₁  (aplicado a UCA A)
```

`UCA B` no requiere ninguna estructura especial. Su Purpose justifica su Action.

---

### 7.5 Comportamiento Emergente Mediante Composición

Una red de UCAs, cada una limitada a `(U, S) → A → O`, puede exhibir comportamiento que ninguna unidad individual contiene:

```text
                 ┌────────┐
            ┌───►│  UCA₂  │───┐
            │    └────────┘   │
            │                 ▼
        ┌────────┐        ┌────────┐
        │  UCA₁  │        │  UCA₄  │
        └────────┘        └────────┘
            ▲                 │
            │    ┌────────┐   │
            └────│  UCA₃  │◄──┘
                 └────────┘

               ↓

    comportamiento emergente del sistema
```

Esto constituye la hipótesis de comportamiento emergente (§6.1), a verificar experimentalmente.

---

## 8. Conformidad (Conformance)

Una entidad o componente de software cumple con el **UCA Core** si y solo si satisface todos los siguientes criterios:

1. **Purpose Autónomo**: Define un Purpose (`P`) explícito, estable e independiente de la implementación.
2. **Disposition Definida**: Tiene una Disposition (`D`) que condiciona su comportamiento.
3. **Capabilities Acotadas**: Opera mediante un conjunto explícito de Capabilities (`C`).
4. **Activación Reactiva**: Se ejecuta estrictamente al recibir un Stimulus (`S`).
5. **Stimulus Estructurado**: El Stimulus contiene un Goal (`G`) y un Context (`X`).
6. **Compatibilidad de Goal**: Acepta Goals solo cuando son compatibles con su Purpose.
7. **Action hacia el Goal**: Realiza una Action dirigida a satisfacer el Goal dentro de su Purpose.
8. **Producción de Outcome**: Produce un Outcome que representa lo que la Action produjo efectivamente.
9. **Descomposición por Purpose**: Trata a otro componente como UCA solo si dicho componente posee su propio Purpose autónomo.

**No-requisitos para la Conformidad**:

Un componente **no** necesita ninguno de los siguientes para cumplir con UCA:
- Observation o Perception como fases del ciclo de vida;
- Memory, Identity, Learning o Adaptation;
- un Coordinador, Dispatcher, Orquestador o Supervisor;
- un modelo de lenguaje o LLM específico;
- causalidad externa;
- un sobre Impulse;
- un Event Bus;
- Sinapsis o plasticidad relacional;
- estado global o snapshots;
- comportamiento cognitivo emergente demostrado.

La conformidad evalúa la **unidad individual** frente al contrato UCA. No evalúa si el sistema en su conjunto exhibe comportamiento cognitivo.

---

## 9. Preguntas Abiertas

Esta sección documenta preguntas abiertas no resueltas en la especificación.

### 9.1 Semántica Formal de la Compatibilidad Goal/Purpose

La especificación requiere que un Goal sea compatible con el Purpose de la UCA que lo recibe, pero no define un método algorítmico ni semántica formal para evaluar esa compatibilidad. Trabajo futuro podrá formalizarla como predicado tipado, función de distancia semántica o contrato declarativo.

### 9.2 Plasticidad Relacional Inter-UCA

Si una abstracción `Synapse` —que represente una propiedad persistente y adaptable de la relación entre dos UCAs— es necesaria o suficiente para modelar la plasticidad inter-unidad permanece como pregunta abierta. Requiere evidencia empírica de implementaciones (véase §6.5).

### 9.3 Validación Empírica de la Cognición Emergente

La hipótesis central de UCA (§6.6) no ha sido validada empíricamente todavía. Las futuras implementaciones de referencia deben diseñarse para comprobar si el comportamiento cognitivo puede emerger de unidades acotadas por propósito y limitadas a `(U, S) → A → O`.

---

## Licencia

UCA Specification © 2026 Christian Marino Alvarez.

Esta especificación y su documentación están licenciadas bajo la
Licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).

Eres libre de usar, compartir, adaptar e implementar esta especificación,
incluso con fines comerciales, siempre que se proporcione la atribución adecuada.

Las implementaciones de software y los runtimes de referencia se licencian por separado.

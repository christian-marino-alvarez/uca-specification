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

### Principios Fundamentales del Modelo

1. **Conception determina qué UCA existe.**
2. **Purpose determina aquello que la UCA persigue.**
3. **Capabilities determinan los límites de lo que la UCA puede hacer.**
4. **Disposition determina cómo esas Capabilities están constituidas y predispuestas para comportarse e interactuar.**
5. **Stimulus provoca una reacción en una UCA ya concebida.**
6. **Las Capabilities reaccionan mediante Interactions y no mediante dependencias directas entre ellas.**
7. **El Process emerge de las interacciones reactivas entre Capabilities conforme a sus Dispositions.**
8. **Outcome es la consecuencia observable de dicha actividad.**
9. **Evolution modifica la Disposition sin abandonar el Purpose ni los límites de las Capabilities.**
10. **La unidad mínima de Evolution es una Mutation atómica, limitada, observable y potencialmente reversible.**

---

## 2. UCA Core

El UCA Core define las propiedades mínimas requeridas para identificar una unidad funcional como Unidad Cognitiva Autónoma.

---

### 2.1 Definición, Concepción y Ciclo de Vida

Una **Unidad Cognitiva Autónoma (UCA)** es una unidad funcional acotada definida por un **propósito autónomo**, constituida por unas **capacidades concretas** y predispuesta por una **disposición declarativa**.

> Una UCA se define no por lo que ejecuta, sino por el propósito que es responsable de alcanzar.

```text
U = (P, D, C)
```

Donde:
- `P` — **Purpose** (Propósito): por qué existe la UCA — orienta su reacción
- `D` — **Disposition** (Disposición): condiciones constitutivas, paramétricas e interactivas — predispone su comportamiento
- `C` — **Capabilities** (Capacidades): recursos operacionales — limitan su espacio funcional

#### Conception

> **Conception es el momento en que una UCA queda constituida con un Purpose, unas Capabilities y una Disposition inicial.**

```text
Conception
    ↓
UCA
├── Purpose
├── Capabilities
└── Disposition
```

La `Conception` determina **qué UCA existe**.

Desde su `Conception`, la UCA **permanece funcionalmente vigente**. Los conceptos de estados técnicos tradicionales (`Birth`, `Start`, `Startup`, `Initialize`, `Boot`, `Ready`, `Active`, `Idle`, `Finished`, `Execute`) pertenecen a la implementación técnica del runtime y no forman parte del ciclo de vida conceptual de una UCA.

#### Ciclo de Vida Reactivo y Evolutivo

Una UCA no pasa por fases rígidas de arranque y finalización. Reacciona a los Stimuli recibidos y evoluciona ante la evidencia:

```text
                         CONCEPTION
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                           UCA                             │
│                                                           │
│  Stimulus                                                 │
│      ↓                                                    │
│  Reactive Process (dinámica emergente de Interactions)    │
│      ↓                                                    │
│  Outcome(s)                                               │
│                                                           │
│  Stimulus                                                 │
│      ↓                                                    │
│  Reactive Process                                         │
│      ↓                                                    │
│  Outcome(s)                                               │
│                                                           │
│             ...                                           │
│                                                           │
│  Evidence                                                 │
│      ↓                                                    │
│  ΔDisposition (Mutation atómica dentro de Nature)         │
│      ↓                                                    │
│  evolved Reactive Process                                 │
│      ↓                                                    │
│  evolved Outcome(s)                                       │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

> **Principio Fundamental**: Una UCA, desde su Conception, permanece funcionalmente vigente y reacciona a los Stimuli recibidos persiguiendo su Purpose dentro de los límites de sus Capabilities y conforme a la Disposition vigente de dichas Capabilities.

---

### 2.2 Purpose (P)

> **Purpose define aquello que una UCA está concebida para perseguir durante toda su existencia.**

Es estable, persistente e independiente de ejecuciones concretas o mecanismos específicos. Define la frontera operativa y la identidad de la unidad.

- Un Purpose delimita el dominio de responsabilidad perteneciente a la unidad y proporciona orientación a todas sus reacciones.
- Una UCA no puede alterar arbitrariamente su propio Purpose, ya que destruiría su identidad funcional.
- Una UCA nunca debe definirse por sus mecanismos. Consultar una base de datos o llamar a un modelo de lenguaje son mecanismos, no propósitos cognitivos.
- En activaciones reactivas continuas, el Stimulus no necesita duplicar innecesariamente el Purpose en un Goal idéntico y redundante.

---

### 2.3 Disposition (D) y Primitive Capabilities

Una UCA es una unidad concreta constituida por capacidades concretas. Una UCA no debe modelarse como una abstracción que oculta las características, constitución o parámetros de sus capacidades.

#### Definición Canónica de Disposition

> **Disposition es el conjunto de condiciones constitutivas, paramétricas e interactivas que determinan cómo están constituidas y predispuestas las Capabilities de una UCA para comportarse e interactuar mediante sus mecanismos.**

La Disposition responde a:
> *Dado este Mechanism, ¿cómo está constituido, ajustado e interconectado para comportarse?*

La Disposition debe ser:
- **declarativa**: estructurada e inspeccionable;
- **observable**: accesible para diagnóstico y análisis;
- **interpretable**: autodescriptiva para observadores evolutivos sin conocimiento hardcodeado;
- **validable**: verificable formalmente contra límites definidos;
- **mutable**: adaptable dentro del espacio válido de su naturaleza.

#### Estructura Canónica de una Primitive Capability

Una Primitive Capability se define formalmente mediante:

```text
Primitive Capability
│
├── Mechanism
│   └── procedimiento concreto que proporciona la capacidad
│
└── Disposition
    │
    ├── Properties
    │   ├── Property (Constitución y Parametrización autodescriptiva)
    │   │   ├── Purpose
    │   │   ├── Nature
    │   │   └── Value
    │   └── ...
    │
    └── Interactions
        ├── Interaction (Relaciones reactivas entre Capabilities)
        │   ├── Definition
        │   ├── Target
        │   ├── Signal
        │   └── When
        └── ...
```

En forma resumida:
- **Mechanism** = cómo funciona (qué procedimiento proporciona la capacidad).
- **Configuration** = dimensión constitutiva de Properties (cómo está constituido).
- **Parametrization** = dimensión de ajuste de Properties (cómo está ajustado).
- **Interactions** = cómo reacciona ante otras Capabilities.
- **Disposition** = `Properties` + `Interactions`.

#### Definición de Mechanism

> **Mechanism es el procedimiento concreto mediante el cual una Primitive Capability produce su capacidad funcional.**

El Mechanism describe el principio/procedimiento operativo. No representa:
- su configuración concreta;
- sus parámetros actuales;
- una clase o transform de software;
- el estado actual de comportamiento.

Ejemplo:
Para `SherpaRecognition`, el Mechanism es el *reconocimiento online de voz mediante un modelo neuronal transductor ejecutado por Sherpa-ONNX*. La implementación software puede materializar ese Mechanism mediante clases, transforms, providers o bibliotecas.

#### Anatomía de las Properties

Cada Property de una Capability es autodescriptiva y comprende:

1. **Property.Purpose**:
   > Define para qué existe la propiedad en el orden funcional.
   Permite que observadores evolutivos externos interpreten semánticamente la propiedad sin conocimiento hardcodeado específico de la Capability.

2. **Property.Nature**:
   > **Nature describe las características intrínsecas de una Property y delimita el espacio válido dentro del cual puede ser modificada (Mutation Space).**
   Nature define el tipo, mutabilidad, dominio de valores admisibles, límites y restricciones operativas. Una modificación sólo es válida si el nuevo valor pertenece a su Nature ($Value \in Nature$).

3. **Property.Value**:
   > Representa el estado concreto actual de la propiedad dentro de los límites establecidos por su Nature.

#### Anatomía de las Interactions

Las Capabilities no dependen directamente unas de otras ni son orquestadas por un procesador o pipeline central imperativo. Reaccionan mediante relaciones declaradas en sus Dispositions:

1. **Interaction.Definition**: Describe el propósito funcional de la interacción.
2. **Interaction.Target**: Identifica qué elemento externo observa la interacción (`Capability.Property`).
3. **Interaction.Signal**: Describe la información recibida por la Capability a consecuencia de la interacción para producir su reacción.
4. **Interaction.When**: Condición declarativa que determina cuándo el cambio en el Target debe provocar la reacción.

#### Ejemplo Canónico: SherpaRecognition

```text
Primitive Capability: SherpaRecognition
│
├── Mechanism
│   └── reconocimiento online de voz mediante
│       Sherpa-ONNX y un modelo neuronal transductor
│
└── Disposition
    │
    ├── Properties
    │   ├── modelDir: { Purpose: "Directorio del modelo ASR", Nature: [path, readonly], Value: "models/asr-es" }
    │   ├── modelType: { Purpose: "Arquitectura del transductor", Nature: ["zipformer2"], Value: "zipformer2" }
    │   ├── provider: { Purpose: "Backend de cómputo", Nature: ["cpu", "cuda"], Value: "cpu" }
    │   ├── sampleRate: { Purpose: "Frecuencia de muestreo requerida", Nature: [16000], Value: 16000 }
    │   ├── featureDim: { Purpose: "Dimensión de características acústicas", Nature: [80], Value: 80 }
    │   ├── numThreads: { Purpose: "Hilos paralelos de inferencia", Nature: [1..16], Value: 4 }
    │   ├── enableEndpoint: { Purpose: "Activación de corte por endpointing", Nature: [boolean], Value: true }
    │   ├── rule1MinTrailingSilence: { Purpose: "Silencio para segmentación tras habla larga", Nature: [0.5..5.0s], Value: 2.4 }
    │   ├── rule2MinTrailingSilence: { Purpose: "Silencio para segmentación tras habla corta", Nature: [0.1..2.0s], Value: 0.4 }
    │   ├── rule3MinUtteranceLength: { Purpose: "Longitud máxima de elocución", Nature: [5.0..60.0s], Value: 20.0 }
    │   ├── decodingMethod: { Purpose: "Algoritmo de búsqueda de hipótesis", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
    │   └── hotwordsScore: { Purpose: "Ponderación contextual de hotwords", Nature: [0.0..10.0], Value: 2.5 }
    │
    └── Interactions
        └── onFloatAudioReceived:
            ├── Definition: "Procesar muestras normalizadas para decodificación acústica"
            ├── Target: "PcmToFloat.output"
            ├── Signal: "Float32Array"
            └── When: "Target.hasSamples == true"
```

#### Dos Profundidades de Cambio y Adaptación en Disposition

Una Disposition puede cambiar a dos niveles de profundidad:
- **Cambio Constitutivo (`Disposition.Properties estructurales`)**: Modifica cómo está constituida la Capability (ej. `provider: cpu ──► cuda`, o cambio a otro modelo neuronal compatible).
- **Cambio Paramétrico (`Disposition.Properties de ajuste`)**: Modifica cómo está ajustada la Capability (ej. `rule2MinTrailingSilence: 0.4 ──► 0.6`, o `hotwordsScore: 2.5 ──► 3.0`).

Ambos constituyen modificaciones legítimas de la `Disposition`.

#### Identidad de una Primitive Capability

- **Identidad basada en Mechanism**: La identidad de una Primitive Capability está determinada principalmente por su `Mechanism`. Un cambio de `Disposition` (sea constitutivo, paramétrico o interactivo) modifica la constitución o ajuste de la capacidad sin crear automáticamente una nueva Capability.
- **Diferencia entre Mecanismos**: Sólo cuando cambia el Mechanism funcional debe evaluarse si estamos ante otra Capability.
  Ejemplo:
  ```text
  SherpaRecognition ≠ WhisperRecognition
  ```
  `SherpaRecognition` y `WhisperRecognition` son capacidades primitivas diferentes porque utilizan mecanismos y procedimientos operativos distintos (transductor neuronal streaming vs modelo encoder-decoder autoregresivo), aunque ambas pertenezcan a la categoría funcional `Speech Recognition`.

#### No Abstraer la Disposition de una Primitive Capability

Se descarta cualquier regla que obligue a convertir parámetros concretos de una Primitive Capability en propiedades semánticas abstractas (ej. `hotwordsScore` pertenece directamente a `SherpaRecognition.disposition.Properties.hotwordsScore` y no necesita convertirse en `contextualBias`).

> **Regla de Atomicidad**: No abstraer una Primitive Capability hasta el punto de ocultar las propiedades y constitución que determinan su comportamiento. Si para conseguir una abstracción común es necesario ocultar su mecanismo, parámetros, restricciones, posibilidades o comportamiento, dicha abstracción no debe sustituir a la Capability concreta.

#### Composición de la Disposition de una UCA

Una UCA concreta está constituida por capacidades concretas. La Disposition efectiva de una UCA surge de la composición directa de las Dispositions de las capacidades que la constituyen:

```text
Disposition(Ear)
        │
        ├── Disposition(EchoCancellation)
        │   ├── Properties
        │   └── Interactions
        ├── Disposition(AudioFraming)
        │   ├── Properties
        │   └── Interactions
        ├── Disposition(PcmToFloat)
        │   ├── Properties
        │   └── Interactions
        ├── Disposition(SherpaRecognition)
        │   ├── Properties
        │   └── Interactions
        ├── Disposition(EchoTextFilter)
        │   ├── Properties
        │   └── Interactions
        └── Disposition(EarCoherence)
            ├── Properties
            └── Interactions
```

No se duplican innecesariamente estos parámetros en una segunda estructura abstracta. La UCA conoce la constitución concreta de sus capacidades y sus respectivas Dispositions.

#### Armonización de Dispositions respecto al Purpose

Las Dispositions de las capacidades que forman una UCA no deben entenderse como configuraciones independientes. Su combinación determina el comportamiento emergente de la UCA respecto a su `Purpose`:

```text
Dispositions de las Capabilities (Properties + Interactions)
                         │
                         ▼
                    armonización
                         │
                         ▼
                 Reactive Process
                         │
                         ▼
                      Outcome(s)
                         │
                         ▼
                      Purpose
```

> **Armonizar una UCA puede requerir modificar tanto las Properties (Configuration/Parametrization) como las Interactions de las capacidades que la constituyen.**

El `Purpose` proporciona el criterio superior respecto al cual se evalúa la armonización de las capacidades.

#### Consecuencia Arquitectónica

Dos UCAs pueden compartir exactamente el mismo `Purpose` y, sin embargo, ser funcionalmente diferentes debido a su constitución concreta:

```text
Ear A
├── Purpose: transcribir continuamente voz humana
└── SherpaRecognition + Disposition A

Ear B
├── Purpose: transcribir continuamente voz humana
└── WhisperRecognition + Disposition B
```

Ambas son `Ear`. Pero no poseen necesariamente las mismas capacidades ni la misma Disposition efectiva. Su comportamiento y efectividad pueden ser distintos.

---

### 2.4 Capabilities (C) como Límites Funcionales

Las `Capabilities` son los recursos operacionales que una UCA puede aprovechar para satisfacer su Purpose y constituyen los **límites funcionales** de la unidad:

> **Las Capabilities constituyen los límites funcionales de una UCA. Una UCA sólo puede perseguir su Purpose dentro de los límites de las Capabilities que la constituyen.**

```text
possible UCA behavior ⊆ Capabilities
```

La UCA no puede inventar durante su reacción capacidades que no posee.

Pueden incluir:
- capacidades primitivas concretas (algoritmos deterministas, transforms, parsers, ASR);
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
¿Por qué existe esta UCA? — Identidad persistente e invariante que orienta toda reacción.

GOAL (G)
¿Qué resultado se requiere ahora? — Contextual, específico de la activación cuando procede.
```

Una UCA siempre interpreta un Goal recibido a través del prisma de su propio Purpose. En activaciones reactivas continuas, no se requiere fijar un Goal idéntico al Purpose en cada activación.

---

### 2.6 Context (X)

El `Context` contiene la información requerida para que la UCA interprete y resuelva su activación.

El contexto no debe representar una fotografía global e indiscriminada de toda la memoria del sistema. Proporciona continuidad local entre interacciones:

```text
Outcomes previos + Evidencia activa + Entradas inmediatas ──► Context (X)
```

---

### 2.7 Stimulus (S) e Impulse

Es fundamental mantener estrictamente separados los conceptos de infraestructura de transporte y contenido cognitivo:

```text
Impulse  = transporte (infraestructura)
Stimulus = información ante la que reacciona la UCA (cognición)
```

> **La UCA recibe un Impulse y reacciona al Stimulus transportado por él.**

```text
NervousSystem
      │
      ▼
   Impulse
      │
      └── Stimulus: (Goal, Context)
             │
             ▼
            UCA
```

El Stimulus es una abstracción cognitiva `S = (G, X)`. El Impulse es el contenedor de runtime que lo transporta.

---

### 2.8 Compatibilidad Goal/Purpose

Una UCA solo debe aceptar Goals que sean compatibles con su Purpose.

> **Un Goal debe ser compatible con el Purpose de la UCA que lo recibe.**

Si un Goal entrante cae fuera del Purpose de la unidad, la activación no pertenece a su dominio y debe ser rechazada o redirigida.

---

### 2.9 Action (A) y Reactive Process

> **El Process de una UCA es la dinámica emergente producida por las interacciones reactivas entre sus Capabilities conforme a sus Dispositions y orientada por su Purpose.**

```text
Capabilities + Dispositions ──► Reactive Interactions ──► Reactive Process ──► Outcome(s)
```

El orden y flujo efectivo de ejecución emergen de las relaciones declaradas en `Interactions`. No existe un coordinador o procesador central imperativo que ejecute secuencialmente las capacidades.

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

### 4.3 Evolution y Mutación Atómica de Disposition

El Core define que la Disposition condiciona el comportamiento y las interacciones de una unidad.

> **Evolution es la modificación acumulativa de la Disposition de una UCA dentro de los límites definidos por su Purpose, sus Capabilities y la Nature de sus Properties e Interactions.**

Distinción ontológica:
```text
Conception: Determina qué UCA existe (identidad, capacidades y disposición inicial).
Evolution:  Modifica cómo esa misma UCA se comporta e interactúa dentro de sus límites.
```

```text
Conception
     ↓
UCA₀ (Purpose, Capabilities, Disposition₀)
     │
     │ evidence
     ▼
Mutation₁ (atómica)
     ↓
Disposition₁
     │
     │ evidence
     ▼
Mutation₂ (atómica)
     ↓
Disposition₂
     │
    ...
```

#### Principio de Mutación Atómica

> **La unidad mínima de Evolution es una Mutation atómica de la Disposition.**

Una Mutation debe ser, siempre que sea posible:
- **pequeña e identificable**: focalizada en una Property o Interaction concreta;
- **limitada**: circunscrita a los límites de Nature;
- **validable**: verificable formalmente antes de su aplicación ($Value \in Nature$);
- **medible**: observable empíricamente en el Outcome;
- **reversible**: capaz de restaurarse si la evidencia es desfavorable;
- **atribuible**: rastreable respecto a la evidencia que la motivó.

#### Tipos de Mutación: Paramétrica y Estructural

1. **Mutación Paramétrica**: Ajuste del estado o valor de una Property (`Property.Value`), manteniendo Purpose, Nature e Interactions constantes:
   ```text
   SherpaRecognition.hotwordsScore: 2.5 ──► 3.0   (donde 3.0 ∈ Nature)
   ```
2. **Mutación Estructural**: Modificación de una Interaction (`Disposition.Interactions`) para alterar el flujo reactivo emergente sin modificar el código fuente de las Capabilities:
   ```text
   t₀: Capability A ──► Capability B
   t₁: Capability C ──► Capability A ──► Capability B
   ```

#### Límites Inviolables de Evolution

> **Evolution ⊆ Purpose ∩ Capabilities ∩ Nature**

- El **Purpose** es la invariante de identidad: no puede mutar.
- Las **Capabilities** son los límites funcionales: no se pueden adquirir dinámicamente capacidades no constituidas.
- La **Nature** delimita el Mutation Space de cada propiedad o interacción.

---

### 4.4 Observación Evolutiva, Optimización Local y Falsabilidad

Una Arquitectura Cognitiva puede definir una UCA especializada (ej. `Cingulate UCA`) cuyo Purpose sea evaluar evidencia y proponer mutaciones atómicas:

```text
Outcome(s) ──► Evidence ──► Cingulate UCA ──► Inferencia de Mutación ──► Validación de Nature ──► ΔDisposition
```

#### Principios de Observación Evolutiva

1. **Interpretación Declarativa sin Acoplamiento Hardcodeado**: El observador evolutivo inspecciona `Property.Purpose`, `Property.Nature`, `Property.Value` e `Interactions` (Definition, Target, Signal, When), razonando sobre la adaptación sin requerir código específico de cada Capability.
2. **Validación Estricta contra Nature**: Ninguna mutación puede aplicarse si viola la `Nature` declarada de la propiedad. La seguridad evolutiva proviene de la propia constitución declarativa.
3. **Fuera del Camino Crítico de Ejecución**: El observador evolutivo actúa de forma asíncrona, selectiva y contextual sobre evidencia acumulada. No es un árbitro síncrono ni un cuello de botella para cada reacción.
4. **Optimización Local Acotada**: El contexto de optimización permanece pequeño y localizado:
   ```text
   UCA Purpose + Capability Purpose + Property Purpose + Property Nature + Value + Evidence ──► Contexto de Optimización
   ```
5. **Falsabilidad Experimental**: Toda mutación atómica genera una hipótesis comprobable empíricamente frente al Outcome:
   ```text
   Outcome₁ > Outcome₀   (Mejora validada)
   Outcome₁ = Outcome₀   (Inocua / Sin efecto)
   Outcome₁ < Outcome₀   (Degradación detectada ──► Reversión)
   ```

---

### 4.5 Coordinación como Uso de Capabilities

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

Una UCA puede ser completamente determinista y no requerir inferencia ni modelos de lenguaje para cumplir su Purpose. `Ear UCA` ilustra cómo una UCA concreta se constituye mediante una composición de capacidades primitivas concretas con sus respectivas Dispositions armonizadas:

```text
EAR UCA

Purpose
│
└── Transcribir continuamente voz humana.

Capabilities (Capacidades Primitivas Concretas y sus Dispositions)
│
├── EchoCancellation
│   ├── Mechanism: Reducción y cancelación acústica adaptativa de eco
│   └── Disposition:
│       ├── Properties:
│       │   ├── sampleRate: { Purpose: "Frecuencia de muestreo acústico", Nature: [16000], Value: 16000 }
│       │   ├── suppressionGain: { Purpose: "Atenuación estática de eco", Nature: [0.0..1.0], Value: 0.0 }
│       │   ├── bargeInThresholdRms: { Purpose: "Umbral RMS para interrupción de voz", Nature: [50..1000], Value: 160 }
│       │   ├── echoLeakRatio: { Purpose: "Ratio de tolerancia de fuga acústica", Nature: [0.0..1.0], Value: 0.25 }
│       │   ├── maxThresholdRms: { Purpose: "Umbral máximo RMS acústico", Nature: [100..2000], Value: 450 }
│       │   ├── decayMs: { Purpose: "Tiempo de caída de atenuación", Nature: [50..2000ms], Value: 350 }
│       │   └── bargeInHoldMs: { Purpose: "Retención de estado de corte", Nature: [50..2000ms], Value: 400 }
│       └── Interactions:
│           └── onAudioInput: { Definition: "Atenuar eco de señal cruda", Target: "AudioInput.stream", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── AudioFraming
│   ├── Mechanism: Materialización temporal de la señal en fragmentos discretos
│   └── Disposition:
│       ├── Properties:
│       │   ├── sampleRate: { Purpose: "Frecuencia de muestreo", Nature: [16000], Value: 16000 }
│       │   ├── frameSize: { Purpose: "Tamaño discreto de fragmento", Nature: [160..16000], Value: 1600 }
│       │   └── emitPartialOnFlush: { Purpose: "Emitir fragmento parcial al vaciar buffer", Nature: [boolean], Value: false }
│       └── Interactions:
│           └── onCleanAudio: { Definition: "Fragmentar audio atenuado", Target: "EchoCancellation.output", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── PcmToFloat
│   ├── Mechanism: Normalización y conversión de enteros Int16 a coma flotante Float32
│   └── Disposition:
│       ├── Properties:
│       │   ├── inputType: { Purpose: "Tipo de entrada numérica", Nature: ["Int16"], Value: "Int16" }
│       │   ├── outputType: { Purpose: "Tipo de salida numérica", Nature: ["Float32"], Value: "Float32" }
│       │   └── scale: { Purpose: "Factor divisor de normalización", Nature: [32768.0], Value: 32768.0 }
│       └── Interactions:
│           └── onAudioFrame: { Definition: "Normalizar fragmento de audio a coma flotante", Target: "AudioFraming.output", Signal: "Int16Array", When: "Target.frameReady == true" }
│
├── SherpaRecognition
│   ├── Mechanism: Reconocimiento online de voz mediante modelo neuronal transductor (Sherpa-ONNX)
│   └── Disposition:
│       ├── Properties:
│       │   ├── modelDir: { Purpose: "Directorio del modelo neuronal", Nature: [path, readonly], Value: "models/asr-es" }
│       │   ├── modelType: { Purpose: "Arquitectura del transductor", Nature: ["zipformer2"], Value: "zipformer2" }
│       │   ├── provider: { Purpose: "Backend de cómputo", Nature: ["cpu", "cuda"], Value: "cpu" }
│       │   ├── sampleRate: { Purpose: "Frecuencia de muestreo acústico", Nature: [16000], Value: 16000 }
│       │   ├── featureDim: { Purpose: "Dimensión de características acústicas", Nature: [80], Value: 80 }
│       │   ├── numThreads: { Purpose: "Hilos de inferencia paralelos", Nature: [1..16], Value: 4 }
│       │   ├── enableEndpoint: { Purpose: "Detección de corte por endpointing", Nature: [boolean], Value: true }
│       │   ├── rule1MinTrailingSilence: { Purpose: "Silencio para segmentar habla larga", Nature: [0.5..5.0s], Value: 2.4 }
│       │   ├── rule2MinTrailingSilence: { Purpose: "Silencio para segmentar habla corta", Nature: [0.1..2.0s], Value: 0.4 }
│       │   ├── rule3MinUtteranceLength: { Purpose: "Longitud máxima de elocución", Nature: [5.0..60.0s], Value: 20.0 }
│       │   ├── decodingMethod: { Purpose: "Método de decodificación", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
│       │   └── hotwordsScore: { Purpose: "Ponderación contextual de hotwords", Nature: [0.0..10.0], Value: 2.5 }
│       └── Interactions:
│           └── onFloatSamples: { Definition: "Decodificar habla de muestras normalizadas", Target: "PcmToFloat.output", Signal: "Float32Array", When: "Target.hasSamples == true" }
│
├── EchoTextFilter
│   ├── Mechanism: Filtrado y atenuación léxica de transcripciones autogeneradas
│   └── Disposition:
│       ├── Properties:
│       │   ├── caseSensitive: { Purpose: "Distinción entre mayúsculas y minúsculas", Nature: [boolean], Value: false }
│       │   ├── decayMs: { Purpose: "Ventana temporal de atenuación léxica", Nature: [500..10000ms], Value: 2500 }
│       │   ├── mismatchThreshold: { Purpose: "Tolerancia de discrepancia léxica", Nature: [0..5], Value: 1 }
│       │   └── minWordLength: { Purpose: "Longitud mínima de palabra a evaluar", Nature: [1..10], Value: 3 }
│       └── Interactions:
│           └── onRawTranscript: { Definition: "Filtrar ecos textuales de transcripciones crudas", Target: "SherpaRecognition.output", Signal: "RawTranscript", When: "Target.textAvailable == true" }
│
└── EarCoherence
    ├── Mechanism: Normalización estructural y preservación de continuidad temporal de Chunks
    └── Disposition:
        ├── Properties:
        │   └── outputSchema: { Purpose: "Esquema canónico de salida", Nature: ["Chunk"], Value: "Chunk" }
        └── Interactions:
            └── onFilteredTranscript: { Definition: "Estructurar chunk coherente final", Target: "EchoTextFilter.output", Signal: "FilteredTranscript", When: "Target.isValid == true" }

Outcome (Stream continuo)
│
└── Chunk { startAt, endAt, text }
```

Flujo reactivo emergente de interacciones:

```text
AudioInput
    │ (Property changes)
    ▼
EchoCancellation (Interaction: onAudioInput)
    │ (Property changes)
    ▼
AudioFraming (Interaction: onCleanAudio)
    │ (Property changes)
    ▼
PcmToFloat (Interaction: onAudioFrame)
    │ (Property changes)
    ▼
SherpaRecognition (Interaction: onFloatSamples)
    │ (Property changes)
    ▼
EchoTextFilter (Interaction: onRawTranscript)
    │ (Property changes)
    ▼
EarCoherence (Interaction: onFilteredTranscript)
    │
    ▼
Ear Outcome: Chunk { startAt, endAt, text }
```

#### Armonización y Reactividad en Ear

Las Dispositions de las capacidades primitivas interactúan reactivamente para determinar el comportamiento emergente de Ear hacia su Purpose sin requerir un procesador o pipeline central imperativo:
- `AudioFraming.frameSize: 1600` (tamaño de fragmento de audio).
- `EchoCancellation.decayMs: 350` y `bargeInHoldMs: 400` (gestión de umbral de eco y corte).
- `SherpaRecognition.rule2MinTrailingSilence: 0.4` (segundos de silencio para cierre de segmento).
- `EchoTextFilter.decayMs: 2500` (ventana temporal de atenuación de eco textual).

Ninguna de estas capacidades primitivas se convierte en una UCA independiente mientras no posea un Purpose autónomo diferenciado. Permanecen como capacidades primitivas de Ear.

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

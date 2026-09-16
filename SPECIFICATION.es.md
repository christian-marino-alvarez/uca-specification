# UCA — Unidad Cognitiva Artificial (Artificial Cognitive Unit)
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
│  u = (p, d, C)              │
│  (u, s) → a → o             │
└──────────────┬───────────────┘
               │ composición
               ▼
┌──────────────────────────────┐
│       SISTEMA DE UCAs        │  ← red de primitivas funcionales
│   u₁ ↔ u₂ ↔ ... ↔ uₙ        │
└──────────────┬───────────────┘
               │ organización
               ▼
┌──────────────────────────────┐
│    COGNITIVE ARCHITECTURE    │  ← organización de primitivas
│                              │
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

Un caso paradigmático de aplicación de este principio es la eliminación de `Goal` del Core: si el `Purpose` ya determina universalmente aquello que la UCA persigue durante toda su existencia, una segunda abstracción universal que determine metas concretas de activación introduce redundancia teleológica y convierte la activación reactiva en una forma implícita de instrucción, por lo que queda excluida del Core.

### Principio de Composición

> **Antes de extender la primitiva UCA con un nuevo mecanismo cognitivo, intentar representar esa responsabilidad mediante composición de UCAs existentes.**

Los conceptos que puedan expresarse mediante Purpose, Action, Outcome o composición de UCAs no deben añadirse como primitivas universales del UCA.

### Principios Fundamentales del Modelo

1. **Conception determina qué UCA existe.**
2. **Purpose determina funcionalmente qué UCA es y aquello que persigue durante toda su existencia.**
3. **Capabilities determinan los límites de lo que la UCA puede hacer.**
4. **Disposition determina cómo esas Capabilities están constituidas y predispuestas para comportarse e interactuar.**
5. **Stimulus es una señal externa a la frontera de la UCA cuya recepción provoca la reacción de una UCA ya concebida.**
6. **Las Capabilities reaccionan mediante Interactions y no mediante dependencias directas entre ellas.**
7. **El Process emerge de las interacciones reactivas entre Capabilities conforme a sus Dispositions.**
8. **Outcome es la consecuencia observable de dicha actividad.**
9. **Evolution modifica la Disposition sin abandonar el Purpose ni los límites de las Capabilities.**
10. **La unidad mínima de Evolution es una Mutation atómica, limitada, observable y potencialmente reversible.**

### Notación y Gramática Formal

Esta subsección establece la notación formal canónica utilizada en las expresiones y contratos normativos de esta especificación. Su objetivo es asegurar que toda afirmación simbólica posea una interpretación unívoca y libre de ambigüedad arquitectónica.

#### 1. Principio Rector de Formalización

> **Toda expresión simbólica normativa MUST tener una semántica definida por la specification.**
>
> **Un mismo símbolo o relación MUST NOT representar conceptos arquitectónicos ontológicamente distintos dentro de expresiones normativas.**

La notación formal complementa la especificación; ninguna fórmula matemática sustituye la definición textual normativa que la acompaña.

#### 2. Entidades y Universos Formales

Se distingue rigurosamente entre una instancia conceptual individual (representada en minúsculas) y su universo o dominio de definición (representado con doble trazo o conjunto tipado):

| Dominio / Universo | Instancia | Definición Ontológica |
|---|---|---|
| $\mathbb{U}$ | $u \in \mathbb{U}$ | Instancia conceptual de una Unidad Cognitiva Artificial (UCA). |
| $\mathbb{P}$ | $p \in \mathbb{P}$ | Purpose: propósito propio, explícito e invariante de una UCA que determina qué es y qué persigue. |
| $\mathbb{D}$ | $d \in \mathbb{D}$ | Disposition: condiciones constitutivas, paramétricas e interactivas de las Capabilities. |
| $\mathbb{C}$ | $c \in \mathbb{C}$ | Capability: recurso operacional concreto. $C \subseteq \mathbb{C}$ representa el conjunto de Capabilities de $u$. |
| $\mathbb{M}$ | $m \in \mathbb{M}$ | Mechanism: procedimiento computacional operativo de una Primitive Capability. |
| $\text{Prop}$ | $\text{prop} \in \text{Prop}$ | Property: variable declarativa o paramétrica $(\text{function}, \text{nature}, \text{value})$. |
| $\text{Nat}$ | $n \in \text{Nat}$ | Nature: especificación intrínseca del espacio de mutación válido de una Property. |
| $\text{Inter}$ | $\text{inter} \in \text{Inter}$ | Interaction: relación reactiva declarada $(\text{definition}, \text{target}, \text{signal}, \text{when})$. |
| $\mathbb{S}$ | $s \in \mathbb{S}$ | Stimulus: señal externa a la frontera de la UCA cuya recepción provoca una reacción de la unidad. |
| $\mathbb{X}$ | $x \in \mathbb{X}$ | Context: información situacional o sustrato contextual de soporte (patrón opcional, §4). |
| $\mathbb{A}$ | $a \in \mathbb{A}$ | Action: ejecución operacional del proceso reactivo emergente de la UCA. |
| $\mathbb{O}$ | $o \in \mathbb{O}$ | Outcome: consecuencia observable efectivamente producida por la Action. |
| $\mathbb{M}\text{ut}$ | $\mu \in \mathbb{M}\text{ut}$ | Mutation: cambio atómico identificable sobre la Disposition. |
| $\mathbb{E}$ | $e \in \mathbb{E}$ | Evidence: observaciones y evaluaciones acumuladas sobre el comportamiento. |

> **Nota de Deprecación (Goal)**: La abstracción histórica `Goal` ($g \in \mathbb{G}$) ha sido formalmente deprecada y eliminada del modelo normativo UCA. `Goal` fue una abstracción utilizada inicialmente para representar un resultado requerido durante una activación; se elimina porque introducía una segunda fuente de dirección funcional redundante con `Purpose` y convertía la activación reactiva en una forma implícita de instrucción. El modelo normativo vigente no admite ningún concepto compensatorio de meta, objetivo o instrucción externa (`Goal`, `Objective`, `Task`, `Command` o `DesiredOutcome`).

#### 3. Relaciones Nombradas

Las expresiones normativas deben preferir relaciones explícitas con nombre frente a flechas no tipadas:

- **$\text{hasPurpose}(u, p)$**: Afirma que la UCA $u$ posee el propósito propio $p$. En toda UCA conforme: $\exists! p \in \mathbb{P} : \text{hasPurpose}(u, p)$.
- **$\text{hasDisposition}(u, d)$**: Afirma que la UCA $u$ está predispuesta por la disposición efectiva $d$.
- **$\text{hasCapability}(u, c)$**: Afirma que la capacidad $c$ pertenece al conjunto constitutivo de $u$ ($c \in C$).
- **$\text{triggers}(s, u, a)$**: Afirma que la recepción del estímulo externo $s$ por la UCA $u$ detona la acción reactiva $a$. Expresa activación reactiva estricta; NO implica orden, instrucción, intención, meta ni causalidad metafísica global.
- **$\text{produces}(a, o)$**: Afirma que la ejecución de la acción $a$ genera como consecuencia observable el outcome $o$.
- **$\text{precedes}(o_1, o_2)$**: Afirma precedencia temporal estricta ("$o_1$ ocurrió antes que $o_2$").
- **$\text{reactsTo}(\text{target}, \text{change})$**: Afirma una relación reactiva declarada donde una Capability o interacción responde a un cambio local observable.
- **$\text{satisfies}(v, n)$**: Afirma que el valor $v$ cumple las restricciones y el tipo declarados por la Nature $n$ ($v \in \text{validDomain}(n)$).

#### 4. Semántica de Flechas y Operadores

- **Flechas en diagramas informativos**: Las flechas no etiquetadas ($\to$, $\longrightarrow$, $\downarrow$) en diagramas informativos o conceptuales indican **únicamente dirección visual de lectura**. NO establecen por sí mismas causalidad formal, producción, reacción, transformación ontológica, transporte ni precedencia temporal.
- **Flechas en expresiones normativas**: Toda flecha utilizada normativamente es una abreviatura (*shorthand*) de una relación con nombre definida:
  - $a \to o \iff \text{produces}(a, o)$.
  - $(u, s) \to a \iff \text{triggers}(s, u, a)$.
  - $(u, s) \to a \to o \iff \text{triggers}(s, u, a) \land \text{produces}(a, o)$.
- **Prohibición del operador $+$ pseudoformal**: El símbolo $+$ no debe utilizarse normativamente para denotar combinación, coexistencia o emergencia. Expresiones como $\text{Capabilities} + \text{Dispositions} \to \text{Process}$ se sustituyen por descripciones relacionales explícitas: el Process emerge de las relaciones reactivas entre Capabilities conforme a sus Dispositions.
- **Semántica estricta de $\Delta$**: El símbolo $\Delta$ denota exclusivamente la diferencia o cambio entre dos estados identificables ($\Delta D = \text{difference}(D_0, D_1)$). $\Delta$ **MUST NOT** interpretarse como mejora, progreso, ganancia o cambio cualitativamente positivo.

#### 5. Reglas de Buena Formación (Well-Formedness Rules)

1. **Definición Obligatoria**: Todo símbolo utilizado en afirmaciones normativas MUST tener un significado y dominio explícitamente definidos.
2. **Unicidad Semántica**: Un mismo operador o símbolo MUST NOT representar relaciones arquitectónicas diferentes en expresiones normativas.
3. **Independencia Temporal vs Evaluativa**: $\text{precedes}(o_1, o_2)$ MUST NOT implicar que $o_2$ es mejor, superior o más deseable que $o_1$.
4. **Reactividad vs Causalidad**: La declaración $\text{reactsTo}(x, y)$ establece dependencia de activación reactiva, pero MUST NOT implicar automáticamente una teoría formal de causalidad metafísica o global.
5. **Aislamiento de Capas**: Conceptos de infraestructura o transporte (como `Impulse`, perteneciente a Runtime) MUST NOT introducirse como requisitos del modelo formal de UCA Core.

---

## 2. UCA Core

El UCA Core define las propiedades mínimas requeridas para identificar una unidad funcional como Unidad Cognitiva Artificial.

---

### 2.1 Definición, Concepción y Ciclo de Vida

Una **Unidad Cognitiva Artificial (UCA)** es una unidad funcional acotada definida por un **propósito propio**, constituida por unas **capacidades concretas** y predispuesta por una **disposición declarativa**.

> Una UCA se define no por lo que ejecuta, sino por el propósito que es responsable de alcanzar.

```text
u = (p, d, C)
```

Donde $u \in \mathbb{U}$ se modela mediante la tupla constitutiva mínima:
$$u = (p, d, C) \in \mathbb{P} \times \mathbb{D} \times \mathcal{P}(\mathbb{C})$$

expresable en términos de predicados normativos como:
$$\text{hasPurpose}(u, p) \land \text{hasDisposition}(u, d) \land (\forall c \in C, \text{hasCapability}(u, c))$$

Donde:
- `p` ($\in \mathbb{P}$) — **Purpose** (Propósito): por qué existe la UCA — orienta su reacción de forma invariante.
- `d` ($\in \mathbb{D}$) — **Disposition** (Disposición): condiciones constitutivas, paramétricas e interactivas — predispone su comportamiento.
- `C` ($\subseteq \mathbb{C}$) — **Capabilities** (Capacidades): conjunto finito no vacío de recursos operacionales — delimitan su frontera funcional.

Esta expresión describe la **constitución mínima** de una UCA y no una ecuación aritmética.

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

#### Separación entre Constitución y Activación

El modelo UCA formaliza dos dimensiones estrictamente independientes:

**1. Constitución**
```text
u = (p, d, C)

p = qué determina funcionalmente la UCA y aquello que persigue
d = cómo están constituidas y predispuestas sus capacidades
C = qué puede hacer (frontera funcional)
```

**2. Activación**
```text
External Signal
      │
      ▼
   Stimulus
      │
      ▼
     UCA
      │
      ▼
Reactive Process / Action
      │
      ▼
   Outcome(s)
```

El `Stimulus` provoca actividad reactiva en una UCA ya concebida.
El `Purpose` determina hacia qué está orientada intrínsecamente esa actividad.
El Stimulus **MUST NOT** redefinir, alterar ni sustituir el Purpose.

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

> **Purpose es la única definición que determina funcionalmente qué UCA es y aquello que persigue durante toda su existencia.**

Es estable, persistente e independiente de ejecuciones concretas o mecanismos específicos. Define la frontera operativa y la identidad de la unidad.

Purpose determina:
- su razón funcional de existencia;
- su dominio de responsabilidad;
- aquello que persigue;
- la orientación de todas sus reacciones;
- su identidad funcional durante toda su existencia.

```text
Purpose
   │
   ├── determina identidad funcional
   ├── delimita responsabilidad
   └── orienta toda reacción
```

- Un Purpose delimita el dominio de responsabilidad perteneciente a la unidad y proporciona orientación a todas sus reacciones.
- Una UCA no puede alterar arbitrariamente su propio Purpose, ya que destruiría su identidad funcional.
- Una UCA nunca debe definirse por sus mecanismos. Consultar una base de datos o llamar a un modelo de lenguaje son mecanismos, no propósitos cognitivos.
- **Purpose es la única fuente de dirección funcional de una UCA y orienta todas sus reacciones durante su existencia.**
- **El Stimulus determina aquello ante lo que la UCA reacciona; no redefine aquello que la UCA persigue.**
- No existe una segunda fuente de dirección funcional durante una activación. Una entidad externa puede suministrar información a una UCA mediante un estímulo, pero no redefine mediante dicha información aquello que la UCA persigue.

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
    │   │   ├── Function
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

1. **Property.Function**:
   > **Function describe el rol funcional o efecto conductual de una Property dentro del Mechanism de su Capability.**
   Permite que observadores evolutivos externos interpreten semánticamente la propiedad sin conocimiento hardcodeado específico de la Capability y sin confundir este rol de ajuste con el `Purpose` propio e invariante de una UCA.

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
    │   ├── modelDir: { Function: "Directorio del modelo ASR", Nature: [path, readonly], Value: "models/asr-es" }
    │   ├── modelType: { Function: "Arquitectura del transductor", Nature: ["zipformer2"], Value: "zipformer2" }
    │   ├── provider: { Function: "Backend de cómputo", Nature: ["cpu", "cuda"], Value: "cpu" }
    │   ├── sampleRate: { Function: "Frecuencia de muestreo requerida", Nature: [16000], Value: 16000 }
    │   ├── featureDim: { Function: "Dimensión de características acústicas", Nature: [80], Value: 80 }
    │   ├── numThreads: { Function: "Hilos paralelos de inferencia", Nature: [1..16], Value: 4 }
    │   ├── enableEndpoint: { Function: "Activación de corte por endpointing", Nature: [boolean], Value: true }
    │   ├── rule1MinTrailingSilence: { Function: "Silencio para segmentación tras habla larga", Nature: [0.5..5.0s], Value: 2.4 }
    │   ├── rule2MinTrailingSilence: { Function: "Silencio para segmentación tras habla corta", Nature: [0.1..2.0s], Value: 0.4 }
    │   ├── rule3MinUtteranceLength: { Function: "Longitud máxima de elocución", Nature: [5.0..60.0s], Value: 20.0 }
    │   ├── decodingMethod: { Function: "Algoritmo de búsqueda de hipótesis", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
    │   └── hotwordsScore: { Function: "Ponderación contextual de hotwords", Nature: [0.0..10.0], Value: 2.5 }
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

Formalmente, el espacio de comportamientos operacionales posibles de una UCA $u$ está acotado por sus Capabilities constitutivas $C_u$:

$$\forall b \in \text{Behaviors}(u), \quad \text{requiredCapabilities}(b) \subseteq C_u$$

La UCA no puede manifestar en su reacción capacidades que no formen parte de su constitución.

Pueden incluir:
- capacidades primitivas concretas (algoritmos deterministas, transforms, parsers, ASR);
- motores de almacenamiento, bases de datos e índices;
- herramientas externas, APIs y drivers;
- modelos predictivos, embeddings y modelos de lenguaje;
- otras UCAs cuyo Purpose propio proporciona la funcionalidad requerida por la Action.

Una Capability es un instrumento. Una Capability no es automáticamente una UCA. Utilizar otra UCA como Capability no implica subordinación, jerarquía ni control irrestricto — la UCA utilizada conserva su propio Purpose y reacciona conforme a sus Capabilities y Disposition ante la información recibida.

---

### 2.5 Dirección Funcional Única y Deslinde entre Purpose, Stimulus y Signal

La dirección funcional de toda reacción procede invariablemente del **Purpose** de la UCA, no de instrucciones o metas impuestas externamente:

> **Purpose es la única fuente de dirección funcional de una UCA.**
> **El Stimulus determina aquello ante lo que la UCA reacciona, pero no redefine aquello que la UCA persigue.**

Una UCA posee un Purpose propio que orienta todas sus reacciones. La señal externa entrante (Stimulus) provoca la reacción y aporta los datos requeridos, sin necesidad de instruir a la unidad sobre qué debe perseguir. No existe una dualidad teleológica: ningún concepto intermedio (como `Goal`, `Objective` o `Task`) modula o redefine la dirección establecida por el Purpose.

#### Deslinde Ontológico: Purpose vs. Stimulus vs. Signal

Para garantizar máxima claridad y evitar ambigüedades ontológicas, el modelo universal UCA deslinda estrictamente tres conceptos:

1. **Purpose**: determina funcionalmente la UCA y orienta todas sus reacciones.
2. **Stimulus**: señal externa a la frontera de la UCA cuya recepción provoca su reacción.
3. **Interaction.Signal**: señal interna mediante la que interactúan y reaccionan sus Capabilities.

```text
                 Purpose
                    │
                    │ determina
                    ▼
               ┌─────────┐
Stimulus ──────►│   UCA   │
               │         │
               │ C₁ ───► C₂
               │   Signal│
               │         │
               └────┬────┘
                    │
                    ▼
                Outcome(s)
```

Durante la reacción:

```text
External Signal
      │
      ▼
   Stimulus
      │
      ▼
┌──────────────────────────────────┐
│               UCA                │
│                                  │
│ Purpose                          │
│    │                             │
│    │ orienta                     │
│    ▼                             │
│ Capability A                     │
│    │                             │
│    │ Interaction.Signal          │
│    ▼                             │
│ Capability B                     │
│    │                             │
│    │ Interaction.Signal          │
│    ▼                             │
│ Capability C                     │
│                                  │
└───────────────┬──────────────────┘
                │
                ▼
            Outcome(s)
```

Por tanto:
- `Stimulus` opera a nivel **inter-UCA / exterior → UCA** (señal externa que cruza la frontera de una UCA y detona su reacción).
- `Interaction.Signal` opera a nivel **intra-UCA / Capability → Capability** (señal interna entre capacidades declaradas en la Disposition para coordinar el proceso reactivo emergente).

---

### 2.6 Información de Entrada y Contexto

Toda reacción reactiva requiere información entrante (los datos, señales o perturbaciones sobre los que operan los mecanismos).

Un Stimulus puede transportar datos o información necesarios para que las Capabilities reaccionen. Sin embargo:
- `Stimulus` **no es** un contenedor genérico universal `Context`.
- No todas las UCAs requieren contexto. Por ejemplo, una unidad como `Ear` puede reaccionar directamente ante una señal de audio entrante sin requerir un contenedor formal `Context`.
- Por el Principio de Minimalidad, `Context` no es una primitiva universal del UCA Core. Una Arquitectura Cognitiva (§4) puede construir, almacenar o aportar contexto cuando sea requerido por la especialización de la unidad, sin imponerlo como contrato a toda UCA.

No existe en el Core una estructura universal prefijada como `Stimulus = (...)`, salvo que todos sus elementos fuesen demostrablemente necesarios para toda UCA posible.

```text
Stimulus ≠ Context
Stimulus ≠ Purpose
Stimulus ≠ Goal
Stimulus ≠ Action
Stimulus ≠ Outcome
```

---

### 2.7 Stimulus (S) e Impulse

La definición canónica de Stimulus en el UCA Core es:

> **Stimulus es una señal externa a la UCA cuya recepción provoca una reacción de la unidad.**

Características normativas del Stimulus:
- **es externo** respecto de la frontera de la UCA receptora;
- **llega a una UCA ya concebida**;
- **provoca una reacción** reactiva en dicha UCA;
- **puede transportar información** necesaria para dicha reacción;
- **no contiene ni redefine el Purpose**;
- **no prescribe una Action**;
- **no determina un Outcome**;
- **no constituye una meta ni un objetivo**;
- **no necesita poseer semántica cognitiva**;
- **no requiere una estructura universal fija**.

Formalmente, $s \in \mathbb{S}$ y:
$$\text{triggers}(s, u, a)$$
expresa estrictamente que la recepción del Stimulus $s$ por la UCA $u$ provoca una activación reactiva de $u$ materializada mediante $a$.

#### Alcance de "Externo" y Reactividad Local

El término "externo" se interpreta estrictamente respecto de la **frontera funcional de la UCA receptora**, no necesariamente respecto del sistema completo.

Por tanto, una señal externa puede originarse en:
- un usuario humano (`usuario ──► Ear`);
- un sensor físico o del entorno (`sensor ──► UCA`);
- un temporizador o runtime (`timer/runtime ──► UCA`);
- otra UCA del sistema (`UCA A ──► UCA B`);
- monitores homeostáticos o eventos del sistema.

Una señal originada dentro del mismo sistema es externa respecto a `UCA B` tan pronto como cruza su frontera funcional.

#### Desacoplamiento entre Stimulus e Impulse

Es fundamental mantener estrictamente separados el concepto cognitivo/funcional y el mecanismo de transporte de infraestructura:

```text
Impulse  = sobre opcional de transporte (infraestructura)
Stimulus = señal externa ante la que reacciona la UCA (activación UCA)
```

```text
Runtime / Infrastructure
       │
       │ transports
       ▼
    Impulse (opcional)
       │
       │ delivers
       ▼
    Stimulus: señal externa
       │
       │ triggers
       ▼
      UCA
```

El Stimulus ($s \in \mathbb{S}$) es la señal externa ante la que reacciona la unidad. El `Impulse` es un sobre opcional de infraestructura utilizado por capas de Runtime (§5) para transportar dicha señal y metadatos operativos. Una UCA conforme no requiere obligatoriamente recibir un `Impulse`; el runtime puede transportar el Stimulus mediante llamadas directas, sockets, eventos o cualquier otro mecanismo técnico.

---

### 2.8 Dominio de Activación y Compatibilidad de Señales

Una UCA reacciona a los Stimuli que cruzan su frontera funcional e interaccionan con las Capabilities que la constituyen.

La compatibilidad y pertinencia de una señal respecto a una UCA no exige que toda unidad evalúe un predicado semántico universal computable en cada activación. En unidades sensoriales o de streaming (como `Ear`), la compatibilidad queda determinada físicamente por la propia interfaz de sus Capabilities receptoras (ej. un stream de audio crudo compatible con el mecanismo de captura). En unidades cognitivas, puede resolverse mediante suscripciones tipadas, contratos de interfaz o discriminación por el runtime (véase §9.1).

La entidad emisora no determina la reacción de la receptora; expone o transmite una señal, y la UCA receptora reacciona conforme a aquello que ya es: su propio Purpose, Capabilities y Disposition.

---

### 2.9 Action (A) y Reactive Process

> **El Process de una UCA es la dinámica emergente producida por las interacciones reactivas entre sus Capabilities conforme a sus Dispositions y orientada por su Purpose.**

```text
Capabilities ──(según Dispositions)──► Interacciones Reactivas ──► Process Emergente ──► Outcome(s)
```

El orden y flujo efectivo de ejecución emergen de las relaciones declaradas en `Interactions`. No existe un coordinador o procesador central imperativo que ejecute secuencialmente las capacidades.

**Relación entre Action y Reactive Process**:
El `Reactive Process` describe la dinámica interna emergente suscita entre Capabilities. La `Action` ($a \in \mathbb{A}$) constituye la ejecución operacional efectiva que realiza y concreta dicho proceso en una activación determinada para producir consecuencias observables ($produces(a, o)$). Ambas nociones son coherentes pero capturan facetas complementarias: la dinámica relacional interna (Process) y la manifestación operativa externa (Action). Véase §9.4.

Una Action no requiere necesariamente inferencia de un modelo de lenguaje. Puede ser computación determinista, recuperación de datos, transformación estructural o invocación de una capacidad.

---

### 2.10 Outcome (O)

El `Outcome` ($o \in \mathbb{O}$) representa **lo que la Action produjo efectivamente**:

$$\text{produces}(a, o)$$

(notación abreviada: $a \to o$).

Distinción ontológica:
```text
STIMULUS (S): Señal externa que cruza la frontera de la UCA y detona la reacción.
OUTCOME (O):  Consecuencia observable producida por la Action ejecutada por la UCA.
```

El Outcome pertenece estrictamente a la unidad ejecutora.

#### Outcomes Parciales y Streaming

Una UCA no está obligada a producir un único Outcome final. Una activación puede emitir múltiples Outcomes parciales de forma continua (streaming):

```text
Stimulus
   │
   │ triggers
   ▼
  UCA
   │
   │ produces (stream temporal)
   ▼
Outcome₀
Outcome₁
Outcome₂
...
```

Formalmente, la secuencia de emisión temporal satisface:
$$\text{precedes}(o_0, o_1) \land \text{precedes}(o_1, o_2) \land \dots$$

**Neutralidad e Independencia Temporal**:
La relación $\text{precedes}(o_0, o_1)$ afirma estricta y únicamente que $o_0$ ocurrió cronológicamente antes que $o_1$. **MUST NOT** interpretarse como relación evaluativa, de superioridad o de mejora ($o_2 > o_1$ carece de validez). Un Outcome no posee calidad intrínseca; cualquier valoración sobre su precisión o utilidad requiere una evaluación explícita bajo criterios definidos (§4.4).

---

### 2.11 Reactividad Local

> **Ninguna activación sin un Stimulus.**
> **Una UCA reacciona únicamente ante la recepción de un Stimulus externo a su propia frontera funcional.**

Una UCA nunca se ejecuta espontáneamente ni por voluntad autónoma. Actúa estrictamente en respuesta a un Stimulus que cruza su frontera funcional.

El origen último de ese Stimulus —humano, sensorial, temporizado, homeostático o procedente de otra UCA— es una cuestión de la Arquitectura Cognitiva (§4), no del UCA Core. Toda UCA permanece localmente reactiva.

---

### 2.12 Frontera de la UCA

**Sobre "Artificial"**

El término `Artificial` describe la naturaleza de la unidad como una primitiva funcional construida, delimitada y diseñada en software o hardware:
- **Primitiva funcional construida**: La unidad es un bloque funcional diseñado deliberadamente, delimitado por un Purpose propio y un conjunto finito de Capabilities.
- **No implica Inteligencia Artificial General ni obligatoriedad de LLMs**: El término no asume ni exige el uso de modelos de lenguaje, redes neuronales profundas o algoritmos de aprendizaje automático. Una UCA puede implementarse mediante lógica determinista, algoritmos clásicos, heurísticas o modelos estadísticos.
- **No implica autoejecución**: Que la unidad sea artificial no significa que sea un agente autoejecutante o dotado de voluntad propia; su ejecución permanece estrictamente reactiva ante la llegada de un Stimulus externo.

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
Estructura:   u = (p, d, C)      (donde p ∈ ℙ determina funcionalmente qué es y persigue u)
Estímulo:     s ∈ 𝕊              (señal externa a la frontera de u que provoca su reacción)
Reacción:     (u, s) → a → o     (shorthand de: triggers(s, u, a) ∧ produces(a, o))
```

---

## 3. Composición de UCAs

Esta sección define cómo las UCAs individuales pueden relacionarse y combinarse para formar sistemas más complejos. La composición es el mecanismo mediante el cual la complejidad cognitiva se construye fuera de la primitiva Core.

> **La composición recursiva de UCAs es uso de Capabilities, no orquestación centralizada.**

Una UCA solo necesita conocer las Capabilities disponibles para ella. No necesita conocer la topología global de UCAs del sistema. La composición permanece local y recursiva.

---

### 3.1 UCA como Capability

Una UCA puede utilizar otra UCA como una de sus Capabilities cuando esa unidad cumple un Purpose propio y diferenciado. No existe diferencia estructural entre utilizar una Capability técnica y utilizar una UCA como Capability, salvo que esta última conserva su propio Purpose e interactúa conforme a sus Capabilities y Disposition:

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
      ├── Purpose B      ← Purpose propio de UCA B
      ├── Disposition B
      └── Capabilities B
```

Utilizar UCA B como Capability significa:
- UCA A requiere el resultado reactivo de UCA B para realizar su Action.
- UCA A no coordina, orquesta ni controla a UCA B.
- UCA A no instruye a UCA B ni le impone su propósito o meta: UCA A expone o emite una señal que cruza la frontera de UCA B como Stimulus externo, y UCA B reacciona según su propio Purpose B, Capabilities B y Disposition B.
- No existe transferencia de Purpose ($p_A \not\to B$) ni creación de metas u órdenes inter-unidad.

---

### 3.2 Capacidades Terminales

> Una Capability se convierte en otra UCA solo cuando existe un Purpose propio y funcionalmente diferenciado.
> Cuando dejan de emerger propósitos diferenciados y solo restan mecanismos, se han alcanzado capacidades terminales.

Si un componente ejecuta una función mecánica o algorítmica sin un Purpose estable e independiente, permanece como capacidad terminal y no debe modelarse como UCA.

---

### 3.3 Relaciones Outcome → Stimulus

Es fundamental distinguir ontológicamente entre el Outcome producido por una UCA y el Stimulus recibido por otra:
- **$\text{Outcome}_A$**: Pertenece estrictamente a $\text{UCA}_A$ y es la consecuencia observable generada por su Action.
- **$\text{Stimulus}_B$**: Pertenece al evento de activación de $\text{UCA}_B$ como señal externa que cruza su frontera funcional.

No existe una identidad ontológica automática ($\text{Outcome}_A \neq \text{Stimulus}_B$). Aunque puedan transportar el mismo dato material, representan conceptos arquitectónicos distintos referidos a fronteras operativas diferentes.

La relación entre ambos es de propagación, exposición o transporte a través del entorno o del runtime:

```text
UCA A
   │
   ▼
Outcome A
   │
   │ propagación / transporte / exposición
   ▼
Stimulus B
   │
   ▼
UCA B
   │
   │ reacciona según Purpose B
   ▼
Outcome B
```

El comportamiento sistémico complejo se despliega a través de cadenas de propagación e interacción reactiva entre unidades especializadas, sin necesidad de ningún coordinador central.

---

### 3.4 Sucesión Reactiva y Cadenas de Activación

Mediante relaciones de propagación entre Outcomes y Stimuli, las UCAs configuran cadenas de activación reactiva sucesiva:

```text
uᵢ ──(produces)──► oᵢ ──(forma sⱼ)──► triggers(sⱼ, uⱼ, aⱼ) ──(produces)──► oⱼ ──► ...
```

Notación abreviada (shorthand informativo):
```text
(uᵢ, sᵢ) → aᵢ → oᵢ → sⱼ → (uⱼ, sⱼ) → aⱼ → oⱼ → ...
```

Esta notación describe un **patrón relacional de propagación reactiva inter-unidad**. La especificación no afirma una teoría metafísica o física de causalidad cerrada: cada eslabón expresa estrictamente que una UCA produce un resultado que alimenta el contexto o detona la reacción de la siguiente ($\text{produces} \land \text{triggers}$). Véase §9.7.

---

### 3.5 Uso Recursivo de Capabilities

Una UCA puede exponer otra UCA como una de sus Capabilities. Esa UCA puede utilizar recursivamente sus propias Capabilities para perseguir su Purpose. Esta relación recursiva no implica coordinación centralizada, jerarquía ni control irrestricto.

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

### 4.1 Evaluación bajo Criterios Explícitos

En arquitecturas cognitivas, la evaluación de un Outcome representa el análisis sistemático de sus consecuencias frente a criterios explícitos (ej. precisión, latencia, coherencia, estabilidad o tasa de error).

> El Outcome pertenece a quien ejecuta.
> La evaluación pertenece a quien evalúa o formuló los criterios.

La UCA ejecutora produce el Outcome como consecuencia observable de su Action. No está obligada a autoevaluarse para dictaminar la calidad o utilidad de su resultado.

Una Arquitectura Cognitiva puede definir UCAs especializadas cuyo Purpose propio sea evaluar Outcomes frente a criterios explícitos:

```text
Entidad Originadora (UCA₁)
        │
        ▼
Ejecutor (UCA₂)
        │
        └── Outcome
                │
                ▼
Evaluador (UCA₃)
                │
                └── Evaluación bajo Criterios Explícitos
```

La evaluación se construye puramente mediante composición. No se requiere ningún mecanismo intrínseco de evaluación dentro del UCA Core.

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

No existe ningún `Observer` especial en la estructura UCA. Cada una de estas unidades es simplemente $u = (p, d, C)$ con un Purpose que justifica su Action.

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
     │
     ▼
UCA₀ (Purpose, Capabilities, Disposition₀)
     │
     │ evidence
     ▼
Mutation₁ (atómica)
     │
     ▼
Disposition₁
     │
     │ evidence
     ▼
Mutation₂ (atómica)
     │
     ▼
Disposition₂
     │
    ...
```

#### Principio de Mutación Atómica

> **La unidad mínima de Evolution es una Mutation atómica de la Disposition.**

Una Mutation ($\mu \in \mathbb{M}\text{ut}$) debe ser, siempre que sea posible:
- **pequeña e identificable**: focalizada en una Property o Interaction concreta;
- **limitada**: circunscrita a los límites de Nature ($\text{satisfies}(\text{value}_{new}, \text{nature})$);
- **validable**: verificable formalmente antes de su aplicación;
- **medible**: observable empíricamente en el Outcome;
- **reversible**: capaz de restaurarse si la evidencia es desfavorable;
- **atribuible**: rastreable respecto a la evidencia que la motivó.

#### Tipos de Mutación: Paramétrica y Estructural

1. **Mutación Paramétrica**: Ajuste del estado o valor de una Property (`Property.Value`), manteniendo Purpose, Nature e Interactions constantes:
   ```text
   SherpaRecognition.hotwordsScore: 2.5 ──► 3.0   (donde satisfies(3.0, Nature))
   ```
2. **Mutación Estructural**: Modificación de una Interaction (`Disposition.Interactions`) para alterar el flujo reactivo emergente sin modificar el código fuente de las Capabilities:
   ```text
   t₀: Capability A ──► Capability B
   t₁: Capability C ──► Capability A ──► Capability B
   ```

#### Límites Inviolables de Evolution

Los límites ontológicos de Evolution se formalizan mediante tres predicados normativos independientes:

1. **Preservación de Purpose**: Toda mutación MUST preservar el propósito propio de la UCA:
   $$\text{preservesPurpose}(u, \mu)$$
2. **Frontera de Capabilities**: Toda mutación MUST mantenerse dentro de las Capabilities constitutivas existentes:
   $$\text{withinCapabilities}(u, \mu)$$
3. **Restricción de Nature**: Todo nuevo valor asignado a una propiedad MUST satisfacer las restricciones de su Nature:
   $$\forall \text{prop}, \quad \text{satisfies}(\text{value}_{new}, \text{nature})$$

- El **Purpose** es la invariante de identidad: no puede mutar. Un cambio de Purpose implica concebir una UCA distinta.
- Las **Capabilities** son los límites funcionales: no se pueden adquirir dinámicamente capacidades no constituidas.
- La **Nature** delimita el espacio admisible de mutación (Mutation Space).

---

### 4.4 Observación Evolutiva, Optimización Local y Falsabilidad

Una Arquitectura Cognitiva puede definir una UCA especializada (ej. `Cingulate UCA`) cuyo Purpose sea evaluar evidencia y proponer mutaciones atómicas:

```text
Outcome(s) ──► Evidence ──► Cingulate UCA ──► Inferencia de Mutación ──► Validación de Nature ──► ΔDisposition
```

Donde $\Delta\text{Disposition} = \text{difference}(D_0, D_1)$ representa exclusivamente la diferencia de estado resultante. El operador $\Delta$ **MUST NOT** interpretarse como mejora intrínseca, progreso garantizado ni optimización automática.

#### Principios de Observación Evolutiva

1. **Interpretación Declarativa sin Acoplamiento Hardcodeado**: El observador evolutivo inspecciona `Property.Function`, `Property.Nature`, `Property.Value` e `Interactions` (Definition, Target, Signal, When), razonando sobre la adaptación sin requerir código específico de cada Capability ni confundir las funciones paramétricas con el Purpose propio de la UCA.
2. **Validación Estricta contra Nature**: Ninguna mutación puede aplicarse si viola la `Nature` declarada de la propiedad ($\text{satisfies}(\text{value}, \text{nature})$). La seguridad evolutiva proviene de la propia constitución declarativa.
3. **Fuera del Camino Crítico de Ejecución**: El observador evolutivo actúa de forma asíncrona, selectiva y contextual sobre evidencia acumulada. No es un árbitro síncrono ni un cuello de botella para cada reacción.
4. **Optimización Local Acotada**: El contexto de optimización permanece pequeño y localizado:
   ```text
   UCA Purpose + Capability Mechanism + Property Function + Property Nature + Value + Evidence ──► Contexto de Optimización
   ```
5. **Falsabilidad Experimental y Evaluación Explícita**: Toda mutación atómica genera una hipótesis comprobable empíricamente. Los Outcomes no poseen orden de calidad universal ni métricas intrínsecas de mejora; cualquier relación cualitativa requiere someter la evidencia a una evaluación formal bajo criterios explícitos (ej. latencia, coherencia, estabilidad, tasa de error):
   - **Evidencia favorable**: La evidencia evaluada sustenta la hipótesis de mejora bajo los criterios explícitos (consolidando la mutación).
   - **Evidencia neutra**: La evidencia evaluada indica ausencia de efecto relevante bajo dichos criterios.
   - **Evidencia desfavorable**: La evidencia evaluada sustenta degradación bajo dichos criterios (desencadenando reversión a $D_0$).

> **Distinción entre Igualdad y Equivalencia Evaluativa**:
> Dos Outcomes $o_1$ y $o_0$ estructuralmente idénticos pueden haber sido emitidos bajo contextos distintos, y dos Outcomes distintos pueden resultar evaluativamente equivalentes bajo un criterio específico sin ser iguales. La specification rechaza el uso de $o_1 > o_0$ o $o_1 = o_0$ como predicados evaluativos genéricos sin criterios explícitos.

---

### 4.5 Coordinación como Uso de Capabilities

La coordinación no es un rol UCA privilegiado. No existe ningún Coordinador ni Dispatcher predefinido en el modelo UCA.

Si un sistema identifica un Purpose propio real que requiera integrar Outcomes de múltiples UCAs — por ejemplo, sintetizar resultados parciales o secuenciar activaciones en función del contexto — ese Purpose puede justificar una UCA. Pero la UCA no es coordinadora por naturaleza: es una unidad cuya Action utiliza otras UCAs como Capabilities:

```text
UCA A
────────────────────
Purpose: sintetizar resultados de las fuentes de conocimiento disponibles

Capabilities
├── UCA B (Purpose B)
├── UCA C (Purpose C)
└── UCA D (Purpose D)
```

UCA A realiza su Action interactuando con B, C y D como Capabilities. No las orquesta. Cada una de B, C y D conserva su propio Purpose y reacciona ante la información recibida conforme a sus Capabilities y Disposition.

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

Aunque toda UCA es localmente reactiva respecto de su propia frontera funcional, una Arquitectura Cognitiva puede originar señales externas a dicha frontera a partir de:
- interacciones humanas o mecánicas del entorno;
- eventos sensoriales y de captura física;
- temporizadores o eventos programados de runtime;
- monitores homeostáticos internos o bucles de soporte;
- otras UCAs del sistema conectadas en red o pipelines;
- eventos de inicialización de la infraestructura.

La condición universal es únicamente que el Stimulus se origine fuera de la frontera de la UCA receptora; la procedencia de la señal respecto del sistema completo es una decisión de diseño arquitectónico, no un requisito del UCA Core.

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

El Stimulus es una abstracción cognitiva (la información o perturbación ante la que reacciona la unidad). El Impulse es una posible representación en runtime de ese concepto. Una implementación UCA puede operar con o sin una abstracción Impulse explícita.

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

El patrón relacional:

```text
oᵢ ──triggers──► Stimulus ──triggers──► uⱼ ──produces──► aⱼ ──produces──► oⱼ ──drives──► Δdᵢ
```

describe un patrón relacional de comportamiento arquitectónico: el Outcome de una UCA estimula a otra, cuya Action resulta en un cambio de Disposition ($\Delta d_i = \text{difference}(d_{i,0}, d_{i,1})$) en la primera. Esta es una hipótesis sobre lo que es alcanzable mediante composición.

---

### 6.4 Aprendizaje Estructural mediante Interacción

Se plantea como hipótesis que los sistemas pueden lograr una mejora conductual adaptativa sin reentrenar pesos de modelos ni modificar código fuente, mediante el ajuste dinámico de las Dispositions en respuesta a la retroalimentación del entorno.

---

### 6.5 Plasticidad Relacional (Sinapsis)

La adaptación actual se enfoca en el ajuste intra-unidad de la Disposition. Una pregunta activa de investigación explora la plasticidad relacional inter-unidad: ajuste de ponderaciones de ruta, afinidad o topología de comunicación entre unidades:

```text
INTRA-UCA:  Δd(uᵢ)
INTER-UCA:  ΔRelación(uᵢ, uⱼ)
```

Donde $\Delta$ denota estrictamente el cambio o diferencia entre estados identificables ($\text{difference}(\text{state}_0, \text{state}_1)$) sin presuponer mejora.

Una abstracción `Synapse` representaría una propiedad persistente de la relación entre dos UCAs que no puede modelarse adecuadamente como estado, Disposition o Capability de ninguna de las unidades individualmente.

Si dicha abstracción es necesaria permanece como pregunta abierta. Synapse no forma parte del Core normativo de UCA.

---

### 6.6 La Hipótesis Falsable

> **¿Puede emerger comportamiento cognitivo de la interacción de UCAs acotadas por propósito, mientras cada unidad individual permanece estructuralmente limitada a $u = (p, d, C)$ y conductualmente limitada a $(u, s) \to a \to o$?**

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
│       │   ├── sampleRate: { Function: "Frecuencia de muestreo acústico", Nature: [16000], Value: 16000 }
│       │   ├── suppressionGain: { Function: "Atenuación estática de eco", Nature: [0.0..1.0], Value: 0.0 }
│       │   ├── bargeInThresholdRms: { Function: "Umbral RMS para interrupción de voz", Nature: [50..1000], Value: 160 }
│       │   ├── echoLeakRatio: { Function: "Ratio de tolerancia de fuga acústica", Nature: [0.0..1.0], Value: 0.25 }
│       │   ├── maxThresholdRms: { Function: "Umbral máximo RMS acústico", Nature: [100..2000], Value: 450 }
│       │   ├── decayMs: { Function: "Tiempo de caída de atenuación", Nature: [50..2000ms], Value: 350 }
│       │   └── bargeInHoldMs: { Function: "Retención de estado de corte", Nature: [50..2000ms], Value: 400 }
│       └── Interactions:
│           └── onAudioInput: { Definition: "Atenuar eco de señal cruda", Target: "AudioInput.stream", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── AudioFraming
│   ├── Mechanism: Materialización temporal de la señal en fragmentos discretos
│   └── Disposition:
│       ├── Properties:
│       │   ├── sampleRate: { Function: "Frecuencia de muestreo", Nature: [16000], Value: 16000 }
│       │   ├── frameSize: { Function: "Tamaño discreto de fragmento", Nature: [160..16000], Value: 1600 }
│       │   └── emitPartialOnFlush: { Function: "Emitir fragmento parcial al vaciar buffer", Nature: [boolean], Value: false }
│       └── Interactions:
│           └── onCleanAudio: { Definition: "Fragmentar audio atenuado", Target: "EchoCancellation.output", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── PcmToFloat
│   ├── Mechanism: Normalización y conversión de enteros Int16 a coma flotante Float32
│   └── Disposition:
│       ├── Properties:
│       │   ├── inputType: { Function: "Tipo de entrada numérica", Nature: ["Int16"], Value: "Int16" }
│       │   ├── outputType: { Function: "Tipo de salida numérica", Nature: ["Float32"], Value: "Float32" }
│       │   └── scale: { Function: "Factor divisor de normalización", Nature: [32768.0], Value: 32768.0 }
│       └── Interactions:
│           └── onAudioFrame: { Definition: "Normalizar fragmento de audio a coma flotante", Target: "AudioFraming.output", Signal: "Int16Array", When: "Target.frameReady == true" }
│
├── SherpaRecognition
│   ├── Mechanism: Reconocimiento online de voz mediante modelo neuronal transductor (Sherpa-ONNX)
│   └── Disposition:
│       ├── Properties:
│       │   ├── modelDir: { Function: "Directorio del modelo neuronal", Nature: [path, readonly], Value: "models/asr-es" }
│       │   ├── modelType: { Function: "Arquitectura del transductor", Nature: ["zipformer2"], Value: "zipformer2" }
│       │   ├── provider: { Function: "Backend de cómputo", Nature: ["cpu", "cuda"], Value: "cpu" }
│       │   ├── sampleRate: { Function: "Frecuencia de muestreo acústico", Nature: [16000], Value: 16000 }
│       │   ├── featureDim: { Function: "Dimensión de características acústicas", Nature: [80], Value: 80 }
│       │   ├── numThreads: { Function: "Hilos de inferencia paralelos", Nature: [1..16], Value: 4 }
│       │   ├── enableEndpoint: { Function: "Detección de corte por endpointing", Nature: [boolean], Value: true }
│       │   ├── rule1MinTrailingSilence: { Function: "Silencio para segmentar habla larga", Nature: [0.5..5.0s], Value: 2.4 }
│       │   ├── rule2MinTrailingSilence: { Function: "Silencio para segmentar habla corta", Nature: [0.1..2.0s], Value: 0.4 }
│       │   ├── rule3MinUtteranceLength: { Function: "Longitud máxima de elocución", Nature: [5.0..60.0s], Value: 20.0 }
│       │   ├── decodingMethod: { Function: "Método de decodificación", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
│       │   └── hotwordsScore: { Function: "Ponderación contextual de hotwords", Nature: [0.0..10.0], Value: 2.5 }
│       └── Interactions:
│           └── onFloatSamples: { Definition: "Decodificar habla de muestras normalizadas", Target: "PcmToFloat.output", Signal: "Float32Array", When: "Target.hasSamples == true" }
│
├── EchoTextFilter
│   ├── Mechanism: Filtrado y atenuación léxica de transcripciones autogeneradas
│   └── Disposition:
│       ├── Properties:
│       │   ├── caseSensitive: { Function: "Distinción entre mayúsculas y minúsculas", Nature: [boolean], Value: false }
│       │   ├── decayMs: { Function: "Ventana temporal de atenuación léxica", Nature: [500..10000ms], Value: 2500 }
│       │   ├── mismatchThreshold: { Function: "Tolerancia de discrepancia léxica", Nature: [0..5], Value: 1 }
│       │   └── minWordLength: { Function: "Longitud mínima de palabra a evaluar", Nature: [1..10], Value: 3 }
│       └── Interactions:
│           └── onRawTranscript: { Definition: "Filtrar ecos textuales de transcripciones crudas", Target: "SherpaRecognition.output", Signal: "RawTranscript", When: "Target.textAvailable == true" }
│
└── EarCoherence
    ├── Mechanism: Normalización estructural y preservación de continuidad temporal de Chunks
    └── Disposition:
        ├── Properties:
        │   └── outputSchema: { Function: "Esquema canónico de salida", Nature: ["Chunk"], Value: "Chunk" }
        └── Interactions:
            └── onFilteredTranscript: { Definition: "Estructurar chunk coherente final", Target: "EchoTextFilter.output", Signal: "FilteredTranscript", When: "Target.isValid == true" }

Outcome (Stream continuo)
│
└── Chunk { startAt, endAt, text }
```

Flujo reactivo emergente de interacciones (diagrama informativo):

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

#### Armonización y Reactividad en Ear: Representación y Reconfiguración de Procesos

El propósito fundamental de este ejemplo es ilustrar **cómo cualquier proceso tradicional o secuencial (como un pipeline de procesamiento de audio y transcripción) puede representarse formalmente mediante UCA** sin necesidad de orquestadores centrales ni tuberías rígidas cableadas en código.

En lugar de un flujo secuencial imperativo hardcodeado, el proceso emerge de las relaciones reactivas declaradas en las Dispositions de las Capabilities (`Interactions` y `Properties`):
- `AudioFraming.frameSize: 1600` (tamaño de fragmento de audio).
- `EchoCancellation.decayMs: 350` y `bargeInHoldMs: 400` (gestión de umbral de eco y corte).
- `SherpaRecognition.rule2MinTrailingSilence: 0.4` (segundos de silencio para cierre de segmento).
- `EchoTextFilter.decayMs: 2500` (ventana temporal de atenuación de eco textual).

**Reconfigurabilidad del Orden del Proceso**:
Dado que el flujo no está fijado en la arquitectura del código sino en las `Interactions` declarativas de la Disposition, **el orden del pipeline puede redefinirse o reestructurarse dinámicamente si resultara pertinente** (por ejemplo, mediante una mutación estructural en Evolution, §4.3). Si la evidencia empírica mostrara que aplicar cancelación de eco después del framing o introducir una etapa previa de filtrado acústico optimiza la transcripción, la Disposition de las Capabilities puede reconfigurar sus Targets y Signals para alterar la secuencia reactiva emergente sin modificar el código de las capacidades ni la identidad de la UCA:
```text
t₀ (orden inicial):      AudioInput ──► EchoCancellation ──► AudioFraming ──► PcmToFloat ──► ...
t₁ (orden redefinido):   AudioInput ──► AudioFraming ──► EchoCancellation ──► PcmToFloat ──► ...
```

Ninguna de estas capacidades primitivas se convierte en una UCA independiente mientras no posea un Purpose propio y diferenciado. Permanecen como capacidades primitivas de Ear.

Ejemplo de Outcomes parciales emitidos (secuencia de emisión con relación temporal $\text{precedes}(o_0, o_1)$ y $\text{precedes}(o_1, o_2)$):
```text
o₀ = { startAt: 0,   endAt: 400,  text: "Creo que" }
o₁ = { startAt: 400, endAt: 850,  text: "deberíamos cambiar" }
o₂ = { startAt: 850, endAt: 1200, text: "esta arquitectura" }
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
u_A (Purpose: actuar)
 │
 └── produces(u_A, a_A) ──produces──► o_A ──emits──► entorno ──triggers──► s_B
                                                                             │
                                                                             ▼
                                                                 u_B (Purpose: percibir)
                                                                             │
                                                                             └── produces(u_B, a_B): percibir
                                                                                     │
                                                                                     └── produces(a_B, o_B): representación percibida
```

`u_B` es estructuralmente idéntica a cualquier otra UCA: $u_B = (p_B, d_B, C_B) \in \mathbb{U}$. Su Purpose requiere percepción.

---

### 7.3 Observación Mediante Composición

La observación puede ser igualmente la Action de una UCA:

```text
s_C ──triggers──► u_C (Purpose: observar e interpretar)
                   │
                   └── produces(u_C, a_C): observar
                           │
                           └── produces(a_C, o_C): observación estructurada
                                                   │
                                                   ▼
                                          s_D ──triggers──► u_D
```

---

### 7.4 Adaptación de Disposition Mediante Composición

Una UCA puede adaptar la Disposition de otra mediante una cadena de activación estándar:

```text
u_A (Disposition d_A,0)
 │
 └── produces(a_A, o_A)
          │
          ▼ triggers
      s_B ──► u_B (Purpose: evaluar y adaptar comportamiento)
               │
               └── produces(a_B, o_B): Δd_A
                                 │
                           d_A,0 ──mutation──► d_A,1  (aplicado a u_A)
```

Donde $\Delta d_A = \text{difference}(d_{A,0}, d_{A,1})$. `u_B` no requiere ninguna estructura especial. Su Purpose justifica su Action.

---

### 7.5 Comportamiento Emergente Mediante Composición

Una red de UCAs, cada una limitada a $(u, s) \to a \to o$, puede exhibir comportamiento que ninguna unidad individual contiene:

```text
                 ┌────────┐
            ┌───►│  u₂    │───┐
            │    └────────┘   │
            │                 ▼
        ┌────────┐        ┌────────┐
        │  u₁    │        │  u₄    │
        └────────┘        └────────┘
            ▲                 │
            │    ┌────────┐   │
            └────│  u₃    │◄──┘
                 └────────┘

               ↓ (diagrama informativo)

    comportamiento emergente del sistema
```

Esto constituye la hipótesis de comportamiento emergente (§6.1), a verificar experimentalmente.

---

## 8. Conformidad (Conformance)

Una entidad o componente de software cumple con el **UCA Core** si y solo si satisface todos los siguientes criterios. Cada criterio normativo textual se acompaña de su expresión formal sobre los dominios y relaciones canónicas:

1. **Purpose Propio e Invariante**: Define un Purpose explícito, estable e independiente de la implementación.
   $$\forall u \in \mathbb{U}, \exists! p \in \mathbb{P} : \text{hasPurpose}(u, p)$$
2. **Disposition Definida**: Tiene una Disposition que condiciona su comportamiento reactivo.
   $$\forall u \in \mathbb{U}, \exists d \in \mathbb{D} : \text{hasDisposition}(u, d)$$
3. **Capabilities Acotadas**: Opera mediante un conjunto explícito y acotado de Capabilities.
   $$\forall u \in \mathbb{U}, \exists C \subseteq \mathbb{C}, C \neq \emptyset : \text{hasCapabilities}(u, C)$$
4. **Activación Reactiva por Estímulo**: Se ejecuta estrictamente al ser detonada por un Stimulus externo que cruza su frontera funcional.
   $$\forall u \in \mathbb{U}, \forall a \in \mathbb{A} \text{ ejecutada por } u, \exists s \in \mathbb{S} : \text{triggers}(s, u, a)$$
5. **Action Orientada por Purpose**: Ejecuta una Action que realiza el Reactive Process emergente persiguiendo su Purpose dentro de los límites de sus Capabilities y Disposition.
   $$\forall (u, s) \text{ activo}, \exists a \in \mathbb{A} : \text{triggers}(s, u, a)$$
6. **Producción de Outcome**: Produce uno o más Outcomes observables que representan lo que la Action produjo efectivamente.
   $$\forall a \in \mathbb{A} \text{ completada por } u, \exists o \in \mathbb{O} : \text{produces}(a, o)$$
7. **Descomposición por Purpose**: Trata a otro componente como UCA solo si dicho componente posee un Purpose propio y diferenciado.
   $$\forall u' \text{ compuesta en } u, u' \in \mathbb{U} \iff \exists! p' \in \mathbb{P} : \text{hasPurpose}(u', p') \land p' \neq p_u$$

**No-requisitos para la Conformidad**:

Un componente **no** necesita ninguno de los siguientes para cumplir con UCA:
- una teleología dual, objetivos o metas intermedias, o un contenedor formal de `Context` como estructuras universales obligatorias del estímulo;
- Observation o Perception como fases del ciclo de vida;
- Memory, Identity, Learning o Adaptation;
- un Coordinador, Dispatcher, Orquestador o Supervisor;
- un modelo de lenguaje o LLM específico;
- causalidad externa asumida como ontología necesaria;
- un sobre Impulse;
- un Event Bus;
- Sinapsis o plasticidad relacional;
- estado global o snapshots;
- comportamiento cognitivo emergente demostrado.

La conformidad evalúa la **unidad individual** frente al contrato UCA. No evalúa si el sistema en su conjunto exhibe comportamiento cognitivo.

---

## 9. Preguntas Abiertas

Esta sección documenta preguntas abiertas no resueltas en la especificación, identificadas a partir del modelo conceptual y de la auditoría de formalización.

### 9.1 Criterios de Pertinencia de Estímulos y Filtros de Interfaz

Bajo el Principio de Minimalidad, la especificación no impone un predicado computable universal $\text{relevant}(s, p)$ que toda UCA deba evaluar formalmente en cada ciclo. En unidades reactivas o de streaming (como `Ear`), la compatibilidad queda determinada físicamente por la propia interfaz de sus Capabilities receptoras; en unidades cognitivas, por suscripciones tipadas, contratos de interfaz o discriminación por el runtime. Permanece abierta la formalización de cómo los contratos de interfaz de las Capabilities y del Runtime gestionan la pertinencia de las señales entrantes sin introducir sobrecarga teleológica en el Core.

### 9.2 Plasticidad Relacional Inter-UCA

Si una abstracción `Synapse` —que represente una propiedad persistente y adaptable de la relación entre dos UCAs— es necesaria o suficiente para modelar la plasticidad inter-unidad permanece como pregunta abierta. Requiere evidencia empírica de implementaciones (véase §6.5).

### 9.3 Validación Empírica de la Cognición Emergente

La hipótesis central de UCA (§6.6) no ha sido validada empíricamente todavía. Las futuras implementaciones de referencia deben diseñarse para comprobar si el comportamiento cognitivo puede emerger de unidades acotadas por propósito y limitadas a $(u, s) \to a \to o$.

### 9.4 Relación Formal entre Action y Reactive Process

La especificación utiliza concurrentemente los conceptos de `Action` ($a \in \mathbb{A}$) y `Reactive Process` emergente de las interacciones entre Capabilities. No se encuentra formalmente zanjado si:
1. `Action` es idéntica a la traza completa del `Reactive Process`;
2. `Action` es una interfaz exterior observable y delimitada cuyo mecanismo subyacente es el `Reactive Process`;
3. o si `Reactive Process` es una dinámica continua interna de la cual `Action` es una instanciación discreta.

Debe resolverse en futuras iteraciones sin forzar identidades matemáticas artificiales en el Core.

### 9.5 Semántica de Inclusión en Contexto vs. Detonación en Relaciones Outcome → Stimulus

En §3.3 se establece que un Outcome $o_i$ emitido por una UCA puede relacionarse con el Stimulus $s_j$ de otra unidad de dos formas ontológicamente distintas:
1. Formando parte del Contexto: $o_i \in x_j$.
2. Detonando la activación reactiva: $\text{triggers}(o_i, s_j)$.

Permanece abierta la formalización de las condiciones bajo las cuales un Outcome pasa a constituir sustrato contextual pasivo versus evento de activación directa, así como si dicha distinción depende del emisor, del receptor o de la topología de la composición.

### 9.6 Semántica y Sobrecarga Ontológica de `Interaction.Signal`

En el modelo de Capabilities primitivas (§2.4 y §7.1), el campo `Interaction.Signal` se utiliza simultáneamente en los ejemplos para representar:
- Tipos de datos en memoria (ej. `Int16Array`, `Float32Array`);
- Cargas útiles o eventos con semántica de dominio (ej. `RawTranscript`, `FilteredTranscript`);
- Mecanismo o medio de transporte físico entre propiedades observadas.

Esta sobrecarga ontológica entre *tipo de dato*, *evento cognitivo* y *canal de propagación* permanece abierta y no debe resolverse mediante atajos formales sin validación arquitectónica.

### 9.7 Causalidad frente a Reactividad y Propagación Temporal

La especificación distingue formalmente entre:
- Precedencia temporal: $\text{precedes}(x, y)$;
- Reacción: $\text{reactsTo}(x, y)$;
- Producción: $\text{produces}(x, y)$.

El uso del término "causalidad" en la arquitectura UCA plantea la interrogante de si la causalidad es una asunción ontológica necesaria del modelo o si toda interacción inter-UCA puede describirse exhaustivamente mediante relaciones puras de reactividad, producción y propagación temporal, evitando compromisos metafísicos o modelos causales contrafácticos no formalizados.

### 9.8 Evaluación Teleológica y Predicado Formal `servesPurpose(a, p)`

El UCA Core establece que toda Action es el resultado de un Reactive Process emergente de una UCA ya constituida $u = (p, d, C)$. Dado que la unidad está intrínsecamente orientada por su Purpose, la acción emana de dicha constitución. Permanece abierta la cuestión de si el predicado formal $\text{servesPurpose}(a, p)$ aporta semántica irreducible o si constituye una redundancia formal respecto de la pertenencia de $p$ a la constitución de $u$ ($\text{hasPurpose}(u, p)$), evitando el riesgo de inducir evaluaciones teleológicas no computables dentro de los criterios mínimos de conformidad.

---

## 10. Antecedentes e Influencias Arquitectónicas (Informativo)

> **Esta sección es informativa y no normativa.**
> No introduce nuevas restricciones, primitivas ni requisitos de conformidad sobre el contrato UCA Core formalizado en las secciones normativas precedentes.

### 10.1 Problemas Arquitectónicos Recurrentes y Convergencia Conceptual

UCA no surge en aislamiento conceptual. Gran parte de los desafíos fundamentales que aborda —el desacoplamiento, la especialización funcional, la reactividad estricta, la composición distribuida, la emergencia sistémica y la adaptación continua— han sido investigados durante décadas por la ingeniería de software, los sistemas distribuidos, la robótica y las ciencias cognitivas.

Es connatural que existan similitudes entre UCA y diversas tradiciones de diseño arquitectónico: cuando disciplinas independientes intentan dar respuesta a problemas compartidos, las soluciones tienden a converger parcialmente en principios comunes.

```text
Problemas Arquitectónicos Recurrentes:
- Desacoplamiento de componentes
- Evitación de coordinadores centrales monolíticos
- Reacción ante perturbaciones del entorno
- Composición jerárquica o recursiva
- Adaptación frente a evidencia empírica
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Convergencia de Familias y Tradiciones de Diseño       │
│                                                        │
│ ├── Actor Model: Aislamiento y concurrencia por mensajes│
│ ├── Reactive Systems: Detonación reactiva desacoplada  │
│ ├── Subsumption: Comportamientos y control distribuido │
│ ├── Blackboard Systems: Cooperación de especialistas   │
│ ├── Global Workspace: Integración sistémica modular    │
│ ├── Soar / LIDA: Modelado de arquitecturas cognitivas  │
│ └── Autonomic Computing: Adaptación paramétrica local  │
└────────────────────────────────────────────────────────┘
```

UCA reconoce explícitamente estas influencias y precedentes intelectuales. Al mismo tiempo, UCA no pretende ser una copia, evolución directa, extensión oficial, sustitución ni unificación de ninguna de estas arquitecturas. Cada una de ellas fue concebida para satisfacer objetivos, restricciones y dominios operativos particulares. UCA aborda su propio problema específico: definir una **primitiva funcional mínima y determinable** ($u = (p, d, C)$) a partir de la cual el comportamiento cognitivo complejo pueda emerger mediante composición reactiva.

### 10.2 Modelo de Actores (Actor Model)

El Modelo de Actores (Hewitt, Bishop & Steiger, 1973; Agha, 1986) formuló una de las aproximaciones más influyentes para el diseño de sistemas concurrentes y distribuidos basados en unidades independientes. En este modelo, un "actor" es una entidad autónoma que, en respuesta a un mensaje entrante, puede tomar decisiones locales, crear nuevos actores, enviar mensajes a otros actores y modificar su estado interno para mensajes futuros.

**Similitudes con UCA**:
- **Aislamiento y límites claros**: Ambas abstracciones rechazan el estado global compartido mutable; cada unidad encapsula su propio comportamiento.
- **Activación por recepción**: Un actor no se ejecuta sin recibir un mensaje; una UCA reacciona únicamente ante la recepción de un Stimulus externo a su frontera funcional.
- **Concurrencia y distribución**: La interacción no depende de un hilo de ejecución centralizado ni de bloqueos compartidos.

**Diferencias Conceptuales**:
- **Naturaleza ontológica**: El Modelo de Actores es fundamentalmente una abstracción computacional para concurrencia, paralelismo y paso de mensajes en sistemas distribuidos. UCA es una primitiva ontológica funcional concebida para delimitar la identidad y responsabilidad cognitiva.
- **Constitución explícita**: En el Modelo de Actores clásico, un actor se define por su buzón y su comportamiento dinámico ante mensajes. En UCA, la unidad está rigurosamente constituida por la tupla formal $u = (p, d, C)$, donde el **Purpose** ($p$) determina de forma invariante aquello que persigue, las **Capabilities** ($C$) acotan sus límites operacionales y la **Disposition** ($d$) declara de forma transparente sus propiedades e interacciones reactivas.
- **Separación de infraestructura**: Un actor se acopla frecuentemente al buzón (*mailbox*) de infraestructura de su runtime; en UCA, el mecanismo de transporte (`Impulse`) está estrictamente desacoplado del contenido detonante (`Stimulus`).

### 10.3 Sistemas Reactivos y Arquitecturas Orientadas a Eventos (EDA)

Las arquitecturas orientadas a eventos (Event-Driven Architecture) y los principios de los Sistemas Reactivos (Bonér et al., 2014) establecen que los sistemas de software deben ser reactivos a los estímulos del entorno, desacoplados en el tiempo y en el espacio, y resilientes mediante el aislamiento de fallos.

**Similitudes con UCA**:
- **Detonación reactiva**: El flujo de procesamiento no procede de una llamada imperativa descendente, sino de la reacción ante una señal, evento o cambio en el entorno:
  $$	ext{External Signal} 	o 	ext{Stimulus} 	o 	ext{UCA} 	o 	ext{Action} 	o 	ext{Outcome}$$
- **Desacoplamiento temporal y espacial**: Quien emite una señal no controla ni conoce el ciclo de vida interno del receptor.
- **Interacciones reactivas intra-unidad**: Las `Interactions` declaradas en la Disposition de una UCA siguen una semántica estrictamente reactiva ante cambios observables locales (`reactsTo`).

**Diferencias Conceptuales**:
- **Nivel de abstracción**: Los Sistemas Reactivos prescriben patrones técnicos y propiedades de ingeniería de sistemas (elasticidad, resiliencia, contrapresión o *backpressure*, brokers de mensajería). UCA formula un contrato funcional a nivel de unidad; no prescribe la presencia obligatoria de un Event Bus, brokers de mensajes, patrones Observer ni flujos reactivos de código en el Core.

### 10.4 Arquitectura de Subsunción y Robótica Basada en Comportamientos

La Arquitectura de Subsunción propuesta por Rodney Brooks (1986, 1991) constituyó un hito histórico fundamental al demostrar que un comportamiento inteligente complejo y adaptativo puede emerger sin necesidad de un procesador central monolítico, sin modelos simbólicos exhaustivos del mundo y sin planificadores globales. Subsumption organiza el sistema en capas de competencias conductuales acotadas y fuertemente reactivas que interactúan directamente con el entorno.

**Similitudes con UCA**:
- **Descentralización radical**: Ambas aproximaciones rechazan de forma contundente la figura del planificador, coordinador o supervisor universal.
- **Emergencia sistémica**: El comportamiento global inteligente emerge de la interacción dinámica de múltiples competencias o unidades especializadas más simples.
- **Reactividad situada**: Las unidades operan acopladas a perturbaciones observables reales del entorno en lugar de mantener mundos virtuales simulados monolíticos.

**Diferencias Conceptuales**:
- **Dominio de aplicación**: La Arquitectura de Subsunción fue concebida primariamente para agentes físicos y robótica móvil con capas sensoriomotoras fuertemente ancladas al hardware. UCA generaliza la unidad funcional a cualquier proceso computacional o cognitivo (sensorial, analítico, transformacional, probabilístico o simbólico).
- **Mecanismos de inhibición vs. Composición por Capabilities**: Subsumption utiliza mecanismos físicos de inhibición y supresión cableados entre capas de circuitos. UCA no inhibe unidades: estructura la interacción mediante exposición de Outcomes, propagación de Stimuli y composición recursiva donde una UCA puede utilizar a otra como Capability sin violar su autonomía funcional ni su Purpose.
- **Declaratividad y Mutabilidad**: En Subsumption, las capas son máquinas de estado finito fijas cableadas en código o hardware. En UCA, la `Disposition` es declarativa, observable e inspeccionable, permitiendo la adaptación evolutiva mediante `Mutation` atómica de propiedades dentro de su `Nature`.

### 10.5 Arquitecturas de Pizarra (Blackboard Systems)

Las arquitecturas Blackboard, introducidas paradigmáticamente en el sistema Hearsay-II de reconocimiento de voz (Erman et al., 1980; Nii, 1986), plantearon un modelo de resolución cooperativa y distribuida de problemas donde un conjunto de agentes o módulos especializados (fuentes de conocimiento o *Knowledge Sources*) inspeccionan e interactúan oportunistamente mediante una memoria de trabajo común estructurada ("la pizarra").

**Similitudes con UCA**:
- **Especialización funcional**: Ningún componente individual intenta resolver el problema completo; múltiples unidades con responsabilidades acotadas contribuyen según su especialización.
- **Interacción indirecta**: Los especialistas no se acoplan mediante invocaciones directas entre ellos, sino mediante la observación de cambios en el estado visible.

**Diferencias Conceptuales**:
- **Ausencia de memoria global compartida en el Core**: La arquitectura Blackboard depende intrínsecamente de un espacio de memoria global mutable y compartido, así como de un mecanismo de control oportunista que selecciona qué fuente de conocimiento actúa. El UCA Core prescinde por completo de estado global compartido y de controladores de pizarra; la interacción se produce estrictamente por propagación de señales y exposición de Outcomes entre fronteras funcionales locales. Patrones tipo Blackboard pueden construirse como parte de una Arquitectura Cognitiva compuesta (§4), pero no constituyen un requisito universal del Core.

### 10.6 Teoría del Espacio de Trabajo Global (Global Workspace Theory)

La Teoría del Espacio de Trabajo Global (Baars, 1988; Dehaene et al., 1998; Shanahan, 2006) modela la cognición como una federación masiva de procesadores especializados e inconscientes que compiten por el acceso a una memoria de trabajo de capacidad limitada (el *Global Workspace*), desde el cual la información seleccionada se transmite ampliamente (*broadcast*) a todo el sistema.

**Similitudes con UCA**:
- **Modularidad funcional**: El sistema cognitivo se concibe como una multitud de unidades especializadas de procesamiento acotado.
- **Cooperación emergente**: El comportamiento sistémico unificado se produce a partir de la actividad coordinada de módulos locales.

**Diferencias Conceptuales**:
- **Sin difusión centralizada (broadcast) obligatoria**: UCA no asume que las señales deban transmitirse globalmente a todas las unidades. La propagación en UCA es local, direccionada o basada en suscripciones entre fronteras.
- **Sin competencia atencional en el Core**: GWT fundamenta su dinámica en la competencia de procesadores para dominar el foco de atención del espacio global. En UCA Core, cada unidad reacciona localmente a los Stimuli que cruzan su frontera, sin necesidad de competir por un recurso de difusión global.
- **Neutralidad sobre la conciencia**: GWT es primariamente una teoría biológica y psicológica sobre el acceso consciente. UCA es una especificación de arquitectura de software para unidades funcionales y no formula ninguna afirmación sobre conciencia, introspección ni estados subjetivos.

### 10.7 Arquitectura Cognitiva Soar

Soar (Laird, Newell & Rosenbloom, 1987; Laird, 2012) representa una de las arquitecturas cognitivas clásicas más sistemáticas basadas en la hipótesis del sistema de símbolos físicos. Soar modela toda actividad orientada a metas como búsqueda dentro de espacios de problemas (*problem spaces*), utilizando reglas de producción para seleccionar y aplicar operadores que transforman el estado del sistema hacia una meta deseada (*goal*), complementado por mecanismos de resolución de impasses y aprendizaje por *chunking*.

**Similitudes con UCA**:
- **Búsqueda de comportamiento cognitivo unificado**: Ambas propuestas persiguen comprender y materializar arquitectónicamente cómo sistemas no monolíticos pueden exhibir comportamiento cognitivo complejo y coherente.
- **Persistencia y aprendizaje**: Soar incorpora mecanismos para modificar su conocimiento a partir de la experiencia; UCA define la evolución formal de la Disposition mediante evidencia empírica acumulada y mutaciones atómicas (§2.1, §4.4).

**Contraste Arquitectónico y Elecciones Ontológicas**:
- **Teleología: Purpose frente a Goal**: Soar sitúa el concepto de meta (*goal*) como la abstracción central que guía la selección de operadores y la resolución de impasses durante la ejecución dinámica de una tarea. UCA, por el contrario, adopta **Purpose** como la única fuente de dirección funcional constitutiva de la unidad y elimina formalmente **Goal** como primitiva de activación. En UCA, una unidad no recibe metas externas de activación; recibe señales externas (Stimuli) y reacciona intrínsecamente conforme a lo que su Purpose ya determina que persigue.
- **Motor de reglas vs. Agnóstico a mecanismos**: Soar prescribe un motor de producción estructurado, ciclos de decisión fijos y jerarquías de operadores. UCA es deliberadamente agnóstica respecto a si las Capabilities de una unidad se implementan mediante reglas de producción, código determinista, algoritmos de procesamiento de señal o modelos probabilísticos.

### 10.8 LIDA y Arquitecturas Cognitivas Distribuidas

LIDA (Learning Intelligent Distribution Agent; Franklin et al., 2007, 2016) es una arquitectura cognitiva híbrida y biológicamente inspirada que integra GWT, memorias multinivel (perceptual, episódica, declarativa, procedimental) y ciclos cognitivos recurrentes divididos en fases fijas de percepción, atención y selección de acción.

**Similitudes con UCA**:
- **Distribuibilidad de procesos**: Despliega múltiples componentes especializados para procesar información sensorial y de memoria.
- **Adaptación multinivel**: Reconoce que la adaptación ocurre a diferentes escalas temporales y niveles de abstracción.

**Diferencias Conceptuales**:
- **Ausencia de ciclo cognitivo prefijado**: LIDA fundamenta toda su dinámica en la ejecución estricta y periódica de un ciclo cognitivo universal (Percepción $	o$ Atención $	o$ Selección $	o$ Acción). En UCA Core, no existen fases obligatorias de ciclo de vida ni fases cognitivas universales predefinidas. Cada UCA reacciona de forma asíncrona ante la recepción de su propio Stimulus, y la coordinación secuencial o cíclica emerge, si es necesaria, a través de la topología de la composición inter-unidad (§3) o de la Arquitectura Cognitiva (§4).
- **Módulos de memoria no universales**: En LIDA, los subsistemas de memoria episódica, semántica y atencional son módulos obligatorios del sistema. En UCA, la memoria es una responsabilidad opcional que puede o no modelarse como una UCA especializada cuando el dominio funcional lo requiera (véase §7.2, Hippocampus UCA).

### 10.9 Sistemas Autoadaptativos, Cibernética y Autonomic Computing

La cibernética clásica (Ashby, 1956 - *Design for a Brain* y la ley de variedad requerida) y las arquitecturas de computación autonómica (Kephart & Chess, 2003 - bucle MAPE-K: Monitor, Analyze, Plan, Execute, Knowledge) sentaron las bases teóricas de la adaptación de sistemas basada en retroalimentación y homeostasis frente a perturbaciones del entorno.

**Similitudes con UCA**:
- **Adaptación gobernada por límites invariantes**: En la cibernética de Ashby y en la computación autonómica, el sistema ajusta sus parámetros internos para preservar sus variables esenciales dentro de límites viables. En UCA, este principio se manifiesta directamente en la formalización de **Evolution**: una `Mutation` ($\mu \in \mathbb{M}	ext{ut}$) adapta la `Disposition` ($d$) de la unidad preservando estrictamente su `Purpose` invariante ($	ext{preservesPurpose}(u, \mu)$) y dentro del espacio acotado por sus `Capabilities` ($	ext{withinCapabilities}(u, \mu)$) y la `Nature` de sus propiedades.
- **Uso de evidencia empírica**: La adaptación procede de la observación de consecuencias observables anteriores (`Evidence`), no de modificaciones arbitrarias de código fuente.

**Diferencias Conceptuales**:
- UCA no impone que cada unidad deba implementar un bucle autonómico MAPE-K completo en su interior. La observación, diagnóstico y decisión evolutiva pueden realizarse por procesos de observación externa dentro de una Arquitectura Cognitiva (§4.4), manteniendo a la UCA individual como una unidad funcional puramente reactiva.

---

### 10.10 Síntesis Comparativa de Principios Arquitectónicos

La siguiente tabla resume de forma neutral y descriptiva cómo UCA comparte y contrasta principios conceptuales frente a las principales familias arquitectónicas analizadas:

| Principio Arquitectónico | Tradición / Antecedente Relevante | Tratamiento Específico en UCA Core |
|---|---|---|
| **Reactividad Estricta** | Reactive Systems, Subsumption Architecture | Toda UCA reacciona exclusivamente ante la recepción de un Stimulus externo que cruza su frontera funcional. Ninguna activación espontánea. |
| **Especialización Funcional** | Actor Model, Behavior-Based AI, Soar | Delimitada unívocamente por el Purpose ($p \in \mathbb{P}$), que define qué es la unidad y aquello que persigue durante toda su existencia. |
| **Desacoplamiento Operacional** | Actor Model, Event-Driven Architectures | Interacción inter-UCA mediante señales y exposición de Outcomes. Cero llamadas imperativas o subordinación RPC en la composición. |
| **Composición Recursiva** | Component-Based Software, Actor Systems | Una UCA puede utilizar a otra UCA como una de sus Capabilities conservando cada unidad su propio Purpose y autonomía reactiva. |
| **Emergencia Sistémica** | Subsumption Architecture, GWT, LIDA | El comportamiento complejo no reside en un controlador central monolítico, sino que emerge de las interacciones reactivas de múltiples unidades. |
| **Adaptación Paramétrica** | Autonomic Computing, Cybernetics | Modificación atómica de la Disposition ($\Delta d$) mediante Mutations dentro del espacio delimitado por la Nature, preservando Purpose y Capabilities. |
| **Ausencia de Estado Global** | Actor Model, Subsumption | UCA Core prescinde de memorias globales compartidas, pizarras o snapshots centralizados. |
| **Dirección Teleológica** | Contraste con Soar, LIDA, BDI | Eliminación de `Goal` de activación en favor de `Purpose` constitutivo propio. La UCA no recibe metas; recibe perturbaciones o datos. |

---

### 10.11 El Contrato Propio de UCA y el Alcance de su Hipótesis

La revisión de antecedentes e influencias arquitectónicas pone de manifiesto que UCA no requiere atribuirse la invención aislada de cada uno de sus principios rectores para fundamentar su valor. El aporte de UCA reside en la **combinación formal, minimalista y acotada** de dichos principios dentro de un contrato ontológico estricto:

```text
CONSTITUCIÓN:
u = (p, d, C)

Purpose (p)
    determina funcionalmente qué UCA es y qué persigue.

Capabilities (C)
    delimitan lo que la UCA puede hacer.

Disposition (d)
    determina cómo están constituidas y predispuestas
    sus Capabilities mediante Properties e Interactions.

ACTIVACIÓN REACTIVA:
External Signal ──► Stimulus ──► UCA ──► Action ──► Outcome(s)
```

La existencia de antecedentes históricos que hayan explorado la reactividad, la especialización o la distribución no constituye una validación automática ni una prueba de que la composición de UCAs genere cognición. Por esta razón, la especificación mantiene una estricta separación metodológica:

1. **Los antecedentes arquitectónicos** demuestran que las decisiones de diseño de UCA están ancladas en una tradición madura y sólida de la ciencia de la computación.
2. **La hipótesis de comportamiento cognitivo emergente** (§6) permanece estrictamente como una hipótesis científica falsable, sujeta a verificación experimental y empírica mediante implementaciones de referencia.

---

## 11. Referencias Bibliográficas

1. **Agha, G.** (1986). *Actors: A Model of Concurrent Computation in Distributed Systems*. MIT Press, Cambridge, MA.
2. **Ashby, W. R.** (1956). *An Introduction to Cybernetics*. Chapman & Hall, London.
3. **Baars, B. J.** (1988). *A Cognitive Theory of Consciousness*. Cambridge University Press, New York.
4. **Bonér, J., Farley, D., Kuhn, R., & Thompson, M.** (2014). *The Reactive Manifesto*. Disponible en: https://www.reactivemanifesto.org/
5. **Brooks, R. A.** (1986). A robust layered control system for a mobile robot. *IEEE Journal on Robotics and Automation*, 2(1), 14–23. https://doi.org/10.1109/JRA.1986.1087032
6. **Brooks, R. A.** (1991). Intelligence without representation. *Artificial Intelligence*, 47(1–3), 139–159. https://doi.org/10.1016/0004-3702(91)90053-M
7. **Dehaene, S., Kerszberg, M., & Changeux, J. P.** (1998). A neuronal model of a global workspace in effortful cognitive tasks. *Proceedings of the National Academy of Sciences*, 95(24), 14529–14534. https://doi.org/10.1073/pnas.95.24.14529
8. **Erman, L. D., Hayes-Roth, F., Lesser, V. R., & Reddy, D. R.** (1980). The Hearsay-II speech-understanding system: Integrating knowledge to resolve uncertainty. *ACM Computing Surveys*, 12(2), 213–253. https://doi.org/10.1145/356810.356816
9. **Franklin, S., Strain, S., McCall, R., & Baars, B.** (2007). Conceptual commitments of the LIDA model of cognition. *Journal of Artificial General Intelligence*, 1, 1–17.
10. **Franklin, S., Madl, T., D'Mello, S., & Snaider, J.** (2016). LIDA: A systems-level architecture for computational, cognitive models. *IEEE Transactions on Autonomous Mental Development*, 6(1), 19–41. https://doi.org/10.1109/TAMD.2013.2277589
11. **Hewitt, C., Bishop, P., & Steiger, R.** (1973). A universal modular ACTOR formalism for artificial intelligence. In *Proceedings of the 3rd International Joint Conference on Artificial Intelligence (IJCAI'73)* (pp. 235–245). Morgan Kaufmann Publishers.
12. **Kephart, J. O., & Chess, D. M.** (2003). The vision of autonomic computing. *Computer*, 36(1), 41–50. https://doi.org/10.1109/MC.2003.1160055
13. **Laird, J. E., Newell, A., & Rosenbloom, P. S.** (1987). SOAR: An architecture for general intelligence. *Artificial Intelligence*, 33(1), 1–64. https://doi.org/10.1016/0004-3702(87)90050-6
14. **Laird, J. E.** (2012). *The Soar Cognitive Architecture*. MIT Press, Cambridge, MA.
15. **Nii, H. P.** (1986). Blackboard systems: The blackboard model of problem solving and the evolution of blackboard architectures. *AI Magazine*, 7(2), 38–53.
16. **Shanahan, M.** (2006). A cognitive architecture that combines internal simulation with a global workspace. *Consciousness and Cognition*, 15(2), 433–449. https://doi.org/10.1016/j.concog.2005.11.005

---

## 12. Especificación de Runtime e Implementación de Referencia (TypeScript)

Esta sección formaliza el contrato de programación e implementación concreta de referencia para Unidades Cognitivas Autónomas en runtimes de TypeScript/JavaScript.

### 12.1 Principios del Modelo de Programación en Runtime

1. **Herencia y Ciclo de Vida Biológico (`Adn`)**:
   Toda UCA extiende la clase base fundamental `Adn`, disponiendo de identidad determinista (`id`), logger contextual, canal al sistema nervioso (`nervousSystem`) y activación mediante `live()`.

2. **Declaración Obligatoria de Propósito (`purpose`)**:
   Cada UCA declara explícitamente su propósito ontológico (`public purpose: string`), el cual rige de forma invariante todas sus decisiones y reacciones.

3. **Catálogo de Capabilities en Dominio Superior (`Registry`)**:
   Las clases de capabilities se registran desacopladamente en un catálogo superior (`Registry.register(name, Ctor)`), evitando el acoplamiento rígido de importaciones directas entre el organismo y sus órganos concretos.

4. **Composición Innata de Capabilities y Disposiciones**:
   Un organismo o UCA declara sus capacidades biológicas y su parametrización inicial mediante un diccionario declarativo donde **cada clave debe definirse obligatoriamente en formato `camelCase`**:
   ```typescript
   public capabilities = {
       <camelCaseName>: <dispositionObject>
   };
   ```
   Al activarse la UCA, cada capability es instanciada de forma independiente y aislada (`new Ctor(...)`), inyectándosele su propia `disposition`, el canal común y el sistema nervioso. Las capacidades quedan directamente disponibles en la instancia como propiedades en `camelCase` (ej. `agent.acousticEar`, `agent.vocalMouth`).

5. **Detección Automática de Mutación de Propiedades (Proxy Reactivo)**:
   La instancia de la UCA está envuelta en un Proxy reactivo. Cualquier mutación de propiedades públicas desencadena automáticamente una señal de broadcast en el canal interno (`Channel`) tipada determinísticamente como `<UcaName>.<propertyName>`. Las asignaciones redundantes (mismo valor) son suprimidas en tiempo real.

6. **Reactividad Declarativa (`reactTo`)**:
   Cada UCA receptora define la lista de señales o propiedades ante las cuales reacciona:
   ```typescript
   protected reactTo = [
       'AcousticEar.isListening',
       '<UcaName>.<propertyName>'
   ];
### 12.2 Interfaces y Contratos de Tipado (`types.ts`)

| Interfaz / Tipo | Definición | Responsabilidad |
|---|---|---|
| `Signal` | `{ source: string; property: string; value: unknown; timestamp: number; }` | Representa una señal atómica generada ante la mutación de una propiedad en una UCA emisora. Identifica el origen (`source`), la propiedad mutada (`property`), el valor (`value`) y la marca temporal (`timestamp`). |
| `SignalListener` | `(signal: Signal) => Promise<void> \| void` | Función de callback invocada ante la recepción de una señal en el canal interno. |
| `IChannel` | `emit(signal: Signal): void;`<br>`subscribe(listener: SignalListener): () => void;` | Contrato del bus de comunicación local intra-organismo. Desacopla la emisión de señales de los receptores suscritos. |
| `CapabilityConstructor` | `new (id: string, name: string, config?: Config) => Uca` | Firma del constructor para clases que extienden `Uca` y pueden ser instanciadas dinámicamente como capabilities subordinadas. |
| `IRegistry` | `register(name: string, ctor: CapabilityConstructor): void;`<br>`resolve(name: string): CapabilityConstructor \| undefined;` | Contrato del catálogo superior que mapea nombres de capabilities en `camelCase` con sus correspondientes constructores de clase. |
| `Config` | `{ channel?: IChannel; nervousSystem?: INervousSystem; registry?: IRegistry; disposition?: Record<string, unknown>; }` | Parámetros de configuración e inyección de dependencias para la inicialización de una UCA. |

### 12.3 Especificación de la Clase Base `Uca`

La clase abstracta base `Uca` gobierna el ciclo de vida, el montaje innato de órganos y el despacho reactivo de señales en el runtime.

#### 12.3.1 Propiedades

- `public abstract purpose: string`: Propósito ontológico inmutable que define y orienta la unidad a lo largo de su existencia.
- `public capabilities: Record<string, Record<string, unknown>>`: Diccionario declarativo de capabilities innatas y sus disposiciones, con claves obligatorias en formato `camelCase`.
- `public disposition?: Record<string, unknown>`: Configuración paramétrica e interactiva inyectada en la unidad durante su instanciación.
- `protected channel: IChannel`: Instancia del canal local de señales. Si no se suministra en `Config`, se inicializa una nueva instancia aislada de `Channel`.
- `protected registry: IRegistry`: Referencia al catálogo de capabilities utilizado para resolver constructores. Por defecto utiliza `defaultRegistry`.
- `protected reactTo: string[]`: Array declarativo de señales en formato `<SourceUca>.<property>` ante las cuales la UCA debe reaccionar.

#### 12.3.2 Constructor

```typescript
constructor(id: string, name: string, config?: Config)
```
- Invoca al constructor de `Adn(id, name, nervousSystem)`.
- Asigna `this.disposition`, `this.channel` y `this.registry`.
- Suscribe automáticamente el despachador `this.handleSignal(signal)` al canal interno.
- Envuelve la instancia en un Proxy reactivo (`wrapWithProxy(this)`) y lo retorna, garantizando la interceptación transparente de mutaciones de propiedades.

#### 12.3.3 Métodos de Ciclo de Vida y Montaje de Capabilities

- `public override async live(): Promise<void>`:
  Punto de entrada al ciclo de vida biológico de la UCA. Invoca en primer término a `this.mountCapabilities()` para instanciar e inicializar todos los órganos subordinados declarados en `capabilities`, y delega a continuación en `super.live()`.
- `public mountCapabilities(): void`:
  Itera deterministamente sobre las entradas de `this.capabilities`. Para cada par `[name, disposition]`, verifica si la propiedad ya existe en la instancia; si no existe, delega el montaje a `this.attach(name, disposition)`.
- `public attach(name: string, disposition: Record<string, unknown>): void`:
  Resuelve el constructor de la capability a través de `this.registry.resolve(name)`. Si el constructor está registrado, crea la instancia subordinada mediante `this.createChild(Ctor, name, disposition)` y la asigna como propiedad directa de la UCA bajo el nombre `name` en `camelCase`.
- `public createChild(Ctor: CapabilityConstructor, name: string, disposition: Record<string, unknown>): Uca`:
  Instancia de forma aislada e independiente una UCA hija (`new Ctor(...)`), pasándole un identificador único concatenado (`${this.id}-${name}`), compartiendo el canal (`this.channel`) y el sistema nervioso (`this.nervousSystem`), e inyectándole su `disposition` específica.

#### 12.3.4 Métodos de Reactividad y Despacho de Señales

- `public canProcess(signal: Signal): boolean`:
  Evalúa en $O(1)$ si la UCA debe procesar la señal entrante comprobando si la clave determinista `${signal.source}.${signal.property}` se encuentra incluida en la lista `this.reactTo`.
- `public handleSignal(signal: Signal): void`:
  Manejador interno de señales suscripto al canal. Si `this.canProcess(signal)` resulta verdadero, invoca de forma asíncrona y segura a `this.react(signal)`.
- `public async react(signal: Signal): Promise<void>`:
  Punto de extensión protegido y sobreescribible por las subclases de UCA para ejecutar su comportamiento reactivo específico ante las señales que han superado el filtro de `canProcess`.

#### 12.3.5 Mecanismo del Proxy Reactivo (`wrapWithProxy`)

La instancia de toda UCA es interceptada mediante un Proxy de JavaScript en tiempo de construcción:
1. **Detección de Mutación (`set` trap)**: Al asignar un valor a cualquier propiedad de la UCA, el trap `set` verifica si el nuevo valor difiere del valor existente (`target[prop] !== value`).
2. **Supresión de Emisiones Redundantes**: Si el valor asignado es idéntico al actual, la asignación se realiza silenciosamente en la instancia sin emitir señales al canal, evitando loops infinitos y ruidos en el sistema.
3. **Emisión Automática de Señal**: Si el valor ha cambiado, se actualiza la propiedad y se emite inmediatamente un objeto `Signal` al canal común con:
   - `source`: Nombre de la clase constructora (`this.constructor.name`).
   - `property`: Nombre de la propiedad mutada en formato `string`.
   - `value`: Nuevo valor asignado.
   - `timestamp`: Marca de tiempo Unix (`Date.now()`).

### 12.4 Ejemplo Canónico de Referencia (No Normativo)

> **Nota aclaratoria:** El código presentado a continuación es **estrictamente un ejemplo de uso no normativo**. Su único propósito es ilustrar de manera práctica cómo se traducen los principios formales del runtime de UCA a TypeScript. No prescribe una arquitectura fija ni limita la diversidad de capacidades u organismos que pueden desarrollarse conforme a esta especificación.

```typescript
import { Uca, defaultRegistry, Signal } from './uca/index.js';

// 1. Definición de Capabilities Primitivas
export class AcousticEar extends Uca {
    public override purpose = 'Percepción acústica y transcripción continua de voz';
    public isListening = false;
    public lastTranscript = '';

    public transcribe(text: string): void {
        this.lastTranscript = text;
    }
}

export class VocalMouth extends Uca {
    public override purpose = 'Síntesis y alocución vocal hacia el exterior';
    public speechQueue: string[] = [];
    protected override reactTo = ['AcousticEar.lastTranscript'];

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            this.speechQueue.push(`[Voz sintetizada] ${value}`);
        }
    }
}

// 2. Registro en Catálogo Superior (claves camelCase)
defaultRegistry.register('acousticEar', AcousticEar);
defaultRegistry.register('vocalMouth', VocalMouth);

// 3. Organismo con Capabilities Innatas y Disposición
export class ConversationalAgent extends Uca {
    public override purpose = 'Agente biológico de alocución interactiva';
    public override capabilities = {
        acousticEar: { sampleRate: 16000, framingMs: 100 },
        vocalMouth: { voice: 'alloy', rate: 1.0 },
    };
}

// 4. Uso del Agente: Acceso en camelCase, Disposición y Reactividad Desacoplada
export async function runVoiceAgentExample(): Promise<void> {
    const agent = new ConversationalAgent('agent-001', 'ConversationalAgent');

    // Cada capability se instancia aisladamente y queda expuesta en la propiedad camelCase
    const ear = (agent as unknown as Record<string, AcousticEar>)['acousticEar'];
    const mouth = (agent as unknown as Record<string, VocalMouth>)['vocalMouth'];

    console.log(`Propósito del Agente: ${agent.purpose}`);
    console.log('Disposición de acousticEar:', ear.disposition);
    console.log('Disposición de vocalMouth:', mouth.disposition);

    // Activación reactiva: la mutación de una propiedad en acousticEar emite automáticamente
    // la señal 'AcousticEar.lastTranscript', a la cual reacciona vocalMouth de forma desacoplada
    ear.isListening = true;
    ear.transcribe('Hola, arquitecto cognitivo');

    // Consecuencia observable en el organismo
    console.log('Cola de habla en vocalMouth:', mouth.speechQueue);
    // Salida: ['[Voz sintetizada] Hola, arquitecto cognitivo']
}
```

---

## Licencia

UCA Specification © 2026 Christian Marino Alvarez.

Esta especificación y su documentación están licenciadas bajo la
Licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).

Eres libre de usar, compartir, adaptar e implementar esta especificación,
incluso con fines comerciales, siempre que se proporcione la atribución adecuada.

Las implementaciones de software y los runtimes de referencia se licencian por separado.

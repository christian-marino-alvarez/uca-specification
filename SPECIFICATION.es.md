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
│  u = (p, d, C, O)           │
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
2. ¿Puede expresarse mediante Purpose, Disposition, Outcome o composición de UCAs?

Si (1) es NO, el concepto no pertenece al Core.
Si (2) es SÍ, el concepto debe permanecer fuera del Core.

Este principio exige que no se introduzcan abstracciones redundantes en el Core: si el `Purpose` ya determina de forma exclusiva y suficiente aquello que la UCA persigue durante toda su existencia, ninguna segunda abstracción teleológica pertenece al Core.

### Principio de Composición

> **Antes de extender la primitiva UCA con un nuevo mecanismo cognitivo, intentar representar esa responsabilidad mediante composición de UCAs existentes.**

Los conceptos que puedan expresarse mediante Purpose, Disposition, Outcome o composición de UCAs no deben añadirse como primitivas universales del UCA.

### Principios Fundamentales del Modelo

1. **Conception determina qué UCA existe.**
2. **Purpose determina funcionalmente qué UCA es y aquello que persigue durante toda su existencia.**
3. **Capabilities determinan los límites de lo que la UCA puede hacer.**
4. **Disposition determina cómo esas Capabilities están constituidas y predispuestas para comportarse e interactuar.**
5. **Stimulus es una señal externa a la frontera de la UCA cuya recepción provoca la reacción de una UCA ya concebida.**
6. **Las Capabilities reaccionan mediante su predisposición reactTo y no mediante dependencias directas ni pipelines centrales.**
7. **El Process y las Actions emergen dinámicamente de las relaciones reactivas locales entre Capabilities conforme a sus Dispositions.**
8. **Outcome es la consecuencia observable de dicha actividad, validada ontológicamente de forma inmutable, mientras que Action y Reaction pertenecen al dominio interno encapsulado de la UCA.**
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
| $\text{reactTo}$ | $r \in \text{reactTo}$ | Suscripción reactiva declarada: fuentes observables ante las que reacciona la Capability. |
| $\mathbb{S}$ | $s \in \mathbb{S}$ | Stimulus: recepción por una UCA de un cambio observable externo a su dominio que provoca su reacción. |
| $\text{Reception}$ | $\text{receives}(u, \Delta x)$ | Reception: mecanismo universal, mecánico y no cognitivo por el cual una UCA recibe un cambio observable externo a su dominio que puede provocar su reacción. |
| $\mathbb{R}\text{xn}$ | $r \in \mathbb{R}\text{xn}$ | Reaction: proceso interno desencadenado por un Stimulus, compuesto por las Actions y reacciones internas. |
| $\mathbb{A}$ | $a \in \mathbb{A}$ | Action: operación o transición interna perteneciente a la Reaction encapsulada de la UCA. |
| $\mathbb{X}$ | $x \in \mathbb{X}$ | Context: información situacional o sustrato contextual de soporte (patrón opcional, §4). |
| $\mathbb{O}$ | $o \in \mathbb{O}$ | Outcome: cambio observable estructurado $(\text{Properties}, \text{Criteria}, \text{Owner})$ producido por una UCA como consecuencia de su actividad. |
| $\text{Compliance}$ | $\text{comp} \in \{\text{PASS}, \text{FAIL}\}$ | Compliance: evaluación determinista de los Criteria de un Outcome. |
| $\text{Validation}$ | $\text{val} \in \{\text{APPROVED}, \text{REJECTED}\}$ | Validation: decisión contextual y juicio de aceptación emitido exclusivamente por el Owner del Outcome. |
| $\text{Owner}$ | $\text{owner} \in \mathbb{U} \cup \mathbb{H}\text{uman}$ | Owner: UCA externa o Humano (Terminal Owner) con autoridad en el contexto para validar o rechazar el Outcome ($\text{owner} \neq u_{\text{target}}$). |
| $\mathbb{M}\text{ut}$ | $\mu \in \mathbb{M}\text{ut}$ | Mutation: cambio atómico identificable sobre la Disposition. |
| $\mathbb{E}$ | $e \in \mathbb{E}$ | Evidence: observaciones y evaluaciones acumuladas sobre el comportamiento. |
| $\mathbb{H}$ | $H \in \mathbb{H}$ | History: registro acumulado de evidencia histórica multiejecución $[s, o, \text{Compliance}, \text{Validation}, d, t, \mu, x]$. |

#### 3. Relaciones Nombradas

Las expresiones normativas deben preferir relaciones explícitas con nombre frente a flechas no tipadas:

- **$\text{hasPurpose}(u, p)$**: Afirma que la UCA $u$ posee el propósito propio $p$. En toda UCA conforme: $\exists! p \in \mathbb{P} : \text{hasPurpose}(u, p)$.
- **$\text{hasDisposition}(u, d)$**: Afirma que la UCA $u$ está predispuesta por la disposición efectiva $d$.
- **$\text{hasCapability}(u, c)$**: Afirma que la capacidad $c$ pertenece al conjunto constitutivo de $u$ ($c \in C$).
- **$\text{receives}(u, \Delta x)$**: Afirma que la UCA $u$ recibe mecánicamente en su frontera reactiva el cambio observable externo $\Delta x$.
- **$\text{triggers}(s, u)$**: Afirma que la recepción del estímulo externo $s$ por la UCA $u$ desencadena su proceso interno de reacción. Expresa activación reactiva estricta; NO implica orden, instrucción ni causalidad metafísica global.
- **$\text{produces}(u, o)$**: Afirma que la actividad o reacción de la UCA $u$ genera como consecuencia observable externa el outcome estructurado $o$.
- **$\text{precedes}(o_1, o_2)$**: Afirma precedencia temporal estricta entre outcomes observables ("$o_1$ ocurrió antes que $o_2$"). Cuando se aplica a acciones internas ($\text{precedes}(a_1, a_2)$), describe una relación de orden temporal interna dentro de la reacción encapsulada.
- **$\text{reactsTo}(\text{target}, \text{change})$**: Afirma una relación reactiva declarada donde una Capability o interacción responde a un cambio local observable.
- **$\text{satisfies}(v, n)$**: Afirma que el valor $v$ cumple las restricciones y el tipo declarados por la Nature $n$ ($v \in \text{validDomain}(n)$).
- **$\text{complies}(o)$**: Afirma la evaluación determinista de los Criteria de $o$. Retorna $\text{PASS}$ si todos los Criteria se cumplen, o $\text{FAIL}$ en caso contrario.
- **$\text{validates}(\text{owner}, o)$**: Afirma el juicio operacional emitido por el Owner sobre $o$. Retorna $\text{APPROVED}$ si el Owner valida el outcome en su contexto de uso, o $\text{REJECTED}$ si lo rechaza.
- **$\text{hasOwner}(o, \text{owner})$**: Asocia el Outcome $o$ con la entidad externa $\text{owner} \in \mathbb{U} \cup \mathbb{H}\text{uman}$ que ostenta la autoridad exclusiva de validación. Invariante estricta: $\text{owner} \ne u_{\text{target}}$.

#### 4. Semántica de Flechas y Operadores

- **Flechas en diagramas informativos**: Las flechas no etiquetadas ($\to$, $\longrightarrow$, $\downarrow$) en diagramas informativos o conceptuales indican **únicamente dirección visual de lectura**. NO establecen por sí mismas causalidad formal, producción, reacción, transformación ontológica, transporte ni precedencia temporal.
- **Flechas en expresiones normativas**: Toda flecha utilizada normativamente es una abreviatura (*shorthand*) de una relación con nombre definida:
  - $(u, s) \to o \iff \text{triggers}(s, u) \land \text{produces}(u, o)$.
  - Internamente en el dominio encapsulado: $s \to \text{Reaction}(u) \to o$.
  - Las acciones internas $a_i$ se ejecutan como parte de la reacción: $a_i \in \text{Actions}(\text{Reaction}(u, s))$.
- **Prohibición del operador $+$ pseudoformal**: El símbolo $+$ no debe utilizarse normativamente para denotar combinación, coexistencia o emergencia. Expresiones como $\text{Capabilities} + \text{Dispositions} \to \text{Process}$ se sustituyen por descripciones relacionales explícitas: el Process emerge de las relaciones reactivas entre Capabilities conforme a sus Dispositions.
- **Semántica estricta de $\Delta$**: El símbolo $\Delta$ denota exclusivamente la diferencia o cambio entre dos estados identificables ($\Delta D = \text{difference}(D_0, D_1)$). $\Delta$ **MUST NOT** interpretarse como mejora, progreso, ganancia o cambio cualitativamente positivo.

#### 5. Reglas de Buena Formación (Well-Formedness Rules)

1. **Definición Obligatoria**: Todo símbolo utilizado en afirmaciones normativas MUST tener un significado y dominio explícitamente definidos.
2. **Unicidad Semántica**: Un mismo operador o símbolo MUST NOT representar relaciones arquitectónicas diferentes en expresiones normativas.
3. **Independencia Temporal vs Evaluativa**: $\text{precedes}(o_1, o_2)$ MUST NOT implicar que $o_2$ es mejor, superior o más deseable que $o_1$.
4. **Reactividad vs Causalidad**: La declaración $\text{reactsTo}(x, y)$ establece dependencia de activación reactiva, pero MUST NOT implicar automáticamente una teoría formal de causalidad metafísica o global.
5. **Aislamiento de Capas**: Conceptos de infraestructura o transporte (como `Impulse`, perteneciente a Runtime) MUST NOT introducirse como requisitos del modelo formal de UCA Core.
6. **Disociación Estricta entre Compliance y Validation**: $\text{complies}(o) = \text{PASS}$ MUST NOT implicar $\text{validates}(\text{owner}, o) = \text{APPROVED}$, y $\text{complies}(o) = \text{FAIL}$ MUST NOT implicar $\text{validates}(\text{owner}, o) = \text{REJECTED}$. Los cuatro estados de cruce son empíricamente válidos.
7. **Prohibición de Autovalidación**: Para todo Outcome $o$ producido por una UCA $u_{\text{target}}$, $\text{hasOwner}(o, \text{owner}) \implies \text{owner} \ne u_{\text{target}}$. Una Target UCA MUST NOT validar ni aprobar sus propios Outcomes.
8. **Evolución Mediada e Histórica**: La evolución de una UCA requiere evidencia histórica acumulada ($H \in \mathbb{H}$) multiejecución procesada por UCAs especializadas (Tracking, Analysis, Evolution); una UCA MUST NOT auto-evolucionar directamente en respuesta a un Outcome individual o aislado.
9. **Carácter Relacional de Outcome y Stimulus**: Un cambio observable $\Delta x$ producido por una UCA $u_A$ ($\text{Outcome}(u_A, \Delta x)$) y recibido por una UCA $u_B$ provocando su reacción ($\text{Stimulus}(u_B, \Delta x)$) representa dos posiciones relacionales del mismo cambio respecto de fronteras funcionales distintas. $\text{Outcome}$ y $\text{Stimulus}$ MUST NOT tratarse como tipos ontológicos disjuntos que requieran transformación o conversión en runtime.
10. **No Inferencia Automática de Stimulus**: $\text{Outcome}(u_A, \Delta x)$ MUST NOT implicar automáticamente $\exists u_B : \text{Stimulus}(u_B, \Delta x)$. Un cambio observable solo constituye un Stimulus para una UCA receptora si es recibido mecánicamente y su Disposition provoca una reacción reactiva.
11. **Disociación entre Reception y Perception**: $\text{Reception}$ es el mecanismo universal, mecánico y no cognitivo de UCA Core. $\text{Perception}$ es una función especializada, opcional y compositiva dependiente del Purpose. Un $\text{Stimulus}$ MUST NOT exigir $\text{Perception}$.

---

## 2. UCA Core

El UCA Core define las propiedades mínimas requeridas para identificar una unidad funcional como Unidad Cognitiva Artificial.

---

### 2.1 Definición, Concepción y Ciclo de Vida

Una **Unidad Cognitiva Artificial (UCA)** es una unidad funcional acotada definida por un **propósito propio**, constituida por unas **capacidades concretas**, predispuesta por una **disposición declarativa** y delimitada por la definición explícita de sus **consecuencias observables (Outcome)**:

> Una UCA se define no por lo que ejecuta, sino por el propósito que es responsable de alcanzar y por las consecuencias observables que produce bajo criterios verificables gobernados por un Owner.

```text
u = (p, d, C, O)
```

Donde $u \in \mathbb{U}$ se modela conceptualmente mediante la estructura constitutiva:
$$u = (p, d, C, O) \in \mathbb{P} \times \mathbb{D} \times \mathcal{P}(\mathbb{C}) \times \mathbb{O}_{\text{def}}$$

expresable en términos de predicados normativos como:
$$\text{hasPurpose}(u, p) \land \text{hasDisposition}(u, d) \land (\forall c \in C, \text{hasCapability}(u, c)) \land \text{definesOutcome}(u, O)$$

Donde:
- `p` ($\in \mathbb{P}$) — **Purpose** (Propósito): por qué existe la UCA — orienta su reacción de forma invariante.
- `d` ($\in \mathbb{D}$) — **Disposition** (Disposición): condiciones constitutivas, paramétricas e interactivas — predispone su comportamiento.
- `C` ($\subseteq \mathbb{C}$) — **Capabilities** (Capacidades): conjunto finito no vacío de recursos operacionales — delimitan su frontera funcional.
- `O` ($\in \mathbb{O}_{\text{def}}$) — **Outcome**: definición canónica de las consecuencias observables estructuradas en $(\text{Properties}, \text{Criteria}, \text{Owner})$ que la unidad puede emitir.

Esta expresión describe la **constitución conceptual** de una UCA y no una ecuación aritmética.

#### Conception

> **Conception es el momento en que una UCA queda constituida con un Purpose, unas Capabilities, una Disposition inicial y la definición de su Outcome.**

```text
Conception
    ↓
UCA
├── Purpose
├── Capabilities
├── Disposition
└── Outcome
    ├── Properties
    ├── Criteria
    └── Owner
```

La `Conception` determina **qué UCA existe**.

Desde su `Conception`, la UCA **permanece funcionalmente vigente**. Los conceptos de estados técnicos tradicionales (`Birth`, `Start`, `Startup`, `Initialize`, `Boot`, `Ready`, `Active`, `Idle`, `Finished`, `Execute`) pertenecen a la implementación técnica del runtime y no forman parte del ciclo de vida conceptual de una UCA.

#### Frontera Conceptual de Encapsulación

El modelo UCA formaliza cuatro niveles categóricos estrictamente delimitados:

```text
FUNCTIONAL CONTRACT
───────────────────
Purpose
Capabilities

CONSTITUTION / CONFIGURATION
────────────────────────────
Disposition

OBSERVABLE CONSEQUENCE
──────────────────────
Outcome

ENCAPSULATED INTERNAL DOMAIN
────────────────────────────
Reaction
Actions
Mechanisms
internal reactions
internal process
```

- **Functional Contract (Contrato Funcional)**: `Purpose` y `Capabilities` definen aquello que la UCA persigue funcionalmente y los límites operacionales de lo que es capaz de hacer. Es público y cognoscible para quien compone o interactúa con la unidad.
- **Constitution / Configuration (Constitución)**: `Disposition` determina cómo sus capacidades están predispuestas a comportarse e interactuar mediante condiciones paramétricas e interactivas. Representa la configuración observable y mutable de la unidad.
- **Observable Consequence (Consecuencia Observable)**: `Outcome` representa el cambio observable producido por la actividad de la UCA, estructurado en `Properties`, `Criteria` y `Owner`. Es la única frontera de interacción, evaluación y evidencia para otras UCAs.
- **Encapsulated Internal Domain (Dominio Interno Encapsulado)**: `Reaction`, las `Actions` individuales, los `Mechanisms` y el `Process` emergente pertenecen exclusivamente al interior de la UCA. Ninguna UCA consumidora necesita conocerlos ni acoplarse a ellos para reaccionar al Outcome.

#### Separación entre Constitución y Activación

El modelo UCA formaliza dos dimensiones estrictamente independientes:

**1. Constitución**
```text
u = (p, d, C, O)

p = qué determina funcionalmente la UCA y aquello que persigue
d = cómo están constituidas y predispuestas sus capacidades
C = qué puede hacer (frontera funcional)
O = consecuencias observables que produce, con criterios y Owner
```

**2. Activación**
```text
external observable change (Δx)
      │
      ▼
   Reception
      │
      ▼
   Stimulus
      │
      ▼
┌───────────────────────────────┐
│           TARGET UCA          │
│                               │
│           Reaction            │
│         ┌───────────┐         │
│         │ Actions   │         │
│         │ Mechanisms│         │
│         │ Process   │         │
│         └───────────┘         │
│                               │
└───────────────┬───────────────┘
                │
                ▼
      Outcome (observable Δy)
      ├── Properties (información observable producida)
      ├── Criteria   ──► Compliance (PASS | FAIL determinista)
      └── Owner      ──► Validation (APPROVED | REJECTED contextual)
```

El `Stimulus` provoca actividad reactiva en una UCA ya concebida.
El `Purpose` determina hacia qué está orientada intrínsecamente esa actividad.
El Stimulus **MUST NOT** redefinir, alterar ni sustituir el Purpose.

#### Ciclo de Vida Reactivo y Evolutivo

Una UCA no pasa por fases rígidas de arranque y finalización. Reacciona a los Stimuli recibidos ejecutando su reacción interna y emitiendo Outcomes observables, mientras que UCAs especializadas registran y analizan la evidencia histórica acumulada para guiar la evolución de su Disposition:

```text
                                  CONCEPTION
                                       │
                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                                TARGET UCA                                 │
 │                                                                           │
 │   Stimulus ────────► [ Reaction: Actions, Mechanisms, Process ]           │
 │                                       │                                   │
 └───────────────────────────────────────┼───────────────────────────────────┘
                                         ▼
                                      Outcome
                                      ├── Properties
                                      ├── Criteria ──► Compliance
                                      └── Owner ─────► Validation
                                                            │
                                                            ▼
                                                  ┌───────────────────┐
                                                  │    Tracker UCA    │
                                                  └─────────┬─────────┘
                                                            ▼
                                                    History (H ∈ ℍ)
                                                            │
                                                            ▼
                                                  ┌───────────────────┐
                                                  │   Analyzer UCA    │
                                                  └─────────┬─────────┘
                                                            ▼
                                                   Analysis / Patterns
                                                            │
                                                            ▼
                                                  ┌───────────────────┐
                                                  │   Evolution UCA   │
                                                  └─────────┬─────────┘
                                                            ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │ TARGET UCA                                                                │
 │   evolved Reaction ◄────────────── ΔDisposition ◄───── Mutation Proposal  │
 │   (Actions & Process)           (D₁ = diff(D₀, D₁))                       │
 │              │                                                            │
 └──────────────┼────────────────────────────────────────────────────────────┘
                ▼
         evolved Outcome(s)
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

#### Origen, Semántica y Verificación del Purpose

1. **Definición Exógena por el Creador (Programador)**:
   El `Purpose` no es auto-generado, calculado ni deducido dinámicamente por la propia unidad en tiempo de ejecución. Es una **declaración ontológica inmutable formulada por el programador (el creador)** en el momento de la `Conception`. Representa el anclaje teleológico primario y la razón de existencia de la UCA.

2. **Ausencia de Autoevaluación Semántica en la Target UCA**:
   La Target UCA no posee un evaluador reflexivo para comprobar si sus reacciones en cada ciclo satisfacen formalmente su propio Purpose. La unidad se limita mecánicamente a reaccionar ante estímulos dentro de los límites de sus Capabilities y Disposition.

3. **Verificación Inferencial por la UCA de Análisis (Cíngulo / Analyzer)**:
   La verificación de si una UCA está cumpliendo o desviándose de su Purpose es una **responsabilidad inferencial externa y asíncrona** que corresponde a la **UCA de Análisis** (ej. `Cingulate UCA` o el rol *Analyzer UCA* en la arquitectura evolutiva, §5):
   - La UCA de Análisis lee el `Purpose` textual declarado de la Target UCA.
   - Recopila la evidencia histórica multiejecución acumulada ($H \in \mathbb{H}$): estímulos recibidos ($s$), outcomes producidos ($o$), cumplimiento objetivo de criterios (`Compliance`) y juicios de conveniencia del Owner (`Validation`).
   - Mediante inferencia cognitiva, la UCA de Análisis determina si la trayectoria real de la unidad cumple su Purpose y, de no ser así, gatilla en la UCA de Evolución hipótesis de mutación sobre su `Disposition` para corregir la deriva.

> **Principio de Verificación Semántica del Purpose**:  
> El Purpose de una UCA no se verifica mediante un predicado determinista o booleano computable internamente por la propia unidad en tiempo de ejecución, sino mediante **inferencia evaluativa externa** efectuada por una UCA de Análisis (Cíngulo) sobre la evidencia empírica histórica acumulada.

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
    └── reactTo (Fuentes observables ante las que reacciona)
```

En forma resumida:
- **Mechanism** = procedimiento interno concreto que proporciona la capacidad funcional.
- **Definition** = constitución y parametrización autodescriptiva de la Capability (cómo está constituida y ajustada).
- **reactTo** = aquello ante lo que reacciona (determina la conexión reactiva local con otras Capabilities o estímulos).
- **Disposition** = `Definition` + `reactTo`.

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

#### reactTo y Conexión Reactiva Local

Las Capabilities no dependen directamente unas de otras ni son orquestadas por un procesador o pipeline central imperativo. Reaccionan localmente ante cambios observables o Outcomes declarados en su `reactTo`:

```text
observable Δ / Outcome(A) ──► matches B.reactTo ──► B reacts ──► Outcome(B) ──► matches C.reactTo ──► C reacts
```

La topología de ejecución emerge exclusivamente de estas relaciones reactivas locales.

#### Ejemplo Canónico: SherpaRecognition

```text
Primitive Capability: SherpaRecognition
│
├── Mechanism
│   └── reconocimiento online de voz mediante
│       Sherpa-ONNX y un modelo neuronal transductor
│
└── Disposition
    ├── Definition (Properties)
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
    └── reactTo: ["PcmToFloat.outcome"]
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
        ├── Disposition(EchoCancellation) { Definition, reactTo }
        ├── Disposition(AudioFraming) { Definition, reactTo }
        ├── Disposition(PcmToFloat) { Definition, reactTo }
        ├── Disposition(SherpaRecognition) { Definition, reactTo }
        ├── Disposition(EchoTextFilter) { Definition, reactTo }
        └── Disposition(EarCoherence) { Definition, reactTo }
```

No se duplican innecesariamente estos parámetros en una segunda estructura abstracta. La UCA conoce la constitución concreta de sus capacidades y sus respectivas Dispositions.

#### Armonización de Dispositions respecto al Purpose

Las Dispositions de las capacidades que forman una UCA no deben entenderse como configuraciones independientes. Su combinación determina el comportamiento emergente de la UCA respecto a su `Purpose`:

```text
Dispositions de las Capabilities (Definition + reactTo)
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

> **Armonizar una UCA puede requerir modificar tanto las Properties/Parámetros (Configuration/Parametrization) como las conexiones reactivas (`reactTo`) de las capacidades que la constituyen.**

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

Una UCA posee un Purpose propio que orienta todas sus reacciones. La señal externa entrante (Stimulus) provoca la reacción y aporta los datos requeridos, sin necesidad de instruir a la unidad sobre qué debe perseguir. El Purpose es la única fuente de dirección funcional de una UCA y no admite conceptos intermedios que modulen o redefinan la dirección establecida por él.

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
Stimulus ≠ Action
Stimulus ≠ Outcome
```

---

### 2.7 Stimulus (S) e Impulse

La definición canónica de Stimulus en el UCA Core es:

> **Stimulus es la recepción por una UCA de un cambio observable externo a su dominio que provoca su reacción.**

```text
external observable change
           │
           ▼
      Reception
           │
           ▼
        Stimulus
           │
           ▼
        Reaction
```

Características normativas del Stimulus:
- **es la recepción de un cambio observable externo** al dominio de la UCA receptora;
- **provoca una reacción** reactiva en dicha UCA conforme a su Disposition;
- **no requiere interpretación cognitiva ni percepción previa**;
- **no contiene ni redefine el Purpose**;
- **no prescribe una Action**;
- **no determina un Outcome**;
- **no constituye una meta ni un objetivo**;
- **no necesita poseer semántica cognitiva**;
- **no requiere una estructura universal fija**.

Formalmente, $s \in \mathbb{S}$ y:
$$\text{triggers}(s, u)$$
expresa estrictamente que la recepción del cambio observable externo $s$ por la UCA $u$ desencadena su proceso interno de reacción.

#### Alcance de "Externo" y Reactividad Local

> **External se define respecto de la frontera de la UCA receptora, no respecto del sistema completo.**

Por tanto:
```text
System
│
├── UCA A
│     │
│     └── Outcome
│
└── UCA B
      ▲
      │
   Stimulus
```

El origen del cambio puede pertenecer al mismo sistema, pero es externo respecto del dominio operativo de `UCA B`. Por consiguiente, la cadena:
$$\text{UCA}_A \longrightarrow \text{Outcome} \longrightarrow \text{UCA}_B \longrightarrow \text{Stimulus}$$
es plenamente válida sin requerir que la señal proceda de un humano, hardware o entorno exterior al sistema. Una señal externa cruza la frontera funcional de la UCA receptora provenga de donde provenga.

#### Desacoplamiento entre Semántica Core y Mecanismos de Runtime

Es fundamental mantener estrictamente separados los conceptos semánticos del modelo UCA de las representaciones y mecanismos técnicos de transporte en el runtime:

```text
Semántica UCA Core
──────────────────
Outcome
Stimulus
Reception
Reaction

Mecanismos de Runtime
─────────────────────
Signal
Impulse
Channel
NervousSystem
```

```text
Runtime / Infrastructure
       │
       │ transports (Signal / Impulse / Event)
       ▼
    Reception (frontera de UCA)
       │
       ▼
    Stimulus (cambio externo recibido que detona reacción)
       │
       ▼ triggers
      UCA (react)
```

**$\text{Signal} \ne \text{Stimulus}$ e $\text{Impulse} \ne \text{Stimulus}$**:
`Signal` e `Impulse` son estructuras y vehículos técnicos de propagación provistos por el runtime o el entorno (§5). `Stimulus` expresa la posición relacional de activación respecto de la UCA receptora cuando el cambio recibido provoca su reacción. Una UCA conforme no requiere obligatoriamente recibir un `Impulse`; el runtime puede transportar el cambio mediante señales, llamadas directas en memoria, sockets, eventos o cualquier otro mecanismo técnico.

---

### 2.8 Dominio de Activación y Compatibilidad de Señales

Una UCA reacciona a los Stimuli que cruzan su frontera funcional e interaccionan con las Capabilities que la constituyen.

La compatibilidad y pertinencia de una señal respecto a una UCA no exige que toda unidad evalúe un predicado semántico universal computable en cada activación. En unidades sensoriales o de streaming (como `Ear`), la compatibilidad queda determinada físicamente por la propia interfaz de sus Capabilities receptoras (ej. un stream de audio crudo compatible con el mecanismo de captura). En unidades cognitivas, puede resolverse mediante suscripciones tipadas, contratos de interfaz o discriminación por el runtime (véase §9.1).

La entidad emisora no determina la reacción de la receptora; expone o transmite una señal, y la UCA receptora reacciona conforme a aquello que ya es: su propio Purpose, Capabilities y Disposition.

---

### 2.9 Reaction, Action y Reactive Process

> **Reaction es el proceso interno desencadenado en una UCA por un Stimulus, constituido por las Actions, Mechanisms e interacciones internas necesarias para producir sus consecuencias observables.**
>
> **Action es cualquier operación o transición interna que ocurre dentro de una UCA como parte de su Reaction.**

Conceptualmente:

```text
Stimulus
    │
    ▼
Reaction (dominio interno encapsulado)
    ├── Action₁ (activación de Capability / ejecución de Mechanism)
    ├── Action₂ (transición de estado interno o mutación de propiedad)
    ├── Action₃ (transformación de datos o propagación interna de señal)
    └── ...
    │
    ▼ (proceso reactivo emergente interno)
Outcome (frontera observable externa)
```

#### Dominio Interno Encapsulado: `Action = internal`

Una `Action` pertenece exclusivamente al interior de la UCA. No forma parte por sí misma del contrato observable entre UCAs:

```text
UCA A
   │
   │ Reaction (encapsulada)
   │ ├── Action₁
   │ ├── Action₂
   │ └── Action₃
   │
   ▼
Outcome (observable)
   │
   ▼ (Reception)
UCA B (Stimulus)
```

La UCA consumidora (`UCA B`) **MUST NOT** necesitar conocer las `Actions` internas, mecanismos o secuencia procedimental mediante la que se produjo un `Outcome` para reaccionar ante él.

#### Encapsulación de Mechanisms y Process

- **Capability vs. Mechanism**: Una `Capability` se declara en el contrato funcional como capacidad operativa de la unidad. Un `Mechanism` ($m \in \mathbb{M}$) es el procedimiento computacional interno que la provee. Otra UCA no debe acoplarse a la secuencia interna de ejecución de un Mechanism.
- **Process Emergente Interno**: El `Reactive Process` es la dinámica emergente producida por las interacciones entre Capabilities conforme a su `Disposition`. Dicho proceso es **interno** a la unidad y no constituye el contrato observable entre UCAs.

#### Intercambiabilidad Interna sin Ruptura de Consumidores

Una UCA puede modificar internamente su implementación (por ejemplo, sustituir un Mechanism por otro o alterar su secuencia interna de Actions) sin quebrar a las UCAs consumidoras mientras preserve su contrato funcional y las especificaciones observables de su `Outcome`:

```text
Ear UCA
├── Disposition₀ / implementación interna: Mechanism Sherpa
└── Disposition₁ / implementación interna: otro motor ASR

Consumidores (Thalamus):
Continúan dependiendo exclusivamente de Outcome (text: "Hola"), no del mecanismo interno.
```

---

### 2.10 Outcome (O)

> **Outcome es un cambio observable producido por una UCA como consecuencia de su actividad.**

`Outcome` se define estrictamente respecto de la UCA productora:

```text
UCA A
   │
   │ activity / Reaction
   ▼
observable Δx
   │
   └── Outcome(A, Δx)
```

El `Outcome` ($o \in \mathbb{O}$) representa el cambio observable producido efectivamente por la actividad o reacción de la UCA:

$$\text{produces}(u, o)$$

(notación abreviada: $(u, s) \to o$).

Las `Actions` internas contribuyen operacionalmente a producir el Outcome, pero dicha relación pertenece al proceso encapsulado de la unidad y no se expone como relación pública de composición.

Distinción ontológica fundamental:
```text
STIMULUS (S): Recepción por una UCA de un cambio observable externo que provoca su reacción.
OUTCOME (O):  Cambio observable estructurado producido por una UCA como consecuencia de su actividad.
```

El Outcome pertenece estrictamente a la unidad ejecutora como su especificación de consecuencias observables hacia el exterior.

#### Anatomía y Estructura Canónica de Outcome

De forma análoga a cómo `Disposition` define explícitamente las condiciones paramétricas e interactivas de una UCA, todo `Outcome` se estructura formalmente en tres componentes constitutivos obligatorios:

```text
Outcome
├── Properties
│   └── Definición de la información observable producida por la UCA (sin juicio de calidad).
├── Criteria
│   └── Reglas objetivas y no subjetivas sobre las Properties para evaluar determinísticamente el Outcome.
│       └── Criterion { Observation, Condition, Expected }
└── Owner
    └── UCA externa en cuyo contexto opera la unidad y que posee autoridad exclusiva de validación.
```

1. **Outcome.Properties**:
   Define qué información observable produjo efectivamente la UCA en su reacción. Representa el contenido observable puro sin valoración, calificación ni juicio de calidad (ej. `text: string`, `latency: number`, `confidence: number`, `chunks: Chunk[]`). Las Properties constituyen la base empírica sobre la que se realizan las observaciones y evaluaciones.

2. **Outcome.Criteria**:
   Define el conjunto de reglas no subjetivas, deterministas y formalmente evaluables para verificar el cumplimiento del Outcome. Los `Criteria` operan sobre **Properties observables** y no deben depender de secuencias de Actions internas ni de llamadas a Mechanisms computacionales internos. Cada `Criterion` individual se define mediante una terna:
   - **Observation**: La propiedad observable o valor computado que se somete a evaluación (ej. `latency`, `text.length`, `chunks.length`).
   - **Condition**: El operador o relación lógica objetiva aplicada ($=, \neq, <, \le, >, \ge, \in$).
   - **Expected**: El valor de referencia o rango admisible requerido para satisfacer la regla (ej. `300ms`, `> 0`, `[0.0..1.0]`).

3. **Outcome.Owner**:
   Identifica a la entidad externa ($\text{owner} \in \mathbb{U} \cup \mathbb{H}\text{uman}, \text{owner} \neq u_{\text{target}}$) en cuyo contexto operativo se consumen, integran o surten efecto las consecuencias observables del Outcome. El Owner es la única entidad formalmente facultada para emitir un juicio de aceptación y conveniencia contextual (`Validation`), validando las consecuencias observables del Outcome y no la secuencia interna de Actions utilizada para producirlas.

   > **Resolución de la Regresión del Owner y Cierre Teleológico en el Humano**:
   > Si todo Outcome exigiera que su Owner fuera obligatoriamente otra UCA, se produciría una regresión infinita ($UCA_1 \to UCA_2 \to UCA_3 \to \dots \infty$). En cualquier sistema cognitivo o computacional real, la jerarquía teleológica no es infinita ni recursiva: se cierra en la cúspide en el **Humano** (Terminal Owner / Root Owner). El interlocutor humano no es una UCA; es la fuente externa primaria de propósito y la autoridad última de validación contextual de los Outcomes emitidos por el organismo.

#### Evaluación y Decisión: Compliance vs. Validation

El modelo UCA distingue con rigor absoluto entre la comprobación objetiva de los criterios de un Outcome y la decisión de aceptarlo:

```text
Target UCA
    │
    ▼
 Outcome
    │
    ├── Criteria ──────► Compliance (PASS | FAIL)   [Evaluación determinista objetiva]
    │
    └── Owner ─────────► Validation (APPROVED | REJECTED) [Decisión contextual externa: UCA o Humano]
```

- **Compliance ($\text{comp} \in \{\text{PASS}, \text{FAIL}\}$)**:
  Es la evaluación determinista y computable de los `Criteria` de un Outcome.
  $$\text{complies}(o) = \begin{cases} \text{PASS} & \text{si } \forall c \in o.\text{Criteria}, \text{eval}(c, o.\text{Properties}) = \text{true} \\ \text{FAIL} & \text{en caso contrario} \end{cases}$$
  No admite subjetividad, interpretación ni heurísticas contextuales. Cualquier observador o mecanismo evaluador que compute las mismas Properties contra los mismos Criteria obtendrá idéntico resultado de Compliance.

- **Validation ($\text{val} \in \{\text{APPROVED}, \text{REJECTED}\}$)**:
  Es el juicio u ordenamiento de conveniencia contextual emitido exclusivamente por el `Owner`.
  $$\text{validates}(\text{owner}, o) \in \{\text{APPROVED}, \text{REJECTED}\}$$
  El Owner (sea una UCA consumidora en la jerarquía o el Humano en la cúspide) determina si las consecuencias observables del Outcome resultan admisibles, pertinentes y operativamente útiles dentro de su propio dominio y contexto funcional.

#### Disociación Estricta: Compliance ≠ Validation

`Compliance` y `Validation` son dimensiones formalmente ortogonales. Está terminantemente prohibido asumir equivalencia o inferencia unidireccional entre ambas:

- **$\text{complies}(o) = \text{PASS} \not\implies \text{validates}(\text{owner}, o) = \text{APPROVED}$**: Un Outcome puede cumplir todos sus criterios técnicos objetivos y, no obstante, ser rechazado por el Owner por inadecuación situacional.
- **$\text{complies}(o) = \text{FAIL} \not\implies \text{validates}(\text{owner}, o) = \text{REJECTED}$**: Un Outcome puede violar un criterio técnico formal y, aun así, ser aceptado por el Owner por tolerancia contextual, urgencia o resiliencia operativa.

De esta disociación emergen cuatro estados de evidencia empírica irreducible:

| Compliance | Validation | Significado Empírico y Operacional |
|---|---|---|
| `PASS` | `APPROVED` | **Alineación Plena**: El Outcome cumple los criterios objetivos y es contextualmente idóneo para las necesidades del Owner. |
| `PASS` | `REJECTED` | **Falso Positivo de Criterios / Desalineación Contextual**: El Outcome cumple la regla técnica, pero el Owner lo descarta por factores semánticos o del entorno operativo no capturados por los Criteria. |
| `FAIL` | `APPROVED` | **Tolerancia Operativa / Resiliencia Situacional**: El Outcome falla algún criterio formal (ej. ligera degradación de latencia), pero el Owner lo juzga suficiente o necesario en la situación viva. |
| `FAIL` | `REJECTED` | **Fallo Concurrente**: El Outcome viola las especificaciones objetivas y carece de utilidad para el contexto operativo del Owner. |

#### Invariante Estricta de Prohibición de Autovalidación

> **El Target UCA MUST NOT validar ni aprobar sus propios Outcomes.**
> $$\forall o \in \mathbb{O}, \quad \text{hasOwner}(o, \text{owner}) \implies \text{owner} \neq u_{\text{target}}$$

Una Target UCA puede computar determinísticamente el `Compliance` de sus propios criterios (ya que se trata de un cálculo objetivo sobre sus `Properties`), pero **carece ontológicamente de la perspectiva contextual y de la autoridad para validarse a sí misma**. Toda validación que no provenga de un Owner externo independiente es formalmente inválida en el modelo UCA.

#### Outcomes Parciales y Streaming

Una UCA no está obligada a producir un único Outcome final. Una activación puede emitir múltiples Outcomes parciales de forma continua (streaming):

```text
Stimulus
   │
   │ triggers
   ▼
 Target UCA
   │
   │ produces (stream temporal de Outcomes)
   ▼
Outcome₀ (Properties₀, Criteria₀, Owner) ──► (Compliance₀, Validation₀)
Outcome₁ (Properties₁, Criteria₁, Owner) ──► (Compliance₁, Validation₁)
Outcome₂ (Properties₂, Criteria₂, Owner) ──► (Compliance₂, Validation₂)
...
```

Formalmente, la secuencia de emisión temporal satisface:
$$\text{precedes}(o_0, o_1) \land \text{precedes}(o_1, o_2) \land \dots$$

**Neutralidad e Independencia Temporal**:
La relación $\text{precedes}(o_0, o_1)$ afirma estricta y únicamente que $o_0$ ocurrió cronológicamente antes que $o_1$. **MUST NOT** interpretarse como relación evaluativa, de superioridad o de mejora ($o_2 > o_1$ carece de validez). Cada Outcome parcial es evaluado determinísticamente en su propio `Compliance` y validado contextualmente por su `Owner`.

---

### 2.11 Reception: Mecánica Universal y No Cognitiva de UCA Core

> **Reception es el mecanismo por el cual una UCA recibe un cambio observable externo a su dominio que puede provocar su reacción.**

Características normativas de `Reception`:
- **Universal**: Toda UCA posee una frontera reactiva capaz de recibir cambios externos relevantes para su dominio.
- **Mecánica**: Es un proceso puramente determinista y operativo de captación/ingreso del cambio en la frontera de la unidad.
- **Reactiva**: Conecta la presencia del cambio exterior con la predisposición interna de la unidad.
- **No cognitiva**: No requiere interpretación semántica, razonamiento, memoria, consciencia ni modelos LLM.
- **Constitutiva de UCA Core**: Pertenece al contrato mínimo e irrenunciable de toda UCA.

#### Conexión entre Reception, Disposition y Stimulus

La recepción de un cambio observable no implica que cualquier UCA deba reaccionar ante él. La `Disposition` declarativa de la unidad determina cómo está predispuesta a interactuar y reaccionar:

```text
external Δx
    │
    ▼
Reception
    │
    ▼
Disposition
    │
    ├── relevante / configurado ──► Reaction (materializa Stimulus)
    │
    └── no configurado / ignorado ──► no Reaction (no deviene Stimulus)
```

Cuando la recepción mecánica de un cambio observable provoca una reacción conforme a la configuración funcional y reactiva de la UCA:
$$\text{Reception}(u, \Delta x) + \text{Reaction}(u, \Delta x) \implies \text{Stimulus}(u, \Delta x)$$

#### Una UCA no necesita ser cognitiva para reaccionar

Una UCA puede recibir un Stimulus y reaccionar de forma puramente funcional sin ejecutar ningún proceso cognitivo o perceptivo:

```text
observable change
       │
       ▼
     Ear UCA
       │
   Reception
       │
       ▼
    Stimulus
       │
       ▼
     react()
```

Esto es plenamente suficiente para satisfacer el contrato reactivo UCA. Queda prohibido exigir métodos o fases como `perceive()`, `interpret()` o `reason()` en la especificación o clase base de una UCA universal.

---

### 2.12 Reactividad Local

> **Ninguna activación sin un Stimulus.**
> **Una UCA reacciona únicamente ante la recepción de un Stimulus externo a su propia frontera funcional.**

Una UCA nunca se ejecuta espontáneamente ni por voluntad autónoma. Actúa estrictamente en respuesta a un Stimulus que cruza su frontera funcional.

El origen último de ese Stimulus —humano, sensorial, temporizado, homeostático o procedente de otra UCA— es una cuestión de la Arquitectura Cognitiva (§4), no del UCA Core. Toda UCA permanece localmente reactiva.

---

### 2.13 Frontera de la UCA

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

### 2.14 Resumen

El modelo mínimo completo de una UCA individual:

```text
Estructura:   u = (p, d, C, O)   (donde p determina qué es, d predispone, C acota y O define consecuencias)
Estímulo:     s ∈ 𝕊              (recepción de un cambio observable externo que provoca reacción de u)
Reacción:     (u, s) → o         (shorthand de: triggers(s, u) ∧ produces(u, o); internamente s → Reaction(u) → o)
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
- UCA A requiere el resultado reactivo (Outcome) de UCA B para completar su reacción interna.
- UCA A no coordina, orquesta ni controla a UCA B.
- UCA A no instruye a UCA B ni le impone su propósito: UCA A expone o emite una señal que cruza la frontera de UCA B como Stimulus externo, y UCA B reacciona según su propio Purpose B, Capabilities B y Disposition B.
- No existe transferencia de Purpose ($p_A \not\to B$) ni creación de directrices u órdenes inter-unidad.

---

### 3.2 Capacidades Terminales

> Una Capability se convierte en otra UCA solo cuando existe un Purpose propio y funcionalmente diferenciado.
> Cuando dejan de emerger propósitos diferenciados y solo restan mecanismos, se han alcanzado capacidades terminales.

Si un componente ejecuta una función mecánica o algorítmica sin un Purpose estable e independiente, permanece como capacidad terminal y no debe modelarse como UCA.

---

### 3.3 Relaciones Outcome → Stimulus como Relación Reactiva

Es fundamental distinguir que `Outcome` y `Stimulus` no son dos tipos de datos disjuntos ni entidades técnicas que requieran una conversión ontológica o función runtime en el camino crítico (como un hipotético `convertToStimulus()`):

> **El cambio observable producido por una UCA constituye un Outcome respecto de la UCA productora. La recepción de ese cambio por otra UCA, cuando provoca su reacción conforme a su Disposition, constituye un Stimulus respecto de la UCA receptora.**

Son posiciones diferentes dentro de una misma relación reactiva:

```text
               observable Δx

UCA A ─────────────────────────────► UCA B
  │                                    │
  │                                    │
Outcome(A, Δx)                  Stimulus(B, Δx)
                                       │
                                       ▼
                                   Reaction(B)
```

Formalmente:
$$\text{Outcome}(u_A, \Delta x) \land \text{receives}(u_B, \Delta x) \land \text{triggers}(\Delta x, u_B) \implies \text{Stimulus}(u_B, \Delta x)$$

#### No todo Outcome constituye un Stimulus

Una UCA puede producir un cambio observable sin que ninguna otra UCA reaccione ante él. Por consiguiente:
$$\text{Outcome}(u_A, \Delta x) \not\implies \exists u_B : \text{Stimulus}(u_B, \Delta x)$$

Si ninguna otra UCA está predispuesta en su Disposition a reaccionar ante dicho cambio, el cambio observable existe y permanece como Outcome de $u_A$, pero no deviene Stimulus para ninguna unidad del sistema.

Sólo cuando existe una unidad receptora:
```text
Outcome(A, Δx)
       │
       ▼
Reception(B, Δx)
       │
       ▼ (Disposition activa reacción)
Reaction(B)
```
el cambio constituye un `Stimulus` respecto de `B`.

#### Ejemplo Normativo: `Ear UCA` y Dominio Encapsulado

El siguiente ejemplo ilustra la estricta frontera entre el proceso interno de una UCA y la consecuencia observable consumida por otra:

```text
Ear UCA
├── Functional Contract:
│   ├── Purpose: Transcribir voz humana en texto
│   └── Capabilities: SpeechRecognition
├── Constitution:
│   └── Disposition: model = "base", bufferSize = 1024, hotwordsScore = 2.5
├── Encapsulated Internal Domain (Reaction):
│   ├── Action₁: capturar trama de audio
│   ├── Action₂: conversión PCM y normalización
│   ├── Action₃: cancelación de eco acústico (AEC)
│   ├── Action₄: detección de actividad vocal (VAD)
│   ├── Action₅: ejecución de motor de inferencia Sherpa (Mechanism)
│   ├── Action₆: agregación de probabilidades de tokens
│   └── Action₇: actualización de buffer de transcripción
└── Observable Consequence (Outcome):
    ├── Properties: text = "" → "Hola", latency = 115ms, confidence = 0.94
    ├── Criteria: text.length > 0, latency < 300ms, confidence >= 0.70
    └── Owner: Thalamus UCA
```

Desde el exterior de la unidad:

```text
Ear UCA
 │
 │ [Reaction interna encapsulada: capturar frame, PCM, AEC, Sherpa, tokens...]
 │
 ▼
observable change (Δtext)
 │
 ├── Outcome(Ear): text = "Hola"
 │
 ▼
Signal / Impulse (mecanismo runtime de propagación)
 │
 ▼
Thalamus UCA
 │
 ├── Reception (mecánica en la frontera)
 │
 ├── Stimulus(Thalamus) (provoca reacción según su Disposition)
 │
 └── Reaction(Thalamus)
```

La UCA consumidora (`Thalamus`) **no necesita conocer** la conversión PCM, el AEC, la ejecución de Sherpa ni la agregación de tokens para reaccionar a `"Hola"`. Reacciona exclusivamente ante el cambio observable en su frontera (`Stimulus`).

Asimismo, si `Ear UCA` modifica internamente su implementación (por ejemplo, sustituyendo el Mechanism Sherpa por otro motor o reorganizando su secuencia de Actions internas), `Thalamus` continúa operando sin alteración mientras se mantenga el contrato y las Properties del Outcome.

---

### 3.4 Sucesión Reactiva y Cadenas de Activación

Mediante relaciones de propagación entre Outcomes y Stimuli, las UCAs configuran cadenas de activación reactiva sucesiva:

```text
uᵢ ──(produces)──► oᵢ ──(forma sⱼ)──► triggers(sⱼ, uⱼ) ──(produces)──► oⱼ ──► ...
```

Notación abreviada (shorthand informativo):
```text
(uᵢ, sᵢ) → oᵢ → sⱼ → (uⱼ, sⱼ) → oⱼ → ...
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
  Reaction A requiere Outcome de UCA B
    │
    └── Stimulus B
            ↓
          UCA B
            ↓
          Reaction B requiere Outcome de UCA C
            │
            └── Stimulus C
                    ↓
                  UCA C ──► Reaction C ──► Outcome C
                    ↓
          Outcome C disponible para Reaction B
            ↓
          Outcome B
    ↓
  Outcome B disponible para Reaction A
    ↓
  Outcome A
```

Esto significa:
- A *requiere* el Outcome de B para completar su Reaction.
- B *requiere* el Outcome de C para completar su Reaction.
- A no coordina a B. A no conoce ni controla a C.
- A no conoce ni necesita conocer las Actions o Mechanisms internos de B o C.
- Cada unidad permanece acotada por su propio Purpose y encapsulada en su Reaction.

---

## 4. Arquitectura Cognitiva

La Arquitectura Cognitiva define cómo múltiples UCAs se organizan, conectan y gobiernan dentro de un sistema global.

La Arquitectura Cognitiva es distinta de la primitiva UCA. Organiza y conecta primitivas UCA; no modifica qué es una UCA. La definición normativa de una UCA pertenece exclusivamente al UCA Core.

---

### 4.1 Evaluación bajo Criterios Explícitos

En arquitecturas cognitivas, la evaluación de un Outcome representa el análisis sistemático de sus consecuencias frente a criterios explícitos (ej. precisión, latencia, coherencia, estabilidad o tasa de error).

> El Outcome pertenece a quien ejecuta.
> La evaluación pertenece a quien demanda la ejecución.

La UCA ejecutora produce el Outcome como consecuencia observable de su Action. No está obligada a autoevaluarse para dictaminar la calidad o utilidad de su resultado; es la entidad demandante de la ejecución (el `Owner` externo) quien posee la necesidad operativa, el contexto situacional y la autoridad exclusiva para validar si las consecuencias producidas satisfacen su demanda.

Una Arquitectura Cognitiva puede definir o delegar en UCAs especializadas para registrar y correlacionar evidencia, pero la validación contextual pertenece siempre a quien demandó la ejecución:

```text
Entidad Demandante / Owner (UCA₁)
        │ (demanda ejecución)
        ▼
Target Ejecutor (UCA₂)
        │
        └── Outcome (Properties, Criteria, Owner: UCA₁)
                │
                ├── Criteria ──► Compliance (PASS | FAIL) [Determinista]
                │
                └── Owner ─────► Validation (APPROVED | REJECTED) [Contextual]
```

La evaluación se construye puramente mediante composición y desacoplamiento de roles. No se requiere ningún mecanismo intrínseco de autoevaluación dentro del UCA Core.

---

### 4.2 Percepción e Interpretación como Composición Especializada

La percepción y la interpretación **no** son fases universales del ciclo reactivo de una UCA en el Core. Son responsabilidades cognitivas especializadas que se modelan exclusivamente mediante composición.

La distinción fundamental del modelo es:

```text
Reception (UCA Core)
=
mecánica, universal, reactiva y no cognitiva

Perception (Arquitectura Cognitiva / Composición)
=
función especializada y opcional realizada por UCAs
cuyo Purpose requiere interpretar o dotar de significado a lo recibido
```

Por tanto:
$$\text{Reception} \ne \text{Perception}$$
$$\text{Stimulus does NOT require Perception}$$

> **Perception es la interpretación funcional de información recibida realizada por una UCA cuyo Purpose requiere dicha interpretación.**

Características normativas de `Perception`:
- **Opcional**: La inmensa mayoría de las UCAs en un sistema reactivo solo ejecutan transformaciones mecánicas sin requerir percepción.
- **Especializada**: Responde a un Purpose declarativo específico orientado a decodificar, interpretar o estructurar información no estructurada.
- **Compositiva**: Emerge de la interacción de capacidades dedicadas dentro de la UCA especializada.
- **Dependiente del Purpose**: Solo existe si el Purpose de la unidad así lo exige.

#### Ejemplo de Percepción Mediante una UCA Especializada

Cuando la interpretación perceptual es necesaria en una arquitectura cognitiva, ésta emerge mediante la composición de unidades especializadas:

```text
Microphone (dispositivo / entorno exterior)
    │
    ▼
audio change (cambio observable acústico)
    │
    │ Reception (mecánica en la frontera)
    ▼
Ear UCA
    │
    │ Stimulus (detona proceso reactivo)
    ▼
Speech Recognition (capacidad de interpretación)
    │
    │ perceptual interpretation
    ▼
"Hola" (texto estructurado)
    │
    │ Outcome(Ear)
    ▼
Thalamus UCA
    │
    │ Reception ──► Stimulus(Thalamus)
    ▼
react()
```

En este escenario, `Ear UCA` actúa como unidad perceptiva porque su `Purpose` y sus `Capabilities` (reconocimiento acústico) proporcionan interpretación y significado al cambio recibido. Sin embargo, esta capacidad interpretativa es una propiedad exclusiva de la especialización de `Ear`, **NUNCA** del contrato universal de `Uca` como primitiva funcional.

Una UCA cualquiera no requiere métodos como `perceive()`, `interpret()` ni razonamiento simbólico para satisfacer plenamente el contrato UCA Core.

---

### 4.3 Evolution y Mutación Atómica de Disposition Basada en Evidencia Histórica

El Core define que la Disposition condiciona el comportamiento y las interacciones de una unidad.

> **Evolution es el proceso por el cual UCAs especializadas utilizan evidencia histórica de la actividad de otras UCAs para determinar cambios permitidos sobre su Disposition, preservando su Purpose, sus Capabilities y la Nature de su Disposition.**

Distinción ontológica fundamental:
```text
Conception: Determina qué UCA existe (identidad funcional, capacidades, disposición inicial y definición de Outcome).
Evolution:  Proceso mediado que modifica cómo esa misma UCA se comporta e interactúa mediante cambios permitidos
            en su Disposition, guiado por el análisis de evidencia histórica multiejecución acumulada.
```

```text
Conception
     │
     ▼
Target UCA₀ (p, d₀, C, O)
     │
     │ Ejecuciones multievento registradas
     ▼
History (H₀ ∈ ℍ) ──► [Tracking ──► Analysis ──► Evolution]
                                                      │
                                                      ▼
                                       Mutation Proposal μ₁ (atómica)
                                                      │
                                                      ▼
Target UCA₁ (p, d₁, C, O)  donde ΔD = difference(D₀, D₁)
     │
     │ Nuevas ejecuciones multievento registradas
     ▼
History (H₁ ∈ ℍ) ──► [Tracking ──► Analysis ──► Evolution]
                                                      │
                                                      ▼
                                       Mutation Proposal μ₂ (atómica)
                                                      │
                                                      ▼
Target UCA₂ (p, d₂, C, O)  donde ΔD = difference(D₁, D₂)
     │
    ...
```

#### Roles Funcionales de la Arquitectura Evolutiva

La evolución de una UCA no se ejecuta como una autoadaptación interna no supervisada, sino a través de tres responsabilidades o roles funcionales especializados y desacoplados:

1. **Tracking (Registro de Historia Observable)**:
   Registra de forma inmutable la evidencia generada durante las ejecuciones de la Target UCA. Cada entrada del histórico modela formalmente la tupla multivariable:
   $$h = [s, o, \text{Compliance}, \text{Validation}, d, \text{timestamp}, \mu, x] \in \mathbb{H}$$
   Donde:
   - $s \in \mathbb{S}$: Estímulo recibido que detonó la reacción.
   - $o \in \mathbb{O}$: Outcome producido ($o.\text{Properties}$).
   - $\text{Compliance} \in \{\text{PASS}, \text{FAIL}\}$: Evaluación determinista de los Criteria de $o$.
   - $\text{Validation} \in \{\text{APPROVED}, \text{REJECTED}\}$: Juicio de aceptación emitido exclusivamente por el Owner.
   - $d \in \mathbb{D}$: Disposición efectiva activa de la UCA en el momento de la ejecución.
   - $\text{timestamp}$: Punto temporal inmutable de la ejecución.
   - $\mu \in \mathbb{M}\text{ut}$: Identificador o versión de la mutación activa.
   - $x \in \mathbb{X}$: Contexto situacional o ambiental de soporte.

2. **Analysis (Identificación de Patrones, Correlaciones y Evaluación Inferencial del Purpose)**:
   Examina el corpus histórico multiejecución ($H \in \mathbb{H}$) sin intervenir en el flujo reactivo directo. Su responsabilidad comprende:
   - Leer el `Purpose` ontológico inmutable definido por el creador en la Target UCA y evaluar inferencialmente si las consecuencias observables ($o$) y las validaciones del Owner se alinean efectivamente con dicho propósito o si existe deriva funcional.
   - Identificar correlaciones empíricas sistemáticas entre parámetros específicos de la Disposition ($d$), el contexto situacional ($x$) y los resultados cruzados de Compliance y Validation (por ejemplo: *"el valor de bufferSize = 2048 correlaciona con un 41% de rechazos por latencia bajo alta concurrencia, frente a un 4% de fallos cuando bufferSize = 1024"*).

3. **Evolution (Determinación y Propuesta de Mutaciones Atómicas)**:
   A partir del análisis de evidencia histórica acumulada, deduce hipótesis de ajuste y formula una mutación atómica admisible ($\mu \in \mathbb{M}\text{ut}$) sobre la Disposition de la Target UCA, verificando formalmente que satisfaga las restricciones de Nature antes de su emisión.

#### Relación Experimental $\text{Disposition} \to \text{Outcome}$ y Evidencia Encapsulada

La evaluación externa y el análisis evolutivo tratan a la UCA como una unidad funcional encapsulada.
Dado el estímulo $s$ y la disposición $d$ de la UCA $u$, se observa empíricamente el outcome $o$:

$$(u, d, s) \to o$$

sin requerir registrar ni conocer la traza interna de las acciones individuales ($a_1, a_2, \dots, a_n$).

El registro histórico de evidencia se fundamenta primariamente en la correspondencia entre configuraciones efectivas y resultados observables:

$$(D_0, O_1, \text{Comp}_1, \text{Val}_1), \quad (D_0, O_2, \text{Comp}_2, \text{Val}_2), \quad \dots, \quad (D_1, O_n, \text{Comp}_n, \text{Val}_n)$$

#### Evolution Modifica Disposition, No Actions Directamente

La evolución actúa exclusivamente sobre la constitución y predisposición de la unidad:

$$\text{Disposition}_0 \longrightarrow \text{Outcomes} \longrightarrow \text{Compliance / Validation} \longrightarrow \text{History} \longrightarrow \text{Analysis} \longrightarrow \Delta\text{Disposition} \longrightarrow \text{Disposition}_1$$

El rol de `Evolution` formula y aplica mutaciones atómicas sobre la `Disposition` ($\Delta D = \text{difference}(D_0, D_1)$). **MUST NOT** reescribir ni intervenir directamente sobre las `Actions` internas. Las futuras acciones y transiciones cambiarán de forma emergente e intrínseca como consecuencia de la nueva Disposition, los Mechanisms y las interacciones internas.

> **Composabilidad de Roles**:
> `Tracking`, `Analysis` y `Evolution` son responsabilidades funcionales composables, no nombres rígidos obligatorios de clases del UCA Core. Una arquitectura cognitiva puede materializarlos mediante UCAs independientes (ej. `Tracker UCA`, `Analyzer UCA`, `Evolution UCA`) o integrarlos en órganos cognitivos agregados (como un `Cingulate UCA`).

#### Invariante Estricta: Prohibición de Autoevolución Directa ante Outcomes Aislados

> **Una Target UCA MUST NOT auto-evolucionar directamente en respuesta a un Outcome aislado.**

El modelo UCA prohíbe taxativamente que una unidad altere su propia `Disposition` como reacción inmediata a un único Outcome producido o evaluado. La adaptación reactiva inmediata confunde el proceso operacional con la evolución ontológica, introduciendo inestabilidad paramétrica, sesgos de casos aislados y bucles descontrolados de retroalimentación. La evolución requiere masa crítica de evidencia histórica acumulada y mediación especializada.

#### Principio de Mutación Atómica

> **La unidad mínima de Evolution es una Mutation atómica de la Disposition.**

Una Mutation ($\mu \in \mathbb{M}\text{ut}$) produce una alteración $\Delta D = \text{difference}(D_0, D_1)$ que debe ser:
- **pequeña e identificable**: focalizada en una Property o reactTo concreto;
- **limitada**: circunscrita a los límites de Nature ($\text{satisfies}(\text{value}_{new}, \text{nature})$);
- **validable**: verificable formalmente antes de su aplicación;
- **medible**: observable empíricamente en subsecuentes Outcomes históricos;
- **reversible**: capaz de restaurarse si la evidencia histórica posterior es desfavorable;
- **atribuible**: rastreable respecto al análisis de evidencia que la motivó.

#### Tipos de Mutación: Paramétrica y Estructural

1. **Mutación Paramétrica**: Ajuste del estado o valor de una Property (`Property.Value`), manteniendo Purpose, Nature y reactTo constantes:
   ```text
   SherpaRecognition.hotwordsScore: 2.5 ──► 3.0   (donde satisfies(3.0, Nature))
   ```
2. **Mutación Estructural**: Modificación de las relaciones reactivas (`Disposition.reactTo`) para alterar las conexiones emergentes entre Capabilities sin modificar su código fuente:
   ```text
   t₀: Capability B.reactTo = ['CapabilityA.outcome']
   t₁: Capability B.reactTo = ['CapabilityC.outcome']
   ```

#### Secuencialidad Temporal y Reversibilidad de la Disposición

Toda UCA mantiene una secuencia cronológica inmutable de sus configuraciones efectivas:

$$[D_0, D_1, \dots, D_n]$$

- **Estado de Concepción ($D_0$)**: Representa la disposición constitutiva inicial declarada físicamente en la clase al nacer la unidad. Constituye el límite inferior absoluto de reversibilidad (la UCA no puede revertirse a un estado anterior a su propia concepción).
- **Reversibilidad Reactiva**: Ante evidencia histórica desfavorable o necesidad operativa de restauración, la UCA puede revertir su estado a cualquier configuración previa $D_k$ mediante `revert()` o `revertTo(version)`.
- **Sincronización Biológica**: La restauración de valores al revertir es intrínsecamente reactiva: cada propiedad modificada durante el rollback emite su correspondiente `MutationEvent`, permitiendo que todo el organismo y las capacidades suscritas en el `Channel` se sincronicen de forma automática e inmediata con el estado recuperado.

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

### 4.4 Observación Evolutiva, Evidencia Histórica y Semántica de $\Delta$

El flujo completo de observación evolutiva opera a través del desacoplamiento entre ejecución reactiva y análisis histórico multiejecución:

```text
Target UCA ──► Outcome ──► Criteria ──► Compliance (PASS | FAIL)
                  │
                  └──► Owner ────────► Validation (APPROVED | REJECTED)
                                            │
                                            ▼
                                       Tracker UCA
                                            │
                                            ▼
                                    History (H ∈ ℍ)
                                            │
                                            ▼
                                       Analyzer UCA
                                            │
                                            ▼
                                    Analysis / Patterns
                                            │
                                            ▼
                                      Evolution UCA
                                            │
                                            ▼
                  Validación de Nature ──► Mutation Proposal (μ)
                                            │
                                            ▼
                     Target UCA ◄──── ΔDisposition = diff(D₀, D₁)
```

#### Semántica Estricta de $\Delta\text{Disposition}$

> **$\Delta\text{Disposition} = \text{difference}(D_0, D_1)$ representa exclusivamente la diferencia de estado o configuración entre dos observaciones temporales. NUNCA denota mejora intrínseca, optimización absoluta ni progreso metafísico.**

El estado $D_1$ resultante de aplicar una mutación $\mu$ constituye únicamente una **hipótesis empírica**. Afirmar que $D_1$ es "mejor" que $D_0$ carece de sentido ontológico en el Core de UCA. La validez práctica de $D_1$ dependerá exclusivamente de cómo se comporten las subsecuentes ejecuciones en la nueva ventana de observación histórica, sometidas al veredicto determinista de `Compliance` y al juicio contextual de `Validation` por parte del `Owner`.

#### Principios de Observación Evolutiva

1. **Interpretación Declarativa sin Acoplamiento Hardcodeado**: El observador evolutivo inspecciona `Property.Function`, `Property.Nature`, `Property.Value` y `reactTo` de cada Capability, razonando sobre la adaptación sin requerir código específico de cada Capability ni confundir las funciones paramétricas con el Purpose propio de la UCA.
2. **Validación Estricta contra Nature**: Ninguna mutación puede aplicarse si viola la `Nature` declarada de la propiedad ($\neg\text{satisfies}(\text{value}, \text{nature})$). La seguridad evolutiva proviene de la propia constitución declarativa.
3. **Fuera del Camino Crítico de Ejecución**: Los roles evolutivos actúan de forma asíncrona, desacoplada y sobre evidencia acumulada. No constituyen un árbitro síncrono ni un cuello de botella para las reacciones de la Target UCA.
4. **Optimización Local Acotada**: El contexto de optimización permanece pequeño y localizado:
   ```text
   Target UCA Purpose + Capabilities + Disposition (Definition + reactTo) + History (H) ──► Contexto de Análisis
   ```
5. **Falsabilidad Experimental y Evaluación Explícita**: Toda mutación atómica genera una hipótesis comprobable empíricamente frente a una nueva serie de Outcomes históricos evaluados:
   - **Evidencia favorable**: La tasa de `Compliance: PASS` y `Validation: APPROVED` en el histórico posterior respalda la hipótesis bajo los criterios del Owner.
   - **Evidencia neutra**: El histórico posterior no muestra variaciones estadísticamente significativas.
   - **Evidencia desfavorable**: El histórico posterior muestra degradación o rechazo reiterado (desencadenando reversión a $D_0$ mediante `revert()`).

> **Distinción entre Igualdad y Equivalencia Evaluativa**:
> Dos Outcomes $o_1$ y $o_0$ estructuralmente idénticos pueden haber sido emitidos bajo contextos distintos, y dos Outcomes distintos pueden resultar evaluativamente equivalentes bajo un criterio específico sin ser iguales. La especificación rechaza el uso de $o_1 > o_0$ o $o_1 = o_0$ como predicados evaluativos genéricos sin criterios explícitos.

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
oᵢ ──Reception──► Stimulus ──triggers──► uⱼ ──Reaction──► produces(uⱼ, oⱼ) ──drives──► Δdᵢ
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

> **¿Puede emerger comportamiento cognitivo de la interacción de UCAs acotadas por propósito, mientras cada unidad individual permanece estructuralmente limitada a $u = (p, d, C, O)$ y conductualmente limitada a $(u, s) \to a \to o$?**

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
│       └── reactTo: ["AudioInput.stream"]
│
├── AudioFraming
│   ├── Mechanism: Materialización temporal de la señal en fragmentos discretos
│   └── Disposition:
│       ├── Properties:
│       │   ├── sampleRate: { Function: "Frecuencia de muestreo", Nature: [16000], Value: 16000 }
│       │   ├── frameSize: { Function: "Tamaño discreto de fragmento", Nature: [160..16000], Value: 1600 }
│       │   └── emitPartialOnFlush: { Function: "Emitir fragmento parcial al vaciar buffer", Nature: [boolean], Value: false }
│       └── reactTo: ["EchoCancellation.output"]
│
├── PcmToFloat
│   ├── Mechanism: Normalización y conversión de enteros Int16 a coma flotante Float32
│   └── Disposition:
│       ├── Properties:
│       │   ├── inputType: { Function: "Tipo de entrada numérica", Nature: ["Int16"], Value: "Int16" }
│       │   ├── outputType: { Function: "Tipo de salida numérica", Nature: ["Float32"], Value: "Float32" }
│       │   └── scale: { Function: "Factor divisor de normalización", Nature: [32768.0], Value: 32768.0 }
│       └── reactTo: ["AudioFraming.output"]
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
│       └── reactTo: ["PcmToFloat.output"]
│
├── EchoTextFilter
│   ├── Mechanism: Filtrado y atenuación léxica de transcripciones autogeneradas
│   └── Disposition:
│       ├── Properties:
│       │   ├── caseSensitive: { Function: "Distinción entre mayúsculas y minúsculas", Nature: [boolean], Value: false }
│       │   ├── decayMs: { Function: "Ventana temporal de atenuación léxica", Nature: [500..10000ms], Value: 2500 }
│       │   ├── mismatchThreshold: { Function: "Tolerancia de discrepancia léxica", Nature: [0..5], Value: 1 }
│       │   └── minWordLength: { Function: "Longitud mínima de palabra a evaluar", Nature: [1..10], Value: 3 }
│       └── reactTo: ["SherpaRecognition.output"]
│
└── EarCoherence
    ├── Mechanism: Normalización estructural y preservación de continuidad temporal de Chunks
    └── Disposition:
        ├── Properties:
        │   └── outputSchema: { Function: "Esquema canónico de salida", Nature: ["Chunk"], Value: "Chunk" }
        └── reactTo: ["EchoTextFilter.output"]

Outcome Canónico Estructurado
│
├── Properties:
│   ├── text: string       (transcripción textual producida)
│   ├── start: number      (milisegundo de inicio temporal)
│   ├── end: number        (milisegundo de fin temporal)
│   └── latency: number    (tiempo transcurrido de procesamiento en ms)
│
├── Criteria:
│   ├── textNotEmpty:  { Observation: "text.length", Condition: ">", Expected: 0 }
│   ├── validDuration: { Observation: "end - start",  Condition: ">=", Expected: 0 }
│   └── maxLatency:    { Observation: "latency",      Condition: "<=", Expected: 300 }
│
└── Owner: Thalamus UCA    (UCA externa con autoridad de validación)
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
Ear Outcome: Chunk { text, start, end, latency }
    │
    ├── Criteria ────────► Compliance (PASS | FAIL determinista)
    └── Owner (Thalamus) ► Validation (APPROVED | REJECTED contextual)
```

#### Escenario Canónico de Evolución Histórica Mediada: Ear UCA

Para ilustrar de forma exhaustiva la arquitectura evolutiva y el desacoplamiento entre `Compliance`, `Validation` y `Evolution`, considérese el ciclo completo de adaptación sobre la propiedad paramétrica `AudioFraming.bufferSize` de `Ear UCA`:

```text
Target UCA: Ear (Disposition: bufferSize = 2048, Nature: [512..4096])
    │
    │ Estímulo de audio bajo concurrencia
    ▼
 Outcome producido: { text: "arquitectura cognitiva", start: 1200, end: 1850, latency: 410 }
    │
    ├── Criteria ────────► Compliance: FAIL (debido a latency = 410ms > 300ms)
    │
    └── Owner (Thalamus) ► Validation: REJECTED (el Owner descarta el chunk por latencia inaceptable)
                            │
                            ▼
                       Tracker UCA
                            │
                            ▼
                         History (registro acumulado de 1000 outcomes multievento)
                            │
                            ▼
                       Analyzer UCA (correlaciona: bufferSize = 2048 genera 41% de fallos de latencia,
                            │        mientras que bufferSize = 1024 genera solo un 4% de fallos)
                            ▼
                       Evolution UCA (formula propuesta de mutación: bufferSize 2048 ──► 1024;
                            │        valida formalmente que satisfies(1024, Nature) = true)
                            ▼
                    Target UCA (Ear) aplica mutación atómica:
                    ΔD = difference(D₀, D₁) con bufferSize = 1024
                            │
                            ▼
             Apertura de nuevo periodo de observación histórica
             (sin asumir a priori D₁ > D₀, a la espera de nueva evidencia)
```

1. **Constitución Inicial ($D_0$)**:
   `Ear UCA` está predispuesta con `AudioFraming.bufferSize = 2048`. Su `Outcome` declara formalmente el criterio `latency <= 300ms` y a `Thalamus UCA` como su `Owner`.
2. **Ejecución Reactiva**:
   Llega un estímulo acústico complejo. `Ear UCA` ejecuta su proceso reactivo y emite el Outcome:
   `o = { text: "arquitectura cognitiva", start: 1200, end: 1850, latency: 410 }`.
3. **Comprobación Determinista de Compliance**:
   La evaluación de los Criteria de $o$ arroja de forma automática y matemática:
   `Compliance = FAIL` (la latencia de 410ms excede el límite máximo de 300ms).
4. **Juicio Contextual de Validation por el Owner**:
   `Thalamus UCA` evalúa el Outcome dentro del flujo activo. Dado que un retraso de 410ms interrumpe la cadencia conversacional fluida, el Owner emite formalmente:
   `Validation = REJECTED`.
5. **Registro en Tracker UCA**:
   El rol `Tracker UCA` captura la tupla de evidencia inmutable y la añade a la colección histórica:
   $$h_1 = [s, o, \text{Compliance: FAIL}, \text{Validation: REJECTED}, d_0, t_1, \mu_0, x_1] \in \mathbb{H}$$
6. **Acumulación de Evidencia en History**:
   A lo largo del tiempo se registran 1000 Outcomes de `Ear UCA` producidos bajo diversas cargas de CPU y entornos acústicos.
7. **Análisis Correlacional en Analyzer UCA**:
   El rol `Analyzer UCA` procesa el corpus histórico multiejecución e identifica un patrón sistemático:
   - Con `bufferSize = 2048`, la tasa de fallo de latencia es del **41%**.
   - En ejecuciones previas o comparables con `bufferSize = 1024`, la tasa de fallo de latencia fue únicamente del **4%**.
8. **Propuesta de Mutación en Evolution UCA**:
   El rol `Evolution UCA` deduce que reducir el tamaño de buffer mitiga el tiempo de espera por trama y propone la mutación atómica:
   $$\mu_1: \text{AudioFraming.bufferSize}: 2048 \longrightarrow 1024$$
   Comprueba que $1024 \in [512..4096]$ (`satisfies(1024, Nature)`).
9. **Transición a $D_1$ y Falsabilidad**:
   `Ear UCA` recibe la mutación y actualiza su Disposition efectiva a $D_1$. Esta transición representa estrictamente $\Delta D = \text{difference}(D_0, D_1)$. El sistema **no asume** que $D_1 > D_0$; se abre un nuevo periodo de observación en el que `Tracker UCA` comenzará a acumular nuevos registros para corroborar empíricamente si la hipótesis de mejora se sostiene en el tiempo.

#### Armonización y Reactividad en Ear: Representación y Reconfiguración de Procesos

El propósito fundamental de este ejemplo es ilustrar **cómo cualquier proceso tradicional o secuencial (como un pipeline de procesamiento de audio y transcripción) puede representarse formalmente mediante UCA** sin necesidad de orquestadores centrales ni tuberías rígidas cableadas en código.

En lugar de un flujo secuencial imperativo hardcodeado, el proceso emerge de las relaciones reactivas declaradas en las Dispositions de las Capabilities (`reactTo` y `Properties`):
- `AudioFraming.frameSize: 1600` (tamaño de fragmento de audio).
- `EchoCancellation.decayMs: 350` y `bargeInHoldMs: 400` (gestión de umbral de eco y corte).
- `SherpaRecognition.rule2MinTrailingSilence: 0.4` (segundos de silencio para cierre de segmento).
- `EchoTextFilter.decayMs: 2500` (ventana temporal de atenuación de eco textual).

**Reconfigurabilidad del Orden del Proceso**:
Dado que el flujo no está fijado en la arquitectura del código sino en las declaraciones `reactTo` de la Disposition de cada Capability, **el orden del proceso puede redefinirse o reestructurarse dinámicamente si resultara pertinente** (por ejemplo, mediante una mutación estructural en Evolution, §4.3). Si la evidencia empírica mostrara que aplicar cancelación de eco después del framing o introducir una etapa previa de filtrado acústico optimiza la transcripción, la Disposition de las Capabilities puede reconfigurar sus suscripciones `reactTo` para alterar la secuencia reactiva emergente sin modificar el código de las capacidades ni la identidad de la UCA:
```text
t₀ (orden inicial):      AudioInput ──► EchoCancellation ──► AudioFraming ──► PcmToFloat ──► ...
t₁ (orden redefinido):   AudioInput ──► AudioFraming ──► EchoCancellation ──► PcmToFloat ──► ...
```

Ninguna de estas capacidades primitivas se convierte en una UCA independiente mientras no posea un Purpose propio y diferenciado. Permanecen como capacidades primitivas de Ear.

Ejemplo de Outcomes parciales emitidos (secuencia de emisión con relación temporal $\text{precedes}(o_0, o_1)$ y $\text{precedes}(o_1, o_2)$):
```text
o₀ = { start: 0,   end: 400,  text: "Creo que", latency: 120 }
o₁ = { start: 400, end: 850,  text: "deberíamos cambiar", latency: 190 }
o₂ = { start: 850, end: 1200, text: "esta arquitectura", latency: 210 }
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
 └── Reaction(u_A) ──produces──► o_A ──Reception──► s_B
                                                     │
                                                     ▼
                                         u_B (Purpose: percibir)
                                                     │
                                                     └── Reaction(u_B): percibir
                                                             │
                                                             └── produces(u_B, o_B): representación percibida
```

`u_B` es estructuralmente idéntica a cualquier otra UCA: $u_B = (p_B, d_B, C_B) \in \mathbb{U}$. Su Purpose requiere percepción.

---

### 7.3 Observación Mediante Composición

La observación puede ser igualmente la función realizada por la Reaction de una UCA:

```text
s_C ──triggers──► u_C (Purpose: observar e interpretar)
                   │
                   └── Reaction(u_C): observar
                           │
                           └── produces(u_C, o_C): observación estructurada
                                                   │
                                                   ▼ (Reception)
                                          s_D ──triggers──► u_D
```

---

### 7.4 Adaptación de Disposition Mediante Composición

Una UCA puede adaptar la Disposition de otra mediante una cadena de activación estándar:

```text
u_A (Disposition d_A,0)
 │
 └── produces(u_A, o_A)
          │
          ▼ (Reception) triggers
      s_B ──► u_B (Purpose: evaluar y adaptar comportamiento)
               │
               └── produces(u_B, o_B): Δd_A
                                 │
                           d_A,0 ──mutation──► d_A,1  (aplicado a u_A)
```

Donde $\Delta d_A = \text{difference}(d_{A,0}, d_{A,1})$. `u_B` no requiere ninguna estructura especial. Su Purpose justifica su actividad.

---

### 7.5 Comportamiento Emergente Mediante Composición

Una red de UCAs, cada una limitada a $(u, s) \to o$, puede exhibir comportamiento que ninguna unidad individual contiene:

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

1. **Purpose Propio, Explícito e Invariante**: Define un Purpose explícito, inmutable y definido por su creador en Conception, que actúa como contrato ontológico inspeccionable para la evaluación inferencial externa.
   $$\forall u \in \mathbb{U}, \exists! p \in \mathbb{P} : \text{hasPurpose}(u, p)$$
2. **Disposition Definida**: Tiene una Disposition que condiciona su comportamiento reactivo.
   $$\forall u \in \mathbb{U}, \exists d \in \mathbb{D} : \text{hasDisposition}(u, d)$$
3. **Capabilities Acotadas**: Opera mediante un conjunto explícito y acotado de Capabilities.
   $$\forall u \in \mathbb{U}, \exists C \subseteq \mathbb{C}, C \neq \emptyset : \text{hasCapabilities}(u, C)$$
4. **Activación Reactiva por Estímulo**: Se ejecuta estrictamente al ser detonada por un Stimulus externo que cruza su frontera funcional.
   $$\forall u \in \mathbb{U}, \exists s \in \mathbb{S} : \text{triggers}(s, u)$$
5. **Reacción Interna Orientada por Purpose**: Ejecuta un proceso interno de Reaction compuesto por Actions e interacciones que persiguen su Purpose dentro de los límites de sus Capabilities y Disposition.
   $$\forall (u, s) \text{ activo}, \exists r \in \mathbb{R}\text{xn} : \text{triggers}(s, u)$$
6. **Producción de Outcome Estructurado y Gobernable**: Produce uno o más Outcomes observables estructurados en $(\text{Properties}, \text{Criteria}, \text{Owner})$, donde los Criteria son deterministas y se designa formalmente un Owner externo ($\text{owner} \in \mathbb{U} \cup \mathbb{H}\text{uman}, \text{owner} \ne u_{\text{target}}$).
   $$\forall (u_{\text{target}}, s) \text{ activo}, \exists o \in \mathbb{O} : \text{produces}(u_{\text{target}}, o) \land \text{hasOwner}(o, \text{owner}) \land (\text{owner} \ne u_{\text{target}})$$
7. **Descomposición por Purpose**: Trata a otro componente como UCA solo si dicho componente posee un Purpose propio y diferenciado.
   $$\forall u' \text{ compuesta en } u, u' \in \mathbb{U} \iff \exists! p' \in \mathbb{P} : \text{hasPurpose}(u', p') \land p' \neq p_u$$

### 8.1 Invariantes Fundamentales del Modelo UCA

Todo sistema o arquitectura conforme con UCA DEBE satisfacer rigurosamente las siguientes invariantes normativas:

1. **Frontera Reactiva Constitutiva**: Toda UCA DEBE disponer de una frontera reactiva capaz de recibir cambios observables externos a su dominio funcional.
2. **Naturaleza Relacional de Stimulus**: `Stimulus` es la recepción por una UCA de un cambio observable externo a su dominio que provoca su reacción.
3. **Naturaleza de Outcome**: `Outcome` es un cambio observable producido por una UCA como consecuencia de su actividad, estructurado en `Properties`, `Criteria` y `Owner`.
4. **Alcance de Externalidad**: `External` se determina estrictamente respecto de la frontera de la UCA receptora, no necesariamente respecto del sistema completo.
5. **Carácter Relacional sin Transformación**: `Outcome` y `Stimulus` son conceptos relacionales referidos al mismo cambio observable y NO requieren entidades runtime diferentes ni funciones de conversión ontológica.
6. **No Inferencia Automática de Stimulus**: Un `Outcome` NO constituye necesariamente un `Stimulus` para ninguna UCA; solo deviene `Stimulus` cuando su recepción provoca la reacción de una UCA receptora predispuesta por su `Disposition`.
7. **Reception Constitutiva y No Cognitiva**: `Reception` es el mecanismo universal, mecánico y no cognitivo de captación del cambio en la frontera de la UCA. No implica cognición, interpretación ni razonamiento.
8. **Perception Especializada y Opcional**: `Perception` es la interpretación funcional de información recibida realizada exclusivamente por una UCA especializada cuyo `Purpose` explícito requiere dicha interpretación.
9. **Independencia Perceptual del Estímulo**: Un `Stimulus` NO requiere `Perception` cognitiva previa para provocar la reacción reactiva de una UCA.
10. **Aislamiento entre Semántica Core y Runtime**: `Signal` e `Impulse` son mecanismos técnicos y vehículos de transporte de infraestructura en tiempo de ejecución, y NO deben identificarse ontológicamente con `Stimulus` u `Outcome`.
11. **Determinismo de Compliance**: El `Compliance` DEBE evaluarse determinísticamente a partir de la verificación objetiva de los `Criteria` sobre las `Properties`.
12. **Autoridad Exclusiva de Validación**: La `Validation` DEBE ser emitida exclusiva y contextualmente por el `Owner` del Outcome (la entidad demandante de la ejecución).
13. **Prohibición Estricta de Autovalidación**: El `Target UCA` NO DEBE validar ni aprobar sus propios `Outcomes` ($\text{hasOwner}(o, \text{owner}) \implies \text{owner} \neq u_{\text{target}}$).
14. **Disociación Estricta Compliance ≠ Validation**: `Compliance` no implica `Validation` (`PASS` $\not\implies$ `APPROVED`, `FAIL` $\not\implies$ `REJECTED`). Las cuatro combinaciones son empíricamente válidas e irreducibles.
15. **Evolución Basada en Evidencia Histórica**: La evolución de una UCA DEBE basarse en el análisis de evidencia histórica multiejecución acumulada ($H \in \mathbb{H}$).
16. **Prohibición de Autoevolución Directa Aislada**: Una UCA NO DEBE auto-evolucionar directamente en respuesta a un `Outcome` individual o aislado.
17. **Seguridad y Atomicidad de Mutación**: Toda mutación de `Disposition` DEBE ser atómica, reversible y circunscrita estrictamente dentro de los límites de `Nature` ($\text{satisfies}(\text{val}, n)$).
18. **Semántica de Cambio en $\Delta\text{Disposition}$**: $\Delta\text{Disposition} = \text{difference}(D_0, D_1)$ representa exclusivamente diferencia de estado, NUNCA mejora intrínseca, progreso cualitativo ni optimización a priori.
19. **Encapsulación de Action**: `Action` es cualquier operación o transición interna perteneciente a la `Reaction` de una UCA y MUST pertenecer estrictamente a su dominio interno encapsulado.
20. **Frontera Observable Exclusiva en Outcome**: `Outcome` es la única consecuencia observable de la actividad de una UCA. Las `Actions`, `Mechanisms`, interacciones internas y `Process` NO forman parte del contrato observable entre UCAs.
21. **Independencia del Consumidor respecto a Actions Internas**: Una UCA consumidora MUST NOT requerir conocer las `Actions` internas, mecanismos ni secuencias procedimentales de otra UCA para utilizar sus `Outcomes`.
22. **Evaluación Centrada en Consecuencias Observables**: Los `Criteria` de un `Outcome` evalúan `Properties` observables y NO secuencias de `Actions` internas ni invocaciones a `Mechanisms`.
23. **Alcance de Validación**: El `Owner` valida el `Outcome` observable y NO la secuencia interna de `Actions` utilizada para producirlo.
24. **Evolución Centrada en Disposition**: La evaluación y evolución de una UCA se fundamentan en la relación entre `Disposition` y `Outcomes` observables ($D \to O$). La evolución muta la `Disposition` ($\Delta\text{Disposition}$) y MUST NOT reescribir directamente `Actions` internas.

**No-requisitos para la Conformidad**:

Un componente **no** necesita ninguno de los siguientes para cumplir con UCA:
- una segunda fuente de dirección funcional ni un contenedor formal de `Context` como estructuras universales obligatorias del estímulo;
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

La conformidad evalúa la **unidad individual** frente al contrato UCA. No evalúa si el sistema en su conjunto exhibe comportamiento cognitivo. La conformidad individual de la unidad respecto al `Owner` se satisface mediante el desacoplamiento formal de la autovalidación en el contrato de su Outcome y la designación de la autoridad de validación externa ($\text{owner} \in \mathbb{U} \cup \mathbb{H}\text{uman}$, con $\text{owner} \neq u_{\text{target}}$), sin exigir el despliegue concurrente del Owner en tiempo de ejecución para evaluar a la unidad aislada. De igual modo, la conformidad individual respecto al `Purpose` (Criterio 1) se satisface al declarar formalmente un Purpose explícito e invariable desde su concepción, sin exigir que la propia unidad contenga lógica de autoevaluación reflexiva sobre su propósito, tarea que corresponde inferencialmente a la UCA de Análisis (Cíngulo) sobre la evidencia histórica.

---

## 9. Preguntas Abiertas

Esta sección documenta preguntas abiertas no resueltas en la especificación, identificadas a partir del modelo conceptual y de la auditoría de formalización.

### 9.1 Criterios de Pertinencia de Estímulos y Filtros de Interfaz

Bajo el Principio de Minimalidad, la especificación no impone un predicado computable universal $\text{relevant}(s, p)$ que toda UCA deba evaluar formalmente en cada ciclo. En unidades reactivas o de streaming (como `Ear`), la compatibilidad queda determinada físicamente por la propia interfaz de sus Capabilities receptoras; en unidades cognitivas, por suscripciones tipadas, contratos de interfaz o discriminación por el runtime. Permanece abierta la formalización de cómo los contratos de interfaz de las Capabilities y del Runtime gestionan la pertinencia de las señales entrantes sin introducir sobrecarga teleológica en el Core.

### 9.2 Plasticidad Relacional Inter-UCA

Si una abstracción `Synapse` —que represente una propiedad persistente y adaptable de la relación entre dos UCAs— es necesaria o suficiente para modelar la plasticidad inter-unidad permanece como pregunta abierta. Requiere evidencia empírica de implementaciones (véase §6.5).

### 9.3 Validación Empírica de la Cognición Emergente

La hipótesis central de UCA (§6.6) no ha sido validada empíricamente todavía. Las futuras implementaciones de referencia deben diseñarse para comprobar si el comportamiento cognitivo puede emerger de unidades acotadas por propósito y limitadas a $(u, s) \to a \to o$.

### 9.4 Relación Formal entre Action y Reactive Process [CERRADA]

Esta cuestión queda formalmente resuelta en §2.1 y §2.9:
1. **Reaction como Proceso Encapsulado**: `Reaction` es el proceso interno desencadenado en una UCA por un `Stimulus`, que engloba las interacciones entre Capabilities y el proceso emergente interno.
2. **Action como Operación Interna**: `Action` ($a \in \mathbb{A}$) es cualquier operación o transición interna (activación de Capability, ejecución de Mechanism, transformación de datos, mutación de propiedad) que ocurre dentro de `Reaction`.
3. **Outcome como Única Frontera Observable**: `Action` no constituye una interfaz exterior observable. Solo el `Outcome` cruza la frontera de la UCA hacia el exterior. Por tanto, las UCAs consumidoras se acoplan exclusivamente a los Outcomes observables y no a la secuencia de Actions internas.

### 9.5 Semántica de Inclusión en Contexto vs. Detonación en Relaciones Outcome → Stimulus [CERRADA]

Esta cuestión queda formalmente resuelta en §2.7, §2.11 y §3.3:
1. **Relación Relacional**: `Outcome` y `Stimulus` no representan dos tipos de datos diferentes ni requieren transformación runtime (`convertToStimulus()`). Representan posiciones relacionales distintas respecto de fronteras funcionales de UCA diferentes: el cambio observable $\Delta x$ producido por la actividad de $u_A$ constituye un `Outcome` para $u_A$; la recepción mecánica de ese mismo cambio por $u_B$, cuando su `Disposition` provoca su reacción reactiva, constituye un `Stimulus` para $u_B$.
2. **No Inferencia Automática**: Un Outcome puede existir sin constituir jamás un Stimulus si ninguna otra UCA está predispuesta a reaccionar ante él ($\text{Outcome}(u_A, \Delta x) \not\implies \exists u_B : \text{Stimulus}(u_B, \Delta x)$).
3. **Desacoplamiento de Contexto**: El sustrato contextual ($x \in \mathbb{X}$) es un patrón arquitectónico compositivo y opcional (§4), no un requisito universal del Core. La distinción entre estimulación directa y contexto depende exclusivamente de la `Disposition` de la UCA receptora.

### 9.6 Semántica y Sobrecarga Ontológica de `Interaction.Signal` [CERRADA]

Esta cuestión queda resuelta formalmente mediante la simplificación de `Disposition` y la eliminación de la entidad `Interaction` (§2.4). Las Capabilities ya no declaran `Interaction.Signal` de forma aislada, sino suscripciones reactivas locales (`reactTo: ['Capability.outcome', ...]`), donde la emisión y tipado de señales discurre sobre canales reactivos y eventos de `Outcome`, eliminando la ambigüedad ontológica previa.

### 9.7 Causalidad frente a Reactividad y Propagación Temporal

La especificación distingue formalmente entre:
- Precedencia temporal: $\text{precedes}(x, y)$;
- Reacción: $\text{reactsTo}(x, y)$;
- Producción: $\text{produces}(x, y)$.

El uso del término "causalidad" en la arquitectura UCA plantea la interrogante de si la causalidad es una asunción ontológica necesaria del modelo o si toda interacción inter-UCA puede describirse exhaustivamente mediante relaciones puras de reactividad, producción y propagación temporal, evitando compromisos metafísicos o modelos causales contrafácticos no formalizados.

### 9.8 Evaluación Teleológica y Predicado Formal `servesPurpose(a, p)`

El UCA Core establece que toda Action es el resultado de un Reactive Process emergente de una UCA ya constituida $u = (p, d, C, O)$. Dado que la unidad está intrínsecamente orientada por su Purpose, la acción emana de dicha constitución. Permanece abierta la cuestión de si el predicado formal $\text{servesPurpose}(a, p)$ aporta semántica irreducible o si constituye una redundancia formal respecto de la pertenencia de $p$ a la constitución de $u$ ($\text{hasPurpose}(u, p)$), evitando el riesgo de inducir evaluaciones teleológicas no computables dentro de los criterios mínimos de conformidad.

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

UCA reconoce explícitamente estas influencias y precedentes intelectuales. Al mismo tiempo, UCA no pretende ser una copia, evolución directa, extensión oficial, sustitución ni unificación de ninguna de estas arquitecturas. Cada una de ellas fue concebida para satisfacer objetivos, restricciones y dominios operativos particulares. UCA aborda su propio problema específico: definir una **primitiva funcional mínima y determinable** ($u = (p, d, C, O)$) a partir de la cual el comportamiento cognitivo complejo pueda emerger mediante composición reactiva.

### 10.2 Modelo de Actores (Actor Model)

El Modelo de Actores (Hewitt, Bishop & Steiger, 1973; Agha, 1986) formuló una de las aproximaciones más influyentes para el diseño de sistemas concurrentes y distribuidos basados en unidades independientes. En este modelo, un "actor" es una entidad autónoma que, en respuesta a un mensaje entrante, puede tomar decisiones locales, crear nuevos actores, enviar mensajes a otros actores y modificar su estado interno para mensajes futuros.

**Similitudes con UCA**:
- **Aislamiento y límites claros**: Ambas abstracciones rechazan el estado global compartido mutable; cada unidad encapsula su propio comportamiento.
- **Activación por recepción**: Un actor no se ejecuta sin recibir un mensaje; una UCA reacciona únicamente ante la recepción de un Stimulus externo a su frontera funcional.
- **Concurrencia y distribución**: La interacción no depende de un hilo de ejecución centralizado ni de bloqueos compartidos.

**Diferencias Conceptuales**:
- **Naturaleza ontológica**: El Modelo de Actores es fundamentalmente una abstracción computacional para concurrencia, paralelismo y paso de mensajes en sistemas distribuidos. UCA es una primitiva ontológica funcional concebida para delimitar la identidad y responsabilidad cognitiva.
- **Constitución explícita**: En el Modelo de Actores clásico, un actor se define por su buzón y su comportamiento dinámico ante mensajes. En UCA, la unidad está rigurosamente constituida por la tupla formal $u = (p, d, C, O)$, donde el **Purpose** ($p$) determina de forma invariante aquello que persigue, las **Capabilities** ($C$) acotan sus límites operacionales, la **Disposition** ($d$) declara de forma transparente sus propiedades e interacciones reactivas, y el **Outcome** ($O$) define formalmente sus consecuencias observables con criterios deterministas y un Owner externo con autoridad de validación.
- **Separación de infraestructura**: Un actor se acopla frecuentemente al buzón (*mailbox*) de infraestructura de su runtime; en UCA, el mecanismo de transporte (`Impulse`) está estrictamente desacoplado del contenido detonante (`Stimulus`).

### 10.3 Sistemas Reactivos y Arquitecturas Orientadas a Eventos (EDA)

Las arquitecturas orientadas a eventos (Event-Driven Architecture) y los principios de los Sistemas Reactivos (Bonér et al., 2014) establecen que los sistemas de software deben ser reactivos a los estímulos del entorno, desacoplados en el tiempo y en el espacio, y resilientes mediante el aislamiento de fallos.

**Similitudes con UCA**:
- **Detonación reactiva**: El flujo de procesamiento no procede de una llamada imperativa descendente, sino de la reacción ante una señal, evento o cambio en el entorno:
  $$\text{External Signal} \to \text{Stimulus} \to \text{UCA} \to \text{Action} \to \text{Outcome}$$
- **Desacoplamiento temporal y espacial**: Quien emite una señal no controla ni conoce el ciclo de vida interno del receptor.
- **Interacciones reactivas intra-unidad**: Las relaciones reactivas (`reactTo`) declaradas en la Disposition de cada Capability siguen una semántica estrictamente reactiva ante cambios observables locales.

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
- **Teleología: Purpose frente a Goal**: Soar sitúa el concepto de meta (*goal*) como la abstracción central que guía la selección de operadores y la resolución de impasses durante la ejecución dinámica de una tarea. UCA, por el contrario, adopta **Purpose** como la única fuente de dirección funcional constitutiva de la unidad y prescinde de metas como primitiva de activación. En UCA, una unidad no recibe metas externas de activación; recibe señales externas (Stimuli) y reacciona intrínsecamente conforme a lo que su Purpose ya determina que persigue.
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
| **Dirección Teleológica** | Contraste con Soar, LIDA, BDI | Adopción de `Purpose` constitutivo propio como única fuente de dirección funcional. La UCA no recibe metas; recibe perturbaciones o datos. |

---

### 10.11 El Contrato Propio de UCA y el Alcance de su Hipótesis

La revisión de antecedentes e influencias arquitectónicas pone de manifiesto que UCA no requiere atribuirse la invención aislada de cada uno de sus principios rectores para fundamentar su valor. El aporte de UCA reside en la **combinación formal, minimalista y acotada** de dichos principios dentro de un contrato ontológico estricto:

```text
CONSTITUCIÓN:
u = (p, d, C, O)

Purpose (p)
    determina funcionalmente qué UCA es y qué persigue.

Capabilities (C)
    delimitan lo que la UCA puede hacer.

Disposition (d)
    determina cómo están constituidas y predispuestas
    sus Capabilities mediante su Definition y reactTo.

Outcome (O)
    define formalmente las consecuencias observables producidas,
    con Criteria deterministas y un Owner externo con autoridad de validación.

ACTIVACIÓN REACTIVA:
External Signal ──► Stimulus ──► Target UCA ──► Reaction ──► Outcome (Criteria ──► Compliance, Owner ──► Validation)
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

   > **Coexistencia de Capabilities con Mismo Mechanism / Clase (§2.3)**: En estricta concordancia con la Sección 2.3, la identidad de una Primitive Capability está determinada por su Mechanism. Nada impide que dos capabilities distintas de un mismo organismo compartan el mismo Mechanism o clase concreta (ej. `leftEar` y `rightEar` compartiendo la clase `AcousticEar`, dos sensores ópticos o dos actuadores del mismo tipo). Dentro del organismo, cada capability se distingue unívocamente por su clave funcional en formato `camelCase`.
   >
   > Para preservar el determinismo estricto en `canProcess()` ante capabilities que comparten clase o mecanismo, las señales de runtime transportan tanto la clave funcional de la capability (`sourceName`) como su clase concreta (`sourceType`) y el identificador unívoco de la instancia (`source`), permitiendo a las unidades receptoras discriminar tanto por rol específico (`leftEar.isListening`) como de forma transversal o polimórfica (`AcousticEar.isListening`).

5. **Detección Automática de Mutación de Propiedades (Proxy Reactivo)**:
   La instancia de la UCA está envuelta en un Proxy reactivo. Cualquier mutación de propiedades públicas desencadena automáticamente una señal de broadcast en el canal interno (`Channel`) con la identidad completa de la instancia emisora (`source` id, clave `sourceName` en `camelCase`, y tipo `sourceType`). Las asignaciones redundantes (mismo valor) son suprimidas en tiempo real.

6. **Reactividad Declarativa (`reactTo`)**:
   Cada UCA receptora define la lista de señales o propiedades ante las cuales reacciona:
   ```typescript
   protected reactTo = [
       'acousticEar.isListening',    // Discriminación por clave de capability en camelCase
       'AcousticEar.lastTranscript', // O discriminación por tipo ontológico
   ];
   ```
   La UCA discrimina de forma $O(1)$ en `canProcess(signal)` y delega inmediatamente al método `react(signal)`.

### 12.2 Interfaces y Contratos de Tipado (`types.ts`)

| Interfaz / Tipo | Definición | Responsabilidad |
|---|---|---|
| `Signal` | `{ source: string; sourceName: string; sourceType: string; property: string; value: unknown; timestamp: number; }` | Representa una señal atómica generada ante la mutación de una propiedad en una UCA emisora. Contiene el identificador unívoco de la instancia (`source`), su clave en el organismo (`sourceName`), su clase ontológica (`sourceType`), la propiedad mutada (`property`), el valor (`value`) y la marca temporal (`timestamp`). |
| `MutationEvent` | `Signal<T> & { oldValue: T; newValue: T; }` | Evento atómico emitido ante la modificación de cualquier propiedad de la disposición (`this.disposition`). Permite trazabilidad evolutiva de $\Delta d$, reportando el valor anterior (`oldValue`) y el nuevo (`newValue`). |
| `DispositionSnapshot` | `{ version: number; timestamp: number; disposition: T; mutation?: MutationEvent; }` | Instantánea inmutable que captura el estado íntegro de la disposición en un punto del tiempo, permitiendo navegación y reversión secuencial de configuraciones. |
| `SignalListener` | `(signal: Signal) => Promise<void> \| void` | Función de callback invocada ante la recepción de una señal en el canal interno. |
| `IChannel` | `broadcast(signal: Signal): void;`<br>`subscribe(listener: SignalListener): () => void;` | Contrato del bus de comunicación local intra-organismo. Desacopla la emisión de señales de los receptores suscritos. |
| `CapabilityConstructor` | `new (id: string, name: string, config: Config) => Uca` | Firma del constructor para clases que extienden `Uca` y pueden ser instanciadas dinámicamente como capabilities subordinadas. |
| `IRegistry` | `register<T>(name: string, ctor: CapabilityConstructor<T>): void;`<br>`get<T>(name: string): CapabilityConstructor<T> \| undefined;`<br>`has(name: string): boolean;` | Contrato del catálogo superior que mapea nombres de capabilities en `camelCase` con sus correspondientes constructores de clase. |
| `Config` | `{ channel: IChannel; nervousSystem?: INervousSystem; registry?: IRegistry; }` | Parámetros de configuración e inyección de dependencias para la inicialización de una UCA. El `channel` es obligatorio para garantizar la inervación compartida dentro del organismo. |

### 12.3 Especificación de la Clase Base `Uca`

La clase abstracta base `Uca` gobierna el ciclo de vida, el montaje innato de órganos y el despacho reactivo de señales en el runtime.

#### 12.3.1 Propiedades

- `public abstract purpose: string`: Propósito ontológico inmutable que define y orienta la unidad a lo largo de su existencia.
- `public capabilities: Record<string, Record<string, unknown>>`: Diccionario declarativo de capabilities innatas y sus disposiciones, con claves obligatorias en formato `camelCase`.
- `public disposition?: Record<string, unknown>`: Configuración paramétrica e interactiva inyectada en la unidad durante su instanciación.
- `protected channel: IChannel`: Instancia del canal local de señales inyectado obligatoriamente en `Config`.
- `protected registry: IRegistry`: Referencia al catálogo de capabilities utilizado para resolver constructores. Por defecto utiliza `defaultRegistry`.
- `protected reactTo: string[]`: Array declarativo de señales en formato `<SourceUca>.<property>` ante las cuales la UCA debe reaccionar.

#### 12.3.2 Constructor

```typescript
constructor(id: string, name: string, config: Config)
```
- Invoca al constructor de `Adn(id, name, nervousSystem)`.
- Asigna `this.channel = config.channel` y `this.registry`. La disposición no se inyecta externamente por `config`; es una propiedad ontológica innata definida físicamente en la propia clase (`public disposition: TDisposition`).
- Inerva el canal interno mediante `this.innervate(membrane)`.
- Envuelve la instancia en su membrana reactiva (`createMembrane(this)`) y la retorna, garantizando la interceptación transparente de mutaciones de propiedades.

#### 12.3.3 Métodos de Ciclo de Vida y Montaje de Capabilities

- `public override async live(): Promise<void>`:
  Punto de entrada al ciclo de vida biológico de la UCA. Invoca en primer término a `this.mountCapabilities()` para instanciar e inicializar todos los órganos subordinados declarados en `capabilities`, y delega a continuación en `super.live()`.
- `private mountCapabilities(): void`:
  Método privado que itera deterministamente sobre las claves de `this.capabilities`. Para cada nombre de capability, verifica si la propiedad ya existe en la instancia; si no existe, delega el montaje a `this.attach(name)`.
- `private attach<T extends Uca>(name: string): T`:
  Método privado que resuelve el constructor de la capability a través de `this.registry.get(name)`. Si el constructor está registrado, crea la instancia subordinada pasándole un identificador único concatenado (`${this.id}::${name}`), compartiendo el canal (`this.channel`), el sistema nervioso (`this._ns`) y el registro (`this.registry`), y la asigna como propiedad directa de la UCA bajo el nombre `name` en `camelCase`. La capability nace con su propia disposición innata y no admite configuración externa por constructor.

> [!NOTE]
> **Modulación Operativa y Reconfiguración por Impulsos**: Al igual que todo órgano biológico, la UCA no recibe parametrización imperativa externa. Toda reconfiguración o ajuste de su disposición operativa se transmite exclusivamente mediante impulsos (`Impulse`) a través del `NervousSystem`, siendo procesada internamente en su método `react(impulse)` para actualizar su estado de forma soberana.

#### 12.3.4 Ciclo Reactivo Unificado (Impulse y Signal)

El runtime consolida un **único ciclo reactivo** en `Adn`/`Uca` independientemente de si la entrada proviene del exterior/macroestructura (`Impulse`) o de los órganos internos (`Signal`):

```text
                 UCA
                  │
         ┌────────┴────────┐
         │                 │
   NervousSystem        Channel
         │                 │
      Impulse            Signal
         │                 │
         └────────┬────────┘
                  │
             processInput()
                  │
             canProcess()
                  │
              preReact()
                  │
                react()
                  │
             postReact()
```

- `public async processInput(input: unknown): Promise<void>`:
  Punto de entrada reactivo común definido en `Adn`. Valida `canProcess(input)` y, si es verdadero, ejecuta secuencialmente la cadena asíncrona `preReact(input) -> react(next) -> postReact(next)`.
- `public override canProcess(item: unknown): boolean`:
  Evalúa si la entrada reactiva puede ser procesada. Si `item` es un `Signal`, comprueba si coincide con alguna regla declarada en `this.reactTo` (`type`, `sourceName.property`, `sourceType.property` o `source.property`) y suprime autoreacciones (`signal.source !== this.id`). Si es un `Impulse`, delega en la lógica de procesamiento de impulsos de `Adn`.
- `private async handleSignal(signal: Signal): Promise<void>`:
  Receptor privado de señales suscripto al canal local. Ignora de forma inmediata señales cuyo `source` coincida con `this.id` y delega en `await this.processInput(signal)`.
- `protected override async preReact(input: unknown): Promise<unknown>`:
  Hook previo heredado de `Adn` que prepara y valida el contexto antes de la reacción.
- `public override async react(item: unknown): Promise<void>`:
  Punto de extensión protegido y sobreescribible por las subclases de UCA para ejecutar su comportamiento reactivo específico ante los estímulos que han superado el filtro de `canProcess`.
- `protected override async postReact(next: unknown): Promise<void>`:
  Hook posterior heredado de `Adn` para estabilización y cierre del ciclo reactivo.

> **Aislamiento Estricto de Dominios**: El `Channel` es un bus local para la coordinación biológica intra-dominio entre capabilities. Ningún cambio de propiedad ni señal interna se redirige al `NervousSystem`. El `NervousSystem` se reserva para impulsos entre agentes y módulos mayores.

#### 12.3.5 Reactividad de la Disposición y Eventos de Mutación

La arquitectura UCA restringe la generación de mutaciones **única y exclusivamente a las propiedades definidas en la disposición (`this.disposition`)**. Las propiedades operativas ordinarias de la clase UCA (como flags de ejecución o colas locales) no interceptan ni emiten mutaciones, evitando sobrecarga y garantizando que el espacio evolutivo observable sea estrictamente la disposición ontológica:

1. **Proxy Reactivo Exclusivo de Disposición**: Al acceder a `this.disposition`, se retorna un Proxy reactivo que intercepta las asignaciones a sus propiedades (`set` trap).
2. **Supresión de Emisiones Redundantes**: Si el nuevo valor asignado a una propiedad de la disposición es idéntico al actual, la asignación se realiza silenciosamente sin emitir eventos ni señales, evitando bucles y ruido en el bus.
3. **Disparo Automático de Eventos de Mutación**:
   Cuando se modifica una propiedad interna de `this.disposition` (ej. `this.disposition.sampleRate = 48000` tras recibir un impulso de reconfiguración):
   - Se emite un `MutationEvent` en la propia instancia (`target.emit('mutation', event)` y `target.emit('mutation:<property>', event)`).
   - Se difunde el evento a través del `Channel` local intra-dominio (`channel.broadcast(event)`).
   - El organismo superior receptor retransmite el evento (`forwardMutation`), permitiendo observabilidad completa en el agente agregador (`agent.on('mutation', ...)`).
4. **Suscripción Directa a Propiedades de Disposición (`reactTo`)**:
   Las propiedades de la disposición constituyen el espacio observable ante el cual otras UCAs pueden reaccionar. No es necesario ni pertinente que una UCA receptora declare `.disposition.<propiedad>`. La suscripción se realiza de forma directa y transparente mediante la firma canónica:
   ```typescript
   protected reactTo = [
       'AcousticEar.sampleRate', // Discriminación directa por tipo ontológico
       'acousticEar.sampleRate', // O discriminación directa por clave funcional
   ];
   ```
   El motor reactivo (`canProcessSignal`) correlaciona automáticamente el nombre de la propiedad mutada (`property`) con el emisor (`sourceType` o `sourceName`), garantizando la reactividad intra-organismo desacoplada.
5. **Historial Secuencial y Métodos de Reversión (`revert`, `revertTo`)**:
   Toda UCA expone su secuencia evolutiva y métodos para restaurar configuraciones previas:
   - `public get dispositionSequence(): readonly DispositionSnapshot<TDisposition>[]`: Retorna la cronología inmutable de snapshots $[D_0, D_1, \dots, D_n]$.
   - `public revert(steps: number = 1): boolean`: Retrocede $N$ pasos hacia la configuración previa. Retorna `false` si ya se encuentra en el estado inicial de concepción ($D_0$).
   - `public revertTo(version: number): boolean`: Restaura la configuración correspondiente a un número de versión específico.
   Cada reversión actualiza `this.disposition` mediante su Proxy reactivo, desencadenando automáticamente los eventos de mutación requeridos para mantener sincronizado a todo el organismo.

### 12.4 Ejemplo Canónico de Referencia (No Normativo)

> **Nota aclaratoria:** El código presentado a continuación es **estrictamente un ejemplo de uso no normativo**. Su único propósito es ilustrar de manera práctica cómo se traducen los principios formales del runtime de UCA a TypeScript. No prescribe una arquitectura fija ni limita la diversidad de capacidades u organismos que pueden desarrollarse conforme a esta especificación.

```typescript
import { Uca, defaultRegistry, Signal } from './uca/index.js';

// 1. Definición de Capabilities Primitivas
export interface AcousticEarDisposition {
    sampleRate: number;
    framingMs: number;
}

export class AcousticEar extends Uca<AcousticEarDisposition> {
    public override purpose = 'Percepción acústica y transcripción continua de voz';
    public override disposition: AcousticEarDisposition = {
        sampleRate: 16000,
        framingMs: 100,
    };
    public isListening = false;
    public lastTranscript = '';
    protected override reactTo = ['Environment.audioInput'];

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            // Las propiedades se alteran internamente en la clase como reacción al estímulo
            this.isListening = true;
            this.lastTranscript = value;
        }
    }
}

export interface VocalMouthDisposition {
    voice: string;
    rate: number;
}

export class VocalMouth extends Uca<VocalMouthDisposition> {
    public override purpose = 'Síntesis y alocución vocal hacia el exterior';
    public override disposition: VocalMouthDisposition = {
        voice: 'alloy',
        rate: 1.0,
    };
    public speechQueue: string[] = [];
    protected override reactTo = ['AcousticEar.lastTranscript'];

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            // Reacción interna desacoplada
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

// 4. Uso del Agente: Reactividad Pura mediante Señales (Sin Mutaciones Externas)
export async function runVoiceAgentExample(): Promise<void> {
    const agent = new ConversationalAgent('agent-001', 'ConversationalAgent');

    // Cada capability se instancia aisladamente y queda expuesta en su propiedad camelCase
    const ear = (agent as unknown as Record<string, AcousticEar>)['acousticEar'];
    const mouth = (agent as unknown as Record<string, VocalMouth>)['vocalMouth'];

    console.log(`Propósito del Agente: ${agent.purpose}`);
    console.log('Disposición de acousticEar:', ear.disposition);
    console.log('Disposición de vocalMouth:', mouth.disposition);

    // Activación reactiva pura: la comunicación con el exterior se realiza exclusivamente
    // mediante señales o impulsos. Las propiedades internas NUNCA se alteran desde fuera;
    // se setean internamente en la propia clase al reaccionar al estímulo recibido.
    agent.channel.broadcast({
        type: 'Environment.audioInput',
        source: 'Environment',
        sourceName: 'environment',
        sourceType: 'Environment',
        property: 'audioInput',
        value: 'Hola, arquitecto cognitivo',
        timestamp: Date.now(),
    });

    // Consecuencia observable: acousticEar ha reaccionado internamente
    // y vocalMouth ha reaccionado a la señal emitida por acousticEar
    console.log('Estado interno de acousticEar (isListening):', ear.isListening);
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

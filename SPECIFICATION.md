# UCA — Artificial Cognitive Unit (Unidad Cognitiva Artificial)
*Functional Primitive Specification (Open Specification RFC)*

[ English | [Español](SPECIFICATION.es.md) ]

---

## 1. Introduction

### What UCA is

UCA defines a **minimal functional primitive** for constructing systems in which cognitive behaviour may emerge through composition and interaction.

> **UCA is not cognition.**
>
> **UCA is a minimal functional primitive proposed for composing systems in which cognitive behaviour may emerge.**

The conceptual layers of the UCA model:

```text
┌──────────────────────────────┐
│             UCA              │  ← functional primitive (normative)
│  u = (p, d, C)               │
│  (u, s) → a → o              │
└──────────────┬───────────────┘
               │ composition
               ▼
┌──────────────────────────────┐
│          UCA SYSTEM          │  ← network of functional primitives
│   u₁ ↔ u₂ ↔ ... ↔ uₙ         │
└──────────────┬───────────────┘
               │ organization
               ▼
┌──────────────────────────────┐
│    COGNITIVE ARCHITECTURE    │  ← organization of primitives
└──────────────┬───────────────┘
               │ executed by
               ▼
┌──────────────────────────────┐
│           RUNTIME            │  ← execution infrastructure
└──────────────────────────────┘
```

And separately, as a research hypothesis:

```text
UCA SYSTEM
       │
       │ experimental hypothesis
       ▼
EMERGENT COGNITIVE BEHAVIOUR
```

Cognitive behaviour belongs to the system level. It is not a property of any individual UCA.

### What UCA does not prescribe

This specification does **not** prescribe:
- a specific cognitive topology or hierarchy;
- biological or neuroanatomical analogies;
- specific cognitive units that every system must instantiate;
- a particular communication technology or message broker;
- a specific language model, framework, or vendor;
- a concrete memory or storage engine;
- a centralized global state representation;
- a specific runtime environment;
- that any individual UCA possesses or demonstrates cognition.

### Minimality Principle

> **A concept belongs to the UCA Core only if removing it prevents the unit from satisfying the universal UCA contract.**

Before extending the Core, ask:
1. Is this required by **every** possible UCA, regardless of domain, topology, or implementation?
2. Can it be expressed through Purpose, Action, Outcome, or composition of UCAs?

If (1) is NO, the concept does not belong in the Core.
If (2) is YES, the concept must remain outside the Core.

A paradigmatic case of this principle is the removal of `Goal` from the Core: if `Purpose` already universally determines what the UCA pursues throughout its existence, a second universal abstraction determining concrete activation targets introduces teleological redundancy and turns reactive activation into an implicit form of instruction, and is thus excluded from the Core.

### Composition Principle

> **Before extending the UCA primitive with a new cognitive mechanism, attempt to represent that responsibility through composition of existing UCAs.**

Concepts that can be expressed through Purpose, Action, Outcome, or composition of UCAs must not be added as universal UCA primitives.

### Fundamental Principles of the Model

1. **Conception determines what UCA exists.**
2. **Purpose functionally determines what UCA is and what it pursues throughout its existence.**
3. **Capabilities determine the boundaries of what the UCA can do.**
4. **Disposition determines how those Capabilities are constituted and predisposed to behave and interact.**
5. **Stimulus is a signal external to the UCA boundary whose reception triggers a reaction in an already conceived unit.**
6. **Capabilities react through Interactions and not through direct dependencies between them.**
7. **The Process emerges from reactive interactions between Capabilities according to their Dispositions.**
8. **Outcome is the observable consequence of such activity.**
9. **Evolution modifies the Disposition without abandoning Purpose nor the limits of Capabilities.**
10. **The minimal unit of Evolution is an atomic, bounded, observable, and potentially reversible Mutation.**

---

### Formal Notation and Grammar

To ensure rigorous and unambiguous interpretation across all normative sections of this specification, this subsection establishes the formal grammar, canonical domains, mathematical entities, and named relations governing the UCA model.

#### Architectural Domains and Concrete Entities

A strict distinction is maintained between an entity domain (set) and an individual concrete instance of that domain:

| Domain (Set) | Instance | Conceptual Meaning |
| :--- | :--- | :--- |
| $\mathbb{U}$ | $u \in \mathbb{U}$ | Concrete Artificial Cognitive Unit (UCA) |
| $\mathbb{P}$ | $p \in \mathbb{P}$ | Dedicated Invariant Purpose that functionally determines what the UCA is and what it pursues |
| $\mathbb{D}$ | $d \in \mathbb{D}$ | Declarative Disposition |
| $\mathbb{C}$ | $c \in \mathbb{C}$ | Capability |
| $\mathbb{M}$ | $m \in \mathbb{M}$ | Mechanism (operational procedure of a Capability) |
| $\text{Prop}$ | $\text{prop} \in \text{Prop}$ | Property: declarative or parametric condition $(\text{function}, \text{nature}, \text{value})$ |
| $\text{Nat}$ | $n \in \text{Nat}$ | Nature: intrinsic specification of the valid mutation space of a Property |
| $\text{Inter}$ | $\text{inter} \in \text{Inter}$ | Interaction: declared reactive relation $(\text{definition}, \text{target}, \text{signal}, \text{when})$ |
| $\mathbb{S}$ | $s \in \mathbb{S}$ | Stimulus: signal external to the UCA boundary whose reception triggers a reaction of the unit |
| $\mathbb{X}$ | $x \in \mathbb{X}$ | Context: situational background or support context (optional pattern, §4) |
| $\mathbb{A}$ | $a \in \mathbb{A}$ | Action: operational execution of the emergent reactive process of the UCA |
| $\mathbb{O}$ | $o \in \mathbb{O}$ | Outcome (observable consequence produced) |
| $\mathbb{M}\text{ut}$ | $\mu \in \mathbb{M}\text{ut}$ | Mutation (atomic transformation of Disposition) |
| $\mathbb{E}$ | $e \in \mathbb{E}$ | Evidence (observable empirical information) |

> **Deprecation Note (Goal)**: The historical abstraction `Goal` ($g \in \mathbb{G}$) has been formally deprecated and eliminated from the normative UCA model. `Goal` was initially used to represent a required result during an activation; it is removed because it introduced a second source of functional direction redundant with `Purpose` and degraded reactive activation into an implicit command semantics. The normative model admits no compensatory concept of goal, target, or external instruction (`Goal`, `Objective`, `Task`, `Command`, or `DesiredOutcome`).

#### Explicit Named Relations

Generic arrows ($\to$) with multiple interpretations are prohibited in normative expressions. The specification defines and prioritizes the following named predicates and relations:

1. **Constitution and Membership**:
   - $\text{hasPurpose}(u, p)$: Unit $u$ possesses purpose $p$.
   - $\text{hasDisposition}(u, d)$: Unit $u$ is predisposed by disposition $d$.
   - $\text{hasCapability}(u, c)$: Unit $u$ includes capability $c$.
   - $\text{hasCapabilities}(u, C)$: Unit $u$ includes the set of capabilities $C \subseteq \mathbb{C}$.

2. **Reactivity and Activation**:
   - $\text{triggers}(s, u, a)$: Asserts that the reception of external stimulus $s$ by unit $u$ triggers reactive action $a$. Expresses strict reactive activation; does NOT imply command, instruction, intent, goal, or global metaphysical causality.
   - $\text{triggers}(o, s)$: Outcome $o$ triggers or materializes stimulus $s$.
   - $\text{reactsTo}(x, y)$: Entity $x$ reacts upon the observation or reception of state or signal $y$.

3. **Production**:
   - $\text{produces}(u, a)$: Unit $u$ produces or executes action $a$ upon activation.
   - $\text{produces}(a, o)$: Action $a$ produces outcome $o$ as an observable consequence.

4. **Temporal Ordering**:
   - $\text{precedes}(x, y)$: Event or entity $x$ temporally precedes event or entity $y$. Precedence strictly asserts chronological order ($t_x < t_y$) and does **NOT** imply causality, quality, or improvement.

5. **Validation and Compatibility**:
   - $\text{satisfies}(v, n)$: Value $v$ belongs to and conforms to the type, domain, and invariants defined by Nature $n$.
   - $\text{preservesPurpose}(u, \mu)$: Mutation $\mu$ preserves the invariant purpose of unit $u$.
   - $\text{withinCapabilities}(u, \mu)$: Mutation $\mu$ remains strictly within the operational boundaries of the capabilities of $u$.

6. **State Difference**:
   - $\text{difference}(s_0, s_1)$: Denotes the observable delta $\Delta$ between initial state $s_0$ and subsequent state $s_1$.

#### Semantics of Arrows and Diagrams

- **Normative Arrow ($\to$)**: Used exclusively as shorthand for verified formal chains:
  $$(u, s) \to a \to o \iff \text{triggers}(s, u) \land \text{produces}(u, a) \land \text{produces}(a, o)$$
- **Informative Flow Arrows ($\downarrow, \to, \dots$ in ASCII diagrams)**: Indicate exclusively visual reading direction. An unlabeled arrow in an informative diagram **does not** establish by itself causality, production, reaction, transformation, or temporal precedence.

#### Semantics of $\Delta$ (Delta)

The symbol $\Delta$ represents exclusively the difference or alteration between two identifiable states:
$$\Delta D = \text{difference}(D_0, D_1)$$
$\Delta$ **MUST NOT** be interpreted as qualitative improvement, optimization, progress, or positive value.

#### Well-Formedness Rules

1. **Every symbol used normatively MUST have a defined semantic domain.**
2. **Every normative relation MUST operate over compatible semantic domains.**
3. **The same operator MUST NOT represent different architectural relations.**
4. **Undefined mathematical operators MUST NOT be used normatively.**
5. **Temporal precedence MUST NOT imply qualitative improvement.**
6. **Reactive dependency MUST NOT automatically imply causality.**
7. **Runtime concepts MUST NOT be introduced into the UCA Core formal model unless required by Core conformance.**

---

## 2. UCA Core

The UCA Core defines the minimal properties required to identify a functional unit as an Artificial Cognitive Unit.

---

### 2.1 Definition, Conception and Lifecycle

An **Artificial Cognitive Unit (UCA)** is a bounded functional unit defined by a **dedicated purpose**, constituted by **concrete capabilities**, and predisposed by a **declarative disposition**.

> A UCA is defined not by what it executes, but by the purpose it is responsible for fulfilling.

Formally, a concrete UCA $u \in \mathbb{U}$ is constituted as a 3-tuple:

```text
u = (p, d, C) ∈ ℙ × 𝔻 × 𝒫(ℂ)
```

Where:
- $p \in \mathbb{P}$ — **Purpose**: why the UCA exists — guides its reaction.
- $d \in \mathbb{D}$ — **Disposition**: constitutive, parametric, and interactive conditions — predisposes its behavior.
- $C \subseteq \mathbb{C}$ ($C \neq \emptyset$) — **Capabilities**: finite and bounded set of operational resources — delimits its functional space.

This expression is a structural and constitutive definition of the unit, not an arithmetic equality.

#### Conception

> **Conception is the moment when a UCA is constituted with a Purpose, Capabilities, and an initial Disposition.**

```text
Conception
    ↓
UCA: u = (p, d, C)
├── Purpose: p
├── Capabilities: C
└── Disposition: d
```

`Conception` determines **what UCA exists**.

From its `Conception`, the UCA **remains functionally valid**. Traditional technical state concepts (`Birth`, `Start`, `Startup`, `Initialize`, `Boot`, `Ready`, `Active`, `Idle`, `Finished`, `Execute`) belong to the runtime technical implementation and are not part of the conceptual lifecycle of a UCA.

#### Separation Between Constitution and Activation

The UCA model strictly formalizes two independent dimensions:

**1. Constitution**
```text
u = (p, d, C)

p = what functionally determines the UCA and what it pursues
d = how its capabilities are constituted and predisposed
C = what it can do (functional boundary)
```

**2. Activation**
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

The `Stimulus` triggers reactive activity in an already conceived UCA.
The `Purpose` intrinsically determines toward what that activity is oriented.
The Stimulus **MUST NOT** redefine, alter, or replace the Purpose.

#### Reactive and Evolutionary Lifecycle

A UCA does not undergo rigid startup and termination phases. It reacts to received Stimuli and evolves upon evidence:

```text
                         CONCEPTION
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                           UCA                             │
│                                                           │
│  Stimulus                                                 │
│      ↓                                                    │
│  Reactive Process (emergent dynamic from Interactions)    │
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
│  ΔDisposition (atomic Mutation within Nature)             │
│      ↓                                                    │
│  evolved Reactive Process                                 │
│      ↓                                                    │
│  evolved Outcome(s)                                       │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

> **Fundamental Principle**: A UCA, from its Conception, remains functionally valid and reacts to received Stimuli pursuing its Purpose within the limits of its Capabilities and according to the active Disposition of those Capabilities.

---

### 2.2 Purpose (P)

> **Purpose is the sole definition that functionally determines what a UCA is and what it pursues throughout its existence.**

It is stable, persistent, and independent of specific executions or concrete mechanisms. It defines the operational boundary and identity of the unit.

Purpose determines:
- its functional reason for existence;
- its domain of responsibility;
- what it pursues;
- the orientation of all its reactions;
- its invariant functional identity throughout its existence.

```text
Purpose
   │
   ├── determines functional identity
   ├── delimits responsibility
   └── guides every reaction
```

- A Purpose delimits the domain of responsibility belonging to the unit and provides direction to all its reactions.
- A UCA cannot arbitrarily alter its own Purpose, as doing so would destroy its functional identity.
- A UCA must never be defined by its mechanisms. Querying a database or calling a language model are mechanisms, not cognitive purposes.
- **Purpose is the sole source of functional direction for a UCA and guides all its reactions throughout its existence.**
- **The Stimulus determines what the UCA reacts to; it does not redefine what the UCA pursues.**
- There is no second source of functional direction during an activation. An external entity may provide incoming information via a stimulus, but does not redefine through that information what the UCA pursues.

---

### 2.3 Disposition (D) and Primitive Capabilities

A UCA is a concrete unit constituted by concrete capabilities. A UCA must not be modeled as an abstraction that obscures the characteristics, constitution, or parameters of its capabilities.

#### Canonical Definition of Disposition

> **Disposition is the set of constitutive, parametric, and interactive conditions that determine how a UCA's Capabilities are constituted and predisposed to behave and interact through their mechanisms.**

Disposition answers:
> *Given this Mechanism, how is it constituted, tuned, and interconnected to behave?*

Disposition must be:
- **declarative**: structured and inspectable;
- **observable**: accessible for diagnosis and analysis;
- **interpretable**: self-describing for evolutionary observers without hardcoded knowledge;
- **validable**: formally verifiable against defined limits;
- **mutable**: adaptable within the valid space of its nature.

#### Canonical Structure of a Primitive Capability

A Primitive Capability is formally defined by:

```text
Primitive Capability
│
├── Mechanism
│   └── concrete procedure providing the capability
│
└── Disposition
    │
    ├── Properties
    │   ├── Property (Self-describing constitution and tuning)
    │   │   ├── Function
    │   │   ├── Nature
    │   │   └── Value
    │   └── ...
    │
    └── Interactions
        ├── Interaction (Reactive relationships between Capabilities)
        │   ├── Definition
        │   ├── Target
        │   ├── Signal
        │   └── When
        └── ...
```

In summary:
- **Mechanism** = how it works (what procedure provides the capability).
- **Configuration** = constitutive dimension of Properties (how it is constituted).
- **Parametrization** = tuning dimension of Properties (how it is adjusted).
- **Interactions** = how it reacts to other Capabilities.
- **Disposition** = `Properties` + `Interactions`.

#### Definition of Mechanism

> **Mechanism is the concrete procedure through which a Primitive Capability produces its functional capability.**

Mechanism describes the operational principle/procedure. It does not represent:
- its concrete configuration;
- its current parameters;
- a software class or transform;
- the current behavioral state.

Example:
For `SherpaRecognition`, the Mechanism is *online speech recognition via a transducer neural model executed by Sherpa-ONNX*. Software implementation may materialize that Mechanism via classes, transforms, providers, or libraries.

#### Anatomy of Properties

Each Property of a Capability is self-describing and comprises:

1. **Property.Function**:
   > **Function describes the functional role or behavioural effect of a Property within its Capability's Mechanism.**
   Allows external evolutionary observers to semantically interpret the property without hardcoded knowledge specific to the Capability, without conflating this operational role with the dedicated and invariant `Purpose` of a UCA.

2. **Property.Nature**:
   > **Nature describes the intrinsic characteristics of a Property and delimits the valid space within which it may be modified (Mutation Space).**
   Nature defines type, mutability, valid value domain, limits, and operational constraints. A modification is only valid if the new value satisfies the constraints established by its Nature:
   $$\text{satisfies}(v, n) \iff v \in \text{validDomain}(n)$$

3. **Property.Value**:
   > Represents the current concrete state of the property within the limits established by its Nature.

#### Anatomy of Interactions

Capabilities do not directly depend on each other nor are orchestrated by an imperative central processor or pipeline. They react via relationships declared in their Dispositions:

1. **Interaction.Definition**: Describes the functional purpose of the interaction.
2. **Interaction.Target**: Identifies which external element the interaction observes (`Capability.Property`).
3. **Interaction.Signal**: Describes the information received by the Capability as a consequence of the interaction to produce its reaction.
4. **Interaction.When**: Declarative condition that determines when a change in Target must trigger the reaction.

#### Canonical Example: SherpaRecognition

```text
Primitive Capability: SherpaRecognition
│
├── Mechanism
│   └── online speech recognition using
│       Sherpa-ONNX and a transducer neural model
│
└── Disposition
    │
    ├── Properties
    │   ├── modelDir: { Function: "ASR model directory", Nature: [path, readonly], Value: "models/asr-es" }
    │   ├── modelType: { Function: "Transducer architecture", Nature: ["zipformer2"], Value: "zipformer2" }
    │   ├── provider: { Function: "Compute backend", Nature: ["cpu", "cuda"], Value: "cpu" }
    │   ├── sampleRate: { Function: "Required sampling rate", Nature: [16000], Value: 16000 }
    │   ├── featureDim: { Function: "Acoustic feature dimension", Nature: [80], Value: 80 }
    │   ├── numThreads: { Function: "Parallel inference threads", Nature: [1..16], Value: 4 }
    │   ├── enableEndpoint: { Function: "Endpointing cutoff activation", Nature: [boolean], Value: true }
    │   ├── rule1MinTrailingSilence: { Function: "Trailing silence after long utterance", Nature: [0.5..5.0s], Value: 2.4 }
    │   ├── rule2MinTrailingSilence: { Function: "Trailing silence after short utterance", Nature: [0.1..2.0s], Value: 0.4 }
    │   ├── rule3MinUtteranceLength: { Function: "Maximum utterance duration", Nature: [5.0..60.0s], Value: 20.0 }
    │   ├── decodingMethod: { Function: "Hypothesis search algorithm", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
    │   └── hotwordsScore: { Function: "Contextual hotwords weighting", Nature: [0.0..10.0], Value: 2.5 }
    │
    └── Interactions
        └── onFloatAudioReceived:
            ├── Definition: "Process normalized samples for acoustic decoding"
            ├── Target: "PcmToFloat.output"
            ├── Signal: "Float32Array"
            └── When: "Target.hasSamples == true"
```

#### Two Depths of Change and Adaptation in Disposition

A Disposition can change at two depth levels:
- **Constitutive Change (`structural Disposition.Properties`)**: Modifies how the Capability is constituted (e.g., `provider: cpu ──► cuda`, or switching to another compatible neural model).
- **Parametric Change (`tuning Disposition.Properties`)**: Modifies how the Capability is tuned (e.g., `rule2MinTrailingSilence: 0.4 ──► 0.6`, or `hotwordsScore: 2.5 ──► 3.0`).

Both constitute legitimate modifications of `Disposition`.

#### Identity of a Primitive Capability

- **Mechanism-Based Identity**: The identity of a Primitive Capability is primarily determined by its `Mechanism`. A change in `Disposition` (whether constitutive, parametric, or interactive) modifies the constitution or tuning of the capability without automatically creating a new Capability.
- **Difference Between Mechanisms**: Only when the functional Mechanism changes must we evaluate whether we are dealing with another Capability.
  Example:
  ```text
  SherpaRecognition ≠ WhisperRecognition
  ```
  `SherpaRecognition` and `WhisperRecognition` are different primitive capabilities because they use distinct operational mechanisms and procedures (streaming neural transducer vs autoregressive encoder-decoder model), even if both belong to the `Speech Recognition` category.

#### Do Not Abstract the Disposition of a Primitive Capability

Any rule forcing concrete parameters of a Primitive Capability to be converted into abstract semantic properties is rejected (e.g., `hotwordsScore` belongs directly to `SherpaRecognition.disposition.Properties.hotwordsScore` and does not need to become `contextualBias`).

> **Atomicity Rule**: Do not abstract a Primitive Capability to the point of obscuring the properties and constitution that determine its behavior. If achieving a common abstraction requires hiding its mechanism, parameters, constraints, possibilities, or behavior, that abstraction must not replace the concrete Capability.

#### Composition of a UCA's Disposition

A concrete UCA is constituted by concrete capabilities. The effective Disposition of a UCA emerges from the direct composition of the Dispositions of the capabilities that constitute it:

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

These parameters are not redundantly duplicated in a second abstract structure. The UCA knows the concrete constitution of its capabilities and their respective Dispositions.

#### Harmonization of Dispositions Relative to Purpose

The Dispositions of the capabilities forming a UCA must not be understood as independent configurations. Their combination determines the emergent behavior of the UCA relative to its `Purpose`:

```text
Dispositions of Capabilities (Properties + Interactions)
                         │
                         ▼
                    harmonization
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

> **Harmonizing a UCA may require modifying both Properties (Configuration/Parametrization) and Interactions of the capabilities that constitute it.**

`Purpose` provides the overarching criterion against which capability harmonization is evaluated.

#### Architectural Consequence

Two UCAs may share the exact same `Purpose` and yet be functionally different due to their concrete constitution:

```text
Ear A
├── Purpose: continuously transcribe human speech
└── SherpaRecognition + Disposition A

Ear B
├── Purpose: continuously transcribe human speech
└── WhisperRecognition + Disposition B
```

Both are `Ear`. But they do not necessarily possess the same capabilities nor the same effective Disposition. Their behavior and effectiveness may differ.

---

### 2.4 Capabilities (C) as Functional Boundaries

`Capabilities` are the operational resources that a UCA may leverage to satisfy its Purpose and constitute the **functional boundaries** of the unit:

> **Capabilities constitute the functional boundaries of a UCA. A UCA can only pursue its Purpose within the limits of the Capabilities that constitute it.**

Formally, this constraint establishes that any operational behavior $b$ executed by $u$ requires resources belonging strictly to its constituted set of capabilities:

$$\forall b \in \text{Behaviors}(u), \quad \text{requiredCapabilities}(b) \subseteq C_u \quad \text{where } \text{hasCapabilities}(u, C_u)$$

The UCA cannot invent capabilities during its reaction that it does not possess.

They may include:
- concrete primitive capabilities (deterministic algorithms, transforms, parsers, ASR);
- storage engines, databases, and indexes;
- external tools, APIs, and drivers;
- predictive models, embeddings, and language models;
- other UCAs whose dedicated Purpose provides the functionality required by the Action.

A Capability is an instrument. A Capability is not automatically a UCA. Using another UCA as a Capability does not imply subordination, hierarchy, or unrestricted control — the used UCA retains its own dedicated Purpose and reacts according to its Capabilities and Disposition upon receiving incoming information.

---

### 2.5 Single Functional Direction and Demarcation Between Purpose, Stimulus, and Signal

Functional direction for any reaction proceeds invariably from the UCA's **Purpose**, not from externally imposed instructions or goals:

> **Purpose is the sole source of functional direction for a UCA.**
> **The Stimulus determines what the UCA reacts to, but does not redefine what the UCA pursues.**

A UCA possesses a dedicated Purpose that guides all its reactions. The incoming external signal (Stimulus) triggers the reaction and supplies required data, without needing to instruct the unit on what it must pursue. There is no dual teleology: no intermediate concept (such as `Goal`, `Objective`, or `Task`) modulates or redefines the direction established by the Purpose.

#### Ontological Demarcation: Purpose vs. Stimulus vs. Signal

To ensure maximum conceptual clarity and avoid ontological ambiguities, the universal UCA model strictly demarcates three concepts:

1. **Purpose**: functionally determines the UCA and guides all its reactions.
2. **Stimulus**: signal external to the UCA boundary whose reception triggers its reaction.
3. **Interaction.Signal**: internal signal through which its Capabilities interact and react.

```text
                 Purpose
                    │
                    │ determines
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

During the reaction:

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
│    │ guides                      │
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

Therefore:
- `Stimulus` operates at the **inter-UCA / exterior → UCA** level (external signal crossing the UCA boundary and triggering its reaction).
- `Interaction.Signal` operates at the **intra-UCA / Capability → Capability** level (internal signal between capabilities declared within the Disposition to coordinate the emergent reactive process).

---

### 2.6 Input Information and Context

Every reactive execution requires incoming information (the data, signals, or perturbations upon which mechanisms operate).

A Stimulus can carry data or information needed for Capabilities to react. However:
- `Stimulus` **is not** a generic universal `Context` container.
- Not all UCAs require context. For example, a unit such as `Ear` can react directly to an incoming audio signal without requiring a formal `Context` container.
- Under the Minimality Principle, `Context` is not a universal primitive of the UCA Core. A Cognitive Architecture (§4) can construct, store, or supply context when required by the unit's specialization, without imposing it as a universal contract for every UCA.

No predefined universal tuple structure exists in the Core such as `Stimulus = (...)`, unless all its elements were demonstrably necessary for every possible UCA.

```text
Stimulus ≠ Context
Stimulus ≠ Purpose
Stimulus ≠ Goal
Stimulus ≠ Action
Stimulus ≠ Outcome
```

---

### 2.7 Stimulus (S) and Impulse

The canonical definition of Stimulus in the UCA Core is:

> **Stimulus is a signal external to the UCA whose reception triggers a reaction of the unit.**

Normative characteristics of the Stimulus:
- **is external** relative to the boundary of the receiving UCA;
- **arrives at an already conceived UCA**;
- **triggers a reactive reaction** in that UCA;
- **can carry information** necessary for that reaction;
- **does not contain or redefine Purpose**;
- **does not prescribe an Action**;
- **does not determine an Outcome**;
- **does not constitute a goal or objective**;
- **does not need to possess cognitive semantics**;
- **does not require a fixed universal structure**.

Formally, $s \in \mathbb{S}$ and:
$$\text{triggers}(s, u, a)$$
strictly expresses that reception of Stimulus $s$ by UCA $u$ triggers a reactive activation of $u$ materialized via $a$.

#### Scope of "External" and Local Reactivity

The term "external" is strictly interpreted relative to the **functional boundary of the receiving UCA**, not necessarily relative to the entire system.

Therefore, an external signal may originate from:
- a human user (`user ──► Ear`);
- a physical or environmental sensor (`sensor ──► UCA`);
- a software timer or runtime (`timer/runtime ──► UCA`);
- another UCA within the system (`UCA A ──► UCA B`);
- internal homeostatic monitors or system events.

A signal originating within the same system is external to `UCA B` as soon as it crosses its functional boundary.

#### Decoupling Between Stimulus and Impulse

It is essential to keep the cognitive/functional concept strictly separated from the infrastructure transport mechanism:

```text
Impulse  = optional transport envelope (infrastructure)
Stimulus = external signal to which the UCA reacts (UCA activation)
```

```text
Runtime / Infrastructure
       │
       │ transports
       ▼
    Impulse (optional)
       │
       │ delivers
       ▼
    Stimulus: external signal
       │
       │ triggers
       ▼
      UCA
```

The Stimulus ($s \in \mathbb{S}$) is the external signal to which the unit reacts. The `Impulse` is an optional infrastructure envelope used by Runtime layers (§5) to carry that signal and operational metadata. A compliant UCA does not mandatory require receiving an `Impulse`; the runtime may deliver the Stimulus via direct function calls, streaming sockets, events, or any other technical mechanism.

---

### 2.8 Activation Domain and Signal Compatibility

A UCA reacts to Stimuli that cross its functional boundary and interact with its constituent Capabilities.

The compatibility and relevance of a signal regarding a UCA does not require every unit to evaluate a universal computable semantic predicate in every activation cycle. In sensory or streaming units (such as `Ear`), compatibility is determined physically by the interface of its receptive Capabilities (e.g., a raw audio stream compatible with the capture mechanism). In cognitive units, it may be resolved through typed subscriptions, interface contracts, or runtime discrimination (see §9.1).

The emitting entity does not dictate the receiver's reaction; it exposes or transmits a signal, and the receiving UCA reacts according to what it already is: its own Purpose, Capabilities, and Disposition.

---

### 2.9 Action (A) and Reactive Process

> **The Process of a UCA is the emergent dynamic produced by reactive interactions between its Capabilities according to their Dispositions and guided by its Purpose.**

```text
Capabilities ──(according to Dispositions)──► Reactive Interactions ──► Emergent Process ──► Outcome(s)
```

The effective execution order and flow emerge from the relationships declared in `Interactions`. There is no imperative central coordinator or processor executing the capabilities sequentially.

**Relationship between Action and Reactive Process**:
The `Reactive Process` captures the internal emergent dynamic occurring across Capabilities. The `Action` ($a \in \mathbb{A}$) represents the effective operational execution that realizes and materializes that process in a given activation to yield observable consequences ($	ext{produces}(a, o)$). Both concepts are coherent yet reflect complementary perspectives: internal relational dynamics (Process) and external operational manifestation (Action). See §9.4.

An Action does not necessarily require language model inference. It can be a deterministic computation, a data retrieval, a structural transformation, or a capability invocation.

---

### 2.10 Outcome (O)

`Outcome` represents **what the Action actually produced**:

$$\text{produces}(a, o) \quad \text{where } a \in \mathbb{A}, o \in \mathbb{O}$$

Shorthand notation $a \to o$ indicates strictly this production relation.

Ontological distinction:
```text
STIMULUS (S): External signal crossing the UCA boundary that triggers the reaction.
OUTCOME (O):  Observable consequence produced by the Action executed by the UCA.
```

The Outcome strictly belongs to the executing unit.

#### Partial Outcomes and Streaming

A UCA is not required to produce a single final Outcome. An activation may emit multiple partial Outcomes continuously (streaming):

```text
Stimulus: s
   │
   ▼ triggers
  UCA: u
   │
   ▼ produces (temporal stream)
o₀
o₁
o₂
...
```

In continuous flow systems (such as audio or real-time processing), each partial Outcome reflects a discrete chunk of output generated under the UCA's Purpose during its Action.

Formally, the emission sequence establishes a strictly chronological temporal precedence:
$$\text{precedes}(o_0, o_1) \land \text{precedes}(o_1, o_2) \land \dots$$

**Temporal Neutrality and Independence**:
The relation $\text{precedes}(o_0, o_1)$ strictly and solely asserts that $o_0$ occurred chronologically before $o_1$. It **MUST NOT** be interpreted as an evaluative, superiority, or improvement relation ($o_2 > o_1$ is invalid). An Outcome has no intrinsic quality; any evaluation of its accuracy or utility requires an explicit evaluation under defined criteria (§4.4).

---

### 2.11 Local Reactivity

> **No activation without a Stimulus.**
> **A UCA reacts strictly upon the reception of a Stimulus external to its own functional boundary.**

A UCA never executes spontaneously or through autonomous volition. It acts strictly in response to a Stimulus crossing its functional boundary.

The ultimate origin of that Stimulus — human, sensory, timed, homeostatic, or from another UCA — is a matter of Cognitive Architecture (§4), not UCA Core. Every UCA remains locally reactive.

---

### 2.12 UCA Boundary

**On "Artificial"**

The term `Artificial` describes the nature of the unit as a constructed, bounded functional primitive designed in software or hardware:
- **Constructed functional primitive**: The unit is a deliberately designed functional building block, bounded by a dedicated Purpose and a finite set of Capabilities.
- **Does not imply Artificial General Intelligence or mandatory LLMs**: The term neither assumes nor requires the use of language models, deep neural networks, or machine learning algorithms. A UCA may be implemented using deterministic logic, classical algorithms, heuristics, or statistical models.
- **Does not imply self-execution**: That the unit is artificial does not mean it is a self-executing agent endowed with its own volition; its execution remains strictly reactive upon the arrival of an external Stimulus.

**On "Cognitive"**

The term `Cognitive` does not assert that an individual UCA:
- thinks or understands;
- is conscious or intelligent;
- possesses independent cognition.

It indicates that the abstraction is designed to compose functional responsibilities within cognitive systems. Cognitive behaviour may be an emergent property of a composite UCA system — not an intrinsic property of any individual unit.

---

### 2.13 Summary

The minimal complete model of an individual UCA:

```text
Structure:   u = (p, d, C) ∈ ℙ × 𝔻 × 𝒫(ℂ)  (where p ∈ ℙ functionally determines what u is and pursues)
Stimulus:    s ∈ 𝕊                          (signal external to the boundary of u triggering its reaction)
Reaction:    (u, s) → a → o                 (shorthand for: triggers(s, u, a) ∧ produces(a, o))
```

---

## 3. UCA Composition

This section defines how individual UCAs can relate to and combine with each other to form larger systems. Composition is the mechanism through which cognitive complexity is built outside the Core primitive.

> **Recursive composition of UCAs is Capability usage, not centralized orchestration.**

A UCA only needs to know the Capabilities available to it. It does not need to know the global UCA topology of the system. Composition remains local and recursive.

---

### 3.1 UCA as a Capability

A UCA may use another UCA as one of its Capabilities when that unit fulfills a dedicated and differentiated Purpose. There is no structural difference between using a technical Capability and using a UCA as a Capability, except that the latter retains its own dedicated Purpose and interacts according to its Capabilities and Disposition:

```text
UCA A
────────────────────
Purpose A
Disposition A

Capabilities
├── algorithm
├── tool
└── UCA B
      │
      ├── Purpose B      ← UCA B's own dedicated Purpose
      ├── Disposition B
      └── Capabilities B
```

Using UCA B as a Capability means:
- UCA A requires the reactive result of UCA B to perform its Action.
- UCA A does not coordinate, orchestrate, or control UCA B.
- UCA A does not instruct UCA B nor impose a purpose or goal upon it: UCA A exposes or emits a signal that crosses the boundary of UCA B as an external Stimulus, and UCA B reacts according to its own Purpose B, Capabilities B, and Disposition B.
- There is no Purpose transfer ($p_A \not\to B$) nor creation of inter-unit goals or commands.

---

### 3.2 Terminal Capabilities

> A Capability becomes another UCA only when there is a dedicated, functionally differentiated Purpose.
> When differentiated purposes no longer emerge and only mechanisms remain, terminal capabilities have been reached.

If a component executes a mechanical or algorithmic function without a stable, independent Purpose, it remains a terminal capability and should not be modeled as a UCA.

---

### 3.3 Outcome → Stimulus Relationships

It is essential to distinguish ontologically between the Outcome produced by a UCA and the Stimulus received by another:
- **$\text{Outcome}_A$**: Strictly belongs to $\text{UCA}_A$ and is the observable consequence produced by its Action.
- **$\text{Stimulus}_B$**: Belongs to the activation event of $\text{UCA}_B$ as an external signal crossing its functional boundary.

No automatic ontological identity exists ($\text{Outcome}_A \neq \text{Stimulus}_B$). Although they may carry the same material data, they represent distinct architectural concepts pertaining to different operational boundaries.

The relationship between them is one of propagation, exposure, or transport through the environment or runtime:

```text
UCA A
   │
   ▼
Outcome A
   │
   │ propagation / transport / exposure
   ▼
Stimulus B
   │
   ▼
UCA B
   │
   │ reacts according to Purpose B
   ▼
Outcome B
```

Complex systemic behaviour unfolds through chains of propagation and reactive interaction between specialized units, without requiring any central coordinator.

---

### 3.4 Reactive Succession and Activation Chains

Through Outcome → Stimulus relationships, UCAs form reactive activation chains:

```text
o_i ──triggers──► s_j ──triggers──► u_j ──produces──► a_j ──produces──► o_j ──triggers──► s_k ──triggers──► u_k ── ...
```

This notation describes a verified relational pattern of architectural behavior: the Outcome of one unit triggers the activation of the next unit in chronological sequence ($\text{precedes}(o_i, o_j)$). This relational pattern must not be conflated with a metaphysical causal theory: UCA asserts reactivity, propagation, and production, leaving external or universal causality as an architectural design choice (§4.9).

---

### 3.5 Recursive Use of Capabilities

A UCA may expose another UCA as one of its Capabilities. That UCA may recursively use its own Capabilities to pursue its Purpose. This recursive relationship does not imply centralized coordination, hierarchy, or unrestricted control.

```text
UCA A (Purpose A)
├── Capability X
└── UCA B (Purpose B)
      ├── Capability Y
      └── UCA C (Purpose C)
            └── Capability Z
```

During an activation:

```text
Stimulus A
    ↓
  UCA A
    ↓
  Action A requires UCA B
    │
    └── Stimulus B
            ↓
          UCA B
            ↓
          Action B requires UCA C
            │
            └── Stimulus C
                    ↓
                  UCA C → Action C → Outcome C
                    ↓
          Outcome C available to Action B
            ↓
          Outcome B
    ↓
  Outcome B available to Action A
    ↓
  Outcome A
```

This means:
- A *requires* B to perform its Action.
- B *requires* C to perform its Action.
- A does not coordinate B. A does not know or control C.
- Each unit remains bounded by its own Purpose.

---

## 4. Cognitive Architecture

Cognitive Architecture defines how multiple UCAs are organized, connected, and governed within an overall system.

Cognitive Architecture is distinct from the UCA primitive. It organizes and connects UCA primitives; it does not alter what a UCA is. The normative definition of a UCA belongs strictly to the UCA Core.

---

### 4.1 Evaluation under Explicit Criteria

In cognitive architectures, the evaluation of an Outcome represents the systematic analysis of its consequences against explicit criteria (e.g., accuracy, latency, coherence, stability, or error rate).

> The Outcome belongs to whoever executes.
> Evaluation belongs to whoever evaluates or formulated the criteria.

The executing UCA produces the Outcome as the observable consequence of its Action. It is not required to evaluate itself to rule on the quality or utility of its result.

A Cognitive Architecture may define specialized UCAs whose dedicated Purpose is to evaluate Outcomes against explicit criteria:

```text
Originating Entity (UCA₁)
        │
        ▼
Executor (UCA₂)
        │
        └── Outcome
                │
                ▼
Evaluator (UCA₃)
                │
                └── Evaluation under Explicit Criteria
```

Evaluation is constructed purely through composition. No intrinsic evaluation mechanism is required within the UCA Core.

---

### 4.2 Perception and Observation

Perception and observation are **not** universal phases of a UCA's activation cycle. They are cognitive responsibilities that can be modeled through composition.

A UCA whose Purpose requires perceiving information from the environment performs that work through its Action:

```text
environment ──► s_B ──triggers──► u_B (Purpose: perceive)
                                    │
                                    └── produces(u_B, a_B): perceive
                                            │
                                            └── produces(a_B, o_B): perceived representation
```

Observation follows the same pattern:

```text
s_C ──triggers──► u_C (Purpose: observe and interpret)
                   │
                   └── produces(u_C, a_C): observe
                           │
                           └── produces(a_C, o_C): structured observation
```

No special `Observer` exists in the UCA structure. Each of these units is simply $u = (p, d, C) \in \mathbb{U}$ with a Purpose that justifies its Action.

---

### 4.3 Evolution and Atomic Mutation of Disposition

The Core defines that Disposition conditions the behavior and interactions of a unit.

> **Evolution is the cumulative modification of a UCA's Disposition within the limits defined by its Purpose, its Capabilities, and the Nature of its Properties and Interactions.**

Ontological distinction:
```text
Conception: Determines what UCA exists (identity, capabilities, and initial disposition).
Evolution:  Modifies how that same UCA behaves and interacts within its boundaries.
```

```text
Conception
     │
     ▼
u₀ (Purpose p, Capabilities C, Disposition d₀)
     │
     │ evidence e₁
     ▼
Mutation μ₁ (atomic)
     │
     ▼ difference(d₀, d₁)
Disposition d₁
     │
     │ evidence e₂
     ▼
Mutation μ₂ (atomic)
     │
     ▼ difference(d₁, d₂)
Disposition d₂
     │
    ...
```

#### Principle of Atomic Mutation

> **The minimal unit of Evolution is an atomic Mutation of the Disposition.**

A Mutation ($\mu \in \mathbb{M}\text{ut}$) produces an alteration $\Delta D = \text{difference}(D_0, D_1)$ that must be, whenever possible:
- **small and identifiable**: focused on a concrete Property or Interaction;
- **bounded**: circumscribed to the limits of Nature;
- **validable**: formally verifiable prior to application ($\text{satisfies}(\text{val}, n)$);
- **measurable**: empirically observable in subsequent Outcomes;
- **reversible**: capable of being restored if evidence is unfavorable;
- **attributable**: traceable to the evidence that motivated it.

#### Mutation Types: Parametric and Structural

1. **Parametric Mutation**: Tuning the state or value of a Property (`Property.Value`), keeping Purpose, Nature, and Interactions constant:
   ```text
   SherpaRecognition.hotwordsScore: 2.5 ──► 3.0   (where satisfies(3.0, Nature))
   ```
2. **Structural Mutation**: Modifying an Interaction (`Disposition.Interactions`) to alter the emergent reactive flow without modifying Capability source code:
   ```text
   t₀: reactsTo(Capability_B, Capability_A)
   t₁: reactsTo(Capability_A, Capability_C) ∧ reactsTo(Capability_B, Capability_A)
   ```

#### Inviolable Boundaries of Evolution

Evolution operates under three independent invariant predicates, ensuring that mutation cannot violate the identity, functional space, or nature of properties:

$$\forall \mu \in \mathbb{M}\text{ut} \text{ applied to } u = (p, d, C):$$

1. **Purpose Preservation (Identity Invariant)**:
   $$\text{preservesPurpose}(u, \mu)$$
   The Purpose is the identity invariant: it cannot mutate.

2. **Capability Boundaries (Functional Domain)**:
   $$\text{withinCapabilities}(u, \mu)$$
   Capabilities define the operational boundaries: unconstituted capabilities cannot be dynamically acquired by mutation.

3. **Satisfaction of Nature (Domain of Properties and Interactions)**:
   $$\forall \text{val}' \in \mu, \quad \text{satisfies}(\text{val}', n_{\text{target}})$$
   Nature delimits the valid space of each property or interaction.

---

### 4.4 Evolutionary Observation, Local Optimization, and Falsifiability

A Cognitive Architecture may define a specialized UCA (e.g., `Cingulate UCA`) whose Purpose is to evaluate evidence and propose atomic mutations:

```text
Outcome(s) ──► Evidence ──► Cingulate UCA ──► Mutation Inference ──► Nature Validation ──► ΔDisposition
```

Where $\Delta\text{Disposition} = \text{difference}(D_{\text{before}}, D_{\text{after}})$ represents strictly state difference without intrinsic qualitative value.

#### Principles of Evolutionary Observation

1. **Declarative Interpretation without Hardcoded Coupling**: The evolutionary observer inspects `Property.Function`, `Property.Nature`, `Property.Value`, and `Interactions` (Definition, Target, Signal, When), reasoning on adaptation without requiring code specific to each Capability nor confusing parametric functions with the dedicated Purpose of the UCA.
2. **Strict Validation Against Nature**: No mutation may be applied if it violates the declared `Nature` of the property ($\neg\text{satisfies}(\text{val}', n)$). Evolutionary safety stems from declarative constitution itself.
3. **Out of the Critical Execution Path**: The evolutionary observer operates asynchronously, selectively, and contextually on accumulated evidence. It is not a synchronous arbiter or bottleneck for every reaction.
4. **Bounded Local Optimization**: The optimization context remains small and localized:
   ```text
   UCA Purpose + Capability Mechanism + Property Function + Property Nature + Value + Evidence ──► Optimization Context
   ```
5. **Experimental Falsifiability**: Every atomic mutation generates an empirically testable hypothesis evaluated against Outcomes under explicit criteria.

   Outcomes have no universal intrinsic order ($>$ or $<$) or equality ($=$) signifying quality or progress. Evaluation is contextual and criterion-dependent:
   - **Improvement under Criterion**: Evidence supports improvement under an explicit evaluation criterion $K$:
     $$\text{evaluatesHigher}(o_1, o_0, K)$$
   - **No Relevant Effect under Criterion**: Evidence indicates that the mutation produced equivalent results under criterion $K$:
     $$\text{evaluatesEquivalent}(o_1, o_0, K)$$
   - **Degradation under Criterion**: Evidence supports degradation under criterion $K$, triggering rollback:
     $$\text{evaluatesLower}(o_1, o_0, K) \implies \text{rollback}(\mu)$$

   Two structurally different Outcomes may be equivalent relative to a criterion, and two identical outcomes may have been produced under distinct conditions. Criteria must be explicit.

---

### 4.5 Coordination as Capability Usage

Coordination is not a privileged UCA role. There is no Coordinator or Dispatcher predefined in the UCA model.

If a system identifies a real dedicated Purpose that requires integrating Outcomes from multiple UCAs — for example, synthesizing partial results or sequencing activations based on context — that Purpose may justify a UCA. But the UCA is not coordinating by nature: it is a unit whose Action uses other UCAs as Capabilities:

```text
UCA A
────────────────────
Purpose: synthesize results from available knowledge sources

Capabilities
├── UCA B (Purpose B)
├── UCA C (Purpose C)
└── UCA D (Purpose D)
```

UCA A performs its Action by interacting with B, C, and D as Capabilities. It does not orchestrate them. Each of B, C, and D retains its own dedicated Purpose and reacts to incoming information according to its Capabilities and Disposition.

---

### 4.6 Identity

A cognitive system **may** define a UCA whose Purpose is to maintain and articulate a coherent representation of the system's identity, boundaries, and role.

Identity is not a foundational requirement of every UCA. Domain-specific or headless systems can operate without an explicit Identity UCA.

---

### 4.7 Memory Stores

A cognitive system **may** define UCAs whose Purpose is the curation, indexing, and contextual retrieval of acquired knowledge.

---

### 4.8 State Strategies

A Cognitive Architecture may choose how state is organized:
- **Distributed State**: emerges from active UCAs, their Dispositions, and active Contexts.
- **Synthesized Context**: constructed on demand from unit Outcomes.
- **Global State / Blackboard**: shared state tree for global operational variables.

UCA does not prescribe any particular state strategy.

---

### 4.9 Sources of Causality

Although every UCA is locally reactive regarding its own functional boundary, a Cognitive Architecture may originate signals external to that boundary from:
- human or machine interactions from the environment;
- sensory and physical capture events;
- runtime timers or scheduled events;
- internal homeostatic monitors or background loops;
- other UCAs in the system connected in pipelines or networks;
- infrastructure initialization events.

The universal condition is solely that the Stimulus originates outside the receiving UCA's boundary; signal provenance relative to the entire system is an architectural design choice, not a UCA Core requirement.

---

## 5. Runtime (Infrastructure)

The Runtime supplies technical execution and communication infrastructure. It is completely decoupled from cognitive definitions.

---

### 5.1 Transport Mechanisms

Transfer of a Stimulus or an Outcome may be implemented via:
- direct asynchronous function calls;
- message passing under the actor model;
- event buses or publish-subscribe topics;
- persistent message queues;
- streaming sockets or HTTP/gRPC transports;
- shared memory structures.

Transport technology does not affect UCA compliance.

---

### 5.2 The Impulse: Transport Envelope

An `Impulse` is an optional infrastructure envelope used by transport layers to route activations and operational metadata:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── payload  (Stimulus | Outcome | metadata)
```

> **The Impulse is infrastructure, not cognition.**

The Stimulus is a cognitive abstraction (incoming information or perturbation to which the unit reacts). The Impulse is a runtime representation of that concept. A UCA implementation may operate with or without an explicit Impulse abstraction.

---

### 5.3 Event Bus

An event bus is an optional runtime mechanism that may facilitate decoupling, asynchronous dispatch, and fan-out between UCAs.

> An event-driven runtime may support decoupling, concurrency, and fault isolation according to its implementation.

An Event Bus is not required for UCA compliance. The UCA contract makes no assumptions about how Stimuli and Outcomes are transmitted.

---

### 5.4 Traceability and Correlation

Runtime implementations typically propagate transaction identifiers (such as `traceId` or `parentImpulseId`) across asynchronous boundaries to enable auditing and debugging.

Traceability is a runtime responsibility and does not affect the semantic identity of a UCA.

---

### 5.5 Concurrency

Management of execution queues, threads, actor schedulers, and parallel activations is a runtime responsibility. The Core makes no assumptions about execution concurrency.

---

### 5.6 Fault Isolation

Handling timeouts, retries, and containing failures without affecting the global system is a runtime responsibility. Fault isolation strategies do not affect UCA compliance.

---

## 6. Experimental Hypotheses

The concepts in this section represent exploratory research hypotheses and open questions. They do not constitute established facts or normative UCA requirements.

---

### 6.1 Emergent Cognition

It is hypothesized that complex cognitive behaviour does not need to reside centrally in a single monolithic model. Useful cognitive capabilities **may emerge** from purposeful, contextual interaction among specialized units.

This remains a hypothesis. It is not claimed that cognitive behaviour necessarily emerges from any collection of UCAs, nor that UCA is a necessary or sufficient condition for cognition.

---

### 6.2 Emergent Proactivity

> System-level proactive behaviour may emerge from chains of reactive interactions among UCAs.

Although each individual UCA is locally reactive, a collection of interacting UCAs may exhibit behaviour that appears proactive to an external observer. This is a hypothesis to be verified empirically.

---

### 6.3 Distributed Adaptation

> Adaptation may emerge from interactions among UCAs rather than being an intrinsic phase of every UCA's lifecycle.

The relational pattern:

```text
oᵢ ──triggers──► Stimulus ──triggers──► uⱼ ──produces──► aⱼ ──produces──► oⱼ ──drives──► Δdᵢ
```

describes a relational pattern of architectural behaviour: the Outcome of one UCA stimulates another, whose Action results in a Disposition change ($\Delta d_i = \text{difference}(d_{i,0}, d_{i,1})$) in the first. This is a hypothesis about what is achievable through composition.

---

### 6.4 Structural Learning Through Interaction

It is hypothesized that systems can achieve adaptive behavioral improvement without retraining model weights or modifying source code, through dynamic adjustment of Dispositions in response to environmental feedback.

---

### 6.5 Relational Plasticity (Synapses)

Current adaptation focuses on intra-unit Disposition tuning. An active research question explores inter-unit relational plasticity: adjustment of routing weights, affinity, or communication topology between units:

```text
INTRA-UCA:  Δd(uᵢ)
INTER-UCA:  ΔRelationship(uᵢ, uⱼ)
```

Where $\Delta$ strictly denotes the change or difference between identifiable states ($\text{difference}(\text{state}_0, \text{state}_1)$) without presuming improvement.

A `Synapse` abstraction would represent a persistent property of the relationship between two UCAs that cannot be adequately modeled as the state, Disposition, or Capability of either unit individually.

Whether such an abstraction is necessary remains an open question. Synapse is not part of the normative UCA Core.

---

### 6.6 The Falsifiable Hypothesis

> **Can cognitive behaviour emerge from the interaction of purpose-bounded UCAs, while each individual unit remains structurally limited to $u = (p, d, C)$ and behaviorally limited to $(u, s) \to a \to o$?**

This is the central experimental question posed by UCA. It is falsifiable:
- A system satisfying all UCA conformance criteria that produces no recognizable cognitive behaviour constitutes evidence against the hypothesis.
- A system demonstrating cognitive behaviour while each unit satisfies only the minimal contract constitutes positive evidence.

---

### 6.7 Empirical Validation Criteria

To empirically validate the UCA model, an implementation must demonstrate that a collection of units is capable of:
1. Receiving a stimulus;
2. Reacting according to their specialized purposes without a monolithic central controller;
3. Collaborating through exchange of Stimuli and Outcomes;
4. Generating an action toward the external environment;
5. Receiving feedback regarding that action;
6. Using that evidence to diagnose deviations;
7. Adapting one or more Dispositions;
8. Reacting correctly in a subsequent equivalent scenario;
9. Achieving this **without modifying source code**;
10. Achieving this **without retraining model weights**;
11. Achieving this **without ad-hoc hardcoded rules** designed for the test case.

---

## 7. Examples

The examples in this section are non-normative. They illustrate how cognitive responsibilities can be modeled through UCA composition without adding new primitives to the Core.

### 7.1 Deterministic and Streaming Atomic UCA (Ear UCA)

A UCA may be completely deterministic and require no inference or language models to fulfill its Purpose. `Ear UCA` illustrates how a concrete UCA is constituted through a composition of concrete primitive capabilities with their respective harmonized Dispositions:

```text
EAR UCA

Purpose
│
└── Continuously transcribe human speech.

Capabilities (Concrete Primitive Capabilities and their Dispositions)
│
├── EchoCancellation
│   ├── Mechanism: Adaptive acoustic echo reduction and cancellation
│   └── Disposition:
│       ├── Properties:
│       │   ├── sampleRate: { Function: "Acoustic sampling rate", Nature: [16000], Value: 16000 }
│       │   ├── suppressionGain: { Function: "Static echo suppression gain", Nature: [0.0..1.0], Value: 0.0 }
│       │   ├── bargeInThresholdRms: { Function: "RMS threshold for voice barge-in", Nature: [50..1000], Value: 160 }
│       │   ├── echoLeakRatio: { Function: "Acoustic leak tolerance ratio", Nature: [0.0..1.0], Value: 0.25 }
│       │   ├── maxThresholdRms: { Function: "Maximum acoustic RMS threshold", Nature: [100..2000], Value: 450 }
│       │   ├── decayMs: { Function: "Suppression decay time", Nature: [50..2000ms], Value: 350 }
│       │   └── bargeInHoldMs: { Function: "Barge-in state hold time", Nature: [50..2000ms], Value: 400 }
│       └── Interactions:
│           └── onAudioInput: { Definition: "Suppress echo from raw audio signal", Target: "AudioInput.stream", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── AudioFraming
│   ├── Mechanism: Temporal signal framing into discrete chunks
│   └── Disposition:
│       ├── Properties:
│       │   ├── sampleRate: { Function: "Sampling rate", Nature: [16000], Value: 16000 }
│       │   ├── frameSize: { Function: "Discrete frame size", Nature: [160..16000], Value: 1600 }
│       │   └── emitPartialOnFlush: { Function: "Emit partial frame on buffer flush", Nature: [boolean], Value: false }
│       └── Interactions:
│           └── onCleanAudio: { Definition: "Frame suppressed audio", Target: "EchoCancellation.output", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── PcmToFloat
│   ├── Mechanism: Normalization and conversion of Int16 integers to Float32 floating-point
│   └── Disposition:
│       ├── Properties:
│       │   ├── inputType: { Function: "Input numeric type", Nature: ["Int16"], Value: "Int16" }
│       │   ├── outputType: { Function: "Output numeric type", Nature: ["Float32"], Value: "Float32" }
│       │   └── scale: { Function: "Normalization divisor factor", Nature: [32768.0], Value: 32768.0 }
│       └── Interactions:
│           └── onAudioFrame: { Definition: "Normalize audio frame to floating point", Target: "AudioFraming.output", Signal: "Int16Array", When: "Target.frameReady == true" }
│
├── SherpaRecognition
│   ├── Mechanism: Online speech recognition via transducer neural model (Sherpa-ONNX)
│   └── Disposition:
│       ├── Properties:
│       │   ├── modelDir: { Function: "Neural model directory", Nature: [path, readonly], Value: "models/asr-es" }
│       │   ├── modelType: { Function: "Transducer architecture", Nature: ["zipformer2"], Value: "zipformer2" }
│       │   ├── provider: { Function: "Compute backend", Nature: ["cpu", "cuda"], Value: "cpu" }
│       │   ├── sampleRate: { Function: "Acoustic sampling rate", Nature: [16000], Value: 16000 }
│       │   ├── featureDim: { Function: "Acoustic feature dimension", Nature: [80], Value: 80 }
│       │   ├── numThreads: { Function: "Parallel inference threads", Nature: [1..16], Value: 4 }
│       │   ├── enableEndpoint: { Function: "Endpointing cutoff detection", Nature: [boolean], Value: true }
│       │   ├── rule1MinTrailingSilence: { Function: "Silence duration to segment long utterance", Nature: [0.5..5.0s], Value: 2.4 }
│       │   ├── rule2MinTrailingSilence: { Function: "Silence duration to segment short utterance", Nature: [0.1..2.0s], Value: 0.4 }
│       │   ├── rule3MinUtteranceLength: { Function: "Maximum utterance duration", Nature: [5.0..60.0s], Value: 20.0 }
│       │   ├── decodingMethod: { Function: "Decoding method", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
│       │   └── hotwordsScore: { Function: "Contextual hotwords weighting", Nature: [0.0..10.0], Value: 2.5 }
│       └── Interactions:
│           └── onFloatSamples: { Definition: "Decode speech from normalized samples", Target: "PcmToFloat.output", Signal: "Float32Array", When: "Target.hasSamples == true" }
│
├── EchoTextFilter
│   ├── Mechanism: Lexical filtering and attenuation of autogenerated transcripts
│   └── Disposition:
│       ├── Properties:
│       │   ├── caseSensitive: { Function: "Case sensitivity distinction", Nature: [boolean], Value: false }
│       │   ├── decayMs: { Function: "Lexical attenuation time window", Nature: [500..10000ms], Value: 2500 }
│       │   ├── mismatchThreshold: { Function: "Lexical mismatch tolerance", Nature: [0..5], Value: 1 }
│       │   └── minWordLength: { Function: "Minimum word length to evaluate", Nature: [1..10], Value: 3 }
│       └── Interactions:
│           └── onRawTranscript: { Definition: "Filter textual echoes from raw transcripts", Target: "SherpaRecognition.output", Signal: "RawTranscript", When: "Target.textAvailable == true" }
│
└── EarCoherence
    ├── Mechanism: Structural normalization and temporal continuity preservation of Chunks
    └── Disposition:
        ├── Properties:
        │   └── outputSchema: { Function: "Canonical output schema", Nature: ["Chunk"], Value: "Chunk" }
        └── Interactions:
            └── onFilteredTranscript: { Definition: "Structure final coherent chunk", Target: "EchoTextFilter.output", Signal: "FilteredTranscript", When: "Target.isValid == true" }

Outcome (Continuous Stream)
│
└── Chunk { startAt, endAt, text }
```

Emergent reactive interaction flow:

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

#### Harmonization and Reactivity in Ear: Process Representation and Reconfigurability

The fundamental purpose of this example is to illustrate **how any traditional or sequential process (such as an audio processing and transcription pipeline) can be formally represented using UCA** without requiring central orchestrators or rigid, hardcoded pipelines in code.

Instead of an imperative sequential flow fixed in code, the process emerges from the reactive relationships declared in the Dispositions of the Capabilities (`Interactions` and `Properties`):
- `AudioFraming.frameSize: 1600` (audio chunk frame size).
- `EchoCancellation.decayMs: 350` and `bargeInHoldMs: 400` (echo threshold and cutoff management).
- `SherpaRecognition.rule2MinTrailingSilence: 0.4` (seconds of trailing silence for segment closure).
- `EchoTextFilter.decayMs: 2500` (temporal window for text echo attenuation).

**Reconfigurability of Process Execution Order**:
Because the flow is not frozen in application control flow but in declarative `Interactions` within Dispositions, **the execution order of the pipeline can be redefined or restructured dynamically whenever relevant** (for example, via structural mutation in Evolution, §4.3). If empirical evidence demonstrates that performing echo cancellation after framing or inserting an acoustic pre-filtering stage optimizes transcription performance, the Capabilities' Dispositions can reconfigure their Targets and Signals to alter the emergent reactive trajectory without changing capability source code or UCA identity:
```text
t₀ (initial order):     AudioInput ──► EchoCancellation ──► AudioFraming ──► PcmToFloat ──► ...
t₁ (redefined order):   AudioInput ──► AudioFraming ──► EchoCancellation ──► PcmToFloat ──► ...
```

None of these primitive capabilities becomes an independent UCA as long as it does not possess a dedicated, distinct Purpose. They remain primitive capabilities of Ear.

Example of emitted partial Outcomes (emission sequence with temporal relation $\text{precedes}(o_0, o_1)$ and $\text{precedes}(o_1, o_2)$):
```text
o₀ = { startAt: 0,   endAt: 400,  text: "I think" }
o₁ = { startAt: 400, endAt: 850,  text: "we should change" }
o₂ = { startAt: 850, endAt: 1200, text: "this architecture" }
```

**What Ear does NOT determine:**
- Does not detect silence (silence is an observation/perception derived from not receiving new chunks within a time interval).
- Does not determine turn completion (`userFinishedTurn`).
- Does not interpret intention, meaning, or relevance.

Ear strictly asserts that those voices were transcribed during those time intervals.

---

### 7.2 Perception Through Composition

Perception may be the Action of a UCA whose Purpose requires perceiving and interpreting information from the environment:

```text
u_A (Purpose: act)
 │
 └── produces(u_A, a_A) ──produces──► o_A ──emits──► environment ──triggers──► s_B
                                                                             │
                                                                             ▼
                                                                 u_B (Purpose: perceive)
                                                                             │
                                                                             └── produces(u_B, a_B): perceive
                                                                                     │
                                                                                     └── produces(a_B, o_B): perceived representation
```

`u_B` is structurally identical to any other UCA: $u_B = (p_B, d_B, C_B) \in \mathbb{U}$. Its Purpose requires perception.

---

### 7.3 Observation Through Composition

Observation may likewise be the Action of a UCA:

```text
s_C ──triggers──► u_C (Purpose: observe and interpret)
                   │
                   └── produces(u_C, a_C): observe
                           │
                           └── produces(a_C, o_C): structured observation
                                                   │
                                                   ▼
                                          s_D ──triggers──► u_D
```

---

### 7.4 Disposition Adaptation Through Composition

A UCA may adapt the Disposition of another through a standard activation chain:

```text
u_A (Disposition d_A,0)
 │
 └── produces(a_A, o_A)
          │
          ▼ triggers
      s_B ──► u_B (Purpose: evaluate and adapt behavior)
               │
               └── produces(a_B, o_B): Δd_A
                                 │
                           d_A,0 ──mutation──► d_A,1  (applied to u_A)
```

Where $\Delta d_A = \text{difference}(d_{A,0}, d_{A,1})$. `u_B` requires no special structure. Its Purpose justifies its Action.

---

### 7.5 Emergent Behaviour Through Composition

A network of UCAs, each bounded to $(u, s) \to a \to o$, may exhibit behaviour that no individual unit contains:

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

               ↓ (informative diagram)

    emergent system behaviour
```

This constitutes the emergent behaviour hypothesis (§6.1), to be verified experimentally.

---

## 8. Conformance

A software entity or component conforms to the **UCA Core** if and only if it satisfies all of the following criteria. Each textual normative criterion is accompanied by its formal expression over canonical domains and relations:

1. **Dedicated Invariant Purpose**: Defines an explicit, stable, implementation-independent Purpose.
   $$\forall u \in \mathbb{U}, \exists! p \in \mathbb{P} : \text{hasPurpose}(u, p)$$
2. **Defined Disposition**: Possesses a Disposition conditioning its reactive behavior.
   $$\forall u \in \mathbb{U}, \exists d \in \mathbb{D} : \text{hasDisposition}(u, d)$$
3. **Bounded Capabilities**: Operates via an explicit, bounded set of Capabilities.
   $$\forall u \in \mathbb{U}, \exists C \subseteq \mathbb{C}, C \neq \emptyset : \text{hasCapabilities}(u, C)$$
4. **Reactive Activation by Stimulus**: Executes strictly upon activation triggered by an external Stimulus crossing its functional boundary.
   $$\forall u \in \mathbb{U}, \forall a \in \mathbb{A} \text{ executed by } u, \exists s \in \mathbb{S} : \text{triggers}(s, u, a)$$
5. **Purpose-Driven Action**: Executes an Action that performs the emergent Reactive Process pursuing its Purpose within the boundaries of its Capabilities and Disposition.
   $$\forall (u, s) \text{ active}, \exists a \in \mathbb{A} : \text{triggers}(s, u, a)$$
6. **Outcome Production**: Produces one or more observable Outcomes representing what the Action actually produced.
   $$\forall a \in \mathbb{A} \text{ completed by } u, \exists o \in \mathbb{O} : \text{produces}(a, o)$$
7. **Purpose-Driven Decomposition**: Treats another component as a UCA only if that component possesses a dedicated, differentiated Purpose.
   $$\forall u' \text{ composed in } u, u' \in \mathbb{U} \iff \exists! p' \in \mathbb{P} : \text{hasPurpose}(u', p') \land p' \neq p_u$$

**Non-Requirements for Conformance**:

A component does **not** need any of the following to conform to UCA:
- a dual teleology, intermediate objectives or goals, or a formal `Context` container as mandatory universal stimulus structures;
- Observation or Perception as lifecycle phases;
- Memory, Identity, Learning, or Adaptation;
- a Coordinator, Dispatcher, Orchestrator, or Supervisor;
- a specific language model or LLM;
- external causality assumed as a necessary ontology;
- an Impulse envelope;
- an Event Bus;
- Synapses or relational plasticity;
- global state or snapshots;
- demonstrated emergent cognitive behaviour.

Conformance evaluates the **individual unit** against the UCA contract. It does not evaluate whether the system as a whole exhibits cognitive behaviour.

---

## 9. Open Questions

This section documents open questions not resolved in the specification, identified from the conceptual model and formal grammar audit.

### 9.1 Criteria for Stimulus Relevance and Interface Filters

Under the Minimality Principle, the specification does not impose a universal computable predicate $\text{relevant}(s, p)$ that every UCA must evaluate formally in every cycle. In reactive or streaming units (such as `Ear`), compatibility is physically determined by the interface of its receptive Capabilities; in cognitive units, via typed subscriptions, interface contracts, or runtime discrimination. The formalization of how Capability and Runtime interface contracts handle incoming signal relevance without introducing teleological overhead into the Core remains an open question.

### 9.2 Inter-UCA Relational Plasticity

Whether a `Synapse` abstraction — representing a persistent, adaptable property of the relationship between two UCAs — is necessary or sufficient to model inter-unit plasticity remains an open question. It requires empirical evidence from implementations (see §6.5).

### 9.3 Empirical Validation of Emergent Cognition

The central hypothesis of UCA (§6.6) has not yet been empirically validated. Future reference implementations must be designed to test whether cognitive behaviour can emerge from purpose-bounded units limited to $(u, s) \to a \to o$.

### 9.4 Formal Relationship between Action and Reactive Process

The specification concurrently references `Action` ($a \in \mathbb{A}$) and `Reactive Process` emerging from interactions among Capabilities. It is not formally resolved whether:
1. `Action` is identical to the full execution trace of the `Reactive Process`;
2. `Action` is a bounded observable external interface whose underlying mechanism is the `Reactive Process`;
3. or if `Reactive Process` is an ongoing internal dynamic of which `Action` is a discrete instantiation.

This must be resolved in future iterations without forcing artificial mathematical identities into the Core.

### 9.5 Semantics of Context Inclusion vs. Triggering in Outcome → Stimulus Relationships

In §3.3 it is established that an Outcome $o_i$ emitted by a UCA may relate to the Stimulus $s_j$ of another unit in two ontologically distinct ways:
1. Becoming part of Context: $o_i \in x_j$.
2. Triggering reactive activation: $\text{triggers}(o_i, s_j)$.

The formalization of the exact conditions under which an Outcome constitutes passive contextual substrate versus a direct triggering event remains open, as does whether this distinction depends on the emitter, the receiver, or the composition topology.

### 9.6 Semantics and Ontological Overload of `Interaction.Signal`

In the Primitive Capabilities model (§2.4 and §7.1), the `Interaction.Signal` field is used across examples to simultaneously represent:
- In-memory data types (e.g., `Int16Array`, `Float32Array`);
- Domain payloads or events (e.g., `RawTranscript`, `FilteredTranscript`);
- Physical transport mechanisms between observed properties.

This ontological overload between *data type*, *cognitive event*, and *propagation channel* remains an open question that should not be resolved through formal shortcuts without architectural validation.

### 9.7 Causality vs. Reactivity and Temporal Propagation

The specification formally distinguishes between:
- Temporal precedence: $\text{precedes}(x, y)$;
- Reaction: $\text{reactsTo}(x, y)$;
- Production: $\text{produces}(x, y)$.

The use of the term "causality" in the UCA architecture raises the question of whether causality is a necessary ontological assumption of the model, or whether all inter-UCA interaction can be exhaustively described through pure reactivity, production, and temporal propagation, avoiding unformalized counterfactual causal commitments.

### 9.8 Teleological Evaluation and Formal Predicate `servesPurpose(a, p)`

The UCA Core establishes that every Action is the outcome of an emergent Reactive Process from an already constituted UCA $u = (p, d, C)$. Because the unit is intrinsically oriented by its Purpose, the action naturally emanates from that constitution. Whether the formal predicate $\text{servesPurpose}(a, p)$ contributes irreducible semantics or constitutes formal redundancy with respect to $p$ belonging to the constitution of $u$ ($\text{hasPurpose}(u, p)$) remains an open question, avoiding the risk of introducing non-computable teleological evaluations into minimal conformance criteria.

---

## 10. Architectural Background and Related Work (Informative)

> **This section is informative and non-normative.**
> It introduces no new constraints, primitives, or conformance requirements on the UCA Core contract formalized in preceding normative sections.

### 10.1 Recurring Architectural Problems and Conceptual Convergence

UCA does not emerge in conceptual isolation. Many of the fundamental challenges it addresses — decoupling, functional specialization, strict reactivity, distributed composition, systemic emergence, and continuous adaptation — have been investigated for decades across software engineering, distributed systems, robotics, and cognitive sciences.

It is natural that similarities exist between UCA and diverse architectural traditions: when independent disciplines attempt to solve shared problems, solutions tend to converge partially on common principles.

```text
Recurring Architectural Problems:
- Component decoupling
- Avoidance of monolithic central coordinators
- Reaction to environmental perturbations
- Hierarchical or recursive composition
- Adaptation based on empirical evidence
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ Convergence of Families and Design Traditions          │
│                                                        │
│ ├── Actor Model: Isolation and message-based concurrency│
│ ├── Reactive Systems: Decoupled reactive triggering    │
│ ├── Subsumption: Distributed behaviors and control     │
│ ├── Blackboard Systems: Specialist cooperation         │
│ ├── Global Workspace: Modular systemic integration     │
│ ├── Soar / LIDA: Cognitive architecture modeling       │
│ └── Autonomic Computing: Local parametric adaptation   │
└────────────────────────────────────────────────────────┘
```

UCA explicitly acknowledges these intellectual influences and precedents. At the same time, UCA does not claim to be a copy, direct evolution, official extension, replacement, or unification of any of these architectures. Each was conceived to satisfy specific goals, constraints, and operational domains. UCA addresses its own specific problem: defining a **minimal and determinable functional primitive** ($u = (p, d, C)$) from which complex cognitive behavior can emerge through reactive composition.

### 10.2 Actor Model

The Actor Model (Hewitt, Bishop & Steiger, 1973; Agha, 1986) formulated one of the most influential approaches for designing concurrent and distributed systems based on independent units. In this model, an "actor" is an autonomous entity that, in response to an incoming message, can make local decisions, create new actors, send messages to other actors, and modify its internal state for future messages.

**Similarities with UCA**:
- **Isolation and Clear Boundaries**: Both abstractions reject shared mutable global state; each unit encapsulates its own behavior.
- **Reception-Triggered Activation**: An actor does not execute without receiving a message; a UCA reacts strictly upon the reception of a Stimulus external to its functional boundary.
- **Concurrency and Distribution**: Interaction does not rely on a centralized execution thread or shared locks.

**Conceptual Differences**:
- **Ontological Nature**: The Actor Model is primarily a computational abstraction for concurrency, parallelism, and message passing in distributed systems. UCA is a functional ontological primitive designed to bound identity and cognitive responsibility.
- **Explicit Constitution**: In the classic Actor Model, an actor is defined by its mailbox and dynamic behavior upon message receipt. In UCA, the unit is rigorously constituted by the formal tuple $u = (p, d, C)$, where **Purpose** ($p$) invariantly determines what it pursues, **Capabilities** ($C$) bound its operational limits, and **Disposition** ($d$) transparently declares its properties and reactive interactions.
- **Infrastructure Separation**: An actor is often coupled to its runtime infrastructure mailbox; in UCA, the transport mechanism (`Impulse`) is strictly decoupled from the triggering content (`Stimulus`).

### 10.3 Reactive Systems and Event-Driven Architectures (EDA)

Event-Driven Architectures (EDA) and the principles of Reactive Systems (Bonér et al., 2014) establish that software systems should be responsive to environmental stimuli, decoupled in time and space, and resilient through fault isolation.

**Similarities with UCA**:
- **Reactive Triggering**: Processing flow does not proceed from a top-down imperative call, but from reaction to a signal, event, or environmental change:
  $$	ext{External Signal} 	o 	ext{Stimulus} 	o 	ext{UCA} 	o 	ext{Action} 	o 	ext{Outcome}$$
- **Temporal and Spatial Decoupling**: The emitter of a signal neither controls nor knows the receiver's internal lifecycle.
- **Intra-Unit Reactive Interactions**: The `Interactions` declared in a UCA's Disposition follow strictly reactive semantics upon local observable changes (`reactsTo`).

**Conceptual Differences**:
- **Level of Abstraction**: Reactive Systems prescribe technical patterns and system engineering properties (elasticity, resilience, backpressure, message brokers). UCA establishes a functional unit-level contract; it does not mandate an Event Bus, message brokers, Observer patterns, or reactive code streams in the Core.

### 10.4 Subsumption Architecture and Behavior-Based Robotics

Rodney Brooks' Subsumption Architecture (1986, 1991) marked a seminal milestone by demonstrating that complex, adaptive intelligent behavior can emerge without a monolithic central processor, without exhaustive symbolic world models, and without global planners. Subsumption organizes the system into layers of bounded, tightly reactive behavioral competencies interacting directly with the environment.

**Similarities with UCA**:
- **Radical Decentralization**: Both approaches firmly reject the figure of a universal planner, coordinator, or supervisor.
- **Systemic Emergence**: Global intelligent behavior emerges from the dynamic interaction of multiple simpler specialized competencies or units.
- **Situated Reactivity**: Units operate coupled to real observable environmental perturbations rather than maintaining monolithic simulated virtual worlds.

**Conceptual Differences**:
- **Application Domain**: Subsumption Architecture was primarily conceived for physical agents and mobile robotics with sensorimotor layers tightly bound to hardware. UCA generalizes the functional unit to any computational or cognitive process (sensory, analytical, transformational, probabilistic, or symbolic).
- **Inhibition Mechanisms vs. Capability Composition**: Subsumption uses hardwired physical inhibition and suppression lines across circuit layers. UCA does not inhibit units: it structures interaction through Outcome exposure, Stimulus propagation, and recursive composition where a UCA may use another as a Capability without violating its functional autonomy or Purpose.
- **Declarativeness and Mutability**: In Subsumption, layers are fixed finite-state machines hardwired in code or hardware. In UCA, the `Disposition` is declarative, observable, and inspectable, enabling evolutionary adaptation through atomic `Mutation` of properties within their `Nature`.

### 10.5 Blackboard Architectures

Blackboard architectures, prototypically introduced in the Hearsay-II speech-understanding system (Erman et al., 1980; Nii, 1986), pioneered a model of cooperative, distributed problem solving where a set of specialized modules (Knowledge Sources) inspect and interact opportunistically via a shared structured working memory ("the blackboard").

**Similarities with UCA**:
- **Functional Specialization**: No single component attempts to solve the entire problem; multiple units with bounded responsibilities contribute according to their specialization.
- **Indirect Interaction**: Specialists do not couple through direct invocations between them, but through observing changes in visible state.

**Conceptual Differences**:
- **Absence of Shared Global Memory in the Core**: The Blackboard architecture intrinsically relies on a shared, mutable global working memory and an opportunistic control mechanism selecting which knowledge source acts. The UCA Core dispenses entirely with shared global state and blackboard controllers; interaction occurs strictly through signal propagation and Outcome exposure across local functional boundaries. Blackboard-like patterns may be constructed as part of a composite Cognitive Architecture (§4), but do not constitute a universal Core requirement.

### 10.6 Global Workspace Theory (GWT)

Global Workspace Theory (Baars, 1988; Dehaene et al., 1998; Shanahan, 2006) models cognition as a massive federation of specialized, unconscious processors competing for access to a limited-capacity working memory (the Global Workspace), from which selected information is widely broadcast across the entire system.

**Similarities with UCA**:
- **Functional Modularity**: The cognitive system is conceived as a multitude of specialized units with bounded processing.
- **Emergent Cooperation**: Unified systemic behavior arises from coordinated local module activity.

**Conceptual Differences**:
- **No Mandatory Centralized Broadcast**: UCA does not assume signals must be broadcast globally to all units. Propagation in UCA is local, targeted, or subscription-based across boundaries.
- **No Attentional Competition in the Core**: GWT grounds its dynamics in processors competing to dominate the attentional focus of the global workspace. In UCA Core, each unit reacts locally to Stimuli crossing its boundary, without needing to compete for a global broadcast resource.
- **Neutrality on Consciousness**: GWT is primarily a biological and psychological theory of conscious access. UCA is a software architecture specification for functional units and makes no claims regarding consciousness, introspection, or subjective states.

### 10.7 Soar Cognitive Architecture

Soar (Laird, Newell & Rosenbloom, 1987; Laird, 2012) represents one of the most systematic classical cognitive architectures grounded in the physical symbol system hypothesis. Soar models all goal-oriented activity as search within problem spaces, utilizing production rules to select and apply operators transforming system state toward a desired goal, complemented by impasse resolution and chunking learning mechanisms.

**Similarities with UCA**:
- **Pursuit of Unified Cognitive Behavior**: Both approaches seek to architecturally understand and realize how non-monolithic systems can display complex, coherent cognitive behavior.
- **Persistence and Learning**: Soar incorporates mechanisms to adapt its knowledge from experience; UCA defines formal Disposition evolution via accumulated empirical evidence and atomic mutations (§2.1, §4.4).

**Architectural Contrast and Ontological Choices**:
- **Teleology: Purpose vs. Goal**: Soar places the concept of goal as the central abstraction guiding operator selection and impasse resolution during dynamic task execution. UCA, conversely, adopts **Purpose** as the sole constitutive functional direction of the unit and formally eliminates **Goal** as an activation primitive. In UCA, a unit does not receive external activation goals; it receives external signals (Stimuli) and reacts intrinsically according to what its Purpose already dictates that it pursues.
- **Production Engine vs. Mechanism-Agnostic**: Soar mandates a structured production engine, fixed decision cycles, and operator hierarchies. UCA is deliberately agnostic regarding whether a unit's Capabilities are implemented via production rules, deterministic code, signal processing algorithms, or probabilistic models.

### 10.8 LIDA and Distributed Cognitive Architectures

LIDA (Learning Intelligent Distribution Agent; Franklin et al., 2007, 2016) is a biologically inspired hybrid cognitive architecture integrating GWT, multilevel memories (perceptual, episodic, declarative, procedural), and recurring cognitive cycles divided into fixed phases of perception, attention, and action selection.

**Similarities with UCA**:
- **Process Distributability**: Deploys multiple specialized components to process sensory and memory information.
- **Multilevel Adaptation**: Recognizes that adaptation takes place across different temporal scales and abstraction levels.

**Conceptual Differences**:
- **Absence of a Fixed Cognitive Cycle**: LIDA roots its dynamics in the strict, periodic execution of a universal cognitive cycle (Perception $	o$ Attention $	o$ Selection $	o$ Action). In UCA Core, no mandatory lifecycle phases or predefined universal cognitive phases exist. Each UCA reacts asynchronously upon receiving its own Stimulus, and sequential or cyclic coordination emerges, if needed, through inter-unit composition topology (§3) or Cognitive Architecture (§4).
- **Non-Universal Memory Modules**: In LIDA, episodic, semantic, and attentional memory subsystems are mandatory system modules. In UCA, memory is an optional responsibility that may or may not be modeled as a specialized UCA when required by the functional domain (see §7.2, Hippocampus UCA).

### 10.9 Self-Adaptive Systems, Cybernetics, and Autonomic Computing

Classical cybernetics (Ashby, 1956 - *Design for a Brain* and the law of requisite variety) and autonomic computing architectures (Kephart & Chess, 2003 - MAPE-K loop: Monitor, Analyze, Plan, Execute, Knowledge) established theoretical foundations for feedback-driven adaptation and homeostasis in the face of environmental disturbances.

**Similarities with UCA**:
- **Adaptation Governed by Invariant Bounds**: In Ashby's cybernetics and autonomic computing, the system adjusts its internal parameters to keep essential variables within viable limits. In UCA, this principle is manifested directly in the formalization of **Evolution**: a `Mutation` ($\mu \in \mathbb{M}	ext{ut}$) adapts the unit's `Disposition` ($d$) while strictly preserving its invariant `Purpose` ($	ext{preservesPurpose}(u, \mu)$) within the bounded space of its `Capabilities` ($	ext{withinCapabilities}(u, \mu)$) and property `Nature`.
- **Use of Empirical Evidence**: Adaptation proceeds from observing previous observable consequences (`Evidence`), rather than arbitrary source code modifications.

**Conceptual Differences**:
- UCA does not require each unit to implement an internal MAPE-K autonomic loop. Observation, diagnosis, and evolutionary decisions may be executed by external observation processes within a Cognitive Architecture (§4.4), keeping the individual UCA as a purely reactive functional unit.

---

### 10.10 Comparative Synthesis of Architectural Principles

The following table descriptively and neutrally summarizes how UCA shares and contrasts conceptual principles against the primary architectural families analyzed:

| Architectural Principle | Tradition / Relevant Precedent | Specific Treatment in UCA Core |
|---|---|---|
| **Strict Reactivity** | Reactive Systems, Subsumption Architecture | Every UCA reacts exclusively upon receiving an external Stimulus crossing its functional boundary. No spontaneous activation. |
| **Functional Specialization** | Actor Model, Behavior-Based AI, Soar | Univocally delimited by Purpose ($p \in \mathbb{P}$), which defines what the unit is and what it pursues throughout its existence. |
| **Operational Decoupling** | Actor Model, Event-Driven Architectures | Inter-UCA interaction via signals and Outcome exposure. Zero imperative calls or RPC subordination in composition. |
| **Recursive Composition** | Component-Based Software, Actor Systems | A UCA may use another UCA as one of its Capabilities, with each unit preserving its own Purpose and reactive autonomy. |
| **Systemic Emergence** | Subsumption Architecture, GWT, LIDA | Complex behavior does not reside in a monolithic central controller, but emerges from the reactive interactions of multiple units. |
| **Parametric Adaptation** | Autonomic Computing, Cybernetics | Atomic modification of Disposition ($\Delta d$) via Mutations within the space bounded by Nature, preserving Purpose and Capabilities. |
| **Absence of Global State** | Actor Model, Subsumption | UCA Core dispenses with shared global memories, blackboards, or centralized snapshots. |
| **Teleological Direction** | Contrast with Soar, LIDA, BDI | Elimination of activation `Goal` in favor of constitutive dedicated `Purpose`. The UCA does not receive goals; it receives perturbations or data. |

---

### 10.11 UCA's Own Contract and Scope of Its Hypothesis

The review of architectural background and influences highlights that UCA does not need to claim the isolated invention of each of its guiding principles to establish its value. UCA's contribution lies in the **formal, minimalist, and bounded combination** of these principles within a strict ontological contract:

```text
CONSTITUTION:
u = (p, d, C)

Purpose (p)
    functionally determines what the UCA is and what it pursues.

Capabilities (C)
    delimit what the UCA can do.

Disposition (d)
    determines how its Capabilities are constituted and predisposed
    through Properties and Interactions.

REACTIVE ACTIVATION:
External Signal ──► Stimulus ──► UCA ──► Action ──► Outcome(s)
```

The existence of historical precedents exploring reactivity, specialization, or distribution does not constitute automatic validation or proof that UCA composition generates cognition. For this reason, the specification maintains a strict methodological separation:

1. **Architectural precedents** demonstrate that UCA's design choices are anchored in a mature, established computer science tradition.
2. **The emergent cognitive behavior hypothesis** (§6) remains strictly a falsifiable scientific hypothesis, subject to experimental and empirical verification through reference implementations.

---

## 11. References

1. **Agha, G.** (1986). *Actors: A Model of Concurrent Computation in Distributed Systems*. MIT Press, Cambridge, MA.
2. **Ashby, W. R.** (1956). *An Introduction to Cybernetics*. Chapman & Hall, London.
3. **Baars, B. J.** (1988). *A Cognitive Theory of Consciousness*. Cambridge University Press, New York.
4. **Bonér, J., Farley, D., Kuhn, R., & Thompson, M.** (2014). *The Reactive Manifesto*. Available at: https://www.reactivemanifesto.org/
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

## 12. Runtime Specification and Reference Implementation (TypeScript)

This section formalizes the programming contract and concrete reference implementation for Autonomous Cognitive Units in TypeScript/JavaScript runtimes.

### 12.1 Runtime Programming Model Principles

1. **Inheritance and Biological Lifecycle (`Adn`)**:
   Every UCA extends the fundamental base class `Adn`, possessing a deterministic identity (`id`), contextual logger, nervous system channel (`nervousSystem`), and activation via `live()`.

2. **Mandatory Purpose Declaration (`purpose`)**:
   Each UCA explicitly declares its ontological purpose (`public purpose: string`), which invariantly governs all its decisions and reactions.

3. **Higher-Domain Capability Catalog (`Registry`)**:
   Capability classes are registered decoupled in a higher-domain catalog (`Registry.register(name, Ctor)`), avoiding tight coupling of direct imports between the organism and its concrete organs.

4. **Innate Capability Composition and Dispositions**:
   An organism or UCA declares its biological capabilities and initial parameterization via a declarative dictionary where **each key must obligatorily be defined in `camelCase` format**:
   ```typescript
   public capabilities = {
       <camelCaseName>: <dispositionObject>
   };
   ```
   Upon activating the UCA, each capability is instantiated independently and isolated (`new Ctor(...)`), receiving its own `disposition`, the shared channel, and the nervous system. Capabilities are directly accessible on the instance as `camelCase` properties (e.g., `agent.acousticEar`, `agent.vocalMouth`).

   > **Organism Capability Uniqueness Invariant**: In strict accordance with Section 3 and Conformance Criterion 7, **two duplicate UCAs (same Purpose or same ontological class) cannot coexist within the same UCA organism**. Every subordinate capability that is a UCA must possess its own functionally differentiated purpose. If an organism needs to process multiple sensory streams or channels of the same modality, that multiplicity belongs to terminal mechanisms or properties within the responsible specialized UCA, and never to duplicating identical UCAs. This invariant guarantees that within the local channel each organ is unique.

5. **Automatic Property Mutation Detection (Reactive Proxy)**:
   The UCA instance is wrapped in a reactive Proxy. Any mutation of public properties automatically triggers a broadcast signal on the internal channel (`Channel`) carrying the complete identity of the emitter (`source` id, `sourceName` in `camelCase`, and `sourceType`). Redundant assignments (same value) are suppressed in real-time.

6. **Declarative Reactivity (`reactTo`)**:
   Each receiving UCA defines the list of signals or properties it reacts to:
   ```typescript
   protected reactTo = [
       'acousticEar.isListening',    // Discrimination by camelCase capability key
       'AcousticEar.lastTranscript', // Or discrimination by ontological type
   ];
   ```
   The UCA discriminates in $O(1)$ time within `canProcess(signal)` and immediately delegates to the `react(signal)` method.

### 12.2 Typing Contracts and Interfaces (`types.ts`)

| Interface / Type | Definition | Responsibility |
|---|---|---|
| `Signal` | `{ source: string; sourceName: string; sourceType: string; property: string; value: unknown; timestamp: number; }` | Represents an atomic signal broadcast upon property mutation in an emitter UCA. Identifies source unit (`source`), capability key (`sourceName`), class type (`sourceType`), mutated property (`property`), value (`value`), and timestamp (`timestamp`). |
| `SignalListener` | `(signal: Signal) => Promise<void> \| void` | Callback function invoked upon receiving a signal on the internal channel. |
| `IChannel` | `emit(signal: Signal): void;`<br>`subscribe(listener: SignalListener): () => void;` | Intra-organism local communication bus contract. Decouples signal broadcasting from subscribed receivers. |
| `CapabilityConstructor` | `new (id: string, name: string, config?: Config) => Uca` | Constructor signature for classes extending `Uca` that can be dynamically instantiated as subordinate capabilities. |
| `IRegistry` | `register(name: string, ctor: CapabilityConstructor): void;`<br>`resolve(name: string): CapabilityConstructor \| undefined;` | Higher-domain catalog contract mapping `camelCase` capability names to class constructors. |
| `Config` | `{ channel?: IChannel; nervousSystem?: INervousSystem; registry?: IRegistry; disposition?: Record<string, unknown>; }` | Configuration and dependency injection parameters for UCA initialization. |

### 12.3 Base `Uca` Class Specification

The abstract base class `Uca` governs unit lifecycle, innate capability mounting, and reactive signal dispatch in the runtime.

#### 12.3.1 Properties

- `public abstract purpose: string`: Invariant ontological purpose defining and guiding the unit across its existence.
- `public capabilities: Record<string, Record<string, unknown>>`: Declarative dictionary of innate capabilities and their dispositions, with mandatory `camelCase` keys.
- `public disposition?: Record<string, unknown>`: Parametric and interactive configuration injected into the unit during instantiation.
- `protected channel: IChannel`: Local signal channel instance. If omitted from `Config`, initializes an isolated `Channel` instance.
- `protected registry: IRegistry`: Reference to the capability catalog used to resolve constructors. Defaults to `defaultRegistry`.
- `protected reactTo: string[]`: Declarative list of signals in `<SourceUca>.<property>` format to which the UCA reactively responds.

#### 12.3.2 Constructor

```typescript
constructor(id: string, name: string, config?: Config)
```
- Calls `Adn(id, name, nervousSystem)` constructor.
- Assigns `this.disposition`, `this.channel`, and `this.registry`.
- Automatically subscribes internal dispatcher `this.handleSignal(signal)` to the local channel.
- Wraps the instance in a reactive Proxy (`wrapWithProxy(this)`) and returns it, transparently intercepting property mutations.

#### 12.3.3 Lifecycle and Capability Mounting Methods

- `public override async live(): Promise<void>`:
  Entrypoint for the UCA biological lifecycle. First invokes `this.mountCapabilities()` to instantiate and mount all subordinate organs declared in `capabilities`, then delegates to `super.live()`.
- `public mountCapabilities(): void`:
  Deterministically iterates over entries in `this.capabilities`. For each `[name, disposition]` pair, verifies if the property already exists on the instance; if absent, delegates mounting to `this.attach(name, disposition)`.
- `public attach(name: string, disposition: Record<string, unknown>): void`:
  Resolves the capability constructor via `this.registry.resolve(name)`. If registered, creates the child instance via `this.createChild(Ctor, name, disposition)` and mounts it as a direct property on the UCA under its `camelCase` name.
- `public createChild(Ctor: CapabilityConstructor, name: string, disposition: Record<string, unknown>): Uca`:
  Instantiates an isolated child UCA (`new Ctor(...)`), assigning a concatenated deterministic identifier (`${this.id}-${name}`), sharing the channel (`this.channel`) and nervous system (`this.nervousSystem`), and injecting its specific `disposition`.

#### 12.3.4 Reactivity and Signal Dispatch Methods

- `public canProcess(signal: Signal): boolean`:
  Evaluates in $O(1)$ time whether the UCA must process an incoming signal by checking if `${signal.source}.${signal.property}` exists in `this.reactTo`.
- `public handleSignal(signal: Signal): void`:
  Internal channel signal handler. If `this.canProcess(signal)` returns true, asynchronously and safely invokes `this.react(signal)`.
- `public async react(signal: Signal): Promise<void>`:
  Protected extension point for UCA subclasses to execute specific reactive behavior for signals that have passed `canProcess`.

#### 12.3.5 Reactive Proxy Mechanism (`wrapWithProxy`)

The UCA instance is intercepted via a JavaScript Proxy at instantiation time:
1. **Mutation Detection (`set` trap)**: When setting a property, checks if the new value differs from the existing value (`target[prop] !== value`).
2. **Redundant Emission Suppression**: If the assigned value is identical to the current value, assignment occurs silently without emitting channel signals, preventing infinite cycles and noisy bus traffic.
3. **Automatic Signal Broadcast**: If the value has changed, updates the property and immediately broadcasts a `Signal` on the channel:
   - `source`: Constructor name of the emitter unit (`this.constructor.name`).
   - `property`: Mutated property name as a string.
   - `value`: New assigned value.
   - `timestamp`: Unix millisecond timestamp (`Date.now()`).

### 12.4 Canonical Reference Example (Non-Normative)

> **Clarification Note:** The code presented below is **strictly a non-normative usage example**. Its sole purpose is to practically illustrate how the formal runtime principles of UCA translate into TypeScript. It does not prescribe a fixed architecture nor does it limit the diversity of capabilities or organisms that can be developed under this specification.

```typescript
import { Uca, defaultRegistry, Signal } from './uca/index.js';

// 1. Primitive Capability Definitions
export class AcousticEar extends Uca {
    public override purpose = 'Acoustic perception and continuous speech transcription';
    public isListening = false;
    public lastTranscript = '';

    public transcribe(text: string): void {
        this.lastTranscript = text;
    }
}

export class VocalMouth extends Uca {
    public override purpose = 'Vocal synthesis and speech output to the external environment';
    public speechQueue: string[] = [];
    protected override reactTo = ['AcousticEar.lastTranscript'];

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            this.speechQueue.push(`[Synthesized Voice] ${value}`);
        }
    }
}

// 2. Registry Registration (camelCase keys)
defaultRegistry.register('acousticEar', AcousticEar);
defaultRegistry.register('vocalMouth', VocalMouth);

// 3. Organism with Innate Capabilities and Disposition
export class ConversationalAgent extends Uca {
    public override purpose = 'Biological interactive speech agent';
    public override capabilities = {
        acousticEar: { sampleRate: 16000, framingMs: 100 },
        vocalMouth: { voice: 'alloy', rate: 1.0 },
    };
}

// 4. Agent Usage: camelCase Access, Dispositions, and Decoupled Reactivity
export async function runVoiceAgentExample(): Promise<void> {
    const agent = new ConversationalAgent('agent-001', 'ConversationalAgent');

    // Each capability is instantiated in isolation and exposed via its camelCase property
    const ear = (agent as unknown as Record<string, AcousticEar>)['acousticEar'];
    const mouth = (agent as unknown as Record<string, VocalMouth>)['vocalMouth'];

    console.log(`Agent Purpose: ${agent.purpose}`);
    console.log('Injected disposition for acousticEar:', ear.disposition);
    console.log('Injected disposition for vocalMouth:', mouth.disposition);

    // Reactive activation: mutating a property on acousticEar automatically broadcasts
    // the signal 'AcousticEar.lastTranscript', to which vocalMouth reactively responds
    ear.isListening = true;
    ear.transcribe('Hello, cognitive architect');

    // Observable consequence within the organism
    console.log('Speech queue in vocalMouth:', mouth.speechQueue);
    // Output: ['[Synthesized Voice] Hello, cognitive architect']
}
```

---

## License

UCA Specification © 2026 Christian Marino Alvarez.

This specification and its documentation are licensed under the
Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, share, adapt, and implement this specification,
including for commercial purposes, provided appropriate attribution is given.

Software implementations and reference runtimes are licensed separately.

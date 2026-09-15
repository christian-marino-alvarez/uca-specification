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

### Composition Principle

> **Before extending the UCA primitive with a new cognitive mechanism, attempt to represent that responsibility through composition of existing UCAs.**

Concepts that can be expressed through Purpose, Action, Outcome, or composition of UCAs must not be added as universal UCA primitives.

### Fundamental Principles of the Model

1. **Conception determines what UCA exists.**
2. **Purpose determines what the UCA pursues.**
3. **Capabilities determine the boundaries of what the UCA can do.**
4. **Disposition determines how those Capabilities are constituted and predisposed to behave and interact.**
5. **Stimulus triggers a reaction in an already conceived UCA.**
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
| $\mathbb{P}$ | $p \in \mathbb{P}$ | Dedicated Invariant Purpose |
| $\mathbb{D}$ | $d \in \mathbb{D}$ | Declarative Disposition |
| $\mathbb{C}$ | $c \in \mathbb{C}$ | Capability |
| $\mathbb{M}$ | $m \in \mathbb{M}$ | Mechanism (operational procedure of a Capability) |
| $\text{Prop}$ | $\text{prop} \in \text{Prop}$ | Property: declarative or parametric condition $(\text{function}, \text{nature}, \text{value})$ |
| $\text{Nat}$ | $n \in \text{Nat}$ | Nature: intrinsic specification of the valid mutation space of a Property |
| $\text{Inter}$ | $\text{inter} \in \text{Inter}$ | Interaction: declared reactive relation $(\text{definition}, \text{target}, \text{signal}, \text{when})$ |
| $\mathbb{S}$ | $s \in \mathbb{S}$ | Stimulus: incoming information or change capable of triggering a reaction in the UCA |
| $\mathbb{X}$ | $x \in \mathbb{X}$ | Context: situational background or support context (optional pattern, §4) |
| $\mathbb{A}$ | $a \in \mathbb{A}$ | Action: operational execution of the emergent reactive process of the UCA |
| $\mathbb{O}$ | $o \in \mathbb{O}$ | Outcome (observable consequence produced) |
| $\mathbb{M}\text{ut}$ | $\mu \in \mathbb{M}\text{ut}$ | Mutation (atomic transformation of Disposition) |
| $\mathbb{E}$ | $e \in \mathbb{E}$ | Evidence (observable empirical information) |

#### Explicit Named Relations

Generic arrows ($\to$) with multiple interpretations are prohibited in normative expressions. The specification defines and prioritizes the following named predicates and relations:

1. **Constitution and Membership**:
   - $\text{hasPurpose}(u, p)$: Unit $u$ possesses purpose $p$.
   - $\text{hasDisposition}(u, d)$: Unit $u$ is predisposed by disposition $d$.
   - $\text{hasCapability}(u, c)$: Unit $u$ includes capability $c$.
   - $\text{hasCapabilities}(u, C)$: Unit $u$ includes the set of capabilities $C \subseteq \mathbb{C}$.

2. **Reactivity and Activation**:
   - $\text{triggers}(s, u)$: Stimulus $s$ triggers the reactive execution of unit $u$.
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

> **Purpose defines what a UCA is conceived to pursue throughout its existence.**

It is stable, persistent, and independent of specific executions or concrete mechanisms. It defines the operational boundary and identity of the unit.

- A Purpose delimits the domain of responsibility belonging to the unit and provides direction to all its reactions.
- A UCA cannot arbitrarily alter its own Purpose, as doing so would destroy its functional identity.
- A UCA must never be defined by its mechanisms. Querying a database or calling a language model are mechanisms, not cognitive purposes.
- **Purpose is the sole source of functional direction for a UCA and guides all its reactions throughout its existence.**
- **The Stimulus determines what the UCA reacts to; it does not redefine what the UCA pursues.**

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

A UCA possesses a dedicated Purpose that guides all its reactions. Incoming information (Stimulus) triggers the reaction and supplies required data, without needing to instruct the unit on what it must pursue. There is no dual teleology: no intermediate concept (such as `Goal`, `Objective`, or `Task`) modulates or redefines the direction established by the Purpose.

#### Ontological Demarcation: Purpose vs. Stimulus vs. Signal

To ensure maximum conceptual clarity and avoid ontological ambiguities, the universal UCA model strictly demarcates concepts across three independent architectural tiers:

```text
1. CONSTITUTIVE AND IDENTITY TIER:
   └── Purpose (p ∈ ℙ)
       Defines the reason for being, the functional domain, and the invariant identity of the UCA.
       It is dedicated, persistent, and intrinsic. Answers: Toward what does the UCA orient its activity?

2. UNIT ACTIVATION TIER:
   └── Stimulus (s ∈ 𝕊)
       The incoming environmental information, change, or perturbation making contact with the
       unit's domain of functional relevance (relevant(s, p)) and triggering its global reactive execution:
       (u, s) → a → o. Answers: What awakens the UCA in an operational cycle?

3. INTERNAL CAPABILITY INTERACTION TIER:
   └── Signal (within Interaction.Signal)
       The concrete data payload, type, or message transmitted between Capabilities declared
       within their Dispositions to coordinate the emergent process without code coupling.
       Answers: What specific information flows reactively from one property to another?
```

---

### 2.6 Input Information and Context

Every reactive execution requires incoming information (the data, signals, or perturbations upon which mechanisms operate).

In certain cognitive architectures, this information may be organized as a structured **Context** (situational substrate, history, operational parameters). However, a purely reactive UCA does not necessarily require a formal context container to process immediate input.

Under the Minimality Principle, `Context` is not a universal primitive of the UCA Core, but rather a possible form of information carried by a Stimulus or managed by a Cognitive Architecture (§4).

---

### 2.7 Stimulus (S) and Impulse

It is essential to keep transport infrastructure concepts and cognitive content strictly separated:

```text
Impulse  = transport (infrastructure)
Stimulus = information or perturbation to which the UCA reacts (cognition)
```

> **The UCA receives an Impulse and reacts to the Stimulus carried by it.**

```text
NervousSystem
      │
      ▼
   Impulse
      │
      └── Stimulus: incoming information or perturbation
             │
             ▼
            UCA: u = (p, d, C)
```

The Stimulus ($s \in \mathbb{S}$) is the information or environmental change capable of provoking a reaction in the UCA. It does not impose a rigid predefined tuple structure in the Core: in sensory units it may be a physical signal or raw data packet; in cognitive units it may include references, contextual substrate, or operational parameters.

The Impulse is a transport mechanism belonging to the Runtime (§5) that carries such information across infrastructure, without forming part of the formal UCA Core model.

---

### 2.8 Activation Domain and Stimulus Relevance

A UCA does not react to arbitrary information flowing through the system:

> **A UCA only reacts to Stimuli relevant to its functional domain of responsibility delimited by its Purpose.**

Formally: $\text{relevant}(s, p_u)$. If an incoming stimulus falls outside the domain of the unit's Purpose, it does not trigger a reaction or is discarded by its receptive mechanisms (see §9.1).

This principle safeguards functional delimitation: the emitting entity does not dictate the receiver's reaction; it exposes or transmits information, and the receiving UCA reacts according to its own Purpose, Capabilities, and Disposition.

---

### 2.9 Action (A) and Reactive Process

> **The Process of a UCA is the emergent dynamic produced by reactive interactions between its Capabilities according to their Dispositions and guided by its Purpose.**

Rather than an arithmetic sum (`Capabilities + Dispositions`), the Reactive Process represents the emergent execution trajectory resulting from reactive interactions governed by dispositions:

$$\text{emerges}(\text{ReactiveProcess}, C, d)$$

```text
Capabilities (C) governed by Dispositions (d)
                    │
                    ▼ reactiveInteractions
             Reactive Process
                    │
                    ▼ produces
                Outcome(s)
```

The effective order and flow of execution emerge from relationships declared in `Interactions`. There is no imperative central coordinator or processor executing capabilities sequentially.

An Action ($a \in \mathbb{A}$) is the bounded operational manifestation executed upon activation, producing an Outcome ($\text{produces}(a, o)$). An Action does not necessarily require language model inference. It can be deterministic computation, data retrieval, structural transformation, or capability invocation.

---

### 2.10 Outcome (O)

`Outcome` represents **what the Action actually produced**:

$$\text{produces}(a, o) \quad \text{where } a \in \mathbb{A}, o \in \mathbb{O}$$

Shorthand notation $a \to o$ indicates strictly this production relation.

Ontological distinction:
```text
STIMULUS (S): Information or perturbation that triggers the reaction.
OUTCOME (O):  What the executed Action actually produced as an observable consequence.
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
   ▼ produces
o₀
o₁
o₂
...
```

In continuous flow systems (such as audio or real-time processing), each partial Outcome reflects a discrete chunk of output generated under the UCA's Purpose during its Action.

Formally, the emission sequence establishes a strictly chronological temporal precedence:
$$\text{precedes}(o_0, o_1) \land \text{precedes}(o_1, o_2) \land \dots$$
Temporal precedence asserts chronological order exclusively ($t_0 < t_1 < t_2$) and does **NOT** imply qualitative improvement, progress, or intrinsic ordering:
$$\text{precedes}(o_i, o_{i+1}) \centernot\implies o_{i+1} > o_i$$

---

### 2.11 Local Reactivity

> **No activation without a Stimulus.**

A UCA never executes spontaneously. It acts strictly in response to a Stimulus:
$$\forall a \in \mathbb{A} \text{ executed by } u, \exists s \in \mathbb{S} : \text{triggers}(s, u, a)$$

The ultimate origin of that Stimulus — external or internal — is a matter of Cognitive Architecture (§4), not UCA Core.

---

### 2.12 UCA Boundary

**On "Artificial"**

The term `Artificial` describes the nature of the unit as a constructed, bounded functional primitive designed in software or hardware:
- **Constructed functional primitive**: The unit is a deliberately designed functional building block, bounded by a dedicated Purpose and a finite set of Capabilities.
- **Does not imply Artificial General Intelligence or mandatory LLMs**: The term neither assumes nor requires the use of language models, deep neural networks, or machine learning algorithms. A UCA may be implemented using deterministic logic, classical algorithms, heuristics, or statistical models.
- **Does not imply self-execution**: That the unit is artificial does not mean it is a self-executing agent endowed with its own volition; its execution remains strictly reactive upon the arrival of a relevant Stimulus.

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
Structure:   u = (p, d, C) ∈ ℙ × 𝔻 × 𝒫(ℂ)
Stimulus:    s ∈ 𝕊
Activation:  triggers(s, u, a) ∧ produces(a, o)  [shorthand: (u, s) → a → o]
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
- UCA A requires UCA B to perform its Action.
- UCA A does not coordinate, orchestrate, or control UCA B.
- UCA A does not instruct UCA B nor dictate its purpose: UCA A exposes or emits information, and UCA B reacts according to its own Purpose B, Capabilities B, and Disposition B.

---

### 3.2 Terminal Capabilities

> A Capability becomes another UCA only when there is a dedicated, functionally differentiated Purpose.
> When differentiated purposes no longer emerge and only mechanisms remain, terminal capabilities have been reached.

If a component executes a mechanical or algorithmic function without a stable, independent Purpose, it remains a terminal capability and should not be modeled as a UCA.

---

### 3.3 Outcome → Stimulus Relationships

The Outcome $o_i \in \mathbb{O}$ produced by an executing UCA $u_i$ may relate to another unit $u_j$ in two architecturally distinct ways:
1. **Informational or Contextual Substrate**: The Outcome becomes available as data or evidence for subsequent reactions of $u_j$.
2. **Reactive Triggering**: The emission of Outcome $o_i$ triggers a new Stimulus $s_j \in \mathbb{S}$ relevant to the Purpose of unit $u_j$:
   $$\text{triggers}(o_i, s_j) \land \text{triggers}(s_j, u_j, a_j)$$

```text
u_i (Purpose p_i)
 │
 └── produces(a_i, o_i)
          │
          ├── [informational substrate] ──► available as data for u_j
          │
          └── [reactive triggering] ──► triggers(o_i, s_j) ──► u_j (Purpose p_j)
```

Complex systemic behaviour unfolds through chains of interaction between specialized units. No central coordinator is required for this chain to operate.

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

Although every UCA is locally reactive, a Cognitive Architecture may originate Stimuli from:
- external human or machine interactions;
- sensory and environmental events;
- scheduled tasks or software timers;
- internal homeostatic monitors or background loops;
- system startup events.

Strictly external causality is an architectural design choice, not a universal UCA requirement.

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
4. **Reactive Activation by Stimulus**: Executes strictly upon activation triggered by a Stimulus belonging to its domain of responsibility.
   $$\forall u \in \mathbb{U}, \forall a \in \mathbb{A} \text{ executed by } u, \exists s \in \mathbb{S} : \text{triggers}(s, u, a) \land \text{relevant}(s, p_u)$$
5. **Purpose-Driven Action**: Executes an Action that performs the emergent Reactive Process pursuing its Purpose within the boundaries of its Capabilities and Disposition.
   $$\forall (u, s) \text{ active}, \exists a \in \mathbb{A} : \text{triggers}(s, u, a) \land \text{servesPurpose}(a, p_u)$$
6. **Outcome Production**: Produces one or more observable Outcomes representing what the Action actually produced.
   $$\forall a \in \mathbb{A} \text{ completed by } u, \exists o \in \mathbb{O} : \text{produces}(a, o)$$
7. **Purpose-Driven Decomposition**: Treats another component as a UCA only if that component possesses a dedicated, differentiated Purpose.
   $$\forall u' \text{ composed in } u, u' \in \mathbb{U} \iff \exists! p' \in \mathbb{P} : \text{hasPurpose}(u', p') \land p' \neq p_u$$

**Non-Requirements for Conformance**:

A component does **not** need any of the following to conform to UCA:
- a dual teleology, external goal, or formal `Context` container as mandatory universal stimulus structures;
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

### 9.1 Formal Criteria for Stimulus Relevance to Purpose

The specification requires that a UCA only reacts to stimuli relevant to its functional domain of responsibility ($\text{relevant}(s, p)$), but does not prescribe a single algorithm or function to evaluate such relevance. In reactive streaming units (such as `Ear`), relevance is evaluated directly by receptive capability interfaces or filters; in cognitive units, via typed schemas or discrimination interfaces. Future work may formalize these criteria as declarative interface contracts or discriminated types.

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

---

## License

UCA Specification © 2026 Christian Marino Alvarez.

This specification and its documentation are licensed under the
Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, share, adapt, and implement this specification,
including for commercial purposes, provided appropriate attribution is given.

Software implementations and reference runtimes are licensed separately.

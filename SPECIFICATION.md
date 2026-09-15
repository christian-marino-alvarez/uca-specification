# UCA — Autonomous Cognitive Unit (Unidad Cognitiva Autónoma)
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
│  U = (P, D, C)              │
│  (U, S) → A → O             │
└──────────────┬───────────────┘
               │ composition
               ▼
┌──────────────────────────────┐
│          UCA SYSTEM          │  ← network of functional primitives
│   U₁ ↔ U₂ ↔ ... ↔ Uₙ       │
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

## 2. UCA Core

The UCA Core defines the minimal properties required to identify a functional unit as an Autonomous Cognitive Unit.

---

### 2.1 Definition, Conception and Lifecycle

An **Autonomous Cognitive Unit (UCA)** is a bounded functional unit defined by an **autonomous purpose**, constituted by **concrete capabilities**, and predisposed by a **declarative disposition**.

> A UCA is defined not by what it executes, but by the purpose it is responsible for fulfilling.

```text
U = (P, D, C)
```

Where:
- `P` — **Purpose**: why the UCA exists — guides its reaction
- `D` — **Disposition**: constitutive, parametric, and interactive conditions — predisposes its behavior
- `C` — **Capabilities**: operational resources — delimit its functional space

#### Conception

> **Conception is the moment when a UCA is constituted with a Purpose, Capabilities, and an initial Disposition.**

```text
Conception
    ↓
UCA
├── Purpose
├── Capabilities
└── Disposition
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
- In continuous reactive activations, the Stimulus does not need to redundantly repeat the Purpose in an identical Goal.

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
    │   │   ├── Purpose
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

1. **Property.Purpose**:
   > Defines why the property exists in the functional order.
   Allows external evolutionary observers to semantically interpret the property without hardcoded knowledge specific to the Capability.

2. **Property.Nature**:
   > **Nature describes the intrinsic characteristics of a Property and delimits the valid space within which it may be modified (Mutation Space).**
   Nature defines type, mutability, valid value domain, limits, and operational constraints. A modification is only valid if the new value belongs to its Nature ($Value \in Nature$).

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
    │   ├── modelDir: { Purpose: "ASR model directory", Nature: [path, readonly], Value: "models/asr-es" }
    │   ├── modelType: { Purpose: "Transducer architecture", Nature: ["zipformer2"], Value: "zipformer2" }
    │   ├── provider: { Purpose: "Compute backend", Nature: ["cpu", "cuda"], Value: "cpu" }
    │   ├── sampleRate: { Purpose: "Required sampling rate", Nature: [16000], Value: 16000 }
    │   ├── featureDim: { Purpose: "Acoustic feature dimension", Nature: [80], Value: 80 }
    │   ├── numThreads: { Purpose: "Parallel inference threads", Nature: [1..16], Value: 4 }
    │   ├── enableEndpoint: { Purpose: "Endpointing cutoff activation", Nature: [boolean], Value: true }
    │   ├── rule1MinTrailingSilence: { Purpose: "Trailing silence after long utterance", Nature: [0.5..5.0s], Value: 2.4 }
    │   ├── rule2MinTrailingSilence: { Purpose: "Trailing silence after short utterance", Nature: [0.1..2.0s], Value: 0.4 }
    │   ├── rule3MinUtteranceLength: { Purpose: "Maximum utterance duration", Nature: [5.0..60.0s], Value: 20.0 }
    │   ├── decodingMethod: { Purpose: "Hypothesis search algorithm", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
    │   └── hotwordsScore: { Purpose: "Contextual hotwords weighting", Nature: [0.0..10.0], Value: 2.5 }
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

```text
possible UCA behavior ⊆ Capabilities
```

The UCA cannot invent capabilities during its reaction that it does not possess.

They may include:
- concrete primitive capabilities (deterministic algorithms, transforms, parsers, ASR);
- storage engines, databases, and indexes;
- external tools, APIs, and drivers;
- predictive models, embeddings, and language models;
- other UCAs whose autonomous Purpose provides the functionality required by the Action.

A Capability is an instrument. A Capability is not automatically a UCA. Using another UCA as a Capability does not imply subordination, hierarchy, or unrestricted control — the used UCA retains its own Purpose and only accepts Goals compatible with it.

---

### 2.5 Goal (G)

`Goal` represents **the concrete outcome required in a given activation**.

```text
PURPOSE (P)
Why does this UCA exist? — Persistent and invariant identity that guides all reactions.

GOAL (G)
What outcome is required now? — Contextual, specific to activation when applicable.
```

A UCA always interprets a received Goal through the lens of its own Purpose. In continuous reactive activations, setting a Goal identical to Purpose in each activation is not required.

---

### 2.6 Context (X)

`Context` contains the information required for the UCA to interpret and resolve its activation.

Context must not represent an indiscriminate global photograph of the entire system memory. It provides local continuity between interactions:

```text
Previous Outcomes + Active Evidence + Immediate Inputs ──► Context (X)
```

---

### 2.7 Stimulus (S) and Impulse

It is essential to keep transport infrastructure concepts and cognitive content strictly separated:

```text
Impulse  = transport (infrastructure)
Stimulus = information to which the UCA reacts (cognition)
```

> **The UCA receives an Impulse and reacts to the Stimulus carried by it.**

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

The Stimulus is a cognitive abstraction `S = (G, X)`. The Impulse is the runtime container transporting it.

---

### 2.8 Goal/Purpose Compatibility

A UCA must only accept Goals that are compatible with its Purpose.

> **A Goal must be compatible with the Purpose of the UCA that receives it.**

If an incoming Goal falls outside the unit's Purpose, the activation does not belong in its domain and must be rejected or redirected.

---

### 2.9 Action (A) and Reactive Process

> **The Process of a UCA is the emergent dynamic produced by reactive interactions between its Capabilities according to their Dispositions and guided by its Purpose.**

```text
Capabilities + Dispositions ──► Reactive Interactions ──► Reactive Process ──► Outcome(s)
```

The effective order and flow of execution emerge from relationships declared in `Interactions`. There is no imperative central coordinator or processor executing capabilities sequentially.

An Action does not necessarily require language model inference. It can be deterministic computation, data retrieval, structural transformation, or capability invocation.

---

### 2.10 Outcome (O)

`Outcome` represents **what the Action actually produced**:

```text
A → O
```

Ontological distinction:
```text
GOAL (G):    What was intended to be achieved.
OUTCOME (O): What the executed Action actually produced.
```

The Outcome strictly belongs to the executing unit.

#### Partial Outcomes and Streaming

A UCA is not required to produce a single final Outcome. An activation may emit multiple partial Outcomes continuously (streaming):

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

In continuous flow systems (such as audio or real-time processing), each partial Outcome reflects a discrete chunk of output generated under the UCA's Purpose during its Action.

---

### 2.11 Local Reactivity

> **No activation without a Stimulus.**

A UCA never executes spontaneously. It acts strictly in response to a Stimulus.

The ultimate origin of that Stimulus — external or internal — is a matter of Cognitive Architecture (§4), not UCA Core.

---

### 2.12 UCA Boundary

**On "Autonomous"**

The term `Autonomous` must not be construed as:
- self-executing without a Stimulus;
- self-planning or self-activating;
- a general-purpose agent;
- independent consciousness.

> A UCA is autonomous in its Purpose and reactive in its execution.

Autonomy belongs to Purpose: the unit possesses its own bounded functional domain. Execution remains strictly reactive.

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
Structure:   U = (P, D, C)
Stimulus:    S = (G, X)
Constraint:  Goal must be compatible with Purpose
Activation:  (U, S) → A → O
```

---

## 3. UCA Composition

This section defines how individual UCAs can relate to and combine with each other to form larger systems. Composition is the mechanism through which cognitive complexity is built outside the Core primitive.

> **Recursive composition of UCAs is Capability usage, not centralized orchestration.**

A UCA only needs to know the Capabilities available to it. It does not need to know the global UCA topology of the system. Composition remains local and recursive.

---

### 3.1 UCA as a Capability

A UCA may use another UCA as one of its Capabilities when that unit fulfills its own autonomous and differentiated Purpose. There is no structural difference between using a technical Capability and using a UCA as a Capability, except that the latter retains its own Purpose and only accepts Goals compatible with it:

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
      ├── Purpose B      ← UCA B's own autonomous Purpose
      ├── Disposition B
      └── Capabilities B
```

Using UCA B as a Capability means:
- UCA A requires UCA B to perform its Action.
- UCA A does not coordinate, orchestrate, or control UCA B.
- Any Goal UCA A passes to UCA B must be compatible with Purpose B.

---

### 3.2 Terminal Capabilities

> A Capability becomes another UCA only when there is an autonomous, distinct Purpose.
> When autonomous purposes no longer emerge and only mechanisms remain, terminal capabilities have been reached.

If a component executes a mechanical or algorithmic function without a stable, independent Purpose, it remains a terminal capability and should not be modeled as a UCA.

---

### 3.3 Outcome → Stimulus Relationships

The Outcome of one UCA may form part of the Context or trigger a Stimulus for another:

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

Complex systemic behaviour unfolds through chains of interaction between specialized units. No central coordinator is required for this chain to operate.

---

### 3.4 Causal Composition

Through Outcome → Stimulus relationships, UCAs form causal chains:

```text
Uᵢ → Aᵢ → Oᵢ → Stimulus → Uⱼ → Aⱼ → Oⱼ → Stimulus → Uₖ → ...
```

This notation describes a relational pattern of architectural behaviour. It is not a formal mathematical definition.

---

### 3.5 Recursive Use of Capabilities

A UCA may expose another UCA as one of its Capabilities. That UCA may recursively use its own Capabilities to fulfill its Goal. This recursive relationship does not imply centralized coordination, hierarchy, or unrestricted control.

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

### 4.1 Attainment

`Attainment` represents the degree to which an Outcome satisfies the Goal that initiated the activation.

> The Outcome belongs to whoever executes.
> The Attainment belongs to whoever originated the Goal.

The executing UCA produces the Outcome. It is not required to evaluate itself to rule on whether its output fulfills the operational intention of the entity that invoked it.

A Cognitive Architecture may define UCAs whose Purpose involves evaluating Outcomes against Goals:

```text
Goal Originator (UCA₁)
        │
        ▼
Executor (UCA₂)
        │
        └── Outcome
                │
                ▼
Evaluator (UCA₃)
                │
                └── Attainment Evaluation
```

Evaluation is constructed through composition. No special evaluator is required in the Core.

---

### 4.2 Perception and Observation

Perception and observation are **not** universal phases of a UCA's activation cycle. They are cognitive responsibilities that can be modeled through composition.

A UCA whose Purpose requires perceiving information from the environment performs that work through its Action:

```text
environment ──► Stimulus
                    │
                    ▼
          UCA B (Purpose: perceive)
                    │
                    └── Action: perceive
                            │
                            └── Outcome: perceived representation
```

Observation follows the same pattern:

```text
Stimulus → UCA C (Purpose: observe and interpret)
                    │
                    └── Action: observe
                            │
                            └── Outcome: structured observation
```

No special `Observer` exists in the UCA structure. Each of these units is simply `U = (P, D, C)` with a Purpose that justifies its Action.

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
     ↓
UCA₀ (Purpose, Capabilities, Disposition₀)
     │
     │ evidence
     ▼
Mutation₁ (atomic)
     ↓
Disposition₁
     │
     │ evidence
     ▼
Mutation₂ (atomic)
     ↓
Disposition₂
     │
    ...
```

#### Principle of Atomic Mutation

> **The minimal unit of Evolution is an atomic Mutation of the Disposition.**

A Mutation must be, whenever possible:
- **small and identifiable**: focused on a concrete Property or Interaction;
- **bounded**: circumscribed to the limits of Nature;
- **validable**: formally verifiable prior to application ($Value \in Nature$);
- **measurable**: empirically observable in the Outcome;
- **reversible**: capable of being restored if evidence is unfavorable;
- **attributable**: traceable to the evidence that motivated it.

#### Mutation Types: Parametric and Structural

1. **Parametric Mutation**: Tuning the state or value of a Property (`Property.Value`), keeping Purpose, Nature, and Interactions constant:
   ```text
   SherpaRecognition.hotwordsScore: 2.5 ──► 3.0   (where 3.0 ∈ Nature)
   ```
2. **Structural Mutation**: Modifying an Interaction (`Disposition.Interactions`) to alter the emergent reactive flow without modifying Capability source code:
   ```text
   t₀: Capability A ──► Capability B
   t₁: Capability C ──► Capability A ──► Capability B
   ```

#### Inviolable Boundaries of Evolution

> **Evolution ⊆ Purpose ∩ Capabilities ∩ Nature**

- **Purpose** is the identity invariant: it cannot mutate.
- **Capabilities** are the functional boundaries: unconstituted capabilities cannot be dynamically acquired.
- **Nature** delimits the Mutation Space of each property or interaction.

---

### 4.4 Evolutionary Observation, Local Optimization, and Falsifiability

A Cognitive Architecture may define a specialized UCA (e.g., `Cingulate UCA`) whose Purpose is to evaluate evidence and propose atomic mutations:

```text
Outcome(s) ──► Evidence ──► Cingulate UCA ──► Mutation Inference ──► Nature Validation ──► ΔDisposition
```

#### Principles of Evolutionary Observation

1. **Declarative Interpretation without Hardcoded Coupling**: The evolutionary observer inspects `Property.Purpose`, `Property.Nature`, `Property.Value`, and `Interactions` (Definition, Target, Signal, When), reasoning on adaptation without requiring code specific to each Capability.
2. **Strict Validation Against Nature**: No mutation may be applied if it violates the declared `Nature` of the property. Evolutionary safety stems from declarative constitution itself.
3. **Out of the Critical Execution Path**: The evolutionary observer operates asynchronously, selectively, and contextually on accumulated evidence. It is not a synchronous arbiter or bottleneck for every reaction.
4. **Bounded Local Optimization**: The optimization context remains small and localized:
   ```text
   UCA Purpose + Capability Purpose + Property Purpose + Property Nature + Value + Evidence ──► Optimization Context
   ```
5. **Experimental Falsifiability**: Every atomic mutation generates an empirically testable hypothesis against the Outcome:
   ```text
   Outcome₁ > Outcome₀   (Validated improvement)
   Outcome₁ = Outcome₀   (Inocuous / No effect)
   Outcome₁ < Outcome₀   (Degradation detected ──► Rollback)
   ```

---

### 4.5 Coordination as Capability Usage

Coordination is not a privileged UCA role. There is no Coordinator or Dispatcher predefined in the UCA model.

If a system identifies a real autonomous Purpose that requires integrating Outcomes from multiple UCAs — for example, synthesizing partial results or sequencing activations based on context — that Purpose may justify a UCA. But the UCA is not coordinating by nature: it is a unit whose Action uses other UCAs as Capabilities:

```text
UCA A
────────────────────
Purpose: synthesize results from available knowledge sources

Capabilities
├── UCA B (Purpose B)
├── UCA C (Purpose C)
└── UCA D (Purpose D)
```

UCA A performs its Action using B, C, and D as Capabilities. It does not orchestrate them. Each of B, C, and D retains its own Purpose and only accepts Goals compatible with it.

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

The Stimulus `(G, X)` is a cognitive abstraction. The Impulse is a runtime representation of that concept. A UCA implementation may operate with or without an explicit Impulse abstraction.

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

The causal pattern:

```text
Oᵢ → Stimulus → Uⱼ → Aⱼ → Oⱼ → ΔDᵢ
```

describes a relational pattern of architectural behaviour: the Outcome of one UCA stimulates another, whose Action results in a Disposition change in the first. This is a hypothesis about what is achievable through composition.

---

### 6.4 Structural Learning Through Interaction

It is hypothesized that systems can achieve adaptive behavioral improvement without retraining model weights or modifying source code, through dynamic adjustment of Dispositions in response to environmental feedback.

---

### 6.5 Relational Plasticity (Synapses)

Current adaptation focuses on intra-unit Disposition tuning. An active research question explores inter-unit relational plasticity: adjustment of routing weights, affinity, or communication topology between units:

```text
INTRA-UCA:  ΔDisposition(Uᵢ)
INTER-UCA:  ΔRelationship(Uᵢ, Uⱼ)
```

A `Synapse` abstraction would represent a persistent property of the relationship between two UCAs that cannot be adequately modeled as the state, Disposition, or Capability of either unit individually.

Whether such an abstraction is necessary remains an open question. Synapse is not part of the normative UCA Core.

---

### 6.6 The Falsifiable Hypothesis

> **Can cognitive behaviour emerge from the interaction of purpose-bounded UCAs, while each individual unit remains structurally limited to `U = (P, D, C)` and behaviorally limited to `(U, S) → A → O`?**

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
│       │   ├── sampleRate: { Purpose: "Acoustic sampling rate", Nature: [16000], Value: 16000 }
│       │   ├── suppressionGain: { Purpose: "Static echo suppression gain", Nature: [0.0..1.0], Value: 0.0 }
│       │   ├── bargeInThresholdRms: { Purpose: "RMS threshold for voice barge-in", Nature: [50..1000], Value: 160 }
│       │   ├── echoLeakRatio: { Purpose: "Acoustic leak tolerance ratio", Nature: [0.0..1.0], Value: 0.25 }
│       │   ├── maxThresholdRms: { Purpose: "Maximum acoustic RMS threshold", Nature: [100..2000], Value: 450 }
│       │   ├── decayMs: { Purpose: "Suppression decay time", Nature: [50..2000ms], Value: 350 }
│       │   └── bargeInHoldMs: { Purpose: "Barge-in state hold time", Nature: [50..2000ms], Value: 400 }
│       └── Interactions:
│           └── onAudioInput: { Definition: "Suppress echo from raw audio signal", Target: "AudioInput.stream", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── AudioFraming
│   ├── Mechanism: Temporal signal framing into discrete chunks
│   └── Disposition:
│       ├── Properties:
│       │   ├── sampleRate: { Purpose: "Sampling rate", Nature: [16000], Value: 16000 }
│       │   ├── frameSize: { Purpose: "Discrete frame size", Nature: [160..16000], Value: 1600 }
│       │   └── emitPartialOnFlush: { Purpose: "Emit partial frame on buffer flush", Nature: [boolean], Value: false }
│       └── Interactions:
│           └── onCleanAudio: { Definition: "Frame suppressed audio", Target: "EchoCancellation.output", Signal: "Int16Array", When: "Target.hasData == true" }
│
├── PcmToFloat
│   ├── Mechanism: Normalization and conversion of Int16 integers to Float32 floating-point
│   └── Disposition:
│       ├── Properties:
│       │   ├── inputType: { Purpose: "Input numeric type", Nature: ["Int16"], Value: "Int16" }
│       │   ├── outputType: { Purpose: "Output numeric type", Nature: ["Float32"], Value: "Float32" }
│       │   └── scale: { Purpose: "Normalization divisor factor", Nature: [32768.0], Value: 32768.0 }
│       └── Interactions:
│           └── onAudioFrame: { Definition: "Normalize audio frame to floating point", Target: "AudioFraming.output", Signal: "Int16Array", When: "Target.frameReady == true" }
│
├── SherpaRecognition
│   ├── Mechanism: Online speech recognition via transducer neural model (Sherpa-ONNX)
│   └── Disposition:
│       ├── Properties:
│       │   ├── modelDir: { Purpose: "Neural model directory", Nature: [path, readonly], Value: "models/asr-es" }
│       │   ├── modelType: { Purpose: "Transducer architecture", Nature: ["zipformer2"], Value: "zipformer2" }
│       │   ├── provider: { Purpose: "Compute backend", Nature: ["cpu", "cuda"], Value: "cpu" }
│       │   ├── sampleRate: { Purpose: "Acoustic sampling rate", Nature: [16000], Value: 16000 }
│       │   ├── featureDim: { Purpose: "Acoustic feature dimension", Nature: [80], Value: 80 }
│       │   ├── numThreads: { Purpose: "Parallel inference threads", Nature: [1..16], Value: 4 }
│       │   ├── enableEndpoint: { Purpose: "Endpointing cutoff detection", Nature: [boolean], Value: true }
│       │   ├── rule1MinTrailingSilence: { Purpose: "Silence duration to segment long utterance", Nature: [0.5..5.0s], Value: 2.4 }
│       │   ├── rule2MinTrailingSilence: { Purpose: "Silence duration to segment short utterance", Nature: [0.1..2.0s], Value: 0.4 }
│       │   ├── rule3MinUtteranceLength: { Purpose: "Maximum utterance duration", Nature: [5.0..60.0s], Value: 20.0 }
│       │   ├── decodingMethod: { Purpose: "Decoding method", Nature: ["greedy_search", "modified_beam_search"], Value: "modified_beam_search" }
│       │   └── hotwordsScore: { Purpose: "Contextual hotwords weighting", Nature: [0.0..10.0], Value: 2.5 }
│       └── Interactions:
│           └── onFloatSamples: { Definition: "Decode speech from normalized samples", Target: "PcmToFloat.output", Signal: "Float32Array", When: "Target.hasSamples == true" }
│
├── EchoTextFilter
│   ├── Mechanism: Lexical filtering and attenuation of autogenerated transcripts
│   └── Disposition:
│       ├── Properties:
│       │   ├── caseSensitive: { Purpose: "Case sensitivity distinction", Nature: [boolean], Value: false }
│       │   ├── decayMs: { Purpose: "Lexical attenuation time window", Nature: [500..10000ms], Value: 2500 }
│       │   ├── mismatchThreshold: { Purpose: "Lexical mismatch tolerance", Nature: [0..5], Value: 1 }
│       │   └── minWordLength: { Purpose: "Minimum word length to evaluate", Nature: [1..10], Value: 3 }
│       └── Interactions:
│           └── onRawTranscript: { Definition: "Filter textual echoes from raw transcripts", Target: "SherpaRecognition.output", Signal: "RawTranscript", When: "Target.textAvailable == true" }
│
└── EarCoherence
    ├── Mechanism: Structural normalization and temporal continuity preservation of Chunks
    └── Disposition:
        ├── Properties:
        │   └── outputSchema: { Purpose: "Canonical output schema", Nature: ["Chunk"], Value: "Chunk" }
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

#### Harmonization and Reactivity in Ear

The Dispositions of primitive capabilities reactively interact to determine the emergent behavior of Ear toward its Purpose without requiring an imperative central processor or pipeline:
- `AudioFraming.frameSize: 1600` (audio chunk frame size).
- `EchoCancellation.decayMs: 350` and `bargeInHoldMs: 400` (echo threshold and cutoff management).
- `SherpaRecognition.rule2MinTrailingSilence: 0.4` (seconds of trailing silence for segment closure).
- `EchoTextFilter.decayMs: 2500` (temporal window for text echo attenuation).

None of these primitive capabilities becomes an independent UCA as long as it does not possess an autonomous, distinct Purpose. They remain primitive capabilities of Ear.

Example of emitted partial Outcomes:
```text
{ startAt: 0,   endAt: 400,  text: "I think" }
{ startAt: 400, endAt: 850,  text: "we should change" }
{ startAt: 850, endAt: 1200, text: "this architecture" }
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
UCA A (Purpose: act)
   │
   └── Action → Outcome ──► environment ──► Stimulus
                                                │
                                                ▼
                                     UCA B (Purpose: perceive)
                                                │
                                                └── Action: perceive
                                                        │
                                                        └── Outcome: perceived representation
```

`UCA B` is structurally identical to any other UCA: `U = (P, D, C)`. Its Purpose requires perception.

---

### 7.3 Observation Through Composition

Observation may likewise be the Action of a UCA:

```text
Stimulus → UCA C (Purpose: observe and interpret)
                   │
                   └── Action: observe
                           │
                           └── Outcome: structured observation
                                           │
                                           ▼
                                       Stimulus → UCA D
```

---

### 7.4 Disposition Adaptation Through Composition

A UCA may adapt the Disposition of another through a standard Outcome → Stimulus chain:

```text
UCA A (Disposition D₀)
   │
   └── Action → Outcome Oₐ
                    │
                    ▼
     Stimulus → UCA B (Purpose: evaluate and adapt behavior)
                    │
                    └── Action → Outcome: ΔD
                                     │
                               D₀ → D₁  (applied to UCA A)
```

`UCA B` requires no special structure. Its Purpose justifies its Action.

---

### 7.5 Emergent Behaviour Through Composition

A network of UCAs, each bounded to `(U, S) → A → O`, may exhibit behaviour that no individual unit contains:

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

    emergent system behaviour
```

This constitutes the emergent behaviour hypothesis (§6.1), to be verified experimentally.

---

## 8. Conformance

A software entity or component conforms to the **UCA Core** if and only if it satisfies all of the following criteria:

1. **Autonomous Purpose**: Defines an explicit, stable, implementation-independent Purpose (`P`).
2. **Defined Disposition**: Possesses a Disposition (`D`) conditioning its behavior.
3. **Bounded Capabilities**: Operates via an explicit set of Capabilities (`C`).
4. **Reactive Activation**: Executes strictly upon receipt of a Stimulus (`S`).
5. **Structured Stimulus**: The Stimulus contains a Goal (`G`) and a Context (`X`).
6. **Goal Compatibility**: Accepts Goals only when compatible with its Purpose.
7. **Action Toward Goal**: Performs an Action directed at fulfilling the Goal under its Purpose.
8. **Outcome Production**: Produces an Outcome representing what the Action actually produced.
9. **Purpose-Driven Decomposition**: Treats another component as a UCA only if that component possesses its own autonomous Purpose.

**Non-Requirements for Conformance**:

A component does **not** need any of the following to conform to UCA:
- Observation or Perception as lifecycle phases;
- Memory, Identity, Learning, or Adaptation;
- a Coordinator, Dispatcher, Orchestrator, or Supervisor;
- a specific language model or LLM;
- external causality;
- an Impulse envelope;
- an Event Bus;
- Synapses or relational plasticity;
- global state or snapshots;
- demonstrated emergent cognitive behaviour.

Conformance evaluates the **individual unit** against the UCA contract. It does not evaluate whether the system as a whole exhibits cognitive behaviour.

---

## 9. Open Questions

This section documents open questions not resolved in the specification.

### 9.1 Formal Semantics of Goal/Purpose Compatibility

The specification requires that a Goal be compatible with the Purpose of the UCA that receives it, but does not define an algorithmic method or formal semantics for evaluating that compatibility. Future work may formalize this as a typed predicate, semantic distance function, or declarative contract.

### 9.2 Inter-UCA Relational Plasticity

Whether a `Synapse` abstraction — representing a persistent, adaptable property of the relationship between two UCAs — is necessary or sufficient to model inter-unit plasticity remains an open question. It requires empirical evidence from implementations (see §6.5).

### 9.3 Empirical Validation of Emergent Cognition

The central hypothesis of UCA (§6.6) has not yet been empirically validated. Future reference implementations must be designed to test whether cognitive behaviour can emerge from purpose-bounded units limited to `(U, S) → A → O`.

---

## License

UCA Specification © 2026 Christian Marino Alvarez.

This specification and its documentation are licensed under the
Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, share, adapt, and implement this specification,
including for commercial purposes, provided appropriate attribution is given.

Software implementations and reference runtimes are licensed separately.

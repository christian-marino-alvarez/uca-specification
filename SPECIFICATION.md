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
│  u = (p, d, C, O)            │
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
2. Can it be expressed through Purpose, Disposition, Outcome, or composition of UCAs?

If (1) is NO, the concept does not belong in the Core.
If (2) is YES, the concept must remain outside the Core.

This principle requires that no redundant abstractions be introduced into the Core: if `Purpose` already exclusively and sufficiently determines what the UCA pursues throughout its existence, no second teleological abstraction belongs in the Core.

### Composition Principle

> **Before extending the UCA primitive with a new cognitive mechanism, attempt to represent that responsibility through composition of existing UCAs.**

Concepts that can be expressed through Purpose, Disposition, Outcome, or composition of UCAs must not be added as universal UCA primitives.

### Fundamental Principles of the Model

1. **Conception determines what UCA exists.**
2. **Purpose functionally determines what UCA is and what it pursues throughout its existence.**
3. **Capabilities determine the boundaries of what the UCA can do.**
4. **Disposition determines how those Capabilities are constituted and predisposed to behave and interact.**
5. **Stimulus is a signal external to the UCA boundary whose reception triggers a reaction in an already conceived unit.**
6. **Capabilities react through Interactions and not through direct dependencies between them.**
7. **The Process emerges from reactive interactions between Capabilities according to their Dispositions.**
8. **Outcome is the observable consequence of such activity, while Action and Reaction belong to the encapsulated internal domain of the UCA.**
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
| $\mathbb{S}$ | $s \in \mathbb{S}$ | Stimulus: reception by a UCA of an external observable change to its domain that triggers its reaction |
| $\text{Reception}$ | $\text{receives}(u, \Delta x)$ | Reception: universal, mechanical, and non-cognitive mechanism by which a UCA receives an external observable change to its domain that may trigger its reaction |
| $\mathbb{R}\text{xn}$ | $r \in \mathbb{R}\text{xn}$ | Reaction: internal process triggered by a Stimulus, composed of internal Actions and interactions |
| $\mathbb{A}$ | $a \in \mathbb{A}$ | Action: internal operation or transition belonging to the encapsulated Reaction of the UCA |
| $\mathbb{X}$ | $x \in \mathbb{X}$ | Context: situational background or support context (optional pattern, §4) |
| $\mathbb{O}$ | $o \in \mathbb{O}$ | Outcome: structured observable change $(\text{Properties}, \text{Criteria}, \text{Owner})$ produced by a UCA as a consequence of its activity |
| $\text{Compliance}$ | $\text{comp} \in \{\text{PASS}, \text{FAIL}\}$ | Compliance: deterministic evaluation of an Outcome's Criteria |
| $\text{Validation}$ | $\text{val} \in \{\text{APPROVED}, \text{REJECTED}\}$ | Validation: contextual decision and acceptance judgment emitted exclusively by the Outcome's Owner |
| $\text{Owner}$ | $u_{\text{owner}} \in \mathbb{U}$ | Owner: external UCA with authority in the operational context to validate or reject the Outcome ($u_{\text{owner}} \neq u_{\text{target}}$) |
| $\mathbb{M}\text{ut}$ | $\mu \in \mathbb{M}\text{ut}$ | Mutation (atomic transformation of Disposition) |
| $\mathbb{E}$ | $e \in \mathbb{E}$ | Evidence (observable empirical information) |
| $\mathbb{H}$ | $H \in \mathbb{H}$ | History: accumulated record of multi-execution historical evidence $[s, o, \text{Compliance}, \text{Validation}, d, t, \mu, x]$ |

#### Explicit Named Relations

Generic arrows ($\to$) with multiple interpretations are prohibited in normative expressions. The specification defines and prioritizes the following named predicates and relations:

1. **Constitution and Membership**:
   - $\text{hasPurpose}(u, p)$: Unit $u$ possesses purpose $p$.
   - $\text{hasDisposition}(u, d)$: Unit $u$ is predisposed by disposition $d$.
   - $\text{hasCapability}(u, c)$: Unit $u$ includes capability $c$.
   - $\text{hasCapabilities}(u, C)$: Unit $u$ includes the set of capabilities $C \subseteq \mathbb{C}$.

2. **Reactivity and Activation**:
   - $\text{receives}(u, \Delta x)$: Asserts that unit $u$ mechanically receives external observable change $\Delta x$ at its reactive boundary.
   - $\text{triggers}(s, u)$: Asserts that the reception of external stimulus $s$ by unit $u$ triggers its internal reaction process. Expresses strict reactive activation; does NOT imply command, instruction, or global metaphysical causality.
   - $\text{triggers}(o, s)$: Outcome $o$ triggers or materializes stimulus $s$.
   - $\text{reactsTo}(x, y)$: Entity $x$ reacts upon the observation or reception of state or signal $y$.

3. **Production**:
   - $\text{produces}(u, o)$: Asserts that the activity or reaction of unit $u$ generates structured outcome $o$ as an external observable consequence.

4. **Temporal Ordering**:
   - $\text{precedes}(o_1, o_2)$: Asserts strict temporal precedence between observable outcomes ($t_{o_1} < t_{o_2}$). When applied to internal actions ($\text{precedes}(a_1, a_2)$), describes an internal temporal order within the encapsulated reaction.

5. **Validation, Compliance, and Compatibility**:
   - $\text{satisfies}(v, n)$: Value $v$ belongs to and conforms to the type, domain, and invariants defined by Nature $n$.
   - $\text{preservesPurpose}(u, \mu)$: Mutation $\mu$ preserves the invariant purpose of unit $u$.
   - $\text{withinCapabilities}(u, \mu)$: Mutation $\mu$ remains strictly within the operational boundaries of the capabilities of $u$.
   - $\text{complies}(o)$: Deterministic evaluation of the Criteria of $o$. Returns $\text{PASS}$ if all Criteria are strictly satisfied, or $\text{FAIL}$ otherwise.
   - $\text{validates}(u_{\text{owner}}, o)$: Operational acceptance decision emitted exclusively by the Owner over $o$. Returns $\text{APPROVED}$ if the Owner accepts the outcome in its context, or $\text{REJECTED}$ otherwise.
   - $\text{hasOwner}(o, u_{\text{owner}})$: Associates Outcome $o$ with the external UCA $u_{\text{owner}}$ holding exclusive validation authority. Invariant: $u_{\text{owner}} \neq u_{\text{target}}$.

6. **State Difference**:
   - $\text{difference}(s_0, s_1)$: Denotes the observable delta $\Delta$ between initial state $s_0$ and subsequent state $s_1$.

#### Semantics of Arrows and Diagrams

- **Normative Arrow ($\to$)**: Used exclusively as shorthand for verified formal chains:
  $$(u, s) \to o \iff \text{triggers}(s, u) \land \text{produces}(u, o)$$
  Internally within the encapsulated domain: $s \to \text{Reaction}(u) \to o$. Internal actions $a_i$ occur as part of the reaction: $a_i \in \text{Actions}(\text{Reaction}(u, s))$.
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
8. **Strict Dissociation between Compliance and Validation**: $\text{complies}(o) = \text{PASS}$ MUST NOT imply $\text{validates}(u_{\text{owner}}, o) = \text{APPROVED}$, and $\text{complies}(o) = \text{FAIL}$ MUST NOT imply $\text{validates}(u_{\text{owner}}, o) = \text{REJECTED}$. All four cross-combinations are empirically valid.
9. **Strict Prohibition of Self-Validation**: For every Outcome $o$ produced by $u_{\text{target}}$, $\text{hasOwner}(o, u_{\text{owner}}) \implies u_{\text{owner}} \ne u_{\text{target}}$. A Target UCA MUST NOT validate or approve its own Outcomes.
10. **Mediated and Historical Evolution**: UCA evolution requires accumulated multi-execution historical evidence ($H \in \mathbb{H}$) processed by specialized functional roles (Tracking, Analysis, Evolution); a UCA MUST NOT self-evolve directly in response to an isolated Outcome.
11. **Relational Nature of Outcome and Stimulus**: An observable change $\Delta x$ produced by $u_A$ ($\text{Outcome}(u_A, \Delta x)$) and received by $u_B$ triggering its reaction ($\text{Stimulus}(u_B, \Delta x)$) represents two relational positions of the same change across different functional boundaries. $\text{Outcome}$ and $\text{Stimulus}$ MUST NOT be treated as disjoint ontological types requiring runtime conversion.
12. **No Automatic Inference of Stimulus**: $\text{Outcome}(u_A, \Delta x)$ MUST NOT automatically imply $\exists u_B : \text{Stimulus}(u_B, \Delta x)$. An observable change only constitutes a Stimulus for a receiving UCA if received mechanically and its Disposition triggers a reaction.
13. **Dissociation between Reception and Perception**: $\text{Reception}$ is the universal, mechanical, non-cognitive mechanism of UCA Core. $\text{Perception}$ is an optional, specialized, compositional function dependent on Purpose. A $\text{Stimulus}$ MUST NOT require $\text{Perception}$.

---

## 2. UCA Core

The UCA Core defines the minimal properties required to identify a functional unit as an Artificial Cognitive Unit.

---

### 2.1 Definition, Conception and Lifecycle

An **Artificial Cognitive Unit (UCA)** is a bounded functional unit defined by a **dedicated purpose**, constituted by **concrete capabilities**, predisposed by a **declarative disposition**, and bounded by the explicit definition of its **observable consequences (Outcome)**:

> A UCA is defined not by what it executes, but by the purpose it is responsible for fulfilling and by the observable consequences it produces under verifiable criteria governed by an Owner.

Formally, a concrete UCA $u \in \mathbb{U}$ is conceptually constituted as:

```text
u = (p, d, C, O) ∈ ℙ × 𝔻 × 𝒫(ℂ) × 𝕆_def
```

expressible in terms of normative predicates as:
$$\text{hasPurpose}(u, p) \land \text{hasDisposition}(u, d) \land (\forall c \in C, \text{hasCapability}(u, c)) \land \text{definesOutcome}(u, O)$$

Where:
- $p \in \mathbb{P}$ — **Purpose**: why the UCA exists — guides its reaction invariantly.
- $d \in \mathbb{D}$ — **Disposition**: constitutive, parametric, and interactive conditions — predisposes its behavior.
- $C \subseteq \mathbb{C}$ ($C \neq \emptyset$) — **Capabilities**: finite and bounded set of operational resources — delimits its functional boundary.
- $O \in \mathbb{O}_{\text{def}}$ — **Outcome**: canonical definition of the observable consequences structured into $(\text{Properties}, \text{Criteria}, \text{Owner})$ that the unit produces.

This expression describes the **conceptual constitution** of a UCA, not an arithmetic equality.

#### Conception

> **Conception is the moment when a UCA is constituted with a Purpose, Capabilities, an initial Disposition, and its Outcome definition.**

```text
Conception
    ↓
UCA: u = (p, d, C, O)
├── Purpose: p
├── Capabilities: C
├── Disposition: d
└── Outcome: O
    ├── Properties
    ├── Criteria
    └── Owner
```

`Conception` determines **what UCA exists**.

From its `Conception`, the UCA **remains functionally valid**. Traditional technical state concepts (`Birth`, `Start`, `Startup`, `Initialize`, `Boot`, `Ready`, `Active`, `Idle`, `Finished`, `Execute`) belong to the runtime technical implementation and are not part of the conceptual lifecycle of a UCA.

#### Conceptual Encapsulation Boundary

The UCA model formalizes four strictly delimited categorical tiers:

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
internal interactions
internal process
```

- **Functional Contract**: `Purpose` and `Capabilities` define what the UCA functionally pursues and the operational boundaries of what it is capable of doing. It is public and knowable by whatever composes or interacts with the unit.
- **Constitution / Configuration**: `Disposition` determines how its capabilities are predisposed to behave and interact through parametric and interactive conditions. It represents the unit's observable and mutable configuration.
- **Observable Consequence**: `Outcome` represents the observable change produced by the UCA's activity, structured in `Properties`, `Criteria`, and `Owner`. It is the sole boundary of interaction, evaluation, and evidence for other UCAs.
- **Encapsulated Internal Domain**: `Reaction`, individual `Actions`, `Mechanisms`, and the emergent `Process` belong exclusively to the UCA's interior. A consuming UCA does not need to know them nor couple to them to react to the Outcome.

#### Separation Between Constitution and Activation

The UCA model strictly formalizes two independent dimensions:

**1. Constitution**
```text
u = (p, d, C, O)

p = what functionally determines the UCA and what it pursues
d = how its capabilities are constituted and predisposed
C = what it can do (functional boundary)
O = observable consequences produced, with criteria and Owner
```

**2. Activation**
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
      ├── Properties (observable information produced)
      ├── Criteria   ──► Compliance (deterministic PASS | FAIL)
      └── Owner      ──► Validation (contextual APPROVED | REJECTED)
```

The `Stimulus` triggers reactive activity in an already conceived UCA.
The `Purpose` intrinsically determines toward what that activity is oriented.
The Stimulus **MUST NOT** redefine, alter, or replace the Purpose.

#### Reactive and Evolutionary Lifecycle

A UCA does not undergo rigid startup and termination phases. It reacts to received Stimuli by executing its internal reaction and emitting observable Outcomes, while specialized UCAs record and analyze accumulated historical evidence to guide the evolution of its Disposition:

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

Functional direction for any reaction proceeds invariably from the UCA's **Purpose**, not from externally imposed instructions:

> **Purpose is the sole source of functional direction for a UCA.**
> **The Stimulus determines what the UCA reacts to, but does not redefine what the UCA pursues.**

A UCA possesses a dedicated Purpose that guides all its reactions. The incoming external signal (Stimulus) triggers the reaction and supplies required data, without needing to instruct the unit on what it must pursue. Purpose is the sole source of functional direction for a UCA and admits no intermediate concepts that modulate or redefine the direction established by it.

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
Stimulus ≠ Action
Stimulus ≠ Outcome
```

---

### 2.7 Stimulus (S) and Impulse

The canonical definition of Stimulus in the UCA Core is:

> **Stimulus is the reception by a UCA of an external observable change to its domain that triggers its reaction.**

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

Normative characteristics of the Stimulus:
- **is the reception of an external observable change** to the domain of the receiving UCA;
- **triggers a reaction** in that UCA according to its Disposition;
- **does not require cognitive interpretation or prior perception**;
- **does not contain or redefine Purpose**;
- **does not prescribe an Action**;
- **does not determine an Outcome**;
- **does not constitute a goal or objective**;
- **does not need to possess cognitive semantics**;
- **does not require a fixed universal structure**.

Formally, $s \in \mathbb{S}$ and:
$$\text{triggers}(s, u)$$
strictly expresses that reception of external observable change $s$ by UCA $u$ triggers its internal reaction process.

#### Scope of "External" and Local Reactivity

> **External is defined relative to the boundary of the receiving UCA, not relative to the entire system.**

Therefore:
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

The origin of the change may belong to the same system, but is external relative to the operational domain of `UCA B`. Consequently, the chain:
$$\text{UCA}_A \longrightarrow \text{Outcome} \longrightarrow \text{UCA}_B \longrightarrow \text{Stimulus}$$
is fully valid without requiring that the signal originate from a human, hardware, or external environment outside the system. An external signal crosses the functional boundary of the receiving UCA regardless of its origin.

#### Decoupling Between Core Semantics and Runtime Mechanisms

It is essential to keep the semantic concepts of the UCA model strictly separated from technical transport representations and infrastructure mechanisms in runtime:

```text
UCA Core Semantics
──────────────────
Outcome
Stimulus
Reception
Reaction

Runtime Mechanisms
──────────────────
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
    Reception (UCA boundary)
       │
       ▼
    Stimulus (received external change triggering reaction)
       │
       ▼ triggers
      UCA (react)
```

**$\text{Signal} \ne \text{Stimulus}$ and $\text{Impulse} \ne \text{Stimulus}$**:
`Signal` and `Impulse` are transport mechanisms and technical vehicles provided by the runtime or environment (§5). `Stimulus` expresses the relational position of activation relative to the receiving UCA when the received change triggers its reaction. A compliant UCA does not mandatory require receiving an `Impulse`; the runtime may transport the change via signals, direct in-memory calls, sockets, events, or any other technical mechanism.

---

### 2.8 Activation Domain and Signal Compatibility

A UCA reacts to Stimuli that cross its functional boundary and interact with its constituent Capabilities.

The compatibility and relevance of a signal regarding a UCA does not require every unit to evaluate a universal computable semantic predicate in every activation cycle. In sensory or streaming units (such as `Ear`), compatibility is determined physically by the interface of its receptive Capabilities (e.g., a raw audio stream compatible with the capture mechanism). In cognitive units, it may be resolved through typed subscriptions, interface contracts, or runtime discrimination (see §9.1).

The emitting entity does not dictate the receiver's reaction; it exposes or transmits a signal, and the receiving UCA reacts according to what it already is: its own Purpose, Capabilities, and Disposition.

---

### 2.9 Reaction, Action, and Reactive Process

> **Reaction is the internal process triggered in a UCA by a Stimulus, constituted by the Actions, Mechanisms, and internal interactions necessary to produce its observable consequences.**
>
> **Action is any internal operation or transition occurring within a UCA as part of its Reaction.**

Conceptually:

```text
Stimulus
    │
    ▼
Reaction (encapsulated internal domain)
    ├── Action₁ (Capability activation / Mechanism execution)
    ├── Action₂ (internal state transition or property mutation)
    ├── Action₃ (data transformation or internal signal propagation)
    └── ...
    │
    ▼ (internal emergent reactive process)
Outcome (external observable boundary)
```

#### Encapsulated Internal Domain: `Action = internal`

An `Action` belongs exclusively to the interior of the UCA. It is not by itself part of the observable contract between UCAs:

```text
UCA A
   │
   │ Reaction (encapsulated)
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

A consuming UCA (`UCA B`) **MUST NOT** need to know the internal `Actions`, mechanisms, or procedural sequence by which an `Outcome` was produced to react to it.

#### Encapsulation of Mechanisms and Process

- **Capability vs. Mechanism**: A `Capability` is declared in the functional contract as an operational capacity of the unit. A `Mechanism` ($m \in \mathbb{M}$) is the internal computational procedure that provides it. Another UCA must not couple to the internal execution sequence of a Mechanism.
- **Internal Emergent Process**: The `Reactive Process` is the emergent dynamic produced by interactions across Capabilities according to their `Disposition`. That process is **internal** to the unit and does not constitute the observable contract between UCAs.

#### Internal Interchangeability Without Breaking Consumers

A UCA can modify its internal implementation (for example, substituting one Mechanism for another or altering its internal Action sequence) without breaking consuming UCAs, as long as it preserves its functional contract and observable Outcome specifications:

```text
Ear UCA
├── Disposition₀ / internal implementation: Sherpa Mechanism
└── Disposition₁ / internal implementation: alternative ASR engine

Consumers (Thalamus):
Continue depending exclusively on the Outcome (text: "Hola"), not on the internal mechanism.
```

---

### 2.10 Outcome (O)

> **Outcome is an observable change produced by a UCA as a consequence of its activity.**

`Outcome` is defined strictly with respect to the producing UCA:

```text
UCA A
   │
   │ activity / Reaction
   ▼
observable Δx
   │
   └── Outcome(A, Δx)
```

`Outcome` ($o \in \mathbb{O}$) represents the observable change effectively produced by the activity or reaction of the UCA:

$$\text{produces}(u, o)$$

(shorthand notation: $(u, s) \to o$).

Internal `Actions` contribute operationally to producing the Outcome, but that relationship belongs to the unit's encapsulated process and is not exposed as a public composition relation.

Fundamental ontological distinction:
```text
STIMULUS (S): Reception by a UCA of an external observable change that triggers its reaction.
OUTCOME (O):  Structured observable change produced by a UCA as a consequence of its activity.
```

The Outcome strictly belongs to the executing unit as its specification of external observable consequences.

#### Anatomy and Canonical Structure of Outcome

Analogously to how `Disposition` explicitly defines the parametric and interactive conditions of a UCA, every `Outcome` is formally structured into three mandatory constitutive components:

```text
Outcome
├── Properties
│   └── Definition of observable information produced by the UCA (without quality judgment).
├── Criteria
│   └── Objective, non-subjective rules on Properties to deterministically evaluate the Outcome.
│       └── Criterion { Observation, Condition, Expected }
└── Owner
    └── External UCA in whose operational context the unit operates, holding exclusive validation authority.
```

1. **Outcome.Properties**:
   Defines what observable information was effectively produced by the UCA in its reaction. It represents pure observable content without valuation, rating, or quality judgment (e.g., `text: string`, `latency: number`, `confidence: number`, `chunks: Chunk[]`). The Properties form the empirical substrate upon which observations and evaluations occur.

2. **Outcome.Criteria**:
   Defines the set of non-subjective, deterministic, and formally verifiable rules for checking Outcome compliance. The `Criteria` evaluate **observable Properties** and must not depend on internal Action sequences or internal Mechanism invocations. Each individual `Criterion` is structured as a 3-tuple:
   - **Observation**: The observable property or computed value subjected to evaluation (e.g., `latency`, `text.length`, `chunks.length`).
   - **Condition**: The objective logical operator applied ($=, \neq, <, \le, >, \ge, \in$).
   - **Expected**: The reference value or admissible range required to satisfy the rule (e.g., `300ms`, `> 0`, `[0.0..1.0]`).

3. **Outcome.Owner**:
   Identifies the external UCA ($u_{\text{owner}} \in \mathbb{U}, u_{\text{owner}} \neq u_{\text{target}}$) in whose operational context the observable consequences of the Outcome are consumed, integrated, or take effect. The Owner is the sole entity formally authorized to emit a validation judgment and acceptance decision, validating the observable consequences rather than internal action sequences.

#### Evaluation and Decision: Compliance vs. Validation

The UCA model strictly distinguishes between the objective verification of an Outcome's criteria and the operational decision to accept it:

```text
Target UCA
    │
    ▼
 Outcome
    │
    ├── Criteria ──────► Compliance (PASS | FAIL)   [Deterministic objective evaluation]
    │
    └── Owner ─────────► Validation (APPROVED | REJECTED) [External contextual decision]
```

- **Compliance ($\text{comp} \in \{\text{PASS}, \text{FAIL}\}$)**:
  The deterministic, computable evaluation of an Outcome's `Criteria`.
  $$\text{complies}(o) = \begin{cases} \text{PASS} & \text{if } \forall c \in o.\text{Criteria}, \text{eval}(c, o.\text{Properties}) = \text{true} \\ \text{FAIL} & \text{otherwise} \end{cases}$$
  It admits no subjectivity, interpretation, or contextual heuristics. Any observer or evaluating mechanism executing the same Properties against the same Criteria obtains identical Compliance results.

- **Validation ($\text{val} \in \{\text{APPROVED}, \text{REJECTED}\}$)**:
  The contextual fitness judgment and operational decision emitted exclusively by the `Owner`.
  $$\text{validates}(u_{\text{owner}}, o) \in \{\text{APPROVED}, \text{REJECTED}\}$$
  The Owner determines whether the observable consequences of the Outcome are admissible, pertinent, and operationally useful within its own domain and functional context.

#### Strict Dissociation: Compliance ≠ Validation

`Compliance` and `Validation` are formally orthogonal dimensions. Assuming equivalence or one-way implication between them is strictly prohibited:

- **$\text{complies}(o) = \text{PASS} \not\implies \text{validates}(u_{\text{owner}}, o) = \text{APPROVED}$**: An Outcome may satisfy all technical criteria objectively and yet be rejected by the Owner due to situational inadequacy.
- **$\text{complies}(o) = \text{FAIL} \not\implies \text{validates}(u_{\text{owner}}, o) = \text{REJECTED}$**: An Outcome may fail a formal technical criterion and yet be accepted by the Owner due to contextual tolerance, urgency, or operational resilience.

From this dissociation emerge four irreducible empirical evidence states:

| Compliance | Validation | Empirical and Operational Meaning |
|---|---|---|
| `PASS` | `APPROVED` | **Full Alignment**: The Outcome satisfies objective criteria and is contextually fit for the Owner's needs. |
| `PASS` | `REJECTED` | **Criteria False Positive / Contextual Misalignment**: The Outcome meets technical rules, but the Owner discards it due to semantic or environmental factors uncaptured by Criteria. |
| `FAIL` | `APPROVED` | **Operational Tolerance / Situational Resilience**: The Outcome fails a formal criterion (e.g., slight latency degradation), but the Owner deems it sufficient or necessary under live circumstances. |
| `FAIL` | `REJECTED` | **Concurrent Failure**: The Outcome violates objective specifications and lacks operational utility for the Owner's context. |

#### Strict Invariant: Prohibition of Self-Validation

> **The Target UCA MUST NOT validate or approve its own Outcomes.**
> $$\forall o \in \mathbb{O}, \quad \text{hasOwner}(o, u_{\text{owner}}) \implies u_{\text{owner}} \neq u_{\text{target}}$$

A Target UCA may deterministically compute the `Compliance` of its own criteria (as this is an objective computation over its `Properties`), but **it ontologically lacks the contextual perspective and authority to validate itself**. Any validation not originating from an independent external Owner is formally invalid in the UCA model.

#### Partial Outcomes and Streaming

A UCA is not required to produce a single final Outcome. An activation may emit multiple partial Outcomes continuously (streaming):

```text
Stimulus: s
   │
   ▼ triggers
Target UCA: u
   │
   ▼ produces (temporal stream of Outcomes)
Outcome₀ (Properties₀, Criteria₀, Owner) ──► (Compliance₀, Validation₀)
Outcome₁ (Properties₁, Criteria₁, Owner) ──► (Compliance₁, Validation₁)
Outcome₂ (Properties₂, Criteria₂, Owner) ──► (Compliance₂, Validation₂)
...
```

In continuous flow systems (such as audio or real-time processing), each partial Outcome reflects a discrete chunk of output generated under the UCA's Purpose during its Action.

Formally, the emission sequence establishes a strictly chronological temporal precedence:
$$\text{precedes}(o_0, o_1) \land \text{precedes}(o_1, o_2) \land \dots$$

**Temporal Neutrality and Independence**:
The relation $\text{precedes}(o_0, o_1)$ strictly and solely asserts that $o_0$ occurred chronologically before $o_1$. It **MUST NOT** be interpreted as an evaluative, superiority, or improvement relation ($o_2 > o_1$ is invalid). Each partial Outcome is evaluated deterministically for its own `Compliance` and validated contextually by its `Owner`.

---

### 2.11 Reception: Universal and Non-Cognitive Mechanism of UCA Core

> **Reception is the mechanism by which a UCA receives an external observable change to its domain that may trigger its reaction.**

Normative characteristics of `Reception`:
- **Universal**: Every UCA possesses a reactive boundary capable of receiving external changes relevant to its domain.
- **Mechanical**: It is a purely deterministic and operational process of ingesting/admitting the change at the boundary of the unit.
- **Reactive**: Connects the presence of external change with the internal predisposition of the unit.
- **Non-cognitive**: Does not require semantic interpretation, reasoning, memory, consciousness, or language models.
- **Constitutive of UCA Core**: Belongs to the minimal non-negotiable contract of every UCA.

#### Connection Between Reception, Disposition, and Stimulus

The reception of an observable change does not imply that any UCA must react to it. The declarative `Disposition` of the unit determines how it is predisposed to interact and react:

```text
external Δx
    │
    ▼
Reception
    │
    ▼
Disposition
    │
    ├── relevant / configured ──► Reaction (materializes Stimulus)
    │
    └── not configured / ignored ──► no Reaction (does not become Stimulus)
```

When mechanical reception of an observable change triggers a reaction according to the UCA's functional and reactive configuration:
$$\text{Reception}(u, \Delta x) + \text{Reaction}(u, \Delta x) \implies \text{Stimulus}(u, \Delta x)$$

#### A UCA Does Not Need to Be Cognitive to React

A UCA can receive a Stimulus and react in a purely functional manner without executing any cognitive or perceptual process:

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

This is fully sufficient to satisfy the UCA reactive contract. It is strictly forbidden to require methods or phases such as `perceive()`, `interpret()`, or `reason()` in the specification or base class of a universal UCA.

---

### 2.12 Local Reactivity

> **No activation without a Stimulus.**
> **A UCA reacts strictly upon the reception of a Stimulus external to its own functional boundary.**

A UCA never executes spontaneously or through autonomous volition. It acts strictly in response to a Stimulus crossing its functional boundary.

The ultimate origin of that Stimulus — human, sensory, timed, homeostatic, or from another UCA — is a matter of Cognitive Architecture (§4), not UCA Core. Every UCA remains locally reactive.

---

### 2.13 UCA Boundary

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

### 2.14 Summary

The minimal complete model of an individual UCA:

```text
Structure:   u = (p, d, C, O) ∈ ℙ × 𝔻 × 𝒫(ℂ) × 𝕆_def  (where p determines what u is, d predisposes, C bounds, and O defines outcomes)
Stimulus:    s ∈ 𝕊                                      (reception of an external observable change triggering reaction of u)
Reaction:    (u, s) → o                                 (shorthand for: triggers(s, u) ∧ produces(u, o); internally s → Reaction(u) → o)
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
- UCA A requires the reactive result (Outcome) of UCA B to complete its internal reaction.
- UCA A does not coordinate, orchestrate, or control UCA B.
- UCA A does not instruct UCA B nor impose a purpose upon it: UCA A exposes or emits a signal that crosses the boundary of UCA B as an external Stimulus, and UCA B reacts according to its own Purpose B, Capabilities B, and Disposition B.
- There is no Purpose transfer ($p_A \not\to B$) nor creation of inter-unit directives or commands.

---

### 3.2 Terminal Capabilities

> A Capability becomes another UCA only when there is a dedicated, functionally differentiated Purpose.
> When differentiated purposes no longer emerge and only mechanisms remain, terminal capabilities have been reached.

If a component executes a mechanical or algorithmic function without a stable, independent Purpose, it remains a terminal capability and should not be modeled as a UCA.

---

### 3.3 Outcome → Stimulus Relationships as a Reactive Relation

It is crucial to recognize that `Outcome` and `Stimulus` are neither two disjoint data types nor technical entities requiring ontological conversion or a runtime wrapper in the critical path (such as a hypothetical `convertToStimulus()`):

> **The observable change produced by a UCA constitutes an Outcome with respect to the producing UCA. The reception of that change by another UCA, when triggering its reaction according to its Disposition, constitutes a Stimulus with respect to the receiving UCA.**

They represent different positions within the same reactive relationship:

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

Formally:
$$\text{Outcome}(u_A, \Delta x) \land \text{receives}(u_B, \Delta x) \land \text{triggers}(\Delta x, u_B) \implies \text{Stimulus}(u_B, \Delta x)$$

#### Not Every Outcome Constitutes a Stimulus

A UCA may produce an observable change without any other UCA reacting to it. Therefore:
$$\text{Outcome}(u_A, \Delta x) \not\implies \exists u_B : \text{Stimulus}(u_B, \Delta x)$$

If no other UCA is predisposed in its Disposition to react to that change, the observable change exists and remains an Outcome of $u_A$, but never becomes a Stimulus for any unit in the system.

Only when a receiving unit exists:
```text
Outcome(A, Δx)
       │
       ▼
Reception(B, Δx)
       │
       ▼ (Disposition triggers reaction)
Reaction(B)
```
does the change constitute a `Stimulus` with respect to `B`.

#### Normative Example: `Ear UCA` and Encapsulated Domain

The following example illustrates the strict boundary between the internal process of a UCA and the observable consequence consumed by another:

```text
Ear UCA
├── Functional Contract:
│   ├── Purpose: Transcribe human speech into text
│   └── Capabilities: SpeechRecognition
├── Constitution:
│   └── Disposition: model = "base", bufferSize = 1024, hotwordsScore = 2.5
├── Encapsulated Internal Domain (Reaction):
│   ├── Action₁: capture audio frame
│   ├── Action₂: convert PCM and normalize
│   ├── Action₃: acoustic echo cancellation (AEC)
│   ├── Action₄: voice activity detection (VAD)
│   ├── Action₅: execute Sherpa inference engine (Mechanism)
│   ├── Action₆: aggregate token probabilities
│   └── Action₇: update transcription buffer
└── Observable Consequence (Outcome):
    ├── Properties: text = "" → "Hello", latency = 115ms, confidence = 0.94
    ├── Criteria: text.length > 0, latency < 300ms, confidence >= 0.70
    └── Owner: Thalamus UCA
```

From outside the unit:

```text
Ear UCA
 │
 │ [Encapsulated internal Reaction: capture frame, PCM, AEC, Sherpa, tokens...]
 │
 ▼
observable change (Δtext)
 │
 ├── Outcome(Ear): text = "Hello"
 │
 ▼
Signal / Impulse (runtime propagation mechanism)
 │
 ▼
Thalamus UCA
 │
 ├── Reception (mechanical at the boundary)
 │
 ├── Stimulus(Thalamus) (triggers reaction according to Disposition)
 │
 └── Reaction(Thalamus)
```

The consuming UCA (`Thalamus`) **does not need to know** the PCM conversion, AEC, Sherpa execution, or token aggregation to react to `"Hello"`. It reacts exclusively to the observable change at its boundary (`Stimulus`).

Furthermore, if `Ear UCA` modifies its internal implementation (for example, substituting the Sherpa Mechanism for another engine or reorganizing its internal Action sequence), `Thalamus` continues operating without disruption as long as the Outcome contract and Properties are preserved.

---

### 3.4 Reactive Succession and Activation Chains

Through Outcome → Stimulus relationships, UCAs form reactive activation chains:

```text
u_i ──(produces)──► o_i ──(as s_j)──► triggers(s_j, u_j) ──(produces)──► o_j ──► ...
```

Shorthand notation:
```text
(u_i, s_i) → o_i → s_j → (u_j, s_j) → o_j → ...
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
  Reaction A requires Outcome of UCA B
    │
    └── Stimulus B
            ↓
          UCA B
            ↓
          Reaction B requires Outcome of UCA C
            │
            └── Stimulus C
                    ↓
                  UCA C ──► Reaction C ──► Outcome C
                    ↓
          Outcome C available to Reaction B
            ↓
          Outcome B
    ↓
  Outcome B available to Reaction A
    ↓
  Outcome A
```

This means:
- A *requires* the Outcome of B to complete its Reaction.
- B *requires* the Outcome of C to complete its Reaction.
- A does not coordinate B. A does not know or control C.
- A does not know nor need to know the internal Actions or Mechanisms of B or C.
- Each unit remains bounded by its own Purpose and encapsulated within its Reaction.

---

## 4. Cognitive Architecture

Cognitive Architecture defines how multiple UCAs are organized, connected, and governed within an overall system.

Cognitive Architecture is distinct from the UCA primitive. It organizes and connects UCA primitives; it does not alter what a UCA is. The normative definition of a UCA belongs strictly to the UCA Core.

---

### 4.1 Evaluation under Explicit Criteria

In cognitive architectures, the evaluation of an Outcome represents the systematic analysis of its consequences against explicit criteria (e.g., accuracy, latency, coherence, stability, or error rate).

> The Outcome belongs to whoever executes.
> Evaluation belongs to whoever demands execution.

The executing UCA produces the Outcome as the observable consequence of its Action. It is not required to evaluate itself to rule on the quality or utility of its result; it is the entity demanding execution (the external `Owner`) who holds the operational need, situational context, and exclusive authority to validate whether the produced consequences satisfy its demand.

A Cognitive Architecture may define or delegate to specialized UCAs to record and correlate evidence, but contextual validation always belongs to whoever demanded execution:

```text
Demanding Entity / Owner (UCA₁)
        │ (demands execution)
        ▼
Target Executor (UCA₂)
        │
        └── Outcome (Properties, Criteria, Owner: UCA₁)
                │
                ├── Criteria ──► Compliance (PASS | FAIL) [Deterministic]
                │
                └── Owner ─────► Validation (APPROVED | REJECTED) [Contextual]
```

Evaluation is constructed purely through composition and decoupling of roles. No intrinsic self-evaluation mechanism is required within the UCA Core.

---

### 4.2 Perception and Interpretation as Specialized Composition

Perception and interpretation are **not** universal phases of a UCA's reactive cycle in the Core. They are specialized cognitive responsibilities modeled exclusively through composition.

The fundamental distinction of the model is:

```text
Reception (UCA Core)
=
mechanical, universal, reactive, and non-cognitive

Perception (Cognitive Architecture / Composition)
=
specialized and optional function performed by UCAs
whose Purpose requires interpreting or giving meaning to received information
```

Therefore:
$$\text{Reception} \ne \text{Perception}$$
$$\text{Stimulus does NOT require Perception}$$

> **Perception is the functional interpretation of received information performed by a UCA whose Purpose requires such interpretation.**

Normative characteristics of `Perception`:
- **Optional**: The vast majority of UCAs in a reactive system execute mechanical transformations without requiring perception.
- **Specialized**: Responds to a dedicated declarative Purpose oriented toward decoding, interpreting, or structuring unstructured information.
- **Compositional**: Emerges from the interaction of dedicated capabilities within the specialized UCA.
- **Purpose-dependent**: Exists only if the unit's Purpose demands it.

#### Example of Perception Through a Specialized UCA

When perceptual interpretation is necessary in a cognitive architecture, it emerges through the composition of specialized units:

```text
Microphone (hardware device / external environment)
    │
    ▼
audio change (observable acoustic change)
    │
    │ Reception (mechanical at the boundary)
    ▼
Ear UCA
    │
    │ Stimulus (triggers reactive process)
    ▼
Speech Recognition (interpretive capability)
    │
    │ perceptual interpretation
    ▼
"Hello" (structured text)
    │
    │ Outcome(Ear)
    ▼
Thalamus UCA
    │
    │ Reception ──► Stimulus(Thalamus)
    ▼
react()
```

In this scenario, `Ear UCA` acts as a perceptual unit because its `Purpose` and `Capabilities` (speech recognition) provide interpretation and meaning to the received change. However, this interpretive capability is an exclusive property of the specialization of `Ear`, **NEVER** of the universal contract of `Uca` as a functional primitive.

Any arbitrary UCA does not require methods such as `perceive()`, `interpret()`, or symbolic reasoning to fully satisfy the UCA Core contract.

---

### 4.3 Evolution and Atomic Mutation of Disposition Based on Historical Evidence

The Core defines that Disposition conditions the behavior and interactions of a unit.

> **Evolution is the process by which specialized UCAs use historical evidence of other UCAs' activity to determine permitted changes to their Disposition, preserving their Purpose, Capabilities, and the Nature of their Properties and Interactions.**

Fundamental ontological distinction:
```text
Conception: Determines what UCA exists (functional identity, capabilities, initial disposition, and Outcome definition).
Evolution:  Mediated process that modifies how that same UCA behaves and interacts through permitted changes
            to its Disposition, guided by analysis of accumulated multi-execution historical evidence.
```

```text
Conception
     │
     ▼
Target UCA₀ (p, d₀, C, O)
     │
     │ Multi-event recorded executions
     ▼
History (H₀ ∈ ℍ) ──► [Tracking ──► Analysis ──► Evolution]
                                                      │
                                                      ▼
                                       Mutation Proposal μ₁ (atomic)
                                                      │
                                                      ▼
Target UCA₁ (p, d₁, C, O)  where d₁ = difference(d₀, d₁)
     │
     │ Subsequent multi-event recorded executions
     ▼
History (H₁ ∈ ℍ) ──► [Tracking ──► Analysis ──► Evolution]
                                                      │
                                                      ▼
                                       Mutation Proposal μ₂ (atomic)
                                                      │
                                                      ▼
Target UCA₂ (p, d₂, C, O)  where d₂ = difference(d₁, d₂)
     │
    ...
```

#### Functional Roles of the Evolutionary Architecture

The evolution of a UCA is never performed as unsupervised internal self-adaptation, but rather through three specialized, decoupled functional responsibilities or roles:

1. **Tracking (Observable History Logging)**:
   Immutably records the evidence generated during executions of the Target UCA. Each history entry formally captures the multivariable tuple:
   $$h = [s, o, \text{Compliance}, \text{Validation}, d, \text{timestamp}, \mu, x] \in \mathbb{H}$$
   Where:
   - $s \in \mathbb{S}$: Stimulus received that triggered the reaction.
   - $o \in \mathbb{O}$: Outcome produced ($o.\text{Properties}$).
   - $\text{Compliance} \in \{\text{PASS}, \text{FAIL}\}$: Deterministic evaluation of the Criteria of $o$.
   - $\text{Validation} \in \{\text{APPROVED}, \text{REJECTED}\}$: Acceptance judgment emitted exclusively by the Owner.
   - $d \in \mathbb{D}$: Active effective disposition of the UCA at execution time.
   - $\text{timestamp}$: Immutable temporal point of execution.
   - $\mu \in \mathbb{M}\text{ut}$: Identifier or version of the active mutation.
   - $x \in \mathbb{X}$: Situational or environmental support context.

2. **Analysis (Pattern Identification and Correlation)**:
   Examines the accumulated multi-execution historical corpus ($H \in \mathbb{H}$) without intervening in the direct reactive flow. Its responsibility is to uncover systematic empirical correlations between specific Disposition parameters ($d$), situational context ($x$), and cross-results of Compliance and Validation (e.g., *"bufferSize = 2048 correlates with a 41% latency failure rate under high concurrency, compared to a 4% failure rate when bufferSize = 1024"*).

3. **Evolution (Determining and Proposing Atomic Mutations)**:
   From historical analysis, derives adjustment hypotheses and formulates an admissible atomic mutation ($\mu \in \mathbb{M}\text{ut}$) on the Target UCA's Disposition, formally verifying that it satisfies Nature constraints prior to emission.

#### Experimental Relation $\text{Disposition} \to \text{Outcome}$ and Encapsulated Evidence

External evaluation and evolutionary analysis treat the UCA as an encapsulated functional unit.
Given stimulus $s$ and disposition $d$ of UCA $u$, the outcome $o$ is observed empirically:

$$(u, d, s) \to o$$

without requiring recording or inspecting the internal trace of individual actions ($a_1, a_2, \dots, a_n$).

The historical logging of evidence is primarily grounded in the correspondence between effective configurations and observable results:

$$(D_0, O_1, \text{Comp}_1, \text{Val}_1), \quad (D_0, O_2, \text{Comp}_2, \text{Val}_2), \quad \dots, \quad (D_1, O_n, \text{Comp}_n, \text{Val}_n)$$

#### Evolution Modifies Disposition, Not Actions Directly

Evolution acts exclusively upon the constitution and predisposition of the unit:

$$\text{Disposition}_0 \longrightarrow \text{Outcomes} \longrightarrow \text{Compliance / Validation} \longrightarrow \text{History} \longrightarrow \text{Analysis} \longrightarrow \Delta\text{Disposition} \longrightarrow \text{Disposition}_1$$

The `Evolution` role formulates and applies atomic mutations upon `Disposition` ($\Delta D = \text{difference}(D_0, D_1)$). It **MUST NOT** rewrite or directly intervene in internal `Actions`. Future actions and transitions will change emergently and intrinsically as a consequence of the new Disposition, Mechanisms, and internal interactions.

> **Role Composability**:
> `Tracking`, `Analysis`, and `Evolution` are composable functional responsibilities, not rigid mandatory class names of the UCA Core. A cognitive architecture may instantiate them as independent UCAs (e.g., `Tracker UCA`, `Analyzer UCA`, `Evolution UCA`) or integrate them into composite cognitive organs (such as a `Cingulate UCA`).

#### Strict Invariant: Prohibition of Direct Self-Evolution on Isolated Outcomes

> **A Target UCA MUST NOT self-evolve directly in response to an isolated Outcome.**

The UCA model categorically prohibits a unit from altering its own `Disposition` as an immediate reaction to a single produced or evaluated Outcome. Immediate reactive adaptation conflates operational process with ontological evolution, introducing parametric instability, single-case biases, and uncontrolled feedback loops. Evolution requires a critical mass of accumulated historical evidence and specialized mediation.

#### Principle of Atomic Mutation

> **The minimal unit of Evolution is an atomic Mutation of the Disposition.**

A Mutation ($\mu \in \mathbb{M}\text{ut}$) produces an alteration $\Delta D = \text{difference}(D_0, D_1)$ that must be:
- **small and identifiable**: focused on a concrete Property or Interaction;
- **bounded**: circumscribed to the limits of Nature ($\text{satisfies}(\text{val}', n)$);
- **validable**: formally verifiable prior to application;
- **measurable**: empirically observable in subsequent historical Outcomes;
- **reversible**: capable of being restored if subsequent historical evidence is unfavorable;
- **attributable**: traceable to the evidence analysis that motivated it.

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

#### Temporal Sequentiality and Disposition Reversibility

Every UCA maintains an immutable chronological sequence of its effective configurations:

$$[D_0, D_1, \dots, D_n]$$

- **Conception State ($D_0$)**: Represents the initial baseline disposition declared physically on the class at unit inception. It forms the absolute lower boundary of reversibility (a UCA cannot revert to a state prior to its own conception).
- **Reactive Reversibility**: In the presence of unfavorable historical evidence or operational restoration demands, the UCA can revert its state to any previous configuration $D_k$ via `revert()` or `revertTo(version)`.
- **Biological Synchronization**: Value restoration upon reversion is intrinsically reactive: each property updated during rollback emits its corresponding `MutationEvent`, ensuring that the composite organism and channel subscribers immediately synchronize with the restored state.

#### Inviolable Boundaries of Evolution

Evolution operates under three independent invariant predicates, ensuring that mutation cannot violate identity, functional boundaries, or the nature of properties:

$$\forall \mu \in \mathbb{M}\text{ut} \text{ applied to } u = (p, d, C, O):$$

1. **Purpose Preservation (Identity Invariant)**:
   $$\text{preservesPurpose}(u, \mu)$$
   The Purpose is the identity invariant: it cannot mutate.

2. **Capability Boundaries (Functional Domain)**:
   $$\text{withinCapabilities}(u, \mu)$$
   Capabilities define the operational boundaries: unconstituted capabilities cannot be dynamically acquired by mutation.

3. **Satisfaction of Nature (Domain of Properties and Interactions)**:
   $$\forall \text{val}' \in \mu, \quad \text{satisfies}(\text{val}', n_{\text{target}})$$
   Nature delimits the valid mutation space of each property or interaction.

---

### 4.4 Evolutionary Observation, Historical Evidence, and Semantics of $\Delta$

The full evolutionary observation flow operates through the decoupling of reactive execution and multi-execution historical analysis:

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
                  Nature Validation ────► Mutation Proposal (μ)
                                            │
                                            ▼
                     Target UCA ◄──── ΔDisposition = diff(D₀, D₁)
```

#### Strict Semantics of $\Delta\text{Disposition}$

> **$\Delta\text{Disposition} = \text{difference}(D_0, D_1)$ represents exclusively the difference in state or configuration between two temporal observations. It NEVER denotes intrinsic improvement, absolute optimization, or metaphysical progress.**

State $D_1$ resulting from applying mutation $\mu$ constitutes strictly an **empirical hypothesis**. Asserting that $D_1$ is "better" than $D_0$ lacks ontological meaning in the UCA Core. The practical validity of $D_1$ depends entirely on how subsequent executions behave in the new historical observation window, subject to deterministic `Compliance` and contextual `Validation` by the `Owner`.

#### Principles of Evolutionary Observation

1. **Declarative Interpretation without Hardcoded Coupling**: The evolutionary observer inspects `Property.Function`, `Property.Nature`, `Property.Value`, and `Interactions` (Definition, Target, Signal, When), reasoning on adaptation without requiring code specific to each Capability nor confusing parametric functions with the dedicated Purpose of the UCA.
2. **Strict Validation Against Nature**: No mutation may be applied if it violates the declared `Nature` of the property ($\neg\text{satisfies}(\text{val}', n)$). Evolutionary safety stems from declarative constitution itself.
3. **Out of the Critical Execution Path**: Evolutionary roles operate asynchronously, decoupled, and on accumulated evidence. They do not constitute a synchronous arbiter or bottleneck for Target UCA reactions.
4. **Bounded Local Optimization**: The optimization context remains small and localized:
   ```text
   Target UCA Purpose + Capabilities + Properties + Interactions + History (H) ──► Analysis Context
   ```
5. **Experimental Falsifiability and Explicit Evaluation**: Every atomic mutation generates an empirically testable hypothesis evaluated against a new series of historical Outcomes:
   - **Favorable evidence**: The rate of `Compliance: PASS` and `Validation: APPROVED` in subsequent history supports the hypothesis under the Owner's criteria.
   - **Neutral evidence**: Subsequent history demonstrates no statistically meaningful variations.
   - **Unfavorable evidence**: Subsequent history demonstrates degradation or repeated rejection (triggering reversion to $D_0$ via `revert()`).

> **Distinction Between Equality and Evaluative Equivalence**:
> Two structurally identical Outcomes $o_1$ and $o_0$ may have been emitted under distinct contexts, and two distinct Outcomes may be evaluatively equivalent under a specific criterion without being equal. The specification rejects using $o_1 > o_0$ or $o_1 = o_0$ as generic evaluative predicates without explicit criteria.

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
oᵢ ──Reception──► Stimulus ──triggers──► uⱼ ──Reaction──► produces(uⱼ, oⱼ) ──drives──► Δdᵢ
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

> **Can cognitive behaviour emerge from the interaction of purpose-bounded UCAs, while each individual unit remains structurally limited to $u = (p, d, C, O)$ and behaviorally limited to $(u, s) \to a \to o$?**

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

Canonical Structured Outcome
│
├── Properties:
│   ├── text: string       (textual transcript produced)
│   ├── start: number      (temporal start in milliseconds)
│   ├── end: number        (temporal end in milliseconds)
│   └── latency: number    (processing elapsed time in milliseconds)
│
├── Criteria:
│   ├── textNotEmpty:  { Observation: "text.length", Condition: ">", Expected: 0 }
│   ├── validDuration: { Observation: "end - start",  Condition: ">=", Expected: 0 }
│   └── maxLatency:    { Observation: "latency",      Condition: "<=", Expected: 300 }
│
└── Owner: Agent UCA       (external UCA holding validation authority)
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
Ear Outcome: Chunk { text, start, end, latency }
    │
    ├── Criteria ──────► Compliance (deterministic PASS | FAIL)
    └── Owner (Agent) ─► Validation (contextual APPROVED | REJECTED)
```

#### Canonical Scenario of Mediated Historical Evolution: Ear UCA

To comprehensively demonstrate the evolutionary architecture and the decoupling between `Compliance`, `Validation`, and `Evolution`, consider the complete adaptation cycle over the parametric property `AudioFraming.bufferSize` of `Ear UCA`:

```text
Target UCA: Ear (Disposition: bufferSize = 2048, Nature: [512..4096])
    │
    │ Audio stimulus under concurrency
    ▼
 Outcome produced: { text: "cognitive architecture", start: 1200, end: 1850, latency: 410 }
    │
    ├── Criteria ──────► Compliance: FAIL (due to latency = 410ms > 300ms)
    │
    └── Owner (Agent) ─► Validation: REJECTED (Owner discards chunk due to unacceptable delay)
                            │
                            ▼
                       Tracker UCA
                            │
                            ▼
                         History (accumulated record of 1000 multi-event outcomes)
                            │
                            ▼
                       Analyzer UCA (correlates: bufferSize = 2048 yields 41% latency failure,
                            │        whereas bufferSize = 1024 yields only 4% failure)
                            ▼
                       Evolution UCA (formulates mutation proposal: bufferSize 2048 ──► 1024;
                            │        formally verifies satisfies(1024, Nature) = true)
                            ▼
                    Target UCA (Ear) applies atomic mutation:
                    D₁ = difference(D₀, D₁) with bufferSize = 1024
                            │
                            ▼
             Opening of new historical observation window
             (without assuming a priori D₁ > D₀, awaiting new evidence)
```

1. **Initial Constitution ($D_0$)**:
   `Ear UCA` is predisposed with `AudioFraming.bufferSize = 2048`. Its `Outcome` formally declares the criterion `latency <= 300ms` and names `Agent UCA` as its `Owner`.
2. **Reactive Execution**:
   A complex acoustic stimulus arrives. `Ear UCA` executes its reactive process and emits the Outcome:
   `o = { text: "cognitive architecture", start: 1200, end: 1850, latency: 410 }`.
3. **Deterministic Compliance Verification**:
   Evaluation of the Criteria of $o$ automatically and mathematically produces:
   `Compliance = FAIL` (the 410ms latency exceeds the 300ms upper threshold).
4. **Contextual Validation Judgment by Owner**:
   `Agent UCA` evaluates the Outcome within the ongoing live dialog. Because a 410ms lag disrupts conversational fluency, the Owner formally emits:
   `Validation = REJECTED`.
5. **Logging in Tracker UCA**:
   The `Tracker UCA` role captures the immutable evidence tuple and appends it to the historical collection:
   $$h_1 = [s, o, \text{Compliance: FAIL}, \text{Validation: REJECTED}, d_0, t_1, \mu_0, x_1] \in \mathbb{H}$$
6. **Evidence Accumulation in History**:
   Over time, 1000 Outcomes of `Ear UCA` are recorded across diverse CPU loads and acoustic environments.
7. **Correlational Analysis in Analyzer UCA**:
   The `Analyzer UCA` role evaluates the multi-execution historical corpus and uncovers a systematic pattern:
   - With `bufferSize = 2048`, the latency failure rate is **41%**.
   - In prior or comparable executions with `bufferSize = 1024`, the latency failure rate was only **4%**.
8. **Mutation Proposal in Evolution UCA**:
   The `Evolution UCA` role deduces that reducing the buffer size decreases wait time per frame and proposes the atomic mutation:
   $$\mu_1: \text{AudioFraming.bufferSize}: 2048 \longrightarrow 1024$$
   It verifies that $1024 \in [512..4096]$ (`satisfies(1024, Nature)`).
9. **Transition to $D_1$ and Falsifiability**:
   `Ear UCA` receives the mutation and updates its effective Disposition to $D_1$. This transition represents strictly $\Delta D = \text{difference}(D_0, D_1)$. The system **does not assume** that $D_1 > D_0$; a new observation window opens where `Tracker UCA` accumulates fresh evidence to empirically corroborate whether the hypothesis holds over time.

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
o₀ = { start: 0,   end: 400,  text: "I think", latency: 120 }
o₁ = { start: 400, end: 850,  text: "we should change", latency: 190 }
o₂ = { start: 850, end: 1200, text: "this architecture", latency: 210 }
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
 └── Reaction(u_A) ──produces──► o_A ──Reception──► s_B
                                                     │
                                                     ▼
                                         u_B (Purpose: perceive)
                                                     │
                                                     └── Reaction(u_B): perceive
                                                             │
                                                             └── produces(u_B, o_B): perceived representation
```

`u_B` is structurally identical to any other UCA: $u_B = (p_B, d_B, C_B) \in \mathbb{U}$. Its Purpose requires perception.

---

### 7.3 Observation Through Composition

Observation may likewise be the function performed by the Reaction of a UCA:

```text
s_C ──triggers──► u_C (Purpose: observe and interpret)
                   │
                   └── Reaction(u_C): observe
                           │
                           └── produces(u_C, o_C): structured observation
                                                   │
                                                   ▼ (Reception)
                                          s_D ──triggers──► u_D
```

---

### 7.4 Disposition Adaptation Through Composition

A UCA may adapt the Disposition of another through a standard activation chain:

```text
u_A (Disposition d_A,0)
 │
 └── produces(u_A, o_A)
          │
          ▼ (Reception) triggers
      s_B ──► u_B (Purpose: evaluate and adapt behavior)
               │
               └── produces(u_B, o_B): Δd_A
                                 │
                           d_A,0 ──mutation──► d_A,1  (applied to u_A)
```

Where $\Delta d_A = \text{difference}(d_{A,0}, d_{A,1})$. `u_B` requires no special structure. Its Purpose justifies its activity.

---

### 7.5 Emergent Behaviour Through Composition

A network of UCAs, each bounded to $(u, s) \to o$, may exhibit behaviour that no individual unit contains:

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
   $$\forall u \in \mathbb{U}, \exists s \in \mathbb{S} : \text{triggers}(s, u)$$
5. **Purpose-Driven Internal Reaction**: Executes an internal process of Reaction composed of Actions and interactions pursuing its Purpose within the boundaries of its Capabilities and Disposition.
   $$\forall (u, s) \text{ active}, \exists r \in \mathbb{R}\text{xn} : \text{triggers}(s, u)$$
6. **Structured and Governed Outcome Production**: Produces one or more observable Outcomes structured into $(\text{Properties}, \text{Criteria}, \text{Owner})$, where Criteria are deterministic and the Owner is an external UCA.
   $$\forall (u_{\text{target}}, s) \text{ active}, \exists o \in \mathbb{O} : \text{produces}(u_{\text{target}}, o) \land \text{hasOwner}(o, u_{\text{owner}}) \land (u_{\text{owner}} \ne u_{\text{target}})$$
7. **Purpose-Driven Decomposition**: Treats another component as a UCA only if that component possesses a dedicated, differentiated Purpose.
   $$\forall u' \text{ composed in } u, u' \in \mathbb{U} \iff \exists! p' \in \mathbb{P} : \text{hasPurpose}(u', p') \land p' \neq p_u$$

### 8.1 Fundamental Invariants of the UCA Model

Every system or architecture conforming to UCA MUST strictly satisfy the following normative invariants:

1. **Constitutive Reactive Boundary**: Every UCA MUST possess a reactive boundary capable of receiving external observable changes to its functional domain.
2. **Relational Nature of Stimulus**: `Stimulus` is the reception by a UCA of an external observable change to its domain that triggers its reaction.
3. **Nature of Outcome**: `Outcome` is an observable change produced by a UCA as a consequence of its activity, structured into `Properties`, `Criteria`, and `Owner`.
4. **Scope of Externality**: `External` is determined strictly relative to the boundary of the receiving UCA, not necessarily relative to the entire system.
5. **Relational Character without Transformation**: `Outcome` and `Stimulus` are relational concepts referring to the same observable change and do NOT require different runtime entities or ontological conversion functions.
6. **No Automatic Inference of Stimulus**: An `Outcome` does NOT automatically constitute a `Stimulus` for any UCA; it only becomes a `Stimulus` when its reception triggers the reaction of a receiving UCA predisposed by its `Disposition`.
7. **Constitutive and Non-Cognitive Reception**: `Reception` is the universal, mechanical, and non-cognitive mechanism of change ingestion at the UCA boundary. It does not imply cognition, interpretation, or reasoning.
8. **Specialized and Optional Perception**: `Perception` is the functional interpretation of received information performed exclusively by a specialized UCA whose explicit `Purpose` requires such interpretation.
9. **Perceptual Independence of Stimulus**: A `Stimulus` does NOT require prior cognitive `Perception` to trigger the reactive reaction of a UCA.
10. **Decoupling Between Core Semantics and Runtime**: `Signal` and `Impulse` are technical mechanisms and infrastructure transport vehicles in runtime, and MUST NOT be ontologically identified with `Stimulus` or `Outcome`.
11. **Deterministic Compliance**: `Compliance` MUST be evaluated deterministically through the objective verification of `Criteria` against `Properties`.
12. **Exclusive Validation Authority**: `Validation` MUST be emitted exclusively and contextually by the `Owner` of the Outcome (the entity demanding execution).
13. **Strict Prohibition of Self-Validation**: The `Target UCA` MUST NOT validate or approve its own `Outcomes` ($\text{hasOwner}(o, u_{\text{owner}}) \implies u_{\text{owner}} \neq u_{\text{target}}$).
14. **Strict Dissociation Compliance ≠ Validation**: `Compliance` does not imply `Validation` (`PASS` $\not\implies$ `APPROVED`, `FAIL` $\not\implies$ `REJECTED`). All four combinations are empirically valid and irreducible.
15. **Evolution Based on Historical Evidence**: The evolution of a UCA MUST be based on the analysis of accumulated multi-execution historical evidence ($H \in \mathbb{H}$).
16. **Prohibition of Direct Isolated Self-Evolution**: A UCA MUST NOT self-evolve directly in response to an individual or isolated `Outcome`.
17. **Mutation Safety and Atomicity**: Every `Disposition` mutation MUST be atomic, reversible, and strictly circumscribed within the boundaries of `Nature` ($\text{satisfies}(\text{val}, n)$).
18. **State Difference Semantics of $\Delta\text{Disposition}$**: $\Delta\text{Disposition} = \text{difference}(D_0, D_1)$ represents exclusively state difference, NEVER intrinsic improvement, qualitative progress, or a priori optimization.
19. **Encapsulation of Action**: `Action` is any internal operation or transition belonging to the `Reaction` of a UCA and MUST belong strictly to its encapsulated internal domain.
20. **Exclusive Observable Boundary in Outcome**: `Outcome` is the sole observable consequence of a UCA's activity. `Actions`, `Mechanisms`, internal interactions, and `Process` do NOT form part of the observable contract between UCAs.
21. **Consumer Independence from Internal Actions**: A consuming UCA MUST NOT require knowledge of internal `Actions`, mechanisms, or procedural sequences of another UCA to use its `Outcomes`.
22. **Evaluation Focused on Observable Consequences**: Outcome `Criteria` evaluate observable `Properties` and NOT sequences of internal `Actions` or calls to `Mechanisms`.
23. **Validation Scope**: The `Owner` validates the observable `Outcome` and NOT the internal sequence of `Actions` used to produce it.
24. **Disposition-Centric Evolution**: The evaluation and evolution of a UCA are grounded in the relationship between `Disposition` and observable `Outcomes` ($D \to O$). Evolution mutates `Disposition` ($\Delta\text{Disposition}$) and MUST NOT directly rewrite internal `Actions`.

**Non-Requirements for Conformance**:

A component does **not** need any of the following to conform to UCA:
- a secondary source of functional direction, nor a formal `Context` container as mandatory universal stimulus structures;
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

The central hypothesis of UCA (§6.6) has not yet been empirically validated. Future reference implementations must be designed to test whether cognitive behaviour can emerge from purpose-bounded units limited to $(u, s) \to o$.

### 9.4 Formal Relationship between Action and Reactive Process [CLOSED]

This question is formally resolved in §2.1 and §2.9:
1. **Reaction as Encapsulated Process**: `Reaction` is the internal process triggered in a UCA by a `Stimulus`, encompassing interactions among Capabilities and the emergent internal process.
2. **Action as Internal Operation**: `Action` ($a \in \mathbb{A}$) is any internal operation or transition (Capability activation, Mechanism execution, data transformation, property mutation) occurring within `Reaction`.
3. **Outcome as Sole Observable Boundary**: `Action` does not constitute an observable external interface. Only `Outcome` crosses the UCA boundary to the outside. Therefore, consuming UCAs couple exclusively to observable Outcomes and not to the sequence of internal Actions.

### 9.5 Semantics of Context Inclusion vs. Triggering in Outcome → Stimulus Relationships [CLOSED]

This question is formally resolved in §2.7, §2.11, and §3.3:
1. **Relational Relation**: `Outcome` and `Stimulus` do not represent two different data types nor do they require runtime transformation (`convertToStimulus()`). They represent distinct relational positions relative to different UCA functional boundaries: the observable change $\Delta x$ produced by the activity of $u_A$ constitutes an `Outcome` for $u_A$; the mechanical reception of that same change by $u_B$, when its `Disposition` triggers its reactive reaction, constitutes a `Stimulus` for $u_B$.
2. **No Automatic Inference**: An Outcome may exist without ever becoming a Stimulus if no other UCA is predisposed to react to it ($\text{Outcome}(u_A, \Delta x) \not\implies \exists u_B : \text{Stimulus}(u_B, \Delta x)$).
3. **Context Decoupling**: The contextual substrate ($x \in \mathbb{X}$) is an optional, compositional architectural pattern (§4), not a universal Core requirement. The distinction between direct stimulation and context depends exclusively on the `Disposition` of the receiving UCA.

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

The UCA Core establishes that every Action is the outcome of an emergent Reactive Process from an already constituted UCA $u = (p, d, C, O)$. Because the unit is intrinsically oriented by its Purpose, the action naturally emanates from that constitution. Whether the formal predicate $\text{servesPurpose}(a, p)$ contributes irreducible semantics or constitutes formal redundancy with respect to $p$ belonging to the constitution of $u$ ($\text{hasPurpose}(u, p)$) remains an open question, avoiding the risk of introducing non-computable teleological evaluations into minimal conformance criteria.

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

UCA explicitly acknowledges these intellectual influences and precedents. At the same time, UCA does not claim to be a copy, direct evolution, official extension, replacement, or unification of any of these architectures. Each was conceived to satisfy specific goals, constraints, and operational domains. UCA addresses its own specific problem: defining a **minimal and determinable functional primitive** ($u = (p, d, C, O)$) from which complex cognitive behavior can emerge through reactive composition.

### 10.2 Actor Model

The Actor Model (Hewitt, Bishop & Steiger, 1973; Agha, 1986) formulated one of the most influential approaches for designing concurrent and distributed systems based on independent units. In this model, an "actor" is an autonomous entity that, in response to an incoming message, can make local decisions, create new actors, send messages to other actors, and modify its internal state for future messages.

**Similarities with UCA**:
- **Isolation and Clear Boundaries**: Both abstractions reject shared mutable global state; each unit encapsulates its own behavior.
- **Reception-Triggered Activation**: An actor does not execute without receiving a message; a UCA reacts strictly upon the reception of a Stimulus external to its functional boundary.
- **Concurrency and Distribution**: Interaction does not rely on a centralized execution thread or shared locks.

**Conceptual Differences**:
- **Ontological Nature**: The Actor Model is primarily a computational abstraction for concurrency, parallelism, and message passing in distributed systems. UCA is a functional ontological primitive designed to bound identity and cognitive responsibility.
- **Explicit Constitution**: In the classic Actor Model, an actor is defined by its mailbox and dynamic behavior upon message receipt. In UCA, the unit is rigorously constituted by the formal tuple $u = (p, d, C, O)$, where **Purpose** ($p$) invariantly determines what it pursues, **Capabilities** ($C$) bound its operational limits, **Disposition** ($d$) transparently declares its properties and reactive interactions, and **Outcome** ($O$) formally defines its observable consequences with deterministic criteria and an external Owner holding validation authority.
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
- **Teleology: Purpose as Sole Functional Direction**: Soar places the concept of goal as the central abstraction guiding operator selection and impasse resolution during dynamic task execution. UCA, conversely, adopts **Purpose** as the sole constitutive functional direction of the unit and dispenses with goals as an activation primitive. In UCA, a unit does not receive external activation goals; it receives external signals (Stimuli) and reacts intrinsically according to what its Purpose already dictates that it pursues.
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
| **Teleological Direction** | Contrast with Soar, LIDA, BDI | Adoption of dedicated constitutive `Purpose` as sole source of functional direction. The UCA does not receive goals; it receives perturbations or data. |

---

### 10.11 UCA's Own Contract and Scope of Its Hypothesis

The review of architectural background and influences highlights that UCA does not need to claim the isolated invention of each of its guiding principles to establish its value. UCA's contribution lies in the **formal, minimalist, and bounded combination** of these principles within a strict ontological contract:

```text
CONSTITUTION:
u = (p, d, C, O)

Purpose (p)
    functionally determines what the UCA is and what it pursues.

Capabilities (C)
    delimit what the UCA can do.

Disposition (d)
    determines how its Capabilities are constituted and predisposed
    through Properties and Interactions.

Outcome (O)
    formally defines the observable consequences produced,
    with deterministic Criteria and an external Owner holding validation authority.

REACTIVE ACTIVATION:
External Signal ──► Stimulus ──► Target UCA ──► Reaction ──► Outcome (Criteria ──► Compliance, Owner ──► Validation)
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

   > **Coexistence of Capabilities Sharing the Same Mechanism / Class (§2.3)**: In strict accordance with Section 2.3, the identity of a Primitive Capability is determined by its Mechanism. Nothing prevents two distinct capabilities of the same organism from sharing the same concrete Mechanism or class (e.g., `leftEar` and `rightEar` sharing the `AcousticEar` class, dual optical sensors, or dual actuators of the same type). Within the organism, each capability is distinguished uniquely by its functional `camelCase` key.
   >
   > To preserve strict determinism in `canProcess()` when capabilities share the same class or mechanism, runtime signals carry the functional capability key (`sourceName`), the concrete class (`sourceType`), and the unique instance identifier (`source`), enabling receiving units to discriminate either by specific role (`leftEar.isListening`) or polymorphically across the class (`AcousticEar.isListening`).

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
| `MutationEvent` | `Signal<T> & { oldValue: T; newValue: T; }` | Atomic event emitted upon modification of any property in the disposition (`this.disposition`). Provides evolutionary traceability of $\Delta d$, reporting previous value (`oldValue`) and new value (`newValue`). |
| `DispositionSnapshot` | `{ version: number; timestamp: number; disposition: T; mutation?: MutationEvent; }` | Immutable snapshot capturing full disposition state at a given point in time, enabling chronological inspection and sequential reversion. |
| `SignalListener` | `(signal: Signal) => Promise<void> \| void` | Callback function invoked upon receiving a signal on the internal channel. |
| `IChannel` | `broadcast(signal: Signal): void;`<br>`subscribe(listener: SignalListener): () => void;` | Intra-organism local communication bus contract. Decouples signal broadcasting from subscribed receivers. |
| `CapabilityConstructor` | `new (id: string, name: string, config?: Config) => Uca` | Constructor signature for classes extending `Uca` that can be dynamically instantiated as subordinate capabilities. |
| `IRegistry` | `register<T>(name: string, ctor: CapabilityConstructor<T>): void;`<br>`get<T>(name: string): CapabilityConstructor<T> \| undefined;`<br>`has(name: string): boolean;` | Higher-domain catalog contract mapping `camelCase` capability names to class constructors. |
| `Config` | `{ channel?: IChannel; nervousSystem?: INervousSystem; registry?: IRegistry; }` | Configuration and dependency injection parameters for UCA initialization. |

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
- Assigns `this.channel` and `this.registry`. Disposition is not passed via `config`; it is an innate ontological property defined physically within the class (`public disposition: TDisposition`).
- Innervates the internal channel via `this.innervateChannel(proxy)`.
- Wraps the instance in a reactive Proxy (`wrapWithProxy(this)`) and returns it, transparently intercepting property mutations.

#### 12.3.3 Lifecycle and Capability Mounting Methods

- `public override async live(): Promise<void>`:
  Entrypoint for the UCA biological lifecycle. First invokes `this.mountCapabilities()` to instantiate and mount all subordinate organs declared in `capabilities`, then delegates to `super.live()`.
- `private mountCapabilities(): void`:
  Private method that deterministically iterates over the keys of `this.capabilities`. For each capability name, verifies if the property already exists on the instance; if absent, delegates mounting to `this.attach(name)`.
- `private attach<T extends Uca>(name: string): T`:
  Private method that resolves the capability constructor via `this.registry.get(name)`. If registered, creates the child instance with a deterministic identifier (`${this.id}::${name}`), sharing the channel (`this.channel`), nervous system (`this._ns`), and registry (`this.registry`), and mounts it as a direct property on the UCA under its `camelCase` name. The capability is born with its innate physical disposition and rejects external constructor configuration.

> [!NOTE]
> **Operational Modulation and Reconfiguration via Impulses**: In accordance with biological organ architecture, a UCA never receives imperative external parameterization. All reconfiguration or operational modulation is transmitted exclusively through neural impulses (`Impulse`) via the `NervousSystem`, processed internally in its `react(impulse)` hook to sovereignly update its disposition.

#### 12.3.4 Unified Reactive Cycle (Impulse and Signal)

The runtime consolidates a **single reactive cycle** in `Adn`/`Uca` regardless of whether the stimulus originates from inter-domain macrostructures (`Impulse`) or local subordinate organs (`Signal`):

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
  Common reactive entrypoint defined in `Adn`. Validates `canProcess(input)` and, if true, executes sequentially the asynchronous chain `preReact(input) -> react(next) -> postReact(next)`.
- `public override canProcess(item: unknown): boolean`:
  Evaluates whether the reactive input can be processed. If `item` is a `Signal`, checks deterministic matching against `this.reactTo` (`type`, `sourceName.property`, `sourceType.property`, or `source.property`) and suppresses self-reactions (`signal.source !== this.id`). If it is an `Impulse`, delegates to `Adn`'s impulse processing logic.
- `private async handleSignal(signal: Signal): Promise<void>`:
  Private signal receiver subscribed to the local channel. Immediately discards signals where `source === this.id` and delegates to `await this.processInput(signal)`.
- `protected override async preReact(input: unknown): Promise<unknown>`:
  Pre-reaction lifecycle hook inherited from `Adn` that validates and prepares input state prior to reaction.
- `public override async react(item: unknown): Promise<void>`:
  Protected extension point for UCA subclasses to execute domain-specific reactive logic for inputs that passed `canProcess`.
- `protected override async postReact(next: unknown): Promise<void>`:
  Post-reaction lifecycle hook inherited from `Adn` for stabilization and post-processing tasks.

> **Strict Domain Isolation**: The `Channel` is an intra-domain local bus for biological coordination between internal capabilities. No property mutation or internal signal is propagated to the `NervousSystem`. The `NervousSystem` is reserved strictly for cognitive impulses between agents and higher-order structures.

#### 12.3.5 Disposition Reactivity and Mutation Events
 
 The UCA architecture restricts the generation of mutations **solely and exclusively to properties defined within the disposition (`this.disposition`)**. Ordinary operational properties of the UCA class (such as execution flags or local queues) do not intercept or emit mutations, eliminating overhead and ensuring that the observable evolutionary space corresponds strictly to the ontological disposition:
 
 1. **Exclusive Reactive Proxy for Disposition**: Accessing `this.disposition` returns a reactive Proxy intercepting assignments to its properties (`set` trap).
 2. **Redundant Emission Suppression**: If the new value assigned to a disposition property is identical to the current value, assignment occurs silently without emitting events or signals, preventing infinite loops and noisy bus traffic.
 3. **Automatic Disposition Mutation Events Dispatch**:
    When an internal property of `this.disposition` is modified (e.g., `this.disposition.sampleRate = 48000` following an incoming reconfiguration impulse):
    - Emits a `MutationEvent` on the instance itself (`target.emit('mutation', event)` and `target.emit('mutation:<property>', event)`).
    - Broadcasts the event across the local intra-domain `Channel` (`channel.broadcast(event)`).
    - The parent organism forwards the event (`forwardMutation`), enabling full observability on the composite agent (`agent.on('mutation', ...)`).
 4. **Direct Subscription to Disposition Properties (`reactTo`)**:
    Properties of the disposition constitute the observable space to which other UCAs can react. Receiver UCAs do NOT need to qualify `.disposition.<property>`. Subscription is transparent and direct using the canonical format:
    ```typescript
    protected reactTo = [
        'AcousticEar.sampleRate', // Direct discrimination by ontological class
        'acousticEar.sampleRate', // Or direct discrimination by capability key
    ];
    ```
    The reactive engine (`canProcessSignal`) automatically correlates the mutated property name (`property`) with the emitter (`sourceType` or `sourceName`), guaranteeing fully decoupled intra-organism reactivity.
 5. **Sequential History and Reversion Methods (`revert`, `revertTo`)**:
    Every UCA exposes its evolutionary sequence and operational methods to restore prior configurations:
    - `public get dispositionSequence(): readonly DispositionSnapshot<TDisposition>[]`: Returns the immutable chronological sequence of snapshots $[D_0, D_1, \dots, D_n]$.
    - `public revert(steps: number = 1): boolean`: Rewinds $N$ steps to a prior configuration. Returns `false` if already at the baseline inception state ($D_0$).
    - `public revertTo(version: number): boolean`: Restores the configuration matching a specific version number.
    Each reversion updates `this.disposition` via its reactive Proxy, automatically dispatching the necessary mutation events to keep the entire organism synchronized.

### 12.4 Canonical Reference Example (Non-Normative)

> **Clarification Note:** The code presented below is **strictly a non-normative usage example**. Its sole purpose is to practically illustrate how the formal runtime principles of UCA translate into TypeScript. It does not prescribe a fixed architecture nor does it limit the diversity of capabilities or organisms that can be developed under this specification.

```typescript
import { Uca, defaultRegistry, Signal } from './uca/index.js';

// 1. Primitive Capability Definitions
export interface AcousticEarDisposition {
    sampleRate: number;
    framingMs: number;
}

export class AcousticEar extends Uca<AcousticEarDisposition> {
    public override purpose = 'Acoustic perception and continuous speech transcription';
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
            // Properties are mutated internally within the class upon stimulus reaction
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
    public override purpose = 'Vocal synthesis and speech output to the external environment';
    public override disposition: VocalMouthDisposition = {
        voice: 'alloy',
        rate: 1.0,
    };
    public speechQueue: string[] = [];
    protected override reactTo = ['AcousticEar.lastTranscript'];

    public override async react(signal: Signal): Promise<void> {
        const { value } = signal;
        if (typeof value === 'string' && value.length > 0) {
            // Internal decoupled reaction
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

// 4. Agent Usage: Pure Signal Reactivity (No External Mutations)
export async function runVoiceAgentExample(): Promise<void> {
    const agent = new ConversationalAgent('agent-001', 'ConversationalAgent');

    // Each capability is instantiated in isolation and exposed via its camelCase property
    const ear = (agent as unknown as Record<string, AcousticEar>)['acousticEar'];
    const mouth = (agent as unknown as Record<string, VocalMouth>)['vocalMouth'];

    console.log(`Agent Purpose: ${agent.purpose}`);
    console.log('Injected disposition for acousticEar:', ear.disposition);
    console.log('Injected disposition for vocalMouth:', mouth.disposition);

    // Pure reactive activation: external communication occurs exclusively via signals or impulses.
    // Internal properties are NEVER modified from the outside; they are altered internally within
    // the unit's class upon reacting to incoming stimuli.
    agent.channel.broadcast({
        type: 'Environment.audioInput',
        source: 'Environment',
        sourceName: 'environment',
        sourceType: 'Environment',
        property: 'audioInput',
        value: 'Hello, cognitive architect',
        timestamp: Date.now(),
    });

    // Observable consequence: acousticEar reacted internally and vocalMouth
    // reacted to the signal automatically broadcast by acousticEar
    console.log('Internal state of acousticEar (isListening):', ear.isListening);
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

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

Concepts that can be expressed through the Purpose, Action, Outcome, or composition of UCAs must not be added as universal UCA primitives.

---

## 2. UCA Core

The UCA Core defines the minimal properties required to identify a functional unit as an Autonomous Cognitive Unit.

---

### 2.1 Definition

An **Autonomous Cognitive Unit (UCA)** is a bounded functional unit defined by an **autonomous Purpose**.

> A UCA is defined not by what it executes, but by the purpose it is responsible for fulfilling.

```text
U = (P, D, C)
```

Where:
- `P` — **Purpose**: why the UCA exists
- `D` — **Disposition**: behavioral predispositions
- `C` — **Capabilities**: operational resources

The minimal activation model:

```text
U = (P, D, C)

S = (G, X)

(U, S) → A → O
```

> **A single UCA is not assumed to constitute cognition by itself.**

---

### 2.2 Purpose (P)

`Purpose` expresses **why a UCA exists**.

It is stable, persistent, and independent of specific executions or mechanisms. It defines the operational boundary and identity of the unit.

- A Purpose delimits the domain of responsibility belonging to the unit.
- A UCA cannot arbitrarily alter its own Purpose, as doing so would destroy its functional identity.
- A UCA must never be defined by its mechanisms. Querying a database or calling a language model are mechanisms, not cognitive purposes.

---

### 2.3 Disposition (D)

`Disposition` represents the behavioral predispositions of the UCA.

It conditions how the UCA selects and executes Actions under its Purpose. Examples:
- tolerance to ambiguity;
- sensitivity to contradiction;
- confidence threshold before emitting an outcome;
- capability selection preferences;
- risk tolerance under uncertainty.

The Core defines that Disposition conditions behavior. Policies governing who may modify Disposition, when, and how belong to **Cognitive Architecture** (§4).

---

### 2.4 Capabilities (C)

`Capabilities` are the operational resources a UCA can leverage to satisfy its Purpose.

> **A UCA selects and uses its available Capabilities as required to perform an Action toward its Goal under its Purpose. Other UCAs may be among those Capabilities.**

Capabilities may include:
- deterministic algorithms, parsers, and heuristics;
- storage engines, databases, and indices;
- external tools, APIs, and drivers;
- predictive models, embeddings, and language models;
- other UCAs whose autonomous Purpose provides functionality required by the Action.

A Capability is an instrument. A Capability is not automatically a UCA. Using another UCA as a Capability does not imply subordination, hierarchy, or unrestricted control — the used UCA retains its own Purpose and only accepts Goals compatible with it.

---

### 2.5 Goal (G)

`Goal` represents **the concrete outcome required in a given activation**.

```text
PURPOSE (P)
Why does this UCA exist? — Persistent, invariant identity.

GOAL (G)
What outcome must be accomplished right now? — Contextual, activation-specific.
```

A UCA always interprets an incoming Goal through the lens of its own Purpose.

---

### 2.6 Context (X)

`Context` contains the information required for the UCA to interpret and resolve its Goal.

Context must not represent an unconstrained global snapshot of all system memory. It provides local continuity across interactions:

```text
Prior Outcomes + Active Evidence + Immediate Inputs ──► Context (X)
```

---

### 2.7 Stimulus (S)

A UCA executes strictly upon receiving a `Stimulus`:

```text
S = (G, X)
```

The Stimulus is a cognitive abstraction. It does not prescribe any network envelope, wire protocol, or transport mechanism.

---

### 2.8 Goal/Purpose Compatibility

A UCA must only accept Goals that are compatible with its Purpose.

> **A Goal must be compatible with the Purpose of the UCA receiving it.**

If an incoming Goal falls outside the unit's Purpose, the activation does not belong to the UCA's domain and must be rejected or redirected.

This constraint ensures that a UCA remains bounded and specialized, preventing it from degenerating into an unconstrained, monolithic agent.

The specification does not prescribe a specific algorithmic method or numerical threshold for evaluating compatibility. The mechanism of evaluation is an implementation decision.

---

### 2.9 Action (A)

The `Action` is what the UCA performs in response to a Stimulus to satisfy its Goal.

```text
(U, S) → A
```

The Action is conditioned by the unit's Purpose, Disposition, Capabilities, and the Goal and Context received in the Stimulus.

An Action does not necessarily require language model inference. It may be deterministic computation, data retrieval, structural transformation, or invocation of a capability.

---

### 2.10 Outcome (O)

The `Outcome` represents **what the Action actually produced**:

```text
A → O
```

Ontological distinction:
```text
GOAL (G):    What was intended to be achieved.
OUTCOME (O): What the executed Action actually produced.
```

The Outcome belongs strictly to the executing unit.

---

### 2.11 Local Reactivity

> **No activation without a Stimulus.**

A UCA never executes spontaneously. It acts strictly in response to a Stimulus.

The ultimate origin of that Stimulus — whether external or internal — is a concern of Cognitive Architecture (§4), not of the UCA Core.

---

### 2.12 UCA Boundary

**On "Autonomous"**

The term `Autonomous` must not be interpreted as:
- self-executing without a Stimulus;
- self-planning or self-triggering;
- a general-purpose agent;
- independent consciousness.

> A UCA is autonomous in Purpose and reactive in execution.

Autonomy belongs to the Purpose: the unit possesses its own bounded functional domain. Execution remains strictly reactive.

**On "Cognitive"**

The term `Cognitive` does not assert that an individual UCA:
- thinks or understands;
- is conscious or intelligent;
- possesses independent cognition.

It indicates that the abstraction is designed to compose functional responsibilities within cognitive systems. Cognitive behaviour may be an emergent property of a composed UCA system — not an intrinsic property of any individual unit.

---

### 2.13 Summary

The complete minimal model of an individual UCA:

```text
Structure:   U = (P, D, C)
Stimulus:    S = (G, X)
Constraint:  Goal must be compatible with Purpose
Activation:  (U, S) → A → O
```

---

## 3. UCA Composition

This section defines how individual UCAs may be related and combined to form more complex systems. Composition is the mechanism through which cognitive complexity is built outside the Core primitive.

> **Recursive UCA composition is capability usage, not centralized orchestration.**

A UCA only requires awareness of the Capabilities available to it. It does not require awareness of the global UCA topology. Composition remains local and recursive.

---

### 3.1 UCA as Capability

A UCA may use another UCA as one of its Capabilities when that unit fulfills its own distinct, autonomous Purpose. There is no structural difference between using a technical Capability and using a UCA Capability, except that the latter retains its own Purpose and accepts only compatible Goals:

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
- Any Goal UCA A sends to UCA B must be compatible with Purpose B.

---

### 3.2 Terminal Capabilities

> A Capability becomes another UCA only when a distinct autonomous Purpose exists.
> When autonomous purposes cease to emerge and only mechanisms remain, terminal capabilities have been reached.

If a component performs a mechanistic or algorithmic function without an independent, stable Purpose, it remains a terminal capability and must not be modelled as a UCA.

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

Complex systemic behaviour unfolds through chains of interactions between specialized units. No central coordinator is required for this chain to function.

---

### 3.4 Causal Composition

Through Outcome → Stimulus relationships, UCAs form causal chains:

```text
Uᵢ → Aᵢ → Oᵢ → Stimulus → Uⱼ → Aⱼ → Oⱼ → Stimulus → Uₖ → ...
```

This notation describes a relational pattern of architectural behaviour. It is not a formal mathematical definition.

---

### 3.5 Recursive Capability Usage

A UCA may expose another UCA as one of its Capabilities. That UCA may recursively use its own Capabilities to fulfil its Goal. This recursive relationship does not imply centralized coordination, hierarchy, or unrestricted control.

```text
UCA A (Purpose A)
├── Capability X
└── UCA B (Purpose B)
      ├── Capability Y
      └── UCA C (Purpose C)
            └── Capability Z
```

During activation:

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

Cognitive Architecture is distinct from the UCA primitive. It organizes and connects UCA primitives; it does not modify what a UCA is. The normative definition of a UCA belongs exclusively to the UCA Core.

---

### 4.1 Attainment

`Attainment` represents the degree to which an Outcome satisfies the Goal that triggered activation.

> The Outcome belongs to the executor.
> The Attainment belongs to the originator of the Goal.

The executing UCA produces the Outcome. It is not required to self-evaluate whether its output satisfies the broader operational intent of the entity that invoked it.

A Cognitive Architecture may define UCAs whose Purpose involves evaluating Outcomes against Goals:

```text
Goal originator (UCA₁)
      │
      ▼
Executor (UCA₂)
      │
      └── Outcome
              │
              ▼
Evaluator (UCA₃)
              │
              └── Attainment evaluation
```

Attainment evaluation is constructed through composition. No special evaluator is required in the Core.

---

### 4.2 Perception and Observation

Perception and observation are **not** universal phases of the UCA activation cycle. They are cognitive responsibilities that may be modelled through composition.

A UCA whose Purpose requires perceiving environmental information performs that work through its Action:

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

### 4.3 Disposition Adaptation

The Core defines that Disposition conditions the behaviour of a unit. The Core does not mandate:
- that a UCA must modify its own Disposition;
- that a UCA must not modify its own Disposition.

Policies governing who may modify Disposition, when, and based on what evidence are architectural decisions.

A Cognitive Architecture may define a UCA whose Purpose involves evaluating and adapting the Disposition of another:

```text
UCA A (Disposition D₀)
   │
   └── Action → Outcome Oₐ
                    │
                    ▼
               Stimulus → UCA B (Purpose: evaluate and adapt behaviour)
                               │
                               └── Action → Outcome
                                               │
                                         D₀ → D₁  (applied to UCA A)
```

> Adaptation may emerge from interactions between UCAs rather than being an intrinsic lifecycle phase of every UCA.

**Distinction**:

```text
Purpose mutation       ← prohibited; changes functional identity
Disposition adaptation ← permitted under invariant Purpose
```

A UCA before and after adaptation:

```text
t₀:  U = (P₀, D₀, C₀)
t₁:  U = (P₀, D₁, C₀)   ← Purpose unchanged; Disposition evolved
```

---

### 4.4 Coordination as Capability Usage

Coordination is not a privileged UCA role. No predefined Coordinator or Dispatcher exists in the UCA model.

If a system identifies a genuine autonomous Purpose that requires integrating Outcomes from multiple UCAs — for example, synthesizing partial results or sequencing activations based on context — that Purpose may justify a UCA. But the UCA is not a coordinator by nature: it is a unit whose Action happens to use multiple other UCAs as Capabilities:

```text
UCA A
────────────────────
Purpose: synthesize results from available knowledge sources

Capabilities
├── UCA B (Purpose B)
├── UCA C (Purpose C)
└── UCA D (Purpose D)
```

UCA A performs its Action by using B, C, and D as Capabilities. It does not orchestrate them. Each of B, C, and D retains its own Purpose and accepts only compatible Goals.

---

### 4.5 Behavioural Analysis Through Composition

Supervision is not a privileged UCA role. No predefined Supervisor exists in the UCA model.

If a system identifies an autonomous Purpose that requires analysing Outcomes for deviation or determining whether behavioural adaptation is needed, that Purpose may justify a UCA. That UCA is not a supervisor: it is simply a unit whose Action uses available Capabilities (which may include other UCAs) to fulfil its own Purpose:

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
Purpose: determine whether available evidence
requires behavioural adaptation.
           │
           └── Action B → Outcome B
                               │
                         D₀ → D₁  (possible Disposition change)
```

UCA B need not be called a Supervisor. It is a UCA whose Purpose justifies its Action.

---

### 4.6 Identity

A cognitive system **may** define a UCA whose Purpose is maintaining and articulating a coherent representation of the system's identity, role, and boundaries.

Identity is not a foundational requirement of every UCA. Specialized or headless systems may operate without an explicit Identity UCA.

---

### 4.7 Memory Stores

A cognitive system **may** define UCAs whose Purpose is the curation, indexing, and contextual retrieval of acquired knowledge.

---

### 4.8 State Strategies

A Cognitive Architecture may choose how state is organized:
- **Distributed State**: emerges from active UCAs, their Dispositions, and active Contexts.
- **Synthesized Context**: constructed on-demand from unit Outcomes.
- **Global State / Blackboard**: a shared state tree for global operational variables.

UCA does not mandate any particular state strategy.

---

### 4.9 Causality Sources

While every UCA is locally reactive, a Cognitive Architecture may source initial Stimuli from:
- external human or machine interactions;
- sensory and environmental events;
- scheduled jobs or software timers;
- internal homeostatic monitors or background loops;
- system bootstrap events.

Strictly external causality is an architectural design choice, not a universal UCA requirement.

---

## 5. Runtime Considerations

The Runtime provides the technical execution and communication infrastructure. It is completely decoupled from cognitive definitions.

---

### 5.1 Transport Mechanisms

The transfer of a Stimulus or Outcome may be implemented via:
- direct asynchronous function calls;
- actor model message passing;
- event buses or publish-subscribe topics;
- persistent message queues;
- streaming sockets or HTTP/gRPC transports;
- shared memory structures.

The choice of transport technology does not affect UCA compliance.

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

> **Impulse is infrastructure, not cognition.**

The Stimulus `(G, X)` is a cognitive abstraction. An Impulse is a possible runtime representation of it. A UCA implementation may operate with or without an explicit Impulse abstraction.

---

### 5.3 Event Bus

An event bus is an optional runtime mechanism that may support loose coupling, asynchronous dispatch, and fan-out between UCAs.

> An event-based runtime may support loose coupling, concurrency, and fault isolation depending on its implementation.

An Event Bus is not required for UCA conformance. The UCA contract makes no assumption about how Stimuli and Outcomes are transmitted.

---

### 5.4 Tracing and Correlation

Runtime implementations typically propagate transaction identifiers (such as `traceId` or `parentImpulseId`) across asynchronous boundaries to enable auditability and debugging.

Tracing is a runtime concern. It does not affect the semantic identity of a UCA.

---

### 5.5 Concurrency

Managing execution queues, thread pools, actor schedulers, and parallel activation is a runtime responsibility. The Core makes no assumptions about execution concurrency.

---

### 5.6 Fault Isolation

Handling timeouts, retries, and failure containment without crashing the overall system is a runtime responsibility. Fault isolation strategies do not affect UCA conformance.

---

## 6. Experimental Hypotheses

The concepts in this section represent exploratory research hypotheses and open questions. They do not constitute demonstrated facts or normative requirements of UCA.

---

### 6.1 Emergent Cognition

It is hypothesized that complex cognitive behaviour does not need to be centrally hosted in a single monolithic model. Useful cognitive capability **may emerge** from the contextual, purpose-driven interaction among specialized units.

This remains a hypothesis. No claim is made that cognitive behaviour necessarily emerges from any assembly of UCAs, or that UCA is a necessary or sufficient condition for cognition.

---

### 6.2 Emergent Proactivity

> Proactive system-level behaviour may emerge from chains of reactive UCA interactions.

While each individual UCA is locally reactive, an ensemble of interacting UCAs can exhibit behaviour that appears proactive to an external observer as units trigger downstream activations in response to outcomes. This is a hypothesis to be verified empirically.

---

### 6.3 Distributed Adaptation

> Adaptation may emerge from interactions between UCAs rather than being an intrinsic lifecycle phase of every UCA.

The causal pattern:

```text
Oᵢ → Stimulus → Uⱼ → Aⱼ → Oⱼ → ΔDᵢ
```

describes a relational architectural behaviour: the Outcome of one UCA stimulates another, whose Action results in a Disposition change in the first. This is a hypothesis about what is achievable through composition.

---

### 6.4 Structural Learning via Interaction

It is hypothesized that systems can achieve adaptive behavioural improvement without retraining model weights or modifying source code, by dynamically adjusting Dispositions in response to environmental feedback.

---

### 6.5 Relational Plasticity (Synapse)

Current adaptation focuses on intra-unit Disposition adjustment. An active research question explores inter-unit relational plasticity: adjusting routing weights, affinity, or communication topology between units:

```text
INTRA-UCA:  ΔDisposition(Uᵢ)
INTER-UCA:  ΔRelation(Uᵢ, Uⱼ)
```

A `Synapse` abstraction would represent a persistent property of the relation between two UCAs that cannot be adequately modelled as state, Disposition, or Capability of either unit individually.

Whether such an abstraction is necessary remains an open question. Synapse is explicitly not part of the normative UCA Core.

---

### 6.6 The Falsifiable Hypothesis

> **Can cognitive behaviour emerge from the interaction of purpose-bounded UCAs while each individual unit remains structurally limited to `U = (P, D, C)` and behaviourally limited to `(U, S) → A → O`?**

This is the central experimental question UCA poses. It is falsifiable:
- A system satisfying all UCA conformance criteria that fails to produce any recognizable cognitive behaviour constitutes evidence against the hypothesis.
- A system demonstrating cognitive behaviour while each unit satisfies only the minimal contract constitutes positive evidence.

---

### 6.7 Empirical Validation Criteria

To validate the UCA model empirically, an implementation should demonstrate that an ensemble of units can:
1. Receive a stimulus;
2. React via specialized Purposes without a monolithic central controller;
3. Collaborate via Stimulus and Outcome exchange;
4. Produce an action toward the external environment;
5. Receive external feedback regarding that action;
6. Use that evidence to diagnose deviations;
7. Adapt one or more Dispositions;
8. React correctly in an equivalent future scenario;
9. Accomplish this **without source code modifications**;
10. Accomplish this **without model weight retraining**;
11. Accomplish this **without ad-hoc hardcoded rules** designed for the test case.

---

## 7. Examples

The examples in this section are non-normative. They illustrate how cognitive responsibilities may be modelled through UCA composition without adding new primitives to the Core.

---

### 7.1 Perception Through Composition

Perception may be the Action of a UCA whose Purpose requires perceiving and interpreting environmental information:

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

`UCA B` is structurally identical to any other UCA: `U = (P, D, C)`. Its Purpose happens to require perception.

---

### 7.2 Observation Through Composition

Observation may similarly be the Action of a UCA:

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

### 7.3 Disposition Adaptation Through Composition

A UCA may adapt the Disposition of another through a standard Outcome → Stimulus chain:

```text
UCA A (Disposition D₀)
   │
   └── Action → Outcome Oₐ
                    │
                    ▼
     Stimulus → UCA B (Purpose: evaluate and adapt behaviour)
                    │
                    └── Action → Outcome: ΔD
                                     │
                               D₀ → D₁  (applied to UCA A)
```

`UCA B` requires no special structure. Its Purpose justifies its Action.

---

### 7.4 Emergent Behaviour Through Composition

A network of UCAs, each limited to `(U, S) → A → O`, may exhibit behaviour that no individual unit contains:

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

An entity or software component conforms to the **UCA Core** if and only if it satisfies all of the following:

1. **Autonomous Purpose**: It defines an explicit, stable, implementation-independent Purpose (`P`).
2. **Defined Disposition**: It has a Disposition (`D`) that conditions its behaviour.
3. **Bounded Capabilities**: It operates using an explicit set of Capabilities (`C`).
4. **Reactive Activation**: It executes strictly upon receiving a Stimulus (`S`).
5. **Structured Stimulus**: The Stimulus contains a Goal (`G`) and a Context (`X`).
6. **Goal Compatibility**: It accepts Goals only when compatible with its Purpose.
7. **Action toward Goal**: It performs an Action directed toward satisfying the Goal within its Purpose.
8. **Outcome Production**: It produces an Outcome representing what the Action achieved.
9. **Purpose-Driven Decomposition**: It treats another component as a UCA only if that component possesses its own autonomous Purpose.

**Non-requirements for Conformance**:

A component does **not** need any of the following to conform to UCA:
- Observation or Perception as lifecycle phases;
- Memory, Identity, Learning, or Adaptation capabilities;
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

This section documents known open questions not yet resolved in the specification.

### 9.1 Formal Semantics of Goal/Purpose Compatibility

The specification requires that a Goal be compatible with the Purpose of the UCA receiving it, but does not define an algorithmic method or formal semantics for evaluating this compatibility. Future work may formalize this as a typed predicate, a semantic distance function, or a declarative contract.

### 9.2 Inter-UCA Relational Plasticity

Whether a `Synapse` abstraction — representing a persistent, adaptable property of the relation between two UCAs — is necessary or sufficient to model inter-unit plasticity remains an open question. This requires empirical evidence from implementations (see §6.5).

### 9.3 Empirical Validation of Emergent Cognition

The central hypothesis of UCA (§6.6) has not yet been empirically validated. Future reference implementations should be designed to test whether cognitive behaviour can emerge from purpose-bounded units limited to `(U, S) → A → O`.

---

## License

UCA Specification © 2026 Christian Marino Alvarez.

This specification and its documentation are licensed under the
Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, share, adapt, and implement this specification,
including for commercial purposes, provided appropriate attribution is given.

Software implementations and reference runtimes are licensed separately.

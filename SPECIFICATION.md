# UCA — Autonomous Cognitive Unit (Unidad Cognitiva Autónoma)
*Architecture Specification (Open Specification RFC)*

[ English | [Español](SPECIFICATION.es.md) ]

---

## Specification vs Implementation

This document defines the formal conceptual contract of an **Autonomous Cognitive Unit (UCA)**.

The specification deliberately defines:
- What constitutes a UCA;
- How a UCA is activated;
- How it deliberates and acts;
- How it composes with other capabilities and units;
- The invariants that preserve its autonomy and bounded scope.

This specification deliberately **does not** prescribe:
- A mandatory cognitive topology or hierarchy;
- Specific cognitive units that every system must instantiate;
- Biological, neurological, or anatomical analogies;
- A particular communication technology, bus, or protocol;
- A specific language model, framework, or vendor;
- A concrete memory or storage engine;
- A centralized global state representation;
- A specific runtime environment.

Systems may implement UCA concepts using diverse programming languages, actor models, event buses, distributed runtimes, local or remote language models, and varied architectural topologies. A reference project or runtime (such as Extensio) may implement the UCA abstraction, but UCA remains an independent, open specification.

---

# PART I — UCA CORE

The UCA Core establishes the minimal, necessary, and sufficient principles that define an Autonomous Cognitive Unit.

---

## 1. Definition

An **Autonomous Cognitive Unit (UCA)** is a functional unit of a cognitive system defined by an **autonomous purpose (`Purpose`)**.

A UCA is not defined by the algorithm it executes, the model it queries, or the data it processes.

It is defined by **why it exists within the cognitive system**.

> A UCA is defined not by what it executes, but by the purpose it is responsible for fulfilling.

A UCA may utilize deterministic algorithms, mathematical routines, storage engines, drivers, external tools, web services, Large Language Models (LLMs), or other subordinate UCAs to fulfill its purpose.

---

## 2. Purpose

The `Purpose` expresses **why a UCA exists**.

It is stable, persistent, and independent of specific executions and implementation mechanisms.

- **Valid Purpose**: Provide relevant previously acquired knowledge for an active operational need.
- **Invalid Purpose**: Query a vector database using cosine similarity.

Querying a vector database is a mechanism or capability; it is not an autonomous cognitive purpose.

The Purpose must always remain independent of the underlying implementation machinery.

---

## 3. Goal

The `Goal` represents **what concrete outcome must be achieved in a given activation**.

In contrast to Purpose:

```text
PURPOSE
Why does this UCA exist? (Stable, persistent, invariant)

GOAL
What concrete outcome is required right now? (Contextual, transient, activation-specific)
```

A UCA always interprets a received Goal through the lens of its own Purpose.

---

## 4. Compatibility Between Goal and Purpose

A UCA must only accept Goals that are strictly compatible with its Purpose.

- **Compatible**: A knowledge-oriented UCA receives a Goal to retrieve historical facts about a topic.
- **Incompatible**: A knowledge-oriented UCA receives a Goal to synthesize audio waveforms and speak to a user.

A Goal belonging to another operational domain must be rejected or routed elsewhere. This principle of specialization prevents UCAs from degenerating into unbounded, generic agents that attempt arbitrary tasks.

---

## 5. Stimulus

A UCA executes exclusively upon receiving a `Stimulus`.

The Stimulus represents the **cognitive activation of the UCA**.

Conceptually, it is composed of:

```text
Stimulus
├── Goal
└── Context
```

The Stimulus is a conceptual cognitive contract, distinct from network packets, messaging envelopes, or physical transport mechanisms.

---

## 6. Context

The `Context` contains the information strictly necessary for a UCA to interpret and resolve its Goal.

It must not represent the system's entire world-state or an unconstrained snapshot of all memory. It is bounded to what is relevant for the specific activation:

```text
Prior Outcomes
      +
Active Evidence
      +
Current Stimulus
      ↓
   Context
      ↓
Active Cognition
```

The contextual past conditions and modulates the interpretation of the immediate present.

---

## 7. Observation

Upon activation, the UCA processes the Stimulus and its Context.

The `Observation` represents the cognitively significant data (salience, detected constraints, key parameters) extracted from that input.

Observation is not an introspective or moral self-evaluation phase. A UCA does not inspect itself to determine if it is "good"; it observes the incoming stimulus, context, external evidence, or outcomes produced by other units.

---

## 8. Disposition

The `Disposition` represents the behavioral predisposition of a UCA.

It is not mere technical configuration; it weights and conditions how the UCA reasons, deliberates, and selects capabilities.

Examples of behavioral parameters governed by Disposition:
- tolerance to ambiguity;
- sensitivity to contradiction;
- required confidence threshold before emitting an outcome;
- weighting of direct vs indirect evidence;
- propensity to invoke computationally expensive capabilities;
- risk tolerance under uncertainty.

The Disposition conditions how a UCA orchestrates its capabilities to fulfill its Purpose.

---

## 9. Non-Self-Mutation of Disposition

A UCA must not evaluate itself and directly mutate its own behavioral disposition during its execution cycle.

If a UCA simultaneously acts, judges its own performance, and modifies its own rules, systemic drift and uncalibrated behavior emerge. Adaptation must proceed from an external supervisory capacity whose distinct Purpose justifies evaluating and adapting that disposition.

---

## 10. Capabilities

`Capabilities` are the operational resources a UCA can leverage to achieve its Purpose.

They encompass:
- deterministic algorithms and heuristics;
- parsers, compilers, and serializes;
- database indices and vector stores;
- external APIs and tools;
- predictive models and LLMs;
- other subordinate UCAs.

A Capability is an instrument. A Capability is not automatically a UCA.

---

## 11. Terminal Capabilities vs Autonomous Capabilities

A Capability becomes a UCA when an **autonomous Purpose** emerges in its design.

Decomposition rule:
> Decomposition into UCAs continues as long as distinct, autonomous cognitive purposes emerge.
> When autonomous purposes cease to emerge and only mechanisms remain, terminal capabilities have been reached.

If a capability only performs an algorithmic step (e.g., matrix multiplication, regex parsing, SQL execution) without an independent purpose within the cognitive system, it remains a terminal capability.

---

## 12. Recursive Composition

UCAs can be composed hierarchically and recursively:

```text
UCA₁
├── Capability A (Algorithm)
├── Capability B (External Tool)
└── UCA₂ (Subordinate UCA with its own Purpose)
      ├── Capability C
      └── Capability D
```

A UCA may invoke another UCA as one of its capabilities whenever that subordinate unit fulfills a distinct, bounded purpose.

---

## 13. Scope and Specialization

A specialized UCA is not an omnipotent mini-agent.

A unit must not arbitrarily decide to trigger unrelated actions outside its domain unless coordination across domains explicitly constitutes its defined Purpose. Coordination belongs to units designed for that responsibility.

---

## 14. Action

The `Action` represents what a UCA executes to satisfy the received Goal under its Purpose:

```text
Purpose + Goal + Context + Observation + Disposition + Capabilities ──► Action
```

An Action does not necessarily imply model inference; it may be deterministic execution, data retrieval, structural transformation, or invocation of a subordinate unit.

---

## 15. LLMs as Capabilities

A Large Language Model (LLM) is not a UCA; it is an instrumental Capability.

A UCA may query an LLM when its Purpose requires probabilistic reasoning, natural language parsing, or semantic synthesis that cannot be resolved deterministically.

Treating models as interchangeable capabilities allows upgrading, replacing, or mixing providers and local models without altering the cognitive architecture.

---

## 16. Outcome

The `Outcome` represents **what the Action actually produced in reality**.

Ontological distinction:
```text
GOAL: What was intended to be accomplished?
OUTCOME: What did the executed action actually produce?
```

The Outcome replaces purely technical abstractions like `Result` or `Response`. The Outcome belongs strictly to the executing unit.

---

## 17. Attainment

`Attainment` represents the degree to which an Outcome satisfies the Goal that triggered activation.

Principle of separation:
> The Outcome belongs to the executor.
> The Attainment belongs to whoever set the Goal.

The executing UCA produces the Outcome; it does not determine whether that Outcome fulfills the broader need of the invoking entity. The caller evaluates the Outcome against its original Goal to determine Attainment.

---

## 18. Relativity of Attainment

Attainment is not an absolute or universal value. It is assessed relative to the Goal of the entity observing and consuming the Outcome.

A unit cannot unilaterally declare global success; success is measured by the originator of the demand.

---

## 19. Reactivity

A UCA never self-activates spontaneously.

Rule:
> A UCA executes its cycle strictly upon receiving a Stimulus.

There is no internal state machine that wakes up a UCA without a cause. Every activation is locally reactive to a received stimulus.

---

## 20. External Causality

Every chain of cognitive activations must trace its origin to an event external to the cognitive system itself.

External sources include:
- user or interlocutor messages;
- perceptual sensor or audio inputs;
- environmental or system events;
- scheduled timer notifications;
- external tool responses;
- system lifecycle events (startup / bootstrap).

Internal units may chain subsequent activations as a causal consequence of that origin, but no chain arises ex nihilo.

---

## 21. Minimal Conceptual Model of UCA

The persistent definition of a UCA:

```text
UCA
├── Purpose
├── Disposition
└── Capabilities
```

The canonical activation flow:

```text
Stimulus (Goal + Context)
        ↓
   Observation
        ↓
Disposition + Capabilities
        ↓
     Action
        ↓
    Outcome
```

---

# PART II — ARCHITECTURAL CONSEQUENCES & COMPOSITION PATTERNS

This section describes patterns and architectural consequences that arise when composing multiple UCAs. These patterns are illustrative and supportive; they are not mandatory constraints of the UCA Core.

---

## 22. Causal Chains and Multi-UCA Interaction

When multiple UCAs interact, an initial stimulus triggers a causal chain:

```text
External Stimulus ──► UCA₁ ──► Outcome₁ ──► Context₂ ──► UCA₂ ──► Outcome₂ ──► External Action
```

Units collaborate by exchanging stimuli and outcomes. No monolithic central brain is required to dictate every intermediate state transition.

---

## 23. The Impulse: Transport Envelope for Infrastructure

The `Impulse` represents infrastructure, not cognition.

It is a transport envelope used to route a `Stimulus`, an `Outcome`, or operational metadata across a communication layer:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── payload (Stimulus | Outcome | data)
```

Implementations may use an event bus, actor mailboxes, message queues, async function calls, or distributed protocols. The choice of transport does not affect UCA compliance.

---

## 24. Causal Traceability

In asynchronous or distributed multi-UCA systems, interactions should preserve causal traceability metadata:
- `traceId`: Root transaction identifier;
- `parentImpulseId`: Preceding envelope identifier;
- `sessionId`: Interaction session scope;
- `timestamp`: Event timing.

This supports auditing, debugging, and post-hoc deviation diagnosis.

---

## 25. Optional Pattern: Coordination and Dispatch

A cognitive system **MAY** define a UCA whose Purpose includes coordinating or dispatching stimuli across specialized units:

```text
                  UCA (Coordinator)
                /        |        \
               ↓         ↓         ↓
             UCA₁      UCA₂      UCA₃
```

If implemented, a coordinator must not become an omnipotent monolithic brain; its scope is bounded by its specific coordination Purpose. Systems may also use decentralized, choreography-based, or pipeline topologies.

---

## 26. Optional Pattern: Supervision and Coherence Preservation

A cognitive system **MAY** define one or more UCAs whose autonomous Purpose involves monitoring behavioral coherence, diagnosing deviations, or adapting dispositions:

```text
Supervisory UCA
├── Diagnostic UCA (Identifies root cause of deviations)
└── Adaptation UCA (Computes required disposition adjustments)
```

Supervisory units do not micromanage operational decisions; they observe evidence over time and adapt the behavioral dispositions of target units.

---

## 27. Optional Pattern: Self / Identity Representation

A cognitive system **MAY** define a UCA whose Purpose is maintaining a coherent representation of the system's identity, role, and boundaries.

This is an architectural option, not a universal requirement. Specialized utility agents (such as headless parsers or pipeline processors) may operate without an explicit Identity UCA.

---

## 28. Optional Pattern: Knowledge and Memory Stores

A cognitive system **MAY** define one or more UCAs whose Purpose is the curation, retrieval, and contextual provision of acquired knowledge.

Storing data is a capability; actively interpreting and providing knowledge under a cognitive goal constitutes a UCA.

---

## 29. Architectural Analysis: Decomposing Global Cognitive State

Many conventional agent architectures maintain a single centralized state object (often referred to as a global snapshot or blackboard) that aggregates identity, memory, dialog history, task trees, and runtime flags.

In a UCA-based architecture, global state can be analyzed and decomposed ontologically:
- **Persistent facts**: Handled by knowledge/memory capabilities;
- **Runtime execution flags**: Handled by transport and lifecycle infrastructure;
- **Active reasoning context**: Synthesized dynamically on-demand from unit outcomes.

A UCA implementation is not required to eliminate global state completely, nor is it required to adopt one; state distribution is an architectural implementation choice.

---

## 30. Dynamic Context as Cognitive Synthesis

Rather than propagating an unbounded global state to every unit, Context can be synthesized dynamically from the Outcomes of relevant capabilities:

```text
UCA (Requester)
├── Knowledge Unit ──► Outcome (Relevant facts)
├── Identity Unit  ──► Outcome (Role constraints)
└── Interlocutor   ──► Outcome (User preferences)
        ↓
Focused, compact Context tailored to the immediate Goal
```

This reduces token overhead, eliminates noise, and minimizes attentional degradation.

---

## 31. The External Environment in the Cognitive Loop

The cognitive system acts upon the external environment, and the environment responds. That response becomes new external evidence:

```text
System Action ──► Environment ──► Feedback / Correction ──► New External Stimulus
```

The system does not need to simulate or predict all environmental consequences internally. The loop with the external world provides ground truth evidence.

---

# PART III — EXPERIMENTAL HYPOTHESES & OPEN QUESTIONS

The concepts in this section represent active research hypotheses and exploratory ideas. They are not demonstrated facts or normative requirements of the UCA Core.

---

## 32. Hypothesis: Emergent Cognition

It is hypothesized that complex cognitive behavior does not need to be centrally programmed or hosted in a single large model. Instead, useful cognitive capability may **emerge** from the structured, contextual interaction among small, purpose-bounded units.

---

## 33. Hypothesis: Emergent Proactivity

While individual UCAs are strictly reactive to received stimuli, an ensemble of interacting UCAs can exhibit behavior that appears proactive to an external observer.

Because one unit's Outcome can form part of the Context or trigger a Stimulus for another unit, multi-step goal pursuit can unfold from an initial external prompt without requiring a monolithic planner.

---

## 34. Hypothesis: Adaptive Cognitive Loops and Behavioral Learning

It is hypothesized that structural learning can occur without weight retraining or code modification:
1. A system produces an action toward the external environment;
2. The environment provides feedback or corrections;
3. A supervisory capability diagnoses the deviation;
4. The supervisory capability adapts a target unit's `Disposition`;
5. The system exhibits corrected behavior in equivalent future situations.

Whether this adaptation can remain stable and avoid catastrophic drift over long horizons remains an open research question.

---

## 35. Exploration: Inter-UCA Adaptation and Relational Plasticity (Synapse Concept)

Current adaptation in UCA focuses on **intra-unit adaptation** (modifying a unit's `Disposition`).

An exploratory area of research investigates **inter-unit adaptation** (the dynamic adjustment of communication topology, routing weights, or interaction affinity between units):

```text
INTRA-UCA Adaptation  ──► Disposition (Internal behavioral threshold)
INTER-UCA Adaptation  ──► Relational Plasticity / Synapse (Connection weighting between units)
```

The formalization of relational plasticity and its stability characteristics is an active subject of study and is explicitly not part of the normative UCA Core.

---

## 36. Empirical Validation Criteria

To validate the UCA model empirically, a reference implementation should demonstrate that a minimal ensemble of units can:

1. Receive an external stimulus;
2. React via specialized Purposes without a monolithic controller;
3. Collaborate via stimulus and outcome exchange;
4. Produce an action toward the external environment;
5. Receive external feedback or correction regarding that action;
6. Use that evidence to diagnose deviations;
7. Adapt one or more `Dispositions`;
8. React correctly in an equivalent future scenario;
9. Accomplish this **without source code modification**;
10. Accomplish this **without model weight retraining**;
11. Accomplish this **without ad-hoc hardcoded rules designed for the test case**.

If an implementation achieves this, adaptive behavior has emerged from the architecture itself.

---

## 37. Core Thesis

> **A UCA is a functional cognitive unit defined by an autonomous Purpose.**
>
> **It is autonomous in Purpose and reactive in execution.**
>
> **When activated, it receives a Goal within a Context, uses bounded Capabilities conditioned by its Disposition, performs an Action, and produces an Outcome.**
>
> **The Outcome is evaluated relative to the Goal by the entity that originated the need (Attainment).**
>
> **UCAs may recursively compose other UCAs when a distinct autonomous Purpose exists.**

---

## License

UCA Specification © 2026 Christian Marino Alvarez.

This specification and its documentation are licensed under the
Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, share, adapt, and implement this specification,
including for commercial purposes, provided appropriate attribution
is given.

Software implementations and reference runtimes are licensed separately.

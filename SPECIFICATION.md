# UCA — Autonomous Cognitive Unit (Unidad Cognitiva Autónoma)
*Architecture Specification (Open Specification RFC)*

[ English | [Español](SPECIFICATION.es.md) ]

---

## Three-Tier Architecture: Core, Architecture, and Runtime

To ensure that the Autonomous Cognitive Unit (UCA) remains a durable and universally implementable abstraction, this specification strictly differentiates three separate tiers:

```text
┌─────────────────────────────────────────────────────────────────┐
│                           UCA CORE                              │
│  Defines what a UCA is: identity, contracts, and activation.   │
│  U = (P, D, C)  |  S = (G, X)  |  compat(P, G)  |  O = F_U(S)   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COGNITIVE ARCHITECTURE                       │
│  Defines how a system organizes and composes multiple UCAs:     │
│  Coordination, supervision, state distribution, causality.     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                            RUNTIME                              │
│  Defines execution and transport infrastructure:                │
│  Impulse envelopes, messaging protocols, concurrency, tracing. │
└─────────────────────────────────────────────────────────────────┘
```

A functional unit is a UCA if and only if it satisfies the **UCA Core**. 

The Cognitive Architecture and the Runtime are implementation and organizational choices; they do not dictate the identity of an individual UCA.

---

# 1. UCA CORE

The UCA Core contains strictly the necessary and sufficient properties to identify a functional unit as an Autonomous Cognitive Unit.

---

## 1.1 Definition

An **Autonomous Cognitive Unit (UCA)** is a bounded functional unit defined by an **autonomous purpose (`Purpose`)**.

A UCA is not defined by the algorithm it executes, the model it queries, the programming language it is written in, or the data structures it manipulates.

It is defined by **why it exists within a cognitive system**.

> A UCA is defined not by what it executes, but by the purpose it is responsible for fulfilling.

Formal definition:

```text
U = (P, D, C)
```

Where:
- $P$ = **Purpose**
- $D$ = **Disposition**
- $C$ = **Capabilities**

---

## 1.2 Purpose ($P$)

The `Purpose` expresses **why a UCA exists**.

It is stable, persistent, and independent of specific executions or mechanical details. It defines the operational boundary and identity of the unit.

- A Purpose defines what domain of responsibility belongs to the unit.
- A UCA cannot arbitrarily alter its own Purpose, as doing so would destroy its functional identity.
- A UCA must never be defined by its mechanisms (e.g. "query a vector database" or "call an LLM" are mechanisms, not cognitive purposes).

---

## 1.3 Goal ($G$)

The `Goal` represents **what concrete outcome must be achieved in a given activation**.

In contrast to Purpose:

```text
PURPOSE (P)
Why does this UCA exist? (Persistent, invariant identity)

GOAL (G)
What concrete outcome must be accomplished right now? (Contextual, activation-specific)
```

A UCA always interprets an incoming Goal through the lens of its own Purpose.

---

## 1.4 Purpose / Goal Compatibility: $\text{compat}(P, G)$

A UCA must only accept Goals that are compatible with its Purpose:

```text
compat(P, G) = true
```

If an incoming Goal falls outside the unit's defined Purpose, the activation does not belong to the UCA's domain and must be rejected or redirected.

This constraint ensures that a UCA remains bounded and specialized, preventing it from degenerating into an unconstrained, monolithic agent. The specification does not prescribe a specific algorithmic method or numerical threshold for evaluating compatibility.

---

## 1.5 Stimulus ($S$)

A UCA executes strictly upon receiving a `Stimulus`.

The Stimulus represents the cognitive activation of the UCA. Formally:

```text
S = (G, X)
```

Where:
- $G$ = **Goal** (the target outcome for this activation)
- $X$ = **Context** (the relevant contextual data required to interpret and achieve $G$)

The Stimulus is a cognitive abstraction. It does not prescribe any specific network envelope, wire protocol, or transport mechanism.

---

## 1.6 Context ($X$)

The `Context` contains the relevant information required for the UCA to interpret and resolve its Goal.

Context must not represent an unconstrained, global snapshot of all system memory. It provides local cognitive continuity across interactions:

```text
Prior Outcomes + Active Evidence + Immediate Inputs ──► Context (X)
```

---

## 1.7 Observation

When activated, a UCA extracts cognitively significant data from the Stimulus $(G, X)$ and any available evidence.

The resulting `Observation` captures the salient facts, parameters, and constraints relevant to resolving the Goal.

Observation is not a mandatory stage of moral self-reflection; it is the input-processing phase that prepares the UCA for deliberation and action.

---

## 1.8 Disposition ($D$)

The `Disposition` represents the behavioral predispositions of the UCA.

It is not generic technical configuration. It conditions how the UCA reasons, deliberates, and selects capabilities under its Purpose.

Examples of behavioral parameters governed by Disposition:
- tolerance to ambiguity;
- sensitivity to contradiction;
- required confidence threshold before emitting an outcome;
- capability selection preferences (e.g., preference for deterministic heuristics over probabilistic inference);
- risk tolerance under uncertainty.

---

## 1.9 Capabilities ($C$)

`Capabilities` are the operational resources a UCA can leverage to satisfy its Purpose.

Capabilities may encompass:
- deterministic algorithms, parsers, and heuristics;
- storage engines, databases, and indices;
- external tools, APIs, and drivers;
- predictive models, embeddings, and Large Language Models (LLMs);
- other subordinate UCAs.

A Capability is an instrument. A Capability is not automatically a UCA.

---

## 1.10 Terminal Capabilities vs Autonomous Capabilities

A Capability becomes another UCA only when a **distinct autonomous Purpose** exists:

> A capability becomes another UCA only when a distinct autonomous Purpose exists.
> When autonomous purposes cease to emerge and only mechanisms remain, terminal capabilities have been reached.

If a component performs a mechanistic or algorithmic function without an independent, stable cognitive purpose, it remains a terminal capability.

---

## 1.11 Action ($A$)

The `Action` represents what the UCA executes to satisfy the Goal under its Purpose, conditioned by its Disposition and available Capabilities:

```text
A = Action selected under (P, D, C, G, X)
```

An Action does not necessarily require language model inference. It may be deterministic computation, data retrieval, structural transformation, or invocation of a capability.

---

## 1.12 Outcome ($O$)

The `Outcome` represents **what the Action actually produced**:

```text
O = execute(A)
```

Ontological distinction:
```text
GOAL (G): What was intended to be achieved.
OUTCOME (O): What the executed action actually produced.
```

The Outcome belongs strictly to the executing unit.

---

## 1.13 Attainment ($T$)

`Attainment` represents the degree to which an Outcome satisfies the Goal that triggered activation.

Principle of Separation:
> The Outcome belongs to the executor.
> The Attainment belongs to the originator of the Goal.

The executing UCA produces the Outcome. It is not required to self-evaluate whether its output satisfies the broader operational intent of the entity that invoked it. The originator of the Goal evaluates the Outcome to determine Attainment:

```text
O₂ = U₂(G, X)
T₁ = Attainment_Evaluator₁(G, O₂, X)
```

Attainment is relative to the observer's Goal; there is no requirement for universal or absolute self-certification.

---

## 1.14 Local Reactivity

A UCA is locally reactive:
> No activation without a Stimulus.

A UCA never executes spontaneously without an incoming Stimulus. Its internal state machine does not awaken without an activating event.

*(Note: The ultimate origin of that Stimulus—whether external or internal—is a concern of Cognitive Architecture, not of the UCA Core).*

---

## 1.15 Recursive Composition

UCAs can be composed hierarchically and recursively:

```text
UCA₁ (Purpose P₁)
├── Capability A (Algorithm)
├── Capability B (Tool)
└── UCA₂ (Purpose P₂)
      ├── Capability C
      └── Capability D
```

A UCA may utilize another UCA as one of its capabilities whenever that subordinate unit fulfills its own distinct, autonomous Purpose.

---

## 1.16 Summary of UCA Core

Conceptually, the UCA Core is formalized as:

```text
Unit:          U = (P, D, C)
Stimulus:      S = (G, X)
Contract:      compat(P, G) = true
Execution:     O = F_U(S) = F(P, D, C, G, X)
```

---

# 2. COGNITIVE ARCHITECTURE (Multi-UCA Systems)

Cognitive Architecture defines how multiple UCAs are organized, connected, and governed within an overall cognitive system.

---

## 2.1 Multi-UCA Interaction and Causal Chains

When multiple UCAs collaborate, the Outcome of one unit may form part of the Context or trigger a Stimulus for another unit:

```text
UCA₁ ──► Stimulus(G₁, X₁) ──► UCA₂ ──► Outcome₂ ──► UCA₁
```

Complex systemic behavior unfolds through chains of interactions between specialized units without requiring a single, omniscient central controller.

---

## 2.2 Causality Sources

While every UCA is locally reactive (requiring a Stimulus), a Cognitive Architecture may source initial stimuli from:
- external human or machine interactions;
- sensory and environmental events;
- scheduled jobs or software timers;
- internal homeostatic monitors or background loops;
- system bootstrap events.

The constraint of *strictly external causality* is an architectural design choice for specific systems, not a universal requirement of the UCA Core.

---

## 2.3 Optional Pattern: Coordination and Dispatch

A cognitive system **MAY** define a UCA whose Purpose is coordinating or dispatching stimuli across specialized units:

```text
                  UCA (Coordinator)
                /        |        \
               ↓         ↓         ↓
             UCA₁      UCA₂      UCA₃
```

If present, a coordinator's scope is strictly bounded by its defined coordination Purpose. Systems may alternatively employ decentralized choreography, pipelines, or peer-to-peer topologies.

---

## 2.4 Optional Pattern: Supervision and Coherence Preservation

A cognitive system **MAY** define one or more UCAs whose autonomous Purpose involves monitoring behavioral coherence, diagnosing deviations, or adapting dispositions:

```text
Supervisory UCA
├── Diagnostic Capability / UCA (Identifies root causes of deviations)
└── Adaptation Capability / UCA (Calculates disposition adjustments)
```

---

## 2.5 Optional Pattern: Identity and Self-Representation

A cognitive system **MAY** define a UCA whose Purpose is maintaining and articulating a coherent representation of the system's identity, role, and boundaries.

Specialized or headless agent systems may operate without an explicit Identity UCA.

---

## 2.6 Optional Pattern: Knowledge and Memory Stores

A cognitive system **MAY** define one or more UCAs whose Purpose is the curation, indexing, and contextual retrieval of acquired knowledge.

---

## 2.7 State Strategies: Dynamic Context vs Global State

A Cognitive Architecture may choose how state is organized:
- **Distributed State**: State emerges from the active UCAs, their individual Dispositions, and active Contexts.
- **Synthesized Context**: Context is dynamically constructed on-demand from unit Outcomes.
- **Global State / Blackboard**: A shared blackboard or state tree is maintained for tracking global operational variables.

UCA does not mandate the elimination of global state, nor does it mandate its presence.

---

## 2.8 Adaptation Policies: Purpose Mutation vs Disposition Adaptation

The UCA model distinguishes two levels of adaptation:

1. **Purpose Mutation**: Changing what a unit exists for. This is **prohibited** within a stable UCA, as it alters the functional identity of the unit.
2. **Disposition Adaptation**: Adjusting the behavioral predispositions ($D$) under an invariant Purpose ($P$).

A Cognitive Architecture may adopt different adaptation policies:
- **Supervised Adaptation**: Only dedicated supervisory units may alter the Disposition of target units.
- **Self-Tuning Adaptation**: A unit may possess an internal learning capability that tunes its own Disposition parameters based on performance feedback, provided its Purpose remains strictly invariant.

---

# 3. RUNTIME CONSIDERATIONS (Infrastructure)

The Runtime provides the technical execution and communication infrastructure. It is completely decoupled from cognitive definitions.

---

## 3.1 Transport Mechanisms

The transfer of a Stimulus or Outcome may be implemented via:
- direct asynchronous function calls;
- actor model message passing;
- event buses or publish-subscribe topics;
- persistent message queues;
- streaming sockets or HTTP/gRPC transports;
- shared memory structures.

The choice of transport technology does not affect UCA compliance.

---

## 3.2 The Impulse: Transport Envelope

An `Impulse` is an optional infrastructure envelope used by transport layers to route activations and operational metadata:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── payload (Stimulus | Outcome | metadata)
```

> **Impulse is infrastructure, not cognition.**

A UCA implementation may operate with or without an explicit Impulse abstraction.

---

## 3.3 Tracing, Concurrency, and Fault Isolation

Runtime implementations typically manage:
- **Traceability**: Propagating transaction identifiers (`traceId`, `parentImpulseId`) across asynchronous boundaries to enable auditability;
- **Concurrency**: Managing execution queues, thread pools, or actor schedulers;
- **Fault Isolation**: Handling timeouts, retries, and failure containment without crashing the overall cognitive system.

---

# 4. EXPERIMENTAL HYPOTHESES & OPEN QUESTIONS

The concepts in this section represent exploratory research hypotheses and open questions. They do not constitute demonstrated facts or normative requirements of UCA.

---

## 4.1 Hypothesis: Emergent Cognition

It is hypothesized that complex cognitive behavior does not need to be centrally hosted in a single monolithic model. Useful, robust cognitive capability may **emerge** from the contextual, purpose-driven interaction among specialized units.

---

## 4.2 Hypothesis: Emergent Proactivity

While each individual UCA is locally reactive to a Stimulus, an ensemble of interacting UCAs can exhibit behavior that appears proactive to an external observer as units trigger downstream activations in response to outcomes.

---

## 4.3 Hypothesis: Structural Learning via Interaction

It is hypothesized that systems can achieve adaptive behavioral improvement without retraining model weights or rewriting code, by dynamically adjusting Dispositions in response to environmental feedback.

---

## 4.4 Exploration: Inter-UCA Plasticity (The Synapse Concept)

Current adaptation focuses on **intra-unit adaptation** ($\Delta D$).

An active area of research explores **inter-unit relational plasticity** (adjusting routing weights, affinity, or communication topology between units):

```text
INTRA-UCA Plasticity:  ΔDisposition (Modifies internal unit thresholds)
INTER-UCA Plasticity:  ΔRelation(UCA_i, UCA_j) (Modifies connectivity and affinity)
```

The formalization and stability of relational plasticity between cognitive units remains an open research question and is explicitly not part of the normative UCA Core.

---

## 4.5 Empirical Validation Criteria

To validate the UCA model empirically, an implementation should demonstrate that an ensemble of units can:
1. Receive a stimulus;
2. React via specialized Purposes without a monolithic central brain;
3. Collaborate via stimulus and outcome exchange;
4. Produce an action toward the external environment;
5. Receive external feedback or correction regarding that action;
6. Use that evidence to diagnose deviations;
7. Adapt one or more Dispositions;
8. React correctly in an equivalent future scenario;
9. Accomplish this **without source code modifications**;
10. Accomplish this **without model weight retraining**;
11. Accomplish this **without ad-hoc hardcoded rules designed for the test case**.

---

# 5. CONFORMANCE

An entity or software component conforms to the **UCA Core** if and only if it satisfies all of the following criteria:

1. **Autonomous Purpose**: It defines an explicit, stable, and implementation-independent Purpose ($P$).
2. **Goal Compatibility**: It accepts Goals ($G$) only when compatible with its Purpose ($\text{compat}(P, G) = \text{true}$).
3. **Local Reactivity**: It executes strictly upon receiving an activating Stimulus ($S$).
4. **Contextual Ingestion**: It consumes the Context ($X$) required for its activation.
5. **Bounded Capabilities**: It operates using an explicit set of capabilities ($C$).
6. **Dispositional Conditioning**: Its reasoning or action selection may be conditioned by behavioral predispositions ($D$).
7. **Action Formulation**: It executes an Action ($A$) directed toward satisfying the Goal.
8. **Outcome Production**: It produces an Outcome ($O$) representing what the action achieved.
9. **Purpose-Driven Decomposition**: It treats another component as a UCA only if that component possesses its own autonomous Purpose.

**Non-requirements for Conformance**:
A component or system does **not** need any of the following to conform to UCA:
- an Impulse envelope;
- an Event Bus or Nervous System;
- a specific language model or LLM;
- external causality;
- a prohibition on self-tuning dispositions;
- Synapses or relational plasticity;
- global state or snapshots;
- a centralized Coordinator or Supervisor.

---

# 6. CORE THESIS

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

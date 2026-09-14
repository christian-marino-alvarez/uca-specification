# UCA — Autonomous Cognitive Unit (Unidad Cognitiva Autónoma)
*Architecture Specification (Experimental RFC)*

[ English | [Español](SPECIFICATION.es.md) ]

---

## 1. Definition

An **Autonomous Cognitive Unit (UCA)** is a functional unit of a cognitive system defined by an **autonomous purpose (`Purpose`)**.

A UCA is not defined by the algorithm it executes, the model it uses, or the data it processes.

It is defined by **why it exists within the cognitive system**.

> A UCA is not defined by what it executes, but by the purpose it is responsible for fulfilling.

Conceptual examples of purpose:

- knowing who I am (maintaining and projecting own identity and role);
- recognizing with whom I am interacting;
- providing relevant acquired knowledge;
- preserving cognitive stability and coherence;
- expressing information toward the external environment;
- interpreting incoming perceptual stimuli;
- coordinating reaction across incoming stimuli streams.

A UCA may leverage deterministic algorithms, mathematical models, storage, drivers, external tools, web services, Large Language Models (LLMs), or other UCAs to fulfill its purpose.

---

## 2. Purpose

The `Purpose` expresses **why a UCA exists**.

It is stable, persistent, and independent of specific executions and technical implementation details.

Valid example:

```text
Knowledge / Memory UCA

Purpose:
Provide relevant previously acquired knowledge
for a given cognitive need.
```

Invalid example:

```text
Purpose:
Search vectors in a vector database.
```

Searching vectors is a mechanism or capability.

It is not an autonomous cognitive purpose.

Another valid example:

```text
Identity UCA (Self UCA)

Purpose:
Maintain a coherent representation
of the agent's identity and boundaries.
```

The Purpose must always remain agnostic of the underlying implementation.

---

## 3. Goal (Contextual Objective)

The `Goal` represents **what concrete outcome must be achieved in a given activation**.

In contrast to Purpose:

```text
PURPOSE
Why does this UCA exist? (Stable and persistent)

GOAL
What concrete outcome is needed right now? (Contextual and transient)
```

Example:

```text
Knowledge / Memory UCA

Purpose:
Provide relevant acquired knowledge.

Goal:
Retrieve information related to the technical decision to adopt WebRTC.
```

A UCA always interprets the received Goal through the lens of its own Purpose.

---

## 4. Compatibility Between Goal and Purpose

A UCA must only accept Goals that are strictly compatible with its Purpose.

Compatible example:

```text
Knowledge UCA

Purpose:
Provide acquired knowledge.

Goal:
Retrieve stored information regarding the interlocutor.
```

Incompatible example:

```text
Knowledge UCA

Purpose:
Provide acquired knowledge.

Goal:
Synthesize verbal output and reply to the user.
```

That Goal belongs to the domain of an egress or expression UCA.

This compatibility restriction prevents degenerating UCAs into monolithic, generic agents that attempt arbitrary tasks.

---

## 5. Stimulus

A UCA only activates and executes upon receiving a `Stimulus`.

The Stimulus represents the **cognitive activation of the UCA**.

Conceptually, it contains:

```text
Stimulus
├── Goal
└── Context
```

The Stimulus is a purely cognitive abstraction, not a physical network mechanism or packet.

Physical transmission belongs to the infrastructure transport layer or `Impulse`.

---

## 6. Impulse (Transport Carrier)

The `Impulse` belongs to the system's transport and messaging layer.

It is the technical vehicle used to route activations, stimuli, and results between components.

It carries operational and delivery metadata:

```text
Impulse
├── id
├── timestamp
├── priority
├── ttl
├── traceId
├── sessionId
└── stimulus
```

Conceptually:

```text
Impulse
   ↓ transports
Stimulus
   ↓ activates
UCA
```

Therefore:

> A UCA is not a message.

> A Stimulus is not an Impulse.

> An Impulse transports a Stimulus to activate a UCA.

---

## 7. Context

The `Context` contains the information strictly necessary for a UCA to correctly interpret and satisfy its Goal.

It must not represent the agent's entire world-state or a monolithic system snapshot.

It must be bounded to what is relevant for that specific activation.

Conceptually:

```text
Stimulus
├── Goal
└── Context
```

Context provides cognitive continuity across successive interactions:

```text
Prior Outcomes
      +
External Evidence
      +
Current Stimulus
      ↓
   Context
      ↓
Current Cognition
```

The contextual past conditions and modulates the interpretation of the present.

---

## 8. Observation

The UCA processes and extracts information from the received Stimulus and its Context.

The `Observation` represents the cognitively significant data (salience, patterns, key entities) that the UCA abstracts from that input.

It should not be construed as an introspective self-judgment or moral evaluation phase.

A UCA does not need to observe itself to decide if it acted properly; it observes the stimulus, context, external evidence, or outcomes produced by other units.

---

## 9. Disposition (Behavioral Predisposition)

The `Disposition` represents the behavioral predisposition of a UCA.

It is not mere technical configuration; it weights and conditions how the UCA reasons and selects actions.

It may govern, for example:

- tolerance to ambiguity;
- sensitivity to contradiction;
- required confidence threshold to emit an outcome;
- weighting of direct vs indirect evidence;
- propensity to invoke computationally expensive capabilities;
- behavior under uncertainty.

Conceptual example:

```text
Disposition
├── ambiguityTolerance: 0.2
├── confidenceSensitivity: 0.85
└── inferenceThreshold: 0.7
```

The Disposition conditions how a UCA orchestrates its capabilities to fulfill its Purpose.

---

## 10. A UCA Does Not Mutate Its Own Disposition

A UCA should not evaluate itself and directly mutate its own internal behavioral disposition.

Adaptation must always proceed from a separate cognitive capacity whose Purpose justifies systemic supervision:

```text
Supervisory UCA (UCA₁)
    ↓
Diagnostic UCA (UCA₂)
    ↓
Adaptation UCA (UCA₃)
    ↓
Mutation of the Disposition of another UCA (e.g. Ingress or Knowledge UCA)
```

This prevents the failure mode of components that simultaneously act, judge their own performance, and mutate their behavior without external check.

---

## 11. Capabilities

`Capabilities` are the instrumental and executing resources a UCA can leverage to satisfy its Purpose.

They encompass:

```text
deterministic algorithms
drivers and protocols
parsers and lexers
embedding models
vector or relational indices
network services
predictive models or LLMs
environment tools
other UCAs
```

A Capability is not automatically a UCA.

---

## 12. When a Capability Becomes a UCA

A Capability becomes a UCA when an **autonomous cognitive Purpose** emerges in its architectural design.

Example:

```text
Knowledge / Memory UCA
```

may internally utilize:

```text
tokenizer
embeddings
vector store
cosine similarity
re-ranking algorithm
inferential fallback
```

These elements are mechanisms or terminal capabilities.

They do not need to become separate UCAs unless one is found to genuinely hold an autonomous cognitive purpose.

Rule:

> Decomposition into UCAs continues as long as autonomous purposes emerge.

> When autonomous purposes cease to emerge and only mechanisms remain, terminal capabilities have been reached.

---

## 13. A UCA Can Serve as a Capability of Another UCA (Recursive Composition)

UCAs can be composed hierarchically and recursively.

Example:

```text
Supervisory & Coherence UCA (UCA₁)
├── Diagnostic UCA (UCA₂)
└── Adaptation UCA (UCA₃)
```

Provided `UCA₂` and `UCA₃` hold real, autonomous purposes:

```text
Diagnostic UCA (UCA₂)
Purpose: Identify the root cause of a cognitive deviation based on evidence.

Adaptation UCA (UCA₃)
Purpose: Adjust behavioral dispositions in response to deviation evidence.
```

The supervisory UCA leverages both as subordinate capabilities to fulfill its own higher-level Purpose.

---

## 14. Specialized UCAs Are Not Omnipotent Mini-Agents

A specialized UCA must not evolve into a generic mini-agent that arbitrarily decides its own course of action beyond its scope.

A knowledge UCA may internally select which index or parser to query, but it must not arbitrarily decide to invoke a supervisory UCA or emit external responses, unless such orchestration explicitly constitutes its Purpose.

Coordination across cognitive domains belongs to a UCA whose Purpose justifies that responsibility.

---

## 15. Action

The `Action` represents what a UCA performs to satisfy the received Goal under its Purpose.

Conceptually:

```text
Purpose + Goal + Context + Observation + Disposition + Capabilities ──► Action
```

An Action does not necessarily equal an LLM inference call; it can be a deterministic computation, a retrieval, a data transformation, or an invocation to another unit:

```text
retrieve knowledge record
identify interlocutor traits
parse data structure
synthesize egress output
cross-examine evidence
invoke subordinate UCA
```

---

## 16. LLMs as Capabilities, Not as UCAs

A Large Language Model (LLM) is not a UCA by definition; it is an instrumental Capability.

A UCA may leverage an LLM when its Purpose requires reasoning or unstructured interpretation that cannot be achieved deterministically.

Therefore:

> A UCA is not an LLM.

> An LLM is merely one possible Capability serving the Purpose of a UCA.

This enables swapping models, local runners, or algorithms without restructuring the system's cognitive architecture.

---

## 17. Outcome

The `Outcome` represents **what the Action actually produced in reality**.

Distinction:

```text
GOAL: What was intended to be accomplished?
OUTCOME: What did the executed action actually produce?
```

The concept of Outcome supersedes purely computational abstractions like `Result` or `Response`.

UCAs produce Outcomes; these Outcomes can be packaged into Impulses and transported across the system's communication bus.

---

## 18. Attainment (Goal Fulfillment Assessment)

`Attainment` represents the degree to which an Outcome satisfies the Goal that triggered activation.

An essential principle of ontological separation governs this relationship:

> The Outcome belongs to the executor.

> The Attainment belongs to whoever set the Goal.

The UCA executing an action produces an Outcome and does not need to determine whether that Outcome satisfies the broader operational need of the requester.

Example:

```text
UCA₁ (Coordinator)
Goal: "Identify who decided to adopt technology X"
        ↓
UCA₂ (Knowledge / Memory)
Outcome: "Christian decided to adopt technology X"
        ↓
UCA₁ (Coordinator)
Attainment: Evaluates whether the Outcome satisfactorily meets its need.
```

---

## 19. Attainment Is Relative to the Observer

Attainment is not an absolute or universal metric; it is always assessed relative to the observer's Goal.

System-level example:

```text
System Architect
Purpose: Build an adaptive cognitive system.
Goal: Implement the UCA specification.
        ↓
Cognitive System
Outcome: Ensemble of interacting UCAs.
        ↓
System Architect
Attainment: Does the resulting system fulfill the original design goal?
```

The system cannot unilaterally self-certify that it has achieved success; the originator of the goal assesses the Attainment.

---

## 20. Reactivity

A UCA never self-activates spontaneously.

Rule:

> A UCA executes its cycle strictly upon receiving a Stimulus.

There is no concept of a UCA "waking up" on its own without a cause. Every execution is locally reactive to a received stimulus.

---

## 21. External Causality

Every chain of cognitive activations must originate outside the cognitive system itself.

An external stimulus may stem from:

```text
message from an interlocutor
voice or audio signal
environment or operating system event
timer notification
tool execution return
system lifecycle event (startup / initialization)
```

Internal UCAs may trigger subsequent activations as a direct causal consequence of that initial stimulus, but no cognitive chain appears spontaneously in a vacuum.

---

## 22. System Initialization as an External Stimulus

The initial bootstrap of a cognitive agent is also an external causal stimulus:

```text
SYSTEM INITIALIZATION
          ↓
       Impulse
          ↓
       Stimulus
          ↓
Foundational UCAs (e.g. Identity UCA)
```

This guarantees foundational cognitive capacities (such as self-identity representation) are configured before any user dialogue occurs.

---

## 23. Identity UCA (Self UCA)

A foundational UCA in any cognitive agent is that responsible for self-identity:

```text
Identity UCA

Purpose:
Maintain and project a coherent representation
of the system's identity, boundaries, and role.
```

It may utilize as Capabilities:

```text
declared directives
autobiographical records
relationship history
inference
```

The static string `"AgentName"` is not the UCA.

The UCA is **the active cognitive capacity to maintain and articulate who the agent is**.

---

## 24. Knowledge vs Cognitive Capacity

Storing data or representations is not equivalent to possessing a cognitive capacity.

Example:

```text
Knowledge Store:
Contains structured data regarding user preferences or facts.
```

versus:

```text
Identity / Social UCA:
Active capacity to interpret, reason about, and apply situational relevance.
```

The storage supplies evidence; the UCA exercises a cognitive capacity directed by its Purpose.

---

## 25. Emergent Proactivity

An individual UCA is not proactive; it is strictly reactive to its stimulus.

However, the complete system of UCAs can exhibit emergent proactive behavior:

```text
External Stimulus
       ↓
UCA₁ (Ingress / Coordination)
       ↓ Outcome
UCA₂ (Analysis / Knowledge)
       ↓ Outcome
UCA₃ (Planning / Egress)
       ↓
Action toward the external world
```

Even when the initial external stimulus is minimal, the causal chaining between autonomous units produces composed actions not explicitly demanded in the initial prompt.

> Autonomy resides in the Purpose.
> Reactivity governs each unit's execution.
> Proactivity emerges from inter-unit interaction.

---

## 26. Emergent Cognition

Cognition does not reside in an isolated UCA or a central monolithic model.

It emerges from the causal, distributed, contextual interaction among specialized units:

```text
Cognition = Interaction(
    Purposes,
    Goals,
    Contexts,
    Dispositions,
    Capabilities,
    Actions,
    Outcomes,
    External Evidence
)
```

Each UCA maintains bounded scope; cognitive behavior belongs to the emergent system.

---

## 27. The External Environment in the Cognitive Loop

The system acts upon the external environment, and the environment responds. That response becomes new evidence:

```text
System emits Outcome
         ↓
External Environment
         ↓
External Response / Feedback
         ↓
New External Stimulus
```

The system does not need to precompute everything internally; continuous interaction provides the external evidence needed to confirm or adapt behavior.

---

## 28. Learning via Interaction and Disposition Adaptation

Learning does not consist of units rewriting their own code or prompt in flight.

It emerges through the loop:

```text
System Outcome
       ↓
External Environment
       ↓
External Evidence (correction or validation)
       ↓
New Stimulus
       ↓
Supervisory / Diagnostic UCA
       ↓
Adaptation UCA
       ↓
Mutation of the responsible UCA's Disposition
       ↓
Future behavior adapted
```

Learning consists of interaction generating evidence that allows supervisory units to adapt the `Dispositions` governing future activations.

---

## 29. Supervisory and Coherence Preservation UCA

A UCA-based architecture may feature one or more units dedicated to preserving coherence and diagnosing deviations:

```text
Coherence & Supervision UCA (UCA₁)
├── Diagnostic UCA (UCA₂)
└── Adaptation UCA (UCA₃)
```

- `UCA₂ (Diagnosis)`: Evaluates discrepancies between expected and observed results to determine the root cause of an error.
- `UCA₃ (Adaptation)`: Determines which `Disposition` must be updated on the target UCA to mitigate the issue in future occurrences.

---

## 30. Coordination and Dispatch UCA

In multi-channel or multi-domain systems, a UCA can hold the Purpose of coordinating and routing activations:

```text
              UCA₁ (Coordinator)
            /         |         \
           /          |          \
          ↓           ↓           ↓
     UCA₂ (Self)  UCA₃ (Memory)  UCA₄ (Egress)
```

The coordinator does not contain the domain logic of other units; it orchestrates their activation according to its coordination Purpose.

---

## 31. Inter-UCA Communication and the Transport Layer

UCAs do not require hard-coded coupling or direct memory references to one another.

Interaction occurs across the system's transport layer (`Transport Layer` / `Event Bus`) via `Impulses`:

```text
UCA₁
  ↓ emits
Stimulus { Goal, Context }
  ↓ transported via
Impulse
  ↓ over
Transport Layer
  ↓ delivered to
UCA₂
  ↓ executes cycle
Outcome
  ↓ transported via
Return Impulse
  ↓ over
Transport Layer
  ↓ delivered to
UCA₁
```

This guarantees loose coupling, concurrency, and fault isolation.

---

## 32. Causal Traceability

Although UCAs are decoupled and asynchronous, the full causal interaction chain must remain traceable via impulse metadata:

- `traceId`: Unique identifier for the origin transaction.
- `parentImpulseId`: Causal link to the preceding impulse.
- `sessionId`: Interaction session scope.
- `timestamp`: Event timing.

Trace chain:

```text
External Stimulus ──► Ingress UCA [trace X] ──► UCA₁ [trace X] ──► UCA₂ [trace X] ──► Egress UCA [trace X] ──► Exterior
```

---

## 33. Re-evaluating the Centralized Global Snapshot Pattern

Many traditional agent architectures rely on a single monolithic state object (often named *CognitiveSnapshot* or *AgentState*) that amalgamates all variables: identity, users, task trees, dialogue history, and environment.

Within the UCA architecture, this pattern is understood as a design symptom: an aggregate container acting as a placeholder for cognitive capacities that have not yet been modeled as autonomous units.

---

## 34. Decomposition of the Global State

Any property in a global snapshot can be analyzed ontologically:

```text
What does this data conceptually represent?
├── 1. Persistent knowledge?  ──► Belongs to a Knowledge / Memory UCA.
├── 2. Runtime execution state?──► Belongs to the Transport / Runtime Layer.
└── 3. Active cognitive capacity?──► Identify its Purpose and formalize a UCA.
```

---

## 35. State Distributed Across the Cognitive Organization

The state of a cognitive system does not need to reside in a single serialized object.

It emerges from:
- the active UCAs;
- the current `Dispositions` in each UCA;
- the accessible acquired knowledge;
- relevant prior Outcomes;
- the bounded Context of the active causal chain.

---

## 36. Dynamic Context as Cognitive Synthesis

The `Context` for an activation is not a raw clone of the entire system state; it is synthesized on-demand through Outcomes from relevant units:

```text
Coordinator UCA
├── Identity UCA ──► Outcome (Role context)
├── Memory UCA   ──► Outcome (Relevant facts)
└── Social UCA   ──► Outcome (Interlocutor data)
        ↓
Specialized, compact Context for the immediate action
```

---

## 37. Fundamental UCA Abstraction

A UCA can be expressed through a minimal interface:

```typescript
interface UCA<TGoal, TContext, TOutcome, TDisposition> {
  readonly purpose: string;
  disposition: TDisposition;
  readonly capabilities: Capability[];

  execute(stimulus: Stimulus<TGoal, TContext>): Promise<Outcome<TOutcome>>;
}
```

Where:
- `Stimulus` groups `Goal` and `Context`.
- `execute` performs observation, weights disposition and capabilities, runs the action, and returns the `Outcome`.

---

## 38. Separation Between UCA and Runtime

The **Runtime** manages operational infrastructure:
- impulse routing and delivery;
- serialization, timeouts, and concurrency;
- causal trace identifiers;
- process lifecycle and bus reactivity.

The **UCA** concentrates purely on cognitive semantics:
- `Purpose`, `Disposition`, `Capabilities`, `Stimulus`, `Action`, and `Outcome`.

---

## 39. UCA Discovery and Boundary Formulation

UCAs must not be derived from rigid pre-baked taxonomies. They are discovered by identifying autonomous purposes:

```text
Functional need in the system
              ↓
Does an autonomous, stable cognitive purpose exist?
              ├── NO  ──► It is a Capability or ordinary mechanism.
              └── YES ──► Formalize a new UCA.
                              ↓
                      What capabilities does it require?
                              ↓
              Do any of these capabilities possess an autonomous purpose?
                              ├── YES ──► New subordinate UCA (Composition).
                              └── NO  ──► Terminal capability (Algorithm, tool, LLM).
```

---

## 40. Adaptation Example: Factual Correction

1. **Initial Stimulus**: The interlocutor states: *"Christian decided to adopt WebRTC"*.
2. The Ingress UCA receives the message and activates Coordinator UCA ($UCA_1$).
3. $UCA_1$ queries Memory UCA ($UCA_2$) and outputs an incorrect response via Egress UCA: *"Marco decided to adopt WebRTC"*.
4. **External Evidence**: The user corrects: *"No, I just told you it was Christian, not Marco"*.
5. Coordinator UCA detects the contextual inconsistency and activates Supervisory UCA ($UCA_3$).
6. $UCA_3$ diagnoses that recent memory weighting was insufficient under contradiction, and adapts the `Disposition` of the Memory UCA (increasing sensitivity to direct user corrections).
7. In an equivalent future interaction, the Memory UCA operates under the updated disposition and provides the correct answer, **without code modification and without retraining any model**.

---

## 41. What Is NOT a UCA

The following do not constitute a UCA on their own:

```text
a message or event
a network impulse
a prompt or text template
an LLM or model API
a search algorithm or parser
a database or vector index
a state field or property
```

All of these are valuable instrumental components (`Capabilities` or `Transport`), but a UCA only exists when organized around an autonomous `Purpose`.

---

## 42. Fundamental Principles of the UCA Model

1. **Principle of Purpose**: A UCA exists because it possesses an autonomous, stable Purpose.
2. **Principle of Specialization**: A UCA only accepts Goals compatible with its Purpose.
3. **Principle of Reactivity**: No spontaneous self-activation; a UCA executes strictly upon receiving a Stimulus.
4. **Principle of External Causality**: Every cognitive chain originates outside the cognitive system.
5. **Principle of Composition**: A UCA can leverage another UCA as a subordinate Capability.
6. **Principle of Termination**: When autonomous purposes cease to emerge, terminal capabilities have been reached.
7. **Principle of Outcome**: A UCA produces real Outcomes; it does not self-evaluate in the abstract.
8. **Principle of Attainment**: The Outcome belongs to the executor; the Attainment belongs to whoever set the Goal.
9. **Principle of Non-Self-Adaptation**: A UCA does not alter its own Disposition; adaptation proceeds from an independent supervisory capacity.
10. **Principle of Emergence**: Cognition does not reside in a central unit; it emerges from contextual interaction among units.
11. **Principle of Proactivity**: Autonomy resides in Purpose, reactivity in execution, and proactivity emerges from causal chaining.
12. **Principle of Representation**: Possessing data produced by a cognitive capacity is not equivalent to possessing the capacity itself.

---

## 43. Global Interaction Model

```text
                         EXTERIOR
                            │
                         Stimulus
                            │
                            ▼
                    ┌───────────────┐
                    │  UCA SYSTEM   │
                    │               │
                    │     UCA₁      │
                    │    /  |  \    │
                    │  UCA₂ UCA₃ UCA₄│
                    │    \  |  /    │
                    │    Outcomes   │
                    │       │       │
                    │    Context    │
                    │       │       │
                    │   New Actions │
                    └───────┬───────┘
                            │
                         Outcome
                            │
                            ▼
                         EXTERIOR
                            │
                       New Evidence
                            │
                            └──────────────► (Informs future adaptations)
```

---

## 44. Empirical Validation Criteria

The UCA model is validated when an ensemble of units can:

1. Receive an external stimulus;
2. React according to specialized purposes without an omniscient central entity;
3. Collaborate via stimulus and outcome exchange;
4. Produce an action toward the external environment;
5. Receive external feedback/evidence regarding the outcome;
6. Use that evidence to diagnose deviations;
7. Adapt one or more `Dispositions`;
8. React correctly in an equivalent future scenario;
9. Accomplish this **without source code modifications**;
10. Accomplish this **without retraining models**;
11. Accomplish this **without ad-hoc hardcoded rules designed for the test case**.

---

## 45. Core Thesis

> **A UCA is a functional unit autonomous in purpose and reactive in execution.**
>
> **It receives a Goal within a Context, applies its Dispositions and Capabilities, executes an Action, and produces an Outcome.**
>
> **The Outcome is evaluated relative to the Goal by the entity that originated the need (Attainment).**
>
> **All cognitive activity originates from external causes, but contextual interaction among units yields emergent cognition and proactivity.**
>
> **Knowledge supplies evidence; UCAs supply purpose-driven capabilities; runtime supplies transport and infrastructure.**
>
> **Cognition does not reside in a single UCA or central model: it emerges from dynamic interaction between specialized capabilities and their environment.**

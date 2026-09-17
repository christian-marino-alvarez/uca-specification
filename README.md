# UCA — Artificial Cognitive Unit (Unidad Cognitiva Artificial)

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Status: Open Specification RFC](https://img.shields.io/badge/Status-Open%20Specification%20RFC-orange.svg)](SPECIFICATION.md)

[ English | [Español](README.es.md) ] &nbsp;•&nbsp; [ [Specification (EN)](SPECIFICATION.md) | [Especificación (ES)](SPECIFICATION.es.md) ]

> **A UCA is defined not by what it executes, but by the purpose it is responsible for fulfilling.**
>
> *Una UCA no se define por lo que ejecuta, sino por el propósito que es responsable de alcanzar.*

---

## 📖 Executive Summary

Many contemporary Artificial Intelligence agent architectures rely on a monolithic pattern:
```text
Input ──► Central State / Snapshot ──► Large Context Prompt ──► Central Model ──► Output
```
This pattern frequently concentrates disparate concerns into aggregate state objects and delegates planning, coordination, and error recovery entirely to single model inferences.

The **UCA (Artificial Cognitive Unit)** open specification defines a minimal, purpose-driven abstraction:
- **Dedicated, Bounded Purpose**: Cognitive functionality is divided according to dedicated, invariant cognitive purposes (`Purpose`).
- **Reactivity in Execution**: A UCA executes strictly upon receiving an activating stimulus.
- **Emergent Behaviour (Hypothesis)**: Cognitive behaviour may emerge from the contextual interaction of purpose-bounded units. This is a hypothesis to be validated experimentally, not a demonstrated property.
- **Structural Adaptation Without Retraining**: Dispositions can adapt in response to operational feedback, altering future behaviour without modifying code or retraining model weights.

---

## 🧩 From Primitive to Emergent Behaviour

> **UCA is not cognition.**
>
> **UCA is a minimal functional primitive proposed for composing systems in which cognitive behaviour may emerge.**

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

---

## ⚖️ Specification vs Implementation

This open specification defines the conceptual contract of an Artificial Cognitive Unit.

**The specification deliberately defines**:
- What constitutes a UCA;
- How a UCA is activated;
- How it performs an Action and produces an Outcome;
- The invariants that govern composition and bounded scope.

**The specification does NOT prescribe**:
- A mandatory cognitive topology or hierarchy;
- Specific cognitive units that every system must instantiate;
- Biological or neuroanatomical analogies;
- A particular communication technology or message broker;
- A specific language model, framework, or vendor;
- A concrete memory or storage engine;
- A centralized global state representation;
- A specific runtime environment;
- That any individual UCA possesses or demonstrates cognition.

---

## 🔬 Minimal Conceptual Model (UCA Core)

A UCA is conceived formally as a tuple:
```text
u = (p, d, C, O) ∈ ℙ × 𝔻 × 𝒫(ℂ) × 𝕆_def
```
Where:
- **`p` (Purpose)**: Functionally determines what the UCA is and what it pursues throughout its existence — guides all reactions.
- **`d` (Disposition)**: Set of constitutive, parametric (`Properties`: Function, Nature, Value), and interactive (`Interactions`: Definition, Target, Signal, When) conditions determining how its capabilities are predisposed to behave and interact.
- **`C` (Capabilities)**: Operational resources (algorithms, transforms, tools, models, other UCAs) constituting the unit's functional boundaries ($\forall b \in \text{Behaviors}(u), \text{requiredCapabilities}(b) \subseteq C_u$).
- **`O` (Outcome)**: Formally defines the observable change produced as a consequence of the UCA's activity, structured with empirical properties (`Properties`), deterministic criteria (`Criteria`), and an external `Owner` holding exclusive validation authority.

An activation is defined formally as:
```text
s ∈ 𝕊
```
Where:
- **`s` (Stimulus)**: Reception by a UCA of an external observable change to its functional boundary that triggers its reaction ($\text{Stimulus}(u_B, \Delta x)$). Brings the perturbation or data upon which the unit operates; it does not redefine Purpose nor convey goals or targets, nor require a formal Context container in the Core.
- **`Reception`**: Reactive, mechanical, universal, and non-cognitive mechanism constitutive of UCA Core by which the UCA admits the external observable change. Formally distinguished from `Perception`, which is a specialized and optional function performed by UCAs whose Purpose requires interpreting or giving meaning to what is received.

The fundamental and evolutionary lifecycle:
```text
Conception ──► u(p, d, C, O) ──► Reception(Δx) ──► s ──► Reactive Process (Interactions) ──► Outcome (Δx)
                                 ▲                                                                 │
                                 │                                                       Criteria ─┼──► Compliance (PASS | FAIL)
                                 │                                                                 │
                                 │                                                          Owner ─┼──► Validation (APPROVED | REJECTED)
                                 │                                                                 │
                                 │                                                                 ▼
                                 │                                                            Tracker UCA ──► History (H ∈ ℍ)
                                 │                                                                                  │
                                 │                                                                          Analyzer UCA
                                 │                                                                                  │
                                 │                                                                          Evolution UCA
                                 │                                                                                  │
                                 └───────────────── Atomic Mutation (Nature) ◄──────────────────────────────────────┘
```

> **The Outcome belongs to the executor (Target UCA).**  
> **Evaluation belongs to whoever demands execution (the external Owner).**  
> **Objective criteria evaluation (`Compliance`: PASS | FAIL) is deterministic.**  
> **Contextual validation (`Validation`: APPROVED | REJECTED) belongs exclusively to the Owner.**  
> **Evolution is an asynchronous historical process mediated by accumulated evidence.**

### Canonical Activation and Reactivity Flow

```mermaid
flowchart TD
    CON[Conception: Purpose, Capabilities, Disposition, Outcome] --> UCA[Valid & reactive Target UCA]
    CHG[Observable change: Δx] --> REC[Reception: Mechanical & universal]
    REC --> STIM[Stimulus: Triggers reaction in UCA]
    STIM --> UCA
    UCA --> INT[Reactive Interactions between Capabilities]
    INT --> PROC[Emergent Reactive Process]
    PROC --> OUT[Outcome: Observable change Δx with Properties]
    OUT --> CRIT[Criteria: Universal rules]
    CRIT --> COMP[Compliance: PASS | FAIL]
    OUT & UCA --> OWN[External Owner UCA]
    OWN --> VAL[Validation: APPROVED | REJECTED]
    COMP & VAL --> TRK[Tracker UCA]
    TRK --> HIST[(History: Multi-execution evidence)]
    HIST -.-> ANA[Analyzer UCA: Offline correlation]
    ANA -.-> EVO[Evolution UCA: Improvement hypotheses]
    EVO -.-> MUT[Atomic Mutation within Nature]
    MUT -.-> DISP[evolved ΔDisposition]
    DISP -.-> UCA
```

---

## 📜 Fundamental Principles of the Model

1. **Conception determines what UCA exists.**
2. **Purpose functionally determines what UCA is and what it pursues throughout its existence.**
3. **Capabilities determine the boundaries of what the UCA can do.**
4. **Disposition determines how those Capabilities are constituted and predisposed to behave and interact.**
5. **Stimulus is the reception by a UCA of an external observable change to its functional boundary that triggers its reaction, mechanically mediated by Reception.**
6. **Reception is a universal, non-cognitive reactive mechanism of UCA Core; Perception is a specialized, optional function dependent on Purpose.**
7. **Capabilities react through Interactions and not through direct dependencies between them.**
8. **The Process emerges from reactive interactions between Capabilities according to their Dispositions.**
9. **Outcome is the observable change produced by a UCA's activity, structured in Properties, Criteria, and Owner, with objective Compliance evaluation (PASS | FAIL) and external contextual validation (Validation: APPROVED | REJECTED).**
10. **Evolution is an asynchronous historical process mediated by specialized roles (Tracker, Analyzer, Evolution) over accumulated evidence (History), strictly prohibiting direct self-evolution upon isolated outcomes.**
11. **The minimal unit of Evolution is an atomic, bounded, observable, and potentially reversible Mutation within Nature, where $\Delta\text{Disposition} = \text{difference}(D_0, D_1)$ expresses state difference and never intrinsic improvement.**

---

## ✅ Minimal Conformance Criteria

A software component conforms to the **UCA Core** if and only if:

1. It defines an explicit, dedicated, stable, implementation-independent **Purpose** (`P`).
2. It has a declarative **Disposition** (`D`) conditioning its behaviour and interactions.
3. It operates using an explicit and bounded set of **Capabilities** (`C`).
4. It executes strictly upon receiving an activating **Stimulus** (`S`) external to its functional boundary.
5. It performs an **Action** (`A`) pursuing its Purpose within the boundaries of its Capabilities and Disposition.
6. It produces one or more **Outcomes** (`O`) structured with empirical Properties, objective Criteria, and an external Owner holding validation authority, adhering to the non-self-validation invariant.
7. It treats another component as a UCA only if that component has a dedicated, differentiated Purpose.

**Non-requirements for conformance**: An implementation does *not* require a dual teleology, intermediate objectives or goals, or a formal Context container as mandatory universal stimulus structures, Observation or Perception as lifecycle phases, Memory, Identity, Learning, Adaptation, a Coordinator, Dispatcher, Orchestrator or Supervisor, an LLM, external causality, an Impulse envelope, an Event Bus, a global state snapshot, Synapses, or demonstrated emergent cognitive behaviour to conform to UCA.

Conformance evaluates the **individual unit** against the UCA contract. It does not evaluate whether the system as a whole exhibits cognitive behaviour.

---

## 🔬 The Falsifiable Hypothesis

> **Can cognitive behaviour emerge from the interaction of purpose-bounded UCAs while each individual unit remains structurally limited to $u = (p, d, C, O)$ and behaviourally limited to $(u, s) \to a \to o$?**

This is the central experimental question UCA poses. It is to be evaluated through future implementations and empirical observation.

---

## 📚 Complete Formal Specification

- 🇬🇧 **[SPECIFICATION.md (English)](SPECIFICATION.md)** — Exhaustive normative specification (RFC), including formal ontology, cognitive architecture (§4), recursive composition (§3), scientific hypothesis (§6), architectural background and related work (§10), bibliographic references (§11), and TypeScript reference runtime specification with non-normative usage examples (§12).
- 🇪🇸 **[SPECIFICATION.es.md (Español)](SPECIFICATION.es.md)** — Especificación formal completa en español (RFC), incluyendo especificación de runtime de referencia en TypeScript con ejemplos ilustrativos de uso (§12).
- 💻 **[`examples/` Directory](examples/)** — Non-normative executable TypeScript reference usage examples.

---

## License

UCA Specification © 2026 Christian Marino Alvarez.

This specification and its documentation are licensed under the
Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, share, adapt, and implement this specification,
including for commercial purposes, provided appropriate attribution is given.

Software implementations and reference runtimes are licensed separately.

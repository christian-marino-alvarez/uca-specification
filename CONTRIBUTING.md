# Contributing to the UCA Specification (RFC)

[ English | [Español](CONTRIBUTING.es.md) ]

We welcome community discussion, scrutiny, and contributions to formalize and evolve the **Artificial Cognitive Unit (UCA)** specification.

## How to Contribute?

1. **Discussions & Questions**: Use GitHub **Discussions** or **Issues** to raise conceptual questions, edge cases, or modeling proposals.
2. **RFC Change Proposals**:
   - Any modification to [`SPECIFICATION.md`](SPECIFICATION.md) or [`SPECIFICATION.es.md`](SPECIFICATION.es.md) must be submitted via a Pull Request.
   - Clearly state which layer or section is affected:
     - **UCA Core** (minimal functional primitive)
     - **UCA Composition** (recursive capability usage)
     - **Cognitive Architecture** (organization and higher-level patterns)
     - **Runtime Considerations** (execution infrastructure)
     - **Experimental Hypotheses** (falsifiable empirical claims)
     - **Examples**
     - **Conformance**
     - **Open Questions**
     - **Architectural Background and Related Work** (informative historical context)
     - **References**
   - **Minimality Principle**: A concept belongs to the UCA Core *only* if removing it prevents a unit from satisfying the universal UCA contract. A proposal must not introduce a new concept into the Core simply because it is useful for a specific cognitive architecture.
   - **Composition Principle**: Before extending the UCA primitive with a new cognitive mechanism, first attempt to represent that responsibility through the composition of existing UCAs. Concepts such as Observation, Memory, Planning, Coordination, Supervision, Identity, Event Bus, or Impulse must not be added to the Core without demonstrating they are strictly necessary for the minimal unit.
   - Maintain consistency with the foundational principles:
     - Primacy of dedicated Purpose.
     - Reactive execution upon receiving a Stimulus.
     - Decoupling between cognitive purpose and terminal mechanisms.
     - Separation between unit Outcome and external Evaluation under explicit criteria.
     - Disposition adaptation policies belong to Cognitive Architecture, not the universal Core.

## License of Contributions

By submitting contributions, you agree that your documentation and text contributions are licensed under the **Creative Commons Attribution 4.0 International (CC BY 4.0)** license.

export const UCA_ARCHITECTURE_DOCUMENTATION = `
# Universal Cognitive Architecture (UCA) - Technical Specification

## 1. Ontological Foundation
A UCA (Unidad Cognitiva Artificial / Autonomous Cognitive Unit) is a minimal functional primitive defined as:
  u = (p, d, C, O)
where:
- p (Purpose): The immutable teleological reason for existence. What the unit pursues throughout its lifecycle.
- d (Disposition): How the unit is predisposed to behave. Contains:
  - aim: { description: string, body?: Record<string, unknown> }
  - reactTo: Array of nervous signal names that stimulate the unit.
  - inputs: Declared input signal ports.
  - outputs: Declared output signal ports.
- C (Capabilities): The operational substrate and reactive mechanisms (terminal abilities).
- O (Outcomes): Observable consequences emitted as structured signals via \`pulse(property, value)\`.

## 2. Fractal Composition via Cooky
UCAs compose sub-UCAs and capabilities through declarative Cooky tuples:
  Cooky = Array<[CapabilityConstructor, Disposition]>
When a UCA innervates, all composed elements in its Cooky are automatically innervated and connected to the shared nervous system (EventTarget).

## 3. Reactive Signal Bus
Communication is strictly decoupled and event-driven. Units never hold direct references to each other.
- When an event occurs, an impulse is pulsed: \`pulse(signalName, payload)\`.
- Units listening via their \`reactTo\` disposition execute their \`react(signal)\` method.

## 4. UI Primitives in Catalog
- **Box**: Structural layout container. Body: { text?: string, className?: string, role?: string }.
- **Action**: Interactive button / trigger. Body: { label: string, title?: string }. Emits 'action.trigger' upon user interaction.
- **Input**: Data capture element. Body: { placeholder?: string, value?: string }. Emits 'input.change'.
- **List**: Collection display. Body: { items?: Array<unknown> }.
- **Picture**: Image element. Body: { src: string, alt?: string }.
- **Toggle**: Boolean switch. Body: { checked?: boolean, label?: string }. Emits 'toggle.change'.

## 5. Web View Generation Rules
When composing a web view for UCA, provide:
- 'ucas': Flat array of single-level elements: [ { [ucaId]: { aim: { description: string, body: {...} }, reactTo: [...] } } ]. Strictly flat array, NO hierarchical or DOM trees.
- 'answer': Concise educational explanation (maximum 1-2 paragraphs) of UCA architecture and reactive composition.
`.trim();

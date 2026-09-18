# UCA Examples (Ejemplos de Uso)

This folder contains non-normative reference examples demonstrating how to use and implement Autonomous Cognitive Units (UCAs) in TypeScript.

> **Important Note / Nota Aclaratoria:**
> The examples provided here are **strictly non-normative usage examples**. They serve solely to illustrate the application of the UCA specification and its runtime model. They do not prescribe an obligatory architecture for conversational agents or any other system.

---

## Included Examples

### 1. Voice Agent Example (`voice-agent.example.ts`)
Demonstrates:
- Primitive capabilities (`AcousticEar`, `VocalMouth`) inheriting from `Uca`.
- Decoupled registration in `defaultRegistry` using `camelCase` identifiers.
- Composite agent (`ConversationalAgent`) declaring innate capabilities and dispositions via `camelCase` keys.
- Automatic property mutation detection via reactive Proxy.
- Decoupled signal dispatch and reactive execution via `reactTo`.

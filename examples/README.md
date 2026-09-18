# UCA Examples (Ejemplos de Uso)

This folder contains non-normative reference examples demonstrating how to use and implement Autonomous Cognitive Units (UCAs) in TypeScript.

> **Important Note / Nota Aclaratoria:**
> The examples provided here are **strictly non-normative usage examples**. They serve solely to illustrate the application of the UCA specification and its runtime model. They do not prescribe an obligatory architecture for conversational agents or any other system.

---

## Included Examples

### 1. Voice Agent Example (`voice-agent.example.ts`)
Demonstrates:
- Pure terminal capabilities (`AudioFramingService`, `SpeechSynthesizerService`) providing pure algorithmic/mechanical functionality without extending `Uca` and without `purpose` (§3.2).
- Primitive UCAs (`AcousticEar`, `VocalMouth`) inheriting from `Uca` with their own `purpose` and utilizing terminal capabilities internally as mechanisms.
- Decoupled registration of primitive UCAs in `defaultRegistry` using `camelCase` identifiers.
- Composite agent (`ConversationalAgent`) recursively composing constituent primitive UCAs (§3.1).
- Automatic property mutation detection via reactive Proxy.
- Decoupled signal dispatch and reactive execution via `reactTo`.

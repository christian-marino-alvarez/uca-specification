# UCA — Unidad Cognitiva Artificial (Artificial Cognitive Unit)

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](LICENSE)
[![Status: Open Specification RFC](https://img.shields.io/badge/Status-Open%20Specification%20RFC-orange.svg)](SPECIFICATION.es.md)

[ [English](README.md) | Español ] &nbsp;•&nbsp; [ [Specification (EN)](SPECIFICATION.md) | [Especificación (ES)](SPECIFICATION.es.md) ]

> **Una UCA no se define por lo que ejecuta, sino por el propósito que es responsable de alcanzar.**
>
> *An Artificial Cognitive Unit is defined not by the algorithm it executes, the model it uses, or the data it processes, but by why it exists within the cognitive system.*

---

## 📖 Resumen Ejecutivo

Muchas arquitecturas contemporáneas de agentes de Inteligencia Artificial se apoyan en un patrón monolítico:
```text
Input ──► Estado Central / Snapshot ──► Prompt con Gran Contexto ──► Modelo Central ──► Output
```
Este patrón suele concentrar responsabilidades dispares en estructuras globales masivas y delega la planificación, coordinación y resolución de errores exclusivamente en inferencias de modelos individuales.

La especificación abierta **UCA (Unidad Cognitiva Artificial)** define una abstracción minimalista orientada a propósitos:
- **Propósito Propio y Acotado**: La funcionalidad cognitiva se divide según propósitos propios e invariantes (`Purpose`).
- **Reactividad en la ejecución**: Una UCA actúa estrictamente ante un Stimulus recibido.
- **Comportamiento Emergente (Hipótesis)**: El comportamiento cognitivo puede emerger de la interacción contextual entre unidades acotadas por propósito. Esta es una hipótesis a validar experimentalmente, no una propiedad demostrada.
- **Adaptación estructural sin reentrenamiento**: Las Dispositions pueden adaptarse en respuesta a retroalimentación operacional, modificando la conducta futura sin alterar código fuente ni reentrenar pesos.

---

## 🧩 De Primitiva a Comportamiento Emergente

> **Una UCA no es cognición.**
>
> **Una UCA es una primitiva funcional mínima propuesta para componer sistemas en los que el comportamiento cognitivo puede emerger.**

```text
┌──────────────────────────────┐
│             UCA              │  ← primitiva funcional (normativa)
│  u = (p, d, C, O)            │
│  (u, s) → o              │
└──────────────┬───────────────┘
               │ composición
               ▼
┌──────────────────────────────┐
│       SISTEMA DE UCAs        │  ← red de primitivas funcionales
│   u₁ ↔ u₂ ↔ ... ↔ uₙ         │
└──────────────┬───────────────┘
               │ organización
               ▼
┌──────────────────────────────┐
│    COGNITIVE ARCHITECTURE    │  ← organización de primitivas
└──────────────┬───────────────┘
               │ ejecutado por
               ▼
┌──────────────────────────────┐
│           RUNTIME            │  ← infraestructura de ejecución
└──────────────────────────────┘
```

Y de forma separada, como hipótesis de investigación:

```text
SISTEMA DE UCAs
       │
       │ hipótesis experimental
       ▼
EMERGENT COGNITIVE BEHAVIOUR
```

---

## ⚖️ Especificación frente a Implementación

Esta especificación abierta define el contrato conceptual de una Unidad Cognitiva Artificial.

**La especificación define deliberadamente**:
- Qué constituye una UCA;
- Cómo se activa una UCA;
- Cómo ejecuta internamente su Reaction y produce un Outcome;
- Las invariantes que gobiernan la composición y el alcance acotado.

**La especificación NO prescribe**:
- Una topología cognitiva o jerarquía obligatoria;
- Unidades cognitivas específicas que todo sistema deba instanciar;
- Analogías biológicas o neuroanatómicas;
- Una tecnología de comunicación o broker de mensajes particular;
- Un modelo de lenguaje, framework o proveedor específico;
- Un motor de memoria o base de datos concreto;
- Una representación centralizada de estado global;
- Un entorno de ejecución específico;
- Que ninguna UCA individual posea o demuestre cognición.

---

## 🔬 Modelo Conceptual Mínimo (UCA Core)

Una UCA es concebida formalmente como una tupla:
```text
u = (p, d, C, O) ∈ ℙ × 𝔻 × 𝒫(ℂ) × 𝕆_def
```
Donde:
- **`p` (Purpose)**: Determina funcionalmente qué UCA es y aquello que persigue durante toda su existencia — orienta toda reacción.
- **`d` (Disposition)**: Conjunto de condiciones constitutivas, paramétricas (`Properties`: Function, Nature, Value) e interactivas (`Interactions`: Definition, Target, Signal, When) que determinan cómo sus capacidades están predispuestas para comportarse e interactuar.
- **`C` (Capabilities)**: Recursos operacionales (algoritmos, transforms, herramientas, modelos, otras UCAs) que constituyen los límites funcionales de la unidad ($\forall b \in \text{Behaviors}(u), \text{requiredCapabilities}(b) \subseteq C_u$).
- **`O` (Outcome)**: Define formalmente el cambio observable producido como consecuencia de la actividad de la UCA, estructurado con propiedades empíricas (`Properties`), criterios deterministas (`Criteria`) y un `Owner` externo con autoridad exclusiva de validación.

Una activación se define formalmente como:
```text
s ∈ 𝕊
```
Donde:
- **`s` (Stimulus)**: Recepción por una UCA de un cambio observable externo a su frontera funcional que provoca su reacción ($\text{Stimulus}(u_B, \Delta x)$). Aporta la perturbación o datos sobre los que opera la unidad; no redefine el Purpose ni transporta metas u objetivos, ni requiere un contenedor formal de Context en el Core.
- **`Reception`**: Mecanismo reactivo, mecánico, universal y no cognitivo constitutivo de UCA Core mediante el cual la UCA admite el cambio observable externo. Se distingue formalmente de `Perception`, que es una función especializada y opcional realizada por UCAs cuyo Purpose requiere interpretar o dotar de significado lo recibido.

El ciclo de vida fundamental y evolutivo:
```text
Conception ──► u(p, d, C, O) ──► Reception(Δx) ──► s ──► Reaction (Actions & Interactions) ──► Outcome (Δx)
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

> **El Outcome pertenece a quien ejecuta (Target UCA).**  
> **La evaluación pertenece a quien demanda la ejecución (el Owner externo).**  
> **La evaluación objetiva de criterios (`Compliance`: PASS | FAIL) es determinista.**  
> **La validación contextual (`Validation`: APPROVED | REJECTED) pertenece exclusivamente al Owner.**  
> **La evolución es un proceso histórico asíncrono mediado por evidencia acumulada.**

### Flujo Canónico de Activación y Reactividad

```mermaid
flowchart TD
    CON[Conception: Purpose, Capabilities, Disposition, Outcome] --> UCA[Target UCA vigente y reactiva]
    CHG[Cambio observable: Δx] --> REC[Reception: Mecánica y universal]
    REC --> STIM[Stimulus: Provoca reacción en UCA]
    STIM --> UCA
    UCA --> RXN[Reaction interna: Actions e interacciones entre Capabilities]
    RXN --> PROC[Reactive Process emergente]
    PROC --> OUT[Outcome: Cambio observable Δx con Properties]
    OUT --> CRIT[Criteria: Reglas universales]
    CRIT --> COMP[Compliance: PASS | FAIL]
    OUT & UCA --> OWN[Owner UCA externa]
    OWN --> VAL[Validation: APPROVED | REJECTED]
    COMP & VAL --> TRK[Tracker UCA]
    TRK --> HIST[(History: Evidencia multiejecución)]
    HIST -.-> ANA[Analyzer UCA: Correlación offline]
    ANA -.-> EVO[Evolution UCA: Hipótesis de mejora]
    EVO -.-> MUT[Atomic Mutation dentro de Nature]
    MUT -.-> DISP[ΔDisposition evolucionada]
    DISP -.-> UCA
```

---

## 📜 Principios Fundamentales del Modelo

1. **Conception determina qué UCA existe.**
2. **Purpose determina funcionalmente qué UCA es y aquello que persigue durante toda su existencia.**
3. **Capabilities determinan los límites de lo que la UCA puede hacer.**
4. **Disposition determina cómo esas Capabilities están constituidas y predispuestas para comportarse e interactuar.**
5. **Stimulus es la recepción por una UCA de un cambio observable externo a su frontera funcional que provoca su reacción, mediada mecánicamente por Reception.**
6. **Reception es un mecanismo reactivo universal y no cognitivo de UCA Core; Perception es una función especializada y opcional dependiente del Purpose.**
7. **Las Capabilities reaccionan mediante Interactions y no mediante dependencias directas entre ellas.**
8. **Action es cualquier operación o transición interna perteneciente a la Reaction de una UCA. Outcome es la única consecuencia observable externa de dicha actividad.**
9. **El Process emerge de las interacciones reactivas entre Capabilities conforme a sus Dispositions.**
10. **Outcome es el cambio observable producido por la actividad de una UCA, estructurado en Properties, Criteria y Owner, con evaluación objetiva de Compliance (PASS | FAIL) y validación contextual externa (Validation: APPROVED | REJECTED).**
11. **Evolution es un proceso histórico asíncrono mediado por roles especializados (Tracker, Analyzer, Evolution) sobre evidencia acumulada (History), prohibiéndose la auto-evolución directa ante resultados individuales.**
12. **La unidad mínima de Evolution es una Mutation atómica, limitada, observable y potencialmente reversible dentro de Nature, donde $\Delta\text{Disposition} = \text{difference}(D_0, D_1)$ expresa cambio de estado y nunca mejora intrínseca.**

---

## ✅ Criterios Mínimos de Conformidad (Conformance)

Un componente de software cumple con el **UCA Core** si y solo si:

1. Define un **Purpose** (`P`) propio, explícito, estable e independiente de la implementación.
2. Tiene una **Disposition** (`D`) declarativa que condiciona su comportamiento e interacciones.
3. Opera mediante un conjunto explícito y acotado de **Capabilities** (`C`).
4. Se ejecuta estrictamente al recibir un **Stimulus** activador (`S`) externo a su frontera funcional.
5. Ejecuta una **Reaction** interna compuesta por Actions e interacciones que persigue su Purpose dentro de los límites de sus Capabilities y Disposition.
6. Produce uno o más **Outcomes** (`O`) estructurados con Properties empíricas, Criteria objetivos y un Owner externo con potestad de validación, satisfaciendo el principio de no auto-validación.
7. Trata a otro componente como UCA solo si dicho componente posee un Purpose propio y diferenciado.

**No-requisitos para la conformidad**: Una implementación *no* requiere una segunda fuente de dirección funcional ni un contenedor formal de Context como estructuras universales obligatorias del estímulo, Observation ni Perception como fases del ciclo de vida, Memory, Identity, Learning, Adaptation, un Coordinador, Dispatcher, Orquestador o Supervisor, un LLM, causalidad externa, un sobre Impulse, un Event Bus, un snapshot de estado global, Sinapsis, ni comportamiento cognitivo emergente demostrado para ser conforme con UCA.

La conformidad evalúa la **unidad individual** frente al contrato UCA. No evalúa si el sistema en su conjunto exhibe comportamiento cognitivo.

---

## 🔬 La Hipótesis Falsable

> **¿Puede emerger comportamiento cognitivo de la interacción de UCAs acotadas por propósito, mientras cada unidad individual permanece estructuralmente limitada a $u = (p, d, C, O)$ y conductualmente limitada a $(u, s) \to o$?**

Esta pregunta es la hipótesis experimental central que plantea UCA. Debe poder evaluarse mediante futuras implementaciones y observación empírica.

---

## 📚 Documentación Formal Completa

- 🇪🇸 **[SPECIFICATION.es.md (Español)](SPECIFICATION.es.md)** — Especificación formal completa en español (RFC), incluyendo ontología formal, arquitectura cognitiva (§4), composición recursiva (§3), hipótesis científica (§6), antecedentes e influencias arquitectónicas (§10), referencias bibliográficas (§11) y especificación de runtime de referencia en TypeScript con ejemplos ilustrativos de uso (§12).
- 🇬🇧 **[SPECIFICATION.md (English)](SPECIFICATION.md)** — Exhaustive normative specification in English (RFC), including runtime specification and non-normative usage examples in TypeScript (§12).
- 💻 **[Carpeta `examples/`](examples/)** — Ejemplos de uso de referencia ejecutables en TypeScript (no normativos).

---

## Licencia

UCA Specification © 2026 Christian Marino Alvarez.

Esta especificación y su documentación están licenciadas bajo la
Licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).

Eres libre de usar, compartir, adaptar e implementar esta especificación,
incluso con fines comerciales, siempre que se proporcione la atribución adecuada.

Las implementaciones de software y los runtimes de referencia se licencian por separado.

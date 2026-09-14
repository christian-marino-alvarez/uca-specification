# Contribuciones a la Especificación UCA (RFC)

[ [English](CONTRIBUTING.md) | Español ]

Agradecemos el interés de la comunidad en debatir, escrutar y formalizar la especificación de **Unidades Cognitivas Autónomas (UCA)**.

## ¿Cómo contribuir?

1. **Debates y Preguntas**: Utiliza las **Discussions** o **Issues** de GitHub para plantear dudas conceptuales, casos límite o sugerencias de modelado.
2. **Propuestas de Cambio (RFC)**:
   - Toda modificación a [`SPECIFICATION.es.md`](SPECIFICATION.es.md) o [`SPECIFICATION.md`](SPECIFICATION.md) debe someterse mediante una Pull Request.
   - Describe con claridad qué capa o sección se ve afectada:
     - **UCA Core** (primitiva funcional mínima)
     - **Composición de UCAs** (uso recursivo de capabilities)
     - **Arquitectura Cognitiva** (organización y patrones de nivel superior)
     - **Runtime** (infraestructura de ejecución)
     - **Hipótesis Experimentales** (afirmaciones empíricas falsables)
     - **Ejemplos**
     - **Conformidad (Conformance)**
     - **Preguntas Abiertas**
   - **Principio de Minimalidad**: Un concepto pertenece al UCA Core *únicamente* si eliminarlo impide que la unidad satisfaga el contrato universal UCA. Una propuesta no debe añadir un concepto al Core simplemente porque resulte útil para una arquitectura cognitiva concreta.
   - **Principio de Composición**: Antes de extender la primitiva UCA con un nuevo mecanismo cognitivo, intenta primero representar dicha responsabilidad mediante la composición de UCAs existentes. Conceptos como Observación, Memoria, Planificación, Coordinación, Supervisión, Identidad, Event Bus o Impulse no deben incorporarse al Core sin demostrar que son estrictamente necesarios para la unidad mínima.
   - Preserva la coherencia con los principios fundamentales:
     - Primacía del Purpose autónomo.
     - Ejecución reactiva ante la recepción de un Stimulus.
     - Desacoplamiento entre Purpose cognitivo y mecanismos terminales.
     - Separación entre Outcome del ejecutor y Attainment del solicitante.
     - Las políticas de adaptación de Disposition pertenecen a la Arquitectura Cognitiva, no al Core universal.

## Licencia de las Contribuciones

Al enviar contribuciones, aceptas que tus aportaciones documentales y conceptuales se licencian bajo los términos de **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

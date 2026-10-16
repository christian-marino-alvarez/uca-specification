# Observación de pulsos

App y Server inervan una instancia de Logger en su catálogo con `Logger.disposition.reactTo`, suscrita a `'*'`. Core publica cada `pulse` también en ese canal, conservando la señal original. Logger observa los pulsos del mismo `target`, incluidos los dirigidos a otras instancias mediante `value.id`.

Cada registro muestra el emisor (`source`), la señal (`property`) y su contenido (`value`). La entrada estructurada también conserva `timestamp` y el destinatario `targetId` de la señal, y se entrega mediante `onLog` y `logger.log`. La disposición permite configurar `prefix` y `filter`.

Los emisores solo publican sus señales funcionales. No existen pulsos `TRACE` ni metadatos diagnósticos añadidos al contrato de otras UCAs o capacidades. Las correlaciones funcionales de las peticiones y streams se conservan en sus señales originales.

App y Server conservan `'*'` en su disposición para activar Logger mediante `syncCatalog()`. Su implementación de `receptors()` excluye ese canal: solo Logger lo escucha, evitando procesar un pulso tanto por su señal concreta como por su copia de observación. Core permanece intacto.

Logger ignora `logger.log` para evitar recursión, incluso cuando varias instancias comparten el mismo bus. Su conexión y desconexión siguen el ciclo de vida de Core.

Un registro confirma la emisión de un pulso; no confirma por sí solo la recepción, el procesamiento o un envío HTTP. Esas etapas se observan mediante sus señales funcionales de respuesta, finalización o error. Los buses del cliente y del servidor se observan por separado.

Logger destaca `areaId`, `parentTo`, `compositionId`, `depth` y `correlationId` cuando están presentes en el payload funcional, su `state`, su `area` o su valor anidado. No inventa datos ausentes ni mantiene un registro paralelo. Las decisiones conservan los metadatos del área en `state`; las señales de áreas pueden incluir su composición y profundidad. `depth` es la profundidad del área (raíz 0, hijos 1, nietos 2).

El formato de consola del navegador es `[emisor] -> señal`; el backend conserva `[backend] [emisor] -> señal` para distinguir la consola del proceso servidor. La entrada estructurada mantiene `scope` en ambos entornos. Un Logger sin configuración usa `front`. `prefix` sigue siendo opcional para personalización, sin prefijo por defecto.

Los logs del backend se imprimen en la consola del proceso servidor. No se reenvían al navegador. Para una futura vista unificada de depuración, conviene transmitir solo metadatos filtrados, con volumen limitado y activación explícita, evitando reenviar cada pulso, token o payload completo.

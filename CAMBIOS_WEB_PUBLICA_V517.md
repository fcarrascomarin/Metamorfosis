# Metamorfosis Web v5.17

## Objetivo
Corrección editorial y de proporciones tras revisión visual de la v5.16.

## Cambios principales
- El hero ya no desborda el viewport: el título fue acortado y su escala máxima reducida.
- El cuerpo del hero conserva la proporción texto / manifiesto del mockup de referencia.
- Se elimina la separación artificial de una pantalla completa entre “Qué observamos” y el mapa de Metamorfosis.
- El mapa queda inmediatamente asociado a su encabezado.
- “Cómo trabajamos” deja de reservar un viewport completo y se presenta como continuación del mismo sistema visual.
- Jardín, Qué hacemos y Equipo recuperan aire lateral y vertical sin dispersar sus elementos.
- Se mantiene la profundidad al clic; el contenido cerrado no reserva espacio innecesario.
- Los títulos permanecen en una línea solo cuando existe ancho real para sostenerlo. Bajo 980 px se permite quiebre natural para evitar desbordes.

## CSS
Buscar al final de `src/styles.css`:
`WEB PÚBLICA V5.17 · JERARQUÍA, RESPIRACIÓN Y PROPORCIÓN EDITORIAL`

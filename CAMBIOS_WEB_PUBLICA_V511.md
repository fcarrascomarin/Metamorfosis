# Metamorfosis Web v5.11

## Propósito
Esta versión prioriza confianza, comprensión rápida y apertura a conversación. La web no reproduce un proyecto territorial específico: muestra la forma transversal de observar, intervenir y aprender que permite producir proyectos distintos con el mismo estándar profesional.

## Cambios estructurales
1. **Jardín** incorpora “Cuándo puede valer la pena intervenir”. Las situaciones de entrada dejan de ocupar una sección completa y se vuelven conceptos desplegables.
2. **Cómo trabaja Metamorfosis** conserva dos capas separadas: qué observamos y cómo trabajamos.
3. **Principios** vuelve a ser una sección propia, compacta, para no mezclar cuándo conversar con cómo cuidamos una intervención.
4. **Preguntas que cultivamos** permanece compacta como evidencia de investigación aplicada.
5. **Equipo** mantiene dos columnas, pero con más respiración y separación entre propuesta de valor y perfiles.

## Corrección crítica de legibilidad
- No se usan elipsis ni subtítulos truncados dentro de botones.
- Los botones cerrados muestran icono + nombre del concepto.
- Las explicaciones y etiquetas técnicas aparecen completas al abrir cada tarjeta.
- Se eliminan `line-clamp`, `text-overflow: ellipsis` y comportamientos equivalentes dentro de los componentes públicos v5.11.

## CSS
Buscar al final de `src/styles.css`:

`WEB PÚBLICA V5.11 · JERARQUÍA, RESPIRACIÓN Y CONVERSIÓN`

El bloque incluye comentarios para editar por separado Jardín, situaciones de entrada, método, principios, investigación, equipo y responsive.

## Archivos modificados
- `src/PublicApp.jsx`
- `src/styles.css`
- `CAMBIOS_WEB_PUBLICA_V511.md`

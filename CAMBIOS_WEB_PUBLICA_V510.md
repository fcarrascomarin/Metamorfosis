# Metamorfosis Web v5.10

## Objetivo
Corregir dos problemas detectados en la visualización de escritorio:

1. Los botones del esquema de trabajo mostraban subtítulos truncados (por ejemplo, “OBSERVAR A...”), lo que agregaba ruido sin aportar información legible.
2. La sección “Cuándo conversar y cómo cuidamos el trabajo” ocupaba demasiado espacio, perdía los márgenes laterales del resto del sitio y hacía más difícil comprender la jerarquía.

## Cambios
- Los botones de **Qué observamos** muestran ahora icono + título + apertura.
- Los botones de **Cómo trabajamos** muestran ahora número + icono + título + apertura.
- Los subtítulos se trasladaron al contenido desplegable, donde pueden leerse completos.
- Ningún acordeón queda abierto por defecto. El usuario decide dónde profundizar.
- La sección **Cuándo conversar y cómo cuidamos el trabajo** recupera el ancho contenido del sitio (`1240px` máximo con márgenes laterales).
- Cada grupo presenta sus cuatro conceptos en una grilla 2x2 en escritorio.
- Las tarjetas son más bajas y compactas; al abrirlas aparece la explicación correspondiente.
- Se redujo la escala del título y de la introducción para que la escena respire y pueda visualizarse completa con mayor facilidad.
- Tablet y móvil vuelven progresivamente a 2 columnas y luego 1 columna, priorizando área táctil y legibilidad.

## Edición rápida
Buscar al final de `src/styles.css`:

`WEB PÚBLICA V5.10 · BOTONES LEGIBLES + RESPIRACIÓN EN APORTE/PRINCIPIOS`

El bloque está comentado en diez apartados.

## Archivos modificados
- `src/PublicApp.jsx`
- `src/styles.css`

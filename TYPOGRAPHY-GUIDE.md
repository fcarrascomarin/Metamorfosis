# Sistema tipográfico público · Metamorfosis

La capa definitiva está al FINAL de `src/styles.css`, titulada `PUBLIC DESIGN SYSTEM · TYPOGRAPHY / OCT 2026`.

- **Newsreader**: hero, encabezados de sección y subtítulos editoriales (600).
- **DM Sans**: textos, etiquetas, tarjetas, formulario, navegación y botones (400 / 700).
- Todos los tamaños por rango usan variables `--pub-size-*` dentro de `.public-site`.
- No fijar nuevos tamaños por componente ni agregar `v545+`: modificar los tokens.
- En escritorio el título de propuesta se mantiene en una línea cuando cabe; en móvil se permite el salto. El contacto prioriza no recortar el encabezado incluso con zoom.
- Metamorfosis OS no recibe estas reglas, por el selector `.public-site`.

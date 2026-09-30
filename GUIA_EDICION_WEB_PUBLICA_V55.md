# Guía rápida de edición · Web pública Metamorfosis Lab v5.5

La web pública quedó ordenada para que los cambios habituales puedan hacerse sin recorrer todo el proyecto.

## 1. Textos modulares
Editar `src/publicContent.js`.

El archivo está dividido con comentarios numerados:

1. Navegación principal
2. Cómo miramos
3. Dónde podemos aportar
4. Cómo trabajamos
5. Principios de trabajo
6. Investigación aplicada
7. Equipo

## 2. Textos narrativos y orden de secciones
Editar `src/PublicApp.jsx`.

Buscar los comentarios `05.1` a `05.10`:

- 05.1 Inicio / Hero
- 05.2 Laboratorio
- 05.3 Cómo miramos
- 05.4 Cómo trabajamos
- 05.5 Dónde podemos aportar
- 05.6 Investigación aplicada
- 05.7 Principios
- 05.8 Equipo
- 05.9 Contacto
- 05.10 Footer

## 3. Diseño y responsive
Editar el bloque final de `src/styles.css` titulado:

`WEB PÚBLICA V5.5 · SISTEMA DE LECTURA, RESPONSIVE Y ESCENAS COMPLETAS`

Ese bloque es la capa de ajuste final y está dividido en 16 apartados numerados. Para cambios futuros de la web pública, priorizar ese bloque antes de modificar reglas históricas anteriores.

## 4. Criterio de visualización

- Escritorio ≥ 901 px: cada sección se compacta para leerse completa en un viewport estándar sin recortar contenido.
- Notebook de poca altura: se reducen espaciados y escala tipográfica antes de comprimir columnas o cortar texto.
- Tablet y móvil: la sección deja de forzarse a una pantalla exacta y fluye verticalmente, porque la legibilidad tiene prioridad sobre una falsa equivalencia con desktop.
- Los botones no parten palabras ni etiquetas en dos líneas.
- Los títulos usan escala fluida y límites máximos para no dominar la pantalla.
- Los párrafos evitan división artificial de palabras y conservan líneas de lectura cómodas.

## 5. Prueba mínima antes de publicar

Revisar al menos estas ventanas:

- 1440 × 900
- 1366 × 768
- 1280 × 720
- 1024 × 768
- 768 × 1024
- 390 × 844
- 360 × 800
- 320 × 568

Ejecutar:

```bash
npm install
npm run build:public
npm run dev:public
```

No editar el panel privado para resolver un problema de la web pública: ambas interfaces comparten el archivo de estilos, pero la nueva capa está limitada por `.public-site--v54`.

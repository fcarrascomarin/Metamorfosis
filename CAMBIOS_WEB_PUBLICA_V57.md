# Metamorfosis Web v5.7 · Cómo trabaja Metamorfosis

## Cambio estructural
Las antiguas secciones **Cómo miramos** y **Cómo trabajamos** se integraron en una sola escena responsive construida con React + CSS.

## Funcionamiento
- Centro: logo + Metamorfosis Lab.
- Cuatro dimensiones alrededor: Operación, Personas, Entorno y Condiciones de operación.
- Cinco etapas abajo: Entender, Delimitar, Probar, Medir y Transferir.
- Las tarjetas muestran solo la síntesis.
- Al hacer clic, el texto completo se abre en el panel explicativo central sin cambiar de página.
- El diseño no depende de una imagen fija, por lo que se reorganiza en tablet y móvil sin recortar la información.

## Edición rápida
### Estructura y comportamiento
`src/PublicApp.jsx`
Buscar:
`04C · CÓMO TRABAJA METAMORFOSIS · MAPA + MÉTODO EN UNA SOLA ESCENA`

### Textos de dimensiones y etapas
`src/publicContent.js`
- `transformationPillars`
- `processRoadmap`

### Diseño, tamaños y espacios
`src/styles.css`
Buscar:
`WEB PÚBLICA V5.7 · CÓMO TRABAJA METAMORFOSIS · MAPA + MÉTODO INTEGRADOS`

El CSS está dividido en diez bloques comentados para edición rápida.

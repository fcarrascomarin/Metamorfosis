# Metamorfosis Lab · Web pública v5.4

## Objetivo

Esta versión reorganiza la web pública para que la marca sostenga el mismo estándar de rigor, prudencia y profesionalismo que los proyectos y notas ejecutivas de Metamorfosis, sin convertir ningún proyecto particular en el modelo general de la organización.

## Posición institucional

Metamorfosis se presenta como **laboratorio de innovación con base en Concepción**. La Región del Biobío se define como el principal espacio actual de observación y trabajo aplicado, pero la marca no queda limitada a una comuna, industria o modalidad de intervención.

La arquitectura deja de girar alrededor de un catálogo de servicios y se organiza alrededor de una capacidad reconocible: investigar situaciones reales, delimitar problemas, probar intervenciones proporcionales, medir resultados y transferir capacidades.

## Cambios principales

- Nuevo hero: **“Crecer con claridad. Operar con precisión.”**
- Definición explícita de Metamorfosis como laboratorio de innovación.
- Sección “¿Por qué laboratorio?” para explicar investigación aplicada, hipótesis, pruebas y aprendizaje.
- Nuevo mapa interactivo “Cómo miramos”, inspirado conceptualmente en la lógica de conexiones del material de referencia, pero convertido en una interacción propia y generalizable.
- Cuatro lentes de observación: Operación, Personas, Entorno y Condiciones de operación.
- Advertencia metodológica visible: no todas las dimensiones se aplican a todos los problemas.
- Método reformulado en cinco pasos: Entender, Delimitar, Probar, Medir y Transferir.
- Sección de situaciones en las que puede ser útil conversar, en lugar de catálogo rígido de servicios.
- Sección “Preguntas que estamos explorando” para demostrar trabajo intelectual e investigación aplicada sin revelar proyectos sensibles.
- Principios de trabajo visibles: comprender antes de prescribir, trabajar con lo existente, intervenir con proporcionalidad y aprender de la intervención.
- Equipo explicado desde la capacidad conjunta entre ingeniería y derecho, sin reducir cada perfil a una función aislada.
- Contacto abierto a necesidades, preguntas e hipótesis, no solo a proyectos previamente definidos.
- SEO, metadatos sociales, Schema.org y contenido fallback actualizados a la nueva identidad.
- Animaciones sutiles y respeto por `prefers-reduced-motion`.
- No se incorporaron logos ni una sección de marcas colaboradoras.

## Archivos modificados

- `src/PublicApp.jsx`
- `src/publicContent.js`
- `src/styles.css`
- `index.html`

## Validación técnica

El código fue revisado estructuralmente y mantiene las dependencias existentes. El entorno de trabajo no incluía `node_modules` y la instalación de dependencias no logró completarse dentro del tiempo disponible, por lo que no fue posible ejecutar localmente el build de Vite en esta sesión. Antes de desplegar, ejecutar:

```bash
npm install
npm run build:public
```

## Criterio editorial

La web no replica ningún proyecto específico. Los proyectos deben ser reconocibles como aplicaciones de una misma forma de trabajo, mientras que la web conserva la generalidad institucional del laboratorio.

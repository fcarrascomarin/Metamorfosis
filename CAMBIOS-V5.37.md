# Metamorfosis · v5.37

Base: ZIP completo v5.36. La navegación, el hero aprobado, Equipo, Contacto y las herramientas del OS se mantienen.

## Propuesta — composición editorial nueva
- Dos modalidades visibles: soluciones propias e incubación de impacto, con sus posibles resultados.
- Método expuesto en lenguaje directo: información disponible, mapeo, entrevistas y análisis técnico; operación, personas, entorno y condiciones; cinco etapas visibles sin clic.
- Una sola ampliación «Explorar nuestro método» recoge los detalles de las dimensiones, las etapas y los ámbitos de aplicación.
- Se retira de la primera vista el mapa orbital y la colección de tarjetas, que competían con el contenido.
- Fondo especial basado en la imagen de referencia facilitada, con tratamiento CSS de recorte, capas de oscurecimiento, tintes y contraste para lectura. El recurso se incluye en src/assets/images/jardin/propuesta-atmosfera.png.
- Tipografía y jerarquía de títulos coordinadas con Equipo y el resto de la web; no se altera la escala del hero.
- Responsive: el contenido se apila y la secuencia del método se distribuye en 3 y 2 columnas según ancho disponible. Sin alturas máximas rígidas.

## Comprobaciones
- Parseo JSX del archivo PublicApp.jsx mediante TypeScript sin errores.
- Análisis sintáctico de CSS sin errores.
- Se preservan las anclas Inicio, Propuesta, Equipo y Contacto, y el CTA Conversemos.
- Se comprueba integridad del ZIP.

Nota: pendiente compilación integral con Vite y validación visual en navegadores/dispositivos reales. No publicar sin previsualizar el estado cerrado, abierto, responsive y el contraste sobre la imagen.

# Metamorfosis Lab 4.9.0

## Corrección visual y de conversión pública

- Navegación principal reducida a **Qué hacemos · Método · Equipo**.
- **Conversemos** es el único CTA comercial y abre el formulario.
- **Acceso OS** vuelve como acceso utilitario secundario hacia `https://os.metamorfosislab.cl`, sin tratarse como sección comercial.
- Hero reconstruido para caber armónicamente en una pantalla de escritorio y explicar el problema en lenguaje directo.
- Página pública reducida a cinco escenas: Inicio, Qué hacemos, Método, Equipo y Conversemos.
- Eliminadas del render público las capas que duplicaban capacidades, resultados y precios y estaban saturando la lectura.
- Contraste definido por superficie: claro/oscuro sin herencias ambiguas.
- Responsive revisado para evitar cortes de palabras y colapsos de grilla.

## Formulario

- Conserva el flujo bloqueado de 3 pasos.
- Paso 1: opción + comentario mínimo.
- Paso 2: organización + nombre.
- Paso 3: correo válido + consentimiento; teléfono opcional validado si se informa.
- CORS autoriza `https://metamorfosislab.cl` por defecto, incluso sin `PUBLIC_ORIGINS`.
- El servidor detecta si `SMTP_PASS` sigue siendo un placeholder y lo informa explícitamente.

## Infraestructura

- Web pública: `https://metamorfosislab.cl` (Cloudflare Pages).
- OS/API: `https://os.metamorfosislab.cl` (Render).
- Ninguna navegación normal utiliza `*.pages.dev` o `*.onrender.com`.

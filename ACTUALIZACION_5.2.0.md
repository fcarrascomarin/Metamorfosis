# Metamorfosis Lab 5.2.0 · consolidación acumulativa

Esta versión se construye sobre el ZIP actual entregado por el usuario. No sustituye las mejoras anteriores: conserva retícula lateral, hero con luz/puntero, separación Cloudflare/Render, formulario por etapas, OS Empresa/Familiar, expedientes, footer reforzado y responsive.

## Correcciones incluidas

- Acceso Familiar robusto: el selector superior usa URLs reales (`?workspace=family#family-overview` y `?workspace=business#dashboard`). Esto permite entrar al espacio familiar incluso tras recarga, manteniendo la sesión de Render.
- Método reconstruido sobre un componente aislado (`method-showcase-*`) para impedir que CSS histórico vuelva a comprimir el texto. Las cuatro etapas conservan imagen, número, icono y explicación horizontal legible.
- Qué hacemos: mejora de recorte, escala y contraste de las imágenes; iconos de entrada más grandes y mejor alineados; eliminación visual de marcos blancos.
- Equipo: incorpora los retratos suministrados, junto con rol, profesión y casa de estudio, manteniendo una composición compacta para desktop.
- Iconografía: se agregan iconos `school` y `recycling` y se ajustan tamaños/jerarquías de iconos en Método y Qué hacemos.
- Formulario: se conserva el flujo que primero registra la solicitud en PostgreSQL/OS y luego intenta el correo SMTP; si el correo falla, la oportunidad permanece visible en OS y puede reenviarse desde Oportunidades.
- Footer: se conserva el logo Metamorfosis de mayor tamaño y su bloque de marca con mayor presencia.
- Viewport: en desktop se compactan tarjetas antes de provocar desbordes; tablet y móvil mantienen flujo vertical legible.

## Validaciones

- `server.js`: sintaxis Node OK.
- `PublicApp.jsx`, `AdminApp.jsx`, `Icon.jsx`, `publicContent.js`: parseo/transpilación JSX OK.
- `styles.css`: llaves balanceadas.

## Despliegue

Render continúa compilando solo el OS (`npm run build:admin`) y Cloudflare Pages la web pública (`npm run build:public`).

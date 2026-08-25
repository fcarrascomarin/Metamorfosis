# ACTUALIZACIÓN 5.2.1 · corrección de despliegue Cloudflare

## Problema corregido
Cloudflare Pages fallaba al compilar la versión 5.2.0 porque `src/PublicApp.jsx` importaba nueve recursos visuales nuevos desde `src/assets/images/...`, pero esos archivos no estaban presentes en el commit clonado por Cloudflare.

## Solución
- Las nueve imágenes nuevas se sirven ahora como archivos estáticos desde `public/`.
- `PublicApp.jsx` ya no depende de imports de Vite para esos recursos.
- Se mantienen los originales en `src/assets/images/` como respaldo del proyecto.
- La corrección no modifica el diseño, el formulario, el OS, el selector Empresa/Familiar ni las mejoras acumulativas de 5.2.0.

## Archivos públicos requeridos
- `public/pillar-operacion.webp`
- `public/pillar-personas.webp`
- `public/pillar-sistemas.webp`
- `public/method-entender.webp`
- `public/method-priorizar.webp`
- `public/method-intervenir.webp`
- `public/method-medir.webp`
- `public/francisca-carrasco.webp`
- `public/benjamin-sepulveda.webp`

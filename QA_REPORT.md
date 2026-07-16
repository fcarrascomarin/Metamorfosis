# Informe de verificación · Metamorfosis Lab v2.0

Fecha: 16 de julio de 2026

## Verificaciones superadas

- `npm run check`: compilación de producción exitosa.
- `npm audit --audit-level=low`: 0 vulnerabilidades reportadas.
- Endpoint `/api/health`: respuesta correcta.
- Formulario público `/api/quotes`: validación y respuesta correcta sin base conectada.
- Login de desarrollo: creación de sesión correcta.
- `/api/session`: lectura de sesión correcta.
- `/api/quotes`: protección por sesión administrativa correcta.
- `/api/logout`: cierre de sesión correcto.
- Activos de producción versionados mediante hashes de Vite.
- Imágenes optimizadas en WebP; hero aproximado 205 KB y fotografías secundarias bajo 60 KB.

## Criterios implementados

- Header sticky con compensación de anclas.
- Secciones públicas compactas y jerarquizadas.
- Menú móvil simplificado.
- WhatsApp flotante accesible y alcanzable en móvil.
- Formulario por pasos y mensaje de WhatsApp generado con los datos ingresados.
- Componentización para video diferido con `poster`, `data-src` y `preload="none"`.
- Panel administrativo ordenado por frecuencia de uso.
- Tablas sin scroll vertical interno.
- Repositorio documental separado por origen.
- Botones de icono con nombre accesible.
- Foco visible, enlace para saltar contenido y soporte de `prefers-reduced-motion`.
- Sesiones PostgreSQL en producción y prohibición explícita de MemoryStore.
- Sin contraseñas en código o documentación.

## Antes de publicar definitivamente

- Sustituir el monograma temporal por el logo oficial SVG.
- Confirmar que `contacto@metamorfosislab.cl` esté operativo.
- Configurar Neon/PostgreSQL y variables de entorno en Render.
- Crear el hash bcrypt de la contraseña administrativa.
- Reemplazar fotografías de apoyo por fotografías propias cuando exista material institucional suficiente.
- Validar el dominio con y sin `www` en Cloudflare.

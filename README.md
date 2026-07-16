# Metamorfosis Lab · Web pública + Metamorfosis OS

Proyecto React 19 + Vite 8 con servidor Express opcional, formulario comercial por pasos, integración de WhatsApp y panel interno administrativo.

## Funciones incluidas

### Web pública

- Hero y navegación responsive.
- Secciones de servicios, trayectoria, Mapa de Transformación y Activos, método y contacto.
- Secciones compactas para lectura por pantalla en escritorio.
- Navegación compensada para header sticky.
- Fotografías reales optimizadas en WebP.
- Formulario de contacto en tres pasos.
- Preparación automática de mensaje para WhatsApp al `+56 9 2377 0543`.
- Botón flotante accesible.
- SEO base, sitemap, robots, Open Graph y datos estructurados.
- Accesibilidad: navegación por teclado, foco visible, `aria-label`, textos alternativos y respeto por movimiento reducido.

### Metamorfosis OS

Ruta: `/admin`

- Menú lateral ordenado por frecuencia de uso.
- Inicio diario, comercial, compras/recursos, gestión interna, documentos y consultoría al final.
- Métricas compactas con iconos.
- Tablas sin scroll vertical interno.
- Documentos separados por origen.
- Gestión inicial de oportunidades obtenidas desde el formulario.
- Cierre de sesión.
- Diseño responsive con menú lateral móvil.

## Instalación

```bash
npm install
npm run dev
```

Para probar frontend y API local juntos:

```bash
cp .env.example .env
npm run build
npm run dev:server
```

En desarrollo, `DEMO_ADMIN=true` permite entrar con cualquier correo y contraseña no vacíos. **No debe activarse en producción.**

## Producción

1. Crear base PostgreSQL, por ejemplo en Neon.
2. Configurar `DATABASE_URL`.
3. Definir `SESSION_SECRET` largo y aleatorio.
4. Definir `ADMIN_EMAIL`.
5. Generar un hash bcrypt y guardarlo en `ADMIN_PASSWORD_HASH`.
6. Ejecutar `npm run build` y luego `npm start`.

El servidor crea automáticamente las tablas de cotizaciones y sesiones cuando existe conexión PostgreSQL.

## Seguridad

- No hay contraseñas escritas en el código.
- El servidor rechaza MemoryStore en producción.
- Helmet, CSP, rate limiting y compresión están configurados.
- `server.js` está fuera de `public/`.
- Las variables sensibles se cargan mediante entorno.

## Personalización pendiente

- Sustituir el monograma temporal por el logo oficial en sus versiones SVG.
- Confirmar la activación real de `contacto@metamorfosislab.cl`.
- Incorporar Instagram solo cuando exista una cuenta institucional confirmada.
- Reemplazar imágenes de apoyo por fotografías propias cuando estén disponibles.
- Conectar módulos administrativos adicionales a sus tablas definitivas.

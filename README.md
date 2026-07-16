# Metamorfosis Lab · Web pública + Metamorfosis OS

Proyecto React 19 + Vite 8 con servidor Express, formulario comercial por pasos, WhatsApp y panel administrativo inicial.

## Estado real

La web pública está compilable y preparada para despliegue. El panel incluye autenticación, oportunidades registradas desde el formulario y actualización de estados. Los demás módulos muestran con claridad su arquitectura prevista, sin simular funciones o datos que todavía no tienen persistencia.

## Instalación

```bash
npm ci
npm run dev
```

Para probar frontend y API local juntos:

```bash
cp .env.example .env
npm run build
npm run dev:server
```

El acceso demostrativo está desactivado por defecto. Para una prueba local controlada, definir temporalmente `DEMO_ADMIN=true` en `.env`. Nunca debe habilitarse en producción.

## Producción

1. Crear una base PostgreSQL, por ejemplo en Neon.
2. Configurar `DATABASE_URL`.
3. Definir un `SESSION_SECRET` largo y aleatorio.
4. Definir `ADMIN_EMAIL`.
5. Generar `ADMIN_PASSWORD_HASH` con bcrypt.
6. Confirmar `DEMO_ADMIN=false`.
7. Ejecutar `npm run build` y `npm start`.

El servidor crea las tablas de cotizaciones y sesiones cuando existe conexión PostgreSQL. En producción se niega a iniciar sin base de datos, evitando el uso accidental de MemoryStore.

## Rutas

- Web pública: `/`
- Panel interno: `/admin`
- Salud: `/api/health`

## Seguridad

- No hay contraseñas escritas en código o manuales.
- PostgreSQL es obligatorio para las sesiones de producción.
- Helmet, CSP con hash para JSON-LD, rate limiting, compresión y cookies seguras están configurados.
- La CSP no requiere `unsafe-inline` para scripts ni estilos.
- `/admin` envía cabecera de no indexación.
- `server.js` permanece fuera de `public/`.
- Los endpoints API desconocidos responden JSON 404.
- La auditoría automática de npm permanece habilitada.

## Estructura

- `src/`: aplicación activa.
- `public/`: únicamente activos que deben llegar a producción.
- `dist/`: build de producción validado.
- `REVISION_INTEGRAL.md`: diagnóstico completo, decisiones y límites pendientes.
- El código y los recursos anteriores se entregan en un ZIP legado separado, para no ensuciar el paquete productivo.

## Pendientes funcionales

- CRUD persistente de proyectos, tareas, gastos, stock, proveedores, activos e indicadores.
- Generación y versionado de documentos internos.
- Descarga PDF y vínculo con Google Drive.
- Confirmación del correo institucional e Instagram.
- Prueba final en dispositivos físicos antes de publicar.

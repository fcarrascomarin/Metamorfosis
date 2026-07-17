# Metamorfosis Lab · Web pública + Metamorfosis OS

Versión 3.0.0.

Este proyecto integra:

- Web pública de Metamorfosis Lab.
- Formulario comercial por pasos con preparación de mensaje para WhatsApp.
- Panel privado en `/admin`.
- Registro de oportunidades desde la web.
- Sistema operativo interno con vista mensual, día seleccionado, tareas por responsable, bandeja de entrada, frentes, decisiones y finanzas del negocio.
- Persistencia en PostgreSQL/Neon para sesiones, oportunidades y estado general de Metamorfosis OS.
- Importación y exportación de respaldos JSON.

## Corrección del error de Render

El `package-lock.json` recibido contenía URLs resueltas hacia un registro interno de OpenAI:

`packages.applied-caas-gateway1.internal.api.openai.org`

Render no puede acceder a ese host. El proyecto actualizado reemplaza todas las URLs por `https://registry.npmjs.org/`, fija Node.js 20.19.0 e incluye reintentos de descarga en `.npmrc`.

## Instalación local

```bash
npm ci
npm run build
npm start
```

En desarrollo visual:

```bash
npm run dev
```

Para probar también la API, compila primero y ejecuta:

```bash
npm run build
npm run dev:server
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

- `DATABASE_URL`: conexión PostgreSQL/Neon.
- `SESSION_SECRET`: secreto largo y aleatorio.
- `ADMIN_EMAIL`: correo autorizado.
- `ADMIN_PASSWORD_HASH`: contraseña cifrada con bcrypt.

Generar hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_CLAVE', 12))"
```

En producción `DATABASE_URL` es obligatorio. El servidor se niega a iniciar sin una base de datos para evitar sesiones en MemoryStore.

## Despliegue en Render

El archivo `render.yaml` ya define:

- Node 20.19.0.
- Registro npm público.
- `npm ci --no-audit --no-fund`.
- Compilación con Vite.
- Inicio con Express.
- Health check en `/api/health`.

Después de subir el proyecto a GitHub:

1. Conecta el repositorio a Render.
2. Crea o vincula una base PostgreSQL/Neon.
3. Configura `DATABASE_URL`, `ADMIN_EMAIL` y `ADMIN_PASSWORD_HASH`.
4. Render genera `SESSION_SECRET` desde el blueprint.
5. Ejecuta un despliegue limpio sin caché si el servicio había intentado instalar el lock defectuoso.

## Metamorfosis OS

La distribución del panel conserva la lógica visual solicitada:

- Encabezado superior con accesos al sitio público, respaldo, guardado y cierre de sesión.
- Menú lateral agrupado y desplegable.
- Panel diario antes de módulos de menor frecuencia.
- Sistema operativo mensual y diario.
- Comercial, gestión interna y documentos separados.
- Consultoría/consolidación al final por ser un proceso temporal.

El estado operativo se guarda en la tabla `metamorfosis_os_state` como JSONB. Esto permite evolucionar la estructura sin crear datos ficticios ni múltiples tablas prematuras.

## Privacidad

El código fuente no incorpora las tareas personales, familiares ni cifras privadas contenidas en el antiguo sistema dual. El panel permite importar un respaldo JSON desde una sesión privada. Esto evita exponer información sensible si el repositorio de GitHub es público.

## Estructura

```text
src/
  AdminApp.jsx
  App.jsx
  components/Icon.jsx
  osSeed.js
  data.js
  styles.css
server.js
render.yaml
```

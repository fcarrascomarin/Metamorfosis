# Metamorfosis Lab · Web pública estática + Metamorfosis OS

Versión 4.2.0.

La arquitectura quedó separada para evitar que la vitrina pública dependa del encendido de Render:

- **Web pública estática:** compilación `dist-public`, preparada para Cloudflare Pages.
- **Panel privado y API:** compilación `dist-admin`, servida por Express en Render.
- **Base de datos:** PostgreSQL/Neon para sesiones, oportunidades y estado general de Metamorfosis OS.

## Actualizaciones públicas

La web incorpora:

- Mercado, marca y comercialización como capacidad integral.
- Ergonomía y diseño sostenible del trabajo.
- Operación, documentación e indicadores.
- Sistemas y presencia digital.
- Caso público Juana de Arco: posicionamiento, propuesta de valor, packaging, catálogo digital y experiencia de compra.
- Caso vivo CM Banquetería & Restaurant.
- Formulario comercial estático que registra la oportunidad en la API privada y prepara el contacto por WhatsApp.

## Indicadores internos

Metamorfosis OS incluye el módulo **Tiempo y rentabilidad**, con:

- Proyectos económicos editables.
- Honorario acordado, costos directos y horas presupuestadas.
- Costos internos por hora y responsable.
- Registro diario de horas facturables y no facturables.
- Tipo de actividad, responsable y resultado del trabajo.
- Horas consumidas, costo laboral, ingreso real por hora, margen y porcentaje de margen por proyecto.
- Trazabilidad completa de registros editables.

Los datos se guardan dentro del estado JSONB de Metamorfosis OS. No se crearon tablas prematuras adicionales.

## Vida familiar

El panel privado incorpora la pestaña **Vida familiar**, integrada al mismo guardado y respaldo de Metamorfosis OS, pero separada de las finanzas comerciales. Incluye:

- Estado de Benjamín, Francisca, pareja y familia, con carga y alertas editables.
- Acciones semanales por responsable, carga estimada y cierre con un clic.
- Frentes de trabajo vigentes, liderazgo, próximo movimiento y límites.
- Fase actual del hogar, presupuesto y microintervenciones cerrables.
- Ciclos de caja familiar con ingresos probables o confirmados, pagos, protección y disponible para decidir.
- Inventario completo con estados Activo, Próximo, Esperando condición, Pausado y Futuro.
- Registro explícito de lo que no cabe ahora.

La pantalla responde a la lógica: **¿Dónde estamos? → ¿Qué importa ahora? → ¿Qué hacemos esta semana? → ¿Cómo estamos de dinero? → ¿Qué está esperando?**

## Comandos

```bash
npm ci --registry=https://registry.npmjs.org/ --no-audit --no-fund

# Web pública
npm run dev:public
npm run build:public

# Compilación del panel
npm run dev:admin
npm run build:admin

# Panel + API en desarrollo
npm run build:admin
npm run dev:server

# Compilar todo
npm run build
```

## Variables de entorno

### Render / panel privado

- `DATABASE_URL`: conexión PostgreSQL/Neon.
- `SESSION_SECRET`: secreto largo y aleatorio.
- `ADMIN_EMAIL`: correo autorizado.
- `ADMIN_PASSWORD_HASH`: contraseña cifrada con bcrypt.
- `PUBLIC_ORIGINS`: orígenes públicos autorizados para enviar solicitudes.
- `VITE_PUBLIC_SITE_URL`: URL de regreso a la web pública.

Generar el hash de una contraseña:

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_CLAVE', 12))"
```

Nunca se debe guardar la contraseña ni su hash dentro del repositorio público. El hash se pega solamente como variable secreta en Render.

### Cloudflare Pages / web pública

- `VITE_ADMIN_URL`: URL pública del panel privado.
- `VITE_API_BASE`: URL de la API privada.
- `NODE_VERSION`: `20.19.0`.

## Estructura de compilación

```text
index.html                 -> entrada pública
admin.html                 -> entrada privada
src/PublicApp.jsx          -> vitrina pública
src/AdminApp.jsx           -> Metamorfosis OS
src/public-main.jsx        -> montaje público
src/admin-main.jsx         -> montaje privado
vite.public.config.js      -> dist-public
vite.admin.config.js       -> dist-admin
server.js                  -> API, sesiones y panel privado
render.yaml                -> servicio web privado en Render
DEPLOYMENT.md              -> instrucciones completas
```

## Seguridad

- El panel usa sesiones persistentes en PostgreSQL.
- Las cookies son `httpOnly`, `secure` en producción y `sameSite=lax`.
- El acceso se valida con correo y hash bcrypt.
- El panel y sus rutas envían `X-Robots-Tag: noindex, nofollow, noarchive`.
- La API pública solo habilita CORS para los dominios definidos en `PUBLIC_ORIGINS`.
- El formulario incluye limitación de solicitudes y campo señuelo antispam.

### 4.2.0 — accesibilidad visual del panel

El panel privado utiliza ahora un sistema visual de alto contraste: navegación y encabezado oscuros, superficies de trabajo claras, estados activos inequívocos y formularios consistentes. La pestaña **Vida familiar** se mantiene integrada en Metamorfosis OS.

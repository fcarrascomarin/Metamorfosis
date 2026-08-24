# Despliegue separado: web pública + Metamorfosis OS

## Arquitectura final

| Componente | Servicio | Dominio sugerido | Espera de Render |
|---|---|---|---|
| Web pública | Cloudflare Pages | `www.metamorfosislab.cl` y `metamorfosislab.cl` | No |
| Panel privado + API | Render Web Service | `os.metamorfosislab.cl` | Sí, aceptable en plan gratuito |
| Base de datos | Neon PostgreSQL | conexión privada por `DATABASE_URL` | No aplica |

La web pública no consulta a Render para cargar contenido. Solo llama a la API privada cuando una persona envía el formulario comercial.

---

## 1. Subir el código

1. Descomprimir el ZIP.
2. Reemplazar el contenido del repositorio GitHub de Metamorfosis por esta versión.
3. Confirmar que `render.yaml`, `vite.public.config.js` y `vite.admin.config.js` queden en la raíz.
4. Hacer commit y push a la rama principal.

---

## 2. Crear o actualizar el panel privado en Render

### Opción recomendada: Blueprint

1. En Render, seleccionar **New > Blueprint**.
2. Conectar el repositorio GitHub.
3. Render leerá `render.yaml` y creará el servicio `metamorfosis-os`.
4. Completar las variables marcadas como secretas.

### Configuración equivalente manual

- Tipo: **Web Service**.
- Runtime: **Node**.
- Rama: `main`.
- Build Command:

```bash
npm ci --registry=https://registry.npmjs.org/ --no-audit --no-fund && npm run build:admin
```

- Start Command:

```bash
npm start
```

- Health Check Path:

```text
/api/health
```

- Plan: Free mientras se acepte la espera de reactivación.

### Variables de entorno en Render

| Variable | Valor |
|---|---|
| `NODE_VERSION` | `20.19.0` |
| `NODE_ENV` | `production` |
| `NPM_CONFIG_REGISTRY` | `https://registry.npmjs.org/` |
| `SESSION_SECRET` | secreto aleatorio de al menos 32 caracteres |
| `DATABASE_URL` | URL de conexión PostgreSQL entregada por Neon |
| `ADMIN_EMAIL` | `contacto@metamorfosislab.cl` |
| `ADMIN_PASSWORD_HASH` | hash bcrypt de la contraseña, nunca la contraseña en texto plano |
| `PUBLIC_ORIGINS` | `https://metamorfosislab.cl,https://www.metamorfosislab.cl` |
| `VITE_PUBLIC_SITE_URL` | `https://www.metamorfosislab.cl` |
| `CONTACT_TO_EMAIL` | `contacto@metamorfosislab.cl` |
| `SMTP_HOST` | `smtp.zoho.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | cuenta SMTP autorizada (secreta) |
| `SMTP_PASS` | contraseña o app password SMTP (secreta) |
| `SMTP_FROM` | `contacto@metamorfosislab.cl` |

Para generar un hash nuevo localmente:

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_CLAVE', 12))"
```

Pegar el resultado completo en `ADMIN_PASSWORD_HASH` y marcar la variable como secreta.

### Base Neon

1. Abrir el proyecto Neon usado por Metamorfosis.
2. Copiar la cadena de conexión PostgreSQL con SSL.
3. Pegarla como `DATABASE_URL` en Render.
4. Desplegar.
5. Revisar `https://TU-SERVICIO.onrender.com/api/health`.
6. Debe responder algo equivalente a:

```json
{"ok":true,"database":"configured"}
```

Las tablas se crean automáticamente al iniciar el servidor.

---

## 3. Conectar `os.metamorfosislab.cl` a Render

1. En Render, abrir el servicio > **Settings > Custom Domains**.
2. Agregar `os.metamorfosislab.cl`.
3. En Cloudflare > **DNS > Records**, crear un CNAME:

| Tipo | Nombre | Destino | Proxy inicial |
|---|---|---|---|
| CNAME | `os` | subdominio `metamorfosis-os.onrender.com` que indique Render | **DNS only** |

4. Eliminar un eventual registro `AAAA` de `os` si existiera.
5. En Cloudflare > **SSL/TLS**, usar modo **Full**.
6. Volver a Render y seleccionar **Verify**.
7. Cuando Render emita el certificado y el dominio cargue correctamente, el proxy de Cloudflare puede dejarse en DNS only o activarse después.

---

## 4. Crear la web pública estática en Cloudflare Pages

1. En Cloudflare ir a **Workers & Pages**.
2. Seleccionar **Create application > Pages > Connect to Git**.
3. Elegir el mismo repositorio.
4. Configurar:

| Campo | Valor |
|---|---|
| Production branch | `main` |
| Framework preset | `None` o `Vite` |
| Build command | `npm ci --registry=https://registry.npmjs.org/ --no-audit --no-fund && npm run build:public` |
| Build output directory | `dist-public` |
| Root directory | dejar vacío |

5. En **Settings > Environment variables**, agregar para producción y previews:

| Variable | Valor |
|---|---|
| `NODE_VERSION` | `20.19.0` |
| `VITE_ADMIN_URL` | `https://os.metamorfosislab.cl` |
| `VITE_API_BASE` | `https://os.metamorfosislab.cl` |

6. Guardar y desplegar.

---

## 5. Asociar el dominio público a Cloudflare Pages

1. Abrir el proyecto Pages > **Custom domains**.
2. Agregar primero `metamorfosislab.cl`.
3. Agregar también `www.metamorfosislab.cl`.
4. Definir uno como dominio principal y redirigir el otro hacia él. La configuración propuesta en el código usa `www` como URL pública canónica.
5. Verificar que los registros anteriores que apuntaban la web pública a Render sean eliminados o reemplazados por los creados por Pages.

No modificar el CNAME `os`, porque ese subdominio debe continuar apuntando a Render.

---

## 6. Orden correcto para evitar caída

1. Desplegar y probar primero el nuevo servicio privado en su URL `onrender.com`.
2. Asociar y verificar `os.metamorfosislab.cl`.
3. Probar inicio de sesión, guardado y formulario mediante la URL privada.
4. Crear Cloudflare Pages y probar la URL `pages.dev`.
5. Confirmar que el botón **Acceso OS** abre `os.metamorfosislab.cl`.
6. Confirmar que el formulario público registra una oportunidad en el panel y que el mensaje llega efectivamente a `contacto@metamorfosislab.cl`.
7. Recién entonces trasladar `metamorfosislab.cl` y `www` desde Render a Pages.

---

## 7. Pruebas finales

### Web pública

- Carga inmediata aunque Render esté dormido.
- Navegación de escritorio y móvil sin superposición.
- Secciones de capacidades, Juana de Arco y CM visibles.
- Botón Acceso OS abre el subdominio privado.
- Formulario avanza solo al completar cada paso y envía automáticamente al correo institucional cuando SMTP está configurado.

### Panel privado

- Login con correo autorizado.
- Sesión persiste al recargar.
- Guardado de estado funciona.
- Tiempo y rentabilidad permite crear proyectos y registrar horas.
- Costo laboral y margen cambian al editar tarifas, horas, honorarios y costos.
- Exportación e importación JSON incluyen los nuevos registros.

### Seguridad

- No aparece la contraseña en GitHub.
- `ADMIN_PASSWORD_HASH` está solo en Render.
- `SESSION_SECRET` es distinto de la contraseña.
- `DATABASE_URL` está solo en Render.
- El panel no es indexado por buscadores.


## Error `getaddrinfo ENOTFOUND base`

Este error significa que `DATABASE_URL` no contiene una URL PostgreSQL válida y que Node está intentando resolver literalmente `base` como hostname. En Render, abre **Environment** y reemplaza `DATABASE_URL` por la cadena completa entregada por PostgreSQL/Neon/Render, con forma:

`postgresql://USUARIO:CLAVE@HOST:5432/NOMBRE_DB?sslmode=require`

No uses `base`, `host`, el nombre visible del recurso ni una etiqueta. Debe ser la URL de conexión completa. Tras guardarla, ejecuta **Manual Deploy → Deploy latest commit**.

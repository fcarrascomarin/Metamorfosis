# Metamorfosis OS 5.4.1 · Recuperación de inicio

## Qué se corrigió

- `npm start` ya no fuerza `NODE_ENV=production` con sintaxis incompatible con Windows. El entorno de Render conserva explícitamente `NODE_ENV=production`.
- `npm run dev:os` inicia API y Vite conjuntamente; las solicitudes `/api` se reenvían al servidor Express local. Abrir `http://127.0.0.1:5174/admin.html`.
- `npm test` apunta a la carpeta existente `test/` y ejecuta efectivamente siete pruebas (antes indicaba éxito sin ejecutar ninguna).
- `npm run doctor` inspecciona requisitos sin imprimir secretos.
- Activación de `package-lock` para que futuras instalaciones generen un archivo de bloqueo reproducible; no se incluye uno porque en el entorno de preparación no hubo conexión con npm.

## Diagnóstico según el síntoma

**El ZIP está descargado, pero nada inicia:** descomprimir, abrir terminal en la carpeta con `package.json`, ejecutar `npm install`, `npm run dev:os`. Nunca abrir `admin.html` con doble clic como archivo local.

**Se ve la web pública en lugar del OS:** para desarrollo abrir `/admin.html` en puerto 5174; en Render el OS debe estar publicado en el subdominio privado.

**Se queda en «Comprobando sesión»:** revisar API Express, consola y respuesta `/api/session`; Vite sin servidor backend no puede autenticar.

**El despliegue de Render falla:** revisar Build Logs/Runtime Logs del último despliegue y variables `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD_HASH` y `NODE_VERSION`, sin copiar sus valores. La ausencia de conectividad a PostgreSQL impide que el servidor de producción arranque; es una medida de seguridad.

**No existe `dist-admin/admin.html`:** ejecutar `npm run build:admin` antes de usar `npm start` localmente. No hacer despliegue del OS sin compilación satisfactoria.

## Verificación

- `npm run test` debe mostrar 7 pruebas.
- `npm run doctor` debe indicar el estado de dependencias y compilación.
- `npm run build:admin` debe terminar sin errores antes de enviar cambios a Render.
- `npm start` debe abrir `/api/health` en el puerto del servidor cuando el entorno esté correctamente configurado.

**Alcance de esta corrección:** no modifica el esquema PostgreSQL, la autenticación de producción, el estado guardado ni los registros de Empresas. La compilación completa no pudo ejecutarse en el entorno de preparación debido a falta de acceso de red al registro npm. Si falla en Render, necesitamos los Logs para identificar el origen exacto.

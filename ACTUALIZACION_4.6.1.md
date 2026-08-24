# Metamorfosis Lab 4.6.1

## Corrección de despliegue Render

- Validación temprana y explícita de `DATABASE_URL`.
- Rechazo de hosts-placeholder como `base`, `host`, `hostname` y `localhost` en producción.
- Mensaje de error accionable cuando PostgreSQL no puede conectarse.
- Prueba `SELECT 1` antes de crear/actualizar el esquema.
- Registro del hostname de PostgreSQL al iniciar correctamente.
- Guía de despliegue ampliada para `getaddrinfo ENOTFOUND base`.

El error observado no corresponde al build de Vite: Render compiló correctamente la versión 4.6.0. El fallo se produce al iniciar Node porque la variable de entorno `DATABASE_URL` del servicio apunta a un hostname inválido (`base`).

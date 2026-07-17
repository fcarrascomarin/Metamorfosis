# Solución de despliegue en Render

## Causa comprobada

El error `ETIMEDOUT` no provenía de `xtend` ni de Render en sí. El archivo `package-lock.json` apuntaba a un registro privado que solo existe dentro del entorno donde se generó el lock.

## Correcciones aplicadas

1. Todos los campos `resolved` usan `https://registry.npmjs.org/`.
2. `.npmrc` fija el registro público y configura reintentos.
3. `render.yaml` fuerza el registro npm público.
4. Node queda fijado en `20.19.0`; ya no se solicita cualquier versión superior como Node 26.
5. Se eliminó `dist/` del repositorio de entrega para evitar publicar una compilación anterior distinta del código fuente.
6. Se corrigió el componente de iconos faltante y se eliminaron archivos residuales.

## Recomendación al desplegar

Usar `Clear build cache & deploy` una vez, porque el intento anterior puede haber conservado referencias defectuosas en la caché del servicio.

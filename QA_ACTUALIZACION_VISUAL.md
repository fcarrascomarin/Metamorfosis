# QA · actualización visual pública

## Cambios verificados en código

- Navegación con compensación dinámica del encabezado fijo.
- Carga directa mediante hash corregida al iniciar la página.
- Método Metamorfosis ampliado al ancho útil de la página.
- Títulos públicos reducidos y con mayor espacio interior.
- Casos sin pantallazos de interfaces; reemplazados por los logos públicos de Juana de Arco y CM, y el logo de Metamorfosis OS.
- Logo de Metamorfosis reforzado en el footer.
- Reglas nuevas limitadas a `.public-site` para proteger el panel privado.
- Contenidos repetibles trasladados a `src/publicContent.js`.
- Iconos faltantes añadidos al componente SVG reutilizable.
- Diseño responsive agregado para 1080 px, 760 px y pantallas de poca altura.

## Validación pendiente en entorno de despliegue

La compilación local no pudo completarse porque el registro npm disponible en el entorno devolvió un error 404 al descargar una dependencia transitiva. El repositorio conserva `package-lock.json` y `.npmrc` con `registry=https://registry.npmjs.org/`, por lo que Cloudflare/Render deberían instalar normalmente, como en los despliegues anteriores.

Comando de verificación recomendado:

```bash
npm ci --registry=https://registry.npmjs.org/ --no-audit --no-fund
npm run build:public
npm run build:admin
```

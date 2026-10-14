# Metamorfosis Lab

Repositorio único con dos superficies separadas:

- **Web pública**: compilada con Vite y desplegada en Cloudflare Pages en `https://metamorfosislab.cl`.
- **Metamorfosis OS + API**: compilado/desplegado en Render en `https://os.metamorfosislab.cl`.

La web pública no expone el OS ni usa clientes, logos, testimonios o casos sin autorización expresa. El OS concentra agenda, oportunidades, herramientas metodológicas, expedientes comerciales, finanzas, tiempo/rentabilidad, repositorio y sistema familiar.


## Versión operativa actual

**Versión 5.4.0 · OS con Empresas unificadas (octubre de 2026).** La vista empresarial lista las organizaciones por nombre e integra sus personas, investigación, solicitudes y documentos en una sola ficha desplegable. Se mantiene la separación con Vida familiar y la compatibilidad con los datos previamente guardados. La versión del esquema de persistencia no se modifica por este ajuste de interfaz.

Para conocer decisiones de diseño, estructura, edición, pruebas y deuda técnica, leer [ARQUITECTURA-OS.md](ARQUITECTURA-OS.md).

## Comandos

```bash
npm install
npm run dev:public
npm run dev:admin
npm run build:public
npm run build:admin
npm run build:all
npm run test
npm run start
```

## Estructura principal

```text
src/PublicApp.jsx          web pública
src/AdminApp.jsx           Shell del OS y módulos históricos
src/publicContent.js       contenido público
src/consultingTools.js     herramientas y expedientes comerciales
src/osSeed.js              estado inicial/migración del OS
src/styles.css             entrada CSS de la web pública
src/admin-styles.css      estilos generales y heredados del OS
src/features/companies/   módulo de empresas, modelo, interfaz y estilos
ARQUITECTURA-OS.md        guía técnica de mantenimiento y evolución
server.js                  API, autenticación, PostgreSQL y correo
```

Para configuración de despliegue y variables de entorno, revisar `DEPLOYMENT.md` y `.env.example`.

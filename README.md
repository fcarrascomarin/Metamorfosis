# Metamorfosis Lab

Repositorio único con dos superficies separadas:

- **Web pública**: compilada con Vite y desplegada en Cloudflare Pages en `https://metamorfosislab.cl`.
- **Metamorfosis OS + API**: compilado/desplegado en Render en `https://os.metamorfosislab.cl`.

La web pública no expone el OS ni usa clientes, logos, testimonios o casos sin autorización expresa. El OS concentra agenda, oportunidades, herramientas metodológicas, expedientes comerciales, finanzas, tiempo/rentabilidad, repositorio y sistema familiar.

## Comandos

```bash
npm run dev:public
npm run dev:admin
npm run build:public
npm run build:admin
npm run build:all
npm run start
```

## Estructura principal

```text
src/PublicApp.jsx          web pública
src/AdminApp.jsx           Metamorfosis OS
src/publicContent.js       contenido público
src/consultingTools.js     herramientas y expedientes comerciales
src/osSeed.js              estado inicial/migración del OS
src/styles.css             estilos públicos e internos
server.js                  API, autenticación, PostgreSQL y correo
```

Ver `ACTUALIZACION_4.8.0.md` para configuración de Cloudflare, Render y DNS.

# Metamorfosis Lab

Repositorio único con dos superficies separadas:

- **Web pública**: compilada con Vite y desplegada en Cloudflare Pages en `https://metamorfosislab.cl`.
- **Metamorfosis OS + API**: compilado/desplegado en Render en `https://os.metamorfosislab.cl`.

La web pública no expone el OS ni usa clientes, logos, testimonios o casos sin autorización expresa. El OS concentra agenda, oportunidades, herramientas metodológicas, expedientes comerciales, finanzas, tiempo/rentabilidad, repositorio y sistema familiar.


## Versión operativa actual

**5.3.3 · OS 10.7**. Actualiza la planificación vigente del 31/08 al 04/09, integra compromisos externos y seminarios de Benjamín en la agenda compartida para visualizar disponibilidad, y reduce Inicio de Empresa a un resumen operativo. Mantiene la agenda móvil táctil, la iconografía consistente y la lógica Familiar orientada a calma y uso cotidiano.

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

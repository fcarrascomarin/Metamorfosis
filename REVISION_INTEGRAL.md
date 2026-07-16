# Revisión integral · Metamorfosis Lab

Fecha: 16 de julio de 2026

## Veredicto del ZIP recibido

El archivo recibido no estaba listo para publicar. La falla principal era objetiva: `npm run build` terminaba con tres importaciones no resueltas porque faltaban `hero-proyectos.webp`, `sistema-digital.webp` y `trabajo-metodo.webp`.

Además, el proyecto mezclaba dos implementaciones diferentes:

- La nueva web y panel, activos desde `src/App.jsx` y `src/styles.css`.
- Una versión anterior completa, con otros componentes, datos, panel y estilos que ya no eran importados.

La mezcla dejó código muerto, funciones duplicadas y alrededor de 25,8 MiB de imágenes copiadas al despliegue aunque no eran utilizadas. El `QA_REPORT.md` incluido afirmaba que la compilación y los activos estaban verificados, pero esas afirmaciones no coincidían con el contenido real del ZIP.

## Problemas críticos encontrados

1. **Compilación rota:** faltaban tres imágenes importadas por React.
2. **Activos declarados pero inexistentes:** faltaban el icono local de WhatsApp, favicon y tarjeta social.
3. **Despliegue innecesariamente pesado:** `public/` contenía imágenes antiguas de hasta 7,4 MB; Vite las copiaba completas a producción.
4. **Dos arquitecturas superpuestas:** componentes, datos y estilos anteriores permanecían sin participar en la aplicación activa.
5. **Identidad inconsistente:** se utilizaba un monograma temporal pese a que el ZIP contenía el logo oficial.
6. **Tarjeta social defectuosa:** el texto de la imagen Open Graph anterior estaba desbordado.
7. **Dependencia visual frágil:** los iconos dependían de una fuente remota; al fallar la descarga aparecían palabras como `schema`, `map` o `mail` en la interfaz.
8. **Datos engañosos en el panel:** un valor real de cero se convertía en tres cotizaciones y se mostraban gastos, alertas, tareas y oportunidades ficticias sin advertencia.
9. **Botones sin función:** varias acciones de crear, editar, ver, borrar o descargar no tenían comportamiento.
10. **Formulario incompleto:** faltaban consentimiento, validación razonable y protección honeypot.
11. **Panel públicamente enlazado:** el acceso interno aparecía en el footer público.
12. **Debilidades de API:** rutas inexistentes devolvían React; la actualización de estados no validaba correctamente ni manejaba errores.
13. **Indexación del panel:** faltaba `X-Robots-Tag` como respaldo de `robots.txt`.
14. **Configuración riesgosa:** el script de desarrollo activaba automáticamente un acceso administrativo demostrativo y `.npmrc` deshabilitaba la auditoría automática.
15. **Información esencial oculta:** la descripción completa de una oportunidad llegaba a la API, pero no podía leerse desde el panel.

## Correcciones aplicadas

- Restauración de los activos requeridos y compilación de producción real.
- Limpieza del paquete productivo y entrega separada del material legado.
- Uso del logo oficial, favicon coherente y nueva tarjeta social de 1200 × 630 px.
- Paleta alineada con el verde y turquesa de la identidad vigente.
- Sustitución de la fuente remota de iconos por SVG internos livianos; la interfaz ya no muestra nombres de iconos cuando no hay conexión externa.
- Incorporación de una sección pública específica para CM, comunicada honestamente como caso demostrativo en ejecución.
- Mejora del lenguaje comercial y separación entre información pública e interna.
- Formulario por pasos con consentimiento, teléfono y correo validados, honeypot y preparación de WhatsApp.
- Eliminación de métricas y registros ficticios. Lo no conectado se muestra como “módulo aún no conectado”.
- Filtros de oportunidades, cambio de estado conectado a la API y detalle expandible de cada solicitud.
- Eliminación de botones que simulaban funciones inexistentes.
- Eliminación del enlace público a `/admin`.
- Validación de UUID y estados, manejo de errores y respuesta JSON 404 en API.
- `X-Robots-Tag: noindex, nofollow, noarchive` en `/admin`.
- Inicialización de esquema antes de escuchar solicitudes y cierre ordenado del servidor.
- CSP reforzada: hash específico para JSON-LD y sin `unsafe-inline` en scripts o estilos.
- Acceso demo desactivado por defecto y auditoría npm activada.
- Iconos SVG accesibles, menú móvil con estado ARIA, foco visible, `alt` descriptivo y soporte para movimiento reducido.
- Utilidad de video preparada con `poster`, `data-src`, `preload="none"`, reproducción por clic y pausa automática de otros videos. Actualmente la página pública no incorpora videos activos.

## Resultado técnico comprobado

- `npm ci`: instalación reproducible correcta.
- `npm run build`: compilación exitosa.
- `npm audit --audit-level=low`: 0 vulnerabilidades reportadas.
- `/api/health`: correcto.
- Solicitud inválida: HTTP 400.
- Solicitud válida sin base conectada: HTTP 202, sin afirmar que quedó guardada.
- Login demo explícito, lectura de sesión, consulta protegida y logout: correctos.
- Endpoint inexistente: HTTP 404 JSON.
- `/admin`: cabecera de no indexación y CSP presentes.
- Inicio en producción sin `DATABASE_URL`: bloqueado, como corresponde.
- Build productivo: aproximadamente **0,72 MiB**, frente a **25,77 MiB** de la versión sin limpieza.

## Revisión UX, responsive y accesibilidad

Se revisaron la jerarquía visual, los puntos de quiebre de 1120, 900, 640 y 390 px, la navegación móvil, los formularios en una columna, la posición del WhatsApp flotante, la ausencia de scroll vertical interno en tablas, el comportamiento de anclas y el panel lateral móvil.

La revisión visual inicial permitió detectar el fallo de iconos remotos, que fue corregido con SVG internos. La ejecución automatizada de Lighthouse no pudo completarse en este entorno por una limitación de navegación de Chromium hacia el servidor local; por honestidad no se publican puntajes inventados. La validación final en teléfonos y tablets físicos sigue siendo necesaria antes del lanzamiento.

## Límites que permanecen

La versión corregida es compilable, coherente y desplegable, pero Metamorfosis OS todavía no es un sistema administrativo integral:

- Oportunidades y estados están conectados a PostgreSQL.
- Proyectos y documentos son registros iniciales de configuración, no CRUD persistente.
- Gastos, stock, proveedores, activos, indicadores y biblioteca metodológica son módulos futuros claramente señalados.
- La generación real de documentos, versionado, PDF y vínculo con Drive requieren una siguiente etapa de backend.
- El correo `contacto@metamorfosislab.cl` debe verificarse antes de publicar.
- Instagram no se muestra mientras no exista una cuenta institucional confirmada.
- Las fotografías de apoyo deben reemplazarse gradualmente por material propio del equipo, los proyectos y el territorio.

## Evaluación severa

- **ZIP recibido:** 3,5/10. Buena intención visual, pero no compilaba, contenía verificaciones inexactas, mezclaba dos versiones y simulaba datos y funciones.
- **Versión corregida:** 7,8/10 como MVP web + panel inicial. Ya puede desplegarse para validación comercial, pero no debe venderse todavía como un sistema de gestión integral terminado.

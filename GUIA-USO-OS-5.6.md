# Uso esencial · Metamorfosis OS 5.6

**Empresas:** abre el nombre del directorio. La ficha lateral conserva todo lo relacionado con esa organización. Las secciones «Datos y estado», «Personas», «Investigación y documentos», «Horas» y «Solicitudes» son plegables. La búsqueda alcanza también nombres de personas. «Nueva empresa» solo si aún no existe en el índice.

**Agenda:** elige 7, 14 o 30 días. Una fila despliega contexto; «Editar registro» abre el editor, «Completar» cierra el pendiente. Los compromisos históricos sin cerrar no bloquean el espacio principal; están al final, plegados. Las referencias sugeridas no se incorporan automáticamente.

**Gestión:** usa el conmutador «Caja» / «Horas y proyectos». La edición de montos se realiza en sus filas. Para horas, abre «+ Registrar horas»; para modificar un proyecto, abre su fila; para editar horas históricas, despliega «Historial» y el registro respectivo.

**Guardado:** el botón de cabecera muestra «Guardar cambios» cuando hay modificaciones pendientes. Verifica el estado antes de salir y descarga un respaldo JSON antes de desplegar una versión distinta.

**Arranque local:** con Node compatible, `npm install`, `npm run dev:os` y abrir `http://127.0.0.1:5174/admin.html`. Para validar compilación en producción: `npm test && npm run build:admin`.

**Pendiente de validación real:** funcionamiento en Render, comprobación visual y persistencia remota. Esta entrega es código fuente listo para probar, no una actualización automática del sitio publicado.

# Metamorfosis Lab · Revisión conservadora del sitio y mesa de trabajo

## Web pública
Se preservaron exactamente los archivos de la web pública de la versión suministrada por el usuario. No se reescribieron el inicio, la propuesta, el método ni el equipo. La revisión detectó algunas reiteraciones entre la presentación del inicio, la sección Propuesta y el método, pero no hay evidencia suficiente para justificar otra intervención antes de evaluar la lectura real de visitantes. El título, el vínculo con Biobío, el recorrido narrativo y el cierre que invita a conversar ya cumplen una función clara.

El criterio para futuras ediciones es modificar únicamente frases que aporten información nueva y verificable, sin crear listados extensos ni promesas de especialidades aún no demostradas. No añadir textos para responder literalmente a cada concepto surgido en las reuniones internas.

## Nueva Mesa de trabajo
Al ingresar a la empresa aparece una pestaña **Mesa**. El usuario también puede acceder mediante `#office`.

La Mesa tiene cuatro vistas que responden a necesidades distintas.

* **Ahora** permite conocer las tareas pendientes más relevantes, proyectos activos, acuerdos recientes, documentos pendientes de vincular y crear plantillas de trabajo.
* **Ruta institucional** contiene 12 tareas para formalización, operación y desarrollo. Se actualizan estado, responsable, avance y evidencia de cierre. Ningún trámite se marca como concluido sin verificación.
* **Proyectos** permite editar el siguiente movimiento, condición pendiente, responsable y fecha. Es un registro ejecutivo, no una duplicación del seguimiento comercial en Empresas.
* **Documentos** registra títulos, proyectos, estados, versiones, responsables, enlaces y textos breves. Permite filtrar, exportar el índice CSV y descargar textos como Markdown. Los archivos grandes se almacenan en un servicio externo de su elección y se enlazan. Este OS no aloja automáticamente PDF, DOCX ni sus adjuntos.

Se incorporaron tres plantillas ligeras para investigación aplicada, minuta de reunión y presupuesto/alcance. Son puntos de partida editables y no informes que simulen experiencia inexistente.

## Compatibilidad
La nueva sección se agrega al estado JSON existente sin reemplazar las colecciones de empresas, agenda, expedientes, familia, horas ni finanzas. Los identificadores de tareas y registros iniciales son estables y la migración respeta las modificaciones ya guardadas. Si se usa un servidor sin PostgreSQL, el guardado funciona **solo en el navegador**. El botón indica entonces «Guardado local». Para compartir datos entre usuarios, se requiere una base PostgreSQL configurada.

## Antes de instalar
1. Exportar un respaldo JSON desde el OS actual y conservar una copia.
2. Reemplazar el código del repositorio por este paquete. Instalar dependencias con `npm ci` o `npm install` según el estado del repositorio y ejecutar `npm run build:all` y `npm test`.
3. Publicar en el entorno habitual. Abrir Mesa, verificar Empresas, Agenda y Gestión, revisar un registro editado, pulsar Guardar cambios y volver a cargar. Comprobar que el registro persista.
4. Si se encuentra un problema, restaurar la versión anterior del código y el respaldo JSON.

**Verificación realizada en este entorno**: análisis sintáctico de archivos JSX mediante el analizador de TypeScript y 14 pruebas automatizadas. No se pudo ejecutar la compilación Vite completa, porque la instalación de dependencias no terminó dentro del límite disponible. Tampoco se ha hecho despliegue en producción ni revisión visual interactiva.

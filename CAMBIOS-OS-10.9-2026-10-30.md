# Metamorfosis OS 10.9 · Ajuste editorial y mesa de trabajo

## Propósito de la revisión
Respuesta a la evaluación del usuario: los textos públicos resultaban artificiosos y repetitivos; los controles de guardado perdían contraste; y el panel interno era más un archivo administrativo que un instrumento para ordenar el trabajo actual.

## Web pública
- Revisión de textos **realmente mostrados** en inicio, propuesta, equipo y contacto (`src/PublicApp.jsx`).
- Se reemplazó la enumeración de atributos por una narración con problemas concretos; se redujo la reiteración entre inicio, propuesta y método.
- Se mantuvieron el diseño, el recorrido de una página, los enlaces y el formulario.
- Se aligeraron biografías y metadatos descriptivos (`src/publicContent.js`, `index.html`).
- No se publicitan como acreditadas especialidades futuras (clima, ciberseguridad, auditoría técnica).

## Web interna: Mesa
- **Mesa** es la entrada predeterminada del área empresarial (si no se abre una URL con una pestaña elegida). Las pestañas superiores son Mesa, Empresas, Agenda y Ruta.
- Resumen práctico de los primeros pasos institucionales todavía pendientes. Un paso puede ponerse en curso o cerrarse **con indicación de respaldo**.
- Registro editable de proyectos/conversaciones con estado, responsable, siguiente paso, bloqueo y fecha opcional.
- Se precargan tres frentes **como referencias por revisar**, sin presumir acuerdos comerciales ni ejecución: Lanceros, conversación CMPC Laja y Vitrina Pyme. Pueden editarse, ponerse en pausa o cerrarse. Se pueden añadir nuevos.
- Registro rápido de acuerdos o bloqueos, visible en Mesa y conservado en el historial institucional.
- Acceso a Empresas, Agenda, Ruta y Gestión, con caja y horas fuera de la navegación principal mientras no se usen.
- La Ruta mantiene las 12 tareas y su evidencia de cierre; está dividida en etapas desplegables para evitar un muro de texto.
- Contrastados colores del botón superior Guardar cambios y acciones de registro, incluidos estados activos y pantallas pequeñas.

## Datos y compatibilidad
- Versión del estado `10.9`; migración aditiva desde `10.7` y `10.8`, preservando los registros previos, empresas, expedientes, contactos, agenda, horas, caja e historial.
- Se añade `workstreams` al estado, con valores por defecto solo si el estado anterior no tenía ese campo; **un arreglo existente vacío se conserva vacío**.
- Cambiar un proyecto genera una entrada en el historial de cambios; no se sobreescriben notas de tareas previas.
- Ediciones registradas en estado local requieren presionar **Guardar cambios** para persistirlas en el backend compartido (si está configurado).
- No existe integración automática con los acuerdos de ChatGPT ni con Google Calendar.

## Pruebas y límites
- `npm test`: pruebas del repositorio y nuevos tests de tablero/estados.
- Parser TypeScript para los archivos JS/JSX (verificación sintáctica).
- No se hizo despliegue, revisión visual autenticada ni build Vite completo: el entorno de trabajo no podía instalar dependencias desde npm por ausencia de DNS. En el entorno con `npm` disponible, ejecutar `npm install`, `npm run build:all` y revisar web pública y OS antes de publicar.

## Despliegue seguro
1. Descargar **antes de actualizar** un respaldo JSON desde la web interna actual.
2. Guardar una copia del repositorio antes de reemplazar los archivos de esta versión.
3. Extraer el ZIP y llevar sus archivos a la rama o carpeta de despliegue habitual.
4. Instalar dependencias y compilar ambos sitios (`npm install`, `npm run build:all`).
5. Revisar contraste de Guardar cambios, formularios, móvil, carga de datos antiguos y el historial de Ruta.
6. Confirmar cambios reales en OS y presionar **Guardar cambios**; volver a ingresar y verificar persistencia.

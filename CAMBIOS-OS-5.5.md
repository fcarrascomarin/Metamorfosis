# Metamorfosis OS 5.5.0 · Simplificación operativa

## Decisiones de producto

- **Empresas** sigue siendo el único directorio: una organización por nombre, contactos y expedientes relacionados. La información histórica NO se migra ni elimina.
- **Inicio** elimina tarjetas narrativas repetidas y se concentra en accesos, próximos compromisos y una indicación discreta del histórico pendiente. Solo la lista futura corresponde a tareas registradas en el OS.
- **Agenda** reemplaza la vista mensual predeterminada por una lista de 7/14/30 días; el histórico vencido se conserva dentro de un plegable para depurar, sin tratarlo como vigente. No se infiere que tareas vencidas sigan siendo obligaciones.
- **Herramientas y documentos por empresa** pasan a un bloque adicional plegado por defecto. Situación, próximos pasos y contactos siguen accesibles, sin duplicar el expediente en la navegación.
- **Fichas preexistentes, historial, horas, datos financieros, referencias y métodos** permanecen guardados. El cambio afecta principalmente su presentación, no la estructura persistida.

## Agenda y respaldo de fechas

Las referencias de 14 octubre (reunión sobre concesiones mineras y conversación histórica en Laja) y 19 octubre (entrega de UBA) proceden del contexto de trabajo previo compartido en este proyecto. La primera y la segunda pueden haber ocurrido: el OS **no las marca hechas ni las considera verificadas**. Solo el 19 octubre aparecerá como propuesta futura luego del 14 de octubre. El usuario decide si registra cada referencia; nunca se carga de manera automática.

La conexión con Google Calendar **no se completó** porque se rechazó la autorización de acceso. El OS **no está sincronizado con Google Calendar**; no puede afirmar tener una agenda completa ni actualizado todo el trabajo externo. Las tareas ya registradas por el usuario tienen prioridad sobre los ejemplos de referencia.

## Mantenimiento

- `src/features/companies/CompanyWorkspace.jsx`: directorio único.
- `src/features/companies/CompanyDetail.jsx`: ficha por organización y acceso avanzado a métodos.
- `src/features/agenda/AgendaFocus.jsx`: nueva agenda compacta y referencias de hitos.
- `src/features/agenda/agenda-focus.css`: estilos confinados a agenda.
- `src/AdminApp.jsx`: composición de Inicio, menú y enrutamiento.
- `src/admin-styles.css`: overrides confinados a `.os-focus`.

## Verificación y riesgos

- `npm test`: 7 pruebas existentes del modelo empresarial aprobadas.
- Compilación de Vite en este contenedor: no ejecutada porque no dispone de dependencias npm instaladas y la salida a npmjs.org ha fallado anteriormente.
- **No subir a producción sin `npm install && npm run build:admin` y comprobación visual** en un entorno con dependencias.
- **Hacer copia de seguridad con «Descargar respaldo JSON» antes de desplegar.**
- El OS actualmente desplegado en `os.metamorfosislab.cl` no se modificó desde este paquete. Debe publicarse explícitamente la actualización.
- No se ha implementado aún un CRUD normalizado en PostgreSQL por organización: la ficha unificada es una capa de lectura/escritura sobre estructuras históricas. Es una siguiente refactorización, no una función ya entregada.
- No se han creado conexiones con API Compra Ágil ni configurado su ticket; es una iniciativa separada.

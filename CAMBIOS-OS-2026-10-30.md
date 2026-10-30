# Metamorfosis OS — Ruta institucional y revisión pública
Fecha: 30 de octubre de 2026. Versión de datos: 10.8.

## Qué cambió en la aplicación privada

- Nueva pestaña **Ruta**, junto a Empresas, Agenda y Gestión. Muestra tres fases de trabajo: formalizar, organizar y validar/crecer.
- Doce tareas nuevas con responsable, fecha de trabajo **referencial**, condiciones verificables de cierre y estado inicial **Pendiente**. Ninguna contratación, inicio de actividades ni patente se da por realizada.
- Cada tarea admite cambios de estado (pendiente, en curso, en espera, completada), edición de fecha/detalle y nota de avance. Los cambios se reflejan en la Agenda porque ambas vistas comparten `osState.tasks`.
- Panel de decisiones institucionales aprobadas y bitácora de avances/modificaciones, con registro manual para nuevos hechos. **Guardar cambios** en el encabezado para persistir; luego comprobar el mensaje de guardado.
- Migración aditiva de estados 10.7 a 10.8. Conservar respaldo JSON antes de desplegar. Las tareas institucionales tienen ID estable y no se duplican por una segunda migración.
- Corregida la clasificación de organizaciones: el descarte de un contacto no cierra una organización cuando otra conversación sigue activa, salvo expediente cerrado o exclusión expresa.

## Qué cambió en la web pública

Se mantuvieron su identidad visual, navegación y estructura de una sola página. Se afinó el texto del hero, la propuesta, los ejemplos de problemas y la presentación del equipo para hacer explícitos:

- investigación aplicada e interdisciplinaria;
- productividad y uso eficiente de recursos;
- prevención y anticipación de problemas;
- destinatarios públicos/privados, con/sin fines de lucro;
- consideración de sistemas vivos y condiciones humanas;
- entregables posibles (diagnóstico, propuesta, herramienta o piloto), sin prometer certificaciones o especialidades no validadas.

No se añadió una sección independiente de cambio climático ni ciberseguridad: todavía se desarrollan capacidades y sería prematuro presentarlas como servicios consolidados.

## Seguridad de cambios y despliegue

1. Respaldar el estado actual desde **Descargar respaldo JSON** antes de subir el código.
2. Compilar con Node >=20.19 y dependencias de npm: `npm install --include=dev` y `npm run build:all`. El CI recomendado ejecuta `npm run test` antes de ambas compilaciones.
3. Actualizar los despliegues **público y privado** siguiendo `DEPLOYMENT.md`. No sustituir datos reales de PostgreSQL por los valores de ejemplo de `osSeed.js`.
4. Abrir `/admin.html` o el OS privado, iniciar sesión y entrar a **Ruta**. Verificar 12 tareas, estado de pendientes, cambios de estado, guardado/recarga y Agenda.
5. Abrir la web pública en móvil y escritorio y verificar lectura del hero, propuesta, equipo y contacto.

En este entorno la instalación de dependencias npm no pudo completarse por falta de resolución de red; la ejecución de la compilación Vite queda pendiente del equipo/deploy. Se comprobaron 14 pruebas de Node y sintaxis JS/JSX mediante TypeScript; no equivale a una prueba visual end-to-end.

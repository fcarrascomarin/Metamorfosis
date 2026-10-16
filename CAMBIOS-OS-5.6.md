# Metamorfosis OS 5.6.0 — mesa de trabajo sin pantallas redundantes

**15 de octubre de 2026 · Actualización de interfaz del área Empresa.**

## Decisiones

- **Fuera «Inicio» como pantalla empresarial.** No añadía decisiones distintas de las vistas operativas. Los enlaces históricos `#dashboard`, `#field`, `#expedientes` y `#documents` conducen ahora a `#companies`.
- **Fuera la barra lateral empresarial fija.** Las únicas entradas visibles son **Empresas, Agenda y Gestión**, reunidas en una banda superior de 55 px. El espacio Familiar mantiene su navegación y sus datos.
- **Empresas = una organización, una ficha.** Directorio alfabético en filas de 39 px, con búsqueda y estado, selección a la derecha y edición por secciones plegables. Las personas, herramientas, documentos, solicitudes y horas siguen vinculados a esa ficha.
- **Métodos y documentos no ocupan espacio por defecto.** Incluso al abrir la sección técnica, solo se muestran las herramientas activadas, salvo petición expresa de ver todas.
- **Agenda = lista útil.** Muestra compromisos registrados a 7, 14 o 30 días, edición al desplegar, completado y registro de tarea. Histórico atrasado queda conservado pero plegado. Única fecha futura aportada por las conversaciones y aún por verificar: 19/10/2026, entrega UBA. No se finge sincronización con calendarios externos.
- **Gestión = caja + horas/proyectos.** Información numérica en filas; formularios de altas, tarifas, proyectos, registros y notas se abren al pulsar. El cálculo financiero diferencia ingresos previstos de liquidez. Persisten las estructuras `finance` y `timeTracking` existentes.
- **Mejora del criterio de clasificación.** Una persona cerrada no marca automáticamente como cerrada a la empresa si existen otros contactos activos.

## Seguridad y conservación

No se ejecutaron migraciones de la base de datos, eliminaciones ni cambios de autenticación o servidor. Las colecciones históricas siguen existiendo para permitir el acceso a información previamente registrada. La nueva interfaz reutiliza el mismo mecanismo de guardado y exportación JSON.

**Importante:** antes de desplegar, descargar respaldo JSON de la versión online. El archivo ZIP NO contiene la base de datos remota, contraseñas, tickets de ChileCompra ni información de sesión. Mantener los secretos exclusivamente en las variables de entorno de Render.

## Estructura relevante

- `src/AdminApp.jsx` → inicio, sesión, navegación empresarial/familiar y persistencia original.
- `src/features/workspace/lean-shell.css` → superficie empresarial compacta y responsive (no se altera el área pública).
- `src/features/companies/` → índice por empresa, detalles, documentos, interacciones y CSS local.
- `src/features/agenda/` → lista de compromisos, referencias no confirmadas y registros antiguos.
- `src/features/management/` → `ManagementWorkspace` (selector), `CashPanel`, `HoursPanel`, `managementModel` (cálculos puros) y CSS.
- `test/` → pruebas de agrupación y conservación de datos, estados y cálculos.

## Verificación efectuada

- **11 pruebas de Node:** aprobadas.
- **18 archivos JS/JSX:** análisis de sintaxis correcto con el parser TypeScript.
- **Importaciones relativas:** comprobadas sin rutas faltantes.
- **`npm run doctor`:** Node/archivos correctos; advierte que faltan dependencias e instalación compilada.
- **No se pudo completar `npm install`** desde este entorno por falta de acceso al registro npm. Por eso aún están pendientes `npm run build:admin`, apertura visual en navegador, inicio de sesión y prueba contra la base real.

## Pasos de despliegue seguro

1. Entrar al OS vigente y exportar respaldo JSON. Verificar que el respaldo se abre como JSON válido y guardarlo fuera de la carpeta del repositorio.
2. En entorno de pruebas: `npm install`, `npm test`, `npm run build:admin`, `npm run doctor`.
3. Revisar a pantalla completa: selección de empresa, edición de contacto, abrir/cerrar documentos, alta/edición de tarea, registro de horas y guardado, importación/exportación.
4. Solo entonces publicar a Render. Comprobar el endpoint `/api/health` y la carga en `https://os.metamorfosislab.cl`.

**Alcance limitado:** la operación de todas las vistas históricas permanece en código para compatibilidad, pero ya no forma parte de la navegación empresarial ordinaria. La limpieza masiva de CSS legado se deja para otra fase porque podría romper el entorno Familiar o el sitio público.

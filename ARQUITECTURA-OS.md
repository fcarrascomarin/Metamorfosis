# Metamorfosis OS · Arquitectura y mantenimiento

Versión de interfaz: Empresas unificadas (octubre de 2026).

## 1. Objetivo de diseño

La pantalla empresarial es un espacio de **decisión y trabajo**, no un índice de documentos. La navegación principal tiene cinco accesos: Inicio, Agenda, Empresas, Caja del negocio y Horas y rentabilidad. «Dirección y criterios» permanece accesible desde Inicio sin ocupar otro elemento permanente del menú. Los expedientes de cada organización, sus personas, investigación y documentos se abren únicamente dentro de **Empresas**. La navegación Familiar se conserva separada.

A primera vista se muestra un directorio alfabético. Se puede buscar por empresa o persona, filtrar por situación y abrir un panel de detalle. El contenido profundo (personas, investigaciones, documentos y solicitudes) se despliega por demanda. En escritorio, el directorio y la ficha usan scroll interno para mantenerse en una sola pantalla; en móvil se reorganizan verticalmente.

## 2. Estructura actual

```text
src/
├── admin-main.jsx                       # Arranque de la aplicación privada
├── AdminApp.jsx                         # Shell, carga/guardado, agenda, caja y familiar
├── osSeed.js                            # Datos iniciales y versión del estado
├── consultingTools.js                   # Esquemas de fichas metodológicas
├── data.js                              # Catálogo de plantillas (y web pública)
├── features/
│   └── companies/
│       ├── companyModel.js             # Agrupa registros sin modificar el original
│       ├── CompanyWorkspace.jsx        # Buscador, filtros y directorio
│       ├── CompanyDetail.jsx           # Edición de expedientes y asociaciones
│       ├── CompanySections.jsx         # Contactos, método, documentos, solicitudes y horas
│       └── companies.css               # Estilos específicos del módulo
└── admin-styles.css                     # Estilos acumulados del OS (deuda técnica)
server.js                                # API, sesiones y PostgreSQL
public/                                  # Recursos estáticos
src/PublicApp.jsx                        # Web pública, aplicación independiente
```

**Por dónde empezar a leer:** `package.json` → `src/admin-main.jsx` → `AdminApp.jsx` (`AdminShell`) → `CompanyWorkspace.jsx` → `companyModel.js` → `server.js`. Para revisar la web pública, usar `src/public-main.jsx` y `src/PublicApp.jsx`; no mezclar cambios de la web pública con los del OS.

## 3. Modelo de datos y compatibilidad

Los registros preexistentes no se reescriben automáticamente. El adaptador `buildCompanyIndex` calcula la vista por organización a partir de:

- `expedientes[]`: identificación general, estado, responsable, notas y herramientas.
- `fieldRegister[]`: personas, relación, contexto, próximos pasos y límites.
- `repository.documentsByExpediente[id]`: documentos propios de ese expediente.
- `quotes[]`: solicitudes web, persistidas por una API independiente.

La relación explícita `fieldRegister[].companyId` prima sobre nombres y permite renombrar organizaciones sin perder sus contactos. Los antecedentes anteriores sin `companyId` se agrupan por nombre normalizado mediante reglas transparentes; los alias conocidos se limitan a casos identificados. Nunca se infiere que dos empresas relacionadas sean una misma persona jurídica.

**Importante:** esto es un *adaptador de transición*, no un nuevo almacenamiento duplicado. Para una siguiente versión mayor se recomienda migrar, con respaldo y prueba de regresión, a entidades canónicas `organizations`, `people`, `interactions`, `cases` y `documents` con identificadores permanentes. No ejecutar esa migración silenciosamente.

Los documentos de las tres fichas metodológicas no aparecen duplicados en «Documentos». Si existía contenido documental específico asociado a alguna de ellas, permanece disponible dentro de su respectiva ficha como «Contenido documental previamente guardado». El historial no se elimina.

## 4. Regla de desarrollo y edición

1. **Cambio de texto o vista:** modificar solamente el componente de esa funcionalidad. Usar nombres expresivos, componentes pequeños y formularios controlados.
2. **Cambio de datos:** editar una sola colección original mediante `setOsState(current => ...)`, devolviendo nuevas copias de los objetos modificados. No mutar el estado.
3. **Cambio de reglas de agrupación:** escribir primero una prueba en `tests/companyModel.test.js`; modificar después `companyModel.js`. Nunca fusionar organizaciones solo porque tengan contactos o apellidos parecidos.
4. **Cambio de CSS:** usar selectores bajo `.company-os` en `companies.css`; evitar agregar otra regla global al final de `admin-styles.css`.
5. **Cambio de persistencia o API:** verificar compatibilidad con respaldos JSON, importación/exportación, `/api/os-state` y PostgreSQL. Separar los cambios de interfaz de las migraciones de esquema.
6. **Antes de publicar:** respaldar datos reales, ejecutar `npm run test`, `npm run build:all`, probar móvil y escritorio, verificar guardar/recargar y navegación con hashes históricos `#field`, `#expedientes`, `#documents`.

Evitar copiar y pegar fichas o listas. Las herramientas son declarativas en `consultingTools.js`, y los documentos se definen en el catálogo; sus formularios se generan desde esas definiciones.

## 5. Deuda técnica y siguientes mejoras posibles

`AdminApp.jsx`, `admin-styles.css` y `server.js` siguen concentrando responsabilidades. **No han sido reescritos por completo**: hacerlo junto con una modificación de navegación elevaría innecesariamente el riesgo de perder datos. La prioridad de la siguiente refactorización debería ser extraer `state/migrations`, `api/`, `features/agenda`, `features/finance`, `features/family` y estilos propios por módulo, acompañados de pruebas automatizadas.

Las solicitudes web continúan teniendo almacenamiento/operaciones independientes y se muestran vinculadas por el nombre de organización. Si alguna solicitud carece de organización, se presenta al final de Empresas en «Solicitudes sin empresa identificada». Solo se incorpora a una organización real después de corregir el nombre en su formulario. Las horas conservan su propia contabilidad por proyecto.

## 6. Comandos

```bash
npm install
npm run dev:admin
npm run test
npm run build:admin
npm run build:all
npm run start
```

Para desarrollar, se debe contar con Node compatible con la versión declarada en `package.json` y configurar las variables del archivo `.env.example` mediante un `.env` privado. No incluir tokens ni credenciales reales en código, respaldos compartidos ni commits.

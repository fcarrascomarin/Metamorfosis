# Metamorfosis OS 5.4.0 · Registro de cambios

## Qué cambia

- Empresa muestra un directorio alfabético único con búsqueda por organización o persona y filtros por situación.
- El detalle se abre a demanda y conserva en una ficha personas, investigación, documentos, solicitudes web y, cuando corresponde, horas asociadas.
- La estructura comercial separada de «Campo comercial», «Expedientes» y «Repositorio» se reemplaza en el menú por «Empresas»; sus enlaces antiguos redirigen a la vista unificada.
- «Dirección y criterios» se accede desde Inicio. No se borra ninguna de las decisiones originales.
- El escritorio concentra el listado en una pantalla; los detalles se despliegan en un panel con scroll interno. En pantallas pequeñas, las áreas se apilan.
- Corrección de la precedencia de datos en documentos: los cambios persistidos ganan sobre los valores de ejemplo del estado inicial, y las eliminaciones deliberadas no se reponen automáticamente.

## Cómo se ha desarrollado

- Se introdujo `src/features/companies/`, separando el modelo de lectura, el directorio, los formularios y los estilos.
- Se conservaron las colecciones originales de persistencia. La nueva agrupación es derivada, no una segunda copia editable.
- Se añadieron pruebas de integración de fuentes, nombres normalizados, vínculo explícito por ID, documentos guardados e IDs de expedientes.
- Se documentaron rutas de lectura, responsabilidades, pruebas y refactorización futura en `ARQUITECTURA-OS.md`.

## Verificaciones de esta entrega

- Pruebas de modelo: ejecutadas con `npm run test`.
- Análisis sintáctico JSX/JS y rutas de importación relativa: verificados con el parser de TypeScript disponible en el entorno.
- Compilación con Vite y prueba visual en navegador: **no ejecutadas en este entorno** porque la instalación de dependencias no concluyó. Son verificaciones previas indispensables al despliegue.

## Precaución para publicar

1. Descargar una copia de seguridad JSON desde el OS actual y conservar también la última versión funcional del repositorio.
2. Instalar dependencias y ejecutar `npm run test && npm run build:all`.
3. Probar en entorno de desarrollo crear empresa, vincular contacto, editar y guardar, recargar, editar documento y utilizar solicitudes web.
4. Revisar visualmente escritorio y móvil; publicar solo después.

Este paquete contiene código fuente y no incluye ni sobrescribe los datos de la base de producción. Tampoco implica un despliegue automático.

# Metamorfosis Lab 4.6.0 · actualización 23-08-2026

## Metamorfosis OS 8.0

- Agenda operativa cargada para lunes 24 a viernes 28 de agosto de 2026.
- Hito semanal: seleccionar, preparar y enviar 5 ofertas reales del Biobío, incluyendo Club Vegan.
- Frentes actuales: validación comercial, Vitrina Pyme/Club Vegan, ordenamiento y trazabilidad operacional, Ciclo Seguro y Caso 0 CM.
- CM Banquetería & Restaurant pasa a estado `Cerrado · Caso 0` en proyectos, tiempo, frentes, documentos y referencias públicas.
- Migración desde estados anteriores: conserva tareas personalizadas, proyectos económicos, registros de tiempo, información familiar y decisiones/frentes no pertenecientes al seed antiguo.
- Los borradores locales antiguos v6/v7 también se recuperan y migran a v8.

## Formulario público

- Los indicadores 1–2–3 ya no son botones y no permiten saltar etapas.
- Paso 1: exige seleccionar una entrada y escribir al menos 10 caracteres.
- Paso 2: exige organización y nombre de contacto.
- Paso 3: exige correo válido y consentimiento; teléfono continúa siendo opcional, pero se valida si se completa.
- El botón de envío se bloquea durante y después de un envío exitoso para evitar duplicados.
- La interfaz solo confirma éxito si la API confirma que el correo fue enviado.
- La oportunidad local usa el mismo ID de la API, evitando duplicados con PostgreSQL.
- Si SMTP falla, se muestra un error explícito y un enlace manual de respaldo, sin fingir éxito.

## Correo SMTP

El servidor usa Nodemailer y entrega a `CONTACT_TO_EMAIL` (por defecto `contacto@metamorfosislab.cl`). En Render deben existir:

- `SMTP_HOST=smtp.zoho.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=contacto@metamorfosislab.cl`
- `SMTP_PASS=<secreto configurado en Render>`
- `SMTP_FROM=contacto@metamorfosislab.cl`

`/api/health` informa además si SMTP está configurado (`smtp: configured|missing`).

## Legibilidad y responsive

- Capa final de contraste por tipo de superficie (clara/oscura) para neutralizar reglas históricas conflictivas.
- Placeholders, textos secundarios, botones deshabilitados y formulario reforzados.
- Ajustes específicos para tablet, móvil y pantallas de 420 px o menos.
- Pares principales de contraste verificados por cálculo WCAG, todos por encima de 7:1.

## QA realizado

- `server.js`: validación sintáctica con Node.
- JSX/JS principal: validación sintáctica con parser TypeScript.
- CSS: llaves estructurales balanceadas.
- Seed OS: verificados 10 bloques diarios, 5 frentes y CM como Caso 0.

La instalación completa de dependencias no pudo ejecutarse en el entorno de revisión por falta de resolución externa del registro npm; por eso el despliegue debe ejecutar el `npm install`/`npm run build` normal del repositorio como verificación final de integración.

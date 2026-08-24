# Guía breve de edición · Metamorfosis Lab 4.8

## Web pública

El contenido público principal está en `src/publicContent.js` y la composición en `src/PublicApp.jsx`.

Navegación vigente:

1. Qué hacemos
2. Cómo trabajamos
3. Equipo
4. Contacto

No agregar clientes, logos, testimonios ni “casos” sin autorización expresa documentada. El OS tampoco forma parte de la navegación pública.

## Equipo

Editar el arreglo `team` en `src/publicContent.js`. Mantener nombre, función real y descripción breve; no inflar cargos o capacidades.

## Servicios y precios

Editar `servicePricing` en `src/publicContent.js`. Toda modificación debe preservar alcance, resultado y exclusiones comprensibles.

## Herramientas comerciales y expedientes

Las tres herramientas activas están en `src/consultingTools.js`:

- Ficha de oportunidad
- Perfil preliminar de empresa
- Pauta de conversación inicial

`createEmptyExpediente()` define la estructura reutilizable y `createClubVeganExpediente()` contiene la semilla del EXP-001. Los expedientes posteriores se crean desde el propio OS y se guardan dentro del estado persistente.

## Estilos

`src/styles.css` contiene estilos compartidos. Las reglas finales de 4.8 están acotadas por `.public-site--audit`, `.expediente-*`, `.tool-standard-*` y `.admin-frame--family` para reducir interferencias con componentes históricos.

Regla visual: texto oscuro sobre superficies claras y texto claro sobre superficies oscuras. Comprobar siempre escritorio, tablet y móvil.

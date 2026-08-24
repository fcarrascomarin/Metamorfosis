# Metamorfosis Lab 4.8.0 · auditoría pública + expedientes

## Web pública (Cloudflare Pages)

- CM y cualquier referencia pública a clientes/casos no autorizados quedan fuera de la aplicación pública.
- Se elimina “Casos” de la navegación y del contenido visible.
- El OS deja de aparecer en la navegación pública.
- Hero y CTA se reformulan en lenguaje de problema/resultado.
- Se incorpora sección de equipo con responsabilidades visibles.
- SEO básico: canonical, robots, Open Graph, Twitter, JSON-LD, sitemap y contenido HTML inicial indexable.
- Se refuerza contraste por superficie y responsive para escritorio, tablet y móvil.
- El formulario mantiene flujo de tres pasos bloqueados hasta completar la información requerida y usa la API privada del OS para enviar correo.

## Metamorfosis OS (Render)

- Render sigue sirviendo exclusivamente OS + API en `os.metamorfosislab.cl`.
- El OS y la API se marcan `noindex`.
- Menú reducido a operación, comercial, método, gestión y vida familiar.
- Se eliminan CM y Caso 0 del estado operativo actual y de los proyectos/tiempos.
- Se agregan tres herramientas de prospección: Ficha de oportunidad, Perfil preliminar y Pauta de conversación inicial.
- Se agrega módulo Expedientes, creación correlativa `EXP-###`, edición, estado y porcentaje de avance.
- `EXP-001 · ClubVegan` queda precargado con datos observados, hipótesis separadas y conversación pendiente.
- El panel diario muestra expedientes activos y conversaciones pendientes.
- El apartado familiar utiliza una identidad cromática distinta del contexto empresa.

## Despliegue recomendado

### Cloudflare Pages

Build command:

```bash
npm install --include=dev --registry=https://registry.npmjs.org/ --no-audit --no-fund && npm run build:public
```

Output directory:

```text
dist-public
```

Variable necesaria:

```text
VITE_API_BASE=https://os.metamorfosislab.cl
```

Dominio canónico: `https://metamorfosislab.cl`.

### Render

Build command:

```bash
npm install --include=dev --registry=https://registry.npmjs.org/ --no-audit --no-fund && npm run build:admin
```

Start command:

```bash
npm run start
```

Custom domain: `os.metamorfosislab.cl`.

Variables mínimas: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CONTACT_TO_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `PUBLIC_ORIGINS`, `PUBLIC_SITE_URL`, `NODE_VERSION=20.19.0`.

## DNS esperado

- `metamorfosislab.cl` → Cloudflare Pages.
- `os.metamorfosislab.cl` → servicio Render.
- `www.metamorfosislab.cl` no debe apuntar a Render; debe redirigir 301 al dominio raíz.

# Despliegue actual · Metamorfosis Lab 4.8

La arquitectura tiene dos superficies y un solo repositorio.

## 1. Web pública · Cloudflare Pages

Dominio: `https://metamorfosislab.cl`

Build command:

```bash
npm install --include=dev --registry=https://registry.npmjs.org/ --no-audit --no-fund && npm run build:public
```

Output directory: `dist-public`

Variable de compilación:

```text
VITE_API_BASE=https://os.metamorfosislab.cl
```

La web pública no debe enlazar al OS. La API se usa únicamente para formulario y telemetría funcional.

## 2. Metamorfosis OS + API · Render

Dominio personalizado: `https://os.metamorfosislab.cl`

Build command:

```bash
npm install --include=dev --registry=https://registry.npmjs.org/ --no-audit --no-fund && npm run build:admin
```

Start command:

```bash
npm run start
```

Render sirve exclusivamente `dist-admin` y `/api/*`. El hostname `*.onrender.com` se canonicaliza al dominio del OS y todo el servicio lleva `X-Robots-Tag: noindex`.

Variables:

```text
NODE_VERSION=20.19.0
DATABASE_URL=postgresql://...
SESSION_SECRET=...
ADMIN_EMAIL=contacto@metamorfosislab.cl
ADMIN_PASSWORD_HASH=...
CONTACT_TO_EMAIL=contacto@metamorfosislab.cl
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contacto@metamorfosislab.cl
SMTP_PASS=...
SMTP_FROM=contacto@metamorfosislab.cl
PUBLIC_ORIGINS=https://metamorfosislab.cl
PUBLIC_SITE_URL=https://metamorfosislab.cl
VITE_PUBLIC_SITE_URL=https://metamorfosislab.cl
```

## 3. DNS

Estado deseado:

```text
metamorfosislab.cl       -> Cloudflare Pages
os.metamorfosislab.cl    -> metamorfosislab.onrender.com
www.metamorfosislab.cl   -> redirección 301 a https://metamorfosislab.cl
```

`www.metamorfosislab.cl` no debe apuntar a Render. Aunque el backend 4.8 lo redirige defensivamente al sitio público, el DNS debe quedar limpio.

## 4. Verificación tras publicar

1. `https://metamorfosislab.cl` muestra solo web pública.
2. La navegación pública contiene Qué hacemos, Cómo trabajamos, Equipo y Contacto; no contiene OS ni Casos.
3. `https://os.metamorfosislab.cl` abre el panel privado.
4. La URL técnica de Render redirige al dominio del OS.
5. El botón Sitio público del OS abre `https://metamorfosislab.cl`.
6. El formulario público avanza solo con cada paso válido y confirma envío únicamente si el backend confirma correo.
7. `/api/health` informa `database: configured` y `smtp: configured`.

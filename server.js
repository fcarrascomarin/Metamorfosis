import 'dotenv/config';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import nodemailer from 'nodemailer';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 4173);
const isProduction = process.env.NODE_ENV === 'production';
function cleanEnv(value, max = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}
const hasDatabase = Boolean(process.env.DATABASE_URL);
const contactRecipient = cleanEnv(process.env.CONTACT_TO_EMAIL || 'contacto@metamorfosislab.cl', 180);
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const publicOrigins = new Set(
  String(process.env.PUBLIC_ORIGINS || '')
    .split(',')
    .map((value) => value.trim().replace(/\/$/, ''))
    .filter(Boolean)
);

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'sha256-GypvWo9kvH0GqwrdM6SQjd010VPtdbMjoBARL+kC7bA='"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null
    }
  },
  crossOriginResourcePolicy: { policy: 'same-site' },
  strictTransportSecurity: isProduction ? undefined : false
}));
app.use(compression());
app.use(express.json({ limit: '1.5mb' }));
app.use(express.urlencoded({ extended: false, limit: '250kb' }));

let pool = null;
if (hasDatabase) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    max: 8,
    idleTimeoutMillis: 30_000
  });
}

async function ensureSchema() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS metamorfosis_quotes (
      id UUID PRIMARY KEY,
      service_type TEXT NOT NULL,
      project_stage TEXT,
      desired_date TEXT,
      team_size TEXT,
      details TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      company TEXT,
      city TEXT,
      email TEXT,
      phone TEXT NOT NULL,
      preferred_contact TEXT,
      consent BOOLEAN NOT NULL DEFAULT TRUE,
      source TEXT DEFAULT 'web',
      status TEXT DEFAULT 'nueva',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query('ALTER TABLE metamorfosis_quotes ADD COLUMN IF NOT EXISTS consent BOOLEAN NOT NULL DEFAULT TRUE');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS metamorfosis_os_state (
      workspace_key TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_by TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

const PgSession = connectPgSimple(session);
const sessionSecret = process.env.SESSION_SECRET || (isProduction ? null : crypto.randomBytes(32).toString('hex'));
if (!sessionSecret) {
  throw new Error('SESSION_SECRET es obligatorio en producción.');
}

const sessionOptions = {
  name: 'metamorfosis.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8
  }
};

if (pool) {
  sessionOptions.store = new PgSession({
    pool,
    tableName: 'metamorfosis_sessions',
    createTableIfMissing: true
  });
} else if (isProduction) {
  throw new Error('DATABASE_URL es obligatorio en producción para evitar MemoryStore.');
}

app.use(session(sessionOptions));

app.use('/api', (req, res, next) => {
  const origin = req.get('origin');
  if (origin && publicOrigins.has(origin.replace(/\/$/, ''))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Demasiados intentos de acceso. Intenta más tarde.' }
});

function clean(value, max = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ').slice(0, max);
}

function createMailer() {
  if (!smtpConfigured) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
}

function quoteEmailText(quote) {
  return [
    'Nueva solicitud formal desde metamorfosislab.cl',
    '',
    `Servicio: ${quote.serviceType}`,
    `Organización: ${quote.company || 'No indicada'}`,
    `Nombre: ${quote.contactName}`,
    `Correo: ${quote.email}`,
    `Teléfono: ${quote.phone || 'No indicado'}`,
    `Canal preferido: ${quote.preferredContact || 'Correo'}`,
    '',
    'Necesidad principal:',
    quote.details,
    '',
    `ID interno: ${quote.id}`,
    `Fecha: ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}`
  ].join('\n');
}

async function sendQuoteEmail(quote) {
  const mailer = createMailer();
  if (!mailer) return false;
  const subject = `Nueva solicitud web · ${quote.company || quote.contactName}`;
  const text = quoteEmailText(quote);
  const html = text
    .split('\n')
    .map((line) => line ? `<p>${escapeHtml(line)}</p>` : '<br />')
    .join('');
  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: contactRecipient,
    replyTo: quote.email,
    subject,
    text,
    html
  });
  return true;
}

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ ok: false, message: 'Sesión no autorizada.' });
}

function requireSameOrigin(req, res, next) {
  const origin = req.get('origin');
  if (!origin) return next();
  try {
    const requestOrigin = new URL(origin);
    const host = req.get('host');
    if (requestOrigin.host === host) return next();
  } catch {
    // Continúa al rechazo uniforme.
  }
  return res.status(403).json({ ok: false, message: 'Origen de solicitud no autorizado.' });
}

async function establishSession(req, email, demo) {
  await new Promise((resolve, reject) => req.session.regenerate((error) => error ? reject(error) : resolve()));
  req.session.isAdmin = true;
  req.session.email = email;
  req.session.demo = demo;
  await new Promise((resolve, reject) => req.session.save((error) => error ? reject(error) : resolve()));
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: hasDatabase ? 'configured' : 'development-only' });
});

app.get('/api/session', (req, res) => {
  res.json({ ok: true, authenticated: Boolean(req.session?.isAdmin), email: req.session?.email || null, demo: Boolean(req.session?.demo) });
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const email = clean(req.body?.email, 160).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const demoEnabled = !isProduction && process.env.DEMO_ADMIN === 'true';

  if (demoEnabled && email && password) {
    await establishSession(req, email, true);
    return res.json({ ok: true, authenticated: true, email, demo: true });
  }

  const configuredEmail = clean(process.env.ADMIN_EMAIL || '', 160).toLowerCase();
  const configuredHash = process.env.ADMIN_PASSWORD_HASH || '';
  if (!configuredEmail || !configuredHash) {
    return res.status(503).json({ ok: false, message: 'El acceso administrativo aún no está configurado.' });
  }

  const emailMatches = crypto.timingSafeEqual(
    Buffer.from(email.padEnd(256).slice(0, 256)),
    Buffer.from(configuredEmail.padEnd(256).slice(0, 256))
  );
  const passwordMatches = await bcrypt.compare(password, configuredHash);
  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ ok: false, message: 'Credenciales incorrectas.' });
  }

  await establishSession(req, configuredEmail, false);
  return res.json({ ok: true, authenticated: true, email: configuredEmail, demo: false });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('metamorfosis.sid');
    res.json({ ok: true });
  });
});

app.post('/api/quotes', publicLimiter, async (req, res) => {
  const quote = {
    id: crypto.randomUUID(),
    serviceType: clean(req.body?.serviceType, 120),
    projectStage: clean(req.body?.projectStage, 120),
    desiredDate: clean(req.body?.desiredDate, 80),
    teamSize: clean(req.body?.teamSize, 80),
    details: clean(req.body?.details, 1800),
    contactName: clean(req.body?.contactName, 140),
    company: clean(req.body?.company, 160),
    city: clean(req.body?.city, 140),
    email: clean(req.body?.email, 180),
    phone: clean(req.body?.phone, 80),
    preferredContact: clean(req.body?.preferredContact, 60),
    consent: req.body?.consent === true,
    website: clean(req.body?.website, 200)
  };

  if (quote.website) {
    return res.status(201).json({ ok: true, saved: false, id: quote.id });
  }

  const phoneDigits = quote.phone.replace(/\D/g, '');
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email);
  const validPhone = !quote.phone || phoneDigits.length >= 8;
  if (!quote.serviceType || !quote.details || !quote.contactName || !quote.consent || !validEmail || !validPhone) {
    return res.status(400).json({ ok: false, message: 'Revisa los datos obligatorios, el correo y la autorización de contacto.' });
  }

  let emailSent = false;
  try {
    emailSent = await sendQuoteEmail(quote);
  } catch (error) {
    console.error('Error al enviar correo de solicitud:', error.message);
  }

  if (!pool) {
    return res.status(202).json({
      ok: true,
      saved: false,
      emailSent,
      id: quote.id,
      message: emailSent
        ? 'Solicitud enviada por correo. Conecta DATABASE_URL para persistencia compartida en Metamorfosis OS.'
        : 'Solicitud recibida por la API. Configura SMTP y DATABASE_URL para envío automático y persistencia compartida.'
    });
  }

  try {
    await pool.query(
      `INSERT INTO metamorfosis_quotes
      (id, service_type, project_stage, desired_date, team_size, details, contact_name, company, city, email, phone, preferred_contact, consent)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [quote.id, quote.serviceType, quote.projectStage, quote.desiredDate, quote.teamSize, quote.details, quote.contactName, quote.company, quote.city, quote.email, quote.phone, quote.preferredContact, quote.consent]
    );
    return res.status(201).json({ ok: true, saved: true, emailSent, id: quote.id });
  } catch (error) {
    console.error('Error al registrar cotización:', error.message);
    return res.status(500).json({ ok: false, message: 'No fue posible registrar la solicitud en este momento.' });
  }
});

app.get('/api/quotes', requireAdmin, async (_req, res) => {
  if (!pool) return res.json({ ok: true, quotes: [] });
  try {
    const result = await pool.query(`
      SELECT id, service_type, project_stage, desired_date, team_size, details,
             contact_name, company, city, email, phone, preferred_contact, status, created_at
      FROM metamorfosis_quotes
      ORDER BY created_at DESC
      LIMIT 100
    `);
    return res.json({ ok: true, quotes: result.rows });
  } catch (error) {
    console.error('Error al consultar cotizaciones:', error.message);
    return res.status(500).json({ ok: false, message: 'No fue posible cargar las cotizaciones.' });
  }
});

app.patch('/api/quotes/:id/status', requireAdmin, requireSameOrigin, async (req, res) => {
  if (!pool) return res.status(503).json({ ok: false, message: 'Base de datos no conectada.' });
  const id = clean(req.params.id, 80);
  const status = clean(req.body?.status, 40);
  const allowed = new Set(['nueva', 'contactada', 'evaluacion', 'propuesta', 'cerrada', 'descartada']);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || !allowed.has(status)) {
    return res.status(400).json({ ok: false, message: 'Solicitud o estado no válido.' });
  }
  try {
    const result = await pool.query('UPDATE metamorfosis_quotes SET status = $1 WHERE id = $2', [status, id]);
    if (result.rowCount === 0) return res.status(404).json({ ok: false, message: 'Solicitud no encontrada.' });
    return res.json({ ok: true });
  } catch (error) {
    console.error('Error al actualizar cotización:', error.message);
    return res.status(500).json({ ok: false, message: 'No fue posible actualizar el estado.' });
  }
});

app.get('/api/os-state', requireAdmin, async (_req, res) => {
  if (!pool) return res.json({ ok: true, state: null, saved: false });
  try {
    const result = await pool.query(
      'SELECT data, updated_at, updated_by FROM metamorfosis_os_state WHERE workspace_key = $1',
      ['principal']
    );
    const row = result.rows[0];
    return res.json({ ok: true, state: row?.data || null, updatedAt: row?.updated_at || null, updatedBy: row?.updated_by || null, saved: Boolean(row) });
  } catch (error) {
    console.error('Error al consultar Metamorfosis OS:', error.message);
    return res.status(500).json({ ok: false, message: 'No fue posible cargar el sistema operativo.' });
  }
});

app.put('/api/os-state', requireAdmin, requireSameOrigin, async (req, res) => {
  const state = req.body?.state;
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return res.status(400).json({ ok: false, message: 'El estado del sistema no es válido.' });
  }
  if (!Array.isArray(state.tasks) || !Array.isArray(state.fronts) || !Array.isArray(state.inbox) || !Array.isArray(state.decisions)) {
    return res.status(400).json({ ok: false, message: 'El respaldo no contiene la estructura mínima esperada.' });
  }
  if (state.tasks.length > 5000 || state.fronts.length > 500 || state.inbox.length > 1000 || state.decisions.length > 500) {
    return res.status(413).json({ ok: false, message: 'El respaldo supera los límites operativos permitidos.' });
  }
  const trackingProjects = Array.isArray(state.timeTracking?.projects) ? state.timeTracking.projects : [];
  const trackingEntries = Array.isArray(state.timeTracking?.entries) ? state.timeTracking.entries : [];
  if (trackingProjects.length > 500 || trackingEntries.length > 20_000) {
    return res.status(413).json({ ok: false, message: 'El registro de proyectos u horas supera los límites operativos permitidos.' });
  }
  const serialized = JSON.stringify(state);
  if (Buffer.byteLength(serialized, 'utf8') > 1_200_000) {
    return res.status(413).json({ ok: false, message: 'El respaldo es demasiado grande.' });
  }
  if (!pool) return res.status(202).json({ ok: true, saved: false, message: 'Borrador local: conecta DATABASE_URL para persistencia compartida.' });
  try {
    await pool.query(
      `INSERT INTO metamorfosis_os_state (workspace_key, data, updated_by, updated_at)
       VALUES ($1, $2::jsonb, $3, NOW())
       ON CONFLICT (workspace_key)
       DO UPDATE SET data = EXCLUDED.data, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
      ['principal', serialized, req.session.email || 'administración']
    );
    return res.json({ ok: true, saved: true });
  } catch (error) {
    console.error('Error al guardar Metamorfosis OS:', error.message);
    return res.status(500).json({ ok: false, message: 'No fue posible guardar el sistema operativo.' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, message: 'Endpoint no encontrado.' });
});

const publicDist = path.join(__dirname, 'dist-public');
const adminDist = path.join(__dirname, 'dist-admin');

app.use('/admin', (req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  next();
}, express.static(adminDist, {
  maxAge: isProduction ? '7d' : 0,
  index: false,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-store');
  }
}));

app.get('/admin*', (_req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(adminDist, 'admin.html'));
});

app.use(express.static(publicDist, {
  maxAge: isProduction ? '7d' : 0,
  index: false,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-store');
  }
}));

app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(publicDist, 'index.html'));
});

async function startServer() {
  if (pool) {
    await ensureSchema();
    pool.on('error', (error) => console.error('Error inesperado de PostgreSQL:', error.message));
  }
  const server = app.listen(port, () => {
    console.log(`Metamorfosis Lab disponible en http://localhost:${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      if (pool) await pool.end();
      process.exit(0);
    });
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

startServer().catch((error) => {
  console.error('No fue posible iniciar Metamorfosis Lab:', error.message);
  process.exit(1);
});

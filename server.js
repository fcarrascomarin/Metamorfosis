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

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 4173);
const isProduction = process.env.NODE_ENV === 'production';
const hasDatabase = Boolean(process.env.DATABASE_URL);

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
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
app.use(express.json({ limit: '250kb' }));
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
      source TEXT DEFAULT 'web',
      status TEXT DEFAULT 'nueva',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

if (pool) {
  ensureSchema().catch((error) => {
    console.error('No fue posible preparar la base de datos:', error.message);
  });
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

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ ok: false, message: 'Sesión no autorizada.' });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: hasDatabase ? 'configured' : 'development-only' });
});

app.get('/api/session', (req, res) => {
  res.json({ ok: true, authenticated: Boolean(req.session?.isAdmin), email: req.session?.email || null });
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const email = clean(req.body?.email, 160).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const demoEnabled = !isProduction && process.env.DEMO_ADMIN === 'true';

  if (demoEnabled && email && password) {
    req.session.isAdmin = true;
    req.session.email = email;
    return res.json({ ok: true, authenticated: true, demo: true });
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

  req.session.isAdmin = true;
  req.session.email = configuredEmail;
  return res.json({ ok: true, authenticated: true });
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
    preferredContact: clean(req.body?.preferredContact, 60)
  };

  if (!quote.serviceType || !quote.details || !quote.contactName || !quote.phone) {
    return res.status(400).json({ ok: false, message: 'Faltan datos obligatorios para registrar la solicitud.' });
  }

  if (!pool) {
    return res.status(202).json({
      ok: true,
      saved: false,
      id: quote.id,
      message: 'Solicitud preparada. La persistencia requiere conectar DATABASE_URL.'
    });
  }

  try {
    await pool.query(
      `INSERT INTO metamorfosis_quotes
      (id, service_type, project_stage, desired_date, team_size, details, contact_name, company, city, email, phone, preferred_contact)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [quote.id, quote.serviceType, quote.projectStage, quote.desiredDate, quote.teamSize, quote.details, quote.contactName, quote.company, quote.city, quote.email, quote.phone, quote.preferredContact]
    );
    return res.status(201).json({ ok: true, saved: true, id: quote.id });
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

app.patch('/api/quotes/:id/status', requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ ok: false, message: 'Base de datos no conectada.' });
  const id = clean(req.params.id, 80);
  const status = clean(req.body?.status, 40);
  const allowed = new Set(['nueva', 'contactada', 'evaluacion', 'propuesta', 'cerrada', 'descartada']);
  if (!allowed.has(status)) return res.status(400).json({ ok: false, message: 'Estado no válido.' });
  await pool.query('UPDATE metamorfosis_quotes SET status = $1 WHERE id = $2', [status, id]);
  res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: isProduction ? '7d' : 0,
  setHeaders(res, filePath) {
    if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-store');
  }
}));

app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Metamorfosis Lab disponible en http://localhost:${port}`);
});

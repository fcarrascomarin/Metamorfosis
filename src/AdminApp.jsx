import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './components/Icon.jsx';
import { initialProjects, repositoryTemplates } from './data.js';
import { createDefaultOsState, OS_SCHEMA_VERSION, OWNERS, TOPICS } from './osSeed.js';
import { CONSULTING_TOOLS, EXPEDIENTE_STATUSES, createEmptyExpediente, expedienteProgress } from './consultingTools.js';

const STORAGE_KEY = 'metamorfosis-os-draft-v10';
const LEGACY_STORAGE_KEYS = ['metamorfosis-os-draft-v9', 'metamorfosis-os-draft-v8', 'metamorfosis-os-draft-v7', 'metamorfosis-os-draft-v6'];
const PUBLIC_QUOTES_KEY = 'metamorfosis-public-quotes';
const PUBLIC_EVENTS_KEY = 'metamorfosis-public-events';
const PUBLIC_SITE_URL = String(import.meta.env.VITE_PUBLIC_SITE_URL || 'https://metamorfosislab.cl').replace(/\/$/, '');
const STATUS_OPTIONS = ['nueva', 'contactada', 'evaluacion', 'propuesta', 'cerrada', 'descartada'];

const BUSINESS_MENU_GROUPS = [
  {
    id: 'operacion',
    label: 'Operación',
    items: [
      ['dashboard', 'Inicio', 'dashboard'],
      ['month', 'Agenda', 'calendar_month']
    ]
  },
  {
    id: 'comercial',
    label: 'Comercial',
    items: [
      ['field', 'Campo comercial', 'map'],
      ['expedientes', 'Expedientes', 'folder_open'],
      ['quotes', 'Oportunidades', 'request_quote']
    ]
  },
  {
    id: 'gestion',
    label: 'Gestión',
    items: [
      ['finance', 'Finanzas', 'payments'],
      ['metrics', 'Tiempo y rentabilidad', 'query_stats'],
      ['documents', 'Repositorio', 'folder_open'],
      ['fronts', 'Criterios', 'gavel']
    ]
  }
];

const FAMILY_MENU_GROUPS = [
  {
    id: 'familia',
    label: 'Vida familiar',
    items: [
      ['family-overview', 'Hoy', 'home'],
      ['family-week', 'Semana', 'calendar_month'],
      ['family-money', 'Caja familiar', 'savings'],
      ['family-home', 'Hogar y compras', 'construction']
    ]
  }
];

const FAMILY_KEYS = new Set(FAMILY_MENU_GROUPS.flatMap((group) => group.items.map(([key]) => key)));
const BUSINESS_KEYS = new Set([...BUSINESS_MENU_GROUPS.flatMap((group) => group.items.map(([key]) => key)), 'day']);
const ALL_ADMIN_KEYS = new Set([...BUSINESS_KEYS, ...FAMILY_KEYS]);
const LEGACY_VIEW_MAP = { family: 'family-overview', tools: 'expedientes' };


async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin', ...options, signal: controller.signal });
    const payload = await response.json().catch(() => ({}));
    return { response, payload };
  } finally {
    window.clearTimeout(timer);
  }
}


function Brand({ compact = false, mode = 'business' }) {
  if (mode === 'family') {
    return (
      <div className={`admin-brand admin-brand--family ${compact ? 'admin-brand--compact' : ''}`} aria-label="Sistema familiar">
        <img src="/familia-metamorfosis.webp" alt="Ilustración familiar" width="64" height="44" />
        <span><strong>Panel familiar</strong><small>Organización · caja · hogar</small></span>
      </div>
    );
  }
  return (
    <a className={`admin-brand ${compact ? 'admin-brand--compact' : ''}`} href={PUBLIC_SITE_URL} aria-label="Metamorfosis Lab, ir al sitio público">
      <img src="/logo-metamorfosis-transparente.png" alt="" width="46" height="46" />
      <span><strong>Metamorfosis OS</strong><small>Operación · comercial · gestión</small></span>
    </a>
  );
}

function WorkspaceSwitch({ mode }) {
  const remember = (view) => {
    try { window.localStorage.setItem('metamorfosis-admin-view', view); } catch { /* navegación igualmente funciona */ }
  };
  return (
    <div className="workspace-switch" role="tablist" aria-label="Cambiar área del sistema">
      <a href="/?workspace=business#dashboard" role="tab" aria-selected={mode === 'business'} className={mode === 'business' ? 'is-active' : ''} onClick={() => remember('dashboard')}><Icon name="briefcase" /><span>Empresa</span></a>
      <a href="/?workspace=family#family-overview" role="tab" aria-selected={mode === 'family'} className={mode === 'family' ? 'is-active' : ''} onClick={() => remember('family-overview')}><Icon name="home" /><span>Familiar</span></a>
    </div>
  );
}

function IconButton({ icon, label, onClick, className = '', type = 'button', disabled = false }) {
  return <button type={type} className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick} disabled={disabled}><Icon name={icon} /></button>;
}

function formatDate(value, options = {}) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric', ...options }).format(date);
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(value || 0));
}


const LEGACY_SEED_TASK_TITLES = new Set([
  'Revisar estado comercial y próximos contactos',
  'Cerrar una mejora del sistema Metamorfosis OS',
  'Revisar próximo hito de Consolidación CM',
  'Cierre semanal del sistema',
  'Construir y puntuar el universo de prospectos del Biobío',
  'Seleccionar 5 prospectos definitivos y 2 suplentes',
  'Completar expediente preliminar de ClubVegan',
  'Completar fichas previas de los otros 4 prospectos',
  'Diseñar las 5 ofertas específicas',
  'Cerrar alcance, precio y canal de cada propuesta',
  'Enviar las 5 ofertas al mercado',
  'Registrar contactos y próximos seguimientos',
  'Leer respuestas, silencios y objeciones',
  'Cerrar aprendizaje comercial de la semana',
  'Revisar estado Club Vegan sin intervenir de más',
  'Ventana tentativa · conversación con Víctor Erices',
  'Ventana tentativa · conversación con Jorge Beltrán',
  'Ventana tentativa · conversación con Cristian Méndez',
  'Sintetizar inteligencia de las primeras conversaciones',
  'Preparar discovery de Maquisant',
  'Activar introducción con Víctor Santander · Maquisant',
  'Ventana tentativa · discovery Maquisant',
  'Decidir siguiente paso Maquisant',
  'Preparar conversación Transmarin',
  'Ventana tentativa · discovery Transmarin',
  'Evaluar oportunidades con criterio identitario y económico',
  'Presentar diagnóstico al prospecto habilitado',
  'Revisión comercial semanal',
  'Mensaje enviado · Víctor Erices / RUDEL',
  'Mensaje enviado · Jorge Beltrán / CMPC',
  'Mensaje enviado · Cristian Méndez / Blumar',
  'Abrir septiembre con agenda real',
  'Completar contraparte de reuniones 04/09 y 11/09',
  'Reunión confirmada · abogada Sercotec',
  'Reunión informativa Metamorfosis · confirmada 1',
  'Sintetizar inteligencia de mercado',
  'Decidir si Maquisant pasa a discovery',
  'Preparar siguiente discovery comercial',
  'Revisión comercial de mitad de mes',
  'Diseñar diagnóstico pagado solo si existe permiso',
  'Jornada comercial concentrada · prospección selectiva',
  'Convertir prospección en decisiones',
  'Preparar ficha de la reunión del 04/09',
  'Ajuste mínimo para la reunión del 04/09',
  'Reunión informativa Metamorfosis · confirmada',
  'Debrief inmediato de la reunión'
]);
const LEGACY_FRONT_NAMES = new Set(['Validación comercial · 5 prospectos', 'Ordenamiento y trazabilidad operacional', 'Ciclo Seguro']);
const LEGACY_DECISION_PATTERN = /24 al 28 de agosto|5 prospectos|cinco prospectos|cinco ofertas|5 ofertas/i;
const RETIRED_PROJECT_PATTERN = /CM|Banquetería|Consolidación/i;
const RETIRED_TIME_PROJECT_PATTERN = /CM|Banquetería|Consolidación|Juana de Arco|Experiencias/i;

function migrateOsState(candidate, fallback) {
  if (!candidate || typeof candidate !== 'object') return fallback;
  if (String(candidate.version || '') === OS_SCHEMA_VERSION) return candidate;

  const campaignTasks = fallback.tasks || [];
  const existingTasks = Array.isArray(candidate.tasks)
    ? candidate.tasks.filter((task) => !LEGACY_SEED_TASK_TITLES.has(task?.title) && !RETIRED_PROJECT_PATTERN.test(`${task?.title || ''} ${task?.topic || ''}`))
    : [];
  const existingTitles = new Set(existingTasks.map((task) => task?.title));
  const tasks = [...existingTasks, ...campaignTasks.filter((task) => !existingTitles.has(task.title))];

  const currentTracking = candidate.timeTracking || {};
  const candidateTimeProjects = Array.isArray(currentTracking.projects)
    ? currentTracking.projects.filter((project) => !RETIRED_TIME_PROJECT_PATTERN.test(`${project?.name || ''} ${project?.client || ''}`))
    : [];
  const timeProjects = [...candidateTimeProjects];
  fallback.timeTracking.projects.forEach((project) => {
    if (!timeProjects.some((item) => item.name === project.name)) timeProjects.push(project);
  });
  const projectIds = new Set(timeProjects.map((project) => project.id));
  const candidateEntries = Array.isArray(currentTracking.entries)
    ? currentTracking.entries.filter((entry) => projectIds.has(entry.projectId))
    : [];
  const historicalNotes = new Set(candidateEntries.map((entry) => entry.note));
  const timeEntries = [...candidateEntries, ...fallback.timeTracking.entries.filter((entry) => !historicalNotes.has(entry.note))];

  const family = candidate.family && typeof candidate.family === 'object' ? candidate.family : {};
  const workFronts = (Array.isArray(family.workFronts) ? family.workFronts : fallback.family.workFronts)
    .filter((front) => !RETIRED_PROJECT_PATTERN.test(front?.name || ''));
  const inventory = (Array.isArray(family.inventory) ? family.inventory : fallback.family.inventory)
    .filter((item) => !RETIRED_PROJECT_PATTERN.test(item?.title || ''));
  const weeklyActions = (Array.isArray(family.weeklyActions) ? family.weeklyActions : fallback.family.weeklyActions)
    .filter((item) => !RETIRED_PROJECT_PATTERN.test(item?.title || ''));

  const candidateFronts = (Array.isArray(candidate.fronts) ? candidate.fronts : [])
    .filter((front) => !RETIRED_PROJECT_PATTERN.test(front?.name || '') && !LEGACY_FRONT_NAMES.has(front?.name));
  const frontsByName = new Map([...fallback.fronts, ...candidateFronts].map((front) => [front.name, front]));
  // Los estados comerciales de campaña cambian rápido: el seed vigente manda sobre versiones guardadas del mismo frente.
  fallback.fronts.forEach((front) => {
    if (/Club Vegan|Validación industrial|Maquisant|Transmarin/i.test(front.name || '')) frontsByName.set(front.name, front);
  });
  const decisions = (Array.isArray(candidate.decisions) ? candidate.decisions : fallback.decisions)
    .filter((decision) => !RETIRED_PROJECT_PATTERN.test(decision || '') && !LEGACY_DECISION_PATTERN.test(decision || ''));
  const candidateField = Array.isArray(candidate.fieldRegister) ? candidate.fieldRegister.filter((item) => item?.id !== 'CAMPO-008') : [];
  const fieldById = new Map([...fallback.fieldRegister, ...candidateField].map((item) => [item.id || `${item.actor}-${item.organization}`, item]));
  const fallbackClubField = fallback.fieldRegister.find((item) => item.id === 'CAMPO-010');
  if (fallbackClubField) fieldById.set('CAMPO-010', fallbackClubField);
  const candidateExpedientes = Array.isArray(candidate.expedientes) ? candidate.expedientes : [];
  const fallbackClub = fallback.expedientes.find((item) => item.id === 'EXP-001');
  const expedientes = candidateExpedientes.length ? candidateExpedientes.map((item) => {
    if (item.id !== 'EXP-001' || !fallbackClub) return item;
    return {
      ...item,
      status: fallbackClub.status,
      lastUpdate: fallbackClub.lastUpdate,
      notes: fallbackClub.notes,
      tools: {
        ...item.tools,
        oportunidad: {
          ...(item.tools?.oportunidad || fallbackClub.tools.oportunidad),
          data: { ...(item.tools?.oportunidad?.data || {}), ...fallbackClub.tools.oportunidad.data }
        },
        perfil: { ...fallbackClub.tools.perfil, ...(item.tools?.perfil || {}) },
        conversacion: fallbackClub.tools.conversacion
      }
    };
  }) : fallback.expedientes;
  const trackingNote = currentTracking.note && currentTracking.note !== fallback.timeTracking.note
    ? `${fallback.timeTracking.note}\n\nNota previa: ${currentTracking.note}`
    : fallback.timeTracking.note;

  return {
    ...candidate,
    version: OS_SCHEMA_VERSION,
    selectedDate: candidate.selectedDate && candidate.selectedDate >= '2026-08-31' ? candidate.selectedDate : '2026-08-31',
    tasks,
    guides: { ...(candidate.guides || {}), ...fallback.guides },
    fronts: [...frontsByName.values()],
    decisions: [...fallback.decisions, ...decisions.filter((decision) => !fallback.decisions.includes(decision))],
    fieldRegister: [...fieldById.values()],
    expedientes,
    repository: {
      ...fallback.repository,
      ...(candidate.repository || {}),
      documentsByExpediente: {
        ...(fallback.repository?.documentsByExpediente || {}),
        ...(candidate.repository?.documentsByExpediente || {}),
        'EXP-001': {
          ...(candidate.repository?.documentsByExpediente?.['EXP-001'] || {}),
          ...(fallback.repository?.documentsByExpediente?.['EXP-001'] || {})
        }
      }
    },
    timeTracking: { ...fallback.timeTracking, ...currentTracking, note: trackingNote, projects: timeProjects, entries: timeEntries },
    family: {
      ...fallback.family,
      ...family,
      weekLabel: fallback.family.weekLabel,
      weeklyActions,
      workFronts,
      inventory
    }
  };
}


function safeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') return safeText(value.title ?? value.name ?? value.text ?? value.label, fallback);
  return fallback;
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeFamilyState(rawFamily, fallbackFamily) {
  const family = safeObject(rawFamily);
  const cycle = { ...fallbackFamily.cycle, ...safeObject(family.cycle) };
  const homeRaw = safeObject(family.home);
  return {
    ...fallbackFamily,
    ...family,
    phase: safeText(family.phase, fallbackFamily.phase),
    phaseNote: safeText(family.phaseNote, fallbackFamily.phaseNote),
    weekLabel: safeText(family.weekLabel, fallbackFamily.weekLabel),
    wellbeing: (Array.isArray(family.wellbeing) ? family.wellbeing : fallbackFamily.wellbeing).map((raw) => {
      const item = safeObject(raw);
      return {
        ...item,
        id: safeText(item.id) || crypto.randomUUID(),
        name: safeText(item.name, 'Persona'),
        area: safeText(item.area),
        status: safeText(item.status, 'Bien'),
        load: safeText(item.load, 'Media'),
        note: safeText(item.note)
      };
    }),
    weeklyActions: (Array.isArray(family.weeklyActions) ? family.weeklyActions : fallbackFamily.weeklyActions).map((raw) => {
      const item = safeObject(raw);
      return {
        ...item,
        id: safeText(item.id) || crypto.randomUUID(),
        owner: safeText(item.owner, 'Compartido'),
        title: safeText(item.title, 'Acción pendiente'),
        load: safeText(item.load, 'Media'),
        status: safeText(item.status, 'pending')
      };
    }),
    workFronts: (Array.isArray(family.workFronts) ? family.workFronts : fallbackFamily.workFronts).map((raw) => {
      const item = safeObject(raw);
      return {
        ...item,
        id: safeText(item.id) || crypto.randomUUID(),
        name: safeText(item.name, 'Frente familiar'),
        leader: safeText(item.leader),
        state: safeText(item.state, 'Activo'),
        next: safeText(item.next),
        limit: safeText(item.limit)
      };
    }),
    cycle: {
      ...cycle,
      name: safeText(cycle.name, fallbackFamily.cycle.name),
      startDate: safeText(cycle.startDate),
      endDate: safeText(cycle.endDate),
      nextIncomeLabel: safeText(cycle.nextIncomeLabel),
      nextIncomeDate: safeText(cycle.nextIncomeDate),
      nextIncomeStatus: safeText(cycle.nextIncomeStatus, fallbackFamily.cycle.nextIncomeStatus),
      notes: safeText(cycle.notes)
    },
    home: {
      ...fallbackFamily.home,
      ...homeRaw,
      phase: safeText(homeRaw.phase, fallbackFamily.home.phase),
      intervention: safeText(homeRaw.intervention, fallbackFamily.home.intervention),
      rule: safeText(homeRaw.rule, fallbackFamily.home.rule),
      checklist: (Array.isArray(homeRaw.checklist) ? homeRaw.checklist : fallbackFamily.home.checklist).map((raw) => {
        const item = safeObject(raw);
        return {
          ...item,
          id: safeText(item.id) || crypto.randomUUID(),
          title: safeText(item.title, 'Pendiente del hogar'),
          status: safeText(item.status, 'pending')
        };
      })
    },
    shortTermNeeds: (Array.isArray(family.shortTermNeeds) ? family.shortTermNeeds : fallbackFamily.shortTermNeeds || []).map((raw) => {
      const item = safeObject(raw);
      return { ...item, id: safeText(item.id) || crypto.randomUUID(), title: safeText(item.title, 'Necesario') };
    }),
    groceryList: (Array.isArray(family.groceryList) ? family.groceryList : fallbackFamily.groceryList || []).map((raw) => {
      const item = safeObject(raw);
      return { ...item, id: safeText(item.id) || crypto.randomUUID(), title: safeText(item.title, 'Producto') };
    }),
    inventory: (Array.isArray(family.inventory) ? family.inventory : fallbackFamily.inventory).map((raw) => {
      const item = safeObject(raw);
      return {
        ...item,
        id: safeText(item.id) || crypto.randomUUID(),
        title: safeText(item.title, 'Elemento familiar'),
        area: safeText(item.area, 'Familia'),
        status: safeText(item.status, 'Próximo')
      };
    }),
    exclusions: (Array.isArray(family.exclusions) ? family.exclusions : fallbackFamily.exclusions)
      .map((item) => safeText(item))
      .filter(Boolean)
  };
}

function hydrateState(candidate) {
  const fallback = createDefaultOsState();
  const migrated = migrateOsState(candidate, fallback);
  if (!migrated || typeof migrated !== 'object') return fallback;
  candidate = migrated;
  const normalizeId = (item) => ({ ...item, id: item?.id || crypto.randomUUID() });
  return {
    ...fallback,
    ...candidate,
    tasks: (Array.isArray(candidate.tasks) ? candidate.tasks : fallback.tasks).map(normalizeId),
    guides: candidate.guides && typeof candidate.guides === 'object' ? candidate.guides : fallback.guides,
    finance: { ...fallback.finance, ...(candidate.finance || {}) },
    timeTracking: {
      ...fallback.timeTracking,
      ...(candidate.timeTracking || {}),
      rates: { ...fallback.timeTracking.rates, ...(candidate.timeTracking?.rates || {}) },
      projects: (Array.isArray(candidate.timeTracking?.projects) ? candidate.timeTracking.projects : fallback.timeTracking.projects).map(normalizeId),
      entries: (Array.isArray(candidate.timeTracking?.entries) ? candidate.timeTracking.entries : fallback.timeTracking.entries).map(normalizeId)
    },
    fronts: (Array.isArray(candidate.fronts) ? candidate.fronts : fallback.fronts).map(normalizeId),
    decisions: (Array.isArray(candidate.decisions) ? candidate.decisions : fallback.decisions).map((item) => safeText(item)).filter(Boolean),
    inbox: (Array.isArray(candidate.inbox) ? candidate.inbox : fallback.inbox).map(normalizeId),
    fieldRegister: (Array.isArray(candidate.fieldRegister) ? candidate.fieldRegister : fallback.fieldRegister).map(normalizeId),
    expedientes: Array.isArray(candidate.expedientes) ? candidate.expedientes : fallback.expedientes,
    repository: {
      ...fallback.repository,
      ...(candidate.repository || {}),
      documentsByExpediente: {
        ...(fallback.repository?.documentsByExpediente || {}),
        ...(candidate.repository?.documentsByExpediente || {}),
        'EXP-001': {
          ...(candidate.repository?.documentsByExpediente?.['EXP-001'] || {}),
          ...(fallback.repository?.documentsByExpediente?.['EXP-001'] || {})
        }
      }
    },
    family: normalizeFamilyState(candidate.family, fallback.family)
  };
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '' });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '' });
    try {
      const { response, payload } = await fetchJsonWithTimeout('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }, 18000);
      if (!response.ok) throw new Error(payload.message || 'No fue posible ingresar.');
      onLogin(payload);
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  return (
    <div className="admin-login">
      <a className="skip-link" href="#login-form">Saltar al formulario</a>
      <div className="admin-login__card">
        <Brand />
        <div className="admin-login__heading"><span className="kicker">Acceso privado</span><h1>Administración</h1><p>Proyectos, oportunidades, vida familiar, documentos y seguimiento interno.</p></div>
        <form id="login-form" onSubmit={submit}>
          <label>Correo institucional<input type="email" autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Contraseña<input type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          {status.message && <p className="admin-notice admin-notice--error" role="alert">{status.message}</p>}
          <button className="button button--full" type="submit" disabled={status.loading}><Icon name="login" /> {status.loading ? 'Ingresando…' : 'Ingresar'}</button>
        </form>
        <a className="admin-login__back" href={PUBLIC_SITE_URL}><Icon name="arrow_back" /> Volver al sitio público</a>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, note, tone = '' }) {
  return <article className={`metric-card ${tone ? `metric-card--${tone}` : ''}`}><span className="metric-card__icon"><Icon name={icon} /></span><div><small>{label}</small><strong>{value}</strong>{note && <span>{note}</span>}</div></article>;
}

function ViewHeading({ kicker, title, description, action }) {
  return <div className="admin-view__heading"><div><span className="kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function DashboardView({ osState, dirty, onNavigate, onAddTask }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = osState.tasks
    .filter((task) => task.date === today && task.status !== 'done')
    .sort((a, b) => String(a.start).localeCompare(String(b.start)));
  const nextTask = osState.tasks
    .filter((task) => task.status !== 'done' && task.date >= today)
    .sort((a, b) => `${a.date}-${a.start || ''}`.localeCompare(`${b.date}-${b.start || ''}`))[0];
  const commercialSignal = osState.fieldRegister
    .filter((item) => !/cerrado|descartado|fuera/i.test(`${item.status || ''} ${item.priority || ''}`))
    .sort((a, b) => String(a.priority).localeCompare(String(b.priority)))[0];

  return (
    <div className="admin-view admin-view--dashboard-summary">
      <ViewHeading
        kicker="Resumen"
        title="Lo importante ahora"
        description="Inicio muestra solo el estado necesario para orientarse. El detalle vive en Agenda, Campo comercial y las demás herramientas."
        action={<button type="button" className="button button--small" onClick={() => onAddTask({ date: today })}><Icon name="add" /> Nueva tarea</button>}
      />

      <div className="dashboard-summary-actions" aria-label="Accesos principales">
        <button type="button" onClick={() => onNavigate('day')}><Icon name="today" /><span><strong>Hoy</strong><small>{todayTasks.length ? `${todayTasks.length} pendiente${todayTasks.length === 1 ? '' : 's'}` : 'Sin pendientes'}</small></span></button>
        <button type="button" onClick={() => onNavigate('month')}><Icon name="calendar_month" /><span><strong>Agenda</strong><small>Disponibilidad compartida</small></span></button>
        <button type="button" onClick={() => onNavigate('field')}><Icon name="map" /><span><strong>Campo comercial</strong><small>Actores y próximos pasos</small></span></button>
        <button type="button" onClick={() => onNavigate('metrics')}><Icon name="query_stats" /><span><strong>Tiempo</strong><small>Horas y rentabilidad</small></span></button>
      </div>

      <div className="dashboard-summary-grid">
        <section className="panel-card panel-card--wide dashboard-today-card">
          <div className="panel-card__heading"><div><span className="kicker">Hoy</span><h2>{todayTasks.length ? 'Qué requiere atención' : 'Día despejado'}</h2></div><button type="button" className="text-button" onClick={() => onNavigate('day')}>Abrir día</button></div>
          {todayTasks.length ? <div className="compact-task-list">{todayTasks.slice(0, 3).map((task) => <div className="compact-task" key={task.id}><span>{task.start || '—'}</span><div><strong>{task.title}</strong><small>{task.owner} · {task.topic}</small></div></div>)}</div> : <div className="empty-inline"><Icon name="check_circle" /><span>No hay pendientes cargados para hoy.</span></div>}
          {todayTasks.length > 3 && <button type="button" className="text-button dashboard-more-link" onClick={() => onNavigate('day')}>+{todayTasks.length - 3} más</button>}
        </section>

        <section className="panel-card dashboard-next-card">
          <div className="panel-card__heading"><div><span className="kicker">Próximo hito</span><h2>{nextTask ? formatDate(nextTask.date, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Sin hitos'}</h2></div><Icon name={nextTask ? agendaTaskIcon(nextTask) : 'event_available'} /></div>
          {nextTask ? <><strong className="dashboard-next-title">{nextTask.title}</strong><p>{nextTask.start && nextTask.start !== '—' ? `${nextTask.start}${nextTask.end ? `–${nextTask.end}` : ''} · ` : ''}{nextTask.owner}</p><button type="button" className="text-button" onClick={() => { setTimeout(() => onNavigate('month'), 0); }}>Ver agenda</button></> : <p>No hay próximos hitos registrados.</p>}
        </section>

        <section className="panel-card dashboard-signal-card">
          <div className="panel-card__heading"><div><span className="kicker">Señal comercial</span><h2>{commercialSignal?.organization || 'Sin señal prioritaria'}</h2></div><Icon name="insights" /></div>
          {commercialSignal ? <><strong>{commercialSignal.actor}</strong><p>{commercialSignal.nextAction}</p><button type="button" className="text-button" onClick={() => onNavigate('field')}>Abrir campo</button></> : <p>Campo comercial sin actores activos.</p>}
        </section>
      </div>

      <div className={`dashboard-save-state ${dirty ? 'is-dirty' : ''}`}><Icon name={dirty ? 'warning' : 'save'} /><span>{dirty ? 'Hay cambios sin guardar.' : 'OS guardado.'}</span></div>
    </div>
  );
}

function getMonthDays(cursor) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1, 12);
  const last = new Date(year, month + 1, 0, 12);
  const mondayIndex = (first.getDay() + 6) % 7;
  const days = [];
  for (let offset = -mondayIndex; offset < last.getDate() + (7 - ((mondayIndex + last.getDate()) % 7)) % 7; offset += 1) {
    const date = new Date(year, month, 1 + offset, 12);
    days.push({ iso: date.toISOString().slice(0, 10), day: date.getDate(), current: date.getMonth() === month });
  }
  return days;
}

function agendaTaskIcon(task) {
  const topic = String(task.topic || '').toLowerCase();
  const title = String(task.title || '').toLowerCase();
  if (topic.includes('agenda personal')) {
    if (/seminario|foro|barrios|pasant[ií]a|paz|jean monnet|basura cero/.test(title)) return 'school';
    if (/feriado/.test(title)) return 'weekend';
    return 'event';
  }
  if (task.confirmed) return 'event_available';
  if (topic.includes('famil')) return 'home';
  if (topic.includes('sercotec') || topic.includes('postul')) return 'request_quote';
  if (topic.includes('comercial') || topic.includes('metamorfosis')) return 'briefcase';
  return 'calendar_month';
}

function MonthView({ osState, setOsState, onNavigate, onAddTask }) {
  const selected = new Date(`${osState.selectedDate}T12:00:00`);
  const [cursor, setCursor] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1, 12));
  const days = useMemo(() => getMonthDays(cursor), [cursor]);
  const title = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(cursor);
  const tasksByDate = useMemo(() => osState.tasks.reduce((acc, task) => { (acc[task.date] ||= []).push(task); return acc; }, {}), [osState.tasks]);
  const selectDate = (iso) => setOsState((current) => ({ ...current, selectedDate: iso }));
  const move = (delta) => setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1, 12));
  const selectedTasks = useMemo(() => (tasksByDate[osState.selectedDate] || []).slice().sort((a, b) => String(a.start).localeCompare(String(b.start))), [tasksByDate, osState.selectedDate]);

  return (
    <div className="admin-view">
      <ViewHeading kicker="Sistema operativo" title="Vista mensual" description="Un calendario único para saber quién hace qué, cuándo y con qué criterio de cierre." action={<button type="button" className="button button--small" onClick={() => onAddTask({ date: osState.selectedDate })}><Icon name="add" /> Agregar tarea</button>} />
      <section className="panel-card calendar-panel">
        <div className="calendar-toolbar"><div><IconButton icon="chevron_left" label="Mes anterior" onClick={() => move(-1)} /><button type="button" className="calendar-title" onClick={() => setCursor(new Date())}>{title}</button><IconButton icon="chevron_right" label="Mes siguiente" onClick={() => move(1)} /></div><button type="button" className="button button--ghost button--small" onClick={() => onNavigate('day')}><Icon name="today" /> Ver día seleccionado</button></div>

        <div className="calendar-desktop-view">
          <div className="calendar-weekdays" aria-hidden="true">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="month-grid">
            {days.map((day) => {
              const tasks = (tasksByDate[day.iso] || []).sort((a, b) => String(a.start).localeCompare(String(b.start)));
              return <button type="button" key={day.iso} className={`month-day ${!day.current ? 'is-outside' : ''} ${day.iso === osState.selectedDate ? 'is-selected' : ''}`} onClick={() => selectDate(day.iso)} aria-label={`${formatDate(day.iso)}; ${tasks.length} tareas`}><span className="month-day__number">{day.day}</span>{osState.guides[day.iso]?.name && <small className="month-day__guide">{osState.guides[day.iso].name}</small>}<div>{tasks.slice(0, 4).map((task) => <span key={task.id} className={`mini-task mini-task--${task.status} ${task.confirmed ? 'is-confirmed' : ''} ${task.topic === 'Agenda personal' ? 'is-personal' : ''}`}><b>{task.start}</b> {task.title}</span>)}{tasks.length > 4 && <span className="mini-task mini-task--more">+{tasks.length - 4} más</span>}</div></button>;
            })}
          </div>
        </div>

        <div className="calendar-mobile-view">
          <div className="calendar-mobile-weekdays" aria-hidden="true">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
          <div className="calendar-mobile-grid" role="grid" aria-label={`Calendario de ${title}`}>
            {days.map((day) => {
              const tasks = tasksByDate[day.iso] || [];
              const pending = tasks.filter((task) => task.status !== 'done').length;
              return (
                <button
                  type="button"
                  key={day.iso}
                  className={`calendar-mobile-day ${!day.current ? 'is-outside' : ''} ${day.iso === osState.selectedDate ? 'is-selected' : ''}`}
                  onClick={() => selectDate(day.iso)}
                  aria-label={`${formatDate(day.iso)}; ${tasks.length} tareas`}
                  aria-pressed={day.iso === osState.selectedDate}
                >
                  <span>{day.day}</span>
                  {tasks.length > 0 && <small className={pending ? 'has-pending' : 'is-complete'}>{tasks.length}</small>}
                </button>
              );
            })}
          </div>

          <div className="calendar-mobile-detail" aria-live="polite">
            <div className="calendar-mobile-detail__heading">
              <div><span className="kicker">Día seleccionado</span><h2>{formatDate(osState.selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })}</h2></div>
              <button type="button" className="icon-button calendar-mobile-detail__open" onClick={() => onNavigate('day')} aria-label="Abrir detalle del día"><Icon name="arrow_forward" /></button>
            </div>
            <div className="calendar-mobile-agenda">
              {selectedTasks.length ? selectedTasks.map((task) => (
                <button type="button" key={task.id} className={`calendar-mobile-task ${task.status === 'done' ? 'is-done' : ''} ${task.topic === 'Agenda personal' ? 'is-personal' : ''}`} onClick={() => onNavigate('day')}>
                  <span className="calendar-mobile-task__icon"><Icon name={agendaTaskIcon(task)} /></span>
                  <span className="calendar-mobile-task__time">{task.start || '—'}</span>
                  <span className="calendar-mobile-task__copy"><strong>{task.title}</strong><small>{task.owner} · {task.topic}{task.confirmed ? ' · Confirmada' : ''}</small></span>
                  <Icon name="chevron_right" className="calendar-mobile-task__arrow" />
                </button>
              )) : <div className="calendar-mobile-empty"><span><Icon name="check_circle" /></span><div><strong>Día despejado</strong><small>No hay tareas registradas para esta fecha.</small></div></div>}
            </div>
            <button type="button" className="button button--small calendar-mobile-add" onClick={() => onAddTask({ date: osState.selectedDate })}><Icon name="add" /> Agregar en este día</button>
          </div>
        </div>
        <div className="calendar-availability-strip">
          <div><Icon name="groups" /><span><strong>Disponibilidad compartida</strong><small>Francisca: jornada completa en Metamorfosis durante septiembre. Benjamín: 2,5–4 h diarias, máximo 18 h/semana.</small></span></div>
          <div><Icon name="event_busy" /><span><strong>{selectedTasks.filter((task) => task.topic === 'Agenda personal').length} compromiso(s) externo(s) este día</strong><small>Los eventos personales y seminarios se muestran aquí para evitar sobreposiciones. Horarios sin confirmar no bloquean una franja exacta.</small></span></div>
        </div>
      </section>
      <GuideCard osState={osState} />
    </div>
  );
}

function GuideCard({ osState }) {
  const guide = osState.guides[osState.selectedDate] || { name: 'Día disponible', why: 'Define un resultado principal antes de distribuir tareas.', limit: 'No llenar el día sin un criterio explícito de cierre.' };
  return <section className="guide-card"><div><span className="kicker">{formatDate(osState.selectedDate, { weekday: 'long' })}</span><h2>{guide.name}</h2><p>{guide.why}</p></div><aside><strong>Límite del día</strong><p>{guide.limit}</p></aside></section>;
}

function TaskCard({ task, onEdit, onToggle, onDelete }) {
  return <article className={`os-task ${task.status === 'done' ? 'is-done' : ''} ${task.confirmed ? 'is-confirmed' : ''}`}><div className="os-task__top"><span><Icon name="schedule" /> {task.start || '—'}–{task.end || '—'}</span><small>{task.confirmed ? 'Confirmada · ' : ''}{task.topic}</small></div><h3>{task.title}</h3>{task.explain && <p>{task.explain}</p>}{task.done_when && <div className="done-when"><strong>Termina cuando:</strong> {task.done_when}</div>}<div className="task-actions"><button type="button" onClick={() => onToggle(task.id)}><Icon name="task_alt" />{task.status === 'done' ? 'Reabrir' : 'Terminar'}</button><IconButton icon="edit" label={`Editar ${task.title}`} onClick={() => onEdit(task)} /><IconButton icon="delete" label={`Eliminar ${task.title}`} className="icon-button--danger" onClick={() => onDelete(task.id)} /></div></article>;
}

function DayView({ osState, setOsState, onAddTask, onEditTask }) {
  const tasks = osState.tasks.filter((task) => task.date === osState.selectedDate).sort((a, b) => String(a.start).localeCompare(String(b.start)));
  const moveDay = (delta) => {
    const value = new Date(`${osState.selectedDate}T12:00:00`); value.setDate(value.getDate() + delta);
    setOsState((current) => ({ ...current, selectedDate: value.toISOString().slice(0, 10) }));
  };
  const toggle = (id) => setOsState((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, status: task.status === 'done' ? 'pending' : 'done' } : task) }));
  const remove = (id) => { if (window.confirm('¿Eliminar esta tarea del sistema?')) setOsState((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) })); };

  return <div className="admin-view"><ViewHeading kicker="Operación diaria" title={formatDate(osState.selectedDate, { weekday: 'long' })} description="Tareas distribuidas por liderazgo, con explicación y criterio de cierre." action={<div className="heading-actions"><IconButton icon="chevron_left" label="Día anterior" onClick={() => moveDay(-1)} /><IconButton icon="chevron_right" label="Día siguiente" onClick={() => moveDay(1)} /><button type="button" className="button button--small" onClick={() => onAddTask({ date: osState.selectedDate })}><Icon name="add" /> Tarea</button></div>} /><GuideCard osState={osState} /><div className="task-lanes">{['Francisca', 'Benjamín', 'Ambos'].map((owner) => <section className="task-lane" key={owner}><div className="task-lane__heading"><div><span>{owner.charAt(0)}</span><h2>{owner}</h2></div><IconButton icon="add" label={`Agregar tarea para ${owner}`} onClick={() => onAddTask({ date: osState.selectedDate, owner })} /></div>{tasks.filter((task) => task.owner === owner).map((task) => <TaskCard key={task.id} task={task} onEdit={onEditTask} onToggle={toggle} onDelete={remove} />)}{!tasks.some((task) => task.owner === owner) && <p className="empty-copy">Sin tareas asignadas.</p>}</section>)}</div>{tasks.some((task) => !['Francisca', 'Benjamín', 'Ambos'].includes(task.owner)) && <section className="panel-card extra-tasks"><h2>Responsables externos</h2>{tasks.filter((task) => !['Francisca', 'Benjamín', 'Ambos'].includes(task.owner)).map((task) => <TaskCard key={task.id} task={task} onEdit={onEditTask} onToggle={toggle} onDelete={remove} />)}</section>}</div>;
}

function InboxView({ osState, setOsState, onEditTask }) {
  const [form, setForm] = useState({ title: '', owner: 'Francisca', topic: 'Metamorfosis', impact: '1', urgency: '1', load: '1', delegable: 'No', newProject: 'No' });
  const classify = () => {
    const impact = Number(form.impact); const urgency = Number(form.urgency); const load = Number(form.load);
    if (form.newProject === 'Sí' && impact < 3) return ['Estacionar', 'Abre un proyecto nuevo sin proteger una prioridad superior.'];
    if (form.delegable === 'Sí' && impact < 3) return ['Delegar', 'Puede resolverse sin ocupar el trabajo principal del equipo fundador.'];
    if (impact === 3 || urgency === 3) return ['Activar', 'Protege caja, cliente, cumplimiento o una obligación real.'];
    if (impact === 2 && load <= 1) return ['Activar', 'Acerca ingreso o cierre con una carga acotada.'];
    return ['Estacionar', 'No desplaza el plan actual; queda visible sin generar trabajo inmediato.'];
  };
  const add = (event) => {
    event.preventDefault(); if (!form.title.trim()) return;
    const [decision, reason] = classify();
    setOsState((current) => ({ ...current, inbox: [{ id: crypto.randomUUID(), title: form.title.trim(), owner: form.owner, topic: form.topic, decision, reason, createdAt: new Date().toISOString() }, ...current.inbox] }));
    setForm({ ...form, title: '' });
  };
  const remove = (id) => setOsState((current) => ({ ...current, inbox: current.inbox.filter((item) => item.id !== id) }));
  const convert = (item) => {
    onEditTask({ id: '', date: osState.selectedDate, start: '09:00', end: '10:00', owner: item.owner === 'Externo' ? 'Francisca' : item.owner, topic: item.topic, title: item.title, explain: item.reason, why: 'Entrada clasificada en la bandeja del sistema.', done_when: 'El resultado concreto queda terminado y documentado.', status: 'pending', comments: [] });
    remove(item.id);
  };
  return <div className="admin-view"><ViewHeading kicker="Entrada y decisiones" title="Clasificar antes de ejecutar" description="Los nuevos retos entran aquí para evitar que cualquier idea se convierta inmediatamente en trabajo." /><div className="inbox-layout"><section className="panel-card"><div className="panel-card__heading"><div><span className="kicker">Nueva entrada</span><h2>¿Qué apareció?</h2></div></div><form className="compact-form" onSubmit={add}><label className="field-full">Reto, solicitud o idea<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label><label>Responsable probable<select value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })}>{OWNERS.map((owner) => <option key={owner}>{owner}</option>)}</select></label><label>Tópico<select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>{TOPICS.map((topic) => <option key={topic}>{topic}</option>)}</select></label><label>Impacto<select value={form.impact} onChange={(event) => setForm({ ...form, impact: event.target.value })}><option value="0">No central</option><option value="1">Ayuda</option><option value="2">Acerca ingreso o cierre</option><option value="3">Protege caja, cliente o deber</option></select></label><label>Urgencia<select value={form.urgency} onChange={(event) => setForm({ ...form, urgency: event.target.value })}><option value="0">Sin plazo</option><option value="1">Este mes</option><option value="2">Esta semana</option><option value="3">Hoy / riesgo</option></select></label><label>Carga<select value={form.load} onChange={(event) => setForm({ ...form, load: event.target.value })}><option value="0">Menos de 30 min</option><option value="1">Un bloque</option><option value="2">Varios bloques</option><option value="3">Varias semanas</option></select></label><label>¿Delegable?<select value={form.delegable} onChange={(event) => setForm({ ...form, delegable: event.target.value })}><option>No</option><option>Sí</option></select></label><label>¿Crea proyecto nuevo?<select value={form.newProject} onChange={(event) => setForm({ ...form, newProject: event.target.value })}><option>No</option><option>Sí</option></select></label><button className="button field-full" type="submit"><Icon name="filter_alt" /> Clasificar y guardar</button></form></section><section className="panel-card"><div className="panel-card__heading"><div><span className="kicker">Bandeja</span><h2>Entradas pendientes</h2></div><span className="count-pill">{osState.inbox.length}</span></div><div className="inbox-list">{osState.inbox.map((item) => <article key={item.id}><div><strong>{item.title}</strong><span className={`decision-tag decision-tag--${item.decision.toLowerCase()}`}>{item.decision}</span></div><p>{item.reason}</p><small>{item.owner} · {item.topic}</small><footer><button type="button" onClick={() => convert(item)}><Icon name="conversion_path" /> Convertir en tarea</button><IconButton icon="delete" label={`Quitar ${item.title}`} className="icon-button--danger" onClick={() => remove(item.id)} /></footer></article>)}{!osState.inbox.length && <div className="empty-state-inline"><Icon name="inbox" /><p>No hay entradas esperando decisión.</p></div>}</div></section></div></div>;
}

function FrontsView({ osState, setOsState }) {
  const [newDecision, setNewDecision] = useState('');
  const [front, setFront] = useState({ name: '', leader: 'Francisca', state: 'Activo', next: '', limit: '' });
  const addFront = (event) => { event.preventDefault(); if (!front.name.trim()) return; setOsState((current) => ({ ...current, fronts: [...current.fronts, { ...front, id: crypto.randomUUID() }] })); setFront({ name: '', leader: 'Francisca', state: 'Activo', next: '', limit: '' }); };
  const removeFront = (id) => { if (window.confirm('¿Quitar este frente?')) setOsState((current) => ({ ...current, fronts: current.fronts.filter((item) => item.id !== id) })); };
  const addDecision = (event) => { event.preventDefault(); if (!newDecision.trim()) return; setOsState((current) => ({ ...current, decisions: [...current.decisions, newDecision.trim()] })); setNewDecision(''); };
  return <div className="admin-view"><ViewHeading kicker="Dirección" title="Frentes, liderazgos y límites" description="Cada frente debe indicar quién decide, qué sigue y qué no debe ocurrir todavía." /><div className="front-grid">{osState.fronts.map((item) => <article className="front-card" key={item.id}><div className="front-card__top"><span className="status-badge">{item.state}</span><IconButton icon="delete" label={`Quitar ${item.name}`} className="icon-button--danger" onClick={() => removeFront(item.id)} /></div><h2>{item.name}</h2><small><b>Lidera:</b> {item.leader}</small><div className="front-next"><strong>Ahora</strong><p>{item.next}</p></div><div className="front-limit"><strong>Límite</strong><p>{item.limit}</p></div></article>)}</div><div className="two-column-panels"><section className="panel-card"><div className="panel-card__heading"><div><span className="kicker">Agregar frente</span><h2>Nueva línea de trabajo</h2></div></div><form className="compact-form" onSubmit={addFront}><label className="field-full">Nombre<input value={front.name} onChange={(event) => setFront({ ...front, name: event.target.value })} required /></label><label>Liderazgo<select value={front.leader} onChange={(event) => setFront({ ...front, leader: event.target.value })}>{OWNERS.map((owner) => <option key={owner}>{owner}</option>)}</select></label><label>Estado<input value={front.state} onChange={(event) => setFront({ ...front, state: event.target.value })} /></label><label className="field-full">Próximo paso<textarea value={front.next} onChange={(event) => setFront({ ...front, next: event.target.value })} /></label><label className="field-full">Límite<textarea value={front.limit} onChange={(event) => setFront({ ...front, limit: event.target.value })} /></label><button className="button field-full" type="submit"><Icon name="add" /> Agregar frente</button></form></section><section className="panel-card"><div className="panel-card__heading"><div><span className="kicker">Reglas vigentes</span><h2>Decisiones no reabribles cada día</h2></div></div><div className="decision-list decision-list--editable">{osState.decisions.map((decision, index) => <div key={`${decision}-${index}`}><span>{index + 1}</span><p>{decision}</p><IconButton icon="delete" label={`Eliminar decisión ${index + 1}`} onClick={() => setOsState((current) => ({ ...current, decisions: current.decisions.filter((_, itemIndex) => itemIndex !== index) }))} /></div>)}</div><form className="decision-form" onSubmit={addDecision}><label>Nueva decisión<input value={newDecision} onChange={(event) => setNewDecision(event.target.value)} /></label><button className="button button--small" type="submit"><Icon name="add" /> Agregar</button></form></section></div></div>;
}

function FinanceView({ osState, setOsState }) {
  const finance = osState.finance;
  const update = (key, value) => setOsState((current) => ({ ...current, finance: { ...current.finance, [key]: value } }));
  const totalCosts = Number(finance.fixedCosts || 0) + Number(finance.variableCosts || 0) + Number(finance.committedPayments || 0);
  const projectedIncome = Number(finance.recurringIncome || 0) + Number(finance.expectedIncome || 0);
  const balance = projectedIncome - totalCosts;
  const coverage = totalCosts > 0 ? Number(finance.availableCash || 0) / totalCosts : 0;
  return <div className="admin-view"><ViewHeading kicker="Finanzas del negocio" title="Caja y compromisos visibles" description="Esta vista registra únicamente información de Metamorfosis. La caja personal y familiar se administra por separado en Vida familiar." /><div className="finance-metrics"><MetricCard icon="payments" label="Costos registrados" value={formatMoney(totalCosts)} note="Fijos, variables y comprometidos" /><MetricCard icon="trending_up" label="Ingreso proyectado" value={formatMoney(projectedIncome)} note="Recurrente más esperado" tone="accent" /><MetricCard icon={balance >= 0 ? 'check_circle' : 'warning'} label="Resultado proyectado" value={formatMoney(balance)} note={balance >= 0 ? 'Cobertura estimada positiva' : 'Brecha por cubrir'} tone={balance < 0 ? 'danger' : ''} /><MetricCard icon="savings" label="Caja disponible" value={formatMoney(finance.availableCash)} note={totalCosts ? `${coverage.toFixed(1)} meses de costos` : 'Sin costos base cargados'} /></div><div className="finance-layout"><section className="panel-card"><div className="panel-card__heading"><div><span className="kicker">Supuestos editables</span><h2>Montos del negocio</h2></div></div><div className="compact-form"><label>Costos fijos mensuales<input type="number" min="0" value={finance.fixedCosts} onChange={(event) => update('fixedCosts', event.target.value)} /></label><label>Costos variables estimados<input type="number" min="0" value={finance.variableCosts} onChange={(event) => update('variableCosts', event.target.value)} /></label><label>Ingresos recurrentes<input type="number" min="0" value={finance.recurringIncome} onChange={(event) => update('recurringIncome', event.target.value)} /></label><label>Ingresos esperados<input type="number" min="0" value={finance.expectedIncome} onChange={(event) => update('expectedIncome', event.target.value)} /></label><label>Caja disponible<input type="number" min="0" value={finance.availableCash} onChange={(event) => update('availableCash', event.target.value)} /></label><label>Pagos ya comprometidos<input type="number" min="0" value={finance.committedPayments} onChange={(event) => update('committedPayments', event.target.value)} /></label><label className="field-full">Notas y verificaciones<textarea value={finance.notes} onChange={(event) => update('notes', event.target.value)} /></label></div></section><section className="panel-card finance-reading"><div className="panel-card__heading"><div><span className="kicker">Lectura operativa</span><h2>Qué indican los datos</h2></div></div><p>Con los supuestos actuales, los costos registrados alcanzan <b>{formatMoney(totalCosts)}</b> y el ingreso proyectado alcanza <b>{formatMoney(projectedIncome)}</b>.</p><div className={`finance-result ${balance >= 0 ? 'is-positive' : 'is-negative'}`}><span>{balance >= 0 ? 'Margen proyectado' : 'Brecha proyectada'}</span><strong>{formatMoney(Math.abs(balance))}</strong></div><div className="rule-box"><Icon name="rule" /><div><strong>Regla de caja</strong><p>No comprometer nuevas inversiones sin costo total, responsable, fuente de pago y condición de suspensión definidos.</p></div></div></section></div></div>;
}



const FAMILY_STATUSES = ['Bien', 'Atención', 'Intervenir'];
const FAMILY_LOADS = ['Ligera', 'Media', 'Alta'];
const FAMILY_INVENTORY_STATES = ['Activo', 'Próximo', 'Esperando condición', 'Pausado', 'Futuro'];
const FAMILY_FRONT_STATES = ['Activo', 'Preparar', 'Cierre', 'Validación', 'Esperando', 'Pausado'];

function FamilyView({ osState, setOsState, section = 'family-overview' }) {
  const family = osState.family;
  const [actionForm, setActionForm] = useState({ owner: 'Benjamín', title: '', load: 'Media' });
  const [homeItem, setHomeItem] = useState('');
  const [needItem, setNeedItem] = useState('');
  const [groceryItem, setGroceryItem] = useState('');
  const [captureForm, setCaptureForm] = useState({ title: '', area: 'Familia', status: 'Próximo' });
  const [frontForm, setFrontForm] = useState({ name: '', leader: 'Francisca', state: 'Activo', next: '', limit: '' });
  const [exclusion, setExclusion] = useState('');

  const updateFamily = (updater) => setOsState((current) => {
    const nextFamily = typeof updater === 'function' ? updater(current.family) : { ...current.family, ...updater };
    return { ...current, family: nextFamily };
  });

  const updateWellbeing = (id, patch) => updateFamily((current) => ({
    ...current,
    wellbeing: current.wellbeing.map((item) => item.id === id ? { ...item, ...patch } : item)
  }));
  const toggleWeekly = (id) => updateFamily((current) => ({
    ...current,
    weeklyActions: current.weeklyActions.map((item) => item.id === id ? { ...item, status: item.status === 'done' ? 'pending' : 'done' } : item)
  }));
  const removeWeekly = (id) => updateFamily((current) => ({ ...current, weeklyActions: current.weeklyActions.filter((item) => item.id !== id) }));
  const addWeekly = (event) => {
    event.preventDefault();
    if (!actionForm.title.trim()) return;
    updateFamily((current) => ({
      ...current,
      weeklyActions: [...current.weeklyActions, { ...actionForm, title: actionForm.title.trim(), id: crypto.randomUUID(), status: 'pending' }]
    }));
    setActionForm((current) => ({ ...current, title: '' }));
  };

  const updateFront = (id, patch) => updateFamily((current) => ({
    ...current,
    workFronts: current.workFronts.map((item) => item.id === id ? { ...item, ...patch } : item)
  }));
  const addFront = (event) => {
    event.preventDefault();
    if (!frontForm.name.trim()) return;
    updateFamily((current) => ({ ...current, workFronts: [...current.workFronts, { ...frontForm, name: frontForm.name.trim(), id: crypto.randomUUID() }] }));
    setFrontForm({ name: '', leader: 'Francisca', state: 'Activo', next: '', limit: '' });
  };
  const removeFront = (id) => {
    if (window.confirm('¿Quitar este frente del sistema familiar?')) updateFamily((current) => ({ ...current, workFronts: current.workFronts.filter((item) => item.id !== id) }));
  };

  const updateCycle = (patch) => updateFamily((current) => ({ ...current, cycle: { ...current.cycle, ...patch } }));
  const updateHome = (patch) => updateFamily((current) => ({ ...current, home: { ...current.home, ...patch } }));
  const toggleHome = (id) => updateFamily((current) => ({
    ...current,
    home: { ...current.home, checklist: current.home.checklist.map((item) => item.id === id ? { ...item, status: item.status === 'done' ? 'pending' : 'done' } : item) }
  }));
  const addHomeItem = (event) => {
    event.preventDefault();
    if (!homeItem.trim()) return;
    updateFamily((current) => ({
      ...current,
      home: { ...current.home, checklist: [...current.home.checklist, { id: crypto.randomUUID(), title: homeItem.trim(), status: 'pending' }] }
    }));
    setHomeItem('');
  };
  const removeHome = (id) => updateFamily((current) => ({
    ...current,
    home: { ...current.home, checklist: current.home.checklist.filter((item) => item.id !== id) }
  }));

  const addSimpleFamilyListItem = (event, key, value, setValue) => {
    event.preventDefault();
    const title = value.trim();
    if (!title) return;
    updateFamily((current) => ({ ...current, [key]: [...(current[key] || []), { id: crypto.randomUUID(), title }] }));
    setValue('');
  };
  const updateSimpleFamilyListItem = (key, id, title) => updateFamily((current) => ({
    ...current,
    [key]: (current[key] || []).map((item) => item.id === id ? { ...item, title } : item)
  }));
  const removeSimpleFamilyListItem = (key, id) => updateFamily((current) => ({
    ...current,
    [key]: (current[key] || []).filter((item) => item.id !== id)
  }));

  const addCapture = (event) => {
    event.preventDefault();
    if (!captureForm.title.trim()) return;
    updateFamily((current) => ({
      ...current,
      inventory: [...current.inventory, { ...captureForm, title: captureForm.title.trim(), id: crypto.randomUUID() }]
    }));
    setCaptureForm((current) => ({ ...current, title: '' }));
  };
  const updateInventory = (id, patch) => updateFamily((current) => ({
    ...current,
    inventory: current.inventory.map((item) => item.id === id ? { ...item, ...patch } : item)
  }));
  const removeInventory = (id) => updateFamily((current) => ({ ...current, inventory: current.inventory.filter((item) => item.id !== id) }));

  const addExclusion = (event) => {
    event.preventDefault();
    if (!exclusion.trim()) return;
    updateFamily((current) => ({ ...current, exclusions: [...current.exclusions, exclusion.trim()] }));
    setExclusion('');
  };

  const number = (value) => Number(value || 0);
  const availableToDecide = number(family.cycle.availableCash) + number(family.cycle.nextIncomeAmount) - number(family.cycle.mandatoryPayments) - number(family.cycle.protectedAmount);
  const completedWeekly = family.weeklyActions.filter((item) => item.status === 'done').length;
  const pendingWeekly = family.weeklyActions.filter((item) => item.status !== 'done');
  const shoppingCount = (family.shortTermNeeds || []).length + (family.groceryList || []).length;
  const completedHome = family.home.checklist.filter((item) => item.status === 'done').length;
  const homeProgress = family.home.checklist.length ? Math.round((completedHome / family.home.checklist.length) * 100) : 0;
  const loadPoints = { Ligera: 1, Media: 2, Exigente: 3 };
  const ownerLoad = (owner) => family.weeklyActions.filter((item) => item.owner === owner && item.status !== 'done').reduce((sum, item) => sum + (loadPoints[item.load] || 1), 0);

  const sectionTitles = {
    'family-overview': ['Hoy', 'Solo lo que ayuda a orientarse ahora: semana, caja y hogar. El detalle queda en su sección.'],
    'family-week': ['Semana', 'Prioridades concretas primero; carga, frentes y límites quedan disponibles sin ocupar toda la pantalla.'],
    'family-money': ['Caja familiar', 'Un espacio económico separado de la empresa para decidir con claridad qué está disponible, comprometido y protegido.'],
    'family-home': ['Hogar y compras', 'Pendientes domésticos y listas de compra simples para saber qué resolver y qué falta antes de salir.']
  };
  const [sectionTitle, sectionDescription] = sectionTitles[section] || sectionTitles['family-overview'];

  return (
    <div className={`admin-view family-view family-view--${section}`}>
      <ViewHeading
        kicker="Espacio familiar"
        title={sectionTitle}
        description={sectionDescription}
      />

      {section === 'family-overview' && <>
        <section className="family-calm-dashboard">
          <div className="family-calm-intro">
            <div><span className="kicker">Semana en curso</span><h2>Una mirada, tres lugares</h2><p>No necesitas alimentar todo a la vez. Entra solo donde haya algo que decidir o recordar.</p></div>
            <label>Semana<input value={family.weekLabel || ''} onChange={(event) => updateFamily({ weekLabel: event.target.value })} /></label>
          </div>
          <div className="family-calm-grid">
            <a href="#family-week" className="family-calm-card"><Icon name="calendar_month" /><div><small>Semana</small><strong>{pendingWeekly.length} pendientes</strong><span>{completedWeekly} cerradas · revisar solo prioridades</span></div><Icon name="arrow_forward" /></a>
            <a href="#family-money" className="family-calm-card"><Icon name="savings" /><div><small>Caja</small><strong>{formatMoney(availableToDecide)}</strong><span>disponible para decidir según los datos cargados</span></div><Icon name="arrow_forward" /></a>
            <a href="#family-home" className="family-calm-card"><Icon name="shopping_cart" /><div><small>Hogar y compras</small><strong>{shoppingCount} por comprar</strong><span>{homeProgress}% del plan doméstico actual</span></div><Icon name="arrow_forward" /></a>
          </div>
        </section>

        <section className="family-section family-today-focus">
          <div className="family-section__heading"><div><span className="kicker">A mano</span><h2>Lo próximo, no todo</h2></div><p>Se muestran hasta cuatro acciones pendientes. El resto permanece en Semana.</p></div>
          <div className="family-check-list family-check-list--focus">
            {pendingWeekly.slice(0, 4).map((item) => <article key={item.id}>
              <button type="button" className="family-check" onClick={() => toggleWeekly(item.id)} aria-label="Completar acción"><Icon name="task_alt" /></button>
              <div><strong>{item.title}</strong><span>{item.owner} · {item.load}</span></div>
              <IconButton icon="delete" label={`Eliminar ${item.title}`} className="icon-button--danger" onClick={() => removeWeekly(item.id)} />
            </article>)}
            {!pendingWeekly.length && <p className="empty-copy">No hay pendientes semanales cargados.</p>}
          </div>
          <a className="family-inline-link" href="#family-week">Abrir semana completa <Icon name="arrow_forward" /></a>
        </section>

        <details className="family-details family-details--secondary">
          <summary><Icon name="info" /> Contexto y límites de la transición</summary>
          <div className="family-secondary-summary">
            <div><strong>Frentes activos</strong><span>{family.workFronts.filter((front) => !['Pausado', 'Cerrado'].includes(front.state)).length}</span><p>El detalle y la edición viven en Semana.</p></div>
            <div><strong>Fuera por ahora</strong><span>{family.exclusions.length}</span><p>Las exclusiones evitan convertir cada idea en una obligación.</p></div>
          </div>
        </details>
      </>}

      {section === 'family-week' && <>
        <section className="family-section">
          <div className="family-section__heading"><div><span className="kicker">Prioridades</span><h2>Esta semana</h2></div><p>Primero acciones concretas. La carga y los frentes se revisan solo cuando ayudan a decidir.</p></div>
          <div className="family-week-grid">
            {['Benjamín', 'Francisca', 'Compartido'].map((owner) => <section className="family-week-lane" key={owner}>
              <header><div><span>{owner.charAt(0)}</span><div><h3>{owner}</h3><small>{ownerLoad(owner)} puntos de carga pendientes</small></div></div></header>
              <div className="family-check-list">
                {family.weeklyActions.filter((item) => item.owner === owner).map((item) => <article className={item.status === 'done' ? 'is-done' : ''} key={item.id}>
                  <button type="button" className="family-check" onClick={() => toggleWeekly(item.id)} aria-label={item.status === 'done' ? 'Reabrir acción' : 'Completar acción'}><Icon name={item.status === 'done' ? 'check_circle' : 'task_alt'} /></button>
                  <div><strong>{item.title}</strong><span>{item.load}</span></div>
                  <IconButton icon="delete" label={`Eliminar ${item.title}`} className="icon-button--danger" onClick={() => removeWeekly(item.id)} />
                </article>)}
                {!family.weeklyActions.some((item) => item.owner === owner) && <p className="empty-copy">Sin acciones cargadas.</p>}
              </div>
            </section>)}
          </div>
          <form className="family-add-row" onSubmit={addWeekly}>
            <label>Responsable<select value={actionForm.owner} onChange={(event) => setActionForm({ ...actionForm, owner: event.target.value })}><option>Benjamín</option><option>Francisca</option><option>Compartido</option></select></label>
            <label className="family-grow">Nueva acción<input value={actionForm.title} onChange={(event) => setActionForm({ ...actionForm, title: event.target.value })} placeholder="Resultado concreto de esta semana" /></label>
            <label>Carga<select value={actionForm.load} onChange={(event) => setActionForm({ ...actionForm, load: event.target.value })}><option>Ligera</option><option>Media</option><option>Exigente</option></select></label>
            <button className="button button--small" type="submit"><Icon name="add" /> Agregar</button>
          </form>
        </section>

        <details className="family-details family-details--panel">
          <summary><Icon name="favorite" /> Cómo estamos · abrir solo cuando ayude</summary>
          <div className="family-wellbeing-grid family-details__content">
            {family.wellbeing.map((item) => <article className={`family-person family-person--${item.status.toLowerCase().replace('ó', 'o')}`} key={item.id}>
              <div className="family-person__top"><div><strong>{item.name}</strong><span>{item.area}</span></div><span className="family-status-dot" aria-label={item.status} /></div>
              <div className="family-inline-fields"><label>Estado<select value={item.status} onChange={(event) => updateWellbeing(item.id, { status: event.target.value })}>{FAMILY_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label>Carga<select value={item.load} onChange={(event) => updateWellbeing(item.id, { load: event.target.value })}>{FAMILY_LOADS.map((load) => <option key={load}>{load}</option>)}</select></label></div>
              <textarea aria-label={`Nota de ${item.name}`} value={item.note || ''} onChange={(event) => updateWellbeing(item.id, { note: event.target.value })} />
            </article>)}
          </div>
        </details>

        <details className="family-details family-details--panel">
          <summary><Icon name="layers" /> Frentes y límites · contexto secundario</summary>
          <div className="family-details__content family-details__stack">
            <div className="family-front-list">
              {family.workFronts.map((front) => <article key={front.id}>
                <div className="family-front__top"><input className="family-front__name" value={front.name} onChange={(event) => updateFront(front.id, { name: event.target.value })} aria-label="Nombre del frente" /><IconButton icon="delete" label={`Quitar ${front.name}`} className="icon-button--danger" onClick={() => removeFront(front.id)} /></div>
                <div className="family-inline-fields"><label>Lidera<input value={front.leader} onChange={(event) => updateFront(front.id, { leader: event.target.value })} /></label><label>Estado<select value={front.state} onChange={(event) => updateFront(front.id, { state: event.target.value })}>{FAMILY_FRONT_STATES.map((state) => <option key={state}>{state}</option>)}</select></label></div>
                <label>Próximo movimiento<textarea value={front.next || ''} onChange={(event) => updateFront(front.id, { next: event.target.value })} /></label>
                <label>Límite<textarea value={front.limit || ''} onChange={(event) => updateFront(front.id, { limit: event.target.value })} /></label>
              </article>)}
            </div>
            <details className="family-details"><summary><Icon name="add" /> Agregar frente</summary><form className="compact-form" onSubmit={addFront}><label>Nombre<input value={frontForm.name} onChange={(event) => setFrontForm({ ...frontForm, name: event.target.value })} /></label><label>Lidera<input value={frontForm.leader} onChange={(event) => setFrontForm({ ...frontForm, leader: event.target.value })} /></label><label>Estado<select value={frontForm.state} onChange={(event) => setFrontForm({ ...frontForm, state: event.target.value })}>{FAMILY_FRONT_STATES.map((state) => <option key={state}>{state}</option>)}</select></label><label className="field-full">Próximo movimiento<input value={frontForm.next} onChange={(event) => setFrontForm({ ...frontForm, next: event.target.value })} /></label><label className="field-full">Límite<input value={frontForm.limit} onChange={(event) => setFrontForm({ ...frontForm, limit: event.target.value })} /></label><button className="button button--small field-full" type="submit">Guardar frente</button></form></details>
            <div className="family-exclusion-list">{family.exclusions.map((item, index) => <article key={`${item}-${index}`}><Icon name="rule" /><span>{item}</span><IconButton icon="delete" label={`Eliminar exclusión ${index + 1}`} className="icon-button--danger" onClick={() => updateFamily((current) => ({ ...current, exclusions: current.exclusions.filter((_, itemIndex) => itemIndex !== index) }))} /></article>)}</div>
            <form className="family-add-row family-add-row--simple" onSubmit={addExclusion}><label className="family-grow">Nueva exclusión<input value={exclusion} onChange={(event) => setExclusion(event.target.value)} placeholder="Esto existe, pero no se hará ahora" /></label><button className="button button--small" type="submit"><Icon name="add" /> Agregar</button></form>
          </div>
        </details>
      </>}

      {section === 'family-money' && <section className="family-section family-money">
        <div className="family-section__heading"><div><span className="kicker">Dinero familiar</span><h2>{family.cycle.name}</h2></div><span className={`family-income-status ${family.cycle.nextIncomeStatus?.toLowerCase().includes('confirmado') && !family.cycle.nextIncomeStatus?.toLowerCase().includes('no confirmado') ? 'is-confirmed' : ''}`}>{family.cycle.nextIncomeStatus}</span></div>
        <div className="family-money-grid">
          <label>Inicio del ciclo<input type="date" value={family.cycle.startDate || ''} onChange={(event) => updateCycle({ startDate: event.target.value })} /></label>
          <label>Fin / próxima entrada<input type="date" value={family.cycle.endDate || ''} onChange={(event) => updateCycle({ endDate: event.target.value })} /></label>
          <label>Caja disponible<input type="number" step="1000" value={family.cycle.availableCash || ''} onChange={(event) => updateCycle({ availableCash: event.target.value })} /></label>
          <label>Próximo ingreso<input value={family.cycle.nextIncomeLabel || ''} onChange={(event) => updateCycle({ nextIncomeLabel: event.target.value })} /></label>
          <label>Monto próximo ingreso<input type="number" step="1000" value={family.cycle.nextIncomeAmount || ''} onChange={(event) => updateCycle({ nextIncomeAmount: event.target.value })} /></label>
          <label>Fecha estimada<input type="date" value={family.cycle.nextIncomeDate || ''} onChange={(event) => updateCycle({ nextIncomeDate: event.target.value, endDate: event.target.value })} /></label>
          <label>Estado del ingreso<select value={family.cycle.nextIncomeStatus || ''} onChange={(event) => updateCycle({ nextIncomeStatus: event.target.value })}><option>Probable, no confirmado</option><option>Confirmado, pendiente de abono</option><option>Abonado</option><option>Retrasado</option></select></label>
          <label>Pagos obligatorios<input type="number" step="1000" value={family.cycle.mandatoryPayments || ''} onChange={(event) => updateCycle({ mandatoryPayments: event.target.value })} /></label>
          <label>Monto protegido<input type="number" step="1000" value={family.cycle.protectedAmount || ''} onChange={(event) => updateCycle({ protectedAmount: event.target.value })} /></label>
          <label>Base mensual familiar<input type="number" step="1000" value={family.cycle.monthlyBase || ''} onChange={(event) => updateCycle({ monthlyBase: event.target.value })} /></label>
          <label className="family-money-result"><span>Disponible para decidir</span><strong>{formatMoney(availableToDecide)}</strong><small>Incluye el ingreso esperado; no usar hasta confirmarlo.</small></label>
        </div>
        <label>Notas del ciclo<textarea value={family.cycle.notes || ''} onChange={(event) => updateCycle({ notes: event.target.value })} /></label>
      </section>}

      {section === 'family-home' && <>
        <section className="family-section family-shopping-section family-shopping-section--primary">
          <div className="family-section__heading"><div><span className="kicker">Compras cotidianas</span><h2>Lo que falta, listo para comprar</h2></div><p>Estas dos listas son la capa diaria. Agrega cuando algo falte y elimina al resolverlo.</p></div>
          <div className="family-shopping-grid">
            <article className="family-shopping-card">
              <header><div><Icon name="inventory_2" /><span><strong>Necesarios a corto plazo</strong><small>Objetos o soluciones domésticas que conviene comprar pronto.</small></span></div><b>{(family.shortTermNeeds || []).length}</b></header>
              <div className="family-simple-list">
                {(family.shortTermNeeds || []).map((item) => <div key={item.id}><input aria-label={`Editar ${item.title}`} value={item.title} onChange={(event) => updateSimpleFamilyListItem('shortTermNeeds', item.id, event.target.value)} /><IconButton icon="delete" label={`Eliminar ${item.title}`} className="icon-button--danger" onClick={() => removeSimpleFamilyListItem('shortTermNeeds', item.id)} /></div>)}
                {!(family.shortTermNeeds || []).length && <p className="empty-copy">Sin necesarios cargados.</p>}
              </div>
              <form className="family-simple-add" onSubmit={(event) => addSimpleFamilyListItem(event, 'shortTermNeeds', needItem, setNeedItem)}><input value={needItem} onChange={(event) => setNeedItem(event.target.value)} placeholder="Agregar necesario" aria-label="Agregar necesario a corto plazo" /><button type="submit" className="button button--small"><Icon name="add" /> Agregar</button></form>
            </article>
            <article className="family-shopping-card">
              <header><div><Icon name="shopping_cart" /><span><strong>Supermercado</strong><small>Productos que se van acabando para revisar antes de salir.</small></span></div><b>{(family.groceryList || []).length}</b></header>
              <div className="family-simple-list">
                {(family.groceryList || []).map((item) => <div key={item.id}><input aria-label={`Editar ${item.title}`} value={item.title} onChange={(event) => updateSimpleFamilyListItem('groceryList', item.id, event.target.value)} /><IconButton icon="delete" label={`Eliminar ${item.title}`} className="icon-button--danger" onClick={() => removeSimpleFamilyListItem('groceryList', item.id)} /></div>)}
                {!(family.groceryList || []).length && <p className="empty-copy">Lista vacía. Agrega algo cuando se esté acabando.</p>}
              </div>
              <form className="family-simple-add" onSubmit={(event) => addSimpleFamilyListItem(event, 'groceryList', groceryItem, setGroceryItem)}><input value={groceryItem} onChange={(event) => setGroceryItem(event.target.value)} placeholder="Ej. avena, detergente, tomates…" aria-label="Agregar producto de supermercado" /><button type="submit" className="button button--small"><Icon name="add" /> Agregar</button></form>
            </article>
          </div>
        </section>

        <details className="family-details family-details--panel">
          <summary><Icon name="construction" /> Plan doméstico actual · {homeProgress}%</summary>
          <section className="family-section family-home family-home--embedded family-details__content">
            <div className="family-progress"><span style={{ width: `${homeProgress}%` }} /></div>
            <label>Fase<input value={family.home.phase || ''} onChange={(event) => updateHome({ phase: event.target.value })} /></label>
            <label>Intervención actual<textarea value={family.home.intervention || ''} onChange={(event) => updateHome({ intervention: event.target.value })} /></label>
            <label>Presupuesto disponible<input type="number" min="0" step="1000" value={family.home.budget || ''} onChange={(event) => updateHome({ budget: event.target.value })} /></label>
            <label>Regla de la fase<textarea value={family.home.rule || ''} onChange={(event) => updateHome({ rule: event.target.value })} /></label>
            <div className="family-check-list family-check-list--home">
              {family.home.checklist.map((item) => <article className={item.status === 'done' ? 'is-done' : ''} key={item.id}><button type="button" className="family-check" onClick={() => toggleHome(item.id)}><Icon name={item.status === 'done' ? 'check_circle' : 'construction'} /></button><div><strong>{item.title}</strong></div><IconButton icon="delete" label={`Eliminar ${item.title}`} className="icon-button--danger" onClick={() => removeHome(item.id)} /></article>)}
            </div>
            <form className="family-add-row family-add-row--simple" onSubmit={addHomeItem}><label className="family-grow">Nueva microacción<input value={homeItem} onChange={(event) => setHomeItem(event.target.value)} placeholder="Algo pequeño y cerrable" /></label><button className="button button--small" type="submit"><Icon name="add" /> Agregar</button></form>
          </section>
        </details>

        <details className="family-details family-details--panel">
          <summary><Icon name="inventory" /> Inventario familiar · abrir solo para capturar o revisar</summary>
          <div className="family-details__content">
            <form className="family-capture" onSubmit={addCapture}><label className="family-grow">Capturar<input value={captureForm.title} onChange={(event) => setCaptureForm({ ...captureForm, title: event.target.value })} placeholder="Idea, compra, trámite o meta" /></label><label>Área<input value={captureForm.area} onChange={(event) => setCaptureForm({ ...captureForm, area: event.target.value })} /></label><label>Estado<select value={captureForm.status} onChange={(event) => setCaptureForm({ ...captureForm, status: event.target.value })}>{FAMILY_INVENTORY_STATES.map((status) => <option key={status}>{status}</option>)}</select></label><button className="button button--small" type="submit"><Icon name="add" /> Guardar</button></form>
            <div className="family-inventory-grid">
              {FAMILY_INVENTORY_STATES.map((status) => <section key={status}><header><h3>{status}</h3><span>{family.inventory.filter((item) => item.status === status).length}</span></header><div>{family.inventory.filter((item) => item.status === status).map((item) => <article key={item.id}><div><strong>{item.title}</strong><small>{item.area}</small></div><select aria-label={`Estado de ${item.title}`} value={item.status} onChange={(event) => updateInventory(item.id, { status: event.target.value })}>{FAMILY_INVENTORY_STATES.map((option) => <option key={option}>{option}</option>)}</select><IconButton icon="delete" label={`Eliminar ${item.title}`} className="icon-button--danger" onClick={() => removeInventory(item.id)} /></article>)}</div></section>)}
            </div>
          </div>
        </details>
      </>}
    </div>
  );
}

function TimeTrackingView({ osState, setOsState }) {
  const tracking = osState.timeTracking;
  const emptyProject = { id: '', name: '', client: '', fee: '', directCosts: '', targetHours: '', status: 'Activo' };
  const emptyEntry = { id: '', date: new Date().toISOString().slice(0, 10), projectId: tracking.projects[0]?.id || '', owner: 'Francisca', category: 'Ejecución', hours: '', billable: true, note: '' };
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [entryForm, setEntryForm] = useState(emptyEntry);

  const number = (value) => Number(value || 0);
  const updateTracking = (next) => setOsState((current) => ({
    ...current,
    timeTracking: typeof next === 'function' ? next(current.timeTracking) : next
  }));

  const summaries = useMemo(() => tracking.projects.map((project) => {
    const entries = tracking.entries.filter((entry) => entry.projectId === project.id);
    const hours = entries.reduce((sum, entry) => sum + number(entry.hours), 0);
    const billableHours = entries.filter((entry) => entry.billable).reduce((sum, entry) => sum + number(entry.hours), 0);
    const laborCost = entries.reduce((sum, entry) => sum + number(entry.hours) * number(tracking.rates[entry.owner]), 0);
    const fee = number(project.fee);
    const directCosts = number(project.directCosts);
    const margin = fee - laborCost - directCosts;
    const targetHours = number(project.targetHours);
    return {
      ...project,
      hours,
      billableHours,
      laborCost,
      margin,
      targetHours,
      effectiveRate: hours > 0 ? fee / hours : 0,
      progress: targetHours > 0 ? (hours / targetHours) * 100 : 0,
      marginPct: fee > 0 ? (margin / fee) * 100 : 0
    };
  }), [tracking]);

  const totalHours = summaries.reduce((sum, project) => sum + project.hours, 0);
  const totalFees = summaries.reduce((sum, project) => sum + number(project.fee), 0);
  const totalLabor = summaries.reduce((sum, project) => sum + project.laborCost, 0);
  const totalDirect = summaries.reduce((sum, project) => sum + number(project.directCosts), 0);
  const totalMargin = totalFees - totalLabor - totalDirect;
  const billableHours = tracking.entries.filter((entry) => entry.billable).reduce((sum, entry) => sum + number(entry.hours), 0);
  const billableRatio = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

  const saveProject = (event) => {
    event.preventDefault();
    if (!projectForm.name.trim()) return;
    const project = {
      ...projectForm,
      id: projectForm.id || crypto.randomUUID(),
      name: projectForm.name.trim(),
      client: projectForm.client.trim(),
      fee: number(projectForm.fee),
      directCosts: number(projectForm.directCosts),
      targetHours: number(projectForm.targetHours)
    };
    updateTracking((current) => ({
      ...current,
      projects: current.projects.some((item) => item.id === project.id)
        ? current.projects.map((item) => item.id === project.id ? project : item)
        : [...current.projects, project]
    }));
    setProjectForm(emptyProject);
    setEntryForm((current) => ({ ...current, projectId: current.projectId || project.id }));
  };

  const removeProject = (project) => {
    const related = tracking.entries.filter((entry) => entry.projectId === project.id).length;
    if (!window.confirm(related ? `Este proyecto tiene ${related} registros de tiempo. ¿Eliminar el proyecto y sus registros?` : `¿Eliminar ${project.name}?`)) return;
    updateTracking((current) => ({
      ...current,
      projects: current.projects.filter((item) => item.id !== project.id),
      entries: current.entries.filter((entry) => entry.projectId !== project.id)
    }));
    if (entryForm.projectId === project.id) setEntryForm((current) => ({ ...current, projectId: '' }));
  };

  const saveEntry = (event) => {
    event.preventDefault();
    if (!entryForm.projectId || !entryForm.date || number(entryForm.hours) <= 0) return;
    const entry = {
      ...entryForm,
      id: entryForm.id || crypto.randomUUID(),
      hours: number(entryForm.hours),
      note: entryForm.note.trim(),
      billable: Boolean(entryForm.billable)
    };
    updateTracking((current) => ({
      ...current,
      entries: current.entries.some((item) => item.id === entry.id)
        ? current.entries.map((item) => item.id === entry.id ? entry : item)
        : [entry, ...current.entries]
    }));
    setEntryForm({ ...emptyEntry, projectId: entry.projectId, owner: entry.owner, date: entry.date });
  };

  const removeEntry = (id) => updateTracking((current) => ({ ...current, entries: current.entries.filter((entry) => entry.id !== id) }));

  return (
    <div className="admin-view time-view">
      <ViewHeading kicker="Indicadores de servicio" title="Tiempo, costo y rentabilidad por proyecto" description="Registra todas las horas reales —facturables y no facturables— para conocer el costo del trabajo intangible, revisar presupuestos y construir precios con evidencia." />

      <div className="finance-metrics time-metrics">
        <MetricCard icon="schedule" label="Horas registradas" value={`${totalHours.toFixed(1)} h`} note={`${billableRatio.toFixed(0)}% facturable`} />
        <MetricCard icon="payments" label="Costo de trabajo" value={formatMoney(totalLabor)} note="Horas × costo interno" />
        <MetricCard icon="receipt_long" label="Honorarios registrados" value={formatMoney(totalFees)} note="Precio acordado por proyecto" tone="accent" />
        <MetricCard icon={totalMargin >= 0 ? 'trending_up' : 'warning'} label="Margen estimado" value={formatMoney(totalMargin)} note={`Después de ${formatMoney(totalDirect)} en costos directos`} tone={totalMargin < 0 ? 'danger' : ''} />
      </div>

      <div className="time-layout">
        <section className="panel-card">
          <div className="panel-card__heading"><div><span className="kicker">Costos internos</span><h2>Valor de una hora de trabajo</h2></div></div>
          <p className="form-help">No es la tarifa que se cobra al cliente. Es el costo mínimo que Metamorfosis asigna al tiempo de cada responsable para calcular rentabilidad.</p>
          <div className="rate-grid">
            {OWNERS.map((owner) => <label key={owner}>{owner}<input type="number" min="0" step="1000" value={tracking.rates[owner] || ''} onChange={(event) => updateTracking((current) => ({ ...current, rates: { ...current.rates, [owner]: event.target.value } }))} placeholder="$ por hora" /></label>)}
          </div>
          <label className="time-note">Criterio de registro<textarea value={tracking.note || ''} onChange={(event) => updateTracking((current) => ({ ...current, note: event.target.value }))} /></label>
        </section>

        <section className="panel-card">
          <div className="panel-card__heading"><div><span className="kicker">Registro diario</span><h2>{entryForm.id ? 'Editar tiempo' : 'Agregar tiempo trabajado'}</h2></div></div>
          <form className="compact-form" onSubmit={saveEntry}>
            <label>Fecha<input type="date" value={entryForm.date} onChange={(event) => setEntryForm({ ...entryForm, date: event.target.value })} required /></label>
            <label>Proyecto<select value={entryForm.projectId} onChange={(event) => setEntryForm({ ...entryForm, projectId: event.target.value })} required><option value="">Seleccionar</option>{tracking.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
            <label>Responsable<select value={entryForm.owner} onChange={(event) => setEntryForm({ ...entryForm, owner: event.target.value })}>{OWNERS.map((owner) => <option key={owner}>{owner}</option>)}</select></label>
            <label>Tipo de trabajo<select value={entryForm.category} onChange={(event) => setEntryForm({ ...entryForm, category: event.target.value })}><option>Diagnóstico</option><option>Diseño</option><option>Ejecución</option><option>Reunión</option><option>Gestión</option><option>Traslado</option><option>Administración</option><option>Corrección / retrabajo</option><option>Otro</option></select></label>
            <label>Horas<input type="number" min="0.25" step="0.25" value={entryForm.hours} onChange={(event) => setEntryForm({ ...entryForm, hours: event.target.value })} placeholder="Ej. 1,5" required /></label>
            <label>Tratamiento<select value={entryForm.billable ? 'Sí' : 'No'} onChange={(event) => setEntryForm({ ...entryForm, billable: event.target.value === 'Sí' })}><option>Sí</option><option>No</option></select><small>¿La hora forma parte del servicio cobrado?</small></label>
            <label className="field-full">Actividad o resultado<textarea value={entryForm.note} onChange={(event) => setEntryForm({ ...entryForm, note: event.target.value })} placeholder="Qué se hizo y qué resultado dejó." /></label>
            <div className="modal-actions field-full">{entryForm.id && <button type="button" className="button button--ghost" onClick={() => setEntryForm(emptyEntry)}>Cancelar edición</button>}<button type="submit" className="button"><Icon name="save" /> Guardar tiempo</button></div>
          </form>
        </section>
      </div>

      <section className="panel-card time-projects-panel">
        <div className="panel-card__heading"><div><span className="kicker">Lectura por servicio</span><h2>Proyectos y márgenes</h2></div><span className="count-pill">{tracking.projects.length}</span></div>
        <div className="time-project-grid">
          {summaries.map((project) => (
            <article className="time-project-card" key={project.id}>
              <div className="time-project-card__top"><span className="status-badge">{project.status}</span><div><IconButton icon="edit" label={`Editar ${project.name}`} onClick={() => setProjectForm(project)} /><IconButton icon="delete" label={`Eliminar ${project.name}`} className="icon-button--danger" onClick={() => removeProject(project)} /></div></div>
              <small>{project.client || 'Sin cliente indicado'}</small><h3>{project.name}</h3>
              <div className="time-project-stats"><span><small>Horas</small><strong>{project.hours.toFixed(1)} h</strong></span><span><small>Costo trabajo</small><strong>{formatMoney(project.laborCost)}</strong></span><span><small>Ingreso/hora real</small><strong>{formatMoney(project.effectiveRate)}</strong></span><span><small>Margen</small><strong className={project.margin < 0 ? 'is-negative' : ''}>{formatMoney(project.margin)}</strong></span></div>
              {project.targetHours > 0 && <div className="time-budget"><div><span>Horas usadas</span><b>{project.progress.toFixed(0)}%</b></div><div className="progress-track"><span style={{ width: `${Math.min(project.progress, 100)}%` }} /></div><small>{project.hours.toFixed(1)} de {project.targetHours.toFixed(1)} horas presupuestadas</small></div>}
              <footer><span>{project.marginPct.toFixed(0)}% de margen estimado</span><span>{project.billableHours.toFixed(1)} h facturables</span></footer>
            </article>
          ))}
        </div>
        <form className="compact-form time-project-form" onSubmit={saveProject}>
          <div className="field-full form-subheading"><strong>{projectForm.id ? 'Editar proyecto económico' : 'Agregar proyecto económico'}</strong><span>El honorario es el monto neto acordado para comparar, no una factura.</span></div>
          <label>Proyecto<input value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} required /></label>
          <label>Cliente<input value={projectForm.client} onChange={(event) => setProjectForm({ ...projectForm, client: event.target.value })} /></label>
          <label>Honorario acordado<input type="number" min="0" step="1000" value={projectForm.fee} onChange={(event) => setProjectForm({ ...projectForm, fee: event.target.value })} /></label>
          <label>Costos directos<input type="number" min="0" step="1000" value={projectForm.directCosts} onChange={(event) => setProjectForm({ ...projectForm, directCosts: event.target.value })} /></label>
          <label>Horas presupuestadas<input type="number" min="0" step="0.5" value={projectForm.targetHours} onChange={(event) => setProjectForm({ ...projectForm, targetHours: event.target.value })} /></label>
          <label>Estado<select value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })}><option>Propuesta</option><option>Activo</option><option>Desarrollo</option><option>Validación</option><option>Pausado</option><option>Cerrado</option></select></label>
          <div className="modal-actions field-full">{projectForm.id && <button type="button" className="button button--ghost" onClick={() => setProjectForm(emptyProject)}>Cancelar edición</button>}<button type="submit" className="button"><Icon name="add" /> {projectForm.id ? 'Guardar cambios' : 'Agregar proyecto'}</button></div>
        </form>
      </section>

      <section className="panel-card">
        <div className="panel-card__heading"><div><span className="kicker">Trazabilidad</span><h2>Registros de tiempo</h2></div><span className="count-pill">{tracking.entries.length}</span></div>
        <div className="table-page"><table className="time-table"><thead><tr><th>Fecha</th><th>Proyecto</th><th>Responsable</th><th>Trabajo</th><th>Horas</th><th>Costo</th><th>Facturable</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{tracking.entries.map((entry) => { const project = tracking.projects.find((item) => item.id === entry.projectId); return <tr key={entry.id}><td>{formatDate(entry.date, { day: '2-digit', month: 'short' })}</td><td><strong>{project?.name || 'Proyecto eliminado'}</strong></td><td>{entry.owner}</td><td><strong>{entry.category}</strong><small>{entry.note || 'Sin detalle'}</small></td><td>{number(entry.hours).toFixed(2)}</td><td>{formatMoney(number(entry.hours) * number(tracking.rates[entry.owner]))}</td><td>{entry.billable ? 'Sí' : 'No'}</td><td className="table-actions"><IconButton icon="edit" label="Editar registro" onClick={() => setEntryForm(entry)} /><IconButton icon="delete" label="Eliminar registro" className="icon-button--danger" onClick={() => removeEntry(entry.id)} /></td></tr>; })}{!tracking.entries.length && <tr><td colSpan="8"><div className="empty-state-inline"><Icon name="schedule" /><p>Aún no hay horas registradas.</p></div></td></tr>}</tbody></table></div>
      </section>
    </div>
  );
}


function FieldRegisterView({ osState, setOsState }) {
  const records = Array.isArray(osState.fieldRegister) ? osState.fieldRegister : [];
  const [newRecord, setNewRecord] = useState({ actor: '', organization: '', type: 'Informante', role: '', status: 'Nuevo', nextAction: '' });
  const updateRecord = (id, patch) => setOsState((current) => ({
    ...current,
    fieldRegister: (current.fieldRegister || []).map((item) => item.id === id ? { ...item, ...patch } : item)
  }));
  const removeRecord = (id, actor) => {
    if (!window.confirm(`¿Eliminar ${actor} del registro de campo?`)) return;
    setOsState((current) => ({ ...current, fieldRegister: (current.fieldRegister || []).filter((item) => item.id !== id) }));
  };
  const addRecord = (event) => {
    event.preventDefault();
    if (!newRecord.actor.trim()) return;
    const item = {
      id: crypto.randomUUID(),
      actor: newRecord.actor.trim(),
      organization: newRecord.organization.trim() || 'Organización por confirmar',
      type: newRecord.type,
      role: newRecord.role.trim() || 'Rol por precisar',
      access: 'Por definir',
      priority: 'Por definir',
      status: newRecord.status.trim() || 'Nuevo',
      commercial: newRecord.type === 'Informante' ? 'No prospecto' : newRecord.type === 'Exclusión' ? 'No prospectar' : 'Por validar',
      nextAction: newRecord.nextAction.trim() || 'Definir próximo paso antes de contactar.',
      context: 'Registro incorporado desde campo. Completar contexto cuando exista evidencia suficiente.',
      limit: 'No confundir vínculo, intuición o acceso con necesidad comercial.'
    };
    setOsState((current) => ({ ...current, fieldRegister: [...(current.fieldRegister || []), item] }));
    setNewRecord({ actor: '', organization: '', type: 'Informante', role: '', status: 'Nuevo', nextAction: '' });
  };
  const informants = records.filter((item) => item.type === 'Informante').length;
  const commercial = records.filter((item) => ['Discovery', 'Piloto comercial'].includes(item.type)).length;
  const waiting = records.filter((item) => /espera|agendar|preparación/i.test(item.status || '')).length;
  const excluded = records.filter((item) => item.type === 'Exclusión' || /descartado|no prospectar/i.test(`${item.status} ${item.commercial}`)).length;

  return (
    <div className="admin-view field-view">
      <ViewHeading kicker="Inteligencia y validación" title="Registro de campo comercial" description="Un solo mapa para distinguir informantes, discovery, pilotos y exclusiones. El vínculo abre una conversación; nunca se confunde con necesidad, demanda o permiso para vender." />
      <div className="field-summary-strip">
        <span><b>{records.length}</b> actores registrados</span>
        <span><b>{informants}</b> informantes</span>
        <span><b>{commercial}</b> pruebas comerciales</span>
        <span><b>{waiting}</b> por coordinar / en espera</span>
        <span><b>{excluded}</b> exclusiones</span>
      </div>
      <p className="field-register-rule"><Icon name="rule" /><span><b>Regla de campo:</b> primero comprender. Solo se pasa a venta cuando la organización reconoce un problema, existe intención de actuar y Metamorfosis puede aportar sin traicionar su identidad.</span></p>
      <div className="field-confirmed-meetings" aria-label="Reuniones informativas confirmadas">
        {(osState.tasks || []).filter((task) => task.confirmed && /Reunión informativa Metamorfosis/i.test(task.title || '')).map((task) => (
          <article key={task.id}><span><Icon name="event_available" /> Confirmada</span><strong>{formatDate(task.date, { day: '2-digit', month: 'short' })}</strong><p>{task.title.replace(/ · confirmada \d+$/i, '')}</p><small>Contraparte exacta pendiente de completar desde el registro original; el OS no la inventa.</small></article>
        ))}
      </div>
      <form className="field-capture" onSubmit={addRecord}>
        <div><span className="kicker">Captura rápida</span><strong>Agregar actor al campo</strong><small>Registrar primero; clasificar mejor cuando exista evidencia.</small></div>
        <label>Persona / actor<input value={newRecord.actor} onChange={(event) => setNewRecord({ ...newRecord, actor: event.target.value })} placeholder="Nombre" required /></label>
        <label>Organización<input value={newRecord.organization} onChange={(event) => setNewRecord({ ...newRecord, organization: event.target.value })} placeholder="Empresa o institución" /></label>
        <label>Tipo<select value={newRecord.type} onChange={(event) => setNewRecord({ ...newRecord, type: event.target.value })}><option>Informante</option><option>Discovery</option><option>Piloto comercial</option><option>Radar</option><option>Exclusión</option></select></label>
        <label>Función<input value={newRecord.role} onChange={(event) => setNewRecord({ ...newRecord, role: event.target.value })} placeholder="Qué puede enseñarnos o validar" /></label>
        <label>Estado<input value={newRecord.status} onChange={(event) => setNewRecord({ ...newRecord, status: event.target.value })} /></label>
        <label className="field-capture__next">Próximo paso<input value={newRecord.nextAction} onChange={(event) => setNewRecord({ ...newRecord, nextAction: event.target.value })} placeholder="Acción concreta" /></label>
        <button type="submit" className="button button--small"><Icon name="add" /> Agregar al registro</button>
      </form>
      <div className="field-register-grid">
        {records.map((item) => (
          <article className={`field-record field-record--${String(item.type || '').toLowerCase().replaceAll(' ', '-').replaceAll('ó', 'o')}`} key={item.id}>
            <header><span className="field-type">{item.type}</span><span className="field-priority">{item.priority}</span><IconButton icon="delete" label={`Eliminar ${item.actor}`} className="icon-button--danger field-record__delete" onClick={() => removeRecord(item.id, item.actor)} /></header>
            <div className="field-record__title"><div><small>{item.organization}</small><h2>{item.actor}</h2></div><span>{item.access}</span></div>
            <div className="field-record__facts">
              <span><small>Función</small><strong>{item.role}</strong></span>
              <span><small>Lectura comercial</small><strong>{item.commercial}</strong></span>
            </div>
            <label>Estado actual<input value={item.status || ''} onChange={(event) => updateRecord(item.id, { status: event.target.value })} /></label>
            <label>Próximo paso<textarea rows="3" value={item.nextAction || ''} onChange={(event) => updateRecord(item.id, { nextAction: event.target.value })} /></label>
            <details className="field-record__editor"><summary>Ver / editar detalle</summary><div className="field-record__editor-grid">
              <label>Persona / actor<input value={item.actor || ''} onChange={(event) => updateRecord(item.id, { actor: event.target.value })} /></label>
              <label>Organización<input value={item.organization || ''} onChange={(event) => updateRecord(item.id, { organization: event.target.value })} /></label>
              <label>Tipo<select value={item.type || 'Informante'} onChange={(event) => updateRecord(item.id, { type: event.target.value })}><option>Informante</option><option>Discovery</option><option>Piloto comercial</option><option>Radar</option><option>Exclusión</option></select></label>
              <label>Prioridad<input value={item.priority || ''} onChange={(event) => updateRecord(item.id, { priority: event.target.value })} /></label>
              <label>Acceso<input value={item.access || ''} onChange={(event) => updateRecord(item.id, { access: event.target.value })} /></label>
              <label>Función<input value={item.role || ''} onChange={(event) => updateRecord(item.id, { role: event.target.value })} /></label>
              <label className="field-full">Lectura comercial<input value={item.commercial || ''} onChange={(event) => updateRecord(item.id, { commercial: event.target.value })} /></label>
              <label className="field-full">Contexto<textarea rows="4" value={item.context || ''} onChange={(event) => updateRecord(item.id, { context: event.target.value })} /></label>
              <label className="field-full">Límite<textarea rows="3" value={item.limit || ''} onChange={(event) => updateRecord(item.id, { limit: event.target.value })} /></label>
            </div></details>
          </article>
        ))}
      </div>
    </div>
  );
}


function ExpedientesView({ osState, setOsState }) {
  const expedientes = Array.isArray(osState.expedientes) ? osState.expedientes : [];
  const [selectedId, setSelectedId] = useState(expedientes[0]?.id || '');
  const [newForm, setNewForm] = useState({ name: '', sector: '', territory: 'Biobío', owner: 'Francisca' });

  useEffect(() => {
    if (!expedientes.length) return setSelectedId('');
    if (!expedientes.some((item) => item.id === selectedId)) setSelectedId(expedientes[0].id);
  }, [expedientes, selectedId]);

  const selected = expedientes.find((item) => item.id === selectedId) || null;
  const updateExpediente = (id, updater) => setOsState((current) => ({
    ...current,
    expedientes: (current.expedientes || []).map((item) => item.id === id
      ? { ...(typeof updater === 'function' ? updater(item) : { ...item, ...updater }), lastUpdate: new Date().toISOString().slice(0, 10) }
      : item)
  }));

  const addExpediente = (event) => {
    event.preventDefault();
    if (!newForm.name.trim()) return;
    const usedNumbers = expedientes.map((item) => Number(String(item.id).replace(/\D/g, '')) || 0);
    const next = createEmptyExpediente(Math.max(0, ...usedNumbers) + 1);
    const created = { ...next, ...newForm, name: newForm.name.trim(), sector: newForm.sector.trim(), territory: newForm.territory.trim() || 'Biobío' };
    setOsState((current) => ({ ...current, expedientes: [...(current.expedientes || []), created] }));
    setSelectedId(created.id);
    setNewForm({ name: '', sector: '', territory: 'Biobío', owner: 'Francisca' });
  };

  const removeExpediente = (item) => {
    if (!window.confirm(`¿Eliminar ${item.id} · ${item.name}?`)) return;
    setOsState((current) => ({ ...current, expedientes: (current.expedientes || []).filter((entry) => entry.id !== item.id) }));
  };

  const updateToolStatus = (toolId, status) => updateExpediente(selected.id, (item) => ({
    ...item,
    tools: { ...item.tools, [toolId]: { ...(item.tools?.[toolId] || { data: {} }), status } }
  }));

  const updateToolField = (toolId, key, value) => updateExpediente(selected.id, (item) => ({
    ...item,
    tools: {
      ...item.tools,
      [toolId]: {
        ...(item.tools?.[toolId] || { status: 'En curso', data: {} }),
        status: item.tools?.[toolId]?.status === 'Pendiente' ? 'En curso' : (item.tools?.[toolId]?.status || 'En curso'),
        data: { ...(item.tools?.[toolId]?.data || {}), [key]: value }
      }
    }
  }));

  return (
    <div className="admin-view expediente-view">
      <ViewHeading kicker="Validación comercial" title="Expedientes de prospectos" description="Cada prospecto conserva su evidencia, hipótesis, preguntas y avance. El objetivo es aprender sin depender de chats o archivos dispersos." />
      <div className="expediente-summary-strip">
        <span><b>{expedientes.length}</b> expedientes</span>
        <span><b>{expedientes.filter((item) => expedienteProgress(item) === 100).length}</b> listos para siguiente etapa</span>
        <span><b>{expedientes.filter((item) => item.tools?.conversacion?.status === 'Pendiente').length}</b> conversaciones pendientes</span>
      </div>
      <section className="expediente-method-strip" aria-label="Método de trabajo del expediente">
        <div><span className="kicker">Método integrado</span><strong>La herramienta aparece donde se usa</strong><p>No existe un módulo separado de “Método”. Abre cada etapa del expediente para ver cuándo usarla, para qué sirve y cuál es su límite.</p></div>
        <ol>{CONSULTING_TOOLS.map((tool) => <li key={tool.id}><span>{tool.number}</span><div><small>{tool.stage}</small><strong>{tool.title}</strong></div></li>)}</ol>
      </section>

      <div className="expediente-layout">
        <aside className="expediente-sidebar">
          <form className="expediente-new-form" onSubmit={addExpediente}>
            <strong>Nuevo expediente</strong>
            <input aria-label="Nombre del prospecto" placeholder="Nombre del prospecto" value={newForm.name} onChange={(event) => setNewForm({ ...newForm, name: event.target.value })} required />
            <input aria-label="Rubro" placeholder="Rubro o actividad" value={newForm.sector} onChange={(event) => setNewForm({ ...newForm, sector: event.target.value })} />
            <input aria-label="Territorio" placeholder="Territorio" value={newForm.territory} onChange={(event) => setNewForm({ ...newForm, territory: event.target.value })} />
            <select aria-label="Responsable" value={newForm.owner} onChange={(event) => setNewForm({ ...newForm, owner: event.target.value })}>{OWNERS.map((owner) => <option key={owner}>{owner}</option>)}</select>
            <button className="button button--small" type="submit"><Icon name="add" /> Crear expediente</button>
          </form>
          <div className="expediente-list">
            {expedientes.map((item) => {
              const progress = expedienteProgress(item);
              return <button type="button" key={item.id} className={selectedId === item.id ? 'is-active' : ''} onClick={() => setSelectedId(item.id)}><span><b>{item.id}</b><small>{progress}%</small></span><strong>{item.name || 'Sin nombre'}</strong><em>{item.status}</em><div className="expediente-progress"><i style={{ width: `${progress}%` }} /></div></button>;
            })}
          </div>
        </aside>

        {selected ? <section className="expediente-detail">
          <header className="expediente-detail__header">
            <div><span className="kicker">{selected.id}</span><input className="expediente-title-input" value={selected.name} onChange={(event) => updateExpediente(selected.id, { name: event.target.value })} aria-label="Nombre del expediente" /><p>{selected.sector} · {selected.territory}</p></div>
            <div className="expediente-detail__controls"><span className="progress-badge">{expedienteProgress(selected)}% completo</span><select value={selected.status} onChange={(event) => updateExpediente(selected.id, { status: event.target.value })}><option>Prospecto</option><option>Preparación previa</option><option>Conversación</option><option>En espera</option><option>Propuesta</option><option>En pausa</option><option>Cerrado sin conversión</option><option>Cerrado</option><option>Descartado</option></select><IconButton icon="delete" label={`Eliminar ${selected.id}`} className="icon-button--danger" onClick={() => removeExpediente(selected)} /></div>
          </header>
          <div className="expediente-meta-grid">
            <label>Responsable<select value={selected.owner} onChange={(event) => updateExpediente(selected.id, { owner: event.target.value })}>{OWNERS.map((owner) => <option key={owner}>{owner}</option>)}</select></label>
            <label>Rubro<input value={selected.sector} onChange={(event) => updateExpediente(selected.id, { sector: event.target.value })} /></label>
            <label>Territorio<input value={selected.territory} onChange={(event) => updateExpediente(selected.id, { territory: event.target.value })} /></label>
            <label>Última actualización<input value={selected.lastUpdate || ''} readOnly /></label>
          </div>
          <label className="expediente-notes">Nota general<textarea value={selected.notes || ''} onChange={(event) => updateExpediente(selected.id, { notes: event.target.value })} /></label>

          <div className="expediente-tools">
            {CONSULTING_TOOLS.map((tool) => {
              const state = selected.tools?.[tool.id] || { status: 'Pendiente', data: {} };
              return <details className={`expediente-tool expediente-tool--${String(state.status).toLowerCase().replaceAll(' ', '-')}`} key={tool.id} open={tool.id === 'perfil' && selected.id === 'EXP-001'}>
                <summary><span className="expediente-tool__number">{tool.number}</span><div><small>{tool.stage}</small><strong>{tool.title}</strong></div><select aria-label={`Estado de ${tool.title}`} value={state.status} onClick={(event) => event.stopPropagation()} onChange={(event) => updateToolStatus(tool.id, event.target.value)}>{EXPEDIENTE_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></summary>
                <div className="expediente-tool__body">
                  <div className="tool-guidance"><span><b>Cuándo usarla</b>{tool.when}</span><span><b>Para qué sirve</b>{tool.purpose}</span></div>
                  <div className="expediente-fields">
                    {tool.fields.map((field) => {
                      const value = state.data?.[field.key] ?? '';
                      return <label key={field.key} className={field.type === 'textarea' ? 'field-wide' : ''}><span>{field.label}</span>{field.type === 'textarea' ? <textarea value={value} onChange={(event) => updateToolField(tool.id, field.key, event.target.value)} /> : field.type === 'select' ? <select value={value} onChange={(event) => updateToolField(tool.id, field.key, event.target.value)}><option value="">Seleccionar</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input type={field.type} min={field.min} max={field.max} value={value} onChange={(event) => updateToolField(tool.id, field.key, field.type === 'number' ? Number(event.target.value) : event.target.value)} />}</label>;
                    })}
                  </div>
                  <p className="tool-limit"><Icon name="rule" /> {tool.limit}</p>
                </div>
              </details>;
            })}
          </div>
        </section> : <section className="panel-card empty-expediente"><Icon name="folder_open" /><h2>Crea el primer expediente</h2><p>Los expedientes ordenan la evidencia comercial desde el filtro inicial hasta la conversación.</p></section>}
      </div>
    </div>
  );
}

function QuotesView({ quotes, loading, onStatusChange, onRetryEmail, onEdit, onDelete, notice }) {
  return <div className="admin-view quotes-view">
    <ViewHeading kicker="Comercial" title="Oportunidades y cotizaciones" description="Cada solicitud puede revisarse, editarse y eliminarse. El registro comercial es una herramienta viva: corrige datos, agrega contexto y retira entradas que ya no sirven." />
    {notice && <p className={`admin-notice ${notice.type === 'error' ? 'admin-notice--error' : ''}`} role="status">{notice.message}</p>}
    <section className="panel-card">
      <div className="table-page"><table><thead><tr><th>Fecha</th><th>Contacto</th><th>Necesidad</th><th>Correo</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
        {quotes.map((quote) => <tr key={quote.id}>
          <td>{new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(quote.created_at))}</td>
          <td><strong>{quote.contact_name}</strong><small>{quote.company || quote.phone}</small></td>
          <td><details><summary>{quote.service_type}</summary><p>{quote.details}</p>{(quote.project_stage || quote.team_size || quote.desired_date) && <small>{[quote.project_stage, quote.team_size, quote.desired_date].filter(Boolean).join(' · ')}</small>}</details></td>
          <td><span className={`mail-state ${quote.email_sent ? 'is-sent' : 'is-pending'}`}><Icon name={quote.email_sent ? 'check_circle' : 'warning'} />{quote.email_sent ? 'Enviado' : 'Pendiente'}</span>{quote.email_error && <small className="mail-state__error">{quote.email_error}</small>}</td>
          <td><select className="status-select" aria-label={`Cambiar estado de ${quote.contact_name}`} value={quote.status || 'nueva'} onChange={(event) => onStatusChange(quote.id, event.target.value)}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status === 'evaluacion' ? 'En evaluación' : status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select></td>
          <td className="table-actions"><IconButton icon="edit" label={`Editar ${quote.contact_name}`} onClick={() => onEdit(quote)} />{!quote.email_sent && !String(quote.id).startsWith('web-') && <button type="button" className="icon-button" aria-label={`Reintentar correo de ${quote.contact_name}`} title="Reintentar correo" onClick={() => onRetryEmail(quote.id)}><Icon name="refresh" /></button>}{quote.email && <a className="icon-button" aria-label={`Enviar correo a ${quote.contact_name}`} title="Correo" href={`mailto:${quote.email}`}><Icon name="mail" /></a>}{quote.phone && <a className="icon-button" aria-label={`Llamar a ${quote.contact_name}`} title="Teléfono" href={`tel:${String(quote.phone || '').replace(/\D/g, '')}`}><Icon name="phone" /></a>}<IconButton icon="delete" label={`Eliminar ${quote.contact_name}`} className="icon-button--danger" onClick={() => onDelete(quote)} /></td>
        </tr>)}
        {!loading && !quotes.length && <tr><td colSpan="6"><div className="empty-state-inline"><Icon name="request_quote" /><p>No hay oportunidades registradas.</p></div></td></tr>}
      </tbody></table>{loading && <p className="loading-line">Cargando oportunidades…</p>}</div>
    </section>
  </div>;
}

function QuoteEditModal({ quote, onClose, onSave }) {
  const [form, setForm] = useState({ ...quote });
  const dialogRef = useRef(null);
  useEffect(() => { dialogRef.current?.focus(); }, []);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (!String(form.contact_name || '').trim() || !String(form.service_type || '').trim()) return;
    onSave({ ...form, contact_name: String(form.contact_name || '').trim(), service_type: String(form.service_type || '').trim(), details: String(form.details || '').trim() });
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-card quote-edit-modal" role="dialog" aria-modal="true" aria-labelledby="quote-edit-title" tabIndex="-1" ref={dialogRef}><div className="modal-heading"><div><span className="kicker">Registro comercial</span><h2 id="quote-edit-title">Editar oportunidad</h2></div><IconButton icon="close" label="Cerrar ventana" onClick={onClose} /></div><form className="compact-form" onSubmit={submit}>
    <label>Contacto<input name="contact_name" value={form.contact_name || ''} onChange={update} required /></label>
    <label>Empresa<input name="company" value={form.company || ''} onChange={update} /></label>
    <label>Correo<input name="email" type="email" value={form.email || ''} onChange={update} /></label>
    <label>Teléfono<input name="phone" value={form.phone || ''} onChange={update} /></label>
    <label>Ciudad<input name="city" value={form.city || ''} onChange={update} /></label>
    <label>Canal preferido<input name="preferred_contact" value={form.preferred_contact || ''} onChange={update} /></label>
    <label className="field-full">Necesidad / servicio<input name="service_type" value={form.service_type || ''} onChange={update} required /></label>
    <label>Etapa del proyecto<input name="project_stage" value={form.project_stage || ''} onChange={update} /></label>
    <label>Tamaño del equipo<input name="team_size" value={form.team_size || ''} onChange={update} /></label>
    <label>Fecha deseada<input name="desired_date" value={form.desired_date || ''} onChange={update} /></label>
    <label>Estado<select name="status" value={form.status || 'nueva'} onChange={update}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status === 'evaluacion' ? 'En evaluación' : status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select></label>
    <label className="field-full">Detalle y contexto<textarea name="details" rows="6" value={form.details || ''} onChange={update} placeholder="Necesidad, observaciones, información agregada después de la conversación…" /></label>
    <div className="modal-actions field-full"><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button type="submit" className="button"><Icon name="save" /> Guardar cambios</button></div>
  </form></section></div>;
}

function AnalyticsView({ events, loading }) {
  const stats = useMemo(() => {
    const all = Array.isArray(events) ? events : [];
    const today = new Date().toISOString().slice(0, 10);
    const byService = new Map();
    const byType = new Map();
    const todayEvents = all.filter((event) => String(event.created_at || '').slice(0, 10) === today);
    all.forEach((event) => {
      const type = event.event_type || event.eventType || 'evento';
      byType.set(type, (byType.get(type) || 0) + 1);
      if (type === 'service_price_opened') {
        const label = event.label || event.metadata?.serviceTitle || 'Servicio sin nombre';
        byService.set(label, (byService.get(label) || 0) + 1);
      }
    });
    const serviceRanking = Array.from(byService.entries()).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
    const typeRanking = Array.from(byType.entries()).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
    return {
      total: all.length,
      today: todayEvents.length,
      prices: all.filter((event) => (event.event_type || event.eventType) === 'service_price_opened').length,
      requests: all.filter((event) => (event.event_type || event.eventType) === 'formal_request_prepared').length,
      serviceRanking,
      typeRanking,
      latest: all.slice(0, 12)
    };
  }, [events]);

  return <div className="admin-view analytics-view"><ViewHeading kicker="Inteligencia comercial" title="Indicadores de navegación web" description="Registra señales útiles sin invadir: qué servicios despiertan interés, qué rutas se abren y qué solicitudes se preparan desde la vitrina pública." />
    <div className="finance-metrics time-metrics">
      <MetricCard icon="query_stats" label="Interacciones" value={stats.total} note={loading ? 'Cargando…' : 'Eventos registrados'} tone="accent" />
      <MetricCard icon="payments" label="Precios abiertos" value={stats.prices} note="Clics en alcance y valor" />
      <MetricCard icon="request_quote" label="Solicitudes preparadas" value={stats.requests} note="Formulario formal" />
      <MetricCard icon="today" label="Hoy" value={stats.today} note="Actividad del día" />
    </div>
    <div className="analytics-layout">
      <section className="panel-card">
        <div className="panel-card__heading"><div><span className="kicker">Interés por servicio</span><h2>Qué quieren conocer</h2></div></div>
        <div className="analytics-ranking">
          {stats.serviceRanking.length ? stats.serviceRanking.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.count}</strong></div>) : <p className="empty-copy">Aún no hay aperturas de precios registradas.</p>}
        </div>
      </section>
      <section className="panel-card">
        <div className="panel-card__heading"><div><span className="kicker">Tipo de señal</span><h2>Eventos capturados</h2></div></div>
        <div className="analytics-ranking">
          {stats.typeRanking.length ? stats.typeRanking.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.count}</strong></div>) : <p className="empty-copy">Sin eventos disponibles.</p>}
        </div>
      </section>
    </div>
    <section className="panel-card">
      <div className="panel-card__heading"><div><span className="kicker">Últimas señales</span><h2>Bitácora comercial web</h2></div><span className="count-pill">{stats.latest.length}</span></div>
      <div className="table-page"><table><thead><tr><th>Fecha</th><th>Evento</th><th>Detalle</th><th>Ruta</th></tr></thead><tbody>{stats.latest.map((event) => <tr key={event.id}><td>{new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(event.created_at))}</td><td><strong>{event.event_type || event.eventType}</strong></td><td>{event.label || event.metadata?.serviceTitle || 'Sin detalle'}</td><td><small>{event.path || '—'}</small></td></tr>)}{!loading && !stats.latest.length && <tr><td colSpan="4"><div className="empty-state-inline"><Icon name="query_stats" /><p>No hay indicadores web registrados.</p></div></td></tr>}</tbody></table>{loading && <p className="loading-line">Cargando indicadores…</p>}</div>
    </section>
  </div>;
}

function ProjectsView() {
  return <div className="admin-view"><ViewHeading kicker="Gestión interna" title="Proyectos" description="Lectura compacta de etapas, próximos hitos y evidencia esperada." /><p className="admin-notice" role="note">Estos registros describen la configuración inicial. La edición y persistencia individual se incorporarán después de validar el sistema operativo central.</p><div className="project-grid">{initialProjects.map((project) => <article className="project-card" key={project.name}><div className="project-card__top"><span className="status-badge">{project.status}</span><span>{project.progress}%</span></div><span className="kicker">{project.client}</span><h2>{project.name}</h2><p>{project.stage}</p><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div><div className="next-action"><Icon name="arrow_forward" /><span><small>Próxima acción</small><strong>{project.next}</strong></span></div></article>)}</div></div>;
}

function repositoryToolContent(expediente, template) {
  if (!template.sourceTool || !expediente) return '';
  const tool = CONSULTING_TOOLS.find((item) => item.id === template.sourceTool);
  const state = expediente.tools?.[template.sourceTool];
  if (!tool || !state) return '';
  return tool.fields.map((field) => {
    const raw = state.data?.[field.key];
    const value = raw === 0 ? '0' : raw || '—';
    return `${field.label}\n${value}`;
  }).join('\n\n');
}

function repositoryToolStatus(expediente, template) {
  const value = template.sourceTool ? expediente?.tools?.[template.sourceTool]?.status : '';
  if (value === 'Completa') return 'Listo';
  if (value === 'En curso') return 'En curso';
  if (value === 'No aplica') return 'No aplica';
  return 'Pendiente';
}

function DocumentsView({ osState, setOsState, onNavigate }) {
  const expedientes = Array.isArray(osState.expedientes) ? osState.expedientes : [];
  const repository = osState.repository || {};
  const selectedId = expedientes.some((item) => item.id === repository.selectedExpedienteId)
    ? repository.selectedExpedienteId
    : expedientes[0]?.id || '';
  const selected = expedientes.find((item) => item.id === selectedId) || null;
  const companyDocs = repository.documentsByExpediente?.[selectedId] || {};
  const fieldRecords = Array.isArray(osState.fieldRegister) ? osState.fieldRegister : [];
  const today = new Date().toISOString().slice(0, 10);
  const statusOptions = ['Pendiente', 'En curso', 'Listo', 'Bloqueado', 'No aplica'];
  const priorityScore = (value = '') => /máxima/i.test(value) ? 5 : /muy alta/i.test(value) ? 4 : /alta/i.test(value) ? 3 : /media/i.test(value) ? 2 : /baja/i.test(value) ? 1 : 0;
  const compactField = [...fieldRecords]
    .filter((item) => item.type !== 'Exclusión')
    .sort((a, b) => priorityScore(b.priority) - priorityScore(a.priority))
    .slice(0, 6);

  const setSelected = (id) => setOsState((current) => ({
    ...current,
    repository: { ...(current.repository || {}), selectedExpedienteId: id }
  }));

  const effectiveDoc = (template) => {
    const stored = companyDocs[template.id] || {};
    const derived = repositoryToolContent(selected, template);
    return {
      status: stored.status || repositoryToolStatus(selected, template),
      updatedAt: stored.updatedAt || '',
      content: stored.content !== undefined ? stored.content : derived
    };
  };

  const updateDoc = (template, patch) => setOsState((current) => {
    const currentRepository = current.repository || {};
    const byExpediente = currentRepository.documentsByExpediente || {};
    const currentCompany = byExpediente[selectedId] || {};
    const previous = currentCompany[template.id] || {};
    return {
      ...current,
      repository: {
        ...currentRepository,
        selectedExpedienteId: selectedId,
        documentsByExpediente: {
          ...byExpediente,
          [selectedId]: {
            ...currentCompany,
            [template.id]: { ...previous, ...patch, updatedAt: patch.updatedAt !== undefined ? patch.updatedAt : today }
          }
        }
      }
    };
  });

  const syncFromExpediente = (template) => {
    const content = repositoryToolContent(selected, template);
    updateDoc(template, { content, status: repositoryToolStatus(selected, template), updatedAt: today });
  };

  const clearDoc = (template) => {
    if (!window.confirm(`¿Limpiar ${template.title} para ${selected?.name || 'esta empresa'}?`)) return;
    setOsState((current) => {
      const currentRepository = current.repository || {};
      const byExpediente = currentRepository.documentsByExpediente || {};
      const currentCompany = { ...(byExpediente[selectedId] || {}) };
      delete currentCompany[template.id];
      return {
        ...current,
        repository: {
          ...currentRepository,
          documentsByExpediente: { ...byExpediente, [selectedId]: currentCompany }
        }
      };
    });
  };

  const templateStates = repositoryTemplates.map((template) => ({ template, ...effectiveDoc(template) }));
  const ready = templateStates.filter((item) => item.status === 'Listo').length;
  const inProgress = templateStates.filter((item) => item.status === 'En curso').length;
  const blocked = templateStates.filter((item) => item.status === 'Bloqueado').length;
  const categories = [...new Set(repositoryTemplates.map((item) => item.category))];
  const selectedField = /club vegan/i.test(selected?.name || '') ? fieldRecords.find((item) => /club vegan/i.test(item.actor || '')) : null;

  return <div className="admin-view repository-view">
    <ViewHeading kicker="Repositorio operativo" title="Documentos y campo en una sola vista" description="Cada empresa abre su propio expediente documental. Club Vegan queda habilitado como piloto; los documentos se completan solo cuando el proceso real los necesita." />

    <section className="repository-command panel-card">
      <div className="repository-company-picker">
        <span className="kicker">Empresa activa</span>
        <div className="repository-company-picker__row">
          <select value={selectedId} onChange={(event) => setSelected(event.target.value)} disabled={!expedientes.length} aria-label="Seleccionar empresa o expediente">
            {expedientes.map((item) => <option value={item.id} key={item.id}>{item.name || item.id}</option>)}
          </select>
          <button type="button" className="button button--ghost button--small" onClick={() => onNavigate('expedientes')}><Icon name="add" /> Nueva empresa</button>
        </div>
        {selected && <div className="repository-company-meta"><strong>{selected.name}</strong><span>{selected.sector}</span><span>{selected.status}</span><span>Actualizado {formatDate(selected.lastUpdate, { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>}
      </div>
      <div className="repository-metrics">
        <span><b>{repositoryTemplates.length}</b><small>plantillas habilitadas</small></span>
        <span><b>{ready}</b><small>listas</small></span>
        <span><b>{inProgress}</b><small>en curso</small></span>
        <span><b>{blocked}</b><small>bloqueadas por validación</small></span>
      </div>
    </section>

    {selected?.id === 'EXP-001' && <section className="repository-pilot-note">
      <div><Icon name="hourglass_top" /><span><b>Club Vegan · estado real</b> Solo comentó que le gustó el mockup. El 27-08 se envió el mensaje indicando que existe un servicio para pymes a bajo costo por si le interesa y todavía no lo ha visto.</span></div>
      <strong>No enviar propuesta formal ni nuevo mensaje hasta que exista lectura y respuesta.</strong>
    </section>}

    <section className="repository-field panel-card">
      <div className="panel-card__heading repository-section-heading"><div><span className="kicker">Campo comercial · resumen</span><h2>Puertas que estamos observando</h2><p>La vista completa sigue en Campo comercial; aquí solo aparecen las prioridades para decidir rápido.</p></div><button type="button" className="button button--ghost button--small" onClick={() => onNavigate('field')}><Icon name="map" /> Ver registro completo</button></div>
      <div className="repository-field-table">
        {compactField.map((item) => <details key={item.id} className="repository-field-row" open={selectedField?.id === item.id}>
          <summary><span className="repository-field-row__actor"><b>{item.actor}</b><small>{item.organization}</small></span><span className="repository-field-row__type">{item.type}</span><span className="repository-field-row__status">{item.status}</span><span className="repository-field-row__next">{item.nextAction}</span><Icon name="expand_more" /></summary>
          <div className="repository-field-row__detail"><span><small>Función</small><b>{item.role}</b></span><span><small>Lectura comercial</small><b>{item.commercial}</b></span><p>{item.context}</p><p><b>Límite:</b> {item.limit}</p></div>
        </details>)}
      </div>
    </section>

    <section className="repository-documents panel-card">
      <div className="panel-card__heading repository-section-heading"><div><span className="kicker">Expediente documental</span><h2>{selected ? `Documentos · ${selected.name}` : 'Documentos por empresa'}</h2><p>Haz clic en una fila para ver cuándo usarla, revisar su descripción y desarrollar el contenido. Guardar cambios persiste el trabajo en Metamorfosis OS.</p></div><span className="count-pill">{repositoryTemplates.length}</span></div>
      {!selected ? <div className="empty-state-inline"><Icon name="folder_open" /><p>Crea un expediente para habilitar sus documentos.</p></div> : <div className="repository-category-grid">
        {categories.map((category, categoryIndex) => {
          const categoryTemplates = repositoryTemplates.filter((item) => item.category === category);
          const categoryReady = categoryTemplates.filter((template) => effectiveDoc(template).status === 'Listo').length;
          return <details className="repository-category" key={category} open={categoryIndex === 0}>
            <summary><span><Icon name={category === 'Administrativos' ? 'briefcase' : category === 'Metodológicos' ? 'menu_book' : category === 'Operativos' ? 'folder_open' : 'account_tree'} /><b>{category}</b></span><small>{categoryReady}/{categoryTemplates.length} listos</small><Icon name="expand_more" /></summary>
            <div className="repository-document-list">
              {categoryTemplates.map((template) => {
                const doc = effectiveDoc(template);
                return <details className={`repository-document repository-document--${String(doc.status).toLowerCase().replaceAll(' ', '-').replaceAll('ó', 'o')}`} key={template.id}>
                  <summary><span className="repository-document__name"><Icon name={template.icon} /><span><b>{template.title}</b><small>{template.activate}</small></span></span><span className="repository-document__status">{doc.status}</span><Icon name="expand_more" /></summary>
                  <div className="repository-document__body">
                    <div className="repository-document__guidance"><p>{template.description}</p><span><b>Se activa:</b> {template.activate}</span></div>
                    <div className="repository-document__controls">
                      <label>Estado<select value={doc.status} onChange={(event) => updateDoc(template, { status: event.target.value })}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
                      <label>Última edición<input type="date" value={doc.updatedAt || ''} onChange={(event) => updateDoc(template, { updatedAt: event.target.value })} /></label>
                      {template.sourceTool && <button type="button" className="button button--ghost button--small" onClick={() => syncFromExpediente(template)}><Icon name="sync" /> Sincronizar expediente</button>}
                      {template.navigateTo && <button type="button" className="button button--ghost button--small" onClick={() => onNavigate(template.navigateTo)}><Icon name="open_in_new" /> Abrir módulo</button>}
                      <button type="button" className="button button--ghost button--small repository-document__delete" onClick={() => clearDoc(template)}><Icon name="delete" /> Limpiar documento</button>
                    </div>
                    <label className="repository-document__editor">Contenido de trabajo<textarea rows="9" value={doc.content || ''} onChange={(event) => updateDoc(template, { content: event.target.value })} placeholder="Desarrollar este documento cuando el proceso lo requiera…" /></label>
                  </div>
                </details>;
              })}
            </div>
          </details>;
        })}
      </div>}
    </section>
  </div>;
}

function GenericView({ active }) {
  const content = {
    assets: ['Activos intangibles', 'Marcas, métodos, diseños, experiencias, software, bases de datos y know-how.'],
    library: ['Biblioteca metodológica', 'Herramientas oficiales, versiones, instrucciones de uso y aprendizajes.'],
    consulting: ['Consultoría y consolidación', 'Proceso temporal ubicado al final del menú para no desplazar la operación permanente.']
  }[active] || ['Módulo', 'Vista interna en preparación.'];
  return <div className="admin-view"><ViewHeading kicker="Metamorfosis OS" title={content[0]} description={content[1]} /><section className="panel-card empty-state"><span><Icon name="construction" /></span><h2>Módulo delimitado, aún sin persistencia específica</h2><p>El sistema no simula datos ni acciones. Esta sección se activará cuando exista un flujo real, campos validados y una decisión sobre su integración documental.</p></section></div>;
}

function TaskModal({ draft, onClose, onSave }) {
  const [form, setForm] = useState(draft);
  const dialogRef = useRef(null);
  useEffect(() => { dialogRef.current?.focus(); }, []);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => { event.preventDefault(); if (!form.title.trim() || !form.date) return; onSave({ ...form, id: form.id || crypto.randomUUID(), title: form.title.trim(), status: form.status || 'pending', comments: Array.isArray(form.comments) ? form.comments : [] }); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="task-modal-title" tabIndex="-1" ref={dialogRef}><div className="modal-heading"><div><span className="kicker">Sistema operativo</span><h2 id="task-modal-title">{form.id ? 'Editar tarea' : 'Agregar tarea'}</h2></div><IconButton icon="close" label="Cerrar ventana" onClick={onClose} /></div><form className="compact-form" onSubmit={submit}><label>Fecha<input name="date" type="date" value={form.date} onChange={update} required /></label><label>Responsable<select name="owner" value={form.owner} onChange={update}>{OWNERS.map((owner) => <option key={owner}>{owner}</option>)}</select></label><label>Inicio<input name="start" type="time" value={form.start} onChange={update} /></label><label>Fin<input name="end" type="time" value={form.end} onChange={update} /></label><label className="field-full">Tarea<input name="title" value={form.title} onChange={update} required /></label><label>Tópico<select name="topic" value={form.topic} onChange={update}>{TOPICS.map((topic) => <option key={topic}>{topic}</option>)}</select></label><label>Estado<select name="status" value={form.status} onChange={update}><option value="pending">Pendiente</option><option value="waiting">En espera</option><option value="done">Terminada</option></select></label><label className="field-full">Explicación concreta<textarea name="explain" value={form.explain} onChange={update} /></label><label className="field-full">Por qué importa<textarea name="why" value={form.why} onChange={update} /></label><label className="field-full">Termina cuando<textarea name="done_when" value={form.done_when} onChange={update} /></label><div className="modal-actions field-full"><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button type="submit" className="button"><Icon name="save" /> Guardar tarea</button></div></form></section></div>;
}

function AdminShell({ session, onLogout }) {
  const [active, setActive] = useState(() => {
    const hashView = window.location.hash.replace(/^#/, '');
    const queryWorkspace = new URLSearchParams(window.location.search).get('workspace');
    // El dominio raíz siempre abre Empresa. La vista Familiar se activa solo de forma explícita.
    const candidate = hashView || (queryWorkspace === 'family' ? 'family-overview' : queryWorkspace === 'business' ? 'dashboard' : 'dashboard');
    const normalized = LEGACY_VIEW_MAP[candidate] || candidate;
    return normalized && ALL_ADMIN_KEYS.has(normalized) ? normalized : 'dashboard';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [osState, setOsStateRaw] = useState(createDefaultOsState);
  const [dirty, setDirty] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [webEvents, setWebEvents] = useState([]);
  const [loadingWebEvents, setLoadingWebEvents] = useState(false);
  const [taskDraft, setTaskDraft] = useState(null);
  const [quoteDraft, setQuoteDraft] = useState(null);
  const importRef = useRef(null);

  useEffect(() => {
    const syncViewFromUrl = () => {
      const hashView = window.location.hash.replace(/^#/, '');
      const normalized = LEGACY_VIEW_MAP[hashView] || hashView;
      if (normalized && ALL_ADMIN_KEYS.has(normalized)) {
        setActive(normalized);
        window.localStorage.setItem('metamorfosis-admin-view', normalized);
      }
    };
    window.addEventListener('hashchange', syncViewFromUrl);
    return () => window.removeEventListener('hashchange', syncViewFromUrl);
  }, []);

  const setOsState = (updater) => {
    setOsStateRaw((current) => hydrateState(typeof updater === 'function' ? updater(current) : updater));
    setDirty(true);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/os-state');
        const payload = await response.json();
        if (response.ok && payload.state) {
          const needsMigration = String(payload.state.version || '') !== OS_SCHEMA_VERSION;
          setOsStateRaw(hydrateState(payload.state));
          if (needsMigration) {
            setDirty(true);
            setNotice({ type: 'success', message: 'Metamorfosis OS fue actualizado a la arquitectura 10.7: planificación vigente 31/08–04/09, agenda compartida con compromisos de Benjamín e Inicio reducido a resumen. Guarda los cambios para persistir la migración.' });
          }
        } else {
          const key = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS].find((item) => window.localStorage.getItem(item));
          const local = key ? window.localStorage.getItem(key) : null;
          if (local) {
            const parsed = JSON.parse(local);
            const needsMigration = String(parsed?.version || '') !== OS_SCHEMA_VERSION;
            setOsStateRaw(hydrateState(parsed));
            if (needsMigration) {
              setDirty(true);
              setNotice({ type: 'success', message: 'Se recuperó tu borrador anterior y se migró a Metamorfosis OS 10.7. Guarda los cambios para consolidarlo.' });
            }
          }
        }
      } catch {
        try {
          const key = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS].find((item) => window.localStorage.getItem(item));
          const local = key ? window.localStorage.getItem(key) : null;
          if (local) setOsStateRaw(hydrateState(JSON.parse(local)));
        } catch { /* ignore invalid local draft */ }
      } finally { setLoadingState(false); }
    };
    load();
  }, []);

  useEffect(() => { if (!loadingState) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(osState)); }, [osState, loadingState]);

  const readPublicQuotes = () => {
    try {
      const local = JSON.parse(window.localStorage.getItem(PUBLIC_QUOTES_KEY) || '[]');
      return Array.isArray(local) ? local : [];
    } catch {
      return [];
    }
  };

  const writePublicQuotes = (items) => {
    try { window.localStorage.setItem(PUBLIC_QUOTES_KEY, JSON.stringify(items)); } catch { /* ignore */ }
  };

  const mergeQuotes = (remoteQuotes, localQuotes) => {
    const map = new Map();
    [...localQuotes, ...remoteQuotes].forEach((quote) => {
      if (!quote?.id) return;
      map.set(quote.id, { status: 'nueva', ...quote });
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  };

  const readPublicEvents = () => {
    try {
      const local = JSON.parse(window.localStorage.getItem(PUBLIC_EVENTS_KEY) || '[]');
      return Array.isArray(local) ? local : [];
    } catch {
      return [];
    }
  };

  const mergeEvents = (remoteEvents, localEvents) => {
    const map = new Map();
    [...localEvents, ...remoteEvents].forEach((event) => {
      if (!event?.id) return;
      map.set(event.id, event);
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  };

  useEffect(() => {
    setLoadingQuotes(true);
    const localQuotes = readPublicQuotes();
    fetch('/api/quotes')
      .then((response) => response.json())
      .then((payload) => setQuotes(mergeQuotes(Array.isArray(payload.quotes) ? payload.quotes : [], localQuotes)))
      .catch(() => setQuotes(localQuotes))
      .finally(() => setLoadingQuotes(false));
  }, [session]);


  useEffect(() => {
    setLoadingWebEvents(true);
    const localEvents = readPublicEvents();
    fetch('/api/events')
      .then((response) => response.json())
      .then((payload) => setWebEvents(mergeEvents(Array.isArray(payload.events) ? payload.events : [], localEvents)))
      .catch(() => setWebEvents(localEvents))
      .finally(() => setLoadingWebEvents(false));
  }, [session]);

  useEffect(() => {
    const syncLocalPublicData = (event) => {
      if (!event.key || event.key === PUBLIC_QUOTES_KEY) {
        const localQuotes = readPublicQuotes();
        setQuotes((current) => mergeQuotes(current, localQuotes));
      }
      if (!event.key || event.key === PUBLIC_EVENTS_KEY) {
        const localEvents = readPublicEvents();
        setWebEvents((current) => mergeEvents(current, localEvents));
      }
    };
    window.addEventListener('storage', syncLocalPublicData);
    return () => window.removeEventListener('storage', syncLocalPublicData);
  }, []);

  const saveState = async () => {
    setSaving(true); setNotice(null);
    try {
      const response = await fetch('/api/os-state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: osState }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'No fue posible guardar el sistema.');
      setDirty(false); setNotice({ type: 'success', message: payload.saved === false ? 'Borrador guardado en este navegador. Conecta PostgreSQL para persistencia compartida.' : 'Sistema guardado correctamente.' });
    } catch (error) { setNotice({ type: 'error', message: error.message }); }
    finally { setSaving(false); }
  };

  const updateQuoteStatus = async (id, status) => {
    const previous = quotes;
    const nextQuotes = quotes.map((quote) => quote.id === id ? { ...quote, status } : quote);
    setQuotes(nextQuotes);
    const nextLocalQuotes = readPublicQuotes().map((quote) => quote.id === id ? { ...quote, status } : quote);
    writePublicQuotes(nextLocalQuotes);
    if (String(id).startsWith('web-')) {
      setNotice({ type: 'success', message: 'Estado comercial actualizado en este navegador.' });
      return;
    }
    try {
      const response = await fetch(`/api/quotes/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error();
      setNotice({ type: 'success', message: 'Estado comercial actualizado.' });
    }
    catch {
      setQuotes(previous);
      setNotice({ type: 'error', message: 'No fue posible guardar el cambio.' });
    }
  };

  const saveQuote = async (quote) => {
    const previous = quotes;
    const nextQuotes = quotes.map((item) => item.id === quote.id ? { ...item, ...quote } : item);
    setQuotes(nextQuotes);
    const localQuotes = readPublicQuotes();
    if (localQuotes.some((item) => item.id === quote.id)) {
      writePublicQuotes(localQuotes.map((item) => item.id === quote.id ? { ...item, ...quote } : item));
    }
    if (String(quote.id).startsWith('web-')) {
      setQuoteDraft(null);
      setNotice({ type: 'success', message: 'Oportunidad editada en este navegador.' });
      return;
    }
    try {
      const response = await fetch(`/api/quotes/${quote.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(quote) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'No fue posible editar la oportunidad.');
      setQuoteDraft(null);
      setNotice({ type: 'success', message: 'Oportunidad actualizada.' });
    } catch (error) {
      setQuotes(previous);
      setNotice({ type: 'error', message: error.message || 'No fue posible editar la oportunidad.' });
    }
  };

  const deleteQuote = async (quote) => {
    if (!window.confirm(`¿Eliminar la oportunidad de ${quote.contact_name}? Esta acción no se puede deshacer.`)) return;
    const previous = quotes;
    setQuotes((current) => current.filter((item) => item.id !== quote.id));
    const localQuotes = readPublicQuotes();
    if (localQuotes.some((item) => item.id === quote.id)) writePublicQuotes(localQuotes.filter((item) => item.id !== quote.id));
    if (String(quote.id).startsWith('web-')) {
      setNotice({ type: 'success', message: 'Oportunidad eliminada de este navegador.' });
      return;
    }
    try {
      const response = await fetch(`/api/quotes/${quote.id}`, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'No fue posible eliminar la oportunidad.');
      setNotice({ type: 'success', message: 'Oportunidad eliminada.' });
    } catch (error) {
      setQuotes(previous);
      setNotice({ type: 'error', message: error.message || 'No fue posible eliminar la oportunidad.' });
    }
  };

  const retryQuoteEmail = async (id) => {
    setNotice({ type: 'success', message: 'Reintentando envío de correo…' });
    try {
      const response = await fetch(`/api/quotes/${id}/resend-email`, { method: 'POST' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'No fue posible reenviar el correo.');
      setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, email_sent: true, email_error: null, email_sent_at: new Date().toISOString() } : quote));
      setNotice({ type: 'success', message: 'Correo reenviado correctamente.' });
    } catch (error) {
      setNotice({ type: 'error', message: error.message || 'No fue posible reenviar el correo.' });
    }
  };

  const navigate = (key) => {
    const normalized = LEGACY_VIEW_MAP[key] || key;
    if (!ALL_ADMIN_KEYS.has(normalized)) return;
    setActive(normalized);
    window.localStorage.setItem('metamorfosis-admin-view', normalized);
    const nextUrl = `${window.location.pathname}${window.location.search}#${normalized}`;
    window.history.replaceState(null, '', nextUrl);
    setMenuOpen(false);
  };
  const mode = FAMILY_KEYS.has(active) ? 'family' : 'business';
  const menuGroups = mode === 'family' ? FAMILY_MENU_GROUPS : BUSINESS_MENU_GROUPS;
  const openTask = (defaults = {}) => setTaskDraft({ id: '', date: osState.selectedDate, start: '09:00', end: '10:00', owner: 'Francisca', topic: 'Metamorfosis', title: '', explain: '', why: '', done_when: '', status: 'pending', comments: [], ...defaults });
  const saveTask = (task) => { setOsState((current) => ({ ...current, selectedDate: task.date, tasks: current.tasks.some((item) => item.id === task.id) ? current.tasks.map((item) => item.id === task.id ? task : item) : [...current.tasks, task] })); setTaskDraft(null); };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(osState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = `metamorfosis-os-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url);
  };
  const importBackup = async (event) => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    try { const parsed = JSON.parse(await file.text()); const candidate = parsed.state || parsed; if (!Array.isArray(candidate.tasks)) throw new Error('El archivo no contiene un respaldo compatible.'); setOsState(hydrateState(candidate)); setNotice({ type: 'success', message: 'Respaldo importado. Revisa y guarda para persistir los cambios.' }); }
    catch (error) { setNotice({ type: 'error', message: error.message }); }
  };

  const currentItem = [...BUSINESS_MENU_GROUPS, ...FAMILY_MENU_GROUPS].flatMap((group) => group.items).find(([key]) => key === active);
  const view = active === 'dashboard' ? <DashboardView osState={osState} quotes={quotes} dirty={dirty} onNavigate={navigate} onAddTask={openTask} />
    : active === 'month' ? <MonthView osState={osState} setOsState={setOsState} onNavigate={navigate} onAddTask={openTask} />
      : active === 'day' ? <DayView osState={osState} setOsState={setOsState} onAddTask={openTask} onEditTask={setTaskDraft} />
        : active === 'field' ? <FieldRegisterView osState={osState} setOsState={setOsState} />
        : active === 'expedientes' ? <ExpedientesView osState={osState} setOsState={setOsState} />
          : active === 'quotes' ? <QuotesView quotes={quotes} loading={loadingQuotes} onStatusChange={updateQuoteStatus} onRetryEmail={retryQuoteEmail} onEdit={setQuoteDraft} onDelete={deleteQuote} notice={notice} />
            : active === 'finance' ? <FinanceView osState={osState} setOsState={setOsState} />
              : active === 'metrics' ? <TimeTrackingView osState={osState} setOsState={setOsState} />
                : active === 'documents' ? <DocumentsView osState={osState} setOsState={setOsState} onNavigate={navigate} />
                  : active === 'fronts' ? <FrontsView osState={osState} setOsState={setOsState} />
                  : FAMILY_KEYS.has(active) ? <FamilyView osState={osState} setOsState={setOsState} section={active} />
                    : <GenericView active={active} />;

  if (loadingState) return <div className="app-loading"><Brand mode={mode} /><span>Cargando sistema operativo…</span></div>;

  return (
    <div className={`admin-frame admin-frame--${mode}`}>
      <a className="skip-link" href="#admin-main">Saltar al contenido del panel</a>
      <header className="admin-header">
        <div className="admin-header__brand"><IconButton icon="menu" label="Abrir menú" className="admin-menu-button" onClick={() => setMenuOpen(true)} /><Brand mode={mode} /></div>
        <WorkspaceSwitch mode={mode} />
        <div className="admin-header__actions">
          <a className="admin-action-button admin-action-button--public" href={PUBLIC_SITE_URL}><Icon name="public" /><span>Sitio público</span></a>
          <IconButton icon="upload" label="Importar respaldo JSON" onClick={() => importRef.current?.click()} />
          <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} />
          <IconButton icon="download" label="Descargar respaldo JSON" onClick={exportBackup} />
          <button type="button" className={`admin-action-button ${dirty ? 'is-dirty' : ''}`} onClick={saveState} disabled={saving}><Icon name="save" /><span>{saving ? 'Guardando…' : dirty ? 'Guardar cambios' : 'Guardado'}</span></button>
          <button type="button" className="admin-action-button admin-action-button--exit" onClick={onLogout}><Icon name="logout" /><span>Salir</span></button>
        </div>
      </header>
      <div className="admin-body">
        <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label={mode === 'family' ? 'Navegación familiar' : 'Navegación empresarial'}>
          <div className="sidebar-heading"><strong>{mode === 'family' ? 'Familia' : 'Empresa'}</strong><IconButton icon="close" label="Cerrar menú" className="sidebar-close" onClick={() => setMenuOpen(false)} /></div>
          <nav className="sidebar-nav--efficient">
            {menuGroups.map((group) => <section className="sidebar-simple-group" key={group.id}>
              <span className="sidebar-section-label">{group.label}</span>
              <div className="sidebar-submenu sidebar-submenu--always">{group.items.map(([key, label, icon]) => <button type="button" key={key} className={active === key ? 'is-active' : ''} onClick={() => navigate(key)} aria-current={active === key ? 'page' : undefined}><Icon name={icon} /><span>{label}</span></button>)}</div>
            </section>)}
          </nav>
          <div className="sidebar-footer">
            {mode === 'family' ? <div className="sidebar-family-signature"><img src="/familia-metamorfosis.webp" alt="" /><div><strong>Espacio familiar</strong><small>Separado de la gestión empresarial</small></div></div> : <div className="admin-user"><span>ML</span><div><strong>Administración</strong><small>{session.demo ? 'Modo demostración' : session.email}</small></div></div>}
          </div>
        </aside>
        {menuOpen && <button type="button" className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
        <main id="admin-main" className="admin-main">
          <div className="admin-breadcrumb"><span>{currentItem?.[1] || (mode === 'family' ? 'Resumen familiar' : 'Inicio')}</span><em className="admin-context-badge">{mode === 'family' ? 'Familiar' : 'Empresa'}</em>{notice && active !== 'quotes' && <p className={`save-notice ${notice.type === 'error' ? 'is-error' : ''}`} role="status">{notice.message}</p>}</div>
          {view}
        </main>
      </div>
      {taskDraft && <TaskModal draft={taskDraft} onClose={() => setTaskDraft(null)} onSave={saveTask} />}
      {quoteDraft && <QuoteEditModal quote={quoteDraft} onClose={() => setQuoteDraft(null)} onSave={saveQuote} />}
    </div>
  );

}

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error al renderizar Metamorfosis OS:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="admin-fatal-error" role="alert">
        <div className="admin-fatal-error__card">
          <Brand />
          <span className="kicker">Recuperación del sistema</span>
          <h1>No fue posible cargar el panel</h1>
          <p>El servidor respondió, pero la interfaz encontró un error de ejecución. El diagnóstico siguiente permite identificarlo sin ocultarlo.</p>
          <details className="admin-runtime-diagnostic" open><summary>Detalle técnico</summary><code>{this.state.error?.message || 'Error de renderizado sin mensaje'}</code></details>
          <div className="admin-fatal-error__actions">
            <button className="button" type="button" onClick={() => window.location.reload()}><Icon name="refresh" /> Recargar OS</button>
            <button className="button button--ghost-light" type="button" onClick={() => { try { window.localStorage.removeItem('metamorfosis-admin-view'); } catch {} window.location.href = '/?workspace=business#dashboard'; }}><Icon name="dashboard" /> Abrir Empresa</button>
            <a href="/api/health" target="_blank" rel="noreferrer">Ver diagnóstico del servidor</a>
          </div>
        </div>
      </div>
    );
  }
}

function AdminAppContent() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let mounted = true;
    fetchJsonWithTimeout('/api/session', {}, 15000)
      .then(({ payload }) => { if (mounted) setSession(payload.authenticated ? payload : null); })
      .catch(() => { if (mounted) setSession(null); })
      .finally(() => { if (mounted) setChecking(false); });
    return () => { mounted = false; };
  }, []);
  const logout = async () => { try { await fetch('/api/logout', { method: 'POST' }); } catch { /* no-op */ } setSession(null); };
  if (checking) return <div className="app-loading"><Brand /><span>Comprobando sesión…</span></div>;
  if (!session) return <AdminLogin onLogin={setSession} />;
  return <AdminShell session={session} onLogout={logout} />;
}

export default function AdminApp() {
  return <AdminErrorBoundary><AdminAppContent /></AdminErrorBoundary>;
}

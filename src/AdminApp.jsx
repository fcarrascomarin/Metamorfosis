import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './components/Icon.jsx';
import { documents, initialProjects } from './data.js';
import { createDefaultOsState, OS_SCHEMA_VERSION, OWNERS, TOPICS } from './osSeed.js';
import { CONSULTING_TOOLS, EXPEDIENTE_STATUSES, createEmptyExpediente, expedienteProgress } from './consultingTools.js';

const STORAGE_KEY = 'metamorfosis-os-draft-v9';
const LEGACY_STORAGE_KEYS = ['metamorfosis-os-draft-v8', 'metamorfosis-os-draft-v7', 'metamorfosis-os-draft-v6'];
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
      ['documents', 'Repositorio', 'folder_open']
    ]
  }
];

const FAMILY_MENU_GROUPS = [
  {
    id: 'familia',
    label: 'Vida familiar',
    items: [
      ['family-overview', 'Resumen', 'home'],
      ['family-week', 'Semana y bienestar', 'calendar_month'],
      ['family-money', 'Caja familiar', 'savings'],
      ['family-home', 'Hogar y pendientes', 'construction']
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
  'Cierre semanal del sistema'
]);
const RETIRED_PROJECT_PATTERN = /CM|Banquetería|Consolidación/i;

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
  const timeProjects = Array.isArray(currentTracking.projects)
    ? currentTracking.projects.filter((project) => !RETIRED_PROJECT_PATTERN.test(`${project?.name || ''} ${project?.client || ''}`))
    : fallback.timeTracking.projects;
  const projectIds = new Set(timeProjects.map((project) => project.id));
  const timeEntries = Array.isArray(currentTracking.entries)
    ? currentTracking.entries.filter((entry) => projectIds.has(entry.projectId))
    : fallback.timeTracking.entries;

  const family = candidate.family && typeof candidate.family === 'object' ? candidate.family : {};
  const workFronts = (Array.isArray(family.workFronts) ? family.workFronts : fallback.family.workFronts)
    .filter((front) => !RETIRED_PROJECT_PATTERN.test(front?.name || ''));
  const inventory = (Array.isArray(family.inventory) ? family.inventory : fallback.family.inventory)
    .filter((item) => !RETIRED_PROJECT_PATTERN.test(item?.title || ''));
  const weeklyActions = (Array.isArray(family.weeklyActions) ? family.weeklyActions : fallback.family.weeklyActions)
    .filter((item) => !RETIRED_PROJECT_PATTERN.test(item?.title || ''));

  const candidateFronts = (Array.isArray(candidate.fronts) ? candidate.fronts : [])
    .filter((front) => !RETIRED_PROJECT_PATTERN.test(front?.name || ''));
  const frontsByName = new Map([...fallback.fronts, ...candidateFronts].map((front) => [front.name, front]));
  const decisions = (Array.isArray(candidate.decisions) ? candidate.decisions : fallback.decisions)
    .filter((decision) => !RETIRED_PROJECT_PATTERN.test(decision || ''));

  return {
    ...candidate,
    version: OS_SCHEMA_VERSION,
    selectedDate: candidate.selectedDate && candidate.selectedDate >= '2026-08-24' ? candidate.selectedDate : '2026-08-24',
    tasks,
    guides: { ...(candidate.guides || {}), ...fallback.guides },
    fronts: [...frontsByName.values()],
    decisions: [...fallback.decisions, ...decisions.filter((decision) => !fallback.decisions.includes(decision))],
    expedientes: Array.isArray(candidate.expedientes) && candidate.expedientes.length ? candidate.expedientes : fallback.expedientes,
    timeTracking: { ...fallback.timeTracking, ...currentTracking, projects: timeProjects, entries: timeEntries },
    family: {
      ...fallback.family,
      ...family,
      weekLabel: 'Semana del 24 al 30 de agosto de 2026',
      weeklyActions,
      workFronts,
      inventory
    }
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
    decisions: Array.isArray(candidate.decisions) ? candidate.decisions : fallback.decisions,
    inbox: (Array.isArray(candidate.inbox) ? candidate.inbox : fallback.inbox).map(normalizeId),
    expedientes: Array.isArray(candidate.expedientes) ? candidate.expedientes : fallback.expedientes,
    family: {
      ...fallback.family,
      ...(candidate.family || {}),
      wellbeing: (Array.isArray(candidate.family?.wellbeing) ? candidate.family.wellbeing : fallback.family.wellbeing).map(normalizeId),
      weeklyActions: (Array.isArray(candidate.family?.weeklyActions) ? candidate.family.weeklyActions : fallback.family.weeklyActions).map(normalizeId),
      workFronts: (Array.isArray(candidate.family?.workFronts) ? candidate.family.workFronts : fallback.family.workFronts).map(normalizeId),
      cycle: { ...fallback.family.cycle, ...(candidate.family?.cycle || {}) },
      home: {
        ...fallback.family.home,
        ...(candidate.family?.home || {}),
        checklist: (Array.isArray(candidate.family?.home?.checklist) ? candidate.family.home.checklist : fallback.family.home.checklist).map(normalizeId)
      },
      inventory: (Array.isArray(candidate.family?.inventory) ? candidate.family.inventory : fallback.family.inventory).map(normalizeId),
      exclusions: Array.isArray(candidate.family?.exclusions) ? candidate.family.exclusions : fallback.family.exclusions
    }
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

function DashboardView({ osState, quotes, dirty, onNavigate, onAddTask }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = osState.tasks.filter((task) => task.date === today);
  const pendingToday = todayTasks.filter((task) => task.status !== 'done');
  const nextSeven = new Date(`${today}T12:00:00`); nextSeven.setDate(nextSeven.getDate() + 7);
  const nextSevenIso = nextSeven.toISOString().slice(0, 10);
  const upcoming = osState.tasks.filter((task) => task.status !== 'done' && task.date >= today && task.date <= nextSevenIso);
  const openQuotes = quotes.filter((quote) => !['cerrada', 'descartada'].includes(quote.status)).length;
  const expedientes = Array.isArray(osState.expedientes) ? osState.expedientes : [];
  const activeExpedientes = expedientes.filter((item) => !['Cerrado', 'Descartado'].includes(item.status));
  const conversationPending = activeExpedientes.filter((item) => item.tools?.conversation?.status !== 'Completa').length;

  return (
    <div className="admin-view">
      <ViewHeading kicker="Panel diario" title="Panel de control Metamorfosis" description="Accesos rápidos y señales que requieren una decisión concreta hoy." action={<button type="button" className="button button--small" onClick={() => onAddTask({ date: today })}><Icon name="add" /> Nueva tarea</button>} />
      <div className="quick-actions" aria-label="Acciones frecuentes">
        <button type="button" onClick={() => onNavigate('day')}><Icon name="today" />Agenda de hoy</button>
        <button type="button" onClick={() => onNavigate('expedientes')}><Icon name="folder_open" />Expedientes</button>
        <button type="button" onClick={() => onNavigate('quotes')}><Icon name="request_quote" />Oportunidades</button>
        <button type="button" onClick={() => onNavigate('finance')}><Icon name="payments" />Finanzas</button>
        <button type="button" onClick={() => onNavigate('metrics')}><Icon name="query_stats" />Tiempo y rentabilidad</button>
        <button type="button" onClick={() => onNavigate('documents')}><Icon name="folder_open" />Repositorio</button>
      </div>
      <div className="metrics-grid">
        <MetricCard icon="task_alt" label="Pendientes de hoy" value={pendingToday.length} note={`${todayTasks.length} tareas cargadas`} />
        <MetricCard icon="schedule" label="Próximos 7 días" value={upcoming.length} note="Tareas sin cerrar" />
        <MetricCard icon="request_quote" label="Oportunidades abiertas" value={openQuotes} note={`${quotes.length} registros totales`} tone="accent" />
        <MetricCard icon="folder_open" label="Expedientes activos" value={activeExpedientes.length} note={`${expedientes.length} expedientes registrados`} />
        <MetricCard icon="forum" label="Conversaciones pendientes" value={conversationPending} note="Prospectos que aún deben validarse" tone={conversationPending ? 'warning' : ''} />
        <MetricCard icon={dirty ? 'warning' : 'save'} label="Estado del sistema" value={dirty ? 'Sin guardar' : 'Guardado'} note="Persistencia del panel" tone={dirty ? 'warning' : ''} />
      </div>
      <div className="dashboard-grid">
        <section className="panel-card panel-card--wide">
          <div className="panel-card__heading"><div><span className="kicker">Operación diaria</span><h2>Lo que debe cerrarse hoy</h2></div><button type="button" className="text-button" onClick={() => onNavigate('day')}>Ver día completo</button></div>
          <div className="compact-task-list">
            {pendingToday.length ? pendingToday.map((task) => <div className="compact-task" key={task.id}><span>{task.start || '—'}</span><div><strong>{task.title}</strong><small>{task.owner} · {task.topic}</small></div></div>) : <div className="empty-inline"><Icon name="check_circle" /><span>No hay tareas pendientes registradas para hoy.</span></div>}
          </div>
        </section>
        <section className="panel-card">
          <div className="panel-card__heading"><div><span className="kicker">Dirección</span><h2>Decisiones vigentes</h2></div></div>
          <div className="decision-list">{osState.decisions.slice(0, 4).map((decision, index) => <div key={`${decision}-${index}`}><span>{index + 1}</span><p>{decision}</p></div>)}</div>
        </section>
        <section className="panel-card">
          <div className="panel-card__heading"><div><span className="kicker">Comercial</span><h2>Expedientes en curso</h2></div><button type="button" className="text-button" onClick={() => onNavigate('expedientes')}>Abrir expedientes</button></div>
          {activeExpedientes.length ? activeExpedientes.slice(0, 4).map((item) => {
            const progress = expedienteProgress(item);
            return <div className="project-line" key={item.id}><div><strong>{item.id} · {item.name}</strong><small>{item.status} · {item.territory || 'Territorio por definir'}</small></div><span>{progress}%</span></div>;
          }) : <p className="empty-copy">Todavía no hay expedientes comerciales activos.</p>}
        </section>
        <section className="panel-card">
          <div className="panel-card__heading"><div><span className="kicker">Validación</span><h2>Próximas acciones</h2></div><button type="button" className="text-button" onClick={() => onNavigate('expedientes')}>Ver avance</button></div>
          {initialProjects.map((project) => <div className="project-line" key={project.name}><div><strong>{project.name}</strong><small>{project.stage}</small></div><span>{project.progress}%</span></div>)}
        </section>
      </div>
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

function MonthView({ osState, setOsState, onNavigate, onAddTask }) {
  const selected = new Date(`${osState.selectedDate}T12:00:00`);
  const [cursor, setCursor] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1, 12));
  const days = useMemo(() => getMonthDays(cursor), [cursor]);
  const title = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(cursor);
  const tasksByDate = useMemo(() => osState.tasks.reduce((acc, task) => { (acc[task.date] ||= []).push(task); return acc; }, {}), [osState.tasks]);
  const selectDate = (iso) => setOsState((current) => ({ ...current, selectedDate: iso }));
  const move = (delta) => setCursor((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1, 12));

  return (
    <div className="admin-view">
      <ViewHeading kicker="Sistema operativo" title="Vista mensual" description="Un calendario único para saber quién hace qué, cuándo y con qué criterio de cierre." action={<button type="button" className="button button--small" onClick={() => onAddTask({ date: osState.selectedDate })}><Icon name="add" /> Agregar tarea</button>} />
      <section className="panel-card calendar-panel">
        <div className="calendar-toolbar"><div><IconButton icon="chevron_left" label="Mes anterior" onClick={() => move(-1)} /><button type="button" className="calendar-title" onClick={() => setCursor(new Date())}>{title}</button><IconButton icon="chevron_right" label="Mes siguiente" onClick={() => move(1)} /></div><button type="button" className="button button--ghost button--small" onClick={() => onNavigate('day')}><Icon name="today" /> Ver día seleccionado</button></div>
        <div className="calendar-weekdays" aria-hidden="true">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="month-grid">
          {days.map((day) => {
            const tasks = (tasksByDate[day.iso] || []).sort((a, b) => String(a.start).localeCompare(String(b.start)));
            return <button type="button" key={day.iso} className={`month-day ${!day.current ? 'is-outside' : ''} ${day.iso === osState.selectedDate ? 'is-selected' : ''}`} onClick={() => selectDate(day.iso)} aria-label={`${formatDate(day.iso)}; ${tasks.length} tareas`}><span className="month-day__number">{day.day}</span>{osState.guides[day.iso]?.name && <small className="month-day__guide">{osState.guides[day.iso].name}</small>}<div>{tasks.slice(0, 4).map((task) => <span key={task.id} className={`mini-task mini-task--${task.status}`}><b>{task.start}</b> {task.title}</span>)}{tasks.length > 4 && <span className="mini-task mini-task--more">+{tasks.length - 4} más</span>}</div></button>;
          })}
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
  return <article className={`os-task ${task.status === 'done' ? 'is-done' : ''}`}><div className="os-task__top"><span><Icon name="schedule" /> {task.start || '—'}–{task.end || '—'}</span><small>{task.topic}</small></div><h3>{task.title}</h3>{task.explain && <p>{task.explain}</p>}{task.done_when && <div className="done-when"><strong>Termina cuando:</strong> {task.done_when}</div>}<div className="task-actions"><button type="button" onClick={() => onToggle(task.id)}><Icon name="task_alt" />{task.status === 'done' ? 'Reabrir' : 'Terminar'}</button><IconButton icon="edit" label={`Editar ${task.title}`} onClick={() => onEdit(task)} /><IconButton icon="delete" label={`Eliminar ${task.title}`} className="icon-button--danger" onClick={() => onDelete(task.id)} /></div></article>;
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

function FamilyView({ osState, setOsState }) {
  const family = osState.family;
  const [actionForm, setActionForm] = useState({ owner: 'Benjamín', title: '', load: 'Media' });
  const [homeItem, setHomeItem] = useState('');
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
  const completedHome = family.home.checklist.filter((item) => item.status === 'done').length;
  const homeProgress = family.home.checklist.length ? Math.round((completedHome / family.home.checklist.length) * 100) : 0;
  const loadPoints = { Ligera: 1, Media: 2, Exigente: 3 };
  const ownerLoad = (owner) => family.weeklyActions.filter((item) => item.owner === owner && item.status !== 'done').reduce((sum, item) => sum + (loadPoints[item.load] || 1), 0);

  const sectionTitles = {
    'family-overview': ['Resumen familiar', 'Una vista de contexto para saber en qué etapa están, qué frentes siguen activos y qué deliberadamente queda fuera.'],
    'family-week': ['Semana y bienestar', 'Carga, prioridades y acciones concretas de la semana, sin confundir cantidad de tareas con capacidad real.'],
    'family-money': ['Caja familiar', 'Un espacio económico separado de la empresa para decidir con claridad qué está disponible, comprometido y protegido.'],
    'family-home': ['Hogar y pendientes', 'Mejoras domésticas, microacciones e inventario familiar sin mezclarlos con la operación de Metamorfosis.']
  };
  const [sectionTitle, sectionDescription] = sectionTitles[section] || sectionTitles['family-overview'];

  return (
    <div className={`admin-view family-view family-view--${section}`}>
      <ViewHeading
        kicker="Espacio familiar"
        title={sectionTitle}
        description={sectionDescription}
        action={section === 'family-overview' ? <div className="family-phase-control"><label>Verbo actual<select value={family.phase} onChange={(event) => updateFamily({ phase: event.target.value })}><option>PREPARAR</option><option>MERCADO</option><option>ESTABILIZAR</option></select></label></div> : null}
      />

      {section === 'family-overview' && <>
        <section className="family-identity-card">
          <img src="/familia-metamorfosis.webp" alt="Ilustración del espacio familiar" />
          <div><span className="kicker">Otro contexto, otras reglas</span><h2>La familia no es una unidad de negocio</h2><p>Este espacio usa otra identidad visual y otra lógica de decisión. Aquí importan caja, carga, hogar y prioridades compartidas; no indicadores comerciales.</p></div>
        </section>

        <section className="family-command-bar">
          <div><span className="kicker">Frontera vigente</span><strong>{family.phase}</strong><p>{family.phaseNote}</p></div>
          <label>Nombre de la semana<input value={family.weekLabel || ''} onChange={(event) => updateFamily({ weekLabel: event.target.value })} /></label>
          <div className="family-command-stat"><small>Semana</small><strong>{completedWeekly}/{family.weeklyActions.length}</strong><span>acciones cerradas</span></div>
          <div className="family-command-stat"><small>Casa</small><strong>{homeProgress}%</strong><span>intervención actual</span></div>
        </section>

        <section className="family-section">
          <div className="family-section__heading"><div><span className="kicker">Frentes</span><h2>Lo que sigue realmente activo</h2></div><p>Un frente entra aquí solo si requiere atención familiar durante la transición.</p></div>
          <div className="family-front-list">
            {family.workFronts.map((front) => <article key={front.id}>
              <div className="family-front__top"><input className="family-front__name" value={front.name} onChange={(event) => updateFront(front.id, { name: event.target.value })} aria-label="Nombre del frente" /><IconButton icon="delete" label={`Quitar ${front.name}`} className="icon-button--danger" onClick={() => removeFront(front.id)} /></div>
              <div className="family-inline-fields"><label>Lidera<input value={front.leader} onChange={(event) => updateFront(front.id, { leader: event.target.value })} /></label><label>Estado<select value={front.state} onChange={(event) => updateFront(front.id, { state: event.target.value })}>{FAMILY_FRONT_STATES.map((state) => <option key={state}>{state}</option>)}</select></label></div>
              <label>Próximo movimiento<textarea value={front.next || ''} onChange={(event) => updateFront(front.id, { next: event.target.value })} /></label>
              <label>Límite<textarea value={front.limit || ''} onChange={(event) => updateFront(front.id, { limit: event.target.value })} /></label>
            </article>)}
          </div>
          <details className="family-details"><summary><Icon name="add" /> Agregar frente</summary><form className="compact-form" onSubmit={addFront}><label>Nombre<input value={frontForm.name} onChange={(event) => setFrontForm({ ...frontForm, name: event.target.value })} /></label><label>Lidera<input value={frontForm.leader} onChange={(event) => setFrontForm({ ...frontForm, leader: event.target.value })} /></label><label>Estado<select value={frontForm.state} onChange={(event) => setFrontForm({ ...frontForm, state: event.target.value })}>{FAMILY_FRONT_STATES.map((state) => <option key={state}>{state}</option>)}</select></label><label className="field-full">Próximo movimiento<input value={frontForm.next} onChange={(event) => setFrontForm({ ...frontForm, next: event.target.value })} /></label><label className="field-full">Límite<input value={frontForm.limit} onChange={(event) => setFrontForm({ ...frontForm, limit: event.target.value })} /></label><button className="button button--small field-full" type="submit">Guardar frente</button></form></details>
        </section>

        <section className="family-section family-exclusions">
          <div className="family-section__heading"><div><span className="kicker">Poda</span><h2>Qué no cabe ahora</h2></div><p>La exclusión deliberada protege la capacidad familiar.</p></div>
          <div className="family-exclusion-list">{family.exclusions.map((item, index) => <article key={`${item}-${index}`}><Icon name="rule" /><span>{item}</span><IconButton icon="delete" label={`Eliminar exclusión ${index + 1}`} className="icon-button--danger" onClick={() => updateFamily((current) => ({ ...current, exclusions: current.exclusions.filter((_, itemIndex) => itemIndex !== index) }))} /></article>)}</div>
          <form className="family-add-row family-add-row--simple" onSubmit={addExclusion}><label className="family-grow">Nueva exclusión<input value={exclusion} onChange={(event) => setExclusion(event.target.value)} placeholder="Esto existe, pero no se hará ahora" /></label><button className="button button--small" type="submit"><Icon name="add" /> Agregar</button></form>
        </section>
      </>}

      {section === 'family-week' && <>
        <section className="family-section">
          <div className="family-section__heading"><div><span className="kicker">Carga y bienestar</span><h2>Cómo estamos</h2></div><p>La carga se evalúa por energía y responsabilidad, no por cantidad bruta de tareas.</p></div>
          <div className="family-wellbeing-grid">
            {family.wellbeing.map((item) => <article className={`family-person family-person--${item.status.toLowerCase().replace('ó', 'o')}`} key={item.id}>
              <div className="family-person__top"><div><strong>{item.name}</strong><span>{item.area}</span></div><span className="family-status-dot" aria-label={item.status} /></div>
              <div className="family-inline-fields"><label>Estado<select value={item.status} onChange={(event) => updateWellbeing(item.id, { status: event.target.value })}>{FAMILY_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label>Carga<select value={item.load} onChange={(event) => updateWellbeing(item.id, { load: event.target.value })}>{FAMILY_LOADS.map((load) => <option key={load}>{load}</option>)}</select></label></div>
              <textarea aria-label={`Nota de ${item.name}`} value={item.note || ''} onChange={(event) => updateWellbeing(item.id, { note: event.target.value })} />
            </article>)}
          </div>
        </section>

        <section className="family-section">
          <div className="family-section__heading"><div><span className="kicker">Prioridades</span><h2>Esta semana</h2></div><p>Máximo una tarea central y una secundaria por persona al día.</p></div>
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
        <section className="family-section family-home family-home--standalone">
          <div className="family-section__heading"><div><span className="kicker">Casa</span><h2>Una intervención cerrable</h2></div><span className="family-progress-number">{homeProgress}%</span></div>
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

        <section className="family-section">
          <div className="family-section__heading"><div><span className="kicker">Pendientes</span><h2>Inventario familiar</h2></div><p>Recordar todo sin sentir que hay que hacer todo.</p></div>
          <form className="family-capture" onSubmit={addCapture}><label className="family-grow">Capturar<input value={captureForm.title} onChange={(event) => setCaptureForm({ ...captureForm, title: event.target.value })} placeholder="Idea, compra, trámite o meta" /></label><label>Área<input value={captureForm.area} onChange={(event) => setCaptureForm({ ...captureForm, area: event.target.value })} /></label><label>Estado<select value={captureForm.status} onChange={(event) => setCaptureForm({ ...captureForm, status: event.target.value })}>{FAMILY_INVENTORY_STATES.map((status) => <option key={status}>{status}</option>)}</select></label><button className="button button--small" type="submit"><Icon name="add" /> Guardar</button></form>
          <div className="family-inventory-grid">
            {FAMILY_INVENTORY_STATES.map((status) => <section key={status}><header><h3>{status}</h3><span>{family.inventory.filter((item) => item.status === status).length}</span></header><div>{family.inventory.filter((item) => item.status === status).map((item) => <article key={item.id}><div><strong>{item.title}</strong><small>{item.area}</small></div><select aria-label={`Estado de ${item.title}`} value={item.status} onChange={(event) => updateInventory(item.id, { status: event.target.value })}>{FAMILY_INVENTORY_STATES.map((option) => <option key={option}>{option}</option>)}</select><IconButton icon="delete" label={`Eliminar ${item.title}`} className="icon-button--danger" onClick={() => removeInventory(item.id)} /></article>)}</div></section>)}
          </div>
        </section>
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
            <div className="expediente-detail__controls"><span className="progress-badge">{expedienteProgress(selected)}% completo</span><select value={selected.status} onChange={(event) => updateExpediente(selected.id, { status: event.target.value })}><option>Prospecto</option><option>Preparación previa</option><option>Conversación</option><option>Propuesta</option><option>En pausa</option><option>Descartado</option></select><IconButton icon="delete" label={`Eliminar ${selected.id}`} className="icon-button--danger" onClick={() => removeExpediente(selected)} /></div>
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

function QuotesView({ quotes, loading, onStatusChange, onRetryEmail, notice }) {
  return <div className="admin-view">
    <ViewHeading kicker="Comercial" title="Oportunidades y cotizaciones" description="Cada formulario público debe quedar registrado aquí aunque el correo tenga una incidencia. El estado de envío permite distinguir registro comercial de notificación SMTP." />
    {notice && <p className={`admin-notice ${notice.type === 'error' ? 'admin-notice--error' : ''}`} role="status">{notice.message}</p>}
    <section className="panel-card">
      <div className="table-page"><table><thead><tr><th>Fecha</th><th>Contacto</th><th>Necesidad</th><th>Correo</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>
        {quotes.map((quote) => <tr key={quote.id}>
          <td>{new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(quote.created_at))}</td>
          <td><strong>{quote.contact_name}</strong><small>{quote.company || quote.phone}</small></td>
          <td><details><summary>{quote.service_type}</summary><p>{quote.details}</p>{(quote.project_stage || quote.team_size || quote.desired_date) && <small>{[quote.project_stage, quote.team_size, quote.desired_date].filter(Boolean).join(' · ')}</small>}</details></td>
          <td><span className={`mail-state ${quote.email_sent ? 'is-sent' : 'is-pending'}`}><Icon name={quote.email_sent ? 'check_circle' : 'warning'} />{quote.email_sent ? 'Enviado' : 'Pendiente'}</span>{quote.email_error && <small className="mail-state__error">{quote.email_error}</small>}</td>
          <td><select className="status-select" aria-label={`Cambiar estado de ${quote.contact_name}`} value={quote.status || 'nueva'} onChange={(event) => onStatusChange(quote.id, event.target.value)}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status === 'evaluacion' ? 'En evaluación' : status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select></td>
          <td className="table-actions">{!quote.email_sent && !String(quote.id).startsWith('web-') && <button type="button" className="icon-button" aria-label={`Reintentar correo de ${quote.contact_name}`} title="Reintentar correo" onClick={() => onRetryEmail(quote.id)}><Icon name="refresh" /></button>}{quote.email && <a className="icon-button" aria-label={`Enviar correo a ${quote.contact_name}`} title="Correo" href={`mailto:${quote.email}`}><Icon name="mail" /></a>}{quote.phone && <a className="icon-button" aria-label={`Llamar a ${quote.contact_name}`} title="Teléfono" href={`tel:${String(quote.phone || '').replace(/\D/g, '')}`}><Icon name="phone" /></a>}</td>
        </tr>)}
        {!loading && !quotes.length && <tr><td colSpan="6"><div className="empty-state-inline"><Icon name="request_quote" /><p>No hay oportunidades registradas.</p></div></td></tr>}
      </tbody></table>{loading && <p className="loading-line">Cargando oportunidades…</p>}</div>
    </section>
  </div>;
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

function DocumentsView() {
  return <div className="admin-view"><ViewHeading kicker="Documentos" title="Repositorio por origen" description="Los documentos operativos y administrativos se mantienen separados del proceso consultivo temporal." /><div className="document-columns">{Object.entries(documents).map(([category, items]) => <section className="document-category" key={category}><div className="document-category__heading"><Icon name={category.includes('Consultoría') ? 'conversion_path' : category === 'Metodológicos' ? 'menu_book' : category === 'Administrativos' ? 'briefcase' : 'folder_open'} /><div><h2>{category}</h2><small>{items.length} documentos base</small></div></div><div className="document-list">{items.map((item) => <div key={item}><span><Icon name="description" /><strong>{item}</strong></span><small>Plantilla por conectar</small></div>)}</div></section>)}</div></div>;
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
    const stored = window.localStorage.getItem('metamorfosis-admin-view');
    const candidate = hashView || (queryWorkspace === 'family' ? 'family-overview' : '') || stored;
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
            setNotice({ type: 'success', message: 'Metamorfosis OS fue actualizado a la arquitectura comercial 9.0. Guarda los cambios para persistir la migración.' });
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
              setNotice({ type: 'success', message: 'Se recuperó tu borrador anterior y se migró a Metamorfosis OS 9.0. Guarda los cambios para consolidarlo.' });
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
        : active === 'expedientes' ? <ExpedientesView osState={osState} setOsState={setOsState} />
          : active === 'quotes' ? <QuotesView quotes={quotes} loading={loadingQuotes} onStatusChange={updateQuoteStatus} onRetryEmail={retryQuoteEmail} notice={notice} />
            : active === 'finance' ? <FinanceView osState={osState} setOsState={setOsState} />
              : active === 'metrics' ? <TimeTrackingView osState={osState} setOsState={setOsState} />
                : active === 'documents' ? <DocumentsView />
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
          <p>El servidor respondió, pero la interfaz encontró un error de ejecución. Recarga el OS; si persiste, revisa el último despliegue de Render.</p>
          <button className="button" type="button" onClick={() => window.location.reload()}><Icon name="refresh" /> Recargar OS</button>
          <a href="/api/health" target="_blank" rel="noreferrer">Ver diagnóstico técnico</a>
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './components/Icon.jsx';
import { documents, initialProjects } from './data.js';
import { createDefaultOsState, OWNERS, TOPICS } from './osSeed.js';

const STORAGE_KEY = 'metamorfosis-os-draft-v5';
const STATUS_OPTIONS = ['nueva', 'contactada', 'evaluacion', 'propuesta', 'cerrada', 'descartada'];

const menuGroups = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: 'dashboard',
    items: [['dashboard', 'Panel diario', 'dashboard']]
  },
  {
    id: 'operacion',
    label: 'Sistema operativo',
    icon: 'calendar_month',
    items: [
      ['month', 'Vista mensual', 'calendar_month'],
      ['day', 'Día seleccionado', 'today'],
      ['inbox', 'Entrada y decisiones', 'inbox'],
      ['fronts', 'Frentes y límites', 'account_tree'],
      ['finance', 'Finanzas del negocio', 'payments']
    ]
  },
  {
    id: 'comercial',
    label: 'Comercial',
    icon: 'handshake',
    items: [['quotes', 'Oportunidades', 'request_quote']]
  },
  {
    id: 'gestion',
    label: 'Gestión interna',
    icon: 'briefcase',
    items: [
      ['projects', 'Proyectos', 'account_tree'],
      ['metrics', 'Medidas e indicadores', 'query_stats'],
      ['assets', 'Activos intangibles', 'copyright']
    ]
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: 'folder_open',
    items: [
      ['documents', 'Repositorio', 'folder_open'],
      ['library', 'Biblioteca metodológica', 'library_books']
    ]
  },
  {
    id: 'consultoria',
    label: 'Consultoría / consolidación',
    icon: 'conversion_path',
    items: [['consulting', 'Proceso temporal', 'conversion_path']]
  }
];

function Brand({ compact = false }) {
  return (
    <a className={`admin-brand ${compact ? 'admin-brand--compact' : ''}`} href="/" aria-label="Metamorfosis Lab, ir al sitio público">
      <img src="/logo-metamorfosis-transparente.png" alt="" width="46" height="46" />
      <span><strong>Panel interno</strong><small>Metamorfosis OS</small></span>
    </a>
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

function hydrateState(candidate) {
  const fallback = createDefaultOsState();
  if (!candidate || typeof candidate !== 'object') return fallback;
  const normalizeId = (item) => ({ ...item, id: item?.id || crypto.randomUUID() });
  return {
    ...fallback,
    ...candidate,
    tasks: (Array.isArray(candidate.tasks) ? candidate.tasks : fallback.tasks).map(normalizeId),
    guides: candidate.guides && typeof candidate.guides === 'object' ? candidate.guides : fallback.guides,
    finance: { ...fallback.finance, ...(candidate.finance || {}) },
    fronts: (Array.isArray(candidate.fronts) ? candidate.fronts : fallback.fronts).map(normalizeId),
    decisions: Array.isArray(candidate.decisions) ? candidate.decisions : fallback.decisions,
    inbox: (Array.isArray(candidate.inbox) ? candidate.inbox : fallback.inbox).map(normalizeId)
  };
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, message: '' });

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '' });
    try {
      const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const payload = await response.json();
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
        <div className="admin-login__heading"><span className="kicker">Acceso privado</span><h1>Administración</h1><p>Proyectos, oportunidades, sistema operativo, documentos y seguimiento interno.</p></div>
        <form id="login-form" onSubmit={submit}>
          <label>Correo institucional<input type="email" autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
          <label>Contraseña<input type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
          {status.message && <p className="admin-notice admin-notice--error" role="alert">{status.message}</p>}
          <button className="button button--full" type="submit" disabled={status.loading}><Icon name="login" /> {status.loading ? 'Ingresando…' : 'Ingresar'}</button>
        </form>
        <a className="admin-login__back" href="/"><Icon name="arrow_back" /> Volver al sitio público</a>
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

  return (
    <div className="admin-view">
      <ViewHeading kicker="Panel diario" title="Panel de control Metamorfosis" description="Accesos rápidos y señales que requieren una decisión concreta hoy." action={<button type="button" className="button button--small" onClick={() => onAddTask({ date: today })}><Icon name="add" /> Nueva tarea</button>} />
      <div className="quick-actions" aria-label="Acciones frecuentes">
        <button type="button" onClick={() => onNavigate('day')}><Icon name="today" />Agenda de hoy</button>
        <button type="button" onClick={() => onNavigate('quotes')}><Icon name="request_quote" />Oportunidades</button>
        <button type="button" onClick={() => onNavigate('projects')}><Icon name="account_tree" />Proyectos</button>
        <button type="button" onClick={() => onNavigate('documents')}><Icon name="folder_open" />Documentos</button>
      </div>
      <div className="metrics-grid">
        <MetricCard icon="task_alt" label="Pendientes de hoy" value={pendingToday.length} note={`${todayTasks.length} tareas cargadas`} />
        <MetricCard icon="schedule" label="Próximos 7 días" value={upcoming.length} note="Tareas sin cerrar" />
        <MetricCard icon="request_quote" label="Oportunidades abiertas" value={openQuotes} note={`${quotes.length} registros totales`} tone="accent" />
        <MetricCard icon="account_tree" label="Frentes activos" value={osState.fronts.length} note="Con liderazgo y límite" />
        <MetricCard icon="inbox" label="Entradas por decidir" value={osState.inbox.length} note="Antes de convertir en trabajo" tone={osState.inbox.length ? 'warning' : ''} />
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
          <div className="panel-card__heading"><div><span className="kicker">Bandeja</span><h2>Nuevos retos</h2></div><button type="button" className="text-button" onClick={() => onNavigate('inbox')}>Clasificar</button></div>
          {osState.inbox.length ? osState.inbox.slice(0, 4).map((item) => <div className="inbox-preview" key={item.id}><strong>{item.title}</strong><span className={`decision-tag decision-tag--${String(item.decision).toLowerCase()}`}>{item.decision}</span></div>) : <p className="empty-copy">No hay entradas esperando decisión.</p>}
        </section>
        <section className="panel-card">
          <div className="panel-card__heading"><div><span className="kicker">Proyectos</span><h2>Próximas acciones</h2></div><button type="button" className="text-button" onClick={() => onNavigate('projects')}>Ver proyectos</button></div>
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
  return <div className="admin-view"><ViewHeading kicker="Finanzas del negocio" title="Caja y compromisos visibles" description="Esta vista registra únicamente información de Metamorfosis. No debe almacenar finanzas personales o familiares en un repositorio compartido." /><div className="finance-metrics"><MetricCard icon="payments" label="Costos registrados" value={formatMoney(totalCosts)} note="Fijos, variables y comprometidos" /><MetricCard icon="trending_up" label="Ingreso proyectado" value={formatMoney(projectedIncome)} note="Recurrente más esperado" tone="accent" /><MetricCard icon={balance >= 0 ? 'check_circle' : 'warning'} label="Resultado proyectado" value={formatMoney(balance)} note={balance >= 0 ? 'Cobertura estimada positiva' : 'Brecha por cubrir'} tone={balance < 0 ? 'danger' : ''} /><MetricCard icon="savings" label="Caja disponible" value={formatMoney(finance.availableCash)} note={totalCosts ? `${coverage.toFixed(1)} meses de costos` : 'Sin costos base cargados'} /></div><div className="finance-layout"><section className="panel-card"><div className="panel-card__heading"><div><span className="kicker">Supuestos editables</span><h2>Montos del negocio</h2></div></div><div className="compact-form"><label>Costos fijos mensuales<input type="number" min="0" value={finance.fixedCosts} onChange={(event) => update('fixedCosts', event.target.value)} /></label><label>Costos variables estimados<input type="number" min="0" value={finance.variableCosts} onChange={(event) => update('variableCosts', event.target.value)} /></label><label>Ingresos recurrentes<input type="number" min="0" value={finance.recurringIncome} onChange={(event) => update('recurringIncome', event.target.value)} /></label><label>Ingresos esperados<input type="number" min="0" value={finance.expectedIncome} onChange={(event) => update('expectedIncome', event.target.value)} /></label><label>Caja disponible<input type="number" min="0" value={finance.availableCash} onChange={(event) => update('availableCash', event.target.value)} /></label><label>Pagos ya comprometidos<input type="number" min="0" value={finance.committedPayments} onChange={(event) => update('committedPayments', event.target.value)} /></label><label className="field-full">Notas y verificaciones<textarea value={finance.notes} onChange={(event) => update('notes', event.target.value)} /></label></div></section><section className="panel-card finance-reading"><div className="panel-card__heading"><div><span className="kicker">Lectura operativa</span><h2>Qué indican los datos</h2></div></div><p>Con los supuestos actuales, los costos registrados alcanzan <b>{formatMoney(totalCosts)}</b> y el ingreso proyectado alcanza <b>{formatMoney(projectedIncome)}</b>.</p><div className={`finance-result ${balance >= 0 ? 'is-positive' : 'is-negative'}`}><span>{balance >= 0 ? 'Margen proyectado' : 'Brecha proyectada'}</span><strong>{formatMoney(Math.abs(balance))}</strong></div><div className="rule-box"><Icon name="rule" /><div><strong>Regla de caja</strong><p>No comprometer nuevas inversiones sin costo total, responsable, fuente de pago y condición de suspensión definidos.</p></div></div></section></div></div>;
}

function QuotesView({ quotes, loading, onStatusChange, notice }) {
  return <div className="admin-view"><ViewHeading kicker="Comercial" title="Oportunidades y cotizaciones" description="Consultas de la web convertidas en registros trazables, con estado y contacto directo." />{notice && <p className={`admin-notice ${notice.type === 'error' ? 'admin-notice--error' : ''}`} role="status">{notice.message}</p>}<section className="panel-card"><div className="table-page"><table><thead><tr><th>Fecha</th><th>Contacto</th><th>Necesidad</th><th>Ciudad</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{quotes.map((quote) => <tr key={quote.id}><td>{new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(quote.created_at))}</td><td><strong>{quote.contact_name}</strong><small>{quote.company || quote.phone}</small></td><td><details><summary>{quote.service_type}</summary><p>{quote.details}</p>{(quote.project_stage || quote.team_size || quote.desired_date) && <small>{[quote.project_stage, quote.team_size, quote.desired_date].filter(Boolean).join(' · ')}</small>}</details></td><td>{quote.city || 'Sin indicar'}</td><td><select className="status-select" aria-label={`Cambiar estado de ${quote.contact_name}`} value={quote.status || 'nueva'} onChange={(event) => onStatusChange(quote.id, event.target.value)}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status === 'evaluacion' ? 'En evaluación' : status.charAt(0).toUpperCase() + status.slice(1)}</option>)}</select></td><td className="table-actions"><a className="icon-button" aria-label={`Contactar a ${quote.contact_name} por WhatsApp`} title="WhatsApp" href={`https://wa.me/${String(quote.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><img src="/assets/icons/whatsapp.svg" alt="" width="18" height="18" /></a>{quote.email && <a className="icon-button" aria-label={`Enviar correo a ${quote.contact_name}`} title="Correo" href={`mailto:${quote.email}`}><Icon name="mail" /></a>}</td></tr>)}{!loading && !quotes.length && <tr><td colSpan="6"><div className="empty-state-inline"><Icon name="request_quote" /><p>No hay oportunidades registradas.</p></div></td></tr>}</tbody></table>{loading && <p className="loading-line">Cargando oportunidades…</p>}</div></section></div>;
}

function ProjectsView() {
  return <div className="admin-view"><ViewHeading kicker="Gestión interna" title="Proyectos" description="Lectura compacta de etapas, próximos hitos y evidencia esperada." /><p className="admin-notice" role="note">Estos registros describen la configuración inicial. La edición y persistencia individual se incorporarán después de validar el sistema operativo central.</p><div className="project-grid">{initialProjects.map((project) => <article className="project-card" key={project.name}><div className="project-card__top"><span className="status-badge">{project.status}</span><span>{project.progress}%</span></div><span className="kicker">{project.client}</span><h2>{project.name}</h2><p>{project.stage}</p><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div><div className="next-action"><Icon name="arrow_forward" /><span><small>Próxima acción</small><strong>{project.next}</strong></span></div></article>)}</div></div>;
}

function DocumentsView() {
  return <div className="admin-view"><ViewHeading kicker="Documentos" title="Repositorio por origen" description="Los documentos operativos y administrativos se mantienen separados del proceso consultivo temporal." /><div className="document-columns">{Object.entries(documents).map(([category, items]) => <section className="document-category" key={category}><div className="document-category__heading"><Icon name={category.includes('Consultoría') ? 'conversion_path' : category === 'Metodológicos' ? 'menu_book' : category === 'Administrativos' ? 'briefcase' : 'folder_open'} /><div><h2>{category}</h2><small>{items.length} documentos base</small></div></div><div className="document-list">{items.map((item) => <div key={item}><span><Icon name="description" /><strong>{item}</strong></span><small>Plantilla por conectar</small></div>)}</div></section>)}</div></div>;
}

function GenericView({ active }) {
  const content = {
    metrics: ['Medidas e indicadores', 'Línea base, meta, fórmula, fuente, frecuencia y resultado por proyecto.'],
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
  const [active, setActive] = useState(() => window.localStorage.getItem('metamorfosis-admin-view') || 'dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => new Set(menuGroups.map((group) => group.id)));
  const [osState, setOsStateRaw] = useState(createDefaultOsState);
  const [dirty, setDirty] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [taskDraft, setTaskDraft] = useState(null);
  const importRef = useRef(null);

  const setOsState = (updater) => {
    setOsStateRaw((current) => hydrateState(typeof updater === 'function' ? updater(current) : updater));
    setDirty(true);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/os-state');
        const payload = await response.json();
        if (response.ok && payload.state) setOsStateRaw(hydrateState(payload.state));
        else {
          const local = window.localStorage.getItem(STORAGE_KEY);
          if (local) setOsStateRaw(hydrateState(JSON.parse(local)));
        }
      } catch {
        try { const local = window.localStorage.getItem(STORAGE_KEY); if (local) setOsStateRaw(hydrateState(JSON.parse(local))); } catch { /* ignore invalid local draft */ }
      } finally { setLoadingState(false); }
    };
    load();
  }, []);

  useEffect(() => { if (!loadingState) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(osState)); }, [osState, loadingState]);

  useEffect(() => {
    setLoadingQuotes(true);
    fetch('/api/quotes').then((response) => response.json()).then((payload) => setQuotes(Array.isArray(payload.quotes) ? payload.quotes : [])).catch(() => setQuotes([])).finally(() => setLoadingQuotes(false));
  }, [session]);

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
    const previous = quotes; setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, status } : quote));
    try { const response = await fetch(`/api/quotes/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); if (!response.ok) throw new Error(); setNotice({ type: 'success', message: 'Estado comercial actualizado.' }); }
    catch { setQuotes(previous); setNotice({ type: 'error', message: 'No fue posible guardar el cambio.' }); }
  };

  const navigate = (key) => { setActive(key); window.localStorage.setItem('metamorfosis-admin-view', key); setMenuOpen(false); };
  const toggleGroup = (id) => setOpenGroups((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
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

  const currentItem = menuGroups.flatMap((group) => group.items).find(([key]) => key === active);
  const view = active === 'dashboard' ? <DashboardView osState={osState} quotes={quotes} dirty={dirty} onNavigate={navigate} onAddTask={openTask} />
    : active === 'month' ? <MonthView osState={osState} setOsState={setOsState} onNavigate={navigate} onAddTask={openTask} />
      : active === 'day' ? <DayView osState={osState} setOsState={setOsState} onAddTask={openTask} onEditTask={setTaskDraft} />
        : active === 'inbox' ? <InboxView osState={osState} setOsState={setOsState} onEditTask={setTaskDraft} />
          : active === 'fronts' ? <FrontsView osState={osState} setOsState={setOsState} />
            : active === 'finance' ? <FinanceView osState={osState} setOsState={setOsState} />
              : active === 'quotes' ? <QuotesView quotes={quotes} loading={loadingQuotes} onStatusChange={updateQuoteStatus} notice={notice} />
                : active === 'projects' ? <ProjectsView />
                  : active === 'documents' ? <DocumentsView />
                    : <GenericView active={active} />;

  if (loadingState) return <div className="app-loading"><Brand /><span>Cargando sistema operativo…</span></div>;

  return <div className="admin-frame"><a className="skip-link" href="#admin-main">Saltar al contenido del panel</a><header className="admin-header"><div className="admin-header__brand"><IconButton icon="menu" label="Abrir menú" className="admin-menu-button" onClick={() => setMenuOpen(true)} /><Brand /></div><div className="admin-header__actions"><a className="admin-action-button admin-action-button--public" href="/" target="_blank" rel="noreferrer"><Icon name="public" /><span>Sitio público</span></a><IconButton icon="upload" label="Importar respaldo JSON" onClick={() => importRef.current?.click()} /><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} /><IconButton icon="download" label="Descargar respaldo JSON" onClick={exportBackup} /><button type="button" className={`admin-action-button ${dirty ? 'is-dirty' : ''}`} onClick={saveState} disabled={saving}><Icon name="save" /><span>{saving ? 'Guardando…' : dirty ? 'Guardar cambios' : 'Guardado'}</span></button><button type="button" className="admin-action-button admin-action-button--exit" onClick={onLogout}><Icon name="logout" /><span>Salir</span></button></div></header><div className="admin-body"><aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Módulos del panel"><div className="sidebar-heading"><strong>Módulos</strong><IconButton icon="close" label="Cerrar menú" className="sidebar-close" onClick={() => setMenuOpen(false)} /></div><nav>{menuGroups.map((group) => { const expanded = openGroups.has(group.id); const containsActive = group.items.some(([key]) => key === active); return <section className="sidebar-group" key={group.id}><button type="button" className={`sidebar-group__toggle ${containsActive ? 'has-active' : ''}`} onClick={() => toggleGroup(group.id)} aria-expanded={expanded}><Icon name={group.icon} /><span>{group.label}</span><Icon name={expanded ? 'expand_less' : 'expand_more'} /></button>{expanded && <div className="sidebar-submenu">{group.items.map(([key, label, icon]) => <button type="button" key={key} className={active === key ? 'is-active' : ''} onClick={() => navigate(key)} aria-current={active === key ? 'page' : undefined}><Icon name={icon} /><span>{label}</span></button>)}</div>}</section>; })}</nav><div className="sidebar-footer"><div className="admin-user"><span>ML</span><div><strong>Administración</strong><small>{session.demo ? 'Modo demostración' : session.email}</small></div></div></div></aside>{menuOpen && <button type="button" className="sidebar-backdrop" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}<main id="admin-main" className="admin-main"><div className="admin-breadcrumb"><span>{currentItem?.[1] || 'Panel diario'}</span>{notice && active !== 'quotes' && <p className={`save-notice ${notice.type === 'error' ? 'is-error' : ''}`} role="status">{notice.message}</p>}</div>{view}</main></div>{taskDraft && <TaskModal draft={taskDraft} onClose={() => setTaskDraft(null)} onSave={saveTask} />}</div>;
}

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => { fetch('/api/session').then((response) => response.json()).then((payload) => setSession(payload.authenticated ? payload : null)).catch(() => setSession(null)).finally(() => setChecking(false)); }, []);
  const logout = async () => { try { await fetch('/api/logout', { method: 'POST' }); } catch { /* no-op */ } setSession(null); };
  if (checking) return <div className="app-loading"><Brand /><span>Comprobando sesión…</span></div>;
  if (!session) return <AdminLogin onLogin={setSession} />;
  return <AdminShell session={session} onLogout={logout} />;
}

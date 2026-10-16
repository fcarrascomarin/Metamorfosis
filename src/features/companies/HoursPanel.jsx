import { useState } from 'react';
import { OWNERS } from '../../osSeed.js';
import { hourSummary, moneyCLP, nonNegativeNumber, projectHours, todayISO } from './managementModel.js';

const EMPTY_PROJECT = { name: '', client: '', fee: '', directCosts: '', targetHours: '', status: 'Activo' };
const newEntry = () => ({ projectId: '', date: todayISO(), owner: 'Francisca', category: 'Ejecución', hours: '', billable: false, note: '' });

function NewHoursForm({ tracking, onSave }) {
  const [draft, setDraft] = useState(newEntry);
  const change = (key, value) => setDraft((state) => ({ ...state, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!draft.projectId || !draft.date || nonNegativeNumber(draft.hours) <= 0) return;
    onSave({ ...draft, id: crypto.randomUUID(), hours: nonNegativeNumber(draft.hours), note: draft.note.trim() });
    setDraft((state) => ({ ...state, hours: '', note: '' }));
    event.currentTarget.closest('details')?.removeAttribute('open');
  };

  return <details className="mg-fold mg-action-fold">
    <summary>+ Registrar horas</summary>
    <form className="mg-form" onSubmit={submit}>
      <label>Fecha<input type="date" required value={draft.date} onChange={(e) => change('date', e.target.value)} /></label>
      <label>Proyecto<select required value={draft.projectId} onChange={(e) => change('projectId', e.target.value)}>
        <option value="">Seleccionar</option>
        {tracking.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
      </select></label>
      <label>Responsable<select value={draft.owner} onChange={(e) => change('owner', e.target.value)}>
        {OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
      </select></label>
      <label>Horas<input type="number" min="0.01" step="0.01" required value={draft.hours}
        onChange={(e) => change('hours', e.target.value)} /></label>
      <label>Tipo<input value={draft.category} onChange={(e) => change('category', e.target.value)} /></label>
      <label className="mg-check"><input type="checkbox" checked={draft.billable}
        onChange={(e) => change('billable', e.target.checked)} /> Facturable</label>
      <label className="mg-full">Resultado<input value={draft.note} onChange={(e) => change('note', e.target.value)} /></label>
      <button type="submit" className="mg-primary">Guardar horas</button>
    </form>
  </details>;
}

function NewProjectForm({ onSave }) {
  const [draft, setDraft] = useState(EMPTY_PROJECT);
  const change = (key, value) => setDraft((state) => ({ ...state, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onSave({
      ...draft, id: crypto.randomUUID(), name: draft.name.trim(), client: draft.client.trim(),
      fee: nonNegativeNumber(draft.fee), directCosts: nonNegativeNumber(draft.directCosts),
      targetHours: nonNegativeNumber(draft.targetHours)
    });
    setDraft(EMPTY_PROJECT);
    event.currentTarget.closest('details')?.removeAttribute('open');
  };

  return <details className="mg-fold mg-action-fold">
    <summary>+ Nuevo proyecto</summary>
    <form className="mg-form" onSubmit={submit}>
      <label>Proyecto<input required value={draft.name} onChange={(e) => change('name', e.target.value)} /></label>
      <label>Cliente<input value={draft.client} onChange={(e) => change('client', e.target.value)} /></label>
      <label>Honorarios<input type="number" min="0" value={draft.fee} onChange={(e) => change('fee', e.target.value)} /></label>
      <label>Costos directos<input type="number" min="0" value={draft.directCosts} onChange={(e) => change('directCosts', e.target.value)} /></label>
      <label>Horas objetivo<input type="number" min="0" value={draft.targetHours} onChange={(e) => change('targetHours', e.target.value)} /></label>
      <button type="submit" className="mg-primary">Guardar proyecto</button>
    </form>
  </details>;
}

function RateEditor({ rates, onChange }) {
  return <details className="mg-fold mg-action-fold">
    <summary>Costos por hora</summary>
    <div className="mg-form">
      {OWNERS.map((owner) => <label key={owner}>{owner}
        <input type="number" min="0" value={rates[owner] ?? 0}
          onChange={(event) => onChange(owner, event.target.value)} />
      </label>)}
    </div>
  </details>;
}

function ProjectRow({ project, tracking, onChange, onDelete }) {
  const related = tracking.entries.filter((entry) => entry.projectId === project.id).length;
  return <details className="mg-project">
    <summary>
      <span>{project.name}</span>
      <span>{projectHours(tracking, project.id).toLocaleString('es-CL', { maximumFractionDigits: 1 })} h</span>
      <span>{moneyCLP(project.fee)}</span>
      <span>{project.status || '—'}</span>
    </summary>
    <div className="mg-project-detail">
      {[['name', 'Nombre'], ['client', 'Cliente'], ['fee', 'Honorarios'], ['directCosts', 'Costos directos'], ['targetHours', 'Horas objetivo'], ['status', 'Estado']]
        .map(([key, label]) => <label key={key}>{label}
          <input type={['fee', 'directCosts', 'targetHours'].includes(key) ? 'number' : 'text'}
            min={['fee', 'directCosts', 'targetHours'].includes(key) ? '0' : undefined}
            value={project[key] ?? ''}
            onChange={(event) => onChange(project.id, { [key]: ['fee', 'directCosts', 'targetHours'].includes(key)
              ? nonNegativeNumber(event.target.value) : event.target.value })} />
        </label>)}
      <div className="mg-project-delete"><button type="button" onClick={() => onDelete(project, related)}>
        Eliminar proyecto{related ? ` y ${related} registros de tiempo` : ''}
      </button></div>
    </div>
  </details>;
}

function EntryRow({ entry, tracking, onChange, onDelete }) {
  return <details className="mg-entry">
    <summary className="mg-history-row">
      <span>{entry.date}</span>
      <span>{tracking.projects.find((p) => p.id === entry.projectId)?.name || 'Proyecto no disponible'}</span>
      <span>{entry.owner}</span>
      <span>{nonNegativeNumber(entry.hours)} h</span>
      <span>Editar</span>
    </summary>
    <div className="mg-form mg-entry-edit">
      <label>Fecha<input type="date" value={entry.date || ''} onChange={(e) => onChange(entry.id, { date: e.target.value })} /></label>
      <label>Proyecto<select value={entry.projectId} onChange={(e) => onChange(entry.id, { projectId: e.target.value })}>
        {tracking.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select></label>
      <label>Responsable<select value={entry.owner} onChange={(e) => onChange(entry.id, { owner: e.target.value })}>
        {OWNERS.map((owner) => <option key={owner}>{owner}</option>)}
      </select></label>
      <label>Horas<input type="number" min="0.01" step="0.01" value={entry.hours}
        onChange={(e) => onChange(entry.id, { hours: nonNegativeNumber(e.target.value) })} /></label>
      <label>Tipo<input value={entry.category || ''} onChange={(e) => onChange(entry.id, { category: e.target.value })} /></label>
      <label className="mg-check"><input type="checkbox" checked={Boolean(entry.billable)}
        onChange={(e) => onChange(entry.id, { billable: e.target.checked })} /> Facturable</label>
      <label className="mg-full">Resultado<input value={entry.note || ''} onChange={(e) => onChange(entry.id, { note: e.target.value })} /></label>
      <button type="button" className="mg-delete" onClick={() => onDelete(entry)}>Eliminar registro</button>
    </div>
  </details>;
}

export default function HoursPanel({ tracking, onChange }) {
  const summary = hourSummary(tracking);
  const updateProject = (id, patch) => onChange((current) => ({ ...current,
    projects: current.projects.map((project) => project.id === id ? { ...project, ...patch } : project) }));
  const updateEntry = (id, patch) => onChange((current) => ({ ...current,
    entries: current.entries.map((entry) => entry.id === id ? { ...entry, ...patch } : entry) }));
  const deleteProject = (project, related) => {
    if (!window.confirm(related
      ? `¿Eliminar ${project.name} y sus ${related} registros de horas?`
      : `¿Eliminar ${project.name}?`)) return;
    onChange((current) => ({ ...current,
      projects: current.projects.filter((item) => item.id !== project.id),
      entries: current.entries.filter((item) => item.projectId !== project.id)
    }));
  };
  const deleteEntry = (entry) => {
    if (!window.confirm('¿Eliminar este registro de horas?')) return;
    onChange((current) => ({ ...current, entries: current.entries.filter((item) => item.id !== entry.id) }));
  };

  return <div className="mg-content">
    <div className="mg-summary" aria-label="Resumen del tiempo">
      <span>Tiempo registrado <b>{summary.hours.toLocaleString('es-CL', { maximumFractionDigits: 1 })} h</b></span>
      <span>Facturable <b>{summary.billable.toLocaleString('es-CL', { maximumFractionDigits: 1 })} h</b></span>
      <span>Honorarios pactados <b>{moneyCLP(summary.fees)}</b></span>
    </div>
    <div className="mg-scroll">
      <div className="mg-actions">
        <NewHoursForm tracking={tracking} onSave={(entry) => onChange((current) => ({ ...current,
          entries: [entry, ...current.entries] }))} />
        <NewProjectForm onSave={(project) => onChange((current) => ({ ...current,
          projects: [...current.projects, project] }))} />
        <RateEditor rates={tracking.rates} onChange={(owner, rate) => onChange((current) => ({ ...current,
          rates: { ...current.rates, [owner]: rate } }))} />
      </div>
      <div className="mg-table-head mg-project-head">
        <strong>Proyecto</strong><strong>Horas</strong><strong>Honorarios</strong><strong>Estado</strong>
      </div>
      {tracking.projects.map((project) => <ProjectRow key={project.id}
        project={project} tracking={tracking} onChange={updateProject} onDelete={deleteProject} />)}
      <details className="mg-fold mg-history-list">
        <summary>Historial de horas ({tracking.entries.length})</summary>
        {tracking.entries.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
          .map((entry) => <EntryRow key={entry.id} entry={entry} tracking={tracking}
            onChange={updateEntry} onDelete={deleteEntry} />)}
      </details>
    </div>
  </div>;
}

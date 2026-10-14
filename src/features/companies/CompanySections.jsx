import { useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { repositoryTemplates } from '../../data.js';
import { CONSULTING_TOOLS, EXPEDIENTE_STATUSES } from '../../consultingTools.js';
import { companyKey } from './companyModel.js';

const DOC_STATUSES = ['Pendiente', 'En curso', 'Listo', 'Bloqueado', 'No aplica'];
const CONTACT_TYPES = ['Informante', 'Discovery', 'Piloto comercial', 'Radar', 'Exclusión'];

export function Section({ title, count, children, initialOpen = false }) {
  return <details className="company-os__section" defaultOpen={initialOpen}>
    <summary><span>{title}{count !== undefined && <em>{count}</em>}</span><Icon name="expand_more" /></summary>
    <div className="company-os__section-body">{children}</div>
  </details>;
}

export function Field({ label, value, onChange, options, multiline = false, readOnly = false, placeholder }) {
  return <label className="company-os__field"><span>{label}</span>{options ?
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>{options.map((item) => <option key={item} value={item}>{item}</option>)}</select> : multiline ?
    <textarea rows="3" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly} /> :
    <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly} />}</label>;
}

export function ContactsSection({ company, updateContact, addContact, removeContact }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ actor: '', role: '', type: 'Informante' });
  const submit = (event) => {
    event.preventDefault();
    if (!draft.actor.trim()) return;
    addContact(company, draft);
    setDraft({ actor: '', role: '', type: 'Informante' });
    setAdding(false);
  };
  return <Section title="Personas y conversaciones" count={company.contacts.length}>
    {company.contacts.map((contact) => <details className="company-os__nested" key={contact.id}>
      <summary><b>{contact.actor || 'Sin nombre'}</b><span>{contact.type} · {contact.status || 'Sin estado'}</span><Icon name="expand_more" /></summary>
      <div className="company-os__fields">
        <Field label="Persona" value={contact.actor} onChange={(value) => updateContact(contact.id, { actor: value })} />
        <Field label="Función" value={contact.role} onChange={(value) => updateContact(contact.id, { role: value })} />
        <Field label="Tipo de vínculo" value={contact.type} options={CONTACT_TYPES} onChange={(value) => updateContact(contact.id, { type: value })} />
        <Field label="Estado" value={contact.status} onChange={(value) => updateContact(contact.id, { status: value })} />
        <Field label="Acceso" value={contact.access} onChange={(value) => updateContact(contact.id, { access: value })} />
        <Field label="Prioridad" value={contact.priority} onChange={(value) => updateContact(contact.id, { priority: value })} />
        <Field label="Lectura comercial" value={contact.commercial} onChange={(value) => updateContact(contact.id, { commercial: value })} />
        <Field label="Próxima acción" value={contact.nextAction} multiline onChange={(value) => updateContact(contact.id, { nextAction: value })} />
        <Field label="Contexto y evidencia" value={contact.context} multiline onChange={(value) => updateContact(contact.id, { context: value })} />
        <Field label="Límites de la relación" value={contact.limit} multiline onChange={(value) => updateContact(contact.id, { limit: value })} />
      </div>
      <button className="company-os__quiet danger" type="button" onClick={() => removeContact(contact)}>Eliminar este contacto</button>
    </details>)}
    {!company.contacts.length && <p className="company-os__muted">Todavía no hay personas asociadas.</p>}
    {!adding ? <button className="company-os__quiet" type="button" onClick={() => setAdding(true)}><Icon name="add" /> Añadir contacto</button> :
      <form className="company-os__new-contact" onSubmit={submit}>
        <Field label="Nombre" value={draft.actor} onChange={(value) => setDraft((s) => ({ ...s, actor: value }))} />
        <Field label="Función" value={draft.role} onChange={(value) => setDraft((s) => ({ ...s, role: value }))} />
        <Field label="Vínculo" value={draft.type} options={CONTACT_TYPES} onChange={(value) => setDraft((s) => ({ ...s, type: value }))} />
        <button type="submit" className="company-os__primary">Guardar contacto</button>
        <button type="button" className="company-os__quiet" onClick={() => setAdding(false)}>Cancelar</button>
      </form>}
  </Section>;
}

export function MethodsSection({ expediente, repository, updateTool, updateDocument }) {
  return <Section title="Investigación y validación" count={CONSULTING_TOOLS.filter((t) => expediente.tools?.[t.id]?.status !== 'Pendiente').length}>
    <p className="company-os__muted">Las fichas comerciales se editan aquí. No se repiten como documentos independientes.</p>
    {CONSULTING_TOOLS.map((tool) => {
      const current = expediente.tools?.[tool.id] || { status: 'Pendiente', data: {} };
      const historicalTemplate = repositoryTemplates.find((template) => template.sourceTool === tool.id);
      const historicalDocument = repository?.documentsByExpediente?.[expediente.id]?.[historicalTemplate?.id];
      return <details key={tool.id} className="company-os__nested">
        <summary><b>{tool.number} · {tool.title}</b><span>{current.status}</span><Icon name="expand_more" /></summary>
        <div className="company-os__fields">
          <Field label="Estado" value={current.status} options={EXPEDIENTE_STATUSES} onChange={(value) => updateTool(expediente.id, tool.id, { status: value })} />
          {tool.fields.map((field) => <Field key={field.key} label={field.label} value={current.data?.[field.key] ?? ''}
            options={field.type === 'select' ? ['', ...field.options] : undefined} multiline={field.type === 'textarea'}
            onChange={(value) => updateTool(expediente.id, tool.id, { data: { [field.key]: field.type === 'number' ? (value === '' ? '' : Number(value)) : value } })} />)}
        </div>
        {historicalDocument?.content !== undefined && <div className="company-os__legacy-doc"><Field label="Contenido documental previamente guardado" value={historicalDocument.content} multiline onChange={(value) => updateDocument(expediente.id, historicalTemplate.id, { content: value })} /></div>}
        <p className="company-os__muted"><b>Uso:</b> {tool.when}</p>
        <p className="company-os__muted"><b>Límite:</b> {tool.limit}</p>
      </details>;
    })}
  </Section>;
}

export function DocumentsSection({ expediente, repository, updateDocument, clearDocument }) {
  const [showAll, setShowAll] = useState(false);
  const documents = repository?.documentsByExpediente?.[expediente.id] || {};
  const templates = repositoryTemplates.filter((t) => !t.sourceTool && !t.navigateTo);
  const visible = showAll ? templates : templates.filter((t) => documents[t.id] && !['Pendiente', 'No aplica'].includes(documents[t.id].status));
  const working = templates.filter((t) => documents[t.id] && !['Pendiente', 'No aplica'].includes(documents[t.id].status)).length;
  return <Section title="Documentos de trabajo" count={working}>
    <div className="company-os__inline"><p className="company-os__muted">Solo se muestran los documentos activados. Las demás plantillas están disponibles cuando se necesitan.</p>
      <button type="button" className="company-os__quiet" onClick={() => setShowAll((v) => !v)}>{showAll ? 'Mostrar solo usados' : 'Ver todas las plantillas'}</button></div>
    {!visible.length && <p className="company-os__muted">No hay documentos activos para esta empresa.</p>}
    {visible.map((template) => {
      const doc = documents[template.id] || {};
      return <details key={template.id} className="company-os__nested">
        <summary><b>{template.title}</b><span>{doc.status || 'Pendiente'} · {template.category}</span><Icon name="expand_more" /></summary>
        <p className="company-os__muted">{template.description}</p>
        <div className="company-os__fields">
          <Field label="Estado" value={doc.status || 'Pendiente'} options={DOC_STATUSES} onChange={(value) => updateDocument(expediente.id, template.id, { status: value })} />
          <Field label="Contenido" multiline value={doc.content || ''} onChange={(value) => updateDocument(expediente.id, template.id, { content: value, status: doc.status || 'En curso' })} />
        </div>
        <button type="button" className="company-os__quiet danger" onClick={() => clearDocument(expediente.id, template.id, template.title)}>Limpiar documento</button>
      </details>;
    })}
  </Section>;
}

export function QuoteSection({ quotes, onEditQuote, onChangeQuoteStatus, onDeleteQuote, onRetryQuoteEmail }) {
  return <Section title="Solicitudes recibidas" count={quotes.length}>
    {quotes.map((quote) => <details className="company-os__nested" key={quote.id}>
      <summary><b>{quote.contact_name || 'Contacto sin nombre'}</b><span>{quote.status || 'nueva'} · {quote.created_at ? new Date(quote.created_at).toLocaleDateString('es-CL') : 'Fecha por verificar'}</span><Icon name="expand_more" /></summary>
      <div className="company-os__quote-detail">
        <p><b>Solicitud:</b> {quote.service_type || 'Sin servicio indicado'} · {quote.project_stage || 'Etapa sin definir'}</p>
        <p>{quote.details || 'Sin descripción adicional.'}</p>
        <p><b>Contacto:</b> {quote.email || 'Sin correo'}{quote.phone ? ` · ${quote.phone}` : ''}</p>
        <div className="company-os__inline">
          <label>Estado <select value={quote.status || 'nueva'} onChange={(e) => onChangeQuoteStatus(quote.id, e.target.value)}>{['nueva', 'contactada', 'evaluacion', 'propuesta', 'cerrada', 'descartada'].map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
          <button type="button" className="company-os__quiet" onClick={() => onEditQuote(quote)}>Editar solicitud</button>
          {!quote.email_sent && onRetryQuoteEmail && !String(quote.id).startsWith('web-') && <button type="button" className="company-os__quiet" onClick={() => onRetryQuoteEmail(quote.id)}>Reintentar correo</button>}
          {onDeleteQuote && <button type="button" className="company-os__quiet danger" onClick={() => onDeleteQuote(quote)}>Eliminar</button>}
        </div>
      </div>
    </details>)}
  </Section>;
}


/** Resumen contextual: el asiento de horas permanece en su contabilidad original. */
export function WorkHoursSection({ company, tracking, onNavigate }) {
  const projects = (tracking?.projects || []).filter((item) =>
    item.client && companyKey(item.client) === company.key
  );
  if (!projects.length) return null;
  const tracked = (tracking?.entries || []).filter((entry) => projects.some((project) => project.id === entry.projectId));
  const total = tracked.reduce((value, entry) => value + (Number(entry.hours) || 0), 0);
  return <Section title="Proyectos y horas" count={`${total.toLocaleString('es-CL')} h`}>
    {projects.map((project) => <div className="company-os__work-row" key={project.id}>
      <b>{project.name}</b><span>{project.status || 'Sin estado'} · {tracked.filter((entry) => entry.projectId === project.id).reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0).toLocaleString('es-CL')} h</span>
    </div>)}
    <button className="company-os__quiet" type="button" onClick={() => onNavigate('metrics')}>Editar en Horas y rentabilidad</button>
  </Section>;
}

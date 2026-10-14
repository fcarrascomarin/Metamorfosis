import { useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { OWNERS } from '../../osSeed.js';
import { createEmptyExpediente } from '../../consultingTools.js';
import { nextExpedienteIndex } from './companyModel.js';
import { Section, Field, ContactsSection, MethodsSection, DocumentsSection, QuoteSection, WorkHoursSection } from './CompanySections.jsx';

const COMPANY_STATUSES = ['Prospecto', 'Preparación previa', 'Conversación', 'En espera', 'Propuesta', 'En pausa', 'Cerrado sin conversión', 'Cerrado', 'Descartado'];
export const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export default function CompanyDetail({ company, osState, setOsState, onClose, onRename, onNavigate, onEditQuote, onChangeQuoteStatus, onDeleteQuote, onRetryQuoteEmail }) {
  const expediente = company.expediente;
  const [nameDraft, setNameDraft] = useState(company.name);
  const updateExpediente = (id, patch) => setOsState((current) => ({ ...current, expedientes: current.expedientes.map((item) => item.id === id ? { ...item, ...patch, lastUpdate: todayISO() } : item) }));
  const updateContact = (id, patch) => setOsState((current) => ({ ...current, fieldRegister: current.fieldRegister.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  const addContact = (target, draft) => setOsState((current) => ({
    ...current,
    fieldRegister: [...current.fieldRegister, {
      id: crypto.randomUUID(), companyId: target.expediente?.id || null, actor: draft.actor.trim(), organization: target.name,
      role: draft.role.trim(), type: draft.type, status: 'Nuevo', access: 'Por definir', priority: 'Por definir',
      commercial: draft.type === 'Informante' ? 'No prospecto' : 'Por validar', nextAction: '', context: '', limit: ''
    }]
  }));
  const removeContact = (contact) => {
    if (!window.confirm(`¿Eliminar a ${contact.actor} del registro?`)) return;
    setOsState((current) => ({ ...current, fieldRegister: current.fieldRegister.filter((item) => item.id !== contact.id) }));
  };
  const createFile = () => {
    setOsState((current) => {
      const created = { ...createEmptyExpediente(nextExpedienteIndex(current.expedientes)), name: company.name };
      return {
        ...current,
        expedientes: [...current.expedientes, created],
        fieldRegister: current.fieldRegister.map((item) => company.contacts.some((c) => c.id === item.id) ? { ...item, companyId: created.id } : item)
      };
    });
  };
  const removeFile = () => {
    if (!window.confirm(`¿Eliminar el expediente de ${company.name}? Se perderán sus fichas y documentos. Se conservarán los contactos.`)) return;
    setOsState((current) => ({
      ...current,
      expedientes: current.expedientes.filter((e) => e.id !== expediente.id),
      fieldRegister: current.fieldRegister.map((c) => c.companyId === expediente.id ? { ...c, companyId: null } : c),
      repository: { ...current.repository, documentsByExpediente: Object.fromEntries(Object.entries(current.repository?.documentsByExpediente || {}).filter(([id]) => id !== expediente.id)) }
    }));
  };
  const updateTool = (id, toolId, patch) => setOsState((current) => ({
    ...current, expedientes: current.expedientes.map((item) => item.id !== id ? item : {
      ...item, lastUpdate: todayISO(), tools: { ...item.tools, [toolId]: {
        ...(item.tools?.[toolId] || { status: 'Pendiente', data: {} }),
        ...patch, data: { ...(item.tools?.[toolId]?.data || {}), ...(patch.data || {}) }
      } }
    })
  }));
  const updateDocument = (id, templateId, patch) => setOsState((current) => {
    const repo = current.repository || {};
    const byId = repo.documentsByExpediente || {};
    return { ...current, repository: { ...repo, documentsByExpediente: { ...byId, [id]: {
      ...(byId[id] || {}), [templateId]: { ...(byId[id]?.[templateId] || {}), ...patch, updatedAt: todayISO() }
    } } } };
  });
  const clearDocument = (id, templateId, title) => {
    if (!window.confirm(`¿Limpiar «${title}» de ${company.name}?`)) return;
    setOsState((current) => {
      const byId = current.repository?.documentsByExpediente || {};
      const docs = { ...(byId[id] || {}) }; delete docs[templateId];
      return { ...current, repository: { ...current.repository, documentsByExpediente: { ...byId, [id]: docs } } };
    });
  };
  return <aside className="company-os__detail" aria-label={`Ficha de ${company.name}`}>
    <header className="company-os__detail-head"><div><small>Ficha por organización</small><h2>{company.name}</h2><span className="company-os__stage">{company.stage}</span></div><button type="button" className="company-os__close" aria-label="Cerrar ficha" onClick={onClose}><Icon name="close" /></button></header>
    <div className="company-os__detail-scroll">
      <Section title="Situación y siguiente paso" initialOpen>
        {company.unassigned ? <p className="company-os__muted">Estas solicitudes llegaron sin nombre de empresa. Edita la solicitud para identificar la organización antes de abrir un expediente.</p> : expediente ? <div className="company-os__fields">
          <label className="company-os__field"><span>Nombre de la organización</span><input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} onBlur={() => { const name = nameDraft.trim(); if (name && name !== expediente.name) onRename(company, name); }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} /></label>
          <Field label="Estado" value={expediente.status} options={COMPANY_STATUSES} onChange={(value) => updateExpediente(expediente.id, { status: value })} />
          <Field label="Responsable" value={expediente.owner} options={OWNERS} onChange={(value) => updateExpediente(expediente.id, { owner: value })} />
          <Field label="Actividad" value={expediente.sector} onChange={(value) => updateExpediente(expediente.id, { sector: value })} />
          <Field label="Territorio" value={expediente.territory} onChange={(value) => updateExpediente(expediente.id, { territory: value })} />
          <Field label="Notas y próxima decisión" value={expediente.notes} multiline onChange={(value) => updateExpediente(expediente.id, { notes: value })} />
        </div> : <p className="company-os__muted">Esta organización consta en contactos o solicitudes, pero todavía no tiene expediente de investigación. No es necesario crearlo hasta que haya trabajo que registrar.</p>}
        {company.contacts.filter((c) => c.nextAction).map((c) => <p className="company-os__contact-next" key={c.id}><b>{c.actor}</b> · {c.nextAction}</p>)}
        {!expediente && !company.unassigned && <button type="button" className="company-os__primary" onClick={createFile}><Icon name="add" /> Abrir expediente</button>}
      </Section>
      {!company.unassigned && <ContactsSection key={company.key} company={company} updateContact={updateContact} addContact={addContact} removeContact={removeContact} />}
      {expediente && <MethodsSection expediente={expediente} repository={osState.repository} updateTool={updateTool} updateDocument={updateDocument} />}
      {expediente && <DocumentsSection expediente={expediente} repository={osState.repository} updateDocument={updateDocument} clearDocument={clearDocument} />}
      <WorkHoursSection company={company} tracking={osState.timeTracking} onNavigate={onNavigate} />
      {!!company.quotes.length && <QuoteSection quotes={company.quotes} onEditQuote={onEditQuote} onChangeQuoteStatus={onChangeQuoteStatus} onDeleteQuote={onDeleteQuote} onRetryQuoteEmail={onRetryQuoteEmail} />}
      {expediente && <button type="button" className="company-os__quiet danger company-os__remove" onClick={removeFile}>Eliminar expediente (conservar contactos)</button>}
    </div>
  </aside>;
}


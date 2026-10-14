import { useMemo, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { createEmptyExpediente } from '../../consultingTools.js';
import { buildCompanyIndex, companyKey, nextExpedienteIndex } from './companyModel.js';
import CompanyDetail, { todayISO } from './CompanyDetail.jsx';
import './companies.css';

export default function CompanyWorkspace({ osState, setOsState, quotes = [], onEditQuote, onChangeQuoteStatus, onDeleteQuote, onRetryQuoteEmail, onNavigate }) {
  const companies = useMemo(() => buildCompanyIndex({ expedientes: osState.expedientes, fieldRegister: osState.fieldRegister, quotes }), [osState.expedientes, osState.fieldRegister, quotes]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [selectedKey, setSelectedKey] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const selected = companies.find((item) => item.key === selectedKey);
  const stages = ['Todas', 'En observación', 'En seguimiento', 'En conversación', 'Propuesta', 'Cerrada', 'Por clasificar'];
  const filtered = companies.filter((company) => {
    const content = [company.name, company.expediente?.sector, company.expediente?.territory, ...company.contacts.flatMap((c) => [c.actor, c.role])].join(' ');
    return (filter === 'Todas' || company.stage === filter) && companyKey(content).includes(companyKey(query));
  });
  const renameCompany = (company, name) => {
    if (companies.some((other) => other.key !== company.key && other.key === companyKey(name))) {
      window.alert('Ya existe una empresa con ese nombre. Mantén los registros separados hasta comprobar si corresponden a la misma organización.');
      return;
    }
    setOsState((current) => ({
      ...current,
      expedientes: current.expedientes.map((item) => item.id === company.expediente.id ? { ...item, name, lastUpdate: todayISO() } : item),
      fieldRegister: current.fieldRegister.map((item) => company.contacts.some((contact) => contact.id === item.id) ? { ...item, companyId: company.expediente.id, organization: name } : item)
    }));
    setSelectedKey(companyKey(name));
  };
  const addCompany = (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const existing = companies.find((item) => item.key === companyKey(name));
    if (existing) { setSelectedKey(existing.key); setAdding(false); return; }
    setOsState((current) => ({ ...current, expedientes: [...current.expedientes, { ...createEmptyExpediente(nextExpedienteIndex(current.expedientes)), name }] }));
    setSelectedKey(companyKey(name)); setNewName(''); setAdding(false);
  };
  return <div className={`company-os ${selected ? 'company-os--detail-open' : ''}`}>
    <div className="company-os__top"><div><span className="company-os__eyebrow">Gestión comercial</span><h1>Empresas</h1></div><div className="company-os__top-actions"><span>{companies.length} organizaciones · {companies.filter((c) => c.stage !== 'Cerrada').length} abiertas</span><button className="company-os__primary" type="button" onClick={() => setAdding((v) => !v)}><Icon name="add" /> Nueva empresa</button></div></div>
    {adding && <form className="company-os__add" onSubmit={addCompany}><label>Nombre de la organización<input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre de empresa o institución" required /></label><button className="company-os__primary" type="submit">Crear ficha</button><button className="company-os__quiet" type="button" onClick={() => setAdding(false)}>Cancelar</button></form>}
    <div className="company-os__workarea"><div className="company-os__directory">
      <div className="company-os__filters"><label className="company-os__search"><Icon name="search" /><input aria-label="Buscar organizaciones y personas" placeholder="Buscar empresa o persona" value={query} onChange={(e) => setQuery(e.target.value)} /></label><select value={filter} aria-label="Filtrar por estado" onChange={(e) => setFilter(e.target.value)}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></div>
      <div className="company-os__table-head"><span>Organización</span><span>Situación</span><span>Contacto</span><span></span></div>
      <div className="company-os__rows">{filtered.map((company) => <button type="button" key={company.key} className={`company-os__row ${selectedKey === company.key ? 'is-selected' : ''}`} onClick={() => setSelectedKey(company.key)}>
        <span className="company-os__name"><strong>{company.name}</strong><small>{company.expediente?.sector || company.contacts[0]?.role || (company.quotes.length ? 'Solicitud web' : 'Por completar')}</small></span>
        <span className="company-os__stage">{company.stage}</span><span className="company-os__people">{company.contacts.length ? `${company.contacts.length} ${company.contacts.length === 1 ? 'persona' : 'personas'}` : company.quotes.length ? `${company.quotes.length} solicitudes` : '—'}</span><Icon name="chevron_right" />
      </button>)}{!filtered.length && <div className="company-os__empty">No hay organizaciones que coincidan con la búsqueda.</div>}</div>
      <footer className="company-os__list-footer">Orden alfabético · Una ficha por organización · Detalles al seleccionar</footer>
    </div>
    {selected && <CompanyDetail key={selected.key} company={selected} osState={osState} setOsState={setOsState} onClose={() => setSelectedKey('')} onRename={renameCompany} onNavigate={onNavigate} onEditQuote={onEditQuote} onChangeQuoteStatus={onChangeQuoteStatus} onDeleteQuote={onDeleteQuote} onRetryQuoteEmail={onRetryQuoteEmail} />}
    </div>
  </div>;
}

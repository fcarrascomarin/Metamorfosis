import { useMemo, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import './agenda-focus.css';

const localISO = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const labelDate = (date) => new Intl.DateTimeFormat('es-CL', {weekday:'short',day:'numeric',month:'short'}).format(new Date(`${date}T12:00:00`));

// Fuentes de trabajo conocidas, no sincronización de Google Calendar.
// Se ofrecen para registrar, nunca se incorporan silenciosamente a los datos guardados.
export const SUGGESTED_MILESTONES = [
  { id: 'uba-narcotrafico-2026', date: '2026-10-19', title: 'UBA · Entrega trabajo Represión del narcotráfico',
    owner: 'Benjamín', topic: 'Formación', explain: 'Fecha de entrega informada por el usuario. Confirmar presentación y modalidad antes de marcar completada.' }
];

export function futureTasks(tasks = [], today = localISO(new Date())) {
  return tasks.filter(t => t?.date >= today && t.status !== 'done').sort((a,b) => `${a.date}-${a.start||''}`.localeCompare(`${b.date}-${b.start||''}`));
}

export default function AgendaFocus({osState, setOsState, onAddTask, onEditTask}) {
  const today = localISO(new Date());
  const [scope,setScope] = useState('14');
  const [showArchive,setShowArchive] = useState(false);
  const [editingId,setEditingId] = useState(null);
  const horizon = new Date(`${today}T12:00:00`);
  horizon.setDate(horizon.getDate() + Number(scope));
  const end = localISO(horizon);
  const upcoming = useMemo(() => futureTasks(osState.tasks,today).filter(t=>t.date<=end),[osState.tasks,today,end]);
  const backlog = useMemo(() => osState.tasks.filter(t=>t.date<today && t.status!=='done').sort((a,b)=>b.date.localeCompare(a.date)),[osState.tasks,today]);
  const references = SUGGESTED_MILESTONES.filter(m=>m.date>=today && m.date<=end && !osState.tasks.some(t=>t.referenceId===m.id || (t.date===m.date && t.title===m.title)));
  const toggle = (id) => setOsState(s=>({...s,tasks:s.tasks.map(t=>t.id===id ? {...t,status:t.status==='done'?'pending':'done'} : t)}));
  const addReference=(item)=>setOsState(s=>({...s,selectedDate:item.date,tasks:[...s.tasks,{id:crypto.randomUUID(),referenceId:item.id,date:item.date,start:'',end:'',owner:item.owner,topic:item.topic,title:item.title,explain:item.explain,why:'Referencia de trabajo registrada para revisión.',done_when:'Entregado y comprobado.',status:'pending',confirmed:false,comments:[]}]}));
  return <div className="af-page">
    <header className="af-header"><div><h1>Agenda</h1><p>Compromisos con fecha. Sin tareas históricas mezcladas con lo que viene.</p></div><button type="button" className="af-primary" onClick={()=>onAddTask({date:today})}><Icon name="add"/> Añadir</button></header>
    <div className="af-toolbar"><div className="af-tabs" role="group" aria-label="Horizonte">{[['7','7 días'],['14','14 días'],['30','30 días']].map(([n,label])=><button type="button" key={n} className={scope===n?'active':''} onClick={()=>setScope(n)}>{label}</button>)}</div><span>{upcoming.length} pendientes registrados</span></div>
    <div className="af-scroll">
      {upcoming.length ? <div className="af-list">{upcoming.map(t=><article className="af-line" key={t.id}><div className="af-date">{labelDate(t.date)}</div><div className="af-content"><strong>{t.title}</strong><small>{t.owner} {t.start&&t.start!=='—'?`· ${t.start}`:''}</small>{editingId===t.id&&<div className="af-inline-details"><p>{t.explain||'Sin detalle'}</p><button type="button" className="af-link" onClick={()=>onEditTask?.(t)}>Editar registro</button></div>}</div><button type="button" aria-label="Ver detalle" onClick={()=>setEditingId(editingId===t.id?null:t.id)}><Icon name="chevron_down"/></button><button type="button" className="af-action" onClick={()=>toggle(t.id)}>Completar</button></article>)}</div> : <div className="af-empty">No hay compromisos registrados en los próximos {scope} días.</div>}
      {references.length>0&&<section className="af-ref"><h2>Para incorporar a la agenda</h2><p>Referencia de conversaciones de trabajo; no está confirmada por un calendario conectado.</p>{references.map(m=><div key={m.id} className="af-line"><span className="af-date">{labelDate(m.date)}</span><span className="af-content"><strong>{m.title}</strong><small>Revisar antes de confirmar</small></span><button type="button" className="af-action" onClick={()=>addReference(m)}>Registrar</button></div>)}</section>}
      <details className="af-archive" open={showArchive} onToggle={e=>setShowArchive(e.currentTarget.open)}><summary>Histórico pendiente por depurar ({backlog.length})</summary><p>Son registros antiguos no completados; no se presumen obligaciones vigentes. Se preservan sin llenar la agenda actual.</p>{backlog.slice(0,100).map(t=><div key={t.id} className="af-archive-line"><span>{t.date}</span><span>{t.title}</span><button type="button" onClick={()=>toggle(t.id)}>Marcar resuelta</button></div>)}{backlog.length>100&&<p>Se muestran los primeros 100. Los demás permanecen conservados.</p>}</details>
    </div>
  </div>;
}

/** Frentes reconocidos en conversaciones de octubre, sin dar por verificado su estado. */
export const initialWorkstreams = [
  {
    id: 'WORK-LAJA-LANCEROS', title: 'Lanceros de La Laja', owner: 'Ambos', status: 'review',
    next: 'Precisar formato del piloto, responsabilidades y presupuesto de producción.',
    blocker: '', date: '', updatedAt: '', origin: 'Referencia inicial: revisar y ajustar antes de trabajar.'
  },
  {
    id: 'WORK-CMPC-LAJA', title: 'Conversación CMPC · Laja', owner: 'Ambos', status: 'review',
    next: 'Confirmar horario y objetivo de la reunión propuesta para el jueves 5 de noviembre.',
    blocker: '', date: '', updatedAt: '', origin: 'Contacto exploratorio; no se presume contrato ni reunión confirmada.'
  },
  {
    id: 'WORK-VITRINA', title: 'Vitrina Pyme', owner: 'Francisca', status: 'review',
    next: 'Cerrar tarifario, alcance básico y condiciones para venta por comisión.',
    blocker: '', date: '', updatedAt: '', origin: 'Propuesta comercial en desarrollo; no presume ventas.'
  }
];
export const WORKSTREAM_STATUSES = [
  ['review', 'Por revisar'], ['active', 'En marcha'], ['waiting', 'En espera'],
  ['paused', 'En pausa'], ['closed', 'Cerrado']
];
export const validWorkstream = (raw) => raw && typeof raw === 'object' && typeof raw.id === 'string' && typeof raw.title === 'string';
export function normalizeWorkstreams(value) {
  if (!Array.isArray(value)) return initialWorkstreams.map(item => ({...item}));
  const unique = new Set();
  return value.filter(validWorkstream).filter(item => {
    if (unique.has(item.id)) return false;
    unique.add(item.id); return true;
  }).map(item => ({
    ...item, owner: item.owner || 'Ambos', status: WORKSTREAM_STATUSES.some(([k]) => k===item.status) ? item.status : 'review',
    next: String(item.next || ''), blocker: String(item.blocker || ''), date: String(item.date || ''), updatedAt: String(item.updatedAt || '')
  }));
}
export function nextInstitutionalFocus(tasks, limit=3) {
  const phases = ['formalizacion','operacion','desarrollo'];
  const open = (tasks || []).filter(t => t.program === 'institucional-2026' && t.status !== 'done');
  return open.sort((a,b) => phases.indexOf(a.phase)-phases.indexOf(b.phase) || (a.status==='progress'?-1:b.status==='progress'?1:0) || String(a.date).localeCompare(String(b.date))).slice(0,limit);
}

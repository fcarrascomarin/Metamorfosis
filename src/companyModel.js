/**
 * Adaptador de lectura de datos históricos del OS.
 * Una empresa se representa una vez en pantalla, aunque sus contactos,
 * expediente y documentos sigan guardados en las colecciones originales.
 * No duplica ni elimina registros persistidos.
 */

const LOCALITY_ONLY = /^(laja|concepcion|biobio|región del biobío|chile|por confirmar)$/i;

export function normalizeCompanyName(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function organizationFromContact(contact) {
  const source = String(contact.organization || '').trim();
  const actor = String(contact.actor || '').trim();
  if (!source || LOCALITY_ONLY.test(normalizeCompanyName(source)) || /organización por confirmar/i.test(source)) {
    return actor || 'Organización sin nombre';
  }
  const organization = source.split(/\s+[·•]\s+/)[0].trim();
  return organization || actor || 'Organización sin nombre';
}

// Solo alias conocidos; no se adivinan relaciones societarias ni identidades.
const KNOWN_ALIASES = new Map([
  ['club vegan emporio', 'club vegan'],
  ['clubvegan', 'club vegan']
]);

export function companyKey(name) {
  const normalized = normalizeCompanyName(name);
  return KNOWN_ALIASES.get(normalized) || normalized;
}

export function classifyCompany(company) {
  if (company.unassigned) return 'Por clasificar';
  const statuses = [company.expediente?.status, ...company.contacts.map((c) => c.status), ...company.quotes.map((q) => q.status)].join(' ');
  if (/descartad|cerrad[oa]|exclusión|no prospectar/i.test(statuses) || company.contacts.some((c) => c.type === 'Exclusión')) return 'Cerrada';
  if (company.expediente?.status === 'Propuesta' || /propuesta/i.test(statuses)) return 'Propuesta';
  if (/en espera|espera|preparación|preparacion|contacto preparado|contactada|evaluacion/i.test(statuses)) return 'En seguimiento';
  if (/conversación|conversacion|discovery|piloto/i.test(statuses) || company.contacts.some((c) => ['Discovery', 'Piloto comercial'].includes(c.type))) return 'En conversación';
  return 'En observación';
}

export function buildCompanyIndex({ expedientes = [], fieldRegister = [], quotes = [] } = {}) {
  const result = new Map();
  const ensure = (name) => {
    const key = companyKey(name);
    if (!key) return null;
    if (!result.has(key)) result.set(key, { key, name: String(name).trim(), expediente: null, contacts: [], quotes: [] });
    return result.get(key);
  };

  // Los expedientes son la referencia canónica cuando existen.
  for (const expediente of expedientes) {
    if (!expediente?.name?.trim()) continue;
    const company = ensure(expediente.name);
    if (!company) continue;
    company.name = expediente.name;
    company.expediente = expediente;
  }
  const byId = new Map([...result.values()].filter((company) => company.expediente).map((company) => [company.expediente.id, company]));

  for (const contact of fieldRegister) {
    const company = byId.get(contact.companyId) || ensure(organizationFromContact(contact));
    if (company) company.contacts.push(contact);
  }
  for (const quote of quotes) {
    const name = String(quote.company || '').trim();
    const company = name ? ensure(name) : (() => {
      if (!result.has('__unassigned__')) result.set('__unassigned__', {
        key: '__unassigned__', name: 'Solicitudes sin empresa identificada',
        expediente: null, contacts: [], quotes: [], unassigned: true
      });
      return result.get('__unassigned__');
    })();
    if (company) company.quotes.push(quote);
  }

  return [...result.values()].map((company) => ({ ...company, stage: classifyCompany(company) }))
    .sort((a, b) => Number(Boolean(a.unassigned)) - Number(Boolean(b.unassigned))
      || a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
}

export function nextExpedienteIndex(expedientes = []) {
  return Math.max(0, ...expedientes.map((item) => Number(/^EXP-(\d+)$/.exec(item.id || '')?.[1] || 0))) + 1;
}

/** Conserva los registros guardados, incluso si fueron limpiados intencionalmente. */
export function mergeRepositories(defaults = {}, saved = {}) {
  return {
    ...defaults,
    ...saved,
    documentsByExpediente: {
      ...(defaults.documentsByExpediente || {}),
      ...(saved.documentsByExpediente || {})
    }
  };
}

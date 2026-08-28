export const CONSULTING_TOOLS = [
  {
    id: 'oportunidad',
    number: '01',
    title: 'Ficha de oportunidad',
    stage: '0 · Prospecto',
    purpose: 'Filtrar prospectos antes de invertir trabajo y decidir si corresponde abrir una conversación.',
    when: 'Úsala al detectar un posible prospecto y antes de investigar en profundidad. Debe permitir decidir rápido si vale la pena abrir expediente.',
    visibility: 'Interna',
    limit: 'No transforma señales públicas en un diagnóstico ni regala una solución antes de validar el dolor.',
    fields: [
      { key: 'decisionMaker', label: 'Persona que decide', type: 'text' },
      { key: 'sector', label: 'Rubro o actividad', type: 'text' },
      { key: 'territory', label: 'Ciudad o territorio', type: 'text' },
      { key: 'source', label: 'Cómo llegó a Metamorfosis', type: 'text' },
      { key: 'declaredPain', label: 'Dolor o hipótesis de necesidad', type: 'textarea' },
      { key: 'urgency', label: 'Urgencia', type: 'select', options: ['Baja', 'Media', 'Alta', 'Por validar'] },
      { key: 'paymentCapacity', label: 'Capacidad estimada de pago', type: 'select', options: ['Baja', 'Media', 'Alta', 'Desconocida'] },
      { key: 'fit', label: 'Ajuste con Metamorfosis (1–5)', type: 'number', min: 1, max: 5 },
      { key: 'dispersionRisk', label: 'Riesgo de dispersión (1–5)', type: 'number', min: 1, max: 5 },
      { key: 'nextAction', label: 'Siguiente acción', type: 'textarea' }
    ]
  },
  {
    id: 'perfil',
    number: '02',
    title: 'Perfil preliminar de empresa',
    stage: '0.5 · Preparación previa',
    purpose: 'Ordenar información pública, separar hechos de hipótesis y preparar una conversación inicial con contexto.',
    when: 'Úsala solo cuando la oportunidad superó el filtro inicial. Se completa antes del primer contacto para llegar con contexto sin convertir observaciones públicas en diagnóstico.',
    visibility: 'Interna · uso parcial en reunión',
    limit: 'No reemplaza el diagnóstico pagado. Las redes y señales visibles se registran como observación, no como verdad interna.',
    fields: [
      { key: 'channels', label: 'Canales encontrados', type: 'textarea' },
      { key: 'visibleOffer', label: 'Oferta visible', type: 'textarea' },
      { key: 'conversionPath', label: 'Forma visible de conversión/compra', type: 'textarea' },
      { key: 'observedSignals', label: 'Señales observadas', type: 'textarea' },
      { key: 'hypotheses', label: 'Hipótesis a validar', type: 'textarea' },
      { key: 'initialRisks', label: 'Riesgos iniciales', type: 'textarea' },
      { key: 'initialOpportunities', label: 'Oportunidades iniciales', type: 'textarea' },
      { key: 'possibleAssets', label: 'Activos preliminares', type: 'textarea' },
      { key: 'priorityQuestions', label: 'Preguntas prioritarias', type: 'textarea' },
      { key: 'materialsToRequest', label: 'Materiales a solicitar', type: 'textarea' }
    ]
  },
  {
    id: 'conversacion',
    number: '03',
    title: 'Pauta de conversación inicial',
    stage: '1 · Conversación inicial',
    purpose: 'Validar las hipótesis, detectar dolor real, urgencia, decisor y disposición a avanzar sin convertir la reunión en consultoría gratuita.',
    when: 'Úsala durante y justo después de la primera conversación con el prospecto. Su resultado debe ser una decisión: avanzar, pedir evidencia, reformular o cerrar.',
    visibility: 'Interna · síntesis compartible',
    limit: 'La primera conversación orienta la decisión de avanzar. No sustituye el Mapa o diagnóstico contratado.',
    fields: [
      { key: 'sixMonthGoal', label: 'Qué quieren que pase en los próximos 6 meses', type: 'textarea' },
      { key: 'realPain', label: 'Dolor real detectado', type: 'textarea' },
      { key: 'dependency', label: 'Dependencias de persona, WhatsApp, cuaderno o memoria', type: 'textarea' },
      { key: 'decision', label: 'Quién decide y quién usará la solución', type: 'textarea' },
      { key: 'existingEvidence', label: 'Datos, documentos o registros existentes', type: 'textarea' },
      { key: 'costOfDoingNothing', label: 'Qué pasa si no hacen nada en 3 meses', type: 'textarea' },
      { key: 'disposition', label: 'Disposición: solución puntual o transformación ordenada', type: 'textarea' },
      { key: 'budget', label: 'Rango de inversión o forma de diagnosticarlo', type: 'textarea' },
      { key: 'recommendedOffer', label: 'Oferta recomendada', type: 'textarea' },
      { key: 'nextStep', label: 'Próximo paso acordado', type: 'textarea' }
    ]
  }
];

export const EXPEDIENTE_STATUSES = ['Pendiente', 'En curso', 'Completa', 'No aplica'];

export function createEmptyExpediente(index = 1) {
  const number = String(index).padStart(3, '0');
  return {
    id: `EXP-${number}`,
    name: '',
    sector: '',
    territory: 'Biobío',
    owner: 'Francisca',
    status: 'Prospecto',
    openedAt: new Date().toISOString().slice(0, 10),
    lastUpdate: new Date().toISOString().slice(0, 10),
    notes: '',
    tools: Object.fromEntries(CONSULTING_TOOLS.map((tool) => [tool.id, { status: 'Pendiente', data: {} }]))
  };
}

export function createClubVeganExpediente() {
  return {
    id: 'EXP-001',
    name: 'Club Vegan',
    sector: 'Repostería vegana artesanal',
    territory: 'Concepción, Región del Biobío',
    owner: 'Francisca',
    status: 'En espera',
    openedAt: '2026-08-24',
    lastUpdate: '2026-08-27',
    notes: 'Estado al 28-08-2026: la única señal validada es estética: el mockup generó una reacción positiva (\"wau estaa hermoso\" + Me gusta). El 27-08 Francisca envió un mensaje comentando que Metamorfosis tiene un servicio para pymes a bajo costo por si le interesa. Ese mensaje todavía no ha sido visto. Próximo paso: esperar lectura/respuesta; no insistir, no enviar otro mockup y no preparar una propuesta formal antes de interés explícito.',
    tools: {
      oportunidad: {
        status: 'Completa',
        data: {
          decisionMaker: 'Por confirmar en contacto directo',
          sector: 'Repostería vegana artesanal',
          territory: 'Concepción',
          source: 'Prospección directa · Instagram @clubveganconce',
          declaredPain: 'Aún no hay dolor declarado. Hipótesis a validar: una vitrina web simple podría ordenar información y apoyar tanto venta directa como relación con locales/puntos de venta sin agregar carga operativa.',
          urgency: 'Por validar',
          paymentCapacity: 'Desconocida',
          fit: 4,
          dispersionRisk: 2,
          nextAction: 'Esperar lectura/respuesta al mensaje de seguimiento enviado el 27-08. No intervenir mientras siga sin ver.'
        }
      },
      perfil: {
        status: 'Completa',
        data: {
          channels: 'Instagram @clubveganconce. Canal visible de contacto: mensaje directo.',
          visibleOffer: 'Repostería vegana artesanal en Concepción. El perfil comunica agenda con 2 días de anticipación y operación de lunes a sábado.',
          conversionPath: 'CTA visible: escribir “CATÁLOGO” por DM. La compra parece iniciar mediante conversación privada; debe validarse.',
          observedSignals: '44 publicaciones y 14,2 mil seguidores en la captura revisada. Identidad visual reconocible. Destacados de recetas, información y contenido de comunidad. No se observa en la evidencia revisada un sitio web propio como ruta principal de conversión.',
          hypotheses: '1) Puede existir fricción por concentrar catálogo y contacto en DM.\n2) Una vitrina web muy simple podría ordenar información repetitiva.\n3) La comunidad digital es un activo relevante que conviene no alterar con una solución sobrediseñada.',
          initialRisks: 'Sobrediseñar una solución que agregue administración. Confundir seguidores con capacidad de pago. Concluir sobre la operación interna solo desde redes sociales.',
          initialOpportunities: 'Validar si una Vitrina Pyme reduce preguntas repetidas, centraliza catálogo/información y deriva pedidos al canal que ya usan.',
          possibleAssets: 'Marca ClubVegan, comunidad digital visible, identidad gráfica, catálogo/productos, contenido y conocimiento artesanal.',
          priorityQuestions: '¿Qué información preguntan más por DM?\n¿Cómo comparten hoy el catálogo?\n¿Qué parte del proceso de pedido consume más tiempo?\n¿Qué información cambia con frecuencia?\n¿Qué tendría que resolver una web para valer la pena?\n¿Quién toma la decisión de contratar?\n¿Qué canal quieren mantener como principal?',
          materialsToRequest: 'Catálogo vigente, información de pedidos/entregas que ya comparten con clientes y, solo si avanzan, materiales gráficos autorizados.'
        }
      },
      conversacion: {
        status: 'En curso',
        data: {
          sixMonthGoal: '',
          realPain: '',
          dependency: '',
          decision: '',
          existingEvidence: '',
          costOfDoingNothing: '',
          disposition: '',
          budget: '',
          recommendedOffer: 'Posible Vitrina Pyme como servicio piloto de bajo costo para pymes. Por ahora solo existe agrado por el mockup; el mensaje que menciona el servicio aún no ha sido visto y no hay necesidad ni compra validadas.',
          nextStep: 'Esperar que vea el mensaje enviado el 27-08 y responda. Solo entonces avanzar a conversación de utilidad, condiciones y eventual propuesta.'
        }
      }
    }
  };
}

export function expedienteProgress(expediente) {
  const tools = expediente?.tools || {};
  const relevant = CONSULTING_TOOLS.filter((tool) => tools[tool.id]?.status !== 'No aplica');
  if (!relevant.length) return 0;
  const score = relevant.reduce((sum, tool) => {
    const status = tools[tool.id]?.status;
    if (status === 'Completa') return sum + 1;
    if (status === 'En curso') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((score / relevant.length) * 100);
}

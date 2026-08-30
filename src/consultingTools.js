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
    status: 'Cerrado sin conversión',
    openedAt: '2026-08-24',
    lastUpdate: '2026-08-30',
    notes: 'Cierre al 30-08-2026: Club Vegan reaccionó positivamente al mockup ("wau estaa hermoso" + Me gusta), pero no se validó necesidad, intención de compra ni contratación. El contacto no avanzó a conversación comercial. Decisión vigente: cerrar sin conversión, no insistir ni enviar seguimiento adicional. Reabrir solo si Club Vegan retoma espontáneamente el contacto.',
    tools: {
      oportunidad: {
        status: 'Completa',
        data: {
          decisionMaker: 'No validado',
          sector: 'Repostería vegana artesanal',
          territory: 'Concepción',
          source: 'Prospección directa · Instagram @clubveganconce',
          declaredPain: 'No hubo dolor declarado. La única señal positiva fue estética respecto del mockup; la hipótesis de utilidad de una vitrina no alcanzó validación comercial.',
          urgency: 'Baja',
          paymentCapacity: 'Desconocida',
          fit: 3,
          dispersionRisk: 2,
          nextAction: 'Ninguno. Mantener el expediente cerrado y reabrir únicamente si Club Vegan vuelve por iniciativa propia.'
        }
      },
      perfil: {
        status: 'Completa',
        data: {
          channels: 'Instagram @clubveganconce. Canal visible de contacto: mensaje directo.',
          visibleOffer: 'Repostería vegana artesanal en Concepción; además existe una dimensión B2B potencial con locales/puntos de venta que no alcanzó validación comercial en este piloto.',
          conversionPath: 'La compra visible se articula principalmente por conversación privada/DM. No se validó necesidad de un sitio propio como ruta de conversión.',
          observedSignals: 'Identidad visual reconocible y reacción positiva al mockup. Esa reacción no se interpreta como señal de compra.',
          hypotheses: 'La Vitrina Pyme podía ordenar información repetitiva y apoyar B2C/B2B sin transformarse en ecommerce. El piloto no avanzó lo suficiente para probar esa hipótesis.',
          initialRisks: 'Sobrediseñar; confundir agrado estético con demanda; invertir más trabajo sin permiso comercial.',
          initialOpportunities: 'Aprendizaje para Metamorfosis: separar validación estética, utilidad, necesidad e intención de compra.',
          possibleAssets: 'Marca, comunidad digital, catálogo/productos, contenido y conocimiento artesanal.',
          priorityQuestions: 'Quedan como preguntas de aprendizaje para futuros pilotos, no como tareas pendientes con Club Vegan.',
          materialsToRequest: 'Ninguno mientras el expediente permanezca cerrado.'
        }
      },
      conversacion: {
        status: 'No aplica',
        data: {
          sixMonthGoal: '', realPain: '', dependency: '', decision: '', existingEvidence: '', costOfDoingNothing: '', disposition: '', budget: '',
          recommendedOffer: 'Vitrina Pyme fue planteada como experimento de bajo costo, pero no llegó a propuesta aceptada ni contratación.',
          nextStep: 'Cerrado sin conversión. Reabrir solo si la contraparte retoma espontáneamente el contacto.'
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

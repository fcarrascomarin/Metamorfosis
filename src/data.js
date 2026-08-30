export const contact = {
  phoneDisplay: '+56 9 2377 0543',
  phoneDigits: '56923770543',
  email: 'contacto@metamorfosislab.cl',
  location: 'Biobío, Chile',
  coverage: 'Concepción, Laja, Los Ángeles y atención remota'
};

export const services = [
  {
    icon: 'map',
    title: 'Mapa de Transformación y Activos',
    text: 'Comprendemos el proyecto, detectamos brechas, riesgos, activos y oportunidades, y dejamos una ruta priorizada para decidir.'
  },
  {
    icon: 'account_tree',
    title: 'Orden y sistema',
    text: 'Convertimos procesos dispersos en roles, documentos, registros, indicadores y rutinas que puedan sostenerse.'
  },
  {
    icon: 'design_services',
    title: 'Forma y experiencia',
    text: 'Alineamos identidad, relato, presencia digital y experiencia para que la propuesta sea comprensible y vendible.'
  },
  {
    icon: 'verified_user',
    title: 'Activos y proyección',
    text: 'Reconocemos aquello que el proyecto está creando y definimos cómo documentarlo, protegerlo y convertirlo en una capacidad futura.'
  }
];

export const methodSteps = [
  ['visibility', 'Observar', 'Leer la realidad antes de proponer soluciones.'],
  ['sort', 'Ordenar', 'Distinguir problemas, prioridades y dependencias.'],
  ['architecture', 'Dar forma', 'Diseñar una solución comprensible y habitable.'],
  ['science', 'Experimentar', 'Probar con propósito, medir y aprender antes de escalar.'],
  ['schema', 'Sistematizar', 'Convertir decisiones en procesos, datos y herramientas.'],
  ['shield', 'Proteger', 'Documentar acuerdos, activos y conocimientos valiosos.'],
  ['trending_up', 'Proyectar', 'Preparar el siguiente estado sin perder identidad.']
];

export const initialProjects = [
  {
    name: 'Inteligencia industrial · RUDEL / CMPC / Blumar',
    client: 'Metamorfosis Lab',
    stage: 'Dos reuniones informativas calendarizadas · 04/09 y 11/09',
    progress: 35,
    next: 'Realizar las reuniones confirmadas, completar ficha de campo el mismo día y cerrar la tercera conversación informativa solo si sigue aportando valor',
    status: 'En ejecución'
  },
  {
    name: 'Maquisant · discovery B2B',
    client: 'Validación comercial',
    stage: 'Esperar 1–2 entrevistas informativas',
    progress: 10,
    next: 'Preparar introducción con Víctor Santander sin presumir necesidad ni presentar propuesta anticipada',
    status: 'Próxima prueba'
  },
  {
    name: 'Transmarin · transición organizacional',
    client: 'Validación estratégica',
    stage: 'Preparación de discovery',
    progress: 10,
    next: 'Explorar crecimiento, continuidad, gestión remota, sistemas y sustentabilidad después del aprendizaje industrial',
    status: 'Potencial alto'
  },
  {
    name: 'Club Vegan · Vitrina Pyme',
    client: 'Piloto comercial',
    stage: 'Cerrado sin conversión · 30/08',
    progress: 100,
    next: 'Ninguno. Reabrir solo si Club Vegan retoma espontáneamente el contacto',
    status: 'Cerrado'
  }
];

export const documents = {
  Operativos: ['Pauta de conversación inicial', 'Minuta de reunión', 'Plan de trabajo', 'Informe de avance'],
  Administrativos: ['Propuesta comercial', 'Cotización', 'Acuerdo de confidencialidad', 'Acta de cierre'],
  Metodológicos: ['Ficha de oportunidad', 'Investigación previa', 'Mapa de Transformación y Activos', 'Matriz de riesgos', 'Mapa de mercado y clientes', 'Propuesta de valor y posicionamiento', 'Ficha de levantamiento ergonómico inicial', 'Registro de tiempo y rentabilidad', 'Registro de campo comercial'],
  'Expedientes comerciales': ['Ficha de oportunidad', 'Perfil preliminar de empresa', 'Pauta de conversación inicial']
};


export const repositoryTemplates = [
  {
    id: 'ficha-oportunidad', category: 'Expediente comercial', title: 'Ficha de oportunidad', icon: 'fact_check', sourceTool: 'oportunidad',
    description: 'Filtro inicial para decidir si corresponde invertir tiempo y abrir una conversación. Separa señales, hipótesis, urgencia, capacidad de pago y encaje con Metamorfosis.',
    activate: 'Al detectar una oportunidad y antes de investigar en profundidad.'
  },
  {
    id: 'perfil-preliminar', category: 'Expediente comercial', title: 'Perfil preliminar de empresa', icon: 'domain', sourceTool: 'perfil',
    description: 'Ordena hechos públicos, observaciones e hipótesis antes del primer contacto. Sirve para llegar con contexto sin convertir información visible en diagnóstico.',
    activate: 'Cuando la oportunidad supera el filtro inicial.'
  },
  {
    id: 'pauta-conversacion', category: 'Expediente comercial', title: 'Pauta de conversación inicial', icon: 'forum', sourceTool: 'conversacion',
    description: 'Registra dolor real, urgencia, decisor, evidencia, costo de no actuar y próximo paso. Debe terminar en avanzar, pedir evidencia, reformular o cerrar.',
    activate: 'Durante y justo después de la primera conversación.'
  },
  {
    id: 'investigacion-previa', category: 'Expediente comercial', title: 'Investigación previa', icon: 'search',
    description: 'Bitácora breve de fuentes, hechos comprobados, preguntas abiertas y límites de la investigación. Evita mezclar evidencia externa con inferencias internas.',
    activate: 'Solo cuando una oportunidad justifica preparación adicional.'
  },
  {
    id: 'minuta-reunion', category: 'Operativos', title: 'Minuta de reunión', icon: 'description',
    description: 'Registro ejecutivo de una conversación: asistentes, temas, decisiones, compromisos, evidencia solicitada y siguiente acción.',
    activate: 'Después de toda reunión que produzca una decisión o compromiso.'
  },
  {
    id: 'plan-trabajo', category: 'Operativos', title: 'Plan de trabajo', icon: 'calendar_month',
    description: 'Define objetivo, alcance, fases, responsables, hitos, entregables y criterios de cierre de una intervención ya acordada.',
    activate: 'Después de aceptación comercial y antes de ejecutar.'
  },
  {
    id: 'informe-avance', category: 'Operativos', title: 'Informe de avance', icon: 'monitoring',
    description: 'Síntesis de trabajo ejecutado, evidencia obtenida, decisiones pendientes, riesgos y próximos hitos. Debe ser breve y accionable.',
    activate: 'En intervenciones que requieren más de un hito o reunión de seguimiento.'
  },
  {
    id: 'propuesta-comercial', category: 'Administrativos', title: 'Propuesta comercial', icon: 'request_quote',
    description: 'Explica problema reconocido, alcance, entregables, límites, plazo y valor sin regalar el diagnóstico dentro de la propuesta.',
    activate: 'Solo cuando existe necesidad reconocida y permiso para ofertar.'
  },
  {
    id: 'cotizacion', category: 'Administrativos', title: 'Cotización', icon: 'payments',
    description: 'Documento económico con precio, condiciones, vigencia, costos incluidos y forma de pago. Debe corresponder a un alcance ya definido.',
    activate: 'Cuando la contraparte solicita o acepta revisar condiciones económicas.'
  },
  {
    id: 'confidencialidad', category: 'Administrativos', title: 'Acuerdo de confidencialidad', icon: 'lock',
    description: 'Protege información sensible cuando el levantamiento requiere acceso a datos, procesos o antecedentes que no deben circular fuera del proyecto.',
    activate: 'Solo si el nivel de información lo justifica.'
  },
  {
    id: 'acta-cierre', category: 'Administrativos', title: 'Acta de cierre', icon: 'task_alt',
    description: 'Deja constancia de entregables, transferencia, pendientes aceptados y cierre de responsabilidades al terminar una intervención.',
    activate: 'Al completar una intervención remunerada.'
  },
  {
    id: 'mapa-transformacion', category: 'Metodológicos', title: 'Mapa de Transformación y Activos', icon: 'conversion_path',
    description: 'Diagnóstico estructurado de situación actual, tensiones, activos, prioridades y ruta de transformación. Es una pieza pagada, no una propuesta gratuita.',
    activate: 'Cuando el cliente contrata una etapa de diagnóstico.'
  },
  {
    id: 'matriz-riesgos', category: 'Metodológicos', title: 'Matriz de riesgos', icon: 'warning',
    description: 'Ordena riesgos operacionales, humanos, comerciales, tecnológicos y de implementación según probabilidad, impacto y control posible.',
    activate: 'Cuando la intervención implica decisiones con riesgo material.'
  },
  {
    id: 'mapa-mercado', category: 'Metodológicos', title: 'Mapa de mercado y clientes', icon: 'hub',
    description: 'Representa segmentos, compradores, canales, presiones externas y relaciones relevantes para comprender dónde se genera valor y dónde se pierde.',
    activate: 'Cuando el problema exige comprender mercado, mandantes o canales.'
  },
  {
    id: 'propuesta-valor', category: 'Metodológicos', title: 'Propuesta de valor y posicionamiento', icon: 'campaign',
    description: 'Traduce capacidades y activos de la organización a una propuesta comprensible para un comprador específico, sin reducir la empresa a marketing superficial.',
    activate: 'Cuando existe una transición comercial o de posicionamiento real.'
  },
  {
    id: 'ergonomia-inicial', category: 'Metodológicos', title: 'Ficha de levantamiento ergonómico inicial', icon: 'accessibility_new',
    description: 'Registro opcional de condiciones de trabajo, carga, interacción persona-sistema y riesgos de uso cuando la intervención afecta puestos o rutinas.',
    activate: 'Solo en proyectos donde la dimensión ergonómica sea material.'
  },
  {
    id: 'tiempo-rentabilidad', category: 'Metodológicos', title: 'Registro de tiempo y rentabilidad', icon: 'schedule', navigateTo: 'metrics',
    description: 'Conecta horas, responsable, trabajo facturable/no facturable, costos y honorarios para conocer el margen real de cada experimento.',
    activate: 'Desde el primer minuto de trabajo asociado a una oportunidad o cliente.'
  }
];

const iso = (date) => date.toISOString().slice(0, 10);
const addDays = (base, days) => {
  const value = new Date(`${base}T12:00:00`);
  value.setDate(value.getDate() + days);
  return iso(value);
};

export function createDefaultOsState() {
  const today = iso(new Date());
  const projectMetamorfosis = crypto.randomUUID();
  const projectCm = crypto.randomUUID();
  const projectJuana = crypto.randomUUID();
  const projectExperiencias = crypto.randomUUID();
  return {
    version: '7.0',
    selectedDate: today,
    tasks: [
      {
        id: crypto.randomUUID(),
        date: today,
        start: '09:30',
        end: '10:15',
        owner: 'Francisca',
        topic: 'Metamorfosis',
        title: 'Revisar estado comercial y próximos contactos',
        explain: 'Definir a quién contactar, con qué propuesta y cuál es el cierre esperado.',
        why: 'El sistema debe convertir trabajo interno en movimiento comercial verificable.',
        done_when: 'Queda registrada una acción externa concreta con responsable y fecha.',
        status: 'pending',
        comments: []
      },
      {
        id: crypto.randomUUID(),
        date: today,
        start: '10:30',
        end: '11:30',
        owner: 'Ambos',
        topic: 'Sistema',
        title: 'Cerrar una mejora del sistema Metamorfosis OS',
        explain: 'Elegir una única mejora operativa y llevarla a un estado utilizable.',
        why: 'La plataforma debe reducir dispersión, no convertirse en otro proyecto infinito.',
        done_when: 'La mejora queda probada, documentada y sin pendientes críticos abiertos.',
        status: 'pending',
        comments: []
      },
      {
        id: crypto.randomUUID(),
        date: addDays(today, 1),
        start: '10:00',
        end: '11:00',
        owner: 'Francisca',
        topic: 'CM',
        title: 'Revisar próximo hito de Consolidación CM',
        explain: 'Confirmar entregable, evidencia faltante y responsable de cada antecedente.',
        why: 'CM es el caso demostrativo que debe producir evidencia real del método.',
        done_when: 'El siguiente hito tiene criterio de cierre, documentos y fecha definida.',
        status: 'pending',
        comments: []
      },
      {
        id: crypto.randomUUID(),
        date: addDays(today, 2),
        start: '18:30',
        end: '19:00',
        owner: 'Ambos',
        topic: 'Dirección',
        title: 'Cierre semanal del sistema',
        explain: 'Revisar avances, bloqueos y una prioridad por frente para la semana siguiente.',
        why: 'El sistema necesita cierres breves para no acumular decisiones invisibles.',
        done_when: 'Cada frente activo queda con un próximo paso y un límite explícito.',
        status: 'pending',
        comments: []
      }
    ],
    guides: {
      [today]: {
        name: 'Cerrar antes de abrir',
        why: 'Priorizar una mejora operativa y una acción comercial antes de sumar nuevas ideas.',
        limit: 'No abrir nuevos módulos ni servicios sin cerrar el resultado definido para hoy.'
      },
      [addDays(today, 1)]: {
        name: 'Caso demostrativo',
        why: 'El trabajo con CM debe convertirse en evidencia, metodología y entregables reutilizables.',
        limit: 'No confundir avance declarado con avance documentado.'
      },
      [addDays(today, 2)]: {
        name: 'Revisión y descanso',
        why: 'El cierre semanal protege la continuidad y evita arrastrar decisiones sin dueño.',
        limit: 'La revisión no debe transformarse en una nueva jornada completa.'
      }
    },
    finance: {
      fixedCosts: 0,
      variableCosts: 0,
      recurringIncome: 0,
      expectedIncome: 0,
      availableCash: 0,
      committedPayments: 0,
      notes: 'Registrar únicamente montos del negocio. La caja personal y familiar se mantiene separada en el módulo Vida familiar.'
    },
    timeTracking: {
      rates: {
        Francisca: 0,
        'Benjamín': 0,
        Ambos: 0,
        Externo: 0
      },
      projects: [
        {
          id: projectMetamorfosis,
          name: 'Metamorfosis Lab',
          client: 'Proyecto propio',
          fee: 0,
          directCosts: 0,
          targetHours: 0,
          status: 'Activo'
        },
        {
          id: projectCm,
          name: 'Consultoría de Consolidación CM',
          client: 'CM Banquetería & Restaurant',
          fee: 0,
          directCosts: 0,
          targetHours: 0,
          status: 'Activo'
        },
        {
          id: projectJuana,
          name: 'Juana de Arco',
          client: 'Francisca Carrasco',
          fee: 0,
          directCosts: 0,
          targetHours: 0,
          status: 'Desarrollo'
        },
        {
          id: projectExperiencias,
          name: 'Experiencias',
          client: 'Proyecto asociado',
          fee: 0,
          directCosts: 0,
          targetHours: 0,
          status: 'Validación'
        }
      ],
      entries: [],
      note: 'Registrar tiempo real, incluso cuando no sea facturable. Las tarifas internas representan costo de trabajo, no precio de venta.'
    },
    fronts: [
      {
        id: crypto.randomUUID(),
        name: 'Metamorfosis Lab',
        leader: 'Francisca',
        state: 'Prioridad central',
        next: 'Convertir la propuesta comercial y el Mapa en una oferta comprensible y vendible.',
        limit: 'No ampliar el catálogo antes de validar la puerta de entrada.'
      },
      {
        id: crypto.randomUUID(),
        name: 'Consultoría de Consolidación CM',
        leader: 'Francisca',
        state: 'Activo',
        next: 'Cerrar hitos con evidencia, responsables y documentos asociados.',
        limit: 'Sistema Interno CM es un entregable de la consultoría, no un proyecto separado.'
      },
      {
        id: crypto.randomUUID(),
        name: 'Método Metamorfosis',
        leader: 'Francisca',
        state: 'Estandarización',
        next: 'Consolidar ficha de oportunidad, investigación previa y conversación inicial.',
        limit: 'No crear documentos aislados sin función dentro del recorrido completo.'
      },
      {
        id: crypto.randomUUID(),
        name: 'CM Experiencias',
        leader: 'Compartido',
        state: 'Validación',
        next: 'Probar el piloto sin comprometer caja ni operación central.',
        limit: 'No escalar ni formalizar una nueva estructura antes de validar demanda y costos.'
      }
    ],
    decisions: [
      'Francisca lidera Metamorfosis y mantiene la decisión final del proyecto.',
      'CM es el primer caso demostrativo vivo del método; no se presentará como caso cerrado antes de medir resultados.',
      'La web pública comunica valor comercial. Los riesgos, cifras y documentos de trabajo permanecen en el panel privado.',
      'Los procesos temporales de consultoría se ubican al final del menú y no desplazan la operación diaria.'
    ],
    inbox: [],
    family: {
      phase: 'PREPARAR',
      phaseNote: 'Hasta el término de la licencia y la renuncia a la DPP. Después el sistema cambia a MERCADO.',
      weekLabel: 'Semana del 3 al 9 de agosto de 2026',
      wellbeing: [
        { id: crypto.randomUUID(), name: 'Benjamín', area: 'Salud y transición', status: 'Atención', load: 'Media', note: 'Recuperación, Magíster y preparación profesional sin reconstruir una jornada de 45 horas.' },
        { id: crypto.randomUUID(), name: 'Francisca', area: 'Liderazgo y proyectos', status: 'Atención', load: 'Alta', note: 'Proteger su liderazgo en Metamorfosis sin absorber toda la carga familiar.' },
        { id: crypto.randomUUID(), name: 'Pareja', area: 'Vínculo y descanso', status: 'Bien', load: 'Media', note: 'Reservar al menos un espacio sin proyectos, caja ni planificación.' },
        { id: crypto.randomUUID(), name: 'Santiago y familia', area: 'Vida cotidiana', status: 'Bien', load: 'Media', note: 'La agenda laboral se acomoda también a la vida familiar.' }
      ],
      weeklyActions: [
        { id: crypto.randomUUID(), owner: 'Benjamín', title: 'Aterrizar agosto y mantener utilizable el Sistema Familiar V1.0', load: 'Exigente', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Benjamín', title: 'Preparar Con Criterio sin activación comercial durante la licencia', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Francisca', title: 'Definir la prioridad operativa de Metamorfosis para agosto', load: 'Exigente', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Francisca', title: 'Ordenar los hitos reales de CM y Experiencias', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Cerrar el ciclo financiero actual con datos confirmados', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Completar una microintervención cerrable del hogar', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Proteger un bloque familiar sin trabajo', load: 'Ligera', status: 'pending' }
      ],
      workFronts: [
        { id: crypto.randomUUID(), name: 'Con Criterio', leader: 'Benjamín', state: 'Preparar', next: 'Cerrar Mesa V1 y revisar la economía conjunta de Taller, Mapa y Mesa.', limit: 'Sin contacto comercial durante la licencia.' },
        { id: crypto.randomUUID(), name: 'Magíster e investigación', leader: 'Benjamín', state: 'Activo', next: 'Ordenar el bloque intensivo y explorar criminología verde como giro rector, manteniendo la tesis anterior en pausa.', limit: 'No convertir toda lectura interesante en una nueva línea activa.' },
        { id: crypto.randomUUID(), name: 'Metamorfosis', leader: 'Francisca', state: 'Activo', next: 'Priorizar operación, oferta y casos reales en Biobío.', limit: 'No abrir más productos sin capacidad ni demanda comprobada.' },
        { id: crypto.randomUUID(), name: 'CM Banquetería & Restaurant', leader: 'Francisca', state: 'Cierre', next: 'Cerrar los compromisos sanitarios y operativos pendientes.', limit: 'No expandir antes de ordenar y regularizar la operación real.' },
        { id: crypto.randomUUID(), name: 'Experiencias', leader: 'Compartido', state: 'Validación', next: 'Definir el piloto viable sin sobredimensionar inversión ni carga.', limit: 'No tratar líneas antiguas como proyectos separados.' }
      ],
      home: {
        phase: 'Fase 0 · Recuperación funcional',
        budget: 30000,
        intervention: 'Living/comedor: humedad, ventilación y rescate funcional',
        rule: 'Una zona abierta y una cerrada. No comprar para ordenar ni remodelar todavía.',
        checklist: [
          { id: crypto.randomUUID(), title: 'Limpiar y registrar los hongos visibles del living', status: 'pending' },
          { id: crypto.randomUUID(), title: 'Definir una rutina de ventilación compatible con la seguridad de los gatos', status: 'pending' },
          { id: crypto.randomUUID(), title: 'Resolver el problema inmediato de la cortina del living', status: 'pending' },
          { id: crypto.randomUUID(), title: 'Registrar daños de sillones, alfombra y mobiliario para fases posteriores', status: 'pending' }
        ]
      },
      cycle: {
        name: 'Ciclo actual',
        startDate: '2026-08-02',
        endDate: '2026-08-03',
        availableCash: 0,
        nextIncomeLabel: 'Pago de licencia médica',
        nextIncomeAmount: 1100000,
        nextIncomeDate: '2026-08-03',
        nextIncomeStatus: 'Probable, no confirmado',
        mandatoryPayments: 0,
        protectedAmount: 0,
        monthlyBase: 1300000,
        notes: 'No comprometer el ingreso hasta verlo abonado. Revisar si en este ciclo corresponden $150.000 al padre y $225.000 de apoyos antes de cargarlos como pagos obligatorios. Las finanzas del negocio siguen en su módulo propio.'
      },
      inventory: [
        { id: crypto.randomUUID(), title: 'Sistema Familiar V1.0', area: 'Familia', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Salud y recuperación de Benjamín', area: 'Nosotros', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Magíster y criminología verde', area: 'Académico', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Fase 0 del hogar', area: 'Hogar', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Con Criterio', area: 'Trabajo', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Metamorfosis', area: 'Trabajo', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'CM Banquetería & Restaurant', area: 'Trabajo', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Experiencias', area: 'Trabajo', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Vía docente y caja profesional de Benjamín', area: 'Trabajo', status: 'Próximo' },
        { id: crypto.randomUUID(), title: 'Activación comercial de Benjamín', area: 'Trabajo', status: 'Esperando condición' },
        { id: crypto.randomUUID(), title: 'Más allá de la sanción', area: 'Académico', status: 'Pausado' },
        { id: crypto.randomUUID(), title: 'CatLoop', area: 'Proyecto', status: 'Pausado' },
        { id: crypto.randomUUID(), title: 'Juana de Arco', area: 'Proyecto', status: 'Pausado' },
        { id: crypto.randomUUID(), title: 'Remodelación integral y oficina', area: 'Hogar', status: 'Futuro' },
        { id: crypto.randomUUID(), title: 'Viajes familiares', area: 'Ahorro', status: 'Futuro' },
        { id: crypto.randomUUID(), title: 'Parcela', area: 'Ahorro', status: 'Futuro' }
      ],
      exclusions: [
        'No reinventar Con Criterio durante agosto.',
        'No iniciar otra empresa o proyecto autónomo.',
        'No comenzar la remodelación integral con el colchón de transición.',
        'No convertir cada idea interesante en una obligación inmediata.',
        'No exigir la misma carga a Benjamín y Francisca: se distribuye por energía, liderazgo y responsabilidad.'
      ]
    }
  };
}

export const TOPICS = ['Metamorfosis', 'CM', 'Comercial', 'Sistema', 'Familia', 'Hogar', 'Finanzas', 'Documentos', 'Dirección', 'Otro'];
export const OWNERS = ['Francisca', 'Benjamín', 'Ambos', 'Externo'];

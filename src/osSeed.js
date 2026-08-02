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
    version: '6.0',
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
      notes: 'Registrar únicamente montos del negocio. No incorporar información personal o familiar en un repositorio compartido.'
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
    inbox: []
  };
}

export const TOPICS = ['Metamorfosis', 'CM', 'Comercial', 'Sistema', 'Finanzas', 'Documentos', 'Dirección', 'Otro'];
export const OWNERS = ['Francisca', 'Benjamín', 'Ambos', 'Externo'];

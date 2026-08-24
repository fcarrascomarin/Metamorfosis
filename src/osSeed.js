const iso = (date) => date.toISOString().slice(0, 10);
const addDays = (base, days) => {
  const value = new Date(`${base}T12:00:00`);
  value.setDate(value.getDate() + days);
  return iso(value);
};

export const OS_SCHEMA_VERSION = '8.0';
const COMMERCIAL_WEEK = {
  monday: '2026-08-24',
  tuesday: '2026-08-25',
  wednesday: '2026-08-26',
  thursday: '2026-08-27',
  friday: '2026-08-28'
};

export function createDefaultOsState() {
  const today = iso(new Date());
  const projectMetamorfosis = crypto.randomUUID();
  const projectCm = crypto.randomUUID();
  const projectJuana = crypto.randomUUID();
  const projectExperiencias = crypto.randomUUID();
  return {
    version: OS_SCHEMA_VERSION,
    selectedDate: today < COMMERCIAL_WEEK.monday ? COMMERCIAL_WEEK.monday : today,
    tasks: [
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.monday, start: '09:30', end: '11:00', owner: 'Ambos', topic: 'Comercial',
        title: 'Construir y puntuar el universo de prospectos del Biobío',
        explain: 'Levantar candidatos reales y evaluarlos con los diez criterios acordados: dolor, compatibilidad, pago, acceso, facilidad, medición, valor como caso, aprendizaje, repetición y contacto inmediato.',
        why: 'El mercado inicial debe seleccionarse con evidencia y no por intuición.',
        done_when: 'Existe una matriz comparable de candidatos suficiente para tomar una decisión.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.monday, start: '11:15', end: '12:00', owner: 'Francisca', topic: 'Comercial',
        title: 'Seleccionar 5 prospectos definitivos y 2 suplentes',
        explain: 'Elegir los cinco experimentos comerciales de la semana, incluyendo obligatoriamente Club Vegan, y definir qué hipótesis prueba cada uno.',
        why: 'La semana necesita una muestra pequeña pero deliberada que genere aprendizaje comercial.',
        done_when: 'Quedan 5 prospectos titulares + 2 suplentes con hipótesis y canal probable de contacto.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.tuesday, start: '09:30', end: '10:30', owner: 'Francisca', topic: 'Comercial',
        title: 'Completar diagnóstico previo de Club Vegan',
        explain: 'Revisar actividad, presencia digital, operación visible, decisor y problema de entrada más plausible antes de contactar.',
        why: 'Club Vegan es el primer prospecto obligatorio y debe recibir una propuesta específica, no genérica.',
        done_when: 'Ficha breve lista con problema probable, decisor, canal y oferta de entrada.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.tuesday, start: '10:45', end: '12:15', owner: 'Ambos', topic: 'Comercial',
        title: 'Completar fichas previas de los otros 4 prospectos',
        explain: 'Investigar únicamente lo necesario para formular una oferta competente: actividad, señales de dolor, decisor, capacidad probable de pago y entrada Metamorfosis.',
        why: 'La investigación previa debe elevar la calidad del contacto sin transformarse en un proyecto de escritorio.',
        done_when: 'Los cinco prospectos tienen ficha breve comparable y una hipótesis de valor.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.wednesday, start: '09:30', end: '11:00', owner: 'Ambos', topic: 'Comercial',
        title: 'Diseñar las 5 ofertas específicas',
        explain: 'Construir una entrada concreta para cada prospecto: Vitrina Pyme, ordenamiento/trazabilidad, Ciclo Seguro u otra intervención mínima coherente con la evidencia.',
        why: 'Metamorfosis debe probar problemas concretos y no enviar una presentación genérica cinco veces.',
        done_when: 'Cada prospecto tiene oferta, resultado esperado y siguiente paso definidos.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.wednesday, start: '11:15', end: '12:00', owner: 'Francisca', topic: 'Comercial',
        title: 'Cerrar alcance, precio y canal de cada propuesta',
        explain: 'Revisar que cada oferta sea simple, cobrable y ejecutable, con condiciones claras y sin sobrediseño.',
        why: 'Una propuesta no está lista hasta que el cliente puede entender qué obtiene, cuánto cuesta y qué debe hacer después.',
        done_when: 'Las 5 ofertas quedan listas para envío sin pendientes internos críticos.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.thursday, start: '09:30', end: '10:45', owner: 'Francisca', topic: 'Comercial',
        title: 'Enviar las 5 ofertas al mercado',
        explain: 'Contactar efectivamente a los cinco prospectos por el canal más directo disponible. Club Vegan debe recibir su propuesta sí o sí.',
        why: 'El cuello de botella actual es la conversión entre capacidad interna y respuesta externa.',
        done_when: 'Cinco organizaciones reales han recibido una propuesta concreta de Metamorfosis.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.thursday, start: '11:00', end: '11:30', owner: 'Ambos', topic: 'Sistema',
        title: 'Registrar contactos y próximos seguimientos',
        explain: 'Registrar prospecto, canal, hora, propuesta enviada, responsable y próxima fecha razonable de seguimiento.',
        why: 'Cada contacto debe producir memoria comercial y no depender de conversaciones dispersas.',
        done_when: 'Los cinco contactos aparecen trazables en el sistema con estado y próximo paso.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.friday, start: '09:30', end: '10:30', owner: 'Ambos', topic: 'Dirección',
        title: 'Leer respuestas, silencios y objeciones',
        explain: 'Revisar las señales recibidas sin sobrerreaccionar a un caso aislado y distinguir interés, confusión, precio, timing y falta de dolor.',
        why: 'La evidencia comercial debe empezar a seleccionar el mercado y mejorar la oferta.',
        done_when: 'Cada prospecto tiene aprendizaje registrado y seguimiento definido cuando corresponde.', status: 'pending', comments: []
      },
      {
        id: crypto.randomUUID(), date: COMMERCIAL_WEEK.friday, start: '10:45', end: '11:30', owner: 'Ambos', topic: 'Dirección',
        title: 'Cerrar la semana comercial y decidir el siguiente experimento',
        explain: 'Comparar las cinco pruebas y definir qué mantener, ajustar o descartar para la semana siguiente.',
        why: 'Metamorfosis debe vender, ejecutar, medir, documentar, ajustar y repetir.',
        done_when: 'Existe un tablero comercial actualizado y una prioridad comercial única para la semana siguiente.', status: 'pending', comments: []
      }
    ],
    guides: {
      [COMMERCIAL_WEEK.monday]: {
        name: 'Seleccionar con evidencia',
        why: 'La prioridad es escoger bien cinco experimentos de mercado, no abrir nuevas líneas.',
        limit: 'Cerrar 5 prospectos + 2 suplentes antes de producir nuevas piezas comerciales.'
      },
      [COMMERCIAL_WEEK.tuesday]: {
        name: 'Investigar solo lo necesario',
        why: 'El diagnóstico previo debe mejorar la propuesta sin postergar el contacto.',
        limit: 'Una ficha breve por prospecto; no convertir la investigación en consultoría gratuita.'
      },
      [COMMERCIAL_WEEK.wednesday]: {
        name: 'Oferta específica y cobrable',
        why: 'Cada prospecto debe recibir una entrada coherente con su dolor probable y con nuestras capacidades reales.',
        limit: 'No enviar una propuesta genérica ni construir soluciones que nadie haya comprado.'
      },
      [COMMERCIAL_WEEK.thursday]: {
        name: 'Tocar mercado',
        why: 'Hoy la prioridad es exposición externa: cinco ofertas efectivamente enviadas.',
        limit: 'Club Vegan debe ser contactado y cada envío debe quedar registrado.'
      },
      [COMMERCIAL_WEEK.friday]: {
        name: 'Aprender antes de ampliar',
        why: 'Las respuestas, silencios y objeciones son evidencia para seleccionar mercado.',
        limit: 'No rediseñar Metamorfosis por una sola reacción; buscar patrones y definir un siguiente experimento.'
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
          name: 'Caso 0 · CM Banquetería & Restaurant',
          client: 'CM Banquetería & Restaurant',
          fee: 0,
          directCosts: 0,
          targetHours: 0,
          status: 'Cerrado · Caso 0'
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
        id: crypto.randomUUID(), name: 'Validación comercial · 5 prospectos', leader: 'Francisca', state: 'Prioridad semanal',
        next: 'Seleccionar, preparar y enviar cinco ofertas reales en Biobío antes del cierre del jueves 27.',
        limit: 'No abrir nuevas líneas ni rediseñar la arquitectura mientras no se complete el experimento.'
      },
      {
        id: crypto.randomUUID(), name: 'Vitrina Pyme · Club Vegan', leader: 'Francisca', state: 'Prueba comercial',
        next: 'Preparar una oferta de entrada simple y enviarla durante esta semana.',
        limit: 'Usarla como gimnasio comercial y línea de caja; no redefinir Metamorfosis como agencia web.'
      },
      {
        id: crypto.randomUUID(), name: 'Ordenamiento y trazabilidad operacional', leader: 'Ambos', state: 'Hipótesis prioritaria',
        next: 'Probar el dolor en uno o dos prospectos con procesos informales, registros dispersos o exigencias de trazabilidad.',
        limit: 'Validar problema y disposición a pagar antes de estandarizar un producto.'
      },
      {
        id: crypto.randomUUID(), name: 'Ciclo Seguro', leader: 'Francisca', state: 'Hipótesis a validar',
        next: 'Usar al menos un prospecto pertinente para validar dolor, decisor y disposición a pagar.',
        limit: 'No construir software, plataforma ni infraestructura antes de obtener evidencia comercial.'
      },
      {
        id: crypto.randomUUID(), name: 'Caso 0 · CM Banquetería & Restaurant', leader: 'Francisca', state: 'Cerrado · estudio',
        next: 'Conservar y explotar la evidencia recopilada como antecedente metodológico y comercial.',
        limit: 'CM ya fue entregado; no reabrir intervención. Trabajarlo solo para extraer evidencia, resultados y aprendizaje.'
      }
    ],
    decisions: [
      'Francisca lidera Metamorfosis y mantiene la decisión final del proyecto.',
      'La prioridad del 24 al 28 de agosto es seleccionar y contactar 5 prospectos reales del Biobío, incluyendo Club Vegan.',
      'El mercado inicial se selecciona con evidencia: dolor, disposición a pagar, acceso al decisor, repetibilidad y valor como caso.',
      'CM Banquetería & Restaurant está cerrado y pasa a ser Caso 0 de estudio de Metamorfosis.',
      'Metamorfosis no necesita demostrar que puede imaginar más; necesita demostrar que puede repetir valor.',
      'Durante esta etapa, el trabajo interno debe aumentar ventas, evidencia, capacidad de ejecución o margen.'
    ],
    inbox: [],
    family: {
      phase: 'PREPARAR',
      phaseNote: 'Hasta el término de la licencia y la renuncia a la DPP. Después el sistema cambia a MERCADO.',
      weekLabel: 'Semana del 24 al 30 de agosto de 2026',
      wellbeing: [
        { id: crypto.randomUUID(), name: 'Benjamín', area: 'Salud y transición', status: 'Atención', load: 'Media', note: 'Recuperación, Magíster y preparación profesional sin reconstruir una jornada de 45 horas.' },
        { id: crypto.randomUUID(), name: 'Francisca', area: 'Liderazgo y proyectos', status: 'Atención', load: 'Alta', note: 'Proteger su liderazgo en Metamorfosis sin absorber toda la carga familiar.' },
        { id: crypto.randomUUID(), name: 'Pareja', area: 'Vínculo y descanso', status: 'Bien', load: 'Media', note: 'Reservar al menos un espacio sin proyectos, caja ni planificación.' },
        { id: crypto.randomUUID(), name: 'Santiago y familia', area: 'Vida cotidiana', status: 'Bien', load: 'Media', note: 'La agenda laboral se acomoda también a la vida familiar.' }
      ],
      weeklyActions: [
        { id: crypto.randomUUID(), owner: 'Benjamín', title: 'Aterrizar agosto y mantener utilizable el Sistema Familiar V1.0', load: 'Exigente', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Benjamín', title: 'Preparar Con Criterio sin activación comercial durante la licencia', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Francisca', title: 'Enviar 5 ofertas reales de Metamorfosis y registrar sus respuestas', load: 'Exigente', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Convertir CM cerrado en evidencia útil como Caso 0, sin reabrir la intervención', load: 'Ligera', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Cerrar el ciclo financiero actual con datos confirmados', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Completar una microintervención cerrable del hogar', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Proteger un bloque familiar sin trabajo', load: 'Ligera', status: 'pending' }
      ],
      workFronts: [
        { id: crypto.randomUUID(), name: 'Con Criterio', leader: 'Benjamín', state: 'Preparar', next: 'Cerrar Mesa V1 y revisar la economía conjunta de Taller, Mapa y Mesa.', limit: 'Sin contacto comercial durante la licencia.' },
        { id: crypto.randomUUID(), name: 'Magíster e investigación', leader: 'Benjamín', state: 'Activo', next: 'Ordenar el bloque intensivo y explorar criminología verde como giro rector, manteniendo la tesis anterior en pausa.', limit: 'No convertir toda lectura interesante en una nueva línea activa.' },
        { id: crypto.randomUUID(), name: 'Metamorfosis', leader: 'Francisca', state: 'Activo', next: 'Priorizar operación, oferta y casos reales en Biobío.', limit: 'No abrir más productos sin capacidad ni demanda comprobada.' },
        { id: crypto.randomUUID(), name: 'CM Banquetería & Restaurant', leader: 'Francisca', state: 'Caso 0', next: 'Usar la información recopilada para evidencia y aprendizaje de Metamorfosis.', limit: 'Intervención entregada y terminada; no reabrir trabajo operativo.' },
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
        { id: crypto.randomUUID(), title: 'CM Banquetería & Restaurant · Caso 0', area: 'Trabajo', status: 'Caso 0' },
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

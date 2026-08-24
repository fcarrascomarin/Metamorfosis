import { createClubVeganExpediente } from './consultingTools.js';

const iso = (date) => date.toISOString().slice(0, 10);
export const OS_SCHEMA_VERSION = '9.0';

const WEEK = {
  monday: '2026-08-24',
  tuesday: '2026-08-25',
  wednesday: '2026-08-26',
  thursday: '2026-08-27',
  friday: '2026-08-28'
};

const task = (date, start, end, owner, title, explain, doneWhen) => ({
  id: crypto.randomUUID(), date, start, end, owner, topic: 'Comercial', title,
  explain, why: 'La prioridad actual es convertir capacidad interna en evidencia comercial real.',
  done_when: doneWhen, status: 'pending', comments: []
});

export function createDefaultOsState() {
  const today = iso(new Date());
  const projectMetamorfosis = crypto.randomUUID();
  const projectJuana = crypto.randomUUID();
  const projectExperiencias = crypto.randomUUID();

  return {
    version: OS_SCHEMA_VERSION,
    selectedDate: today < WEEK.monday ? WEEK.monday : today,
    tasks: [
      task(WEEK.monday, '09:30', '11:00', 'Ambos', 'Construir y puntuar el universo de prospectos del Biobío', 'Levantar candidatos reales y evaluarlos por dolor, compatibilidad, capacidad de pago, acceso al decisor, facilidad de intervención, medición, aprendizaje, repetición y contacto inmediato.', 'Existe una matriz comparable de candidatos suficiente para tomar una decisión.'),
      task(WEEK.monday, '11:15', '12:00', 'Francisca', 'Seleccionar 5 prospectos definitivos y 2 suplentes', 'Elegir los cinco experimentos comerciales de la semana, incluyendo ClubVegan, y definir qué hipótesis prueba cada uno.', 'Quedan 5 prospectos titulares + 2 suplentes con hipótesis y canal probable de contacto.'),
      task(WEEK.tuesday, '09:30', '10:30', 'Francisca', 'Completar expediente preliminar de ClubVegan', 'Revisar ficha de oportunidad y perfil preliminar; separar hechos observados, hipótesis y preguntas para contacto.', 'EXP-001 tiene ficha y perfil completos, con preguntas prioritarias listas.'),
      task(WEEK.tuesday, '10:45', '12:15', 'Ambos', 'Completar fichas previas de los otros 4 prospectos', 'Investigar únicamente lo necesario para formular una oferta competente: actividad, señales de dolor, decisor, capacidad probable de pago y entrada Metamorfosis.', 'Los cinco prospectos tienen expediente breve y una hipótesis de valor.'),
      task(WEEK.wednesday, '09:30', '11:00', 'Ambos', 'Diseñar las 5 ofertas específicas', 'Construir una entrada concreta para cada prospecto: Vitrina Pyme, ordenamiento/trazabilidad, Ciclo Seguro u otra intervención mínima coherente con la evidencia.', 'Cada prospecto tiene oferta, resultado esperado y siguiente paso definidos.'),
      task(WEEK.wednesday, '11:15', '12:00', 'Francisca', 'Cerrar alcance, precio y canal de cada propuesta', 'Revisar que cada oferta sea simple, cobrable y ejecutable, con condiciones claras y sin sobrediseño.', 'Las 5 ofertas quedan listas para envío sin pendientes internos críticos.'),
      task(WEEK.thursday, '09:30', '10:45', 'Francisca', 'Enviar las 5 ofertas al mercado', 'Contactar efectivamente a los cinco prospectos por el canal más directo disponible. ClubVegan debe recibir su propuesta sí o sí.', 'Cinco organizaciones reales han recibido una propuesta concreta de Metamorfosis.'),
      task(WEEK.thursday, '11:00', '11:30', 'Ambos', 'Registrar contactos y próximos seguimientos', 'Registrar prospecto, canal, hora, propuesta enviada, responsable y próxima fecha razonable de seguimiento.', 'Cada contacto queda trazado en su expediente y en oportunidades.'),
      task(WEEK.friday, '09:30', '10:30', 'Ambos', 'Leer respuestas, silencios y objeciones', 'Revisar respuestas y ausencia de respuesta sin reinterpretar todo el negocio por una reacción aislada.', 'Queda una síntesis de señales y objeciones por prospecto.'),
      task(WEEK.friday, '10:45', '11:30', 'Francisca', 'Cerrar aprendizaje comercial de la semana', 'Definir qué mensaje generó interés, qué dolor se reconoció, quién decide y cuál es el siguiente experimento.', 'Existe una decisión explícita para la semana siguiente basada en evidencia.')
    ],
    guides: {
      [WEEK.monday]: { name: 'Elegir bien', why: 'La muestra debe enseñar algo, no solo completar cinco nombres.', limit: 'No diseñar ofertas antes de cerrar la selección.' },
      [WEEK.tuesday]: { name: 'Llegar preparados', why: 'La investigación previa mejora la conversación sin regalar el diagnóstico.', limit: 'Máximo 60–90 minutos por prospecto relevante.' },
      [WEEK.wednesday]: { name: 'Hacer ofertas comprensibles', why: 'Cada propuesta debe resolver un problema específico y tener un siguiente paso claro.', limit: 'No enviar la misma propuesta cinco veces.' },
      [WEEK.thursday]: { name: 'Tocar mercado', why: 'Una propuesta no existe comercialmente hasta que alguien externo la recibe.', limit: 'Cinco envíos efectivos antes de seguir preparando.' },
      [WEEK.friday]: { name: 'Aprender antes de ampliar', why: 'Las respuestas, silencios y objeciones ayudan a seleccionar mercado.', limit: 'Buscar patrones; no rediseñar Metamorfosis por una sola reacción.' }
    },
    finance: {
      fixedCosts: 0, variableCosts: 0, recurringIncome: 0, expectedIncome: 0,
      availableCash: 0, committedPayments: 0,
      notes: 'Registrar únicamente montos del negocio. La caja personal y familiar se administra por separado.'
    },
    timeTracking: {
      rates: { Francisca: 0, 'Benjamín': 0, Ambos: 0, Externo: 0 },
      projects: [
        { id: projectMetamorfosis, name: 'Metamorfosis Lab', client: 'Proyecto propio', fee: 0, directCosts: 0, targetHours: 0, status: 'Activo' },
        { id: projectJuana, name: 'Juana de Arco', client: 'Francisca Carrasco', fee: 0, directCosts: 0, targetHours: 0, status: 'Desarrollo' },
        { id: projectExperiencias, name: 'Experiencias', client: 'Proyecto asociado', fee: 0, directCosts: 0, targetHours: 0, status: 'Validación' }
      ],
      entries: [],
      note: 'Registrar tiempo real, incluso cuando no sea facturable. Las tarifas internas representan costo de trabajo, no precio de venta.'
    },
    fronts: [
      { id: crypto.randomUUID(), name: 'Validación comercial · 5 prospectos', leader: 'Francisca', state: 'Prioridad semanal', next: 'Seleccionar, preparar y enviar cinco ofertas reales en Biobío.', limit: 'No abrir nuevas líneas mientras no se complete el experimento.' },
      { id: crypto.randomUUID(), name: 'Vitrina Pyme · ClubVegan', leader: 'Francisca', state: 'Prueba comercial', next: 'Preparar una oferta de entrada simple y enviarla durante esta semana.', limit: 'Usarla como gimnasio comercial y línea de caja; no redefinir Metamorfosis como agencia web.' },
      { id: crypto.randomUUID(), name: 'Ordenamiento y trazabilidad operacional', leader: 'Ambos', state: 'Hipótesis prioritaria', next: 'Probar el dolor en uno o dos prospectos con procesos informales o registros dispersos.', limit: 'Validar problema y disposición a pagar antes de estandarizar un producto.' },
      { id: crypto.randomUUID(), name: 'Ciclo Seguro', leader: 'Francisca', state: 'Hipótesis a validar', next: 'Validar dolor, decisor y disposición a pagar en un prospecto pertinente.', limit: 'No construir software ni infraestructura antes de obtener evidencia comercial.' }
    ],
    decisions: [
      'Francisca lidera Metamorfosis y mantiene la decisión final del proyecto.',
      'La prioridad del 24 al 28 de agosto es seleccionar y contactar 5 prospectos reales del Biobío, incluyendo ClubVegan.',
      'El mercado inicial se selecciona con evidencia: dolor, disposición a pagar, acceso al decisor, repetibilidad y aprendizaje.',
      'La web pública no utiliza clientes, logos, testimonios ni casos sin autorización expresa.',
      'Metamorfosis no necesita demostrar que puede imaginar más; necesita demostrar que puede repetir valor.',
      'Durante esta etapa, el trabajo interno debe aumentar ventas, evidencia, capacidad de ejecución o margen.'
    ],
    expedientes: [createClubVeganExpediente()],
    inbox: [],
    family: {
      phase: 'PREPARAR',
      phaseNote: 'La navegación familiar mantiene caja, hogar, bienestar y transición separados del sistema empresarial.',
      weekLabel: 'Semana del 24 al 30 de agosto de 2026',
      wellbeing: [
        { id: crypto.randomUUID(), name: 'Benjamín', area: 'Salud y transición', status: 'Atención', load: 'Media', note: 'Recuperación, Magíster y preparación profesional sin reconstruir una jornada de 45 horas.' },
        { id: crypto.randomUUID(), name: 'Francisca', area: 'Liderazgo y proyectos', status: 'Atención', load: 'Alta', note: 'Proteger su liderazgo en Metamorfosis sin absorber toda la carga familiar.' },
        { id: crypto.randomUUID(), name: 'Pareja', area: 'Vínculo y descanso', status: 'Bien', load: 'Media', note: 'Reservar al menos un espacio sin proyectos, caja ni planificación.' },
        { id: crypto.randomUUID(), name: 'Santiago y familia', area: 'Vida cotidiana', status: 'Bien', load: 'Media', note: 'La agenda laboral también se acomoda a la vida familiar.' }
      ],
      weeklyActions: [
        { id: crypto.randomUUID(), owner: 'Benjamín', title: 'Mantener utilizable el Sistema Familiar V1.0', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Benjamín', title: 'Preparar Con Criterio sin activación comercial durante la licencia', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Francisca', title: 'Enviar 5 ofertas reales de Metamorfosis y registrar respuestas', load: 'Exigente', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Cerrar el ciclo financiero actual con datos confirmados', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Completar una microintervención cerrable del hogar', load: 'Media', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Proteger un bloque familiar sin trabajo', load: 'Ligera', status: 'pending' }
      ],
      workFronts: [
        { id: crypto.randomUUID(), name: 'Con Criterio', leader: 'Benjamín', state: 'Preparar', next: 'Cerrar Mesa V1 y revisar la economía conjunta de Taller, Mapa y Mesa.', limit: 'Sin contacto comercial durante la licencia.' },
        { id: crypto.randomUUID(), name: 'Magíster e investigación', leader: 'Benjamín', state: 'Activo', next: 'Ordenar el bloque intensivo y mantener el desarrollo académico enfocado.', limit: 'No convertir toda lectura interesante en una nueva línea activa.' },
        { id: crypto.randomUUID(), name: 'Metamorfosis', leader: 'Francisca', state: 'Activo', next: 'Priorizar operación, oferta y validaciones reales en Biobío.', limit: 'No abrir más productos sin capacidad ni demanda comprobada.' },
        { id: crypto.randomUUID(), name: 'Experiencias', leader: 'Compartido', state: 'Validación', next: 'Definir el piloto viable sin sobredimensionar inversión ni carga.', limit: 'No tratar líneas antiguas como proyectos separados.' }
      ],
      home: {
        phase: 'Fase 0 · Recuperación funcional', budget: 30000,
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
        name: 'Ciclo actual', startDate: '2026-08-24', endDate: '2026-08-31', availableCash: 0,
        nextIncomeLabel: 'Ingreso por confirmar', nextIncomeAmount: 0, nextIncomeDate: '', nextIncomeStatus: 'No confirmado',
        mandatoryPayments: 0, protectedAmount: 0, monthlyBase: 3000000,
        notes: 'No comprometer ingresos no abonados. Mantener separadas las finanzas familiares de las del negocio.'
      },
      inventory: [
        { id: crypto.randomUUID(), title: 'Sistema Familiar V1.0', area: 'Familia', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Magíster e investigación', area: 'Académico', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Con Criterio', area: 'Trabajo', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Metamorfosis', area: 'Trabajo', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Experiencias', area: 'Trabajo', status: 'Activo' },
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

export const TOPICS = ['Metamorfosis', 'Comercial', 'Sistema', 'Familia', 'Hogar', 'Finanzas', 'Documentos', 'Dirección', 'Otro'];
export const OWNERS = ['Francisca', 'Benjamín', 'Ambos', 'Externo'];

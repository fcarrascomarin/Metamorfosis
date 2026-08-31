import { createClubVeganExpediente } from './consultingTools.js';

const iso = (date) => date.toISOString().slice(0, 10);
export const OS_SCHEMA_VERSION = '10.7';

const WEEK = {
  monday: '2026-08-24',
  tuesday: '2026-08-25',
  wednesday: '2026-08-26',
  thursday: '2026-08-27',
  friday: '2026-08-28'
};

const task = (date, start, end, owner, title, explain, doneWhen, options = {}) => ({
  id: crypto.randomUUID(), date, start, end, owner, topic: options.topic || 'Comercial', title,
  explain, why: options.why || 'La prioridad actual es convertir capacidad interna en evidencia comercial real sin desviar la identidad de Metamorfosis.',
  done_when: doneWhen, status: options.status || 'pending', confirmed: Boolean(options.confirmed), comments: []
});

export function createDefaultOsState() {
  const today = iso(new Date());
  const projectMetamorfosis = crypto.randomUUID();
  const projectClubVegan = crypto.randomUUID();
  const projectHistorical = crypto.randomUUID();

  return {
    version: OS_SCHEMA_VERSION,
    selectedDate: today < '2026-08-31' ? '2026-08-31' : today,
    tasks: [
      task('2026-08-28', '—', '', 'Benjamín', 'Contacto informativo preparado · Víctor Erices / RUDEL', 'Se definió el objetivo y guion para conocer tecnologías internas, estandarización de procesos y automatización/IA.', 'Guion y propósito quedaron preparados.', { status: 'done' }),
      task('2026-08-28', '—', '', 'Benjamín', 'Contacto informativo preparado · Jorge Beltrán / CMPC', 'Se definió el objetivo y guion para comprender exigencias de mandantes y fricciones con proveedores.', 'Guion y propósito quedaron preparados.', { status: 'done' }),
      task('2026-08-28', '—', '', 'Benjamín', 'Contacto informativo preparado · Cristian Méndez / Blumar', 'Se definió el objetivo y guion sobre procesos, excelencia operacional y apoyo externo.', 'Guion y propósito quedaron preparados.', { status: 'done' }),
      task('2026-08-28', '14:00', '14:30', 'Francisca', 'Registro de horas y campo comercial activados', 'Mantener registro de conversaciones, estados y horas reales, sean o no facturables.', 'Sistema habilitado para alimentar evidencia.', { status: 'done', topic: 'Sistema' }),
      task('2026-08-30', '—', '', 'Ambos', 'Club Vegan · cierre sin conversión', 'La reacción positiva al mockup no se convirtió en necesidad ni compra. No corresponde insistir.', 'Expediente y campo comercial quedan cerrados; solo se reabre si la contraparte vuelve espontáneamente.', { status: 'done' }),

      task('2026-08-31', '—', '', 'Ambos', 'Jornada comercial concentrada · prospección selectiva', 'Confirmar la reunión del 04/09, revisar brevemente el tablero comercial y buscar solo 3–5 candidatos que cumplan necesidad actual, apertura legítima, encaje con capacidades, capacidad económica y comprensión suficiente del dominio. Francisca lidera la búsqueda; Benjamín apoya con criterio, hipótesis y descarte.', 'Quedan 3–5 candidatos defendibles como máximo, solo los sobrevivientes se registran en Campo comercial y se anotan lenguaje, problemas y patrones útiles para el viernes.', { topic: 'Comercial' }),
      task('2026-08-31', '18:30', '19:30', 'Benjamín', 'Barrios Saludables · sesión 1', 'Compromiso formativo personal de Benjamín. Se muestra en la agenda compartida para evitar sobreposición de trabajo.', 'Bloque horario considerado como no disponible.', { topic: 'Agenda personal', confirmed: true }),

      task('2026-09-01', '—', '', 'Ambos', 'Convertir prospección en decisiones', 'Revisar y descartar candidatos débiles, identificar puertas reales de entrada y clasificar cada candidato como conversación informacional, contacto comercial, investigación adicional o radar. Preparar o activar solo 1–2 movimientos con permiso legítimo.', 'Cada candidato superviviente tiene clasificación y siguiente paso; no queda una lista inflada de nombres.', { topic: 'Comercial' }),

      task('2026-09-02', '—', '', 'Ambos', 'Preparar ficha de la reunión del 04/09', 'Usar lo aprendido en la prospección para construir una ficha breve: qué sabemos, qué queremos aprender, hipótesis a contrastar y 5–7 preguntas. No preparar presentación larga ni propuesta anticipada.', 'Ficha de conversación lista, breve y orientada a aprendizaje comercial.', { topic: 'Comercial' }),
      task('2026-09-02', '—', '', 'Ambos', 'Seminario Internacional Basura Cero · online', 'Actividad externa confirmada. Se incluye para visualizar carga y disponibilidad de ambos.', 'Actividad considerada en la agenda; horario exacto se completa cuando esté disponible.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-02', '19:00', '', 'Benjamín', 'Justicia animal en acción · radar', 'Actividad de interés de Benjamín registrada como radar; no desplaza prioridades de Metamorfosis salvo decisión explícita.', 'Se decide asistir o descartar sin abrir trabajo adicional.', { topic: 'Agenda personal', status: 'waiting' }),

      task('2026-09-03', '—', '', 'Ambos', 'Ajuste mínimo para la reunión del 04/09', 'Revisar ficha, roles y logística. No sobrepreparar ni convertir la reunión en pitch. La prioridad es llegar con preguntas claras y capacidad de escuchar.', 'Reunión operativamente lista con roles y logística definidos.', { topic: 'Comercial' }),
      task('2026-09-03', '—', '', 'Benjamín', 'Centro Jean Monnet UdeC · actividad presencial', 'Actividad externa confirmada de Benjamín. Se incorpora a la agenda para mostrar disponibilidad real.', 'Actividad considerada al distribuir horas de Metamorfosis.', { topic: 'Agenda personal', confirmed: true }),

      task('2026-09-04', '—', '', 'Ambos', 'Reunión informativa Metamorfosis · confirmada', 'Escuchar, contrastar hipótesis y registrar problema, consecuencia, urgencia, decisor, apertura externa y lenguaje de la contraparte. No forzar venta.', 'Ficha de campo completada el mismo día y reunión clasificada como oportunidad, inteligencia o hipótesis debilitada.', { topic: 'Comercial', confirmed: true }),
      task('2026-09-04', '—', '', 'Ambos', 'Debrief inmediato de la reunión', 'Separar hechos de inferencias y decidir un único siguiente paso. Incorporar aprendizaje al Campo comercial y a la preparación de la reunión del 11/09.', 'Hallazgos y próximo paso quedan registrados sin abrir tareas accesorias.', { topic: 'Dirección' }),

      task('2026-09-06', '12:00', '13:00', 'Benjamín', 'Reunión Pasantía Benjamín Sepúlveda', 'Compromiso externo encontrado en el calendario conectado. Se incluye únicamente para representar disponibilidad.', 'Bloque horario considerado como no disponible.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-07', '—', '', 'Benjamín', 'Construcción de Paz · online', 'Actividad externa confirmada. Mantenerla como compromiso de agenda, no como frente adicional de Metamorfosis.', 'Actividad considerada en la disponibilidad.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-07', '18:30', '19:30', 'Benjamín', 'Barrios Saludables · sesión 2', 'Compromiso formativo personal de Benjamín.', 'Bloque horario considerado como no disponible.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-08', '15:00', '15:10', 'Francisca', 'Hito Sercotec · cierre convocatoria', 'Cierre de Capital Semilla Modo Empleo Biobío. Actuar únicamente según el criterio de elegibilidad ya resuelto; no iniciar actividades por ansiedad.', 'Postulación o decisión cerrada y registrada.', { topic: 'Dirección', confirmed: true }),
      task('2026-09-09', '—', '', 'Benjamín', 'Seminario de Investigación · profesora Böhm', 'Seminario de investigación confirmado de Benjamín.', 'Actividad considerada en la disponibilidad del día.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-10', '—', '', 'Benjamín', 'Foro Planificación y Gestión Territorial Sustentable · UdeC', 'Actividad presencial de prioridad alta ya inscrita.', 'Actividad considerada en la disponibilidad del día.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-11', '—', '', 'Ambos', 'Reunión informativa Metamorfosis · confirmada 2', 'Segunda conversación informativa ya fijada. Comparar patrones con la reunión del 04/09 y registrar hechos separados de inferencias.', 'Ficha de campo completada y patrones comparados.', { topic: 'Comercial', confirmed: true }),
      task('2026-09-14', '18:30', '19:30', 'Benjamín', 'Barrios Saludables · sesión 3', 'Compromiso formativo personal de Benjamín.', 'Bloque horario considerado como no disponible.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-17', '—', '', 'Ambos', 'Feriado · sin jornada Metamorfosis', 'Día no laborable considerado en capacidad mensual.', 'No programar trabajo ordinario.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-18', '—', '', 'Ambos', 'Feriado · sin jornada Metamorfosis', 'Día no laborable considerado en capacidad mensual.', 'No programar trabajo ordinario.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-21', '12:00', '13:00', 'Benjamín', 'Reunión Pasantía Benjamín Sepúlveda', 'Compromiso externo encontrado en el calendario conectado.', 'Bloque horario considerado como no disponible.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-21', '18:30', '19:30', 'Benjamín', 'Barrios Saludables · sesión 4', 'Última sesión del ciclo registrado.', 'Bloque horario considerado como no disponible.', { topic: 'Agenda personal', confirmed: true }),
      task('2026-09-23', '—', '', 'Benjamín', 'Seminario de Investigación · profesora Böhm', 'Segunda fecha confirmada del seminario de investigación.', 'Actividad considerada en la disponibilidad del día.', { topic: 'Agenda personal', confirmed: true }),

      task('2026-09-28', '09:30', '10:30', 'Francisca', 'Cerrar registro de horas y costos de septiembre', 'Completar horas conocidas, costos directos, traslados y trabajo no facturable.', 'El mes permite calcular esfuerzo y economía real.', { topic: 'Finanzas' }),
      task('2026-09-29', '09:30', '10:30', 'Ambos', 'Evaluar qué transacción puede repetirse', 'Determinar qué problema, comprador, detonante, entrega y precio mostraron evidencia suficiente.', 'Existe decisión de foco comercial para octubre.', { topic: 'Dirección' }),
      task('2026-09-30', '09:30', '11:00', 'Ambos', 'Cierre de septiembre y plan de octubre', 'Cerrar septiembre desde evidencia económica e identitaria. Elegir máximo tres prioridades.', 'Septiembre queda cerrado con aprendizajes, métricas y próximos pasos.', { topic: 'Dirección' })
    ],
    guides: {
      '2026-08-31': { name: 'Prospectar con criterio', why: 'Una jornada comercial concentrada debe producir pocos candidatos defendibles y lenguaje útil para la reunión del viernes.', limit: '3–5 candidatos como máximo; no registrar nombres débiles por volumen.' },
      '2026-09-01': { name: 'Convertir búsqueda en decisiones', why: 'La prospección vale cuando termina en clasificación, descarte y una puerta real de entrada.', limit: 'Activar solo 1–2 movimientos legítimos; no ampliar la lista por inercia.' },
      '2026-09-02': { name: 'Preparar conversación, no presentación', why: 'La ficha del 04/09 debe incorporar lo aprendido en mercado y orientar la escucha.', limit: '5–7 preguntas; sin propuesta ni deck largo.' },
      '2026-09-03': { name: 'Ajuste mínimo', why: 'La preparación suficiente mejora la conversación; la sobrepreparación la rigidiza.', limit: 'Solo roles, logística y revisión de ficha.' },
      '2026-09-04': { name: 'Aprender del mercado', why: 'La reunión debe producir evidencia que cambie o fortalezca una decisión comercial.', limit: 'No convertir una conversación informativa en pitch.' },
      '2026-09-08': { name: 'Hito Sercotec', why: 'Cierre de la convocatoria a las 15:00.', limit: 'Solo actuar según elegibilidad resuelta.' },
      '2026-09-11': { name: 'Comparar patrones', why: 'Una segunda conversación permite separar patrón de anécdota.', limit: 'Registrar hechos separados de inferencias.' },
      '2026-09-30': { name: 'Cerrar antes de ampliar', why: 'Octubre debe partir de evidencia económica e identitaria.', limit: 'Máximo tres prioridades.' }
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
        { id: projectClubVegan, name: 'Club Vegan · Vitrina Pyme', client: 'Club Vegan / Emporio', fee: 0, directCosts: 0, targetHours: 0, status: 'Cerrado sin conversión' },
        { id: projectHistorical, name: 'Aprendizaje interno · consolidación operacional', client: 'Uso interno · no publicable', fee: 0, directCosts: 0, targetHours: 0, status: 'Cerrado' }
      ],
      entries: [
        { id: crypto.randomUUID(), projectId: projectHistorical, date: '2026-07-08', owner: 'Benjamín', category: 'Diagnóstico', hours: 8.7, billable: false, note: 'Ventana observable de conversación activa: 8 h 42 min. Se registra como evidencia histórica de dedicación; no equivale necesariamente a trabajo continuo ni al total del proyecto.' },
        { id: crypto.randomUUID(), projectId: projectHistorical, date: '2026-07-20', owner: 'Ambos', category: 'Diagnóstico', hours: 6.5, billable: false, note: 'Jornada de diagnóstico registrada 09:00–15:30. Francisca tuvo ausencia programada 12:00–14:00; se conserva como ventana de jornada, no como suma de horas-persona.' },
        { id: crypto.randomUUID(), projectId: projectHistorical, date: '2026-07-21', owner: 'Benjamín', category: 'Diagnóstico', hours: 8.0333, billable: false, note: 'Ventana observable de conversación activa: 8 h 02 min. No equivale necesariamente a trabajo continuo ni al total del proyecto.' },
        { id: crypto.randomUUID(), projectId: projectHistorical, date: '2026-07-24', owner: 'Benjamín', category: 'Diseño', hours: 1.1, billable: false, note: 'Ventana observable de conversación activa: 1 h 06 min. No equivale necesariamente a trabajo continuo ni al total del proyecto.' },
        { id: crypto.randomUUID(), projectId: projectHistorical, date: '2026-08-10', owner: 'Benjamín', category: 'Diagnóstico', hours: 3.65, billable: false, note: 'Ventana observable de conversación activa: 3 h 39 min. No equivale necesariamente a trabajo continuo ni al total del proyecto.' }
      ],
      note: 'Registrar tiempo real desde el 28-08-2026, incluso cuando no sea facturable. Base histórica cargada solo con tiempos explícitos: 08/07 8 h 42 min; 20/07 09:00–15:30 (6 h 30 min de jornada, con ausencia de Francisca 12:00–14:00); 21/07 8 h 02 min; 24/07 1 h 06 min; 10/08 3 h 39 min. El 30/07 Benjamín reportó una jornada dedicada exclusivamente a arquitectura de Metamorfosis, pero sin duración cuantificada: no se suma. Club Vegan tuvo trabajo entre 25–27/08, pero no existe duración exacta registrada: no se inventan horas.'
    },
    fronts: [
      { id: crypto.randomUUID(), name: 'Validación industrial · inteligencia de mercado', leader: 'Ambos', state: 'En ejecución', next: 'Realizar las dos reuniones informativas confirmadas del 04/09 y 11/09 y completar la contraparte exacta de cada una en Agenda.', limit: 'Son fuentes de aprendizaje; no forzar venta ni pedir acceso a terceros.' },
      { id: crypto.randomUUID(), name: 'Maquisant · discovery B2B', leader: 'Ambos', state: 'Siguiente prueba posible', next: 'Decidir después de las reuniones informativas si existe evidencia suficiente para abrir discovery con Víctor Santander.', limit: 'La relación abre la puerta; la necesidad debe emerger del dueño.' },
      { id: crypto.randomUUID(), name: 'Transmarin · transición organizacional', leader: 'Ambos', state: 'Potencial estratégico', next: 'Mantener como opción para discovery sobre crecimiento, continuidad, gestión remota, sistemas y sustentabilidad.', limit: 'El parentesco no valida demanda; si avanza, alcance y precio deben ser profesionales.' },
      { id: crypto.randomUUID(), name: 'Vitrina Pyme · Club Vegan', leader: 'Francisca', state: 'Cerrado sin conversión', next: 'Ninguno. Reabrir únicamente si Club Vegan retoma espontáneamente el contacto.', limit: 'Conservar el aprendizaje sin convertir agrado estético en falsa validación ni insistir.' },
      { id: crypto.randomUUID(), name: 'Textil y circularidad · aprendizaje', leader: 'Ambos', state: 'Radar', next: 'Mantener Roxana/Trapos como fuente sectorial; no convertirla en prospecto por inferencia propia.', limit: 'Cualquier servicio debe surgir de necesidad declarada.' }
    ],
    decisions: [
      'Semana 31/08–04/09: producir aprendizaje comercial real y validación. No reabrir arquitectura, branding, metodología o documentación salvo necesidad directa.',
      'Capacidad septiembre: Francisca dedica jornada completa a Metamorfosis; Benjamín 2,5–4 h diarias con máximo 18 h semanales. Feriados 17 y 18 sin jornada ordinaria.',
      'Identidad primero: toda oportunidad se evalúa por sentido Metamorfosis, necesidad legítima, capacidad real y viabilidad económica; la caja no puede deformar la empresa.',
      'La Arquitectura Maestra, el método y el OS están suficientemente construidos para validar mercado. No reabrir identidad o arquitectura salvo evidencia material nueva.',
      'Durante esta etapa, todo trabajo interno relevante debe justificar cómo aumenta ventas, evidencia, capacidad de ejecución o margen.',
      'Prospección selectiva: no contactar organizaciones solo porque parezcan desordenadas. Debe existir señal actual de necesidad/transición y apertura legítima.',
      'Combinar ecosistema propio con investigación externa. Las relaciones abren conversaciones; no prueban demanda.',
      'Las reuniones informativas sirven para aprender del mercado, no para vender ni pedir clientes. Los hechos se registran separados de inferencias.',
      'El KPI comercial superior es conseguir 1 diagnóstico pagado que pueda derivar en implementación. No construir antes de vender salvo prototipos mínimos deliberados.',
      'Rango inicial de diagnóstico: $250.000–$450.000. Si un proyecto requiere capacidad técnica externa, esa capacidad se financia dentro del proyecto vendido.',
      'Club Vegan queda cerrado sin conversión al 30-08-2026. No insistir ni hacer seguimiento; reabrir solo si la contraparte vuelve espontáneamente.',
      'Sercotec: reunión con abogada el 02-09 y cierre de convocatoria el 08-09 a las 15:00. No iniciar actividades hasta resolver elegibilidad y estrategia administrativa.',
      'CM Banquetería/Restaurant no se usa públicamente como caso, cliente, logo, testimonio ni prueba comercial sin autorización expresa.',
      'Registrar 100% de las horas conocidas. El costo/hora sirve internamente para margen; el cliente compra alcance y resultado, no horas.'
    ],
    expedientes: [createClubVeganExpediente()],
    repository: {
      selectedExpedienteId: 'EXP-001',
      documentsByExpediente: {
        'EXP-001': {
          'propuesta-comercial': {
            status: 'No aplica', updatedAt: '2026-08-30',
            content: 'Piloto cerrado sin conversión. No se desarrolló propuesta formal porque no se validó necesidad ni intención de compra. Reabrir únicamente si Club Vegan retoma espontáneamente el contacto.'
          },
          'cotizacion': { status: 'No aplica', updatedAt: '2026-08-30', content: 'No hubo solicitud de cotización ni interés explícito suficiente para avanzar.' },
          'minuta-reunion': { status: 'No aplica', updatedAt: '2026-08-30', content: 'No se produjo una reunión comercial; el piloto cerró antes de esa etapa.' },
          'plan-trabajo': { status: 'No aplica', updatedAt: '2026-08-30', content: 'No hubo aceptación comercial.' },
          'informe-avance': { status: 'No aplica', updatedAt: '', content: 'No corresponde mientras el piloto no esté contratado.' },
          'acta-cierre': { status: 'Listo', updatedAt: '2026-08-30', content: 'Cierre comercial: reacción estética positiva al mockup, sin validación de necesidad ni conversión. Aprendizaje: no confundir agrado con demanda; detener trabajo adicional sin permiso.' },
          'mapa-transformacion': { status: 'No aplica', updatedAt: '', content: 'Vitrina Pyme es un experimento acotado. No convertirlo en diagnóstico integral salvo que aparezca una necesidad distinta y contratada.' },
          'tiempo-rentabilidad': { status: 'En curso', updatedAt: '2026-08-28', content: 'Registrar desde el 28-08 todas las horas reales asociadas a Club Vegan. Hubo trabajo entre el 25 y 27 de agosto, pero no existe duración exacta registrada; no inventar horas históricas.' }
        }
      }
    },
    fieldRegister: [
      { id: 'CAMPO-001', actor: 'Víctor Erices', organization: 'RUDEL', type: 'Informante', role: 'Tecnología y estandarización', access: 'Alta', priority: 'Muy alta', status: 'Contacto preparado', commercial: 'No prospecto', nextAction: 'Mantener como fuente de inteligencia. Si corresponde a una de las reuniones confirmadas del 04/09 o 11/09, completar la fecha sin inventarla.', context: 'Encargado de Desarrollo y Tecnologías de la Información. Quiere mostrar lo desarrollado en RUDEL, cómo han estandarizado procesos y aparentemente automatizaciones con IA.', limit: 'Ir a aprender. No transformar la reunión en presentación comercial ni pedir acceso a clientes.' },
      { id: 'CAMPO-002', actor: 'Jorge Beltrán Torres', organization: 'CMPC · almacenamiento zona costa Biobío', type: 'Informante', role: 'Mirada de mandante', access: 'Alta', priority: 'Muy alta', status: 'Contacto preparado', commercial: 'No prospecto', nextAction: 'Mantener como fuente de inteligencia. Si corresponde a una de las reuniones confirmadas del 04/09 o 11/09, completar la fecha sin inventarla.', context: 'Relación cercana por amistad de años con el padre de Benjamín y cariño hacia Benjamín. Puede aportar patrones generales sobre exigencias, proveedores y fricciones.', limit: 'No pedir información confidencial, nombres de proveedores ni acceso comercial.' },
      { id: 'CAMPO-003', actor: 'Cristian Méndez', organization: 'Blumar', type: 'Informante', role: 'Procesos y excelencia operacional', access: 'Alta', priority: 'Muy alta', status: 'Contacto preparado', commercial: 'No prospecto', nextAction: 'Mantener como fuente de inteligencia. Si corresponde a una de las reuniones confirmadas del 04/09 o 11/09, completar la fecha sin inventarla.', context: 'Tío cercano de Benjamín. Trabaja en una pesquera grande en procesos/excelencia operacional y conoce el interés de Benjamín por investigar empresas.', limit: 'Contrastar hipótesis; no pedir trabajo, clientes ni recomendaciones comerciales.' },
      { id: 'CAMPO-004', actor: 'Víctor Santander', organization: 'Maquisant · Laja', type: 'Discovery', role: 'Pyme industrial/proveedora', access: 'Media-alta', priority: 'Máxima comercial', status: 'Esperar entrevistas informativas', commercial: 'Prospecto potencial', nextAction: 'Después de 1–2 entrevistas informativas, pedir al padre de Benjamín una introducción sencilla y agendar discovery.', context: 'Fue amigo del padre de Benjamín durante varios años; es abierto a escuchar y se percibe capacidad económica. Maquisant ha trabajado anteriormente para grandes mandantes, situación actual por validar.', limit: 'No presumir necesidad. La relación solo abre la puerta; el problema y la intención de actuar deben emerger de Víctor.' },
      { id: 'CAMPO-005', actor: 'Néstor Marín', organization: 'Transmarin · Renca', type: 'Discovery', role: 'Crecimiento y continuidad', access: 'Alta', priority: 'Máxima estratégica', status: 'Preparación', commercial: 'Prospecto potencial', nextAction: 'Conversar después de acumular aprendizaje industrial; explorar futuro de la empresa antes de proponer solución.', context: 'Existe parentesco con Francisca. Néstor quiere dejar de arrendar y contar con espacio propio; ha actualizado la web e incorporado sustentabilidad; sus dos hijos trabajan con él, quiere dejarles continuidad y uno desea trabajar remotamente.', limit: 'El parentesco no valida mercado. Si avanza, alcance, precio y entregables deben tratarse profesionalmente.' },
      { id: 'CAMPO-006', actor: 'Roxana Mora Jara', organization: 'Ropa Americana Trapos · Laja', type: 'Informante', role: 'Textil, reutilización y comercio', access: 'Alta', priority: 'Media-alta', status: 'Radar', commercial: 'Prospecto eventual', nextAction: 'Aprovechar una visita natural a Laja para conversar sobre cómo ha cambiado el rubro; no vender de entrada.', context: 'Amiga de la madre de Benjamín; lleva más de 15 años en ropa usada y disfruta conversar. Tiene experiencia práctica valiosa para circularidad/textiles.', limit: 'No presentar su falta de reinvención como diagnóstico. Cualquier oportunidad debe nacer de una necesidad reconocida por ella.' },
      { id: 'CAMPO-007', actor: 'Panadería Nietos', organization: 'Laja', type: 'Radar', role: 'Empresa familiar', access: 'Alta', priority: 'Baja', status: 'No intervenir todavía', commercial: 'Prospecto condicionado', nextAction: 'Mantener en radar hasta que exista necesidad declarada y disposición a pagar.', context: 'Empresa de un tío de Francisca. Históricamente llegó a dos sucursales y hoy aparentemente opera una; existen señales percibidas de retroceso administrativo.', limit: 'Evitar síndrome de rescate y diagnóstico unilateral. El dueño debe reconocer el problema y querer cambiar.' },
      { id: 'CAMPO-009', actor: 'Rodrigo Díaz Morales', organization: 'Empresas Díaz / Transportes MDM', type: 'Exclusión', role: 'No-go comercial', access: 'Conocido', priority: 'Fuera', status: 'Descartado', commercial: 'No prospectar', nextAction: 'Ninguno salvo evidencia material futura que cambie riesgos.', context: 'Existen problemas internos potencialmente abordables, pero el equipo desconfía de su capacidad de pago y honestidad.', limit: 'La capacidad técnica de ayudar no compensa riesgo de cobro y confianza.' },
      { id: 'CAMPO-010', actor: 'Club Vegan / Emporio', organization: 'Concepción', type: 'Piloto comercial', role: 'Vitrina Pyme · B2C/B2B pequeño', access: 'Directa', priority: 'Cerrado', status: 'Cerrado sin conversión', commercial: 'No convertido', nextAction: 'Ninguno. Reabrir solo si Club Vegan retoma espontáneamente el contacto.', context: 'Hubo reacción estética positiva al mockup (\"wau estaa hermoso\" + Me gusta), pero no se validó necesidad, intención de compra ni contratación. El aprendizaje se conserva como evidencia comercial.', limit: 'No insistir, no enviar seguimiento ni producir trabajo adicional sin una nueva señal espontánea de apertura.' }
    ],
    inbox: [],
    family: {
      phase: 'COTIDIANO',
      phaseNote: 'El espacio familiar prioriza lo que facilita la semana: carga, caja y hogar. Lo secundario queda plegado para no abrumar.',
      weekLabel: 'Semana del 31 de agosto al 6 de septiembre de 2026',
      wellbeing: [
        { id: crypto.randomUUID(), name: 'Benjamín', area: 'Carga personal', status: 'Bien', load: 'Media', note: 'Usar esta tarjeta solo para registrar cómo viene la carga de la semana cuando realmente ayude a organizarla.' },
        { id: crypto.randomUUID(), name: 'Francisca', area: 'Carga personal', status: 'Bien', load: 'Media', note: 'Usar esta tarjeta solo cuando exista algo práctico que ajustar en la semana.' },
        { id: crypto.randomUUID(), name: 'Compartido', area: 'Vida cotidiana', status: 'Bien', load: 'Media', note: 'Proteger espacio cotidiano y familiar sin convertirlo en otra lista de productividad.' }
      ],
      weeklyActions: [
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Mantener la lista de supermercado al día cuando algo se acabe', load: 'Ligera', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Revisar necesarios a corto plazo antes de salir a comprar', load: 'Ligera', status: 'pending' },
        { id: crypto.randomUUID(), owner: 'Compartido', title: 'Proteger al menos un bloque familiar sin trabajo ni planificación', load: 'Ligera', status: 'pending' }
      ],
      workFronts: [
        { id: crypto.randomUUID(), name: 'Caja de transición', leader: 'Compartido', state: 'Activo', next: 'Mantener decisiones bancarias y pagos ya resueltos fuera de la agenda hasta que vuelva a existir una fecha real de acción.', limit: 'No revisar por ansiedad lo que ya está resuelto.' },
        { id: crypto.randomUUID(), name: 'Hogar cotidiano', leader: 'Compartido', state: 'Activo', next: 'Resolver compras y pendientes pequeños usando las listas del OS.', limit: 'No convertir mejoras domésticas pequeñas en una remodelación integral.' }
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
        notes: 'Los movimientos bancarios inmediatos están resueltos hasta el 20-09-2026. No reabrirlos antes salvo cambio real. Mantener separadas las finanzas familiares de las del negocio.'
      },
      shortTermNeeds: [
        { id: crypto.randomUUID(), title: 'Porcionadores en ml' },
        { id: crypto.randomUUID(), title: 'Seguro plástico para cerrar puertas del refrigerador' }
      ],
      groceryList: [],
      inventory: [
        { id: crypto.randomUUID(), title: 'Sistema Familiar', area: 'Familia', status: 'Activo' },
        { id: crypto.randomUUID(), title: 'Remodelación integral y oficina', area: 'Hogar', status: 'Futuro' },
        { id: crypto.randomUUID(), title: 'Viajes familiares', area: 'Ahorro', status: 'Futuro' },
        { id: crypto.randomUUID(), title: 'Parcela', area: 'Ahorro', status: 'Futuro' }
      ],
      exclusions: [
        'No convertir cada idea interesante en una obligación inmediata.',
        'No mezclar la caja familiar con la de Metamorfosis.',
        'No abrir una remodelación integral por resolver una necesidad cotidiana.',
        'Lo ya resuelto permanece fuera de la agenda hasta que exista una nueva fecha o decisión real.'
      ]
    }
  };
}

export const TOPICS = ['Metamorfosis', 'Comercial', 'Sistema', 'Agenda personal', 'Familia', 'Hogar', 'Finanzas', 'Documentos', 'Dirección', 'Otro'];
export const OWNERS = ['Francisca', 'Benjamín', 'Ambos', 'Externo'];

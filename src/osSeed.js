import { createClubVeganExpediente } from './consultingTools.js';

const iso = (date) => date.toISOString().slice(0, 10);
export const OS_SCHEMA_VERSION = '10.6';

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
    selectedDate: today < '2026-09-01' ? '2026-09-01' : today,
    tasks: [
      task('2026-08-28', '—', '', 'Benjamín', 'Contacto informativo preparado · Víctor Erices / RUDEL', 'Se definió el objetivo y guion para conocer tecnologías internas, estandarización de procesos y automatización/IA. El OS no presume que el mensaje haya sido enviado si no hay registro verificable.', 'Guion y propósito quedaron preparados.', { status: 'done' }),
      task('2026-08-28', '—', '', 'Benjamín', 'Contacto informativo preparado · Jorge Beltrán / CMPC', 'Se definió el objetivo y guion para comprender exigencias de mandantes y fricciones con proveedores. El OS no presume que el mensaje haya sido enviado si no hay registro verificable.', 'Guion y propósito quedaron preparados.', { status: 'done' }),
      task('2026-08-28', '—', '', 'Benjamín', 'Contacto informativo preparado · Cristian Méndez / Blumar', 'Se definió el objetivo y guion sobre procesos, excelencia operacional y apoyo externo. El OS no presume que el mensaje haya sido enviado si no hay registro verificable.', 'Guion y propósito quedaron preparados.', { status: 'done' }),
      task('2026-08-28', '14:00', '14:30', 'Francisca', 'Registro de horas y campo comercial activados', 'Mantener desde aquí registro de conversaciones, estados y horas reales, sean o no facturables.', 'Sistema habilitado para alimentar evidencia.', { status: 'done', topic: 'Sistema' }),
      task('2026-08-30', '—', '', 'Ambos', 'Club Vegan · cierre sin conversión', 'La reacción positiva al mockup no se convirtió en necesidad ni compra. No corresponde insistir.', 'Expediente y campo comercial quedan cerrados; solo se reabre si la contraparte vuelve espontáneamente.', { status: 'done' }),
      task('2026-09-01', '09:30', '10:15', 'Francisca', 'Abrir septiembre con agenda real', 'Revisar únicamente reuniones ya confirmadas, tareas administrativas y horas. No volver a abrir decisiones cerradas ni ampliar prospección por inercia.', 'La semana queda organizada con fechas reales y sin tareas duplicadas.', { topic: 'Dirección' }),
      task('2026-09-01', '10:15', '10:35', 'Benjamín', 'Completar contraparte de reuniones 04/09 y 11/09', 'Las dos fechas ya están fijadas. Completar en el OS el nombre exacto de cada contraparte desde la confirmación original; no volver a tratarlas como pendientes de agenda.', 'Ambas reuniones quedan identificadas con actor y modalidad.', { topic: 'Sistema' }),
      task('2026-09-02', '—', '', 'Ambos', 'Reunión confirmada · abogada Sercotec', 'Resolver la consulta de elegibilidad de Capital Semilla/Modo Empleo y qué puede o no hacer Metamorfosis antes de una eventual postulación.', 'Criterio administrativo documentado y decisión sobre inicio de actividades actualizada.', { topic: 'Dirección', confirmed: true }),
      task('2026-09-04', '—', '', 'Ambos', 'Reunión informativa Metamorfosis · confirmada 1', 'Fecha confirmada. La reunión debe producir inteligencia de mercado utilizable y una ficha de campo, no una venta forzada. Contraparte exacta pendiente de completar en el OS.', 'Ficha de campo completada el mismo día y siguiente paso definido.', { confirmed: true }),
      task('2026-09-08', '15:00', '15:10', 'Francisca', 'Hito Sercotec · cierre convocatoria', 'Cierre de Capital Semilla Modo Empleo Biobío. Actuar únicamente según el criterio de elegibilidad ya resuelto; no iniciar actividades antes por ansiedad.', 'Postulación/decisión cerrada y registrada.', { topic: 'Dirección', confirmed: true }),
      task('2026-09-11', '—', '', 'Ambos', 'Reunión informativa Metamorfosis · confirmada 2', 'Fecha confirmada. Buscar patrones sobre operación, exigencias, procesos, tecnología y cuándo una pyme realmente necesita apoyo externo. Contraparte exacta pendiente de completar en el OS.', 'Ficha de campo completada y hallazgos comparados con la primera reunión.', { confirmed: true }),
      task('2026-09-14', '09:30', '10:30', 'Ambos', 'Sintetizar inteligencia de mercado', 'Cruzar lo aprendido en las reuniones confirmadas con la investigación externa y el ecosistema propio. Mantener solo hipótesis que hayan ganado evidencia.', 'Síntesis de 3–5 hallazgos accionables, no otro documento maestro.', { topic: 'Dirección' }),
      task('2026-09-15', '10:00', '11:00', 'Ambos', 'Decidir si Maquisant pasa a discovery', 'Solo si las conversaciones informativas fortalecen el encaje: preparar una conversación con Víctor Santander sin diagnosticar anticipadamente.', 'Decisión avanzar/no avanzar registrada.'),
      task('2026-09-16', '10:00', '11:00', 'Ambos', 'Preparar siguiente discovery comercial', 'Elegir Maquisant o Transmarin según evidencia, sentido Metamorfosis, apertura y potencial económico. No activar ambos por obligación.', 'Existe un solo siguiente discovery prioritario y un guion acotado.'),
      task('2026-09-21', '10:00', '10:45', 'Ambos', 'Revisión comercial de mitad de mes', 'Revisar reuniones, aprendizajes, horas y capacidad. Todo trabajo interno nuevo debe justificar ventas, evidencia, ejecución o margen.', 'Se mantiene, corrige o descarta la hipótesis comercial principal.', { topic: 'Dirección' }),
      task('2026-09-23', '10:00', '11:30', 'Ambos', 'Diseñar diagnóstico pagado solo si existe permiso', 'Si una organización reconoció un problema y quiere actuar, definir diagnóstico acotado con alcance, entregables, horas internas y rango inicial de $250.000–$450.000.', 'Existe oferta defendible o decisión consciente de no ofertar.'),
      task('2026-09-28', '09:30', '10:30', 'Francisca', 'Cerrar registro de horas y costos de septiembre', 'Completar horas conocidas, costos directos, traslados y trabajo no facturable.', 'El mes permite calcular esfuerzo y economía real.', { topic: 'Finanzas' }),
      task('2026-09-29', '09:30', '10:30', 'Ambos', 'Evaluar qué transacción puede repetirse', 'Determinar qué problema, comprador, detonante, entrega y precio mostraron evidencia suficiente.', 'Existe decisión de foco comercial para octubre.', { topic: 'Dirección' }),
      task('2026-09-30', '09:30', '11:00', 'Ambos', 'Cierre de septiembre y plan de octubre', 'Cerrar septiembre desde evidencia económica e identitaria. Elegir máximo tres prioridades.', 'Septiembre queda cerrado con aprendizajes, métricas y próximos pasos.', { topic: 'Dirección' })
    ],
    guides: {
      '2026-09-01': { name: 'Agenda real, no ruido', why: 'Septiembre parte ejecutando lo ya calendarizado y cerrando estados, no inventando nuevos frentes.', limit: 'No reabrir arquitectura ni prospección genérica.' },
      '2026-09-02': { name: 'Resolver Sercotec', why: 'La reunión con la abogada debe despejar elegibilidad y límites administrativos.', limit: 'No iniciar actividades antes de contar con criterio claro.' },
      '2026-09-04': { name: 'Reunión confirmada', why: 'La inteligencia de mercado vale si modifica una hipótesis o decisión concreta.', limit: 'No convertir una entrevista informativa en pitch.' },
      '2026-09-08': { name: 'Hito Sercotec', why: 'Cierre de la convocatoria a las 15:00.', limit: 'Solo actuar según elegibilidad resuelta.' },
      '2026-09-11': { name: 'Segunda reunión confirmada', why: 'Comparar patrones reduce el riesgo de construir oferta desde una sola anécdota.', limit: 'Registrar hechos separados de inferencias.' },
      '2026-09-14': { name: 'Convertir conversación en evidencia', why: 'El campo debe terminar en decisiones, no en acumulación de notas.', limit: 'Máximo 3–5 hallazgos accionables.' },
      '2026-09-23': { name: 'Cobrar pensamiento cuando hay permiso', why: 'El siguiente hito superior es un diagnóstico pagado, no otro prototipo gratuito.', limit: 'No regalar diagnóstico dentro de una propuesta.' },
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

export const TOPICS = ['Metamorfosis', 'Comercial', 'Sistema', 'Familia', 'Hogar', 'Finanzas', 'Documentos', 'Dirección', 'Otro'];
export const OWNERS = ['Francisca', 'Benjamín', 'Ambos', 'Externo'];

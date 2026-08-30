import { createClubVeganExpediente } from './consultingTools.js';

const iso = (date) => date.toISOString().slice(0, 10);
export const OS_SCHEMA_VERSION = '10.4';

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
  done_when: doneWhen, status: options.status || 'pending', comments: []
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
      task('2026-08-28', '13:00', '13:20', 'Benjamín', 'Enviar mensaje a Víctor Erices · RUDEL', 'Solicitar una reunión informativa para conocer las tecnologías internas, la estandarización de procesos y el uso de automatización/IA en RUDEL.', 'Mensaje enviado y estado registrado en Campo comercial.'),
      task('2026-08-28', '13:20', '13:40', 'Benjamín', 'Enviar mensaje a Jorge Beltrán · CMPC', 'Solicitar una llamada o videollamada breve para comprender, en términos generales, qué exige un mandante a sus proveedores y dónde aparecen fricciones operacionales.', 'Mensaje enviado y estado registrado en Campo comercial.'),
      task('2026-08-28', '13:40', '14:00', 'Benjamín', 'Enviar mensaje a Cristian Méndez · Blumar', 'Solicitar una conversación informativa sobre procesos, excelencia operacional y el punto en que una pyme requiere apoyo externo.', 'Mensaje enviado y estado registrado en Campo comercial.'),
      task('2026-08-28', '14:00', '14:30', 'Francisca', 'Iniciar registro de horas y campo comercial', 'Usar Tiempo y rentabilidad desde hoy y mantener actualizado el registro de informantes, discovery, pilotos y exclusiones.', 'El sistema tiene responsables, estados y próximos pasos trazables.', { topic: 'Sistema' }),

      task('2026-09-01', '09:00', '09:45', 'Francisca', 'Revisar respuestas y cerrar agenda de entrevistas', 'Revisar respuestas de Víctor Erices, Jorge y Cristian; proponer horarios sin insistencia y registrar cualquier confirmación.', 'Las reuniones confirmadas quedan cargadas en Agenda y Campo comercial.'),
      task('2026-09-01', '10:00', '10:30', 'Francisca', 'Revisar estado Club Vegan sin intervenir de más', 'Verificar si el mensaje enviado el 27 de agosto fue leído o respondido. Si sigue sin leer, mantener espera y no enviar un nuevo mensaje.', 'El estado queda actualizado sin sobrecontactar al prospecto.', { status: 'waiting' }),
      task('2026-09-01', '11:00', '11:30', 'Francisca', 'Seguimiento Sercotec si continúa sin respuesta', 'Revisar la consulta ya enviada y realizar seguimiento administrativo solo si sigue pendiente. No iniciar actividades por ansiedad.', 'Existe respuesta o seguimiento documentado.', { topic: 'Dirección' }),

      task('2026-09-02', '10:00', '11:00', 'Ambos', 'Ventana tentativa · conversación con Víctor Erices', 'Si Víctor confirma disponibilidad, conocer directamente cómo RUDEL usa tecnologías de información, automatización/IA y estandarización de procesos. Si no confirma, mover la tarea sin reemplazarla por prospección fría.', 'Ficha de campo completada el mismo día.', { status: 'waiting' }),
      task('2026-09-03', '11:00', '11:45', 'Benjamín', 'Ventana tentativa · conversación con Jorge Beltrán', 'Si confirma, comprender la mirada de mandante: confiabilidad de proveedores, exigencias, información, documentación y fricciones recurrentes.', 'Ficha de campo completada sin registrar información confidencial.', { status: 'waiting' }),
      task('2026-09-04', '11:00', '11:45', 'Benjamín', 'Ventana tentativa · conversación con Cristian Méndez', 'Si confirma, contrastar hipótesis sobre procesos, excelencia operacional, tecnología y cuándo una empresa pequeña necesita capacidad externa.', 'Ficha de campo completada y aprendizajes contrastados.', { status: 'waiting' }),

      task('2026-09-07', '09:30', '10:30', 'Ambos', 'Sintetizar inteligencia de las primeras conversaciones', 'Comparar lo aprendido en RUDEL, CMPC y Blumar: problemas, detonantes, límites de la tecnología, capacidades que una pyme no suele tener internamente y espacios coherentes con Metamorfosis.', 'Existe una síntesis de máximo una página con 3–5 hipótesis que sobreviven.', { topic: 'Dirección' }),
      task('2026-09-08', '10:00', '11:00', 'Ambos', 'Preparar discovery de Maquisant', 'Adaptar el guion con los hallazgos reales de las entrevistas informativas. No formular diagnóstico anticipado ni propuesta.', 'Guion breve, objetivo y límites listos.'),
      task('2026-09-09', '10:00', '10:30', 'Benjamín', 'Activar introducción con Víctor Santander · Maquisant', 'Pedir al padre de Benjamín una introducción sencilla que abra la puerta sin convertir la relación en presión comercial.', 'Víctor Santander recibió o aceptó la solicitud de conversación.'),
      task('2026-09-14', '11:00', '12:00', 'Ambos', 'Ventana tentativa · discovery Maquisant', 'Conocer historia, operación, relación con mandantes, dependencias, crecimiento y problemas reconocidos por el propio dueño. No vender si no emerge necesidad real.', 'Ficha de campo completada y decisión avanzar/no avanzar registrada.', { status: 'waiting' }),
      task('2026-09-15', '09:30', '10:15', 'Ambos', 'Decidir siguiente paso Maquisant', 'Separar problemas declarados de inferencias. Evaluar urgencia, apertura externa, capacidad de pago, encaje identitario y si corresponde ofrecer diagnóstico pagado.', 'Existe una decisión explícita: cerrar, seguir aprendiendo o ofrecer diagnóstico.'),
      task('2026-09-16', '10:00', '11:00', 'Ambos', 'Preparar conversación Transmarin', 'Construir preguntas sobre crecimiento, continuidad familiar, gestión remota, sistemas, profesionalización y sustentabilidad sin presumir que son problemas.', 'Guion de discovery listo y límites por parentesco explicitados.'),

      task('2026-09-21', '11:00', '12:00', 'Ambos', 'Ventana tentativa · discovery Transmarin', 'Explorar la organización que Néstor quiere construir a futuro y qué tensiones reales existen hoy. No confundir parentesco con demanda.', 'Ficha de campo completada y necesidad real clasificada.', { status: 'waiting' }),
      task('2026-09-22', '09:30', '10:15', 'Ambos', 'Evaluar oportunidades con criterio identitario y económico', 'Cruzar Maquisant, Transmarin y Club Vegan con sentido Metamorfosis, necesidad legítima, apertura, capacidad, pago, aprendizaje y repetibilidad.', 'Existe ranking de oportunidades y una exclusión explícita de lo que no conviene perseguir.', { topic: 'Dirección' }),
      task('2026-09-23', '10:00', '11:30', 'Ambos', 'Diseñar diagnóstico pagado solo si existe permiso', 'Si una organización reconoció un problema y quiere actuar, definir un diagnóstico acotado con alcance, entregables, horas internas y rango de $250.000–$450.000. Si no existe permiso, no fabricar oferta.', 'Hay una oferta de diagnóstico defendible o una decisión consciente de no ofertar.'),
      task('2026-09-24', '10:00', '10:45', 'Francisca', 'Presentar diagnóstico al prospecto habilitado', 'Comunicar alcance y valor sin regalar el diagnóstico dentro de la propuesta. Registrar objeciones y decisión.', 'El prospecto recibió una propuesta solamente si cumplía los filtros.'),
      task('2026-09-25', '09:30', '10:30', 'Ambos', 'Revisión comercial semanal', 'Revisar conversaciones, silencios, objeciones y horas invertidas. No abrir nuevos frentes por ansiedad.', 'Próximas acciones de la última semana quedan decididas.'),

      task('2026-09-28', '09:30', '10:30', 'Francisca', 'Cerrar registro de horas y costos de septiembre', 'Completar el 100% de las horas conocidas, costos directos, traslados y trabajo no facturable para conocer la economía real del mes.', 'Los registros permiten calcular costo y esfuerzo por experimento.', { topic: 'Finanzas' }),
      task('2026-09-29', '09:30', '10:30', 'Ambos', 'Evaluar qué transacción puede repetirse', 'Determinar qué problema, comprador, detonante, entrega y precio mostraron evidencia suficiente para convertirse en una línea comercial y cuál fue solo trabajo puente.', 'Existe una decisión sobre el foco comercial de octubre.', { topic: 'Dirección' }),
      task('2026-09-30', '09:30', '11:00', 'Ambos', 'Cierre de septiembre y plan de octubre', 'Revisar diagnóstico pagado, implementación, Vitrina Pyme, inteligencia de mercado, horas, margen y encaje identitario. Elegir un máximo de tres prioridades para octubre.', 'Septiembre queda cerrado con evidencia, métricas y próximos pasos.', { topic: 'Dirección' })
    ],
    guides: {
      '2026-09-01': { name: 'Abrir septiembre', why: 'Primero cerrar agenda, estados y restricciones; no ampliar mercado todavía.', limit: 'No perseguir silencios ni crear nuevas ofertas.' },
      '2026-09-02': { name: 'Aprender antes de vender', why: 'RUDEL permite observar cómo tecnología y proceso se conectan en una empresa real.', limit: 'No convertir la visita en demo de Metamorfosis.' },
      '2026-09-03': { name: 'Mirada del mandante', why: 'Jorge puede validar o refutar la hipótesis de presión externa sobre proveedores.', limit: 'No pedir información confidencial ni acceso comercial.' },
      '2026-09-04': { name: 'Contraste experto', why: 'Cristian permite distinguir proceso, liderazgo, personas y tecnología.', limit: 'No pedir clientes; buscar patrones.' },
      '2026-09-07': { name: 'Convertir conversación en evidencia', why: 'La información solo vale si modifica o fortalece una hipótesis concreta.', limit: 'Máximo una página de síntesis.' },
      '2026-09-14': { name: 'Discovery real', why: 'Maquisant debe revelar su propia necesidad; Metamorfosis no llega a inventarla.', limit: 'No vender si el problema no emerge y no existe intención de actuar.' },
      '2026-09-21': { name: 'Transición organizacional', why: 'Transmarin permite probar un problema más profundo de crecimiento, continuidad y autonomía.', limit: 'El parentesco abre conversación, no valida mercado.' },
      '2026-09-30': { name: 'Cerrar antes de ampliar', why: 'Octubre debe partir desde evidencia económica e identitaria, no desde nuevas ideas.', limit: 'Máximo tres prioridades.' }
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
        { id: projectClubVegan, name: 'Club Vegan · Vitrina Pyme', client: 'Club Vegan / Emporio', fee: 0, directCosts: 0, targetHours: 0, status: 'Validación' },
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
      { id: crypto.randomUUID(), name: 'Validación industrial · inteligencia de mercado', leader: 'Ambos', state: 'Prioridad septiembre', next: 'Conversar con RUDEL, CMPC y Blumar antes de profundizar Maquisant.', limit: 'Son fuentes de aprendizaje; no forzar venta ni acceso a terceros.' },
      { id: crypto.randomUUID(), name: 'Maquisant · discovery B2B', leader: 'Ambos', state: 'Próxima prueba comercial', next: 'Abrir conversación mediante Víctor Santander después de al menos una o dos entrevistas informativas.', limit: 'La relación abre la puerta; la necesidad debe emerger del dueño.' },
      { id: crypto.randomUUID(), name: 'Transmarin · transición organizacional', leader: 'Ambos', state: 'Potencial estratégico', next: 'Explorar crecimiento, continuidad, gestión remota, sistemas y sustentabilidad sin presumir problemas.', limit: 'El parentesco no valida demanda; si avanza, alcance y precio deben ser profesionales.' },
      { id: crypto.randomUUID(), name: 'Vitrina Pyme · Club Vegan', leader: 'Francisca', state: 'En espera', next: 'Esperar lectura/respuesta al mensaje enviado el 27-08; no insistir mientras siga sin ver.', limit: 'Caja y aprendizaje; no redefinir Metamorfosis como agencia web.' },
      { id: crypto.randomUUID(), name: 'Textil y circularidad · aprendizaje', leader: 'Ambos', state: 'Radar', next: 'Conversar con Roxana/Trapos cuando exista una visita natural a Laja.', limit: 'Primero aprender del rubro; cualquier servicio debe surgir de necesidad declarada.' }
    ],
    decisions: [
      'Metamorfosis protege su identidad: rentabilidad, mercado y crecimiento se subordinan a sentido, necesidad legítima, capacidad real y viabilidad económica.',
      'Francisca y Benjamín son el equipo operativo actual. Francisca dedica septiembre completo; Benjamín 2,5–4 horas diarias, máximo 18 horas semanales.',
      'Durante septiembre no se amplía prospección fría mientras existan suficientes puertas propias de inteligencia y discovery.',
      'La secuencia prioritaria es: Víctor Erices / RUDEL → Jorge Beltrán y Cristian Méndez → Maquisant → Transmarin.',
      'El KPI principal de septiembre es conseguir 1 diagnóstico pagado que pueda derivar en una implementación; Vitrina Pyme sigue siendo experimento de caja y aprendizaje.',
      'No construir antes de vender salvo prototipos mínimos deliberados. Diagnóstico, diseño, construcción e implementación se cobran.',
      'Si un proyecto requiere capacidad técnica externa, esa capacidad se contrata solo después de vender y queda financiada dentro del proyecto.',
      'La web pública no utiliza clientes, logos, testimonios ni casos sin autorización expresa.',
      'El registro de horas es obligatorio para conocer costo, margen y viabilidad de cada experimento.'
    ],
    expedientes: [createClubVeganExpediente()],
    repository: {
      selectedExpedienteId: 'EXP-001',
      documentsByExpediente: {
        'EXP-001': {
          'propuesta-comercial': {
            status: 'Bloqueado', updatedAt: '2026-08-28',
            content: 'No desarrollar todavía una propuesta formal. Estado real: Club Vegan solo indicó que le gustó el mockup. El 27-08 se envió un mensaje comentando que Metamorfosis tiene un servicio para pymes a bajo costo por si le interesa; al 28-08 ese mensaje aún no ha sido visto. Esperar lectura y respuesta antes de ofertar.'
          },
          'cotizacion': { status: 'Pendiente', updatedAt: '', content: 'No cotizar hasta que exista interés explícito en avanzar y alcance mínimo validado.' },
          'minuta-reunion': { status: 'Pendiente', updatedAt: '', content: 'Se habilitará cuando exista una conversación de utilidad real con Club Vegan.' },
          'plan-trabajo': { status: 'Pendiente', updatedAt: '', content: 'Se completa solo después de aceptación comercial.' },
          'informe-avance': { status: 'No aplica', updatedAt: '', content: 'No corresponde mientras el piloto no esté contratado.' },
          'acta-cierre': { status: 'Pendiente', updatedAt: '', content: 'Se utilizará al cerrar el piloto, haya o no continuidad, para registrar aprendizaje y entregables.' },
          'mapa-transformacion': { status: 'No aplica', updatedAt: '', content: 'Vitrina Pyme es un experimento acotado. No convertirlo en diagnóstico integral salvo que aparezca una necesidad distinta y contratada.' },
          'tiempo-rentabilidad': { status: 'En curso', updatedAt: '2026-08-28', content: 'Registrar desde el 28-08 todas las horas reales asociadas a Club Vegan. Hubo trabajo entre el 25 y 27 de agosto, pero no existe duración exacta registrada; no inventar horas históricas.' }
        }
      }
    },
    fieldRegister: [
      { id: 'CAMPO-001', actor: 'Víctor Erices', organization: 'RUDEL', type: 'Informante', role: 'Tecnología y estandarización', access: 'Alta', priority: 'Muy alta', status: 'Por agendar', commercial: 'No prospecto', nextAction: 'Enviar mensaje y coordinar visita/reunión según su disponibilidad.', context: 'Encargado de Desarrollo y Tecnologías de la Información. Quiere mostrar lo desarrollado en RUDEL, cómo han estandarizado procesos y aparentemente automatizaciones con IA.', limit: 'Ir a aprender. No transformar la reunión en presentación comercial ni pedir acceso a clientes.' },
      { id: 'CAMPO-002', actor: 'Jorge Beltrán Torres', organization: 'CMPC · almacenamiento zona costa Biobío', type: 'Informante', role: 'Mirada de mandante', access: 'Alta', priority: 'Muy alta', status: 'Por agendar', commercial: 'No prospecto', nextAction: 'Enviar mensaje y coordinar llamada/videollamada de 30–45 minutos.', context: 'Relación cercana por amistad de años con el padre de Benjamín y cariño hacia Benjamín. Puede aportar patrones generales sobre exigencias, proveedores y fricciones.', limit: 'No pedir información confidencial, nombres de proveedores ni acceso comercial.' },
      { id: 'CAMPO-003', actor: 'Cristian Méndez', organization: 'Blumar', type: 'Informante', role: 'Procesos y excelencia operacional', access: 'Alta', priority: 'Muy alta', status: 'Por agendar', commercial: 'No prospecto', nextAction: 'Enviar mensaje y coordinar conversación profesional breve.', context: 'Tío cercano de Benjamín. Trabaja en una pesquera grande en procesos/excelencia operacional y conoce el interés de Benjamín por investigar empresas.', limit: 'Contrastar hipótesis; no pedir trabajo, clientes ni recomendaciones comerciales.' },
      { id: 'CAMPO-004', actor: 'Víctor Santander', organization: 'Maquisant · Laja', type: 'Discovery', role: 'Pyme industrial/proveedora', access: 'Media-alta', priority: 'Máxima comercial', status: 'Esperar entrevistas informativas', commercial: 'Prospecto potencial', nextAction: 'Después de 1–2 entrevistas informativas, pedir al padre de Benjamín una introducción sencilla y agendar discovery.', context: 'Fue amigo del padre de Benjamín durante varios años; es abierto a escuchar y se percibe capacidad económica. Maquisant ha trabajado anteriormente para grandes mandantes, situación actual por validar.', limit: 'No presumir necesidad. La relación solo abre la puerta; el problema y la intención de actuar deben emerger de Víctor.' },
      { id: 'CAMPO-005', actor: 'Néstor Marín', organization: 'Transmarin · Renca', type: 'Discovery', role: 'Crecimiento y continuidad', access: 'Alta', priority: 'Máxima estratégica', status: 'Preparación', commercial: 'Prospecto potencial', nextAction: 'Conversar después de acumular aprendizaje industrial; explorar futuro de la empresa antes de proponer solución.', context: 'Existe parentesco con Francisca. Néstor quiere dejar de arrendar y contar con espacio propio; ha actualizado la web e incorporado sustentabilidad; sus dos hijos trabajan con él, quiere dejarles continuidad y uno desea trabajar remotamente.', limit: 'El parentesco no valida mercado. Si avanza, alcance, precio y entregables deben tratarse profesionalmente.' },
      { id: 'CAMPO-006', actor: 'Roxana Mora Jara', organization: 'Ropa Americana Trapos · Laja', type: 'Informante', role: 'Textil, reutilización y comercio', access: 'Alta', priority: 'Media-alta', status: 'Radar', commercial: 'Prospecto eventual', nextAction: 'Aprovechar una visita natural a Laja para conversar sobre cómo ha cambiado el rubro; no vender de entrada.', context: 'Amiga de la madre de Benjamín; lleva más de 15 años en ropa usada y disfruta conversar. Tiene experiencia práctica valiosa para circularidad/textiles.', limit: 'No presentar su falta de reinvención como diagnóstico. Cualquier oportunidad debe nacer de una necesidad reconocida por ella.' },
      { id: 'CAMPO-007', actor: 'Panadería Nietos', organization: 'Laja', type: 'Radar', role: 'Empresa familiar', access: 'Alta', priority: 'Baja', status: 'No intervenir todavía', commercial: 'Prospecto condicionado', nextAction: 'Mantener en radar hasta que exista necesidad declarada y disposición a pagar.', context: 'Empresa de un tío de Francisca. Históricamente llegó a dos sucursales y hoy aparentemente opera una; existen señales percibidas de retroceso administrativo.', limit: 'Evitar síndrome de rescate y diagnóstico unilateral. El dueño debe reconocer el problema y querer cambiar.' },
      { id: 'CAMPO-008', actor: 'Mario Cárdenas', organization: 'Contratista de jardinería/ornato', type: 'Informante', role: 'Ventana al contratista pequeño', access: 'Media', priority: 'Media', status: 'Información insuficiente', commercial: 'No prospectar por ahora', nextAction: 'Solo si surge una conversación natural, aprender cómo vive exigencias de mandantes, personal, contratos y operación.', context: 'Vínculo familiar indirecto. Se sabe que ha trabajado con personal a cargo y actualmente opera ornato/jardinería en el aeropuerto de Concepción; nombre y tamaño de empresa no confirmados.', limit: 'No asumir apertura comercial ni reactivar conversaciones antiguas como venta.' },
      { id: 'CAMPO-009', actor: 'Rodrigo Díaz Morales', organization: 'Empresas Díaz / Transportes MDM', type: 'Exclusión', role: 'No-go comercial', access: 'Conocido', priority: 'Fuera', status: 'Descartado', commercial: 'No prospectar', nextAction: 'Ninguno salvo evidencia material futura que cambie riesgos.', context: 'Existen problemas internos potencialmente abordables, pero el equipo desconfía de su capacidad de pago y honestidad.', limit: 'La capacidad técnica de ayudar no compensa riesgo de cobro y confianza.' },
      { id: 'CAMPO-010', actor: 'Club Vegan / Emporio', organization: 'Concepción', type: 'Piloto comercial', role: 'Vitrina Pyme · B2C/B2B pequeño', access: 'Directa', priority: 'En curso', status: 'En espera de lectura', commercial: 'Piloto potencial $50.000 + dominio', nextAction: 'No intervenir. Esperar que vea y responda el mensaje enviado el 27-08 antes de cualquier seguimiento.', context: 'La única señal validada hasta ahora es estética: respondió positivamente al mockup ("wau estaa hermoso" + Me gusta). El 27-08 Francisca envió un mensaje comentando que Metamorfosis tiene un servicio para pymes a bajo costo por si le interesa; al 28-08 ese mensaje aún no ha sido visto.', limit: 'La reacción estética no valida necesidad ni compra. No enviar otro mensaje ni nuevo mockup mientras siga sin leer.' }
    ],
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
        { id: crypto.randomUUID(), owner: 'Francisca', title: 'Coordinar entrevistas de Metamorfosis y registrar respuestas reales', load: 'Exigente', status: 'pending' },
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
      shortTermNeeds: [
        { id: crypto.randomUUID(), title: 'Porcionadores en ml' },
        { id: crypto.randomUUID(), title: 'Seguro plástico para cerrar puertas del refrigerador' }
      ],
      groceryList: [],
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

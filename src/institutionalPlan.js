/**
 * Ruta institucional aprobada el 30-10-2026.
 * Fechas de trabajo referenciales (editables), no hitos confirmados.
 * Los IDs son permanentes: una actualización del sitio no debe duplicar tareas.
 */
export const INSTITUTIONAL_PROGRAM = 'institucional-2026';

export const INSTITUTIONAL_PHASES = [
  { id: 'formalizacion', label: '01 · Formalizar', subtitle: 'Domicilio, SII y habilitación municipal', goal: 'Quedar habilitados para operar y contratar sin improvisar.' },
  { id: 'operacion', label: '02 · Organizar', subtitle: 'Responsabilidades, método y economía', goal: 'Trabajar internamente con el rigor que ofreceremos.' },
  { id: 'desarrollo', label: '03 · Validar y crecer', subtitle: 'Proyectos, mercado y especialización', goal: 'Cobrar y medir resultados antes de ampliar el catálogo.' }
];

const entries = [
  ['01','formalizacion','2026-10-31','Francisca','Contratar oficina virtual y respaldar el domicilio','Revisar plan, vigencia, contrato legalizado, uso del inmueble y condiciones de renovación. Precio informado: $100.580; no registrar el gasto como pagado sin comprobante.','Contrato suscrito, respaldo archivado y condiciones verificadas.'],
  ['02','formalizacion','2026-11-03','Francisca','Registrar domicilio e iniciar actividades en SII','Declarar la actividad efectiva según lo acordado (consultoría de gestión, 702000), verificando compatibilidad tributaria. Ampliar giros únicamente cuando un servicio real lo justifique.','Domicilio registrado e inicio de actividades comprobado en SII.'],
  ['03','formalizacion','2026-11-05','Francisca','Obtener Certificado de Destino en Concepción','Gestionarlo directamente ante la municipalidad, bajo el giro municipal compatible, y conservar el comprobante.','Certificado emitido o respuesta municipal documentada.'],
  ['04','formalizacion','2026-11-09','Francisca','Solicitar patente municipal y registrar obligaciones','Tramitar la patente con antecedentes de domicilio, certificado y SII; decidir si contratar tramitación externa (0,6 UF informado). Registrar vencimientos y pagos.','Solicitud presentada, antecedentes archivados y estado de tramitación verificado.'],
  ['05','operacion','2026-11-06','Ambos','Aprobar responsabilidades y criterios de actuación','Distinguir facultades estatutarias de la gerencia, funciones operativas y aportes jurídico-estratégicos. Dejar documentadas independencia, confidencialidad y relación con colaboradores.','Acuerdo interno breve validado por ambos.'],
  ['06','operacion','2026-11-11','Francisca','Crear presupuesto y control económico por proyecto','Definir plantilla de costos, horas, gastos, margen, flujo de cobros, cambios de alcance y responsable del gasto. No mezclar caja empresarial y familiar.','Plantilla aplicada a un presupuesto real y revisada.'],
  ['07','operacion','2026-11-13','Ambos','Documentar metodología de investigación aplicada','Ficha única: problema, actores, interdependencias, evidencia, riesgos, oportunidades, opciones, costos, indicadores y transferencia. Proporcional al encargo.','Ficha V1 lista y utilizada en un caso real.'],
  ['08','operacion','2026-11-17','Ambos','Preparar propuesta y contrato tipo con controles básicos','Incorporar alcance, entregables, pagos, propiedad intelectual, confidencialidad, protección de datos, límites profesionales y autorizaciones para uso de casos.','Plantillas utilizables y reglas mínimas de seguridad digital adoptadas.'],
  ['09','desarrollo','2026-11-20','Ambos','Validar metodología en un trabajo existente','Aplicar las fichas en un proyecto autorizado sin abrir iniciativas adicionales. Registrar línea base, costos reales, resultados y puntos a corregir.','Caso documentado con hechos separados de hipótesis y mejoras pendientes.'],
  ['10','desarrollo','2026-11-25','Francisca','Delimitar ofertas contratables y proceso comercial','Traducir capacidades acreditables en alcances, entregables, tarifas y criterios de aceptación. No ofertar especialidades técnicas aún no demostradas.','Dos o tres ofertas acotadas con presupuesto, responsable y condiciones de contratación.'],
  ['11','desarrollo','2026-12-04','Ambos','Cerrar brechas de presupuestos y gestión de riesgos','Aplicar formación breve en presupuestación, gestión de proyectos y riesgos a las plantillas internas. Priorizar resultados prácticos sobre certificados.','Presupuesto y matriz de riesgos mejorados mediante aprendizaje aplicado.'],
  ['12','desarrollo','2026-12-15','Ambos','Preparar mapa de especialidades emergentes 2027','Investigar adaptación climática, riesgos penales, protección de datos, ciberseguridad y continuidad. Identificar demanda, capacidades faltantes, colaboraciones y regulación aplicable; no anunciar nuevas áreas como consolidadas.','Mapa de oportunidades y brechas con decisiones de profundización justificadas.']
];

export const institutionalTasks = entries.map(([n,phase,date,owner,title,explain,done_when]) => ({
  id: `INST-2026-${n}`, program: INSTITUTIONAL_PROGRAM, phase, date, owner,
  start: '', end: '', title, explain, done_when, topic: 'Dirección',
  why: 'Consolidar la coherencia jurídica, operativa, económica y metodológica de Metamorfosis Lab.',
  status: 'pending', confirmed: false, comments: [], progressNote: '', progressUpdatedAt: ''
}));

export const institutionalDecisions = [
  'Identidad institucional aprobada (30-10-2026): investigación e innovación aplicada desde Biobío para organizaciones públicas y privadas, con y sin fines de lucro.',
  'Conservar los cinco ámbitos de actividad; el respeto por los sistemas vivos, la productividad y la mejora económica son criterios transversales, no nuevas divisiones.',
  'Prevención, gestión y adaptación ante riesgos, así como patrimonio, son especialidades progresivas; no ofrecer como acreditadas competencias todavía no demostradas.',
  'Secuencia acordada: formalizar → organizar y medir → validar ofertas, aprender y especializarse. No reformar estatutos ni agregar giros por anticipación.'
];

export const initialInstitutionalLog = [
  { id: 'INST-LOG-01', date: '2026-10-29', title: 'Antecedentes societarios revisados', text: 'Estatuto actualizado, vigencia y anotaciones revisados. La sociedad existe; formalización tributaria y municipal pendiente de comprobar.', kind: 'verificado' },
  { id: 'INST-LOG-02', date: '2026-10-30', title: 'Identidad y estructura acordadas', text: 'Investigación e innovación aplicada, cinco ámbitos vigentes, productividad y sistemas vivos como criterios compartidos. Riesgos y patrimonio como especialidades en desarrollo.', kind: 'acuerdo' },
  { id: 'INST-LOG-03', date: '2026-10-30', title: 'Ruta de tres pasos aprobada', text: 'Formalización; organización, presupuestos y metodología; validación comercial y formación. Los hitos programados son propuestas de trabajo, no tareas ya ejecutadas.', kind: 'acuerdo' }
];

export function appendInstitutionalTasks(existing = []) {
  const byId = new Set(existing.map(item => item?.id));
  const byTitle = new Set(existing.map(item => item?.title));
  return [...existing, ...institutionalTasks.filter(item => !byId.has(item.id) && !byTitle.has(item.title))];
}

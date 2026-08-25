export const publicNavigation = [
  { id: 'que-hacemos', label: 'Qué hacemos', icon: 'target' },
  { id: 'metodo', label: 'Método', icon: 'timeline' },
  { id: 'equipo', label: 'Equipo', icon: 'group' }
];

export const transformationPillars = [
  {
    icon: 'query_stats',
    title: 'Operación',
    text: 'Ordenamos procesos, información y recursos para que las decisiones no dependan de improvisación.',
    accent: 'Procesos, información y recursos'
  },
  {
    icon: 'group',
    title: 'Personas',
    text: 'Diseñamos cambios que puedan ser usados y sostenidos por quienes realizan el trabajo.',
    accent: 'Uso real y continuidad'
  },
  {
    icon: 'public',
    title: 'Sistemas vivos',
    text: 'Integramos impactos y recursos materiales cuando son relevantes para la forma en que la organización genera valor.',
    accent: 'Recursos, impactos y entorno'
  }
];

export const activeOfferUseCases = [
  {
    icon: 'schema',
    title: 'Procesos y roles',
    text: 'Cuando tareas, decisiones o responsabilidades dependen demasiado de la memoria o de una sola persona.'
  },
  {
    icon: 'database',
    title: 'Registros y trazabilidad',
    text: 'Cuando existe información, pero está dispersa y cuesta seguir, demostrar o aprender de lo que ocurre.'
  },
  {
    icon: 'open_in_new',
    title: 'Presencia y conversión digital',
    text: 'Cuando la oferta existe, pero no se explica con claridad o el contacto depende de canales improvisados.'
  },
  {
    icon: 'recycling',
    title: 'Uso de recursos',
    text: 'Cuando materiales, activos o residuos pueden gestionarse mejor sin separar eficiencia y responsabilidad.'
  }
];

export const methodPrinciples = [
  { icon: 'visibility', title: 'Entender antes de intervenir', text: 'La operación real importa más que la solución de moda.' },
  { icon: 'design_services', title: 'Complejidad justa', text: 'La solución debe ser suficiente para el problema, no más grande que él.' },
  { icon: 'verified_user', title: 'Capacidad instalada', text: 'El trabajo debe quedar utilizable por la organización.' }
];

export const processRoadmap = [
  { icon: 'visibility', title: 'Entender', text: 'Contexto, operación, restricciones y evidencia.' },
  { icon: 'sort', title: 'Priorizar', text: 'Problema, urgencia, costo de no actuar y alcance.' },
  { icon: 'construction', title: 'Intervenir', text: 'Solución mínima suficiente, implementación y prueba.' },
  { icon: 'query_stats', title: 'Medir y transferir', text: 'Resultados observables, documentación y continuidad.' }
];

export const stackBadges = ['Procesos', 'Datos', 'Documentación', 'Diseño', 'Tecnología', 'Indicadores'];

export const resultIndicators = ['Tiempo', 'Errores', 'Trazabilidad', 'Coordinación', 'Uso de recursos', 'Continuidad'];

export const resultOutcomes = [
  { icon: 'schema', title: 'Procesos más claros', text: 'Responsables, pasos y puntos de decisión visibles.' },
  { icon: 'database', title: 'Información utilizable', text: 'Registros que sirven para decidir, demostrar y aprender.' },
  { icon: 'query_stats', title: 'Resultados observables', text: 'Indicadores definidos antes de atribuir éxito a la intervención.' },
  { icon: 'verified_user', title: 'Continuidad', text: 'Herramientas y criterios que permanecen después del cierre.' }
];

export const team = [
  {
    initials: 'FC',
    name: 'Francisca Carrasco Marín',
    role: 'Dirección operativa y diseño de intervención',
    profession: 'Gestión operativa y coordinación de proyectos',
    institution: 'Casa de estudio por completar en edición final',
    text: 'Lidera la lectura operacional, el diseño de soluciones y la ejecución de las intervenciones.'
  },
  {
    initials: 'BS',
    name: 'Benjamín Sepúlveda',
    role: 'Estrategia, investigación y desarrollo metodológico',
    profession: 'Abogado e investigador',
    institution: 'Magíster en Derecho Penal en curso · Universidad de Buenos Aires',
    text: 'Trabaja en investigación previa, estructuración de problemas, gobernanza, documentación y aprendizaje del método.'
  }
];

export const servicePricing = [
  {
    id: 'conversacion-inicial', icon: 'schedule', title: 'Conversación inicial', compact: '30 minutos · sin costo', price: 'Sin costo',
    scope: 'Primera conversación para comprender la situación general y decidir si existe un problema que Metamorfosis pueda abordar.',
    includes: ['No constituye diagnóstico', 'No fuerza una solución predeterminada', 'Si el problema requiere otra especialidad, lo señalamos'],
    result: 'Criterio inicial para decidir si corresponde avanzar.'
  },
  {
    id: 'diagnostico-focalizado', icon: 'visibility', title: 'Diagnóstico focalizado', compact: 'Desde $210.000 · hasta 6 horas', price: 'Desde $210.000',
    scope: 'Para una situación concreta que necesita comprensión antes de invertir en una solución.',
    includes: ['Revisión de antecedentes', 'Levantamiento', 'Análisis y contraste', 'Devolución priorizada'],
    result: 'Problema delimitado, evidencia, prioridades y próximos pasos.'
  },
  {
    id: 'diagnostico-terreno', icon: 'location_on', title: 'Diagnóstico con terreno', compact: 'Desde $420.000 · hasta 12 horas', price: 'Desde $420.000',
    scope: 'Para situaciones que requieren observación directa, entrevistas o levantamiento presencial.',
    includes: ['Análisis previo', 'Trabajo en terreno acordado', 'Procesamiento de evidencia', 'Devolución de resultados'],
    result: 'Diagnóstico sustentado en antecedentes y observación directa.'
  },
  {
    id: 'diseno-intervencion', icon: 'design_services', title: 'Diseño de intervención', compact: 'Desde $175.000 · hasta 5 horas', price: 'Desde $175.000',
    scope: 'Cuando ya existe diagnóstico suficiente y se necesita convertirlo en una solución ejecutable.',
    includes: ['Qué cambiar y qué no', 'Responsables y recursos', 'Indicadores', 'Condición de cierre'],
    result: 'Intervención delimitada y ejecutable.'
  },
  {
    id: 'implementacion', icon: 'construction', title: 'Implementación y acompañamiento', compact: 'Desde $350.000 · bloques de 10 horas', price: 'Desde $350.000',
    scope: 'Para ejecutar, probar o acompañar una transformación previamente definida.',
    includes: ['Trabajo remoto o en terreno', 'Coordinación', 'Documentación', 'Herramientas según alcance'],
    result: 'Cambio implementado con horas, alcance y continuidad visibles.'
  }
];

export const pricingPrinciples = [
  { icon: 'rule', title: 'Alcance definido', text: 'Indicamos qué incluye, qué queda fuera y qué resultado se espera.' },
  { icon: 'schedule', title: 'Horas visibles', text: 'Presupuestamos y registramos el trabajo para aprender costos reales.' },
  { icon: 'verified_user', title: 'Autorización previa', text: 'No agregamos horas ni gastos externos sin acuerdo.' },
  { icon: 'conversion_path', title: 'Cierre y transferencia', text: 'Cada intervención debe explicar qué cambió y qué queda instalado.' }
];

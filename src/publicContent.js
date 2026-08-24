export const publicNavigation = [
  { id: 'que-hacemos', label: 'Qué hacemos', icon: 'target' },
  { id: 'metodo', label: 'Cómo trabajamos', icon: 'timeline' },
  { id: 'equipo', label: 'Equipo', icon: 'group' },
  { id: 'contacto', label: 'Contacto', icon: 'mail' }
];

export const transformationPillars = [
  { icon: 'query_stats', title: 'Operación', text: 'Ordenamos procesos, información y recursos para que las decisiones no dependan de improvisación.' },
  { icon: 'group', title: 'Personas', text: 'Diseñamos cambios que puedan ser usados y sostenidos por quienes realizan el trabajo.' },
  { icon: 'public', title: 'Sistemas vivos', text: 'Integramos impactos y recursos materiales cuando son relevantes para la forma en que la organización genera valor.' }
];

export const activeOfferUseCases = [
  { icon: 'visibility', title: 'Diagnóstico focalizado', text: 'Comprender un problema concreto, separar síntomas de causas y priorizar un siguiente paso.' },
  { icon: 'schema', title: 'Ordenamiento y trazabilidad', text: 'Pasar de registros dispersos a procesos, responsables y evidencia operacional utilizable.' },
  { icon: 'public', title: 'Vitrina Pyme', text: 'Una presencia digital acotada para explicar una oferta real y facilitar el primer contacto.' },
  { icon: 'inventory_2', title: 'Ciclo Seguro', text: 'Hipótesis en validación para gestionar vestuario laboral con trazabilidad, vida útil y salida responsable.' }
];

export const solutions = [
  { icon: 'visibility', title: 'Entender el sistema', text: 'Revisamos operación, restricciones, evidencia y decisiones antes de recomendar cambios.' },
  { icon: 'schema', title: 'Ordenar lo crítico', text: 'Convertimos tareas y registros dispersos en una forma de trabajo simple y demostrable.' },
  { icon: 'construction', title: 'Implementar con alcance', text: 'Construimos la solución mínima suficiente y acordamos qué queda dentro y fuera.' },
  { icon: 'query_stats', title: 'Medir y transferir', text: 'Dejamos responsables, indicadores y continuidad para evitar dependencia innecesaria.' }
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
    role: 'Dirección de Metamorfosis Lab',
    text: 'Lidera la lectura operacional, el diseño de soluciones y la ejecución de las intervenciones.'
  },
  {
    initials: 'BS',
    name: 'Benjamín Sepúlveda',
    role: 'Estrategia, investigación y desarrollo metodológico',
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

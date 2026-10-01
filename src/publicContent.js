// =============================================================================
// CONTENIDO EDITABLE DE LA WEB PÚBLICA
// Este archivo concentra listas y textos modulares para editar la web sin tocar
// la estructura JSX. Mantener el orden de las secciones indicado a continuación.
// =============================================================================

// 01 · NAVEGACIÓN PRINCIPAL
export const publicNavigation = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'propuesta', label: 'Propuesta', icon: 'design_services' },
  { id: 'equipo', label: 'Equipo', icon: 'group' }
];

// 02 · CÓMO MIRAMOS · Dimensiones del mapa interactivo
export const transformationPillars = [
  {
    id: 'operacion',
    icon: 'schema',
    title: 'Operación',
    short: 'Cómo ocurre el trabajo.',
    text: 'Procesos, recursos, información, trazabilidad y puntos de decisión que sostienen la operación.',
    signal: 'Procesos · recursos · información · trazabilidad'
  },
  {
    id: 'personas',
    icon: 'group',
    title: 'Personas',
    short: 'Quién puede actuar y cómo.',
    text: 'Trabajo, capacidades, participación, responsabilidades y condiciones para que un cambio pueda sostenerse.',
    signal: 'Trabajo · capacidades · participación · decisiones'
  },
  {
    id: 'entorno',
    icon: 'account_tree',
    title: 'Entorno',
    short: 'Qué relaciones afectan el resultado.',
    text: 'Proveedores, instituciones, comunidades, territorio y otras capacidades externas relevantes para la situación.',
    signal: 'Proveedores · instituciones · comunidades · territorio'
  },
  {
    id: 'condiciones',
    icon: 'verified_user',
    title: 'Condiciones de operación',
    short: 'Bajo qué exigencias se decide.',
    text: 'Regulación, nuevas exigencias, recursos e impactos sobre los sistemas vivos cuando son materialmente relevantes.',
    signal: 'Regulación · exigencias · recursos · sistemas vivos'
  }
];

// 03 · DÓNDE PODEMOS APORTAR · Situaciones de entrada
export const activeOfferUseCases = [
  {
    icon: 'trending_up',
    title: 'Cuando una organización crece',
    text: 'y sus procesos, información o responsabilidades necesitan acompañar ese cambio.'
  },
  {
    icon: 'verified_user',
    title: 'Cuando cambian las exigencias',
    text: 'de clientes, regulación, trazabilidad o debida diligencia.'
  },
  {
    icon: 'account_tree',
    title: 'Cuando hay capacidades dispersas',
    text: 'entre áreas, proveedores, instituciones, personas o territorio.'
  },
  {
    icon: 'search',
    title: 'Cuando falta claridad para decidir',
    text: 'antes de invertir, intervenir, escalar o diseñar una solución.'
  }
];



// 03A · DOS MOTORES · Qué produce Metamorfosis
export const innovationEngines = [
  {
    id: 'soluciones', icon: 'design_services', eyebrow: 'Creamos', title: 'Soluciones propias',
    summary: 'Desarrollamos nuevas respuestas cuando un problema concreto todavía no cuenta con una solución suficientemente útil.',
    when: 'Hay una necesidad verificable o una oportunidad que merece explorarse antes de invertir en una solución mayor.',
    work: 'Diseño, prototipado y pruebas en contexto, con criterios explícitos para ajustar o descartar.',
    output: 'Un prototipo o herramienta documentada, con evidencia inicial sobre su utilidad y condiciones de aplicación.'
  },
  {
    id: 'incubacion', icon: 'conversion_path', eyebrow: 'Hacemos crecer', title: 'Incubación de impacto',
    summary: 'Acompañamos a organizaciones e iniciativas que ya tienen capacidades valiosas, pero necesitan estructurarlas para sostenerse y crecer.',
    when: 'Existe una actividad, experiencia o propuesta con potencial, pero aún faltan estructura operativa, modelo de valor o viabilidad.',
    work: 'Ordenamiento de la propuesta, capacidades, operación y alternativas de sostenibilidad o financiamiento.',
    output: 'Una propuesta fortalecida y una hoja de ruta accionable para implementar, validar o presentar ante aliados.'
  }
];

// 03B · QUÉ CULTIVAMOS · Líneas abiertas del jardín
export const cultivationAreas = [
  {
    icon: 'account_tree',
    title: 'Capacidades y cadenas de valor',
    text: 'Cómo conectar capacidades existentes con necesidades productivas, nuevas oportunidades y exigencias reales.'
  },
  {
    icon: 'conversion_path',
    title: 'Trazabilidad y circularidad',
    text: 'Cómo convertir información, materiales y recorridos dispersos en decisiones y soluciones verificables.'
  },
  {
    icon: 'verified_user',
    title: 'Nuevas exigencias organizacionales',
    text: 'Cómo responder a cambios regulatorios, productivos, humanos o ambientales sin añadir complejidad innecesaria.'
  },
  {
    icon: 'query_stats',
    title: 'Modelos de impacto sostenibles',
    text: 'Cómo transformar iniciativas con propósito en soluciones que puedan sostenerse, financiarse y crecer.'
  }
];

// 04 · CÓMO TRABAJAMOS · Método de Metamorfosis
export const processRoadmap = [
  {
    icon: 'visibility',
    title: 'Entender',
    eyebrow: 'Observar antes de asumir',
    text: 'Reconstruimos la situación real, su contexto, restricciones y evidencia disponible.'
  },
  {
    icon: 'filter_alt',
    title: 'Delimitar',
    eyebrow: 'Separar lo relevante',
    text: 'Distinguimos qué explica el problema, qué es accesorio y dónde vale la pena concentrar el esfuerzo.'
  },
  {
    icon: 'construction',
    title: 'Probar',
    eyebrow: 'Intervenir con proporción',
    text: 'Diseñamos una respuesta acotada y aplicable antes de sobredimensionar una solución.'
  },
  {
    icon: 'query_stats',
    title: 'Medir',
    eyebrow: 'Observar qué cambió',
    text: 'Contrastamos resultados observables y ajustamos cuando corresponde.'
  },
  {
    icon: 'conversion_path',
    title: 'Transferir',
    eyebrow: 'Dejar capacidad',
    text: 'Documentamos criterios, aprendizajes y herramientas para que la organización pueda continuar.'
  }
];

// 05 · PRINCIPIOS DE TRABAJO
export const laboratoryPrinciples = [
  {
    icon: 'visibility',
    title: 'Comprender antes de prescribir',
    text: 'No partimos desde una solución ni suponemos que exista un déficit.'
  },
  {
    icon: 'inventory_2',
    title: 'Trabajar con lo que ya existe',
    text: 'Antes de crear nuevas estructuras, observamos capacidades e instrumentos disponibles.'
  },
  {
    icon: 'filter_alt',
    title: 'Intervenir en la escala necesaria',
    text: 'Preferimos una prueba útil y verificable a una solución más grande que el problema.'
  },
  {
    icon: 'query_stats',
    title: 'Aprender de la intervención',
    text: 'El trabajo debe producir evidencia para decidir qué sostener, ajustar, ampliar o cerrar.'
  }
];

// 06 · INVESTIGACIÓN APLICADA · Preguntas en exploración
export const researchQuestions = [
  {
    index: '01',
    tag: 'Organizaciones',
    question: '¿Cómo crecer sin que la organización se quede atrás?',
    text: 'Exploramos qué necesita evolucionar para acompañar el crecimiento sin convertir la gestión en burocracia.'
  },
  {
    index: '02',
    tag: 'Exigencias',
    question: '¿Qué cambia cuando cambian las reglas de juego?',
    text: 'Observamos trazabilidad, regulación, conducta empresarial responsable y debida diligencia cuando son pertinentes.'
  },
  {
    index: '03',
    tag: 'Capacidades',
    question: '¿Por qué una capacidad no alcanza a transformarse en respuesta?',
    text: 'Estudiamos brechas de información, coordinación, preparación y acceso que mantienen capacidades valiosas fuera de una oportunidad real.'
  },
  {
    index: '04',
    tag: 'Decisiones',
    question: '¿Qué necesita saber una decisión antes de intervenir?',
    text: 'Buscamos disminuir incertidumbre y hacer visible qué sabemos, qué falta conocer y qué vale la pena probar.'
  }
];

// 07 · EQUIPO · Perfiles y complementariedad profesional
export const team = [
  {
    initials: 'FC',
    name: 'Francisca Carrasco Marín',
    role: 'Dirección operativa y diseño de intervención',
    profession: 'Ingeniera Civil Industrial · Universidad de Concepción',
    institution: 'Formación en economía circular, bioeconomía y transformación organizacional',
    text: 'Estudia cómo funcionan los sistemas de trabajo y cómo pueden transformarse cuando cambian sus condiciones productivas, humanas, regulatorias o ambientales.'
  },
  {
    initials: 'BS',
    name: 'Benjamín Sepúlveda Méndez',
    role: 'Estrategia, investigación y desarrollo metodológico',
    profession: 'Abogado · Pontificia Universidad Católica de Valparaíso',
    institution: 'Magíster en Derecho Penal · Universidad de Buenos Aires, en curso',
    text: 'Trabaja sobre instituciones, regulación, responsabilidades, prevención de daños y coordinación de actores en contextos organizacionales y territoriales complejos.'
  }
];

export const servicePricing = [];
export const pricingPrinciples = [];
export const stackBadges = [];
export const resultIndicators = [];
export const resultOutcomes = [];
export const methodPrinciples = laboratoryPrinciples;

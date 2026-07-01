export const osPlatforms = [
  {
    id: "metamorfosis",
    name: "Metamorfosis Lab",
    ownership: "90% Francisca / 10% Benjamin",
    role:
      "Laboratorio de innovacion, sustentabilidad y apoyo en gestion de proyectos.",
    color: "cyan",
  },
  {
    id: "concriterio",
    name: "ConCriterio",
    ownership: "90% Benjamin / 10% Francisca",
    role:
      "Formacion, analisis aplicado y acompanamiento estrategico en seguridad, convivencia y conflictividad territorial.",
    color: "blue",
  },
  {
    id: "academico",
    name: "Academico Benjamin",
    ownership: "Benjamin",
    role: "Magister UBA, tesis, Seminario de Paz y trabajos academicos.",
    color: "violet",
  },
  {
    id: "incubadora",
    name: "Incubadora",
    ownership: "Segun proyecto",
    role: "Ideas vivas, postulaciones, productos semilla y reactivables.",
    color: "green",
  },
];

export const osProjects = [
  {
    id: "consultoria-cm",
    platform: "metamorfosis",
    title: "Consultoria Consolidacion CM",
    owner: "Metamorfosis Lab",
    type: "Proyecto activo",
    priority: "Prioridad maxima",
    status: "Activo",
    due: "Julio 2026",
    summary:
      "Proyecto desarrollado por Metamorfosis para formalizar, ordenar y digitalizar CM Banqueteria. CM es cliente/caso piloto cercano, no negocio propio.",
    nextStep:
      "Cerrar hoja de ruta de formalizacion, modulos del sistema interno y entregables por etapa.",
    risk:
      "Confundir consultoria con propiedad sobre CM; dispersar el proyecto en tarjetas sueltas.",
    deliverable:
      "Plan de consolidacion + sistema interno CM + metodologia replicable.",
    aiUse:
      "Modo Metamorfosis, modo riesgo, modo cierre, fichas de proceso y estandarizacion.",
  },
  {
    id: "sistema-cm",
    platform: "metamorfosis",
    title: "Sistema Interno CM",
    owner: "Metamorfosis Lab",
    type: "Entregable",
    priority: "Prioridad maxima",
    status: "En desarrollo",
    due: "Julio 2026",
    summary:
      "Panel de gestion creado dentro de la Consultoria Consolidacion CM: costos, stock, proveedores, personal, menu, minutas, documentos y operacion.",
    nextStep:
      "Definir MVP indispensable y separar modulos actuales, pendientes y futuras mejoras.",
    risk:
      "Sobrecargar el sistema antes de validar el uso diario de la administradora.",
    deliverable: "MVP funcional y lista de modulos por prioridad.",
    aiUse: "Modo producto, modo cierre, QA de interfaz y priorizacion de modulos.",
  },
  {
    id: "cm-experiencias",
    platform: "metamorfosis",
    title: "CM Experiencias: Laja Identidad",
    owner: "CM 50% / Metamorfosis o Francisca-Benjamin 40% / Martin 10%",
    type: "Alianza",
    priority: "Prioridad maxima",
    status: "En diseno",
    due: "Segunda semana de agosto",
    summary:
      "Experiencia gastronomica, cultural e inmersiva con identidad local de Laja, separada de la consultoria a CM.",
    nextStep:
      "Cerrar acuerdo base, guion minuto a minuto, costos, roles, menu, jornada social y jornada pagada.",
    risk:
      "No definir reparto, permisos, alcohol, responsabilidades, costos reales y propiedad intelectual.",
    deliverable: "Guion + presupuesto + acuerdo 50/40/10 + checklist de produccion.",
    aiUse: "Modo CM Experiencias, modo contrato, modo riesgo y modo reunion.",
  },
  {
    id: "dona-senoraza",
    platform: "metamorfosis",
    title: "Dona Senoraza Merch",
    owner: "100% Metamorfosis",
    type: "Linea propia",
    priority: "Alta",
    status: "En diseno",
    due: "Agosto 2026",
    summary:
      "Velas, packaging, relato visual, souvenirs y objetos identitarios asociados a La Senoraza.",
    nextStep:
      "Costear vela, caja, relato, stock inicial y regla de comision del 20% a CM por ventas en local o evento.",
    risk:
      "Diluir la propiedad del merch dentro de CM Experiencias o no distinguir regalo de venta directa.",
    deliverable: "Ficha comercial, costos, comision, prototipo y relato de producto.",
    aiUse: "Modo producto, modo marca, modo contrato y storytelling.",
  },
  {
    id: "juana-arco",
    platform: "metamorfosis",
    title: "Juana de Arco",
    owner: "100% Francisca",
    type: "Plan estrategico",
    priority: "Alta-media",
    status: "Activo",
    due: "Julio 2026",
    summary:
      "Marca de Francisca. La identidad ya fue construida; ahora requiere plan estrategico, seguimiento, validacion, campanas y metricas.",
    nextStep:
      "Crear calendario comercial, matriz de productos, mensajes por campana y sistema de seguimiento de ventas/contenido.",
    risk:
      "No asignarle espacio real en la agenda tras cerrar identidad.",
    deliverable: "Plan estrategico + calendario mensual + tablero de validacion.",
    aiUse: "Modo Juana de Arco, copies, reels, campanas y analisis de marca.",
  },
  {
    id: "red-oriente",
    platform: "metamorfosis",
    title: "Red Oriente",
    owner: "Compartido con tercero",
    type: "Pausa activa",
    priority: "Media-baja",
    status: "Pausado",
    due: "Sin prisa",
    summary:
      "Linea de Metamorfosis compartida con un tercero. Puede avanzar sin urgencia si aparece una tarea liviana u oportunidad concreta.",
    nextStep: "Definir una accion minima de mantenimiento o dejarla en revision mensual.",
    risk: "Consumir foco de CM, CM Experiencias, Juana o ConCriterio.",
    deliverable: "Ficha de pausa activa y criterios de reactivacion.",
    aiUse: "Modo estrategia y revision mensual.",
  },
  {
    id: "estandarizacion",
    platform: "metamorfosis",
    title: "Metodo Metamorfosis",
    owner: "Metamorfosis Lab",
    type: "Estandarizacion",
    priority: "Alta",
    status: "En construccion",
    due: "Segundo semestre 2026",
    summary:
      "Estandarizacion del proceso de innovacion y apoyo en gestion de proyectos probado en CM, Juana, CatLoop, aji, Revotrush, Poiesis y otros casos.",
    nextStep:
      "Documentar etapas: diagnostico, orden, gestion, costos, formalizacion, postulacion, validacion y sistema.",
    risk:
      "No capturar aprendizajes mientras se ejecutan los proyectos reales.",
    deliverable: "Mapa del metodo + plantillas + productos vendibles para pymes y proyectos.",
    aiUse: "Modo Metamorfosis, sistematizacion, plantillas y producto escalable.",
  },
  {
    id: "sustentabilidad",
    platform: "metamorfosis",
    title: "Sustentabilidad: Revotrush y Poiesis",
    owner: "Metamorfosis Lab",
    type: "Linea transversal",
    priority: "Media",
    status: "Antecedente semilla",
    due: "Revision trimestral",
    summary:
      "Linea de sustentabilidad, economia circular y ecodiseno que intento materializarse en proyectos semilla como Revotrush y Poiesis.",
    nextStep:
      "Registrar aprendizajes, activos conceptuales y posibles usos en futuras postulaciones.",
    risk:
      "Perder el acumulado conceptual de Metamorfosis en sustentabilidad.",
    deliverable: "Ficha de aprendizajes y banco de argumentos sustentables.",
    aiUse: "Modo sustentabilidad, postulaciones y narrativa tecnica.",
  },
  {
    id: "concriterio-minimo",
    platform: "concriterio",
    title: "Oferta minima ConCriterio",
    owner: "90% Benjamin / 10% Francisca",
    type: "Plataforma profesional",
    priority: "Alta",
    status: "En diseno comercial",
    due: "Julio-agosto 2026",
    summary:
      "Plataforma de formacion, analisis aplicado y acompanamiento estrategico en seguridad, sistema penal, convivencia, reinsercion, justicia restaurativa y conflictividad territorial.",
    nextStep:
      "Crear fichas de 3 talleres, Mapa Inicial y Acompanamiento Estrategico mensual.",
    risk:
      "Reducir ConCriterio a asesoria legal o depender de talleres aislados.",
    deliverable: "Kit comercial minimo: fichas, propuesta tipo y lista de contactos.",
    aiUse: "Modo ConCriterio, modo producto, modo venta y modo riesgo etico.",
  },
  {
    id: "magister-uba",
    platform: "academico",
    title: "Magister UBA",
    owner: "Benjamin",
    type: "Programa academico",
    priority: "Paralelo protegido",
    status: "Activo",
    due: "Calendario UBA",
    summary:
      "Programa academico general que contiene cursos, trabajos, evaluaciones y ruta de titulacion.",
    nextStep: "Mantener calendario, pagos, entregas y requisitos visibles.",
    risk: "Mezclar programa, tesis y trabajos puntuales como si fueran una sola cosa.",
    deliverable: "Vista academica con calendario y pendientes.",
    aiUse: "Modo academico y control de entregas.",
  },
  {
    id: "tesis-uba",
    platform: "academico",
    title: "Tesis UBA",
    owner: "Benjamin",
    type: "Investigacion principal",
    priority: "Paralelo estrategico",
    status: "En formulacion",
    due: "Ruta de tesis",
    summary:
      "Investigacion sobre conflictos penitenciarios, justicia restaurativa, ejecucion penal e interculturalidad en Chile.",
    nextStep: "Precisar pregunta, corpus, casos, normativa y marco teorico.",
    risk: "Que el objeto se vuelva demasiado amplio.",
    deliverable: "Proyecto de tesis delimitado.",
    aiUse: "Modo tesis, revision bibliografica, matriz teorica y estructura.",
  },
  {
    id: "seminario-paz",
    platform: "academico",
    title: "Seminario de Paz",
    owner: "Benjamin",
    type: "Curso paralelo",
    priority: "Paralelo activo",
    status: "Activo",
    due: "Segun clase",
    summary:
      "Curso que aporta enfoque, metodo e ideas para formular mejor la tesis, pero no es la tesis.",
    nextStep: "Mantener entregas y extraer insumos utiles para la investigacion.",
    risk: "Confundir trabajos del seminario con la tesis completa.",
    deliverable: "Entregas del curso + banco de ideas para tesis.",
    aiUse: "Modo academico, lectura critica y redaccion.",
  },
  {
    id: "catloop",
    platform: "incubadora",
    title: "CatLoop / estacion modular",
    owner: "50% Francisca / 50% Benjamin",
    type: "Innovacion y cofinanciamiento",
    priority: "Incubadora",
    status: "Secundaria viva",
    due: "Segun fondo",
    summary:
      "Producto modular sustentable para gatos, util para probar postulacion, producto innovador y metodo Metamorfosis.",
    nextStep: "Mantener carpeta base y activar si aparece fondo o aliado.",
    risk: "Abandonarla o activarla cuando compita con prioridades maximas.",
    deliverable: "Carpeta de postulacion viva.",
    aiUse: "Modo postulacion, modo producto y modo sustentabilidad.",
  },
  {
    id: "aji",
    platform: "incubadora",
    title: "Aji / Senoraza alimentaria",
    owner: "Por definir",
    type: "Producto innovador pausado",
    priority: "Pausado util",
    status: "Dormido",
    due: "Solo si conecta",
    summary:
      "Producto alimentario que queda para el final, salvo que sirva como insumo, relato o producto asociado a CM Experiencias.",
    nextStep: "No activar salvo uso concreto en experiencia, postulacion o degustacion.",
    risk: "Abrir otro frente antes de validar CM Experiencias.",
    deliverable: "Criterio de activacion.",
    aiUse: "Modo incubadora y filtro de oportunidad.",
  },
];

export const defaultWeeklyTasks = [
  {
    id: "task-cm-roadmap",
    projectId: "consultoria-cm",
    title: "Cerrar hoja de ruta de Consultoria Consolidacion CM",
    owner: "Francisca",
    status: "Esta semana",
  },
  {
    id: "task-cmexp-guion",
    projectId: "cm-experiencias",
    title: "Armar guion minuto a minuto de CM Experiencias",
    owner: "Francisca / Benjamin",
    status: "Esta semana",
  },
  {
    id: "task-senoraza-costos",
    projectId: "dona-senoraza",
    title: "Costear vela, caja y comision del 20% a CM",
    owner: "Francisca",
    status: "Esta semana",
  },
  {
    id: "task-juana-plan",
    projectId: "juana-arco",
    title: "Crear calendario de validacion comercial de Juana de Arco",
    owner: "Francisca",
    status: "Esta semana",
  },
  {
    id: "task-concriterio-kit",
    projectId: "concriterio-minimo",
    title: "Definir fichas de talleres, Mapa Inicial e iguala ConCriterio",
    owner: "Benjamin",
    status: "Proxima",
  },
];

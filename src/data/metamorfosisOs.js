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

export const defaultLogEntries = [
  {
    id: "log-cm-01",
    projectId: "consultoria-cm",
    date: "2026-07-01",
    title: "CM es cliente cercano, no negocio propio",
    note:
      "CM Banqueteria pertenece a su duena/familia. Metamorfosis Lab realiza una consultoria para consolidar, formalizar, ordenar y digitalizar el negocio.",
    author: "Benjamin",
  },
  {
    id: "log-cm-02",
    projectId: "consultoria-cm",
    date: "2026-07-01",
    title: "Consultoria Consolidacion CM pertenece a Metamorfosis",
    note:
      "Consultoria Consolidacion CM es un proyecto desarrollado por Metamorfosis Lab. El Sistema Interno CM es un entregable dentro de ese proyecto, no una linea independiente.",
    author: "Benjamin",
  },
  {
    id: "log-sistema-cm-01",
    projectId: "sistema-cm",
    date: "2026-07-01",
    title: "Sistema interno como entregable central",
    note:
      "El sistema debe reemplazar cuadernos y Excel: gastos, proveedores, stock, personal, menu diario, minutas, reservas/despacho, documentos, actas e informes.",
    author: "Benjamin",
  },
  {
    id: "log-cmexp-01",
    projectId: "cm-experiencias",
    date: "2026-07-01",
    title: "Reparto base de alianza",
    note:
      "Se trabaja con estructura base 50% CM, 40% Metamorfosis o Francisca-Benjamin y 10% Martin. CM aporta local, cocina, personal y operacion; Metamorfosis disena experiencia, relato, IA, ambientacion y merch; Martin aporta audiovisual y redes.",
    author: "Benjamin",
  },
  {
    id: "log-cmexp-02",
    projectId: "cm-experiencias",
    date: "2026-07-01",
    title: "Formato de primera jornada",
    note:
      "Se proyecta una tarde social gratuita, sin alcohol, para jovenes en situacion de vulnerabilidad de Laja; y una noche pagada para 30 personas mas 4 invitados, con ticket estimado de $30.000 por persona o $50.000 por pareja.",
    author: "Benjamin",
  },
  {
    id: "log-senoraza-01",
    projectId: "dona-senoraza",
    date: "2026-07-01",
    title: "Merch exclusivo de Metamorfosis",
    note:
      "Dona Senoraza Merch es 100% Metamorfosis. Puede venderse en CM o durante CM Experiencias, pagando eventualmente 20% a CM por ventas realizadas en local o evento.",
    author: "Benjamin",
  },
  {
    id: "log-juana-01",
    projectId: "juana-arco",
    date: "2026-07-01",
    title: "Identidad cerrada, comienza plan estrategico",
    note:
      "Juana de Arco es marca 100% de Francisca. Terminada la construccion de identidad, el foco pasa a plan estrategico, seguimiento, validacion, campanas, contenidos y metricas.",
    author: "Benjamin",
  },
  {
    id: "log-red-01",
    projectId: "red-oriente",
    date: "2026-07-01",
    title: "Pausa activa",
    note:
      "Red Oriente es una linea compartida con un tercero. Puede avanzar sin prisa, pero no debe competir con CM, CM Experiencias, Juana ni ConCriterio.",
    author: "Benjamin",
  },
  {
    id: "log-metodo-01",
    projectId: "estandarizacion",
    date: "2026-07-01",
    title: "Metodo Metamorfosis en construccion",
    note:
      "La estandarizacion debe capturar el proceso semiestandarizado de innovacion y apoyo en gestion de proyectos: diagnostico, orden, costos, formalizacion, digitalizacion, postulacion, validacion y seguimiento.",
    author: "Benjamin",
  },
  {
    id: "log-sust-01",
    projectId: "sustentabilidad",
    date: "2026-07-01",
    title: "Linea sustentabilidad",
    note:
      "Metamorfosis tiene una linea de sustentabilidad, economia circular y ecodiseno intentada en proyectos semilla como Revotrush y Poiesis. Debe quedar como activo metodologico.",
    author: "Benjamin",
  },
  {
    id: "log-concriterio-01",
    projectId: "concriterio-minimo",
    date: "2026-07-01",
    title: "Definicion fina de ConCriterio",
    note:
      "ConCriterio es plataforma independiente de formacion, analisis aplicado y acompanamiento estrategico en seguridad, sistema penal, convivencia, reinsercion, justicia restaurativa y conflictividad territorial. No es consultoria pyme.",
    author: "Benjamin",
  },
  {
    id: "log-academico-01",
    projectId: "magister-uba",
    date: "2026-07-01",
    title: "Separacion academica",
    note:
      "Magister UBA, Tesis UBA, Seminario de Paz y trabajos UBA deben aparecer separados. El Seminario aporta enfoque y metodo a la tesis, pero no es la tesis.",
    author: "Benjamin",
  },
  {
    id: "log-tesis-01",
    projectId: "tesis-uba",
    date: "2026-07-01",
    title: "Base de tesis",
    note:
      "La tesis se orienta a conflictos penitenciarios, justicia restaurativa, ejecucion penal e interculturalidad en Chile, con posible recorte Biobio/sur.",
    author: "Benjamin",
  },
  {
    id: "log-seminario-01",
    projectId: "seminario-paz",
    date: "2026-07-01",
    title: "Seminario como insumo",
    note:
      "El Seminario de Paz aporta formas de investigar, sensibilidad sobre conflicto, violencia, sancion, palabra, vinculos y enfoque restaurativo.",
    author: "Benjamin",
  },
  {
    id: "log-catloop-01",
    projectId: "catloop",
    date: "2026-07-01",
    title: "Incubadora 50/50",
    note:
      "CatLoop / estacion modular es 50% Francisca y 50% Benjamin. Es secundaria pero con potencial para postulaciones, cofinanciamiento e innovacion sustentable.",
    author: "Benjamin",
  },
  {
    id: "log-aji-01",
    projectId: "aji",
    date: "2026-07-01",
    title: "Aji en pausa util",
    note:
      "El aji / Senoraza alimentaria queda para el final, salvo que sirva como insumo, degustacion, relato o producto asociado a CM Experiencias.",
    author: "Benjamin",
  },
];

export const defaultSourceDocs = [
  {
    id: "source-cm-panel",
    projectId: "consultoria-cm",
    title: "Repositorio y panel CM Banqueteria",
    type: "Codigo / sistema",
    location: "cmbanqueteria-main y variantes trabajadas del panel administrativo",
    status: "Fuente activa",
  },
  {
    id: "source-cm-sanitaria",
    projectId: "consultoria-cm",
    title: "Instrumentos sanitarios y planos CM",
    type: "PDF / checklist / planos",
    location: "Instrumentos de autoevaluacion sanitaria, planos por zonas y documentos de formalizacion",
    status: "Fuente normativa-operativa",
  },
  {
    id: "source-sistema-cm",
    projectId: "sistema-cm",
    title: "Modulos definidos del sistema interno",
    type: "Arquitectura funcional",
    location:
      "Menu diario, dulces/promos, reservas/despacho, gastos, proveedores, stock, personal, minutas, consultoria y cotizaciones",
    status: "Fuente funcional",
  },
  {
    id: "source-cmexp-relato",
    projectId: "cm-experiencias",
    title: "Relato CM Experiencias",
    type: "Brief narrativo",
    location:
      "Experiencia gastronomica/inmersiva con historia local de Laja, videos IA, guia historico, violinista y leyenda de La Senoraza",
    status: "Fuente creativa",
  },
  {
    id: "source-senoraza",
    projectId: "dona-senoraza",
    title: "Linea Dona Senoraza Merch",
    type: "Brief producto",
    location: "Vela con forma de La Senoraza, caja ilustrada, souvenir y objeto identitario",
    status: "Fuente de producto",
  },
  {
    id: "source-juana",
    projectId: "juana-arco",
    title: "Identidad Juana de Arco",
    type: "Marca / contenido",
    location: "Linea de amuletos, joyas, tag, empaque pergamino, campanas y material visual trabajado",
    status: "Fuente de marca",
  },
  {
    id: "source-concriterio",
    projectId: "concriterio-minimo",
    title: "Informe Final ConCriterio",
    type: "Documento base",
    location: "Informe final depurado de ConCriterio",
    status: "Fuente estrategica",
  },
  {
    id: "source-tesis",
    projectId: "tesis-uba",
    title: "Mas alla de la sancion",
    type: "Documento academico",
    location: "Base de investigacion sobre conflictos penitenciarios y justicia restaurativa",
    status: "Fuente academica",
  },
  {
    id: "source-seminario",
    projectId: "seminario-paz",
    title: "Lecturas y minutas Seminario de Paz",
    type: "Lecturas / apuntes",
    location: "Materiales sobre paz, interser, comunicacion no violenta, convivencia y enfoque restaurativo",
    status: "Fuente metodologica",
  },
  {
    id: "source-catloop",
    projectId: "catloop",
    title: "Proyecto CatLoop / MutaCat",
    type: "Postulacion / producto",
    location: "Sistema modular sustentable para gatos, conectores 3D, kit base y repuestos",
    status: "Fuente incubadora",
  },
  {
    id: "source-sust",
    projectId: "sustentabilidad",
    title: "Revotrush y Poiesis",
    type: "Antecedentes semilla",
    location: "Proyectos semilla vinculados a sustentabilidad, economia circular y ecodiseno",
    status: "Fuente historica",
  },
];

export const defaultDeliverables = [
  {
    id: "deliverable-cm-roadmap",
    projectId: "consultoria-cm",
    title: "Plan de trabajo Consultoria Consolidacion CM",
    type: "Plan / hoja de ruta",
    version: "v0.1",
    status: "Borrador",
    location: "",
    content:
      "Proyecto desarrollado por Metamorfosis Lab para consolidar CM Banqueteria. Debe ordenar formalizacion, sistema interno, procesos, costos, documentos, permisos y metodologia replicable.",
  },
  {
    id: "deliverable-sistema-cm-mvp",
    projectId: "sistema-cm",
    title: "MVP Sistema Interno CM",
    type: "Arquitectura funcional",
    version: "v0.1",
    status: "En desarrollo",
    location: "",
    content:
      "Modulos base: menu diario, dulces/promos, reservas/despacho, gastos, proveedores, stock, personal, minutas, consultoria, actas, informes y cotizaciones.",
  },
  {
    id: "deliverable-cmexp-brief",
    projectId: "cm-experiencias",
    title: "Brief base CM Experiencias",
    type: "Brief / produccion",
    version: "v0.1",
    status: "En diseno",
    location: "",
    content:
      "Experiencia gastronomica, cultural e inmersiva en Laja. Incluye jornada social gratuita y jornada pagada, videos IA, guia historico, menu local, violinista, relato de mitos y aparicion teatral de La Senoraza.",
  },
  {
    id: "deliverable-senoraza-ficha",
    projectId: "dona-senoraza",
    title: "Ficha Dona Senoraza Merch",
    type: "Ficha producto",
    version: "v0.1",
    status: "En diseno",
    location: "",
    content:
      "Linea 100% Metamorfosis. Productos: vela pequena de regalo, vela grande comercializable, caja ilustrada, relato visual y objeto identitario. CM podria recibir 20% por ventas realizadas en local o evento.",
  },
  {
    id: "deliverable-juana-plan",
    projectId: "juana-arco",
    title: "Plan estrategico Juana de Arco",
    type: "Plan comercial",
    version: "v0.1",
    status: "Pendiente",
    location: "",
    content:
      "Despues de cerrar identidad, se requiere plan estrategico, calendario de campanas, validacion de ventas, seguimiento de contenido, metricas y posicionamiento.",
  },
  {
    id: "deliverable-red-pausa",
    projectId: "red-oriente",
    title: "Ficha pausa activa Red Oriente",
    type: "Ficha estrategica",
    version: "v0.1",
    status: "Pausado",
    location: "",
    content:
      "Proyecto compartido con tercero. Mantener como reactivable, sin consumir foco actual. Definir criterios para avanzar sin prisa.",
  },
  {
    id: "deliverable-metodo",
    projectId: "estandarizacion",
    title: "Mapa Metodo Metamorfosis",
    type: "Metodo / producto",
    version: "v0.1",
    status: "En construccion",
    location: "",
    content:
      "Estandarizar el proceso usado en CM, Juana, CatLoop, aji, Revotrush y Poiesis: diagnostico, orden estrategico, gestion, costos, formalizacion, digitalizacion, postulacion, validacion y seguimiento.",
  },
  {
    id: "deliverable-sust",
    projectId: "sustentabilidad",
    title: "Banco sustentabilidad Metamorfosis",
    type: "Banco de argumentos",
    version: "v0.1",
    status: "Pendiente",
    location: "",
    content:
      "Registrar aprendizajes de Revotrush y Poiesis para futuros proyectos semilla, postulaciones, economia circular, ecodiseno y narrativa sustentable.",
  },
  {
    id: "deliverable-concriterio-kit",
    projectId: "concriterio-minimo",
    title: "Kit inicial ConCriterio",
    type: "Oferta comercial",
    version: "v0.1",
    status: "Pendiente",
    location: "",
    content:
      "Oferta minima: talleres Sistema penal, carcel y prevencion; Seguridad con evidencia; Comunicacion, conflicto y convivencia; Mapa Inicial; Acompanamiento Estrategico mensual.",
  },
  {
    id: "deliverable-magister-control",
    projectId: "magister-uba",
    title: "Tablero Magister UBA",
    type: "Control academico",
    version: "v0.1",
    status: "Pendiente",
    location: "",
    content:
      "Separar programa general, cursos, trabajos, tesis y seminarios. Mantener calendario, entregas y requisitos visibles.",
  },
  {
    id: "deliverable-tesis",
    projectId: "tesis-uba",
    title: "Proyecto tesis UBA",
    type: "Investigacion",
    version: "v0.1",
    status: "En formulacion",
    location: "",
    content:
      "Tema: conflictos penitenciarios y justicia restaurativa en Chile. Foco: ejecucion penal, respuesta disciplinaria, violencia institucional, interculturalidad y condiciones normativas/institucionales/comunitarias.",
  },
  {
    id: "deliverable-seminario",
    projectId: "seminario-paz",
    title: "Banco de insumos Seminario de Paz",
    type: "Insumos academicos",
    version: "v0.1",
    status: "Activo",
    location: "",
    content:
      "Registrar ideas del seminario que sirven a la tesis: conflicto como relacion danada, palabra, sancion, violencia, vinculos, paz, interser y enfoque restaurativo.",
  },
  {
    id: "deliverable-catloop",
    projectId: "catloop",
    title: "Carpeta viva CatLoop",
    type: "Postulacion / producto",
    version: "v0.1",
    status: "Incubadora",
    location: "",
    content:
      "Proyecto modular para gatos, 50/50 Francisca-Benjamin. Mantener narrativa, MVP, vision ano 2, conectores 3D, modelo circular y posibles cartas de apoyo.",
  },
  {
    id: "deliverable-aji",
    projectId: "aji",
    title: "Criterio de activacion Aji",
    type: "Filtro de oportunidad",
    version: "v0.1",
    status: "Pausado",
    location: "",
    content:
      "Activar solo si sirve a CM Experiencias como insumo, degustacion, relato territorial, producto de regalo o futura postulacion. No consumir foco antes de validar la experiencia.",
  },
];

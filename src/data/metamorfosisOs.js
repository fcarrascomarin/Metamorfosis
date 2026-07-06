export const osPlatforms = [
  {
    id: "matriz",
    name: "Matriz",
    role: "Identidad, modelo, gobernanza y método de Metamorfosis Lab.",
  },
  {
    id: "servicios",
    name: "Servicios",
    role: "Mapa de Transformación, proyectos Base/Forma/Activo y soporte acotado.",
  },
  {
    id: "casos",
    name: "Casos y unidades",
    role: "CM, CM Experiencias y proyectos demostrativos o participados.",
  },
  {
    id: "pausados",
    name: "Pausados",
    role: "Proyectos propios que no deben distraer la validación principal.",
  },
];

export const osProjects = [
  {
    id: "metamorfosis-lab",
    platform: "matriz",
    title: "Metamorfosis Lab",
    owner: "Francisca 90% / Benjamín 10%",
    type: "Matriz",
    priority: "Fundacional",
    status: "En constitución operativa",
    due: "Julio 2026",
    summary:
      "Laboratorio de transformación aplicada que convierte valor informal en sistema, evidencia, activos y proyección.",
    nextStep:
      "Mantener una sola arquitectura de identidad, economía y operación; formalizar gobernanza mínima y ordenar sistema interno.",
    risk:
      "Volver a dispersarse en proyectos, narrativa o acompañamientos abiertos sin caja, evidencia ni método repetible.",
    deliverable:
      "Documento maestro, sistema interno, discurso comercial, acuerdos mínimos y tablero de caja/evidencia.",
  },
  {
    id: "mapa-transformacion",
    platform: "servicios",
    title: "Mapa de Transformación y Activos",
    owner: "Metamorfosis Lab",
    type: "Producto central",
    priority: "Prioridad máxima",
    status: "Diseño v1",
    due: "30 días",
    summary:
      "Diagnóstico pagado que revisa identidad, operación, caja, datos, circularidad, activos intangibles, riesgos y ruta.",
    nextStep:
      "Convertir la estructura del documento maestro en una plantilla real de trabajo y vender el primer Mapa pagado.",
    risk:
      "Regalar diagnóstico estratégico en conversaciones largas o ejecutar sin haber cobrado la lectura inicial.",
    deliverable:
      "Plantilla de Mapa Inicial y Mapa Completo con preguntas, criterios, salida comercial e indicadores.",
  },
  {
    id: "consultoria-cm",
    platform: "casos",
    title: "Consultoría Consolidación CM",
    owner: "Metamorfosis Lab",
    type: "Caso activo",
    priority: "Prioridad máxima",
    status: "Activo",
    due: "90 días",
    summary:
      "Servicio que Metamorfosis presta a CM para crear sistema interno, identidad, web, logística, documentos y medición.",
    nextStep:
      "Levantar línea base, registrar medidas antes/después y cerrar entregables de sistema interno, web, logística y documentación.",
    risk:
      "Confundir consultoría a CM con CM Experiencias o convertir el caso piloto en un proceso infinito sin indicadores.",
    deliverable:
      "Caso demostrativo con evidencia, métricas, documentos, activos identificados y narrativa comercial.",
  },
  {
    id: "cm-experiencias",
    platform: "casos",
    title: "CM Experiencias",
    owner: "CM 50% / Metamorfosis 40% / Martín 10%",
    type: "Unidad compartida",
    priority: "Alta, pero secuenciada",
    status: "En diseño",
    due: "Después de ordenar base CM",
    summary:
      "Unidad para experiencias y activos derivados desde CM. Doña Señoraza queda integrada dentro de esta unidad.",
    nextStep:
      "Separar acuerdos, propiedad de activos, reparto, permisos, costos y rol de Doña Señoraza antes de activar comercialmente.",
    risk:
      "Activar experiencias sin acuerdo escrito o mezclar ingresos, propiedad y responsabilidades con la consultoría base.",
    deliverable:
      "Acuerdo CM Experiencias, ficha de activos, presupuesto piloto y criterios de activación.",
  },
  {
    id: "panel-interno",
    platform: "matriz",
    title: "Panel Interno Metamorfosis",
    owner: "Metamorfosis Lab",
    type: "Sistema propio",
    priority: "Alta",
    status: "MVP",
    due: "Inmediato",
    summary:
      "Herramienta interna para registrar proyectos, medidas, documentos, activos, bitácora, estadísticas y respaldos.",
    nextStep:
      "Usarlo como repositorio único de medidas iniciales y subsiguientes, documentos, decisiones y evidencia.",
    risk:
      "Que la información siga dispersa en chats, carpetas, memoria o archivos sin trazabilidad.",
    deliverable:
      "Panel funcional con localStorage, exportación/importación JSON y estructura preparada para base de datos futura.",
  },
  {
    id: "poiesis",
    platform: "pausados",
    title: "Poiesis",
    owner: "Metamorfosis Lab",
    type: "Proyecto propio pausado",
    priority: "Pausa estratégica",
    status: "Pausado",
    due: "Sin activar",
    summary:
      "Proyecto propio de Metamorfosis que puede crecer hacia creación, pensamiento, cultura o metodología.",
    nextStep:
      "Mantener registrado, sin abrir frente operativo hasta validar Mapa, CM, caja y panel interno.",
    risk:
      "Abrir una nueva línea por entusiasmo antes de tener evidencia comercial y operación estable.",
    deliverable:
      "Ficha de pausa, criterios de activación y banco de ideas protegido.",
  },
  {
    id: "catloop",
    platform: "pausados",
    title: "CatLoop / MutaCat",
    owner: "Metamorfosis Lab",
    type: "Producto propio en incubación",
    priority: "Pausado útil",
    status: "Incubadora",
    due: "Solo si no compite",
    summary:
      "Producto modular felino con potencial de innovación, circularidad y fabricación. No debe competir con el foco actual.",
    nextStep:
      "Mantener carpeta de activos y reactivar solo con oportunidad concreta, fondo o aliado que no consuma foco principal.",
    risk:
      "Distraer energía de CM, el Mapa y la validación comercial de Metamorfosis.",
    deliverable:
      "Ficha de oportunidad, activos técnicos y criterios de reactivación.",
  },
];

export const defaultMeasures = [
  {
    id: "measure-cm-reservas",
    projectId: "consultoria-cm",
    title: "Tiempo de gestión de reservas",
    dimension: "Operación",
    unit: "horas/semana",
    baseline: 8,
    current: 8,
    target: 4,
    direction: "down",
    date: "2026-07-06",
    notes: "Medida inicial referencial. Debe ajustarse con observación real de la administradora.",
  },
  {
    id: "measure-cm-docs",
    projectId: "consultoria-cm",
    title: "Documentos operativos estandarizados",
    dimension: "Documentos",
    unit: "documentos",
    baseline: 0,
    current: 4,
    target: 12,
    direction: "up",
    date: "2026-07-06",
    notes: "Incluye checklist, actas, registros, proveedores y formatos de control.",
  },
  {
    id: "measure-mapa-version",
    projectId: "mapa-transformacion",
    title: "Avance de plantilla del Mapa",
    dimension: "Método",
    unit: "%",
    baseline: 10,
    current: 35,
    target: 100,
    direction: "up",
    date: "2026-07-06",
    notes: "Debe convertirse en herramienta vendible, no solo idea conceptual.",
  },
];

export const defaultDocuments = [
  {
    id: "doc-maestro",
    projectId: "metamorfosis-lab",
    title: "Documento Maestro Metamorfosis 2026",
    category: "Estrategia",
    status: "Base vigente",
    date: "2026-07-06",
    location: "PDF maestro generado en la conversación",
    notes: "Identidad, economía, operación, mapa, gobernanza, CM, CM Experiencias, Poiesis y ruta.",
  },
  {
    id: "doc-cm-base",
    projectId: "consultoria-cm",
    title: "Antecedentes Consultoría Consolidación CM",
    category: "Caso",
    status: "En construcción",
    date: "2026-07-06",
    location: "Panel CM / documentos internos / minutas",
    notes: "Debe concentrar línea base, entregables, sistemas y mediciones de antes/después.",
  },
];

export const defaultAssets = [
  {
    id: "asset-mapa",
    projectId: "mapa-transformacion",
    title: "Mapa de Transformación y Activos",
    type: "Método",
    status: "Por proteger",
    owner: "Metamorfosis Lab",
    notes: "Activo metodológico central. Debe documentarse, nombrarse y usarse de forma consistente.",
  },
  {
    id: "asset-dona",
    projectId: "cm-experiencias",
    title: "Doña Señoraza",
    type: "Activo derivado",
    status: "Integrado en CM Experiencias",
    owner: "CM Experiencias",
    notes: "No se presenta como línea independiente de Metamorfosis. Requiere acuerdo de uso y explotación.",
  },
];

export const defaultLogEntries = [
  {
    id: "log-01",
    projectId: "metamorfosis-lab",
    date: "2026-07-06",
    title: "Nueva tesis de negocio",
    note:
      "Metamorfosis se define como laboratorio de transformación aplicada que institucionaliza lo informal.",
    author: "Benjamín / Socio IA",
  },
  {
    id: "log-02",
    projectId: "consultoria-cm",
    date: "2026-07-06",
    title: "CM debe convertirse en caso medible",
    note:
      "La consultoría debe registrar antes/después: reservas, documentos, proveedores, stock, web, identidad, datos y activos.",
    author: "Benjamín / Socio IA",
  },
];

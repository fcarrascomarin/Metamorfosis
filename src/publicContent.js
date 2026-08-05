export const publicNavigation = [
  { id: 'jardin', label: 'El jardín' },
  { id: 'capacidades', label: 'Capacidades' },
  { id: 'mapa', label: 'Método' },
  { id: 'proyectos', label: 'Casos' },
  { id: 'contacto', label: 'Contacto' }
];

export const gardenPrinciples = [
  { icon: 'visibility', title: 'Observar antes de intervenir', text: 'La comprensión precede a la solución.' },
  { icon: 'eco', title: 'Cultivar antes que sustituir', text: 'Conservamos aquello que merece permanecer.' },
  { icon: 'science', title: 'Experimentar con propósito', text: 'Cada prueba debe responder una pregunta.' },
  { icon: 'query_stats', title: 'Medir para aprender', text: 'La transformación debe dejar evidencia y capacidad.' }
];

export const publicCapabilities = [
  {
    icon: 'campaign',
    title: 'Mercado, marca y comercialización',
    text: 'Investigación, públicos, propuesta de valor, posicionamiento, oferta, precio, canales, comunicación y experiencia de compra.',
    principle: 'Comprender antes de promocionar.'
  },
  {
    icon: 'accessibility_new',
    title: 'Ergonomía y diseño sostenible del trabajo',
    text: 'Tareas, posturas, cargas, repetitividad, puestos, herramientas, iluminación, ruido, organización y participación de quienes realizan el trabajo.',
    principle: 'Rediseñar el sistema antes de responsabilizar a la persona.'
  },
  {
    icon: 'account_tree',
    title: 'Operación, documentación e indicadores',
    text: 'Procesos, roles, registros, hitos, evidencia, costos, tiempos y rutinas para sostener decisiones y aprender de cada proyecto.',
    principle: 'Lo que no se registra no puede mejorarse.'
  },
  {
    icon: 'devices',
    title: 'Sistemas y presencia digital',
    text: 'Web pública, plataformas internas y automatizaciones diseñadas desde una necesidad operativa real, no desde la novedad tecnológica.',
    principle: 'La tecnología entra cuando mejora una capacidad.'
  }
];

export const publicCases = [
  {
    id: 'juana-de-arco',
    brand: 'juana',
    label: 'Caso de marca y comercialización',
    name: 'Juana de Arco',
    text: 'Una colección de joyas de plata con una identidad poderosa, pero presentada como un producto genérico. Desarrollamos su posicionamiento, relato, packaging, catálogo digital y experiencia de compra.',
    tags: ['Estrategia de marca', 'Propuesta de valor', 'Packaging', 'E-commerce'],
    quote: 'No es solamente una joya. Es un símbolo.',
    featured: true
  },
  {
    id: 'cm-banqueteria',
    brand: 'cm',
    label: 'Caso vivo de consolidación',
    name: 'CM Banquetería & Restaurant',
    text: 'Operación, regularización, documentación, condiciones de trabajo, web pública y sistema interno construidos desde necesidades reales.',
    tags: ['Consolidación', 'Operación', 'Documentación', 'Sistema interno']
  },
  {
    id: 'metamorfosis-os',
    brand: 'metamorfosis',
    label: 'Capacidad propia',
    name: 'Metamorfosis OS',
    text: 'Una plataforma privada para proyectos, decisiones, documentos, tiempos, costos e indicadores. El conocimiento generado no se pierde.',
    tags: ['Sistema operativo', 'Indicadores', 'Rentabilidad', 'Memoria de proyecto'],
    action: 'Ingresar al sistema interno'
  }
];

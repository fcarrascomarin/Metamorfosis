import Reveal from "./Reveal.jsx";

const casos = [
  {
    nombre: "Joyas Juana de Arco",
    bajada: "De una colección de joyas a una experiencia simbólica de compra.",
    texto: "Desarrollo de una tienda digital para una marca de joyas de plata con identidad propia, catálogo organizado, categorías de productos, carrito de compra y contacto directo por WhatsApp. El proyecto no se construyó solo desde la venta, sino desde el valor simbólico de cada pieza: amuletos, colecciones temáticas y una experiencia orientada a que cada persona encuentre una joya con sentido.",
    tags: "E-commerce · Marca · Catálogo · Contenido · WhatsApp",
    destacado: true,
  },
  {
    nombre: "Con Criterio",
    bajada: "De una idea profesional a una plataforma de análisis, servicios y conversación pública.",
    texto: "Creación de una plataforma digital orientada a comunicar un proyecto de análisis, formación y servicios profesionales vinculados a seguridad, sistema penal, políticas públicas y discusión pública. El desafío fue transformar conocimiento especializado en una propuesta clara, navegable y comprensible para distintos públicos.",
    tags: "Institucional · Servicios · Contenido · Estrategia · Análisis",
  },
  {
    nombre: "Red Oriente",
    bajada: "De una consultoría especializada a una presencia digital clara y confiable.",
    texto: "Desarrollo de una página web para una consultora orientada a servicios comerciales, estratégicos y de conexión entre negocios. El foco estuvo en construir una presencia sobria, profesional y directa, capaz de transmitir confianza desde el primer contacto y ordenar la oferta.",
    tags: "Consultoría · Web corporativa · Servicios · Confianza · Negocios",
  },
];

export default function CasosTransformacion() {
  return (
    <section id="casos" className="section section-dark cases-section">
      <Reveal direction="left">
        <div className="section-heading narrow">
          <p className="eyebrow">Casos de transformación</p>
          <h2>No solo hacemos páginas web: ordenamos ideas para convertirlas en presencia digital concreta.</h2>
          <p>
            Cada proyecto nace con una pregunta distinta: cómo vender mejor, cómo comunicar una idea compleja, cómo construir confianza o cómo convertir un servicio en una presencia digital clara.
          </p>
        </div>
      </Reveal>

      <Reveal direction="right" delay={160}>
        <article className="case-card featured-case">
          <div className="case-visual jewelry">J</div>
          <div>
            <p className="case-label">Proyecto destacado</p>
            <h3>{casos[0].nombre}</h3>
            <h4>{casos[0].bajada}</h4>
            <p>{casos[0].texto}</p>
            <span>{casos[0].tags}</span>
          </div>
        </article>
      </Reveal>

      <div className="case-grid two-columns">
        {casos.slice(1).map((caso, index) => (
          <Reveal key={caso.nombre} direction={index === 0 ? "left" : "right"} delay={index * 160}>
            <article className="case-card">
              <div className="case-visual small">{caso.nombre.charAt(0)}</div>
              <h3>{caso.nombre}</h3>
              <h4>{caso.bajada}</h4>
              <p>{caso.texto}</p>
              <span>{caso.tags}</span>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal direction="up" delay={150}>
        <div className="section-remate">
          <p>
            Estos proyectos muestran distintas formas de trabajo, pero comparten una misma lógica: tomar una idea, ordenar su valor, construir una identidad clara y convertirla en una herramienta digital útil, atractiva y proyectable.
          </p>
          <a className="btn btn-primary" href="#contacto">Quiero transformar mi proyecto</a>
        </div>
      </Reveal>
    </section>
  );
}

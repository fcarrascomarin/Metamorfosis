import Reveal from "./Reveal.jsx";

const casos = [
  {
    nombre: "Joyas Juana de Arco",
    bajada: "De una colección de joyas a una experiencia simbólica de compra.",
    texto:
      "Desarrollo de una tienda digital para una marca de joyas de plata con identidad propia, catálogo organizado, categorías de productos, carrito de compra y contacto directo por WhatsApp. El proyecto no se construyó solo desde la venta, sino desde el valor simbólico de cada pieza: amuletos, colecciones temáticas y una experiencia orientada a que cada persona encuentre una joya con sentido.",
    tags: "E-commerce · Marca · Catálogo · Contenido · WhatsApp",
    imagen: "./public/joyas.png",
    url: "https://www.joyasjuanadearco.cl",
    destacado: true,
  },
  {
    nombre: "Con Criterio",
    bajada:
      "De una idea profesional a una plataforma de análisis, servicios y conversación pública.",
    texto:
      "Creación de una plataforma digital orientada a comunicar un proyecto de análisis, formación y servicios profesionales vinculados a seguridad, sistema penal, políticas públicas y discusión pública. El desafío fue transformar conocimiento especializado en una propuesta clara, navegable y comprensible para distintos públicos.",
    tags: "Institucional · Servicios · Contenido · Estrategia · Análisis",
    imagen: "./public/concriterio.png",
    url: "https://www.concriterio.cl",
  },
  {
    nombre: "Red Oriente",
    bajada:
      "De una consultoría especializada a una presencia digital clara y confiable.",
    texto:
      "Desarrollo de una página web para una consultora orientada a servicios comerciales, estratégicos y de conexión entre negocios. El foco estuvo en construir una presencia sobria, profesional y directa, capaz de transmitir confianza desde el primer contacto y ordenar la oferta.",
    tags: "Consultoría · Web corporativa · Servicios · Confianza · Negocios",
    imagen: "./public/redoriente.png",
    url: "https://www.redoriente.cl",
  },
  {
    nombre: "SERVIMAK SpA",
    bajada:
      "Proyecto de servicios industriales con presencia digital que permita demostración de la trayectoria y profesionalismo de Servimak SpA.",
    texto:
      "Desarrollo de una página web para una consultora orientada a servicios comerciales, estratégicos y de conexión entre negocios. El foco estuvo en construir una presencia sobria, profesional y directa, capaz de transmitir confianza desde el primer contacto y ordenar la oferta.",
    tags: "Consultoría · Web corporativa · Servicios · Confianza · Negocios",
    imagen: "./public/servimak.png",
    url: "https://www.servimakspa.cl",
  },
];

export default function CasosTransformacion() {
  const destacado = casos[0];
  const secundarios = casos.slice(1);

  return (
    <section id="casos" className="casos-section">
      <Reveal>
        <div className="section-header centered">
          <span className="eyebrow">Casos de transformación</span>
          <h2>
            No solo hacemos páginas web: ordenamos ideas para convertirlas en
            presencia digital concreta.
          </h2>
          <p>
            Cada proyecto nace con una pregunta distinta: cómo vender mejor,
            cómo comunicar una idea compleja, cómo construir confianza o cómo
            convertir un servicio en una presencia digital clara.
          </p>
        </div>
      </Reveal>

      <Reveal direction="left">
        <article className="case-card case-card-featured">
          <a
            className="case-image-link"
            href={destacado.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visitar ${destacado.nombre}`}
          >
            <img
              src={destacado.imagen}
              alt={`Miniatura del sitio web ${destacado.nombre}`}
              className="case-image"
            />
          </a>

          <div className="case-content">
            <span className="case-label">Proyecto destacado</span>
            <h3>{destacado.nombre}</h3>
            <h4>{destacado.bajada}</h4>
            <p>{destacado.texto}</p>
            <strong>{destacado.tags}</strong>

            <a
              href={destacado.url}
              target="_blank"
              rel="noopener noreferrer"
              className="case-link"
            >
              Ver sitio web →
            </a>
          </div>
        </article>
      </Reveal>

      <div className="case-grid">
        {secundarios.map((caso, index) => (
          <Reveal key={caso.nombre} direction={index % 2 === 0 ? "left" : "right"}>
            <article className="case-card">
              <a
                className="case-image-link"
                href={caso.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${caso.nombre}`}
              >
                <img
                  src={caso.imagen}
                  alt={`Miniatura del sitio web ${caso.nombre}`}
                  className="case-image"
                />
              </a>

              <div className="case-content">
                <h3>{caso.nombre}</h3>
                <h4>{caso.bajada}</h4>
                <p>{caso.texto}</p>
                <strong>{caso.tags}</strong>

                <a
                  href={caso.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-link"
                >
                  Ver sitio web →
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="case-closing">
          <p>
            Estos proyectos muestran distintas formas de trabajo, pero comparten
            una misma lógica: tomar una idea, ordenar su valor, construir una
            identidad clara y convertirla en una herramienta digital útil,
            atractiva y proyectable.
          </p>

          <a href="#contacto" className="primary-button">
            Quiero transformar mi proyecto
          </a>
        </div>
      </Reveal>
    </section>
  );
}

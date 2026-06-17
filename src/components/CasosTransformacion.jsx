import Reveal from "./Reveal.jsx";

const casos = [
  {
    nombre: "Joyas Juana de Arco",
    bajada: "De una colección de joyas a una experiencia simbólica de compra.",
    texto:
      "Desarrollo de una tienda digital para una marca de joyas de plata con identidad propia, catálogo organizado, categorías de productos, carrito de compra y contacto directo por WhatsApp. El proyecto no se construyó solo desde la venta, sino desde el valor simbólico de cada pieza: amuletos, colecciones temáticas y una experiencia orientada a que cada persona encuentre una joya con sentido.",
    tags: "E-commerce · Marca · Catálogo · Contenido · WhatsApp",
    imagen: "/joyas.png",
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
    imagen: "/concriterio.png",
    url: "https://www.concriterio.cl",
  },
  {
    nombre: "Red Oriente",
    bajada:
      "De una consultoría especializada a una presencia digital clara y confiable.",
    texto:
      "Desarrollo de una página web para una consultora orientada a servicios comerciales, estratégicos y de conexión entre negocios. El foco estuvo en construir una presencia sobria, profesional y directa, capaz de transmitir confianza desde el primer contacto y ordenar la oferta.",
    tags: "Consultoría · Web corporativa · Servicios · Confianza · Negocios",
    imagen: "/redoriente.png",
    url: "https://www.redoriente.cl",
  },
  {
    nombre: "Servimak SpA",
    bajada:
      "De un proyecto de servicios industriales a una presencia digital que permita demostrar el profesionalismo de Servimak",
    texto:
      "Implementación de página web para empresa de servicios industriales para potenciar su conexión con clientes. Mediante la demostración de trayectoria y profesionalismo del trabajo desarrollado por Servimak.",
    tags: "Consultoría · Web corporativa · Servicios · Negocios",
    imagen: "/servimak.png",
    url: "https://www.servimakspa.cl",
  },
];

export default function CasosTransformacion() {
  const destacado = casos[0];
  const secundarios = casos.slice(1);

  return (
    <section id="casos" className="section section-dark cases-section">
      <Reveal>
        <div className="section-heading narrow">
          <p className="eyebrow">Casos de transformación</p>
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
        <article className="case-card featured-case">
          <a
            href={destacado.url}
            target="_blank"
            rel="noopener noreferrer"
            className="case-image-link"
            aria-label={`Visitar ${destacado.nombre}`}
          >
            <img
              src={destacado.imagen}
              alt={`Vista previa del sitio ${destacado.nombre}`}
              className="case-image"
            />
          </a>

          <div>
            <p className="case-label">Proyecto destacado</p>
            <h3>{destacado.nombre}</h3>
            <h4>{destacado.bajada}</h4>
            <p>{destacado.texto}</p>
            <span>{destacado.tags}</span>
          </div>
        </article>
      </Reveal>

      <div className="two-columns">
        {secundarios.map((caso, index) => (
          <Reveal
            key={caso.nombre}
            direction={index % 2 === 0 ? "left" : "right"}
          >
            <article className="case-card">
              <a
                href={caso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="case-image-link"
                aria-label={`Visitar ${caso.nombre}`}
              >
                <img
                  src={caso.imagen}
                  alt={`Vista previa del sitio ${caso.nombre}`}
                  className="case-image case-image-small"
                />
              </a>

              <h3>{caso.nombre}</h3>
              <h4>{caso.bajada}</h4>
              <p>{caso.texto}</p>
              <span>{caso.tags}</span>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="section-remate">
          <p>
            Estos proyectos muestran distintas formas de trabajo, pero comparten
            una misma lógica: tomar una idea, ordenar su valor, construir una
            identidad clara y convertirla en una herramienta digital útil,
            atractiva y proyectable.
          </p>

          <a href="#contacto" className="btn btn-primary">
            Quiero transformar mi proyecto
          </a>
        </div>
      </Reveal>
    </section>
  );
}
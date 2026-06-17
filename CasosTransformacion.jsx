import Reveal from "./Reveal.jsx";
import { transformationCases } from "../data/cases.js";

export default function CasosTransformacion() {
  const featured = transformationCases.find((item) => item.featured) ?? transformationCases[0];
  const secondaryCases = transformationCases.filter((item) => item.name !== featured.name);

  return (
    <section id="casos" className="section section-dark cases-section">
      <Reveal>
        <div className="section-heading narrow centered">
          <p className="eyebrow">Casos de transformación</p>
          <h2>No solo hacemos páginas web: ordenamos ideas para convertirlas en presencia digital concreta.</h2>
          <p>
            Cada proyecto nace con una pregunta distinta: cómo vender mejor, cómo comunicar una idea
            compleja, cómo construir confianza o cómo convertir un servicio en una presencia digital clara.
          </p>
        </div>
      </Reveal>

      <Reveal direction="left">
        <article className="case-card featured-case">
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="case-image-link"
            aria-label={`Visitar sitio web de ${featured.name}`}
          >
            <img src={featured.image} alt={`Miniatura del sitio web ${featured.name}`} className="case-image" />
          </a>

          <div className="case-content">
            <span className="case-label">{featured.eyebrow}</span>
            <h3>{featured.name}</h3>
            <h4>{featured.summary}</h4>
            <p>{featured.description}</p>
            <strong>{featured.tags.join(" · ")}</strong>
            <a href={featured.url} target="_blank" rel="noopener noreferrer" className="case-link">
              Ver sitio web →
            </a>
          </div>
        </article>
      </Reveal>

      <div className="case-grid">
        {secondaryCases.map((item, index) => (
          <Reveal key={item.name} direction={index % 2 === 0 ? "left" : "right"}>
            <article className="case-card">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="case-image-link"
                aria-label={`Visitar sitio web de ${item.name}`}
              >
                <img src={item.image} alt={`Miniatura del sitio web ${item.name}`} className="case-image case-image-small" />
              </a>

              <div className="case-content">
                <h3>{item.name}</h3>
                <h4>{item.summary}</h4>
                <p>{item.description}</p>
                <strong>{item.tags.join(" · ")}</strong>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="case-link">
                  Ver sitio web →
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="section-remate">
          <p>
            Estos proyectos muestran distintas formas de trabajo, pero comparten una misma lógica:
            tomar una idea, ordenar su valor, construir una identidad clara y convertirla en una
            herramienta digital útil, atractiva y proyectable.
          </p>
          <a href="#contacto" className="btn btn-primary">
            Quiero transformar mi proyecto
          </a>
        </div>
      </Reveal>
    </section>
  );
}

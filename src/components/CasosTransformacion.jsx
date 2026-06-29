import React from "react";
import Reveal from "./Reveal.jsx";
import { transformationCases } from "../data/cases.js";

function CaseCard({ item, featured = false }) {
  const isExternal = item.url.startsWith("http");

  return (
    <article className={featured ? "case-card featured-case" : "case-card"}>
      <a
        href={item.url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="case-visual-link"
        aria-label={isExternal ? `Visitar sitio web de ${item.name}` : `Ir a contacto por ${item.name}`}
      >
        <span className="case-browser-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>

        <span className="case-visual-stage">
          <img src={item.image} alt={`Pantallazo del sitio web ${item.name}`} className="case-screen-image" />
          <span className="case-brand-panel">
            <img src={item.logo} alt={`Marca ${item.name}`} className="case-logo-image" />
          </span>
        </span>
      </a>

      <div className="case-content">
        {item.eyebrow ? <span className="case-label">{item.eyebrow}</span> : null}
        <h3>{item.name}</h3>
        <h4>{item.summary}</h4>
        <p>{item.description}</p>
        <strong>{item.tags.join(" · ")}</strong>
        <a
          href={item.url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="case-link"
        >
          {isExternal ? "Ver sitio web" : "Consultar linea"}
        </a>
      </div>
    </article>
  );
}

export default function CasosTransformacion() {
  const featured = transformationCases.find((item) => item.featured) ?? transformationCases[0];
  const secondaryCases = transformationCases.filter((item) => item.name !== featured.name);

  return (
    <section id="casos" className="section section-dark cases-section">
      <Reveal>
        <div className="section-heading narrow centered">
          <p className="eyebrow">Casos y entregables</p>
          <h2>CM se desarrolla dentro de Metamorfosis Lab, no como proyecto aislado.</h2>
          <p>
            La consultoría de consolidación CM es el proyecto activo prioritario. Desde ahí nacen
            el sistema interno, el producto pyme estandarizable y nuevas capacidades comerciales.
          </p>
        </div>
      </Reveal>

      <Reveal direction="left">
        <CaseCard item={featured} featured />
      </Reveal>

      <div className="cases-list">
        {secondaryCases.map((item, index) => (
          <Reveal key={item.name} direction={index % 2 === 0 ? "left" : "right"}>
            <CaseCard item={item} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="section-remate">
          <p>
            Cada caso muestra una capacidad distinta, pero todos responden a la misma base:
            diagnosticar, ordenar, diseñar, implementar y convertir aprendizajes en herramientas
            útiles para negocios reales.
          </p>
          <a href="#contacto" className="btn btn-primary">
            Quiero transformar mi proyecto
          </a>
        </div>
      </Reveal>
    </section>
  );
}

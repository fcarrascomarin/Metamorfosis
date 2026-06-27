import React from "react";
import Reveal from "./Reveal.jsx";
import { transformationCases } from "../data/cases.js";

function CaseCard({ item, featured = false }) {
  return (
    <article className={featured ? "case-card featured-case" : "case-card"}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="case-visual-link"
        aria-label={`Visitar sitio web de ${item.name}`}
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
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="case-link">
          Ver sitio web
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
          <p className="eyebrow">Casos de transformación</p>
          <h2>No solo hacemos páginas web: ordenamos ideas para convertirlas en presencia digital concreta.</h2>
          <p>
            Cada proyecto nace con una pregunta distinta: cómo vender mejor, cómo comunicar una idea
            compleja, cómo construir confianza o cómo convertir un servicio en una presencia digital clara.
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

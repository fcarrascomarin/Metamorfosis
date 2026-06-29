import React from "react";
import Reveal from "./Reveal.jsx";
import { transformationCases } from "../data/cases.js";

function CaseCard({ item, compact = false }) {
  const isExternal = item.url.startsWith("http");

  if (compact) {
    return (
      <a
        href={item.url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="case-mini-card case-mini-card-detailed"
      >
        <img src={item.logo} alt={`Marca ${item.name}`} />
        <strong>{item.name}</strong>
        <span>{item.tags.slice(0, 3).join(" · ")}</span>
      </a>
    );
  }

  return (
    <article className="case-card">
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

export default function CasosTransformacion({ compact = false }) {
  const items = compact ? transformationCases.slice(0, 4) : transformationCases;

  const content = (
    <>
      <Reveal>
        <div className={`section-heading ${compact ? "split-heading" : "narrow centered"}`}>
          <p className="eyebrow">Casos de transformación</p>
          <h2>{compact ? "Capacidades aplicadas" : "Metamorfosis Laboratorio de Innovación"}</h2>
          <p>
            La consultoría de consolidación tiene como objetivo proyectar mejoras en las brechas operacionales que permitan estandarizar y mejorar las capacidades comerciales de empresas.
          </p>
        </div>
      </Reveal>

      {compact ? (
        <div className="case-mini-grid case-mini-grid-compact">
          {items.map((item, index) => (
            <Reveal key={item.name} direction={index % 2 === 0 ? "left" : "right"}>
              <CaseCard item={item} compact />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="cases-list">
          {items.map((item, index) => (
            <Reveal key={item.name} direction={index % 2 === 0 ? "left" : "right"}>
              <CaseCard item={item} />
            </Reveal>
          ))}
        </div>
      )}

      {!compact ? (
        <Reveal>
          <div className="section-remate">
            <p>
              Cada caso muestra una necesidad distinta, pero todos se vinculan en lo mismo: falta de herramientas actualizadas que faciliten las decisiones empresariales.
            </p>
            <a href="#contacto" className="btn btn-primary">
              Quiero transformar mi proyecto
            </a>
          </div>
        </Reveal>
      ) : null}
    </>
  );

  if (compact) {
    return <div className="split-column">{content}</div>;
  }

  return (
    <section className="section section-dark cases-section">
      {content}
    </section>
  );
}

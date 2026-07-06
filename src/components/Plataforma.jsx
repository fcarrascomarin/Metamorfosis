import React from "react";
import Reveal from "./Reveal.jsx";
import { platformLines } from "../data/cases.js";

export default function Plataforma({ compact = false }) {
  const content = (
    <>
      <Reveal>
        <div className={`section-heading ${compact ? "split-heading" : "centered narrow"}`}>
          <p className="eyebrow dark">Plataforma de proyectos</p>
          <h2>
            {compact
              ? "Proyectos y líneas activas"
              : "El Mapa ordena lo que el negocio ya tiene, pero todavía no puede sostener solo."}
          </h2>
          <p>
            Metamorfosis articula identidad, economía y operación para que cada proyecto pueda
            convertirse en sistema, evidencia, activo y decisión. No partimos por vender piezas:
            partimos por leer qué valor existe y qué necesita forma.
          </p>
        </div>
      </Reveal>

      <div className={compact ? "platform-grid platform-grid-compact" : "platform-grid"}>
        {platformLines.map((item, index) => (
          <Reveal key={item.name} direction={index % 2 === 0 ? "left" : "right"}>
            <article className={item.priority ? "platform-card platform-card-priority" : "platform-card"}>
              <div>
                <span className="platform-status">{item.status}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
              <strong>{item.type}</strong>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );

  if (compact) {
    return <div className="split-column">{content}</div>;
  }

  return (
    <section id="plataforma" className="section section-platform">
      {content}
    </section>
  );
}

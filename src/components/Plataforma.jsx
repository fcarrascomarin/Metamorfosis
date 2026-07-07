import React from "react";
import Reveal from "./Reveal.jsx";
import { platformLines } from "../data/cases.js";

export default function Plataforma({ compact = false }) {
  const content = (
    <>
      <Reveal>
        <div className={`section-heading ${compact ? "split-heading" : "centered narrow"}`}>
          <p className="eyebrow dark">Servicios</p>
          <h2>
            {compact
              ? "Servicios digitales"
              : "Una web puede ser vitrina, sistema y punto de partida para ordenar el negocio."}
          </h2>
          <p>
            Metamorfosis Lab ayuda a empresas, pymes y proyectos a pasar de ideas dispersas a
            herramientas digitales concretas: paginas claras, sistemas internos, contenido ordenado
            y canales de contacto que funcionan.
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

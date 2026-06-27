import React from "react";
import Reveal from "./Reveal.jsx";
import { trajectoryItems } from "../data/cases.js";

export default function Trayectoria() {
  return (
    <section id="trayectoria" className="section section-light">
      <Reveal>
        <div className="section-heading">
          <p className="eyebrow dark">Innovación aplicada y trayectoria</p>
          <h2>Empresas y proyectos trabajados.</h2>
          <p>
            Nuestra trayectoria muestra capacidades distintas: marca, relato, catálogo, autoridad,
            confianza profesional, canales de contacto y comunicación comercial.
          </p>
        </div>
      </Reveal>

      <div className="trajectory-grid">
        {trajectoryItems.map((item, index) => (
          <Reveal key={item.company} direction={index % 2 === 0 ? "left" : "right"}>
            <article className="trajectory-card">
              <span>Proyecto</span>
              <h3>{item.company}</h3>
              <ul>
                {item.projects.map((project) => (
                  <li key={project}>{project}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

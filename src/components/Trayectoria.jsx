import React from "react";
import Reveal from "./Reveal.jsx";
import { trajectoryItems } from "../data/cases.js";

export default function Trayectoria() {
  return (
    <section id="trayectoria" className="section section-light">
      <Reveal>
        <div className="section-heading">
          <p className="eyebrow dark">Proceso</p>
          <h2>Una ruta simple para transformar una empresa en una presencia digital coherente.</h2>
          <p>
            El trabajo no parte por llenar una pagina. Parte por entender que debe saber el cliente,
            que debe administrar la empresa y que informacion conviene mantener dentro del equipo.
          </p>
        </div>
      </Reveal>

      <div className="trajectory-map">
        <Reveal className="trajectory-slot trajectory-slot-core">
          <article className="trajectory-core">
            <span>Metamorfosis Lab</span>
            <h3>De idea a sistema</h3>
            <p>
              Unimos estrategia, diseno y tecnologia para que la empresa tenga una vitrina publica
              clara y, cuando corresponde, una herramienta interna para administrar mejor.
            </p>
          </article>
        </Reveal>

        {trajectoryItems.map((item, index) => (
          <Reveal
            key={item.company}
            direction={index % 2 === 0 ? "left" : "right"}
            className={`trajectory-slot trajectory-slot-${index + 1}`}
          >
            <article className="trajectory-card">
              <span>Etapa</span>
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

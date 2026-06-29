import React from "react";
import Reveal from "./Reveal.jsx";
import { platformLines } from "../data/cases.js";

export default function Plataforma() {
  return (
    <section id="plataforma" className="section section-platform">
      <Reveal>
        <div className="section-heading centered narrow">
          <p className="eyebrow dark">Plataforma de proyectos</p>
          <h2>Metamorfosis Lab organiza proyectos, productos y experiencias bajo una misma arquitectura.</h2>
          <p>
            CM Banquetería es hoy el caso activo principal: desde ahí desarrollamos consultoría,
            herramientas internas, aprendizajes replicables y nuevas líneas comerciales con identidad territorial.
          </p>
        </div>
      </Reveal>

      <div className="platform-grid">
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
    </section>
  );
}

import React from "react";
import Reveal from "./Reveal.jsx";
import { trajectoryItems } from "../data/cases.js";

export default function Trayectoria() {
  return (
    <section id="trayectoria" className="section section-light">
      <Reveal>
        <div className="section-heading">
          <p className="eyebrow dark">Lineas de desarrollo</p>
          <h2>La empresa se consolida desde una plataforma comun.</h2>
          <p>
            Metamorfosis Lab articula consultoría, sistema interno, producto pyme, merchandising
            territorial y diseño de experiencias sin separar artificialmente lo que nace de una misma metodología.
          </p>
        </div>
      </Reveal>

      <div className="trajectory-map">
        <Reveal className="trajectory-slot trajectory-slot-core">
          <article className="trajectory-core">
            <span>Metamorfosis Lab</span>
            <h3>Plataforma principal</h3>
            <p>
              Diagnóstico, estrategia, identidad, herramientas digitales y experiencias conectadas
              en una sola arquitectura de trabajo.
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

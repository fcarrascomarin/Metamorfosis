import React from "react";
import Reveal from "./Reveal.jsx";
import { transformationCases } from "../data/cases.js";

const news = [
    {
    date: "Método",
    title: "Del diagnóstico al sistema",
    text: "Ofrecemos servicios de ingeniería e innovación basados en tus necesidades.",
  },
  {
    date: "Proyección",
    title: "Producto pyme estandarizable",
    text: "El aprendizaje con CM permite diseñar una metodología replicable para ordenar y digitalizar otras pymes.",
  },
];

export default function Noticias() {
  return (
    <section id="noticias" className="section section-light work-hub-section">
      <Reveal>
        <div className="section-heading">
          <p className="eyebrow dark">Ecosistema en movimiento</p>
          <h2>Una plataforma, varias líneas, una misma metodología.</h2>
          <p>
            Metamorfosis Lab integra consultoría, diseño, tecnología, productos territoriales y
            experiencias para transformar negocios reales en sistemas mas claros y proyectables.
          </p>
        </div>
      </Reveal>

      <div className="work-hub-grid">
        <Reveal direction="left">
          <article className="work-panel news-panel">
            <div className="panel-heading">
              <span>Foco actual</span>
              <h3>Consolidación empresarial desde casos reales</h3>
              <p>CM funciona como prioridad máxima y laboratorio aplicado para crear metodología.</p>
            </div>

            <div className="news-stack">
              {news.map((item) => (
                <div className="news-row" key={item.title}>
                  <span>{item.date}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal direction="right">
          <article id="casos" className="work-panel cases-panel">
            <div className="panel-heading">
              <span>Capacidades</span>
              <h3>Transformación aplicada</h3>
              <p>Proyectos reales donde una idea se convirtió en marca, sistema, canal digital o experiencia.</p>
            </div>

            <div className="case-mini-grid">
              {transformationCases.map((item) => (
                <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="case-mini-card">
                  <img src={item.logo} alt={`Marca ${item.name}`} />
                  <strong>{item.name}</strong>
                  <span>{item.tags.slice(0, 2).join(" · ")}</span>
                </a>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

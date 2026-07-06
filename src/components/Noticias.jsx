import React from "react";
import Reveal from "./Reveal.jsx";
import { transformationCases } from "../data/cases.js";

const news = [
  {
    date: "Observar",
    title: "Primero leer el valor real",
    text: "Antes de proponer web, marca o sistema, entendemos qué funciona, qué se improvisa y qué depende de memoria o intuición.",
  },
  {
    date: "Ordenar",
    title: "Convertir informalidad en sistema",
    text: "El Mapa de Transformación y Activos traduce operación, identidad, caja, datos, circularidad y activos intangibles en ruta concreta.",
  },
  {
    date: "Proyectar",
    title: "Dejar capacidad instalada",
    text: "La transformación debe terminar en documentos, indicadores, acuerdos, paneles, activos reconocidos y decisiones sostenibles.",
  },
];

export default function Noticias() {
  return (
    <section id="metodo" className="section section-light work-hub-section">
      <Reveal>
        <div className="section-heading">
          <p className="eyebrow dark">Método</p>
          <h2>Más que asesoría: una herramienta para que el valor sobreviva a la improvisación.</h2>
          <p>
            Trabajamos donde muchas pymes quedan atrapadas: negocios que funcionan, pero todavía
            no tienen suficiente sistema, evidencia, protección o forma para sostener lo que han creado.
          </p>
        </div>
      </Reveal>

      <div className="work-hub-grid">
        <Reveal direction="left">
          <article className="work-panel news-panel">
            <div className="panel-heading">
              <span>Forma de trabajo</span>
              <h3>Observar, ordenar, sistematizar, proteger y proyectar</h3>
              <p>El centro no es entregar piezas sueltas, sino transformar valor informal en operación medible.</p>
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
          <article className="work-panel cases-panel">
            <div className="panel-heading">
              <span>Capacidades</span>
              <h3>Identidad, economía y operación en una sola lectura</h3>
              <p>El método conecta relato, caja, procesos, datos, circularidad y activos intangibles.</p>
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

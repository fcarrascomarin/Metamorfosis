import React from "react";
import Reveal from "./Reveal.jsx";
import { transformationCases } from "../data/cases.js";

const news = [
  {
    date: "01",
    title: "Entendemos el negocio",
    text: "Antes de diseñar, levantamos que vendes, como trabajas, que necesita saber tu cliente y que informacion debe quedar privada.",
  },
  {
    date: "02",
    title: "Ordenamos el mensaje",
    text: "Convertimos servicios, procesos, imagenes y documentos dispersos en una estructura simple para web, contacto y gestion.",
  },
  {
    date: "03",
    title: "Construimos la herramienta",
    text: "Desarrollamos la pagina, formularios, paneles o piezas necesarias para que la empresa pueda mostrar, operar y actualizar mejor.",
  },
];

export default function Noticias() {
  return (
    <section id="metodo" className="section section-light work-hub-section">
      <Reveal>
        <div className="section-heading">
          <p className="eyebrow dark">Metodo</p>
          <h2>Diseñamos presencia digital que se entiende y se puede usar.</h2>
          <p>
            Una buena pagina no solo se ve bien. Debe explicar la empresa, ordenar sus servicios,
            facilitar el contacto y dejar una base clara para seguir creciendo.
          </p>
        </div>
      </Reveal>

      <div className="work-hub-grid">
        <Reveal direction="left">
          <article className="work-panel news-panel">
            <div className="panel-heading">
              <span>Forma de trabajo</span>
              <h3>De la idea dispersa a una herramienta digital clara</h3>
              <p>Trabajamos con una ruta corta: entender, ordenar, diseñar e implementar.</p>
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
              <h3>Web, identidad, contenido y gestion interna</h3>
              <p>Combinamos diseño, estrategia y tecnologia para que la empresa no dependa de explicaciones improvisadas.</p>
            </div>

            <div className="case-mini-grid">
              {transformationCases.map((item) => {
                const isExternal = item.url.startsWith("http");
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="case-mini-card"
                  >
                    <img src={item.logo} alt={`Marca ${item.name}`} />
                    <strong>{item.name}</strong>
                    <span>{item.tags.slice(0, 2).join(" · ")}</span>
                  </a>
                );
              })}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

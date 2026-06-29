import React from "react";

const heroPillars = ["Consultoría", "Diseño", "Tecnología", "Experiencias"];

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <p className="hero-kicker">Consultoría, diseño e innovación aplicada</p>

        <h1 className="hero-title">Transformamos negocios reales en sistemas vivos.</h1>

        <p className="hero-text">
          Metamorfosis Lab ordena proyectos, diseña herramientas digitales y crea experiencias
          para que emprendimientos y pymes pasen de operar por intuición a crecer con método,
          identidad y visión de futuro.
        </p>

        <div className="hero-pills" aria-label="Servicios principales">
          {heroPillars.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="hero-actions">
          <a href="#plataforma" className="btn btn-primary">
            Ver plataforma
          </a>
          <a href="#contacto" className="btn btn-ghost">
            Consolidar mi proyecto
          </a>
        </div>
      </div>
    </section>
  );
}

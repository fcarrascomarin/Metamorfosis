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
          identidad y futuro.
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

      <div className="hero-visual hero-visual-disruptive" aria-label="Idea digital transformándose en sistema">
        <img
          src="/hero-metamorfosis-portal.png"
          alt="Visual conceptual de una idea convirtiéndose en sistema digital"
          className="hero-art"
        />

        <div className="hero-brand-seal">
          <img src="/logo-metamorfosis-transparente.png" alt="Logo Metamorfosis" className="hero-seal-logo" />
          <a
            href="https://www.metamorfosislab.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-domain"
          >
            metamorfosislab.cl
          </a>
          <span className="hero-signature">Estrategia · Tecnología · Identidad</span>
        </div>
      </div>
    </section>
  );
}

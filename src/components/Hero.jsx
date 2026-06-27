import React from "react";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <p className="eyebrow">Metamorfosis Estudio</p>

        <h1>Transformamos ideas en presencia digital clara, útil y proyectable.</h1>

        <p className="hero-text">
          Ordenamos relatos, servicios, identidad y canales de contacto para convertir proyectos,
          marcas y organizaciones en herramientas digitales con sentido estratégico.
        </p>

        <div className="hero-actions">
          <a href="#casos" className="btn btn-primary">
            Ver casos de transformación
          </a>
          <a href="#contacto" className="btn btn-ghost">
            Conversemos sobre tu proyecto
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-label="Identidad visual Metamorfosis">
        <div className="hero-circle hero-circle-one" />
        <div className="hero-circle hero-circle-two" />
        <div className="hero-circle hero-circle-three" />

        <div className="hero-logo-card">
          <img src="/logo-1.png" alt="Logo Metamorfosis" className="hero-logo" />
          <a
            href="https://www.metamorfosislab.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-domain"
          >
            metamorfosislab.cl
          </a>
        </div>
      </div>
    </section>
  );
}

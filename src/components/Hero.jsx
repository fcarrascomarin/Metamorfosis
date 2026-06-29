import React from "react";

const heroPillars = ["Consultoría", "Diseño", "Tecnología", "Experiencias"];

export default function Hero() {
  return (
    <section id="inicio" className="hero hero-fullbleed">
      <img
        src="/hero-metamorfosis-portal.png"
        alt="Visual conceptual de ecosistema digital y crecimiento"
        className="hero-bg-image"
      />

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content hero-content-centered">
        <p className="hero-kicker">Consultoría, diseño e innovación aplicada</p>

        <h1 className="hero-title">Transformamos ideas en sistemas claros y proyectables.</h1>

        <p className="hero-text">
          Metamorfosis Laboratiorio de Innovación gestión de proyectos, diseña herramientas digitales y crea experiencias
          para convertir necesidades reales en operaciones más nítidas, atractivas y escalables.
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

      <a href="https://metamorfosislab.cl" target="_blank" rel="noopener noreferrer" className="hero-brand-seal" aria-label="Ir a metamorfosislab.cl">
        <img src="/logo-metamorfosis-transparente.png" alt="Logo Metamorfosis" className="hero-seal-logo" />
        <span className="hero-domain">metamorfosislab.cl</span>
      </a>
    </section>
  );
}

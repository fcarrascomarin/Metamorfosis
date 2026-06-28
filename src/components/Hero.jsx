import React from "react";

const heroPillars = ["Estrategia", "Diseño", "Tecnología"];

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <p className="hero-kicker">Metamorfosis Lab</p>

        <h1 className="hero-title">Ideas que evolucionan.</h1>

        <p className="hero-text">
          Unimos estrategia, diseño y tecnología para transformar proyectos en presencia digital
          clara, útil y escalable.
        </p>

        <div className="hero-pills" aria-label="Servicios principales">
          {heroPillars.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="hero-actions">
          <a href="#casos" className="btn btn-primary">
            Ver casos
          </a>
          <a href="#contacto" className="btn btn-ghost">
            Conversemos
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-label="Identidad visual Metamorfosis">
        <div className="hero-orbit hero-orbit-one" />
        <div className="hero-orbit hero-orbit-two" />
        <div className="hero-node hero-node-one" />
        <div className="hero-node hero-node-two" />
        <div className="hero-node hero-node-three" />
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
          <span className="hero-signature">Transformación digital con sentido</span>
        </div>
      </div>
    </section>
  );
}

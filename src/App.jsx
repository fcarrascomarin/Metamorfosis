import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Noticias from "./components/Noticias.jsx";
import Plataforma from "./components/Plataforma.jsx";
import CasosTransformacion from "./components/CasosTransformacion.jsx";
import Trayectoria from "./components/Trayectoria.jsx";
import Contacto from "./components/Contacto.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Noticias />

        <section id="plataforma" className="section section-platform project-split-section">
          <div className="project-split-grid">
            <Plataforma compact />
            <CasosTransformacion compact />
          </div>
        </section>

        <Trayectoria />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}

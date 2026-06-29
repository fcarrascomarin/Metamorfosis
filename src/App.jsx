import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Noticias from "./components/Noticias.jsx";
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
        <Plataforma />
        <Trayectoria />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}

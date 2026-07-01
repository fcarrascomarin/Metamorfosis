import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Noticias from "./components/Noticias.jsx";
import Plataforma from "./components/Plataforma.jsx";
import CasosTransformacion from "./components/CasosTransformacion.jsx";
import Trayectoria from "./components/Trayectoria.jsx";
import Contacto from "./components/Contacto.jsx";
import Footer from "./components/Footer.jsx";
import MetamorfosisOS from "./components/MetamorfosisOS.jsx";

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isOS = route === "#/os";

  if (isOS) {
    return <MetamorfosisOS />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Noticias />
        <Plataforma />
        <CasosTransformacion />
        <Trayectoria />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}

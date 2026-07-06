const heroPillars = ["Mapa de Transformación", "Sistema interno", "Activos intangibles", "Circularidad aplicada"];

export default function Hero() {
  return (
    <section id="inicio" className="hero hero-fullbleed">
      <div className="hero-content hero-content-centered">
        <p className="hero-kicker">Laboratorio de transformación aplicada</p>

        <h1 className="hero-title">
          <span>Lo valioso</span>
          <span>no debería depender de la improvisación.</span>
        </h1>

        <p className="hero-text">
          Metamorfosis Lab ayuda a proyectos y pymes con valor real a convertir identidad, operación,
          datos y activos dispersos en sistemas claros, medibles y proyectables.
        </p>

        <div className="hero-pills" aria-label="Servicios principales">
          {heroPillars.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="hero-actions">
          <a href="#plataforma" className="btn btn-primary">
            Ver método
          </a>
          <a href="#contacto" className="btn btn-ghost">
            Ordenar mi proyecto
          </a>
        </div>
      </div>
    </section>
  );
}

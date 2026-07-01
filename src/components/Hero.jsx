const heroPillars = ["Estrategia", "Diseño", "Tecnología"];

export default function Hero() {
  return (
    <section id="inicio" className="hero hero-fullbleed">
      <div className="hero-content hero-content-centered">
        <p className="hero-kicker">Metamorfosis Lab</p>

        <h1 className="hero-title">Ideas que evolucionan.</h1>

        <p className="hero-text">
          Unimos estrategia, diseño y tecnología para transformar proyectos en presencia digital clara, útil y escalable.
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
            Conversemos
          </a>
        </div>
      </div>
    </section>
  );
}

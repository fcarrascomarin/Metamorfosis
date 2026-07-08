const heroPillars = ["Web", "Sistema", "Identidad", "Datos"];

export default function Hero() {
  return (
    <section id="inicio" className="hero hero-fullbleed">
      <div className="hero-content hero-content-centered">
        <p className="hero-kicker">Metamorfosis Lab</p>

        <h1 className="hero-title">
          <span>Lo valioso</span>
          <span>Necesita sistema</span>
        </h1>

        <p className="hero-text">
          Creamos identidad digital y herramientas internas para que negocios con valor real
          se expliquen mejor, trabajen con mas orden y puedan crecer sin depender de la improvisación
        </p>

        <div className="hero-pills" aria-label="Servicios principales">
          {heroPillars.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="hero-actions">
          <a href="#plataforma" className="btn btn-primary">
            Ver servicios
          </a>
          <a href="#contacto" className="btn btn-ghost">
            Cotizar proyecto
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-kicker">Metamorfosis Estudio</p>

        <h1>
          Transformamos ideas en presencia digital clara, útil y proyectable.
        </h1>

        <p className="hero-text">
          Ordenamos relatos, servicios, identidad y canales de contacto para
          convertir proyectos, marcas y organizaciones en herramientas digitales
          con sentido estratégico.
        </p>

        <div className="hero-actions">
          <a href="#casos" className="btn btn-primary">
            Ver casos de transformación
          </a>

          <a href="#contacto" className="btn btn-secondary">
            Conversemos sobre tu proyecto
          </a>
        </div>
      </div>

      <div className="hero-visual" aria-label="Logo Metamorfosis">
        <div className="hero-circle hero-circle-one"></div>
        <div className="hero-circle hero-circle-two"></div>
        <div className="hero-circle hero-circle-three"></div>

        <div className="hero-logo-card">
          <img
            src="/logo-1.png"
            alt="Logo Metamorfosis"
            className="hero-logo"
          />

          <span>metamorfosislab.cl</span>
        </div>
      </div>
    </section>
  );
}
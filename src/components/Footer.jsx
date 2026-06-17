export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="/" className="footer-logo-wrap" aria-label="Ir al inicio">
            <img
              src="/logo-metamorfosis.png"
              alt="Logo Metamorfosis"
              className="footer-logo-img"
            />

            <div>
              <h2>METAMORFOSIS</h2>
              <p>
                Estudio de transformación digital, identidad, estrategia y
                presencia web.
              </p>
            </div>
          </a>
        </div>

        <div className="footer-column">
          <h3>Navegación</h3>
          <a href="#noticias">Noticias</a>
          <a href="#casos">Casos de transformación</a>
          <a href="#trayectoria">Trayectoria</a>
          <a href="#contacto">Contacto</a>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>

          <a href="mailto:contacto@metamorfosislab.cl" className="footer-contact-link">
            <span className="footer-icon">✉</span>
            contacto@metamorfosislab.cl
          </a>

          <a
            href="https://www.metamorfosislab.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <span className="footer-icon">◎</span>
            www.metamorfosislab.cl
          </a>

          <div className="footer-contact-link">
            <span className="footer-icon">⌖</span>
            Concepción, Chile
          </div>
        </div>

        <div className="footer-column">
          <h3>Redes y comunidad</h3>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              IG
            </a>

            <a
              href="https://www.linkedin.com/francisca-carrasco"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              in
            </a>

            <a
              href="https://github.com/fcarrascomarin/Metamorfosis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              GH
            </a>
          </div>

          <p className="footer-small-text">
            Transformamos ideas, relatos y servicios en herramientas digitales
            claras, útiles y proyectables.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} METAMORFOSIS. Todos los derechos reservados.</p>

        <div>
          <a href="#contacto">Trabajemos juntos</a>
          <span>·</span>
          <a href="https://www.metamorfosislab.cl">metamorfosislab.cl</a>
        </div>
      </div>
    </footer>
  );
}
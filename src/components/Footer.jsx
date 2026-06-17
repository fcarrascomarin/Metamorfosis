import {
  Mail,
  MapPin,
  Phone,
  Instagram,
  Linkedin,
  Github,
  Globe,
} from "lucide-react";

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
              <p>Estudio de transformación digital, identidad y estrategia.</p>
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
            <Mail size={18} />
            contacto@metamorfosislab.cl
          </a>

          <a href="tel:+56900000000" className="footer-contact-link">
            <Phone size={18} />
            +56 9 0000 0000
          </a>

          <div className="footer-contact-link">
            <MapPin size={18} />
            Concepción, Chile
          </div>

          <a
            href="https://www.metamorfosislab.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <Globe size={18} />
            www.metamorfosislab.cl
          </a>
        </div>

        <div className="footer-column">
          <h3>Redes sociales</h3>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>

            <a
              href="https://github.com/fcarrascomarin/Metamorfosis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>

          <p className="footer-small-text">
            Transformamos ideas, relatos y servicios en herramientas digitales claras,
            útiles y proyectables.
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
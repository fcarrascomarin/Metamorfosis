import React from "react";

const contactLinks = [
  { label: "contacto@metamorfosislab.cl", href: "mailto:contacto@metamorfosislab.cl", icon: "✉" },
  { label: "www.metamorfosislab.cl", href: "https://www.metamorfosislab.cl", icon: "◎" },
  { label: "Concepción, Chile", href: null, icon: "⌖" },
];

const socialLinks = [
  { label: "IG", href: "https://www.instagram.com/", name: "Instagram" },
  { label: "in", href: "https://www.linkedin.com/", name: "LinkedIn" },
  { label: "GH", href: "https://github.com/fcarrascomarin/Metamorfosis", name: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#inicio" className="footer-logo-wrap" aria-label="Ir al inicio">
            <img src="/logo-1.png" alt="Logo Metamorfosis" className="footer-logo-img" />
            <div>
              <h2>METAMORFOSIS LAB</h2>
              <p>Plataforma de consultoría, diseño, tecnología e innovación aplicada para pymes y proyectos territoriales.</p>
            </div>
          </a>
        </div>

        <div className="footer-column">
          <h3>Navegación</h3>
          <a href="#plataforma">Plataforma</a>
          <a href="#casos">Casos y entregables</a>
          <a href="#trayectoria">Líneas de desarrollo</a>
          <a href="#contacto">Contacto</a>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>
          {contactLinks.map((item) =>
            item.href ? (
              <a key={item.label} href={item.href} className="footer-contact-link" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                <span className="footer-icon">{item.icon}</span>
                {item.label}
              </a>
            ) : (
              <div key={item.label} className="footer-contact-link">
                <span className="footer-icon">{item.icon}</span>
                {item.label}
              </div>
            )
          )}
        </div>

        <div className="footer-column">
          <h3>Redes y comunidad</h3>
          <div className="footer-socials">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>
                {item.label}
              </a>
            ))}
          </div>
          <p className="footer-small-text">
            Transformamos negocios reales en sistemas claros, útiles y proyectables.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} METAMORFOSIS LAB. Todos los derechos reservados.</p>
        <div>
          <a href="#contacto">Trabajemos juntos</a>
          <span>·</span>
          <a href="https://www.metamorfosislab.cl">metamorfosislab.cl</a>
        </div>
      </div>
    </footer>
  );
}

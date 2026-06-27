import React, { useState } from "react";

const navItems = [
  { href: "#noticias", label: "Noticias" },
  { href: "#casos", label: "Casos" },
  { href: "#trayectoria", label: "Trayectoria" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar">
      <a className="brand" href="#inicio" aria-label="Ir al inicio de Metamorfosis">
        <img src="/logo-1.png" alt="Logo Metamorfosis" />
        <span>METAMORFOSIS</span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Abrir o cerrar menú de navegación"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={isOpen ? "nav-links is-open" : "nav-links"} aria-label="Navegación principal">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a className="nav-cta" href="#contacto" onClick={closeMenu}>
          Conversemos
        </a>
      </nav>
    </header>
  );
}

export default function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="#inicio" aria-label="Ir al inicio">
        <img src="./public/logo-1.png" alt="Logo Metamorfosis" onError={(e) => (e.currentTarget.style.display = "none")} />
        <span>METAMORFOSIS</span>
      </a>
      <nav>
        <a href="#noticias">Noticias</a>
        <a href="#casos">Casos de Transformación</a>
        <a href="#trayectoria">Trayectoria</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <a className="nav-cta" href="#contacto">Conversemos</a>
    </header>
  );
}

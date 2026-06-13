import Reveal from "./Reveal.jsx";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-copy">
        <Reveal direction="left">
          <p className="eyebrow">Estudio de transformación digital y estrategia</p>
          <h1>Convertimos ideas en presencias digitales claras, útiles y con identidad.</h1>
          <p className="hero-text">
            En METAMORFOSIS ordenamos relatos, servicios, identidad visual y canales de contacto para transformar proyectos en herramientas digitales atractivas, funcionales y proyectables.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#casos">Ver casos de transformación</a>
            <a className="btn btn-ghost" href="#contacto">Quiero transformar mi proyecto</a>
          </div>
        </Reveal>
      </div>
      <Reveal direction="right" delay={180} className="hero-visual">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="butterfly-mark">M</div>
      </Reveal>
    </section>
  );
}

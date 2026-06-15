import Reveal from "./Reveal.jsx";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-copy">
        <Reveal direction="left">
          <p className="eyebrow">Estudio de ingeniería y transformación digital con identidad y estrategia</p>
          <h1>Tus ideas las transformamos en planes de estrategia con presencia digital e identidad</h1>
          <p className="hero-text">
            En METAMORFOSIS ordenamos relatos, servicios, identidad visual y canales de contacto para transformar proyectos en herramientas digitales atractivas, funcionales, escalables y eficientes.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#casos">Casos de transformación</a>
            <a className="btn btn-ghost" href="#contacto">Transforma tu idea en proyecto</a>
          </div>
        </Reveal>
      </div>
      <Reveal direction="right" delay={180} className="hero-visual">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="butterfly-mark"><img src="./puclic/logo-metamorfosis.png" alt="" /></div>
      </Reveal>
    </section>
  );
}

import Reveal from "./Reveal.jsx";

const empresas = [
  {
    nombre: "Joyas Juana de Arco",
    proyecto: "Tienda digital, catálogo, narrativa de colecciones, estructura de compra y contacto por WhatsApp.",
  },
  {
    nombre: "Con Criterio",
    proyecto: "Plataforma institucional para análisis, servicios, contenidos y conversación pública especializada.",
  },
  {
    nombre: "Red Oriente",
    proyecto: "Web corporativa para consultoría, comunicación profesional, oferta de servicios y generación de confianza.",
  },
];

export default function Trayectoria() {
  return (
    <section id="trayectoria" className="section section-light trajectory-section">
      <Reveal direction="up">
        <div className="section-heading">
          <p className="eyebrow dark">Innovación aplicada y trayectoria</p>
          <h2>Empresas, proyectos y capacidades desarrolladas</h2>
          <p>
            Nuestra trayectoria se expresa en proyectos concretos: marcas que necesitaban vender mejor, servicios que requerían mayor claridad y plataformas que debían comunicar autoridad, confianza y propósito.
          </p>
        </div>
      </Reveal>

      <div className="trajectory-grid">
        {empresas.map((empresa, index) => (
          <Reveal key={empresa.nombre} direction={index === 1 ? "up" : index === 0 ? "left" : "right"} delay={index * 120}>
            <article className="trajectory-card">
              <span>0{index + 1}</span>
              <h3>{empresa.nombre}</h3>
              <p>{empresa.proyecto}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

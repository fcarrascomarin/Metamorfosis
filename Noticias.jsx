import Reveal from "./Reveal.jsx";

const noticias = [
  {
    titulo: "Diseño web con enfoque estratégico",
    texto: "Una web no parte por el diseño: parte por ordenar qué se ofrece, a quién se habla y cómo se quiere ser percibido.",
  },
  {
    titulo: "Identidad digital para proyectos emergentes",
    texto: "Transformamos ideas iniciales en estructuras navegables, mensajes claros y canales de contacto preparados para vender o comunicar.",
  },
  {
    titulo: "Contenido, servicios y confianza",
    texto: "Cada sección debe cumplir una función: explicar, orientar, mostrar evidencia y facilitar el próximo paso del cliente.",
  },
];

export default function Noticias() {
  return (
    <section id="noticias" className="section section-light">
      <Reveal direction="up">
        <div className="section-heading">
          <p className="eyebrow dark">Actualizaciones</p>
          <h2>Noticias y criterios de trabajo</h2>
          <p>Compartimos avances, aprendizajes y enfoques sobre presencia digital, identidad, comunicación profesional y diseño estratégico.</p>
        </div>
      </Reveal>
      <div className="news-grid">
        {noticias.map((item, index) => (
          <Reveal key={item.titulo} direction={index % 2 === 0 ? "left" : "right"} delay={index * 120}>
            <article className="news-card">
              <div className="news-image" />
              <div className="card-body">
                <span>METAMORFOSIS · ESTUDIO</span>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
                <a href="#contacto">Leer más →</a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

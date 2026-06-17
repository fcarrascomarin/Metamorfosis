import Reveal from "./Reveal.jsx";

const news = [
  {
    date: "Actualidad",
    title: "Diseño web como herramienta estratégica",
    text: "Una página no parte en el código: parte ordenando relato, identidad, servicios y canales de contacto.",
  },
  {
    date: "Método",
    title: "Del diagnóstico a la presencia digital",
    text: "Trabajamos cada proyecto como un proceso de transformación: levantar, ordenar, diseñar y publicar.",
  },
  {
    date: "Estudio",
    title: "Casos que muestran capacidades distintas",
    text: "Marca, catálogo, contenido, autoridad institucional, confianza comercial y comunicación profesional.",
  },
];

export default function Noticias() {
  return (
    <section id="noticias" className="section section-light">
      <Reveal>
        <div className="section-heading">
          <p className="eyebrow dark">Noticias y actualizaciones</p>
          <h2>Ideas, procesos y aprendizajes sobre transformación digital.</h2>
          <p>
            Compartimos avances, reflexiones y criterios de trabajo para que cada proyecto digital
            sea una herramienta útil, no solo una vitrina.
          </p>
        </div>
      </Reveal>

      <div className="news-grid">
        {news.map((item, index) => (
          <Reveal key={item.title} direction={index === 1 ? "up" : index === 0 ? "left" : "right"}>
            <article className="news-card">
              <div className="news-image" aria-hidden="true" />
              <div className="card-body">
                <span>{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

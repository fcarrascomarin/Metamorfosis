import Reveal from "./Reveal.jsx";

export default function Contacto() {
  return (
    <section id="contacto" className="section section-contact">
      <Reveal direction="left">
        <div className="contact-copy">
          <p className="eyebrow">Contacto</p>
          <h2>Conversemos sobre tu proyecto</h2>
          <p>
            Cuéntanos qué quieres construir, ordenar o mejorar. Podemos ayudarte a convertir una idea, servicio o marca en una presencia digital clara y profesional.
          </p>
        </div>
      </Reveal>

      <Reveal direction="right" delay={120}>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label>Nombre</label>
          <input type="text" placeholder="Tu nombre" required />
          <label>Correo</label>
          <input type="email" placeholder="tu@correo.cl" required />
          <label>Tipo de proyecto</label>
          <select required>
            <option value="">Seleccionar</option>
            <option>Persona natural</option>
            <option>Persona jurídica</option>
            <option>Empresa o emprendimiento</option>
          </select>
          <label>¿Qué quieres transformar?</label>
          <textarea placeholder="Cuéntanos brevemente tu idea, servicio o necesidad digital" required />
          <button className="btn btn-primary" type="submit">Enviar propuesta</button>
        </form>
      </Reveal>
    </section>
  );
}

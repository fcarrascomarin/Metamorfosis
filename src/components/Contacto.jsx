import React, { useState } from "react";
import Reveal from "./Reveal.jsx";

const initialFormState = {
  name: "",
  email: "",
  type: "",
  topic: "",
  message: "",
};

export default function Contacto() {
  const [form, setForm] = useState(initialFormState);
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Propuesta desde metamorfosislab.cl - ${form.name}`);
    const body = encodeURIComponent(
      `Nombre: ${form.name}\nCorreo: ${form.email}\nTipo: ${form.type}\nTema: ${form.topic}\n\nMensaje:\n${form.message}`
    );

    window.location.href = `mailto:contacto@metamorfosislab.cl?subject=${subject}&body=${body}`;
    setSent(true);
    setForm(initialFormState);
  };

  return (
    <section id="contacto" className="section section-contact">
      <Reveal direction="left">
        <div className="contact-copy">
          <p className="eyebrow">Contacto</p>
          <h2>Conversemos si necesitas una web o sistema que explique mejor tu negocio.</h2>
          <p>
            Puedes escribirnos si necesitas crear una pagina, ordenar servicios, mejorar tu identidad
            digital, implementar formularios o construir una herramienta interna para administrar mejor.
          </p>
        </div>
      </Reveal>

      <Reveal direction="right">
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nombre o razón social</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />

          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

          <label htmlFor="type">Tipo de proyecto</label>
          <select id="type" name="type" value={form.type} onChange={handleChange} required>
            <option value="">Seleccionar</option>
            <option value="Persona natural">Persona natural</option>
            <option value="Persona jurídica">Persona jurídica</option>
            <option value="Emprendimiento">Emprendimiento o pyme</option>
            <option value="Organización">Organización</option>
          </select>

          <label htmlFor="topic">Necesidad principal</label>
          <input
            id="topic"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            placeholder="Pagina web, sistema interno, identidad, catalogo, formulario..."
            required
          />

          <label htmlFor="message">Mensaje</label>
          <textarea id="message" name="message" value={form.message} onChange={handleChange} required />

          <button className="btn btn-primary" type="submit">
            Enviar solicitud
          </button>

          {sent && <p className="form-status">Se abrirá tu correo para enviar la propuesta.</p>}
        </form>
      </Reveal>
    </section>
  );
}

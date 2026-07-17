import React, { useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import AdminApp from './AdminApp.jsx';
import heroImage from './assets/images/hero-proyectos.webp';
import systemImage from './assets/images/sistema-digital.webp';
import methodImage from './assets/images/trabajo-metodo.webp';
import caseImage from './assets/images/caso-cm.webp';
import { contact, services, methodSteps } from './data.js';

const waBase = `https://wa.me/${contact.phoneDigits}`;

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''}`} href="/" aria-label="Metamorfosis Lab, ir al inicio">
      <img className="brand-logo" src="/logo-metamorfosis-transparente.png" alt="" width="48" height="48" />
      <span className="brand-copy">
        <strong>Metamorfosis</strong>
        <small>LAB</small>
      </span>
    </a>
  );
}

function IconButton({ label, icon, onClick, className = '', type = 'button', disabled = false, ariaExpanded, ariaControls }) {
  return (
    <button type={type} className={`icon-button ${className}`} onClick={onClick} aria-label={label} title={label} disabled={disabled} aria-expanded={ariaExpanded} aria-controls={ariaControls}>
      <Icon name={icon} />
    </button>
  );
}

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    ['servicios', 'Qué hacemos'],
    ['trayectoria', 'Trayectoria'],
    ['mapa', 'El Mapa'],
    ['metodo', 'Cómo trabajamos'],
    ['caso-cm', 'Caso CM'],
    ['contacto', 'Contacto']
  ];

  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Brand />
        <nav id="site-navigation" className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          {links.map(([id, label]) => (
            <button type="button" key={id} onClick={() => goTo(id)}>{label}</button>
          ))}
          <a className="button button--small" href="#contacto" onClick={() => setOpen(false)}>Conversar</a>
        </nav>
        <IconButton
          className="menu-button"
          label={open ? 'Cerrar menú' : 'Abrir menú'}
          icon={open ? 'close' : 'menu'}
          onClick={() => setOpen((value) => !value)}
          ariaExpanded={open}
          ariaControls="site-navigation"
        />
      </div>
    </header>
  );
}

function WhatsappFloating() {
  const message = encodeURIComponent('Hola, conocí Metamorfosis Lab a través de su página. Tengo un proyecto o pyme que necesito ordenar y quisiera solicitar una conversación inicial.');
  return (
    <a
      className="whatsapp-floating"
      href={`${waBase}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Conversar con Metamorfosis Lab por WhatsApp al ${contact.phoneDisplay}`}
    >
      <img src="/assets/icons/whatsapp.svg" alt="" width="28" height="28" />
      <span>WhatsApp</span>
    </a>
  );
}

function SectionHeading({ kicker, title, description, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function QuoteWizard() {
  const empty = {
    serviceType: '',
    projectStage: '',
    desiredDate: '',
    teamSize: '',
    details: '',
    contactName: '',
    company: '',
    city: '',
    email: '',
    phone: '',
    preferredContact: 'WhatsApp',
    consent: false,
    website: ''
  };
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: 'idle', message: '', waUrl: '' });

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const stepValid = useMemo(() => {
    if (step === 1) return Boolean(form.serviceType);
    if (step === 2) return Boolean(form.details.trim());
    return Boolean(form.contactName.trim() && /[0-9]{8,}/.test(form.phone.replace(/\D/g, '')) && (!form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) && form.consent);
  }, [form, step]);

  const whatsappMessage = useMemo(() => {
    const lines = [
      'Hola, quiero conversar con Metamorfosis Lab.',
      '',
      `Tipo de apoyo: ${form.serviceType || 'Por definir'}`,
      `Etapa del proyecto: ${form.projectStage || 'No indicada'}`,
      `Plazo esperado: ${form.desiredDate || 'Por conversar'}`,
      `Equipo: ${form.teamSize || 'No indicado'}`,
      `Proyecto o empresa: ${form.company || 'No indicado'}`,
      `Ciudad: ${form.city || 'No indicada'}`,
      `Necesidad principal: ${form.details || 'Por explicar'}`,
      '',
      `Contacto: ${form.contactName}`,
      `Teléfono: ${form.phone}`,
      `Correo: ${form.email || 'No indicado'}`
    ];
    return encodeURIComponent(lines.join('\n'));
  }, [form]);

  const submit = async (event) => {
    event.preventDefault();
    if (!stepValid) return;
    setStatus({ type: 'loading', message: 'Preparando tu solicitud…', waUrl: '' });
    let saved = false;
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      saved = response.ok && payload.saved !== false;
    } catch {
      saved = false;
    }
    const waUrl = `${waBase}?text=${whatsappMessage}`;
    setStatus({
      type: 'success',
      message: saved
        ? 'La solicitud quedó registrada. Completa el contacto enviando el mensaje por WhatsApp.'
        : 'La solicitud quedó preparada. Envía el mensaje por WhatsApp para completar el contacto.',
      waUrl
    });
  };

  if (status.type === 'success') {
    return (
      <div className="quote-confirmation" role="status" aria-live="polite">
        <span className="confirmation-icon"><Icon name="check_circle" /></span>
        <h3>Solicitud preparada</h3>
        <p>{status.message}</p>
        <a className="button" href={status.waUrl} target="_blank" rel="noreferrer">
          <img src="/assets/icons/whatsapp.svg" alt="" width="20" height="20" />
          Abrir WhatsApp
        </a>
        <button
          type="button"
          className="text-button"
          onClick={() => { setStatus({ type: 'idle', message: '', waUrl: '' }); setStep(1); setForm(empty); }}
        >
          Ingresar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form className="quote-wizard" onSubmit={submit} noValidate>
      <div className="wizard-progress" aria-label={`Paso ${step} de 3`}>
        {[1, 2, 3].map((number) => (
          <span key={number} className={number <= step ? 'is-active' : ''}>
            <b>{number}</b>
            <small>{number === 1 ? 'Necesidad' : number === 2 ? 'Contexto' : 'Contacto'}</small>
          </span>
        ))}
      </div>

      {step === 1 && (
        <fieldset className="wizard-step">
          <legend>¿Qué necesitas ordenar o transformar?</legend>
          <div className="choice-grid">
            {[
              ['Mapa de Transformación y Activos', 'Comprender el estado actual y priorizar una ruta.'],
              ['Proyecto Base', 'Ordenar procesos, roles, documentos y registros.'],
              ['Proyecto Forma', 'Trabajar identidad, web, comunicación o experiencia.'],
              ['Proyecto Activo', 'Reconocer activos, productos derivados o nuevas unidades.'],
              ['Aún no lo sé', 'Necesito explicar el problema antes de elegir una ruta.']
            ].map(([title, text]) => (
              <label key={title} className={`choice-card ${form.serviceType === title ? 'is-selected' : ''}`}>
                <input type="radio" name="serviceType" value={title} checked={form.serviceType === title} onChange={update} />
                <span className="choice-indicator" aria-hidden="true" />
                <strong>{title}</strong>
                <small>{text}</small>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="wizard-step">
          <legend>Cuéntanos el contexto esencial</legend>
          <div className="form-grid form-grid--two">
            <label>
              Etapa del proyecto
              <select name="projectStage" value={form.projectStage} onChange={update}>
                <option value="">Seleccionar</option>
                <option>Idea en definición</option>
                <option>Proyecto iniciando</option>
                <option>Negocio funcionando</option>
                <option>Proceso de crecimiento</option>
                <option>Necesita reorganización</option>
              </select>
            </label>
            <label>
              Plazo o fecha esperada
              <input type="text" name="desiredDate" value={form.desiredDate} onChange={update} placeholder="Ej.: durante agosto" />
            </label>
            <label>
              Personas involucradas
              <select name="teamSize" value={form.teamSize} onChange={update}>
                <option value="">Seleccionar</option>
                <option>Trabajo individual</option>
                <option>2 a 5 personas</option>
                <option>6 a 15 personas</option>
                <option>Más de 15 personas</option>
              </select>
            </label>
            <label className="form-field--wide">
              ¿Qué está ocurriendo y qué necesitas resolver?
              <textarea name="details" value={form.details} onChange={update} rows="5" required maxLength="1800" placeholder="Describe brevemente el desorden, oportunidad o decisión que necesitas abordar." />
            </label>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="wizard-step">
          <legend>Datos para continuar la conversación</legend>
          <div className="form-grid form-grid--two">
            <label>
              Nombre
              <input type="text" name="contactName" value={form.contactName} onChange={update} required autoComplete="name" />
            </label>
            <label>
              Empresa o proyecto
              <input type="text" name="company" value={form.company} onChange={update} autoComplete="organization" />
            </label>
            <label>
              Ciudad o comuna
              <input type="text" name="city" value={form.city} onChange={update} autoComplete="address-level2" />
            </label>
            <label>
              WhatsApp o teléfono
              <input type="tel" name="phone" value={form.phone} onChange={update} required autoComplete="tel" placeholder="+56 9…" />
            </label>
            <label>
              Correo
              <input type="email" name="email" value={form.email} onChange={update} autoComplete="email" />
            </label>
            <label>
              Medio preferido
              <select name="preferredContact" value={form.preferredContact} onChange={update}>
                <option>WhatsApp</option>
                <option>Correo</option>
                <option>Llamada</option>
              </select>
            </label>
          </div>
          <label className="consent-field">
            <input type="checkbox" name="consent" checked={form.consent} onChange={update} required />
            <span>Autorizo a Metamorfosis Lab a usar estos datos únicamente para responder y dar seguimiento a esta solicitud.</span>
          </label>
          <label className="honeypot" aria-hidden="true">Sitio web<input type="text" name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
        </fieldset>
      )}

      <div className="wizard-actions">
        {step > 1 && <button type="button" className="button button--ghost" onClick={() => setStep((value) => value - 1)}>Atrás</button>}
        {step < 3 ? (
          <button type="button" className="button" disabled={!stepValid} onClick={() => setStep((value) => value + 1)}>
            Continuar <Icon name="arrow_forward" />
          </button>
        ) : (
          <button type="submit" className="button" disabled={!stepValid || status.type === 'loading'}>
            {status.type === 'loading' ? 'Preparando…' : 'Preparar solicitud'}
            <Icon name="send" />
          </button>
        )}
      </div>
    </form>
  );
}

function PublicSite() {
  return (
    <div className="public-site">
      <a className="skip-link" href="#contenido">Saltar al contenido principal</a>
      <PublicHeader />
      <main id="contenido">
        <section id="inicio" className="hero section-anchor">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <span className="kicker">Laboratorio de transformación aplicada · Biobío</span>
              <h1>Hacemos que lo valioso sobreviva a la improvisación.</h1>
              <p>Ayudamos a proyectos y pymes con valor real a convertir conocimiento disperso en sistemas, activos y decisiones que puedan sostenerse.</p>
              <div className="hero__actions">
                <a className="button" href="#contacto">Solicitar conversación inicial</a>
                <a className="button button--ghost" href="#mapa">Conocer el Mapa</a>
              </div>
              <div className="hero__proof" aria-label="Principales resultados del proceso">
                <span><Icon name="description" /> Documentación útil</span>
                <span><Icon name="schema" /> Procesos claros</span>
                <span><Icon name="query_stats" /> Decisiones con evidencia</span>
              </div>
            </div>
            <figure className="hero__media">
              <img
                src={heroImage}
                alt="Equipo de trabajo revisando planos y documentos alrededor de una mesa"
                width="1280"
                height="800"
                fetchPriority="high"
              />
              <figcaption>
                <span>De la intuición a la forma</span>
                <strong>Observar · ordenar · sistematizar</strong>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="servicios" className="section section-screen section-anchor">
          <div className="shell">
            <SectionHeading
              kicker="Qué hacemos"
              title="Convertimos valor disperso en una estructura que puede sostenerse."
              description="Integramos estrategia, operación, identidad y tecnología según lo que el proyecto realmente necesita, evitando soluciones desconectadas."
            />
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.title}>
                  <span className="service-card__icon"><Icon name={service.icon} /></span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="trayectoria" className="section section-screen section-anchor section--tint">
          <div className="shell split-layout">
            <div className="split-layout__media">
              <img src={systemImage} alt="Profesionales trabajando con computadores y revisando información de un proyecto" width="1280" height="853" loading="lazy" />
            </div>
            <div className="split-layout__copy">
              <SectionHeading
                kicker="Experiencia aplicada"
                title="Metamorfosis nace desde operaciones reales y problemas que necesitan estructura."
              />
              <p>El laboratorio integra experiencia en control de gestión, planificación, operación, documentación técnica, diseño de sistemas y desarrollo digital aplicado a pymes.</p>
              <div className="timeline-mini">
                <div><b>01</b><span><strong>Experiencia operacional</strong>Control, procesos, indicadores y mejora.</span></div>
                <div><b>02</b><span><strong>Primer caso vivo</strong>Consolidación de CM Banquetería como prueba aplicada.</span></div>
                <div><b>03</b><span><strong>Método propio</strong>Herramientas replicables para comprender, ejecutar y medir.</span></div>
              </div>
              <p className="callout">CM se comunica como un caso en construcción: muestra el recorrido y las herramientas creadas, sin inflar resultados todavía no medidos.</p>
            </div>
          </div>
        </section>

        <section id="mapa" className="section section-screen section-anchor section--dark">
          <div className="shell map-layout">
            <div>
              <SectionHeading
                kicker="Puerta de entrada"
                title="Mapa de Transformación y Activos"
                description="Un diagnóstico accionable para entender qué existe, qué está en riesgo, qué valor permanece oculto y qué conviene hacer primero."
              />
              <a className="button button--light" href="#contacto">Evaluar mi proyecto</a>
            </div>
            <div className="map-board" role="list" aria-label="Dimensiones del Mapa de Transformación y Activos">
              {[
                ['storefront', 'Proyecto e identidad'],
                ['settings', 'Operación y roles'],
                ['payments', 'Economía y caja'],
                ['database', 'Datos y tecnología útil'],
                ['recycling', 'Recursos y circularidad'],
                ['copyright', 'Activos intangibles'],
                ['warning', 'Riesgos y dependencias'],
                ['route', 'Ruta de transformación']
              ].map(([icon, label]) => (
                <div key={label} role="listitem">
                  <Icon name={icon} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="section section-screen section-anchor">
          <div className="shell method-layout">
            <div className="method-layout__copy">
              <SectionHeading
                kicker="Cómo trabajamos"
                title="Un método visible, trazable y adaptable."
                description="Cada etapa debe dejar una decisión, una herramienta, una evidencia o una capacidad instalada."
              />
              <div className="method-steps">
                {methodSteps.map(([icon, title, text], index) => (
                  <article key={title}>
                    <span className="method-number">{String(index + 1).padStart(2, '0')}</span>
                    <Icon name={icon} />
                    <div><h3>{title}</h3><p>{text}</p></div>
                  </article>
                ))}
              </div>
            </div>
            <figure className="method-layout__media">
              <img src={methodImage} alt="Personas tomando notas y revisando documentos durante una sesión de trabajo" width="1280" height="857" loading="lazy" />
              <figcaption>Comprensión antes que tecnología. Criterio antes que automatización.</figcaption>
            </figure>
          </div>
        </section>

        <section id="caso-cm" className="section section-screen section-anchor section--tint">
          <div className="shell case-layout">
            <div className="case-layout__copy">
              <SectionHeading
                kicker="Caso demostrativo en desarrollo"
                title="CM: ordenar la operación para que el crecimiento no dependa de la memoria."
                description="La consultoría de consolidación de CM integra documentación, control operativo, presencia pública y un sistema interno construido desde necesidades reales."
              />
              <ul className="case-points">
                <li><Icon name="check_circle" /> Procesos y documentos vinculados a etapas e hitos.</li>
                <li><Icon name="check_circle" /> Panel operativo para cotizaciones, stock, gastos y seguimiento.</li>
                <li><Icon name="check_circle" /> Separación entre vitrina pública y gestión interna.</li>
              </ul>
              <p className="callout"><strong>Estado:</strong> caso vivo en ejecución. Se muestran herramientas construidas, sin atribuir resultados que todavía no han sido medidos.</p>
            </div>
            <figure className="case-layout__media">
              <img src={caseImage} alt="Vista del panel interno desarrollado para CM Banquetería" width="1400" height="700" loading="lazy" />
              <figcaption>Entregable dentro de la Consultoría de Consolidación CM, desarrollada por Metamorfosis Lab.</figcaption>
            </figure>
          </div>
        </section>

        <section id="contacto" className="section section-anchor contact-section">
          <div className="shell contact-layout">
            <div className="contact-intro">
              <SectionHeading
                kicker="Conversación inicial"
                title="Cuéntanos qué valor existe y qué necesita forma."
                description="La primera conversación busca comprender el problema, evaluar encaje y definir si corresponde comenzar por un Mapa o por una intervención acotada."
              />
              <div className="contact-links">
                <a href={`${waBase}?text=${encodeURIComponent('Hola, quisiera solicitar una conversación inicial con Metamorfosis Lab.')}`} target="_blank" rel="noreferrer">
                  <img src="/assets/icons/whatsapp.svg" alt="" width="22" height="22" />
                  <span><small>WhatsApp</small><strong>{contact.phoneDisplay}</strong></span>
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Icon name="mail" />
                  <span><small>Correo</small><strong>{contact.email}</strong></span>
                </a>
                <div>
                  <Icon name="location_on" />
                  <span><small>Territorio</small><strong>{contact.coverage}</strong></span>
                </div>
              </div>
            </div>
            <QuoteWizard />
          </div>
        </section>

        <section id="ubicacion" className="location-strip section-anchor">
          <div className="shell location-strip__inner">
            <div>
              <span className="kicker">Cómo trabajamos territorialmente</span>
              <h2>Desde Biobío, con atención presencial coordinada y trabajo remoto.</h2>
            </div>
            <div className="location-details">
              <span><Icon name="public" /> {contact.location}</span>
              <span><Icon name="schedule" /> Reuniones con coordinación previa</span>
              <span><Icon name="videocam" /> Atención remota disponible</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div><Brand /><p>Dar forma y proyección a proyectos con sentido.</p></div>
          <div><span className="footer-title">Contacto</span><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`${waBase}`}>{contact.phoneDisplay}</a></div>
          <div><span className="footer-title">Ubicación</span><p>Región del Biobío · Chile</p><p>Atención presencial y remota.</p></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Transformación aplicada con criterio humano.</span></div>
      </footer>
      <WhatsappFloating />
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  return isAdmin ? <AdminApp /> : <PublicSite />;
}

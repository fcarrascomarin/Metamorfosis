import React, { useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import AdminApp from './AdminApp.jsx';
import heroImage from './assets/images/hero-proyectos.webp';
import caseImage from './assets/images/caso-cm.webp';
import { contact, services, methodSteps } from './data.js';

const waBase = `https://wa.me/${contact.phoneDigits}`;

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''}`} href="/" aria-label="Metamorfosis Lab, ir al inicio">
      <img className="brand-logo" src="/logo-metamorfosis-transparente.png" alt="Isotipo de Metamorfosis Lab" width="44" height="44" />
      <span className="brand-copy">
        <strong>METAMORFOSIS LAB</strong>
        <small>tecnología · estructura · criterio</small>
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
    ['plataforma', 'Plataforma'],
    ['mapa', 'Mapa'],
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
          <a className="site-nav__os" href="/admin">Acceso OS</a>
          <a className="button button--small" href="#contacto" onClick={() => setOpen(false)}>Conversemos</a>
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
              Plazo esperado
              <input type="text" name="desiredDate" value={form.desiredDate} onChange={update} placeholder="Ej. este mes, agosto, sin urgencia" />
            </label>
            <label>
              Tamaño del equipo
              <input type="text" name="teamSize" value={form.teamSize} onChange={update} placeholder="Ej. 2 personas, 8 trabajadores" />
            </label>
            <label>
              Comuna o ciudad
              <input type="text" name="city" value={form.city} onChange={update} placeholder="Ej. Concepción" />
            </label>
          </div>
          <label>
            ¿Qué está ocurriendo actualmente?
            <textarea name="details" value={form.details} onChange={update} rows="5" placeholder="Describe brevemente qué problema estás enfrentando, qué valor ya existe y qué quisieras ordenar o transformar." />
          </label>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="wizard-step">
          <legend>Datos de contacto</legend>
          <div className="form-grid form-grid--two">
            <label>
              Nombre y apellido
              <input type="text" name="contactName" value={form.contactName} onChange={update} required />
            </label>
            <label>
              Empresa o proyecto
              <input type="text" name="company" value={form.company} onChange={update} />
            </label>
            <label>
              Teléfono o WhatsApp
              <input type="tel" name="phone" value={form.phone} onChange={update} placeholder="Ej. +56 9..." required />
            </label>
            <label>
              Correo electrónico
              <input type="email" name="email" value={form.email} onChange={update} placeholder="Ej. contacto@proyecto.cl" />
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
          <label className="checkbox-field">
            <input type="checkbox" name="consent" checked={form.consent} onChange={update} />
            <span>Autorizo a Metamorfosis Lab a utilizar estos datos para contactarme sobre mi solicitud.</span>
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
        <section id="inicio" className="hero hero--immersive section-anchor">
          <div className="hero__backdrop" aria-hidden="true">
            <img src={heroImage} alt="" width="1600" height="900" fetchPriority="high" />
          </div>
          <div className="hero__overlay" aria-hidden="true" />
          <div className="shell hero__stage">
            <div className="hero__panel">
              <span className="hero__eyebrow">Metamorfosis Lab</span>
              <h1>Tecnología con criterio para proyectos que necesitan estructura.</h1>
              <p>Integramos estrategia, diseño y sistemas para transformar valor disperso en presencia digital clara, operación trazable y decisiones sostenibles.</p>
              <div className="hero__tags" aria-label="Enfoques principales">
                <span>Estrategia</span>
                <span>Diseño</span>
                <span>Tecnología útil</span>
              </div>
              <div className="hero__actions">
                <a className="button" href="#plataforma">Ver plataforma</a>
                <a className="button button--ghost-light" href="#contacto">Conversemos</a>
              </div>
            </div>
            <aside className="hero__floating">
              <div>
                <span className="kicker">Qué deja Metamorfosis</span>
                <strong>Una web pública comprensible y un sistema interno utilizable.</strong>
              </div>
              <ul>
                <li><Icon name="description" /> Documentación útil</li>
                <li><Icon name="schema" /> Procesos claros</li>
                <li><Icon name="query_stats" /> Decisiones con evidencia</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="plataforma" className="site-section section-anchor">
          <div className="shell site-section__grid">
            <div>
              <SectionHeading
                kicker="Plataforma de trabajo"
                title="Una sola lógica para comprender, ordenar y proyectar proyectos con sentido."
                description="Metamorfosis no vende piezas sueltas. Conecta el problema real, la presencia pública, la operación y la información que permite sostener el crecimiento."
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
            <aside className="site-section__panel story-panel">
              <span className="kicker">Trayectoria y enfoque</span>
              <h3>Metamorfosis surge desde la operación real, no desde promesas abstractas.</h3>
              <div className="story-list">
                <div className="story-step"><b>01</b><div><strong>Experiencia aplicada</strong><p>Planificación, control, documentación, orden y mejora desde problemas concretos.</p></div></div>
                <div className="story-step"><b>02</b><div><strong>Caso demostrativo vivo</strong><p>CM permite probar, ajustar y evidenciar el método sin fingir resultados todavía no medidos.</p></div></div>
                <div className="story-step"><b>03</b><div><strong>Método propio</strong><p>Herramientas replicables para transformar intuición dispersa en decisiones visibles.</p></div></div>
              </div>
            </aside>
          </div>
        </section>

        <section id="mapa" className="site-section site-section--tint section-anchor">
          <div className="shell site-section__grid site-section__grid--mapa">
            <div className="site-section__panel map-panel">
              <SectionHeading
                kicker="Producto de entrada"
                title="Mapa de Transformación y Activos"
                description="La puerta de entrada para entender el estado actual, las dependencias del proyecto y la ruta que conviene priorizar."
              />
              <div className="map-board" role="list" aria-label="Dimensiones del mapa">
                {[
                  ['storefront', 'Proyecto e identidad'],
                  ['settings', 'Operación y roles'],
                  ['database', 'Datos y tecnología útil'],
                  ['copyright', 'Activos intangibles'],
                  ['warning', 'Riesgos y dependencias'],
                  ['route', 'Ruta priorizada']
                ].map(([icon, label]) => (
                  <div className="map-dimension" key={label} role="listitem">
                    <Icon name={icon} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="site-section__panel method-panel">
              <span className="kicker">Método visible</span>
              <h3>Cómo se mueve el proceso</h3>
              <div className="method-mini">
                {methodSteps.map(([icon, title, text], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <Icon name={icon} />
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="caso-cm" className="site-section section-anchor">
          <div className="shell site-section__grid site-section__grid--case">
            <div className="site-section__panel case-panel">
              <SectionHeading
                kicker="Caso demostrativo"
                title="CM: ordenar la operación para que el crecimiento no dependa de la memoria."
                description="La Consultoría de Consolidación CM integra documentación, control operativo, vitrina pública y sistema interno construido desde necesidades reales."
              />
              <ul className="case-points">
                <li><Icon name="check_circle" /> Procesos, hitos y documentos vinculados.</li>
                <li><Icon name="check_circle" /> Separación entre información pública y gestión privada.</li>
                <li><Icon name="check_circle" /> Uso de tecnología solo donde mejora claridad y control.</li>
              </ul>
              <figure className="case-thumb">
                <img src={caseImage} alt="Vista del sistema interno desarrollado para CM Banquetería" width="1400" height="700" loading="lazy" />
              </figure>
            </div>
            <div className="site-section__panel os-panel">
              <span className="kicker">Metamorfosis OS</span>
              <h3>La plataforma interna existe y tiene acceso real.</h3>
              <p>El panel interno no es un adorno. Ordena oportunidades, tareas, proyectos, decisiones, documentos y respaldos en una sola interfaz privada.</p>
              <div className="platform-tiles">
                <article className="platform-tile"><Icon name="today" /><strong>Panel diario</strong><p>Prioridades concretas, avances y próximos pasos.</p></article>
                <article className="platform-tile"><Icon name="request_quote" /><strong>Comercial</strong><p>Consultas recibidas desde la web y seguimiento interno.</p></article>
                <article className="platform-tile"><Icon name="folder_open" /><strong>Documentos</strong><p>Repositorio, biblioteca y respaldos del sistema.</p></article>
                <article className="platform-tile"><Icon name="account_tree" /><strong>Proyectos</strong><p>Frentes activos, límites y decisiones vigentes.</p></article>
              </div>
              <div className="os-panel__actions">
                <a className="button" href="/admin">Ingresar al panel</a>
                <a className="button button--ghost" href="#contacto">Solicitar implementación</a>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="site-section site-section--contact section-anchor">
          <div className="shell contact-layout">
            <div className="contact-intro">
              <SectionHeading
                kicker="Cotización y contacto"
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
                <a href="/admin">
                  <Icon name="dashboard" />
                  <span><small>Acceso interno</small><strong>Metamorfosis OS</strong></span>
                </a>
              </div>
            </div>
            <QuoteWizard />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div>
            <Brand />
            <p>Dar forma y proyección a proyectos con sentido, sin perder claridad operativa ni identidad.</p>
          </div>
          <div>
            <span className="footer-title">Contacto</span>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`${waBase}`}>{contact.phoneDisplay}</a>
          </div>
          <div>
            <span className="footer-title">Territorio y acceso</span>
            <p>Biobío, Chile · atención presencial y remota.</p>
            <a href="/admin">Ingresar a Metamorfosis OS</a>
          </div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Tecnología, estructura y criterio para pymes y proyectos.</span></div>
      </footer>
      <WhatsappFloating />
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  return isAdmin ? <AdminApp /> : <PublicSite />;
}

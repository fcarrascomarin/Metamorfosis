import React, { useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/jardin/hero-jardin.webp';
import gardenImage from './assets/images/jardin/jardin-terrazas.webp';
import mapImage from './assets/images/jardin/mapa-transformacion.webp';
import projectsImage from './assets/images/jardin/proyectos-vivos.webp';
import workImage from './assets/images/jardin/trabajo-metodo.webp';
import contactImage from './assets/images/jardin/contacto-jardin.webp';
import caseImage from './assets/images/caso-cm.webp';
import { contact, methodSteps } from './data.js';

const waBase = `https://wa.me/${contact.phoneDigits}`;
const defaultAdminUrl = 'https://os.metamorfosislab.cl';
const adminUrl = String(import.meta.env.VITE_ADMIN_URL || defaultAdminUrl).replace(/\/$/, '');
const apiBase = String(import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? '' : adminUrl)).replace(/\/$/, '');

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''}`} href="#inicio" aria-label="Metamorfosis Lab, ir al inicio">
      <img className="brand-logo" src="/logo-metamorfosis-transparente.png" alt="Isotipo de Metamorfosis Lab" width="44" height="44" />
      <span className="brand-copy">
        <strong>METAMORFOSIS LAB</strong>
        <small>Jardín de innovación aplicada</small>
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
    ['jardin', 'El jardín'],
    ['capacidades', 'Capacidades'],
    ['mapa', 'Método'],
    ['proyectos', 'Casos'],
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
          <a className="site-nav__os" href={adminUrl}>Acceso OS</a>
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
      const response = await fetch(`${apiBase}/api/quotes`, {
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
        <button type="button" className="text-button" onClick={() => { setStatus({ type: 'idle', message: '', waUrl: '' }); setStep(1); setForm(empty); }}>
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
              ['Operación y sistema', 'Ordenar procesos, roles, documentos, registros e indicadores.'],
              ['Mercado, marca y comercialización', 'Transformar una capacidad o producto en una propuesta comprensible y vendible.'],
              ['Ergonomía y diseño del trabajo', 'Mejorar tareas, puestos, espacios, herramientas y condiciones de trabajo.'],
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
            <label>Etapa del proyecto<select name="projectStage" value={form.projectStage} onChange={update}><option value="">Seleccionar</option><option>Idea en definición</option><option>Proyecto iniciando</option><option>Negocio funcionando</option><option>Proceso de crecimiento</option><option>Necesita reorganización</option></select></label>
            <label>Plazo esperado<input type="text" name="desiredDate" value={form.desiredDate} onChange={update} placeholder="Ej. este mes, agosto, sin urgencia" /></label>
            <label>Tamaño del equipo<input type="text" name="teamSize" value={form.teamSize} onChange={update} placeholder="Ej. 2 personas, 8 trabajadores" /></label>
            <label>Comuna o ciudad<input type="text" name="city" value={form.city} onChange={update} placeholder="Ej. Concepción" /></label>
          </div>
          <label>¿Qué está ocurriendo actualmente?<textarea name="details" value={form.details} onChange={update} rows="5" placeholder="Describe brevemente qué problema estás enfrentando, qué valor ya existe y qué quisieras ordenar o transformar." /></label>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="wizard-step">
          <legend>Datos de contacto</legend>
          <div className="form-grid form-grid--two">
            <label>Nombre y apellido<input type="text" name="contactName" value={form.contactName} onChange={update} required /></label>
            <label>Empresa o proyecto<input type="text" name="company" value={form.company} onChange={update} /></label>
            <label>Teléfono o WhatsApp<input type="tel" name="phone" value={form.phone} onChange={update} placeholder="Ej. +56 9..." required /></label>
            <label>Correo electrónico<input type="email" name="email" value={form.email} onChange={update} placeholder="Ej. contacto@proyecto.cl" /></label>
            <label>Medio preferido<select name="preferredContact" value={form.preferredContact} onChange={update}><option>WhatsApp</option><option>Correo</option><option>Llamada</option></select></label>
          </div>
          <label className="checkbox-field"><input type="checkbox" name="consent" checked={form.consent} onChange={update} /><span>Autorizo a Metamorfosis Lab a utilizar estos datos para contactarme sobre mi solicitud.</span></label>
          <label className="honeypot" aria-hidden="true">Sitio web<input type="text" name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
        </fieldset>
      )}

      <div className="wizard-actions">
        {step > 1 && <button type="button" className="button button--ghost" onClick={() => setStep((value) => value - 1)}>Atrás</button>}
        {step < 3 ? (
          <button type="button" className="button" disabled={!stepValid} onClick={() => setStep((value) => value + 1)}>Continuar <Icon name="arrow_forward" /></button>
        ) : (
          <button type="submit" className="button" disabled={!stepValid || status.type === 'loading'}>{status.type === 'loading' ? 'Preparando…' : 'Preparar solicitud'}<Icon name="send" /></button>
        )}
      </div>
    </form>
  );
}

export default function PublicApp() {
  return (
    <div className="public-site">
      <a className="skip-link" href="#contenido">Saltar al contenido principal</a>
      <PublicHeader />
      <main id="contenido">
        <section id="inicio" className="hero hero--immersive section-anchor">
          <div className="hero__backdrop" aria-hidden="true"><img src={heroImage} alt="" width="1672" height="941" fetchPriority="high" /></div>
          <div className="hero__overlay" aria-hidden="true" />
          <div className="shell hero__stage">
            <div className="hero__panel hero__panel--open">
              <span className="hero__eyebrow">Metamorfosis Lab</span>
              <h1>No dejes que lo valioso dependa de la improvisación</h1>
              <p>Comprendemos proyectos y pymes como sistemas vivos. Ordenamos su operación, diseñamos mejores condiciones de trabajo y convertimos sus capacidades en propuestas que puedan sostenerse, comunicarse y crecer.</p>
              <div className="hero__tags" aria-label="Enfoques principales"><span>Operación</span><span>Personas y espacios</span><span>Mercado y marca</span><span>Sistemas</span></div>
              <div className="hero__actions"><a className="button" href="#capacidades">Ver capacidades</a><a className="button button--ghost-light" href="#contacto">Traer un desafío</a></div>
            </div>
            <aside className="hero__floating">
              <span className="kicker">Nuestra diferencia</span>
              <strong>No entregamos piezas aisladas. Conectamos diagnóstico, diseño, ejecución, evidencia y aprendizaje para dejar capacidad instalada.</strong>
            </aside>
          </div>
        </section>

        <section id="jardin" className="story-section section-anchor" style={{ '--section-image': `url(${gardenImage})` }}>
          <div className="story-section__shade" aria-hidden="true" />
          <div className="shell story-section__content story-section__content--right">
            <div className="story-copy">
              <SectionHeading kicker="Jardín de innovación" title="Un laboratorio que cultiva condiciones, no fórmulas." description="Observamos organizaciones, ideas, recursos e historias como sistemas vivos. Cada uno posee identidad, límites, capacidades y necesidades propias." />
              <div className="principle-grid">
                <article><Icon name="visibility" /><strong>Observar antes de intervenir</strong><p>La comprensión precede a la solución.</p></article>
                <article><Icon name="eco" /><strong>Cultivar antes que sustituir</strong><p>Conservamos aquello que merece permanecer.</p></article>
                <article><Icon name="science" /><strong>Experimentar con propósito</strong><p>Cada prueba debe responder una pregunta.</p></article>
                <article><Icon name="query_stats" /><strong>Medir para aprender</strong><p>La transformación debe dejar evidencia y capacidad.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section id="capacidades" className="story-section story-section--capabilities section-anchor" style={{ '--section-image': `url(${workImage})` }}>
          <div className="story-section__shade story-section__shade--left" aria-hidden="true" />
          <div className="shell story-section__content">
            <div className="story-copy story-copy--wide">
              <SectionHeading kicker="Capacidades integradas" title="La empresa completa: cómo trabaja y cómo crea valor." description="Metamorfosis conecta dimensiones que suelen abordarse por separado. Así evitamos que una mejora comercial contradiga la operación o que una nueva tecnología reproduzca un mal proceso." />
              <div className="capability-grid">
                <article>
                  <span className="capability-icon"><Icon name="campaign" /></span>
                  <div><strong>Mercado, marca y comercialización</strong><p>Investigación, públicos, propuesta de valor, posicionamiento, oferta, precio, canales, comunicación y experiencia de compra.</p><small>Comprender antes de promocionar.</small></div>
                </article>
                <article>
                  <span className="capability-icon"><Icon name="accessibility_new" /></span>
                  <div><strong>Ergonomía y diseño sostenible del trabajo</strong><p>Tareas, posturas, cargas, repetitividad, puestos, herramientas, iluminación, ruido, organización y participación de quienes realizan el trabajo.</p><small>Rediseñar el sistema antes de responsabilizar a la persona.</small></div>
                </article>
                <article>
                  <span className="capability-icon"><Icon name="account_tree" /></span>
                  <div><strong>Operación, documentación e indicadores</strong><p>Procesos, roles, registros, hitos, evidencia, costos, tiempos y rutinas para sostener decisiones y aprender de cada proyecto.</p><small>Lo que no se registra no puede mejorarse.</small></div>
                </article>
                <article>
                  <span className="capability-icon"><Icon name="devices" /></span>
                  <div><strong>Sistemas y presencia digital</strong><p>Web pública, plataformas internas y automatizaciones diseñadas desde una necesidad operativa real, no desde la novedad tecnológica.</p><small>La tecnología entra cuando mejora una capacidad.</small></div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="mapa" className="story-section section-anchor" style={{ '--section-image': `url(${mapImage})` }}>
          <div className="story-section__shade" aria-hidden="true" />
          <div className="shell story-section__content story-section__content--right">
            <div className="story-copy">
              <SectionHeading kicker="Método Metamorfosis" title="De valor disperso a una transformación que deja capacidad." description="No vendemos diagnósticos que terminan en un informe. Conectamos realidad, operación, personas, mercado, identidad, tecnología y aprendizaje en una ruta visible." />
              <div className="method-flow">
                {methodSteps.map(([icon, title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><Icon name={icon} /><div><strong>{title}</strong><p>{text}</p></div></article>)}
              </div>
              <div className="compact-actions"><a className="button" href="#contacto">Solicitar un Mapa inicial</a><p>Primero definimos qué problema merece ser resuelto, con qué evidencia y para qué resultado.</p></div>
            </div>
          </div>
        </section>

        <section id="proyectos" className="story-section section-anchor" style={{ '--section-image': `url(${projectsImage})` }}>
          <div className="story-section__shade story-section__shade--left" aria-hidden="true" />
          <div className="shell story-section__content">
            <div className="story-copy story-copy--case">
              <SectionHeading kicker="Casos y sistemas vivos" title="El método se demuestra en trabajo real." description="Mostramos decisiones y capacidades construidas, sin atribuir resultados comerciales que todavía no han sido medidos." />
              <div className="case-grid">
                <article className="case-card case-card--featured">
                  <div className="case-card__label">Caso de marca y comercialización</div>
                  <h3>Juana de Arco</h3>
                  <p>Una colección de joyas de plata con una identidad poderosa, pero presentada como un producto genérico. Desarrollamos su posicionamiento, relato, packaging, catálogo digital y experiencia de compra.</p>
                  <div className="case-tags"><span>Estrategia de marca</span><span>Propuesta de valor</span><span>Packaging</span><span>E-commerce</span></div>
                  <blockquote>“No es solamente una joya. Es un símbolo.”</blockquote>
                </article>
                <article className="case-card">
                  <div className="case-card__label">Caso vivo de consolidación</div>
                  <h3>CM Banquetería & Restaurant</h3>
                  <p>Operación, regularización, documentación, condiciones de trabajo, web pública y sistema interno construidos desde necesidades reales.</p>
                  <img src={caseImage} alt="Vista del sistema interno de CM" loading="lazy" />
                </article>
                <article className="case-card">
                  <div className="case-card__label">Capacidad propia</div>
                  <h3>Metamorfosis OS</h3>
                  <p>Una plataforma privada para proyectos, decisiones, documentos, tiempos, costos e indicadores. El conocimiento generado no se pierde.</p>
                  <a href={adminUrl} className="text-link">Ingresar al sistema interno <Icon name="arrow_forward" /></a>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="story-section story-section--contact section-anchor" style={{ '--section-image': `url(${contactImage})` }}>
          <div className="story-section__shade" aria-hidden="true" />
          <div className="shell contact-layout contact-layout--immersive">
            <div className="contact-intro">
              <SectionHeading kicker="Conversemos" title="Cuéntanos qué valor existe y qué condiciones necesita." description="La conversación inicial busca comprender el problema, reconocer el potencial y decidir si corresponde investigar, mapear o intervenir." />
              <div className="contact-links contact-links--compact">
                <a href={`${waBase}?text=${encodeURIComponent('Hola, quisiera solicitar una conversación inicial con Metamorfosis Lab.')}`} target="_blank" rel="noreferrer"><img src="/assets/icons/whatsapp.svg" alt="" width="22" height="22" /><span><small>WhatsApp</small><strong>{contact.phoneDisplay}</strong></span></a>
                <a href={`mailto:${contact.email}`}><Icon name="mail" /><span><small>Correo</small><strong>{contact.email}</strong></span></a>
              </div>
            </div>
            <QuoteWizard />
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="shell site-footer__grid"><div><Brand compact /><p>Crear condiciones para que lo valioso pueda transformarse sin perder su identidad.</p></div><div><span className="footer-title">Contacto</span><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={waBase}>{contact.phoneDisplay}</a></div><div><span className="footer-title">Territorio y acceso</span><p>Biobío, Chile · atención presencial y remota.</p><a href={adminUrl}>Ingresar a Metamorfosis OS</a></div></div><div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Jardín de innovación aplicada.</span></div></footer>
      <WhatsappFloating />
    </div>
  );
}

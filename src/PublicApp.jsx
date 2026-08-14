import React, { useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/jardin/hero-jardin.webp';
import workImage from './assets/images/jardin/trabajo-metodo.webp';
import mapImage from './assets/images/jardin/mapa-transformacion.webp';
import projectsImage from './assets/images/jardin/proyectos-vivos.webp';
import contactImage from './assets/images/jardin/contacto-jardin.webp';
import systemImage from './assets/images/sistema-digital.webp';
import { contact } from './data.js';
import {
  activeOfferUseCases,
  impactCases,
  methodPrinciples,
  publicCases,
  publicNavigation,
  resultIndicators,
  solutions,
  transformationPillars
} from './publicContent.js';

const waBase = `https://wa.me/${contact.phoneDigits}`;
const defaultAdminUrl = '/admin';
const adminUrl = String(import.meta.env.VITE_ADMIN_URL || defaultAdminUrl).replace(/\/$/, '');

function scrollToPublicSection(id, { smooth = true, updateHash = true } = {}) {
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector('.site-header');
  const headerHeight = header?.getBoundingClientRect().height || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  if (updateHash) window.history.replaceState(null, '', `#${id}`);
  window.scrollTo({ top: Math.max(0, targetTop), behavior: smooth ? 'smooth' : 'auto' });
}

function SectionLink({ id, className = '', children }) {
  return (
    <a
      className={className}
      href={`#${id}`}
      onClick={(event) => {
        event.preventDefault();
        scrollToPublicSection(id);
      }}
    >
      {children}
    </a>
  );
}

function Brand({ compact = false }) {
  return (
    <a
      className={`brand ${compact ? 'brand--compact' : ''}`}
      href="#inicio"
      aria-label="Metamorfosis Lab, ir al inicio"
      onClick={(event) => {
        event.preventDefault();
        scrollToPublicSection('inicio');
      }}
    >
      <img className="brand-logo" src="/logo-metamorfosis-transparente.png" alt="Isotipo de Metamorfosis Lab" width="44" height="44" />
      <span className="brand-copy">
        <strong>METAMORFOSIS LAB</strong>
        <small>transformación productiva responsable</small>
      </span>
    </a>
  );
}

function IconButton({ label, icon, onClick, className = '', type = 'button', ariaExpanded, ariaControls }) {
  return (
    <button type={type} className={`icon-button ${className}`} onClick={onClick} aria-label={label} title={label} aria-expanded={ariaExpanded} aria-controls={ariaControls}>
      <Icon name={icon} />
    </button>
  );
}

function PublicHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (!id) return undefined;
    const timer = window.setTimeout(() => scrollToPublicSection(id, { smooth: false, updateHash: false }), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const goTo = (id) => {
    setOpen(false);
    scrollToPublicSection(id);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Brand />
        <nav id="site-navigation" className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          {publicNavigation.map(({ id, label }) => (
            <button type="button" key={id} onClick={() => goTo(id)}>{label}</button>
          ))}
          <a className="site-nav__os" href={adminUrl}>Acceso OS</a>
          <button className="button button--small site-nav__conversation" type="button" onClick={() => goTo('contacto')}>Conversemos</button>
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
  const message = encodeURIComponent('Hola, conocí Metamorfosis Lab a través de su página. Quiero conversar sobre Transformación Productiva Responsable para mi organización.');
  return (
    <a className="whatsapp-floating" href={`${waBase}?text=${message}`} target="_blank" rel="noreferrer" aria-label={`Conversar con Metamorfosis Lab por WhatsApp al ${contact.phoneDisplay}`}>
      <img src="/assets/icons/whatsapp.svg" alt="" width="28" height="28" />
      <span>WhatsApp</span>
    </a>
  );
}

function SectionHeading({ kicker, title, description, align = 'center' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function CaseBrand({ brand, name }) {
  if (brand === 'metamorfosis') {
    return (
      <div className="case-brand case-brand--metamorfosis" role="img" aria-label={`Logo de ${name}`}>
        <img src="/logo-metamorfosis-transparente.png" alt="" width="72" height="72" />
        <span><strong>METAMORFOSIS</strong><small>OS · sistema interno</small></span>
      </div>
    );
  }

  if (brand === 'cm') {
    return (
      <div className="case-brand case-brand--cm" role="img" aria-label={`Logo de ${name}`}>
        <img className="case-brand__logo case-brand__logo--cm" src="/assets/brand/logo-cm-banqueteria.png" alt="" width="96" height="96" />
        <span><strong>CM</strong><small>Banquetería & Restaurant</small></span>
      </div>
    );
  }

  return (
    <div className="case-brand case-brand--juana" role="img" aria-label={`Logo de ${name}`}>
      <img className="case-brand__logo case-brand__logo--juana" src="/assets/brand/logo-juana-de-arco.png" alt="" width="156" height="90" />
      <span><strong>JUANA DE ARCO</strong><small>joyas con significado</small></span>
    </div>
  );
}

function QuoteForm() {
  const empty = {
    serviceType: 'Diagnóstico integral',
    details: '',
    contactName: '',
    company: '',
    phone: '',
    consent: false
  };
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('idle');

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const isValid = form.contactName.trim() && form.company.trim() && form.details.trim() && /[0-9]{8,}/.test(form.phone.replace(/\D/g, '')) && form.consent;

  const whatsappUrl = useMemo(() => {
    const lines = [
      'Hola, quiero conversar con Metamorfosis Lab.',
      '',
      `Interés: ${form.serviceType}`,
      `Organización: ${form.company || 'No indicada'}`,
      `Necesidad: ${form.details || 'Por explicar'}`,
      `Contacto: ${form.contactName || 'No indicado'}`,
      `Teléfono: ${form.phone || 'No indicado'}`
    ];
    return `${waBase}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [form]);

  const submit = (event) => {
    event.preventDefault();
    if (!isValid) return;
    setStatus('ready');
  };

  if (status === 'ready') {
    return (
      <div className="quote-confirmation" role="status" aria-live="polite">
        <span className="confirmation-icon"><Icon name="check_circle" /></span>
        <h3>Solicitud lista</h3>
        <p>Abre WhatsApp para enviarla y coordinar una conversación inicial.</p>
        <a className="button" href={whatsappUrl} target="_blank" rel="noreferrer">
          <img src="/assets/icons/whatsapp.svg" alt="" width="20" height="20" />
          WhatsApp
        </a>
        <button type="button" className="text-button" onClick={() => { setStatus('idle'); setForm(empty); }}>
          Nueva solicitud
        </button>
      </div>
    );
  }

  return (
    <form className="quote-wizard tpr-form tpr-form--compact" onSubmit={submit} noValidate>
      <div className="form-headline">
        <span><Icon name="query_stats" /> Diagnóstico inicial</span>
        <strong>Cuéntanos lo esencial</strong>
      </div>

      <div className="form-grid form-grid--two tpr-form-grid">
        <label className="field-label"><span><Icon name="schema" /> Servicio</span>
          <select name="serviceType" value={form.serviceType} onChange={update}>
            <option>Diagnóstico integral</option>
            <option>Rediseño de procesos</option>
            <option>Sistema interno o web</option>
            <option>Sostenibilidad operativa</option>
            <option>Aún no está claro</option>
          </select>
        </label>
        <label className="field-label"><span><Icon name="briefcase" /> Organización</span>
          <input name="company" value={form.company} onChange={update} required />
        </label>
        <label className="field-label"><span><Icon name="group" /> Nombre</span>
          <input name="contactName" value={form.contactName} onChange={update} required />
        </label>
        <label className="field-label"><span><Icon name="phone" /> Teléfono</span>
          <input name="phone" inputMode="tel" value={form.phone} onChange={update} required />
        </label>
      </div>

      <label className="field-label field-label--full"><span><Icon name="edit" /> Necesidad principal</span>
        <textarea name="details" value={form.details} onChange={update} placeholder="Ej.: ordenar roles, reducir mermas, documentar procesos, mejorar coordinación o explicar mejor la oferta." required />
      </label>

      <label className="check-line tpr-check"><input type="checkbox" name="consent" checked={form.consent} onChange={update} /> <span>Acepto ser contactado para responder esta solicitud.</span></label>

      <button className="button button--full form-submit" type="submit" disabled={!isValid}>
        Enviar por WhatsApp <Icon name="send" />
      </button>
    </form>
  );
}

function PublicSite() {
  return (
    <div className="public-site public-site--tpr">
      <a className="skip-link" href="#contenido">Saltar al contenido principal</a>
      <PublicHeader />
      <main id="contenido">
        <section id="inicio" className="tpr-hero section-anchor">
          <div className="tpr-hero__image" aria-hidden="true"><img src={heroImage} alt="" fetchPriority="high" /></div>
          <div className="tpr-hero__shade" aria-hidden="true" />
          <div className="shell tpr-hero__grid">
            <div className="tpr-hero__copy">
              <span className="kicker">Transformación Productiva Responsable</span>
              <h1>Operar mejor, con sentido.</h1>
              <p>Integramos procesos, personas, tecnología y entorno para mejorar cómo tu organización opera y sostiene valor.</p>
              <div className="hero__actions">
                <SectionLink className="button" id="contacto">Evaluar mi operación</SectionLink>
                <SectionLink className="button button--ghost-light" id="transformacion">Ver enfoque</SectionLink>
              </div>
            </div>
            <aside className="tpr-hero__card">
              <strong>Claridad para decidir</strong>
              <p>Diagnóstico, rediseño y herramientas para operar mejor.</p>
              <div><span>Procesos</span><span>Personas</span><span>Recursos</span><span>Tecnología</span><span>Entorno</span></div>
            </aside>
          </div>
        </section>

        <section id="pilares" className="section section-anchor tpr-section tpr-section--intro">
          <div className="shell">
            <SectionHeading
              align="center"
              kicker="La tríada fundamental"
              title="Tres ejes para operar mejor"
              description="Operación, personas y entorno deben diseñarse como un mismo sistema."
            />
            <div className="tpr-pillar-grid">
              {transformationPillars.map((item) => (
                <article key={item.title} className="tpr-card tpr-pillar-card">
                  <span className="tpr-icon"><Icon name={item.icon} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="transformacion" className="tpr-split-section section-anchor" style={{ '--section-image': `url(${workImage})` }}>
          <div className="tpr-split-section__shade" aria-hidden="true" />
          <div className="shell tpr-split-grid">
            <div className="tpr-panel">
              <span className="kicker">Punto de entrada</span>
              <h2>Entrada concreta: la operación</h2>
              <p>Partimos por lo que hoy cuesta: producir, coordinar, documentar o vender mejor.</p>
            </div>
            <div className="tpr-panel tpr-panel--accent">
              <span className="kicker">ADN Metamorfosis</span>
              <h2>ADN: mirada sistémica</h2>
              <p>Cada cambio afecta rutinas, información, costos, experiencia e impacto. Diseñamos con el sistema completo a la vista.</p>
            </div>
          </div>
          <div className="shell tpr-usecase-grid">
            {activeOfferUseCases.map((item, index) => (
              <article key={item.title} className="tpr-usecase">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="soluciones" className="section section-anchor tpr-section">
          <div className="shell">
            <SectionHeading
              kicker="Servicios y soluciones"
              title="Servicios para convertir desorden en capacidad"
              description="Partimos con diagnóstico y avanzamos hacia implementación cuando agrega valor."
            />
            <div className="tpr-solutions-grid">
              {solutions.map((item) => (
                <article key={item.title} className="tpr-card tpr-solution-card">
                  <span className="tpr-icon"><Icon name={item.icon} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="tpr-method-section section-anchor" style={{ '--section-image': `url(${mapImage})` }}>
          <div className="tpr-method-section__shade" aria-hidden="true" />
          <div className="shell tpr-method-grid">
            <div className="tpr-panel tpr-panel--wide">
              <SectionHeading kicker="Cómo lo hacemos" title="Observar, medir, sostener" description="Cada intervención deja criterios, instrumentos y próximos pasos." />
              <div className="tpr-method-cards">
                {methodPrinciples.map((item) => (
                  <article key={item.title}>
                    <Icon name={item.icon} />
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <figure className="tpr-method-visual">
              <img src={systemImage} alt="Sistema digital de organización y datos" loading="lazy" />
              <figcaption>La tecnología entra cuando mejora una capacidad real.</figcaption>
            </figure>
          </div>
        </section>

        <section id="resultados" className="section section-anchor tpr-section tpr-section--results">
          <div className="shell">
            <SectionHeading
              align="center"
              kicker="Resultados e impacto"
              title="Resultados verificables"
              description="Usamos indicadores simples para mostrar avances reales."
            />
            <div className="tpr-indicators">
              {resultIndicators.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="tpr-impact-grid">
              {impactCases.map((item) => (
                <article key={item.title} className="tpr-impact-card">
                  <h3>{item.title}</h3>
                  <dl>
                    <div><dt>Desafío operativo</dt><dd>{item.challenge}</dd></div>
                    <div><dt>Intervención integral</dt><dd>{item.intervention}</dd></div>
                    <div><dt>Resultado medible</dt><dd>{item.result}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="casos" className="tpr-cases-section section-anchor" style={{ '--section-image': `url(${projectsImage})` }}>
          <div className="tpr-cases-section__shade" aria-hidden="true" />
          <div className="shell">
            <SectionHeading
              kicker="Prueba social y proyectos"
              title="Método aplicado en casos reales"
              description="Ordenar, comunicar, digitalizar y sostener en contextos reales."
            />
            <div className="case-grid tpr-case-grid">
              {publicCases.map((caseItem) => (
                <article key={caseItem.id} className={`case-card ${caseItem.id === 'cm-banqueteria' ? 'case-card--featured' : ''}`}>
                  <CaseBrand brand={caseItem.brand} name={caseItem.name} />
                  <div className="case-card__label">{caseItem.label}</div>
                  <h3>{caseItem.name}</h3>
                  <p>{caseItem.text}</p>
                  <div className="case-tags">{caseItem.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  {caseItem.action && <a href={adminUrl} className="text-link">{caseItem.action} <Icon name="arrow_forward" /></a>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="nosotros" className="section section-anchor tpr-manifesto">
          <div className="shell tpr-manifesto__grid">
            <div>
              <span className="kicker">Nosotros / Manifiesto</span>
              <h2>Organizaciones como sistemas vivos</h2>
            </div>
            <p>Una empresa es una red de decisiones, personas, recursos e impactos. Ayudamos a convertir lo valioso en una forma clara, ética y sostenible de operar.</p>
          </div>
        </section>

        <section id="contacto" className="story-section story-section--contact section-anchor tpr-contact" style={{ '--section-image': `url(${contactImage})` }}>
          <div className="story-section__shade" aria-hidden="true" />
          <div className="shell contact-layout contact-layout--immersive">
            <div className="contact-intro">
              <SectionHeading kicker="Conversemos" title="Evaluemos tu operación" description="Primero entendemos el problema. Luego definimos el siguiente paso útil." />
              <div className="contact-links contact-links--compact">
                <a href={`${waBase}?text=${encodeURIComponent('Hola, quisiera solicitar una conversación inicial con Metamorfosis Lab sobre Transformación Productiva Responsable.')}`} target="_blank" rel="noreferrer"><img src="/assets/icons/whatsapp.svg" alt="" width="22" height="22" /><span><small>WhatsApp</small><strong>{contact.phoneDisplay}</strong></span></a>
                <a href={`mailto:${contact.email}`}><Icon name="mail" /><span><small>Correo</small><strong>{contact.email}</strong></span></a>
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div className="site-footer__brand"><Brand /><p>Consultoría para operar mejor, cuidar equipos y sostener valor con responsabilidad.</p></div>
          <div><span className="footer-title">Navegación</span><SectionLink id="pilares">Tres ejes</SectionLink><SectionLink id="soluciones">Soluciones</SectionLink><SectionLink id="resultados">Resultados</SectionLink><SectionLink id="contacto">Contacto</SectionLink></div>
          <div><span className="footer-title">Contacto</span><a className="footer-icon-link" href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span></a><a className="footer-icon-link" href={waBase} target="_blank" rel="noreferrer"><img src="/assets/icons/whatsapp.svg" alt="" width="18" height="18" /><span>{contact.phoneDisplay}</span></a><p>{contact.coverage}</p></div>
          <div><span className="footer-title">Acceso interno</span><p>El seguimiento de prioridades, documentos y decisiones vive en Metamorfosis OS.</p><a href={adminUrl}>Ingresar a Metamorfosis OS</a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Transformación productiva responsable</span></div>
      </footer>
      <WhatsappFloating />
    </div>
  );
}

export default PublicSite;

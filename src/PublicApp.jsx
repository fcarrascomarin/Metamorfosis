import React, { useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import heroImage from './assets/images/jardin/hero-jardin.webp';
import workImage from './assets/images/jardin/trabajo-metodo.webp';
import mapImage from './assets/images/jardin/mapa-transformacion.webp';
import projectsImage from './assets/images/jardin/proyectos-vivos.webp';
import contactImage from './assets/images/jardin/contacto-jardin.webp';
import systemImage from './assets/images/sistema-digital.webp';
import caseCmImage from './assets/images/caso-cm.webp';
import { contact } from './data.js';
import {
  activeOfferUseCases,
  impactCases,
  methodPrinciples,
  processRoadmap,
  publicCases,
  publicNavigation,
  resultIndicators,
  solutions,
  stackBadges,
  transformationPillars
} from './publicContent.js';

const waBase = `https://wa.me/${contact.phoneDigits}`;
const defaultAdminUrl = '/admin';
const adminUrl = String(import.meta.env.VITE_ADMIN_URL || defaultAdminUrl).replace(/\/$/, '');
const apiBase = String(import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const PUBLIC_QUOTES_KEY = 'metamorfosis-public-quotes';

function scrollToPublicSection(id, { smooth = true, updateHash = true } = {}) {
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector('.site-header');
  const headerHeight = header?.getBoundingClientRect().height || 0;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
  if (updateHash) window.history.replaceState(null, '', `#${id}`);
  window.scrollTo({ top: Math.max(0, targetTop), behavior: smooth ? 'smooth' : 'auto' });
}

function SectionLink({ id, className = '', children, onClick }) {
  return (
    <a
      className={className}
      href={`#${id}`}
      onClick={(event) => {
        event.preventDefault();
        scrollToPublicSection(id);
        onClick?.();
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

  useEffect(() => {
    const close = (event) => {
      if (!event.target.closest('.site-nav')) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const goTo = (id) => {
    setOpen(false);
    scrollToPublicSection(id);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Brand />
        <nav id="site-navigation" className={`site-nav site-nav--menu ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          <div className={`site-nav__menu ${open ? 'is-open' : ''}`}>
            <button
              type="button"
              className="site-nav__menu-trigger"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu-panel"
            >
              <Icon name={open ? 'close' : 'menu'} />
              <span>Menú</span>
            </button>
            <div id="site-menu-panel" className="site-nav__dropdown" role="menu">
              {publicNavigation.map(({ id, label, helper, icon }) => (
                <button type="button" key={id} onClick={() => goTo(id)} role="menuitem">
                  <Icon name={icon || 'arrow_forward'} />
                  <span><strong>{label}</strong>{helper && <small>{helper}</small>}</span>
                </button>
              ))}
            </div>
          </div>
          <a className="site-nav__os" href={adminUrl} aria-label="Ingresar al panel interno Metamorfosis OS"><Icon name="lock" /><span>OS</span></a>
          <button className="button button--small site-nav__conversation" type="button" onClick={() => goTo('contacto')}><Icon name="mail" />Conversemos</button>
        </nav>
        <IconButton
          className="menu-button"
          label={open ? 'Cerrar menú' : 'Abrir menú'}
          icon={open ? 'close' : 'menu'}
          onClick={() => setOpen((value) => !value)}
          ariaExpanded={open}
          ariaControls="site-menu-panel"
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

function getMailtoUrl(form) {
  const subject = `Solicitud formal Metamorfosis Lab · ${form.company || form.contactName || 'Nueva organización'}`;
  const body = [
    'Hola Metamorfosis Lab,',
    '',
    'Quiero solicitar una evaluación inicial por correo.',
    '',
    `Entrada de interés: ${form.serviceType}`,
    `Organización: ${form.company || 'No indicada'}`,
    `Nombre: ${form.contactName || 'No indicado'}`,
    `Correo de respuesta: ${form.email || 'No indicado'}`,
    `Teléfono: ${form.phone || 'No indicado'}`,
    '',
    'Necesidad principal:',
    form.details || 'No indicada',
    '',
    'Gracias.'
  ];
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join('\n'))}`;
}

function saveQuoteLocally(form) {
  const quote = {
    id: `web-${Date.now()}`,
    created_at: new Date().toISOString(),
    contact_name: form.contactName.trim(),
    company: form.company.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    service_type: form.serviceType,
    details: form.details.trim(),
    city: '',
    status: 'nueva',
    source: 'web-publica',
    channel: 'correo'
  };
  try {
    const current = JSON.parse(window.localStorage.getItem(PUBLIC_QUOTES_KEY) || '[]');
    const next = [quote, ...(Array.isArray(current) ? current : [])].slice(0, 200);
    window.localStorage.setItem(PUBLIC_QUOTES_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent('storage', { key: PUBLIC_QUOTES_KEY, newValue: JSON.stringify(next) }));
  } catch {
    // La solicitud igualmente seguirá hacia el correo formal.
  }
  return quote;
}

function sendQuoteToApi(form) {
  const endpoint = `${apiBase}/api/quotes`;
  const payload = {
    serviceType: form.serviceType,
    details: form.details.trim(),
    contactName: form.contactName.trim(),
    company: form.company.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    preferredContact: 'Correo',
    consent: form.consent,
    website: ''
  };
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
      return;
    }
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch {
    // El correo formal y el registro local siguen disponibles aunque la API no responda.
  }
}

function QuoteForm() {
  const empty = {
    serviceType: 'Diagnóstico productivo responsable',
    details: '',
    contactName: '',
    company: '',
    email: '',
    phone: '',
    consent: false
  };
  const [form, setForm] = useState(empty);
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setSent(false);
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const cleanPhone = form.phone.replace(/\D/g, '');
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const stepOneReady = Boolean(form.serviceType && form.details.trim().length >= 10);
  const stepTwoReady = Boolean(form.company.trim() && form.contactName.trim());
  const isValid = stepOneReady && stepTwoReady && emailValid && (!form.phone.trim() || cleanPhone.length >= 8) && form.consent;
  const emailUrl = useMemo(() => getMailtoUrl(form), [form]);

  const prepareFormalContact = () => {
    if (!isValid) return;
    saveQuoteLocally(form);
    sendQuoteToApi(form);
    setSent(true);
  };

  return (
    <form className="quote-wizard tpr-form tpr-form--steps" onSubmit={(event) => event.preventDefault()} noValidate>
      <div className="form-headline form-headline--steps">
        <span><Icon name="mail" /> Canal formal</span>
        <strong>Solicitud por correo</strong>
        <small>Queda registrada para seguimiento interno y abre un mensaje dirigido a contacto@metamorfosislab.cl.</small>
      </div>

      <div className="quote-steps" aria-label="Pasos del diagnóstico">
        {[1, 2, 3].map((item) => <button type="button" key={item} className={step === item ? 'is-active' : ''} onClick={() => setStep(item)}>{item}</button>)}
      </div>

      {step === 1 && (
        <div className="quote-step-panel">
          <span className="quote-step-title"><Icon name="target" /> Elige una entrada</span>
          <div className="choice-grid choice-grid--compact">
            {['Diagnóstico productivo responsable', 'Vitrina Pyme', 'Ciclo Seguro', 'Sistema interno mínimo'].map((option) => (
              <button type="button" key={option} className={form.serviceType === option ? 'is-selected' : ''} onClick={() => setForm((current) => ({ ...current, serviceType: option }))}>{option}</button>
            ))}
          </div>
          <label className="field-label field-label--full"><span><Icon name="edit" /> Qué necesitas resolver</span>
            <textarea name="details" value={form.details} onChange={update} placeholder="Ej.: ordenar roles, reducir pérdidas, explicar mejor la oferta o controlar el ciclo de vestuario laboral." required />
          </label>
          <button type="button" className="button button--full" disabled={!stepOneReady} onClick={() => setStep(2)}>Continuar <Icon name="arrow_forward" /></button>
        </div>
      )}

      {step === 2 && (
        <div className="quote-step-panel">
          <span className="quote-step-title"><Icon name="briefcase" /> Identificación</span>
          <div className="form-grid form-grid--two tpr-form-grid">
            <label className="field-label"><span><Icon name="briefcase" /> Organización</span>
              <input name="company" value={form.company} onChange={update} placeholder="Nombre de la empresa" required />
            </label>
            <label className="field-label"><span><Icon name="group" /> Contacto</span>
              <input name="contactName" value={form.contactName} onChange={update} placeholder="Tu nombre" required />
            </label>
          </div>
          <div className="quote-step-actions">
            <button type="button" className="button button--ghost-light" onClick={() => setStep(1)}><Icon name="arrow_back" /> Volver</button>
            <button type="button" className="button" disabled={!stepTwoReady} onClick={() => setStep(3)}>Continuar <Icon name="arrow_forward" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="quote-step-panel">
          <span className="quote-step-title"><Icon name="mail" /> Canal de respuesta</span>
          <div className="form-grid form-grid--two tpr-form-grid">
            <label className="field-label"><span><Icon name="mail" /> Correo</span>
              <input name="email" type="email" inputMode="email" value={form.email} onChange={update} placeholder="correo@empresa.cl" required />
            </label>
            <label className="field-label"><span><Icon name="phone" /> Teléfono opcional</span>
              <input name="phone" inputMode="tel" value={form.phone} onChange={update} placeholder="+56 9..." />
            </label>
          </div>
          <label className="check-line tpr-check"><input type="checkbox" name="consent" checked={form.consent} onChange={update} /> <span>Acepto ser contactado por Metamorfosis Lab para responder esta solicitud.</span></label>
          <div className="quote-step-actions">
            <button type="button" className="button button--ghost-light" onClick={() => setStep(2)}><Icon name="arrow_back" /> Volver</button>
            {isValid ? (
              <a className="button form-submit" href={emailUrl} onClick={prepareFormalContact}><Icon name="mail" /> Enviar correo formal</a>
            ) : (
              <button className="button form-submit" type="button" disabled><Icon name="mail" /> Completa los datos</button>
            )}
          </div>
          {sent && <p className="form-helper"><Icon name="check_circle" /> Solicitud registrada para seguimiento. Revisa el correo abierto y presiona enviar.</p>}
        </div>
      )}
    </form>
  );
}

function ImpactShowcase() {
  const [featured, ...secondary] = impactCases;
  return (
    <div className="impact-storyboard">
      <article className="impact-hero-card">
        <div className="impact-hero-card__visual">
          <img src={caseCmImage} alt="Caso CM Banquetería: operación, web y sistema interno" loading="lazy" />
          <span><Icon name="verified_user" /> Caso aplicado</span>
        </div>
        <div className="impact-hero-card__content">
          <span className="kicker">Del diagnóstico al sistema</span>
          <h3>{featured.title}</h3>
          <p>{featured.lead}</p>
          <div className="impact-flow" aria-label="Secuencia de resultado">
            <div><Icon name="warning" /><strong>Desafío</strong><span>{featured.challenge}</span></div>
            <div><Icon name="schema" /><strong>Solución</strong><span>{featured.intervention}</span></div>
            <div><Icon name="check_circle" /><strong>Resultado</strong><span>{featured.result}</span></div>
          </div>
        </div>
      </article>
      <div className="impact-proof-grid">
        <article className="impact-proof-card impact-proof-card--metrics">
          <span className="tpr-icon"><Icon name="query_stats" /></span>
          <h3>Lo que se mide se puede sostener</h3>
          <div className="tpr-indicators tpr-indicators--compact">
            {resultIndicators.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>
        {secondary.map((item) => (
          <article key={item.title} className="impact-proof-card">
            <span className="tpr-icon"><Icon name={item.icon} /></span>
            <h3>{item.title}</h3>
            <p>{item.lead}</p>
            <strong>{item.result}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

function PortfolioShowcase() {
  const visuals = {
    'cm-banqueteria': caseCmImage,
    'metamorfosis-os': systemImage,
    'juana-de-arco': projectsImage
  };
  return (
    <div className="portfolio-showcase">
      {publicCases.map((caseItem, index) => (
        <article key={caseItem.id} className={`portfolio-card portfolio-card--${index === 0 ? 'large' : 'compact'}`}>
          <figure className="device-mockup">
            <div className="device-mockup__bar"><span /><span /><span /></div>
            <img src={visuals[caseItem.id] || projectsImage} alt={`Vista del proyecto ${caseItem.name}`} loading="lazy" />
            <figcaption>{caseItem.hover}</figcaption>
          </figure>
          <div className="portfolio-card__body">
            <CaseBrand brand={caseItem.brand} name={caseItem.name} />
            <span className="case-card__label">{caseItem.label}</span>
            <h3>{caseItem.name}</h3>
            <p>{caseItem.text}</p>
            <div className="case-tags">{caseItem.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            {caseItem.live && <a className="text-link" href={caseItem.live} target="_blank" rel="noreferrer">Ver proyecto <Icon name="open_in_new" /></a>}
          </div>
        </article>
      ))}
    </div>
  );
}

function PublicSite() {
  const handleHeroMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <div className="public-site public-site--tpr public-site--lab">
      <a className="skip-link" href="#contenido">Saltar al contenido principal</a>
      <PublicHeader />
      <main id="contenido">
        <section id="inicio" className="tpr-hero section-anchor" onPointerMove={handleHeroMove}>
          <div className="tpr-hero__image" aria-hidden="true"><img src={heroImage} alt="" fetchPriority="high" /></div>
          <div className="tpr-hero__shade" aria-hidden="true" />
          <div className="lab-cursor-field" aria-hidden="true" />
          <div className="lab-orbit lab-orbit--one" aria-hidden="true" />
          <div className="lab-orbit lab-orbit--two" aria-hidden="true" />
          <div className="shell tpr-hero__grid">
            <div className="tpr-hero__copy">
              <span className="kicker">Transformación Productiva Responsable</span>
              <h1>Transformar la operación sin perder lo valioso.</h1>
              <p>Diagnosticamos procesos, personas, recursos y entorno para convertir desorden en decisiones, herramientas y resultados medibles.</p>
              <div className="hero__actions">
                <SectionLink className="button" id="contacto">Evaluar mi operación</SectionLink>
                <SectionLink className="button button--ghost-light" id="metodo">Ver método</SectionLink>
              </div>
            </div>
            <aside className="tpr-hero__card lab-pulse-card">
              <strong>Primera conversación útil</strong>
              <p>Problema claro, ruta priorizada y siguiente paso concreto.</p>
              <div><span>Procesos</span><span>Personas</span><span>Recursos</span><span>Tecnología</span><span>Entorno</span></div>
            </aside>
          </div>
        </section>

        <section id="pilares" className="section section-anchor tpr-section tpr-section--intro">
          <div className="shell">
            <SectionHeading
              kicker="La tríada fundamental"
              title="Una empresa no mejora por partes aisladas"
              description="La eficiencia, las condiciones humanas y la responsabilidad con el entorno deben avanzar juntas."
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
              <span className="kicker">Campo inicial</span>
              <h2>Partimos donde el problema ya duele</h2>
              <p>Operación, presencia digital, sistema interno o ciclo de vestuario laboral.</p>
            </div>
            <div className="tpr-panel tpr-panel--accent">
              <span className="kicker">Visión completa</span>
              <h2>Luego conectamos el sistema</h2>
              <p>Procesos, personas, recursos, tecnología y entorno quedan integrados en una ruta viable.</p>
            </div>
          </div>
          <div className="shell tpr-usecase-grid">
            {activeOfferUseCases.map((item, index) => (
              <article key={item.title} className="tpr-usecase">
                <span><Icon name={item.icon || 'arrow_forward'} />{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="soluciones" className="section section-anchor tpr-section tpr-section--bento">
          <div className="shell">
            <SectionHeading
              kicker="Servicios y soluciones"
              title="Soluciones para ordenar, operar y crecer"
              description="Cada servicio debe dejar una capacidad instalada, no solo una recomendación."
            />
            <div className="tpr-bento-grid">
              {solutions.map((item, index) => (
                <article key={item.title} className={`tpr-card tpr-solution-card tpr-bento-card tpr-bento-card--${index}`}>
                  <span className="tpr-icon"><Icon name={item.icon} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
              <article className="tpr-card tpr-stack-card">
                <span className="tpr-icon"><Icon name="database" /></span>
                <h3>Stack responsable</h3>
                <p>Herramientas modernas solo cuando hacen más clara, medible o sostenible la operación.</p>
                <div className="stack-badges">{stackBadges.map((badge) => <span key={badge}>{badge}</span>)}</div>
              </article>
            </div>
          </div>
        </section>

        <section id="metodo" className="tpr-method-section section-anchor" style={{ '--section-image': `url(${mapImage})` }}>
          <div className="tpr-method-section__shade" aria-hidden="true" />
          <div className="shell tpr-method-grid">
            <div className="tpr-panel tpr-panel--wide">
              <SectionHeading kicker="Cómo trabajamos" title="Un proceso simple, serio y trazable" description="Primero entendemos. Luego diseñamos, probamos y dejamos continuidad." />
              <div className="tpr-roadmap">
                {processRoadmap.map((item, index) => (
                  <article key={item.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <Icon name={item.icon} />
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
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
              kicker="Resultados e impacto"
              title="Resultados que se entienden"
              description="Menos promesas abstractas. Más evidencia, aprendizaje y continuidad."
            />
            <ImpactShowcase />
          </div>
        </section>

        <section id="casos" className="tpr-cases-section section-anchor" style={{ '--section-image': `url(${projectsImage})` }}>
          <div className="tpr-cases-section__shade" aria-hidden="true" />
          <div className="shell">
            <SectionHeading
              kicker="Portafolio dinámico"
              title="Casos que muestran cómo trabajamos"
              description="Diseño, tecnología y documentación al servicio de una operación real."
            />
            <PortfolioShowcase />
          </div>
        </section>

        <section id="nosotros" className="section section-anchor tpr-manifesto">
          <div className="shell tpr-manifesto__grid">
            <div>
              <span className="kicker">Sobre el Lab</span>
              <h2>Oficio digital con criterio responsable</h2>
            </div>
            <p>Metamorfosis Lab trabaja con organizaciones que necesitan mejorar sin simplificar la realidad. Ordenamos procesos, cuidamos capacidades humanas e incorporamos responsabilidad con los sistemas vivos que hacen posible el valor.</p>
          </div>
        </section>

        <section id="contacto" className="story-section story-section--contact section-anchor tpr-contact" style={{ '--section-image': `url(${contactImage})` }}>
          <div className="story-section__shade" aria-hidden="true" />
          <div className="shell contact-layout contact-layout--immersive">
            <div className="contact-intro">
              <SectionHeading kicker="Canal formal" title="Abramos una conversación seria" description="Cuéntanos el problema. Te responderemos por correo con una forma concreta de abordarlo." />
              <div className="contact-links contact-links--compact contact-links--email-only">
                <a href={`mailto:${contact.email}`}><Icon name="mail" /><span><small>Correo formal</small><strong>{contact.email}</strong></span></a>
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
          <div><span className="footer-title">Contacto</span><a className="footer-icon-link" href={`mailto:${contact.email}`}><Icon name="mail" /><span>{contact.email}</span></a><p>{contact.coverage}</p></div>
          <div><span className="footer-title">Acceso interno</span><p>Prioridades, solicitudes, documentos y decisiones viven en Metamorfosis OS.</p><a href={adminUrl}>Ingresar a Metamorfosis OS</a></div>
        </div>
        <div className="shell site-footer__bottom"><span>© {new Date().getFullYear()} Metamorfosis Lab</span><span>Transformación productiva responsable</span></div>
      </footer>
      <WhatsappFloating />
    </div>
  );
}

export default PublicSite;
